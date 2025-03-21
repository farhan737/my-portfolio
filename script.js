document.addEventListener("DOMContentLoaded", function() {
    // Initialize navbar behavior
    initNavbar();
    
    // Add scroll event listener
    document.addEventListener("scroll", handleScroll);
});

function initNavbar() {
    // Set initial navbar state based on page
    const logo = document.getElementById("logo");
    const navText = document.getElementById("nav-text");
    
    if (!logo || !navText) return;
    
    // Default state - dark theme
    logo.src = "dark-logo.gif";
    navText.style.color = "#fff";
    
    // Add active class highlighting
    highlightActiveNavLink();
}

function handleScroll() {
    const logo = document.getElementById("logo");
    const navText = document.getElementById("nav-text");
    const darkSection = document.querySelector(".dark-theme");
    const lightSection = document.querySelector(".light-theme");
    
    // If elements don't exist or we're not on the homepage, exit early
    if (!logo || !navText) return;
    if (!darkSection || !lightSection) return;
    
    try {
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
    } catch (error) {
        console.error("Error in navbar scroll handling:", error);
        // Fallback to default state
        logo.src = "dark-logo.gif";
        navText.style.color = "#fff";
    }
}

function highlightActiveNavLink() {
    // Get current page path
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';
    
    // Find all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // If this link matches current page, add active class
        const href = link.getAttribute('href');
        if (href === pageName || 
            (pageName === 'index.html' && href === '') || 
            (pageName === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}
