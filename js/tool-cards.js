/*
=========================================
TOOLXONE
Smart Tool Cards Generator
Version 2.5 Clean
=========================================
*/

function getAllTools() {
    const allTools = [];

    if (typeof TOOLXONE === "undefined") return allTools;

    TOOLXONE.categories.forEach(category => {
        category.tools.forEach(tool => {
            allTools.push({
                ...tool,
                categoryIcon: category.icon,
                categoryName: category.name
            });
        });
    });

    return allTools;
}
function getToolById(id) {

    return getAllTools().find(tool => tool.id === id);

}

function createToolCard(tool, options = {}) {
    const badges = options.badges || "";
    const extraClass = options.extraClass || "";
    const description = options.description || `Quick access to ${tool.name.toLowerCase()}.`;

    return `
        <div class="tool-card ${extraClass}">
            <div class="card-badges">
                ${badges}
            </div>

            <div class="tool-icon">${tool.icon}</div>

            <span class="tool-category">
                ${tool.categoryIcon} ${tool.categoryName}
            </span>

            <h3>${tool.name}</h3>

            <p>${description}</p>

            <a href="${tool.link}">
                Open Tool →
            </a>
        </div>
    `;
}

function initializeToolCards() {
    const container = document.getElementById("toolCards");

    if (!container || typeof TOOLXONE === "undefined") return;

    container.innerHTML = getAllTools().map(tool => {
        const isFeatured = TOOLXONE.featuredTools.includes(tool.id);
        const isNew = TOOLXONE.newestTools.includes(tool.id);

        const badges = `
            ${isFeatured ? `<span class="badge featured-badge">⭐ Featured</span>` : ""}
            ${isNew ? `<span class="badge new-badge">🆕 New</span>` : ""}
        `;

        return createToolCard(tool, {
            badges,
            extraClass: tool.id === "scientific" ? "hero-featured-card" : ""
        });
    }).join("");
}

function initializeNewTools() {
    const container = document.getElementById("newTools");

    if (!container || typeof TOOLXONE === "undefined") return;

    const newTools = getAllTools().filter(tool =>
        TOOLXONE.newestTools.includes(tool.id)
    );

    container.innerHTML = newTools.map(tool => {
        return createToolCard(tool, {
            badges: `<span class="badge new-badge">🆕 New</span>`,
            description: "Recently added to ToolXone."
        });
    }).join("");
}

function initializeRecommendedTools() {
    const container = document.getElementById("recommendedTools");

    if (!container || typeof TOOLXONE === "undefined") return;

    const recommended = getAllTools()
        .filter(tool =>
            !TOOLXONE.newestTools.includes(tool.id) &&
            !TOOLXONE.featuredTools.includes(tool.id)
        )
        .slice(0, 4);

    container.innerHTML = recommended.map(tool => {
        return createToolCard(tool, {
            description: "You may also find this useful."
        });
    }).join("");
}

function initializeCategoryCards() {
    const container = document.getElementById("categoryCards");

    if (!container || typeof TOOLXONE === "undefined") return;

    container.innerHTML = TOOLXONE.categories.map(category => `
        <div class="category-card" onclick="scrollToCategory('${category.id}')">
            <div class="cat-icon">${category.icon}</div>
            <h3>${category.name}</h3>
            <p>${category.tools.length} Tools</p>
        </div>
    `).join("");
}

/*
=========================================
TOOLXONE
Animated Statistics Counters
=========================================
*/

function initializeCounters() {
    const counters = document.querySelectorAll(".counter");

    if (!counters.length) return;

    let started = false;

    function startCounters() {
        const statsSection = document.getElementById("stats-section");

        if (!statsSection || started) return;

        const sectionTop = statsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight - 100;

        if (sectionTop < screenPosition) {
            started = true;

            counters.forEach(counter => {
                const target = +counter.getAttribute("data-target");
                let current = 0;
                const speed = 40;
                const increment = Math.ceil(target / speed);

                const updateCounter = () => {
                    current += increment;

                    if (current >= target) {
                        counter.textContent = target;
                    } else {
                        counter.textContent = current;
                        requestAnimationFrame(updateCounter);
                    }
                };

                updateCounter();
            });
        }
    }

    window.addEventListener("scroll", startCounters);
    setTimeout(startCounters, 300);
}
function scrollToCategory(categoryId) {
    const target = document.getElementById(categoryId);

    if (target) {
        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
function initializeCategoryToolSections() {
    const container = document.getElementById("category-tool-sections");

    if (!container || typeof TOOLXONE === "undefined") return;

    container.innerHTML = TOOLXONE.categories.map(category => `
        <section id="${category.id}" class="category-tool-section">

            <section class="featured-header">

                <div class="featured-badge-title">
                    ${category.icon} ${category.name.toUpperCase()}
                </div>

                <h2>${category.name}</h2>

                <p>
                    Explore all ${category.name.toLowerCase()} available on ToolXone.
                </p>

            </section>

            <div class="category-tools-grid">
                ${category.tools.map(tool => `
                    <div class="tool-card">

                        <div class="tool-icon">${tool.icon}</div>

                        <span class="tool-category">
                            ${category.icon} ${category.name}
                        </span>

                        <h3>${tool.name}</h3>

                        <p>Quick access to ${tool.name.toLowerCase()}.</p>

                        <a href="${tool.link}">
                            Open Tool →
                        </a>

                    </div>
                `).join("")}
            </div>

        </section>
    `).join("");
}
function initializeRelatedTools(currentToolId) {
    const container = document.getElementById("relatedTools");

    if (!container || typeof TOOLXONE === "undefined") return;

    const currentTool = getToolById(currentToolId);

    if (!currentTool || !currentTool.related) return;

    const relatedTools = currentTool.related
        .map(id => getToolById(id))
        .filter(Boolean);

    container.innerHTML = relatedTools.map(tool => {
        return createToolCard(tool, {
            description: `Related to ${currentTool.name}.`
        });
    }).join("");
}