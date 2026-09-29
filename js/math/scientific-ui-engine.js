/* =========================================================
   ToolXone Scientific Calculator
   Professional UI Engine
   ---------------------------------------------------------
   File:
   js/math/scientific-ui-engine.js

   Responsibilities:
   - Connect calculator DOM to Scientific Control Engine
   - Render expression / result / calculator state
   - Dispatch button actions
   - Manage visual indicators
   - Provide keyboard interaction
   - Keep UI synchronized with controller state

   IMPORTANT:
   This layer performs NO scientific mathematics.
   Mathematics belongs to the Math / Evaluation engines.
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       CONSTANTS
       ===================================================== */

    const VERSION = "1.0.0";

    const DEFAULT_SELECTORS = {
        root: [
            "[data-scientific-calculator]",
            ".scientific-calculator",
            ".calculator",
            "#scientific-calculator"
        ],

        display: [
            "[data-scientific-display]",
            "#scientific-display",
            "#display",
            ".calculator-display"
        ],

        expression: [
            "[data-scientific-expression]",
            "#scientific-expression",
            "#expression",
            ".calculator-expression"
        ],

        result: [
            "[data-scientific-result]",
            "#scientific-result",
            "#result",
            ".calculator-result"
        ],

        numberWords: [
            "[data-scientific-number-words]",
            "#scientificNumberWords",
            ".scientific-number-words"
        ],

        mode: [
            "[data-scientific-mode]",
            "#scientific-mode",
            ".scientific-mode"
        ],

        angle: [
            "[data-scientific-angle]",
            "#scientific-angle",
            ".scientific-angle"
        ],

        status: [
            "[data-scientific-status]",
            "#status"
        ],

        shift: [
            "[data-scientific-shift]",
            "#scientific-shift",
            ".scientific-shift"
        ],

        alpha: [
            "[data-scientific-alpha]",
            "#scientific-alpha",
            ".scientific-alpha"
        ],

        memory: [
            "[data-scientific-memory]",
            "#scientific-memory",
            ".scientific-memory"
        ],

        grandTotal: [
            "[data-scientific-gt]",
            "#scientific-gt",
            ".scientific-gt"
        ],

        error: [
            "[data-scientific-error]",
            "#scientific-error",
            ".scientific-error"
        ]
    };

    /* =====================================================
       INTERNAL STATE
       ===================================================== */

    let initialized = false;
    let controller = null;
    let rootElement = null;

    const elements = {
        display: null,
        expression: null,
        result: null,
        numberWords: null,
        mode: null,
        angle: null,
        status: null,
        shift: null,
        alpha: null,
        memory: null,
        grandTotal: null,
        error: null
    };

    /* =====================================================
       UTILITIES
       ===================================================== */

    function firstElement(selectors, scope) {
        const searchScope = scope || document;

        for (const selector of selectors) {
            const element =
                searchScope.querySelector(selector);

            if (element) {
                return element;
            }
        }

        return null;
    }

    function findRoot() {
        return firstElement(
            DEFAULT_SELECTORS.root,
            document
        );
    }

    function findElement(name) {
        const selectors =
            DEFAULT_SELECTORS[name];

        if (!selectors) {
            return null;
        }

        if (rootElement) {
            const insideRoot =
                firstElement(
                    selectors,
                    rootElement
                );

            if (insideRoot) {
                return insideRoot;
            }
        }

        return firstElement(
            selectors,
            document
        );
    }

    function setText(element, value) {
        if (!element) {
            return;
        }

        element.textContent =
            value === null ||
            value === undefined
                ? ""
                : String(value);
    }

    function setActive(element, active) {
        if (!element) {
            return;
        }

        element.classList.toggle(
            "is-active",
            !!active
        );

        element.setAttribute(
            "aria-pressed",
            active ? "true" : "false"
        );
    }

    function safeNumber(value, fallback) {
        const number = Number(value);

        return Number.isFinite(number)
            ? number
            : fallback;
    }

    function getController() {
        return (
            window.ToolXoneScientificControl ||
            null
        );
    }

    function hasMethod(name) {
        return (
            controller &&
            typeof controller[name] === "function"
        );
    }

    function callController(
        name,
        ...args
    ) {
        if (!hasMethod(name)) {
            return {
                success: false,
                unavailable: true,
                error: new Error(
                    `Scientific control method not available: ${name}`
                )
            };
        }

        try {
            const value =
                controller[name](...args);

            return {
                success: true,
                value
            };
        } catch (error) {
            return {
                success: false,
                error
            };
        }
    }

    /* =====================================================
       DOM DISCOVERY
       ===================================================== */

