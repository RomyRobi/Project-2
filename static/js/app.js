function statAverage(data, category){
  total = 0;
  currlen = 0;
  data.forEach(entry => {
    if (entry[category] != ''){
      total += parseInt(entry[category]);
      currlen += 1;
    }
  });
  return +((total/currlen).toFixed(2));
}

var boroughs = [
  'Bronx',
  'Brooklyn',
  'Manhattan',
  'Queens',
  'Staten Island',
]

var yearsStr = [
  '2014',
  '2015',
  '2016',
  '2017',
  '2018'
]

// Set up polar chart
var polarctx = document.getElementById('polar-chart-area');
var chartColors = window.chartColors;
var color = Chart.helpers.color;
var backgroundColors = [
  color(chartColors.red).alpha(0.5).rgbString(),
  color(chartColors.orange).alpha(0.5).rgbString(),
  color(chartColors.yellow).alpha(0.5).rgbString(),
  color(chartColors.green).alpha(0.5).rgbString(),
  color(chartColors.blue).alpha(0.5).rgbString(),
];
var polarChartOptions = {
  responsive: true,
  legend: {
    position: 'right',
  },
  title: {
    display: true,
    text: 'Loading...',
    fontSize: 20,
    fontColor: 'rgba(255,90,96,1)'
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
  },
  layout:{
    padding: 8
  }
};

var polarConfig = {
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
  options: polarChartOptions
};

var polarChart = new Chart(polarctx, polarConfig);


// Initialize linechart pre-load
var lineChartData = {
      labels: yearsStr,
      datasets: [{
        label: 'Number of Listings',
        borderColor: 'rgba(255,90,96,1)',
        backgroundColor: 'rgba(255,90,96,1)',
        fill: false,
        data: [100, 75, 50, 25, 0],
        yAxisID: 'y-axis-1',
      }, {
        label: 'Average Price',
        borderColor: 'rgba(202,202,202,1)',
        backgroundColor: 'rgba(202,202,202,1)',
        fill: false,
        data: [0, 25, 50, 75, 100],
        yAxisID: 'y-axis-2'
      }]
    };


    var linectx = document.getElementById('line-chart-area').getContext('2d');
    lineConfig = {
      type: 'line',
      data: lineChartData,
      options: {
        responsive: true,
        hoverMode: 'index',
        stacked: false,
        title: {
          display: true,
          text: 'Loading...',
          fontSize: 20,
          fontColor: 'rgba(255,90,96,1)'
        },
        scales: {
          yAxes: [{
            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            display: true,
            position: 'left',
            id: 'y-axis-1',
            scaleLabel:{
              display: true,
              labelString: '# of Listings'
            }
          }, {
            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            display: true,
            position: 'right',
            id: 'y-axis-2',
            scaleLabel:{
              display: true,
              labelString: 'Average Price'
            },

            // grid line settings
            gridLines: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          }],
        }
      }
    };

    var lineChart = new Chart(linectx, lineConfig);


// const csv = "static/listings.csv"
var url = '/listings_data';
var histcsv = '/static/all_historical_data.csv'

console.log('Starting to read JSON');

