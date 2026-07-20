/*
==========================================================
TOOLXONE PHOENIX AI
COMPOSITION ENGINE

Responsibility
--------------
Decide HOW the design should be composed.

This engine does NOT:

- generate copy
- choose colors
- render graphics

It only decides visual hierarchy.

Input
-----
Creative Brain
Design DNA
Copy DNA

Output
------
Composition DNA

Examples

- Hero-first
- Copy-first
- Balanced
- Editorial
- Product spotlight
- Minimal

==========================================================
*/

window.ToolXoneCompositionEngine = (function () {

"use strict";

/* =====================================================
   CREATE COMPOSITION DNA
===================================================== */

function createCompositionDNA({

    analysis,

    designDNA,

    copyDNA

} = {}) {

    if (
        !analysis ||
        !designDNA
    ) {
        return null;
    }

    /* -------------------------------------------------
       RESOLVE PLATFORM SAFELY
    ------------------------------------------------- */

    const platform =
        String(
            analysis.platform?.id ||
            analysis.platform ||
            designDNA.layout?.platform?.id ||
            designDNA.layout?.platform ||
            designDNA.platform?.id ||
            designDNA.platform ||
            "facebook"
        )
            .trim()
            .toLowerCase();

    const headlineLength =
        String(
            copyDNA?.headline ||
            ""
        ).length;

    /* -------------------------------------------------
       BASE COMPOSITION
    ------------------------------------------------- */

    const composition = {

        platform,

        strategy:
            "balanced",

        visualPriority:
            "hero",

        heroImportance:
            50,

        copyImportance:
            50,

        contentWidthPercent:
            56,

        heroScalePercent:
            40,

        contentAlignment:
            "left",

        heroPosition:
            "right",

        visualBalance:
            "balanced",

        whitespace:
            "comfortable",

        hierarchy: [
            "headline",
            "hero",
            "supporting",
            "cta"
        ],

        emphasis:
            "balanced",

        zones: {

            content: {
                column: "2",
                row: "2 / 6",
                justify: "start",
                align: "stretch"
            },

            hero: {
                column: "2",
                row: "2 / 6",
                justify: "end",
                align: "center"
            },

            supporting: {
                column: "2",
                row: "5",
                justify: "start",
                align: "center"
            },

            cta: {
                column: "2",
                row: "6",
                justify: "start",
                align: "center"
            },

            branding: {
                column: "2",
                row: "2",
                justify: "start",
                align: "start"
            }
        }
    };

    /* -------------------------------------------------
   LANDSCAPE PLATFORMS
------------------------------------------------- */

if (
    platform.includes("facebook") ||
    platform.includes("linkedin") ||
    platform === "x" ||
    platform.includes("twitter") ||
    platform.includes("youtube") ||
    platform.includes("medium")
) {
    composition.strategy =
        "horizontal-split";

    composition.contentWidthPercent =
        headlineLength > 42
            ? 48
            : 52;

    composition.heroScalePercent =
        34;

    composition.contentAlignment =
        "left";

    composition.heroPosition =
        "right";

    composition.visualBalance =
        "copy-left-hero-right";


    /* CONTENT */

    composition.zones.content.column =
        "2 / 7";

    composition.zones.content.row =
        "2 / 6";

    composition.zones.content.justify =
        "center";

    composition.zones.content.align =
        "start";


    /* HERO */

    composition.zones.hero.column =
        "7 / 12";

    composition.zones.hero.row =
        "2 / 6";

    composition.zones.hero.justify =
        "center";

    composition.zones.hero.align =
        "center";


    /* BRANDING */

    composition.zones.branding.column =
        "2 / 7";

    composition.zones.branding.row =
        "1";

    composition.zones.branding.justify =
        "start";

    composition.zones.branding.align =
        "start";


    /* CTA */

    composition.zones.cta.column =
        "2 / 7";

    composition.zones.cta.row =
        "6";

    composition.zones.cta.justify =
        "start";

    composition.zones.cta.align =
        "center";
}

    /* -------------------------------------------------
       PINTEREST / PORTRAIT PLATFORMS
    ------------------------------------------------- */

    if (
        platform.includes("pinterest") ||
        platform.includes("portrait")
    ) {
        composition.strategy =
            "vertical-stack";

        composition.visualPriority =
            "copy";

        composition.heroImportance =
            42;

        composition.copyImportance =
            58;

        composition.contentWidthPercent =
            88;

        composition.heroScalePercent =
            58;

        composition.contentAlignment =
            "center";

        composition.heroPosition =
            "center";

        composition.visualBalance =
            "copy-top-hero-middle";

        composition.whitespace =
            "compact";

        composition.zones.content.column =
    "2 / 12";

composition.zones.content.row =
    "2 / 5";

composition.zones.content.justify =
    "center";

composition.zones.content.align =
    "stretch";


composition.zones.hero.column =
    "2 / 12";

composition.zones.hero.row =
    "5";

composition.zones.hero.justify =
    "stretch";

composition.zones.hero.align =
    "stretch";


composition.zones.supporting.column =
    "2 / 12";

composition.zones.supporting.row =
    "4";

composition.zones.supporting.justify =
    "center";


composition.zones.cta.column =
    "2 / 12";

composition.zones.cta.row =
    "6";

composition.zones.cta.justify =
    "center";


composition.zones.branding.column =
    "2 / 12";

composition.zones.branding.row =
    "1";

composition.zones.branding.justify =
    "center";

    }

    /* -------------------------------------------------
       SQUARE PLATFORMS
    ------------------------------------------------- */

    if (
        platform.includes("instagram") ||
        platform.includes("square")
    ) {
        composition.strategy =
            "balanced-stack";

        composition.contentWidthPercent =
            78;

        composition.heroScalePercent =
            36;

        composition.contentAlignment =
            "center";

        composition.heroPosition =
            "center";

        composition.visualBalance =
            "centered";

        composition.zones.content.row =
            "2 / 4";

        composition.zones.content.justify =
            "center";

        composition.zones.content.align =
            "stretch";

        composition.zones.hero.row =
            "4 / 6";

        composition.zones.hero.justify =
            "center";

        composition.zones.cta.justify =
            "center";
    }

    /* -------------------------------------------------
       STORY PLATFORMS
    ------------------------------------------------- */

    if (
        platform.includes("story") ||
        platform.includes("9:16")
    ) {
        composition.strategy =
            "vertical-story";

        composition.contentWidthPercent =
            86;

        composition.heroScalePercent =
            32;

        composition.contentAlignment =
            "center";

        composition.heroPosition =
            "center";

        composition.visualBalance =
            "vertical";

        composition.whitespace =
            "compact";

        composition.zones.content.row =
            "2 / 4";

        composition.zones.content.justify =
            "center";

        composition.zones.content.align =
            "stretch";

        composition.zones.hero.row =
            "4 / 6";

        composition.zones.hero.justify =
            "center";

        composition.zones.cta.row =
            "6";

        composition.zones.cta.justify =
            "center";
    }

    return Object.freeze(
        composition
    );
}

/* =====================================================
   PUBLIC API
   ===================================================== */

return Object.freeze({

    createCompositionDNA

});

})();