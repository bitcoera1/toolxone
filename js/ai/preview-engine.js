/* =========================================================
   TOOLXONE AI CREATIVE ENGINE
   File: js/ai/preview-engine.js

   Responsibility:
   Turn ToolXone AI decisions into a visible banner preview.

   It renders:
   - Theme and palette
   - Layout
   - Typography
   - Brand information
   - Headline and subtitle
   - CTA and website
   - Hero asset
   - Supporting assets
   - Decorative elements
   - Smooth generation animation
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       1. REQUIRED ENGINE CHECKS
       ===================================================== */

    if (!window.ToolXoneAI) {
        console.error(
            "[ToolXone AI] ai-core.js must load before preview-engine.js."
        );

        return;
    }

    if (!window.ToolXoneDesignEngine) {
        console.error(
            "[ToolXone AI] design-engine.js must load before preview-engine.js."
        );

        return;
    }

    if (!window.ToolXoneAssetEngine) {
        console.error(
            "[ToolXone AI] asset-engine.js must load before preview-engine.js."
        );

        return;
    }


    /* =====================================================
       2. INTERNAL STATE
       ===================================================== */

    const state = {
        initialized: false,
        root: null,
        elements: {},
        currentBrief: null,
        currentDesign: null,
        currentAssets: null,
        currentContent: null,
        generationTimer: null
    };


    /* =====================================================
       3. DEFAULT CONTENT
       ===================================================== */

    const DEFAULT_CONTENT = Object.freeze({
        kicker: "Created with ToolXone AI",
        headline: "YOUR IDEA, PROFESSIONALLY CREATED",
        subtitle:
            "Describe what you want to achieve and ToolXone will help turn it into a professional banner.",
        website: "www.toolxone.com",
        callToAction: "Learn More",
        brandName: "ToolXone"
    });


    /* =====================================================
       4. INITIALIZATION
       ===================================================== */

    function initialize(options = {}) {
        const root =
            resolveElement(
                options.root ||
                options.rootSelector ||
                "#bannerCanvas"
            );

        if (!root) {
            throw new window.ToolXoneAI.ToolXoneAIError(
                "The banner preview canvas could not be found.",
                "PREVIEW_ROOT_NOT_FOUND"
            );
        }

        state.root = root;

        state.elements = {
            bannerContent:
                root.querySelector(".banner-content"),

            brandRow:
                root.querySelector(".banner-brand-row"),

            logoWrapper:
                root.querySelector("#logoPreviewWrapper"),

            defaultLogoMark:
                root.querySelector("#defaultLogoMark"),

            uploadedLogo:
                root.querySelector("#uploadedLogoPreview"),

            brandName:
                root.querySelector("#brandNamePreview"),

            bannerCopy:
                root.querySelector(".banner-copy"),

            kicker:
                root.querySelector("#kickerPreview"),

            headline:
                root.querySelector("#headlinePreview"),

            subtitle:
                root.querySelector("#subtitlePreview"),

            bottomRow:
                root.querySelector(".banner-bottom-row"),

            website:
                root.querySelector("#websitePreview"),

            cta:
                root.querySelector("#ctaPreview")
        };

        ensureAssetLayers();
        ensurePreviewStyles();

        state.initialized = true;

        window.ToolXoneAI.emit(
            "preview-engine:initialized",
            {
                rootId: root.id || ""
            }
        );

        return getState();
    }


    /* =====================================================
       5. MAIN PREVIEW RENDERER
       ===================================================== */

    async function renderPreview({
        brief,
        design,
        assets,
        content = {},
        animate = true
    } = {}) {
        ensureInitialized();

        validatePreviewInput(
            brief,
            design,
            assets
        );

        state.currentBrief = clone(brief);
        state.currentDesign = clone(design);
        state.currentAssets = clone(assets);

        state.currentContent =
    normalizeContent(content);

        if (animate) {
            await playGenerationSequence({
                brief,
                design,
                assets
            });
        }

        clearPreviousPreview();

        applyPlatform(design);
        applyPalette(design);
        applyTypography(design);
        applyLayout(design);
        renderContent(state.currentContent);
        renderAssets(assets, design);
        renderDecorations(assets, design);
        applyAccessibility(design);
        animateFinalReveal();

        const result = {
            brief: clone(brief),
            design: clone(design),
            assets: clone(assets),
            content: clone(state.currentContent),
            renderedAt: new Date().toISOString()
        };

        window.ToolXoneAI.emit(
            "preview:rendered",
            {
                preview: clone(result)
            }
        );

        return result;
    }

/* =====================================================
   CLEAR PREVIOUS GENERATED PREVIEW
   ===================================================== */

