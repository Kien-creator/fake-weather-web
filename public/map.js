// Weather API Key
const API_KEY = "01a49a21e0bcf70353c0859e9bada9ec";

// Initialize Leaflet map with default location (Biên Hòa)
const defaultLat = 10.9453;
const defaultLon = 106.8243;
const map = L.map("map").setView([defaultLat, defaultLon], 10); // Default view to Biên Hòa

// Load OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Function to get weather data
async function getWeatherData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=vi`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Không tìm thấy dữ liệu thời tiết.");
        }

        return {
            name: data.name || "Không xác định",
            temp: data.main.temp,
            condition: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            wind: data.wind.speed
        };
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thời tiết:", error);
        return null;
    }
}

// Function to display weather popup
async function showWeatherPopup(lat, lon) {
    const weatherData = await getWeatherData(lat, lon);
    
    if (weatherData) {
        L.popup()
            .setLatLng([lat, lon])
            .setContent(`
                <b>${weatherData.name}</b><br>
                <img src="https://openweathermap.org/img/wn/${weatherData.icon}.png" alt="Weather Icon"><br>
                🌡️ Nhiệt độ: ${weatherData.temp}°C<br>
                ☁️ Trạng thái: ${weatherData.condition}<br>
                💧 Độ ẩm: ${weatherData.humidity}%<br>
                💨 Gió: ${weatherData.wind} m/s
            `)
            .openOn(map);
    } else {
        alert("Không thể lấy dữ liệu thời tiết. Vui lòng thử lại!");
    }
}

// Auto-load weather for Biên Hòa
document.addEventListener("DOMContentLoaded", () => {
    showWeatherPopup(defaultLat, defaultLon);
});

// Add click event to the map
map.on("click", async (event) => {
    const { lat, lng } = event.latlng;
    showWeatherPopup(lat, lng);
});

// Function to search for a city and display it on the map
async function searchCity() {
    const city = document.getElementById("searchInput").value.trim();
    if (!city) {
        alert("⚠️ Vui lòng nhập tên thành phố.");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=vi`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Không tìm thấy thành phố!");
        }

        const { coord, name, main, weather, wind } = data;
        const { lat, lon } = coord;

        // Move the map to the searched city
        map.setView([lat, lon], 10);

        // Show weather popup
        L.popup()
            .setLatLng([lat, lon])
            .setContent(`
                <b>${name}</b><br>
                <img src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="Weather Icon"><br>
                🌡️ Nhiệt độ: ${main.temp}°C<br>
                ☁️ Trạng thái: ${weather[0].description}<br>
                💧 Độ ẩm: ${main.humidity}%<br>
                💨 Gió: ${wind.speed} m/s
            `)
            .openOn(map);

    } catch (error) {
        console.error("Lỗi khi tìm kiếm thời tiết thành phố:", error);
        alert(error.message);
    }
}

// Expose searchCity function globally
window.searchCity = searchCity;

// === Handle Navbar Authentication ===
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const dashboardBtn = document.getElementById("dashboard-btn");
    const navLinks = document.querySelector(".nav-links"); // Fixed selector

    if (token && navLinks) {
        if (loginBtn) loginBtn.style.display = "none";
        if (registerBtn) registerBtn.style.display = "none";
        if (dashboardBtn) dashboardBtn.style.display = "inline-block";

        if (!document.getElementById("weather-trends-link")) {
            navLinks.insertAdjacentHTML("beforeend", `
                <li id="monthly-weather-link"><a href="monthly-weather.html">Monthly Weather</a></li>
                <li id="weather-trends-link"><a href="weather-trends.html">Weather Trends</a></li>
                <li id="detailed-weather-link"><a href="detailed-weather.html">Weather Details</a></li>
            `);
        }
    }
});
