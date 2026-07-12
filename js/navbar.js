/*
=========================================
TOOLXONE CORE
Universal Category Navbar
Version 3.0
=========================================
*/

function initializeNavbar() {
    const navbar =
        document.getElementById("navbar");

    if (
        !navbar ||
        typeof TOOLXONE === "undefined"
    ) {
        return;
    }

    const currentPage =
        window.location.pathname
            .split("/")
            .pop() ||
        "index.html";

    navbar.innerHTML = `
        <nav class="ToolXone-navbar">

            <!-- =====================================
                 MOBILE STICKY TOP ROW
                 ===================================== -->

            <div class="mobile-nav-top">

                <a
    href="index.html"
    class="mobile-brand"
    aria-label="ToolXone Home">

    <img
        src="images/toolxone-logo.jpg"
        alt="ToolXone"
        class="mobile-brand-logo">

</a>

                <div class="mobile-nav-actions">

                    <button
    type="button"
    class="mobile-search-btn"
    id="mobileSearchBtn"
    aria-label="Open search"
    aria-expanded="false">

    🔍

</button>

<div
    class="mobile-clock"
    id="mobileNavbarClock"
    aria-label="Current time">
</div>

<button
    type="button"
    class="mobile-menu-btn"
    id="mobileMenuBtn"
    aria-label="Open navigation menu"
    aria-expanded="false">

    ☰

</button>

                </div>

            </div>


            <!-- =====================================
                 MOBILE SEARCH ROW
                 ===================================== -->

            <div
                class="mobile-search-panel"
                id="mobileSearchPanel">

                <div class="mobile-search-inner">

                    <span class="mobile-search-icon">
                        🔍
                    </span>

                    <input
                        type="search"
                        id="mobileToolSearch"
                        class="mobile-tool-search"
                        placeholder="Search ToolXone tools..."
                        autocomplete="off"
                        enterkeyhint="search"
                        aria-label="Search ToolXone tools">

                    <button
                        type="button"
                        class="mobile-search-close"
                        id="mobileSearchClose"
                        aria-label="Close search">

                        ✕

                    </button>

                </div>

                <div
                    id="mobileSearchResults"
                    class="search-results mobile-search-results">
                </div>

            </div>


            <!-- =====================================
                 DESKTOP + MOBILE MENU PANEL
                 ===================================== -->

            <div
                class="mobile-nav-panel"
                id="mobileNavPanel">

                <a
                    href="index.html"
                    class="nav-link ${
                        currentPage === "index.html"
                            ? "active"
                            : ""
                    }">

                    🏠 Home

                </a>

                ${buildCategoryMenus(currentPage)}

                <a
                    href="index.html#dashboard"
                    class="nav-link">

                    ⭐ Featured

                </a>

                <a
                    href="index.html#whats-new"
                    class="nav-link">

                    🆕 New

                </a>


                <!-- CLOCK -->

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


                <!-- DESKTOP SEARCH -->

                <div class="search-container desktop-search-container">

                    <input
                        type="search"
                        id="toolSearch"
                        class="tool-search"
                        placeholder="🔍 Search Tool..."
                        autocomplete="off"
                        aria-label="Search ToolXone tools">

                    <div
                        id="searchResults"
                        class="search-results">
                    </div>

                </div>


                <!-- APPEARANCE -->

                <div class="appearance-menu">

                    <button
                        type="button"
                        class="theme-button">

                        🎨 Appearance ▾

                    </button>

                    <div class="appearance-dropdown">

                        <button
                            type="button"
                            id="lightTheme">

                            ☀️ Light

                        </button>

                        <button
                            type="button"
                            id="darkTheme">

                            🌙 Dark

                        </button>

                        <div class="coming-theme">
                            More Themes Soon...
                        </div>

                    </div>

                </div>

            </div>

        </nav>
    `;

    initializeMobileNavbar();
    initializeMobileNavbarClock();
    initializeMobileSearchBridge();
}
/* =========================================
   MOBILE CLOCK
========================================= */

function initializeMobileNavbarClock() {
    const mobileClock =
        document.getElementById(
            "mobileNavbarClock"
        );

    if (!mobileClock) {
        return;
    }

    function updateMobileClock() {
        const now = new Date();

        mobileClock.textContent =
            now.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
    }

    updateMobileClock();

    window.setInterval(
        updateMobileClock,
        1000
    );
}

/* =========================================
   MOBILE NAVBAR CONTROLS
========================================= */

