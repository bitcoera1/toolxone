/*
==========================================================
TOOLXONE — PHOENIX AI DESIGN STUDIO
Creative Brain v1.0

Responsibility:
Understand the user's natural-language idea and create
a reusable creative direction for the Phoenix AI engines.

The Creative Brain does not render HTML, CSS or graphics.
It only produces structured creative decisions.
==========================================================
*/

window.ToolXoneCreativeBrain = (
  function () {
    "use strict";


    /* =====================================================
   1. ANALYZE USER PROMPT
   ===================================================== */

function analyzePrompt(
    prompt,
    context = {}
) {
    const originalPrompt =
        String(
            prompt || ""
        ).trim();

    const normalizedPrompt =
        normalizeText(
            originalPrompt
        );

    const subject =
        detectSubject(
            normalizedPrompt
        );

    const subjectType =
        detectSubjectType(
            normalizedPrompt,
            subject
        );

    const toolIdentity =
        detectToolIdentity(
            normalizedPrompt,
            subject
        );

    const toolProfile =
        window.ToolXoneToolIntelligence
            ?.getToolProfile(
                toolIdentity.id
            ) || null;

    const audience =
        window.ToolXoneAudienceIntelligence
            ?.detectAudience(
                normalizedPrompt
            ) || [
                {
                    id: "general",
                    label: "General Audience"
                }
            ];

    const offer =
        detectOffer(
            normalizedPrompt
        );

    const goal =
        detectGoal(
            normalizedPrompt
        );

    const keywords =
        extractKeywords(
            normalizedPrompt,
            subject
        );

    return {
        originalPrompt,
        normalizedPrompt,

        platform:
            context.platform ||
            detectPlatform(
                normalizedPrompt
            ) ||
            "facebook",

        tone:
            context.tone ||
            "automatic",

        language:
            context.language ||
            "english",

        subject,
        subjectType,
        toolIdentity,
        toolProfile,
        audience,
        offer,
        goal,
        keywords,

        createdAt:
            new Date().toISOString()
    };
}

    /* =====================================================
       2. TEXT HELPERS
       ===================================================== */

    function normalizeText(value) {
        return String(value || "")
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase();
    }
/* =====================================================
   3. SUBJECT INTELLIGENCE
   ===================================================== */

function detectSubject(prompt) {
    const subjectPatterns = [
        {
            pattern:
                /\bqr(?:\s+code)?\s+generator\b/i,
            label:
                "QR Code Generator"
        },
        {
            pattern:
                /\bbmi\s+calculator\b/i,
            label:
                "BMI Calculator"
        },
        {
            pattern:
                /\bscientific\s+calculator\b/i,
            label:
                "Scientific Calculator"
        },
        {
            pattern:
                /\bcompound\s+interest\s+calculator\b/i,
            label:
                "Compound Interest Calculator"
        },
        {
            pattern:
                /\bloan\s+(?:or\s+emi\s+)?calculator\b/i,
            label:
                "Loan Calculator"
        },
        {
            pattern:
                /\bcurrency\s+converter\b/i,
            label:
                "Currency Converter"
        },
        {
            pattern:
                /\bcoffee\s+shop\b/i,
            label:
                "Coffee Shop"
        },
        {
            pattern:
                /\brestaurant\b/i,
            label:
                "Restaurant"
        },
        {
            pattern:
                /\bwebsite\b/i,
            label:
                "Website"
        }
    ];

    const match =
        subjectPatterns.find(item => {
            return item.pattern.test(prompt);
        });

    return match
        ? match.label
        : detectGenericSubject(prompt);
}


function detectGenericSubject(prompt) {
    const patterns = [
        /\bpromote\s+(?:my|our|the)\s+([^,.]+)/i,
        /\bfor\s+(?:my|our|the)\s+([^,.]+)/i,
        /\bcreate\s+(?:a|an)\s+[^,.]*?\s+for\s+([^,.]+)/i
    ];

    for (const pattern of patterns) {
        const match =
            prompt.match(pattern);

        if (
            match &&
            match[1]
        ) {
            return titleCase(
                cleanSubject(match[1])
            );
        }
    }

    return "General Promotion";
}


function cleanSubject(value) {
    return String(value || "")
        .replace(
            /\b(?:tool|website|page|business|product)\b$/i,
            ""
        )
        .replace(
            /\b(?:that|which|with|and|it is|it's)\b.*$/i,
            ""
        )
        .trim();
}


function detectSubjectType(
    prompt,
    subject
) {
    if (
        /\bcalculator\b/i.test(subject) ||
        /\bconverter\b/i.test(subject) ||
        /\bgenerator\b/i.test(subject) ||
        /\btool\b/i.test(prompt)
    ) {
        return "digital-tool";
    }

    if (
        /\bcoffee shop\b/i.test(subject) ||
        /\brestaurant\b/i.test(subject) ||
        /\bbakery\b/i.test(subject)
    ) {
        return "local-business";
    }

    if (
        /\bproduct\b/i.test(prompt) ||
        /\bshop\b/i.test(prompt)
    ) {
        return "product";
    }

    if (
        /\bwebsite\b/i.test(subject)
    ) {
        return "website";
    }

    return "general";
}

/* =====================================================
   4. TOOL IDENTITY INTELLIGENCE
   ===================================================== */

function detectToolIdentity(
    prompt,
    subject
) {
    const combinedText =
        `${normalizeText(subject)} ${prompt}`;

    const profiles = [
        {
            id:
                "currency-converter",

            pattern:
                /\bcurrency\s+converter\b|\bexchange\s+rates?\b|\bforex\b/i,

            industry:
                "finance",

            category:
                "currency-exchange",

            hero:
                "currency-exchange",

            visualKeywords: [
                "currency symbols",
                "exchange arrows",
                "globe",
                "live rates",
                "financial chart"
            ],

            benefitIdeas: [
                "Live Exchange Rates",
                "190+ Currencies",
                "Instant Conversion"
            ],

            cta:
                "Convert Now"
        },

        {
            id:
                "qr-code-generator",

            pattern:
                /\bqr(?:\s+code)?\s+generator\b|\bqr\s+code\b/i,

            industry:
                "technology",

            category:
                "qr-generation",

            hero:
                "qr-code",

            visualKeywords: [
                "QR code",
                "smartphone scan",
                "digital grid",
                "download icon"
            ],

            benefitIdeas: [
                "Generate Instantly",
                "Download Free",
                "Easy to Scan"
            ],

            cta:
                "Create QR Code"
        },

        {
            id:
                "bmi-calculator",

            pattern:
                /\bbmi\s+calculator\b|\bbody\s+mass\s+index\b/i,

            industry:
                "health",

            category:
                "health-calculator",

            hero:
                "health-metrics",

            visualKeywords: [
                "healthy body",
                "BMI scale",
                "heartbeat",
                "health metrics"
            ],

            benefitIdeas: [
                "Check Your BMI",
                "Understand Your Range",
                "Instant Health Result"
            ],

            cta:
                "Calculate BMI"
        },

        {
            id:
                "loan-calculator",

            pattern:
                /\bloan\s+(?:or\s+emi\s+)?calculator\b|\bmonthly\s+payment\b/i,

            industry:
                "finance",

            category:
                "lending",

            hero:
                "loan-finance",

            visualKeywords: [
                "loan document",
                "monthly payment",
                "money",
                "finance chart"
            ],

            benefitIdeas: [
                "Estimate Monthly Payments",
                "See Total Interest",
                "Plan Your Loan"
            ],

            cta:
                "Calculate Loan"
        },

        {
            id:
                "compound-interest-calculator",

            pattern:
                /\bcompound\s+interest\s+calculator\b|\bcompound\s+growth\b/i,

            industry:
                "finance",

            category:
                "investment-growth",

            hero:
                "compound-growth",

            visualKeywords: [
                "growth chart",
                "investment",
                "coins",
                "upward arrow"
            ],

            benefitIdeas: [
                "Project Future Value",
                "Track Contributions",
                "Estimate Growth"
            ],

            cta:
                "Calculate Growth"
        },

        {
            id:
                "scientific-calculator",

            pattern:
                /\bscientific\s+calculator\b/i,

            industry:
                "education",

            category:
                "mathematics",

            hero:
                "scientific-math",

            visualKeywords: [
                "mathematical symbols",
                "formula",
                "calculator",
                "science grid"
            ],

            benefitIdeas: [
                "Advanced Calculations",
                "Scientific Functions",
                "Fast Accurate Results"
            ],

            cta:
                "Calculate Now"
        }
    ];

    const match =
        profiles.find(profile => {
            return profile.pattern.test(
                combinedText
            );
        });

    if (match) {
        return {
            ...match,
            confidence: 1
        };
    }

    return {
        id:
            "general-digital-tool",

        industry:
            "technology",

        category:
            "digital-tool",

        hero:
            "digital-tool",

        visualKeywords: [
            "modern interface",
            "digital utility",
            "simple workflow"
        ],

        benefitIdeas: [
            "Fast Results",
            "Easy to Use",
            "Available Online"
        ],

        cta:
            "Try It Now",

        confidence:
            0.35
    };
}

/* =====================================================
   5. INTENT INTELLIGENCE
   ===================================================== */

function detectOffer(prompt) {
    const offers = [];

    if (
        /\b100%\s*free\b/i.test(prompt) ||
        /\bcompletely free\b/i.test(prompt) ||
        /\bfree\b/i.test(prompt)
    ) {
        offers.push("free");
    }

    if (
        /\bdiscount\b/i.test(prompt) ||
        /\bsale\b/i.test(prompt) ||
        /\boffer\b/i.test(prompt)
    ) {
        offers.push("discount");
    }

    if (
        /\bnew\b/i.test(prompt) ||
        /\blaunched?\b/i.test(prompt)
    ) {
        offers.push("new");
    }

    if (
        /\binstant\b/i.test(prompt) ||
        /\bfast\b/i.test(prompt) ||
        /\bseconds?\b/i.test(prompt)
    ) {
        offers.push("fast");
    }

    return offers;
}


function detectGoal(prompt) {
    if (
        /\btraffic\b/i.test(prompt) ||
        /\bvisit\b/i.test(prompt) ||
        /\bclick\b/i.test(prompt)
    ) {
        return "website-traffic";
    }

    if (
        /\bsale\b/i.test(prompt) ||
        /\bdiscount\b/i.test(prompt) ||
        /\bbuy\b/i.test(prompt)
    ) {
        return "sale";
    }

    if (
        /\blaunch\b/i.test(prompt) ||
        /\bnew\b/i.test(prompt)
    ) {
        return "launch";
    }

    if (
        /\bdownload\b/i.test(prompt) ||
        /\btry\b/i.test(prompt) ||
        /\buse\b/i.test(prompt)
    ) {
        return "action";
    }

    return "promotion";
}


function detectPlatform(prompt) {
    if (
        /\bpinterest\b/i.test(prompt) ||
        /\bpin\b/i.test(prompt)
    ) {
        return "pinterest";
    }

    if (
        /\binstagram story\b/i.test(prompt)
    ) {
        return "instagram-story";
    }

    if (
        /\binstagram\b/i.test(prompt)
    ) {
        return "instagram";
    }

    if (
        /\bfacebook\b/i.test(prompt)
    ) {
        return "facebook";
    }

    if (
        /\blinkedin\b/i.test(prompt)
    ) {
        return "linkedin";
    }

    if (
        /\byoutube thumbnail\b/i.test(prompt)
    ) {
        return "youtube";
    }

    return "";
}

/* =====================================================
   6. KEYWORD INTELLIGENCE
   ===================================================== */

function extractKeywords(
    prompt,
    subject
) {
    const stopWords =
        new Set([
            "create",
            "make",
            "design",
            "promote",
            "banner",
            "post",
            "pin",
            "image",
            "for",
            "the",
            "and",
            "with",
            "from",
            "your",
            "my",
            "our",
            "this",
            "that",
            "tool",
            "website"
        ]);

    const subjectWords =
        normalizeText(subject)
            .split(/\s+/);

    const promptWords =
        prompt
            .replace(
                /[^a-z0-9%\s-]/gi,
                " "
            )
            .split(/\s+/)
            .filter(Boolean);

    const combined =
        [
            ...subjectWords,
            ...promptWords
        ];

    return [
        ...new Set(
            combined.filter(word => {
                return (
                    word.length > 2 &&
                    !stopWords.has(word)
                );
            })
        )
    ].slice(0, 12);
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
       7. PUBLIC API
       ===================================================== */

    return {
        analyzePrompt
    };

})();