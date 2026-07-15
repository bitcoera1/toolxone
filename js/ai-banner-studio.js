/* =========================================================
   TOOLXONE — PHOENIX AI DESIGN STUDIO CONTROLLER
   File: js/ai-banner-studio.js

   Responsibility:
   Connect the Phoenix AI Creative Engine to the Phoenix AI Design Studio workspace, generating intelligent social media and marketing graphics from natural language prompts.

   Workflow:
   User idea
       ↓
   Prompt Engine
       ↓
   Design Engine
       ↓
   Asset Engine
       ↓
   Local Copy Generator
       ↓
   Preview Engine
       ↓
   Manual refinement
       ↓
   PNG / JPG / WebP download
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";


    /* =====================================================
       1. REQUIRED ENGINE CHECK
       ===================================================== */

    const requiredEngines = [
        "ToolXoneAI",
        "ToolXonePromptEngine",
        "ToolXoneDesignEngine",
        "ToolXoneAssetEngine",
        "ToolXonePreviewEngine"
    ];

    const missingEngines = requiredEngines.filter(
        engineName => !window[engineName]
    );

    if (missingEngines.length) {
        console.error(
            "[ToolXone AI] Missing engines:",
            missingEngines
        );

        return;
    }


    /* =====================================================
       2. ELEMENT REFERENCES
       ===================================================== */

    const bannerPromptInput =
        document.getElementById("bannerPromptInput");

    const promptCount =
        document.getElementById("promptCount");

    const platformSelect =
        document.getElementById("platformSelect");

    const toneSelect =
        document.getElementById("toneSelect");

    const languageSelect =
        document.getElementById("languageSelect");

    const clearPromptButton =
        document.getElementById("clearPromptButton");

    const generateAiBannerButton =
        document.getElementById("generateAiBannerButton");
    
    const generatedDesignSection =
    document.getElementById("generatedDesignSection");

    const toggleFineTuneButton =
    document.getElementById("toggleFineTuneButton");

    const fineTunePanel =
    document.getElementById("fineTunePanel");

     
    const generateButtonText =
        generateAiBannerButton?.querySelector(
            ".generate-button-text"
        );

    const generatedResultPanel =
        document.getElementById("generatedResultPanel");

    const regenerateBannerButton =
        document.getElementById("regenerateBannerButton");

    const generatedHeadlineSummary =
        document.getElementById("generatedHeadlineSummary");

    const generatedThemeSummary =
        document.getElementById("generatedThemeSummary");

    const generatedLayoutSummary =
        document.getElementById("generatedLayoutSummary");

    const generatedToneSummary =
        document.getElementById("generatedToneSummary");

    const kickerInput =
        document.getElementById("kickerInput");

    const headlineInput =
        document.getElementById("headlineInput");

    const subtitleInput =
        document.getElementById("subtitleInput");

    const websiteInput =
        document.getElementById("websiteInput");

    const ctaInput =
        document.getElementById("ctaInput");

    const brandNameInput =
        document.getElementById("brandNameInput");

    const layoutSelect =
        document.getElementById("layoutSelect");

    const themeButtons =
        [...document.querySelectorAll(".theme-button")];

    const kickerCount =
        document.getElementById("kickerCount");

    const headlineCount =
        document.getElementById("headlineCount");

    const subtitleCount =
        document.getElementById("subtitleCount");

    const logoInput =
        document.getElementById("logoInput");

    const removeLogoButton =
        document.getElementById("removeLogoButton");

    const resetBannerButton =
        document.getElementById("resetBannerButton");

    const applyChangesButton =
        document.getElementById("applyChangesButton");

    const bannerCanvas =
        document.getElementById("bannerCanvas");

    const logoPreviewWrapper =
        document.getElementById("logoPreviewWrapper");

    const uploadedLogoPreview =
        document.getElementById("uploadedLogoPreview");

    const downloadButtons =
        [...document.querySelectorAll(".download-button")];

    const aiGenerationStatus =
        document.getElementById("aiGenerationStatus");

        /* =====================================================
   PHOENIX WORKSPACE CONTROLS
===================================================== */