function initializeMobileNavbar() {
    const mobileMenuBtn =
        document.getElementById(
            "mobileMenuBtn"
        );

    const mobileNavPanel =
        document.getElementById(
            "mobileNavPanel"
        );

    const mobileSearchBtn =
        document.getElementById(
            "mobileSearchBtn"
        );

    const mobileSearchPanel =
        document.getElementById(
            "mobileSearchPanel"
        );

    const mobileSearchClose =
        document.getElementById(
            "mobileSearchClose"
        );

    const mobileToolSearch =
        document.getElementById(
            "mobileToolSearch"
        );

    if (
        mobileMenuBtn &&
        mobileNavPanel
    ) {
        mobileMenuBtn.addEventListener(
            "click",
            () => {
                const isOpening =
                    !mobileNavPanel
                        .classList
                        .contains("active");

                closeMobileSearch();

                mobileNavPanel.classList.toggle(
                    "active",
                    isOpening
                );

                mobileMenuBtn.textContent =
                    isOpening
                        ? "✕"
                        : "☰";

                mobileMenuBtn.setAttribute(
                    "aria-expanded",
                    String(isOpening)
                );
            }
        );
    }

    if (
        mobileSearchBtn &&
        mobileSearchPanel
    ) {
        mobileSearchBtn.addEventListener(
            "click",
            () => {
                const isOpening =
                    !mobileSearchPanel
                        .classList
                        .contains("active");

                closeMobileMenu();

                mobileSearchPanel.classList.toggle(
                    "active",
                    isOpening
                );

                mobileSearchBtn.textContent =
                    isOpening
                        ? "✕"
                        : "🔍";

                mobileSearchBtn.setAttribute(
                    "aria-expanded",
                    String(isOpening)
                );

                if (
                    isOpening &&
                    mobileToolSearch
                ) {
                    window.setTimeout(
                        () => {
                            mobileToolSearch.focus();
                        },
                        180
                    );
                }
            }
        );
    }

    mobileSearchClose?.addEventListener(
        "click",
        closeMobileSearch
    );

    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                closeMobileMenu();
                closeMobileSearch();
            }
        }
    );

    document.addEventListener(
        "click",
        event => {
            const navbar =
                document.querySelector(
                    ".ToolXone-navbar"
                );

            if (
                navbar &&
                !navbar.contains(event.target)
            ) {
                closeMobileMenu();
                closeMobileSearch();
            }
        }
    );


    function closeMobileMenu() {
        if (
            !mobileNavPanel ||
            !mobileMenuBtn
        ) {
            return;
        }

        mobileNavPanel.classList.remove(
            "active"
        );

        mobileMenuBtn.textContent =
            "☰";

        mobileMenuBtn.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    function closeMobileSearch() {
        if (
            !mobileSearchPanel ||
            !mobileSearchBtn
        ) {
            return;
        }

        mobileSearchPanel.classList.remove(
            "active"
        );

        mobileSearchBtn.textContent =
            "🔍";

        mobileSearchBtn.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    initializeMobileCategoryAccordion();
    
    window.ToolXoneMobileNavbar = {
        closeMenu: closeMobileMenu,
        closeSearch: closeMobileSearch
    };
}

/* =========================================
   MOBILE CATEGORY ACCORDION
========================================= */

function initializeMobileCategoryAccordion() {
    const categoryMenus = [
        ...document.querySelectorAll(
            ".mobile-nav-panel .category-menu"
        )
    ];

    if (!categoryMenus.length) {
        return;
    }

    categoryMenus.forEach(menu => {
        const button =
            menu.querySelector(".category-btn");

        const dropdown =
            menu.querySelector(".category-dropdown");

        if (!button || !dropdown) {
            return;
        }

        button.setAttribute(
            "aria-expanded",
            "false"
        );

        dropdown.setAttribute(
            "aria-hidden",
            "true"
        );

        button.addEventListener(
            "click",
            event => {
                if (
                    window.innerWidth > 1400
                ) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                const isOpen =
                    menu.classList.contains(
                        "is-open"
                    );

                categoryMenus.forEach(
                    otherMenu => {
                        if (
                            otherMenu === menu
                        ) {
                            return;
                        }

                        closeCategoryMenu(
                            otherMenu
                        );
                    }
                );

                if (isOpen) {
                    closeCategoryMenu(menu);
                } else {
                    openCategoryMenu(menu);
                }
            }
        );
    });

    function openCategoryMenu(menu) {
        const button =
            menu.querySelector(".category-btn");

        const dropdown =
            menu.querySelector(".category-dropdown");

        if (!button || !dropdown) {
            return;
        }

        menu.classList.add("is-open");

        button.setAttribute(
            "aria-expanded",
            "true"
        );

        dropdown.setAttribute(
            "aria-hidden",
            "false"
        );

        dropdown.style.maxHeight =
            `${dropdown.scrollHeight}px`;
    }

    function closeCategoryMenu(menu) {
        const button =
            menu.querySelector(".category-btn");

        const dropdown =
            menu.querySelector(".category-dropdown");

        if (!button || !dropdown) {
            return;
        }

        menu.classList.remove("is-open");

        button.setAttribute(
            "aria-expanded",
            "false"
        );

        dropdown.setAttribute(
            "aria-hidden",
            "true"
        );

        dropdown.style.maxHeight =
            "0px";
    }

    window.addEventListener(
        "resize",
        () => {
            if (
                window.innerWidth > 1400
            ) {
                categoryMenus.forEach(
                    menu => {
                        const dropdown =
                            menu.querySelector(
                                ".category-dropdown"
                            );

                        menu.classList.remove(
                            "is-open"
                        );

                        if (dropdown) {
                            dropdown.style.maxHeight =
                                "";
                        }
                    }
                );
            } else {
                categoryMenus.forEach(
                    menu => {
                        if (
                            !menu.classList.contains(
                                "is-open"
                            )
                        ) {
                            const dropdown =
                                menu.querySelector(
                                    ".category-dropdown"
                                );

                            if (dropdown) {
                                dropdown.style.maxHeight =
                                    "0px";
                            }
                        }
                    }
                );
            }
        }
    );
}

/* =========================================
   MOBILE SEARCH BRIDGE
   Reuses the existing desktop search logic
========================================= */

/* =========================================
   MOBILE SEARCH ENGINE
   Creates real clickable results
========================================= */

function initializeMobileSearchBridge() {
    const mobileSearch =
        document.getElementById(
            "mobileToolSearch"
        );

    const mobileResults =
        document.getElementById(
            "mobileSearchResults"
        );

    if (
        !mobileSearch ||
        !mobileResults ||
        typeof TOOLXONE === "undefined"
    ) {
        return;
    }

    const tools = [];

    TOOLXONE.categories.forEach(
        category => {
            category.tools.forEach(
                tool => {
                    tools.push(tool);
                }
            );
        }
    );

    mobileSearch.addEventListener(
        "input",
        () => {
            const query =
                mobileSearch.value
                    .toLowerCase()
                    .trim();

            mobileResults.innerHTML = "";

            if (!query) {
                mobileResults.style.display =
                    "none";

                return;
            }

            const matches =
                tools.filter(tool => {
                    return tool.name
                        .toLowerCase()
                        .includes(query);
                });

            matches.forEach(tool => {
                const item =
                    document.createElement(
                        "button"
                    );

                item.type = "button";
                item.className =
                    "search-item mobile-search-item";

                item.textContent =
                    `${tool.icon} ${tool.name}`;

                item.addEventListener(
                    "click",
                    () => {
                        mobileResults.style.display =
                            "none";

                        mobileSearch.value = "";

                        window.ToolXoneMobileNavbar
                            ?.closeSearch();

                        window.location.href =
                            tool.link;
                    }
                );

                mobileResults.appendChild(
                    item
                );
            });

            mobileResults.style.display =
                matches.length
                    ? "block"
                    : "none";
        }
    );

    mobileSearch.addEventListener(
        "keydown",
        event => {
            if (event.key !== "Enter") {
                return;
            }

            const firstResult =
                mobileResults.querySelector(
                    ".mobile-search-item"
                );

            firstResult?.click();
        }
    );
}


function copySearchResults(
    source,
    destination
) {
    if (
        !source ||
        !destination
    ) {
        return;
    }

    destination.innerHTML =
        source.innerHTML;

    destination.classList.toggle(
        "active",
        source.classList.contains(
            "active"
        ) ||
        Boolean(
            source.innerHTML.trim()
        )
    );
}


/* =========================================
   CATEGORY MENU BUILDER
========================================= */

function buildCategoryMenus(
    currentPage
) {
    return TOOLXONE.categories
        .map(category => {
            const categoryHasActiveTool =
                category.tools.some(
                    tool =>
                        tool.link ===
                        currentPage
                );

            return `
                <div class="category-menu">

                    <button class="category-btn ${categoryHasActiveTool ? "active" : ""}" type="button">
    ${category.icon} ${shortCategoryName(category.name)}

    </button>

                    <div class="category-dropdown">

                        ${category.tools
                            .map(tool => {
                                return `
                                    <a
                                        href="${tool.link}"
                                        class="${
                                            tool.link ===
                                            currentPage
                                                ? "active"
                                                : ""
                                        }">

                                        ${tool.icon}
                                        ${tool.name}

                                    </a>
                                `;
                            })
                            .join("")}

                    </div>

                </div>
            `;
        })
        .join("");
}


function shortCategoryName(name) {
    return name
        .replace(" Tools", "")
        .replace(
            "Health Tools",
            "Health"
        );
}