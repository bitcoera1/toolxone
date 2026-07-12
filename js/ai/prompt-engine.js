/* =========================================================
   TOOLXONE AI CREATIVE ENGINE
   File: js/ai/prompt-engine.js

   Responsibility:
   Understand the user's idea and transform it into a
   structured creative brief.

   This module provides:
   - Local idea analysis
   - Industry recognition
   - Goal recognition
   - Audience recognition
   - Tone and emotion recognition
   - Visual element suggestions
   - Theme and layout recommendations
   - A reusable result for every ToolXone AI Studio
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       1. ENGINE CHECK
       ===================================================== */

    if (!window.ToolXoneAI) {
        console.error(
            "[ToolXone AI] ai-core.js must load before prompt-engine.js."
        );

        return;
    }


    /* =====================================================
       2. INDUSTRY KNOWLEDGE BASE
       ===================================================== */

    const INDUSTRIES = [
        {
            id: "coffee-shop",
            label: "Coffee Shop",
            businessType: "Food & Beverage",
            keywords: [
                "coffee",
                "cafe",
                "café",
                "coffee shop",
                "coffee house",
                "espresso",
                "latte",
                "cappuccino",
                "barista",
                "coffee hut"
            ],
            audiences: [
                "Coffee lovers",
                "Students",
                "Professionals",
                "Local customers"
            ],
            visuals: [
                "coffee cup",
                "coffee beans",
                "steam",
                "café storefront",
                "wooden texture",
                "warm lighting",
                "croissant",
                "leaf decoration"
            ],
            themes: ["warm", "emerald", "minimal"],
            layouts: [
                "centered-hero",
                "product-spotlight",
                "bold-left"
            ],
            emotions: [
                "warm",
                "welcoming",
                "relaxed",
                "friendly"
            ]
        },

        {
            id: "restaurant",
            label: "Restaurant",
            businessType: "Food & Beverage",
            keywords: [
                "restaurant",
                "food",
                "dining",
                "dinner",
                "lunch",
                "meal",
                "menu",
                "fast food",
                "bbq",
                "barbecue",
                "pizza",
                "burger",
                "delivery"
            ],
            audiences: [
                "Local customers",
                "Families",
                "Food lovers",
                "Online delivery customers"
            ],
            visuals: [
                "featured meal",
                "restaurant table",
                "cutlery",
                "chef",
                "food ingredients",
                "steam",
                "restaurant storefront"
            ],
            themes: ["warm", "dark", "promotional"],
            layouts: [
                "product-spotlight",
                "promotional-sale",
                "split-layout"
            ],
            emotions: [
                "delicious",
                "inviting",
                "energetic",
                "warm"
            ]
        },

        {
            id: "bakery",
            label: "Bakery",
            businessType: "Food & Beverage",
            keywords: [
                "bakery",
                "cake",
                "cakes",
                "bread",
                "croissant",
                "pastry",
                "pastries",
                "cupcake",
                "cupcakes",
                "cookies",
                "baking"
            ],
            audiences: [
                "Families",
                "Dessert lovers",
                "Local customers",
                "Event customers"
            ],
            visuals: [
                "bread",
                "croissant",
                "cake",
                "cupcake",
                "wheat",
                "steam",
                "wooden tray",
                "soft flour texture"
            ],
            themes: ["warm", "minimal", "purple"],
            layouts: [
                "centered-hero",
                "product-spotlight",
                "minimal-editorial"
            ],
            emotions: [
                "homemade",
                "warm",
                "sweet",
                "friendly"
            ]
        },

        {
            id: "technology",
            label: "Technology",
            businessType: "Technology & Software",
            keywords: [
                "technology",
                "tech",
                "software",
                "saas",
                "app",
                "application",
                "website",
                "platform",
                "digital",
                "online tool",
                "online tools",
                "calculator",
                "converter",
                "qr code",
                "artificial intelligence",
                "ai tool",
                "ai tools",
                "startup"
            ],
            audiences: [
                "Professionals",
                "Students",
                "Businesses",
                "Digital users"
            ],
            visuals: [
                "laptop",
                "digital interface",
                "abstract technology lines",
                "circuit pattern",
                "floating interface cards",
                "blue glow",
                "data symbols"
            ],
            themes: ["blue", "dark", "emerald"],
            layouts: [
                "modern-technology",
                "bold-left",
                "split-layout"
            ],
            emotions: [
                "modern",
                "innovative",
                "efficient",
                "trustworthy"
            ]
        },

        {
            id: "finance",
            label: "Finance",
            businessType: "Finance & Business",
            keywords: [
                "finance",
                "financial",
                "investment",
                "investing",
                "money",
                "bank",
                "banking",
                "loan",
                "mortgage",
                "saving",
                "savings",
                "profit",
                "forex",
                "currency",
                "accounting",
                "insurance"
            ],
            audiences: [
                "Investors",
                "Business owners",
                "Professionals",
                "Families"
            ],
            visuals: [
                "growth chart",
                "currency symbols",
                "calculator",
                "coins",
                "financial dashboard",
                "upward arrow",
                "secure shield"
            ],
            themes: ["emerald", "blue", "dark"],
            layouts: [
                "bold-left",
                "modern-technology",
                "minimal-editorial"
            ],
            emotions: [
                "trustworthy",
                "secure",
                "professional",
                "confident"
            ]
        },

        {
            id: "real-estate",
            label: "Real Estate",
            businessType: "Property & Real Estate",
            keywords: [
                "real estate",
                "property",
                "properties",
                "apartment",
                "apartments",
                "house",
                "home",
                "homes",
                "villa",
                "land",
                "rent",
                "rental",
                "agent",
                "realtor"
            ],
            audiences: [
                "Home buyers",
                "Property investors",
                "Families",
                "Renters"
            ],
            visuals: [
                "modern house",
                "apartment building",
                "city skyline",
                "house keys",
                "architectural lines",
                "property location pin"
            ],
            themes: ["blue", "luxury", "minimal"],
            layouts: [
                "split-layout",
                "minimal-editorial",
                "product-spotlight"
            ],
            emotions: [
                "premium",
                "secure",
                "aspirational",
                "professional"
            ]
        },

        {
            id: "fitness",
            label: "Fitness & Gym",
            businessType: "Health & Fitness",
            keywords: [
                "gym",
                "fitness",
                "workout",
                "exercise",
                "training",
                "trainer",
                "muscle",
                "bodybuilding",
                "weight loss",
                "yoga",
                "sports"
            ],
            audiences: [
                "Fitness enthusiasts",
                "Athletes",
                "Beginners",
                "Health-conscious customers"
            ],
            visuals: [
                "dumbbell",
                "athlete silhouette",
                "fitness equipment",
                "energy streaks",
                "movement lines",
                "strong typography"
            ],
            themes: ["dark", "blue", "promotional"],
            layouts: [
                "promotional-sale",
                "bold-left",
                "split-layout"
            ],
            emotions: [
                "energetic",
                "powerful",
                "motivational",
                "bold"
            ]
        },

        {
            id: "beauty",
            label: "Beauty & Skincare",
            businessType: "Beauty & Personal Care",
            keywords: [
                "beauty",
                "skincare",
                "skin care",
                "cosmetics",
                "makeup",
                "salon",
                "spa",
                "hair",
                "perfume",
                "fragrance",
                "nail polish"
            ],
            audiences: [
                "Beauty customers",
                "Women",
                "Luxury shoppers",
                "Self-care customers"
            ],
            visuals: [
                "beauty product",
                "flowers",
                "soft fabric",
                "water droplets",
                "glowing skin",
                "elegant leaves",
                "cosmetic bottle"
            ],
            themes: ["purple", "minimal", "luxury"],
            layouts: [
                "minimal-editorial",
                "product-spotlight",
                "centered-hero"
            ],
            emotions: [
                "elegant",
                "soft",
                "premium",
                "beautiful"
            ]
        },

        {
            id: "fashion",
            label: "Fashion",
            businessType: "Fashion & Apparel",
            keywords: [
                "fashion",
                "clothing",
                "clothes",
                "dress",
                "shirt",
                "shoes",
                "jewelry",
                "jewellery",
                "watch",
                "bag",
                "handbag",
                "boutique",
                "style"
            ],
            audiences: [
                "Fashion shoppers",
                "Young adults",
                "Trend-conscious customers",
                "Online shoppers"
            ],
            visuals: [
                "fashion model",
                "product spotlight",
                "fabric texture",
                "stylish accessories",
                "editorial shapes",
                "fashion silhouette"
            ],
            themes: ["minimal", "luxury", "purple"],
            layouts: [
                "minimal-editorial",
                "product-spotlight",
                "split-layout"
            ],
            emotions: [
                "stylish",
                "modern",
                "premium",
                "confident"
            ]
        },

        {
            id: "education",
            label: "Education",
            businessType: "Education & Training",
            keywords: [
                "education",
                "school",
                "college",
                "university",
                "course",
                "class",
                "learning",
                "training",
                "teacher",
                "student",
                "tutorial",
                "academy",
                "exam"
            ],
            audiences: [
                "Students",
                "Parents",
                "Professionals",
                "Learners"
            ],
            visuals: [
                "books",
                "graduation cap",
                "laptop",
                "notebook",
                "light bulb",
                "educational icons",
                "learning dashboard"
            ],
            themes: ["blue", "emerald", "minimal"],
            layouts: [
                "centered-hero",
                "bold-left",
                "modern-technology"
            ],
            emotions: [
                "helpful",
                "encouraging",
                "trustworthy",
                "inspiring"
            ]
        },

        {
            id: "travel",
            label: "Travel",
            businessType: "Travel & Tourism",
            keywords: [
                "travel",
                "tour",
                "tourism",
                "vacation",
                "holiday",
                "trip",
                "hotel",
                "resort",
                "flight",
                "adventure",
                "mountain",
                "beach"
            ],
            audiences: [
                "Travelers",
                "Families",
                "Adventure seekers",
                "Holiday customers"
            ],
            visuals: [
                "destination landscape",
                "airplane",
                "mountains",
                "beach",
                "travel bag",
                "map pin",
                "sunrise"
            ],
            themes: ["blue", "emerald", "warm"],
            layouts: [
                "centered-hero",
                "split-layout",
                "product-spotlight"
            ],
            emotions: [
                "adventurous",
                "exciting",
                "refreshing",
                "inspiring"
            ]
        },

        {
            id: "gaming",
            label: "Gaming",
            businessType: "Gaming & Entertainment",
            keywords: [
                "gaming",
                "game",
                "gamer",
                "esports",
                "stream",
                "streamer",
                "playstation",
                "xbox",
                "pc gaming",
                "tournament"
            ],
            audiences: [
                "Gamers",
                "Streaming audiences",
                "Teenagers",
                "Esports fans"
            ],
            visuals: [
                "gaming controller",
                "neon lighting",
                "gaming character silhouette",
                "energy effects",
                "digital particles",
                "futuristic interface"
            ],
            themes: ["dark", "purple", "blue"],
            layouts: [
                "modern-technology",
                "promotional-sale",
                "bold-left"
            ],
            emotions: [
                "exciting",
                "competitive",
                "energetic",
                "futuristic"
            ]
        },

        {
            id: "healthcare",
            label: "Healthcare",
            businessType: "Healthcare & Wellness",
            keywords: [
                "health",
                "healthcare",
                "medical",
                "doctor",
                "clinic",
                "hospital",
                "dentist",
                "pharmacy",
                "wellness",
                "therapy"
            ],
            audiences: [
                "Patients",
                "Families",
                "Health-conscious people",
                "Local communities"
            ],
            visuals: [
                "medical cross",
                "doctor",
                "health shield",
                "heartbeat line",
                "clean clinic environment",
                "wellness leaf"
            ],
            themes: ["blue", "emerald", "minimal"],
            layouts: [
                "minimal-editorial",
                "bold-left",
                "split-layout"
            ],
            emotions: [
                "safe",
                "caring",
                "clean",
                "trustworthy"
            ]
        },

        {
            id: "ecommerce",
            label: "E-commerce",
            businessType: "Retail & E-commerce",
            keywords: [
                "ecommerce",
                "e-commerce",
                "online store",
                "online shop",
                "shop",
                "shopping",
                "product",
                "products",
                "affiliate",
                "daraz",
                "amazon",
                "aliexpress",
                "temu",
                "buy now"
            ],
            audiences: [
                "Online shoppers",
                "Product buyers",
                "Deal seekers",
                "Social media users"
            ],
            visuals: [
                "featured product",
                "shopping bag",
                "shopping cart",
                "discount badge",
                "delivery box",
                "price tag",
                "product glow"
            ],
            themes: ["blue", "purple", "promotional"],
            layouts: [
                "product-spotlight",
                "promotional-sale",
                "split-layout"
            ],
            emotions: [
                "exciting",
                "persuasive",
                "modern",
                "urgent"
            ]
        }
    ];


    /* =====================================================
       3. GOAL KNOWLEDGE BASE
       ===================================================== */

    const GOALS = [
        {
            id: "sale",
            label: "Drive Sales",
            keywords: [
                "sale",
                "sell",
                "sales",
                "discount",
                "offer",
                "deal",
                "buy",
                "shop now",
                "limited time",
                "percentage off",
                "% off"
            ],
            ctaStyle: "Shop Now"
        },

        {
            id: "launch",
            label: "Product or Business Launch",
            keywords: [
                "launch",
                "launching",
                "new product",
                "new business",
                "grand opening",
                "opening",
                "introducing",
                "announcement"
            ],
            ctaStyle: "Discover Now"
        },

        {
            id: "website-traffic",
            label: "Drive Website Visits",
            keywords: [
                "website",
                "visit",
                "traffic",
                "click",
                "explore",
                "learn more",
                "online"
            ],
            ctaStyle: "Explore Now"
        },

        {
            id: "lead-generation",
            label: "Generate Leads",
            keywords: [
                "contact",
                "book now",
                "appointment",
                "consultation",
                "register",
                "sign up",
                "join",
                "subscribe",
                "call now"
            ],
            ctaStyle: "Get Started"
        },

        {
            id: "brand-awareness",
            label: "Build Brand Awareness",
            keywords: [
                "brand",
                "branding",
                "awareness",
                "introduce",
                "company",
                "business",
                "professional presence",
                "promote",
                "promotion",
                "showcase"
            ],
            ctaStyle: "Learn More"
        },

        {
            id: "education",
            label: "Educate or Inform",
            keywords: [
                "teach",
                "learn",
                "education",
                "educate",
                "inform",
                "guide",
                "tutorial",
                "tips",
                "how to"
            ],
            ctaStyle: "Start Learning"
        },

        {
            id: "event",
            label: "Promote an Event",
            keywords: [
                "event",
                "conference",
                "seminar",
                "webinar",
                "workshop",
                "party",
                "festival",
                "meeting",
                "ceremony"
            ],
            ctaStyle: "Register Now"
        }
    ];


    /* =====================================================
       4. TONE KNOWLEDGE BASE
       ===================================================== */

    const TONES = [
        {
            id: "professional",
            label: "Professional",
            keywords: [
                "professional",
                "corporate",
                "business",
                "formal",
                "trustworthy",
                "clean"
            ]
        },

        {
            id: "bold",
            label: "Bold & Powerful",
            keywords: [
                "bold",
                "powerful",
                "strong",
                "impactful",
                "dramatic",
                "attention-grabbing"
            ]
        },

        {
            id: "friendly",
            label: "Friendly",
            keywords: [
                "friendly",
                "welcoming",
                "warm",
                "helpful",
                "approachable",
                "casual"
            ]
        },

        {
            id: "luxury",
            label: "Luxury",
            keywords: [
                "luxury",
                "premium",
                "exclusive",
                "elegant",
                "high-end",
                "expensive",
                "gold"
            ]
        },

        {
            id: "minimal",
            label: "Minimal",
            keywords: [
                "minimal",
                "minimalist",
                "simple",
                "clean",
                "modern",
                "white space"
            ]
        },

        {
            id: "creative",
            label: "Creative",
            keywords: [
                "creative",
                "artistic",
                "unique",
                "colourful",
                "colorful",
                "imaginative"
            ]
        },

        {
            id: "urgent",
            label: "Urgent & Promotional",
            keywords: [
                "urgent",
                "limited time",
                "today only",
                "hurry",
                "last chance",
                "flash sale",
                "ending soon"
            ]
        },

        {
            id: "playful",
            label: "Playful",
            keywords: [
                "playful",
                "fun",
                "cute",
                "kids",
                "children",
                "bright",
                "cheerful"
            ]
        }
    ];


    /* =====================================================
       5. AUDIENCE KNOWLEDGE BASE
       ===================================================== */

    const AUDIENCES = [
        {
            label: "Students",
            keywords: [
                "student",
                "students",
                "school",
                "college",
                "university",
                "learner",
                "learners"
            ]
        },

        {
            label: "Professionals",
            keywords: [
                "professional",
                "professionals",
                "employee",
                "employees",
                "office",
                "business users"
            ]
        },

        {
            label: "Business Owners",
            keywords: [
                "business owner",
                "business owners",
                "entrepreneur",
                "entrepreneurs",
                "startup",
                "startups"
            ]
        },

        {
            label: "Parents & Families",
            keywords: [
                "parent",
                "parents",
                "family",
                "families",
                "children",
                "kids"
            ]
        },

        {
            label: "Women",
            keywords: [
                "women",
                "woman",
                "female",
                "ladies",
                "girls"
            ]
        },

        {
            label: "Men",
            keywords: [
                "men",
                "man",
                "male",
                "gentlemen",
                "boys"
            ]
        },

        {
            label: "Young Adults",
            keywords: [
                "young adults",
                "youth",
                "teenagers",
                "teens",
                "gen z"
            ]
        },

        {
            label: "Local Customers",
            keywords: [
                "local",
                "nearby",
                "community",
                "neighborhood",
                "neighbourhood"
            ]
        },

        {
            label: "Online Shoppers",
            keywords: [
                "shoppers",
                "buyers",
                "customers",
                "online shoppers",
                "product buyers"
            ]
        }
    ];


    /* =====================================================
       6. PLATFORM RECOGNITION
       ===================================================== */

    const PLATFORMS = [
        {
            id: "facebook",
            label: "Facebook Post",
            keywords: ["facebook", "fb post", "facebook post"]
        },

        {
            id: "linkedin",
            label: "LinkedIn Post",
            keywords: ["linkedin", "linkedin post"]
        },

        {
            id: "instagram",
            label: "Instagram Portrait",
            keywords: [
                "instagram",
                "instagram post",
                "insta",
                "ig post"
            ]
        },

        {
            id: "pinterest",
            label: "Pinterest Pin",
            keywords: ["pinterest", "pin", "pinterest pin"]
        },

        {
            id: "xpost",
            label: "X Post",
            keywords: [
                "twitter",
                "x post",
                "twitter post"
            ]
        },

        {
            id: "medium",
            label: "Medium Cover",
            keywords: [
                "medium",
                "medium cover",
                "blog cover"
            ]
        },

        {
            id: "youtube",
            label: "YouTube Thumbnail",
            keywords: [
                "youtube",
                "youtube thumbnail",
                "thumbnail",
                "video thumbnail"
            ]
        }
    ];


    /* =====================================================
       7. MAIN ANALYSIS FUNCTION
       ===================================================== */

    function analyzeIdea(input = {}) {
        const rawPrompt =
            typeof input === "string"
                ? input
                : input.prompt;

        const validation =
            window.ToolXoneAI.validatePrompt(rawPrompt);

        if (!validation.valid) {
            throw new window.ToolXoneAI.ToolXoneAIError(
                validation.error,
                "INVALID_PROMPT"
            );
        }

        const prompt = validation.prompt;
        const normalizedPrompt = normalizeForMatching(prompt);

        const requestedPlatform =
            typeof input === "object"
                ? cleanString(input.platform)
                : "";

        const requestedTone =
            typeof input === "object"
                ? cleanString(input.tone)
                : "";

        const requestedLanguage =
            typeof input === "object"
                ? cleanString(input.language, "english")
                : "english";

        const industryMatch =
            detectBestIndustry(normalizedPrompt);

        const goalMatch =
            detectBestGoal(normalizedPrompt);

        const toneMatch =
            detectTone(
                normalizedPrompt,
                requestedTone,
                industryMatch,
                goalMatch
            );

        const audience =
            detectAudience(
                normalizedPrompt,
                industryMatch
            );

        const platform =
            detectPlatform(
                normalizedPrompt,
                requestedPlatform
            );

        const importantKeywords =
            extractImportantKeywords(
                prompt,
                industryMatch
            );

        const visualElements =
            selectVisualElements(
                normalizedPrompt,
                industryMatch
            );

        const recommendedTheme =
            chooseTheme(
                normalizedPrompt,
                industryMatch,
                toneMatch,
                goalMatch
            );

        const recommendedLayout =
            chooseLayout(
                platform.id,
                industryMatch,
                toneMatch,
                goalMatch
            );

        const creativeBrief = {
            id: createId("brief"),

            originalPrompt: prompt,

            industry: {
                id: industryMatch.id,
                label: industryMatch.label,
                confidence: industryMatch.confidence
            },

            businessType:
                industryMatch.businessType,

            audience,

            goal: {
                id: goalMatch.id,
                label: goalMatch.label,
                confidence: goalMatch.confidence
            },

            platform,

            tone: {
                id: toneMatch.id,
                label: toneMatch.label,
                confidence: toneMatch.confidence
            },

            language:
                requestedLanguage || "english",

            emotions:
                chooseEmotions(
                    industryMatch,
                    toneMatch
                ),

            keywords:
                importantKeywords,

            visualElements,

            recommendedTheme,

            recommendedLayout,

            suggestedCallToAction:
                goalMatch.ctaStyle,

            backgroundDirection:
                createBackgroundDirection(
                    industryMatch,
                    toneMatch,
                    visualElements
                ),

            designGuidance:
                createDesignGuidance(
                    industryMatch,
                    toneMatch,
                    goalMatch,
                    platform,
                    recommendedTheme,
                    recommendedLayout,
                    visualElements
                ),

            missingInformation:
                findMissingInformation(
                    normalizedPrompt,
                    industryMatch,
                    goalMatch
                ),

            createdAt:
                new Date().toISOString()
        };

        window.ToolXoneAI.emit(
            "prompt:analyzed",
            {
                brief: creativeBrief
            }
        );

        return clone(creativeBrief);
    }


    /* =====================================================
       8. INDUSTRY DETECTION
       ===================================================== */

    function detectBestIndustry(prompt) {
        let bestMatch = null;
        let bestScore = 0;

        INDUSTRIES.forEach(industry => {
            const score =
                scoreKeywordCollection(
                    prompt,
                    industry.keywords
                );

            if (score > bestScore) {
                bestScore = score;
                bestMatch = industry;
            }
        });

        if (!bestMatch) {
            return createGeneralIndustry();
        }

        return {
            ...clone(bestMatch),
            confidence:
                calculateConfidence(
                    bestScore,
                    bestMatch.keywords.length
                )
        };
    }

    function createGeneralIndustry() {
        return {
            id: "general",
            label: "General Business",
            businessType: "General",
            audiences: ["General Audience"],
            visuals: [
                "abstract shapes",
                "brand-related icon",
                "clean background",
                "modern decorative elements"
            ],
            themes: [
                "emerald",
                "blue",
                "minimal"
            ],
            layouts: [
                "bold-left",
                "centered-hero",
                "minimal-editorial"
            ],
            emotions: [
                "professional",
                "clear",
                "modern"
            ],
            confidence: 0.25
        };
    }


    /* =====================================================
       9. GOAL DETECTION
       ===================================================== */

    function detectBestGoal(prompt) {
        let bestMatch = null;
        let bestScore = 0;

        GOALS.forEach(goal => {
            const score =
                scoreKeywordCollection(
                    prompt,
                    goal.keywords
                );

            if (score > bestScore) {
                bestScore = score;
                bestMatch = goal;
            }
        });

        if (!bestMatch) {
            return {
                id: "brand-awareness",
                label: "Build Brand Awareness",
                ctaStyle: "Learn More",
                confidence: 0.35
            };
        }

        return {
            ...clone(bestMatch),
            confidence:
                calculateConfidence(
                    bestScore,
                    bestMatch.keywords.length
                )
        };
    }


    /* =====================================================
       10. TONE DETECTION
       ===================================================== */

    function detectTone(
        prompt,
        requestedTone,
        industry,
        goal
    ) {
        if (
            requestedTone &&
            requestedTone !== "automatic"
        ) {
            const selected =
                TONES.find(
                    tone => tone.id === requestedTone
                );

            if (selected) {
                return {
                    ...clone(selected),
                    confidence: 1
                };
            }
        }

        let bestMatch = null;
        let bestScore = 0;

        TONES.forEach(tone => {
            const score =
                scoreKeywordCollection(
                    prompt,
                    tone.keywords
                );

            if (score > bestScore) {
                bestScore = score;
                bestMatch = tone;
            }
        });

        if (bestMatch) {
            return {
                ...clone(bestMatch),
                confidence:
                    calculateConfidence(
                        bestScore,
                        bestMatch.keywords.length
                    )
            };
        }

        if (goal.id === "sale") {
            return {
                id: "urgent",
                label: "Urgent & Promotional",
                confidence: 0.7
            };
        }

        if (
            industry.id === "beauty" ||
            industry.id === "fashion" ||
            industry.id === "real-estate"
        ) {
            return {
                id: "luxury",
                label: "Luxury",
                confidence: 0.6
            };
        }

        if (
            industry.id === "coffee-shop" ||
            industry.id === "bakery"
        ) {
            return {
                id: "friendly",
                label: "Friendly",
                confidence: 0.65
            };
        }

        if (
            industry.id === "gaming" ||
            industry.id === "fitness"
        ) {
            return {
                id: "bold",
                label: "Bold & Powerful",
                confidence: 0.65
            };
        }

        return {
            id: "professional",
            label: "Professional",
            confidence: 0.5
        };
    }


    /* =====================================================
       11. AUDIENCE DETECTION
       ===================================================== */

    function detectAudience(prompt, industry) {
        const detected = [];

        AUDIENCES.forEach(audience => {
            const score =
                scoreKeywordCollection(
                    prompt,
                    audience.keywords
                );

            if (score > 0) {
                detected.push({
                    label: audience.label,
                    score
                });
            }
        });

        detected.sort(
            (a, b) => b.score - a.score
        );

        if (detected.length) {
            return detected
                .slice(0, 3)
                .map(item => item.label);
        }

        return clone(
            industry.audiences || ["General Audience"]
        ).slice(0, 3);
    }


    /* =====================================================
       12. PLATFORM DETECTION
       ===================================================== */

    function detectPlatform(
        prompt,
        requestedPlatform
    ) {
        if (requestedPlatform) {
            const selected =
                PLATFORMS.find(
                    platform =>
                        platform.id === requestedPlatform
                );

            if (selected) {
                return {
                    id: selected.id,
                    label: selected.label,
                    confidence: 1
                };
            }
        }

        let bestMatch = null;
        let bestScore = 0;

        PLATFORMS.forEach(platform => {
            const score =
                scoreKeywordCollection(
                    prompt,
                    platform.keywords
                );

            if (score > bestScore) {
                bestScore = score;
                bestMatch = platform;
            }
        });

        if (!bestMatch) {
            return {
                id: "facebook",
                label: "Facebook Post",
                confidence: 0.35
            };
        }

        return {
            id: bestMatch.id,
            label: bestMatch.label,
            confidence:
                calculateConfidence(
                    bestScore,
                    bestMatch.keywords.length
                )
        };
    }


    /* =====================================================
       13. KEYWORD EXTRACTION
       ===================================================== */

    function extractImportantKeywords(
        prompt,
        industry
    ) {
        const stopWords = new Set([
            "a",
            "an",
            "and",
            "are",
            "as",
            "at",
            "be",
            "because",
            "banner",
            "by",
            "create",
            "design",
            "for",
            "from",
            "i",
            "in",
            "include",
            "is",
            "it",
            "make",
            "my",
            "of",
            "on",
            "or",
            "please",
            "that",
            "the",
            "this",
            "to",
            "use",
            "want",
            "with"
        ]);

        const words =
            prompt
                .toLowerCase()
                .replace(/[^\p{L}\p{N}\s-]/gu, " ")
                .split(/\s+/)
                .map(word => word.trim())
                .filter(Boolean)
                .filter(word => !stopWords.has(word))
                .filter(word => word.length > 2);

        const frequency = new Map();

        words.forEach(word => {
            frequency.set(
                word,
                (frequency.get(word) || 0) + 1
            );
        });

        const industryKeywords =
            Array.isArray(industry.keywords)
                ? industry.keywords
                : [];

        industryKeywords.forEach(keyword => {
            if (
                normalizeForMatching(prompt)
                    .includes(
                        normalizeForMatching(keyword)
                    )
            ) {
                frequency.set(
                    keyword,
                    (frequency.get(keyword) || 0) + 3
                );
            }
        });

        return [...frequency.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0])
            .filter(uniqueOnly)
            .slice(0, 12);
    }


    /* =====================================================
       14. VISUAL ELEMENT SELECTION
       ===================================================== */

    function selectVisualElements(
        prompt,
        industry
    ) {
        const visuals =
            clone(industry.visuals || []);

        const customVisualPatterns = [
            {
                keywords: ["wifi", "wi-fi"],
                visual: "WiFi symbol"
            },

            {
                keywords: ["delivery"],
                visual: "delivery vehicle"
            },

            {
                keywords: ["discount", "sale", "offer"],
                visual: "discount badge"
            },

            {
                keywords: ["mobile", "phone", "smartphone"],
                visual: "smartphone"
            },

            {
                keywords: ["laptop", "computer"],
                visual: "laptop"
            },

            {
                keywords: ["free"],
                visual: "free offer badge"
            },

            {
                keywords: ["opening", "grand opening"],
                visual: "grand opening ribbon"
            },

            {
                keywords: ["location", "visit"],
                visual: "location pin"
            },

            {
                keywords: ["website", "online"],
                visual: "web interface"
            },

            {
                keywords: ["gift"],
                visual: "gift box"
            }
        ];

        customVisualPatterns.forEach(pattern => {
            if (
                pattern.keywords.some(keyword =>
                    prompt.includes(keyword)
                )
            ) {
                visuals.unshift(pattern.visual);
            }
        });

        return visuals
            .filter(uniqueOnly)
            .slice(0, 8);
    }


    /* =====================================================
       15. THEME SELECTION
       ===================================================== */

    function chooseTheme(
        prompt,
        industry,
        tone,
        goal
    ) {
        if (
            tone.id === "luxury"
        ) {
            return {
                id:
                    industry.id === "beauty"
                        ? "purple"
                        : "luxury",

                label:
                    industry.id === "beauty"
                        ? "Elegant Purple"
                        : "Luxury Dark",

                reason:
                    "The requested premium tone is best supported by an elegant, high-contrast palette."
            };
        }

        if (
            tone.id === "minimal"
        ) {
            return {
                id: "minimal",
                label: "Clean Minimal",
                reason:
                    "A minimal palette keeps the message clear and gives the design generous visual space."
            };
        }

        if (
            tone.id === "playful"
        ) {
            return {
                id: "purple",
                label: "Playful Creative",
                reason:
                    "Bright creative colors support an energetic and friendly visual style."
            };
        }

        if (
            industry.id === "coffee-shop" ||
            industry.id === "restaurant" ||
            industry.id === "bakery"
        ) {
            return {
                id: "warm",
                label: "Warm & Welcoming",
                reason:
                    "Warm tones naturally complement food, coffee and hospitality-related visuals."
            };
        }

        if (
            industry.id === "technology" ||
            industry.id === "education" ||
            industry.id === "healthcare"
        ) {
            return {
                id: "blue",
                label: "Technology Blue",
                reason:
                    "Blue communicates trust, clarity and modern technology."
            };
        }

        if (
            industry.id === "finance"
        ) {
            return {
                id: "emerald",
                label: "Financial Emerald",
                reason:
                    "Emerald tones support ideas of growth, money and financial confidence."
            };
        }

        if (
            industry.id === "gaming" ||
            industry.id === "fitness"
        ) {
            return {
                id: "dark",
                label: "High-Energy Dark",
                reason:
                    "A dark high-contrast theme strengthens bold and energetic content."
            };
        }

        if (
            goal.id === "sale"
        ) {
            return {
                id: "purple",
                label: "Promotional Contrast",
                reason:
                    "A vibrant contrasting palette helps promotional messages attract attention."
            };
        }

        if (prompt.includes("green")) {
            return {
                id: "emerald",
                label: "Emerald",
                reason:
                    "The user specifically requested a green visual direction."
            };
        }

        if (prompt.includes("blue")) {
            return {
                id: "blue",
                label: "Blue",
                reason:
                    "The user specifically requested a blue visual direction."
            };
        }

        if (
            prompt.includes("purple") ||
            prompt.includes("violet")
        ) {
            return {
                id: "purple",
                label: "Purple",
                reason:
                    "The user specifically requested a purple visual direction."
            };
        }

        return {
            id:
                industry.themes?.[0] || "emerald",

            label:
                capitalizeWords(
                    industry.themes?.[0] || "emerald"
                ),

            reason:
                "This palette best matches the detected industry and desired emotional direction."
        };
    }


    /* =====================================================
       16. LAYOUT SELECTION
       ===================================================== */

    function chooseLayout(
        platform,
        industry,
        tone,
        goal
    ) {
        if (
            goal.id === "sale" ||
            tone.id === "urgent"
        ) {
            return {
                id: "promotional-sale",
                label: "Promotional Sale",
                reason:
                    "A promotional composition gives offers, pricing and calls to action stronger visual priority."
            };
        }

        if (
            industry.id === "technology" ||
            industry.id === "gaming"
        ) {
            return {
                id: "modern-technology",
                label: "Modern Technology",
                reason:
                    "A technology-focused composition supports digital elements, interface visuals and modern typography."
            };
        }

        if (
            industry.id === "ecommerce" ||
            industry.id === "beauty" ||
            industry.id === "fashion"
        ) {
            return {
                id: "product-spotlight",
                label: "Product Spotlight",
                reason:
                    "This layout gives the featured product strong visual attention while preserving space for marketing copy."
            };
        }

        if (
            tone.id === "minimal" ||
            tone.id === "luxury"
        ) {
            return {
                id: "minimal-editorial",
                label: "Minimal Editorial",
                reason:
                    "An editorial composition supports clean spacing and a premium presentation."
            };
        }

        if (
            platform === "instagram" ||
            platform === "pinterest"
        ) {
            return {
                id: "centered-hero",
                label: "Centered Hero",
                reason:
                    "A centered vertical composition works effectively for portrait social media formats."
            };
        }

        if (
            industry.id === "real-estate" ||
            industry.id === "travel"
        ) {
            return {
                id: "split-layout",
                label: "Split Layout",
                reason:
                    "A split composition balances large visual imagery with clear promotional information."
            };
        }

        return {
            id:
                industry.layouts?.[0] ||
                "bold-left",

            label:
                formatIdentifier(
                    industry.layouts?.[0] ||
                    "bold-left"
                ),

            reason:
                "This composition offers a strong balance between headline, supporting copy and visual elements."
        };
    }


    /* =====================================================
       17. EMOTIONS
       ===================================================== */

    function chooseEmotions(industry, tone) {
        const emotions = [
            ...(industry.emotions || [])
        ];

        const toneEmotionMap = {
            professional: [
                "trustworthy",
                "clear",
                "confident"
            ],

            bold: [
                "powerful",
                "energetic",
                "strong"
            ],

            friendly: [
                "welcoming",
                "warm",
                "approachable"
            ],

            luxury: [
                "premium",
                "elegant",
                "exclusive"
            ],

            minimal: [
                "clean",
                "calm",
                "modern"
            ],

            creative: [
                "imaginative",
                "expressive",
                "original"
            ],

            urgent: [
                "exciting",
                "immediate",
                "persuasive"
            ],

            playful: [
                "fun",
                "cheerful",
                "bright"
            ]
        };

        emotions.push(
            ...(toneEmotionMap[tone.id] || [])
        );

        return emotions
            .filter(uniqueOnly)
            .slice(0, 6);
    }


    /* =====================================================
       18. BACKGROUND DIRECTION
       ===================================================== */

    function createBackgroundDirection(
        industry,
        tone,
        visualElements
    ) {
        const primaryVisual =
            visualElements[0] ||
            "relevant industry visual";

        const secondaryVisual =
            visualElements[1] ||
            "subtle decorative elements";

        return [
            `Create a ${tone.label.toLowerCase()} visual direction`,
            `for the ${industry.label.toLowerCase()} industry`,
            `featuring ${primaryVisual}`,
            `with ${secondaryVisual}`,
            "professional lighting",
            "clear negative space for marketing text",
            "social-media-ready composition"
        ].join(", ");
    }


    /* =====================================================
       19. DESIGN GUIDANCE
       ===================================================== */

    function createDesignGuidance(
        industry,
        tone,
        goal,
        platform,
        theme,
        layout,
        visualElements
    ) {
        const guidance = [];

        guidance.push(
            `Use the ${theme.label} theme because it matches the ${industry.label.toLowerCase()} context.`
        );

        guidance.push(
            `Use the ${layout.label} layout to balance the message and visual elements for ${platform.label}.`
        );

        guidance.push(
            `Keep the overall tone ${tone.label.toLowerCase()} and focus the message on ${goal.label.toLowerCase()}.`
        );

        if (visualElements.length) {
            guidance.push(
                `Include context-aware visuals such as ${visualElements
                    .slice(0, 3)
                    .join(", ")}.`
            );
        }

        guidance.push(
            "Keep the headline readable at mobile size and preserve safe margins around important content."
        );

        return guidance;
    }


    /* =====================================================
       20. MISSING INFORMATION
       ===================================================== */

    function findMissingInformation(
        prompt,
        industry,
        goal
    ) {
        const missing = [];

        const hasBrandName =
            /called\s+["']?[\p{L}\p{N}\s&.-]{2,}/iu.test(
                prompt
            ) ||
            /brand\s+(?:name\s+)?(?:is|called)\s+/i.test(
                prompt
            );

        const hasAudience =
            AUDIENCES.some(audience =>
                audience.keywords.some(keyword =>
                    prompt.includes(keyword)
                )
            );

        const hasOffer =
            GOALS[0].keywords.some(keyword =>
                prompt.includes(keyword)
            );

        if (
            industry.id === "general"
        ) {
            missing.push(
                "The business or industry is not completely clear."
            );
        }

        if (!hasBrandName) {
            missing.push(
                "No clear brand or business name was detected."
            );
        }

        if (!hasAudience) {
            missing.push(
                "The target audience was inferred from the industry."
            );
        }

        if (
            goal.id === "sale" &&
            !hasOffer
        ) {
            missing.push(
                "The exact promotional offer was not specified."
            );
        }

        return missing;
    }


    /* =====================================================
       21. SCORING HELPERS
       ===================================================== */

    function scoreKeywordCollection(
        prompt,
        keywords
    ) {
        if (!Array.isArray(keywords)) {
            return 0;
        }

        let score = 0;

        keywords.forEach(keyword => {
            const normalizedKeyword =
                normalizeForMatching(keyword);

            if (!normalizedKeyword) {
                return;
            }

            if (prompt.includes(normalizedKeyword)) {
                const wordCount =
                    normalizedKeyword.split(/\s+/).length;

                score += wordCount > 1 ? 4 : 2;
            }
        });

        return score;
    }

    function calculateConfidence(
        score,
        keywordCount
    ) {
        if (!score) {
            return 0.2;
        }

        const divisor =
            Math.max(4, Math.min(keywordCount, 12));

        return Math.min(
            0.98,
            Number(
                (
                    0.45 +
                    score / (divisor * 3)
                ).toFixed(2)
            )
        );
    }


    /* =====================================================
       22. GENERAL HELPERS
       ===================================================== */

    function normalizeForMatching(value) {
        if (typeof value !== "string") {
            return "";
        }

        return value
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\p{L}\p{N}%\s-]/gu, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function cleanString(value, fallback = "") {
        if (typeof value !== "string") {
            return fallback;
        }

        const cleaned = value.trim();

        return cleaned || fallback;
    }

    function uniqueOnly(
        value,
        index,
        collection
    ) {
        return collection.indexOf(value) === index;
    }

    function capitalizeWords(value) {
        return String(value)
            .split(/[\s-]+/)
            .filter(Boolean)
            .map(word =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
            )
            .join(" ");
    }

    function formatIdentifier(value) {
        return capitalizeWords(value);
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
       23. PUBLIC API
       ===================================================== */

    window.ToolXonePromptEngine = Object.freeze({
        analyzeIdea,

        getIndustries() {
            return clone(INDUSTRIES);
        },

        getGoals() {
            return clone(GOALS);
        },

        getTones() {
            return clone(TONES);
        },

        getPlatforms() {
            return clone(PLATFORMS);
        }
    });


    /* =====================================================
       24. READY EVENT
       ===================================================== */

    window.ToolXoneAI.emit(
        "prompt-engine:ready",
        {
            industries: INDUSTRIES.length,
            goals: GOALS.length,
            tones: TONES.length,
            platforms: PLATFORMS.length
        }
    );

})();