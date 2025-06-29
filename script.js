const apiKey = "ae4631450b56d01af4bb252822e0ed02";
let cityOffset = 0;

function showLoader(show) {
  document.getElementById("loader").style.display = show ? "flex" : "none";
}

function getWeather() {
  const city = document.getElementById("cityInput")?.value || "Delhi";
  showLoader(true);

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("location").textContent = data.name;
      document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°`;
      document.getElementById("condition").textContent = data.weather[0].main;
      document.getElementById("humidity").textContent = `${data.main.humidity}%`;
      document.getElementById("wind").textContent = `${data.wind.speed} km/h`;
      document.getElementById("precip").textContent = `${data.clouds.all}%`;

      const iconCode = data.weather[0].icon;
      document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      cityOffset = data.timezone * 1000;
      startClock();
      updateBackground(iconCode, data.weather[0].main.toLowerCase());
      getForecast(city);
    })
    .catch(() => {
      alert("City not found!");
      document.getElementById("forecast").innerHTML = "";
    })
    .finally(() => showLoader(false));
}

function startClock() {
  clearInterval(window.liveClock);

  function updateClock() {
    const nowUTC = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    const localTime = new Date(nowUTC + cityOffset);

    document.getElementById("date").textContent = localTime.toLocaleDateString("en-US", {
      weekday: "long", month: "short", day: "numeric", year: "numeric"
    });

    document.getElementById("time").textContent = localTime.toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
    });
  }

  updateClock();
  window.liveClock = setInterval(updateClock, 1000);
}

function getForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const forecastContainer = document.getElementById("forecast");
      forecastContainer.innerHTML = "";
      const daily = {};
      data.list.forEach(item => {
        const [date, time] = item.dt_txt.split(" ");
        if (time === "12:00:00" && !daily[date]) {
          daily[date] = item;
        }
      });

      let count = 0;
      for (let day in daily) {
        if (count++ >= 5) break;
        const forecast = daily[day];
        forecastContainer.innerHTML += `
          <div class="day-card">
            <p>${new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png"/>
            <p>${Math.round(forecast.main.temp)}°</p>
            <p style="font-size:12px;opacity:0.6;">${Math.round(forecast.main.temp_min)}°</p>
          </div>`;
      }
    });
}

function updateBackground(iconCode, condition) {
  const video = document.getElementById("bgVideo");
  const isNight = iconCode.endsWith("n");

  function setVideo(fileName) {
    video.src = `videos/${fileName}`;
    video.load();
    video.play().catch(() => {});
  }

  if (isNight) setVideo("night.mp4");
  else if (condition.includes("rain")) setVideo("rain.mp4");
  else if (condition.includes("snow")) setVideo("snow.mp4");
  else if (["fog", "mist", "haze"].some(c => condition.includes(c))) setVideo("fog.mp4");
  else if (condition.includes("thunder")) setVideo("thunder.mp4");
  else if (condition.includes("cloud")) setVideo("cloudy.mp4");
  else setVideo("clear.mp4");
}

// Auto detect location
function getWeatherByCoords(lat, lon) {
  showLoader(true);
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("cityInput").value = data.name;
      getWeather();
    })
    .catch(() => {
      alert("Failed to detect your location");
      getWeather();
    })
    .finally(() => showLoader(false));
}

window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => getWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => getWeather()
    );
  } else {
    getWeather();
  }
};

// City suggestions
const cityInput = document.getElementById("cityInput");
const suggestionsList = document.getElementById("suggestions");

cityInput.addEventListener("input", () => {
  const query = cityInput.value.trim();
  if (query.length < 2) {
    suggestionsList.innerHTML = "";
    return;
  }

  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      suggestionsList.innerHTML = "";
      data.forEach(city => {
        const li = document.createElement("li");
        li.textContent = `${city.name}, ${city.country}`;
        li.addEventListener("click", () => {
          cityInput.value = city.name;
          suggestionsList.innerHTML = "";
          getWeather();
        });
        suggestionsList.appendChild(li);
      });
    });
});

document.addEventListener("click", e => {
  if (!cityInput.contains(e.target)) {
    suggestionsList.innerHTML = "";
  }
});
