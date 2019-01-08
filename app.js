// var randomScalingFactor = function() {
//   return Math.round(Math.random() * 100);
// };
var chosenVar = 'listingsCount';

var ctx = document.getElementById('polar-chart-area');

var boroughs = [
  'Bronx',
  'Brooklyn',
  'Manhattan',
  'Queens',
  'Staten Island',
]

var chartColors = window.chartColors;
var color = Chart.helpers.color;
var backgroundColors = [
  color(chartColors.red).alpha(0.5).rgbString(),
  color(chartColors.orange).alpha(0.5).rgbString(),
  color(chartColors.yellow).alpha(0.5).rgbString(),
  color(chartColors.green).alpha(0.5).rgbString(),
  color(chartColors.blue).alpha(0.5).rgbString(),
];

var chartTitle ='Choose a Category to View'
var chartOptions = {
  responsive: true,
  legend: {
    position: 'right',
  },
  title: {
    display: true,
    text: chartTitle
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


  document.getElementById('listingsCount').addEventListener('click', function() {
    listingsCounts = [];
    boroughs.forEach(borough => {
      boroughData = listingsData.filter(listing => listing.neighbourhood_group_cleansed == borough);
      boroughCount = boroughData.length;
      listingsCounts.push(boroughCount);
    });
    console.log(listingsCounts);
    config.data.datasets[0].data = listingsCounts;
    config.options.title.text = 'Number of Listings by Borough'
    console.log(config);
    myChart.update();
  });

});


// var colorNames = Object.keys(window.chartColors);
// document.getElementById('addData').addEventListener('click', function() {
//   if (config.data.datasets.length > 0) {
//     config.data.labels.push('data #' + config.data.labels.length);
//     config.data.datasets.forEach(function(dataset) {
//       var colorName = colorNames[config.data.labels.length % colorNames.length];
//       dataset.backgroundColor.push(window.chartColors[colorName]);
//       dataset.data.push(randomScalingFactor());
//     });
//     window.myPolarArea.update();
//   }
// });
// document.getElementById('removeData').addEventListener('click', function() {
//   config.data.labels.pop(); // remove the label first
//   config.data.datasets.forEach(function(dataset) {
//     dataset.backgroundColor.pop();
//     dataset.data.pop();
//   });
//   window.myPolarArea.update();
// });
