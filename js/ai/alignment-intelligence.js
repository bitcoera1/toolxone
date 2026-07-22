class AlignmentIntelligence {

    static ENGINE_NAME = "AlignmentIntelligence";

    static analyze(layout) {

    const horizontalAlignment =
        this.calculateHorizontalAlignment(layout);

    const verticalAlignment =
        this.calculateVerticalAlignment(layout);

    const spacing =
        this.calculateSpacing(layout);

    const balance =
        this.calculateBalance(layout);

    return this.buildAlignmentReport(
        horizontalAlignment,
        verticalAlignment,
        spacing,
        balance
    );

}

static calculateHorizontalAlignment(layout) {

    if (!layout) {

        return "center";

    }

    const canvasWidth =
        layout.canvas?.width || 1200;

    if (canvasWidth >= 1600) {

        return "center";

    }

    if (canvasWidth >= 1200) {

        return "left";

    }

    return "center";

}

static calculateVerticalAlignment(layout) {

    if (!layout) {

        return "middle";

    }

    const canvasHeight =
        layout.canvas?.height || 628;

    if (canvasHeight >= 1000) {

        return "middle";

    }

    if (canvasHeight >= 700) {

        return "top";

    }

    return "middle";

}

static calculateSpacing(layout) {

    if (!layout) {

        return 24;

    }

    const canvasWidth =
        layout.canvas?.width || 1200;

    if (canvasWidth >= 1600) {

        return 40;

    }

    if (canvasWidth >= 1200) {

        return 32;

    }

    if (canvasWidth >= 800) {

        return 24;

    }

    return 20;

}

static calculateBalance(layout) {

    if (!layout) {

        return 100;

    }

    const elementCount =
        layout.elements?.length || 0;

    if (elementCount <= 3) {

        return 100;

    }

    if (elementCount <= 6) {

        return 90;

    }

    if (elementCount <= 10) {

        return 80;

    }

    return 70;

}

static buildAlignmentReport(
    horizontalAlignment,
    verticalAlignment,
    spacing,
    balance
) {

    return {

        engine: this.ENGINE_NAME,

        horizontalAlignment,

        verticalAlignment,

        spacing,

        balance,

        timestamp: Date.now()

    };

}

}

window.AlignmentIntelligence = AlignmentIntelligence;