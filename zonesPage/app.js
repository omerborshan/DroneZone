const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let lat = urlParams.get("lat");
let lng = urlParams.get("lng");

let parsedLng = parseFloat(lng);
let parsedLat = parseFloat(lat);

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

var droneIcon = L.icon({
  iconUrl: "../assets/drone.png",

  iconSize: [80, 110], // size of the icon
  iconAnchor: [31, 90], // point of the icon which will correspond to marker's location
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});
var droneMarker = L.marker([lat, lng], { icon: droneIcon })
  .addTo(myMap)
  .bindPopup(`Your drone location is: \n ${parsedLat} , ${parsedLng}`);
var myLocationMarker = L.marker([lat, lng]).addTo(myMap).on(`click`, clickZoom);

function clickZoom(e) {
  myMap.setView(e.target.getLatLng(), 20);
}

/*Legend specific*/
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>מקרא מפה</h4>";
  div.innerHTML +=
    '<i style="background: #477AC2"></i><span>שדות תעופה ומנחתים</span><br>';
  div.innerHTML +=
    '<i style="background: #448D40"></i><span>שמורת טבע</span><br>';
  div.innerHTML +=
    '<i style="background: rgb(184, 9, 9)"></i><span>ביטחוני</span><br>';
  div.innerHTML +=
    '<i style="background: rgb(231, 115, 47)"></i><span>מנהלי</span><br>';
  div.innerHTML +=
    '<i style="background: rgb(179, 11, 151);"></i><span>כללי</span><br>';

  return div;
};

legend.addTo(myMap);

// let x = 0.0002;
// let y = 0.0001;
// let circleBool = 0;
// setInterval(() => {
//   parsedLng += x;
//   parsedLat += y;

//   var newLatLng = new L.LatLng(parsedLat, parsedLng);
//   droneMarker
//     .setLatLng(newLatLng)
//     .bindPopup(
//       `Your drone location is:${parsedLat.toFixed(6)} , ${parsedLng.toFixed(6)}`
//     );
// }, 1000);

// setInterval(() => {
//   if (circleBool === 0) {
//     x *= 1;
//     y *= -1;
//     circleBool += 1;
//   } else if (circleBool === 1) {
//     x *= -1;
//     y *= -1;
//     circleBool += 1;
//   } else if (circleBool === 2) {
//     x *= -1;
//     y *= 1;
//     circleBool += 1;
//   } else {
//     x *= 1;
//     y *= 1;
//     circleBool = 0;
//   }
// }, 5000);
