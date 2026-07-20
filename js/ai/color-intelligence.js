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

function normalizeColorPreference(
    value = "auto"
) {
    const preference =
        normalizeText(value);

    const supportedPreferences = [
        "auto",
        "professional",
        "bold",
        "modern",
        "elegant",
        "playful",
        "warm",
        "cool",
        "dark",
        "light"
    ];

    return supportedPreferences.includes(
        preference
    )
        ? preference
        : "auto";
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
            styles: [
                "professional",
                "modern",
                "dark"
            ],
            background: "#0F172A",
            primary: "#10B981",
            secondary: "#22D3EE",
            accent: "#F8FAFC",
            surface: "#1E293B",
            text: "#FFFFFF",
            emotion: "trust"
        },
        {
            id: "navy-growth",
            styles: [
                "professional",
                "cool",
                "dark"
            ],
            background: "#172554",
            primary: "#38BDF8",
            secondary: "#14B8A6",
            accent: "#FFFFFF",
            surface: "#1E3A8A",
            text: "#FFFFFF",
            emotion: "growth"
        },
        {
            id: "gold-premium",
            styles: [
                "elegant",
                "professional",
                "dark"
            ],
            background: "#18181B",
            primary: "#FBBF24",
            secondary: "#F59E0B",
            accent: "#FFF7ED",
            surface: "#27272A",
            text: "#FFFFFF",
            emotion: "premium"
        },
        {
            id: "clean-finance",
            styles: [
                "light",
                "professional",
                "modern"
            ],
            background: "#F8FAFC",
            primary: "#0369A1",
            secondary: "#059669",
            accent: "#0F172A",
            surface: "#FFFFFF",
            text: "#0F172A",
            emotion: "clarity"
        },
        {
            id: "bold-investment",
            styles: [
                "bold",
                "warm",
                "dark"
            ],
            background: "#3F0D12",
            primary: "#F97316",
            secondary: "#FACC15",
            accent: "#FFF7ED",
            surface: "#581C1C",
            text: "#FFFFFF",
            emotion: "ambition"
        }
    ],

    travel: [
        {
            id: "sky-journey",
            styles: [
                "cool",
                "light",
                "playful"
            ],
            background: "#0EA5E9",
            primary: "#FFFFFF",
            secondary: "#FBBF24",
            accent: "#0F172A",
            surface: "#E0F2FE",
            text: "#FFFFFF",
            emotion: "freedom"
        },
        {
            id: "sunset-trip",
            styles: [
                "warm",
                "bold",
                "playful"
            ],
            background: "#F97316",
            primary: "#FFF7ED",
            secondary: "#38BDF8",
            accent: "#111827",
            surface: "#FFEDD5",
            text: "#FFFFFF",
            emotion: "adventure"
        },
        {
            id: "tropical-escape",
            styles: [
                "playful",
                "modern",
                "cool"
            ],
            background: "#0F766E",
            primary: "#5EEAD4",
            secondary: "#FDE047",
            accent: "#FFFFFF",
            surface: "#115E59",
            text: "#FFFFFF",
            emotion: "escape"
        },
        {
            id: "luxury-voyage",
            styles: [
                "elegant",
                "professional",
                "dark"
            ],
            background: "#312E81",
            primary: "#C4B5FD",
            secondary: "#F5D0FE",
            accent: "#FFFFFF",
            surface: "#3730A3",
            text: "#FFFFFF",
            emotion: "luxury"
        }
    ],

    technology: [
        {
            id: "future-indigo",
            styles: [
                "modern",
                "bold",
                "dark"
            ],
            background: "#1E1B4B",
            primary: "#8B5CF6",
            secondary: "#22D3EE",
            accent: "#FFFFFF",
            surface: "#312E81",
            text: "#FFFFFF",
            emotion: "innovation"
        },
        {
            id: "cyber-blue",
            styles: [
                "cool",
                "professional",
                "dark"
            ],
            background: "#082F49",
            primary: "#38BDF8",
            secondary: "#818CF8",
            accent: "#F8FAFC",
            surface: "#0C4A6E",
            text: "#FFFFFF",
            emotion: "future"
        },
        {
            id: "neon-system",
            styles: [
                "bold",
                "playful",
                "dark"
            ],
            background: "#09090B",
            primary: "#A3E635",
            secondary: "#22D3EE",
            accent: "#F0FDF4",
            surface: "#18181B",
            text: "#FFFFFF",
            emotion: "energy"
        },
        {
            id: "clean-startup",
            styles: [
                "light",
                "modern",
                "professional"
            ],
            background: "#F1F5F9",
            primary: "#4F46E5",
            secondary: "#06B6D4",
            accent: "#0F172A",
            surface: "#FFFFFF",
            text: "#0F172A",
            emotion: "clarity"
        },
        {
            id: "creative-ai",
            styles: [
                "playful",
                "bold",
                "modern"
            ],
            background: "#581C87",
            primary: "#E879F9",
            secondary: "#FACC15",
            accent: "#FFFFFF",
            surface: "#701A75",
            text: "#FFFFFF",
            emotion: "creativity"
        }
    ],

    general: [
        {
            id: "toolxone-emerald",
            styles: [
                "professional",
                "modern",
                "dark"
            ],
            background: "#065F46",
            primary: "#10B981",
            secondary: "#22D3EE",
            accent: "#FFFFFF",
            surface: "#047857",
            text: "#FFFFFF",
            emotion: "friendly"
        },
        {
            id: "royal-blue",
            styles: [
                "professional",
                "cool",
                "bold"
            ],
            background: "#1E3A8A",
            primary: "#60A5FA",
            secondary: "#C4B5FD",
            accent: "#FFFFFF",
            surface: "#1D4ED8",
            text: "#FFFFFF",
            emotion: "confidence"
        },
        {
            id: "warm-coral",
            styles: [
                "warm",
                "playful",
                "bold"
            ],
            background: "#9F1239",
            primary: "#FB7185",
            secondary: "#FBBF24",
            accent: "#FFF7ED",
            surface: "#BE123C",
            text: "#FFFFFF",
            emotion: "energy"
        },
        {
            id: "purple-creative",
            styles: [
                "playful",
                "modern",
                "bold"
            ],
            background: "#4C1D95",
            primary: "#C084FC",
            secondary: "#F472B6",
            accent: "#FFFFFF",
            surface: "#6B21A8",
            text: "#FFFFFF",
            emotion: "creativity"
        },
        {
            id: "minimal-light",
            styles: [
                "light",
                "professional",
                "elegant"
            ],
            background: "#F8FAFC",
            primary: "#334155",
            secondary: "#0EA5E9",
            accent: "#0F172A",
            surface: "#FFFFFF",
            text: "#0F172A",
            emotion: "simplicity"
        },
        {
            id: "midnight-gold",
            styles: [
                "elegant",
                "dark",
                "professional"
            ],
            background: "#18181B",
            primary: "#FBBF24",
            secondary: "#D97706",
            accent: "#FFFFFF",
            surface: "#27272A",
            text: "#FFFFFF",
            emotion: "luxury"
        },
        {
            id: "fresh-lime",
            styles: [
                "playful",
                "light",
                "modern"
            ],
            background: "#ECFCCB",
            primary: "#3F6212",
            secondary: "#06B6D4",
            accent: "#1A2E05",
            surface: "#FFFFFF",
            text: "#1A2E05",
            emotion: "freshness"
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

    const allPersonalities =
        COLOR_PERSONALITIES[
            category
        ] ||
        COLOR_PERSONALITIES.general;

    const colorPreference =
        normalizeColorPreference(
            analysis.colorPreference ||
            analysis.paletteStyle ||
            analysis.colorStyle ||
            "auto"
        );

    const matchingPersonalities =
        colorPreference === "auto"
            ? allPersonalities
            : allPersonalities.filter(
                  personality =>
                      Array.isArray(
                          personality.styles
                      ) &&
                      personality.styles.includes(
                          colorPreference
                      )
              );

    const availablePersonalities =
        matchingPersonalities.length
            ? matchingPersonalities
            : allPersonalities;

    const seed = [
        analysis.subject,
        analysis.category,
        analysis.toolId,
        analysis.platform,
        colorPreference,
        analysis.paletteVariation ||
            analysis.regenerationIndex ||
            0
    ].join("|");

    return selectFromList(
        availablePersonalities,
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

    colorPreference:
        normalizeColorPreference(
            analysis.colorPreference ||
            analysis.paletteStyle ||
            analysis.colorStyle ||
            "auto"
        ),

    styles:
        Array.isArray(
            safePersonality.styles
        )
            ? [...safePersonality.styles]
            : [],

    background:
        safePersonality.background,

    primary:
        safePersonality.primary,

    secondary:
        safePersonality.secondary,

    accent:
        safePersonality.accent,

    surface:
        safePersonality.surface ||
        "#FFFFFF",

    text:
        safePersonality.text ||
        safePersonality.accent,

    seed: [
        analysis.subject,
        analysis.category,
        analysis.toolId,
        analysis.platform,
        analysis.colorPreference,
        analysis.paletteVariation ||
            analysis.regenerationIndex ||
            0
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