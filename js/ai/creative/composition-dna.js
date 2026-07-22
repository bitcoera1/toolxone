/**
 * ============================================================
 * PHOENIX AI
 * Composition DNA Engine
 * ------------------------------------------------------------
 * Version : 1.0.0
 *
 * Responsibility:
 * Analyze an Intent Profile and generate intelligent
 * composition strategies for banners and marketing creatives.
 *
 * Factors:
 *
 * - Visual Hierarchy
 * - Balance
 * - Focal Point
 * - Rhythm
 * - White Space
 * - Grouping
 * - Emphasis
 *
 * Public API:
 *
 * PhoenixCompositionDNA.generate(intentProfile)
 *
 * ============================================================
 */

const PHOENIX_COMPOSITION_VERSION = "1.0.0";

const PhoenixCompositionDNA = {

    generate(intentProfile) {

        const composition = this.selectComposition(intentProfile);

        return this.buildComposition(composition);

    },
   
        selectComposition(intentProfile) {

        if (!intentProfile || typeof intentProfile !== "object") {
            return "default";
        }

        const { business, campaign, emotion, audience } = intentProfile;

        // Business-first composition
        if (business === "coffee-shop") {
            return "warm-storytelling";
        }

        if (business === "restaurant") {
            return "food-focus";
        }

        if (business === "hospital" || business === "clinic") {
            return "clean-balanced";
        }

        if (business === "gym") {
            return "dynamic-energy";
        }

        if (business === "hotel") {
            return "luxury-minimal";
        }

        // Campaign overrides
        if (campaign === "sale") {
            return "cta-dominant";
        }

        if (campaign === "grand-opening") {
            return "hero-celebration";
        }

        // Audience overrides
        if (audience === "families") {
            return "friendly-balanced";
        }

        if (audience === "students") {
            return "content-first";
        }

        // Emotion overrides
        if (emotion === "celebration") {
            return "hero-celebration";
        }

        if (emotion === "trust") {
            return "clean-balanced";
        }

        return "default";

    },

        buildComposition(composition) {

        const compositions = {

            default: {

                hierarchy: "headline-first",

                focalPoint: "headline",

                balance: "balanced",

                whiteSpace: "medium",

                rhythm: "vertical",

                grouping: "logical",

                emphasis: "headline",

                readingFlow: "left-to-right"

            },

            "warm-storytelling": {

                hierarchy: "image-first",

                focalPoint: "product",

                balance: "balanced",

                whiteSpace: "generous",

                rhythm: "natural",

                grouping: "story",

                emphasis: "emotion",

                readingFlow: "left-to-right"

            },

            "food-focus": {

                hierarchy: "image-first",

                focalPoint: "food",

                balance: "balanced",

                whiteSpace: "medium",

                rhythm: "vertical",

                grouping: "product",

                emphasis: "image",

                readingFlow: "left-to-right"

            },

            "clean-balanced": {

                hierarchy: "headline-first",

                focalPoint: "headline",

                balance: "symmetrical",

                whiteSpace: "generous",

                rhythm: "calm",

                grouping: "minimal",

                emphasis: "clarity",

                readingFlow: "top-to-bottom"

            },

            "dynamic-energy": {

                hierarchy: "headline-first",

                focalPoint: "headline",

                balance: "asymmetrical",

                whiteSpace: "compact",

                rhythm: "dynamic",

                grouping: "energetic",

                emphasis: "cta",

                readingFlow: "diagonal"

            },

            "luxury-minimal": {

                hierarchy: "headline-first",

                focalPoint: "headline",

                balance: "symmetrical",

                whiteSpace: "very-generous",

                rhythm: "slow",

                grouping: "minimal",

                emphasis: "elegance",

                readingFlow: "center"

            },

            "cta-dominant": {

                hierarchy: "cta-first",

                focalPoint: "cta",

                balance: "balanced",

                whiteSpace: "compact",

                rhythm: "fast",

                grouping: "promotion",

                emphasis: "offer",

                readingFlow: "headline-to-cta"

            },

            "hero-celebration": {

                hierarchy: "hero-first",

                focalPoint: "hero",

                balance: "balanced",

                whiteSpace: "medium",

                rhythm: "energetic",

                grouping: "celebration",

                emphasis: "headline",

                readingFlow: "center-out"

            },

            "friendly-balanced": {

                hierarchy: "headline-first",

                focalPoint: "headline",

                balance: "balanced",

                whiteSpace: "comfortable",

                rhythm: "natural",

                grouping: "friendly",

                emphasis: "message",

                readingFlow: "left-to-right"

            },

            "content-first": {

                hierarchy: "content-first",

                focalPoint: "content",

                balance: "balanced",

                whiteSpace: "medium",

                rhythm: "vertical",

                grouping: "educational",

                emphasis: "information",

                readingFlow: "top-to-bottom"

            }

        };

        return compositions[composition] ?? compositions.default;

    },

    
    
  }