/* =========================================================
   TOOLXONE AI CREATIVE ENGINE
   File: js/ai/design-engine.js

   Responsibility:
   Convert a structured creative brief into a complete
   visual design direction.

   It decides:
   - Color palette
   - Layout
   - Typography
   - Visual hierarchy
   - Graphic placement
   - Decorations
   - Background treatment
   - Branding placement
   - CTA treatment
   - Platform-safe spacing
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       1. REQUIRED ENGINE CHECK
       ===================================================== */

    if (!window.ToolXoneAI) {
        console.error(
            "[ToolXone AI] ai-core.js must load before design-engine.js."
        );

        return;
    }


    /* =====================================================
       2. PLATFORM SPECIFICATIONS
       ===================================================== */

    const PLATFORM_SPECS = Object.freeze({
        facebook: {
            id: "facebook",
            label: "Facebook Post",
            width: 1200,
            height: 630,
            orientation: "landscape",
            safeMarginPercent: 6,
            headlineMaxLines: 3,
            preferredAlignment: "left"
        },

        linkedin: {
            id: "linkedin",
            label: "LinkedIn Post",
            width: 1200,
            height: 627,
            orientation: "landscape",
            safeMarginPercent: 7,
            headlineMaxLines: 3,
            preferredAlignment: "left"
        },

        instagram: {
            id: "instagram",
            label: "Instagram Portrait",
            width: 1080,
            height: 1350,
            orientation: "portrait",
            safeMarginPercent: 8,
            headlineMaxLines: 4,
            preferredAlignment: "center"
        },

        pinterest: {
            id: "pinterest",
            label: "Pinterest Pin",
            width: 1000,
            height: 1500,
            orientation: "portrait",
            safeMarginPercent: 8,
            headlineMaxLines: 5,
            preferredAlignment: "center"
        },

        xpost: {
            id: "xpost",
            label: "X Post",
            width: 1600,
            height: 900,
            orientation: "landscape",
            safeMarginPercent: 6,
            headlineMaxLines: 3,
            preferredAlignment: "left"
        },

        medium: {
            id: "medium",
            label: "Medium Cover",
            width: 1600,
            height: 900,
            orientation: "landscape",
            safeMarginPercent: 8,
            headlineMaxLines: 3,
            preferredAlignment: "left"
        },

        youtube: {
            id: "youtube",
            label: "YouTube Thumbnail",
            width: 1280,
            height: 720,
            orientation: "landscape",
            safeMarginPercent: 7,
            headlineMaxLines: 3,
            preferredAlignment: "left"
        }
    });


    /* =====================================================
       3. PROFESSIONAL COLOR PALETTES
       ===================================================== */

    const COLOR_PALETTES = Object.freeze({
        emerald: {
            id: "emerald",
            label: "Emerald Confidence",
            primary: "#047857",
            secondary: "#10B981",
            accent: "#FACC15",
            background: "#064E3B",
            backgroundSecondary: "#10B981",
            text: "#FFFFFF",
            textSoft: "rgba(255,255,255,0.84)",
            surface: "#FFFFFF",
            contrast: "light"
        },

        blue: {
            id: "blue",
            label: "Technology Blue",
            primary: "#1D4ED8",
            secondary: "#2563EB",
            accent: "#38BDF8",
            background: "#172554",
            backgroundSecondary: "#2563EB",
            text: "#FFFFFF",
            textSoft: "rgba(255,255,255,0.84)",
            surface: "#FFFFFF",
            contrast: "light"
        },

        dark: {
            id: "dark",
            label: "High-Impact Dark",
            primary: "#0F172A",
            secondary: "#334155",
            accent: "#10B981",
            background: "#020617",
            backgroundSecondary: "#1E293B",
            text: "#FFFFFF",
            textSoft: "#CBD5E1",
            surface: "#10B981",
            contrast: "light"
        },

        minimal: {
            id: "minimal",
            label: "Clean Minimal",
            primary: "#0F172A",
            secondary: "#64748B",
            accent: "#10B981",
            background: "#FFFFFF",
            backgroundSecondary: "#EAF0F6",
            text: "#102238",
            textSoft: "#526174",
            surface: "#10B981",
            contrast: "dark"
        },

        purple: {
            id: "purple",
            label: "Creative Purple",
            primary: "#6D28D9",
            secondary: "#8B5CF6",
            accent: "#F0ABFC",
            background: "#3B0764",
            backgroundSecondary: "#8B5CF6",
            text: "#FFFFFF",
            textSoft: "rgba(255,255,255,0.84)",
            surface: "#FFFFFF",
            contrast: "light"
        },

        warm: {
            id: "warm",
            label: "Warm & Welcoming",
            primary: "#7C2D12",
            secondary: "#C2410C",
            accent: "#FBBF24",
            background: "#431407",
            backgroundSecondary: "#EA580C",
            text: "#FFF7ED",
            textSoft: "#FED7AA",
            surface: "#FFF7ED",
            contrast: "light"
        },

        luxury: {
            id: "luxury",
            label: "Luxury Black & Gold",
            primary: "#18181B",
            secondary: "#3F3F46",
            accent: "#D4AF37",
            background: "#09090B",
            backgroundSecondary: "#27272A",
            text: "#FAFAF9",
            textSoft: "#D6D3D1",
            surface: "#D4AF37",
            contrast: "light"
        },

        playful: {
            id: "playful",
            label: "Playful Bright",
            primary: "#7C3AED",
            secondary: "#EC4899",
            accent: "#FACC15",
            background: "#4C1D95",
            backgroundSecondary: "#DB2777",
            text: "#FFFFFF",
            textSoft: "#FCE7F3",
            surface: "#FFFFFF",
            contrast: "light"
        },

        promotional: {
            id: "promotional",
            label: "Promotional Energy",
            primary: "#B91C1C",
            secondary: "#F97316",
            accent: "#FACC15",
            background: "#7F1D1D",
            backgroundSecondary: "#EA580C",
            text: "#FFFFFF",
            textSoft: "#FFEDD5",
            surface: "#FACC15",
            contrast: "light"
        }
    });


    /* =====================================================
       4. TYPOGRAPHY SYSTEMS
       ===================================================== */

    const TYPOGRAPHY_SYSTEMS = Object.freeze({
        professional: {
            id: "professional",
            label: "Professional Sans",
            headingFamily:
                "Inter, Arial, Helvetica, sans-serif",
            bodyFamily:
                "Inter, Arial, Helvetica, sans-serif",
            headingWeight: 850,
            bodyWeight: 500,
            headingLetterSpacing: "-0.04em",
            bodyLetterSpacing: "0",
            headingCase: "title",
            personality: "clear and trustworthy"
        },

        bold: {
            id: "bold",
            label: "Bold Display",
            headingFamily:
                "Arial Black, Inter, Arial, sans-serif",
            bodyFamily:
                "Inter, Arial, Helvetica, sans-serif",
            headingWeight: 950,
            bodyWeight: 550,
            headingLetterSpacing: "-0.055em",
            bodyLetterSpacing: "0",
            headingCase: "uppercase",
            personality: "powerful and energetic"
        },

        friendly: {
            id: "friendly",
            label: "Friendly Rounded",
            headingFamily:
                "Inter, Arial, Helvetica, sans-serif",
            bodyFamily:
                "Inter, Arial, Helvetica, sans-serif",
            headingWeight: 850,
            bodyWeight: 500,
            headingLetterSpacing: "-0.035em",
            bodyLetterSpacing: "0",
            headingCase: "title",
            personality: "warm and approachable"
        },

        luxury: {
            id: "luxury",
            label: "Luxury Editorial",
            headingFamily:
                "Georgia, Times New Roman, serif",
            bodyFamily:
                "Inter, Arial, Helvetica, sans-serif",
            headingWeight: 700,
            bodyWeight: 450,
            headingLetterSpacing: "-0.025em",
            bodyLetterSpacing: "0.02em",
            headingCase: "title",
            personality: "premium and elegant"
        },

        minimal: {
            id: "minimal",
            label: "Minimal Modern",
            headingFamily:
                "Inter, Arial, Helvetica, sans-serif",
            bodyFamily:
                "Inter, Arial, Helvetica, sans-serif",
            headingWeight: 750,
            bodyWeight: 450,
            headingLetterSpacing: "-0.035em",
            bodyLetterSpacing: "0.01em",
            headingCase: "title",
            personality: "clean and calm"
        },

        creative: {
            id: "creative",
            label: "Creative Display",
            headingFamily:
                "Trebuchet MS, Inter, Arial, sans-serif",
            bodyFamily:
                "Inter, Arial, Helvetica, sans-serif",
            headingWeight: 900,
            bodyWeight: 500,
            headingLetterSpacing: "-0.045em",
            bodyLetterSpacing: "0",
            headingCase: "title",
            personality: "expressive and imaginative"
        },

        urgent: {
            id: "urgent",
            label: "Promotional Impact",
            headingFamily:
                "Arial Black, Inter, Arial, sans-serif",
            bodyFamily:
                "Inter, Arial, Helvetica, sans-serif",
            headingWeight: 950,
            bodyWeight: 650,
            headingLetterSpacing: "-0.045em",
            bodyLetterSpacing: "0.01em",
            headingCase: "uppercase",
            personality: "urgent and persuasive"
        },

        playful: {
            id: "playful",
            label: "Playful Rounded",
            headingFamily:
                "Trebuchet MS, Arial, sans-serif",
            bodyFamily:
                "Inter, Arial, Helvetica, sans-serif",
            headingWeight: 900,
            bodyWeight: 550,
            headingLetterSpacing: "-0.03em",
            bodyLetterSpacing: "0",
            headingCase: "title",
            personality: "cheerful and energetic"
        }
    });


    /* =====================================================
       5. LAYOUT DEFINITIONS
       ===================================================== */

    const LAYOUT_SYSTEMS = Object.freeze({
        "bold-left": {
            id: "bold-left",
            label: "Bold Left",
            textAlignment: "left",
            contentWidthPercent: 70,
            visualZone: "right",
            brandPosition: "top-left",
            ctaPosition: "bottom-right",
            headlinePosition: "center-left",
            visualWeight: "text-dominant",
            bestFor: [
                "business",
                "technology",
                "finance",
                "general promotion"
            ]
        },

        "centered-hero": {
            id: "centered-hero",
            label: "Centered Hero",
            textAlignment: "center",
            contentWidthPercent: 84,
            visualZone: "background-center",
            brandPosition: "top-center",
            ctaPosition: "bottom-center",
            headlinePosition: "center",
            visualWeight: "balanced",
            bestFor: [
                "food",
                "education",
                "events",
                "portrait formats"
            ]
        },

        "split-layout": {
            id: "split-layout",
            label: "Split Layout",
            textAlignment: "left",
            contentWidthPercent: 48,
            visualZone: "right-half",
            brandPosition: "top-left",
            ctaPosition: "bottom-left",
            headlinePosition: "center-left",
            visualWeight: "image-dominant",
            bestFor: [
                "real estate",
                "travel",
                "services",
                "product marketing"
            ]
        },

        "minimal-editorial": {
            id: "minimal-editorial",
            label: "Minimal Editorial",
            textAlignment: "left",
            contentWidthPercent: 62,
            visualZone: "subtle-right",
            brandPosition: "top-left",
            ctaPosition: "bottom-left",
            headlinePosition: "center-left",
            visualWeight: "space-dominant",
            bestFor: [
                "luxury",
                "fashion",
                "beauty",
                "professional services"
            ]
        },

        "product-spotlight": {
            id: "product-spotlight",
            label: "Product Spotlight",
            textAlignment: "left",
            contentWidthPercent: 46,
            visualZone: "right-product",
            brandPosition: "top-left",
            ctaPosition: "bottom-left",
            headlinePosition: "center-left",
            visualWeight: "product-dominant",
            bestFor: [
                "e-commerce",
                "beauty",
                "fashion",
                "food products"
            ]
        },

        "promotional-sale": {
            id: "promotional-sale",
            label: "Promotional Sale",
            textAlignment: "left",
            contentWidthPercent: 64,
            visualZone: "right-offer",
            brandPosition: "top-left",
            ctaPosition: "bottom-right",
            headlinePosition: "center-left",
            visualWeight: "offer-dominant",
            bestFor: [
                "discounts",
                "sales",
                "limited offers",
                "grand openings"
            ]
        },

        "modern-technology": {
            id: "modern-technology",
            label: "Modern Technology",
            textAlignment: "left",
            contentWidthPercent: 64,
            visualZone: "right-interface",
            brandPosition: "top-left",
            ctaPosition: "bottom-right",
            headlinePosition: "center-left",
            visualWeight: "balanced",
            bestFor: [
                "technology",
                "gaming",
                "software",
                "digital services"
            ]
        }
    });


    /* =====================================================
       6. DECORATION SYSTEMS
       ===================================================== */

    const DECORATION_SYSTEMS = Object.freeze({
        organic: {
            id: "organic",
            shapes: [
                "soft circles",
                "leaf curves",
                "blurred organic forms"
            ],
            borderRadius: "large",
            intensity: "soft"
        },

        geometric: {
            id: "geometric",
            shapes: [
                "circles",
                "angled panels",
                "grid lines",
                "outlined rings"
            ],
            borderRadius: "medium",
            intensity: "medium"
        },

        technological: {
            id: "technological",
            shapes: [
                "glowing lines",
                "circuit traces",
                "interface cards",
                "digital particles"
            ],
            borderRadius: "medium",
            intensity: "strong"
        },

        editorial: {
            id: "editorial",
            shapes: [
                "thin divider lines",
                "large whitespace",
                "subtle blocks"
            ],
            borderRadius: "small",
            intensity: "minimal"
        },

        energetic: {
            id: "energetic",
            shapes: [
                "diagonal streaks",
                "speed lines",
                "high-contrast circles",
                "burst shapes"
            ],
            borderRadius: "medium",
            intensity: "strong"
        },

        luxury: {
            id: "luxury",
            shapes: [
                "thin gold lines",
                "soft spotlight",
                "subtle metallic glow",
                "elegant frame"
            ],
            borderRadius: "small",
            intensity: "soft"
        },

        playful: {
            id: "playful",
            shapes: [
                "colorful blobs",
                "small stars",
                "rounded stickers",
                "floating dots"
            ],
            borderRadius: "extra-large",
            intensity: "strong"
        }
    });


    /* =====================================================
       7. MAIN DESIGN FUNCTION
       ===================================================== */

    function createDesign(creativeBrief, options = {}) {
        validateCreativeBrief(creativeBrief);

        const platform = resolvePlatform(
            options.platform ||
            creativeBrief.platform?.id
        );

        const toneId = resolveToneId(
            options.tone ||
            creativeBrief.tone?.id
        );

        const requestedTheme =
            options.theme ||
            creativeBrief.recommendedTheme?.id;

        const requestedLayout =
            options.layout ||
            creativeBrief.recommendedLayout?.id;

        const palette = selectPalette({
            requestedTheme,
            creativeBrief,
            toneId
        });

        const typography = selectTypography({
            toneId,
            creativeBrief
        });

        const layout = selectLayout({
            requestedLayout,
            platform,
            creativeBrief,
            toneId
        });

        const decorations = selectDecorations({
            creativeBrief,
            toneId,
            palette,
            layout
        });

        const visualHierarchy = buildVisualHierarchy({
            platform,
            layout,
            typography,
            creativeBrief
        });

        const assetPlan = buildAssetPlan({
            creativeBrief,
            platform,
            layout,
            toneId
        });

        const background = createBackgroundPlan({
            creativeBrief,
            palette,
            decorations,
            assetPlan,
            layout
        });

        const branding = createBrandingPlan({
            layout,
            palette,
            platform
        });

        const callToAction = createCallToActionPlan({
            layout,
            palette,
            toneId,
            creativeBrief
        });

        const accessibility = createAccessibilityPlan({
            palette,
            platform,
            typography
        });

        const responsiveRules = createResponsiveRules({
            platform,
            layout
        });

        const design = {
            id: createId("design"),

            briefId: creativeBrief.id || "",

            platform,

            palette,

            typography,

            layout,

            decorations,

            visualHierarchy,

            assetPlan,

            background,

            branding,

            callToAction,

            accessibility,

            responsiveRules,

            cssVariables: createCssVariables({
                palette,
                typography,
                layout,
                platform
            }),

            designExplanation: createDesignExplanation({
                creativeBrief,
                platform,
                palette,
                typography,
                layout,
                decorations,
                assetPlan,
                callToAction
            }),

            qualityChecks: createQualityChecks({
                platform,
                palette,
                typography,
                layout,
                assetPlan
            }),

            createdAt: new Date().toISOString()
        };

        window.ToolXoneAI.emit(
            "design:created",
            {
                design: clone(design)
            }
        );

        return clone(design);
    }


    /* =====================================================
       8. CREATIVE BRIEF VALIDATION
       ===================================================== */

    function validateCreativeBrief(brief) {
        if (!brief || typeof brief !== "object") {
            throw new window.ToolXoneAI.ToolXoneAIError(
                "A valid creative brief is required.",
                "INVALID_CREATIVE_BRIEF"
            );
        }

        if (!brief.industry || !brief.platform) {
            throw new window.ToolXoneAI.ToolXoneAIError(
                "The creative brief is missing required design information.",
                "INCOMPLETE_CREATIVE_BRIEF"
            );
        }
    }


    /* =====================================================
       9. PLATFORM RESOLUTION
       ===================================================== */

    function resolvePlatform(platformId) {
        const safeId =
            typeof platformId === "string"
                ? platformId.toLowerCase().trim()
                : "facebook";

        return clone(
            PLATFORM_SPECS[safeId] ||
            PLATFORM_SPECS.facebook
        );
    }


    /* =====================================================
       10. TONE RESOLUTION
       ===================================================== */

    function resolveToneId(toneId) {
        const supported = [
            "professional",
            "bold",
            "friendly",
            "luxury",
            "minimal",
            "creative",
            "urgent",
            "playful"
        ];

        const safeTone =
            typeof toneId === "string"
                ? toneId.toLowerCase().trim()
                : "professional";

        return supported.includes(safeTone)
            ? safeTone
            : "professional";
    }


    /* =====================================================
       11. PALETTE SELECTION
       ===================================================== */

    function selectPalette({
        requestedTheme,
        creativeBrief,
        toneId
    }) {
        const normalizedTheme =
            normalizePaletteId(requestedTheme);

        if (COLOR_PALETTES[normalizedTheme]) {
            return clone(
                COLOR_PALETTES[normalizedTheme]
            );
        }

        const industryId =
            creativeBrief.industry?.id || "general";

        if (toneId === "luxury") {
            return clone(COLOR_PALETTES.luxury);
        }

        if (toneId === "playful") {
            return clone(COLOR_PALETTES.playful);
        }

        if (toneId === "urgent") {
            return clone(COLOR_PALETTES.promotional);
        }

        const industryPaletteMap = {
            "coffee-shop": "warm",
            restaurant: "warm",
            bakery: "warm",
            technology: "blue",
            finance: "emerald",
            "real-estate": "blue",
            fitness: "dark",
            beauty: "purple",
            fashion: "minimal",
            education: "blue",
            travel: "blue",
            gaming: "dark",
            healthcare: "emerald",
            ecommerce: "purple"
        };

        const paletteId =
            industryPaletteMap[industryId] ||
            "emerald";

        return clone(COLOR_PALETTES[paletteId]);
    }

    function normalizePaletteId(value) {
        if (typeof value !== "string") {
            return "";
        }

        const normalized =
            value.toLowerCase().trim();

        const aliases = {
            green: "emerald",
            orange: "warm",
            coffee: "warm",
            gold: "luxury",
            premium: "luxury",
            sale: "promotional",
            bright: "playful"
        };

        return aliases[normalized] || normalized;
    }


    /* =====================================================
       12. TYPOGRAPHY SELECTION
       ===================================================== */

    function selectTypography({
        toneId,
        creativeBrief
    }) {
        const industryId =
            creativeBrief.industry?.id || "general";

        if (
            industryId === "gaming" ||
            industryId === "fitness"
        ) {
            return clone(TYPOGRAPHY_SYSTEMS.bold);
        }

        if (
            industryId === "beauty" ||
            industryId === "fashion"
        ) {
            if (toneId === "luxury") {
                return clone(
                    TYPOGRAPHY_SYSTEMS.luxury
                );
            }
        }

        return clone(
            TYPOGRAPHY_SYSTEMS[toneId] ||
            TYPOGRAPHY_SYSTEMS.professional
        );
    }


    /* =====================================================
       13. LAYOUT SELECTION
       ===================================================== */

    function selectLayout({
        requestedLayout,
        platform,
        creativeBrief,
        toneId
    }) {
        if (
            requestedLayout &&
            LAYOUT_SYSTEMS[requestedLayout]
        ) {
            return adaptLayoutForPlatform(
                LAYOUT_SYSTEMS[requestedLayout],
                platform
            );
        }

        const industryId =
            creativeBrief.industry?.id || "general";

        let layoutId = "bold-left";

        if (
            platform.orientation === "portrait"
        ) {
            layoutId = "centered-hero";
        }

        if (
            industryId === "technology" ||
            industryId === "gaming"
        ) {
            layoutId = "modern-technology";
        }

        if (
            industryId === "ecommerce" ||
            industryId === "beauty" ||
            industryId === "fashion"
        ) {
            layoutId = "product-spotlight";
        }

        if (
            industryId === "real-estate" ||
            industryId === "travel"
        ) {
            layoutId = "split-layout";
        }

        if (
            toneId === "luxury" ||
            toneId === "minimal"
        ) {
            layoutId = "minimal-editorial";
        }

        if (
            toneId === "urgent" ||
            creativeBrief.goal?.id === "sale"
        ) {
            layoutId = "promotional-sale";
        }

        return adaptLayoutForPlatform(
            LAYOUT_SYSTEMS[layoutId],
            platform
        );
    }

    function adaptLayoutForPlatform(
        baseLayout,
        platform
    ) {
        const layout = clone(baseLayout);

        if (platform.orientation === "portrait") {
            layout.contentWidthPercent =
                Math.max(
                    78,
                    layout.contentWidthPercent
                );

            layout.visualZone =
                layout.id === "product-spotlight"
                    ? "lower-product"
                    : "background-center";

            layout.brandPosition = "top-center";

            if (
                layout.id !== "product-spotlight"
            ) {
                layout.ctaPosition = "bottom-center";
            }

            layout.headlinePosition = "center";
            layout.textAlignment = "center";
        }

        if (platform.id === "youtube") {
            layout.contentWidthPercent =
                Math.min(
                    layout.contentWidthPercent,
                    62
                );

            layout.headlinePosition = "center-left";
        }

        return layout;
    }


    /* =====================================================
       14. DECORATION SELECTION
       ===================================================== */

    function selectDecorations({
        creativeBrief,
        toneId,
        palette,
        layout
    }) {
        const industryId =
            creativeBrief.industry?.id || "general";

        let decorationId = "geometric";

        if (
            [
                "coffee-shop",
                "restaurant",
                "bakery",
                "healthcare"
            ].includes(industryId)
        ) {
            decorationId = "organic";
        }

        if (
            [
                "technology",
                "gaming",
                "finance"
            ].includes(industryId)
        ) {
            decorationId = "technological";
        }

        if (
            toneId === "luxury" ||
            palette.id === "luxury"
        ) {
            decorationId = "luxury";
        }

        if (
            toneId === "minimal" ||
            layout.id === "minimal-editorial"
        ) {
            decorationId = "editorial";
        }

        if (
            toneId === "urgent" ||
            layout.id === "promotional-sale" ||
            industryId === "fitness"
        ) {
            decorationId = "energetic";
        }

        if (toneId === "playful") {
            decorationId = "playful";
        }

        return clone(
            DECORATION_SYSTEMS[decorationId]
        );
    }


    /* =====================================================
       15. VISUAL HIERARCHY
       ===================================================== */

    function buildVisualHierarchy({
        platform,
        layout,
        typography,
        creativeBrief
    }) {
        const portrait =
            platform.orientation === "portrait";

        const headlineScale =
            platform.id === "youtube"
                ? 9
                : portrait
                    ? 7
                    : 8;

        return {
            order: [
                "brand",
                "kicker",
                "headline",
                "subtitle",
                "visual asset",
                "website",
                "call to action"
            ],

            headline: {
                priority: 1,
                maxLines: platform.headlineMaxLines,
                relativeScale: headlineScale,
                fontWeight: typography.headingWeight,
                alignment: layout.textAlignment
            },

            subtitle: {
                priority: 2,
                maxLines: portrait ? 5 : 3,
                relativeScale: 2.2,
                alignment: layout.textAlignment
            },

            visualAsset: {
                priority:
                    layout.visualWeight ===
                    "image-dominant"
                        ? 1
                        : 2,

                maximumAreaPercent:
                    layout.id === "product-spotlight"
                        ? 48
                        : 38
            },

            callToAction: {
                priority: 2,
                style: "high-contrast pill",
                placement: layout.ctaPosition
            },

            brand: {
                priority: 3,
                placement: layout.brandPosition
            },

            safeMarginPercent:
                platform.safeMarginPercent,

            messageGoal:
                creativeBrief.goal?.label ||
                "Brand Awareness"
        };
    }


    /* =====================================================
       16. ASSET PLAN
       ===================================================== */

    function buildAssetPlan({
        creativeBrief,
        platform,
        layout,
        toneId
    }) {
        const sourceElements =
            Array.isArray(
                creativeBrief.visualElements
            )
                ? creativeBrief.visualElements
                : [];

        const selectedElements =
            sourceElements
                .filter(Boolean)
                .slice(0, 5);

        const heroElement =
            selectedElements[0] ||
            "context-aware abstract illustration";

        const supportingElements =
            selectedElements.slice(1, 4);

        return {
            heroElement,

            supportingElements,

            preferredAssetType:
                chooseAssetType({
                    creativeBrief,
                    toneId
                }),

            heroPlacement: layout.visualZone,

            heroScalePercent:
                layout.id === "product-spotlight"
                    ? 46
                    : platform.orientation === "portrait"
                        ? 38
                        : 34,

            decorativeAssetCount:
                toneId === "minimal"
                    ? 1
                    : toneId === "playful"
                        ? 5
                        : 3,

            iconStyle:
                chooseIconStyle(toneId),

            cropStrategy:
                layout.id === "split-layout"
                    ? "edge-to-edge"
                    : "contained",

            useBackgroundImage:
                shouldUseBackgroundImage(
                    creativeBrief,
                    layout
                ),

            generatedImagePrompt:
                creativeBrief.backgroundDirection || ""
        };
    }

    function chooseAssetType({
        creativeBrief,
        toneId
    }) {
        const industryId =
            creativeBrief.industry?.id || "general";

        if (
            [
                "real-estate",
                "travel",
                "restaurant",
                "fashion"
            ].includes(industryId)
        ) {
            return "photographic hero image";
        }

        if (
            [
                "technology",
                "finance",
                "education",
                "healthcare"
            ].includes(industryId)
        ) {
            return "vector illustration with icons";
        }

        if (toneId === "luxury") {
            return "premium product photography";
        }

        if (toneId === "playful") {
            return "colorful vector illustration";
        }

        return "context-aware vector illustration";
    }

    function chooseIconStyle(toneId) {
        const styles = {
            professional: "clean outlined icons",
            bold: "solid high-contrast icons",
            friendly: "soft rounded icons",
            luxury: "thin elegant icons",
            minimal: "simple line icons",
            creative: "expressive illustrated icons",
            urgent: "bold promotional icons",
            playful: "colorful 3D-style icons"
        };

        return styles[toneId] ||
            styles.professional;
    }

    function shouldUseBackgroundImage(
        creativeBrief,
        layout
    ) {
        const industryId =
            creativeBrief.industry?.id || "";

        return (
            [
                "travel",
                "real-estate",
                "restaurant"
            ].includes(industryId) ||
            layout.id === "split-layout"
        );
    }


    /* =====================================================
       17. BACKGROUND PLAN
       ===================================================== */

    function createBackgroundPlan({
        creativeBrief,
        palette,
        decorations,
        assetPlan,
        layout
    }) {
        const industryId =
            creativeBrief.industry?.id || "general";

        return {
            type:
                assetPlan.useBackgroundImage
                    ? "image-gradient-overlay"
                    : "gradient",

            gradient:
                `linear-gradient(135deg, ${palette.background} 0%, ${palette.backgroundSecondary} 100%)`,

            overlay:
                assetPlan.useBackgroundImage
                    ? "dark-to-transparent readability overlay"
                    : "none",

            texture:
                chooseTexture(
                    industryId,
                    decorations.id
                ),

            focalPoint:
                layout.visualZone,

            imagePrompt:
                creativeBrief.backgroundDirection || "",

            imageReadabilityTreatment: {
                overlayOpacity:
                    palette.contrast === "light"
                        ? 0.42
                        : 0.15,

                blurBehindText: false,
                preserveNegativeSpace: true
            }
        };
    }

    function chooseTexture(
        industryId,
        decorationId
    ) {
        const textureMap = {
            "coffee-shop": "subtle paper and wood grain",
            restaurant: "soft food photography grain",
            bakery: "light flour texture",
            technology: "subtle digital grid",
            finance: "clean data-grid pattern",
            "real-estate": "architectural line texture",
            fitness: "dark energetic grain",
            beauty: "soft satin texture",
            fashion: "editorial paper texture",
            education: "subtle dot grid",
            travel: "soft atmospheric haze",
            gaming: "digital particle texture",
            healthcare: "clean soft gradient",
            ecommerce: "subtle product spotlight glow"
        };

        if (decorationId === "luxury") {
            return "subtle metallic grain";
        }

        if (decorationId === "editorial") {
            return "clean paper texture";
        }

        return textureMap[industryId] ||
            "subtle professional grain";
    }


    /* =====================================================
       18. BRANDING PLAN
       ===================================================== */

    function createBrandingPlan({
        layout,
        palette,
        platform
    }) {
        return {
            position: layout.brandPosition,

            logoStyle: {
                background: palette.surface,
                shape: "rounded square",
                maximumWidthPercent:
                    platform.orientation === "portrait"
                        ? 12
                        : 8,

                useSafePadding: true
            },

            brandNameStyle: {
                color: palette.text,
                weight: 800,
                maximumCharacters: 40
            },

            showBrandName: true,
            showLogo: true
        };
    }


    /* =====================================================
       19. CTA PLAN
       ===================================================== */

    function createCallToActionPlan({
        layout,
        palette,
        toneId,
        creativeBrief
    }) {
        const urgent =
            toneId === "urgent" ||
            creativeBrief.goal?.id === "sale";

        return {
            position: layout.ctaPosition,

            text:
                creativeBrief.suggestedCallToAction ||
                "Learn More",

            style:
                urgent
                    ? "bold promotional pill"
                    : "clean rounded pill",

            background:
                palette.surface,

            textColor:
                palette.contrast === "dark"
                    ? "#FFFFFF"
                    : palette.primary,

            border:
                urgent
                    ? `2px solid ${palette.accent}`
                    : "none",

            shadow:
                "0 10px 24px rgba(0,0,0,0.16)",

            pulseAnimation: false,

            minimumContrastRatio: 4.5
        };
    }


    /* =====================================================
       20. ACCESSIBILITY PLAN
       ===================================================== */

    function createAccessibilityPlan({
        palette,
        platform,
        typography
    }) {
        return {
            minimumTextContrast: 4.5,

            minimumLargeTextContrast: 3,

            mobileReadable:
                platform.headlineMaxLines <= 5,

            avoidThinHeadline:
                typography.headingWeight >= 700,

            preserveSafeMargins: true,

            textShadowRecommended:
                palette.contrast === "light",

            imageAlternativeTextRequired: true,

            avoidTextOverBusyAreas: true
        };
    }


    /* =====================================================
       21. RESPONSIVE RULES
       ===================================================== */

    function createResponsiveRules({
        platform,
        layout
    }) {
        return {
            previewAspectRatio:
                `${platform.width} / ${platform.height}`,

            previewClass:
                platform.orientation === "portrait"
                    ? "format-portrait"
                    : platform.width / platform.height >= 1.7
                        ? "format-widescreen"
                        : "format-landscape",

            layoutClass:
                `layout-${layout.id}`,

            exportWidth: platform.width,

            exportHeight: platform.height,

            mobileAdjustments: {
                reduceDecorationCount: true,
                stackSplitLayout:
                    layout.id === "split-layout",
                centerBranding:
                    platform.orientation === "portrait",
                reduceSubtitleWidth: false
            }
        };
    }


    /* =====================================================
       22. CSS VARIABLE GENERATION
       ===================================================== */

    function createCssVariables({
        palette,
        typography,
        layout,
        platform
    }) {
        return {
            "--banner-bg-one":
                palette.background,

            "--banner-bg-two":
                palette.backgroundSecondary,

            "--banner-text":
                palette.text,

            "--banner-text-soft":
                palette.textSoft,

            "--banner-accent":
                palette.accent,

            "--banner-logo-bg":
                palette.surface,

            "--banner-logo-text":
                palette.primary,

            "--banner-heading-font":
                typography.headingFamily,

            "--banner-body-font":
                typography.bodyFamily,

            "--banner-heading-weight":
                String(typography.headingWeight),

            "--banner-heading-spacing":
                typography.headingLetterSpacing,

            "--banner-content-width":
                `${layout.contentWidthPercent}%`,

            "--banner-safe-margin":
                `${platform.safeMarginPercent}%`
        };
    }


    /* =====================================================
       23. DESIGN EXPLANATION
       ===================================================== */

    function createDesignExplanation({
        creativeBrief,
        platform,
        palette,
        typography,
        layout,
        decorations,
        assetPlan,
        callToAction
    }) {
        const industry =
            creativeBrief.industry?.label ||
            "the detected business";

        return [
            `${palette.label} was selected because it supports the visual language of ${industry}.`,

            `${layout.label} gives the headline and relevant visuals a clear hierarchy for ${platform.label}.`,

            `${typography.label} keeps the design ${typography.personality}.`,

            `${assetPlan.heroElement} was chosen as the main contextual visual so the banner immediately communicates its subject.`,

            `${decorations.id} decorative elements strengthen the style without distracting from the message.`,

            `The call to action is placed at ${formatIdentifier(
                callToAction.position
            ).toLowerCase()} for clear visibility.`,

            `Safe margins are preserved so important content remains readable across devices.`
        ];
    }


    /* =====================================================
       24. QUALITY CHECKS
       ===================================================== */

    function createQualityChecks({
        platform,
        palette,
        typography,
        layout,
        assetPlan
    }) {
        return [
            {
                id: "correct-dimensions",
                label: "Correct platform dimensions",
                passed:
                    platform.width > 0 &&
                    platform.height > 0
            },

            {
                id: "safe-margins",
                label: "Safe content margins",
                passed:
                    platform.safeMarginPercent >= 5
            },

            {
                id: "headline-readability",
                label: "Readable headline weight",
                passed:
                    typography.headingWeight >= 700
            },

            {
                id: "text-contrast",
                label: "Strong text contrast",
                passed:
                    Boolean(
                        palette.text &&
                        palette.background
                    )
            },

            {
                id: "contextual-visual",
                label: "Context-aware visual selected",
                passed:
                    Boolean(assetPlan.heroElement)
            },

            {
                id: "balanced-layout",
                label: "Balanced content width",
                passed:
                    layout.contentWidthPercent >= 40 &&
                    layout.contentWidthPercent <= 90
            }
        ];
    }


    /* =====================================================
       25. GENERAL HELPERS
       ===================================================== */

    function formatIdentifier(value) {
        return String(value || "")
            .split(/[\s-]+/)
            .filter(Boolean)
            .map(word =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
            )
            .join(" ");
    }

    function createId(prefix) {
        return `${prefix}-${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2, 9)}`;
    }

    function clone(value) {
        return JSON.parse(
            JSON.stringify(value)
        );
    }


    /* =====================================================
       26. PUBLIC API
       ===================================================== */

    window.ToolXoneDesignEngine =
        Object.freeze({
            createDesign,

            getPlatformSpecs() {
                return clone(PLATFORM_SPECS);
            },

            getPalettes() {
                return clone(COLOR_PALETTES);
            },

            getTypographySystems() {
                return clone(
                    TYPOGRAPHY_SYSTEMS
                );
            },

            getLayoutSystems() {
                return clone(LAYOUT_SYSTEMS);
            },

            getDecorationSystems() {
                return clone(
                    DECORATION_SYSTEMS
                );
            }
        });


    /* =====================================================
       27. READY EVENT
       ===================================================== */

    window.ToolXoneAI.emit(
        "design-engine:ready",
        {
            platforms:
                Object.keys(PLATFORM_SPECS).length,

            palettes:
                Object.keys(COLOR_PALETTES).length,

            typographySystems:
                Object.keys(
                    TYPOGRAPHY_SYSTEMS
                ).length,

            layouts:
                Object.keys(LAYOUT_SYSTEMS).length,

            decorationSystems:
                Object.keys(
                    DECORATION_SYSTEMS
                ).length
        }
    );

})();