/**
 * ============================================================
 * PHOENIX AI
 * Banner Composer
 * ------------------------------------------------------------
 * Version : 2.0.0
 *
 * Responsibility:
 * Transform a Creative Blueprint into a
 * Render Blueprint by positioning every
 * visual element on the canvas.
 *
 * Input:
 * - Creative Blueprint
 *
 * Output:
 * - Render Blueprint
 *
 * Public API:
 * PhoenixBannerComposer.compose(creativeBlueprint)
 * ============================================================
 */

const PHOENIX_BANNER_COMPOSER_VERSION = "2.0.0";

const PhoenixBannerComposer = {

    compose(creativeBlueprint) {

        return this.buildRenderBlueprint(
            creativeBlueprint
        );

    },
    
          buildRenderBlueprint(creativeBlueprint) {

        const renderBlueprint = {

            metadata: {

                version: PHOENIX_BANNER_COMPOSER_VERSION,

                generatedAt: new Date().toISOString(),

                engine: "Phoenix Banner Composer"

            },

            validation:
                creativeBlueprint.validation || {

                    valid: true,

                    errors: []

                },

            confidence:
                creativeBlueprint.confidence || {

                    score: 100,

                    level: "Excellent"

                },

            creative:
                creativeBlueprint,

            layers: {

                canvas:
                    this.composeCanvas(creativeBlueprint),

                background:
                    this.composeBackground(creativeBlueprint),

                title:
                    this.composeTitle(creativeBlueprint),

                subtitle:
                    this.composeSubtitle(creativeBlueprint),

                cta:
                    this.composeCTA(creativeBlueprint),

                logo:
                    this.composeLogo(creativeBlueprint),

                assets:
                    this.composeAssets(creativeBlueprint)

            }

        };

        return renderBlueprint;

    },

        composeCanvas(creativeBlueprint) {

        return {

            width: 1200,

            height: 628,

            aspectRatio: "1.91:1",

            orientation: "landscape",

            safeArea: {

                top: 60,

                right: 60,

                bottom: 60,

                left: 60

            },

            margins: {

                top: 40,

                right: 40,

                bottom: 40,

                left: 40

            },

            center: {

                x: 600,

                y: 314

            },

            grid: {

                columns: 12,

                rows: 12

            }

        };

    },

        composeBackground(creativeBlueprint) {

        const color =
            creativeBlueprint.color || {};

        const visualStyle =
            creativeBlueprint.visualStyle || {};

        return {

            type: "gradient",

            primaryColor:
                color.primary || "#2563EB",

            secondaryColor:
                color.secondary || "#1E3A8A",

            accentColor:
                color.accent || "#FFFFFF",

            gradient: {

                direction: "135deg",

                start:
                    color.primary || "#2563EB",

                end:
                    color.secondary || "#1E3A8A"

            },

            overlay: {

                enabled: true,

                opacity: 0.12

            },

            texture: {

                enabled: false,

                type: "none"

            },

            style:
                visualStyle.style || "modern"

        };

    },

        composeTitle(creativeBlueprint) {

        const typography =
            creativeBlueprint.typography || {};

        const layout =
            creativeBlueprint.layout || {};

        const creative =
            creativeBlueprint.creative || {};

        return {

            text:
                creative.headline ||
                "Your Headline Here",

            position: {

                x: layout.titleX || 120,

                y: layout.titleY || 140

            },

            size:
                typography.titleSize || 64,

            family:
                typography.fontFamily || "Inter",

            weight:
                typography.fontWeight || 700,

            color:
                typography.titleColor || "#FFFFFF",

            alignment:
                layout.textAlignment || "left",

            lineHeight:
                typography.lineHeight || 1.15,

            letterSpacing:
                typography.letterSpacing || 0,

            maxWidth:
                layout.titleWidth || 760,

            maxLines: 3,

            wrap: true

        };

    },

        composeSubtitle(creativeBlueprint) {

        const typography =
            creativeBlueprint.typography || {};

        const layout =
            creativeBlueprint.layout || {};

        const creative =
            creativeBlueprint.creative || {};

        return {

            text:
                creative.subtitle ||
                "Add your supporting message here.",

            position: {

                x: layout.subtitleX || 120,

                y: layout.subtitleY || 240

            },

            size:
                typography.subtitleSize || 28,

            family:
                typography.fontFamily || "Inter",

            weight:
                typography.subtitleWeight || 400,

            color:
                typography.subtitleColor || "#F3F4F6",

            alignment:
                layout.textAlignment || "left",

            lineHeight:
                typography.subtitleLineHeight || 1.5,

            letterSpacing:
                typography.subtitleLetterSpacing || 0,

            maxWidth:
                layout.subtitleWidth || 700,

            maxLines: 4,

            wrap: true,

            opacity: 0.95

        };

    },

        composeCTA(creativeBlueprint) {

        const cta =
            creativeBlueprint.cta || {};

        const color =
            creativeBlueprint.color || {};

        const layout =
            creativeBlueprint.layout || {};

        const typography =
            creativeBlueprint.typography || {};

        return {

            text:
                cta.text || "Get Started",

            position: {

                x: layout.ctaX || 120,

                y: layout.ctaY || 430

            },

            width:
                layout.ctaWidth || 240,

            height:
                layout.ctaHeight || 60,

            backgroundColor:
                color.primary || "#2563EB",

            textColor:
                color.buttonText || "#FFFFFF",

            borderRadius: 14,

            border: {

                width: 0,

                color: "transparent"

            },

            padding: {

                horizontal: 28,

                vertical: 16

            },

            typography: {

                family:
                    typography.fontFamily || "Inter",

                size:
                    typography.buttonSize || 22,

                weight:
                    typography.buttonWeight || 600

            },

            alignment:
                layout.textAlignment || "left",

            shadow: {

                enabled: true,

                blur: 20,

                offsetX: 0,

                offsetY: 8,

                opacity: 0.18

            }

        };

    },

        composeLogo(creativeBlueprint) {

        const layout =
            creativeBlueprint.layout || {};

        const visualStyle =
            creativeBlueprint.visualStyle || {};

        return {

            enabled: true,

            source:
                creativeBlueprint.logo?.source || null,

            alt:
                creativeBlueprint.logo?.alt || "Brand Logo",

            position: {

                x: layout.logoX || 60,

                y: layout.logoY || 60

            },

            width:
                layout.logoWidth || 140,

            height:
                layout.logoHeight || 140,

            alignment:
                layout.logoAlignment || "top-left",

            maintainAspectRatio: true,

            opacity: 1,

            safeArea: true,

            style: {

                fit: "contain",

                shadow: visualStyle.logoShadow || false,

                borderRadius:
                    visualStyle.logoRadius || 0

            }

        };

    },

        composeAssets(creativeBlueprint) {

        const assets =
            creativeBlueprint.assets || {};

        const layout =
            creativeBlueprint.layout || {};

        return {

            enabled: true,

            items: (assets.items || []).map((asset, index) => ({

                id:
                    asset.id || `asset-${index + 1}`,

                type:
                    asset.type || "image",

                source:
                    asset.source || null,

                alt:
                    asset.alt || "Visual Asset",

                position: {

                    x:
                        asset.x ?? layout.assetX ?? 760,

                    y:
                        asset.y ?? layout.assetY ?? 120

                },

                width:
                    asset.width || 340,

                height:
                    asset.height || 340,

                rotation:
                    asset.rotation || 0,

                opacity:
                    asset.opacity ?? 1,

                zIndex:
                    asset.zIndex || 1,

                alignment:
                    asset.alignment || "right",

                maintainAspectRatio:
                    asset.maintainAspectRatio !== false,

                cropMode:
                    asset.cropMode || "contain",

                shadow: {

                    enabled:
                        asset.shadow?.enabled ?? true,

                    blur:
                        asset.shadow?.blur ?? 24,

                    offsetX:
                        asset.shadow?.offsetX ?? 0,

                    offsetY:
                        asset.shadow?.offsetY ?? 10,

                    opacity:
                        asset.shadow?.opacity ?? 0.18

                }

            }))

        };

    },
  
  }   