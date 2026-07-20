/*
==========================================================
TOOLXONE PHOENIX AI DESIGN DNA ENGINE
----------------------------------------------------------

Purpose
-------
Transforms Creative Brain analysis into
professional visual design decisions.

Input
-----
Creative Brain Analysis

Output
------
Palette
Background
Hero Visual
Decorations
Mood
Visual Style

This engine DOES NOT draw graphics.

It decides HOW a design should look.

==========================================================
*/

window.ToolXoneDesignDNAEngine = (function () {

"use strict";


 /* =====================================================
   CREATE DESIGN DNA
   ===================================================== */

function createDesignDNA(
    analysis
) {
    if (!analysis) {
        return null;
    }

    const toolProfile =
        analysis.toolProfile ||
        null;

    const toolIdentity =
        analysis.toolIdentity ||
        null;

    const audience =
        Array.isArray(
            analysis.audience
        )
            ? analysis.audience
            : [];

    const context = {
        subject:
            analysis.subject ||
            toolProfile?.name ||
            "General Promotion",

        toolId:
            toolProfile?.id ||
            toolIdentity?.id ||
            null,

        category:
            toolProfile?.category ||
            toolIdentity?.industry ||
            "General",

        type:
            toolProfile?.type ||
            analysis.subjectType ||
            "general",

        purpose:
            toolProfile?.purpose ||
            "",

        benefits:
            Array.isArray(
                toolProfile?.benefits
            )
                ? [
                    ...toolProfile.benefits
                ]
                : [],

        audience:
            audience.map(item => ({
                id:
                    item.id ||
                    "general",

                label:
                    item.label ||
                    "General Audience"
            })),

        emotions:
            Array.isArray(
                toolProfile?.emotions
            )
                ? [
                    ...toolProfile.emotions
                ]
                : [],

        recommendedCTA:
            toolProfile?.cta ||
            "Try It Now",

        platform:
            analysis.platform ||
            "facebook",

        goal:
            analysis.goal ||
            "promotion",

        tone:
            analysis.tone ||
            "automatic"
    };

    const palette =
        createPaletteDNA(
            analysis
        );

    const mood =
        createMoodDNA(
            analysis
        );

    const style =
        createStyleDNA(
            analysis,
            mood
        );

    const hero =
        createHeroDNA(
            analysis,
            mood,
            style
        );

    const background =
        createBackgroundDNA(
            analysis,
            palette,
            mood,
            style,
            hero
        );

    const decorations =
        createDecorationDNA(
            analysis,
            palette,
            mood,
            style,
            hero,
            background
        );

    const layout =
        createLayoutDNA(
            analysis,
            palette,
            mood,
            style,
            hero,
            background,
            decorations
        );

    return {
        context,
        palette,
        background,
        hero,
        decorations,
        layout,
        mood,
        style
    };
}

    /* =====================================================
       1. PALETTE INTELLIGENCE
       ===================================================== */

    function createPaletteDNA(analysis) {
        const subject =
    String(
        analysis.subject || ""
    ).toLowerCase();

const subjectType =
    String(
        analysis.subjectType || ""
    ).toLowerCase();

const toolProfile =
    analysis.toolProfile ||
    null;

const toolIdentity =
    analysis.toolIdentity ||
    null;

const keywords =
    Array.isArray(
        analysis.keywords
    )
        ? analysis.keywords
        : [];

const keywordText =
    keywords
        .join(" ")
        .toLowerCase();

const audience =
    Array.isArray(
        analysis.audience
    )
        ? analysis.audience
        : [];

const audienceText =
    audience
        .map(item =>
            item?.label ||
            item?.id ||
            ""
        )
        .join(" ")
        .toLowerCase();

const profileText = [
    toolProfile?.category,
    toolProfile?.type,
    toolProfile?.purpose,
    ...(Array.isArray(toolProfile?.benefits)
        ? toolProfile.benefits
        : []),
    ...(Array.isArray(toolProfile?.emotions)
        ? toolProfile.emotions
        : [])
]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const identityText = [
    toolIdentity?.id,
    toolIdentity?.industry,
    toolIdentity?.category,
    toolIdentity?.hero,
    ...(Array.isArray(toolIdentity?.visualKeywords)
        ? toolIdentity.visualKeywords
        : [])
]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const tone =
    String(
        analysis.tone ||
        "automatic"
    ).toLowerCase();

const signals = [

    subject,
    subjectType,

    keywordText,

    audienceText,

    profileText,

    identityText,

    tone

]

    .filter(Boolean)
    .join(" ");

    if (
            tone === "luxury" ||
            /\bluxury\b|\bpremium\b|\belegant\b/.test(
                signals
            )
        ) {
            return {
                id: "premium-luxury",

                primary: "#111827",
                secondary: "#374151",
                accent: "#d4af37",
                background: "#030712",
                surface: "#111827",
                text: "#f9fafb",

                personality: [
                    "premium",
                    "elegant",
                    "exclusive"
                ]
            };
        }

        if (
    /\bfinance\b|\bloan\b|\bmortgage\b|\binvestment\b|\binterest\b|\bcurrency\b|\bforex\b|\bexchange\b/.test(
        signals
    )
) {
    return {
        id:
            "financial-confidence",

        primary:
            "#0f172a",

        secondary:
            "#10b981",

        accent:
            "#22d3ee",

        background:
            "#020617",

        surface:
            "#111827",

        text:
            "#f8fafc",

        personality: [
            "trustworthy",
            "professional",
            "confident",
            "fast"
        ]
    };
}

        if (
            /\bqr\b|\bdigital\b|\btechnology\b|\bsoftware\b|\bcode\b|\bscan\b/.test(
                signals
            )
        ) {
            return {
                id: "digital-utility",

                primary: "#0f172a",
                secondary: "#2563eb",
                accent: "#22d3ee",
                background: "#020617",
                surface: "#111827",
                text: "#f8fafc",

                personality: [
                    "modern",
                    "digital",
                    "fast"
                ]
            };
        }

        if (
            /\bcoffee\b|\bbakery\b|\brestaurant\b|\bfood\b/.test(
                signals
            )
        ) {
            return {
                id: "warm-hospitality",

                primary: "#78350f",
                secondary: "#b45309",
                accent: "#fbbf24",
                background: "#fff7ed",
                surface: "#fffbeb",
                text: "#451a03",

                personality: [
                    "warm",
                    "welcoming",
                    "comfortable"
                ]
            };
        }

            return {
            id: "balanced-modern",

            primary: "#0f766e",
            secondary: "#10b981",
            accent: "#2563eb",
            background: "#f8fafc",
            surface: "#ffffff",
            text: "#0f172a",

            personality: [
                "modern",
                "clear",
                "professional"
            ]
        };
    }


    /* =====================================================
       2. MOOD INTELLIGENCE
       ===================================================== */

    function createMoodDNA(analysis) {
        const signals =
            buildAnalysisSignals(analysis);

        const tone =
            String(
                analysis.tone || "automatic"
            ).toLowerCase();


        if (
            tone === "luxury" ||
            /\bluxury\b|\bpremium\b|\belegant\b|\bexclusive\b/.test(
                signals
            )
        ) {
            return {
                id: "premium",
                energy: "low",
                trust: "high",
                warmth: "medium",

                personality: [
                    "refined",
                    "elegant",
                    "exclusive"
                ]
            };
        }


        if (
            tone === "playful" ||
            /\bfun\b|\bplayful\b|\bkids?\b|\bgame\b|\bparty\b/.test(
                signals
            )
        ) {
            return {
                id: "playful",
                energy: "high",
                trust: "medium",
                warmth: "high",

                personality: [
                    "friendly",
                    "colorful",
                    "energetic"
                ]
            };
        }


        if (
            tone === "urgent" ||
            /\burgent\b|\blimited\b|\btoday\b|\bnow\b|\bsale\b|\bdiscount\b/.test(
                signals
            )
        ) {
            return {
                id: "urgent",
                energy: "high",
                trust: "medium",
                warmth: "medium",

                personality: [
                    "bold",
                    "immediate",
                    "action-focused"
                ]
            };
        }


        if (
            /\bhealth\b|\bbmi\b|\bmedical\b|\bwellness\b|\bfinance\b|\bloan\b|\bmortgage\b/.test(
                signals
            )
        ) {
            return {
                id: "trustworthy",
                energy: "medium",
                trust: "high",
                warmth: "medium",

                personality: [
                    "clear",
                    "reassuring",
                    "professional"
                ]
            };
        }


        if (
            /\bqr\b|\btechnology\b|\bdigital\b|\bsoftware\b|\bcode\b|\bscan\b/.test(
                signals
            )
        ) {
            return {
                id: "innovative",
                energy: "medium",
                trust: "high",
                warmth: "low",

                personality: [
                    "modern",
                    "precise",
                    "forward-looking"
                ]
            };
        }


        return {
            id: "balanced",
            energy: "medium",
            trust: "high",
            warmth: "medium",

            personality: [
                "clear",
                "approachable",
                "professional"
            ]
        };
    }


    /* =====================================================
       3. STYLE INTELLIGENCE
       ===================================================== */

    function createStyleDNA(
        analysis,
        mood
    ) {
        const signals =
            buildAnalysisSignals(analysis);

        const platform =
            String(
                analysis.platform || ""
            ).toLowerCase();


        if (
            /\bqr\b|\btechnology\b|\bdigital\b|\bsoftware\b|\bcode\b|\bscan\b/.test(
                signals
            )
        ) {
            return {
                id: "modern-digital",
                density: "clean",
                geometry: "precise",
                cornerStyle: "rounded",
                depth: "layered",

                effects: [
                    "soft-glow",
                    "grid-lines",
                    "data-points"
                ],

                alignment:
                    platform === "pinterest"
                        ? "center"
                        : "split"
            };
        }


        if (
            /\bhealth\b|\bbmi\b|\bmedical\b|\bwellness\b|\bfitness\b/.test(
                signals
            )
        ) {
            return {
                id: "clean-health",
                density: "spacious",
                geometry: "soft",
                cornerStyle: "rounded",
                depth: "light",

                effects: [
                    "soft-gradient",
                    "gentle-shapes"
                ],

                alignment: "balanced"
            };
        }


        if (
            /\bcoffee\b|\bbakery\b|\brestaurant\b|\bfood\b/.test(
                signals
            )
        ) {
            return {
                id: "warm-editorial",
                density: "comfortable",
                geometry: "organic",
                cornerStyle: "soft",
                depth: "textured",

                effects: [
                    "warm-overlay",
                    "organic-shapes"
                ],

                alignment: "editorial"
            };
        }


        if (
            mood?.id === "premium"
        ) {
            return {
                id: "minimal-luxury",
                density: "minimal",
                geometry: "refined",
                cornerStyle: "subtle",
                depth: "low",

                effects: [
                    "fine-lines",
                    "subtle-glow"
                ],

                alignment: "asymmetric"
            };
        }


        return {
            id: "balanced-modern",
            density: "clean",
            geometry: "balanced",
            cornerStyle: "rounded",
            depth: "medium",

            effects: [
                "soft-gradient",
                "abstract-shapes"
            ],

            alignment: "balanced"
        };
    }

/* =====================================================
   4. HERO VISUAL INTELLIGENCE
   ===================================================== */

function createHeroDNA(
    analysis,
    mood,
    style
) {
    const signals =
        buildAnalysisSignals(analysis);

    const platform =
        String(
            analysis.platform || ""
        ).toLowerCase();

    const basePosition =
        platform === "pinterest"
            ? "center"
            : style?.alignment === "split"
                ? "right"
                : "center";


    if (
        /\bqr\b|\bqr code\b|\bscan\b|\bscanner\b/.test(
            signals
        )
    ) {
        return {
            id: "qr-scan-system",

            subject:
                "qr-code",

            primaryVisual:
                "qr-code",

            supportingVisuals: [
                "smartphone-scanner",
                "download-arrow",
                "scan-corners"
            ],

            icon:
                "qr-code",

            position:
                basePosition,

            scale:
                platform === "pinterest"
                    ? "large"
                    : "medium",

            treatment:
                "high-contrast",

            emphasis:
                "primary",

            avoid: [
                "laptop",
                "discount-badge",
                "location-pin",
                "generic-calculator"
            ]
        };
    }


    if (
        /\bbmi\b|\bbody mass\b|\bhealthy weight\b/.test(
            signals
        )
    ) {
        return {
            id: "bmi-health-system",

            subject:
                "bmi-health",

            primaryVisual:
                "healthy-person",

            supportingVisuals: [
                "body-scale",
                "heart-pulse",
                "health-chart"
            ],

            icon:
                "health-meter",

            position:
                style?.alignment === "balanced"
                    ? "right"
                    : basePosition,

            scale:
                "large",

            treatment:
                "friendly-clean",

            emphasis:
                "primary",

            avoid: [
                "medical-emergency",
                "hospital-bed",
                "discount-badge",
                "generic-laptop"
            ]
        };
    }


    if (
        /\bscientific calculator\b|\bcalculator\b|\bmath\b|\bequation\b/.test(
            signals
        )
    ) {
        return {
            id: "calculator-system",

            subject:
                "calculator",

            primaryVisual:
                "calculator-device",

            supportingVisuals: [
                "math-symbols",
                "formula-grid",
                "result-display"
            ],

            icon:
                "calculator",

            position:
                basePosition,

            scale:
                "large",

            treatment:
                "precise-modern",

            emphasis:
                "primary",

            avoid: [
                "abacus",
                "discount-badge",
                "location-pin"
            ]
        };
    }


    if (
        /\bloan\b|\bmortgage\b|\binvestment\b|\binterest\b|\bfinance\b/.test(
            signals
        )
    ) {
        return {
            id: "finance-growth-system",

            subject:
                "finance",

            primaryVisual:
                "finance-calculator",

            supportingVisuals: [
                "growth-chart",
                "coins",
                "currency-symbol"
            ],

            icon:
                "financial-growth",

            position:
                style?.alignment === "split"
                    ? "right"
                    : basePosition,

            scale:
                "large",

            treatment:
                "professional-trust",

            emphasis:
                "primary",

            avoid: [
                "casino",
                "gambling",
                "discount-badge",
                "location-pin"
            ]
        };
    }


    if (
        /\bcoffee\b|\bcafe\b|\bbakery\b|\brestaurant\b|\bfood\b/.test(
            signals
        )
    ) {
        return {
            id: "hospitality-system",

            subject:
                "hospitality",

            primaryVisual:
                /\bcoffee\b|\bcafe\b/.test(signals)
                    ? "coffee-cup"
                    : "food-platter",

            supportingVisuals: [
                "steam",
                "organic-leaves",
                "warm-table"
            ],

            icon:
                "hospitality",

            position:
                style?.alignment === "editorial"
                    ? "right"
                    : basePosition,

            scale:
                "large",

            treatment:
                "warm-editorial",

            emphasis:
                "primary",

            avoid: [
                "laptop",
                "digital-grid",
                "medical-icon"
            ]
        };
    }


    return {
        id: "general-concept-system",

        subject:
            analysis.subject || "general",

        primaryVisual:
            "abstract-concept",

        supportingVisuals: [
            "geometric-shapes",
            "soft-highlight"
        ],

        icon:
            "spark",

        position:
            basePosition,

        scale:
            mood?.energy === "high"
                ? "large"
                : "medium",

        treatment:
            style?.id ||
            "balanced-modern",

        emphasis:
            "secondary",

        avoid: [
            "unrelated-badge",
            "random-location-pin"
        ]
    };
}
/* =====================================================
   5. BACKGROUND INTELLIGENCE
   ===================================================== */

function createBackgroundDNA(
    analysis,
    palette,
    mood,
    style,
    hero
) {
    const signals =
        buildAnalysisSignals(analysis);

    const platform =
        String(
            analysis.platform || ""
        ).toLowerCase();

    const isVertical =
        platform === "pinterest" ||
        platform === "instagram-story";

    if (
        /\bqr\b|\btechnology\b|\bdigital\b|\bsoftware\b|\bcode\b|\bscan\b/.test(
            signals
        )
    ) {
        return {
            id: "digital-grid-glow",

            type:
                "layered-gradient",

            baseColor:
                palette.background,

            gradient: {
                angle:
                    isVertical
                        ? 180
                        : 135,

                colors: [
                    palette.background,
                    palette.primary,
                    palette.secondary
                ]
            },

            pattern:
                "digital-grid",

            overlay:
                "soft-cyan-glow",

            texture:
                "fine-noise",

            focalLight: {
                position:
                    hero?.position || "center",

                color:
                    palette.accent,

                intensity:
                    "medium"
            },

            depth:
                "layered",

            contrast:
                "high",

            avoid: [
                "wood-texture",
                "medical-pattern",
                "warm-paper"
            ]
        };
    }

    if (
        /\bhealth\b|\bbmi\b|\bmedical\b|\bwellness\b|\bfitness\b/.test(
            signals
        )
    ) {
        return {
            id: "soft-health-gradient",

            type:
                "soft-gradient",

            baseColor:
                palette.background,

            gradient: {
                angle:
                    isVertical
                        ? 180
                        : 145,

                colors: [
                    palette.background,
                    palette.surface,
                    palette.secondary
                ]
            },

            pattern:
                "gentle-health-curves",

            overlay:
                "soft-light",

            texture:
                "clean",

            focalLight: {
                position:
                    hero?.position || "right",

                color:
                    palette.accent,

                intensity:
                    "low"
            },

            depth:
                "light",

            contrast:
                "medium",

            avoid: [
                "dark-tech-grid",
                "hard-neon",
                "rough-texture"
            ]
        };
    }

    if (
        /\bfinance\b|\bloan\b|\bmortgage\b|\binvestment\b|\binterest\b|\bcurrency\b/.test(
            signals
        )
    ) {
        return {
            id: "financial-structure",

            type:
                "structured-gradient",

            baseColor:
                palette.background,

            gradient: {
                angle:
                    135,

                colors: [
                    palette.background,
                    palette.surface,
                    palette.primary
                ]
            },

            pattern:
                "subtle-chart-grid",

            overlay:
                "growth-line-glow",

            texture:
                "fine-grid",

            focalLight: {
                position:
                    hero?.position || "right",

                color:
                    palette.accent,

                intensity:
                    "low"
            },

            depth:
                "medium",

            contrast:
                "medium",

            avoid: [
                "casino-lights",
                "playful-confetti",
                "random-badges"
            ]
        };
    }

    if (
        /\bcoffee\b|\bcafe\b|\bbakery\b|\brestaurant\b|\bfood\b/.test(
            signals
        )
    ) {
        return {
            id: "warm-organic-scene",

            type:
                "warm-gradient",

            baseColor:
                palette.background,

            gradient: {
                angle:
                    145,

                colors: [
                    palette.background,
                    palette.surface,
                    palette.secondary
                ]
            },

            pattern:
                "organic-curves",

            overlay:
                "warm-vignette",

            texture:
                "paper-grain",

            focalLight: {
                position:
                    hero?.position || "right",

                color:
                    palette.accent,

                intensity:
                    "medium"
            },

            depth:
                "textured",

            contrast:
                "medium",

            avoid: [
                "digital-grid",
                "medical-crosses",
                "neon-cyan"
            ]
        };
    }

    if (
        mood?.id === "premium"
    ) {
        return {
            id: "premium-dark-minimal",

            type:
                "minimal-gradient",

            baseColor:
                palette.background,

            gradient: {
                angle:
                    135,

                colors: [
                    palette.background,
                    palette.primary,
                    palette.surface
                ]
            },

            pattern:
                "fine-lines",

            overlay:
                "subtle-gold-glow",

            texture:
                "smooth",

            focalLight: {
                position:
                    hero?.position || "center",

                color:
                    palette.accent,

                intensity:
                    "low"
            },

            depth:
                "low",

            contrast:
                "high",

            avoid: [
                "busy-pattern",
                "rainbow-colors",
                "playful-shapes"
            ]
        };
    }

    return {
        id: "balanced-soft-gradient",

        type:
            "soft-gradient",

        baseColor:
            palette.background,

        gradient: {
            angle:
                isVertical
                    ? 180
                    : 135,

            colors: [
                palette.background,
                palette.surface,
                palette.secondary
            ]
        },

        pattern:
            style?.geometry === "organic"
                ? "organic-shapes"
                : "soft-geometric-shapes",

        overlay:
            "subtle-highlight",

        texture:
            "clean",

        focalLight: {
            position:
                hero?.position || "center",

            color:
                palette.accent,

            intensity:
                "low"
        },

        depth:
            style?.depth || "medium",

        contrast:
            "medium",

        avoid: [
            "unrelated-pattern",
            "random-texture"
        ]
    };
}

/* =====================================================
   6. DECORATION INTELLIGENCE
   ===================================================== */

function createDecorationDNA(
    analysis,
    palette,
    mood,
    style,
    hero,
    background
) {
    const signals =
        buildAnalysisSignals(analysis);

    const platform =
        String(
            analysis.platform || ""
        ).toLowerCase();

    const isVertical =
        platform === "pinterest" ||
        platform === "instagram-story";

    const common = {
        density:
            isVertical
                ? "medium"
                : "low",

        cornerStyle:
            style?.cornerStyle ||
            "rounded",

        accentColor:
            palette?.accent ||
            "#22d3ee",

        avoid: [
            ...(hero?.avoid || []),
            "unrelated-decoration",
            "random-promotional-badge"
        ]
    };


    if (
        /\bqr\b|\bqr code\b|\bscan\b|\bscanner\b|\bdigital\b|\bcode\b/.test(
            signals
        )
    ) {
        return {
            id: "qr-digital-details",

            primary: [
                {
                    type: "scan-corners",
                    position: "hero-frame",
                    emphasis: "high"
                },
                {
                    type: "digital-nodes",
                    position: "background",
                    emphasis: "medium"
                },
                {
                    type: "connection-lines",
                    position: "edges",
                    emphasis: "low"
                }
            ],

            secondary: [
                {
                    type: "qr-particles",
                    position: "around-hero",
                    emphasis: "medium"
                },
                {
                    type: "download-arrow",
                    position: "cta-area",
                    emphasis: "low"
                },
                {
                    type: "data-dots",
                    position: "corners",
                    emphasis: "low"
                }
            ],

            badgeIdeas: [
                "100% Free",
                "Instant QR",
                "Download & Scan"
            ],

            effects: [
                "soft-cyan-glow",
                "subtle-pulse",
                "digital-fade"
            ],

            ...common
        };
    }


    if (
        /\bbmi\b|\bhealth\b|\bmedical\b|\bwellness\b|\bfitness\b|\bbody mass\b/.test(
            signals
        )
    ) {
        return {
            id: "health-support-details",

            primary: [
                {
                    type: "heart-pulse-line",
                    position: "background",
                    emphasis: "medium"
                },
                {
                    type: "health-rings",
                    position: "around-hero",
                    emphasis: "medium"
                },
                {
                    type: "medical-plus",
                    position: "corners",
                    emphasis: "low"
                }
            ],

            secondary: [
                {
                    type: "wellness-dots",
                    position: "background",
                    emphasis: "low"
                },
                {
                    type: "body-measurement-line",
                    position: "hero-side",
                    emphasis: "medium"
                },
                {
                    type: "healthy-leaf",
                    position: "footer-area",
                    emphasis: "low"
                }
            ],

            badgeIdeas: [
                "Instant Result",
                "Health Advice",
                "100% Free"
            ],

            effects: [
                "soft-green-glow",
                "gentle-float",
                "clean-fade"
            ],

            ...common
        };
    }


    if (
        /\bfinance\b|\bloan\b|\bmortgage\b|\binvestment\b|\binterest\b|\bcurrency\b/.test(
            signals
        )
    ) {
        return {
            id: "finance-growth-details",

            primary: [
                {
                    type: "growth-line",
                    position: "background",
                    emphasis: "medium"
                },
                {
                    type: "chart-bars",
                    position: "hero-side",
                    emphasis: "medium"
                },
                {
                    type: "currency-ring",
                    position: "around-hero",
                    emphasis: "low"
                }
            ],

            secondary: [
                {
                    type: "coins",
                    position: "bottom-corner",
                    emphasis: "low"
                },
                {
                    type: "up-arrow",
                    position: "cta-area",
                    emphasis: "medium"
                },
                {
                    type: "financial-grid",
                    position: "background",
                    emphasis: "low"
                }
            ],

            badgeIdeas: [
                "Free Calculator",
                "Plan Smarter",
                "Instant Estimate"
            ],

            effects: [
                "subtle-gold-glow",
                "chart-reveal",
                "structured-fade"
            ],

            ...common
        };
    }


    if (
        /\bcoffee\b|\bcafe\b|\bbakery\b|\brestaurant\b|\bfood\b/.test(
            signals
        )
    ) {
        return {
            id: "warm-organic-details",

            primary: [
                {
                    type: "steam-lines",
                    position: "above-hero",
                    emphasis: "medium"
                },
                {
                    type: "organic-leaves",
                    position: "corners",
                    emphasis: "low"
                },
                {
                    type: "warm-rings",
                    position: "around-hero",
                    emphasis: "low"
                }
            ],

            secondary: [
                {
                    type: "coffee-beans",
                    position: "bottom-area",
                    emphasis: "low"
                },
                {
                    type: "hand-drawn-curve",
                    position: "background",
                    emphasis: "low"
                },
                {
                    type: "soft-spark",
                    position: "headline-area",
                    emphasis: "low"
                }
            ],

            badgeIdeas: [
                "Fresh Daily",
                "Visit Today",
                "Special Offer"
            ],

            effects: [
                "warm-glow",
                "soft-grain",
                "gentle-drift"
            ],

            ...common
        };
    }


    if (
        mood?.id === "premium"
    ) {
        return {
            id: "premium-minimal-details",

            primary: [
                {
                    type: "fine-line-frame",
                    position: "edges",
                    emphasis: "low"
                },
                {
                    type: "subtle-gold-arc",
                    position: "hero-area",
                    emphasis: "low"
                }
            ],

            secondary: [
                {
                    type: "small-light-point",
                    position: "corners",
                    emphasis: "low"
                },
                {
                    type: "refined-divider",
                    position: "copy-area",
                    emphasis: "low"
                }
            ],

            badgeIdeas: [
                "Premium",
                "Exclusive",
                "New Collection"
            ],

            effects: [
                "subtle-gold-glow",
                "slow-fade"
            ],

            density: "low",

            ...common
        };
    }


    return {
        id: "balanced-support-details",

        primary: [
            {
                type:
                    style?.geometry === "organic"
                        ? "organic-shape"
                        : "soft-geometric-shape",

                position: "background",
                emphasis: "low"
            },
            {
                type: "highlight-ring",
                position: "around-hero",
                emphasis: "low"
            }
        ],

        secondary: [
            {
                type: "small-accent-dots",
                position: "corners",
                emphasis: "low"
            },
            {
                type: "soft-divider-line",
                position: "copy-area",
                emphasis: "low"
            }
        ],

        badgeIdeas: [
            "Learn More",
            "Try It Free",
            "Explore Now"
        ],

        effects: [
            "soft-fade",
            "gentle-float"
        ],

        ...common
    };
}

/* =====================================================
   7. LAYOUT INTELLIGENCE
   Platform-aware composition decisions
   ===================================================== */

function createLayoutDNA(
    analysis,
    palette,
    mood,
    style,
    hero,
    background,
    decorations
) {
    const platform =
        String(
            analysis.platform || "facebook"
        ).toLowerCase();

    const heroSubject =
        String(
            hero?.subject || ""
        ).toLowerCase();

        const toolId =
    String(
        analysis.toolProfile?.id ||
        analysis.toolIdentity?.id ||
        ""
    ).toLowerCase();

const category =
    String(
        analysis.toolProfile?.category ||
        analysis.toolIdentity?.industry ||
        ""
    ).toLowerCase();

const subject =
    String(
        analysis.subject || ""
    ).toLowerCase();

    const baseLayout = {
        platform,

        safeMargins: {
            top: "7%",
            right: "7%",
            bottom: "7%",
            left: "7%"
        },

        logoZone: "top-left",
        websiteZone: "bottom-left",

        spacing:
            style?.density === "spacious"
                ? "generous"
                : "comfortable",

        focalPoint: "hero",

        visualWeight: [
            "headline",
            "hero",
            "cta"
        ],

        readingFlow: [
            "brand",
            "headline",
            "hero",
            "support",
            "cta",
            "website"
        ]
    };

/* -----------------------------------------------------
   INTELLIGENT LAYOUT FINALIZER
   ----------------------------------------------------- */

function finalizeLayout(
    layout
) {
    const finalLayout = {
        ...layout,

        composition: {
            heroScalePercent:
                38,

            contentWidthPercent:
                56,

            headlineMaxWidthPercent:
                58,

            heroPosition:
                layout.heroZone ||
                "center",

            contentAlignment:
                layout.alignment ||
                "center",

            ctaPosition:
                layout.ctaZone ||
                "bottom-center",

            visualBalance:
                "balanced",

            heroOverlap:
                false
        }
    };


    /* Currency Converter intelligence */

    if (
        toolId ===
            "currency-converter" ||
        /\bcurrency\b|\bforex\b|\bexchange\b/.test(
            `${subject} ${category}`
        )
    ) {
        finalLayout.composition = {
            ...finalLayout.composition,

            visualBalance:
                "fintech-hero",

            headlineMaxWidthPercent:
                platform === "pinterest"
                    ? 82
                    : 48,

            contentWidthPercent:
                platform === "pinterest"
                    ? 88
                    : 52,

            heroScalePercent:
                platform === "pinterest"
                    ? 40
                    : 44,

            heroPosition:
                platform === "pinterest"
                    ? "center"
                    : "right-center",

            ctaPosition:
                platform === "pinterest"
                    ? "bottom-center"
                    : "left-lower"
        };
    }


    /* QR Generator intelligence */

    if (
        toolId ===
            "qr-code-generator" ||
        /\bqr\b/.test(
            `${subject} ${heroSubject}`
        )
    ) {
        finalLayout.composition = {
            ...finalLayout.composition,

            visualBalance:
                "qr-focus",

            heroScalePercent:
                platform === "pinterest"
                    ? 48
                    : 42,

            headlineMaxWidthPercent:
                72,

            heroPosition:
                "center",

            heroOverlap:
                false
        };
    }


    return finalLayout;
}

    /* -----------------------------------------------------
       PINTEREST
       ----------------------------------------------------- */

    if (
        platform === "pinterest" ||
        platform === "pinterest-pin"
    ) {
        return finalizeLayout({
            ...baseLayout,

            id:
                heroSubject === "qr-code"
                    ? "pinterest-qr-focus"
                    : "pinterest-vertical-hero",

            canvasFlow: "vertical",

            headlineZone: "upper",

            heroZone: "center",

            supportZone: "lower-middle",

            ctaZone: "bottom-center",

            logoZone: "top-left",

            websiteZone: "bottom-center",

            alignment: "center",

            focalPoint: "hero",

            contentWidth: "86%",

            heroScale:
                heroSubject === "qr-code"
                    ? "extra-large"
                    : "large",

            zoneRatios: {
                brand: 10,
                headline: 23,
                hero: 39,
                support: 15,
                cta: 8,
                website: 5
            },

            visualWeight: [
                "hero",
                "headline",
                "cta",
                "support"
            ],

            readingFlow: [
                "brand",
                "headline",
                "hero",
                "support",
                "cta",
                "website"
            ]
        });
    }


    /* -----------------------------------------------------
       INSTAGRAM STORY
       ----------------------------------------------------- */

    if (
        platform === "instagram-story" ||
        platform === "story"
    ) {
        return {
            ...baseLayout,

            id: "story-fullscreen-focus",

            canvasFlow: "vertical",

            headlineZone: "upper-middle",

            heroZone: "center",

            supportZone: "lower-middle",

            ctaZone: "bottom-center",

            logoZone: "top-center",

            websiteZone: "bottom-center",

            alignment: "center",

            focalPoint: "hero",

            contentWidth: "82%",

            heroScale: "large",

            safeMargins: {
                top: "11%",
                right: "7%",
                bottom: "13%",
                left: "7%"
            },

            zoneRatios: {
                brand: 9,
                headline: 21,
                hero: 40,
                support: 14,
                cta: 10,
                website: 6
            },

            visualWeight: [
                "hero",
                "headline",
                "cta"
            ],

            readingFlow: [
                "brand",
                "headline",
                "hero",
                "support",
                "cta"
            ]
        };
    }


    /* -----------------------------------------------------
       INSTAGRAM POST
       ----------------------------------------------------- */

    if (
        platform === "instagram" ||
        platform === "instagram-post"
    ) {
        return {
            ...baseLayout,

            id: "instagram-square-focus",

            canvasFlow: "stacked",

            headlineZone: "upper",

            heroZone: "center",

            supportZone: "lower",

            ctaZone: "bottom-right",

            logoZone: "top-left",

            websiteZone: "bottom-left",

            alignment: "center",

            focalPoint: "hero",

            contentWidth: "88%",

            heroScale: "medium-large",

            zoneRatios: {
                brand: 10,
                headline: 24,
                hero: 38,
                support: 14,
                cta: 9,
                website: 5
            },

            visualWeight: [
                "hero",
                "headline",
                "cta"
            ],

            readingFlow: [
                "brand",
                "headline",
                "hero",
                "support",
                "cta"
            ]
        };
    }


    /* -----------------------------------------------------
       FACEBOOK
       ----------------------------------------------------- */

    if (
        platform === "facebook" ||
        platform === "facebook-post" ||
        platform === "facebook-banner"
    ) {
        return finalizeLayout({
            ...baseLayout,

            id: "facebook-horizontal-split",

            canvasFlow: "horizontal",

            headlineZone: "left-upper",

            heroZone: "right-center",

            supportZone: "left-middle",

            ctaZone: "left-lower",

            logoZone: "top-left",

            websiteZone: "bottom-left",

            alignment: "left",

            focalPoint:
                heroSubject === "qr-code"
                    ? "hero"
                    : "headline",

            contentWidth: "90%",

            heroScale: "large",

            columns: {
                text: "52%",
                visual: "48%"
            },

            zoneRatios: {
                brand: 12,
                headline: 30,
                hero: 42,
                support: 18,
                cta: 12,
                website: 8
            },

            visualWeight: [
                "headline",
                "hero",
                "cta"
            ],

            readingFlow: [
                "brand",
                "headline",
                "support",
                "cta",
                "hero"
            ]
        });
    }


    /* -----------------------------------------------------
       LINKEDIN
       ----------------------------------------------------- */

    if (
        platform === "linkedin" ||
        platform === "linkedin-post" ||
        platform === "linkedin-banner"
    ) {
        return {
            ...baseLayout,

            id: "linkedin-professional-split",

            canvasFlow: "horizontal",

            headlineZone: "left-upper",

            heroZone: "right-center",

            supportZone: "left-middle",

            ctaZone: "left-lower",

            logoZone: "top-left",

            websiteZone: "bottom-left",

            alignment: "left",

            focalPoint: "headline",

            contentWidth: "88%",

            heroScale: "medium",

            columns: {
                text: "58%",
                visual: "42%"
            },

            spacing: "generous",

            zoneRatios: {
                brand: 12,
                headline: 31,
                hero: 36,
                support: 19,
                cta: 10,
                website: 8
            },

            visualWeight: [
                "headline",
                "support",
                "hero",
                "cta"
            ],

            readingFlow: [
                "brand",
                "headline",
                "support",
                "cta",
                "hero"
            ]
        };
    }


    /* -----------------------------------------------------
       YOUTUBE THUMBNAIL
       ----------------------------------------------------- */

    if (
        platform === "youtube" ||
        platform === "youtube-thumbnail"
    ) {
        return {
            ...baseLayout,

            id: "youtube-high-impact",

            canvasFlow: "horizontal",

            headlineZone: "left-center",

            heroZone: "right-center",

            supportZone: "hidden",

            ctaZone: "hidden",

            logoZone: "top-left",

            websiteZone: "hidden",

            alignment: "left",

            focalPoint: "headline",

            contentWidth: "92%",

            heroScale: "extra-large",

            columns: {
                text: "56%",
                visual: "44%"
            },

            spacing: "compact",

            zoneRatios: {
                brand: 8,
                headline: 46,
                hero: 46,
                support: 0,
                cta: 0,
                website: 0
            },

            visualWeight: [
                "headline",
                "hero"
            ],

            readingFlow: [
                "headline",
                "hero"
            ]
        };
    }


    /* -----------------------------------------------------
       X / TWITTER
       ----------------------------------------------------- */

    if (
        platform === "x" ||
        platform === "twitter" ||
        platform === "x-post"
    ) {
        return {
            ...baseLayout,

            id: "x-clean-horizontal",

            canvasFlow: "horizontal",

            headlineZone: "left-center",

            heroZone: "right-center",

            supportZone: "left-lower",

            ctaZone: "bottom-right",

            logoZone: "top-left",

            websiteZone: "bottom-left",

            alignment: "left",

            focalPoint: "headline",

            contentWidth: "90%",

            heroScale: "medium",

            columns: {
                text: "60%",
                visual: "40%"
            },

            spacing: "compact",

            zoneRatios: {
                brand: 10,
                headline: 35,
                hero: 36,
                support: 14,
                cta: 8,
                website: 6
            },

            visualWeight: [
                "headline",
                "hero",
                "cta"
            ],

            readingFlow: [
                "brand",
                "headline",
                "support",
                "hero",
                "cta"
            ]
        };
    }


    /* -----------------------------------------------------
       WEBSITE / HERO BANNER
       ----------------------------------------------------- */

    if (
        platform === "website-banner" ||
        platform === "website-hero" ||
        platform === "web-banner"
    ) {
        return {
            ...baseLayout,

            id: "website-wide-hero",

            canvasFlow: "horizontal",

            headlineZone: "left-upper",

            heroZone: "right-center",

            supportZone: "left-middle",

            ctaZone: "left-lower",

            logoZone: "top-left",

            websiteZone: "bottom-left",

            alignment: "left",

            focalPoint: "headline",

            contentWidth: "88%",

            heroScale: "large",

            columns: {
                text: "55%",
                visual: "45%"
            },

            spacing: "generous",

            zoneRatios: {
                brand: 10,
                headline: 31,
                hero: 40,
                support: 19,
                cta: 12,
                website: 7
            },

            visualWeight: [
                "headline",
                "hero",
                "cta",
                "support"
            ],

            readingFlow: [
                "brand",
                "headline",
                "support",
                "cta",
                "hero"
            ]
        };
    }


    /* -----------------------------------------------------
       DEFAULT FALLBACK
       ----------------------------------------------------- */

    return {
        ...baseLayout,

        id: "balanced-adaptive",

        canvasFlow:
            style?.alignment === "split"
                ? "horizontal"
                : "vertical",

        headlineZone: "upper",

        heroZone: "center",

        supportZone: "below-hero",

        ctaZone: "bottom-center",

        alignment:
            style?.alignment === "split"
                ? "left"
                : "center",

        contentWidth: "86%",

        heroScale: "large",

        zoneRatios: {
            brand: 10,
            headline: 25,
            hero: 38,
            support: 14,
            cta: 8,
            website: 5
        }
    };
}

    /* =====================================================
       8. SHARED ANALYSIS SIGNALS
       ===================================================== */

    function buildAnalysisSignals(analysis) {
        const subject =
            String(
                analysis.subject || ""
            );

        const subjectType =
            String(
                analysis.subjectType || ""
            );

        const keywords =
            Array.isArray(analysis.keywords)
                ? analysis.keywords.join(" ")
                : "";

        const offer =
            Array.isArray(analysis.offer)
                ? analysis.offer.join(" ")
                : String(
                    analysis.offer || ""
                );

        return [
            subject,
            subjectType,
            keywords,
            offer,
            analysis.goal || "",
            analysis.normalizedPrompt || ""
        ]
            .join(" ")
            .toLowerCase();
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    return Object.freeze({
    createDesignDNA
});

})();