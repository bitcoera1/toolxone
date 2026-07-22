class ProtectedRegionValidator {

    /**
     * ========================================================
     * Protected Types Registry
     * ========================================================
     */

    static PROTECTED_TYPES = {

        logo: {
            severity: "critical",
            padding: 16
        },

        qr: {
            severity: "critical",
            padding: 20
        },

        cta: {
            severity: "high",
            padding: 12
        },

        brand: {
            severity: "high",
            padding: 12
        },

        product: {
            severity: "high",
            padding: 10
        },

        avatar: {
            severity: "medium",
            padding: 8
        },

        hero: {
            severity: "medium",
            padding: 8
        },

        watermark: {
            severity: "low",
            padding: 4
        }

    };

    /**
     * ========================================================
     * Public API
     * ========================================================
     */

    static validate(layout) {

        // Stage 3 will be implemented next.
        return {
            passed: true,
            violations: []
        };

    }

    /**
     * ========================================================
     * Protected Elements
     * ========================================================
     */

    static getProtectedElements(layout) {

        if (!layout?.elements)
            return [];

        return layout.elements.filter(element =>
            this.PROTECTED_TYPES?.[element.type]
        );

    }

    /**
     * ========================================================
     * Normal Elements
     * ========================================================
     */

    static getNormalElements(layout) {

        if (!layout?.elements)
            return [];

        return layout.elements.filter(element =>
            !this.PROTECTED_TYPES?.[element.type]
        );

    }

    /**
     * ========================================================
     * Expand Protected Region
     * ========================================================
     */

    static expandProtectedRegion(element) {

        const config = this.PROTECTED_TYPES[element.type];

        const padding = config?.padding || 0;

        return {

            ...element,

            x: element.x - padding,

            y: element.y - padding,

            width: element.width + (padding * 2),

            height: element.height + (padding * 2),

            padding

        };

    }

    /**
     * ========================================================
     * Rectangle Intersection
     * ========================================================
     */

    static intersects(a, b) {

        return !(

            a.x + a.width <= b.x ||

            b.x + b.width <= a.x ||

            a.y + a.height <= b.y ||

            b.y + b.height <= a.y

        );

    }
/**
 * ========================================================
 * Detect Violations
 * ========================================================
 */

static detectViolations(protectedElements, normalElements) {

    const violations = [];

    for (const protectedElement of protectedElements) {

        const expandedRegion =
            this.expandProtectedRegion(protectedElement);

        for (const normalElement of normalElements) {

            if (this.intersects(expandedRegion, normalElement)) {

                violations.push(

                    this.buildViolation(

                        protectedElement,

                        normalElement

                    )

                );

            }

        }

    }

    return violations;

}

/**
 * ========================================================
 * Build Violation
 * ========================================================
 */

static buildViolation(protectedElement, normalElement) {

    const config = this.PROTECTED_TYPES[protectedElement.type];

    return {

        validator: "ProtectedRegionValidator",

        code: this.getViolationCode(protectedElement.type),

        type: `${protectedElement.type}-overlap`,

        severity: config?.severity || "medium",

        source: {
            id: normalElement.id || null,
            type: normalElement.type,
            name: normalElement.name || null
        },

        target: {
            id: protectedElement.id || null,
            type: protectedElement.type,
            name: protectedElement.name || null
        },

        padding: config?.padding || 0,

        timestamp: Date.now()

    };

    }

    /**
 * ========================================================
 * Violation Codes
 * ========================================================
 */

static getViolationCode(type) {

    const codes = {

        logo: "PR001",

        qr: "PR002",

        cta: "PR003",

        brand: "PR004",

        product: "PR005",

        avatar: "PR006",

        hero: "PR007",

        watermark: "PR008"

    };

    return codes[type] || "PR999";

}

/**
 * ========================================================
 * Violation Codes
 * ========================================================
 */

static getViolationCode(type) {

    const codes = {

        logo: "PR001",

        qr: "PR002",

        cta: "PR003",

        brand: "PR004",

        product: "PR005",

        avatar: "PR006",

        hero: "PR007",

        watermark: "PR008"

    };

    return codes[type] || "PR999";

}

}

window.ProtectedRegionValidator = ProtectedRegionValidator;
