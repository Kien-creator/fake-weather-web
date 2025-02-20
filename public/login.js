document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("https://fake-weather-web.onrender.com/login.html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
        localStorage.setItem("token", data.token);  // Save token
        window.location.href = "dashboard.html";  // Redirect to dashboard
    } else {
        alert(data.message);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const googleBtn = document.querySelector(".google-btn");
    const githubBtn = document.querySelector(".github-btn");
    const forgotPasswordLink = document.querySelector(".forgot-password");

    googleBtn.addEventListener("click", function () {
        alert("Google login is in development. Please try again later.");
    });

    githubBtn.addEventListener("click", function () {
        alert("GitHub login is in development. Please try again later.");
    });
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", function (event) {
            event.preventDefault();
            alert("Forgot password feature is in development. Please try again later.");
        });
    }
});

