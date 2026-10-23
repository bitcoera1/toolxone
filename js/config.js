/*
==========================================================
TOOLXONE CORE CONFIG
Version 3.1.0
==========================================================

RESPONSIBILITY
----------------------------------------------------------
- Global ToolXone site configuration
- Theme configuration
- Featured tool configuration
- Newest tool configuration
- Category presentation
- Legacy compatibility access

IMPORTANT
----------------------------------------------------------
Tool definitions are NOT stored here.

The single source of truth is:

    ToolXoneToolsRegistry

This configuration intentionally resolves registry data
dynamically so script load order cannot create a stale
empty configuration.

==========================================================
*/


(function (window, document) {

    "use strict";


    /* ======================================================
       Registry Access
       ====================================================== */

    function getRegistry() {

        if (
            Array.isArray(
                window.ToolXoneToolsRegistry
            )
        ) {

            return window.ToolXoneToolsRegistry;

        }

        return [];

    }


    /* ======================================================
       Canonical Tool Lookup
       ====================================================== */

    function getTool(id) {

        const registry =
            getRegistry();

        return registry.find(function (tool) {

            return (
                tool &&
                tool.id === id
            );

        }) || null;

    }


    /* ======================================================
       Category Definitions
       ====================================================== */

    const categoryDefinitions = [

        {
            id: "finance",
            icon: "💰",
            name: "Finance Tools"
        },

        {
            id: "calculators",
            icon: "🧮",
            name: "Calculators"
        },

        {
            id: "converters",
            icon: "🔄",
            name: "Converters"
        },

        {
            id: "health",
            icon: "❤️",
            name: "Health Tools"
        },

        {
            id: "utilities",
            icon: "🛠️",
            name: "Utilities"
        },

        {
    id: "pdf",
    icon: "📄",
    name: "PDF Tools",

    presentation:
        "showcase",

    description:
        "PDF to Image and Image to PDF",

    link:
        "pdf-tools.html",

    cta:
        "Explore PDF Tools",

    capabilities: []
}
        
    ];


/* ======================================================
   Build Category Views
   ====================================================== */

function buildCategories() {

    const registry =
        getRegistry();


    return categoryDefinitions.map(
        function (category) {

            const tools =
                registry
                    .filter(function (tool) {

                        return (
                            tool &&
                            tool.categoryId ===
                                category.id &&
                            tool.active === true
                        );

                    })
                    .map(function (tool) {

                        return {

                            id:
                                tool.id,

                            icon:
                                tool.icon,

                            name:
                                tool.name,

                            link:
                                tool.url,

                            related:
                                Array.isArray(
                                    tool.related
                                )
                                    ? [
                                        ...tool.related
                                    ]
                                    : []

                        };

                    });


            return {

                id:
                    category.id,

                icon:
                    category.icon,

                name:
                    category.name,

                tools:
                    tools,

                presentation:
                    category.presentation ||
                    "standard",

                description:
                    category.description ||
                    "",

                link:
                    category.link ||
                    "",

                cta:
                    category.cta ||
                    "",

                capabilities:
                    Array.isArray(
                        category.capabilities
                    )
                        ? [
                            ...category.capabilities
                        ]
                        : []

            };

        }
    );

}

    /* ======================================================
       Featured Tool IDs
       ====================================================== */

    const featuredTools = [

        "retirement-calculator",

        "currency-profit-calculator",

        "inflation-calculator",

        "emi-calculator"

    ];


    /* ======================================================
       Newest Tool IDs
       ====================================================== */

    const newestTools = [

        "retirement-calculator",

        "currency-profit-calculator",

        "inflation-calculator"

    ];


    /* ======================================================
       Core Configuration
       ====================================================== */

    const TOOLXONE = {

        name:
            "ToolXone",

        version:
            "3.1.0",

        founder:
            "Tahir Aslam",

        year:
            2026,

        defaultTheme:
            "light",

        featuredTools:
            featuredTools,

        newestTools:
            newestTools

    };


    /* ======================================================
       DYNAMIC CANONICAL VIEWS
       ======================================================

       These getters intentionally resolve the registry at
       access time instead of initialization time.

       Therefore:

       config.js loads before registry
           OR
       registry loads before config.js

       both remain safe.

       ====================================================== */

    Object.defineProperties(

        TOOLXONE,

        {

            totalTools: {

                enumerable: true,

                configurable: false,

                get: function () {

                    return getRegistry().length;

                }

            },


            categories: {

                enumerable: true,

                configurable: false,

                get: function () {

                    return buildCategories();

                }

            }

        }

    );


    /* ======================================================
       Canonical Tool API
       ====================================================== */

    TOOLXONE.getTool =
        getTool;


    TOOLXONE.getAllTools =
        function () {

            return [
                ...getRegistry()
            ];

        };


    TOOLXONE.getCategories =
        function () {

            return buildCategories();

        };


    TOOLXONE.getFeaturedTools =
        function () {

            return featuredTools
                .map(function (id) {

                    return getTool(id);

                })
                .filter(Boolean);

        };


    TOOLXONE.getNewestTools =
        function () {

            return newestTools
                .map(function (id) {

                    return getTool(id);

                })
                .filter(Boolean);

        };


    /* ======================================================
       Global Exposure
       ====================================================== */

    window.TOOLXONE =
        TOOLXONE;


    /* ======================================================
       Diagnostics
       ====================================================== */

    console.info(
        "ToolXone Core Config v3.1.0 initialized."
    );

    /* ======================================================
       Google Analytics
       ====================================================== */

    (function () {

        const GA_ID =
            "G-WLY68C9N20";


        const script =
            document.createElement("script");


        script.async =
            true;


        script.src =
            "https://www.googletagmanager.com/gtag/js?id="
            + GA_ID;


        document.head.appendChild(
            script
        );


        window.dataLayer =
            window.dataLayer || [];


        function gtag() {

            dataLayer.push(
                arguments
            );

        }


        window.gtag =
            gtag;


        gtag(
            "js",
            new Date()
        );


        gtag(
            "config",
            GA_ID
        );

    })();


})(window, document);