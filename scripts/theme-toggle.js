// public/scripts/theme-toggle.js
import {isDarkMode, toggleTheme, applyTheme} from './theme-util.mjs';

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('#theme-toggle-btn');
    
    applyTheme();

    // function to update button text and emoji
    const updateButtonText = () => {
        if (isDarkMode()) {
            toggleBtn.textContent = '🌙 Dark Mode';
        } else {
            toggleBtn.textContent = '🌞 Light Mode';
        }
    };

    if (toggleBtn) {
        // Initial text update when the page loads
        updateButtonText();

        toggleBtn.addEventListener('click', () => {
            toggleTheme();
            updateButtonText();
        });
    }
});