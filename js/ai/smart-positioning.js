class SmartPositioning {

    static ENGINE_NAME = "SmartPositioning";

    static analyze(layout) {

    const logoPosition =
        this.calculateLogoPosition(layout);

    const headlinePosition =
        this.calculateHeadlinePosition(layout);

    const imagePosition =
        this.calculateImagePosition(layout);

    const ctaButtonPosition =
        this.calculateCTAButtonPosition(layout);

    return this.buildPositioningReport(
        logoPosition,
        headlinePosition,
        imagePosition,
        ctaButtonPosition
    );

}

    static calculateLogoPosition(layout) {

    if (!layout) {

        return "top-left";

    }

    const canvasWidth =
        layout.canvas?.width || 1200;

    if (canvasWidth >= 1600) {

        return "top-center";

    }

    if (canvasWidth >= 1200) {

        return "top-left";

    }

    return "top-center";

}

static calculateHeadlinePosition(layout) {

    if (!layout) {

        return "top-center";

    }

    const canvasWidth =
        layout.canvas?.width || 1200;

    if (canvasWidth >= 1600) {

        return "center";

    }

    if (canvasWidth >= 1200) {

        return "top-center";

    }

    return "center";

}

static calculateImagePosition(layout) {

    if (!layout) {

        return "right";

    }

    const canvasWidth =
        layout.canvas?.width || 1200;

    if (canvasWidth >= 1600) {

        return "right";

    }

    if (canvasWidth >= 1200) {

        return "right";

    }

    return "center";

}

static calculateCTAButtonPosition(layout) {

    if (!layout) {

        return "bottom-left";

    }

    const canvasWidth =
        layout.canvas?.width || 1200;

    if (canvasWidth >= 1600) {

        return "bottom-center";

    }

    if (canvasWidth >= 1200) {

        return "bottom-left";

    }

    return "bottom-center";

}

static buildPositioningReport(
    logoPosition,
    headlinePosition,
    imagePosition,
    ctaButtonPosition
) {

    return {

        engine: this.ENGINE_NAME,

        logoPosition,

        headlinePosition,

        imagePosition,

        ctaButtonPosition,

        timestamp: Date.now()

    };

}

}

window.SmartPositioning = SmartPositioning;