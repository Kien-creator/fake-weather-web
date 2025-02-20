document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must log in first!");
        window.location.href = "login.html";
    }

    // Fetch user info
    const res = await fetch("https://fake-weather-web.onrender.com/user", {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok) {
        document.getElementById("username").textContent = data.name;
    } else {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
});

// Logout function
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
