document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.navbar__toggle');
    const navbar = document.querySelector('.navbar');

    toggleButton.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });
});