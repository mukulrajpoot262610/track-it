const mapContainer = document.getElementById("map");
const covidBtn = document.getElementById("covid");
const weatherBtn = document.getElementById("weather");
const newsBtn = document.getElementById("news");

const container = document.querySelector(".container");
const covidContainer = document.querySelector(".covid");
const newsContainer = document.querySelector(".news");
const weatherContainer = document.querySelector(".weather");
const labelTimezone = document.querySelector(".weather-timezone");
const labelImage = document.querySelector(".weather-img");
const labelType = document.querySelector(".weather-type");
const labelTemp = document.querySelector(".weather-temp");
const labelWindSpeed = document.querySelector(".weather-windspeed");
const labelHumidity = document.querySelector(".weather-humidity");

const loader = document.querySelector(".loading");

//////////////////////////////////////////////////////////////
// ROUTING
covidBtn.addEventListener("click", () => {
  covidBtn.classList.add("active");
  newsBtn.classList.remove("active");
  weatherBtn.classList.remove("active");
  covidContainer.style.display = "flex";
  weatherContainer.style.display = "none";
  newsContainer.style.display = "none";
});

weatherBtn.addEventListener("click", () => {
  covidBtn.classList.remove("active");
  newsBtn.classList.remove("active");
  weatherBtn.classList.add("active");
  weatherContainer.style.display = "block";
  covidContainer.style.display = "none";
  newsContainer.style.display = "none";
});

newsBtn.addEventListener("click", () => {
  covidBtn.classList.remove("active");
  weatherBtn.classList.remove("active");
  newsBtn.classList.add("active");
  weatherContainer.style.display = "none";
  covidContainer.style.display = "none";
  newsContainer.style.display = "flex";
});

//////////////////////////////////////////////////////////////
// GET MAP
function getWeatherdata(lat, lng) {
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
}

// function getCovidData(lat, lng, country) {
//   console.log(country);
//   let formattedAddressUrl = `https://us1.locationiq.com/v1/reverse.php?key=pk.92a9a09baf84e5f44c4ce89ca413c9ed&lat=${lat}&lon=${lng}&format=json`;

//   fetch(formattedAddressUrl)
//   .then(response => response.json())
//   .then(data => {
//     fetch(`https://api.covid19api.com/live/country/india`)
//     .then(response2 => response2.json())
//     .then(data2 => console.log(data2))
//   })
// }

navigator.geolocation.getCurrentPosition(
  function (position) {
    const { latitude, longitude } = position.coords;
    // console.log(latitude, longitude);
    const coords = [latitude, longitude];
    const mymap = L.map("map").setView(coords, 3);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mymap);

    mymap.on("click", function (mapEvent) {
      const { lat, lng } = mapEvent.latlng;
      L.marker([lat, lng]).addTo(mymap);
      mymap.flyTo([lat, lng], 14);
      getWeatherdata(lat, lng);
    });

    weatherBtn.addEventListener('click', () => {
      mymap.flyTo([latitude, longitude], 14);
      getWeatherdata(latitude, longitude)
    });

    //////////////////////////////////////////////////////////////
    // DISPLAY COVID DATA
    covidBtn.addEventListener('click', () => {
      console.log('Clicked')
      mymap.flyTo([0, 0], 3);
    })

    //////////////////////////////////////////////////////////////
    // IMPLEMENTING SEARCH
    const input = document.getElementById("input-field");
    const inputBtn = document.querySelector(".fa-search-location");

    inputBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let searchedQuery = input.value;

      const fGeocoding = `http://api.openweathermap.org/data/2.5/weather?q=${searchedQuery}&appid=cb7fa1df4f862242c79d99d4e50959e6&units=metric`;

      fetch(fGeocoding)
        .then((response) => response.json())
        .then((data2) => {
          const { lat, lon: lng } = data2.coord;
          let coords = [lat, lng];
          L.marker(coords).addTo(mymap);
          getWeatherdata(lat, lng);
          mymap.flyTo(coords, 15);
        })
        .catch((err) => {
          labelImage.innerHTML = `<img src="../images/not-found.svg" alt="Sun" />`;
          clearUi();
        });

      input.value = "";
      input.blur();
    });
  },
  function () {
    alert("Could not get your postion");
  }
);

//////////////////////////////////////////////////////////////
// DISPLAY UI
function displayUi(data, data1) {
  let check =
    data1.address.road ||
    data1.address.village ||
    data1.address.suburb ||
    data1.address.town ||
    data1.address.county;

  container.style.background =
    "linear-gradient(120deg, #f6d365 0%, #fda085 100%)";

  labelTimezone.innerHTML = `<i class="fas fa-map-marker-alt"></i>  ${check}, ${data1.address.state_district || data1.address.state}, ${data1.address.country}`;

  labelImage.innerHTML = `<img src="../images/${data.current.weather[0].main}.svg" alt="Sun" />`;

  labelType.textContent = data.current.weather[0].main;
  labelTemp.textContent = data.current.temp + " °";
  labelWindSpeed.innerHTML = `<i class="fas fa-wind"></i> ${data.current.wind_speed} m/s`;
  labelHumidity.innerHTML = `<i class="fas fa-tint"></i> ${data.current.humidity} %`;
}

//////////////////////////////////////////////////////////////
// CLEAR UI
function clearUi() {
  labelTimezone.innerHTML = ``;
  labelType.textContent = "";
  labelTemp.textContent = "";
  labelWindSpeed.innerHTML = ``;
  labelHumidity.innerHTML = ``;
}

