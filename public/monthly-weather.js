document.addEventListener("DOMContentLoaded", function () {
    const weatherContainer = document.getElementById("weather-container");
    const cityInput = document.getElementById("cityInput");
    const API_KEY = "01a49a21e0bcf70353c0859e9bada9ec";

    function createMonthButtons() {
        const monthNames = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
        ];
    
        const monthSelector = document.querySelector(".month-selector");
        monthSelector.innerHTML = ""; // Clear existing buttons if needed
    
        monthNames.forEach((month, index) => {
            const monthButton = document.createElement("button");
            monthButton.textContent = month;
            monthButton.dataset.month = index + 1; // Month index (1-12)
            monthButton.addEventListener("click", () => getWeather(cityInput.value, index + 1));
            monthSelector.appendChild(monthButton);
        });
    }
    
    async function getCoordinates(city) {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
        try {
            const response = await fetch(geoUrl);
            const data = await response.json();
            if (!data.length) {
                alert("City not found. Please enter a valid city.");
                return null;
            }
            return { lat: data[0].lat, lon: data[0].lon };
        } catch (error) {
            console.error("Error fetching city coordinates:", error);
            alert("Could not find city. Try again.");
            return null;
        }
    }

    async function getWeather(city, month) {
        const coordinates = await getCoordinates(city);
        if (!coordinates) return;

        const year = new Date().getFullYear();
        const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
        const endDate = new Date(year, month, 0).toISOString().split("T")[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&start_date=${startDate}&end_date=${endDate}&timezone=auto`;

        try {
            const response = await fetch(weatherUrl);
            const data = await response.json();
            if (!data.daily) {
                weatherContainer.innerHTML = "<p>No data.</p>";
                return;
            }
            displayWeather(data, month, year);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            weatherContainer.innerHTML = "<p>Failed to load weather data.</p>";
        }
    }

    function displayWeather(data, month, year) {
        let weatherHtml = `<div class='calendar'><div class='calendar-header'>`;

        // English weekdays
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        for (let i = 0; i < 7; i++) {
            weatherHtml += `<div class="calendar-weekday">${weekdays[i]}</div>`;
        }
        weatherHtml += `</div><div class='calendar-body'>`;

        // Get the first day of the month
        const firstDay = new Date(year, month - 1, 1).getDay();
        const totalDays = new Date(year, month, 0).getDate();

        // Empty slots for previous month's days
        for (let i = 0; i < firstDay; i++) {
            weatherHtml += `<div class="calendar-day empty"></div>`;
        }

        // Display daily weather
        data.daily.time.forEach((date, index) => {
            const day = new Date(date).getDate();
            weatherHtml += `
                <div class='calendar-day'>
                    <h4>${day}</h4>
                    <p>🌡 ${data.daily.temperature_2m_max[index]}°C</p>
                    <p>❄ ${data.daily.temperature_2m_min[index]}°C</p>
                    <p>🌧 ${data.daily.precipitation_sum[index]}mm</p>
                </div>
            `;
        });

        weatherHtml += "</div></div>";
        weatherContainer.innerHTML = weatherHtml;
    }

    document.querySelector(".search button").addEventListener("click", function () {
        const city = cityInput.value.trim();
        if (city) getWeather(city, new Date().getMonth() + 1);
        else alert("Please enter a city name.");
    });

    createMonthButtons();

    // Auto-load weather data for Biên Hòa
    const defaultCity = "Biên Hòa";
    const currentMonth = new Date().getMonth() + 1;
    getWeather(defaultCity, currentMonth);
});
