/**
 * ============================================================
 * PHOENIX AI
 * Color DNA Engine
 * ------------------------------------------------------------
 * Version : 1.0.0
 *
 * Responsibility:
 * Analyze an Intent Profile and generate an intelligent
 * color palette based on:
 *
 * - Business
 * - Campaign
 * - Audience
 * - Emotion
 * - Visual Style
 *
 * Public API:
 *
 * PhoenixColorDNA.generate(intentProfile)
 *
 * ============================================================
 */

const PHOENIX_COLOR_VERSION = "1.0.0";

const PhoenixColorDNA = {

    generate(intentProfile) {

        const palette = this.selectPalette(intentProfile);

        return this.buildPalette(palette);

    },
   
      selectPalette(intentProfile) {

        if (!intentProfile || typeof intentProfile !== "object") {
            return "default";
        }

        const { business, emotion, campaign } = intentProfile;

        // Business-first palette selection
        if (business === "coffee-shop") {
            return "coffee";
        }

        if (business === "restaurant") {
            return "restaurant";
        }

        if (business === "hospital" || business === "clinic") {
            return "medical";
        }

        if (business === "gym") {
            return "fitness";
        }

        if (business === "hotel") {
            return "luxury";
        }

        // Emotion overrides
        if (emotion === "celebration") {
            return "celebration";
        }

        if (emotion === "trust") {
            return "trust";
        }

        if (emotion === "warmth") {
            return "warm";
        }

        // Campaign overrides
        if (campaign === "sale") {
            return "sale";
        }

        if (campaign === "grand-opening") {
            return "grand-opening";
        }

        return "default";

    },
    
        buildPalette(palette) {

        const palettes = {

            default: {

                primary: "#2563EB",

                secondary: "#60A5FA",

                accent: "#F59E0B",

                background: "#FFFFFF",

                surface: "#F8FAFC",

                text: "#1F2937"

            },

            coffee: {

                primary: "#6F4E37",

                secondary: "#A67C52",

                accent: "#D4A373",

                background: "#FFF8F0",

                surface: "#F8EFE6",

                text: "#2E1F15"

            },

            restaurant: {

                primary: "#C0392B",

                secondary: "#E67E22",

                accent: "#F4D03F",

                background: "#FFF9F4",

                surface: "#FFF3E8",

                text: "#2C1810"

            },

            medical: {

                primary: "#2563EB",

                secondary: "#38BDF8",

                accent: "#10B981",

                background: "#F8FCFF",

                surface: "#EEF8FF",

                text: "#1E293B"

            },

            fitness: {

                primary: "#DC2626",

                secondary: "#F97316",

                accent: "#FACC15",

                background: "#FFF7F7",

                surface: "#FFEFEF",

                text: "#1F2937"

            },

            luxury: {

                primary: "#111827",

                secondary: "#374151",

                accent: "#D4AF37",

                background: "#FCFCFC",

                surface: "#F5F5F5",

                text: "#111827"

            },

            sale: {

                primary: "#DC2626",

                secondary: "#F97316",

                accent: "#FACC15",

                background: "#FFF7F7",

                surface: "#FFF1F1",

                text: "#1F2937"

            },

            celebration: {

                primary: "#7C3AED",

                secondary: "#EC4899",

                accent: "#FACC15",

                background: "#FFF9FE",

                surface: "#FFF1FA",

                text: "#312E81"

            },

            trust: {

                primary: "#1D4ED8",

                secondary: "#3B82F6",

                accent: "#06B6D4",

                background: "#F8FCFF",

                surface: "#EEF7FF",

                text: "#1E3A8A"

            },

            warm: {

                primary: "#92400E",

                secondary: "#D97706",

                accent: "#FBBF24",

                background: "#FFF9EB",

                surface: "#FFF4D6",

                text: "#3F2A14"

            },

            "grand-opening": {

                primary: "#7C3AED",

                secondary: "#EC4899",

                accent: "#FACC15",

                background: "#FFF9FE",

                surface: "#FFF3FA",

                text: "#312E81"

            }

        };

        return palettes[palette] ?? palettes.default;

    },

    

  }