/* =========================================================
   TOOLXONE AI CREATIVE ENGINE
   File: js/ai/ai-core.js

   Shared foundation for:
   - Phoenix AI Design Studio
   - AI Logo Studio
   - AI Thumbnail Studio
   - Future ToolXone AI creative tools
   ========================================================= */

(function () {
    "use strict";

    const ENGINE_VERSION = "1.0.0";

    const DEFAULT_CONFIG = Object.freeze({
        applicationName: "ToolXone AI",
        studioName: "AI Creative Studio",
        language: "english",
        tone: "automatic",
        platform: "facebook",
        requestTimeout: 60000,
        maximumPromptLength: 700,
        enableHistory: true,
        maximumHistoryItems: 20
    });

    const state = {
        initialized: false,
        isGenerating: false,
        currentStudio: null,
        currentRequest: null,
        currentResult: null,
        lastError: null,
        configuration: { ...DEFAULT_CONFIG }
    };

    const eventListeners = new Map();


    /* =====================================================
       1. INITIALIZATION
       ===================================================== */

    function initialize(options = {}) {
        if (state.initialized) {
            return getState();
        }

        state.configuration = {
            ...DEFAULT_CONFIG,
            ...sanitizeConfiguration(options)
        };

        state.currentStudio =
            state.configuration.studioName;

        state.initialized = true;

        emit("engine:initialized", {
            version: ENGINE_VERSION,
            configuration: getConfiguration()
        });

        return getState();
    }


    /* =====================================================
       2. CONFIGURATION
       ===================================================== */

    function sanitizeConfiguration(options) {
        if (!options || typeof options !== "object") {
            return {};
        }

        const safeOptions = {};

        Object.keys(DEFAULT_CONFIG).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(options, key)) {
                safeOptions[key] = options[key];
            }
        });

        return safeOptions;
    }

    function setConfiguration(updates = {}) {
        const safeUpdates = sanitizeConfiguration(updates);

        state.configuration = {
            ...state.configuration,
            ...safeUpdates
        };

        emit("engine:configuration-changed", {
            configuration: getConfiguration()
        });

        return getConfiguration();
    }

    function getConfiguration() {
        return {
            ...state.configuration
        };
    }


    /* =====================================================
       3. PROMPT NORMALIZATION
       ===================================================== */

    function normalizePrompt(value) {
        if (typeof value !== "string") {
            return "";
        }

        return value
            .replace(/\r\n/g, "\n")
            .replace(/[ \t]+/g, " ")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    }

    function validatePrompt(value) {
        const prompt = normalizePrompt(value);

        if (!prompt) {
            return {
                valid: false,
                prompt: "",
                error:
                    "Describe what you would like ToolXone to create."
            };
        }

        if (prompt.length < 10) {
            return {
                valid: false,
                prompt,
                error:
                    "Please add a little more detail about your idea."
            };
        }

        const maximumLength =
            Number(state.configuration.maximumPromptLength) || 700;

        if (prompt.length > maximumLength) {
            return {
                valid: false,
                prompt,
                error:
                    `Please keep your idea within ${maximumLength} characters.`
            };
        }

        return {
            valid: true,
            prompt,
            error: null
        };
    }


    /* =====================================================
       4. REQUEST CREATION
       ===================================================== */

    function createRequest(input = {}) {
        const promptValidation =
            validatePrompt(input.prompt);

        if (!promptValidation.valid) {
            throw new ToolXoneAIError(
                promptValidation.error,
                "INVALID_PROMPT"
            );
        }

        const request = {
            id: createId("request"),
            studio:
                cleanString(
                    input.studio,
                    state.currentStudio ||
                    state.configuration.studioName
                ),

            prompt: promptValidation.prompt,

            platform:
                cleanString(
                    input.platform,
                    state.configuration.platform
                ),

            tone:
                cleanString(
                    input.tone,
                    state.configuration.tone
                ),

            language:
                cleanString(
                    input.language,
                    state.configuration.language
                ),

            createdAt: new Date().toISOString(),

            metadata:
                input.metadata &&
                typeof input.metadata === "object"
                    ? { ...input.metadata }
                    : {}
        };

        state.currentRequest = request;
        state.lastError = null;

        emit("request:created", {
            request: clone(request)
        });

        return clone(request);
    }


    /* =====================================================
       5. RESULT NORMALIZATION
       ===================================================== */

    function normalizeResult(rawResult = {}) {
        if (!rawResult || typeof rawResult !== "object") {
            throw new ToolXoneAIError(
                "The AI returned an invalid response.",
                "INVALID_AI_RESPONSE"
            );
        }

        const result = {
            id:
                cleanString(
                    rawResult.id,
                    createId("result")
                ),

            requestId:
                cleanString(
                    rawResult.requestId,
                    state.currentRequest?.id || ""
                ),

            studio:
                cleanString(
                    rawResult.studio,
                    state.currentStudio ||
                    state.configuration.studioName
                ),

            headline:
                cleanString(
                    rawResult.headline,
                    "Your Idea, Professionally Created"
                ),

            subtitle:
                cleanString(
                    rawResult.subtitle,
                    "A professional design created from your description."
                ),

            kicker:
                cleanString(
                    rawResult.kicker,
                    "Created with ToolXone AI"
                ),

            callToAction:
                cleanString(
                    rawResult.callToAction ||
                    rawResult.cta,
                    "Learn More"
                ),

            website:
                cleanString(
                    rawResult.website,
                    ""
                ),

            brandName:
                cleanString(
                    rawResult.brandName,
                    "Your Brand"
                ),

            industry:
                cleanString(
                    rawResult.industry,
                    "General"
                ),

            audience:
                cleanString(
                    rawResult.audience,
                    "General Audience"
                ),

            goal:
                cleanString(
                    rawResult.goal,
                    "Brand Awareness"
                ),

            tone:
                cleanString(
                    rawResult.tone,
                    state.currentRequest?.tone ||
                    state.configuration.tone
                ),

            platform:
                cleanString(
                    rawResult.platform,
                    state.currentRequest?.platform ||
                    state.configuration.platform
                ),

            language:
                cleanString(
                    rawResult.language,
                    state.currentRequest?.language ||
                    state.configuration.language
                ),

            theme:
                normalizeTheme(rawResult.theme),

            layout:
                normalizeLayout(rawResult.layout),

            palette:
                normalizePalette(rawResult.palette),

            visualElements:
                normalizeStringArray(
                    rawResult.visualElements ||
                    rawResult.graphics ||
                    rawResult.assets
                ),

            designReasons:
                normalizeStringArray(
                    rawResult.designReasons ||
                    rawResult.reasoning ||
                    rawResult.explanations
                ),

            alternativeHeadlines:
                normalizeStringArray(
                    rawResult.alternativeHeadlines
                ),

            alternativeCallsToAction:
                normalizeStringArray(
                    rawResult.alternativeCallsToAction ||
                    rawResult.alternativeCtas
                ),

            backgroundPrompt:
                cleanString(
                    rawResult.backgroundPrompt,
                    ""
                ),

            createdAt:
                cleanString(
                    rawResult.createdAt,
                    new Date().toISOString()
                )
        };

        state.currentResult = result;
        state.lastError = null;

        emit("result:normalized", {
            result: clone(result)
        });

        return clone(result);
    }


    /* =====================================================
       6. GENERATION STATE
       ===================================================== */

    function startGeneration(request = null) {
        if (state.isGenerating) {
            throw new ToolXoneAIError(
                "A banner is already being created.",
                "GENERATION_IN_PROGRESS"
            );
        }

        if (request) {
            state.currentRequest = clone(request);
        }

        state.isGenerating = true;
        state.lastError = null;

        emit("generation:started", {
            request: clone(state.currentRequest)
        });
    }

    function completeGeneration(result) {
        state.isGenerating = false;
        state.currentResult = clone(result);
        state.lastError = null;

        emit("generation:completed", {
            result: clone(result)
        });

        return clone(result);
    }

    function failGeneration(error) {
        const normalizedError =
            normalizeError(error);

        state.isGenerating = false;
        state.lastError = normalizedError;

        emit("generation:failed", {
            error: clone(normalizedError)
        });

        return clone(normalizedError);
    }

    function reset() {
        state.isGenerating = false;
        state.currentRequest = null;
        state.currentResult = null;
        state.lastError = null;

        emit("engine:reset", {});

        return getState();
    }


    /* =====================================================
       7. EVENT SYSTEM
       ===================================================== */

    function on(eventName, callback) {
        if (
            typeof eventName !== "string" ||
            typeof callback !== "function"
        ) {
            return function unsubscribe() {};
        }

        if (!eventListeners.has(eventName)) {
            eventListeners.set(eventName, new Set());
        }

        eventListeners
            .get(eventName)
            .add(callback);

        return function unsubscribe() {
            off(eventName, callback);
        };
    }

    function off(eventName, callback) {
        const listeners =
            eventListeners.get(eventName);

        if (!listeners) {
            return;
        }

        listeners.delete(callback);

        if (listeners.size === 0) {
            eventListeners.delete(eventName);
        }
    }

    function emit(eventName, detail = {}) {
        const listeners =
            eventListeners.get(eventName);

        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(clone(detail));
                } catch (error) {
                    console.error(
                        `[ToolXone AI] Listener error for "${eventName}":`,
                        error
                    );
                }
            });
        }

        if (typeof window.CustomEvent === "function") {
            window.dispatchEvent(
                new CustomEvent(
                    `toolxone-ai:${eventName}`,
                    {
                        detail: clone(detail)
                    }
                )
            );
        }
    }


    /* =====================================================
       8. HELPERS
       ===================================================== */

    function cleanString(value, fallback = "") {
        if (typeof value !== "string") {
            return fallback;
        }

        const cleaned = value.trim();

        return cleaned || fallback;
    }

    function normalizeTheme(value) {
        const supportedThemes = [
            "emerald",
            "blue",
            "dark",
            "minimal",
            "purple",
            "warm",
            "luxury",
            "playful"
        ];

        const theme =
            cleanString(value, "emerald")
                .toLowerCase();

        return supportedThemes.includes(theme)
            ? theme
            : "emerald";
    }

    function normalizeLayout(value) {
        const supportedLayouts = [
            "bold-left",
            "centered-hero",
            "split-layout",
            "minimal-editorial",
            "product-spotlight",
            "promotional-sale",
            "modern-technology"
        ];

        const layout =
            cleanString(value, "bold-left")
                .toLowerCase();

        return supportedLayouts.includes(layout)
            ? layout
            : "bold-left";
    }

    function normalizePalette(value) {
        if (!value || typeof value !== "object") {
            return {
                primary: "",
                secondary: "",
                accent: "",
                background: "",
                text: ""
            };
        }

        return {
            primary:
                cleanString(value.primary, ""),

            secondary:
                cleanString(value.secondary, ""),

            accent:
                cleanString(value.accent, ""),

            background:
                cleanString(value.background, ""),

            text:
                cleanString(value.text, "")
        };
    }

    function normalizeStringArray(value) {
        if (!Array.isArray(value)) {
            return [];
        }

        return value
            .filter(item => typeof item === "string")
            .map(item => item.trim())
            .filter(Boolean)
            .slice(0, 20);
    }

    function createId(prefix = "item") {
        const randomPart =
            Math.random()
                .toString(36)
                .slice(2, 10);

        const timePart =
            Date.now()
                .toString(36);

        return `${prefix}-${timePart}-${randomPart}`;
    }

    function clone(value) {
        if (value === undefined) {
            return undefined;
        }

        return JSON.parse(
            JSON.stringify(value)
        );
    }

    function normalizeError(error) {
        if (error instanceof ToolXoneAIError) {
            return {
                name: error.name,
                message: error.message,
                code: error.code,
                details: clone(error.details || {}),
                timestamp: new Date().toISOString()
            };
        }

        return {
            name: "ToolXoneAIError",
            message:
                error?.message ||
                "Something went wrong while creating your design.",

            code:
                error?.code ||
                "UNKNOWN_ERROR",

            details: {},
            timestamp: new Date().toISOString()
        };
    }


    /* =====================================================
       9. STATE ACCESS
       ===================================================== */

    function getState() {
        return clone({
            initialized: state.initialized,
            isGenerating: state.isGenerating,
            currentStudio: state.currentStudio,
            currentRequest: state.currentRequest,
            currentResult: state.currentResult,
            lastError: state.lastError,
            configuration: state.configuration,
            version: ENGINE_VERSION
        });
    }

    function getCurrentRequest() {
        return clone(state.currentRequest);
    }

    function getCurrentResult() {
        return clone(state.currentResult);
    }

    function isGenerating() {
        return state.isGenerating;
    }


    /* =====================================================
       10. CUSTOM ERROR
       ===================================================== */

    class ToolXoneAIError extends Error {
        constructor(
            message,
            code = "TOOLXONE_AI_ERROR",
            details = {}
        ) {
            super(message);

            this.name = "ToolXoneAIError";
            this.code = code;
            this.details = details;
        }
    }


    /* =====================================================
       11. PUBLIC API
       ===================================================== */

    window.ToolXoneAI = Object.freeze({
        version: ENGINE_VERSION,

        initialize,
        reset,

        setConfiguration,
        getConfiguration,

        normalizePrompt,
        validatePrompt,
        createRequest,
        normalizeResult,

        startGeneration,
        completeGeneration,
        failGeneration,

        getState,
        getCurrentRequest,
        getCurrentResult,
        isGenerating,

        on,
        off,
        emit,

        ToolXoneAIError
    });

})();