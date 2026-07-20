/* =====================================================
   ToolXone Phoenix AI
   GIANT LEAP 12
   TYPOGRAPHY INTELLIGENCE ENGINE
   ---------------------------------------------
   Decides HOW the message should be presented.

   This engine controls:

   • Visual hierarchy
   • Reading rhythm
   • Line breaking
   • Word emphasis
   • Typography scale
   • Platform adaptation
   • Emotional typography

   It does NOT render fonts.

   It decides how designers THINK.

===================================================== */

(function () {

"use strict";

/* =====================================================
   HEADLINE IMPORTANCE
===================================================== */

function determineHeadlineImportance(
    copyDNA = {},
    designDNA = {}
) {

    const headline =
        String(
            copyDNA.headline || ""
        ).trim();

    const wordCount =
        headline
            .split(/\s+/)
            .filter(Boolean)
            .length;

    const style =
        designDNA.style ||
        "";

    let importance = "high";

    if (wordCount <= 3) {
        importance = "hero";
    }
    else if (wordCount <= 7) {
        importance = "high";
    }
    else if (wordCount <= 12) {
        importance = "medium";
    }
    else {
        importance = "balanced";
    }

    if (
        style === "luxury" &&
        importance !== "balanced"
    ) {
        importance = "hero";
    }

    if (
        style === "editorial"
    ) {
        importance = "medium";
    }

    return {
        importance,
        wordCount
    };

}

/* =====================================================
   HEADLINE SHAPE
===================================================== */

function determineHeadlineShape(
    copyDNA = {},
    platform = "facebook"
) {
    const headline =
        String(
            copyDNA.headline || ""
        ).trim();

    const words =
        headline
            .split(/\s+/)
            .filter(Boolean);

    const wordCount =
        words.length;

    const characterCount =
        headline.length;

    const longestWordLength =
        words.reduce(
            (maximum, word) => {
                const cleanWord =
                    word.replace(
                        /[^a-z0-9]/gi,
                        ""
                    );

                return Math.max(
                    maximum,
                    cleanWord.length
                );
            },
            0
        );

    const normalizedPlatform =
        String(
            platform || "facebook"
        ).toLowerCase();

    const isPortrait =
        normalizedPlatform === "pinterest" ||
        normalizedPlatform === "pinterest-pin" ||
        normalizedPlatform === "instagram-story" ||
        normalizedPlatform === "story";

    const isLandscape =
        normalizedPlatform === "facebook" ||
        normalizedPlatform === "facebook-post" ||
        normalizedPlatform === "facebook-banner" ||
        normalizedPlatform === "linkedin" ||
        normalizedPlatform === "youtube" ||
        normalizedPlatform === "youtube-thumbnail";

    let preferredLines = 3;
    let maxWordsPerLine = 4;
    let density = "balanced";
    let pressure = "normal";


    /* -------------------------------------------------
       CONTENT-DRIVEN LINE STRATEGY
    ------------------------------------------------- */

    if (wordCount <= 2) {
        preferredLines = 1;
        maxWordsPerLine = 2;
        density = "spacious";
    }
    else if (wordCount <= 4) {
        preferredLines = 2;
        maxWordsPerLine = 2;
        density = "spacious";
    }
    else if (wordCount <= 7) {
        preferredLines =
            isPortrait
                ? 3
                : 2;

        maxWordsPerLine =
            isPortrait
                ? 3
                : 4;

        density = "balanced";
    }
    else if (wordCount <= 10) {
        preferredLines =
            isPortrait
                ? 4
                : 3;

        maxWordsPerLine = 3;
        density = "compact";
    }
    else {
        preferredLines =
            isPortrait
                ? 5
                : 4;

        maxWordsPerLine = 3;
        density = "dense";
    }


    /* -------------------------------------------------
       LONG-WORD PRESSURE
    ------------------------------------------------- */

    if (
        longestWordLength > 13
    ) {
        preferredLines += 1;
        maxWordsPerLine =
            Math.min(
                maxWordsPerLine,
                2
            );

        density = "dense";
        pressure = "extreme";
    }
    else if (
        longestWordLength > 10
    ) {
        maxWordsPerLine =
            Math.min(
                maxWordsPerLine,
                3
            );

        pressure = "high";
    }


    /* -------------------------------------------------
       CHARACTER PRESSURE
    ------------------------------------------------- */

    const highCharacterPressure =
        characterCount >
        (
            isPortrait
                ? 44
                : 54
        );

    const extremeCharacterPressure =
        characterCount >
        (
            isPortrait
                ? 58
                : 68
        );

    if (extremeCharacterPressure) {
        preferredLines += 1;
        density = "dense";
        pressure = "extreme";
    }
    else if (
        highCharacterPressure &&
        pressure === "normal"
    ) {
        density = "compact";
        pressure = "high";
    }


    /* -------------------------------------------------
       PLATFORM SAFETY LIMITS
    ------------------------------------------------- */

    const maximumLines =
        isPortrait
            ? 5
            : isLandscape
                ? 4
                : 4;

    preferredLines =
        Math.max(
            1,
            Math.min(
                preferredLines,
                maximumLines
            )
        );


    return {
        wordCount,
        characterCount,
        longestWordLength,
        preferredLines,
        maxWordsPerLine,
        density,
        pressure
    };
}

/* =====================================================
   TYPOGRAPHY SCALE STRATEGY
===================================================== */

function determineTypographyScale({
    importance = {},
    shape = {},
    compositionDNA = {},
    platform = "facebook",
    headline = ""
} = {}) {
    const normalizedPlatform =
        String(
            platform || "facebook"
        ).toLowerCase();

    const normalizedHeadline =
        String(
            headline || ""
        )
            .trim();

    const words =
        normalizedHeadline
            .split(/\s+/)
            .filter(Boolean);

    const headlineLength =
        normalizedHeadline.length;

    const longestWordLength =
        words.reduce(
            (maximum, word) => {
                const cleanWord =
                    word.replace(
                        /[^a-z0-9]/gi,
                        ""
                    );

                return Math.max(
                    maximum,
                    cleanWord.length
                );
            },
            0
        );

    const headlineImportance =
        String(
            importance.importance ||
            "high"
        ).toLowerCase();

    const density =
        String(
            shape.density ||
            "balanced"
        ).toLowerCase();

    const copyImportance =
        Number.isFinite(
            compositionDNA.copyImportance
        )
            ? compositionDNA.copyImportance
            : 50;

    const isPortrait =
        normalizedPlatform === "pinterest" ||
        normalizedPlatform === "pinterest-pin" ||
        normalizedPlatform === "instagram-portrait" ||
        normalizedPlatform === "instagram-story" ||
        normalizedPlatform === "story";

    let scale =
        "large";

    let weight =
        900;

    let lineHeight =
        1;

    let letterSpacing =
        "-0.035em";


    /* -------------------------------------------------
       IMPORTANCE-BASED TYPOGRAPHY
    ------------------------------------------------- */

    if (
        headlineImportance === "hero"
    ) {
        scale =
            "display";

        weight =
            900;

        lineHeight =
            0.96;

        letterSpacing =
            "-0.045em";
    }
    else if (
        headlineImportance === "medium"
    ) {
        scale =
            "medium";

        weight =
            800;

        lineHeight =
            1.05;

        letterSpacing =
            "-0.025em";
    }
    else if (
        headlineImportance === "balanced"
    ) {
        scale =
            "compact";

        weight =
            800;

        lineHeight =
            1.08;

        letterSpacing =
            "-0.015em";
    }


    /* -------------------------------------------------
       DENSITY-BASED TYPOGRAPHY
    ------------------------------------------------- */

    if (
        density === "compact" ||
        density === "dense"
    ) {
        scale =
            density === "dense"
                ? "compact"
                : "medium";

        lineHeight =
            density === "dense"
                ? 1.1
                : 1.06;
    }


    /* -------------------------------------------------
       COPY-PRIORITY ADJUSTMENT
    ------------------------------------------------- */

    if (
        copyImportance >= 65 &&
        scale === "compact"
    ) {
        scale =
            "medium";
    }


    /* -------------------------------------------------
       ADAPTIVE HEADLINE PRESSURE
    ------------------------------------------------- */

    const extremePressure =
        headlineLength > (
            isPortrait
                ? 48
                : 58
        ) ||
        longestWordLength > 13;

    const highPressure =
        headlineLength > (
            isPortrait
                ? 34
                : 44
        ) ||
        longestWordLength > 10;

    if (extremePressure) {
        scale =
            "compact";

        lineHeight =
            1.08;

        letterSpacing =
            "-0.01em";
    }
    else if (highPressure) {
        if (
            scale === "display" ||
            scale === "large"
        ) {
            scale =
                "medium";
        }

        lineHeight =
            Math.max(
                lineHeight,
                1.05
            );

        letterSpacing =
            "-0.02em";
    }


    /* -------------------------------------------------
       PLATFORM SAFETY
    ------------------------------------------------- */

    if (isPortrait) {
        lineHeight =
            Math.max(
                lineHeight,
                1
            );
    }


    return {
        scale,
        weight,
        lineHeight,
        letterSpacing,

        headlineLength,
        longestWordLength,

        pressure:
            extremePressure
                ? "extreme"
                : highPressure
                    ? "high"
                    : "normal"
    };
}

/* =====================================================
   CREATE TYPOGRAPHY DNA
===================================================== */

function createTypographyDNA({
    analysis = {},
    designDNA = {},
    copyDNA = {},
    compositionDNA = {}
} = {}) {
    const platform =
        String(
            analysis.platform ||
            designDNA.layout?.platform ||
            copyDNA.platform ||
            "facebook"
        ).toLowerCase();

    const importance =
        determineHeadlineImportance(
            copyDNA,
            designDNA
        );

    const shape =
        determineHeadlineShape(
            copyDNA,
            platform
        );

    const scale =
    determineTypographyScale({
        importance,
        shape,
        compositionDNA,
        platform,

        headline:
            copyDNA.headline ||
            ""
    });

    return {
        platform,

        headline: {
            ...importance,
            ...shape,
            ...scale
        },

        supportingText: {
            density:
                shape.density === "dense"
                    ? "compact"
                    : "comfortable",

            emphasis:
                compositionDNA.copyImportance >= 65
                    ? "high"
                    : "normal"
        },

        cta: {
            emphasis:
                compositionDNA.visualPriority === "cta"
                    ? "high"
                    : "normal"
        },

        createdAt:
            new Date().toISOString()
    };
}

/* =====================================================
   PUBLIC API
===================================================== */

window.ToolXoneTypographyEngine =
    Object.freeze({
        createTypographyDNA,
        determineHeadlineImportance,
        determineHeadlineShape,
        determineTypographyScale
    });

})();