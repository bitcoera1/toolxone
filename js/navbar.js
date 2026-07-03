/*
=========================================
TOOLXONE CORE
Universal Category Navbar
Version 2.1
=========================================
*/

function initializeNavbar() {
    const navbar = document.getElementById("navbar");

    if (!navbar || typeof TOOLXONE === "undefined") return;

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    navbar.innerHTML = `
        <nav class="ToolXone-navbar">
            <a href="index.html" class="nav-link ${currentPage === "index.html" ? "active" : ""}">
                🏠 Home
            </a>

            ${buildCategoryMenus(currentPage)}

            <a href="#" class="nav-link">⭐ Featured</a>
            <a href="#" class="nav-link">🆕 New</a>

<div class="ToolXone-clock-container">

<div
class="ToolXone-clock"
id="toolxoneClock">
</div>

<div
class="clock-tooltip"
id="clockTooltip">

<div id="clockDay"></div>

<div id="clockDate"></div>

<div id="clockLocation"></div>

<div id="clockZone"></div>

<div id="clockUTC"></div>

</div>

</div>

<div class="search-container">

<input
type="text"
id="toolSearch"
class="tool-search"
placeholder="🔍 Search Tool...">

<div
id="searchResults"
class="search-results">
</div>

</div>
<div class="appearance-menu">

<button
class="theme-button">

🎨 Appearance ▾

</button>

<div class="appearance-dropdown">

<button id="lightTheme">

☀️ Light

</button>

<button id="darkTheme">

🌙 Dark

</button>

<div class="coming-theme">

More Themes Soon...

</div>

</div>

</div>
        </nav>
    `;
}

function buildCategoryMenus(currentPage) {
    return TOOLXONE.categories.map(category => {
        const categoryHasActiveTool = category.tools.some(tool => tool.link === currentPage);

        return `
            <div class="category-menu">
                <button class="category-btn ${categoryHasActiveTool ? "active" : ""}" type="button">
                    ${category.icon} ${shortCategoryName(category.name)} ▾
                </button>

                <div class="category-dropdown">
                    ${category.tools.map(tool => {
                        return `
                            <a href="${tool.link}" class="${tool.link === currentPage ? "active" : ""}">
                                ${tool.icon} ${tool.name}
                            </a>
                        `;
                    }).join("")}
                </div>
            </div>
        `;
    }).join("");
}

function shortCategoryName(name) {
    return name
        .replace(" Tools", "")
        .replace("Health Tools", "Health");
}