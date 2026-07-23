/**
 * ==========================================================
 * ToolXone Statistics Engine
 * Version: 2.0
 * ==========================================================
 */

const ToolXoneStatistics = (() => {

    const statistics = ToolXoneStatisticsStorage.load();

    // ------------------------------------------
    // Find tool in registry
    // ------------------------------------------

    function findTool(toolId) {

        return ToolXoneToolsRegistry.find(
            tool => tool.id === toolId
        );

    }

    // ------------------------------------------
    // Ensure tool exists in statistics
    // ------------------------------------------

    function ensureTool(tool) {

        if (!statistics.tools[tool.id]) {

            statistics.tools[tool.id] = {

                id: tool.id,

                name: tool.name,

                category: tool.category,

                actions: 0,

                firstUsed: null,

                lastUsed: null

            };

        }

    }

    // ------------------------------------------
    // Record Tool Action
    // ------------------------------------------

    function record(toolId) {

        const tool = findTool(toolId);

        if (!tool) {

            console.warn(
                `[ToolXone Statistics] Unknown tool: ${toolId}`
            );

            return;

        }

        ensureTool(tool);

        const now = new Date().toISOString();

        const stats = statistics.tools[tool.id];

        stats.actions++;

        if (!stats.firstUsed) {

            stats.firstUsed = now;

        }

        stats.lastUsed = now;

        statistics.totals.toolActions++;

        switch (tool.category) {

            case "calculator":
                statistics.totals.calculations++;
                break;

            case "converter":
                statistics.totals.conversions++;
                break;

            case "utility":
                statistics.totals.utilities++;
                break;

            case "ai":
                statistics.totals.aiGenerations++;
                break;

        }

        ToolXoneStatisticsStorage.save(statistics);

    }

    // ------------------------------------------
    // Get Statistics
    // ------------------------------------------

    function getStatistics() {

        return statistics;

    }

    // ------------------------------------------
    // Get Tool Statistics
    // ------------------------------------------

    function getTool(toolId) {

        return statistics.tools[toolId] || null;

    }

    // ------------------------------------------
// Replace Statistics
// ------------------------------------------

function replaceStatistics(newStatistics) {

    if (!newStatistics) {

        return;

    }

    statistics.totals = {

        ...statistics.totals,

        ...newStatistics.totals

    };

    statistics.tools = {

        ...statistics.tools,

        ...newStatistics.tools

    };

    ToolXoneStatisticsStorage.save(

        statistics

    );

}

    // ------------------------------------------
    // Reset Statistics
    // ------------------------------------------

    function reset() {

        ToolXoneStatisticsStorage.reset();

        location.reload();

    }

    return {

    record,

    getStatistics,

    getTool,

    replaceStatistics,

    reset

};

})();