Promise.all([
  d3.json(url),
  d3.csv(histcsv)
]).then(function(listingsJSON) {
  var listingsData = [];

  // Store relevant data for polar chart
  Object.keys(listingsJSON[0]).forEach(function(data) {
    var currData ={};
    currData.neighbourhood_group_cleansed = listingsJSON[0][data].neighbourhood_group_cleansed;
    currData.accommodates = listingsJSON[0][data].accommodates;
    currData.price = listingsJSON[0][data].price;
    currData.minimum_nights = listingsJSON[0][data].minimum_nights;
    currData.review_scores_rating = listingsJSON[0][data].review_scores_rating;
    currData.review_scores_location = listingsJSON[0][data].review_scores_location;
    listingsData.push(currData);
  });

  // Remove "Loading..." from polar chart
  polarConfig.options.title.text = 'Choose a Category to View';
  polarChart.update();

  // Event Listener for "Listings"
  document.getElementById('listingsCount').addEventListener('click', function() {
    listingsCounts = [];
    boroughs.forEach(borough => {
      boroughData = listingsData.filter(listing => listing.neighbourhood_group_cleansed == borough);
      boroughCount = boroughData.length;
      listingsCounts.push(boroughCount);
    });
    polarConfig.data.datasets[0].data = listingsCounts;
    polarConfig.options.title.text = 'Number of Listings by Borough'
    polarChart.update();
  });

  // Event Listener for "Prices"
  document.getElementById('avgPrice').addEventListener('click', function() {
    listingsAvg = [];
    boroughs.forEach(borough => {
      boroughData = listingsData.filter(listing => listing.neighbourhood_group_cleansed == borough);
      boroughAvg = statAverage(boroughData, 'price');
      listingsAvg.push(boroughAvg);
    });
    polarConfig.data.datasets[0].data = listingsAvg;
    polarConfig.options.title.text = 'Avg Listing Price ($) by Borough'
    polarChart.update();
  });

  // Event Listener for "Review Scores"
  document.getElementById('avgScore').addEventListener('click', function() {
    listingsAvg = [];
    boroughs.forEach(borough => {
      boroughData = listingsData.filter(listing => listing.neighbourhood_group_cleansed == borough);
      boroughAvg = statAverage(boroughData, 'review_scores_rating');
      listingsAvg.push(boroughAvg);
    });
    polarConfig.data.datasets[0].data = listingsAvg;
    polarConfig.options.title.text = 'Avg Review Score by Borough'
    polarChart.update();
  });

  // Event Listener for "Location Scores"
  document.getElementById('avgLocScore').addEventListener('click', function() {
    listingsAvg = [];
    boroughs.forEach(borough => {
      boroughData = listingsData.filter(listing => listing.neighbourhood_group_cleansed == borough);
      boroughAvg = statAverage(boroughData, 'review_scores_location');
      listingsAvg.push(boroughAvg);
    });
    polarConfig.data.datasets[0].data = listingsAvg;
    polarConfig.options.title.text = 'Avg Location Score by Borough'
    polarChart.update();
  });

  // Event Listener for "Guests Accommodated"
  document.getElementById('avgAccomodations').addEventListener('click', function() {
    listingsAvg = [];
    boroughs.forEach(borough => {
      boroughData = listingsData.filter(listing => listing.neighbourhood_group_cleansed == borough);
      boroughAvg = statAverage(boroughData, 'accommodates');
      listingsAvg.push(boroughAvg);
    });
    polarConfig.data.datasets[0].data = listingsAvg;
    polarConfig.options.title.text = 'Avg Guests Accommodated by Borough'
    polarChart.update();
  });

  // Event Listener for "Minimum Nights"
  document.getElementById('avgMinNights').addEventListener('click', function() {
    listingsAvg = [];
    boroughs.forEach(borough => {
      boroughData = listingsData.filter(listing => listing.neighbourhood_group_cleansed == borough);
      boroughAvg = statAverage(boroughData, 'minimum_nights');
      listingsAvg.push(boroughAvg);
    });
    polarConfig.data.datasets[0].data = listingsAvg;
    polarConfig.options.title.text = 'Avg Minimum Stay by Borough'
    polarChart.update();
  });

  // Store data for line chart
  var histCount = [];
  var histPrice = [];

  yearsStr.forEach(year => {
    yearData = listingsJSON[1].filter(listing => listing.Date == year);
    histCount.push(yearData.length);
    yearPrice = statAverage(yearData, 'Price');
    histPrice.push(yearPrice);
  });


    lineChartData.datasets[0].data = histCount;
    lineChartData.datasets[1].data = histPrice;
    lineConfig.options.title.text = 'Overall Trends';
    lineConfig.data = lineChartData;
    lineChart.update();


});
