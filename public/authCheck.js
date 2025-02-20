document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const dashboardBtn = document.getElementById("dashboard-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const navLinks = document.querySelector(".nav-links");

    if (token) {
        // User is logged in
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        dashboardBtn.style.display = "inline-block";
        logoutBtn.style.display = "inline-block";

        // Add extra navigation links for logged-in users
        const extraLinks = `
            <li><a href="monthlyweather.html">Monthly Weather</a></li>
            <li><a href="weathertrend.html">Weather Trends</a></li>
            <li><a href="weatherdetails.html">Weather Details</a></li>
        `;

        // Prevent duplicate entries if script runs multiple times
        if (!document.getElementById("extra-links")) {
            const extraNav = document.createElement("ul");
            extraNav.id = "extra-links";
            extraNav.innerHTML = extraLinks;
            navLinks.appendChild(extraNav);
        }
    } else {
        // User is not logged in
        loginBtn.style.display = "inline-block";
        registerBtn.style.display = "inline-block";
        dashboardBtn.style.display = "none";
        logoutBtn.style.display = "none";

        // Remove extra links if user logs out
        const extraNav = document.getElementById("extra-links");
        if (extraNav) {
            extraNav.remove();
        }
    }
});

// Logout function
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
