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

  var latArray = [];
  var lngArray = [];
  var typeArray = [];
  var priceArray = [];

  d3.csv("static/all_historical_data.csv").then(function(data) {
    data.forEach(function(d) {
      if (d.Date == 2018) {
        latArray.push(d.Latitude),
        lngArray.push(d.Longitude),
        typeArray.push(d.Room_Type),
        priceArray.push(d.Price)
    }});
  //  console.log(priceArray);
    var markers = L.markerClusterGroup();

    // Loop through data
    for (var i = 0; i < latArray.length; i++) {

      // Set the data location property to a variable
      // Check for location property
        // Add a new marker to the cluster group and bind a pop-up
  //      markerPopupInfo = ("Latitude: " + latArray[i] + "\n" + "Longitude: " + lngArray);
        //console.log(priceArray[i]);
        var price = priceArray[i];
        markers.addLayer(L.marker([latArray[i], lngArray[i]])
          .bindPopup(`Price: $${price}`));

    }

    // Add our marker cluster layer to the map
    myMap.addLayer(markers);
  });

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
