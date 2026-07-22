/**
 * ============================================================
 * ToolXone Phoenix AI
 * Constraint Metrics Adapter
 * Version: 1.0.0
 * ============================================================
 *
 * Converts raw validator measurements into normalized
 * constraint scores (0–100).
 *
 * ============================================================
 */

class ConstraintMetricsAdapter {

    /**
     * ========================================================
     * Public API
     * ========================================================
     */

    static convert(validation = {}) {

        return {

            canvasScore: this.mapCanvasMetrics(validation),

            marginScore: this.mapMarginMetrics(validation),

            alignmentScore: this.mapAlignmentMetrics(validation),

            spacingScore: this.mapSpacingMetrics(validation),

            balanceScore: this.mapBalanceMetrics(validation),

            typographyScore: this.mapTypographyMetrics(validation),

            readabilityScore: this.mapReadabilityMetrics(validation),

            verticalFlowScore: this.mapVerticalFlowMetrics(validation)

        };

    }

    /**
     * ========================================================
     * Canvas
     * ========================================================
     */

    static mapCanvasMetrics(validation) {

        let score = 100;

        if (validation.outsideCanvas)
            score -= 40;

        score -= (validation.overflowPixels || 0) * 0.5;

        return this.clamp(score);

    }

    /**
     * ========================================================
     * Margins
     * ========================================================
     */

    static mapMarginMetrics(validation) {

        let score = 100;

        score -= (validation.marginViolations || 0) * 5;

        return this.clamp(score);

    }

    /**
     * ========================================================
     * Alignment
     * ========================================================
     */

    static mapAlignmentMetrics(validation) {

        let score = 100;

        score -= (validation.alignmentDeviation || 0) * 1.5;

        return this.clamp(score);

    }

    /**
     * ========================================================
     * Spacing
     * ========================================================
     */

    static mapSpacingMetrics(validation) {

        let score = 100;

        score -= (validation.spacingVariance || 0) * 1.5;

        return this.clamp(score);

    }

    /**
     * ========================================================
     * Balance
     * ========================================================
     */

    static mapBalanceMetrics(validation) {

        let score = 100;

        score -= (validation.balanceDeviation || 0);

        return this.clamp(score);

    }

    /**
     * ========================================================
     * Typography
     * ========================================================
     */

    static mapTypographyMetrics(validation) {

        let score = 100;

        score -= (validation.typographyIssues || 0) * 4;

        return this.clamp(score);

    }

    /**
     * ========================================================
     * Readability
     * ========================================================
     */

    static mapReadabilityMetrics(validation) {

        let score = 100;

        score -= (validation.readabilityIssues || 0) * 6;

        return this.clamp(score);

    }

    /**
     * ========================================================
     * Vertical Flow
     * ========================================================
     */

    static mapVerticalFlowMetrics(validation) {

        let score = 100;

        score -= (validation.verticalFlowBreaks || 0) * 5;

        return this.clamp(score);

    }

    /**
     * ========================================================
     * Utility
     * ========================================================
     */

    static clamp(value) {

        if (value < 0)
            return 0;

        if (value > 100)
            return 100;

        return Math.round(value);

    }

}

window.ConstraintMetricsAdapter = ConstraintMetricsAdapter;