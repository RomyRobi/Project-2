// var randomScalingFactor = function() {
//   return Math.round(Math.random() * 100);
// };

var boroughs = [
  'Bronx',
  'Brooklyn',
  'Manhattan',
  'Queens',
  'Staten Island',
]

function boroughFilter(borough){
  return listing.borough = borough;
}

var chartColors = window.chartColors;
var color = Chart.helpers.color;
var config = {
  data: {
    datasets: [{
      data: [
        1,
        2,
        3,
        4,
        5,
      ],
      backgroundColor: [
        color(chartColors.red).alpha(0.5).rgbString(),
        color(chartColors.orange).alpha(0.5).rgbString(),
        color(chartColors.yellow).alpha(0.5).rgbString(),
        color(chartColors.green).alpha(0.5).rgbString(),
        color(chartColors.blue).alpha(0.5).rgbString(),
      ],
      label: 'My dataset' // for legend
    }],
    labels: boroughs
  },
  options: {
    responsive: true,
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Listing Data by Borough'
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
  }
};

window.onload = function() {
  var ctx = document.getElementById('polar-chart-area');
  window.myPolarArea = Chart.PolarArea(ctx, config);
};

document.getElementById('randomizeData').addEventListener('click', function() {
  config.data.datasets.forEach(function(piece, i) {
    piece.data.forEach(function(value, j) {
      config.data.datasets[i].data[j] = randomScalingFactor();
    });
  });
  window.myPolarArea.update();
});

const csv = "listings.csv"

d3.csv(csv).then(function(listingsData)) {

    // Parse Data
    newsData.forEach(function(data) {
      data.accomodates = +data.accomodates;
      data.price = +data.price;
      data.minimum_night = +data.minimum_night;
      data.review_scores_rating = +data.review_scores_rating;
      data.review_scores_location = +data.review_scores_location;
    });

    console.log(listingsData);

}


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
