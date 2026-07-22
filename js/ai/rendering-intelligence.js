class RenderingIntelligence {

    static ENGINE_NAME = "RenderingIntelligence";

    static analyze(layout) {

    const canvasReady =
        this.prepareCanvas(layout);

    const elementsReady =
        this.prepareElements(layout);

    const layersReady =
        this.prepareLayers(layout);

    const renderSettingsReady =
        this.prepareRenderSettings(layout);

    return this.buildRenderingReport(
        canvasReady,
        elementsReady,
        layersReady,
        renderSettingsReady
    );

}

    static prepareCanvas(layout) {

    if (!layout || !layout.canvas) {

        return false;

    }

    return (

        layout.canvas.width > 0 &&

        layout.canvas.height > 0

    );

}

static prepareElements(layout) {

    if (!layout || !layout.elements) {

        return false;

    }

    return layout.elements.length > 0;

}

static prepareLayers(layout) {

    if (!layout || !layout.layers) {

        return false;

    }

    return layout.layers.length > 0;

}

static prepareRenderSettings(layout) {

    if (!layout || !layout.renderSettings) {

        return false;

    }

    return true;

}

static buildRenderingReport(
    canvasReady,
    elementsReady,
    layersReady,
    renderSettingsReady
) {

    return {

        engine: this.ENGINE_NAME,

        canvasReady,

        elementsReady,

        layersReady,

        renderSettingsReady,

        timestamp: Date.now()

    };

}

}

window.RenderingIntelligence = RenderingIntelligence;