function showGeneratedDesign() {
    if (!generatedDesignSection) {
        return;
    }

    generatedDesignSection.hidden = false;
    generatedDesignSection.classList.add("is-visible");

    window.setTimeout(() => {
        generatedDesignSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 180);
}


function closeFineTunePanel() {
    if (fineTunePanel) {
        fineTunePanel.hidden = true;
    }

    if (toggleFineTuneButton) {
        toggleFineTuneButton.setAttribute(
            "aria-expanded",
            "false"
        );

        toggleFineTuneButton.classList.remove(
            "is-open"
        );
    }
}


function toggleFineTunePanel() {
    if (!toggleFineTuneButton || !fineTunePanel) {
        return;
    }

    const isOpening = fineTunePanel.hidden;

    fineTunePanel.hidden = !isOpening;

    toggleFineTuneButton.setAttribute(
        "aria-expanded",
        String(isOpening)
    );

    toggleFineTuneButton.classList.toggle(
        "is-open",
        isOpening
    );

    if (isOpening) {
        window.setTimeout(() => {
            fineTunePanel.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 120);
    }
}

        /* =====================================================
   PHOENIX WORKSPACE CONTROLS
===================================================== */

function showGeneratedDesign() {
    if (!generatedDesignSection) return;

    generatedDesignSection.hidden = false;
    generatedDesignSection.classList.add("is-visible");

    setTimeout(() => {
        generatedDesignSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 180);
}

function toggleFineTunePanel() {

    if (!toggleFineTuneButton || !fineTunePanel) return;

    const isOpening = fineTunePanel.hidden;

    fineTunePanel.hidden = !isOpening;

    toggleFineTuneButton.setAttribute(
        "aria-expanded",
        String(isOpening)
    );

    toggleFineTuneButton.classList.toggle(
        "is-open",
        isOpening
    );

    if (isOpening) {

        setTimeout(() => {

            fineTunePanel.scrollIntoView({
                behavior: "smooth",
                block: "start"

            });

        }, 120);

    }

}

    /* =====================================================
       3. REQUIRED ELEMENT CHECK
       ===================================================== */

    const requiredElements = {
        bannerPromptInput,
        platformSelect,
        toneSelect,
        languageSelect,
        generateAiBannerButton,
        kickerInput,
        headlineInput,
        subtitleInput,
        websiteInput,
        ctaInput,
        brandNameInput,
        layoutSelect,
        bannerCanvas
    };

    const missingElements = Object.entries(requiredElements)
        .filter(([, element]) => !element)
        .map(([name]) => name);

    if (missingElements.length) {
        console.error(
            "[ToolXone AI] Missing interface elements:",
            missingElements
        );

        return;
    }


    /* =====================================================
       4. PLATFORM SETTINGS
       ===================================================== */

    const platformSettings = Object.freeze({
        facebook: {
            label: "Facebook Post",
            width: 1200,
            height: 630
        },

        linkedin: {
            label: "LinkedIn Post",
            width: 1200,
            height: 627
        },

        instagram: {
            label: "Instagram Portrait",
            width: 1080,
            height: 1350
        },

        pinterest: {
            label: "Pinterest Pin",
            width: 1000,
            height: 1500
        },

        xpost: {
            label: "X Post",
            width: 1600,
            height: 900
        },

        medium: {
            label: "Medium Cover",
            width: 1600,
            height: 900
        },

        youtube: {
            label: "YouTube Thumbnail",
            width: 1280,
            height: 720
        }
    });


    /* =====================================================
       5. DEFAULT STATE
       ===================================================== */

    const defaultValues = Object.freeze({
        platform: "facebook",
        tone: "automatic",
        language: "english",
        theme: "emerald",
        layout: "bold-left",
        kicker: "Phoenix AI",
        headline: "CREATE MORE. STRESS LESS.",
        subtitle:
            "Professional social media graphics in the correct size—without complicated editing.",
        website: "www.toolxone.com",
        cta: "Explore Now",
        brandName: "ToolXone"
    });

    const state = {
        isGenerating: false,
        hasGeneratedResult: false,

        currentBrief: null,
        currentDesign: null,
        currentAssets: null,
        currentContent: null,

        currentTheme: defaultValues.theme,
        currentLayout: defaultValues.layout,

        currentLogoUrl: null
    };


    /* =====================================================
       6. INITIALIZE SHARED ENGINES
       ===================================================== */

    ToolXoneAI.initialize({
        studioName: "Phoenix AI Design Studio",
        platform: defaultValues.platform,
        tone: defaultValues.tone,
        language: defaultValues.language,
        maximumPromptLength: 700
    });

    /*
ToolXonePreviewEngine.initialize({
    root: bannerCanvas
});
*/


    /* =====================================================
       7. GENERAL TEXT HELPERS
       ===================================================== */

    function cleanText(value, fallback = "") {
        if (typeof value !== "string") {
            return fallback;
        }

        const cleaned = value.trim();

        return cleaned || fallback;
    }

    function titleCase(value) {
        return String(value || "")
            .split(/[\s-_]+/)
            .filter(Boolean)
            .map(word =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
            )
            .join(" ");
    }

    function sentenceCase(value) {
        const cleaned = cleanText(value);

        if (!cleaned) {
            return "";
        }

        return (
            cleaned.charAt(0).toUpperCase() +
            cleaned.slice(1)
        );
    }

    function limitText(value, maximumLength) {
        const cleaned = cleanText(value);

        if (cleaned.length <= maximumLength) {
            return cleaned;
        }

        return (
            cleaned
                .slice(0, maximumLength - 1)
                .trimEnd() +
            "…"
        );
    }

    function escapeRegExp(value) {
        return String(value)
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }


    /* =====================================================
       8. CHARACTER COUNTERS
       ===================================================== */

    function updateCharacterCounters() {
        if (promptCount) {
            promptCount.textContent =
                String(bannerPromptInput.value.length);
        }

        if (kickerCount) {
            kickerCount.textContent =
                String(kickerInput.value.length);
        }

        if (headlineCount) {
            headlineCount.textContent =
                String(headlineInput.value.length);
        }

        if (subtitleCount) {
            subtitleCount.textContent =
                String(subtitleInput.value.length);
        }
    }


    /* =====================================================
       9. BRAND AND WEBSITE EXTRACTION
       ===================================================== */

    function detectBrandName(prompt, brief) {
        const patterns = [
            /\bcalled\s+["“']?([^,.;\n]{2,40})/i,
            /\bnamed\s+["“']?([^,.;\n]{2,40})/i,
            /\bbrand(?:\s+name)?\s+(?:is|called)\s+["“']?([^,.;\n]{2,40})/i,
            /\bbusiness\s+(?:is|called)\s+["“']?([^,.;\n]{2,40})/i,
            /\bcompany\s+(?:is|called)\s+["“']?([^,.;\n]{2,40})/i,
            /\bshop\s+(?:is|called)\s+["“']?([^,.;\n]{2,40})/i
        ];

        for (const pattern of patterns) {
            const match = prompt.match(pattern);

            if (match?.[1]) {
                return cleanDetectedBrand(match[1], brief);
            }
        }

        return defaultValues.brandName;
    }

    function cleanDetectedBrand(value, brief) {
        let brand = cleanText(value);

        const stopPhrases = [
            "promote",
            "promoting",
            "use",
            "with",
            "for",
            "offering",
            "that",
            "and advertise",
            "and promote"
        ];

        stopPhrases.forEach(phrase => {
            const pattern = new RegExp(
                `\\s+${escapeRegExp(phrase)}\\b.*$`,
                "i"
            );

            brand = brand.replace(pattern, "");
        });

        const industryLabel =
            brief?.industry?.label || "";

        if (
            industryLabel &&
            brand.toLowerCase() ===
                industryLabel.toLowerCase()
        ) {
            return titleCase(brand);
        }

        return limitText(
            brand.replace(/["”']+$/g, "").trim(),
            40
        );
    }

    function detectWebsite(prompt, brandName) {
        const websiteMatch = prompt.match(
            /\b(?:https?:\/\/)?(?:www\.)?[a-z0-9][a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?/i
        );

        if (websiteMatch?.[0]) {
            return websiteMatch[0]
                .replace(/^https?:\/\//i, "")
                .replace(/\/$/, "");
        }

        if (
            brandName &&
            brandName !== defaultValues.brandName
        ) {
            const domainName = brandName
                .toLowerCase()
                .replace(/&/g, "and")
                .replace(/[^a-z0-9]+/g, "")
                .slice(0, 28);

            if (domainName) {
                return `www.${domainName}.com`;
            }
        }

        return defaultValues.website;
    }


    /* =====================================================
       10. LOCAL AI COPY GENERATOR
       ===================================================== */

    function createGeneratedContent(brief) {
    const prompt =
        brief.originalPrompt || "";

    const brandName =
        detectBrandName(prompt, brief);

    const website =
        detectWebsite(prompt, brandName);

    const detectedIndustryId =
    brief.industry?.id || "general";

const normalizedPrompt =
    prompt.toLowerCase();

const industryId =
    normalizedPrompt.includes("qr generator") ||
    normalizedPrompt.includes("qr code generator") ||
    normalizedPrompt.includes("generate qr") ||
    normalizedPrompt.includes("qr tool")
        ? "qr-generator"
        : detectedIndustryId;

    const goalId =
        brief.goal?.id || "brand-awareness";

    const toneId =
        brief.tone?.id || "professional";

    const language =
        brief.language || "english";

    const content =
        generateEnglishContent({
            brief,
            brandName,
            website,
            industryId,
            goalId,
            toneId
        });

    console.log(
        "[Phoenix AI] Generated content:",
        content
    );

    if (language !== "english") {
        content.languageNotice =
            "English fallback used by the local creative engine.";
    }

    const finalContent = {
        ...content,
        brandName,
        website
    };

    console.log(
        "[Phoenix AI] Final content object:",
        finalContent
    );

    return finalContent;
}

    function generateEnglishContent({
        brief,
        brandName,
        website,
        industryId,
        goalId,
        toneId
    }) {
        const industryCopy = {
            "coffee-shop": {
                kicker: brandName,
                headlines: {
                    sale:
                        "FRESH COFFEE. SPECIAL MOMENTS.",
                    launch:
                        "YOUR NEW FAVORITE COFFEE SPOT.",
                    "website-traffic":
                        "FRESH COFFEE. FREE WIFI.",
                    "lead-generation":
                        "YOUR PERFECT COFFEE BREAK STARTS HERE.",
                    default:
                        "FRESH COFFEE. WARM WELCOME."
                },
                subtitle:
                    "Enjoy freshly brewed coffee, a welcoming atmosphere and moments worth sharing.",
                cta: "Visit Today"
            },

            restaurant: {
                kicker: brandName,
                headlines: {
                    sale:
                        "BIG FLAVOR. IRRESISTIBLE OFFER.",
                    launch:
                        "A NEW TASTE IS HERE.",
                    event:
                        "MAKE TONIGHT DELICIOUS.",
                    default:
                        "GREAT FOOD. MEMORABLE MOMENTS."
                },
                subtitle:
                    "Discover delicious food, friendly service and an experience created for every appetite.",
                cta: "Order Now"
            },

            bakery: {
                kicker: brandName,
                headlines: {
                    sale:
                        "FRESHLY BAKED. SPECIALly PRICED.",
                    launch:
                        "SOMETHING DELICIOUS JUST OPENED.",
                    default:
                        "FRESH FROM THE OVEN."
                },
                subtitle:
                    "Treat yourself to freshly baked breads, pastries and sweet creations made with care.",
                cta: "Visit Today"
            },

            technology: {
    kicker: brandName,

    headlines: {
        launch:
            "NEW TOOLS. MORE POSSIBILITIES.",

        "website-traffic":
            "MORE FREE TOOLS. MORE WAYS TO WORK SMARTER.",

        education:
            "POWERFUL TOOLS. SIMPLE RESULTS.",

        "brand-awareness":
            "NEW TOOLS. SMARTER POSSIBILITIES.",

        default:
            "BUILD FASTER. WORK SMARTER."
    },

    subtitle:
        "Explore calculators, converters, AI studios and useful online tools—with new additions released regularly.",

    cta: "Explore Tools"
},

            finance: {
                kicker: brandName,
                headlines: {
                    sale:
                        "MAKE EVERY DECISION COUNT.",
                    "lead-generation":
                        "BUILD A STRONGER FINANCIAL FUTURE.",
                    default:
                        "PLAN SMARTER. GROW STRONGER."
                },
                subtitle:
                    "Make informed financial decisions with clear guidance, useful tools and dependable support.",
                cta: "Get Started"
            },

            "real-estate": {
                kicker: brandName,
                headlines: {
                    sale:
                        "YOUR DREAM PROPERTY AWAITS.",
                    "lead-generation":
                        "FIND THE PLACE YOU'LL LOVE.",
                    default:
                        "DISCOVER YOUR NEXT HOME."
                },
                subtitle:
                    "Explore carefully selected properties designed for modern living, comfort and lasting value.",
                cta: "View Properties"
            },

            fitness: {
                kicker: brandName,
                headlines: {
                    sale:
                        "STRONGER STARTS TODAY.",
                    "lead-generation":
                        "BUILD STRENGTH. OWN YOUR GOALS.",
                    default:
                        "PUSH HARDER. BECOME STRONGER."
                },
                subtitle:
                    "Expert training, powerful motivation and the support you need to reach your fitness goals.",
                cta: "Join Today"
            },

            beauty: {
                kicker: brandName,
                headlines: {
                    sale:
                        "BEAUTY YOU'LL LOVE.",
                    launch:
                        "MEET YOUR NEW BEAUTY ESSENTIAL.",
                    default:
                        "GLOW WITH CONFIDENCE."
                },
                subtitle:
                    "Discover beauty and self-care essentials created to help you look and feel your best.",
                cta: "Shop Now"
            },

            fashion: {
                kicker: brandName,
                headlines: {
                    sale:
                        "NEW STYLE. SPECIAL PRICE.",
                    launch:
                        "YOUR NEXT LOOK HAS ARRIVED.",
                    default:
                        "STYLE THAT SPEAKS FOR YOU."
                },
                subtitle:
                    "Discover modern fashion, confident looks and pieces designed for your personal style.",
                cta: "Shop Collection"
            },

            education: {
                kicker: brandName,
                headlines: {
                    education:
                        "LEARN SMARTER. GROW FASTER.",
                    launch:
                        "YOUR LEARNING JOURNEY STARTS HERE.",
                    default:
                        "KNOWLEDGE OPENS NEW DOORS."
                },
                subtitle:
                    "Build useful skills through clear learning, practical guidance and supportive education.",
                cta: "Start Learning"
            },

            travel: {
                kicker: brandName,
                headlines: {
                    sale:
                        "YOUR NEXT ADVENTURE COSTS LESS.",
                    launch:
                        "A NEW JOURNEY BEGINS.",
                    default:
                        "DISCOVER MORE. TRAVEL FARTHER."
                },
                subtitle:
                    "Explore unforgettable destinations, inspiring experiences and journeys created around you.",
                cta: "Explore Now"
            },

            gaming: {
                kicker: brandName,
                headlines: {
                    event:
                        "ENTER THE COMPETITION.",
                    launch:
                        "THE NEXT LEVEL IS HERE.",
                    default:
                        "PLAY HARD. RISE HIGHER."
                },
                subtitle:
                    "Step into an energetic gaming experience built for competition, excitement and unforgettable play.",
                cta: "Play Now"
            },

            healthcare: {
                kicker: brandName,
                headlines: {
                    "lead-generation":
                        "CARE YOU CAN TRUST.",
                    default:
                        "YOUR HEALTH COMES FIRST."
                },
                subtitle:
                    "Professional, compassionate care focused on your health, comfort and peace of mind.",
                cta: "Book Appointment"
            },

            ecommerce: {
                kicker: brandName,
                headlines: {
                    sale:
                        "BIG SAVINGS. SMART SHOPPING.",
                    launch:
                        "YOUR NEW FAVORITE PRODUCT IS HERE.",
                    default:
                        "FIND IT. LOVE IT. GET IT."
                },
                subtitle:
                    "Discover useful products, exciting offers and shopping made simple from start to finish.",
                cta: "Shop Now"
            },

            "qr-generator": {
    kicker:
        "FREE QR CODE GENERATOR",

    headlines: {
        sale:
            "CREATE QR CODES. COMPLETELY FREE.",

        launch:
            "YOUR QR CODE IN SECONDS.",

        "website-traffic":
            "CREATE. DOWNLOAD. SCAN.",

        "brand-awareness":
            "FAST QR CODES. ZERO COST.",

        default:
            "CREATE. DOWNLOAD. SCAN."
    },

    subtitle:
        "Generate QR codes instantly, download them and scan them anytime—100% free on ToolXone.",

    cta:
        "Create QR Code"
},
            general: {
                kicker: brandName,
                headlines: {
                    sale:
                        "A BETTER OFFER STARTS HERE.",
                    launch:
                        "SOMETHING EXCITING IS HERE.",
                    "lead-generation":
                        "LET'S TURN YOUR GOAL INTO ACTION.",
                    default:
                        "YOUR IDEA. PROFESSIONALLY CREATED."
                },
                subtitle:
                    "A clear, professional message designed to connect with your audience and support your goal.",
                cta:
                    brief.suggestedCallToAction ||
                    "Learn More"
            }
        };

        const selected =
            industryCopy[industryId] ||
            industryCopy.general;

        let headline =
            selected.headlines[goalId] ||
            selected.headlines.default;

        let subtitle =
            selected.subtitle;

        let cta =
            selected.cta ||
            brief.suggestedCallToAction ||
            "Learn More";

        if (toneId === "luxury") {
            headline =
                makeLuxuryHeadline(
                    headline,
                    industryId
                );

            subtitle =
                makeLuxurySubtitle(
                    subtitle
                );
        }

        if (toneId === "urgent") {
            headline =
                makeUrgentHeadline(
                    headline,
                    industryId
                );

            cta =
                goalId === "sale"
                    ? "Get Offer"
                    : cta;
        }

        if (toneId === "playful") {
            headline =
                makePlayfulHeadline(
                    headline,
                    industryId
                );
        }

        return {
            kicker:
                limitText(
                    selected.kicker ||
                    brandName,
                    40
                ),

            headline:
                limitText(
                    headline,
                    90
                ),

            subtitle:
                limitText(
                    subtitle,
                    180
                ),

            callToAction:
                limitText(
                    cta,
                    28
                ),

            website
        };
    }

    function makeLuxuryHeadline(
        headline,
        industryId
    ) {
        const luxuryHeadlines = {
            "coffee-shop":
                "COFFEE, ELEVATED.",
            restaurant:
                "AN EXCEPTIONAL DINING EXPERIENCE.",
            bakery:
                "CRAFTED WITH ELEGANCE.",
            "real-estate":
                "EXCEPTIONAL LIVING AWAITS.",
            beauty:
                "TIMELESS BEAUTY. REFINED CARE.",
            fashion:
                "ELEGANCE IN EVERY DETAIL."
        };

        return (
            luxuryHeadlines[industryId] ||
            headline
        );
    }

    function makeLuxurySubtitle(subtitle) {
        return limitText(
            subtitle.replace(
                /^Discover/i,
                "Experience"
            ),
            180
        );
    }

    function makeUrgentHeadline(
        headline,
        industryId
    ) {
        const urgentHeadlines = {
            ecommerce:
                "LIMITED OFFER. SHOP TODAY.",
            fitness:
                "START NOW. GET STRONGER.",
            restaurant:
                "SPECIAL OFFER. ORDER TODAY.",
            "coffee-shop":
                "FRESH COFFEE. TODAY'S SPECIAL.",
            general:
                "DON'T MISS THIS OPPORTUNITY."
        };

        return (
            urgentHeadlines[industryId] ||
            headline
        );
    }

    function makePlayfulHeadline(
        headline,
        industryId
    ) {
        const playfulHeadlines = {
            bakery:
                "SWEET TREATS. HAPPY MOMENTS.",
            gaming:
                "READY. SET. PLAY!",
            education:
                "LEARN, GROW AND HAVE FUN.",
            general:
                "LET'S CREATE SOMETHING AMAZING!"
        };

        return (
            playfulHeadlines[industryId] ||
            headline
        );
    }


    /* =====================================================
       11. GENERATION BUTTON STATE
       ===================================================== */

    function setGeneratingState(isGenerating) {
        state.isGenerating = isGenerating;

        generateAiBannerButton.disabled =
            isGenerating;

        regenerateBannerButton &&
            (regenerateBannerButton.disabled =
                isGenerating);

        generateAiBannerButton.classList.toggle(
            "is-loading",
            isGenerating
        );

        if (generateButtonText) {
            generateButtonText.textContent =
                isGenerating
                    ? "Creating Your Banner..."
                    : "Generate Banner with AI";
        }
    }


    /* =====================================================
       12. STATUS DISPLAY
       ===================================================== */

    function showStatus({
        icon,
        title,
        message,
        type = "working"
    }) {
        if (!aiGenerationStatus) {
            return;
        }

        aiGenerationStatus.classList.remove(
            "is-working",
            "is-success",
            "is-error"
        );

        aiGenerationStatus.classList.add(
            type === "success"
                ? "is-success"
                : type === "error"
                    ? "is-error"
                    : "is-working"
        );

        const statusIcon =
            aiGenerationStatus.querySelector(
                ".status-icon"
            );

        const statusTitle =
            aiGenerationStatus.querySelector(
                "strong"
            );

        const statusMessage =
            aiGenerationStatus.querySelector(
                "p"
            );

        if (statusIcon) {
            statusIcon.textContent =
                icon || "🤖";
        }

        if (statusTitle) {
            statusTitle.textContent =
                title || "ToolXone AI";
        }

        if (statusMessage) {
            statusMessage.textContent =
                message || "";
        }
    }


    /* =====================================================
       13. MAIN AI GENERATION WORKFLOW
       ===================================================== */

    async function generateAiBanner() {
        if (state.isGenerating) {
            return;
        }

        const validation =
            ToolXoneAI.validatePrompt(
                bannerPromptInput.value
            );

        if (!validation.valid) {
            showStatus({
                icon: "💡",
                title: "Tell us a little more",
                message: validation.error,
                type: "error"
            });

            bannerPromptInput.focus();

            return;
        }

        setGeneratingState(true);
        closeFineTunePanel();

        try {
            const request =
                ToolXoneAI.createRequest({
                    studio:
                        "Phoenix AI Design Studio",

                    prompt:
                        validation.prompt,

                    platform:
                        platformSelect.value,

                    tone:
                        toneSelect.value,

                    language:
                        languageSelect.value
                });

            ToolXoneAI.startGeneration(
                request
            );

            const brief =
                ToolXonePromptEngine.analyzeIdea({
                    prompt:
                        request.prompt,

                    platform:
                        request.platform,

                    tone:
                        request.tone,

                    language:
                        request.language
                });

            const design =
                ToolXoneDesignEngine.createDesign(
                    brief
                );

            const assets =
                ToolXoneAssetEngine.createAssetPlan(
                    brief,
                    design
                );

            const content =
                createGeneratedContent(
                    brief
                );

            state.currentBrief =
                brief;

            state.currentDesign =
                design;

            state.currentAssets =
                assets;

            state.currentContent =
                content;

            state.currentTheme =
                design.palette?.id ||
                defaultValues.theme;

            state.currentLayout =
                design.layout?.id ||
                defaultValues.layout;

            fillEditorFromGeneration({
                brief,
                design,
                content
            });

  /* ======================================
     PHOENIX RENDER ENGINE PIPELINE
   ====================================== */

const phoenixAnalysis =
    ToolXoneCreativeBrain.analyzePrompt(
        request.prompt,
        {
            platform:
                request.platform,

            tone:
                request.tone,

            language:
                request.language
        }
    );

const designDNA =
    ToolXoneDesignDNA.createDesignDNA(
        phoenixAnalysis
    );

const copyDNA =
    ToolXoneCopyIntelligence.createCopyDNA(
        phoenixAnalysis,
        designDNA
    );

const assetDNA =
    ToolXoneAssetEngine.createAssetsFromDNA(
        phoenixAnalysis,
        designDNA
    );

const phoenixRenderResult =
    ToolXoneRenderEngine.renderDesign({
        target:
            "#bannerCanvas",

        designDNA,

        copyDNA,

        assetDNA,

        options: {
            brandName:
                content.brandName ||
                "ToolXone",

            website:
                content.website ||
                "www.toolxone.com"
        }
    });

state.currentPhoenixAnalysis =
    phoenixAnalysis;

state.currentDesignDNA =
    designDNA;

state.currentCopyDNA =
    copyDNA;

state.currentAssetDNA =
    assetDNA;

state.currentRenderResult =
    phoenixRenderResult;

           updateGeneratedSummary({
    brief,
    design,
    content
});

if (generatedResultPanel) {
    generatedResultPanel.hidden = true;
}

showGeneratedDesign();

            state.hasGeneratedResult =
                true;

            ToolXoneAI.completeGeneration({
                brief,
                design,
                assets,
                content
            });

            showStatus({
                icon: "✅",
                title:
                    "Your idea is ready",

                message:
                    content.languageNotice ||
                    "Phoenix AI created your design. Download it now or fine-tune it if needed.",

                type: "success"
            });

        } catch (error) {
            console.error(
                "[ToolXone AI] Banner generation error:",
                error
            );

            ToolXoneAI.failGeneration(
                error
            );

            showStatus({
                icon: "⚠️",
                title:
                    "We couldn't finish the banner",

                message:
                    error?.message ||
                    "Please review your idea and try again.",

                type: "error"
            });

        } finally {
            setGeneratingState(false);
        }
    }


    /* =====================================================
       14. FILL STEP 2 FROM AI RESULT
       ===================================================== */

    function fillEditorFromGeneration({
        brief,
        design,
        content
    }) {
        kickerInput.value =
            content.kicker;

        headlineInput.value =
            content.headline;

        subtitleInput.value =
            content.subtitle;

        websiteInput.value =
            content.website;

        ctaInput.value =
            content.callToAction;

        brandNameInput.value =
            content.brandName;

        const generatedLayout =
            design.layout?.id ||
            defaultValues.layout;

        if (
            [...layoutSelect.options].some(
                option =>
                    option.value ===
                    generatedLayout
            )
        ) {
            layoutSelect.value =
                generatedLayout;
        }

        platformSelect.value =
            brief.platform?.id ||
            platformSelect.value;

        applyThemeSelection(
            design.palette?.id ||
            defaultValues.theme
        );

        updateCharacterCounters();
    }


    /* =====================================================
       15. GENERATED RESULT SUMMARY
       ===================================================== */

    function updateGeneratedSummary({
        brief,
        design,
        content
    }) {
        if (generatedHeadlineSummary) {
            generatedHeadlineSummary.textContent =
                content.headline;
        }

        if (generatedThemeSummary) {
            generatedThemeSummary.textContent =
                design.palette?.label ||
                titleCase(
                    design.palette?.id
                );
        }

        if (generatedLayoutSummary) {
            generatedLayoutSummary.textContent =
                design.layout?.label ||
                titleCase(
                    design.layout?.id
                );
        }

        if (generatedToneSummary) {
            generatedToneSummary.textContent =
                brief.tone?.label ||
                titleCase(
                    brief.tone?.id
                );
        }
    }

    function scrollToGeneratedResult() {
        window.setTimeout(() => {
            generatedResultPanel.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 150);
    }


    /* =====================================================
       16. MANUAL CONTENT REFINEMENT
       ===================================================== */

    function getEditorContent() {
        return {
            kicker:
                cleanText(
                    kickerInput.value,
                    defaultValues.kicker
                ),

            headline:
                cleanText(
                    headlineInput.value,
                    defaultValues.headline
                ),

            subtitle:
                cleanText(
                    subtitleInput.value,
                    defaultValues.subtitle
                ),

            website:
                cleanText(
                    websiteInput.value,
                    defaultValues.website
                ),

            callToAction:
                cleanText(
                    ctaInput.value,
                    defaultValues.cta
                ),

            brandName:
                cleanText(
                    brandNameInput.value,
                    defaultValues.brandName
                )
        };
    }

    function updateLiveContent() {
        const content =
            getEditorContent();

        state.currentContent = {
            ...(state.currentContent || {}),
            ...content
        };

        ToolXonePreviewEngine.updateContent(
            content
        );

        updateCharacterCounters();

        if (generatedHeadlineSummary) {
            generatedHeadlineSummary.textContent =
                content.headline;
        }
    }


    /* =====================================================
       17. MANUAL DESIGN REFINEMENT
       ===================================================== */

    async function rebuildDesign({
        theme,
        layout,
        platform,
        animate = false
    } = {}) {
        if (!state.currentBrief) {
            applyBasicPreviewFallback();

            return;
        }

        try {
            const selectedPlatform =
                platform ||
                platformSelect.value;

            const selectedTheme =
                theme ||
                state.currentTheme;

            const selectedLayout =
                layout ||
                layoutSelect.value;

            const brief = {
                ...state.currentBrief,

                platform: {
                    ...(state.currentBrief.platform || {}),
                    id: selectedPlatform,
                    label:
                        platformSettings[
                            selectedPlatform
                        ]?.label ||
                        titleCase(
                            selectedPlatform
                        )
                }
            };

            const design =
                ToolXoneDesignEngine.createDesign(
                    brief,
                    {
                        platform:
                            selectedPlatform,

                        theme:
                            selectedTheme,

                        layout:
                            selectedLayout,

                        tone:
                            brief.tone?.id
                    }
                );

            const assets =
                ToolXoneAssetEngine.createAssetPlan(
                    brief,
                    design
                );

            state.currentBrief =
                brief;

            state.currentDesign =
                design;

            state.currentAssets =
                assets;

            state.currentTheme =
                design.palette?.id ||
                selectedTheme;

            state.currentLayout =
                design.layout?.id ||
                selectedLayout;

            layoutSelect.value =
                state.currentLayout;

            applyThemeSelection(
                state.currentTheme
            );

            await ToolXonePreviewEngine.renderPreview({
                brief,
                design,
                assets,
                content:
                    getEditorContent(),

                animate
            });

            updateGeneratedSummary({
                brief,
                design,
                content:
                    getEditorContent()
            });

        } catch (error) {
            console.error(
                "[ToolXone AI] Design refinement error:",
                error
            );
        }
    }

    function applyThemeSelection(themeName) {
        state.currentTheme =
            themeName;

        themeButtons.forEach(button => {
            const isActive =
                button.dataset.theme ===
                themeName;

            button.classList.toggle(
                "active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                isActive
                    ? "true"
                    : "false"
            );
        });
    }


    /* =====================================================
       18. BASIC PREVIEW FALLBACK
       Used before the first AI generation.
       ===================================================== */

    function applyBasicPreviewFallback() {
        ToolXonePreviewEngine.updateContent(
            getEditorContent()
        );
    }


    /* =====================================================
       19. APPLY CHANGES BUTTON
       ===================================================== */

    async function applyManualChanges() {
        applyChangesButton.disabled =
            true;

        applyChangesButton.textContent =
            "Applying...";

        try {
            updateLiveContent();

            await rebuildDesign({
                theme:
                    state.currentTheme,

                layout:
                    layoutSelect.value,

                platform:
                    platformSelect.value,

                animate: false
            });

            applyChangesButton.textContent =
                "✅ Changes Applied";

        } finally {
            window.setTimeout(() => {
                applyChangesButton.disabled =
                    false;

                applyChangesButton.textContent =
                    "✓ Apply Changes";
            }, 1200);
        }
    }


    /* =====================================================
       20. LOGO UPLOAD
       ===================================================== */

    function handleLogoUpload(event) {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/webp",
            "image/svg+xml"
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {
            alert(
                "Please upload a PNG, JPG, WebP or SVG image."
            );

            logoInput.value = "";

            return;
        }

        const maximumFileSize =
            5 * 1024 * 1024;

        if (
            file.size >
            maximumFileSize
        ) {
            alert(
                "The logo is too large. Please select an image smaller than 5 MB."
            );

            logoInput.value = "";

            return;
        }

        clearCurrentLogoUrl();

        const logoUrl =
            URL.createObjectURL(file);

        state.currentLogoUrl =
            logoUrl;

        ToolXonePreviewEngine.updateLogo({
            source:
                logoUrl,

            brandName:
                brandNameInput.value
        });

        if (removeLogoButton) {
            removeLogoButton.classList.add(
                "visible"
            );
        }
    }

    function clearCurrentLogoUrl() {
        if (state.currentLogoUrl) {
            URL.revokeObjectURL(
                state.currentLogoUrl
            );

            state.currentLogoUrl =
                null;
        }
    }

    function removeLogo() {
        if (uploadedLogoPreview) {
            uploadedLogoPreview.onload =
                null;

            uploadedLogoPreview.onerror =
                null;
        }

        clearCurrentLogoUrl();

        logoInput.value = "";

        ToolXonePreviewEngine.updateLogo({
            source: "",
            brandName:
                brandNameInput.value
        });

        logoPreviewWrapper?.classList.remove(
            "has-uploaded-logo"
        );

        removeLogoButton?.classList.remove(
            "visible"
        );
    }


    /* =====================================================
       21. RESET STUDIO
       ===================================================== */

    function resetBanner() {
        bannerPromptInput.value = "";

        platformSelect.value =
            defaultValues.platform;

        toneSelect.value =
            defaultValues.tone;

        languageSelect.value =
            defaultValues.language;

        kickerInput.value =
            defaultValues.kicker;

        headlineInput.value =
            defaultValues.headline;

        subtitleInput.value =
            defaultValues.subtitle;

        websiteInput.value =
            defaultValues.website;

        ctaInput.value =
            defaultValues.cta;

        brandNameInput.value =
            defaultValues.brandName;

        layoutSelect.value =
            defaultValues.layout;

        state.currentTheme =
            defaultValues.theme;

        state.currentLayout =
            defaultValues.layout;

        state.currentBrief = null;
        state.currentDesign = null;
        state.currentAssets = null;
        state.currentContent = null;
        state.hasGeneratedResult = false;

        generatedResultPanel.hidden =
            true;

        removeLogo();

        ToolXoneAI.reset();

        ToolXonePreviewEngine.reset();

        applyThemeSelection(
            defaultValues.theme
        );

        updateCharacterCounters();

        showStatus({
            icon: "🤖",
            title: "AI is ready",
            message:
                "Describe what you want to achieve and ToolXone will guide you from there.",
            type: "working"
        });

        resetBannerButton.disabled =
            true;

        resetBannerButton.textContent =
            "✅ Reset Complete";

        window.setTimeout(() => {
            resetBannerButton.disabled =
                false;

            resetBannerButton.textContent =
                "↺ Reset Design";
        }, 1200);
    }

    function clearPrompt() {
        bannerPromptInput.value = "";

        updateCharacterCounters();

        bannerPromptInput.focus();

        showStatus({
            icon: "💡",
            title:
                "Describe your idea",

            message:
                "Tell us about the business, audience, offer and visual feeling you want.",

            type: "working"
        });
    }


    /* =====================================================
       22. DOWNLOAD BUTTON SETUP
       ===================================================== */

    function configureDownloadButtons() {
        downloadButtons.forEach(button => {
            const format =
                button.dataset.format ||
                button.textContent
                    .trim()
                    .toLowerCase();

            button.disabled = false;
            button.dataset.format = format;

            button.addEventListener(
                "click",
                () => {
                    downloadBanner(
                        format
                    );
                }
            );
        });
    }


    /* =====================================================
       23. HIGH-RESOLUTION DOWNLOAD
       ===================================================== */

    async function downloadBanner(format) {
        if (
            typeof html2canvas ===
            "undefined"
        ) {
            alert(
                "The download engine is not loaded. Please refresh the page and try again."
            );

            return;
        }

        const platformKey =
            platformSelect.value;

        const settings =
            platformSettings[
                platformKey
            ] ||
            platformSettings.facebook;

        const clickedButton =
            downloadButtons.find(
                button =>
                    button.dataset.format ===
                    format
            );

        if (clickedButton) {
            clickedButton.disabled =
                true;

            clickedButton.textContent =
                "Preparing...";
        }

        try {
            await waitForImages(
                bannerCanvas
            );

            const exportTarget =
    bannerCanvas.querySelector(
        ".phoenix-render-canvas"
    ) || bannerCanvas;

            const originalWidth =
    exportTarget
        .getBoundingClientRect()
        .width;

            if (!originalWidth) {
                throw new Error(
                    "The banner preview has no visible width."
                );
            }

            const scale =
                settings.width /
                originalWidth;

            const renderedCanvas =
                await html2canvas(
                  exportTarget,
                    {
                        backgroundColor: null,
                        scale,
                        useCORS: true,
                        allowTaint: false,
                        logging: false,
                        imageTimeout: 15000,

                        width:
                            exportTarget.offsetWidth,

                        height:
                            bannerCanvas.offsetHeight,

                        windowWidth:
                            document.documentElement
                                .scrollWidth,

                        windowHeight:
                            document.documentElement
                                .scrollHeight,

                        onclone:
                            clonedDocument => {
                                const clonedBanner =
                                    clonedDocument.getElementById(
                                        "bannerCanvas"
                                    );

                                if (clonedBanner) {
                                    clonedBanner.style.transform =
                                        "none";

                                    clonedBanner.style.animation =
                                        "none";

                                    clonedBanner.classList.remove(
                                        "preview-final-reveal",
                                        "preview-is-thinking",
                                        "is-generating"
                                    );
                                }
                            }
                    }
                );

            const finalCanvas =
                document.createElement(
                    "canvas"
                );

            finalCanvas.width =
                settings.width;

            finalCanvas.height =
                settings.height;

            const context =
                finalCanvas.getContext(
                    "2d"
                );

            if (!context) {
                throw new Error(
                    "Canvas rendering is unavailable."
                );
            }

            if (
                format === "jpg" ||
                format === "jpeg"
            ) {
                context.fillStyle =
                    "#ffffff";

                context.fillRect(
                    0,
                    0,
                    finalCanvas.width,
                    finalCanvas.height
                );
            }

            context.drawImage(
                renderedCanvas,
                0,
                0,
                finalCanvas.width,
                finalCanvas.height
            );

            const mimeType =
                getMimeType(format);

            const quality =
                format === "png"
                    ? undefined
                    : 0.94;

            finalCanvas.toBlob(
                blob => {
                    if (!blob) {
                        restoreDownloadButton(
                            clickedButton,
                            format
                        );

                        alert(
                            "The image could not be generated. Please try again."
                        );

                        return;
                    }

                    const fileName =
                        createFileName(
                            settings.label,
                            format
                        );

                    triggerDownload(
                        blob,
                        fileName
                    );

                    restoreDownloadButton(
                        clickedButton,
                        format,
                        true
                    );
                },
                mimeType,
                quality
            );

        } catch (error) {
            console.error(
                "[ToolXone AI] Download error:",
                error
            );

            restoreDownloadButton(
                clickedButton,
                format
            );

            alert(
                "The banner could not be downloaded. Please try again."
            );
        }
    }

    /* =====================================================
       24. DOWNLOAD HELPERS
       ===================================================== */

    function getMimeType(format) {
        switch (format) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";

            case "webp":
                return "image/webp";

            default:
                return "image/png";
        }
    }

    function createFileName(
        platformLabel,
        format
    ) {
        const brand =
            cleanText(
                brandNameInput.value,
                "toolxone"
            )
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

        const platform =
            platformLabel
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

        const extension =
            format === "jpeg"
                ? "jpg"
                : format;

        return (
            `${brand}-${platform}-banner.` +
            extension
        );
    }

    function triggerDownload(
        blob,
        fileName
    ) {
        const downloadUrl =
            URL.createObjectURL(blob);

        const anchor =
            document.createElement("a");

        anchor.href = downloadUrl;
        anchor.download = fileName;

        document.body.appendChild(
            anchor
        );

        anchor.click();
        anchor.remove();

        window.setTimeout(() => {
            URL.revokeObjectURL(
                downloadUrl
            );
        }, 1000);
    }

    function restoreDownloadButton(
        button,
        format,
        success = false
    ) {
        if (!button) {
            return;
        }

        button.disabled = false;

        button.textContent =
            success
                ? "Downloaded!"
                : format.toUpperCase();

        if (success) {
            window.setTimeout(() => {
                button.textContent =
                    format.toUpperCase();
            }, 1300);
        }
    }

    function waitForImages(container) {
        const images = [
            ...container.querySelectorAll(
                "img"
            )
        ];

        const pendingImages =
            images.filter(image =>
                image.src &&
                !image.complete
            );

        if (!pendingImages.length) {
            return Promise.resolve();
        }

        return Promise.all(
            pendingImages.map(image =>
                new Promise(resolve => {
                    image.addEventListener(
                        "load",
                        resolve,
                        { once: true }
                    );

                    image.addEventListener(
                        "error",
                        resolve,
                        { once: true }
                    );
                })
            )
        );
    }


    /* =====================================================
       25. EVENT LISTENERS
       ===================================================== */

    bannerPromptInput.addEventListener(
        "input",
        updateCharacterCounters
    );

    clearPromptButton?.addEventListener(
        "click",
        clearPrompt
    );

    generateAiBannerButton.addEventListener(
        "click",
        generateAiBanner
    );

    regenerateBannerButton?.addEventListener(
        "click",
        generateAiBanner
    );

    platformSelect.addEventListener(
        "change",
        () => {
            rebuildDesign({
                platform:
                    platformSelect.value,

                animate: false
            });
        }
    );

    toneSelect.addEventListener(
        "change",
        () => {
            if (
                state.hasGeneratedResult
            ) {
                generateAiBanner();
            }
        }
    );

    languageSelect.addEventListener(
        "change",
        () => {
            if (
                state.hasGeneratedResult
            ) {
                generateAiBanner();
            }
        }
    );

    themeButtons.forEach(button => {
        button.addEventListener(
            "click",
            () => {
                const themeName =
                    button.dataset.theme;

                applyThemeSelection(
                    themeName
                );

                rebuildDesign({
                    theme:
                        themeName,

                    animate: false
                });
            }
        );
    });

    layoutSelect.addEventListener(
        "change",
        () => {
            state.currentLayout =
                layoutSelect.value;

            rebuildDesign({
                layout:
                    layoutSelect.value,

                animate: false
            });
        }
    );

    [
        kickerInput,
        headlineInput,
        subtitleInput,
        websiteInput,
        ctaInput,
        brandNameInput
    ].forEach(input => {
        input.addEventListener(
            "input",
            updateLiveContent
        );
    });

    logoInput.addEventListener(
        "change",
        handleLogoUpload
    );

    removeLogoButton?.addEventListener(
        "click",
        removeLogo
    );

    resetBannerButton.addEventListener(
        "click",
        resetBanner
    );

    applyChangesButton.addEventListener(
        "click",
        applyManualChanges
    );
toggleFineTuneButton?.addEventListener(
    "click",
    toggleFineTunePanel
);

    /* =====================================================
       26. CLEANUP
       ===================================================== */

    window.addEventListener(
        "beforeunload",
        clearCurrentLogoUrl
    );


    /* =====================================================
       27. INITIALIZE STUDIO
       ===================================================== */

    applyThemeSelection(
        defaultValues.theme
    );

    updateCharacterCounters();

    configureDownloadButtons();

    ToolXonePreviewEngine.updateContent({
        kicker:
            defaultValues.kicker,

        headline:
            defaultValues.headline,

        subtitle:
            defaultValues.subtitle,

        website:
            defaultValues.website,

        callToAction:
            defaultValues.cta,

        brandName:
            defaultValues.brandName
    });

    showStatus({
        icon: "🤖",
        title: "AI is ready",
        message:
            "Don't worry if you don't know design. Describe what you want to achieve, and ToolXone will guide you from there.",
        type: "working"
    });

    console.log(
        "✅ Phoenix AI Design Studio Controller Loaded"
    );
});