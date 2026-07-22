class IntelligentOptimizer {

    static OPTIMIZER_NAME = "IntelligentOptimizer";

    static optimize(reports) {

    const issues = this.collectIssues(reports);

    const recommendations = this.generateRecommendations(issues);

    const prioritizedRecommendations = this.prioritizeRecommendations(recommendations);

    return this.buildOptimizationReport(prioritizedRecommendations);

    }

    static collectIssues(reports) {

    if (!Array.isArray(reports)) {
        return [];
    }

    const issues = [];

    for (const report of reports) {

        if (!report || !Array.isArray(report.issues)) {
            continue;
        }

        issues.push(...report.issues);

    }

    return issues;

}

static generateRecommendations(issues) {

    if (!Array.isArray(issues)) {
        return [];
    }

    const recommendations = [];

    for (const issue of issues) {

        const recommendation = this.buildRecommendation(issue);

        if (recommendation) {
            recommendations.push(recommendation);
        }

    }

    return recommendations;

}

static buildRecommendation(issue) {

    if (!issue) {
        return null;
    }

    return {

        optimizer: this.OPTIMIZER_NAME,

        code: this.getRecommendationCode(issue.code),

        issueCode: issue.code,

        action: this.getRecommendationAction(issue.code),

        target: issue.element ?? null,

        priority: issue.severity ?? "medium",

        timestamp: Date.now()

    };

}

static getRecommendationCode(issueCode) {

    const codes = {

        RV001: "OR001",
        RV002: "OR002",
        RV003: "OR003",
        RV004: "OR004",
        RV005: "OR005",
        RV006: "OR006",

        CV001: "OR101",
        CV002: "OR102",

        PR001: "OR201",
        PR002: "OR202"

    };

    return codes[issueCode] ?? "OR999";

}

static getRecommendationAction(issueCode) {

    const actions = {

        RV001: "increase-font-size",
        RV002: "decrease-font-size",
        RV003: "adjust-line-spacing",
        RV004: "improve-reading-flow",
        RV005: "increase-margins",
        RV006: "increase-text-spacing",

        CV001: "move-overlapping-element",
        CV002: "separate-overlapping-elements",

        PR001: "move-outside-protected-region",
        PR002: "reduce-protected-region-overlap"

    };

    return actions[issueCode] ?? "manual-review";

}

static prioritizeRecommendations(recommendations) {

    if (!Array.isArray(recommendations)) {
        return [];
    }

    const priorityOrder = {
        high: 3,
        medium: 2,
        low: 1
    };

    return [...recommendations].sort((a, b) => {

        const priorityA = priorityOrder[a.priority] ?? 0;
        const priorityB = priorityOrder[b.priority] ?? 0;

        return priorityB - priorityA;

    });

}

static buildOptimizationReport(recommendations) {

    return {

        optimizer: this.OPTIMIZER_NAME,

        optimized: recommendations.length > 0,

        recommendations,

        recommendationCount: recommendations.length,

        timestamp: Date.now()

    };

}

}

window.IntelligentOptimizer = IntelligentOptimizer;