/*
==========================================================
TOOLXONE PDF TOOLS HUB
Version 2.0.0
==========================================================

RESPONSIBILITY
----------------------------------------------------------
- PDF ecosystem hub orchestration
- PDF category navigation
- Featured PDF tool rendering
- PDF category rendering
- PDF tool lookup
- PDF tool navigation
- Search/filter support
- Empty-section protection

IMPORTANT
----------------------------------------------------------
- PDF tools are managed exclusively through
  ToolXonePDFRegistry
- PDF tools are NOT read from ToolXoneToolsRegistry
- PDF tools are NOT registered in the original
  ToolXoneToolsRegistry
- This module must remain isolated from the
  original 20-tool architecture

==========================================================
*/


(function (window, document) {

    "use strict";


    /* ======================================================
       CONSTANTS
    ====================================================== */

    const VERSION = "2.0.0";

    const PDF_CATEGORY_ID = "pdf";


    /* ======================================================
       PDF REGISTRY ACCESS
    ====================================================== */

    function getPDFRegistry() {

        return (
            window.ToolXonePDFRegistry ||
            null
        );

    }


    function getPDFRegistryTools() {

        const registry =
            getPDFRegistry();

        if (
            !registry ||
            !registry.tools
        ) {

            return [];

        }


        return Object.values(
            registry.tools
        );

    }


    /* ======================================================
       PDF CATEGORY CONFIG ACCESS
    ====================================================== */

    function getConfig() {

        return (
            window.ToolXonePDFCategory ||
            null
        );

    }


    /* ======================================================
       PDF TOOL LOOKUP
    ====================================================== */

    function getTool(id) {

        if (!id) {
            return null;
        }


        /*
        ------------------------------------------------------
        Prefer the dedicated PDF registry resolver.
        ------------------------------------------------------
        */

        if (
            typeof window.getPDFTool ===
            "function"
        ) {

            const tool =
                window.getPDFTool(id);

            if (tool) {
                return tool;
            }

        }


        /*
        ------------------------------------------------------
        Defensive registry fallback.
        ------------------------------------------------------
        */

        return (
            getPDFRegistryTools()
                .find(
                    function (tool) {

                        return (
                            tool &&
                            tool.id === id
                        );

                    }
                ) ||
            null
        );

    }


    /* ======================================================
       PDF TOOL TEST
    ====================================================== */

    function isPDFTool(tool) {

        if (!tool) {
            return false;
        }


        return (
            tool.categoryId === PDF_CATEGORY_ID ||
            tool.category === PDF_CATEGORY_ID ||
            getPDFRegistryTools()
                .some(
                    function (registeredTool) {

                        return (
                            registeredTool &&
                            registeredTool.id ===
                                tool.id
                        );

                    }
                )
        );

    }


    /* ======================================================
       GET ALL PDF TOOLS
    ====================================================== */

    function getPDFTools() {

        return getPDFRegistryTools()
            .filter(
                function (tool) {

                    return (
                        isPDFTool(tool) &&
                        tool.status !== "inactive"
                    );

                }
            );

    }


    /* ======================================================
       GET PDF CATEGORIES
    ====================================================== */

    function getCategories() {

        const config =
            getConfig();


        if (
            !config ||
            !Array.isArray(
                config.subcategories
            )
        ) {

            return [];

        }


        return [
            ...config.subcategories
        ].sort(
            function (a, b) {

                return (
                    Number(a.order || 0) -
                    Number(b.order || 0)
                );

            }
        );

    }


    /* ======================================================
       GET CATEGORY
    ====================================================== */

    function getCategory(id) {

        if (!id) {
            return null;
        }


        return (
            getCategories()
                .find(
                    function (category) {

                        return (
                            category &&
                            category.id === id
                        );

                    }
                ) ||
            null
        );

    }


    /* ======================================================
       GET TOOLS BY CATEGORY
    ====================================================== */

    function getToolsByCategory(
        categoryId
    ) {

        const category =
            getCategory(categoryId);


        if (!category) {
            return [];
        }


        const toolIds =
            Array.isArray(category.tools)
                ? category.tools
                : [];


        return toolIds
            .map(
                function (id) {

                    return getTool(id);

                }
            )
            .filter(
                function (tool) {

                    return (
                        tool &&
                        tool.status !== "inactive"
                    );

                }
            );

    }


    /* ======================================================
       GET FEATURED PDF TOOLS
    ====================================================== */

    function getPopularTools() {

        const config =
            getConfig();


        if (
            !config ||
            !Array.isArray(
                config.featuredTools
            )
        ) {

            return [];

        }


        return config.featuredTools
            .map(
                function (id) {

                    return getTool(id);

                }
            )
            .filter(
                function (tool) {

                    return (
                        tool &&
                        tool.status !== "inactive"
                    );

                }
            );

    }


    /* ======================================================
       SHARED TOOL CARD ACCESS
    ====================================================== */

    function getToolCards() {

        if (
            window.ToolXoneToolCards &&
            typeof
                window.ToolXoneToolCards
                    .createToolCard ===
                "function"
        ) {

            return window.ToolXoneToolCards;

        }


        return null;

    }


    /* ======================================================
       CREATE PDF TOOL CARD
    ====================================================== */

    function createToolCard(tool) {

        if (!tool) {
            return "";
        }


        /*
        ------------------------------------------------------
        Use the existing shared ToolXone card presentation
        system when available.

        IMPORTANT:
        This only uses the PRESENTATION layer.

        It does NOT read from or modify the original
        ToolXoneToolsRegistry.
        ------------------------------------------------------
        */

        const cards =
            getToolCards();


        if (
            cards &&
            typeof cards.createToolCard ===
                "function"
        ) {

            return cards.createToolCard({
                ...tool,
                url: tool.url || tool.file
            });

        }


        /*
        ------------------------------------------------------
        PDF-only defensive fallback.

        This is intentionally small and does not create
        another global card architecture.
        ------------------------------------------------------
        */

        const title =
            tool.name ||
            "PDF Tool";


        const description =
            tool.description ||
            `Quick access to ${title}.`;


        const url =
            tool.url ||
            tool.file ||
            "#";


        const icon =
            tool.icon ||
            "📄";


        return `
            <div class="tool-card">

                <div class="tool-icon">
                    ${icon}
                </div>

                <h3>
                    ${title}
                </h3>

                <p>
                    ${description}
                </p>

                <a href="${url}">
                    Open Tool →
                </a>

            </div>
        `;

    }


    /* ======================================================
       RENDER TOOLS
    ====================================================== */

    function renderTools(
        container,
        tools
    ) {

        if (!container) {
            return 0;
        }


        container.innerHTML = "";


        if (
            !Array.isArray(tools) ||
            tools.length === 0
        ) {

            return 0;

        }


        const html =
            tools
                .map(
                    function (tool) {

                        return createToolCard(
                            tool
                        );

                    }
                )
                .filter(Boolean)
                .join("");


        container.innerHTML =
            html;


        return container.children.length;

    }


    /* ======================================================
       SET SECTION VISIBILITY
    ====================================================== */

    function setSectionVisibility(
        section,
        visible
    ) {

        if (!section) {
            return;
        }


        section.hidden =
            !visible;


        section.setAttribute(
            "aria-hidden",
            String(!visible)
        );

    }


    /* ======================================================
       RENDER CATEGORY HEADING
    ====================================================== */

    function renderCategoryHeading(
        category
    ) {

        if (!category) {
            return "";
        }


        return `
            <span class="pdf-section-label">
                ${category.icon || "📄"}
                ${category.name || "PDF Tools"}
            </span>

            <h2>
                ${category.name || "PDF Tools"}
            </h2>

            <p>
                ${
                    category.description ||
                    "Explore practical PDF tools from ToolXone."
                }
            </p>
        `;

    }


    /* ======================================================
       RENDER CATEGORY
    ====================================================== */

    function renderCategory(
        container,
        categoryId
    ) {

        if (!container) {
            return 0;
        }


        const tools =
            getToolsByCategory(
                categoryId
            );


        return renderTools(
            container,
            tools
        );

    }


    /* ======================================================
       INITIALIZE CATEGORY SECTIONS
    ====================================================== */

    function initializeCategorySections() {

        const categories =
            getCategories();


        categories.forEach(
            function (category) {

                const section =
                    document.getElementById(
                        `pdf-${category.id}`
                    );


                if (!section) {
                    return;
                }


                const heading =
                    document.getElementById(
                        `pdf-${category.id}-heading`
                    );


                const container =
                    document.getElementById(
                        `pdf-${category.id}-tools`
                    );


                if (heading) {

                    heading.innerHTML =
                        renderCategoryHeading(
                            category
                        );

                }


                const count =
                    renderCategory(
                        container,
                        category.id
                    );


                /*
                ------------------------------------------------
                Critical quality rule:

                A section with zero valid PDF tools
                must not remain visible.
                ------------------------------------------------
                */

                setSectionVisibility(
                    section,
                    count > 0
                );

            }
        );

    }


    /* ======================================================
       INITIALIZE FEATURED TOOLS
    ====================================================== */

    function initializeFeaturedTools() {

        const section =
            document.getElementById(
                "pdf-featured"
            );


        const container =
            document.getElementById(
                "pdfFeaturedTools"
            );


        if (
            !section ||
            !container
        ) {

            return;

        }


        const tools =
            getPopularTools();


        const count =
            renderTools(
                container,
                tools
            );


        setSectionVisibility(
            section,
            count > 0
        );

    }


    /* ======================================================
       CREATE CATEGORY NAVIGATION ITEM
    ====================================================== */

    function createCategoryNavigationItem(
        category
    ) {

        if (!category) {
            return "";
        }


        const targetId =
            `pdf-${category.id}`;


        return `
            <a
                href="#${targetId}"
                class="pdf-category-nav-item"
                data-pdf-category="${category.id}"
            >

                <span
                    class="pdf-category-nav-icon"
                    aria-hidden="true"
                >
                    ${category.icon || "📄"}
                </span>

                <span
                    class="pdf-category-nav-content"
                >

                    <strong>
                        ${category.name || "PDF Tools"}
                    </strong>

                    <small>
                        ${
                            category.description ||
                            "Explore PDF tools."
                        }
                    </small>

                </span>

            </a>
        `;

    }


    /* ======================================================
       INITIALIZE CATEGORY NAVIGATION
    ====================================================== */

    function initializeCategoryNavigation() {

        const container =
            document.getElementById(
                "pdfCategoryNav"
            );


        if (!container) {
            return;
        }


        const categories = getCategories().filter(function (category) {
            return getToolsByCategory(category.id).length > 0;
        });


        if (
            !Array.isArray(categories) ||
            categories.length === 0
        ) {

            container.innerHTML = "";

            return;

        }


        container.innerHTML =
            categories
                .map(
                    createCategoryNavigationItem
                )
                .filter(Boolean)
                .join("");


        /*
        ------------------------------------------------------
        Smooth navigation while preserving normal
        anchor behavior.
        ------------------------------------------------------
        */

        container
            .querySelectorAll(
                "[data-pdf-category]"
            )
            .forEach(
                function (link) {

                    link.addEventListener(
                        "click",
                        function () {

                            const id =
                                link.getAttribute(
                                    "data-pdf-category"
                                );


                            const section =
                                document.getElementById(
                                    `pdf-${id}`
                                );


                            if (section) {

                                section.scrollIntoView({
                                    behavior:
                                        "smooth",
                                    block:
                                        "start"
                                });

                            }

                        }
                    );

                }
            );

    }


    /* ======================================================
       SEARCH PDF TOOLS
    ====================================================== */

    function searchTools(query) {

        const tools =
            getPDFTools();


        const normalized =
            String(query || "")
                .trim()
                .toLowerCase();


        if (!normalized) {
            return tools;
        }


        return tools.filter(
            function (tool) {

                const name =
                    String(
                        tool.name || ""
                    ).toLowerCase();


                const description =
                    String(
                        tool.description || ""
                    ).toLowerCase();


                const keywords =
                    Array.isArray(
                        tool.keywords
                    )
                        ? tool.keywords
                            .join(" ")
                            .toLowerCase()
                        : "";


                return (
                    name.includes(normalized) ||
                    description.includes(normalized) ||
                    keywords.includes(normalized)
                );

            }
        );

    }


    /* ======================================================
       OPEN PDF TOOL
    ====================================================== */

    function openTool(id) {

        const tool =
            getTool(id);


        if (!tool) {
            return;
        }


        const url =
            tool.url ||
            tool.file ||
            null;


        if (url) {

            window.location.href =
                url;

        }

    }


    /* ======================================================
       INITIALIZE PDF HUB
    ====================================================== */

    function init() {

        /*
        ------------------------------------------------------
        Prevent accidental duplicate initialization.
        ------------------------------------------------------
        */

        if (
            document.documentElement
                .dataset
                .toolxonePdfInitialized ===
                "true"
        ) {

            return;

        }


        /*
        ------------------------------------------------------
        Safety check.

        PDF hub must not initialize against the original
        global registry.
        ------------------------------------------------------
        */

        if (
            !window.ToolXonePDFRegistry
        ) {

            console.warn(
                "ToolXone PDF Tools Hub: PDF registry unavailable."
            );

            return;

        }


        document.documentElement
            .dataset
            .toolxonePdfInitialized =
                "true";


        initializeCategoryNavigation();

        initializeFeaturedTools();

        initializeCategorySections();


        console.info(
            "ToolXone PDF Tools Hub initialized.",
            {
                version:
                    VERSION,

                categories:
                    getCategories().length,

                featuredTools:
                    getPopularTools().length,

                pdfTools:
                    getPDFTools().length
            }
        );

    }


    /* ======================================================
       PUBLIC API
    ====================================================== */

    const PDFTools = {

        name:
            "ToolXone PDF Tools Hub",

        version:
            VERSION,

        init,

        getTool,

        getPDFTools,

        isPDFTool,

        getCategories,

        getCategory,

        getToolsByCategory,

        getPopularTools,

        createToolCard,

        renderTools,

        renderCategory,

        searchTools,

        openTool

    };


    /* ======================================================
       GLOBAL EXPOSURE
    ====================================================== */

    window.ToolXonePDFTools =
        PDFTools;


    /* ======================================================
       DIAGNOSTICS
    ====================================================== */

    console.info(
        `ToolXone PDF Tools Hub v${VERSION} loaded.`
    );


})(window, document);