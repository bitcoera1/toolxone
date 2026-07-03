/*
=========================================
TOOLXONE CORE
Appearance / Theme Engine
Version 2.1
=========================================
*/

function initializeTheme() {

    const lightButton = document.getElementById("lightTheme");
    const darkButton = document.getElementById("darkTheme");

    if (!lightButton || !darkButton) return;

    const savedTheme = localStorage.getItem("toolxone-theme") || "light";

    applyTheme(savedTheme);

    lightButton.addEventListener("click", () => {
        applyTheme("light");
    });

    darkButton.addEventListener("click", () => {
        applyTheme("dark");
    });
}

function applyTheme(theme) {

    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }

    localStorage.setItem("toolxone-theme", theme);
}