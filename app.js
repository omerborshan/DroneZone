let viewBtn = document.querySelector(".btnView");
let searchBox = document.querySelector(".search-input");
let myLocationBtn = document.querySelector(".myLocationBtn");

viewBtn.addEventListener("click", async () => {
  const res = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${searchBox.value}&key=6544c06a51c24b71a3fcf75528edb59a
  `);
  const { lat, lng } = res.data.results[0].geometry;
  window.location = `./zonesPage/index.html?lat=${lat}&lng=${lng}`;
});

myLocationBtn.addEventListener("click", () => {
  let options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    var crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    window.location = `./zonesPage/index.html?lat=${crd.latitude}&lng=${crd.longitude}`;
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
});
