/**
 * ============================================================
 * PHOENIX AI
 * Creative Blueprint Engine
 * ------------------------------------------------------------
 * Version : 1.0.0
 *
 * Responsibility:
 * Coordinate all Creative DNA engines and merge
 * their outputs into one unified Creative Blueprint.
 *
 * Inputs:
 *
 * - Intent Profile
 *
 * Outputs:
 *
 * - Unified Creative Blueprint
 *
 * Public API:
 *
 * PhoenixCreativeBlueprint.generate(intentProfile)
 *
 * ============================================================
 */

const PHOENIX_CREATIVE_BLUEPRINT_VERSION = "1.0.0";

const PhoenixCreativeBlueprint = {

        generate(intentProfile) {

        const blueprint =
            this.buildBlueprint(intentProfile);

        blueprint.validation =
            this.validateBlueprint(blueprint);

        blueprint.confidence =
            this.calculateConfidence(blueprint);

        return blueprint;

    },
    
       buildBlueprint(intentProfile) {

        return {

            version: PHOENIX_CREATIVE_BLUEPRINT_VERSION,

            generatedAt: new Date().toISOString(),

            intent: intentProfile,

            color:
                PhoenixColorDNA.generate(intentProfile),

            typography:
                PhoenixTypographyDNA.generate(intentProfile),

            layout:
                PhoenixLayoutDNA.generate(intentProfile),

            composition:
                PhoenixCompositionDNA.generate(intentProfile),

            assets:
                PhoenixAssetDNA.generate(intentProfile),

            cta:
                PhoenixCTADNA.generate(intentProfile),

            visualStyle:
                PhoenixVisualStyleDNA.generate(intentProfile)

        };

    },

        validateBlueprint(blueprint) {

        if (!blueprint || typeof blueprint !== "object") {

            return {

                valid: false,

                errors: [
                    "Creative Blueprint is missing."
                ]

            };

        }

        const errors = [];

        if (!blueprint.intent) {
            errors.push("Missing Intent Profile.");
        }

        if (!blueprint.color) {
            errors.push("Missing Color DNA.");
        }

        if (!blueprint.typography) {
            errors.push("Missing Typography DNA.");
        }

        if (!blueprint.layout) {
            errors.push("Missing Layout DNA.");
        }

        if (!blueprint.composition) {
            errors.push("Missing Composition DNA.");
        }

        if (!blueprint.assets) {
            errors.push("Missing Asset DNA.");
        }

        if (!blueprint.cta) {
            errors.push("Missing CTA DNA.");
        }

        if (!blueprint.visualStyle) {
            errors.push("Missing Visual Style DNA.");
        }

        return {

            valid: errors.length === 0,

            errors

        };

    },
    
        calculateConfidence(blueprint) {

        let score = 100;

        if (!blueprint.validation.valid) {
            score -= blueprint.validation.errors.length * 10;
        }

        if (!blueprint.intent) {
            score -= 10;
        }

        if (!blueprint.color) {
            score -= 10;
        }

        if (!blueprint.typography) {
            score -= 10;
        }

        if (!blueprint.layout) {
            score -= 10;
        }

        if (!blueprint.composition) {
            score -= 10;
        }

        if (!blueprint.assets) {
            score -= 10;
        }

        if (!blueprint.cta) {
            score -= 10;
        }

        if (!blueprint.visualStyle) {
            score -= 10;
        }

        score = Math.max(0, Math.min(100, score));

        let level = "Excellent";

        if (score < 90) {
            level = "Good";
        }

        if (score < 75) {
            level = "Fair";
        }

        if (score < 50) {
            level = "Poor";
        }

        return {

            score,

            level

        };

    },

  }    