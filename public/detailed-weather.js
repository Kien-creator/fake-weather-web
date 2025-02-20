document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "01a49a21e0bcf70353c0859e9bada9ec";

    window.getDetailedWeather = async function () {
        const city = document.getElementById("cityInput").value.trim();
        if (!city) {
            alert("⚠️ Please enter a city name.");
            return;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "City not found! Please enter a valid city.");
            }

            // Convert sunrise/sunset timestamps to readable format
            const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            document.getElementById("city-name").textContent = `📍 ${data.name}, ${data.sys.country}`;
            document.getElementById("temperature").textContent = `🌡️ Temperature: ${data.main.temp}°C`;
            document.getElementById("weather-condition").textContent = `☁️ Condition: ${data.weather[0].description}`;
            document.getElementById("humidity").textContent = `💧 Humidity: ${data.main.humidity}%`;
            document.getElementById("wind-speed").textContent = `💨 Wind Speed: ${data.wind.speed} m/s`;
            document.getElementById("pressure").textContent = `🌍 Pressure: ${data.main.pressure} hPa`;
            document.getElementById("visibility").textContent = `👀 Visibility: ${data.visibility / 1000} km`;
            document.getElementById("sunrise").textContent = `🌅 Sunrise: ${sunriseTime}`;
            document.getElementById("sunset").textContent = `🌇 Sunset: ${sunsetTime}`;

        } catch (error) {
            console.error("❌ Error fetching weather data:", error);
            alert(error.message);
        }
    };
});
