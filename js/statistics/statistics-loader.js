/**
 * ==========================================================
 * ToolXone Statistics Loader
 * Version: 1.1.0
 * ==========================================================
 *
 * Central bootstrap for the ToolXone Statistics System.
 *
 * Responsibilities:
 * - Verify required statistics modules exist
 * - Initialize statistics features
 * - Load live statistics from backend
 * - Prepare future cloud providers
 * - Prepare future live updates
 *
 * ==========================================================
 */

const ToolXoneStatisticsLoader = (() => {

    /**
     * Required modules
     */
    const requiredModules = {

        registry: "ToolXoneToolsRegistry",

        storage: "ToolXoneStatisticsStorage",

        engine: "ToolXoneStatistics",

        events: "ToolXoneStatisticsEvents",

        api: "ToolXoneStatisticsAPI",

        dashboard: "ToolXoneStatisticsDashboard"

    };

    /**
     * Verify required modules
     */
    function verifyModules() {

        for (const [key, moduleName] of Object.entries(requiredModules)) {

            if (typeof window[moduleName] === "undefined") {

                console.warn(
                    `[ToolXone Statistics] Missing module: ${moduleName}`
                );

            }

        }

    }

    /**
     * Initialize statistics system
     */
    async function init() {


        console.info(
            "[ToolXone Statistics] Statistics system initialized."
        );

        try {

            if (
                typeof StatisticsService !== "undefined" &&
                typeof StatisticsService.refreshStatistics === "function"
            ) {

                await StatisticsService.refreshStatistics();

                console.info(
                    "[ToolXone Statistics] Live statistics loaded."
                );

            }

            else {

                console.warn(
                    "[ToolXone Statistics] StatisticsService is unavailable."
                );

            }

        }

        catch (error) {

            console.warn(
                "[ToolXone Statistics] Falling back to local statistics.",
                error
            );

        }

    }

    return {

        init

    };

})();

/**
 * Automatically initialize
 */
document.addEventListener(

    "DOMContentLoaded",

    async () => {

        await ToolXoneStatisticsLoader.init();

    }

);