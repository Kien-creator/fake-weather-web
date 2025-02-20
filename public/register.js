document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const API_URL = window.location.hostname.includes("localhost")
        ? "http://localhost:5000"
        : "https://fake-weather-web.onrender.com";

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        
        if (res.ok) {
            alert("Registration successful! Redirecting to login...");
            window.location.href = "login.html"; // Chuyển về trang đăng nhập
        } else {
            alert(data.message); // Hiển thị lỗi từ backend
        }

    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
    }
});
