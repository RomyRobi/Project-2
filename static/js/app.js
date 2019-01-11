function statAverage(data, category){
  total = 0;
  currlen = 0;
  data.forEach(entry => {
    if (entry[category] != ''){
      total += parseInt(entry[category]);
      currlen += 1;
    }
  });
  return total/currlen;
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
    text: 'Choose a Category to View',
    fontSize: 20
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


// const csv = "static/listings.csv"
var url = '/listings_data';
d3.json(url).then(function(listingsJSON) {
  // console.log(listingsJSON);
  //// Code for abridging data. Only NAN returned for unknown reason
  var listingsData = [];

  Object.keys(listingsJSON).forEach(function(data) {
    var currData ={};
    currData.neighbourhood_group_cleansed = listingsJSON[data].neighbourhood_group_cleansed;
    currData.accommodates = listingsJSON[data].accommodates;
    currData.price = listingsJSON[data].price;
    currData.minimum_nights = listingsJSON[data].minimum_nights;
    currData.review_scores_rating = listingsJSON[data].review_scores_rating;
    currData.review_scores_location = listingsJSON[data].review_scores_location;
    listingsData.push(currData);
  });

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