function discoverElements() {

    if (!rootElement) {
        rootElement = findRoot();
    }

    elements.display =
        findElement("display");

        elements.expression =
            findElement("expression");

        elements.result =
            findElement("result");

        elements.numberWords =
            findElement("numberWords");

        elements.mode =
            findElement("mode");

        elements.angle =
            findElement("angle");

        elements.status =
            findElement("status");

        elements.shift =
            findElement("shift");

        elements.alpha =
            findElement("alpha");

        elements.memory =
            findElement("memory");

        elements.grandTotal =
            findElement("grandTotal");

        elements.error =
            findElement("error");

        return {
            root: rootElement,
            ...elements
        };
    }

    /* =====================================================
       SNAPSHOT
       ===================================================== */

    function getSnapshot() {
        if (!controller) {
            return null;
        }

        if (hasMethod("getSnapshot")) {
            try {
                return controller.getSnapshot();
            } catch (error) {
                console.warn(
                    "[ToolXone Scientific UI] Snapshot failed:",
                    error
                );
            }
        }

        return null;
    }

    /* =====================================================
       DISPLAY FORMATTING
       ===================================================== */

    function formatExpression(expression) {

    if (
        expression === null ||
        expression === undefined ||
        expression === ""
    ) {
        return "";
    }

    const text =
        String(expression)
            .replace(/\*/g, "×")
            .replace(/\//g, "÷");

    /*
    --------------------------------------------------------
    Format numeric tokens for display only.

    IMPORTANT:
    Commas are NEVER written back into calculator state.
    --------------------------------------------------------
    */

    return text.replace(
        /(?:\d+\.\d*|\.\d+|\d+)/g,
        formatNumberToken
    );
}


function formatNumberToken(value) {

    const hasTrailingDecimal =
        value.endsWith(".");

    const startsWithDecimal =
        value.startsWith(".");

    const parts =
        value.split(".");

    const integerPart =
        startsWithDecimal
            ? "0"
            : parts[0];

    const decimalPart =
        parts[1];

    const formattedInteger =
        integerPart.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
        );

    if (hasTrailingDecimal) {
        return (
            `${formattedInteger}.`
        );
    }

    if (
        decimalPart !== undefined
    ) {
        return (
            `${formattedInteger}.` +
            decimalPart
        );
    }

    return formattedInteger;
}

    function formatResult(result) {

    if (
        result === null ||
        result === undefined ||
        result === ""
    ) {
        return "0";
    }

    const numeric =
        Number(result);

    if (
        !Number.isFinite(numeric)
    ) {
        return String(result);
    }

    if (
        Object.is(numeric, -0)
    ) {
        return "0";
    }

    /*
    --------------------------------------------------------
    Use ToolXone shared Number Engine.
    --------------------------------------------------------
    */

    if (
        window.ToolXoneNumberEngine &&
        typeof
            window.ToolXoneNumberEngine.format ===
            "function"
    ) {

        return (
            window.ToolXoneNumberEngine.format(
                numeric,
                {
                    maximumFractionDigits: 12,
                    useGrouping: true
                }
            )
        );
    }

    /*
    --------------------------------------------------------
    Safe fallback if Number Engine is unavailable.
    --------------------------------------------------------
    */

    return new Intl.NumberFormat(
        "en-US",
        {
            useGrouping: true,
            maximumFractionDigits: 12
        }
    ).format(numeric);
}

    /* =====================================================
       RENDERING
       ===================================================== */

    function renderExpression(state) {
        if (!state) {
            return;
        }

        const expression =
            formatExpression(
                state.expression
            );

        setText(
            elements.expression,
            expression
        );

        /*
         * Compatibility:
         * Existing calculator may currently use one
         * display element rather than separate
         * expression/result elements.
         */

        if (
            elements.display &&
            !elements.result
        ) {
            setText(
                elements.display,
                expression ||
                formatResult(
                    state.result
                )
            );
        }
    }

    function renderResult(state) {
        if (!state) {
            return;
        }

        const result =
            formatResult(
                state.result
            );

        setText(
            elements.result,
            result
        );

        if (
            elements.display &&
            !elements.expression &&
            !elements.result
        ) {
            setText(
                elements.display,
                result
            );
        }
    }

    function renderNumberWords(state) {

    if (
        !state ||
        !elements.numberWords
    ) {
        return;
    }

    const result =
        state.result;

    /*
    --------------------------------------------------------
    Only show words for a valid finite result.
    --------------------------------------------------------
    */

    const numeric =
        Number(result);

    if (
        !Number.isFinite(numeric)
    ) {

        elements.numberWords.textContent = "";
        elements.numberWords.hidden = true;

        return;
    }

    /*
    --------------------------------------------------------
    Use the shared ToolXone Number Engine.
    --------------------------------------------------------
    */

    if (
        !window.ToolXoneNumberEngine ||
        typeof
            window.ToolXoneNumberEngine.words !==
            "function"
    ) {

        elements.numberWords.textContent = "";
        elements.numberWords.hidden = true;

        return;
    }

    const words =
        window.ToolXoneNumberEngine.words(
            numeric,
            {
                decimalLimit: 12
            }
        );

    elements.numberWords.textContent =
        words || "";

    elements.numberWords.hidden =
        !words;
}

    function renderMode(state) {
        if (!state) {
            return;
        }

        setText(
            elements.mode,
            state.mode || "COMP"
        );

        if (rootElement) {
            rootElement.dataset.mode =
                state.mode || "COMP";
        }
    }

    function renderAngle(state) {
        if (!state) {
            return;
        }

        setText(
            elements.angle,
            state.angleMode || "DEG"
        );

        if (rootElement) {
            rootElement.dataset.angle =
                state.angleMode || "DEG";
        }
    }