function clearPreviousPreview() {
    if (!state.root) {
        return;
    }

    /*
     Clear all text first so no previous content
     remains visible during the new render.
    */
    if (state.elements.kicker) {
        state.elements.kicker.textContent = "";
    }

    if (state.elements.headline) {
        state.elements.headline.textContent = "";

        state.elements.headline.classList.remove(
            "headline-short",
            "headline-medium",
            "headline-long",
            "headline-extra-long",
            "headline-shadow"
        );
    }

    if (state.elements.subtitle) {
        state.elements.subtitle.textContent = "";
    }

    if (state.elements.website) {
        state.elements.website.textContent = "";
    }

    if (state.elements.cta) {
        state.elements.cta.textContent = "";
    }

    if (state.elements.brandName) {
        state.elements.brandName.textContent = "";
    }

    /*
     Remove all previously generated visual assets.
    */
    if (state.elements.visualLayer) {
        state.elements.visualLayer.innerHTML = "";
    }

    if (state.elements.decorationLayer) {
        state.elements.decorationLayer.innerHTML = "";
    }

    /*
     Hide the three decorations that originally came
     from the old static banner template.
    */
    state.root
        .querySelectorAll(
            ":scope > .banner-decoration"
        )
        .forEach(element => {
            element.style.display = "none";
        });

    /*
     Remove previous platform, theme and layout classes.
    */
    const oldClasses = [
        "format-landscape",
        "format-widescreen",
        "format-portrait",
        "format-pinterest",
        "format-square",

        "theme-emerald",
        "theme-blue",
        "theme-dark",
        "theme-minimal",
        "theme-purple",
        "theme-warm",
        "theme-luxury",
        "theme-playful",
        "theme-promotional",

        "layout-bold-left",
        "layout-centered-hero",
        "layout-split-layout",
        "layout-minimal-editorial",
        "layout-product-spotlight",
        "layout-promotional-sale",
        "layout-modern-technology",

        "preview-final-reveal",
        "preview-content-refresh"
    ];

    state.root.classList.remove(
        ...oldClasses
    );
}
    /* =====================================================
       6. GENERATION THINKING SEQUENCE
       ===================================================== */

    function playGenerationSequence({
        brief,
        design,
        assets
    }) {
        return new Promise(resolve => {
            const statusElement =
                document.getElementById(
                    "aiGenerationStatus"
                );

            const steps = [
                {
                    icon: "🧠",
                    title: "Understanding your idea",
                    message:
                        `Recognizing ${brief.industry?.label || "your business"} and its creative direction.`
                },

                {
                    icon: "🎯",
                    title: "Finding the right audience",
                    message:
                        formatAudienceMessage(
                            brief.audience
                        )
                },

                {
                    icon: "🎨",
                    title: "Choosing the visual style",
                    message:
                        `${design.palette?.label || "Professional theme"} with ${design.layout?.label || "a balanced layout"}.`
                },

                {
                    icon: "🖼️",
                    title: "Selecting visual elements",
                    message:
                        formatAssetMessage(assets)
                },

                {
                    icon: "✍️",
                    title: "Building the message",
                    message:
                        "Organizing the headline, supporting copy and call to action."
                },

                {
                    icon: "✨",
                    title: "Bringing your banner to life",
                    message:
                        "Applying the final composition and platform-safe spacing."
                }
            ];

            let stepIndex = 0;

            state.root.classList.add(
                "preview-is-thinking"
            );

            function showNextStep() {
                const step = steps[stepIndex];

                updateGenerationStatus(
                    statusElement,
                    step
                );

                stepIndex += 1;

                if (stepIndex >= steps.length) {
                    state.generationTimer =
                        window.setTimeout(() => {
                            state.root.classList.remove(
                                "preview-is-thinking"
                            );

                            updateGenerationStatus(
                                statusElement,
                                {
                                    icon: "✅",
                                    title:
                                        "Your idea is ready",
                                    message:
                                        "ToolXone created a design you can now refine and download."
                                },
                                "success"
                            );

                            resolve();
                        }, 450);

                    return;
                }

                state.generationTimer =
                    window.setTimeout(
                        showNextStep,
                        430
                    );
            }

            showNextStep();
        });
    }

    function updateGenerationStatus(
        container,
        step,
        status = "working"
    ) {
        if (!container) {
            return;
        }

        container.classList.remove(
            "is-working",
            "is-success",
            "is-error"
        );

        container.classList.add(
            status === "success"
                ? "is-success"
                : status === "error"
                    ? "is-error"
                    : "is-working"
        );

        const icon =
            container.querySelector(
                ".status-icon"
            );

        const title =
            container.querySelector(
                "strong"
            );

        const message =
            container.querySelector(
                "p"
            );

        if (icon) {
            icon.textContent =
                step.icon || "🤖";
        }

        if (title) {
            title.textContent =
                step.title || "Working";
        }

        if (message) {
            message.textContent =
                step.message || "";
        }
    }


    /* =====================================================
       7. PLATFORM APPLICATION
       ===================================================== */

    function applyPlatform(design) {
        const responsive =
            design.responsiveRules || {};

        const platform =
            design.platform || {};

        const formatClasses = [
            "format-landscape",
            "format-widescreen",
            "format-portrait",
            "format-pinterest",
            "format-square"
        ];

        state.root.classList.remove(
            ...formatClasses
        );

        let previewClass =
            responsive.previewClass ||
            "format-landscape";

        if (
            platform.id === "pinterest"
        ) {
            previewClass =
                "format-pinterest";
        }

        state.root.classList.add(
            previewClass
        );

        if (
            platform.width &&
            platform.height
        ) {
            state.root.style.aspectRatio =
                `${platform.width} / ${platform.height}`;
        }

        const previewPlatform =
            document.getElementById(
                "previewPlatform"
            );

        const previewDimensions =
            document.getElementById(
                "previewDimensions"
            );

        if (previewPlatform) {
            previewPlatform.textContent =
                platform.label ||
                "Social Media Banner";
        }

        if (previewDimensions) {
            previewDimensions.textContent =
                `${platform.width || 1200} × ${platform.height || 630}`;
        }
    }


    /* =====================================================
       8. PALETTE APPLICATION
       ===================================================== */

    function applyPalette(design) {
        const palette =
            design.palette || {};

        const themeClasses = [
            "theme-emerald",
            "theme-blue",
            "theme-dark",
            "theme-minimal",
            "theme-purple",
            "theme-warm",
            "theme-luxury",
            "theme-playful",
            "theme-promotional"
        ];

        state.root.classList.remove(
            ...themeClasses
        );

        state.root.classList.add(
            `theme-${palette.id || "emerald"}`
        );

        const cssVariables =
            design.cssVariables || {};

        Object.entries(
            cssVariables
        ).forEach(([name, value]) => {
            if (
                typeof value === "string" &&
                value.trim()
            ) {
                state.root.style.setProperty(
                    name,
                    value
                );
            }
        });

        setCssVariable(
            "--banner-bg-one",
            palette.background
        );

        setCssVariable(
            "--banner-bg-two",
            palette.backgroundSecondary
        );

        setCssVariable(
            "--banner-text",
            palette.text
        );

        setCssVariable(
            "--banner-text-soft",
            palette.textSoft
        );

        setCssVariable(
            "--banner-accent",
            palette.accent
        );

        setCssVariable(
            "--banner-logo-bg",
            palette.surface
        );

        setCssVariable(
            "--banner-logo-text",
            palette.primary
        );
    }


    /* =====================================================
       9. TYPOGRAPHY APPLICATION
       ===================================================== */

    function applyTypography(design) {
        const typography =
            design.typography || {};

        setCssVariable(
            "--banner-heading-font",
            typography.headingFamily
        );

        setCssVariable(
            "--banner-body-font",
            typography.bodyFamily
        );

        setCssVariable(
            "--banner-heading-weight",
            String(
                typography.headingWeight ||
                850
            )
        );

        setCssVariable(
            "--banner-heading-spacing",
            typography.headingLetterSpacing ||
            "-0.04em"
        );

        if (state.elements.headline) {
            state.elements.headline.style.fontFamily =
                typography.headingFamily || "";

            state.elements.headline.style.fontWeight =
                String(
                    typography.headingWeight ||
                    850
                );

            state.elements.headline.style.letterSpacing =
                typography.headingLetterSpacing ||
                "-0.04em";

            state.elements.headline.dataset.headingCase =
                typography.headingCase ||
                "title";
        }

        if (state.elements.subtitle) {
            state.elements.subtitle.style.fontFamily =
                typography.bodyFamily || "";

            state.elements.subtitle.style.fontWeight =
                String(
                    typography.bodyWeight ||
                    500
                );

            state.elements.subtitle.style.letterSpacing =
                typography.bodyLetterSpacing ||
                "0";
        }
    }


    /* =====================================================
       10. LAYOUT APPLICATION
       ===================================================== */

    function applyLayout(design) {
        const layout =
            design.layout || {};

        const layoutClasses = [
            "layout-bold-left",
            "layout-centered-hero",
            "layout-split-layout",
            "layout-minimal-editorial",
            "layout-product-spotlight",
            "layout-promotional-sale",
            "layout-modern-technology"
        ];

        state.root.classList.remove(
            ...layoutClasses
        );

        state.root.classList.add(
            `layout-${layout.id || "bold-left"}`
        );

        setCssVariable(
            "--banner-content-width",
            `${layout.contentWidthPercent || 70}%`
        );

        if (state.elements.bannerCopy) {
            state.elements.bannerCopy.style.textAlign =
                layout.textAlignment ||
                "left";
        }

        if (state.elements.headline) {
            state.elements.headline.style.textAlign =
                layout.textAlignment ||
                "left";
        }

        if (state.elements.subtitle) {
            state.elements.subtitle.style.textAlign =
                layout.textAlignment ||
                "left";
        }

        applyBrandPosition(
            layout.brandPosition
        );

        applyBottomRowPosition(
            layout.ctaPosition
        );
    }

    function applyBrandPosition(position) {
        const row =
            state.elements.brandRow;

        if (!row) {
            return;
        }

        row.style.justifyContent =
            position === "top-center"
                ? "center"
                : position === "top-right"
                    ? "flex-end"
                    : "flex-start";
    }

    function applyBottomRowPosition(position) {
        const row =
            state.elements.bottomRow;

        if (!row) {
            return;
        }

        row.classList.remove(
            "bottom-center",
            "bottom-left",
            "bottom-right"
        );

        if (
            position === "bottom-center"
        ) {
            row.classList.add(
                "bottom-center"
            );
        } else if (
            position === "bottom-left"
        ) {
            row.classList.add(
                "bottom-left"
            );
        } else {
            row.classList.add(
                "bottom-right"
            );
        }
    }


    /* =====================================================
       11. CONTENT RENDERING
       ===================================================== */

    function renderContent(content) {
        if (state.elements.kicker) {
            state.elements.kicker.textContent =
                content.kicker;
        }

        if (state.elements.headline) {
            state.elements.headline.innerHTML =
                formatHeadline(
                    content.headline
                );
                applyAdaptiveHeadlineSize(
    content.headline
);
        }

        if (state.elements.subtitle) {
            state.elements.subtitle.textContent =
                content.subtitle;
        }

        if (state.elements.website) {
            state.elements.website.textContent =
                content.website;
        }

        if (state.elements.cta) {
            state.elements.cta.textContent =
                content.callToAction;
        }

        if (state.elements.brandName) {
            state.elements.brandName.textContent =
                content.brandName;
        }

        updateDefaultLogoMark(
            content.brandName
        );
    }
