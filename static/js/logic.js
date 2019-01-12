// Creating map object
var myMap = L.map("map", {
  center: [40.7189, -73.9000],
  zoom: 11
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

// Link to GeoJSON
  var filepath = "static/neighborhoods_price.geojson"
  //var xhr = new XMLHttpRequest();
  //xhr.onreadystatechange = handleStateChange; // Implemented elsewhere.
  //xhr.open("GET", chrome.extension.getURL(filepath), true);
  //xhr.send();

  var geojson;

// Grab data with d3
d3.json(filepath).then(function(data) {

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "2018",

    // Set color scale
    scale: ["#ffe6e6", "#ff1a21"],

    // Number of breaks in step range
    steps: 8,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      //Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.7
    },

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      var display = `Neighborhood: ${feature.properties.neighbourhood}</br>
      ----------------------------------</br>
      <u>Prices</u>:</br>
        2018: $${feature.properties['2018']}</br>
        2017: $${feature.properties['2017']}</br>
        2016: $${feature.properties['2016']}</br>
        2015: $${feature.properties['2015']}</br>
        2014: $${feature.properties['2014']}</br>`
      layer.bindPopup(display);
    }
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>2018 Average </br>Airbnb Listing Price</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">$" + limits[0] + "</div>" +
        "<div class=\"max\">$" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

   //Adding legend to the map
  legend.addTo(myMap);

});
