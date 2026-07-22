class ReadabilityValidator {

    static VALIDATOR_NAME = "ReadabilityValidator";

    static validate(layout) {

    const textElements = this.getTextElements(layout);

    const issues = [

        ...this.checkFontSizes(textElements),

        ...this.checkLineSpacing(textElements),

        ...this.checkReadingFlow(textElements),

        ...this.checkMargins(layout),

        ...this.checkTextSpacing(textElements)

    ];

    return this.buildReport(issues);

}

/**
 * ========================================================
 * Get Text Elements
 * ========================================================
 */

static getTextElements(layout) {

    if (!layout?.elements) {
        return [];
    }

    const textTypes = [

        "headline",

        "subtitle",

        "paragraph",

        "caption",

        "cta",

        "label",

        "text"

        
    ];

    
    return layout.elements.filter(element =>

        textTypes.includes(element.type)

    );

}

/**
 * ========================================================
 * Check Font Sizes
 * ========================================================
 */

static checkFontSizes(textElements) {

    const issues = [];

    for (const element of textElements) {

        const rules = this.TYPOGRAPHY_RULES[element.type];

        if (!rules || typeof element.fontSize !== "number") {
            continue;
        }

        if (element.fontSize < rules.min) {

            issues.push(

                this.buildIssue(
                    element,
                    "font-too-small",
                    "high"
                )

            );

        }

        if (element.fontSize > rules.max) {

            issues.push(

                this.buildIssue(
                    element,
                    "font-too-large",
                    "medium"
                )

            );

        }

    }

    return issues;

}

/**
 * ========================================================
 * Check Line Spacing
 * ========================================================
 */

static checkLineSpacing(textElements) {

    const issues = [];

    for (const element of textElements) {

        if (
            typeof element.lineHeight !== "number" ||
            typeof element.fontSize !== "number"
        ) {
            continue;
        }

        const ratio = element.lineHeight / element.fontSize;

        if (ratio < 1.2 || ratio > 1.8) {

            issues.push(

                this.buildIssue(
                    element,
                    "line-spacing",
                    "medium"
                )

            );

        }

    }

    return issues;

}

/**
 * ========================================================
 * Check Reading Flow
 * ========================================================
 */

static checkReadingFlow(textElements) {

    const issues = [];

    const sorted = [...textElements].sort(

        (a, b) => a.y - b.y

    );

    const headlineIndex = sorted.findIndex(

        element => element.type === "headline"

    );

    const subtitleIndex = sorted.findIndex(

        element => element.type === "subtitle"

    );

    const ctaIndex = sorted.findIndex(

        element => element.type === "cta"

    );

    if (

        headlineIndex !== -1 &&

        subtitleIndex !== -1 &&

        subtitleIndex < headlineIndex

    ) {

        issues.push(

            this.buildIssue(

                sorted[subtitleIndex],

                "reading-flow",

                "medium"

            )

        );

    }

    if (

        headlineIndex !== -1 &&

        ctaIndex !== -1 &&

        ctaIndex < headlineIndex

    ) {

        issues.push(

            this.buildIssue(

                sorted[ctaIndex],

                "reading-flow",

                "high"

            )

        );

    }

    return issues;

}

/**
 * ========================================================
 * Check Margins
 * ========================================================
 */

static checkMargins(layout) {

    const issues = [];

    if (!layout?.elements) {
        return issues;
    }

    const margin = 20;

    for (const element of layout.elements) {

        if (
            element.x < margin ||
            element.y < margin ||
            (element.x + element.width) > (layout.width - margin) ||
            (element.y + element.height) > (layout.height - margin)
        ) {

            issues.push(

                this.buildIssue(
                    element,
                    "margin",
                    "medium"
                )

            );

        }

    }

    return issues;

}

/**
 * ========================================================
 * Check Text Spacing
 * ========================================================
 */

static checkTextSpacing(textElements) {

    const issues = [];

    const sorted = [...textElements].sort(

        (a, b) => a.y - b.y

    );

    const minimumSpacing = 12;

    for (let i = 0; i < sorted.length - 1; i++) {

        const current = sorted[i];

        const next = sorted[i + 1];

        const spacing = next.y - (current.y + current.height);

        if (spacing < minimumSpacing) {

            issues.push(

                this.buildIssue(

                    next,

                    "text-spacing",

                    "medium"

                )

            );

        }

    }

    return issues;

}

/**
 * ========================================================
 * Build Issue
 * ========================================================
 */

static buildIssue(element, type, severity) {

    return {

        validator: this.VALIDATOR_NAME,

        code: this.getIssueCode(type),

        type,

        severity,

        element,

        timestamp: Date.now()

    };

}

/**
 * ========================================================
 * Get Issue Code
 * ========================================================
 */

static getIssueCode(type) {

    const codes = {

        "font-too-small": "RV001",

        "font-too-large": "RV002",

        "line-spacing": "RV003",

        "reading-flow": "RV004",

        "margin": "RV005",

        "text-spacing": "RV006"

    };

    return codes[type] || "RV999";

}

/**
 * ========================================================
 * Build Report
 * ========================================================
 */

static buildReport(issues) {

    return {

        validator: this.VALIDATOR_NAME,

        passed: issues.length === 0,

        issues,

        issueCount: issues.length,

        timestamp: Date.now()

    };

}

/**
 * ========================================================
 * Check Line Spacing
 * ========================================================
 */

static checkLineSpacing(textElements) {

    const issues = [];

    for (const element of textElements) {

        if (
            typeof element.lineHeight !== "number" ||
            typeof element.fontSize !== "number"
        ) {
            continue;
        }

        const ratio = element.lineHeight / element.fontSize;

        if (ratio < 1.2 || ratio > 1.8) {

            issues.push(

                this.buildIssue(
                    element,
                    "line-spacing",
                    "medium"
                )

            );

        }

    }

    return issues;

}

/**
 * ========================================================
 * Typography Rules
 * ========================================================
 */

static TYPOGRAPHY_RULES = {

    headline: {
        min: 32,
        max: 96
    },

    subtitle: {
        min: 20,
        max: 48
    },

    paragraph: {
        min: 16,
        max: 24
    },

    caption: {
        min: 12,
        max: 18
    },

    cta: {
        min: 18,
        max: 32
    },

    label: {
        min: 12,
        max: 18
    },

    text: {
        min: 14,
        max: 24
    }

};

}

window.ReadabilityValidator = ReadabilityValidator;