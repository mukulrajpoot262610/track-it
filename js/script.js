const mapContainer = document.getElementById("map");
const container = document.querySelector(".container");

const labelTimezone = document.querySelector(".weather-timezone");
const labelImage = document.querySelector(".weather-img");
const labelType = document.querySelector(".weather-type");
const labelTemp = document.querySelector(".weather-temp");
const labelData = document.querySelector(".weather-data");

navigator.geolocation.getCurrentPosition(
  function (position) {
    const { latitude, longitude } = position.coords;
    console.log(latitude, longitude);
    const coords = [latitude, longitude];

    const mymap = L.map("map").setView(coords, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mymap);

    L.marker(coords).addTo(mymap);

    mymap.on("click", function (mapEvent) {
      const { lat, lng } = mapEvent.latlng;
      //   L.marker([lat, lng]).addTo(mymap);

      let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=cb7fa1df4f862242c79d99d4e50959e6&units=metric
      `;

      let formattedAddressUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Winnetka&bounds=34.172684,
      -118.604794|34.236144,-118.500938&key=AIzaSyBAWzZ1ml6ezkv0hJAYJH1ivpMoXyOzykg`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => displayHot(data));
    });
  },
  function () {
    alert("Could not get your postion");
  }
);

//////////////////////////////////////////////////////////////
// DISPLAY HOT
function displayHot(data) {
  container.style.background =
    "linear-gradient(120deg, #f6d365 0%, #fda085 100%)";
  labelTimezone.textContent = data.timezone;
  console.log(data);
}

//////////////////////////////////////////////////////////////
// DISPLAY RAINY
function displayRainy(data) {
  container.style.background =
    "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)";
  labelTimezone.textContent = data.timezone;
}

//////////////////////////////////////////////////////////////
// DISPLAY CLOUDY
function displaCloudy(data) {
  container.style.background =
    "linear-gradient(-20deg, #00cdac 0%, #8ddad5 100%)";
  labelTimezone.textContent = data.timezone;
}
