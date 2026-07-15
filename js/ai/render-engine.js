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
       1. MAIN RENDER WORKFLOW
       ===================================================== */

    function renderDesign({
    target,
    designDNA,
    copyDNA,
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

    const palette =
        designDNA.palette || {};

    const renderContext =
        createRenderContext({
            designDNA,
            copyDNA,
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

    appendLayers(
        canvas,
        layers
    );

    mountCanvas({
        targetElement,
        canvas
    });

    return {
        canvas,
        layers,
        context:
            renderContext
    };
}

    /* =====================================================
       2. RENDER CONTEXT
       ===================================================== */

 function createRenderContext({
    designDNA,
    copyDNA,
    assetDNA,
    options,
    platform,
    palette
}) {
    return {
        designDNA,
        copyDNA,
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

        typography:
            designDNA.typography || {},

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

    applyPlatformFormat(
        canvas,
        context
    );

    return canvas;
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

    const gradientColors =
        Array.isArray(
            gradient.colors
        )
            ? gradient.colors
            : [
                palette.background ||
                "#020617",

                palette.primary ||
                "#0f172a",

                palette.secondary ||
                "#2563eb"
            ];

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
        background.focalLight?.color ||
        palette.accent ||
        "#22d3ee"
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

    const hero =
        context.hero || {};

    const heroVisual =
        document.createElement("div");

    heroVisual.className =
        "phoenix-hero-visual";

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
){
    const layer =
        createLayer(
            "supporting"
        );

    context.supportingAssets.forEach(
        asset=>{

            const item =
                document.createElement(
                    "span"
                );

            item.className =
                "phoenix-supporting-asset";

            item.textContent =
                asset.emojiFallback ||
                "•";

            item.title =
                asset.label;

            layer.appendChild(
                item
            );

        }
    );

    return layer;
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