function renderStatus(state) {
    if (!state) {
        return;
    }

    const mode =
        state.mode || "COMP";

    const angleMode =
        state.angleMode || "DEG";

    setText(
        elements.status,
        `${mode} • ${angleMode}`
    );
}

/* =====================================================
   DYNAMIC SCIENTIFIC FUNCTION DECK
   -----------------------------------------------------
   Renders primary / SHIFT labels directly from the
   Scientific Function Registry.
   ===================================================== */

function renderScientificFunctionDeck(state) {

    const registry =
        window.ToolXoneScientificFunctions;

    if (
        !registry ||
        typeof registry.resolve !== "function"
    ) {
        return;
    }

    const shiftActive =
        !!(state && state.shift);

    const buttons =
        rootElement
            ? rootElement.querySelectorAll(
                "[data-sci-function]"
            )
            : document.querySelectorAll(
                "[data-sci-function]"
            );

    buttons.forEach(button => {

        const functionId =
            button.dataset.sciFunction;

        if (!functionId) {
            return;
        }

        const resolved =
            registry.resolve(
                functionId,
                shiftActive
            );

        if (
            !resolved ||
            !resolved.success
        ) {
            return;
        }

        /*
         * Update the visible key label.
         */
        button.textContent =
            resolved.label;

        /*
         * Keep execution routed through the registry.
         *
         * We deliberately DO NOT replace data-sci-action
         * with resolved.action here.
         *
         * The button continues to dispatch:
         *
         * registry-function → function ID
         *
         * and resolveScientificRegistryFunction()
         * determines the correct action at click time.
         */
        button.dataset.sciAction =
            "registry-function";

        button.dataset.sciValue =
            functionId;

        /*
         * Expose the rendered state for CSS,
         * accessibility and future QA.
         */
        button.dataset.sciShifted =
            resolved.shifted
                ? "true"
                : "false";

        button.setAttribute(
            "aria-label",
            resolved.label
        );
    });
}

    function renderShift(state) {
        if (!state) {
            return;
        }

        const active =
            !!state.shift;

        setActive(
            elements.shift,
            active
        );

        if (rootElement) {
            rootElement.dataset.shift =
                active ? "true" : "false";
        }
        
        renderScientificFunctionDeck(state);

    }

    function renderAlpha(state) {
        if (!state) {
            return;
        }

        const active =
            !!state.alpha;

        setActive(
            elements.alpha,
            active
        );

        if (rootElement) {
            rootElement.dataset.alpha =
                active ? "true" : "false";
        }
    }

    function renderMemory(state) {
        if (!state) {
            return;
        }

        const memory =
            safeNumber(
                state.memory,
                0
            );

        const active =
            memory !== 0;

        setText(
            elements.memory,
            active ? "M" : ""
        );

        if (rootElement) {
            rootElement.dataset.memory =
                active ? "true" : "false";
        }
    }

    function renderGrandTotal(state) {
        if (!state) {
            return;
        }

        const gt =
            safeNumber(
                state.grandTotal,
                0
            );

        setText(
            elements.grandTotal,
            gt !== 0
                ? "GT"
                : ""
        );

        if (rootElement) {
            rootElement.dataset.gt =
                gt !== 0
                    ? "true"
                    : "false";
        }
    }

    function renderError(state) {
        if (!state) {
            return;
        }

        const error =
            state.error;

        let message = "";

        if (error) {
            if (
                typeof error === "string"
            ) {
                message = error;
            } else if (
                error.message
            ) {
                message =
                    error.message;
            } else {
                message =
                    "Calculation error";
            }
        }

        setText(
            elements.error,
            message
        );

        if (rootElement) {
            rootElement.classList.toggle(
                "has-error",
                !!error
            );
        }
    }

    function render(
        suppliedState
    ) {
        const state =
            suppliedState ||
            getSnapshot();

        if (!state) {
            return null;
        }

        renderExpression(state);
        renderResult(state);
        renderNumberWords(state);
        renderMode(state);
        renderAngle(state);
        renderStatus(state);
        renderShift(state);
        renderAlpha(state);
        renderMemory(state);
        renderGrandTotal(state);
        renderError(state);

        if (rootElement) {
            rootElement.dispatchEvent(
                new CustomEvent(
                    "toolxone:scientific-render",
                    {
                        detail: {
                            state
                        }
                    }
                )
            );
        }

        return state;
    }

    /* =====================================================
       ACTION EXECUTION
       ===================================================== */

    function execute(
        method,
        ...args
    ) {
        const response =
            callController(
                method,
                ...args
            );

        const state =
            render();

        if (
            !response.success &&
            !response.unavailable
        ) {
            console.warn(
                `[ToolXone Scientific UI] ${method} failed:`,
                response.error
            );
        }

        return {
            ...response,
            state
        };
    }

    /* =====================================================
       BUTTON ACTIONS
       ===================================================== */

    function input(value) {
        return execute(
            "appendExpression",
            String(value)
        );
    }

    function digit(value) {
        return input(value);
    }

    function operator(value) {
        const map = {
            "×": "*",
            "÷": "/",
            "−": "-"
        };

        return input(
            map[value] || value
        );
    }

    function decimal() {
        return input(".");
    }

    function equals() {
        return execute(
            "evaluateExpression"
        );
    }

    function del() {
        return execute(
            "deleteLast"
        );
    }

    function clearEntry() {
        return execute(
            "clearEntry"
        );
    }

    function allClear() {
        return execute(
            "allClear"
        );
    }

    function shift() {
        return execute(
            "toggleShift"
        );
    }

    function alpha() {
        return execute(
            "toggleAlpha"
        );
    }

    function cycleAngle() {
        return execute(
            "cycleAngleMode"
        );
    }

    function setAngle(mode) {
        return execute(
            "setAngleMode",
            mode
        );
    }

    function setMode(mode) {
        return execute(
            "setMode",
            mode
        );
    }

    function ans() {
        return execute(
            "insertAns"
        );
    }

    function pi() {
        return execute(
            "insertPi"
        );
    }

    function euler() {
        return execute(
            "insertE"
        );
    }

    function square() {
        return execute(
            "insertSquare"
        );
    }

    function power() {
        return execute(
            "insertPower"
        );
    }

    function factorial() {
        return execute(
            "insertFactorial"
        );
    }

    function inverseSquare() {
    return execute(
        "insertInverseSquare"
    );
}

