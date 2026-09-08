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

    _summary: [],

    _tools: [],

    _isRefreshing: false,

    async incrementToolAction() {

    return StatisticsAPI.increment(
        "tool_actions"
    );

},

async incrementCalculation() {

    return StatisticsAPI.increment(
        "calculations"
    );

},

async incrementUtility() {

    return StatisticsAPI.increment(
        "utilities"
    );

},

async incrementConversion() {

    return StatisticsAPI.increment(
        "conversions"
    );

},

async incrementFinanceTool() {

    return StatisticsAPI.increment(
        "finance_tools"
    );

},

async incrementHealthTool() {

    return StatisticsAPI.increment(
        "health_tools"
    );

},

async incrementQRCode() {

    return StatisticsAPI.increment(
        "qr_codes"
    );

},

async incrementAIBanner() {

    return StatisticsAPI.increment(
        "ai_banners"
    );

},

async incrementPDFTool() {

    return StatisticsAPI.increment(
        "pdf_tools"
    );

},

async incrementTextTool() {

    return StatisticsAPI.increment(
        "text_tools"
    );

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

    /*
    ----------------------------------------
    Record individual tool usage
    ----------------------------------------
    */

    await StatisticsAPI.recordTool(
        tool.id,
        tool.name
    );

    /*
    ----------------------------------------
    Determine statistics category
    ----------------------------------------
    */

    const statisticsCategory =
        tool.statisticsCategory;

    /*
    ----------------------------------------
    Category statistics
    ----------------------------------------
    */

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

            return;

    }

    /*
    ----------------------------------------
    EXACTLY ONE tool action
    ----------------------------------------
    */

    await this.incrementToolAction();

    await this.refreshStatistics();

},

    async refreshStatistics() {

    if (this._isRefreshing) {

        return false;

    }

    this._isRefreshing = true;

    try {

        const response = await StatisticsAPI.getAll();

        if (
            !response ||
            !response.success
        ) {

            return false;

        }

        const summary = response.summary || [];

        const tools = response.tools || [];

        this._summary = summary;

        this._tools = tools;

        ToolXoneStatisticsIntelligence.analyze(

            summary,

            tools

        );

        ToolXoneStatisticsDashboard.refresh();

        return true;

    }

    finally {

        this._isRefreshing = false;

    }

},

    getSummary() {

        return this._summary;

    },

    getTools() {

        return this._tools;

    }

};

Object.freeze(StatisticsService);