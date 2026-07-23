/*
====================================================

ToolXone Backend

Statistics Service

Version:
1.0.0

Responsibility

Handle statistics
business logic.

====================================================
*/

const StatisticsService = {

    async incrementToolAction() {

        return StatisticsAPI.increment(
            "tool_actions"
        );

    },

    
    async incrementCalculation() {

        await StatisticsAPI.increment(
            "calculations"
        );

        await this.incrementToolAction();

    },

    async incrementUtility() {

    return StatisticsAPI.increment(
        "utilities"
    );

},

    async incrementConversion() {

        await StatisticsAPI.increment(
            "conversions"
        );

        await this.incrementToolAction();

    },

    async incrementFinanceTool() {

        await StatisticsAPI.increment(
            "finance_tools"
        );

        await this.incrementToolAction();

    },

    async incrementHealthTool() {

        await StatisticsAPI.increment(
            "health_tools"
        );

        await this.incrementToolAction();

    },

    async incrementQRCode() {

        await StatisticsAPI.increment(
            "qr_codes"
        );

        await this.incrementToolAction();

    },

    async incrementAIBanner() {

        await StatisticsAPI.increment(
            "ai_banners"
        );

        await this.incrementToolAction();

    },

    async incrementPDFTool() {

        await StatisticsAPI.increment(
            "pdf_tools"
        );

        await this.incrementToolAction();

    },

    async incrementTextTool() {

        await StatisticsAPI.increment(
            "text_tools"
        );

        await this.incrementToolAction();

    },

    async recordTool(toolId) {

    const tool = ToolXoneToolsRegistry.find(

        item => item.id === toolId

    );

    if (!tool) {

        console.warn(

            "Statistics Router: Unknown tool:",

            toolId

        );

        return;

    }

    const statisticsCategory = tool.statisticsCategory;

    switch (statisticsCategory) {

    case "calculator":

        await this.incrementCalculation();

        break;

    case "finance":

        await this.incrementCalculation();

        await this.incrementFinanceTool();

        break;

    case "health":

        await this.incrementCalculation();

        await this.incrementHealthTool();

        break;

    case "converter":

        await this.incrementConversion();

        break;

    case "utility":

    await this.incrementUtility();
    await this.incrementToolAction();

    break;

    case "qr":

        await this.incrementQRCode();

        break;

    case "ai":

        await this.incrementAIBanner();

        break;

    case "pdf":

        await this.incrementPDFTool();

        break;

    case "text":

        await this.incrementTextTool();

        break;

    default:

        console.warn(

            "Statistics Router: Unknown statistics category:",

            statisticsCategory

        );

}

},

    async refreshStatistics() {

    const response = await StatisticsAPI.getAll();

    if (

        !response ||

        !response.success ||

        !Array.isArray(response.data)

    ) {

        return false;

    }

    const liveStatistics = {

        totals: {

            toolActions: 0,

            calculations: 0,

            conversions: 0,

            utilities: 0,

            aiGenerations: 0

        },

        tools: {}

    };

    for (const item of response.data) {

        switch (item.stat_key) {

            case "tool_actions":

                liveStatistics.totals.toolActions =
                    item.stat_value;

                break;

            case "calculations":

                liveStatistics.totals.calculations =
                    item.stat_value;

                break;

            case "conversions":

                liveStatistics.totals.conversions =
                    item.stat_value;

                break;

            case "utilities":

                liveStatistics.totals.utilities =
                    item.stat_value;

                break;

            case "ai_generations":

                liveStatistics.totals.aiGenerations =
                    item.stat_value;

                break;

        }

    }

    ToolXoneStatistics.replaceStatistics(

        liveStatistics

    );

    ToolXoneStatisticsDashboard.refresh();

    return true;

}

};

Object.freeze(
    StatisticsService
);