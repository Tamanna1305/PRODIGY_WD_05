const apiKey = "ae4631450b56d01af4bb252822e0ed02";

function startApp() {
  window.location.href = "dashboard.html";
}

// On home page load, apply weather-based background
window.onload = () => {
  const city = "Delhi"; // You can change this to navigator geolocation if you want
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const iconCode = data.weather[0].icon;
      const condition = data.weather[0].main.toLowerCase();

      document.body.className = "";
      document.querySelectorAll(".raindrop, .snowflake, .fog-layer, .star, .sunshine").forEach(e => e.remove());

      const isNight = iconCode.endsWith("n");

      if (isNight) {
        document.body.classList.add("night");
        for (let i = 0; i < 100; i++) {
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
        for (let i = 0; i < 80; i++) {
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
      }
    });
};
