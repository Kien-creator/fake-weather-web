document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const dashboardBtn = document.getElementById("dashboard-btn");
    const navLinks = document.getElementById("nav-links");

    if (token) {
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        dashboardBtn.style.display = "inline-block";

        const userPages = `
            <li><a href="monthly-weather.html">Monthly Weather</a></li>
            <li><a href="weather-trends.html">Weather Trends</a></li>
            <li><a href="detailed-weather.html">Weather Details</a></li>
        `;
        navLinks.innerHTML += userPages;
    } else {
        loginBtn.style.display = "inline-block";
        registerBtn.style.display = "inline-block";
        dashboardBtn.style.display = "none";
    }

    // Load default weather for Biên Hòa
    document.getElementById("cityInput").value = "Biên Hòa";
    getWeather();
});

const API_KEY = "01a49a21e0bcf70353c0859e9bada9ec"; // Replace with your actual API key

async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) {
        alert("⚠️ Please enter a city name.");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const hourlyUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    try {
        const [weatherResponse, hourlyResponse] = await Promise.all([
            fetch(url),
            fetch(hourlyUrl)
        ]);

        const weatherData = await weatherResponse.json();
        const hourlyData = await hourlyResponse.json();

        if (!weatherResponse.ok) {
            throw new Error(weatherData.message || "City not found! Please enter a valid city.");
        }

        document.getElementById("city-name").textContent = `📍 ${weatherData.name}, ${weatherData.sys.country}`;
        document.getElementById("temperature").textContent = `🌡️ Temperature: ${weatherData.main.temp}°C`;
        document.getElementById("weather-condition").textContent = `☁️ Condition: ${weatherData.weather[0].description}`;
        document.getElementById("humidity").textContent = `💧 Humidity: ${weatherData.main.humidity}%`;
        document.getElementById("wind-speed").textContent = `💨 Wind Speed: ${weatherData.wind.speed} m/s`;

        displayHourlyWeather(hourlyData);
        displayTemperatureChart(hourlyData);
        updateMap(weatherData.coord.lat, weatherData.coord.lon);
    } catch (error) {
        console.error("❌ Error fetching weather data:", error);
        alert(error.message);
    }
}

function displayHourlyWeather(data) {
    const hourlyContainer = document.getElementById("hourly-scroll");
    hourlyContainer.innerHTML = "";
    hourlyContainer.style.display = "flex";
    hourlyContainer.style.overflowX = "auto";
    hourlyContainer.style.justifyContent = "center";
    hourlyContainer.style.gap = "10px";

    const hourlyList = data.list.slice(0, 8); // Get next 8 hours
    hourlyList.forEach(hour => {
        const dateTime = new Date(hour.dt * 1000);
        const hourTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const hourlyItem = document.createElement("div");
        hourlyItem.classList.add("hour-item");
        hourlyItem.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        hourlyItem.style.borderRadius = "10px";
        hourlyItem.style.padding = "10px";
        hourlyItem.style.textAlign = "center";
        hourlyItem.style.width = "80px";
        hourlyItem.style.flexShrink = "0";

        hourlyItem.innerHTML = `
            <p style="font-size: 12px; margin: 5px 0;">${hourTime}</p>
            <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png" alt="Weather icon" style="width: 40px; height: 40px;">
            <p style="font-size: 14px; margin: 5px 0;">${hour.main.temp}°C</p>
        `;

        hourlyContainer.appendChild(hourlyItem);
    });
}

let temperatureChartInstance = null; // Global variable to store chart instance

function displayTemperatureChart(data) {
    const ctx = document.getElementById("temperatureChart").getContext("2d");

    // Destroy the previous chart instance if it exists
    if (temperatureChartInstance) {
        temperatureChartInstance.destroy();
    }

    const hourlyList = data.list.slice(0, 12);
    const labels = hourlyList.map(hour =>
        new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
    const temperatures = hourlyList.map(hour => hour.main.temp);

    // Find hottest and coldest temperatures
    const maxTemp = Math.max(...temperatures);
    const minTemp = Math.min(...temperatures);
    const maxIndex = temperatures.indexOf(maxTemp);
    const minIndex = temperatures.indexOf(minTemp);

    temperatureChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Temperature (°C)",
                data: temperatures,
                borderColor: "#FFD700", // Bright yellow for contrast
                borderWidth: 3,
                pointBackgroundColor: temperatures.map((temp, index) => 
                    index === maxIndex ? "red" : index === minIndex ? "blue" : "#FFA500"
                ), // Red for hottest, blue for coldest, orange for others
                pointRadius: temperatures.map((temp, index) => 
                    index === maxIndex || index === minIndex ? 7 : 5
                ), // Larger point for hottest and coldest
                pointHoverRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: false }
            },
            plugins: {
                annotation: {
                    annotations: [
                        {
                            type: "point",
                            xValue: maxIndex,
                            yValue: maxTemp,
                            backgroundColor: "red",
                            radius: 8
                        },
                        {
                            type: "point",
                            xValue: minIndex,
                            yValue: minTemp,
                            backgroundColor: "blue",
                            radius: 8
                        }
                    ]
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            let label = ` ${tooltipItem.raw}°C`;
                            if (tooltipItem.dataIndex === maxIndex) {
                                label += " (Hottest)";
                            } else if (tooltipItem.dataIndex === minIndex) {
                                label += " (Coldest)";
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function updateMap(lat, lon) {
    // Check if map exists and is a valid Leaflet map instance
    if (!window.map || typeof window.map.setView !== "function") {
        console.log("Initializing Leaflet map...");
        window.map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(window.map);
    } else {
        console.log("Updating map view...");
        window.map.setView([lat, lon], 10);
    }

    // Remove existing marker before adding a new one
    if (window.mapMarker) {
        window.map.removeLayer(window.mapMarker);
    }
    window.mapMarker = L.marker([lat, lon]).addTo(window.map)
        .bindPopup("📍 Weather Location").openPopup();
}

// Initialize an empty map when the page loads
document.addEventListener("DOMContentLoaded", () => {
    if (!window.map) {
        console.log("Setting default map view...");
        window.map = L.map('map').setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(window.map);
    }
});


// Make getWeather function globally accessible
window.getWeather = getWeather;
