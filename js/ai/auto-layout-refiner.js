class AutoLayoutRefiner {

    static REFINER_NAME = "AutoLayoutRefiner";

    static refine(layout, optimizationReport) {

    const refinedLayout =
        this.cloneLayout(layout);

    const result =
        this.applyRecommendations(
            refinedLayout,
            optimizationReport
        );

    return this.buildRefinementReport(
        result.layout,
        result.appliedRecommendations
    );

}

static cloneLayout(layout) {

    if (!layout) {

        return {};

    }

    return JSON.parse(JSON.stringify(layout));

}

static applyRecommendations(
    layout,
    optimizationReport
) {

    if (
        !optimizationReport ||
        !optimizationReport.recommendations
    ) {

        return {

            layout,

            appliedRecommendations: 0

        };

    }

    let appliedRecommendations = 0;

    optimizationReport.recommendations.forEach(
        recommendation => {

            this.applyRecommendation(
                layout,
                recommendation
            );

            appliedRecommendations++;

        }
    );

    return {

        layout,

        appliedRecommendations

    };

}

static applyRecommendation(
    layout,
    recommendation
) {

    if (!layout || !recommendation) {

        return;

    }

    switch (recommendation.action) {

        case "increase-font-size":
            break;

        case "decrease-font-size":
            break;

        case "adjust-line-spacing":
            break;

        case "improve-reading-flow":
            break;

        case "increase-margins":
            break;

        case "increase-text-spacing":
            break;

        case "move-overlapping-element":
            break;

        case "separate-overlapping-elements":
            break;

        case "move-outside-protected-region":
            break;

        case "reduce-protected-region-overlap":
            break;

        default:
            break;

    }

}

static buildRefinementReport(
    refinedLayout,
    appliedRecommendations
) {

    return {

        refiner: this.REFINER_NAME,

        refinedLayout,

        refined: appliedRecommendations > 0,

        appliedRecommendations,

        timestamp: Date.now()

    };

}

}

window.AutoLayoutRefiner = AutoLayoutRefiner;