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

    async refreshStatistics() {

        return StatisticsAPI.getAll();

    }

};

Object.freeze(
    StatisticsService
);