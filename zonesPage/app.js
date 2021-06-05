const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let lat = urlParams.get("lat");
let lng = urlParams.get("lng");
let layer_1, layer_2;
//let myMap = L.map("mapid").setView([lat, lng], 13);

// loading the map empty
var firstMap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/agdev21/cko5ucx731x0017rj27ycq0xf/tiles/256/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiYWdkZXYyMSIsImEiOiJja281a3I4cGwwZjJwMnFseHFucXFzbmxiIn0.drtPGlGiQoYVmEFVFQ5Eqw",
  }
);
var myMap = L.map("mapid", {
  center: [lat, lng],
  zoom: 10,
  layers: [firstMap],
});

var listOfKmls = [""];
fetch("../assets/prohibited_airspace.kml")
  .then((res) => res.text())
  .then((kmltext) => {
    // Create new kml overlay
    const parser = new DOMParser();
    const kml = parser.parseFromString(kmltext, "text/xml");
    layer_1 = new L.KML(kml);
  })
  .then(
    fetch("../assets/prohibited_parks.kml")
      .then((res) => res.text())
      .then((kmltext) => {
        // Create new kml overlay
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmltext, "text/xml");
        layer_2 = new L.KML(kml);
        var overlayMaps = {
          "איסור ממשלתי": layer_1,
          "איסור רשות הטבע והגנים": layer_2,
        };
        var baseMaps = {};
        var controller = L.control.layers(baseMaps, overlayMaps);
        myMap.addLayer(layer_1);
        myMap.addLayer(layer_2);
        controller.addTo(myMap);
        controller.expand({});
      })
  );

console.log("" + lat, ",", lng);

var marker = L.marker([lat, lng]).addTo(myMap);
