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

window.ToolXoneCreativeBrain = (function () {
    "use strict";


    /* =====================================================
   1. ANALYZE USER PROMPT
   ===================================================== */

function analyzePrompt(prompt, context = {}) {
    const originalPrompt =
        String(prompt || "").trim();

    const normalizedPrompt =
        normalizeText(originalPrompt);

    const subject =
        detectSubject(normalizedPrompt);

    const subjectType =
        detectSubjectType(
            normalizedPrompt,
            subject
        );

    const offer =
        detectOffer(normalizedPrompt);

    const goal =
        detectGoal(normalizedPrompt);

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
            detectPlatform(normalizedPrompt) ||
            "facebook",

        tone:
            context.tone ||
            "automatic",

        language:
            context.language ||
            "english",

        subject,
        subjectType,
        offer,
        goal,
        keywords,

        createdAt:
            new Date().toISOString()
    };
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
   4. INTENT INTELLIGENCE
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
   5. KEYWORD INTELLIGENCE
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
       6. PUBLIC API
       ===================================================== */

    return {
        analyzePrompt
    };

})();