document.addEventListener("DOMContentLoaded", function () {
    const termsLink = document.querySelector(".terms a"); // Link "Terms & Conditions"
    const termsModal = document.getElementById("termsModal");
    const agreeBtn = document.getElementById("agreeBtn");
    const closeBtn = document.getElementById("closeBtn");
    const termsCheckbox = document.getElementById("terms");

    // Ẩn modal khi mới tải trang
    termsModal.style.display = "none";

    // Mở modal khi nhấn vào "Terms & Conditions"
    termsLink.addEventListener("click", function (event) {
        event.preventDefault(); // Ngăn chặn load lại trang
        termsModal.style.display = "flex";
    });

    // Khi người dùng đồng ý
    agreeBtn.addEventListener("click", function () {
        termsCheckbox.checked = true; // Tự động tick checkbox
        termsModal.style.display = "none"; // Đóng modal
    });

    // Khi người dùng nhấn đóng
    closeBtn.addEventListener("click", function () {
        termsModal.style.display = "none";
    });

    // Ẩn modal nếu click ra ngoài
    window.addEventListener("click", function (event) {
        if (event.target === termsModal) {
            termsModal.style.display = "none";
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const googleBtn = document.querySelector(".google-btn");
    const githubBtn = document.querySelector(".github-btn");

    googleBtn.addEventListener("click", function () {
        alert("Google login is in development. Please try again later.");
    });

    githubBtn.addEventListener("click", function () {
        alert("GitHub login is in development. Please try again later.");
    });
});

// Xử lý submit form
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

    const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    alert(data.message);
});
