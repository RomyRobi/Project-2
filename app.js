function statAverage(data, category){
  total = 0;
  data.forEach(entry => {
    total += entry[category];
  });
  return total/data.length;
}

var boroughs = [
  'Bronx',
  'Brooklyn',
  'Manhattan',
  'Queens',
  'Staten Island',
]


// Set up chart
var ctx = document.getElementById('polar-chart-area');
var chartColors = window.chartColors;
var color = Chart.helpers.color;
var backgroundColors = [
  color(chartColors.red).alpha(0.5).rgbString(),
  color(chartColors.orange).alpha(0.5).rgbString(),
  color(chartColors.yellow).alpha(0.5).rgbString(),
  color(chartColors.green).alpha(0.5).rgbString(),
  color(chartColors.blue).alpha(0.5).rgbString(),
];
var chartOptions = {
  responsive: true,
  legend: {
    position: 'right',
  },
  title: {
    display: true,
    text: 'Choose a Category to View'
  },
  scale: {
    ticks: {
      beginAtZero: true
    },
    reverse: false
  },
  animation: {
    animateRotate: false,
    animateScale: true
  }
};

var config = {
  type: 'polarArea',
  data: {
    datasets: [{
      data: [
        1,
        2,
        3,
        4,
        5,
      ],
      backgroundColor: backgroundColors,
      label: 'My dataset' // for legend
    }],
    labels: boroughs
  },
  options: chartOptions
};

var myChart = new Chart(ctx, config);


const csv = "listings.csv"

d3.csv(csv, function(listingsData) {

  // Code for abridging data. Only NAN returned for unknown reason
  // var polarData = [];
  // var currData ={};
  //
  // listingsData.forEach(function(data) {
  //   currData.neighbourhood_group_cleansed = data.neighbourhood_group_cleansed;
  //   currData.accommodates = +data.accommodates;
  //   currData.price = parseFloat(data.price.replace(/[^0-9-.]/g, ''));
  //   currData.minimum_nights = +data.minimum_nights;
  //   currData.review_scores_rating = +data.review_scores_rating;
  //   currData.review_scores_location = +data.review_scores_location;
  //   console.log(currData);
  //   polarData.push(currData);
  //   console.log(polarData[polarData.length -1])
  // });
  //
  // console.log(polarData);

  // parse data
  listingsData.forEach(function(data) {
    data.neighbourhood_group_cleansed = data.neighbourhood_group_cleansed;
    data.accommodates = +data.accommodates;
    data.price = parseFloat(data.price.replace(/[^0-9-.]/g, ''));
    data.minimum_nights = +data.minimum_nights;
    data.review_scores_rating = +data.review_scores_rating;
    data.review_scores_location = +data.review_scores_location;
  });

  console.log(listingsData);

  // Event Listener for "Listings"
  document.getElementById('listingsCount').addEventListener('click', function() {
    listingsCounts = [];
    boroughs.forEach(borough => {
      boroughData = listingsData.filter(listing => listing.neighbourhood_group_cleansed == borough);
      boroughCount = boroughData.length;
      listingsCounts.push(boroughCount);
    });
    config.data.datasets[0].data = listingsCounts;
    config.options.title.text = 'Number of Listings by Borough'
    myChart.update();
  });

  // Event Listener for "Prices"
  document.getElementById('avgPrice').addEventListener('click', function() {
    listingsAvg = [];
    boroughs.forEach(borough => {
      boroughData = listingsData.filter(listing => listing.neighbourhood_group_cleansed == borough);
      boroughAvg = statAverage(boroughData, 'price');
      listingsAvg.push(boroughAvg);
    });
    config.data.datasets[0].data = listingsAvg;
    config.options.title.text = 'Avg Listing Price ($) by Borough'
    myChart.update();
  });

  // Event Listener for "Review Scores"
  document.getElementById('avgScore').addEventListener('click', function() {
    listingsAvg = [];
    boroughs.forEach(borough => {
      boroughData = listingsData.filter(listing => listing.neighbourhood_group_cleansed == borough);
      boroughAvg = statAverage(boroughData, 'review_scores_rating');
      listingsAvg.push(boroughAvg);
    });
    config.data.datasets[0].data = listingsAvg;
    config.options.title.text = 'Avg Review Score by Borough'
    myChart.update();
  });

  // Event Listener for "Location Scores"
  document.getElementById('avgLocScore').addEventListener('click', function() {
    listingsAvg = [];
    boroughs.forEach(borough => {
      boroughData = listingsData.filter(listing => listing.neighbourhood_group_cleansed == borough);
      boroughAvg = statAverage(boroughData, 'review_scores_location');
      listingsAvg.push(boroughAvg);
    });
    config.data.datasets[0].data = listingsAvg;
    config.options.title.text = 'Avg Location Score by Borough'
    myChart.update();
  });

  // Event Listener for "Guests Accommodated"
  document.getElementById('avgAccomodations').addEventListener('click', function() {
    listingsAvg = [];
    boroughs.forEach(borough => {
      boroughData = listingsData.filter(listing => listing.neighbourhood_group_cleansed == borough);
      boroughAvg = statAverage(boroughData, 'accommodates');
      listingsAvg.push(boroughAvg);
    });
    config.data.datasets[0].data = listingsAvg;
    config.options.title.text = 'Avg Guests Accommodated by Borough'
    myChart.update();
  });

  // Event Listener for "Minimum Nights"
  document.getElementById('avgMinNights').addEventListener('click', function() {
    listingsAvg = [];
    boroughs.forEach(borough => {
      boroughData = listingsData.filter(listing => listing.neighbourhood_group_cleansed == borough);
      boroughAvg = statAverage(boroughData, 'minimum_nights');
      listingsAvg.push(boroughAvg);
    });
    config.data.datasets[0].data = listingsAvg;
    config.options.title.text = 'Avg Minimum Stay by Borough'
    myChart.update();
  });

});
