document.addEventListener("scroll", () => {
    const logo = document.getElementById("logo");
    const navText = document.getElementById("nav-text");
    const darkSection = document.querySelector(".dark-theme");
    const lightSection = document.querySelector(".light-theme");

    const darkRect = darkSection.getBoundingClientRect();
    const lightRect = lightSection.getBoundingClientRect();

    if (darkRect.top <= 60 && darkRect.bottom >= 60) {
      // Dark theme active
      logo.src = "dark-logo.gif"; // Light logo for dark theme
      navText.style.color = "#fff"; // White text for dark theme
    } else if (lightRect.top <= 60 && lightRect.bottom >= 60) {
      // Light theme active
      logo.src = "light-logo.gif"; // Dark logo for light theme
      navText.style.color = "#333"; // Dark text for light theme
    }
});