function nthRoot() {
    return execute(
        "insertNthRoot"
    );
}

function reciprocal() {
    return execute(
        "insertReciprocal"
    );
}

function combination() {
    return execute(
        "insertCombination"
    );
}

function permutation() {
    return execute(
        "insertPermutation"
    );
}

    function percent() {
        return execute(
            "insertPercent"
        );
    }

    function leftParenthesis() {
        return execute(
            "insertLeftParenthesis"
        );
    }

    function rightParenthesis() {
        return execute(
            "insertRightParenthesis"
        );
    }


    function memoryStore() {
        return execute(
            "memoryStore"
        );
    }

    function memoryRecall() {
        return execute(
            "memoryRecall"
        );
    }

    function memoryClear() {
        return execute(
            "memoryClear"
        );
    }

    function memoryAdd() {
        return execute(
            "memoryAdd"
        );
    }

    function memorySubtract() {
        return execute(
            "memorySubtract"
        );
    }

    function historyUp() {
        return execute(
            "historyUp"
        );
    }

    function historyDown() {
        return execute(
            "historyDown"
        );
    }

    function clearGrandTotal() {
        return execute(
            "clearGrandTotal"
        );
    }

    function recallGrandTotal() {
        return execute(
            "recallGrandTotal"
        );
    }

    /* =====================================================
       DECLARATIVE BUTTON DISPATCH
       -----------------------------------------------------
       Future professional HTML can use:

       data-sci-action="digit"
       data-sci-value="7"

       data-sci-action="operator"
       data-sci-value="+"

       etc.
       ===================================================== */

    function dispatchAction(
        action,
        value
    ) {
        switch (action) {

            case "digit":
                return digit(value);

            case "input":
                return input(value);

            case "operator":
                return operator(value);

            case "decimal":
                return decimal();

            case "equals":
            case "evaluate":
                return equals();

            case "delete":
            case "del":
                return del();

            case "ce":
            case "clear-entry":
                return clearEntry();

            case "ac":
            case "all-clear":
                return allClear();

            case "shift":
                return shift();

            case "alpha":
                return alpha();

            case "angle":
                return cycleAngle();

            case "set-angle":
                return setAngle(value);

            case "mode":
                return setMode(value);

            case "ans":
                return ans();

            case "pi":
                return pi();

            case "e":
                return euler();

            case "square":
                return square();

            case "power":
                return power();

            case "factorial":
                return factorial();

            case "inverse-square":
                return inverseSquare();

            case "nth-root":
                return nthRoot();

            case "reciprocal":
                return reciprocal();

            case "combination":
                return combination();

            case "permutation":
                return permutation();
                    
            case "percent":
                return percent();

            case "left-parenthesis":
                return leftParenthesis();

            case "right-parenthesis":
                return rightParenthesis();

            case "function":
                return execute(
                    "insertFunction",
                    value
                );    

            case "registry-function":
                return resolveScientificRegistryFunction(
                    value
                );    
            
            case "mc":
                return memoryClear();

            case "mr":
                return memoryRecall();

            case "ms":
                return memoryStore();

            case "m+":
                return memoryAdd();

            case "m-":
                return memorySubtract();

            case "history-up":
                return historyUp();

            case "history-down":
                return historyDown();

            case "gt":
                return recallGrandTotal();

            case "gt-clear":
                return clearGrandTotal();

            default:
                return {
                    success: false,
                    unavailable: true,
                    error: new Error(
                        `Unknown scientific UI action: ${action}`
                    )
                };
        }
    }

    /* =====================================================
   SCIENTIFIC FUNCTION REGISTRY ROUTING
   ===================================================== */

