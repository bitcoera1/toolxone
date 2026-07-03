// ======================================
// TOOLXONE FINANCE ENGINE
// ======================================

function createFinanceCalculator(config) {

    // Build calculator UI
    renderCalculator(config);

    // Info section
    if (config.info) {
        renderFinanceInfo(
            "financeInfo",
            config.info.title,
            config.info.description
        );
    }

    // FAQ section
    if (config.faq) {
        renderFinanceFAQ(
            "financeFAQ",
            config.faq
        );
    }

    // Feedback
    renderFinanceFeedback("financeFeedback");

    // Related Tools
    initializeRelatedTools(config.id);

}