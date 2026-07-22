class BannerStudioConnector {

    static ENGINE_NAME = "BannerStudioConnector";

    static execute(
    canvasId = "bannerCanvas"
) {

    const layout =
        this.collectBannerData();

    const executionReport =
        this.runPhoenixAI(layout);

    const previewReport =
        this.renderPreview(
            canvasId,
            layout
        );

    return {

        engine: this.ENGINE_NAME,

        layout,

        executionReport,

        previewReport,

        connected: true,

        timestamp: Date.now()

    };

}

    static collectBannerData() {

    return {

        title:
            document.getElementById("bannerTitle")?.value || "",

        subtitle:
            document.getElementById("bannerSubtitle")?.value || "",

        background:
            document.getElementById("bannerBackground")?.value || "#ffffff",

        width:
            parseInt(
                document.getElementById("bannerWidth")?.value || 1200
            ),

        height:
            parseInt(
                document.getElementById("bannerHeight")?.value || 628
            )

    };

}

static refreshPreview(
    canvasId = "bannerCanvas"
) {

    return this.execute(canvasId);

}

static bindLivePreview() {

    const inputIds = [

        "bannerTitle",

        "bannerSubtitle",

        "bannerBackground",

        "bannerWidth",

        "bannerHeight"

    ];

    inputIds.forEach(id => {

        const element =
            document.getElementById(id);

        if (!element) {

            return;

        }

        element.addEventListener(
            "input",
            () => this.refreshPreview()
        );

    });

}

static initialize(
    canvasId = "bannerCanvas"
) {

    this.bindLivePreview();

    this.refreshPreview(canvasId);

    return {

        engine: this.ENGINE_NAME,

        initialized: true,

        timestamp: Date.now()

    };

}

static runPhoenixAI(layout) {

    if (!window.AIEngineIntegration) {

        return null;

    }

    return AIEngineIntegration.execute(layout);

}

static renderPreview(
    canvasId,
    layout
) {

    if (!window.BannerPreviewRenderer) {

        return null;

    }

    return BannerPreviewRenderer.render(
        canvasId,
        layout
    );

}

static buildConnectorReport(
    layout,
    executionReport
) {

    return {

        engine: this.ENGINE_NAME,

        layout,

        executionReport,

        connected: true,

        timestamp: Date.now()

    };

}

static execute() {

    const layout =
        this.collectBannerData();

    const executionReport =
        this.runPhoenixAI(layout);

    return this.buildConnectorReport(
        layout,
        executionReport
    );

}


}

window.BannerStudioConnector = BannerStudioConnector;