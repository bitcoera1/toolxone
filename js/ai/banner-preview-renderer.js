class BannerPreviewRenderer {

    static ENGINE_NAME = "BannerPreviewRenderer";

    static render(
    canvasId,
    layout = {}
) {

    const context =
        this.getCanvasContext(canvasId);

    if (!context) {

        return {

            engine: this.ENGINE_NAME,

            rendered: false,

            timestamp: Date.now()

        };

    }

    this.clearCanvas(context);

    this.drawBackgroundColor(
        context,
        layout.background || "#ffffff"
    );

    this.drawTitle(
        context,
        layout.title || "",
        50,
        80
    );

    this.drawSubtitle(
        context,
        layout.subtitle || "",
        50,
        130
    );

    return {

        engine: this.ENGINE_NAME,

        rendered: true,

        timestamp: Date.now()

    };

}

    static renderCanvas(layout) {

    if (!layout) {

        return false;

    }

    return true;

}

static renderText(layout) {

    if (!layout) {

        return false;

    }

    return true;

}

static renderBackground(layout) {

    if (!layout) {

        return false;

    }

    return true;

}

static getCanvasContext(canvasId) {

    const canvas =
        document.getElementById(canvasId);

    if (!canvas) {

        return null;

    }

    return canvas.getContext("2d");

}

static clearCanvas(context) {

    if (!context) {

        return false;

    }

    const canvas = context.canvas;

    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    return true;

}

static drawBackgroundColor(
    context,
    color = "#ffffff"
) {

    if (!context) {

        return false;

    }

    context.fillStyle = color;

    context.fillRect(
        0,
        0,
        context.canvas.width,
        context.canvas.height
    );

    return true;

}

static drawTitle(
    context,
    title = "",
    x = 50,
    y = 80
) {

    if (!context) {

        return false;

    }

    context.fillStyle = "#111111";

    context.font =
        "bold 36px Arial";

    context.fillText(
        title,
        x,
        y
    );

    return true;

}

static drawSubtitle(
    context,
    subtitle = "",
    x = 50,
    y = 130
) {

    if (!context) {

        return false;

    }

    context.fillStyle = "#444444";

    context.font =
        "22px Arial";

    context.fillText(
        subtitle,
        x,
        y
    );

    return true;

}



}

window.BannerPreviewRenderer = BannerPreviewRenderer;