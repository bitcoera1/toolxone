/*!
 * ==========================================================
 * ToolXone Content Integration Engine
 * ----------------------------------------------------------
 * Version: 1.2.0
 *
 * Mission:
 * ----------------------------------------------------------
 * Connect ToolXone Content Registry with the content
 * renderers used by individual tool pages.
 *
 * QUALITY MAINTENANCE PRINCIPLES
 * ----------------------------------------------------------
 * - Content Registry is the single source of truth.
 * - No duplicate PDF content provider.
 * - No dependency on ToolXonePDFContent.
 * - Defensive module detection.
 * - Defensive DOM target detection.
 * - Safe rendering.
 * - No unnecessary page-specific hardcoding.
 * - Graceful failure instead of breaking the page.
 * - Clear diagnostics for maintenance and QA.
 *
 * Supported content:
 * ----------------------------------------------------------
 * - Articles
 * - FAQ
 * - Metadata
 * - Related Tools
 * - Schema
 *
 * ==========================================================
 */

(function (window, document) {

    "use strict";


    /*=========================================================
      ENGINE
    =========================================================*/

    const ContentIntegrationEngine = {

        version: "1.2.0",


        /*=====================================================
          CONFIGURATION
        =====================================================*/

        configuration: {

            autoInitialize: true,

            autoDetectPage: true,

            autoRender: true,

            validateBeforeRender: true,

            animate: true,

            debug: false

        },


        /*=====================================================
          STATE
        =====================================================*/

        state: {

            initialized: false,

            healthy: true,

            rendering: false,

            currentTool: null,

            lastUpdated: Date.now()

        },


        /*=====================================================
          STATISTICS
        =====================================================*/

        statistics: {

            initializedModules: 0,

            failedModules: 0,

            renderedSections: 0,

            registryHits: 0,

            renderFailures: 0,

            missingTargets: 0,

            skippedSections: 0

        },


        /*=====================================================
          MODULE REFERENCES
        =====================================================*/

        modules: {

            registry: null,

            metadataLoader: null,

            schemaLoader: null,

            glossaryLoader: null,

            articleRenderer: null,

            faqRenderer: null,

            relatedRenderer: null,

            metadataRenderer: null,

            schemaRenderer: null

        },


        /*=====================================================
          TOOL RENDER TARGETS
        ------------------------------------------------------
          PDF tools use their own content containers.
          Other legacy/tool pages can continue using the
          finance targets as fallback.
        =====================================================*/

        renderTargets: {

            "image-to-pdf": {

                article: "#pdfInfo",

                faq: "#pdfFAQ",

                related: "#relatedTools"

            },

            "pdf-to-image": {

                article: "#pdfInfo",

                faq: "#pdfFAQ",

                related: "#relatedTools"

            },

            "bmr-calculator": {

    article: "#financeInfo",

    faq: "#healthFAQ",

    related: "#relatedTools"

},

        "body-fat-calculator": {

            article: "#financeInfo",

            faq: "#healthFAQ",

            related: "#relatedTools"

        },

        "calorie-calculator": {

            article: "#healthInfo",

            faq: "#healthFAQ",

            related: "#relatedTools"

        },
            default: {

                article: "#financeInfo",

                faq: "#financeFAQ",

                related: "#relatedTools"

            }

        },


        /*=====================================================
          INITIALIZE
        =====================================================*/

        initialize() {

            if (this.state.initialized) {

                return;

            }


            this.connectModules();


            if (this.configuration.autoDetectPage) {

                this.detectCurrentPage();

            }


            this.state.initialized = true;

            this.state.lastUpdated = Date.now();


            this.debug(

                "Initialized.",

                this.info()

            );

        },


        /*=====================================================
          CONNECT MODULES
        =====================================================*/

        connectModules() {

            const moduleMap = {

                registry: "ToolXoneContentRegistry",

                metadataLoader: "ToolXoneMetadataLoader",

                schemaLoader: "ToolXoneSchemaLoader",

                glossaryLoader: "ToolXoneGlossaryLoader",

                articleRenderer: "ToolXoneArticleRenderer",

                faqRenderer: "ToolXoneFAQRenderer",

                relatedRenderer: "ToolXoneRelatedRenderer",

                metadataRenderer: "ToolXoneMetadataRenderer",

                schemaRenderer: "ToolXoneSchemaRenderer"

            };


            this.statistics.initializedModules = 0;

            this.statistics.failedModules = 0;


            Object.entries(moduleMap).forEach(

                ([key, globalName]) => {

                    if (

                        window[globalName]

                    ) {

                        this.modules[key] =

                            window[globalName];

                        this.statistics.initializedModules++;

                    }

                    else {

                        this.modules[key] = null;

                        this.statistics.failedModules++;

                        this.debug(

                            `Optional module unavailable: ${globalName}`

                        );

                    }

                }

            );


            if (!this.modules.registry) {

                this.state.healthy = false;

                console.warn(

                    "[ToolXone Content] " +

                    "Content Registry unavailable."

                );

            }

        },


        /*=====================================================
          PAGE DETECTION
        =====================================================*/

        detectCurrentPage() {

            let fileName =

                window.location.pathname

                    .split("/")

                    .pop();


            if (!fileName) {

                fileName = "index";

            }


            fileName = fileName

                .replace(/\.html$/i, "")

                .trim();


            let resolvedTool = fileName;


            if (

                this.modules.registry &&

                typeof this.modules.registry.resolveSlug ===

                    "function"

            ) {

                const toolId =

                    this.modules.registry.resolveSlug(

                        fileName

                    );


                if (toolId) {

                    resolvedTool = toolId;

                }

            }


            this.state.currentTool =

                resolvedTool;


            this.debug(

                "Current Tool:",

                resolvedTool

            );


            return resolvedTool;

        },


        /*=====================================================
          CURRENT TOOL
        =====================================================*/

        getCurrentTool() {

            if (!this.state.currentTool) {

                this.detectCurrentPage();

            }


            return this.state.currentTool;

        },


        /*=====================================================
          RENDER TARGETS
        =====================================================*/

        getRenderTargets(tool) {

            if (

                tool &&

                this.renderTargets[tool]

            ) {

                return this.renderTargets[tool];

            }


            if (tool === "pdf-tools") {
                return { ...this.renderTargets.default, article: "#pdfInfo" };
            }

            return this.renderTargets.default;

        },


        /*=====================================================
          DOM TARGET CHECK
        =====================================================*/

        targetExists(selector) {

            if (

                !selector ||

                typeof selector !== "string"

            ) {

                return false;

            }


            return Boolean(

                document.querySelector(selector)

            );

        },


        /*=====================================================
          REGISTRY CONTENT
        =====================================================*/

        getContent(tool) {

            if (!this.modules.registry) {

                return null;

            }


            const registry =

                this.modules.registry;


            const content = {

                article:

                    registry.get(

                        "articles",

                        tool

                    ),

                faq:

                    registry.get(

                        "faq",

                        tool

                    ),

                metadata:

                    registry.get(

                        "metadata",

                        tool

                    ),

                related:

                    registry.get(

                        "related",

                        tool

                    ),

                schema:

                    registry.get(

                        "schema",

                        tool

                    )

            };


            return content;

        },


        /*=====================================================
          SAFE RENDER WRAPPER
        =====================================================*/

        safeRender(label, callback) {

            try {

                callback();

                this.statistics.renderedSections++;

                this.debug(

                    `${label} rendered successfully.`

                );

                return true;

            }

            catch (error) {

                this.statistics.renderFailures++;

                this.state.healthy = false;

                console.error(

                    `[ToolXone Content] ${label} render failed:`,

                    error

                );

                return false;

            }

        },


        /*=====================================================
          ARTICLE
        =====================================================*/

        renderArticle(

            article,

            selector

        ) {

            if (!article) {

                this.statistics.skippedSections++;

                return false;

            }


            if (!this.modules.articleRenderer) {

                this.statistics.skippedSections++;

                return false;

            }


            if (!this.targetExists(selector)) {

                this.statistics.missingTargets++;

                this.statistics.skippedSections++;

                this.debug(

                    `Article target missing: ${selector}`

                );

                return false;

            }


            return this.safeRender(

                "Article",

                () => {

                    this.modules.articleRenderer

                        .renderArticle(

                            selector,

                            article

                        );

                }

            );

        },


        /*=====================================================
          FAQ
        =====================================================*/

        renderFAQ(

            faq,

            selector

        ) {

            if (!faq) {

                this.statistics.skippedSections++;

                return false;

            }


            if (!this.modules.faqRenderer) {

                this.statistics.skippedSections++;

                return false;

            }


            if (!this.targetExists(selector)) {

                this.statistics.missingTargets++;

                this.statistics.skippedSections++;

                this.debug(

                    `FAQ target missing: ${selector}`

                );

                return false;

            }


            return this.safeRender(

                "FAQ",

                () => {

                    this.modules.faqRenderer

                        .renderInto(

                            selector,

                            faq

                        );

                }

            );

        },


        /*=====================================================
          METADATA
        =====================================================*/

        renderMetadata(metadata) {

            if (!metadata) {

                this.statistics.skippedSections++;

                return false;

            }


            if (!this.modules.metadataRenderer) {

                this.statistics.skippedSections++;

                return false;

            }


            return this.safeRender(

                "Metadata",

                () => {

                    this.modules.metadataRenderer

                        .render(

                            metadata

                        );

                }

            );

        },


        /*=====================================================
          RELATED TOOLS
        =====================================================*/

        renderRelated(

            related,

            selector,

            tool

        ) {

            if (!this.modules.relatedRenderer) {

                this.statistics.skippedSections++;

                return false;

            }


            if (!this.targetExists(selector)) {

                this.statistics.missingTargets++;

                this.statistics.skippedSections++;

                this.debug(

                    `Related tools target missing: ${selector}`

                );

                return false;

            }


            return this.safeRender(

                "Related Tools",

                () => {

                    this.modules.relatedRenderer

                        .renderInto(

                            selector,

                            related || [],

                            tool

                        );

                }

            );

        },


        /*=====================================================
          SCHEMA
        =====================================================*/

        renderSchema(schema) {

            if (!schema) {

                this.statistics.skippedSections++;

                return false;

            }


            if (!this.modules.schemaRenderer) {

                this.statistics.skippedSections++;

                return false;

            }


            return this.safeRender(

                "Schema",

                () => {

                    this.modules.schemaRenderer

                        .render(

                            schema

                        );

                }

            );

        },


        /*=====================================================
          MAIN PAGE RENDER
        =====================================================*/

        renderCurrentPage() {

            if (this.state.rendering) {

                this.debug(

                    "Render already in progress."

                );

                return false;

            }


            if (!this.modules.registry) {

                console.warn(

                    "[ToolXone Content] " +

                    "Cannot render without Content Registry."

                );

                return false;

            }


            const tool =

                this.getCurrentTool();


            if (!tool) {

                console.warn(

                    "[ToolXone Content] " +

                    "Unable to determine current tool."

                );

                return false;

            }


            this.state.rendering = true;

            this.state.healthy = true;


            this.statistics.renderedSections = 0;

            this.statistics.registryHits = 0;

            this.statistics.renderFailures = 0;

            this.statistics.missingTargets = 0;

            this.statistics.skippedSections = 0;


            const targets =

                this.getRenderTargets(tool);


            const content =

                this.getContent(tool);


            if (!content) {

                this.state.rendering = false;

                return false;

            }


            /*=================================================
              Registry Hit Tracking
            =================================================*/

            Object.keys(content).forEach(

                key => {

                    if (

                        content[key] !== null &&

                        content[key] !== undefined

                    ) {

                        if (

                            Array.isArray(content[key]) &&

                            content[key].length === 0

                        ) {

                            return;

                        }


                        this.statistics.registryHits++;

                    }

                }

            );


            /*=================================================
              ARTICLE
            =================================================*/

            this.renderArticle(

                content.article,

                targets.article

            );


            /*=================================================
              FAQ
            =================================================*/

            this.renderFAQ(

                content.faq,

                targets.faq

            );


            /*=================================================
              METADATA
            =================================================*/

            this.renderMetadata(

                content.metadata

            );


            /*=================================================
              RELATED
            =================================================*/

            this.renderRelated(

                content.related,

                targets.related,

                tool

            );


            /*=================================================
              SCHEMA
            =================================================*/

            this.renderSchema(

                content.schema

            );


            this.state.rendering = false;

            this.state.lastUpdated = Date.now();


            this.debug(

                "Page render completed.",

                this.statistics

            );


            return true;

        },


        /*=====================================================
          START
        =====================================================*/

        start() {

            this.initialize();


            if (this.configuration.autoRender) {

                this.renderCurrentPage();

            }

        },


        /*=====================================================
          HEALTH CHECK
        =====================================================*/

        health() {

            const registryAvailable =

                Boolean(

                    this.modules.registry

                );


            const articleAvailable =

                Boolean(

                    this.modules.articleRenderer

                );


            const faqAvailable =

                Boolean(

                    this.modules.faqRenderer

                );


            const relatedAvailable =

                Boolean(

                    this.modules.relatedRenderer

                );


            const healthy =

                registryAvailable &&

                articleAvailable &&

                faqAvailable &&

                relatedAvailable &&

                this.statistics.renderFailures === 0;


            return {

                healthy,

                registryAvailable,

                articleAvailable,

                faqAvailable,

                relatedAvailable,

                currentTool:

                    this.state.currentTool,

                statistics:

                    this.statistics

            };

        },


        /*=====================================================
          INFO
        =====================================================*/

        info() {

            return {

                name:

                    "ToolXone Content Integration Engine",

                version:

                    this.version,

                configuration:

                    this.configuration,

                state:

                    this.state,

                statistics:

                    this.statistics,

                currentTool:

                    this.state.currentTool

            };

        },


        /*=====================================================
          REPORT
        =====================================================*/

        report() {

            const health =

                this.health();


            console.group(

                "🧠 ToolXone Content Integration Engine"

            );


            console.log(

                "Version:",

                this.version

            );


            console.log(

                "Current Tool:",

                this.state.currentTool

            );


            console.log(

                "Health:",

                health.healthy

                    ? "✅ HEALTHY"

                    : "⚠️ CHECK REQUIRED"

            );


            console.log(

                "Statistics:",

                this.statistics

            );


            console.log(

                "Modules:",

                {

                    registry:

                        Boolean(

                            this.modules.registry

                        ),

                    articleRenderer:

                        Boolean(

                            this.modules.articleRenderer

                        ),

                    faqRenderer:

                        Boolean(

                            this.modules.faqRenderer

                        ),

                    relatedRenderer:

                        Boolean(

                            this.modules.relatedRenderer

                        ),

                    metadataRenderer:

                        Boolean(

                            this.modules.metadataRenderer

                        ),

                    schemaRenderer:

                        Boolean(

                            this.modules.schemaRenderer

                        )

                }

            );


            console.groupEnd();


            return health;

        },


        /*=====================================================
          DEBUG
        =====================================================*/

        debug(...args) {

            if (!this.configuration.debug) {

                return;

            }


            console.debug(

                "[ToolXone Content]",

                ...args

            );

        }

    };


    /*=========================================================
      GLOBAL API
    =========================================================*/

    window.ToolXoneContentIntegrationEngine =

        ContentIntegrationEngine;


    /*=========================================================
      AUTO INITIALIZATION
    =========================================================*/

    if (

        ContentIntegrationEngine

            .configuration

            .autoInitialize

    ) {

        window.addEventListener(

            "DOMContentLoaded",

            () => {

                ContentIntegrationEngine.start();

            }

        );

    }


    /*=========================================================
      INITIALIZATION LOG
    =========================================================*/

    console.info(

        "ToolXone Content Integration Engine " +

        "v1.2.0 initialized."

    );


})(window, document);