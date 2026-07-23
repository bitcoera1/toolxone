/*
====================================================

ToolXone Backend

Backend Bootstrap

Version:
1.0.0

Responsibility

Initialize backend modules
and verify backend readiness.

====================================================
*/

const ToolXoneBackend = {

    initialized: false,

    async initialize() {

    try {

        console.log(
            "🚀 Initializing ToolXone Backend..."
        );

        this.verifyModules();

        // Initialize live statistics
        if (
            typeof StatisticsLoader !== "undefined" &&
            typeof StatisticsLoader.init === "function"
        ) {

          await StatisticsLoader.init();

        }

        this.initialized = true;

        console.log(
            "✅ ToolXone Backend Ready"
        );

    }

    catch (error) {

        console.error(
            "❌ Backend Initialization Failed:",
            error
        );

    }

},

    verifyModules() {

        const requiredModules = {

            BackendConfig,

            APIClient,

            StatisticsAPI,

            StatisticsService

        };

        for (const [name, module] of Object.entries(requiredModules)) {

            if (!module) {

                throw new Error(
                    `${name} is not loaded.`
                );

            }

        }

    }

};

document.addEventListener(

    "DOMContentLoaded",

    () => {

        ToolXoneBackend.initialize();

    }

);

Object.freeze(
    ToolXoneBackend
);