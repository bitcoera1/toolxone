/*
=========================================
TOOLXONE CORE APP
=========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 ToolXone Core Initializing...");

    if (typeof initializeNavbar === "function") {
        initializeNavbar();
    }

    if (typeof initializeCounters === "function") {
        initializeCounters();
    }

    if (typeof initializeClock === "function") {
        initializeClock();
    }

    if (typeof initializeTheme === "function") {
        initializeTheme();
    }

    if (typeof initializeSearch === "function") {
        initializeSearch();
    }

    if (typeof initializeToolCards === "function") {
        initializeToolCards();
    }

    if (typeof initializeNewTools === "function") {
        initializeNewTools();
    }
if (typeof initializeRecommendedTools === "function") {
    initializeRecommendedTools();
}
if (typeof initializeCategoryCards === "function") {
    initializeCategoryCards();
}
if (typeof initializeCategoryToolSections === "function") {
    initializeCategoryToolSections();
}
const currentToolId = document.body.dataset.tool;

if (typeof initializeRelatedTools === "function" && currentToolId) {
    initializeRelatedTools(currentToolId);
}
function revealOnScroll() {
    const reveals = document.querySelectorAll(".reveal");

    reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 120;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

    const exploreBtn = document.getElementById("exploreToolsBtn");

    if (exploreBtn) {
        exploreBtn.addEventListener("click", () => {
            document.getElementById("dashboard").scrollIntoView({
                behavior: "smooth"
            });
        });
    }

    console.log("✅ ToolXone Loaded Successfully");

});
