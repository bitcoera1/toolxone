class PhoenixPipeline {

    static PIPELINE_NAME = "PhoenixPipeline";

    static process(layout) {

    const validationReports =
        this.runValidators(layout);

    const optimizationReport =
        this.runOptimizer(validationReports);

    const confidenceReport =
        this.runConfidence(
            validationReports,
            optimizationReport
        );

    return this.buildPipelineReport(
        validationReports,
        optimizationReport,
        confidenceReport
    );

}

static runValidators(layout) {

    const reports = [];

    reports.push(
        CanvasBoundaryValidator.validate(layout)
    );

    reports.push(
        ConstraintScoreEngine.evaluate(layout)
    );

    reports.push(
        ProtectedRegionValidator.validate(layout)
    );

    reports.push(
        CollisionValidator.validate(layout)
    );

    reports.push(
        ReadabilityValidator.validate(layout)
    );

    return reports;

}

static runOptimizer(validationReports) {

    return IntelligentOptimizer.optimize(
        validationReports
    );

}

static runConfidence(validationReports, optimizationReport) {

    return LayoutConfidenceEngine.evaluate(
        validationReports,
        optimizationReport
    );

}

static buildPipelineReport(
    validationReports,
    optimizationReport,
    confidenceReport
) {

    return {

        pipeline: this.PIPELINE_NAME,

        validationReports,

        optimizationReport,

        confidenceReport,

        ready: true,

        timestamp: Date.now()

    };

}

}

window.PhoenixPipeline = PhoenixPipeline;