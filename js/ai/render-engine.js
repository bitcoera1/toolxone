/*
==========================================================
TOOLXONE PHOENIX AI RENDER ENGINE
----------------------------------------------------------

Purpose
-------
Transforms Design DNA and Copy DNA into a layered,
render-ready Phoenix design.

Input
-----
Design DNA
Copy DNA
Render Options

Output
------
A structured HTML design mounted inside a target element.

Rendering Layers
----------------
1. Background
2. Decorations
3. Hero
4. Content
5. CTA
6. Branding

==========================================================
*/

(function () {
    "use strict";

/* =====================================================
   LAYOUT METRICS COLLECTOR
===================================================== */

function collectLayoutMetrics(
    canvas
) {
    if (!canvas) {
        return null;
    }

    const headline =
        canvas.querySelector(
            ".phoenix-render-headline"
        );

    const support =
        canvas.querySelector(
            ".phoenix-render-support"
        );

    const benefits =
        canvas.querySelector(
            ".phoenix-render-benefits"
        );

    const hero =
        canvas.querySelector(
            ".phoenix-layer-hero"
        );

    const cta =
        canvas.querySelector(
            ".phoenix-layer-cta"
        );

    const branding =
        canvas.querySelector(
            ".phoenix-layer-branding"
        );

    const metrics = {

        canvasWidth:
            canvas.clientWidth,

        canvasHeight:
            canvas.clientHeight,

        headlineHeight:
            headline?.offsetHeight || 0,

        supportHeight:
            support?.offsetHeight || 0,

        benefitsHeight:
            benefits?.offsetHeight || 0,

        heroHeight:
            hero?.offsetHeight || 0,

        ctaHeight:
            cta?.offsetHeight || 0,

        brandingHeight:
            branding?.offsetHeight || 0
    };

    metrics.contentHeight =
        metrics.headlineHeight +
        metrics.supportHeight +
        metrics.benefitsHeight;

    metrics.remainingHeight =
        Math.max(
            0,
            metrics.canvasHeight -
            (
                metrics.contentHeight +
                metrics.heroHeight +
                metrics.ctaHeight +
                metrics.brandingHeight
            )
        );

    console.log(
        "📏 Layout Metrics",
        metrics
    );

    return metrics;
}

/* =====================================================
   CONTENT WEIGHT ANALYZER
===================================================== */

function analyzeContentWeight(
    layoutMetrics
) {
    if (
        !layoutMetrics ||
        !layoutMetrics.canvasHeight
    ) {
        return null;
    }

    const {
        canvasHeight,
        headlineHeight,
        supportHeight,
        benefitsHeight,
        ctaHeight,
        brandingHeight,
        heroHeight,
        contentHeight,
        remainingHeight
    } = layoutMetrics;

    /* -------------------------------------------------
       1. NORMALIZED HEIGHT RATIOS
    ------------------------------------------------- */

    const headlineRatio =
        headlineHeight /
        canvasHeight;

    const supportRatio =
        supportHeight /
        canvasHeight;

    const benefitsRatio =
        benefitsHeight /
        canvasHeight;

    const contentRatio =
        contentHeight /
        canvasHeight;

    const heroRatio =
        heroHeight /
        canvasHeight;

    const ctaRatio =
        ctaHeight /
        canvasHeight;

    const brandingRatio =
        brandingHeight /
        canvasHeight;

    const remainingRatio =
        remainingHeight /
        canvasHeight;

    /* -------------------------------------------------
       2. VISUAL IMPORTANCE WEIGHTS

       Headline receives the greatest influence because
       it usually has the strongest visual presence.
    ------------------------------------------------- */

    const headlineWeight =
        headlineRatio * 1.6;

    const supportWeight =
        supportRatio * 0.9;

    const benefitsWeight =
        benefitsRatio * 0.8;

    const ctaWeight =
        ctaRatio * 1.1;

    const brandingWeight =
        brandingRatio * 0.5;

    const textWeightScore =
        headlineWeight +
        supportWeight +
        benefitsWeight +
        ctaWeight +
        brandingWeight;

    /* -------------------------------------------------
       3. CONTENT DENSITY
    ------------------------------------------------- */

    let densityLevel =
        "light";

    if (contentRatio >= 0.48) {
        densityLevel =
            "critical";
    } else if (contentRatio >= 0.36) {
        densityLevel =
            "heavy";
    } else if (contentRatio >= 0.24) {
        densityLevel =
            "balanced";
    }

    /* -------------------------------------------------
       4. HEADLINE DOMINANCE
    ------------------------------------------------- */

    const headlineShare =
        contentHeight > 0
            ? headlineHeight /
              contentHeight
            : 0;

    let headlineDominance =
        "low";

    if (headlineShare >= 0.55) {
        headlineDominance =
            "very-high";
    } else if (headlineShare >= 0.42) {
        headlineDominance =
            "high";
    } else if (headlineShare >= 0.28) {
        headlineDominance =
            "balanced";
    }

    /* -------------------------------------------------
       5. VERTICAL PRESSURE
    ------------------------------------------------- */

    let verticalPressure =
        "low";

    if (remainingRatio <= 0.08) {
        verticalPressure =
            "critical";
    } else if (remainingRatio <= 0.16) {
        verticalPressure =
            "high";
    } else if (remainingRatio <= 0.28) {
        verticalPressure =
            "moderate";
    }

    /* -------------------------------------------------
       6. CONTENT WEIGHT CLASSIFICATION
    ------------------------------------------------- */

    let contentWeight =
        "light";

    if (textWeightScore >= 0.65) {
        contentWeight =
            "critical";
    } else if (textWeightScore >= 0.48) {
        contentWeight =
            "heavy";
    } else if (textWeightScore >= 0.30) {
        contentWeight =
            "balanced";
    }

    /* -------------------------------------------------
       7. SPACING RECOMMENDATION
    ------------------------------------------------- */

    let spacingRecommendation =
        "spacious";

    if (
        contentWeight === "critical" ||
        verticalPressure === "critical"
    ) {
        spacingRecommendation =
            "compressed";
    } else if (
        contentWeight === "heavy" ||
        verticalPressure === "high"
    ) {
        spacingRecommendation =
            "compact";
    } else if (
        contentWeight === "balanced" ||
        verticalPressure === "moderate"
    ) {
        spacingRecommendation =
            "balanced";
    }

    /* -------------------------------------------------
       8. ANALYSIS RESULT
    ------------------------------------------------- */

    const analysis = {
        contentWeight,
        densityLevel,
        headlineDominance,
        verticalPressure,
        spacingRecommendation,

        ratios: {
            headline:
                Number(
                    headlineRatio.toFixed(3)
                ),

            support:
                Number(
                    supportRatio.toFixed(3)
                ),

            benefits:
                Number(
                    benefitsRatio.toFixed(3)
                ),

            content:
                Number(
                    contentRatio.toFixed(3)
                ),

            hero:
                Number(
                    heroRatio.toFixed(3)
                ),

            cta:
                Number(
                    ctaRatio.toFixed(3)
                ),

            branding:
                Number(
                    brandingRatio.toFixed(3)
                ),

            remaining:
                Number(
                    remainingRatio.toFixed(3)
                )
        },

        headlineShare:
            Number(
                headlineShare.toFixed(3)
            ),

        textWeightScore:
            Number(
                textWeightScore.toFixed(3)
            )
    };

    console.log(
        "🧠 Content Weight Analysis",
        analysis
    );

    return analysis;
}

/* =====================================================
   ELEMENT VERTICAL BOX
===================================================== */

function getVerticalBox(
    canvas,
    element
) {
    if (
        !canvas ||
        !element
    ) {
        return null;
    }

    const canvasRect =
        canvas.getBoundingClientRect();

    const elementRect =
        element.getBoundingClientRect();

    return {
        top:
            Number(
                (
                    elementRect.top -
                    canvasRect.top
                ).toFixed(2)
            ),

        bottom:
            Number(
                (
                    elementRect.bottom -
                    canvasRect.top
                ).toFixed(2)
            ),

        height:
            Number(
                elementRect.height.toFixed(2)
            ),

        center:
            Number(
                (
                    elementRect.top -
                    canvasRect.top +
                    elementRect.height / 2
                ).toFixed(2)
            )
    };
}

/* =====================================================
   VERTICAL FLOW METRICS COLLECTOR
===================================================== */

function collectVerticalFlowMetrics(
    canvas
) {
    if (!canvas) {
        return null;
    }

    const kicker =
        canvas.querySelector(
            ".phoenix-render-kicker"
        );

    const headline =
        canvas.querySelector(
            ".phoenix-render-headline"
        );

    const support =
        canvas.querySelector(
            ".phoenix-render-support"
        );

    const benefits =
        canvas.querySelector(
            ".phoenix-render-benefits"
        );

    const hero =
        canvas.querySelector(
            ".phoenix-layer-hero"
        );

    const cta =
        canvas.querySelector(
            ".phoenix-layer-cta"
        );

    const branding =
        canvas.querySelector(
            ".phoenix-layer-branding"
        );

    const boxes = {
        kicker:
            getVerticalBox(
                canvas,
                kicker
            ),

        headline:
            getVerticalBox(
                canvas,
                headline
            ),

        support:
            getVerticalBox(
                canvas,
                support
            ),

        benefits:
            getVerticalBox(
                canvas,
                benefits
            ),

        hero:
            getVerticalBox(
                canvas,
                hero
            ),

        cta:
            getVerticalBox(
                canvas,
                cta
            ),

        branding:
            getVerticalBox(
                canvas,
                branding
            )
    };

    function calculateGap(
        upperBox,
        lowerBox
    ) {
        if (
            !upperBox ||
            !lowerBox
        ) {
            return null;
        }

        return Number(
            (
                lowerBox.top -
                upperBox.bottom
            ).toFixed(2)
        );
    }

    const gaps = {
        kickerToHeadline:
            calculateGap(
                boxes.kicker,
                boxes.headline
            ),

        headlineToSupport:
            calculateGap(
                boxes.headline,
                boxes.support
            ),

        supportToBenefits:
            calculateGap(
                boxes.support,
                boxes.benefits
            ),

        benefitsToCta:
            calculateGap(
                boxes.benefits,
                boxes.cta
            ),

        heroToCta:
            calculateGap(
                boxes.hero,
                boxes.cta
            )
    };

    const canvasHeight =
        canvas.clientHeight;

    const contentBoxes = [
        boxes.kicker,
        boxes.headline,
        boxes.support,
        boxes.benefits,
        boxes.cta
    ].filter(Boolean);

    const contentTop =
        contentBoxes.length
            ? Math.min(
                  ...contentBoxes.map(
                      box => box.top
                  )
              )
            : 0;

    const contentBottom =
        contentBoxes.length
            ? Math.max(
                  ...contentBoxes.map(
                      box => box.bottom
                  )
              )
            : 0;

    const contentBlockHeight =
        Math.max(
            0,
            contentBottom -
            contentTop
        );

    const topWhitespace =
        Math.max(
            0,
            contentTop
        );

    const bottomWhitespace =
        Math.max(
            0,
            canvasHeight -
            contentBottom
        );

    const contentCenter =
        contentTop +
        contentBlockHeight / 2;

    const canvasCenter =
        canvasHeight / 2;

    const centerOffset =
        contentCenter -
        canvasCenter;

    const verticalFlowMetrics = {
        canvasHeight,

        boxes,
        gaps,

        contentTop:
            Number(
                contentTop.toFixed(2)
            ),

        contentBottom:
            Number(
                contentBottom.toFixed(2)
            ),

        contentBlockHeight:
            Number(
                contentBlockHeight.toFixed(2)
            ),

        topWhitespace:
            Number(
                topWhitespace.toFixed(2)
            ),

        bottomWhitespace:
            Number(
                bottomWhitespace.toFixed(2)
            ),

        contentCenter:
            Number(
                contentCenter.toFixed(2)
            ),

        canvasCenter:
            Number(
                canvasCenter.toFixed(2)
            ),

        centerOffset:
            Number(
                centerOffset.toFixed(2)
            )
    };

    console.log(
        "📐 Vertical Flow Metrics",
        verticalFlowMetrics
    );

    return verticalFlowMetrics;
}

/* =====================================================
   VERTICAL SPACE DISTRIBUTION PLANNER
===================================================== */

function planVerticalSpaceDistribution({
  protectedRegionRegistry,
  verticalFlowMetrics,
  contentWeightAnalysis,
  platform = "pinterest"
}) {
  
    if (
        !verticalFlowMetrics ||
        !contentWeightAnalysis
    ) {
        return null;
    }

    const {
        canvasHeight,
        contentBlockHeight,
        topWhitespace,
        bottomWhitespace,
        centerOffset,
        gaps
    } = verticalFlowMetrics;

    const {
        contentWeight,
        verticalPressure,
        spacingRecommendation,
        headlineDominance
    } = contentWeightAnalysis;

    const isPortrait =
        [
            "pinterest",
            "instagram",
            "instagram-portrait"
        ].includes(
            String(platform).toLowerCase()
        );

    /* -------------------------------------------------
       1. BASE SPACING PROFILE
    ------------------------------------------------- */

    const spacingProfiles = {
        spacious: {
            sectionGap: 18,
            headlineGap: 14,
            ctaGap: 22
        },

        balanced: {
            sectionGap: 13,
            headlineGap: 11,
            ctaGap: 17
        },

        compact: {
            sectionGap: 9,
            headlineGap: 8,
            ctaGap: 13
        },

        compressed: {
            sectionGap: 6,
            headlineGap: 6,
            ctaGap: 9
        }
    };

    const selectedProfile =
        spacingProfiles[
            spacingRecommendation
        ] ||
        spacingProfiles.balanced;

    /* -------------------------------------------------
       2. TARGET CONTENT POSITION
    ------------------------------------------------- */

    let targetCenterOffset =
        0;

    if (isPortrait) {
        targetCenterOffset =
            -canvasHeight * 0.05;
    } else {
        targetCenterOffset =
            0;
    }

    if (
        contentWeight === "critical" ||
        verticalPressure === "critical"
    ) {
        targetCenterOffset -=
            canvasHeight * 0.025;
    }

    const requiredShift =
        targetCenterOffset -
        centerOffset;

    const maximumShift =
        canvasHeight * 0.08;

    const clampedShift =
        Math.max(
            -maximumShift,
            Math.min(
                maximumShift,
                requiredShift
            )
        );

    /* -------------------------------------------------
       3. HEADLINE GAP ADJUSTMENT
    ------------------------------------------------- */

    let headlineGap =
        selectedProfile.headlineGap;

    if (
        headlineDominance === "high" ||
        headlineDominance === "very-high"
    ) {
        headlineGap =
            Math.max(
                5,
                headlineGap - 2
            );
    }

    /* -------------------------------------------------
       4. SPACE CONDITION
    ------------------------------------------------- */

    const totalWhitespace =
        topWhitespace +
        bottomWhitespace;

    const whitespaceRatio =
        canvasHeight > 0
            ? totalWhitespace /
              canvasHeight
            : 0;

    let whitespaceCondition =
        "healthy";

    if (whitespaceRatio < 0.12) {
        whitespaceCondition =
            "critical";
    } else if (whitespaceRatio < 0.22) {
        whitespaceCondition =
            "tight";
    } else if (whitespaceRatio > 0.48) {
        whitespaceCondition =
            "excessive";
    }

    /* -------------------------------------------------
       5. DISTRIBUTION PLAN
    ------------------------------------------------- */

    const plan = {
    mode:
        spacingRecommendation,

    platformOrientation:
        isPortrait
            ? "portrait"
            : "landscape",

    layout: {
        contentShiftY:
            Number(
                clampedShift.toFixed(2)
            ),

        targetCenterOffset:
            Number(
                targetCenterOffset.toFixed(2)
            ),

        currentCenterOffset:
            Number(
                centerOffset.toFixed(2)
            )
    },

    spacing: {
        sectionGap:
            selectedProfile.sectionGap,

        headlineGap,

        ctaGap:
            selectedProfile.ctaGap
    },

    whitespace: {
        condition:
            whitespaceCondition,

        ratio:
            Number(
                whitespaceRatio.toFixed(3)
            ),

        top:
            Number(
                topWhitespace.toFixed(2)
            ),

        bottom:
            Number(
                bottomWhitespace.toFixed(2)
            )
    },

    measurements: {
        currentContentHeight:
            contentBlockHeight,

        currentGaps:
            gaps
    },

    actions: {
        compressSections:
            spacingRecommendation ===
                "compact" ||
            spacingRecommendation ===
                "compressed",

        moveContentUp:
            clampedShift < -1,

        moveContentDown:
            clampedShift > 1,

        preservePosition:
            Math.abs(
                clampedShift
            ) <= 1
    }
};

    console.log(
        "🧭 Vertical Distribution Plan",
        plan
    );

    return plan;
}

/* =====================================================
   APPLY VERTICAL DISTRIBUTION PLAN
===================================================== */

function applyVerticalDistributionPlan({
    canvas,
    layers,
    plan
}) {
    if (
        !canvas ||
        !layers ||
        !plan
    ) {
        return false;
    }

    const contentLayer =
        layers.content;

    if (!contentLayer) {
        console.warn(
            "⚠️ Content layer not found."
        );

        return false;
    }

    const kicker =
        contentLayer.querySelector(
            ".phoenix-render-kicker"
        );

    const headline =
        contentLayer.querySelector(
            ".phoenix-render-headline"
        );

    const supportingText =
        contentLayer.querySelector(
            ".phoenix-render-support"
        );

    const benefits =
        contentLayer.querySelector(
            ".phoenix-render-benefits"
        );

    const {
        layout = {},
        spacing = {}
    } = plan;

    let contentShiftY =
        Number(
            layout.contentShiftY || 0
        );

        /* -------------------------------------------------
   BRANDING SAFETY BOUNDARY
------------------------------------------------- */

const brandingLayer =
    layers.branding ||
    canvas.querySelector(
        ".phoenix-layer-branding"
    );

const canvasRect =
    canvas.getBoundingClientRect();

const contentRect =
    contentLayer.getBoundingClientRect();

const brandingRect =
    brandingLayer
        ?.getBoundingClientRect();

const minimumSafetyGap =
    8;

if (brandingRect) {

    const contentTop =
        contentRect.top -
        canvasRect.top;

    const brandingBottom =
        brandingRect.bottom -
        canvasRect.top;

    const minimumAllowedTop =
        brandingBottom +
        minimumSafetyGap;

    const plannedContentTop =
        contentTop +
        contentShiftY;

    if (
        plannedContentTop <
        minimumAllowedTop
    ) {
        contentShiftY =
            minimumAllowedTop -
            contentTop;
    }
}

    const sectionGap =
        Number(
            spacing.sectionGap || 0
        );

    const headlineGap =
        Number(
            spacing.headlineGap || 0
        );

    const ctaGap =
        Number(
            spacing.ctaGap || 0
        );

    /* -------------------------------------------------
       1. MOVE THE COMPLETE CONTENT LAYER

       Using CSS translate avoids replacing any existing
       transform that may be controlled by composition.
    ------------------------------------------------- */

    contentLayer.style.translate =
        `0 ${contentShiftY}px`;

    contentLayer.style.transition =
        "translate 220ms ease";

    /* -------------------------------------------------
       2. APPLY INTERNAL CONTENT SPACING
    ------------------------------------------------- */

    if (kicker) {
        kicker.style.marginBottom =
            `${sectionGap}px`;
    }

    if (headline) {
        headline.style.marginBottom =
            `${headlineGap}px`;
    }

    if (supportingText) {
        supportingText.style.marginBottom =
            `${sectionGap}px`;
    }

    if (benefits) {
        benefits.style.marginBottom =
            "0px";
    }

    /* -------------------------------------------------
       3. STORE DECISIONS FOR FUTURE PHASES
    ------------------------------------------------- */

    canvas.style.setProperty(
        "--phoenix-content-shift-y",
        `${contentShiftY}px`
    );

    canvas.style.setProperty(
        "--phoenix-section-gap",
        `${sectionGap}px`
    );

    canvas.style.setProperty(
        "--phoenix-headline-gap",
        `${headlineGap}px`
    );

    canvas.style.setProperty(
        "--phoenix-cta-gap",
        `${ctaGap}px`
    );

    canvas.dataset.verticalLayoutMode =
        plan.mode ||
        "balanced";

    canvas.dataset.verticalOrientation =
        plan.platformOrientation ||
        "landscape";

    console.log(
    "✅ Vertical Distribution Applied",
    {
        mode:
            plan.mode,

        requestedContentShiftY:
            Number(
                layout.contentShiftY || 0
            ),

        appliedContentShiftY:
            contentShiftY,

        boundaryAdjusted:
            contentShiftY !==
            Number(
                layout.contentShiftY || 0
            ),

        sectionGap,
        headlineGap,

        ctaGapStored:
            ctaGap
    }
);

    return true;
}

    /* =====================================================
       1. MAIN RENDER WORKFLOW
       ===================================================== */

    function renderDesign({
    target,
    designDNA,
    copyDNA,
    compositionDNA = null,
    typographyDNA = null,
    colorDNA = null,
    assetDNA,
    options = {}
}) {
    const targetElement =
        resolveTarget(
            target
        );

    validateRenderInput({
        targetElement,
        designDNA,
        copyDNA
    });

    const platform =
        designDNA.layout?.platform ||
        designDNA.platform?.id ||
        designDNA.platform ||
        "pinterest";

    const palette = {
    ...(designDNA.palette || {}),

    background:
        colorDNA?.background ??
        designDNA.palette?.background,

    primary:
        colorDNA?.primary ??
        designDNA.palette?.primary,

    secondary:
        colorDNA?.secondary ??
        designDNA.palette?.secondary,

    accent:
        colorDNA?.accent ??
        designDNA.palette?.accent,

    surface:
        colorDNA?.surface ??
        designDNA.palette?.surface,

    text:
        colorDNA?.text ??
        designDNA.palette?.text
};

    const renderContext =
        createRenderContext({
            designDNA,
            copyDNA,
            compositionDNA,
            typographyDNA,
            colorDNA,
            assetDNA,
            options,
            platform,
            palette
        });

    const canvas =
        createCanvas(
            renderContext
        );

    const layers = {
        background:
            renderBackgroundLayer(
                renderContext
            ),

        decorations:
            renderDecorationLayer(
                renderContext
            ),

        hero:
            renderHeroLayer(
                renderContext
            ),

        supporting:
            renderSupportingLayer(
                renderContext
            ),

        content:
            renderContentLayer(
                renderContext
            ),

        cta:
            renderCtaLayer(
                renderContext
            ),

        branding:
            renderBrandLayer(
                renderContext
            )
    };

    applyLayerGridComposition(
        layers,
        renderContext
    );

    appendLayers(
        canvas,
        layers
    );

    mountCanvas({
        targetElement,
        canvas
    });

    const renderAnalysis = {
        layoutMetrics: null,
        contentWeightAnalysis: null,
        verticalFlowMetrics: null,
        verticalDistributionPlan: null,
        verticalDistributionApplied: false,
        postDistributionMetrics: null
    };

    requestAnimationFrame(() => {

        requestAnimationFrame(() => {

            const layoutMetrics =
                collectLayoutMetrics(
                    canvas
                );

            const contentWeightAnalysis =
                analyzeContentWeight(
                    layoutMetrics
                );

            const verticalFlowMetrics =
    collectVerticalFlowMetrics(
        canvas
    );

    const constraintAnalysis =
    window.PhoenixConstraintEngine
        ?.evaluate?.({

            verticalFlowMetrics,

            platform

        });

console.log(
    "🧠 Constraint Analysis",
    constraintAnalysis
);

renderAnalysis.constraintAnalysis =
    constraintAnalysis;

renderContext.constraintAnalysis =
    constraintAnalysis;

const protectedRegions =
    Phoenix.SafeLayoutEngine
        .buildProtectedRegions(
            verticalFlowMetrics?.boxes
        );

const protectedRegionRegistry =
    Phoenix.SafeLayoutEngine
        .createProtectedRegionRegistry();

protectedRegionRegistry.canvas = {
    width: canvas.clientWidth,
    height: canvas.clientHeight
};

protectedRegions.forEach(region => {
    Phoenix.SafeLayoutEngine
        .registerRegion(
            protectedRegionRegistry,
            region
        );
});

console.log(
    "🛡️ Protected Region Registry",
    protectedRegionRegistry
);


const verticalDistributionPlan =
    planVerticalSpaceDistribution({
        protectedRegionRegistry,
        verticalFlowMetrics,
        contentWeightAnalysis,
        platform
    });   

            const verticalDistributionApplied =
                applyVerticalDistributionPlan({
                    canvas,
                    layers,
                    plan:
                        verticalDistributionPlan
                });

            renderAnalysis.layoutMetrics =
                layoutMetrics;

            renderAnalysis.contentWeightAnalysis =
                contentWeightAnalysis;

            renderAnalysis.verticalFlowMetrics =
                verticalFlowMetrics;

            renderAnalysis.constraintAnalysis =
                constraintAnalysis;

            renderContext.constraintAnalysis =
                constraintAnalysis;

            renderAnalysis.verticalDistributionPlan =
                verticalDistributionPlan;

            renderAnalysis.verticalDistributionApplied =
                verticalDistributionApplied;

            renderContext.layoutMetrics =
                layoutMetrics;

            renderContext.contentWeightAnalysis =
                contentWeightAnalysis;

            renderContext.verticalFlowMetrics =
                verticalFlowMetrics;

            renderContext.verticalDistributionPlan =
                verticalDistributionPlan;

            renderContext.verticalDistributionApplied =
                verticalDistributionApplied;

            setTimeout(() => {

    const postDistributionMetrics =
        collectVerticalFlowMetrics(
            canvas
        );

    renderAnalysis.postDistributionMetrics =
        postDistributionMetrics;

    renderContext.postDistributionMetrics =
        postDistributionMetrics;

    const beforeCenterOffset =
        verticalFlowMetrics
            ?.centerOffset || 0;

    const afterCenterOffset =
        postDistributionMetrics
            ?.centerOffset || 0;

    const requestedShift =
        verticalDistributionPlan
            ?.layout
            ?.contentShiftY || 0;

    const actualShift =
        Number(
            (
                afterCenterOffset -
                beforeCenterOffset
            ).toFixed(2)
        );

    const shiftDifference =
        Number(
            (
                actualShift -
                requestedShift
            ).toFixed(2)
        );

    console.log(
        "🔍 Post-Distribution Validation",
        {
            beforeCenterOffset,
            afterCenterOffset,
            requestedShift,
            actualShift,
            shiftDifference,

            status:
                Math.abs(
                    shiftDifference
                ) <= 1
                    ? "verified"
                    : "mismatch"
        }
    );

}, 260);
        });
    });

    return {
        canvas,
        layers,
        context:
            renderContext,
        analysis:
            renderAnalysis
    };
}

    /* =====================================================
       2. RENDER CONTEXT
       ===================================================== */

 function createRenderContext({
    designDNA,
    copyDNA,
    compositionDNA,
    typographyDNA,
    colorDNA,
    assetDNA,
    options,
    platform,
    palette
}) {
    return {
        designDNA,
        copyDNA,

        compositionDNA:
            compositionDNA || {},

        typographyDNA:
            typographyDNA || {},

        colorDNA:
            colorDNA || {},

        assetDNA,
        options,
        platform,
        palette,

        brandName:
            options?.brandName ||
            copyDNA?.brandName ||
            "ToolXone",

        website:
            options?.website ||
            copyDNA?.website ||
            "",

        layout:
            designDNA.layout || {},

        composition: {
    ...(designDNA.layout?.composition || {}),
    ...(compositionDNA || {})
      },

        typography:
    typographyDNA ||
    designDNA.typography ||
    {},

        spacing:
            designDNA.spacing || {},

        branding:
            designDNA.branding || {},

        hero:
            assetDNA?.heroAsset ||
            designDNA.hero ||
            {},

        supportingAssets:
            assetDNA?.supportingAssets ||
            [],

        decorativeAssets:
            assetDNA?.decorativeAssets ||
            [],

        background:
            designDNA.background ||
            {},

        decorations:
            designDNA.decorations ||
            {},

        copy:
            copyDNA || {}
    };
}

    /* =====================================================
       3. CANVAS
       ===================================================== */

    function createCanvas(
    context
) {
    const canvas =
        document.createElement(
            "div"
        );

    canvas.className =
        "phoenix-render-canvas";

    applyCanvasVariables(
        canvas,
        context
    );

    applyLayoutVariables(
        canvas,
        context
    );

    applyComposition(
    canvas,
    context
    );

    applyPlatformFormat(
        canvas,
        context
    );

    return canvas;
}

/* =====================================================
   GRID COMPOSITION APPLIER
   ===================================================== */

function applyLayerGridComposition(
    layers,
    context
) {
    const zones =
        context.composition?.zones ||
        {};

    Object.entries(layers)
        .forEach(
            ([layerName, layer]) => {
                const zone =
                    zones[layerName];

                if (
                    !layer ||
                    !zone
                ) {
                    return;
                }

                if (zone.column) {
                    layer.style.gridColumn =
                        String(
                            zone.column
                        );
                }

                if (zone.row) {
                    layer.style.gridRow =
                        String(
                            zone.row
                        );
                }

                if (zone.justify) {
    layer.style.justifySelf =
        zone.justify;
}

/*
 Keep dynamic text anchored safely at the
 beginning of its grid zone. Centering an
 oversized content stack can push its first
 line outside the canvas.
*/
if (layerName === "content") {
    layer.style.alignSelf =
        "stretch";
} else if (zone.align) {
    layer.style.alignSelf =
        zone.align;
}

                layer.dataset.gridZone =
                    layerName;
            }
        );
}

/* =====================================================
   PLATFORM CANVAS FORMAT
   ===================================================== */

function applyPlatformFormat(
    canvas,
    context
) {
    const rawPlatform =
        context.platform?.id ||
        context.platform ||
        context.layout?.platform ||
        "facebook";

    const platform =
        String(rawPlatform)
            .trim()
            .toLowerCase();

    const formats = {
        pinterest: {
            width: 1000,
            height: 1500,
            className:
                "phoenix-format-portrait"
        },

        "pinterest-pin": {
            width: 1000,
            height: 1500,
            className:
                "phoenix-format-portrait"
        },

        instagram: {
            width: 1080,
            height: 1080,
            className:
                "phoenix-format-square"
        },

        "instagram-post": {
            width: 1080,
            height: 1080,
            className:
                "phoenix-format-square"
        },

        "instagram-portrait": {
            width: 1080,
            height: 1350,
            className:
                "phoenix-format-portrait"
        },

        "instagram-story": {
            width: 1080,
            height: 1920,
            className:
                "phoenix-format-story"
        },

        story: {
            width: 1080,
            height: 1920,
            className:
                "phoenix-format-story"
        },

        facebook: {
            width: 1200,
            height: 630,
            className:
                "phoenix-format-landscape"
        },

        "facebook-post": {
            width: 1200,
            height: 630,
            className:
                "phoenix-format-landscape"
        },

        linkedin: {
            width: 1200,
            height: 627,
            className:
                "phoenix-format-landscape"
        },

        x: {
            width: 1600,
            height: 900,
            className:
                "phoenix-format-landscape"
        },

        twitter: {
            width: 1600,
            height: 900,
            className:
                "phoenix-format-landscape"
        }
    };

    const format =
        formats[platform] ||
        formats.facebook;

    canvas.classList.remove(
        "phoenix-format-landscape",
        "phoenix-format-square",
        "phoenix-format-portrait",
        "phoenix-format-story"
    );

    canvas.classList.add(
        format.className
    );

    canvas.dataset.platform =
        platform;

    canvas.dataset.exportWidth =
        String(format.width);

    canvas.dataset.exportHeight =
        String(format.height);

    canvas.style.aspectRatio =
        `${format.width} / ${format.height}`;

    canvas.style.setProperty(
        "--phoenix-export-width",
        format.width
    );

    canvas.style.setProperty(
        "--phoenix-export-height",
        format.height
    );
}

function applyCanvasVariables(
        canvas,
        context
    ) {
        const palette =
            context.palette;

        canvas.style.setProperty(
            "--phoenix-primary",
            palette.primary ||
            "#0f766e"
        );

        canvas.style.setProperty(
            "--phoenix-secondary",
            palette.secondary ||
            "#10b981"
        );

        canvas.style.setProperty(
            "--phoenix-accent",
            palette.accent ||
            "#2563eb"
        );

        canvas.style.setProperty(
            "--phoenix-background",
            palette.background ||
            "#f8fafc"
        );

        canvas.style.setProperty(
            "--phoenix-surface",
            palette.surface ||
            "#ffffff"
        );

        canvas.style.setProperty(
            "--phoenix-text",
            palette.text ||
            "#0f172a"
        );
    }

    function applyLayoutVariables(
    canvas,
    context
) {
    const layout =
        context.layout || {};

    const safe =
        layout.safeMargins || {};

    const zones =
        layout.zoneRatios || {};

    const composition =
        context.composition || {};

    canvas.style.setProperty(
        "--phoenix-safe-top",
        `${safe.top ?? 7}%`
    );

    canvas.style.setProperty(
        "--phoenix-safe-right",
        `${safe.right ?? 7}%`
    );

    canvas.style.setProperty(
        "--phoenix-safe-bottom",
        `${safe.bottom ?? 7}%`
    );

    canvas.style.setProperty(
        "--phoenix-safe-left",
        `${safe.left ?? 7}%`
    );

    canvas.style.setProperty(
        "--phoenix-brand-zone",
        zones.brand ?? 10
    );

    canvas.style.setProperty(
        "--phoenix-headline-zone",
        zones.headline ?? 23
    );

    canvas.style.setProperty(
        "--phoenix-hero-zone",
        zones.hero ?? 39
    );

    canvas.style.setProperty(
        "--phoenix-support-zone",
        zones.support ?? 15
    );

    canvas.style.setProperty(
        "--phoenix-cta-zone",
        zones.cta ?? 8
    );
/* ---------------------------------------------
   COMPOSITION DNA VARIABLES
--------------------------------------------- */

canvas.style.setProperty(
    "--phoenix-hero-scale",
    `${
        composition.heroScalePercent ??
        40
    }%`
);

canvas.style.setProperty(
    "--phoenix-content-width",
    `${
        composition.contentWidthPercent ??
        56
    }%`
);

canvas.style.setProperty(
    "--phoenix-headline-width",
    `${
        composition.headlineMaxWidthPercent ??
        58
    }%`
);

canvas.style.setProperty(
    "--phoenix-content-align",
    composition.contentAlignment ||
    "center"
);

canvas.style.setProperty(
    "--phoenix-hero-position",
    composition.heroPosition ||
    "center"
);

canvas.style.setProperty(
    "--phoenix-visual-balance",
    composition.visualBalance ||
    "balanced"
);

/* ---------------------------------------------
   TYPOGRAPHY DNA VARIABLES
--------------------------------------------- */

const typography =
    context.typography || {};

const headlineTypography =
    typography.headline || {};

canvas.dataset.typographyScale =
    headlineTypography.scale ||
    "large";

canvas.dataset.typographyDensity =
    headlineTypography.density ||
    "balanced";

canvas.dataset.headlineImportance =
    headlineTypography.importance ||
    "high";

canvas.style.setProperty(
    "--phoenix-headline-weight",
    String(
        headlineTypography.weight ??
        900
    )
);

canvas.style.setProperty(
    "--phoenix-headline-line-height",
    String(
        headlineTypography.lineHeight ??
        1
    )
);

canvas.style.setProperty(
    "--phoenix-headline-letter-spacing",
    headlineTypography.letterSpacing ||
    "-0.035em"
);

canvas.style.setProperty(
    "--phoenix-preferred-lines",
    String(
        headlineTypography.preferredLines ??
        3
    )
);

canvas.style.setProperty(
    "--phoenix-max-words-per-line",
    String(
        headlineTypography.maxWordsPerLine ??
        4
    )
);

  }

  

  /* =====================================================
   3A. COMPOSITION APPLIER
   ===================================================== */

function applyComposition(
    canvas,
    context
) {
    const composition =
        context.composition || {};

    canvas.dataset.heroPosition =
        composition.heroPosition ||
        "center";

    canvas.dataset.contentAlignment =
        composition.contentAlignment ||
        "left";

    canvas.dataset.ctaPosition =
        composition.ctaPosition ||
        "bottom-center";

    canvas.style.setProperty(
        "--phoenix-hero-scale",
        `${
            composition.heroScalePercent ??
            40
        }%`
    );

    canvas.style.setProperty(
        "--phoenix-content-width",
        `${
            composition.contentWidthPercent ??
            55
        }%`
    );

    canvas.style.setProperty(
        "--phoenix-headline-width",
        `${
            composition.headlineMaxWidthPercent ??
            80
        }%`
    );
}

    /* =====================================================
       4. BACKGROUND LAYER
       ===================================================== */

    function renderBackgroundLayer(
    context
) {
    const layer =
        createLayer(
            "background"
        );

    const background =
        context.background || {};

    const palette =
        context.palette || {};

    layer.dataset.background =
        background.id ||
        "balanced-soft-gradient";

    layer.classList.add(
        `phoenix-background-${
            background.pattern ||
            "soft-geometric-shapes"
        }`
    );

    const gradient =
        background.gradient || {};

    const hasIntelligentPalette =
    Boolean(
        context.colorDNA
            ?.personalityId
    );

const paletteGradientColors = [
    palette.background ||
        "#020617",

    palette.primary ||
        "#0f172a",

    palette.secondary ||
        "#2563eb"
];

const designGradientColors =
    Array.isArray(
        gradient.colors
    ) &&
    gradient.colors.length >= 2
        ? gradient.colors
        : paletteGradientColors;

const gradientColors =
    hasIntelligentPalette
        ? paletteGradientColors
        : designGradientColors;

    const angle =
        Number(
            gradient.angle
        ) || 135;

    layer.style.background =
        `linear-gradient(
            ${angle}deg,
            ${gradientColors.join(", ")}
        )`;

    layer.style.setProperty(
    "--phoenix-focal-color",

    hasIntelligentPalette
        ? (
            palette.accent ||
            palette.secondary ||
            "#22d3ee"
        )
        : (
            background.focalLight
                ?.color ||
            palette.accent ||
            "#22d3ee"
        )
);

    layer.style.setProperty(
        "--phoenix-overlay-opacity",
        resolveBackgroundIntensity(
            background.focalLight?.intensity
        )
    );

    const glow =
        document.createElement("div");

    glow.className =
        "phoenix-background-glow";

    glow.dataset.position =
        background.focalLight?.position ||
        "center";

    const pattern =
        document.createElement("div");

    pattern.className =
        "phoenix-background-pattern";

    pattern.dataset.pattern =
        background.pattern ||
        "none";

    const texture =
        document.createElement("div");

    texture.className =
        "phoenix-background-texture";

    texture.dataset.texture =
        background.texture ||
        "clean";

    layer.append(
        glow,
        pattern,
        texture
    );

    return layer;
}


    /* =====================================================
       5. DECORATION LAYER
       ===================================================== */

    function renderDecorationLayer(
        context
    ) {
        const layer =
            createLayer(
                "decorations"
            );

        layer.dataset.decorations =
            context.decorations.id ||
            "balanced-support-details";

        return layer;
    }


    /* =====================================================
       6. HERO LAYER
       ===================================================== */

function renderHeroLayer(
    context
) {
    const layer =
        createLayer(
            "hero"
        );

    const composition =
    context.composition || {};

    const typography =
    context.typography || {};

    const headlineTypography =
    typography.headline || {};

    const heroScale =
    Number.isFinite(
        composition.heroScalePercent
    )
        ? composition.heroScalePercent
        : 40;

const heroPosition =
    String(
        composition.heroPosition ||
        "center"
    ).toLowerCase();

const visualBalance =
    String(
        composition.visualBalance ||
        composition.strategy ||
        "balanced"
    ).toLowerCase();

layer.dataset.position =
    heroPosition;

layer.style.setProperty(
    "--hero-scale",
    `${heroScale}%`
);

    const baseHero =
        context.hero || {};

    const hero = {
        ...baseHero,

        subject:
            context.designDNA?.context?.subject ||
            context.copyDNA?.context?.subject ||
            context.copy?.context?.subject ||
            context.copyDNA?.subject ||
            context.copy?.subject ||
            baseHero.subject ||
            "",

        toolId:
            context.designDNA?.context?.toolId ||
            context.copyDNA?.context?.toolId ||
            context.copy?.context?.toolId ||
            baseHero.toolId ||
            "",

        category:
            context.designDNA?.context?.category ||
            context.copyDNA?.context?.category ||
            context.copy?.context?.category ||
            baseHero.category ||
            ""
    };

    const heroVisual =
        document.createElement(
            "div"
        );

    heroVisual.className =
        "phoenix-hero-visual";

    heroVisual.style.width =
        `${heroScale}%`;

    heroVisual.style.maxWidth =
        "100%";

    heroVisual.style.height =
        "auto";

    layer.dataset.heroPosition =
        heroPosition;

    layer.dataset.visualBalance =
        visualBalance;

    layer.classList.add(
        `phoenix-hero-position-${
            heroPosition.replace(
                /[^a-z0-9-]/g,
                "-"
            )
        }`
    );

    heroVisual.title =
        hero.label ||
        "Hero visual";

            const generatedSVG =
        window.ToolXoneSVGGenerator
            ?.generateHeroSVG(
                hero
            );

    if (generatedSVG) {
        heroVisual.innerHTML =
            generatedSVG;

        heroVisual.classList.add(
            "has-generated-svg"
        );
    } else {
        heroVisual.textContent =
            hero.emojiFallback ||
            hero.icon ||
            resolveHeroSymbol(
                hero
            );

        heroVisual.classList.add(
            "uses-fallback-symbol"
        );
    }

    layer.appendChild(
        heroVisual
    );

    return layer;
}

function renderSupportingLayer(
    context
) {
    const layer =
        createLayer(
            "supporting"
        );

    context.supportingAssets.forEach(
        asset => {
            const generatedSVG =
                window.ToolXoneSVGGenerator
                    ?.generateSupportingSVG(
                        asset
                    );

            /*
             Do not render generic sparkle placeholders.
             Supporting artwork will only appear when a
             meaningful SVG or non-generic symbol exists.
            */
            const fallbackSymbol =
                asset.emojiFallback ||
                "";

            const isGenericSparkle =
                fallbackSymbol === "✨" ||
                fallbackSymbol === "⭐" ||
                fallbackSymbol === "🌟";

            if (
                !generatedSVG &&
                (
                    !fallbackSymbol ||
                    isGenericSparkle
                )
            ) {
                return;
            }

            const item =
                document.createElement(
                    "span"
                );

            item.className =
                "phoenix-supporting-asset";

            item.title =
                asset.label ||
                "Supporting visual";

            if (generatedSVG) {
                item.innerHTML =
                    generatedSVG;

                item.classList.add(
                    "has-generated-svg"
                );
            } else {
                item.textContent =
                    fallbackSymbol;

                item.classList.add(
                    "uses-fallback-symbol"
                );
            }

            layer.appendChild(
                item
            );
        }
    );

    /*
     Hide the empty layer so it does not reserve space.
    */
    if (!layer.children.length) {
        layer.hidden = true;
    }

    return layer;
}

/* =====================================================
   SEMANTIC HEADLINE COMPOSITION
===================================================== */

function composeHeadlineLines(
    headline = "",
    preferredLines = 2
) {
    const normalizedHeadline =
        String(headline || "")
            .replace(/\s+/g, " ")
            .trim();

    if (!normalizedHeadline) {
        return [];
    }

    const words =
        normalizedHeadline
            .split(" ")
            .filter(Boolean);

    const targetLines =
        Math.max(
            1,
            Math.min(
                Number(preferredLines) || 1,
                words.length
            )
        );

    if (targetLines === 1) {
        return [normalizedHeadline];
    }

    /* -------------------------------------------------
       STRONG SEMANTIC BREAKS

       Prefer splitting after punctuation because it
       usually marks the end of a complete thought.
    ------------------------------------------------- */

    const strongBreakIndexes = [];

    words.forEach(
        (word, index) => {
            if (
                index < words.length - 1 &&
                /[.!?:;]$/.test(word)
            ) {
                strongBreakIndexes.push(
                    index + 1
                );
            }
        }
    );

    if (
        targetLines === 2 &&
        strongBreakIndexes.length
    ) {
        const totalLength =
            normalizedHeadline.length;

        let bestBreak =
            strongBreakIndexes[0];

        let bestDifference =
            Infinity;

        strongBreakIndexes.forEach(
            breakIndex => {
                const firstLine =
                    words
                        .slice(
                            0,
                            breakIndex
                        )
                        .join(" ");

                const secondLine =
                    words
                        .slice(
                            breakIndex
                        )
                        .join(" ");

                const difference =
                    Math.abs(
                        firstLine.length -
                        secondLine.length
                    );

                /*
                 Prefer a meaningful punctuation break,
                 but still choose the most visually
                 balanced candidate when several exist.
                */
                if (
                    difference <
                    bestDifference
                ) {
                    bestDifference =
                        difference;

                    bestBreak =
                        breakIndex;
                }
            }
        );

        return [
            words
                .slice(
                    0,
                    bestBreak
                )
                .join(" "),

            words
                .slice(
                    bestBreak
                )
                .join(" ")
        ].filter(Boolean);
    }

    /* -------------------------------------------------
       SCORE ALL POSSIBLE TWO-LINE BREAKS
    ------------------------------------------------- */

    if (targetLines === 2) {
        const weakBreakWords =
            new Set([
                "and",
                "or",
                "but",
                "with",
                "for",
                "to",
                "from",
                "in",
                "on",
                "at",
                "by"
            ]);

        let bestCandidate =
            null;

        for (
            let breakIndex = 1;
            breakIndex < words.length;
            breakIndex += 1
        ) {
            const firstWords =
                words.slice(
                    0,
                    breakIndex
                );

            const secondWords =
                words.slice(
                    breakIndex
                );

            const firstLine =
                firstWords.join(" ");

            const secondLine =
                secondWords.join(" ");

            const previousWord =
                String(
                    words[
                        breakIndex - 1
                    ] || ""
                ).toLowerCase();

            const nextWord =
                String(
                    words[
                        breakIndex
                    ] || ""
                ).toLowerCase();

            const lengthDifference =
                Math.abs(
                    firstLine.length -
                    secondLine.length
                );

            let score =
                100 -
                lengthDifference * 2;

            /*
             Strong reward when the first line ends
             with punctuation.
            */
            if (
                /[.!?:;]$/.test(
                    previousWord
                )
            ) {
                score += 80;
            }

            /*
             A break before a connector can sometimes
             create a natural second phrase.
            */
            if (
                weakBreakWords.has(
                    nextWord
                )
            ) {
                score += 12;
            }

            /*
             Avoid leaving connector words stranded at
             the end of the first line.
            */
            if (
                weakBreakWords.has(
                    previousWord
                )
            ) {
                score -= 45;
            }

            /*
             Avoid one-word lines unless unavoidable.
            */
            if (
                firstWords.length === 1
            ) {
                score -= 35;
            }

            if (
                secondWords.length === 1
            ) {
                score -= 35;
            }

            if (
                !bestCandidate ||
                score >
                    bestCandidate.score
            ) {
                bestCandidate = {
                    score,
                    lines: [
                        firstLine,
                        secondLine
                    ]
                };
            }
        }

        if (bestCandidate) {
            return bestCandidate.lines;
        }
    }

    /* -------------------------------------------------
       FALLBACK FOR THREE OR MORE LINES
    ------------------------------------------------- */

    const lines = [];
    let currentLine = [];

    words.forEach(
        word => {
            const remainingWords =
                words.length -
                lines.reduce(
                    (total, line) =>
                        total +
                        line.split(" ").length,
                    0
                ) -
                currentLine.length;

            const remainingLines =
                targetLines -
                lines.length;

            currentLine.push(word);

            const reachedTargetSize =
                currentLine.length >=
                Math.ceil(
                    remainingWords /
                    remainingLines
                );

            const endsThought =
                /[.!?:;]$/.test(word);

            if (
                lines.length <
                    targetLines - 1 &&
                (
                    endsThought ||
                    reachedTargetSize
                )
            ) {
                lines.push(
                    currentLine.join(" ")
                );

                currentLine = [];
            }
        }
    );

    if (currentLine.length) {
        lines.push(
            currentLine.join(" ")
        );
    }

    return lines.filter(Boolean);
}

/* =====================================================
   ADAPTIVE HEADLINE FONT FITTING
===================================================== */

function fitHeadlineToContainer(
    headlineElement,
    {
        minimumFontSize = 16,
        maximumIterations = 30,
        reductionStep = 1
    } = {}
) {
    if (!headlineElement) {
        return;
    }

    const headlineLines =
        Array.from(
            headlineElement.querySelectorAll(
                ".phoenix-render-headline-line"
            )
        );

    if (!headlineLines.length) {
        return;
    }

    const availableWidth =
        headlineElement.clientWidth;

    if (!availableWidth) {
        return;
    }

    const computedStyle =
        window.getComputedStyle(
            headlineElement
        );

    let currentFontSize =
        Number.parseFloat(
            computedStyle.fontSize
        );

    if (
        !Number.isFinite(
            currentFontSize
        )
    ) {
        return;
    }

    let iteration = 0;

    const headlineOverflows = () =>
        headlineLines.some(
            line =>
                line.scrollWidth >
                availableWidth
        );

    while (
        headlineOverflows() &&
        currentFontSize >
            minimumFontSize &&
        iteration <
            maximumIterations
    ) {
        currentFontSize =
            Math.max(
                minimumFontSize,
                currentFontSize -
                    reductionStep
            );

        headlineElement.style.fontSize =
            `${currentFontSize}px`;

        iteration += 1;
    }

    headlineElement.dataset.fontFit =
        headlineOverflows()
            ? "minimum-reached"
            : iteration > 0
                ? "adjusted"
                : "original";

    headlineElement.dataset.fittedFontSize =
        currentFontSize.toFixed(2);

        console.log(
    "📐 Headline Font Fit",
    {
        status:
            headlineElement.dataset.fontFit,

        fittedFontSize:
            headlineElement.dataset
                .fittedFontSize,

        availableWidth,

        widestLine:
            Math.max(
                ...headlineLines.map(
                    line =>
                        line.scrollWidth
                )
            )
    }
);
      }

    /* =====================================================
   7. CONTENT LAYER
   ===================================================== */

function renderContentLayer(
    context
) {
    const layer =
        createLayer(
            "content"
        );

    const composition =
        context.composition || {};

    const typography =
        context.typography || {};

    const headlineTypography =
        typography.headline || {};

    const contentWidth =
        Number.isFinite(
            composition.contentWidthPercent
        )
            ? composition.contentWidthPercent
            : 56;

        const contentAlignment =
        String(
            composition.contentAlignment ||
            context.layout?.alignment ||
            "center"
        ).toLowerCase();

    const copyImportance =
        Number.isFinite(
            composition.copyImportance
        )
            ? composition.copyImportance
            : 50;

    const whitespace =
        String(
            composition.whitespace ||
            "comfortable"
        ).toLowerCase();


    /* -------------------------------------------------
       APPLY COMPOSITION DECISIONS
       ------------------------------------------------- */

    layer.style.width =
    "100%";

layer.style.maxWidth =
    composition.strategy ===
    "horizontal-split"
        ? "100%"
        : `${contentWidth}%`;

layer.style.boxSizing =
    "border-box";

layer.style.justifySelf =
    contentAlignment === "right"
        ? "end"
        : contentAlignment === "center"
            ? "center"
            : "start";

    layer.style.textAlign =
        contentAlignment;

    layer.dataset.contentAlignment =
        contentAlignment;

    layer.dataset.copyImportance =
        String(
            copyImportance
        );

    layer.dataset.whitespace =
        whitespace;

    layer.classList.add(
        `phoenix-content-align-${
            contentAlignment.replace(
                /[^a-z0-9-]/g,
                "-"
            )
        }`,

        `phoenix-whitespace-${
            whitespace.replace(
                /[^a-z0-9-]/g,
                "-"
            )
        }`
    );


    /* -------------------------------------------------
       CONTENT ELEMENTS
       ------------------------------------------------- */

    const kicker =
        createTextElement({
            tag: "p",

            className:
                "phoenix-render-kicker",

            text:
                context.copyDNA.kicker
        });

    const headline =
        createTextElement({
            tag: "h2",

            className:
                "phoenix-render-headline",

            text:
                context.copyDNA.headline
        });

        if (headline) {
    
    const headlineLines =
    composeHeadlineLines(
        context.copyDNA.headline,
        headlineTypography.preferredLines ||
        2
    );

headline.textContent = "";

headlineLines.forEach(
    lineText => {
        const line =
            document.createElement(
                "span"
            );

        line.className =
            "phoenix-render-headline-line";

        line.textContent =
            lineText;

        headline.appendChild(
            line
        );
    }
);
          headline.dataset.typographyScale =
        headlineTypography.scale ||
        "large";

        console.log(
    "🧠 Typography DNA",
    headlineTypography
);

    headline.dataset.typographyDensity =
        headlineTypography.density ||
        "balanced";

    headline.dataset.headlineImportance =
        headlineTypography.importance ||
        "high";

    headline.style.fontWeight =
        String(
            headlineTypography.weight ??
            900
        );

    headline.style.lineHeight =
    String(
        Math.max(
            Number(
                headlineTypography.lineHeight
            ) || 1.1,
            1.1
        )
    );

    headline.style.letterSpacing =
        headlineTypography.letterSpacing ||
        "-0.035em";
}

    const supportingText =
        createTextElement({
            tag: "p",

            className:
                "phoenix-render-support",

            text:
                context.copyDNA
                    .supportingText
        });

    const benefits =
        renderBenefits(
            context.copyDNA.benefits
        );


    /* -------------------------------------------------
       HEADLINE COMPOSITION
       ------------------------------------------------- */

    if (headline) {
        
        /*
         Keep centered content centered while allowing
         left and right compositions to align naturally.
        */
        if (
            contentAlignment ===
            "center"
        ) {
            headline.style.marginInline =
                "auto";
        } else if (
            contentAlignment ===
            "right"
        ) {
            headline.style.marginLeft =
                "auto";

            headline.style.marginRight =
                "0";
        } else {
            headline.style.marginLeft =
                "0";

            headline.style.marginRight =
                "auto";
        }
    }


    [
        kicker,
        headline,
        supportingText,
        benefits
    ].forEach(element => {
        if (element) {
            layer.appendChild(
                element
            );
        }
    });

    if (headline) {
    requestAnimationFrame(
        () => {
            fitHeadlineToContainer(
                headline,
                {
                    minimumFontSize: 16,
                    maximumIterations: 40,
                    reductionStep: 1
                }
            );
        }
    );
}

    return layer;
}

    /* =====================================================
       8. CTA LAYER
       ===================================================== */

    function renderCtaLayer(
        context
    ) {
        const layer =
            createLayer(
                "cta"
            );

        if (
            !context.copyDNA.callToAction
        ) {
            layer.hidden = true;
            return layer;
        }

        const button =
            document.createElement("span");

        button.className =
            "phoenix-render-cta";

        button.textContent =
            context.copyDNA.callToAction;

        layer.appendChild(
            button
        );

        return layer;
    }


    /* =====================================================
       9. BRAND LAYER
       ===================================================== */

    function renderBrandLayer(
        context
    ) {
        const layer =
            createLayer(
                "branding"
            );

        const brand =
            document.createElement("strong");

        brand.className =
            "phoenix-render-brand";

        brand.textContent =
            context.brandName;

        const website =
            document.createElement("span");

        website.className =
            "phoenix-render-website";

        website.textContent =
            context.website;

        layer.append(
            brand,
            website
        );

        return layer;
    }

    /* =====================================================
       10. LAYER HELPERS
       ===================================================== */

    function createLayer(name) {
        const layer =
            document.createElement("div");

        layer.className =
            `phoenix-render-layer
             phoenix-layer-${name}`;

        layer.dataset.layer =
            name;

        return layer;
    }

function resolveBackgroundIntensity(
    intensity
) {
    const values = {
        low: "0.18",
        medium: "0.32",
        high: "0.48"
    };

    return (
        values[intensity] ||
        values.medium
    );
}

    function appendLayers(
    canvas,
    layers
) {
    [
        layers.background,
        layers.decorations,
        layers.branding,
        layers.content,
        layers.hero,
        layers.supporting,
        layers.cta
    ]
    .forEach(layer => {
        canvas.appendChild(
            layer
        );
    });
}

    function mountCanvas({
    targetElement,
    canvas
}) {
    targetElement.classList.add(
        "uses-phoenix-renderer"
    );

    targetElement.replaceChildren(
        canvas
    );
}


    /* =====================================================
       11. CONTENT HELPERS
       ===================================================== */

    function createTextElement({
        tag,
        className,
        text
    }) {
        const value =
            String(text || "").trim();

        if (!value) {
            return null;
        }

        const element =
            document.createElement(tag);

        element.className =
            className;

        element.textContent =
            value;

        return element;
    }


    function renderBenefits(benefits) {
        if (
            !Array.isArray(benefits) ||
            benefits.length === 0
        ) {
            return null;
        }

        const list =
            document.createElement("ul");

        list.className =
            "phoenix-render-benefits";

        benefits.forEach(benefit => {
            const item =
                document.createElement("li");

            item.textContent =
                benefit;

            list.appendChild(item);
        });

        return list;
    }


    function resolveHeroSymbol(hero) {
        const heroId =
            String(
                hero?.id || ""
            ).toLowerCase();

        if (
            heroId.includes("qr")
        ) {
            return "▦";
        }

        if (
            heroId.includes("bmi") ||
            heroId.includes("health")
        ) {
            return "♥";
        }

        if (
            heroId.includes("finance")
        ) {
            return "↗";
        }

        if (
            heroId.includes("calculator")
        ) {
            return "▤";
        }

        if (
            heroId.includes("hospitality")
        ) {
            return "☕";
        }

        return "✦";
    }


    /* =====================================================
       12. DIMENSIONS
       ===================================================== */

    function resolveDimensions(
        platform,
        options
    ) {
        if (
            options.width &&
            options.height
        ) {
            return {
                width:
                    Number(options.width),

                height:
                    Number(options.height)
            };
        }

        const dimensions = {
            pinterest: {
                width: 1000,
                height: 1500
            },

            "pinterest-pin": {
                width: 1000,
                height: 1500
            },

            instagram: {
                width: 1080,
                height: 1080
            },

            "instagram-post": {
                width: 1080,
                height: 1080
            },

            "instagram-story": {
                width: 1080,
                height: 1920
            },

            facebook: {
                width: 1200,
                height: 630
            },

            "facebook-post": {
                width: 1200,
                height: 630
            },

            linkedin: {
                width: 1200,
                height: 627
            },

            youtube: {
                width: 1280,
                height: 720
            },

            "youtube-thumbnail": {
                width: 1280,
                height: 720
            },

            "website-banner": {
                width: 1600,
                height: 700
            }
        };

        return (
            dimensions[platform] ||
            dimensions.facebook
        );
    }


    /* =====================================================
       13. VALIDATION
       ===================================================== */

    function resolveTarget(target) {
        if (
            target instanceof HTMLElement
        ) {
            return target;
        }

        if (
            typeof target === "string"
        ) {
            return document.querySelector(
                target
            );
        }

        return null;
    }


    function validateRenderInput({
        targetElement,
        designDNA,
        copyDNA
    }) {
        if (!targetElement) {
            throw new Error(
                "Phoenix Render Engine could not find the target element."
            );
        }

        if (!designDNA) {
            throw new Error(
                "Phoenix Render Engine requires Design DNA."
            );
        }

        if (!copyDNA) {
            throw new Error(
                "Phoenix Render Engine requires Copy DNA."
            );
        }
    }


    /* =====================================================
       14. PUBLIC API
       ===================================================== */

    window.ToolXoneRenderEngine = {
        renderDesign
    };

})();