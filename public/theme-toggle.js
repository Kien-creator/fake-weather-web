document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme");
    const body = document.body;

    // Check and apply saved theme from localStorage
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-theme");
        themeToggle.checked = true;
    }

    // Toggle theme and save preference
    themeToggle.addEventListener("change", function () {
        if (this.checked) {
            body.classList.add("dark-theme");
            localStorage.setItem("theme", "dark");
        } else {
            body.classList.remove("dark-theme");
            localStorage.setItem("theme", "light");
        }
    });
});
