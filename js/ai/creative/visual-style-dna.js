/**
 * ============================================================
 * PHOENIX AI
 * Visual Style DNA Engine
 * ------------------------------------------------------------
 * Version : 1.0.0
 *
 * Responsibility:
 * Analyze an Intent Profile and determine the
 * overall visual style and artistic direction.
 *
 * Factors:
 *
 * - Business
 * - Campaign
 * - Audience
 * - Emotion
 * - Brand Personality
 *
 * Public API:
 *
 * PhoenixVisualStyleDNA.generate(intentProfile)
 *
 * ============================================================
 */

const PHOENIX_VISUAL_STYLE_VERSION = "1.0.0";

const PhoenixVisualStyleDNA = {

    generate(intentProfile) {

        const style = this.selectVisualStyle(intentProfile);

        return this.buildVisualStyle(style);

    },
   
        selectVisualStyle(intentProfile) {

        if (!intentProfile || typeof intentProfile !== "object") {
            return "default";
        }

        const {
            business,
            campaign,
            audience,
            emotion
        } = intentProfile;

        // Business-first styles

        if (business === "coffee-shop") {
            return "warm-modern";
        }

        if (business === "restaurant") {
            return "premium-food";
        }

        if (business === "hospital" || business === "clinic") {
            return "clean-medical";
        }

        if (business === "gym") {
            return "bold-fitness";
        }

        if (business === "hotel") {
            return "luxury-elegant";
        }

        if (business === "real-estate") {
            return "corporate-premium";
        }

        if (business === "education") {
            return "friendly-learning";
        }

        // Campaign styles

        if (campaign === "sale") {
            return "bold-promotion";
        }

        if (campaign === "grand-opening") {
            return "celebration";
        }

        if (campaign === "limited-offer") {
            return "urgent-offer";
        }

        if (campaign === "new-arrival") {
            return "modern-launch";
        }

        // Audience styles

        if (audience === "students") {
            return "playful-modern";
        }

        if (audience === "professionals") {
            return "minimal-corporate";
        }

        if (audience === "families") {
            return "warm-friendly";
        }

        // Emotion styles

        if (emotion === "trust") {
            return "professional-clean";
        }

        if (emotion === "celebration") {
            return "festive";
        }

        if (emotion === "urgency") {
            return "high-energy";
        }

        if (emotion === "luxury") {
            return "luxury-elegant";
        }

        return "default";

    },

        buildVisualStyle(style) {

        const styles = {

            default: {

                personality: "modern",

                mood: "balanced",

                rendering: "clean",

                energy: "medium",

                density: "balanced",

                whitespace: "medium",

                corners: "rounded",

                emphasis: "headline"

            },

            "warm-modern": {

                personality: "friendly",

                mood: "welcoming",

                rendering: "soft",

                energy: "medium",

                density: "comfortable",

                whitespace: "medium",

                corners: "rounded",

                emphasis: "product"

            },

            "premium-food": {

                personality: "premium",

                mood: "delicious",

                rendering: "photographic",

                energy: "medium",

                density: "rich",

                whitespace: "balanced",

                corners: "soft",

                emphasis: "food"

            },

            "clean-medical": {

                personality: "professional",

                mood: "trustworthy",

                rendering: "minimal",

                energy: "low",

                density: "light",

                whitespace: "high",

                corners: "soft",

                emphasis: "trust"

            },

            "bold-fitness": {

                personality: "dynamic",

                mood: "energetic",

                rendering: "high-contrast",

                energy: "high",

                density: "bold",

                whitespace: "low",

                corners: "sharp",

                emphasis: "action"

            },

            "luxury-elegant": {

                personality: "luxury",

                mood: "exclusive",

                rendering: "premium",

                energy: "low",

                density: "minimal",

                whitespace: "high",

                corners: "soft",

                emphasis: "experience"

            },

            "corporate-premium": {

                personality: "professional",

                mood: "confident",

                rendering: "clean",

                energy: "medium",

                density: "balanced",

                whitespace: "medium",

                corners: "subtle",

                emphasis: "credibility"

            },

            "friendly-learning": {

                personality: "educational",

                mood: "encouraging",

                rendering: "illustrative",

                energy: "medium",

                density: "comfortable",

                whitespace: "medium",

                corners: "rounded",

                emphasis: "learning"

            },

            "bold-promotion": {

                personality: "promotional",

                mood: "exciting",

                rendering: "vibrant",

                energy: "high",

                density: "bold",

                whitespace: "low",

                corners: "sharp",

                emphasis: "offer"

            },

            "celebration": {

                personality: "festive",

                mood: "joyful",

                rendering: "colorful",

                energy: "high",

                density: "rich",

                whitespace: "medium",

                corners: "rounded",

                emphasis: "event"

            },

            "urgent-offer": {

                personality: "urgent",

                mood: "fast-paced",

                rendering: "high-impact",

                energy: "high",

                density: "dense",

                whitespace: "low",

                corners: "sharp",

                emphasis: "cta"

            },

            "modern-launch": {

                personality: "innovative",

                mood: "fresh",

                rendering: "sleek",

                energy: "medium",

                density: "balanced",

                whitespace: "medium",

                corners: "soft",

                emphasis: "product"

            },

            "playful-modern": {

                personality: "playful",

                mood: "fun",

                rendering: "bright",

                energy: "high",

                density: "comfortable",

                whitespace: "medium",

                corners: "rounded",

                emphasis: "engagement"

            },

            "minimal-corporate": {

                personality: "corporate",

                mood: "focused",

                rendering: "minimal",

                energy: "low",

                density: "light",

                whitespace: "high",

                corners: "subtle",

                emphasis: "message"

            },

            "warm-friendly": {

                personality: "friendly",

                mood: "comforting",

                rendering: "soft",

                energy: "medium",

                density: "balanced",

                whitespace: "medium",

                corners: "rounded",

                emphasis: "emotion"

            },

            "professional-clean": {

                personality: "professional",

                mood: "reliable",

                rendering: "clean",

                energy: "low",

                density: "light",

                whitespace: "high",

                corners: "soft",

                emphasis: "credibility"

            },

            "festive": {

                personality: "celebratory",

                mood: "happy",

                rendering: "vivid",

                energy: "high",

                density: "rich",

                whitespace: "medium",

                corners: "rounded",

                emphasis: "celebration"

            },

            "high-energy": {

                personality: "dynamic",

                mood: "urgent",

                rendering: "bold",

                energy: "high",

                density: "dense",

                whitespace: "low",

                corners: "sharp",

                emphasis: "action"

            }

        };

        return styles[style] ?? styles.default;

    },
    
  }      