function resolveScientificRegistryFunction(
    functionId
) {
    const registry =
        window.ToolXoneScientificFunctions;

    if (
        !registry ||
        typeof registry.resolve !== "function"
    ) {
        return {
            success: false,
            unavailable: true,
            error: new Error(
                "Scientific Function Registry unavailable"
            )
        };
    }

    const state =
        getSnapshot();

    const shiftActive =
        !!(state && state.shift);

    const resolved =
        registry.resolve(
            functionId,
            shiftActive
        );

    if (
        !resolved ||
        !resolved.success
    ) {
        return {
            success: false,
            unavailable: true,
            error: new Error(
                `Unknown scientific function: ${functionId}`
            )
        };
    }

if (
    resolved.shifted &&
    typeof execute === "function"
) {
    execute("consumeShift");
}

return dispatchAction(
    resolved.action,
    resolved.value
);

}

    /* =====================================================
   CLICK HANDLER
   Robust pointer/click delegation
   ===================================================== */

function handleClick(event) {

    if (!initialized) {
        return;
    }

    const target = event.target;

    if (
        !target ||
        typeof target.closest !== "function"
    ) {
        return;
    }

    const button =
        target.closest(
            "[data-sci-action]"
        );

        if (button) {

    console.log(
        "[ToolXone Scientific UI] " +
        "Pointer click detected:",
        {
            action: button.dataset.sciAction,
            value: button.dataset.sciValue,
            text: button.textContent.trim()
        }
    );
}

    if (!button) {
        return;
    }

    if (
        rootElement &&
        !rootElement.contains(button)
    ) {
        return;
    }

    if (
        button.disabled ||
        button.getAttribute("aria-disabled") === "true"
    ) {
        return;
    }

    const action =
        button.dataset.sciAction;

    const value =
        button.dataset.sciValue;

    if (!action) {
        return;
    }

    dispatchAction(
        action,
        value
    );
}

    /* =====================================================
       KEYBOARD HANDLER
       ===================================================== */

