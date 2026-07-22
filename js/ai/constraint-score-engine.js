/**
 * ============================================================
 * ToolXone Phoenix AI
 * Constraint Score Engine
 * Version: 1.0.0
 * ============================================================
 *
 * Evaluates layout quality based on constraint metrics.
 * Produces a weighted design quality score.
 *
 * Input:
 *  - Constraint metrics object
 *
 * Output:
 *  - Detailed score report
 *
 * ============================================================
 */

class ConstraintScoreEngine {

    static WEIGHTS = {
        canvas: 15,
        margins: 10,
        alignment: 15,
        spacing: 15,
        balance: 10,
        typography: 10,
        readability: 10,
        verticalFlow: 15
    };

    /**
     * Main entry point
     */
    static calculate(metrics = {}) {

        const categories = {

            canvas: this.calculateCanvasScore(metrics),

            margins: this.calculateMarginScore(metrics),

            alignment: this.calculateAlignmentScore(metrics),

            spacing: this.calculateSpacingScore(metrics),

            balance: this.calculateBalanceScore(metrics),

            typography: this.calculateTypographyScore(metrics),

            readability: this.calculateReadabilityScore(metrics),

            verticalFlow: this.calculateVerticalFlowScore(metrics)

        };

        const totalScore = this.calculateOverallScore(categories);

        return {

            totalScore,

            quality: this.getQualityLevel(totalScore),

            passed: totalScore >= 80,

            categories

        };

    }

    /**
     * ========================================================
     * Individual Category Scores
     * ========================================================
     */

    static calculateCanvasScore(metrics) {
        return this.normalize(metrics.canvasScore);
    }

    static calculateMarginScore(metrics) {
        return this.normalize(metrics.marginScore);
    }

    static calculateAlignmentScore(metrics) {
        return this.normalize(metrics.alignmentScore);
    }

    static calculateSpacingScore(metrics) {
        return this.normalize(metrics.spacingScore);
    }

    static calculateBalanceScore(metrics) {
        return this.normalize(metrics.balanceScore);
    }

    static calculateTypographyScore(metrics) {
        return this.normalize(metrics.typographyScore);
    }

    static calculateReadabilityScore(metrics) {
        return this.normalize(metrics.readabilityScore);
    }

    static calculateVerticalFlowScore(metrics) {
        return this.normalize(metrics.verticalFlowScore);
    }

    /**
     * ========================================================
     * Final Weighted Score
     * ========================================================
     */

    static calculateOverallScore(categories) {

        let totalWeight = 0;
        let weightedScore = 0;

        for (const key in this.WEIGHTS) {

            const weight = this.WEIGHTS[key];
            const score = categories[key] ?? 100;

            weightedScore += score * weight;
            totalWeight += weight;

        }

        return Number((weightedScore / totalWeight).toFixed(2));

    }

    /**
     * ========================================================
     * Quality Rating
     * ========================================================
     */

    static getQualityLevel(score) {

        if (score >= 98) return "World Class";

        if (score >= 95) return "Excellent";

        if (score >= 90) return "Professional";

        if (score >= 80) return "Good";

        if (score >= 70) return "Fair";

        return "Needs Improvement";

    }

    /**
     * ========================================================
     * Normalize Score
     * ========================================================
     */

    static normalize(value) {

        if (typeof value !== "number")
            return 100;

        if (value < 0)
            return 0;

        if (value > 100)
            return 100;

        return value;

    }

}

window.ConstraintScoreEngine = ConstraintScoreEngine;