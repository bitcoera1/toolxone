/* =========================================================
   TOOLXONE AI CREATIVE ENGINE
   File: js/ai/asset-engine.js

   Responsibility:
   Convert the creative brief and design direction into a
   structured visual asset plan.

   It decides:
   - Main contextual visual
   - Supporting icons and decorative elements
   - Asset styles
   - Asset placement
   - Asset size and priority
   - Background visual direction
   - Safe fallbacks for unfamiliar industries
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       1. REQUIRED ENGINE CHECKS
       ===================================================== */

    if (!window.ToolXoneAI) {
        console.error(
            "[ToolXone AI] ai-core.js must load before asset-engine.js."
        );

        return;
    }

    if (!window.ToolXoneDesignEngine) {
        console.error(
            "[ToolXone AI] design-engine.js must load before asset-engine.js."
        );

        return;
    }


    /* =====================================================
       2. ASSET STYLE DEFINITIONS
       ===================================================== */

    const ASSET_STYLES = Object.freeze({
        outline: {
            id: "outline",
            label: "Clean Outline",
            strokeWidth: 2,
            fillMode: "minimal",
            shadow: "none",
            detailLevel: "low",
            bestFor: [
                "professional",
                "minimal",
                "healthcare",
                "finance"
            ]
        },

        solid: {
            id: "solid",
            label: "Bold Solid",
            strokeWidth: 0,
            fillMode: "solid",
            shadow: "medium",
            detailLevel: "medium",
            bestFor: [
                "fitness",
                "gaming",
                "promotional"
            ]
        },

        rounded: {
            id: "rounded",
            label: "Soft Rounded",
            strokeWidth: 1.5,
            fillMode: "soft",
            shadow: "soft",
            detailLevel: "medium",
            bestFor: [
                "coffee",
                "bakery",
                "education",
                "friendly"
            ]
        },

        editorial: {
            id: "editorial",
            label: "Editorial Illustration",
            strokeWidth: 1,
            fillMode: "elegant",
            shadow: "subtle",
            detailLevel: "medium",
            bestFor: [
                "fashion",
                "beauty",
                "luxury",
                "real estate"
            ]
        },

        technological: {
            id: "technological",
            label: "Digital Technology",
            strokeWidth: 1.5,
            fillMode: "glowing",
            shadow: "glow",
            detailLevel: "high",
            bestFor: [
                "technology",
                "software",
                "gaming",
                "finance"
            ]
        },

        photographic: {
            id: "photographic",
            label: "Photographic Hero",
            strokeWidth: 0,
            fillMode: "photo",
            shadow: "cinematic",
            detailLevel: "high",
            bestFor: [
                "food",
                "travel",
                "real estate",
                "fashion",
                "products"
            ]
        },

        playful: {
            id: "playful",
            label: "Playful Illustration",
            strokeWidth: 2,
            fillMode: "colorful",
            shadow: "soft",
            detailLevel: "medium",
            bestFor: [
                "children",
                "playful",
                "education",
                "events"
            ]
        }
    });


    /* =====================================================
       3. VISUAL CONCEPT LIBRARY
       ===================================================== */

    const VISUAL_LIBRARY = Object.freeze({
        "coffee cup": {
            id: "coffee-cup",
            label: "Coffee Cup",
            category: "food",
            keywords: [
                "coffee",
                "cafe",
                "espresso",
                "latte",
                "cappuccino"
            ],
            preferredStyles: [
                "rounded",
                "photographic",
                "editorial"
            ],
            emojiFallback: "☕"
        },
"scientific calculator": {
    id: "scientific-calculator",
    label: "Scientific Calculator",
    category: "technology",
    keywords: [
        "scientific calculator",
        "calculator",
        "math tool",
        "calculation"
    ],
    preferredStyles: [
        "technological",
        "rounded",
        "outline"
    ],
    emojiFallback: "🧮"
},

"bmi calculator": {
    id: "bmi-calculator",
    label: "BMI Calculator",
    category: "healthcare",
    keywords: [
        "bmi calculator",
        "bmi",
        "body mass index",
        "health calculator",
        "weight and height"
    ],
    preferredStyles: [
        "rounded",
        "outline"
    ],
    emojiFallback: "⚖️"
},

"ai tools": {
    id: "ai-tools",
    label: "AI Tools",
    category: "technology",
    keywords: [
        "ai",
        "artificial intelligence",
        "ai tool",
        "ai tools",
        "ai studio"
    ],
    preferredStyles: [
        "technological",
        "rounded"
    ],
    emojiFallback: "🤖"
},
        "coffee beans": {
            id: "coffee-beans",
            label: "Coffee Beans",
            category: "food",
            keywords: [
                "coffee",
                "beans",
                "roasted"
            ],
            preferredStyles: [
                "rounded",
                "photographic"
            ],
            emojiFallback: "🫘"
        },

        steam: {
            id: "steam",
            label: "Steam",
            category: "effect",
            keywords: [
                "coffee",
                "food",
                "hot",
                "fresh"
            ],
            preferredStyles: [
                "rounded",
                "editorial"
            ],
            emojiFallback: "♨️"
        },

        "café storefront": {
            id: "cafe-storefront",
            label: "Café Storefront",
            category: "place",
            keywords: [
                "cafe",
                "shop",
                "storefront",
                "local"
            ],
            preferredStyles: [
                "editorial",
                "photographic"
            ],
            emojiFallback: "🏪"
        },

        "featured meal": {
            id: "featured-meal",
            label: "Featured Meal",
            category: "food",
            keywords: [
                "restaurant",
                "food",
                "meal",
                "dinner",
                "lunch"
            ],
            preferredStyles: [
                "photographic"
            ],
            emojiFallback: "🍽️"
        },

        bread: {
            id: "bread",
            label: "Fresh Bread",
            category: "food",
            keywords: [
                "bread",
                "bakery",
                "baking"
            ],
            preferredStyles: [
                "photographic",
                "rounded"
            ],
            emojiFallback: "🍞"
        },

        croissant: {
            id: "croissant",
            label: "Croissant",
            category: "food",
            keywords: [
                "croissant",
                "bakery",
                "pastry"
            ],
            preferredStyles: [
                "photographic",
                "rounded"
            ],
            emojiFallback: "🥐"
        },

        cake: {
            id: "cake",
            label: "Cake",
            category: "food",
            keywords: [
                "cake",
                "bakery",
                "dessert",
                "birthday"
            ],
            preferredStyles: [
                "photographic",
                "playful"
            ],
            emojiFallback: "🎂"
        },

        laptop: {
            id: "laptop",
            label: "Laptop",
            category: "technology",
            keywords: [
                "laptop",
                "computer",
                "software",
                "online",
                "technology"
            ],
            preferredStyles: [
                "technological",
                "outline"
            ],
            emojiFallback: "💻"
        },

        "digital interface": {
            id: "digital-interface",
            label: "Digital Interface",
            category: "technology",
            keywords: [
                "dashboard",
                "software",
                "website",
                "app",
                "interface"
            ],
            preferredStyles: [
                "technological"
            ],
            emojiFallback: "🖥️"
        },

        "circuit pattern": {
            id: "circuit-pattern",
            label: "Circuit Pattern",
            category: "technology",
            keywords: [
                "technology",
                "digital",
                "ai",
                "electronics"
            ],
            preferredStyles: [
                "technological",
                "outline"
            ],
            emojiFallback: "⚙️"
        },

        "growth chart": {
            id: "growth-chart",
            label: "Growth Chart",
            category: "finance",
            keywords: [
                "finance",
                "growth",
                "profit",
                "investment",
                "success"
            ],
            preferredStyles: [
                "outline",
                "technological"
            ],
            emojiFallback: "📈"
        },

        coins: {
            id: "coins",
            label: "Coins",
            category: "finance",
            keywords: [
                "money",
                "finance",
                "saving",
                "investment"
            ],
            preferredStyles: [
                "solid",
                "photographic"
            ],
            emojiFallback: "🪙"
        },

        "modern house": {
            id: "modern-house",
            label: "Modern House",
            category: "property",
            keywords: [
                "house",
                "home",
                "property",
                "real estate"
            ],
            preferredStyles: [
                "photographic",
                "editorial"
            ],
            emojiFallback: "🏠"
        },

        "apartment building": {
            id: "apartment-building",
            label: "Apartment Building",
            category: "property",
            keywords: [
                "apartment",
                "building",
                "property",
                "real estate"
            ],
            preferredStyles: [
                "photographic",
                "editorial"
            ],
            emojiFallback: "🏢"
        },

        dumbbell: {
            id: "dumbbell",
            label: "Dumbbell",
            category: "fitness",
            keywords: [
                "gym",
                "fitness",
                "workout",
                "training"
            ],
            preferredStyles: [
                "solid",
                "outline"
            ],
            emojiFallback: "🏋️"
        },

        "athlete silhouette": {
            id: "athlete-silhouette",
            label: "Athlete Silhouette",
            category: "fitness",
            keywords: [
                "fitness",
                "athlete",
                "gym",
                "training"
            ],
            preferredStyles: [
                "solid",
                "photographic"
            ],
            emojiFallback: "💪"
        },

        "beauty product": {
            id: "beauty-product",
            label: "Beauty Product",
            category: "beauty",
            keywords: [
                "beauty",
                "skincare",
                "cosmetics",
                "makeup"
            ],
            preferredStyles: [
                "photographic",
                "editorial"
            ],
            emojiFallback: "🧴"
        },

        flowers: {
            id: "flowers",
            label: "Flowers",
            category: "decoration",
            keywords: [
                "beauty",
                "wedding",
                "elegant",
                "natural"
            ],
            preferredStyles: [
                "editorial",
                "rounded"
            ],
            emojiFallback: "🌸"
        },

        "fashion model": {
            id: "fashion-model",
            label: "Fashion Model",
            category: "fashion",
            keywords: [
                "fashion",
                "clothing",
                "style",
                "boutique"
            ],
            preferredStyles: [
                "photographic",
                "editorial"
            ],
            emojiFallback: "👗"
        },

        books: {
            id: "books",
            label: "Books",
            category: "education",
            keywords: [
                "education",
                "learning",
                "school",
                "student"
            ],
            preferredStyles: [
                "rounded",
                "outline"
            ],
            emojiFallback: "📚"
        },

        "graduation cap": {
            id: "graduation-cap",
            label: "Graduation Cap",
            category: "education",
            keywords: [
                "education",
                "graduation",
                "university",
                "course"
            ],
            preferredStyles: [
                "rounded",
                "outline"
            ],
            emojiFallback: "🎓"
        },

        airplane: {
            id: "airplane",
            label: "Airplane",
            category: "travel",
            keywords: [
                "travel",
                "flight",
                "tour",
                "holiday"
            ],
            preferredStyles: [
                "outline",
                "photographic"
            ],
            emojiFallback: "✈️"
        },

        mountains: {
            id: "mountains",
            label: "Mountains",
            category: "travel",
            keywords: [
                "mountain",
                "travel",
                "adventure",
                "nature"
            ],
            preferredStyles: [
                "photographic",
                "editorial"
            ],
            emojiFallback: "🏔️"
        },

        beach: {
            id: "beach",
            label: "Beach",
            category: "travel",
            keywords: [
                "beach",
                "travel",
                "holiday",
                "vacation"
            ],
            preferredStyles: [
                "photographic"
            ],
            emojiFallback: "🏖️"
        },

        "gaming controller": {
            id: "gaming-controller",
            label: "Gaming Controller",
            category: "gaming",
            keywords: [
                "gaming",
                "game",
                "gamer",
                "esports"
            ],
            preferredStyles: [
                "technological",
                "solid"
            ],
            emojiFallback: "🎮"
        },

        "medical cross": {
            id: "medical-cross",
            label: "Medical Cross",
            category: "healthcare",
            keywords: [
                "medical",
                "health",
                "doctor",
                "clinic"
            ],
            preferredStyles: [
                "outline",
                "rounded"
            ],
            emojiFallback: "➕"
        },

        "health shield": {
            id: "health-shield",
            label: "Health Shield",
            category: "healthcare",
            keywords: [
                "health",
                "safety",
                "protection",
                "insurance"
            ],
            preferredStyles: [
                "outline",
                "solid"
            ],
            emojiFallback: "🛡️"
        },

        "featured product": {
            id: "featured-product",
            label: "Featured Product",
            category: "ecommerce",
            keywords: [
                "product",
                "ecommerce",
                "shop",
                "sale"
            ],
            preferredStyles: [
                "photographic"
            ],
            emojiFallback: "📦"
        },

        "shopping cart": {
            id: "shopping-cart",
            label: "Shopping Cart",
            category: "ecommerce",
            keywords: [
                "shopping",
                "shop",
                "buy",
                "ecommerce"
            ],
            preferredStyles: [
                "outline",
                "solid"
            ],
            emojiFallback: "🛒"
        },

        "discount badge": {
            id: "discount-badge",
            label: "Discount Badge",
            category: "promotion",
            keywords: [
                "discount",
                "sale",
                "offer",
                "deal"
            ],
            preferredStyles: [
                "solid",
                "playful"
            ],
            emojiFallback: "🏷️"
        },

        "WiFi symbol": {
            id: "wifi-symbol",
            label: "WiFi Symbol",
            category: "technology",
            keywords: [
                "wifi",
                "wi-fi",
                "internet"
            ],
            preferredStyles: [
                "outline",
                "rounded"
            ],
            emojiFallback: "📶"
        },

        "location pin": {
            id: "location-pin",
            label: "Location Pin",
            category: "navigation",
            keywords: [
                "location",
                "visit",
                "address",
                "local"
            ],
            preferredStyles: [
                "outline",
                "rounded"
            ],
            emojiFallback: "📍"
        },

        "gift box": {
            id: "gift-box",
            label: "Gift Box",
            category: "promotion",
            keywords: [
                "gift",
                "present",
                "special offer"
            ],
            preferredStyles: [
                "playful",
                "solid"
            ],
            emojiFallback: "🎁"
        }
    });


    /* =====================================================
       4. INDUSTRY FALLBACK ASSETS
       ===================================================== */

    const INDUSTRY_DEFAULTS = Object.freeze({
        "coffee-shop": [
            "coffee cup",
            "coffee beans",
            "steam",
            "café storefront"
        ],

        restaurant: [
            "featured meal",
            "steam",
            "location pin"
        ],

        bakery: [
            "bread",
            "croissant",
            "cake",
            "steam"
        ],

        technology: [
    "scientific calculator",
    "bmi calculator",
    "ai tools",
    "laptop",
    "digital interface",
    "circuit pattern"
],
        finance: [
            "growth chart",
            "coins",
            "digital interface"
        ],

        "real-estate": [
            "modern house",
            "apartment building",
            "location pin"
        ],

        fitness: [
            "dumbbell",
            "athlete silhouette"
        ],

        beauty: [
            "beauty product",
            "flowers"
        ],

        fashion: [
            "fashion model",
            "featured product"
        ],

        education: [
            "books",
            "graduation cap",
            "laptop"
        ],

        travel: [
            "airplane",
            "mountains",
            "beach"
        ],

        gaming: [
            "gaming controller",
            "digital interface",
            "circuit pattern"
        ],

        healthcare: [
            "medical cross",
            "health shield"
        ],

        ecommerce: [
            "featured product",
            "shopping cart",
            "discount badge"
        ],

        general: [
            "digital interface",
            "location pin"
        ]
    });


    /* =====================================================
       5. MAIN ASSET PLAN FUNCTION
       ===================================================== */

    function createAssetPlan(
        creativeBrief,
        designDirection,
        options = {}
    ) {
        validateInputs(
            creativeBrief,
            designDirection
        );

        const industryId =
            creativeBrief.industry?.id || "general";

        const toneId =
            creativeBrief.tone?.id || "professional";

        const requestedVisuals =
            collectRequestedVisuals(
                creativeBrief,
                options
            );

        const resolvedAssets =
            resolveAssetCandidates(
                requestedVisuals,
                industryId
            );

        const assetStyle =
            selectAssetStyle({
                designDirection,
                toneId,
                industryId,
                resolvedAssets
            });

        const heroAsset =
            chooseHeroAsset({
                resolvedAssets,
                creativeBrief,
                designDirection
            });

        const supportingAssets =
            chooseSupportingAssets({
                resolvedAssets,
                heroAsset,
                designDirection
            });

        const decorativeAssets =
            createDecorativeAssets({
                creativeBrief,
                designDirection,
                assetStyle
            });

        const placements =
            createAssetPlacements({
                heroAsset,
                supportingAssets,
                decorativeAssets,
                designDirection
            });

        const backgroundVisual =
            createBackgroundVisual({
                creativeBrief,
                designDirection,
                heroAsset,
                assetStyle
            });

        const fallbackPlan =
            createFallbackPlan({
                heroAsset,
                supportingAssets,
                assetStyle
            });

        const assetPlan = {
            id: createId("assets"),

            briefId:
                creativeBrief.id || "",

            designId:
                designDirection.id || "",

            industry:
                creativeBrief.industry?.label ||
                "General Business",

            assetStyle,

            heroAsset,

            supportingAssets,

            decorativeAssets,

            placements,

            backgroundVisual,

            fallbackPlan,

            renderingInstructions:
                createRenderingInstructions({
                    heroAsset,
                    supportingAssets,
                    assetStyle,
                    designDirection
                }),

            explanation:
                createAssetExplanation({
                    creativeBrief,
                    heroAsset,
                    supportingAssets,
                    assetStyle,
                    designDirection
                }),

            qualityChecks:
                createAssetQualityChecks({
                    heroAsset,
                    supportingAssets,
                    placements,
                    designDirection
                }),

            createdAt:
                new Date().toISOString()
        };

        window.ToolXoneAI.emit(
            "assets:created",
            {
                assetPlan: clone(assetPlan)
            }
        );

        return clone(assetPlan);
    }


    /* =====================================================
       6. INPUT VALIDATION
       ===================================================== */

    function validateInputs(
        creativeBrief,
        designDirection
    ) {
        if (
            !creativeBrief ||
            typeof creativeBrief !== "object"
        ) {
            throw new window.ToolXoneAI.ToolXoneAIError(
                "A valid creative brief is required.",
                "INVALID_CREATIVE_BRIEF"
            );
        }

        if (
            !designDirection ||
            typeof designDirection !== "object"
        ) {
            throw new window.ToolXoneAI.ToolXoneAIError(
                "A valid design direction is required.",
                "INVALID_DESIGN_DIRECTION"
            );
        }
    }


    /* =====================================================
       7. COLLECT REQUESTED VISUALS
       ===================================================== */

    function collectRequestedVisuals(
        creativeBrief,
        options
    ) {
        const collected = [];

        if (
            Array.isArray(
                creativeBrief.visualElements
            )
        ) {
            collected.push(
                ...creativeBrief.visualElements
            );
        }

        if (
            Array.isArray(
                options.visualElements
            )
        ) {
            collected.push(
                ...options.visualElements
            );
        }

        const prompt =
            String(
                creativeBrief.originalPrompt || ""
            ).toLowerCase();

        Object.entries(
            VISUAL_LIBRARY
        ).forEach(([key, asset]) => {
            const matches =
                asset.keywords.some(keyword =>
                    prompt.includes(
                        keyword.toLowerCase()
                    )
                );

            if (matches) {
                collected.push(key);
            }
        });

        return collected
            .filter(item =>
                typeof item === "string"
            )
            .map(item => item.trim())
            .filter(Boolean)
            .filter(uniqueOnly);
    }


    /* =====================================================
       8. RESOLVE ASSET CANDIDATES
       ===================================================== */

    function resolveAssetCandidates(
        requestedVisuals,
        industryId
    ) {
        const assetKeys = [
            ...requestedVisuals
        ];

        const defaults =
            INDUSTRY_DEFAULTS[industryId] ||
            INDUSTRY_DEFAULTS.general;

        assetKeys.push(...defaults);

        return assetKeys
            .filter(uniqueOnly)
            .map((assetName, index) =>
                resolveAsset(
                    assetName,
                    index
                )
            )
            .filter(Boolean)
            .slice(0, 10);
    }

    function resolveAsset(
        assetName,
        index
    ) {
        const exact =
            VISUAL_LIBRARY[assetName];

        if (exact) {
            return {
                ...clone(exact),
                sourceName: assetName,
                confidence:
                    index < 3 ? 0.95 : 0.8,
                source: "built-in-library"
            };
        }

        const normalized =
            normalizeText(assetName);

        const libraryMatch =
            Object.entries(
                VISUAL_LIBRARY
            ).find(([key, asset]) => {
                const normalizedKey =
                    normalizeText(key);

                if (
                    normalizedKey.includes(
                        normalized
                    ) ||
                    normalized.includes(
                        normalizedKey
                    )
                ) {
                    return true;
                }

                return asset.keywords.some(
                    keyword =>
                        normalized.includes(
                            normalizeText(keyword)
                        )
                );
            });

        if (libraryMatch) {
            const [key, asset] =
                libraryMatch;

            return {
                ...clone(asset),
                sourceName: key,
                confidence: 0.75,
                source: "semantic-library-match"
            };
        }

        return createCustomAsset(
            assetName,
            index
        );
    }

    function createCustomAsset(
        assetName,
        index
    ) {
        return {
            id:
                `custom-${slugify(assetName)}`,

            label:
                titleCase(assetName),

            category: "custom",

            keywords: [assetName],

            preferredStyles: [
                "outline",
                "rounded"
            ],

            emojiFallback: "✨",

            sourceName: assetName,

            confidence:
                index < 3 ? 0.7 : 0.55,

            source: "generated-concept",

            requiresGeneratedAsset: true
        };
    }


    /* =====================================================
       9. SELECT ASSET STYLE
       ===================================================== */

    function selectAssetStyle({
        designDirection,
        toneId,
        industryId,
        resolvedAssets
    }) {
        const preferredType =
            designDirection.assetPlan
                ?.preferredAssetType || "";

        if (
            preferredType.includes(
                "photographic"
            )
        ) {
            return clone(
                ASSET_STYLES.photographic
            );
        }

        if (
            preferredType.includes(
                "vector"
            )
        ) {
            if (
                industryId === "technology" ||
                industryId === "gaming"
            ) {
                return clone(
                    ASSET_STYLES.technological
                );
            }

            return clone(
                ASSET_STYLES.rounded
            );
        }

        const toneStyleMap = {
            professional: "outline",
            bold: "solid",
            friendly: "rounded",
            luxury: "editorial",
            minimal: "outline",
            creative: "editorial",
            urgent: "solid",
            playful: "playful"
        };

        const preferredStyle =
            toneStyleMap[toneId] ||
            "outline";

        const assetStyleVotes =
            new Map();

        resolvedAssets.forEach(asset => {
            asset.preferredStyles
                ?.forEach(style => {
                    assetStyleVotes.set(
                        style,
                        (
                            assetStyleVotes.get(
                                style
                            ) || 0
                        ) + 1
                    );
                });
        });

        const strongestAssetStyle =
            [...assetStyleVotes.entries()]
                .sort(
                    (a, b) => b[1] - a[1]
                )[0]?.[0];

        const selectedStyle =
            strongestAssetStyle &&
            ASSET_STYLES[
                strongestAssetStyle
            ]
                ? strongestAssetStyle
                : preferredStyle;

        return clone(
            ASSET_STYLES[selectedStyle] ||
            ASSET_STYLES.outline
        );
    }


    /* =====================================================
       10. HERO ASSET SELECTION
       ===================================================== */

    function chooseHeroAsset({
    resolvedAssets,
    creativeBrief,
    designDirection
}) {
    if (!resolvedAssets.length) {
        return createGenericHeroAsset(
            creativeBrief
        );
    }

    const prompt = normalizeText(
        creativeBrief.originalPrompt || ""
    );

    const industryId =
        creativeBrief.industry?.id || "general";

    const explicitPromotionRequest =
        /\b(discount|sale|offer|deal|percent off|% off|limited time|flash sale)\b/i
            .test(prompt);

    const industryHeroPreferences = {
        "coffee-shop": [
            "coffee-cup",
            "cafe-storefront",
            "coffee-beans"
        ],

        restaurant: [
            "featured-meal"
        ],

        bakery: [
            "bread",
            "croissant",
            "cake"
        ],

  technology: [
    "scientific-calculator",
    "bmi-calculator",
    "ai-tools",
    "laptop",
    "digital-interface",
    "circuit-pattern"
],

        finance: [
            "growth-chart",
            "coins",
            "digital-interface"
        ],

        "real-estate": [
            "modern-house",
            "apartment-building"
        ],

        fitness: [
            "athlete-silhouette",
            "dumbbell"
        ],

        beauty: [
            "beauty-product",
            "flowers"
        ],

        fashion: [
            "fashion-model",
            "featured-product"
        ],

        education: [
            "books",
            "graduation-cap",
            "laptop"
        ],

        travel: [
            "mountains",
            "beach",
            "airplane"
        ],

        gaming: [
            "gaming-controller",
            "digital-interface"
        ],

        healthcare: [
            "health-shield",
            "medical-cross"
        ],

        ecommerce: [
            "featured-product",
            "shopping-cart"
        ]
    };

    const preferredHeroIds =
        industryHeroPreferences[industryId] || [];

    const scoredAssets =
        resolvedAssets.map(
            (asset, index) => {
                let score =
                    asset.confidence || 0.5;

                /*
                 Give moderate priority to earlier
                 context suggestions, but not enough
                 to defeat industry relevance.
                */
                if (index === 0) {
                    score += 0.15;
                }

                /*
                 Strongly reward objects that naturally
                 represent the detected industry.
                */
                const preferredIndex =
                    preferredHeroIds.indexOf(
                        asset.id
                    );

                if (preferredIndex !== -1) {
                    score +=
                        1.2 -
                        preferredIndex * 0.15;
                }

                /*
                 Reward strong subject categories.
                */
                if (
                    [
                        "food",
                        "property",
                        "fitness",
                        "beauty",
                        "fashion",
                        "education",
                        "travel",
                        "gaming",
                        "healthcare",
                        "ecommerce",
                        "technology",
                        "finance",
                        "place"
                    ].includes(asset.category)
                ) {
                    score += 0.25;
                }

                /*
                 Effects and decorations should almost
                 never become the primary subject.
                */
                if (
                    asset.category === "effect" ||
                    asset.category === "decoration" ||
                    asset.category === "navigation"
                ) {
                    score -= 0.75;
                }

                /*
                 Promotional graphics may become the hero
                 only when the user clearly requested a
                 sale, discount or special offer.
                */
                if (
                    asset.category === "promotion"
                ) {
                    score +=
                        explicitPromotionRequest
                            ? 0.45
                            : -1.25;
                }

                /*
                 WiFi, location and similar utility symbols
                 work as supporting icons, not hero visuals.
                */
                if (
                    [
                        "wifi-symbol",
                        "location-pin",
                        "shopping-cart"
                    ].includes(asset.id)
                ) {
                    score -= 0.55;
                }

                /*
                 Photographic layouts favor physical,
                 recognizable subjects.
                */
                if (
                    [
                        "food",
                        "property",
                        "fashion",
                        "beauty",
                        "ecommerce",
                        "place"
                    ].includes(asset.category) &&
                    designDirection.assetPlan
                        ?.preferredAssetType
                        ?.includes("photographic")
                ) {
                    score += 0.3;
                }

                return {
                    asset,
                    score
                };
            }
        );

    scoredAssets.sort(
        (a, b) => b.score - a.score
    );

    const selected =
        clone(scoredAssets[0].asset);

    return {
        ...selected,

        role: "hero",

        priority: 1,

        scalePercent:
            designDirection.assetPlan
                ?.heroScalePercent || 38,

        placement:
            designDirection.assetPlan
                ?.heroPlacement ||
            designDirection.layout
                ?.visualZone ||
            "right",

        cropStrategy:
            designDirection.assetPlan
                ?.cropStrategy ||
            "contained",

        accessibilityLabel:
            selected.label
    };
}

