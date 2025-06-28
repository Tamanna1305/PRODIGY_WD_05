const apiKey = "ae4631450b56d01af4bb252822e0ed02";

function startApp() {
  window.location.href = "dashboard.html";
}

function getWeather() {
  const city = document.getElementById("cityInput")?.value || "Delhi";

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      displayWeather(data);
      updateBackground(data.weather[0].icon, data.weather[0].main.toLowerCase());
      getForecast(city);
    })
    .catch(() => alert("City not found!"));
}

function getForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const forecastContainer = document.getElementById("forecast");
      forecastContainer.innerHTML = "";

      const daily = {};
      data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!daily[date]) daily[date] = item;
      });

      let count = 0;
      for (let day in daily) {
        if (count >= 5) break;
        const forecast = daily[day];
        forecastContainer.innerHTML += `
          <div class="day-card">
            <p>${new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png"/>
            <p>${Math.round(forecast.main.temp)}°</p>
            <p style="font-size:12px;opacity:0.6;">${Math.round(forecast.main.temp_min)}°</p>
          </div>`;
        count++;
      }
    });
}

function displayWeather(data) {
  document.getElementById("location").textContent = data.name;
  document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°`;
  document.getElementById("condition").textContent = data.weather[0].main;
  document.getElementById("humidity").textContent = `${data.main.humidity}%`;
  document.getElementById("wind").textContent = `${data.wind.speed} km/h`;
  document.getElementById("precip").textContent = `${data.clouds.all}%`;
  document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById("date").textContent = new Date().toDateString();
}

function getWeatherByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      displayWeather(data);
      updateBackground(data.weather[0].icon, data.weather[0].main.toLowerCase());
      getForecast(data.name);
    })
    .catch(() => alert("Unable to fetch weather for your location."));
}

function updateBackground(iconCode, condition) {
  document.body.className = "";
  document.querySelectorAll(".raindrop, .snowflake, .fog-layer, .star, .sunshine, .cloud").forEach(e => e.remove());

  const isNight = iconCode.endsWith("n");

  if (isNight) {
    document.body.classList.add("night");
    for (let i = 0; i < 80; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = Math.random() * 100 + "vw";
      star.style.top = Math.random() * 100 + "vh";
      document.body.appendChild(star);
    }
  } else if (condition.includes("rain") || condition.includes("drizzle")) {
    document.body.classList.add("rain");
    for (let i = 0; i < 100; i++) {
      const drop = document.createElement("div");
      drop.className = "raindrop";
      drop.style.left = Math.random() * 100 + "vw";
      drop.style.animationDelay = Math.random() + "s";
      document.body.appendChild(drop);
    }
  } else if (condition.includes("snow")) {
    document.body.classList.add("snow");
    for (let i = 0; i < 60; i++) {
      const flake = document.createElement("div");
      flake.className = "snowflake";
      flake.style.left = Math.random() * 100 + "vw";
      flake.style.animationDelay = Math.random() * 5 + "s";
      document.body.appendChild(flake);
    }
  } else if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) {
    document.body.classList.add("fog");
    for (let i = 0; i < 3; i++) {
      const fog = document.createElement("div");
      fog.className = "fog-layer";
      fog.style.top = `${30 + i * 60}px`;
      document.body.appendChild(fog);
    }
  } else if (condition.includes("clear")) {
    document.body.classList.add("clear");
    for (let i = 0; i < 25; i++) {
      const sunDot = document.createElement("div");
      sunDot.className = "sunshine";
      sunDot.style.left = Math.random() * 100 + "vw";
      sunDot.style.top = Math.random() * 100 + "vh";
      sunDot.style.animationDelay = Math.random() * 5 + "s";
      document.body.appendChild(sunDot);
    }
  } else if (condition.includes("cloud")) {
    document.body.classList.add("cloudy");
    for (let i = 0; i < 6; i++) {
      const cloud = document.createElement("div");
      cloud.className = "cloud";
      cloud.style.left = Math.random() * 100 + "vw";
      cloud.style.top = `${Math.random() * 40 + 10}px`;
      cloud.style.animationDelay = Math.random() * 10 + "s";
      document.body.appendChild(cloud);
    }
  }
}

window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.warn("Location access denied. Using default.");
        getWeather();
      }
    );
  } else {
    getWeather();
  }
};
