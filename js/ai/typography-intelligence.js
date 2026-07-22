class TypographyIntelligence {

    static ENGINE_NAME = "TypographyIntelligence";

    static analyze(layout) {

    const headlineSize =
        this.calculateHeadlineSize(layout);

    const bodySize =
        this.calculateBodySize(layout);

    const lineHeight =
        this.calculateLineHeight(layout);

    const letterSpacing =
        this.calculateLetterSpacing(layout);

    return this.buildTypographyReport(
        headlineSize,
        bodySize,
        lineHeight,
        letterSpacing
    );

}

static calculateHeadlineSize(layout) {

    if (!layout) {

        return 32;

    }

    const canvasWidth =
        layout.canvas?.width || 1200;

    if (canvasWidth >= 1600) {

        return 48;

    }

    if (canvasWidth >= 1200) {

        return 40;

    }

    if (canvasWidth >= 800) {

        return 36;

    }

    return 32;

}

static calculateBodySize(layout) {

    if (!layout) {

        return 16;

    }

    const canvasWidth =
        layout.canvas?.width || 1200;

    if (canvasWidth >= 1600) {

        return 22;

    }

    if (canvasWidth >= 1200) {

        return 20;

    }

    if (canvasWidth >= 800) {

        return 18;

    }

    return 16;

}

static calculateLineHeight(layout) {

    const bodySize =
        this.calculateBodySize(layout);

    return Math.round(bodySize * 1.5);

}

static calculateLetterSpacing(layout) {

    const headlineSize =
        this.calculateHeadlineSize(layout);

    if (headlineSize >= 48) {

        return 1.2;

    }

    if (headlineSize >= 40) {

        return 1.0;

    }

    if (headlineSize >= 36) {

        return 0.8;

    }

    return 0.5;

}

static buildTypographyReport(
    headlineSize,
    bodySize,
    lineHeight,
    letterSpacing
) {

    return {

        engine: this.ENGINE_NAME,

        headlineSize,

        bodySize,

        lineHeight,

        letterSpacing,

        timestamp: Date.now()

    };

}

}

window.TypographyIntelligence = TypographyIntelligence;