/* =====================================================
   11. SUPPORTING ASSETS
   ===================================================== */

function chooseSupportingAssets({
    resolvedAssets,
    heroAsset,
    designDirection
}) {
    const maximumAssets =
        designDirection.platform?.orientation === "portrait"
            ? 3
            : 4;

    return resolvedAssets
        .filter(asset => asset.id !== heroAsset.id)

        /*
         Supporting assets may include useful icons,
         effects and contextual secondary objects.
        */
        .filter(asset => {
            if (
                asset.category === "custom" &&
                asset.confidence < 0.6
            ) {
                return false;
            }

            return true;
        })

        /*
         Give useful contextual assets stronger priority.
        */
        .sort((assetA, assetB) => {
            return (
                getSupportingAssetScore(
                    assetB,
                    designDirection
                ) -
                getSupportingAssetScore(
                    assetA,
                    designDirection
                )
            );
        })

.filter((asset, index, collection) => {
    return (
        collection.findIndex(
            item => item.id === asset.id
        ) === index
    );
})

        .slice(0, maximumAssets)

        .map((asset, index) => ({
            ...clone(asset),

            role: "supporting",

            priority: index + 2,

            scalePercent:
                index === 0
                    ? 12
                    : index === 1
                        ? 10
                        : 8,

            placement:
                chooseSupportingPlacement(
                    index,
                    designDirection.layout?.visualZone
                ),

            opacity:
                index === 0
                    ? 0.95
                    : index === 1
                        ? 0.82
                        : 0.7,

            accessibilityLabel:
                asset.label
        }));
}


