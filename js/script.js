const mapContainer = document.getElementById("map");
const covidBtn = document.getElementById("covid");
const weatherBtn = document.getElementById("weather");
const newsBtn = document.getElementById("news");
const main = document.querySelector(".main");

const covidDataContainer = document.querySelector(".covid-data");
const container = document.querySelector(".container");
const inputContainer = document.querySelector(".input-container");
const covidContainer = document.querySelector(".covid");
const newsContainer = document.querySelector(".news");
const weatherContainer = document.querySelector(".weather");
const labelTimezone = document.querySelector(".weather-timezone");
const labelImage = document.querySelector(".weather-img");
const labelFlag = document.querySelector(".label-flag");
const labelType = document.querySelector(".weather-type");
const labelTemp = document.querySelector(".weather-temp");
const labelWindSpeed = document.querySelector(".weather-windspeed");
const labelHumidity = document.querySelector(".weather-humidity");
const labelActive = document.querySelector(".label-active");
const labelCountry = document.querySelector(".label-country");
const labelRecovered = document.querySelector(".label-recovered");
const labelDeaths = document.querySelector(".label-death");
const labelDate = document.querySelector(".label-date");

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
  main.style.display = "flex";
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

//////////////////////////////////////////////////////////////
// DISPLAY WEATHER UI
function displayUi(data, data1) {
  let check =
    data1.address.road ||
    data1.address.village ||
    data1.address.suburb ||
    data1.address.town ||
    data1.address.county;

  container.style.background =
    "linear-gradient(120deg, #f6d365 0%, #fda085 100%)";

  labelTimezone.innerHTML = `<i class="fas fa-map-marker-alt"></i>  ${check}, ${
    data1.address.state_district || data1.address.state
  }, ${data1.address.country}`;

  labelImage.innerHTML = `<img src="../images/${data.current.weather[0].main}.svg" alt="Sun" />`;

  labelType.textContent = data.current.weather[0].main;
  labelTemp.textContent = data.current.temp + " °";
  labelWindSpeed.innerHTML = `<i class="fas fa-wind"></i> ${data.current.wind_speed} m/s`;
  labelHumidity.innerHTML = `<i class="fas fa-tint"></i> ${data.current.humidity} %`;
}

//////////////////////////////////////////////////////////////
// CLEAR WEATHER UI
function clearUi() {
  labelTimezone.innerHTML = ``;
  labelType.textContent = "";
  labelTemp.textContent = "";
  labelWindSpeed.innerHTML = ``;
  labelHumidity.innerHTML = ``;
}

//////////////////////////////////////////////////////////////
// DISPLAY COVID CIRLCE DATA
function displayCovid(data, mymap) {
  data.forEach((country) => {
    let circle = L.circle(
      [country.coordinates.latitude, country.coordinates.longitude],
      {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: Number(country.stats.confirmed) / 20,
      }
    ).addTo(mymap);

    circle.on("click", () => {
      fetch(`https://api.covid19api.com/live/country/${country.country}`)
        .then((response3) => response3.json())
        .then((data3) => {
          circle.bindPopup(`<img
          src="https://flagcdn.com/${data3[0].CountryCode.toLowerCase()}.svg"
          width="100%"
          alt="South Africa"> <br> <h1>${
            country.province || country.country
          }</h1> <br> <h3>👀 ACTIVE: ${
            country.stats.confirmed
          }</h3><h3>🦾 RECOVERED: ${
            country.stats.recovered
          }</h3> <h3>💀 DEATHS: ${country.stats.deaths}</h3>`);
          // console.log(country);
          labelCountry.textContent = `${country.province || country.country} ${
            country.country
          }`;
          labelDate.textContent = "As of " + country.updatedAt;
          labelActive.textContent = country.stats.confirmed;
          labelDeaths.textContent = country.stats.deaths;
          labelRecovered.textContent = country.stats.recovered;
        });
    });
  });
}

//////////////////////////////////////////////////////////////
// MAIN
navigator.geolocation.getCurrentPosition(
  function (position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];
    const mymap = L.map("map").setView(coords, 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mymap);

    //////////////////////////////////////////////////////////////
    // WEATHER DATA
    weatherBtn.addEventListener("click", () => {
      const mediaQuery = window.matchMedia("(max-width: 1000px)");
      function handleTabletChange(e) {
        if (e.matches) {
          console.log("Media Query Matched!");
          if (!covidBtn.classList.contains("active")) {
            map.style.display = "none";
            main.style.display = "flex";
          }
        }
      }
      mediaQuery.addListener(handleTabletChange);
      handleTabletChange(mediaQuery);
      mymap.remove();
      const myWeathermap = L.map("map").setView(coords, 4);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(myWeathermap);
      myWeathermap.flyTo([latitude, longitude], 14);
      getWeatherdata(latitude, longitude);

      myWeathermap.on("click", function (mapEvent) {
        const { lat, lng } = mapEvent.latlng;
        L.marker([lat, lng]).addTo(myWeathermap);
        myWeathermap.flyTo([lat, lng], 14);
        getWeatherdata(lat, lng);
      });

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
            L.marker(coords).addTo(myWeathermap);
            getWeatherdata(lat, lng);
            myWeathermap.flyTo(coords, 13);
          })
          .catch((err) => {
            labelImage.innerHTML = `<img src="../images/not-found.svg" alt="Sun" />`;
            clearUi();
            console.log(err);
          });

        input.value = "";
        input.blur();
      });
    });

    //////////////////////////////////////////////////////////////
    // COVID DATA
    fetch("https://disease.sh/v3/covid-19/jhucsse")
      .then((response) => response.json())
      .then((data) => {
        displayCovid(data, mymap);
      });

    covidBtn.addEventListener("click", () => {
      location.reload();
    });
  },
  function () {
    alert("Could not get your postion");
  }
);
