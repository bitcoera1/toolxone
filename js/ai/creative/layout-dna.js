/**
 * ============================================================
 * PHOENIX AI
 * Layout DNA Engine
 * ------------------------------------------------------------
 * Version : 1.0.0
 *
 * Responsibility:
 * Analyze an Intent Profile and generate an intelligent
 * layout strategy for banners and marketing creatives.
 *
 * Factors:
 *
 * - Business
 * - Campaign
 * - Audience
 * - Visual Style
 * - Platform
 *
 * Public API:
 *
 * PhoenixLayoutDNA.generate(intentProfile)
 *
 * ============================================================
 */

const PHOENIX_LAYOUT_VERSION = "1.0.0";

const PhoenixLayoutDNA = {

    generate(intentProfile) {

        const layout = this.selectLayout(intentProfile);

        return this.buildLayout(layout);

    },
    
      selectLayout(intentProfile) {

        if (!intentProfile || typeof intentProfile !== "object") {
            return "default";
        }

        const { business, campaign, audience, emotion } = intentProfile;

        // Business-first layout
        if (business === "restaurant") {
            return "hero-image-right";
        }

        if (business === "coffee-shop") {
            return "hero-image-left";
        }

        if (business === "hospital" || business === "clinic") {
            return "clean-centered";
        }

        if (business === "gym") {
            return "split-dynamic";
        }

        if (business === "hotel") {
            return "luxury-centered";
        }

        // Campaign overrides
        if (campaign === "sale") {
            return "promotion-banner";
        }

        if (campaign === "grand-opening") {
            return "celebration-hero";
        }

        // Audience overrides
        if (audience === "families") {
            return "family-focus";
        }

        if (audience === "students") {
            return "content-focus";
        }

        // Emotion overrides
        if (emotion === "trust") {
            return "clean-centered";
        }

        if (emotion === "celebration") {
            return "celebration-hero";
        }

        return "default";

    },

        buildLayout(layout) {

        const layouts = {

            default: {

                grid: "12-column",

                alignment: "left",

                safeMargin: 60,

                imageRegion: "right",

                headlineRegion: "left",

                bodyRegion: "left",

                ctaRegion: "bottom-left",

                logoRegion: "top-left"

            },

            "hero-image-left": {

                grid: "12-column",

                alignment: "left",

                safeMargin: 60,

                imageRegion: "left",

                headlineRegion: "right",

                bodyRegion: "right",

                ctaRegion: "bottom-right",

                logoRegion: "top-right"

            },

            "hero-image-right": {

                grid: "12-column",

                alignment: "left",

                safeMargin: 60,

                imageRegion: "right",

                headlineRegion: "left",

                bodyRegion: "left",

                ctaRegion: "bottom-left",

                logoRegion: "top-left"

            },

            "clean-centered": {

                grid: "8-column",

                alignment: "center",

                safeMargin: 80,

                imageRegion: "background",

                headlineRegion: "center",

                bodyRegion: "center",

                ctaRegion: "center-bottom",

                logoRegion: "top-center"

            },

            "split-dynamic": {

                grid: "12-column",

                alignment: "left",

                safeMargin: 50,

                imageRegion: "left-half",

                headlineRegion: "right-half",

                bodyRegion: "right-half",

                ctaRegion: "bottom-right",

                logoRegion: "top-left"

            },

            "luxury-centered": {

                grid: "8-column",

                alignment: "center",

                safeMargin: 100,

                imageRegion: "background",

                headlineRegion: "center",

                bodyRegion: "center",

                ctaRegion: "center-bottom",

                logoRegion: "top-center"

            },

            "promotion-banner": {

                grid: "12-column",

                alignment: "left",

                safeMargin: 40,

                imageRegion: "right",

                headlineRegion: "left",

                bodyRegion: "left",

                ctaRegion: "bottom-left",

                logoRegion: "top-left"

            },

            "celebration-hero": {

                grid: "12-column",

                alignment: "center",

                safeMargin: 60,

                imageRegion: "background",

                headlineRegion: "center",

                bodyRegion: "center",

                ctaRegion: "center-bottom",

                logoRegion: "top-center"

            },

            "family-focus": {

                grid: "12-column",

                alignment: "center",

                safeMargin: 60,

                imageRegion: "bottom",

                headlineRegion: "top",

                bodyRegion: "center",

                ctaRegion: "bottom-center",

                logoRegion: "top-left"

            },

            "content-focus": {

                grid: "8-column",

                alignment: "left",

                safeMargin: 70,

                imageRegion: "top",

                headlineRegion: "top",

                bodyRegion: "center",

                ctaRegion: "bottom",

                logoRegion: "top-right"

            }

        };

        return layouts[layout] ?? layouts.default;

    },

    
  
  }