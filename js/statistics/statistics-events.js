/**
 * ==========================================================
 * ToolXone Statistics Events
 * Version: 1.0
 * ==========================================================
 * Public event layer for ToolXone.
 *
 * Every ToolXone tool should call these methods instead of
 * talking directly to the Statistics Engine.
 * ==========================================================
 */

const ToolXoneStatisticsEvents = (() => {

    /**
     * Successful calculator action
     */
    function recordCalculation(toolId) {

        ToolXoneStatistics.record(toolId);

    }

    /**
     * Successful converter action
     */
    function recordConversion(toolId) {

        ToolXoneStatistics.record(toolId);

    }

    /**
     * Successful utility action
     */
    function recordUtility(toolId) {

        ToolXoneStatistics.record(toolId);

    }

    /**
     * Successful AI generation
     */
    function recordAIGeneration(toolId) {

        ToolXoneStatistics.record(toolId);

    }

    return {

        recordCalculation,

        recordConversion,

        recordUtility,

        recordAIGeneration

    };

})();