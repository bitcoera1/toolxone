/**
 * ==========================================================
 * PHOENIX AI DESIGN STUDIO
 * Constraint Intelligence Engine
 * ----------------------------------------------------------
 * Evaluates whether proposed layout changes are safe before
 * they are applied by the renderer.
 *
 * Version: 1.0.0
 * ==========================================================
 */

class PhoenixConstraintEngine {

    constructor() {

        this.version = "1.0.0";

    }
/**
 * Evaluate a proposed layout change.
 *
 * @param {Object} layout
 * @param {Object} proposal
 * @returns {Object}
 */

evaluate({
    verticalFlowMetrics,
    platform = "default"
}) {

    const violations = [];

    const warnings = [];

    const boundaryResult =
        this.validateCanvasBoundaries(
            verticalFlowMetrics
        );

    if (!boundaryResult.valid) {
        violations.push(
            ...boundaryResult.violations
        );
    }

    console.log(
    "🧱 Canvas Boundary Validation",
    {
        valid:
            violations.length === 0,
        violations
    }
);

    return {

        approved:
            violations.length === 0,

        score:
            violations.length === 0
                ? 100
                : 0,

        confidence: 1,

        violations,

        warnings
    };

}

validateCanvasBoundaries(
    verticalFlowMetrics
) {

    if (!verticalFlowMetrics) {

        return {
            valid: false,
            violations: [
                "Vertical flow metrics are unavailable."
            ]
        };

    }

    const {

        canvasHeight,

        boxes = {}

    } = verticalFlowMetrics;

    const violations = [];

    const boundaryElements = [

        "headline",

        "support",

        "benefits",

        "hero",

        "cta",

        "branding"

    ];

    boundaryElements.forEach(name => {

        const box = boxes[name];

        if (name === "headline") {
    box.bottom = canvasHeight + 50;
}

        if (!box) {
            return;
        }

        if (box.top < 0) {

            violations.push(
                `${name} extends above the canvas.`
            );

        }

        if (box.bottom > canvasHeight) {

            violations.push(
                `${name} extends below the canvas.`
            );

        }

    });

    return {

        valid:
            violations.length === 0,

        violations

    };

}

/**
 * Validate canvas boundaries.
 *
 * @param {Object} layout
 * @param {Object} proposal
 * @returns {Object}
 */
validateBoundaries(layout, proposal) {

    const element = layout.elements?.[proposal.element];

    if (!element) {
        return {
            valid: false,
            violations: [
                "Unknown layout element."
            ]
        };
    }

    const newX = element.x + (proposal.moveX || 0);
    const newY = element.y + (proposal.moveY || 0);

    if (newX < 0 || newY < 0) {

        return {
            valid: false,
            violations: [
                "Element would leave the canvas."
            ]
        };

    }

    if (
        newX + element.width > layout.canvas.width ||
        newY + element.height > layout.canvas.height
    ) {

        return {
            valid: false,
            violations: [
                "Element exceeds canvas boundaries."
            ]
        };

    }

    return {
        valid: true,
        violations: []
    };

}

}

/**
 * Global Instance
 */

window.PhoenixConstraintEngine =
    new PhoenixConstraintEngine();