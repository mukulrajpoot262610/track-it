const mapContainer = document.getElementById("map");
const container = document.querySelector(".container");

const labelTimezone = document.querySelector(".weather-timezone");
const labelImage = document.querySelector(".weather-img");
const labelType = document.querySelector(".weather-type");
const labelTemp = document.querySelector(".weather-temp");
const labelWindSpeed = document.querySelector(".weather-windspeed");
const labelHumidity = document.querySelector(".weather-humidity");

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

      let formattedAddressUrl = `https://us1.locationiq.com/v1/reverse.php?key=pk.92a9a09baf84e5f44c4ce89ca413c9ed&lat=${lat}&lon=${lng}&format=json`;

      fetch(formattedAddressUrl)
        .then((response) => response.json())
        .then((data1) => {
          fetch(url)
            .then((response) => response.json())
            .then((data) => displayUi(data, data1));
        });
    });
  },
  function () {
    alert("Could not get your postion");
  }
);

//////////////////////////////////////////////////////////////
// DISPLAY HOT
function displayUi(data, data1) {
  let check =
    data1.address.road ||
    data1.address.village ||
    data1.address.suburb ||
    data1.address.town ||
    data1.address.county;

  container.style.background =
    "linear-gradient(120deg, #f6d365 0%, #fda085 100%)";

  labelTimezone.innerHTML = `<i class="fas fa-map-marker-alt"></i>  ${check}, ${data1.address.state_district}`;

  // IMAGES
  labelImage.innerHTML = `<img src="../images/${data.current.weather[0].main}.svg" alt="Sun" />`;

  labelType.textContent = data.current.weather[0].main;
  labelTemp.textContent = data.current.temp + " °";
  labelWindSpeed.innerHTML = `<i class="fas fa-wind"></i> ${data.current.wind_speed} m/s`;
  labelHumidity.innerHTML = `<i class="fas fa-tint"></i> ${data.current.humidity} %`;
  console.log(data);
}