function applyAdaptiveHeadlineSize(headline) {
    if (!state.elements.headline) {
        return;
    }

    const length =
        String(headline || "").length;

    state.elements.headline.classList.remove(
        "headline-short",
        "headline-medium",
        "headline-long",
        "headline-extra-long"
    );

    if (length <= 28) {
        state.elements.headline.classList.add(
            "headline-short"
        );
    } else if (length <= 48) {
        state.elements.headline.classList.add(
            "headline-medium"
        );
    } else if (length <= 68) {
        state.elements.headline.classList.add(
            "headline-long"
        );
    } else {
        state.elements.headline.classList.add(
            "headline-extra-long"
        );
    }
}
    function updateDefaultLogoMark(
        brandName
    ) {
        if (
            !state.elements.defaultLogoMark
        ) {
            return;
        }

        const initials =
            String(
                brandName ||
                "ToolXone"
            )
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map(word =>
                    word.charAt(0)
                )
                .join("")
                .toUpperCase();

        state.elements.defaultLogoMark.textContent =
            initials || "TX";
    }


    /* =====================================================
       12. ASSET LAYERS
       ===================================================== */

    function ensureAssetLayers() {
        let visualLayer =
            state.root.querySelector(
                ".ai-preview-visual-layer"
            );

        let decorationLayer =
            state.root.querySelector(
                ".ai-preview-decoration-layer"
            );

        if (!visualLayer) {
            visualLayer =
                document.createElement("div");

            visualLayer.className =
                "ai-preview-visual-layer";

            visualLayer.setAttribute(
                "aria-hidden",
                "true"
            );

            state.root.appendChild(
                visualLayer
            );
        }

        if (!decorationLayer) {
            decorationLayer =
                document.createElement("div");

            decorationLayer.className =
                "ai-preview-decoration-layer";

            decorationLayer.setAttribute(
                "aria-hidden",
                "true"
            );

            state.root.insertBefore(
                decorationLayer,
                state.root.firstChild
            );
        }

        state.elements.visualLayer =
            visualLayer;

        state.elements.decorationLayer =
            decorationLayer;
    }


    /* =====================================================
       13. HERO AND SUPPORTING ASSET RENDERING
       ===================================================== */

    function renderAssets(
        assets,
        design
    ) {
        const layer =
            state.elements.visualLayer;

        if (!layer) {
            return;
        }

        layer.innerHTML = "";

        const hero =
            assets.heroAsset;

        if (hero) {
            const heroElement =
                createAssetElement(
                    hero,
                    "hero"
                );

            applyPlacement(
                heroElement,
                assets.placements?.hero,
                hero
            );

            layer.appendChild(
                heroElement
            );
        }

        const supporting =
            Array.isArray(
                assets.supportingAssets
            )
                ? assets.supportingAssets
                : [];

        supporting.forEach(
            (asset, index) => {
                const element =
                    createAssetElement(
                        asset,
                        "supporting"
                    );

                const placement =
                    assets.placements
                        ?.supporting?.[index];

                applyPlacement(
                    element,
                    placement,
                    asset
                );

                layer.appendChild(
                    element
                );
            }
        );

        layer.dataset.assetStyle =
            assets.assetStyle?.id ||
            "outline";

        layer.dataset.layout =
            design.layout?.id ||
            "bold-left";
    }

    function createAssetElement(
        asset,
        role
    ) {
        const wrapper =
            document.createElement("div");

        wrapper.className =
            `ai-preview-asset ai-preview-${role}-asset`;

        wrapper.dataset.assetId =
            asset.id || "";

        wrapper.dataset.assetCategory =
            asset.category || "";

        wrapper.dataset.assetRole =
            role;

        const symbol =
            document.createElement("span");

        symbol.className =
            "ai-preview-asset-symbol";

        symbol.textContent =
            asset.emojiFallback ||
            getCategoryFallback(
                asset.category
            );

        const label =
            document.createElement("span");

        label.className =
            "ai-preview-asset-label";

        label.textContent =
            asset.label || "";

        wrapper.appendChild(symbol);

        if (role !== "hero") {
            wrapper.appendChild(label);
        }

        wrapper.setAttribute(
            "title",
            asset.label || ""
        );

        return wrapper;
    }

    function applyPlacement(
        element,
        placement = {},
        asset = {}
    ) {
        const zone =
            placement.zone ||
            asset.placement ||
            "center-right";

        element.dataset.zone = zone;

        element.classList.add(
            `asset-zone-${zone}`
        );

        const width =
            placement.widthPercent ||
            asset.scalePercent ||
            18;

        element.style.setProperty(
            "--asset-size",
            `${width}%`
        );

        if (
            typeof placement.opacity ===
            "number"
        ) {
            element.style.opacity =
                String(
                    placement.opacity
                );
        } else if (
            typeof asset.opacity ===
            "number"
        ) {
            element.style.opacity =
                String(asset.opacity);
        }

        if (placement.zIndex) {
            element.style.zIndex =
                String(
                    placement.zIndex
                );
        }
    }


    /* =====================================================
       14. DECORATIVE ASSET RENDERING
       ===================================================== */

    function renderDecorations(
        assets,
        design
    ) {
        const layer =
            state.elements.decorationLayer;

        if (!layer) {
            return;
        }

        layer.innerHTML = "";

        const decorations =
            Array.isArray(
                assets.decorativeAssets
            )
                ? assets.decorativeAssets
                : [];

        decorations.forEach(
            (asset, index) => {
                const element =
                    document.createElement(
                        "div"
                    );

                element.className =
                    "ai-preview-decoration";

                element.dataset.shape =
                    asset.shape || "";

                element.dataset.zone =
                    asset.placement || "";

                element.style.setProperty(
                    "--decoration-size",
                    `${asset.scalePercent || 14}%`
                );

                element.style.opacity =
                    String(
                        asset.opacity ??
                        0.16
                    );

                element.style.zIndex =
                    String(
                        asset.priority || 1
                    );

                element.classList.add(
                    `decoration-zone-${asset.placement || "background-center"}`
                );

                element.classList.add(
                    `decoration-style-${design.decorations?.id || "geometric"}`
                );

                element.style.setProperty(
                    "--decoration-index",
                    String(index)
                );

                layer.appendChild(
                    element
                );
            }
        );
    }


    /* =====================================================
       15. ACCESSIBILITY
       ===================================================== */

    function applyAccessibility(design) {
        const accessibility =
            design.accessibility || {};

        state.root.setAttribute(
            "role",
            "img"
        );

        state.root.setAttribute(
            "aria-label",
            buildPreviewDescription()
        );

        if (
            accessibility.textShadowRecommended &&
            state.elements.headline
        ) {
            state.elements.headline.classList.add(
                "headline-shadow"
            );
        } else if (
            state.elements.headline
        ) {
            state.elements.headline.classList.remove(
                "headline-shadow"
            );
        }
    }

    function buildPreviewDescription() {
        const brief =
            state.currentBrief || {};

        const content =
            state.currentContent ||
            DEFAULT_CONTENT;

        return [
            `${brief.industry?.label || "Professional"} banner`,
            `with headline ${content.headline}`,
            `and call to action ${content.callToAction}`
        ].join(", ");
    }


    /* =====================================================
       16. LIVE CONTENT UPDATE
       ===================================================== */

    function updateContent(updates = {}) {
        ensureInitialized();

        state.currentContent = {
            ...(state.currentContent ||
                DEFAULT_CONTENT),

            ...normalizeContent(updates)
        };

        renderContent(
            state.currentContent
        );

        animateContentRefresh();

        return clone(
            state.currentContent
        );
    }


    /* =====================================================
       17. LOGO UPDATE
       ===================================================== */

    function updateLogo({
        source = "",
        brandName = ""
    } = {}) {
        ensureInitialized();

        const wrapper =
            state.elements.logoWrapper;

        const image =
            state.elements.uploadedLogo;

        if (!wrapper || !image) {
            return;
        }

        image.onload = null;
        image.onerror = null;

        if (!source) {
            image.removeAttribute("src");

            wrapper.classList.remove(
                "has-uploaded-logo"
            );

            if (brandName) {
                updateDefaultLogoMark(
                    brandName
                );
            }

            return;
        }

        image.onload = () => {
            wrapper.classList.add(
                "has-uploaded-logo"
            );

            image.onload = null;
            image.onerror = null;
        };

        image.onerror = () => {
            image.onload = null;
            image.onerror = null;

            image.removeAttribute("src");

            wrapper.classList.remove(
                "has-uploaded-logo"
            );

            window.ToolXoneAI.emit(
                "preview:logo-error",
                {}
            );
        };

        image.src = source;
    }


    /* =====================================================
       18. ANIMATIONS
       ===================================================== */

    function animateFinalReveal() {
        state.root.classList.remove(
            "preview-final-reveal"
        );

        void state.root.offsetWidth;

        state.root.classList.add(
            "preview-final-reveal"
        );

        window.setTimeout(() => {
            state.root.classList.remove(
                "preview-final-reveal"
            );
        }, 1000);
    }

    function animateContentRefresh() {
        if (!state.elements.bannerContent) {
            return;
        }

        state.elements.bannerContent
            .classList.remove(
                "preview-content-refresh"
            );

        void state.elements
            .bannerContent
            .offsetWidth;

        state.elements.bannerContent
            .classList.add(
                "preview-content-refresh"
            );

        window.setTimeout(() => {
            state.elements.bannerContent
                ?.classList.remove(
                    "preview-content-refresh"
                );
        }, 500);
    }


    /* =====================================================
       19. RESET
       ===================================================== */

    function reset() {
        ensureInitialized();

        if (state.generationTimer) {
            window.clearTimeout(
                state.generationTimer
            );

            state.generationTimer = null;
        }

        state.currentBrief = null;
        state.currentDesign = null;
        state.currentAssets = null;
        state.currentContent = null;

        state.root.removeAttribute(
            "style"
        );

        state.root.className =
            "banner-canvas theme-emerald format-landscape layout-bold-left";

        state.elements.visualLayer.innerHTML =
            "";

        state.elements.decorationLayer.innerHTML =
            "";

        renderContent(
            DEFAULT_CONTENT
        );

        updateLogo({
            source: "",
            brandName:
                DEFAULT_CONTENT.brandName
        });

        window.ToolXoneAI.emit(
            "preview:reset",
            {}
        );
    }


    /* =====================================================
       20. INPUT VALIDATION
       ===================================================== */

    function validatePreviewInput(
        brief,
        design,
        assets
    ) {
        if (
            !brief ||
            typeof brief !== "object"
        ) {
            throw new window.ToolXoneAI.ToolXoneAIError(
                "A creative brief is required for preview rendering.",
                "PREVIEW_BRIEF_REQUIRED"
            );
        }

        if (
            !design ||
            typeof design !== "object"
        ) {
            throw new window.ToolXoneAI.ToolXoneAIError(
                "A design direction is required for preview rendering.",
                "PREVIEW_DESIGN_REQUIRED"
            );
        }

        if (
            !assets ||
            typeof assets !== "object"
        ) {
            throw new window.ToolXoneAI.ToolXoneAIError(
                "An asset plan is required for preview rendering.",
                "PREVIEW_ASSETS_REQUIRED"
            );
        }
    }


    /* =====================================================
       21. CONTENT HELPERS
       ===================================================== */

    function normalizeContent(
    content = {}
) {
    return {
        kicker:
            preserveText(
                content.kicker,
                DEFAULT_CONTENT.kicker
            ),

        headline:
            preserveText(
                content.headline,
                DEFAULT_CONTENT.headline
            ),

        subtitle:
            preserveText(
                content.subtitle,
                DEFAULT_CONTENT.subtitle
            ),

        website:
            preserveText(
                content.website,
                DEFAULT_CONTENT.website
            ),

        callToAction:
            preserveText(
                content.callToAction ??
                content.cta,
                DEFAULT_CONTENT.callToAction
            ),

        brandName:
            preserveText(
                content.brandName,
                DEFAULT_CONTENT.brandName
            )
    };
}
function preserveText(
    value,
    fallback = ""
) {
    /*
     Use the fallback only when no value was supplied.
     An intentionally empty string remains empty.
    */
    if (
        value === undefined ||
        value === null
    ) {
        return fallback;
    }

    return String(value).trim();
}

    function formatHeadline(value) {
        const text =
            cleanText(
                value,
                DEFAULT_CONTENT.headline
            );

        const words =
            text.split(/\s+/);

        if (words.length <= 4) {
            return escapeHtml(text);
        }

        const midpoint =
            Math.ceil(
                words.length / 2
            );

        const firstLine =
            words
                .slice(0, midpoint)
                .join(" ");

        const secondLine =
            words
                .slice(midpoint)
                .join(" ");

        return (
            `${escapeHtml(firstLine)}<br>` +
            escapeHtml(secondLine)
        );
    }


    /* =====================================================
       22. STATUS HELPERS
       ===================================================== */

    function formatAudienceMessage(
        audience
    ) {
        if (
            !Array.isArray(audience) ||
            !audience.length
        ) {
            return "Identifying the people most likely to respond to your message.";
        }

        return (
            "Designing for " +
            audience
                .slice(0, 3)
                .join(", ") +
            "."
        );
    }

    function formatAssetMessage(assets) {
        const names = [];

        if (assets.heroAsset?.label) {
            names.push(
                assets.heroAsset.label
            );
        }

        if (
            Array.isArray(
                assets.supportingAssets
            )
        ) {
            names.push(
                ...assets.supportingAssets
                    .slice(0, 3)
                    .map(asset =>
                        asset.label
                    )
            );
        }

        if (!names.length) {
            return "Choosing context-aware visuals for your design.";
        }

        return (
            "Using " +
            names.join(", ") +
            "."
        );
    }


    /* =====================================================
       23. STYLE INJECTION
       ===================================================== */

    function ensurePreviewStyles() {
      
        if (
            document.getElementById(
                "toolxone-ai-preview-engine-styles"
                
            )
        ) {
            return;
            
        }
        

        const style =
            document.createElement("style");

        style.id =
            "toolxone-ai-preview-engine-styles";

        style.textContent = `
        .banner-canvas #headlinePreview.headline-short {
    font-size: clamp(2.2rem, 6vw, 5.4rem);
    .banner-canvas #kickerPreview:empty,
.banner-canvas #subtitlePreview:empty,
.banner-canvas #websitePreview:empty,
.banner-canvas #ctaPreview:empty,
.banner-canvas #brandNamePreview:empty {
    display: none;
}
}

.banner-canvas #headlinePreview.headline-medium {
    font-size: clamp(1.9rem, 5.2vw, 4.7rem);
}

.banner-canvas #headlinePreview.headline-long {
    font-size: clamp(1.55rem, 4.3vw, 3.9rem);
}

.banner-canvas #headlinePreview.headline-extra-long {
    font-size: clamp(1.25rem, 3.5vw, 3.2rem);
    line-height: 0.98;
}
            .banner-canvas {
                position: relative;
            }

            .ai-preview-decoration-layer,
            .ai-preview-visual-layer {
                position: absolute;
                inset: 0;
                pointer-events: none;
                overflow: hidden;
            }

            .ai-preview-decoration-layer {
                z-index: 0;
            }

            .ai-preview-visual-layer {
                z-index: 1;
            }

            .banner-content {
                z-index: 3;
            }

            .ai-preview-asset {
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.35em;
                transition:
                    transform 0.5s ease,
                    opacity 0.5s ease;
            }

            .ai-preview-hero-asset {
                width: var(--asset-size, 35%);
                aspect-ratio: 1;
                border-radius: 50%;
                background:
                    radial-gradient(
                        circle,
                        rgba(255,255,255,0.20),
                        rgba(255,255,255,0.04)
                    );
                border: 1px solid rgba(255,255,255,0.18);
                backdrop-filter: blur(4px);
                box-shadow:
                    0 20px 55px rgba(0,0,0,0.18);
            }

            .ai-preview-hero-asset
            .ai-preview-asset-symbol {
                font-size: clamp(
                    3rem,
                    10vw,
                    9rem
                );
                line-height: 1;
                filter:
                    drop-shadow(
                        0 15px 16px rgba(0,0,0,0.18)
                    );
            }

            .ai-preview-supporting-asset {
                min-width: 56px;
                min-height: 42px;
                padding: 0.55em 0.75em;
                color: var(--banner-text);
                font-size: clamp(
                    0.46rem,
                    1vw,
                    0.8rem
                );
                font-weight: 800;
                border: 1px solid rgba(255,255,255,0.20);
                border-radius: 999px;
                background: rgba(255,255,255,0.13);
                backdrop-filter: blur(7px);
                box-shadow:
                    0 10px 25px rgba(0,0,0,0.10);
            }

            .ai-preview-supporting-asset
            .ai-preview-asset-symbol {
                font-size: 1.25em;
            }

            .ai-preview-asset-label {
                white-space: nowrap;
            }

            .asset-zone-right,
            .asset-zone-center-right,
            .asset-zone-right-half,
            .asset-zone-right-product,
            .asset-zone-right-interface {
                right: 6%;
                top: 50%;
                transform: translateY(-50%);
            }

            .asset-zone-right-top,
            .asset-zone-top-right {
                top: 12%;
                right: 8%;
            }

            .asset-zone-right-bottom,
            .asset-zone-bottom-right {
                right: 8%;
                bottom: 12%;
            }

            .asset-zone-bottom-left {
                left: 8%;
                bottom: 12%;
            }

            .asset-zone-top-left {
                top: 12%;
                left: 8%;
            }

            .asset-zone-background-right {
                right: 2%;
                top: 52%;
                transform: translateY(-50%);
            }

            .asset-zone-background-center {
                top: 50%;
                left: 50%;
                transform:
                    translate(-50%, -50%);
            }

            .asset-zone-lower-product {
                left: 50%;
                bottom: 8%;
                transform:
                    translateX(-50%);
            }

            .ai-preview-decoration {
                position: absolute;
                width:
                    var(
                        --decoration-size,
                        16%
                    );
                aspect-ratio: 1;
                border-radius: 50%;
                background:
                    var(--banner-accent);
                filter: blur(1px);
                transition:
                    transform 0.5s ease,
                    opacity 0.5s ease;
            }

            .decoration-zone-top-right {
                top: -5%;
                right: -4%;
            }

            .decoration-zone-bottom-right {
                right: -5%;
                bottom: -8%;
            }

            .decoration-zone-bottom-left {
                left: -5%;
                bottom: -8%;
            }

            .decoration-zone-background-center {
                top: 45%;
                left: 55%;
            }

            .decoration-style-technological {
                border-radius: 18%;
                background:
                    repeating-linear-gradient(
                        90deg,
                        transparent 0 12px,
                        rgba(255,255,255,0.18)
                        12px 14px
                    );
            }

            .decoration-style-editorial {
                aspect-ratio: 4 / 1;
                border-radius: 999px;
                background:
                    var(--banner-accent);
            }

            .decoration-style-energetic {
                border-radius: 10%;
                transform:
                    rotate(-28deg);
            }

            .decoration-style-luxury {
                border-radius: 0;
                border:
                    1px solid var(--banner-accent);
                background: transparent;
            }

            .decoration-style-playful {
                border-radius:
                    60% 40% 65% 35%;
            }

            .layout-centered-hero
            .banner-copy {
                width: 86%;
                align-self: center;
                text-align: center;
            }

            .layout-centered-hero
            .banner-kicker {
                align-self: center;
            }

            .layout-centered-hero
            .banner-bottom-row {
                justify-content: center;
            }

            .layout-split-layout
            .banner-copy {
                width: 48%;
            }

            .layout-product-spotlight
            .banner-copy {
                width: 48%;
            }

            .layout-minimal-editorial
            .banner-copy {
                width: 62%;
            }

            .layout-modern-technology
            .banner-copy {
                width: 64%;
            }

            .layout-promotional-sale
            .banner-copy {
                width: 65%;
            }

            .banner-bottom-row.bottom-center {
                justify-content: center;
            }

            .banner-bottom-row.bottom-left {
                justify-content: flex-start;
            }

            .banner-bottom-row.bottom-right {
                justify-content:
                    space-between;
            }

            .headline-shadow {
                text-shadow:
                    0 8px 26px rgba(0,0,0,0.24);
            }

            .preview-is-thinking
            .banner-content,
            .preview-is-thinking
            .ai-preview-visual-layer {
                opacity: 0.28;
                filter: blur(2px);
            }

            .preview-final-reveal {
                animation:
                    toolxonePreviewReveal
                    0.9s ease;
            }

            .preview-content-refresh {
                animation:
                    toolxoneContentRefresh
                    0.45s ease;
            }

            .preview-final-reveal
            .ai-preview-hero-asset {
                animation:
                    toolxoneHeroReveal
                    0.85s ease;
            }

            .preview-final-reveal
            .ai-preview-supporting-asset {
                animation:
                    toolxoneSupportingReveal
                    0.8s ease;
            }

            @keyframes toolxonePreviewReveal {
                0% {
                    opacity: 0;
                    transform: scale(0.975);
                    filter: blur(5px);
                }

                100% {
                    opacity: 1;
                    transform: scale(1);
                    filter: blur(0);
                }
            }

            @keyframes toolxoneContentRefresh {
                0% {
                    opacity: 0.45;
                    transform: translateY(6px);
                }

                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes toolxoneHeroReveal {
                0% {
                    opacity: 0;
                    transform:
                        translateY(-50%)
                        scale(0.65)
                        rotate(-8deg);
                }

                100% {
                    opacity: 1;
                    transform:
                        translateY(-50%)
                        scale(1)
                        rotate(0);
                }
            }

            @keyframes toolxoneSupportingReveal {
                0% {
                    opacity: 0;
                    transform:
                        translateY(12px)
                        scale(0.8);
                }

                100% {
                    opacity: 1;
                    transform:
                        translateY(0)
                        scale(1);
                }
            }

            @media (max-width: 640px) {
                .ai-preview-supporting-asset {
                    min-width: 0;
                    min-height: 0;
                    padding: 0.35em 0.5em;
                }

                .ai-preview-hero-asset {
                    width:
                        min(
                            var(--asset-size, 34%),
                            38%
                        );
                }

                .ai-preview-asset-label {
                    display: none;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .preview-final-reveal,
                .preview-content-refresh,
                .preview-final-reveal
                .ai-preview-hero-asset,
                .preview-final-reveal
                .ai-preview-supporting-asset {
                    animation: none !important;
                }
            }
        `;

        document.head.appendChild(
            style
        );
    }


    /* =====================================================
       24. GENERAL HELPERS
       ===================================================== */

    function ensureInitialized() {
        if (!state.initialized) {
            initialize();
        }
    }

    function resolveElement(value) {
        if (
            value instanceof HTMLElement
        ) {
            return value;
        }

        if (typeof value === "string") {
            return document.querySelector(
                value
            );
        }

        return null;
    }

    function setCssVariable(
        name,
        value
    ) {
        if (
            typeof value !== "string" ||
            !value.trim()
        ) {
            return;
        }

        state.root.style.setProperty(
            name,
            value
        );
    }

    function cleanText(
        value,
        fallback = ""
    ) {
        if (typeof value !== "string") {
            return fallback;
        }

        const cleaned =
            value.trim();

        return cleaned || fallback;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getCategoryFallback(
        category
    ) {
        const fallbacks = {
            food: "🍽️",
            technology: "💻",
            finance: "📈",
            property: "🏠",
            fitness: "💪",
            beauty: "✨",
            fashion: "👗",
            education: "📚",
            travel: "✈️",
            gaming: "🎮",
            healthcare: "🛡️",
            ecommerce: "🛒",
            promotion: "🏷️",
            place: "🏪",
            navigation: "📍",
            effect: "✨",
            custom: "✨"
        };

        return (
            fallbacks[category] ||
            "✨"
        );
    }

    function clone(value) {
        return JSON.parse(
            JSON.stringify(value)
        );
    }


    /* =====================================================
       25. STATE ACCESS
       ===================================================== */

    function getState() {
        return clone({
            initialized:
                state.initialized,

            currentBrief:
                state.currentBrief,

            currentDesign:
                state.currentDesign,

            currentAssets:
                state.currentAssets,

            currentContent:
                state.currentContent
        });
    }


    /* =====================================================
       26. PUBLIC API
       ===================================================== */

    window.ToolXonePreviewEngine =
        Object.freeze({
            initialize,
            renderPreview,
            updateContent,
            updateLogo,
            reset,
            getState
        });


    /* =====================================================
       27. READY EVENT
       ===================================================== */

    window.ToolXoneAI.emit(
        "preview-engine:ready",
        {
            renderer:
                "banner-preview-v1"
        }
    );

})();