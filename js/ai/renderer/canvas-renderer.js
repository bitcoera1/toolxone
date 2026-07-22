/*
============================================

Phoenix AI
Canvas Rendering Engine

Version:
1.0.0

Responsibility

Render Blueprint

↓

Canvas

Public API

render()

============================================
*/

const PHOENIX_RENDERER_VERSION = "1.0.0";

const PhoenixCanvasRenderer = {

render(renderBlueprint) {

    return this.renderScene(
        renderBlueprint
    );

},

    render(renderBlueprint) {

    return this.renderScene(
        renderBlueprint
    );

},

        createCanvas(renderBlueprint) {

        const canvasLayer =
            renderBlueprint.layers?.canvas || {};

        const canvas =
            document.createElement("canvas");

        canvas.width =
            canvasLayer.width || 1200;

        canvas.height =
            canvasLayer.height || 628;

        const context =
            canvas.getContext("2d");

        context.imageSmoothingEnabled = true;

        context.imageSmoothingQuality = "high";

        return {

            canvas,

            context,

            width: canvas.width,

            height: canvas.height,

            center: {

                x: canvas.width / 2,

                y: canvas.height / 2

            },

            safeArea:
                canvasLayer.safeArea || {

                    top: 60,

                    right: 60,

                    bottom: 60,

                    left: 60

                }

        };

    },

        drawBackground(canvas, renderBlueprint) {

        const context =
            canvas.context;

        const background =
            renderBlueprint.layers?.background || {};

        const width =
            canvas.width;

        const height =
            canvas.height;

        if (background.type === "solid") {

            context.fillStyle =
                background.primaryColor || "#2563EB";

        }

        else {

            const gradient =
                context.createLinearGradient(
                    0,
                    0,
                    width,
                    height
                );

            gradient.addColorStop(
                0,
                background.primaryColor || "#2563EB"
            );

            gradient.addColorStop(
                1,
                background.secondaryColor || "#1E3A8A"
            );

            context.fillStyle =
                gradient;

        }

        context.fillRect(
            0,
            0,
            width,
            height
        );

        if (background.overlay?.enabled) {

            context.save();

            context.globalAlpha =
                background.overlay.opacity || 0.12;

            context.fillStyle =
                "#000000";

            context.fillRect(
                0,
                0,
                width,
                height
            );

            context.restore();

        }

    },

        drawAssets(canvas, renderBlueprint) {

        const context =
            canvas.context;

        const assets =
            renderBlueprint.layers?.assets?.items || [];

        if (!assets.length) {

            return;

        }

        assets.forEach(asset => {

            if (!asset.source) {

                return;

            }

            const image = new Image();

            image.onload = () => {

                context.save();

                context.globalAlpha =
                    asset.opacity ?? 1;

                const centerX =
                    asset.position.x +
                    (asset.width / 2);

                const centerY =
                    asset.position.y +
                    (asset.height / 2);

                context.translate(
                    centerX,
                    centerY
                );

                context.rotate(
                    (asset.rotation || 0) *
                    Math.PI / 180
                );

                context.drawImage(

                    image,

                    -asset.width / 2,
                    -asset.height / 2,

                    asset.width,
                    asset.height

                );

                context.restore();

            };

            image.onerror = () => {

                console.warn(
                    "Phoenix Renderer: Failed to load asset.",
                    asset.source
                );

            };

            image.src =
                asset.source;

        });

    },

    drawLogo(renderBlueprint) {

    },

    drawTitle(renderBlueprint) {

    },

    drawSubtitle(renderBlueprint) {

    },

    drawCTA(renderBlueprint) {

    },

    applyEffects(renderBlueprint) {

    },

    finalize(renderBlueprint) {

    }

};