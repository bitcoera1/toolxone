/**
 * ==========================================================
 * ToolXone Statistics Dashboard
 * Version: 1.0
 * ==========================================================
 * Updates statistics in the UI.
 * ==========================================================
 */

const ToolXoneStatisticsDashboard = (() => {

    function updateElement(id, value) {

        const element = document.getElementById(id);

        if (element) {

            element.textContent = value;

        }

    }

    function refresh() {

        updateElement(
            "tx-total-actions",
            ToolXoneStatisticsAPI.getTotalToolActions()
        );

        updateElement(
            "tx-total-calculations",
            ToolXoneStatisticsAPI.getTotalCalculations()
        );

        updateElement(
            "tx-total-conversions",
            ToolXoneStatisticsAPI.getTotalConversions()
        );

        updateElement(
            "tx-total-utilities",
            ToolXoneStatisticsAPI.getTotalUtilities()
        );

        updateElement(
            "tx-total-ai",
            ToolXoneStatisticsAPI.getTotalAIGenerations()
        );

    }

    return {

        refresh

    };

})();