
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';


let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [streets]
});
let baseMaps = {
    "streets": streets
};

let earthquake_data = new L.LayerGroup();
let tectonics = new L.LayerGroup();

let overlays = {
    "Earthquakes": earthquake_data,
    "Tectonic Plates": tectonics
};


L.control.layers(baseMaps, overlays).addTo(myMap);


function styleInfo(feature) {
    return {
        color: chooseColor(feature.geometry.coordinates[2]),
        radius: chooseRadius(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2]) 
    }
};

function chooseColor(depth) {
    if (depth <= 10) return "red";
    else if (depth > 10 & depth <= 25) return "yellow";
    else if (depth > 25 & depth <= 40) return "orange";
    else if (depth > 40 & depth <= 55) return "purple";
    else if (depth > 55 & depth <= 70) return "blue";
    else return "green";
};


function chooseRadius(magnitude) {
    return magnitude*5;
};
d3.json(url).then(function (data) { //pull the earthquake
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) { 
            return L.circleMarker(latlon).bindPopup(feature.id); 
        },
        style: styleInfo
    }).addTo(earthquake_data); 
    earthquake_data.addTo(myMap);


    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (data) { //pulls tectonic data with d3.json
        L.geoJson(data, {
            color: "purple",  
            weight: 3
        }).addTo(tectonics); 
        tectonics.addTo(myMap);
    });


});
var legend = L.control({ position: "bottomright" });
legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
       div.innerHTML += "<h4>Depth Color Legend</h4>";
       div.innerHTML += '<i style="background: red"></i><span>(Depth < 10)</span><br>';
       div.innerHTML += '<i style="background: orange"></i><span>(10 < Depth <= 25)</span><br>';
       div.innerHTML += '<i style="background: yellow"></i><span>(25 < Depth <= 40)</span><br>';
       div.innerHTML += '<i style="background: pink"></i><span>(40 < Depth <= 55)</span><br>';
       div.innerHTML += '<i style="background: blue"></i><span>(55 < Depth <= 70)</span><br>';
       div.innerHTML += '<i style="background: green"></i><span>(Depth > 70)</span><br>';
  
    return div;
  };

  legend.addTo(myMap);
d3.json(url).then(function (data) {
    console.log(data);
    let features = data.features;
    console.log(features);

    let results = features.filter(id => id.id == "nc73872510"); 
    let first_result = results[0];
    console.log(first_result);
    let geometry = first_result.geometry;
    console.log(geometry);
    let coordinates = geometry.coordinates;
    console.log(coordinates);
    console.log(coordinates[0]);
    console.log(coordinates[1]); 
    console.log(coordinates[2]); 
    let magnitude = first_result.properties.mag;
    console.log(magnitude);


    let depth = geometry.coordinates[2];
    console.log(depth);
    let id = first_result.id;
    console.log(id);

});