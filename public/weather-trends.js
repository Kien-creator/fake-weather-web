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
            <li><a href="detailed-weather.html">Detailed Weather</a></li>
        `;
        navLinks.innerHTML += userPages;
    } else {
        loginBtn.style.display = "inline-block";
        registerBtn.style.display = "inline-block";
        dashboardBtn.style.display = "none";
    }

    setDefaultDates();
    document.getElementById("cityInput").value = "Biên Hòa";
    fetchWeatherTrends();
});

const API_KEY = "01a49a21e0bcf70353c0859e9bada9ec";

async function fetchWeatherTrends() {
    const city = document.getElementById("cityInput").value.trim();
    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);

    if (!city) {
        alert("⚠️ Please enter a city name.");
        return;
    }
    if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate)) {
        alert("⚠️ Please select a valid start and end date.");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Weather data not found.");
        }

        const weatherList = data.list.map(entry => ({
            date: new Date(entry.dt * 1000),
            tempMax: entry.main.temp_max,
            tempMin: entry.main.temp_min,
            windSpeed: entry.wind.speed,
            humidity: entry.main.humidity,
            historicalMax: entry.main.temp_max + (Math.random() * 2 - 1),
            historicalMin: entry.main.temp_min + (Math.random() * 2 - 1)
        })).filter(entry => entry.date >= startDate && entry.date <= endDate);

        if (weatherList.length === 0) {
            alert("⚠️ No weather data found for the selected range.");
            return;
        }

        window.weatherData = {
            labels: weatherList.map(entry => entry.date.toLocaleDateString()),
            tempMax: weatherList.map(entry => entry.tempMax),
            tempMin: weatherList.map(entry => entry.tempMin),
            windSpeed: weatherList.map(entry => entry.windSpeed),
            humidity: weatherList.map(entry => entry.humidity),
            historicalMax: weatherList.map(entry => entry.historicalMax),
            historicalMin: weatherList.map(entry => entry.historicalMin)
        };

        renderChart();
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("❌ Failed to fetch weather data. Try again.");
    }
}

function setDefaultDates() {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 5);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 5);

    document.getElementById("startDate").valueAsDate = startDate;
    document.getElementById("endDate").valueAsDate = endDate;
}

function renderChart() {
    const ctx = document.getElementById("weatherChart").getContext("2d");

    if (window.weatherChartInstance) {
        window.weatherChartInstance.destroy();
    }

    window.weatherChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: window.weatherData.labels,
            datasets: [
                {
                    label: "Mức cao hàng ngày(°C)",
                    data: window.weatherData.tempMax,
                    borderColor: "red",
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                    fill: "+1"
                },
                {
                    label: "Mức thấp hàng ngày(°C)",
                    data: window.weatherData.tempMin,
                    borderColor: "blue",
                    backgroundColor: "rgba(0, 0, 255, 0.2)",
                    fill: true
                },
                {
                    label: "Tốc độ gió (m/s)",
                    data: window.weatherData.windSpeed,
                    borderColor: "green",
                    backgroundColor: "rgba(0, 255, 0, 0.2)",
                    fill: true
                },
                {
                    label: "Độ ẩm (%)",
                    data: window.weatherData.humidity,
                    borderColor: "yellow",
                    backgroundColor: "rgba(255, 255, 0, 0.2)",
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            let label = tooltipItem.dataset.label || '';
                            let value = tooltipItem.raw;
                            return ` ${label}: ${value}`;
                        }
                    }
                }
            },
            scales: {
                x: { display: false },
                y: { title: { display: true, text: "Value" } }
            }
        }
    });
}

window.fetchWeatherTrends = fetchWeatherTrends;