function getSupportingAssetScore(
    asset,
    designDirection
) {
    let score =
        asset.confidence || 0.5;

    /*
     Effects such as steam are useful supporting
     decorations but should remain secondary.
    */
    if (asset.category === "effect") {
        score += 0.25;
    }

    /*
     Utility symbols work well as supporting icons.
    */
    if (
        [
            "wifi-symbol",
            "location-pin",
            "shopping-cart",
            "discount-badge",
            "gift-box"
        ].includes(asset.id)
    ) {
        score += 0.35;
    }

    /*
     Industry-related physical objects remain useful
     supporting visuals.
    */
    if (
        [
            "food",
            "technology",
            "finance",
            "property",
            "fitness",
            "beauty",
            "fashion",
            "education",
            "travel",
            "gaming",
            "healthcare",
            "ecommerce",
            "place"
        ].includes(asset.category)
    ) {
        score += 0.2;
    }

    /*
     Prefer photographic subjects when the design
     direction requests photography.
    */
    if (
        designDirection.assetPlan
            ?.preferredAssetType
            ?.includes("photographic") &&
        asset.preferredStyles
            ?.includes("photographic")
    ) {
        score += 0.2;
    }

    return score;
}


function chooseSupportingPlacement(
    index,
    visualZone
) {
    const placementSets = {
        right: [
            "right-top",
            "right-bottom",
            "center-right",
            "background-right"
        ],

        "right-half": [
            "right-top",
            "right-bottom",
            "center-right",
            "background-right"
        ],

        "right-product": [
            "right-top",
            "right-bottom",
            "background-right",
            "center-right"
        ],

        "background-center": [
            "top-right",
            "bottom-left",
            "bottom-right",
            "top-left"
        ],

        "right-interface": [
            "right-top",
            "right-bottom",
            "center-right",
            "background-right"
        ],

        "lower-product": [
            "top-right",
            "top-left",
            "bottom-right",
            "bottom-left"
        ]
    };

    const placements =
        placementSets[visualZone] ||
        placementSets.right;

    return placements[
        index % placements.length
    ];
}

    /* =====================================================
       12. DECORATIVE ASSETS
       ===================================================== */

    function createDecorativeAssets({
        creativeBrief,
        designDirection,
        assetStyle
    }) {
        const decorationShapes =
            designDirection.decorations
                ?.shapes || [];

        const decorationCount =
            designDirection.assetPlan
                ?.decorativeAssetCount || 3;

        const assets =
            decorationShapes
                .slice(0, decorationCount)
                .map((shape, index) => ({
                    id:
                        `decoration-${slugify(
                            shape
                        )}-${index + 1}`,

                    label:
                        titleCase(shape),

                    category:
                        "decoration",

                    role:
                        "decorative",

                    priority: 10 + index,

                    shape,

                    placement:
                        [
                            "top-right",
                            "bottom-right",
                            "bottom-left",
                            "background-center"
                        ][index % 4],

                    scalePercent:
                        18 - index * 3,

                    opacity:
                        Math.max(
                            0.08,
                            0.22 - index * 0.04
                        ),

                    style:
                        assetStyle.id,

                    interactive: false,

                    accessibilityLabel: ""
                }));

        const emotions =
            creativeBrief.emotions || [];

        if (
            emotions.includes("energetic") &&
            !assets.some(asset =>
                asset.shape.includes("line")
            )
        ) {
            assets.push({
                id: "decoration-energy-lines",
                label: "Energy Lines",
                category: "effect",
                role: "decorative",
                priority: 20,
                shape: "energy lines",
                placement: "background-right",
                scalePercent: 22,
                opacity: 0.16,
                style: "solid",
                interactive: false,
                accessibilityLabel: ""
            });
        }

        return assets;
    }


    /* =====================================================
       13. ASSET PLACEMENTS
       ===================================================== */

    function createAssetPlacements({
        heroAsset,
        supportingAssets,
        decorativeAssets,
        designDirection
    }) {
        return {
            hero: {
                assetId: heroAsset.id,

                zone:
                    heroAsset.placement,

                anchor:
                    chooseAnchor(
                        heroAsset.placement
                    ),

                widthPercent:
                    heroAsset.scalePercent,

                maximumHeightPercent:
                    designDirection.platform
                        ?.orientation ===
                        "portrait"
                        ? 38
                        : 72,

                zIndex: 2,

                avoidTextZone: true,

                preserveAspectRatio: true
            },

            supporting:
                supportingAssets.map(
                    asset => ({
                        assetId: asset.id,

                        zone:
                            asset.placement,

                        anchor:
                            chooseAnchor(
                                asset.placement
                            ),

                        widthPercent:
                            asset.scalePercent,

                        opacity:
                            asset.opacity,

                        zIndex: 3,

                        avoidTextZone: true
                    })
                ),

            decorative:
                decorativeAssets.map(
                    asset => ({
                        assetId: asset.id,

                        zone:
                            asset.placement,

                        anchor:
                            chooseAnchor(
                                asset.placement
                            ),

                        widthPercent:
                            asset.scalePercent,

                        opacity:
                            asset.opacity,

                        zIndex: 1,

                        avoidTextZone: false
                    })
                )
        };
    }

    function chooseAnchor(zone) {
        const anchors = {
            right: "center-right",
            "right-half": "center-right",
            "right-product": "center-right",
            "right-interface": "center-right",
            "background-right":
                "center-right",
            "center-right":
                "center-right",
            "right-top": "top-right",
            "top-right": "top-right",
            "right-bottom":
                "bottom-right",
            "bottom-right":
                "bottom-right",
            "bottom-left":
                "bottom-left",
            "top-left": "top-left",
            "background-center":
                "center",
            "lower-product":
                "bottom-center"
        };

        return anchors[zone] ||
            "center-right";
    }


    /* =====================================================
       14. BACKGROUND VISUAL
       ===================================================== */

    function createBackgroundVisual({
        creativeBrief,
        designDirection,
        heroAsset,
        assetStyle
    }) {
        const useImage =
            Boolean(
                designDirection.assetPlan
                    ?.useBackgroundImage
            );

        return {
            useGeneratedImage: useImage,

            primarySubject:
                useImage
                    ? heroAsset.label
                    : "",

            style:
                assetStyle.label,

            prompt:
                buildAssetImagePrompt({
                    creativeBrief,
                    designDirection,
                    heroAsset,
                    assetStyle
                }),

            negativePrompt: [
                "text",
                "watermark",
                "logo",
                "distorted objects",
                "low resolution",
                "crowded composition",
                "important subject behind text"
            ].join(", "),

            preserveTextSpace: true,

            focalPoint:
                designDirection.layout
                    ?.visualZone || "right",

            overlay:
                designDirection.background
                    ?.overlay || "none",

            fallback:
                designDirection.background
                    ?.gradient || ""
        };
    }

    function buildAssetImagePrompt({
        creativeBrief,
        designDirection,
        heroAsset,
        assetStyle
    }) {
        const industry =
            creativeBrief.industry?.label ||
            "business";

        const tone =
            creativeBrief.tone?.label ||
            "professional";

        const platform =
            designDirection.platform?.label ||
            "social media banner";

        const visualElements =
            creativeBrief.visualElements || [];

        const supporting =
            visualElements
                .slice(1, 4)
                .join(", ");

        return [
            `${tone} ${industry} visual`,
            `featuring ${heroAsset.label}`,
            supporting
                ? `with ${supporting}`
                : "",
            `${assetStyle.label.toLowerCase()} style`,
            `optimized for ${platform}`,
            "professional lighting",
            "clean composition",
            "clear negative space for headline and call to action",
            "no text",
            "no watermark"
        ]
            .filter(Boolean)
            .join(", ");
    }


    /* =====================================================
       15. FALLBACK PLAN
       ===================================================== */

    function createFallbackPlan({
        heroAsset,
        supportingAssets,
        assetStyle
    }) {
        return {
            heroFallback: {
                type: "emoji-or-generated-svg",
                value:
                    heroAsset.emojiFallback ||
                    "✨",
                label: heroAsset.label
            },

            supportingFallbacks:
                supportingAssets.map(
                    asset => ({
                        assetId: asset.id,
                        type:
                            "emoji-or-generated-svg",
                        value:
                            asset.emojiFallback ||
                            "•",
                        label: asset.label
                    })
                ),

            genericStyle:
                assetStyle.id,

            useAbstractShapesWhenMissing:
                true
        };
    }


    /* =====================================================
       16. RENDERING INSTRUCTIONS
       ===================================================== */

    function createRenderingInstructions({
        heroAsset,
        supportingAssets,
        assetStyle,
        designDirection
    }) {
        return {
            hero: [
                `Render ${heroAsset.label} as the primary visual.`,
                `Use the ${assetStyle.label.toLowerCase()} visual style.`,
                `Place it in the ${formatIdentifier(
                    heroAsset.placement
                ).toLowerCase()} zone.`,
                `Keep it outside the main headline safe area.`,
                `Use approximately ${heroAsset.scalePercent}% of the canvas width.`
            ],

            supporting:
                supportingAssets.map(
                    asset =>
                        `Place ${asset.label} at ${formatIdentifier(
                            asset.placement
                        ).toLowerCase()} with reduced visual priority.`
                ),

            general: [
                "Keep visual elements consistent in style.",
                "Do not place important visuals behind readable text.",
                "Avoid overcrowding the banner.",
                "Preserve platform-safe margins.",
                "Decorative assets must remain visually secondary."
            ],

            cssClass:
                `asset-style-${assetStyle.id}`,

            layoutClass:
                designDirection
                    .responsiveRules
                    ?.layoutClass || ""
        };
    }


    /* =====================================================
       17. ASSET EXPLANATION
       ===================================================== */

    function createAssetExplanation({
        creativeBrief,
        heroAsset,
        supportingAssets,
        assetStyle,
        designDirection
    }) {
        const industry =
            creativeBrief.industry?.label ||
            "the detected business";

        const explanation = [
            `${heroAsset.label} was selected as the main visual because it quickly communicates ${industry}.`,

            `${assetStyle.label} was chosen to match the requested tone and overall design direction.`,

            `The main visual is placed in the ${formatIdentifier(
                heroAsset.placement
            ).toLowerCase()} area so the headline remains readable.`
        ];

        if (supportingAssets.length) {
            explanation.push(
                `${supportingAssets
                    .slice(0, 3)
                    .map(asset => asset.label)
                    .join(", ")} support the context without competing with the main message.`
            );
        }

        if (
            designDirection.assetPlan
                ?.useBackgroundImage
        ) {
            explanation.push(
                "A context-aware background image is recommended because this industry benefits from strong visual storytelling."
            );
        }

        return explanation;
    }


    /* =====================================================
       18. QUALITY CHECKS
       ===================================================== */

    function createAssetQualityChecks({
        heroAsset,
        supportingAssets,
        placements,
        designDirection
    }) {
        return [
            {
                id: "hero-selected",
                label:
                    "Main contextual visual selected",
                passed:
                    Boolean(heroAsset?.id)
            },

            {
                id: "visual-context",
                label:
                    "Visual matches the detected context",
                passed:
                    heroAsset?.confidence >= 0.45
            },

            {
                id: "asset-limit",
                label:
                    "Supporting asset count is controlled",
                passed:
                    supportingAssets.length <= 4
            },

            {
                id: "text-safe-zone",
                label:
                    "Main visual avoids the text zone",
                passed:
                    placements.hero
                        ?.avoidTextZone === true
            },

            {
                id: "consistent-placement",
                label:
                    "All assets have valid placement instructions",
                passed:
                    [
                        placements.hero,
                        ...placements.supporting,
                        ...placements.decorative
                    ].every(
                        placement =>
                            Boolean(
                                placement.zone
                            )
                    )
            },

            {
                id: "platform-aware",
                label:
                    "Assets are planned for the selected platform",
                passed:
                    Boolean(
                        designDirection.platform
                            ?.width &&
                        designDirection.platform
                            ?.height
                    )
            }
        ];
    }


    /* =====================================================
       19. GENERAL HELPERS
       ===================================================== */

    function normalizeText(value) {
        return String(value || "")
            .toLowerCase()
            .normalize("NFKD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .replace(
                /[^\p{L}\p{N}\s-]/gu,
                " "
            )
            .replace(/\s+/g, " ")
            .trim();
    }

    function slugify(value) {
        return normalizeText(value)
            .replace(/\s+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function titleCase(value) {
        return String(value || "")
            .split(/[\s-]+/)
            .filter(Boolean)
            .map(
                word =>
                    word.charAt(0)
                        .toUpperCase() +
                    word.slice(1)
            )
            .join(" ");
    }

    function formatIdentifier(value) {
        return titleCase(value);
    }

    function uniqueOnly(
        value,
        index,
        collection
    ) {
        return collection.indexOf(value) ===
            index;
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
   20. PHOENIX DESIGN DNA ADAPTER
   ===================================================== */

function createAssetsFromDNA(
    analysis,
    designDNA
) {
    if (
        !analysis ||
        typeof analysis !== "object"
    ) {
        throw new Error(
            "Phoenix Asset Engine requires a valid analysis object."
        );
    }

    if (
        !designDNA ||
        typeof designDNA !== "object"
    ) {
        throw new Error(
            "Phoenix Asset Engine requires valid Design DNA."
        );
    }

    const heroDNA =
        designDNA.hero || {};

    const decorationDNA =
        designDNA.decorations || {};

    const styleDNA =
        designDNA.style || {};

    const layoutDNA =
        designDNA.layout || {};

    const paletteDNA =
        designDNA.palette || {};

    const heroAsset =
        createHeroAssetFromDNA({
            analysis,
            heroDNA,
            styleDNA,
            layoutDNA
        });

    const supportingAssets =
        createSupportingAssetsFromDNA({
            heroDNA,
            styleDNA,
            layoutDNA
        });

    const decorativeAssets =
        createDecorativeAssetsFromDNA({
            decorationDNA,
            paletteDNA
        });

    return {
        id:
            createId(
                "dna-assets"
            ),

        source:
            "phoenix-design-dna",

        heroAsset,

        supportingAssets,

        decorativeAssets,

        placements: {
            hero: {
                assetId:
                    heroAsset.id,

                zone:
                    heroAsset.placement,

                anchor:
                    chooseAnchor(
                        heroAsset.placement
                    ),

                widthPercent:
                    heroAsset.scalePercent,

                avoidTextZone: true,

                preserveAspectRatio: true
            },

            supporting:
                supportingAssets.map(
                    asset => ({
                        assetId:
                            asset.id,

                        zone:
                            asset.placement,

                        anchor:
                            chooseAnchor(
                                asset.placement
                            ),

                        widthPercent:
                            asset.scalePercent,

                        opacity:
                            asset.opacity,

                        avoidTextZone: true
                    })
                ),

            decorative:
                decorativeAssets.map(
                    asset => ({
                        assetId:
                            asset.id,

                        zone:
                            asset.placement,

                        anchor:
                            chooseAnchor(
                                asset.placement
                            ),

                        opacity:
                            asset.opacity,

                        avoidTextZone: false
                    })
                )
        },

        fallbackPlan: {
            heroFallback: {
                type:
                    "emoji-or-generated-svg",

                value:
                    heroAsset.emojiFallback ||
                    "✦",

                label:
                    heroAsset.label
            },

            supportingFallbacks:
                supportingAssets.map(
                    asset => ({
                        assetId:
                            asset.id,

                        type:
                            "emoji-or-generated-svg",

                        value:
                            asset.emojiFallback ||
                            "•",

                        label:
                            asset.label
                    })
                )
        },

        createdAt:
            new Date().toISOString()
    };
}


function createHeroAssetFromDNA({
    analysis,
    heroDNA,
    styleDNA,
    layoutDNA
}) {
    const visualName =
        heroDNA.primaryVisual ||
        heroDNA.subject ||
        analysis.subject ||
        "digital interface";

    const libraryAsset =
        findVisualAssetByDNAName(
            visualName
        );

    const heroScaleMap = {
        small: 22,
        medium: 30,
        large: 40,
        "extra-large": 50
    };

    const scalePercent =
        heroScaleMap[
            layoutDNA.heroScale ||
            heroDNA.scale
        ] || 38;

    return {
        ...libraryAsset,

        role:
            "hero",

        priority:
            1,

        scalePercent,

        placement:
            normalizeDNAPlacement(
                heroDNA.position ||
                layoutDNA.heroZone ||
                "center"
            ),

        cropStrategy:
            "contained",

        visualTreatment:
            heroDNA.treatment ||
            styleDNA.id ||
            "balanced-modern",

        accessibilityLabel:
            libraryAsset.label,

        avoid:
            Array.isArray(
                heroDNA.avoid
            )
                ? [...heroDNA.avoid]
                : []
    };
}


function createSupportingAssetsFromDNA({
    heroDNA,
    styleDNA,
    layoutDNA
}) {
    const requested =
        Array.isArray(
            heroDNA.supportingVisuals
        )
            ? heroDNA.supportingVisuals
            : [];

    return requested
        .slice(0, 4)
        .map(
            (
                visualName,
                index
            ) => {
                const asset =
                    findVisualAssetByDNAName(
                        visualName
                    );

                return {
                    ...asset,

                    role:
                        "supporting",

                    priority:
                        index + 2,

                    scalePercent:
                        index === 0
                            ? 14
                            : index === 1
                                ? 11
                                : 9,

                    placement:
                        chooseSupportingPlacement(
                            index,
                            normalizeDNAPlacement(
                                layoutDNA.heroZone ||
                                heroDNA.position ||
                                "right"
                            )
                        ),

                    opacity:
                        index === 0
                            ? 0.95
                            : index === 1
                                ? 0.82
                                : 0.7,

                    visualTreatment:
                        styleDNA.id ||
                        "balanced-modern",

                    accessibilityLabel:
                        asset.label
                };
            }
        );
}


function createDecorativeAssetsFromDNA({
    decorationDNA,
    paletteDNA
}) {
    const primary =
        Array.isArray(
            decorationDNA.primary
        )
            ? decorationDNA.primary
            : [];

    const secondary =
        Array.isArray(
            decorationDNA.secondary
        )
            ? decorationDNA.secondary
            : [];

    return [
        ...primary,
        ...secondary
    ]
        .slice(0, 6)
        .map(
            (
                decoration,
                index
            ) => ({
                id:
                    `dna-decoration-${
                        slugify(
                            decoration.type ||
                            `shape-${index + 1}`
                        )
                    }`,

                label:
                    titleCase(
                        decoration.type ||
                        "Decoration"
                    ),

                category:
                    "decoration",

                role:
                    "decorative",

                priority:
                    10 + index,

                shape:
                    decoration.type ||
                    "soft-shape",

                placement:
                    normalizeDNAPlacement(
                        decoration.position ||
                        [
                            "top-right",
                            "bottom-left",
                            "bottom-right"
                        ][index % 3]
                    ),

                emphasis:
                    decoration.emphasis ||
                    "low",

                opacity:
                    resolveDecorationOpacity(
                        decoration.emphasis
                    ),

                accentColor:
                    decorationDNA.accentColor ||
                    paletteDNA.accent ||
                    "#22d3ee",

                interactive:
                    false,

                accessibilityLabel:
                    ""
            })
        );
}


function findVisualAssetByDNAName(
    visualName
) {
    const normalized =
        normalizeText(
            visualName
        );

    const exactMatch =
        Object.values(
            VISUAL_LIBRARY
        ).find(
            asset =>
                normalizeText(
                    asset.id
                ) === normalized ||
                normalizeText(
                    asset.label
                ) === normalized
        );

    if (exactMatch) {
        return clone(
            exactMatch
        );
    }

    const keywordMatch =
        Object.values(
            VISUAL_LIBRARY
        ).find(
            asset =>
                asset.keywords.some(
                    keyword =>
                        normalized.includes(
                            normalizeText(
                                keyword
                            )
                        ) ||
                        normalizeText(
                            keyword
                        ).includes(
                            normalized
                        )
                )
        );

    if (keywordMatch) {
        return clone(
            keywordMatch
        );
    }

    return createCustomAsset(
        visualName,
        0
    );
}


function normalizeDNAPlacement(
    placement
) {
    const value =
        normalizeText(
            placement
        )
            .replace(
                /\s+/g,
                "-"
            );

    const placementMap = {
        center:
            "background-center",

        "right-center":
            "center-right",

        right:
            "center-right",

        left:
            "top-left",

        "left-upper":
            "top-left",

        "left-middle":
            "center-left",

        upper:
            "top-center",

        top:
            "top-center",

        "bottom-center":
            "lower-product",

        bottom:
            "lower-product",

        "hero-frame":
            "background-center",

        "around-hero":
            "background-center",

        background:
            "background-center",

        edges:
            "background-center",

        corners:
            "top-right",

        "cta-area":
            "bottom-right",

        "hero-side":
            "center-right"
    };

    return (
        placementMap[value] ||
        value ||
        "background-center"
    );
}


function resolveDecorationOpacity(
    emphasis
) {
    const values = {
        low: 0.16,
        medium: 0.28,
        high: 0.42
    };

    return (
        values[emphasis] ||
        values.low
    );
}

    /* =====================================================
       21. PUBLIC API
       ===================================================== */

    window.ToolXoneAssetEngine =
    Object.freeze({
        createAssetPlan,
        createAssetsFromDNA,

            getAssetStyles() {
                return clone(
                    ASSET_STYLES
                );
            },

            getVisualLibrary() {
                return clone(
                    VISUAL_LIBRARY
                );
            },

            getIndustryDefaults() {
                return clone(
                    INDUSTRY_DEFAULTS
                );
            },

            findAsset(name) {
                if (
                    typeof name !==
                    "string"
                ) {
                    return null;
                }

                return clone(
                    resolveAsset(
                        name.trim(),
                        0
                    )
                );
            }
        });


    /* =====================================================
       22. READY EVENT
       ===================================================== */

    window.ToolXoneAI.emit(
        "asset-engine:ready",
        {
            assetStyles:
                Object.keys(
                    ASSET_STYLES
                ).length,

            visualAssets:
                Object.keys(
                    VISUAL_LIBRARY
                ).length,

            industryDefaults:
                Object.keys(
                    INDUSTRY_DEFAULTS
                ).length
        }
    );

})();