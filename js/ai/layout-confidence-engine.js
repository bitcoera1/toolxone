class LayoutConfidenceEngine {

    static ENGINE_NAME = "LayoutConfidenceEngine";

    static evaluate(validationReports, optimizationReport) {

    const validatorScore =
        this.calculateValidatorScore(validationReports);

    const optimizerScore =
        this.calculateOptimizerScore(optimizationReport);

    const confidence =
        this.calculateConfidence(
            validatorScore,
            optimizerScore
        );

    return this.buildConfidenceReport(
        confidence,
        validatorScore,
        optimizerScore
    );

}

    static calculateValidatorScore(validationReports) {

    if (!Array.isArray(validationReports) || validationReports.length === 0) {
        return 100;
    }

    let totalScore = 100;

    for (const report of validationReports) {

        if (!report || !Array.isArray(report.issues)) {
            continue;
        }

        totalScore -= report.issues.length * 5;

    }

    return Math.max(0, totalScore);

}

static calculateOptimizerScore(optimizationReport) {

    if (!optimizationReport) {
        return 100;
    }

    const recommendationCount =
        optimizationReport.recommendationCount ?? 0;

    const score = 100 - (recommendationCount * 5);

    return Math.max(0, score);

}

static calculateConfidence(
    validatorScore,
    optimizerScore
) {

    return Math.round(

        (validatorScore + optimizerScore) / 2

    );

}

static buildConfidenceReport(
    confidence,
    validatorScore,
    optimizerScore
) {

    return {

        engine: this.ENGINE_NAME,

        confidence,

        passed: confidence >= 80,

        validatorScore,

        optimizerScore,

        timestamp: Date.now()

    };

}


}

window.LayoutConfidenceEngine = LayoutConfidenceEngine;