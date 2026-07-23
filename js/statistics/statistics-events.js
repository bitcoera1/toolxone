/**
 * ==========================================================
 * ToolXone Statistics Events
 * Version: 1.1.0
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
    async function recordCalculation(toolId) {

        ToolXoneStatistics.record(toolId);

        try {

            await StatisticsService.recordTool(toolId);

        } catch (error) {

            console.error(
                "Statistics Router Error:",
                error
            );

        }

    }

    /**
     * Successful converter action
     */
    async function recordConversion(toolId) {

        ToolXoneStatistics.record(toolId);

        try {

            await StatisticsService.recordTool(toolId);

        } catch (error) {

            console.error(
                "Statistics Router Error:",
                error
            );

        }

    }

    /**
     * Successful utility action
     */
    async function recordUtility(toolId) {

        ToolXoneStatistics.record(toolId);

        try {

            await StatisticsService.recordTool(toolId);

        } catch (error) {

            console.error(
                "Statistics Router Error:",
                error
            );

        }

    }

    /**
     * Successful AI generation
     */
    async function recordAIGeneration(toolId) {

        ToolXoneStatistics.record(toolId);

        try {

            await StatisticsService.recordTool(toolId);

        } catch (error) {

            console.error(
                "Statistics Router Error:",
                error
            );

        }

    }

    return {

        recordCalculation,

        recordConversion,

        recordUtility,

        recordAIGeneration

    };

})();