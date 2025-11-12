// src/shared/theme/theme-util.js

// KEY used for persistence
const THEME_KEY = 'theme-mode';

// returns true if dark, false if light
export function isDarkMode() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === null) return true; // default dark mode
    return stored === 'dark';
}

export function applyTheme() {
    const dark = isDarkMode();
    document.body.classList.toggle('light-mode', !dark);
}

export function toggleTheme() {
    const dark = isDarkMode();
    const newMode = dark ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, newMode);

    applyTheme();
}
