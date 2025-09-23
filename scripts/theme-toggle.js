// public/scripts/theme-toggle.js
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('#theme-toggle-btn');
    const body = document.body;

    // function to update button text and emoji
    const updateButtonText = () => {
        if (body.classList.contains('light-mode')) {
            toggleBtn.textContent = '🌙 Dark Mode';
        } else {
            toggleBtn.textContent = '🌞 Light Mode';
        }
    };

    if (toggleBtn) {
        // Initial text update when the page loads
        updateButtonText();

        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            // Update the button text immediately after toggling
            updateButtonText();
        });
    }
});