/**
 * ============================================================
 * PHOENIX AI
 * Asset DNA Engine
 * ------------------------------------------------------------
 * Version : 1.0.0
 *
 * Responsibility:
 * Analyze an Intent Profile and determine the
 * visual assets required for a marketing creative.
 *
 * Factors:
 *
 * - Business
 * - Campaign
 * - Audience
 * - Emotion
 * - Visual Style
 *
 * Public API:
 *
 * PhoenixAssetDNA.generate(intentProfile)
 *
 * ============================================================
 */

const PHOENIX_ASSET_VERSION = "1.0.0";

const PhoenixAssetDNA = {

    generate(intentProfile) {

        const assetPlan = this.selectAssets(intentProfile);

        return this.buildAssets(assetPlan);

    },
    
      selectAssets(intentProfile) {

        if (!intentProfile || typeof intentProfile !== "object") {
            return "default";
        }

        const { business, campaign, audience, emotion } = intentProfile;

        // Business-first decisions
        if (business === "coffee-shop") {
            return "coffee-branding";
        }

        if (business === "restaurant") {
            return "food-showcase";
        }

        if (business === "hospital" || business === "clinic") {
            return "medical-professional";
        }

        if (business === "gym") {
            return "fitness-energy";
        }

        if (business === "hotel") {
            return "luxury-hospitality";
        }

        if (business === "real-estate") {
            return "property-showcase";
        }

        if (business === "education") {
            return "education-learning";
        }

        // Campaign overrides
        if (campaign === "sale") {
            return "promotion-assets";
        }

        if (campaign === "grand-opening") {
            return "grand-opening-assets";
        }

        if (campaign === "new-arrival") {
            return "product-launch";
        }

        // Audience overrides
        if (audience === "families") {
            return "family-lifestyle";
        }

        if (audience === "students") {
            return "student-focused";
        }

        if (audience === "professionals") {
            return "professional-business";
        }

        // Emotion overrides
        if (emotion === "celebration") {
            return "celebration-assets";
        }

        if (emotion === "trust") {
            return "trust-professional";
        }

        if (emotion === "luxury") {
            return "luxury-hospitality";
        }

        return "default";

    },

        buildAssets(assetPlan) {

        const assets = {

            default: {

                hero: "generic",

                background: "gradient",

                supporting: [],

                icons: [],

                decorative: [],

                overlays: [],

                texture: null,

                priority: "headline"

            },

            "coffee-branding": {

                hero: "coffee-cup",

                background: "coffee-shop",

                supporting: ["coffee-beans", "steam"],

                icons: ["location", "clock"],

                decorative: ["leaf-pattern"],

                overlays: ["warm-gradient"],

                texture: "wood",

                priority: "product"

            },

            "food-showcase": {

                hero: "food-photo",

                background: "restaurant",

                supporting: ["ingredients"],

                icons: ["delivery", "chef"],

                decorative: ["spices"],

                overlays: ["soft-shadow"],

                texture: "table",

                priority: "food"

            },

            "medical-professional": {

                hero: "doctor",

                background: "clean-white",

                supporting: ["medical-equipment"],

                icons: ["health", "shield"],

                decorative: [],

                overlays: [],

                texture: null,

                priority: "trust"

            },

            "fitness-energy": {

                hero: "athlete",

                background: "gym",

                supporting: ["equipment"],

                icons: ["fitness"],

                decorative: ["motion-lines"],

                overlays: ["energy-glow"],

                texture: "rubber-floor",

                priority: "action"

            },

            "luxury-hospitality": {

                hero: "luxury-room",

                background: "hotel-interior",

                supporting: ["lighting"],

                icons: ["star"],

                decorative: ["gold-lines"],

                overlays: ["dark-gradient"],

                texture: "marble",

                priority: "experience"

            },

            "property-showcase": {

                hero: "property",

                background: "cityscape",

                supporting: ["interior"],

                icons: ["home", "location"],

                decorative: [],

                overlays: ["glass-overlay"],

                texture: null,

                priority: "property"

            },

            "education-learning": {

                hero: "students",

                background: "classroom",

                supporting: ["books", "laptop"],

                icons: ["education"],

                decorative: ["abstract-shapes"],

                overlays: [],

                texture: null,

                priority: "learning"

            },

            "promotion-assets": {

                hero: "product",

                background: "gradient",

                supporting: ["discount-badge"],

                icons: ["sale"],

                decorative: ["confetti"],

                overlays: ["offer-ribbon"],

                texture: null,

                priority: "offer"

            },

            "grand-opening-assets": {

                hero: "storefront",

                background: "celebration",

                supporting: ["balloons"],

                icons: ["ribbon"],

                decorative: ["confetti"],

                overlays: ["light-rays"],

                texture: null,

                priority: "opening"

            },

            "product-launch": {

                hero: "new-product",

                background: "modern-gradient",

                supporting: ["features"],

                icons: ["spark"],

                decorative: ["glow"],

                overlays: ["spotlight"],

                texture: null,

                priority: "product"

            },

            "family-lifestyle": {

                hero: "family",

                background: "outdoor",

                supporting: ["children"],

                icons: ["heart"],

                decorative: ["soft-circles"],

                overlays: ["warm-light"],

                texture: null,

                priority: "emotion"

            },

            "student-focused": {

                hero: "student",

                background: "campus",

                supporting: ["books"],

                icons: ["graduation"],

                decorative: ["geometric-shapes"],

                overlays: [],

                texture: null,

                priority: "education"

            },

            "professional-business": {

                hero: "professional",

                background: "office",

                supporting: ["laptop"],

                icons: ["briefcase"],

                decorative: [],

                overlays: ["glass-effect"],

                texture: null,

                priority: "professional"

            },

            "celebration-assets": {

                hero: "happy-people",

                background: "festival",

                supporting: ["fireworks"],

                icons: ["party"],

                decorative: ["confetti"],

                overlays: ["color-burst"],

                texture: null,

                priority: "celebration"

            },

            "trust-professional": {

                hero: "team",

                background: "minimal",

                supporting: ["workspace"],

                icons: ["shield"],

                decorative: [],

                overlays: [],

                texture: null,

                priority: "credibility"

            }

        };

        return assets[assetPlan] ?? assets.default;

    },
  
  }    