function sendEmail(email) {
    const subject = encodeURIComponent("Hello from FakeWeather!");
    const body = encodeURIComponent("Hi, I would like to get in touch with you.");
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}
