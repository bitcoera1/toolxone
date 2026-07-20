/*
==========================================================
TOOLXONE PHOENIX AI COPY INTELLIGENCE
----------------------------------------------------------

Purpose
-------
Transforms Creative Brain analysis and Design DNA into
platform-aware marketing copy.

Input
-----
Creative Brain Analysis
Design DNA

Output
------
Kicker
Headline
Supporting Text
CTA
Badge
Benefits

This engine does not render or modify the page.
It only creates structured copy decisions.

==========================================================
*/

(function () {
    "use strict";


    /* =====================================================
       1. CREATE COPY DNA
       ===================================================== */

    function createCopyDNA(
        analysis,
        designDNA = {}
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
        "General",

    type:
        toolProfile?.type ||
        "general",

    purpose:
        toolProfile?.purpose ||
        "",

    benefits:
        Array.isArray(
            toolProfile?.benefits
        )
            ? [...toolProfile.benefits]
            : [],

    emotions:
        Array.isArray(
            toolProfile?.emotions
        )
            ? [...toolProfile.emotions]
            : [],

    recommendedCTA:
        toolProfile?.cta ||
        "Learn More",

    audience,

    platform:
        analysis.platform,

    tone:
        analysis.tone,

    goal:
        analysis.goal

};

        const signals =
            buildCopySignals(analysis);

        const limits =
            getPlatformCopyLimits(
                analysis.platform
            );

        const rawCopy =
    selectSubjectCopy({

        analysis,

        designDNA,

        context,

        signals

    });

        return {
            context,
            kicker:
                limitText(
                    rawCopy.kicker,
                    limits.kicker
                ),

            headline:
                limitText(
                    rawCopy.headline,
                    limits.headline
                ),

            supportingText:
                limitText(
                    rawCopy.supportingText,
                    limits.supportingText
                ),

            callToAction:
                limitText(
                    rawCopy.callToAction,
                    limits.callToAction
                ),

            badge:
                limitText(
                    rawCopy.badge,
                    limits.badge
                ),

            benefits:
                normalizeBenefits(
                    rawCopy.benefits,
                    limits.benefit,
                    limits.maximumBenefits
                ),

            platform:
                String(
                    analysis.platform ||
                    "facebook"
                ).toLowerCase(),

            subject:
                analysis.subject ||
                "General Promotion",

            tone:
                analysis.tone ||
                "automatic",

            createdAt:
                new Date().toISOString()
        };
    }


    /* =====================================================
       2. SUBJECT-SPECIFIC COPY
       ===================================================== */

    function selectSubjectCopy({
    analysis,
    designDNA,
    context,
    signals
}) {
    const brandName =
        detectBrandName(
            analysis.originalPrompt
        );

    const offer =
        detectPrimaryOffer(
            analysis
        );

    const tone =
        String(
            analysis.tone ||
            "automatic"
        ).toLowerCase();


    /* -------------------------------------------------
       EXACT TOOL PROFILE — HIGHEST PRIORITY
       ------------------------------------------------- */

    if (
        context?.toolId ===
        "currency-converter"
    ) {
        return applyTone(
            {
                kicker:
                    context.subject ||
                    "Currency Converter",

                headline:
                    "CONVERT CURRENCIES WITH LIVE RATES.",

                supportingText:
                    context.purpose ||
                    "Convert world currencies instantly using live exchange rates.",

                callToAction:
                    context.recommendedCTA ||
                    "Convert Now",

                badge:
                    offer ||
                    "Live Exchange Rates",

                benefits:
                    context.benefits?.length
                        ? context.benefits
                        : [
                            "Real-time exchange rates",
                            "Fast conversion",
                            "Accurate results"
                        ]
            },

            tone,
            analysis
        );
    }


    /* -------------------------------------------------
       QR CODE GENERATOR
       ------------------------------------------------- */

    if (
        /\bqr\b|\bqr code\b|\bscan\b|\bscanner\b/.test(
            signals
        )
    ) {
        return applyTone(
            {
                kicker:
                    "Free QR Code Generator",

                headline:
                    "CREATE. DOWNLOAD. SCAN.",

                supportingText:
                    "Generate QR codes instantly, download them in seconds and scan them whenever you need.",

                callToAction:
                    "Create Free QR",

                badge:
                    offer ||
                    "100% Free",

                benefits: [
                    "Instant generation",
                    "Easy download",
                    "Ready to scan"
                ]
            },

            tone,
            analysis
        );
    }

    // Keep all remaining existing blocks below this point.       


        /* -------------------------------------------------
           QR CODE GENERATOR
           ------------------------------------------------- */

        if (
            /\bqr\b|\bqr code\b|\bscan\b|\bscanner\b/.test(
                signals
            )
        ) {
            return applyTone(
                {
                    kicker:
                        "Free QR Code Generator",

                    headline:
                        "CREATE. DOWNLOAD. SCAN.",

                    supportingText:
                        "Generate QR codes instantly, download them in seconds and scan them whenever you need.",

                    callToAction:
                        "Create Free QR",

                    badge:
                        offer ||
                        "100% Free",

                    benefits: [
                        "Instant generation",
                        "Easy download",
                        "Ready to scan"
                    ]
                },

                tone,
                analysis
            );
        }


        /* -------------------------------------------------
           BMI CALCULATOR
           ------------------------------------------------- */

        if (
            /\bbmi\b|\bbody mass\b|\bhealthy weight\b/.test(
                signals
            )
        ) {
            return applyTone(
                {
                    kicker:
                        "Free BMI Calculator",

                    headline:
                        "KNOW YOUR BMI. UNDERSTAND YOUR HEALTH.",

                    supportingText:
                        "Calculate your BMI instantly and receive useful guidance to better understand your healthy weight range.",

                    callToAction:
                        "Check Your BMI",

                    badge:
                        offer ||
                        "Instant Results",

                    benefits: [
                        "Fast BMI result",
                        "Healthy weight range",
                        "Useful health guidance"
                    ]
                },

                tone,
                analysis
            );
        }


        /* -------------------------------------------------
           SCIENTIFIC CALCULATOR
           ------------------------------------------------- */

        if (
            /\bscientific calculator\b|\badvanced calculator\b|\btrigonometry\b|\bformula\b/.test(
                signals
            )
        ) {
            return applyTone(
                {
                    kicker:
                        "Scientific Calculator",

                    headline:
                        "SOLVE COMPLEX CALCULATIONS FASTER.",

                    supportingText:
                        "Handle scientific functions, formulas and advanced calculations in one fast, easy-to-use online tool.",

                    callToAction:
                        "Start Calculating",

                    badge:
                        offer ||
                        "Free Online Tool",

                    benefits: [
                        "Advanced functions",
                        "Fast calculations",
                        "Easy online access"
                    ]
                },

                tone,
                analysis
            );
        }


        /* -------------------------------------------------
           GENERAL CALCULATOR
           ------------------------------------------------- */

        if (
            /\bcalculator\b|\bcalculate\b|\bcalculation\b/.test(
                signals
            )
        ) {
            return applyTone(
                {
                    kicker:
                        analysis.subject ||
                        "Free Online Calculator",

                    headline:
                        "CALCULATE FASTER. DECIDE SMARTER.",

                    supportingText:
                        "Get clear, instant results with a free calculator designed to make everyday decisions easier.",

                    callToAction:
                        "Calculate Now",

                    badge:
                        offer ||
                        "Free to Use",

                    benefits: [
                        "Instant results",
                        "Simple to use",
                        "No registration"
                    ]
                },

                tone,
                analysis
            );
        }


        /* -------------------------------------------------
           FINANCE
           ------------------------------------------------- */

        if (
            /\bfinance\b|\bloan\b|\bmortgage\b|\binvestment\b|\binterest\b|\bemi\b|\bcurrency\b/.test(
                signals
            )
        ) {
            return applyTone(
                {
                    kicker:
                        analysis.subject ||
                        "Financial Calculator",

                    headline:
                        "PLAN SMARTER. MOVE FORWARD WITH CONFIDENCE.",

                    supportingText:
                        "Estimate important financial figures quickly and make more informed decisions with clear, dependable calculations.",

                    callToAction:
                        "Calculate Now",

                    badge:
                        offer ||
                        "Instant Estimate",

                    benefits: [
                        "Clear estimates",
                        "Fast calculations",
                        "Better planning"
                    ]
                },

                tone,
                analysis
            );
        }


        /* -------------------------------------------------
           COFFEE / HOSPITALITY
           ------------------------------------------------- */

        if (
            /\bcoffee\b|\bcafe\b|\bbakery\b|\brestaurant\b|\bfood\b/.test(
                signals
            )
        ) {
            return applyTone(
                {
                    kicker:
                        brandName ||
                        analysis.subject ||
                        "Freshly Made",

                    headline:
                        "FRESH FLAVOR. WARM MOMENTS.",

                    supportingText:
                        "Enjoy delicious choices, welcoming service and an experience created to make every visit special.",

                    callToAction:
                        "Visit Today",

                    badge:
                        offer ||
                        "Fresh Daily",

                    benefits: [
                        "Freshly prepared",
                        "Warm atmosphere",
                        "Made with care"
                    ]
                },

                tone,
                analysis
            );
        }


        /* -------------------------------------------------
           TECHNOLOGY / DIGITAL TOOLS
           ------------------------------------------------- */

        if (
            /\bdigital\b|\btechnology\b|\bsoftware\b|\bonline tool\b|\bgenerator\b|\bconverter\b/.test(
                signals
            )
        ) {
            return applyTone(
                {
                    kicker:
                        analysis.subject ||
                        "Smart Online Tool",

                    headline:
                        "WORK FASTER WITH A SMARTER ONLINE TOOL.",

                    supportingText:
                        "Complete your task quickly with a simple, reliable tool designed for speed and ease of use.",

                    callToAction:
                        "Try It Free",

                    badge:
                        offer ||
                        "Free Online",

                    benefits: [
                        "Fast and simple",
                        "Works online",
                        "Ready instantly"
                    ]
                },

                tone,
                analysis
            );
        }


        /* -------------------------------------------------
           DEFAULT
           ------------------------------------------------- */

        return applyTone(
            {
                kicker:
                    brandName ||
                    analysis.subject ||
                    "Phoenix AI Design",

                headline:
                    createFallbackHeadline(
                        analysis
                    ),

                supportingText:
                    createFallbackSupport(
                        analysis
                    ),

                callToAction:
                    selectFallbackCTA(
                        analysis.goal
                    ),

                badge:
                    offer ||
                    "Explore Now",

                benefits: [
                    "Simple experience",
                    "Clear value",
                    "Ready to explore"
                ]
            },

            tone,
            analysis
        );
    }


    /* =====================================================
       3. TONE ADAPTATION
       ===================================================== */

    function applyTone(
        copy,
        tone,
        analysis
    ) {
        const adapted = {
            ...copy,
            benefits: [
                ...(copy.benefits || [])
            ]
        };


        if (
            tone === "urgent"
        ) {
            adapted.headline =
                makeUrgentHeadline(
                    copy.headline
                );

            adapted.callToAction =
                analysis.goal === "sale"
                    ? "Get Offer Now"
                    : "Try It Now";

            adapted.badge =
                copy.badge ||
                "Available Now";
        }


        if (
            tone === "playful"
        ) {
            adapted.headline =
                makePlayfulHeadline(
                    copy.headline
                );

            adapted.callToAction =
                copy.callToAction ||
                "Let's Go";
        }


        if (
            tone === "luxury"
        ) {
            adapted.headline =
                makeLuxuryHeadline(
                    copy.headline
                );

            adapted.supportingText =
                makeLuxurySupportingText(
                    copy.supportingText
                );

            adapted.callToAction =
                "Discover More";
        }


        if (
            tone === "friendly"
        ) {
            adapted.supportingText =
                makeFriendlySupportingText(
                    copy.supportingText
                );
        }


        return adapted;
    }


    function makeUrgentHeadline(value) {
        const cleaned =
            String(value || "")
                .replace(/[.!]+$/g, "");

        return `${cleaned}. START NOW.`;
    }


    function makePlayfulHeadline(value) {
        const cleaned =
            String(value || "")
                .replace(/[.!]+$/g, "");

        return `${cleaned} ✨`;
    }


    function makeLuxuryHeadline(value) {
        const cleaned =
            String(value || "")
                .replace(/[.!]+$/g, "");

        return cleaned
            .replace(
                /\bFREE\b/gi,
                "EFFORTLESS"
            );
    }


    function makeLuxurySupportingText(value) {
        return String(value || "")
            .replace(
                /\bfast\b/gi,
                "refined"
            )
            .replace(
                /\beasy\b/gi,
                "effortless"
            );
    }


    function makeFriendlySupportingText(value) {
        const cleaned =
            String(value || "").trim();

        return cleaned
            ? `${cleaned} It is quick, simple and ready when you are.`
            : "A quick and simple experience designed around you.";
    }


    /* =====================================================
       4. PLATFORM COPY LIMITS
       ===================================================== */

    function getPlatformCopyLimits(platformValue) {
        const platform =
            String(
                platformValue ||
                "facebook"
            ).toLowerCase();


        if (
            platform === "youtube" ||
            platform === "youtube-thumbnail"
        ) {
            return {
                kicker: 24,
                headline: 42,
                supportingText: 0,
                callToAction: 0,
                badge: 18,
                benefit: 0,
                maximumBenefits: 0
            };
        }


        if (
            platform === "pinterest" ||
            platform === "pinterest-pin"
        ) {
            return {
                kicker: 34,
                headline: 64,
                supportingText: 145,
                callToAction: 22,
                badge: 20,
                benefit: 32,
                maximumBenefits: 3
            };
        }


        if (
            platform === "instagram-story" ||
            platform === "story"
        ) {
            return {
                kicker: 28,
                headline: 54,
                supportingText: 105,
                callToAction: 20,
                badge: 18,
                benefit: 26,
                maximumBenefits: 2
            };
        }


        if (
            platform === "instagram" ||
            platform === "instagram-post"
        ) {
            return {
                kicker: 28,
                headline: 54,
                supportingText: 110,
                callToAction: 20,
                badge: 18,
                benefit: 28,
                maximumBenefits: 2
            };
        }


        if (
            platform === "facebook" ||
            platform === "facebook-post" ||
            platform === "facebook-banner"
        ) {
            return {
                kicker: 32,
                headline: 58,
                supportingText: 120,
                callToAction: 22,
                badge: 20,
                benefit: 30,
                maximumBenefits: 3
            };
        }


        if (
            platform === "website-banner" ||
            platform === "website-hero"
        ) {
            return {
                kicker: 34,
                headline: 70,
                supportingText: 145,
                callToAction: 24,
                badge: 20,
                benefit: 32,
                maximumBenefits: 3
            };
        }


        return {
            kicker: 32,
            headline: 62,
            supportingText: 130,
            callToAction: 22,
            badge: 20,
            benefit: 30,
            maximumBenefits: 3
        };
    }


    /* =====================================================
       5. COPY HELPERS
       ===================================================== */

    function buildCopySignals(analysis) {
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
            analysis.subject || "",
            analysis.subjectType || "",
            keywords,
            offer,
            analysis.goal || "",
            analysis.originalPrompt || "",
            analysis.normalizedPrompt || ""
        ]
            .join(" ")
            .toLowerCase();
    }


    function detectPrimaryOffer(analysis) {
        const offer =
            Array.isArray(analysis.offer)
                ? analysis.offer
                : [];

        if (
            offer.includes("free")
        ) {
            return "100% Free";
        }

        if (
            offer.includes("discount")
        ) {
            return "Special Offer";
        }

        if (
            offer.includes("new")
        ) {
            return "New";
        }

        if (
            offer.includes("fast")
        ) {
            return "Instant";
        }

        return "";
    }


    function detectBrandName(prompt) {
        const text =
            String(prompt || "");

        const domainMatch =
            text.match(
                /\b(?:https?:\/\/)?(?:www\.)?([a-z0-9-]+)\.(?:com|net|org|io|pk)\b/i
            );

        if (
            domainMatch?.[1]
        ) {
            return titleCase(
                domainMatch[1]
            );
        }

        return "";
    }


    function createFallbackHeadline(analysis) {
        const subject =
            String(
                analysis.subject ||
                "Your Idea"
            ).toUpperCase();

        if (
            analysis.goal === "launch"
        ) {
            return `${subject} IS HERE.`;
        }

        if (
            analysis.goal === "sale"
        ) {
            return `DISCOVER MORE VALUE WITH ${subject}.`;
        }

        return `${subject}. MADE SIMPLE.`;
    }


    function createFallbackSupport(analysis) {
        const subject =
            analysis.subject ||
            "this experience";

        return `Discover ${subject} through a clear, professional experience designed around your goal.`;
    }


    function selectFallbackCTA(goal) {
        if (
            goal === "website-traffic"
        ) {
            return "Visit Now";
        }

        if (
            goal === "sale"
        ) {
            return "Get Offer";
        }

        if (
            goal === "launch"
        ) {
            return "Discover Now";
        }

        if (
            goal === "action"
        ) {
            return "Try It Now";
        }

        return "Learn More";
    }


    function normalizeBenefits(
        benefits,
        maximumLength,
        maximumBenefits
    ) {
        if (
            maximumBenefits <= 0
        ) {
            return [];
        }

        return (
            Array.isArray(benefits)
                ? benefits
                : []
        )
            .slice(
                0,
                maximumBenefits
            )
            .map(benefit => {
                return limitText(
                    benefit,
                    maximumLength
                );
            })
            .filter(Boolean);
    }


    function limitText(
        value,
        maximumLength
    ) {
        const text =
            String(value || "")
                .trim()
                .replace(/\s+/g, " ");

        if (
            maximumLength <= 0
        ) {
            return "";
        }

        if (
            text.length <= maximumLength
        ) {
            return text;
        }

        const shortened =
            text.slice(
                0,
                maximumLength - 1
            );

        const lastSpace =
            shortened.lastIndexOf(" ");

        return (
            lastSpace > maximumLength * 0.6
                ? shortened.slice(0, lastSpace)
                : shortened
        )
            .trim()
            .replace(/[.,;:!?-]+$/g, "")
            + "…";
    }


    function titleCase(value) {
        return String(value || "")
            .toLowerCase()
            .replace(
                /\b\w/g,
                letter =>
                    letter.toUpperCase()
            );
    }


    /* =====================================================
       6. PUBLIC API
       ===================================================== */

    window.ToolXoneCopyIntelligence = {
        createCopyDNA
    };

})();