function handleKeyboard(event) {

    /* ---------------------------------------------------------
       History shortcuts
       Ctrl + ↑ → previous history entry
       Ctrl + ↓ → next history entry
       --------------------------------------------------------- */

    if (event.ctrlKey && event.key === "ArrowUp") {
        event.preventDefault();
        historyUp();
        return;
    }

    if (event.ctrlKey && event.key === "ArrowDown") {
        event.preventDefault();
        historyDown();
        return;
    }

    if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
    ) {
        return;
    }

        const target =
            event.target;

        if (
            target &&
            (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.isContentEditable
            )
        ) {
            return;
        }

        const key =
            event.key;

        if (/^[0-9]$/.test(key)) {
            event.preventDefault();
            digit(key);
            return;
        }

        if (
            ["+", "-", "*", "/"].includes(key)
        ) {
            event.preventDefault();
            operator(key);
            return;
        }

        switch (key) {

            case ".":
                event.preventDefault();
                decimal();
                break;

            case "(":
                event.preventDefault();
                leftParenthesis();
                break;

            case ")":
                event.preventDefault();
                rightParenthesis();
                break;

            case "%":
                event.preventDefault();
                percent();
                break;

            case "^":
                event.preventDefault();
                power();
                break;

            case "Enter":
            case "=":
                event.preventDefault();
                equals();
                break;

            case "Backspace":
                event.preventDefault();
                del();
                break;

            case "Delete":
                event.preventDefault();
                clearEntry();
                break;

            case "Escape":
                event.preventDefault();
                allClear();
                break;

        }
    }

    /* =====================================================
       EVENT BINDING
       ===================================================== */

    function bindEvents() {

    document.addEventListener(
        "click",
        handleClick,
        true
    );

    document.addEventListener(
        "keydown",
        handleKeyboard
    );
}

    function unbindEvents() {

    document.removeEventListener(
        "click",
        handleClick,
        true
    );

    document.removeEventListener(
        "keydown",
        handleKeyboard
    );
}

    /* =====================================================
       INITIALIZATION
       ===================================================== */

    function initialize(options) {
        if (initialized) {
            return {
                success: true,
                alreadyInitialized: true,
                state: getSnapshot()
            };
        }

    controller =
    getController();

if (!controller) {
    console.warn(
        "[ToolXone Scientific UI] " +
        "Scientific Control Engine not found."
    );

    return {
        success: false,
        error: new Error(
            "ToolXoneScientificControl is unavailable"
        )
    };
}

if (
    options &&
    options.root
) {
    rootElement =
        options.root;
}

discoverElements();

        bindEvents();

        initialized = true;

        const state =
            render();

        console.log(
            `🔬 ToolXone Scientific UI Engine v${VERSION} initialized`
        );

        return {
            success: true,
            state,
            elements: {
                root: rootElement,
                ...elements
            }
        };
    }

    function destroy() {
        if (!initialized) {
            return false;
        }

        unbindEvents();

        initialized = false;
        controller = null;
        rootElement = null;

        for (
            const key of
            Object.keys(elements)
        ) {
            elements[key] = null;
        }

        return true;
    }

    function isInitialized() {
        return initialized;
    }

    /* =====================================================
       CAPABILITIES
       ===================================================== */

    function getCapabilities() {
        return {
            version: VERSION,

            initialized,

            controller:
                !!controller,

            rendering: true,

            keyboard: true,

            declarativeButtons: true,

            expression: true,

            result: true,

            modes: true,

            angleModes: true,

            shift: true,

            alpha: true,

            memory: true,

            history: true,

            grandTotal: true,

            errors: true
        };
    }

    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.ToolXoneScientificUI = {

        // Lifecycle
        initialize,
        destroy,
        isInitialized,

        // Inspection
        getSnapshot,
        getCapabilities,
        discoverElements,

        // Rendering
        render,
        formatExpression,
        formatResult,

        // Generic dispatch
        dispatchAction,
        execute,

        // Input
        input,
        digit,
        operator,
        decimal,

        // Evaluation
        equals,

        // Clear
        del,
        clearEntry,
        allClear,

        // State controls
        shift,
        alpha,
        cycleAngle,
        setAngle,
        setMode,

        // Scientific input
        ans,
        pi,
        euler,
        square,
        power,
        factorial,
        percent,
        leftParenthesis,
        rightParenthesis,
      

        // Memory
        memoryStore,
        memoryRecall,
        memoryClear,
        memoryAdd,
        memorySubtract,

        // Replay
        historyUp,
        historyDown,

        // GT
        clearGrandTotal,
        recallGrandTotal
    };

    /* =====================================================
       SAFE AUTO INITIALIZATION
       ===================================================== */

    function autoInitialize() {
        if (
            window.ToolXoneScientificControl
        ) {
            initialize();
        }
    }

    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            autoInitialize,
            {
                once: true
            }
        );
    } else {
        autoInitialize();
    }

})();