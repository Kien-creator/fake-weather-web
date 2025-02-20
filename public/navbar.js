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
});