/* =====================================================
   ToolXone Phoenix AI
   GIANT LEAP 13
   COLOR INTELLIGENCE ENGINE
===================================================== */

(function () {

"use strict";


/* =====================================================
   COLOR UTILITIES
===================================================== */

function normalizeText(
    value = ""
) {

    return String(value)
        .trim()
        .toLowerCase();
}


function hashText(
    value = ""
) {

    const text =
        normalizeText(value);

    let hash = 0;

    for (
        let index = 0;
        index < text.length;
        index += 1
    ) {

        hash =
            (
                (hash << 5) -
                hash
            ) +
            text.charCodeAt(index);

        hash |= 0;
    }

    return Math.abs(hash);
}


function selectFromList(
    list = [],
    seed = ""
) {

    if (
        !Array.isArray(list) ||
        list.length === 0
    ) {
        return null;
    }

    const index =
        hashText(seed) %
        list.length;

    return list[index];
}

/* =====================================================
   COLOR PERSONALITY LIBRARY
===================================================== */

const COLOR_PERSONALITIES = {

    finance: [

        {
            id: "emerald-trust",

            background:
                "#0F172A",

            primary:
                "#10B981",

            secondary:
                "#22D3EE",

            accent:
                "#F8FAFC",

            emotion:
                "trust"
        },

        {
            id: "navy-growth",

            background:
                "#172554",

            primary:
                "#38BDF8",

            secondary:
                "#14B8A6",

            accent:
                "#FFFFFF",

            emotion:
                "growth"
        },

        {
            id: "charcoal-fintech",

            background:
                "#111827",

            primary:
                "#34D399",

            secondary:
                "#60A5FA",

            accent:
                "#F9FAFB",

            emotion:
                "innovation"
        }

    ],


    travel: [

        {
            id: "sky-journey",

            background:
                "#0EA5E9",

            primary:
                "#FFFFFF",

            secondary:
                "#FBBF24",

            accent:
                "#0F172A",

            emotion:
                "freedom"
        },

        {
            id: "sunset-trip",

            background:
                "#F97316",

            primary:
                "#FFF7ED",

            secondary:
                "#38BDF8",

            accent:
                "#111827",

            emotion:
                "adventure"
        }

    ],


    technology: [

        {
            id: "future-indigo",

            background:
                "#1E1B4B",

            primary:
                "#8B5CF6",

            secondary:
                "#22D3EE",

            accent:
                "#FFFFFF",

            emotion:
                "innovation"
        },

        {
            id: "cyber-blue",

            background:
                "#082F49",

            primary:
                "#38BDF8",

            secondary:
                "#818CF8",

            accent:
                "#F8FAFC",

            emotion:
                "future"
        }

    ],


    general: [

        {
            id: "toolxone",

            background:
                "#065F46",

            primary:
                "#10B981",

            secondary:
                "#22D3EE",

            accent:
                "#FFFFFF",

            emotion:
                "friendly"
        }

    ]

};

/* =====================================================
   COLOR CATEGORY DETECTION
===================================================== */

function detectColorCategory(
    analysis = {}
) {

    const subject =
        normalizeText(
            analysis.subject
        );

    const category =
        normalizeText(
            analysis.category
        );

    const toolId =
        normalizeText(
            analysis.toolId
        );

    const combined =
        `${subject} ${category} ${toolId}`;

    if (
        /\b(currency|finance|loan|money|bank|roi|investment|tax|calculator|mortgage|profit|forex|exchange)\b/
            .test(combined)
    ) {
        return "finance";
    }

    if (
        /\b(travel|trip|tour|vacation|hotel|flight|tourism|passport)\b/
            .test(combined)
    ) {
        return "travel";
    }

    if (
        /\b(ai|technology|software|startup|robot|coding|developer|digital|app|tech)\b/
            .test(combined)
    ) {
        return "technology";
    }

    return "general";
}

/* =====================================================
   COLOR PERSONALITY SELECTION
===================================================== */

function selectColorPersonality(
    analysis = {}
) {

    const category =
        detectColorCategory(
            analysis
        );

    const personalities =
        COLOR_PERSONALITIES[
            category
        ] ||
        COLOR_PERSONALITIES.general;

    const seed = [

        analysis.subject,
        analysis.category,
        analysis.toolId,
        analysis.platform

    ].join("|");

    return selectFromList(
        personalities,
        seed
    );

}

/* =====================================================
   COLOR DNA CREATION
===================================================== */

function createColorDNA(
    analysis = {}
) {

    const category =
        detectColorCategory(
            analysis
        );

    const personality =
        selectColorPersonality(
            analysis
        );

    const safePersonality =
        personality ||
        COLOR_PERSONALITIES.general[0];

    return Object.freeze({

        category,

        personalityId:
            safePersonality.id,

        emotion:
            safePersonality.emotion,

        background:
            safePersonality.background,

        primary:
            safePersonality.primary,

        secondary:
            safePersonality.secondary,

        accent:
            safePersonality.accent,

        seed: [

            analysis.subject,
            analysis.category,
            analysis.toolId,
            analysis.platform

        ]
            .map(
                value =>
                    normalizeText(value)
            )
            .join("|")

    });

}

/* =====================================================
   PUBLIC API
===================================================== */

window.ToolXoneColorIntelligence =
    Object.freeze({

        detectColorCategory,

        selectColorPersonality,

        createColorDNA

    });
    
/* =====================================================
   END COLOR INTELLIGENCE ENGINE
===================================================== */


})();