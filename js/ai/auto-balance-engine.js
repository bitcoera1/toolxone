class AutoBalanceEngine {

    static ENGINE_NAME = "AutoBalanceEngine";

    static analyze(layout) {

    const visualWeight =
        this.calculateVisualWeight(layout);

    const whitespace =
        this.calculateWhitespace(layout);

    const elementDistribution =
        this.calculateElementDistribution(layout);

    const balanceScore =
        this.calculateBalanceScore(
            visualWeight,
            whitespace,
            elementDistribution
        );

    return this.buildBalanceReport(
        visualWeight,
        whitespace,
        elementDistribution,
        balanceScore
    );

}

    static calculateVisualWeight(layout) {

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

static calculateWhitespace(layout) {

    if (!layout) {

        return 100;

    }

    const elementCount =
        layout.elements?.length || 0;

    if (elementCount <= 3) {

        return 100;

    }

    if (elementCount <= 6) {

        return 85;

    }

    if (elementCount <= 10) {

        return 70;

    }

    return 55;

}

static calculateElementDistribution(layout) {

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

    return 65;

}

static calculateBalanceScore(
    visualWeight,
    whitespace,
    elementDistribution
) {

    return Math.round(

        (
            visualWeight +
            whitespace +
            elementDistribution
        ) / 3

    );

}

static buildBalanceReport(
    visualWeight,
    whitespace,
    elementDistribution,
    balanceScore
) {

    return {

        engine: this.ENGINE_NAME,

        visualWeight,

        whitespace,

        elementDistribution,

        balanceScore,

        timestamp: Date.now()

    };

}

}

window.AutoBalanceEngine = AutoBalanceEngine;