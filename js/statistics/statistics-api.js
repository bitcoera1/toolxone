/**
 * ==========================================================
 * ToolXone Statistics API
 * Version: 1.0
 * ==========================================================
 * Public read-only interface for ToolXone statistics.
 * UI components should use this API instead of accessing
 * the engine directly.
 * ==========================================================
 */

const ToolXoneStatisticsAPI = (() => {

    function getAll() {

        return ToolXoneStatistics.getStatistics();

    }

    function getTotals() {

        return ToolXoneStatistics.getStatistics().totals;

    }

    function getTools() {

        return ToolXoneStatistics.getStatistics().tools;

    }

    function getTool(toolId) {

        return ToolXoneStatistics.getTool(toolId);

    }

    function getTotalToolActions() {

        return getTotals().toolActions;

    }

    function getTotalCalculations() {

        return getTotals().calculations;

    }

    function getTotalConversions() {

        return getTotals().conversions;

    }

    function getTotalUtilities() {

        return getTotals().utilities;

    }

    function getTotalAIGenerations() {

        return getTotals().aiGenerations;

    }

    return {

        getAll,

        getTotals,

        getTools,

        getTool,

        getTotalToolActions,

        getTotalCalculations,

        getTotalConversions,

        getTotalUtilities,

        getTotalAIGenerations

    };

})();