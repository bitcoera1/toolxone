/**
 * ToolXone Professional Scientific Calculator
 * Scientific Control Engine
 * --------------------------------------------------
 * File:
 * js/math/scientific-control-engine.js
 *
 * Purpose:
 * High-level control layer between:
 *
 *   Professional Calculator UI
 *            ↓
 *   Scientific Control Engine
 *            ↓
 *   Scientific State Engine
 *            ↓
 *   Expression Evaluator / Math Engine
 *
 * Responsibilities:
 * - SHIFT / ALPHA
 * - Angle modes
 * - Memory controls
 * - ANS
 * - History / Replay
 * - GT (Grand Total)
 * - AC / DEL
 * - Expression editing
 * - Evaluation
 * - Error handling
 *
 * No DOM manipulation belongs in this engine.
 */

(function () {
    "use strict";

    /* =========================================
       DEPENDENCIES
    ========================================= */

    function getStateEngine() {
        return window.ToolXoneScientificState || null;
    }

    function getEvaluator() {
        return window.ToolXoneExpressionEvaluator || null;
    }

    function requireStateEngine() {
        const engine = getStateEngine();

        if (!engine) {
            throw new Error(
                "ToolXone Scientific State Engine is not available."
            );
        }

        return engine;
    }

    function requireEvaluator() {
        const evaluator = getEvaluator();

        if (!evaluator) {
            throw new Error(
                "ToolXone Expression Evaluator is not available."
            );
        }

        return evaluator;
    }

    /* =========================================
       INTERNAL CONTROL STATE
    ========================================= */

    const controlState = {
        mode: "COMP",
        angleMode: "DEG",

        shift: false,
        alpha: false,

        grandTotal: 0,

        error: null,

        justEvaluated: false
    };

    const VALID_ANGLE_MODES = [
        "DEG",
        "RAD",
        "GRAD"
    ];

    const VALID_CALCULATOR_MODES = [
        "COMP",
        "STAT",
        "TABLE",
        "EQN"
    ];

    /* =========================================
       GENERIC HELPERS
    ========================================= */

    function findMethod(object, names) {
        if (!object) return null;

        for (const name of names) {
            if (typeof object[name] === "function") {
                return name;
            }
        }

        return null;
    }

    function clone(value) {
        if (
            value === null ||
            value === undefined
        ) {
            return value;
        }

        if (typeof structuredClone === "function") {
            try {
                return structuredClone(value);
            } catch (_) {
                // Fall through.
            }
        }

        try {
            return JSON.parse(
                JSON.stringify(value)
            );
        } catch (_) {
            return value;
        }
    }

    function getStateSnapshot() {
        const engine = getStateEngine();

        if (!engine) return null;

        if (typeof engine.getState === "function") {
            return engine.getState();
        }

        if (typeof engine.getSnapshot === "function") {
            return engine.getSnapshot();
        }

        if (
            engine.state &&
            typeof engine.state === "object"
        ) {
            return clone(engine.state);
        }

        return null;
    }

    function getStateValue(names, fallback = null) {
        const state = getStateSnapshot();

        if (!state) return fallback;

        for (const name of names) {
            if (
                Object.prototype.hasOwnProperty.call(
                    state,
                    name
                )
            ) {
                return state[name];
            }
        }

        return fallback;
    }

    function callStateMethod(names, ...args) {
        const engine = requireStateEngine();
        const method = findMethod(engine, names);

        if (!method) {
            return {
                supported: false,
                method: null,
                value: undefined
            };
        }

        return {
            supported: true,
            method,
            value: engine[method](...args)
        };
    }

    function normalizeExpression(value) {
        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value);
    }

    function serializeInverseSquareOperand(value) {
        const text = String(value);

        if (!/[eE]/.test(text)) {
            return text;
        }

        const sign = text.startsWith("-") ? "-" : "";
        const [coefficient, exponentText] =
            (sign ? text.slice(1) : text).toLowerCase().split("e");
        const [whole, fraction = ""] = coefficient.split(".");
        const digits = whole + fraction;
        const decimalPosition = whole.length + Number(exponentText);

        if (decimalPosition <= 0) {
            return sign + "0." + "0".repeat(-decimalPosition) + digits;
        }

        if (decimalPosition >= digits.length) {
            return sign + digits + "0".repeat(decimalPosition - digits.length);
        }

        return sign +
            digits.slice(0, decimalPosition) + "." +
            digits.slice(decimalPosition);
    }

    function isFiniteResult(value) {
        return (
            typeof value === "number" &&
            Number.isFinite(value)
        );
    }

    /* =========================================
       EXPRESSION ACCESS
    ========================================= */

    function getExpression() {
        const engine = requireStateEngine();

        const getter = findMethod(engine, [
            "getExpression",
            "getInput"
        ]);

        if (getter) {
            return normalizeExpression(
                engine[getter]()
            );
        }

        return normalizeExpression(
            getStateValue(
                [
                    "expression",
                    "input",
                    "currentExpression"
                ],
                ""
            )
        );
    }

    function setExpression(expression) {
        const engine = requireStateEngine();

        const value =
            normalizeExpression(expression);

        const setter = findMethod(engine, [
            "setExpression",
            "setInput"
        ]);

        if (!setter) {
            throw new Error(
                "State engine does not expose an expression setter."
            );
        }

        engine[setter](value);

        controlState.error = null;

        return value;
    }

    function appendExpression(value) {
    const engine = requireStateEngine();
    const text = normalizeExpression(value);

    if (!text) {
        return getExpression();
    }

    /*
    ========================================================
    POST-EVALUATION INPUT HANDLING
    --------------------------------------------------------
    After "=":

    - New numbers / decimals / constants start a new
      calculation.
    - Binary operators continue from the previous result.
    - Postfix operators operate on the previous result.
    - Scientific functions start a new expression.
    ========================================================
    */

    if (controlState.justEvaluated) {

        const trimmedText =
            text.trim();

        const result =
            normalizeExpression(
                getResult()
            );

        /*
        ----------------------------------------------------
        Binary operators
        ----------------------------------------------------
        Continue from the previous result.

        12 =
        +
        →
        12+
        ----------------------------------------------------
        */

        const isBinaryOperator =
            [
                "+",
                "-",
                "*",
                "/",
                "^"
            ].includes(trimmedText);

        if (isBinaryOperator) {

            setExpression(
                result + trimmedText
            );

        }

        /*
        ----------------------------------------------------
        Postfix operators
        ----------------------------------------------------
        Apply directly to the previous result.

        12 =
        !
        →
        12!

        12 =
        %
        →
        12%
        ----------------------------------------------------
        */

        else if (
            trimmedText === "!" ||
            trimmedText === "%"
        ) {

            setExpression(
                result + trimmedText
            );

        }

        /*
        ----------------------------------------------------
        Square and inverse square
        ----------------------------------------------------
        12 =
        ^2
        →
        12^2
        ----------------------------------------------------
        */

        else if (
            trimmedText === "^(-2)" &&
            isFiniteResult(getResult())
        ) {
            setExpression(
                "(" + serializeInverseSquareOperand(getResult()) + ")^(-2)"
            );
        }

        else if (
            trimmedText === "^2"
        ) {

            setExpression(
                result + "^2"
            );

        }

        /*
        ----------------------------------------------------
        Everything else starts a NEW calculation.

        Examples:

        12 =
        7
        →
        7

        12 =
        .
        →
        .

        12 =
        π
        →
        π

        12 =
        sin(
        →
        sin(
        ----------------------------------------------------
        */

        else {

            setExpression(
                trimmedText
            );

        }

        controlState.error = null;
        controlState.justEvaluated = false;

        return getExpression();
    }

    /*
    ========================================================
    NORMAL INPUT
    --------------------------------------------------------
    No completed calculation exists, so append normally.
    ========================================================
    */

    const method =
        findMethod(
            engine,
            [
                "appendExpression",
                "appendInput",
                "append"
            ]
        );

    if (method) {

        engine[method](text);

    } else {

        setExpression(
            getExpression() + text
        );

    }

    controlState.error = null;
    controlState.justEvaluated = false;

    return getExpression();
}

    function deleteLast() {
        const engine = requireStateEngine();

        const method = findMethod(engine, [
            "deleteLast",
            "backspace",
            "deleteCharacter"
        ]);

        if (method) {
            engine[method]();
        } else {
            const expression =
                getExpression();

            setExpression(
                expression.slice(0, -1)
            );
        }

        controlState.error = null;
        controlState.justEvaluated = false;

        return getExpression();
    }

    /* =========================================
       RESULT / ANSWER ACCESS
    ========================================= */

    function getResult() {
        const engine = requireStateEngine();

        const getter = findMethod(engine, [
            "getResult",
            "getCurrentResult"
        ]);

        if (getter) {
            return engine[getter]();
        }

        return getStateValue(
            [
                "result",
                "currentResult",
                "displayValue"
            ],
            0
        );
    }

    function setResult(value) {
        const engine = requireStateEngine();

        const setter = findMethod(engine, [
            "setResult",
            "setCurrentResult"
        ]);

        if (!setter) {
            return false;
        }

        engine[setter](value);

        return true;
    }

    function getAns() {
        const engine = requireStateEngine();

        const getter = findMethod(engine, [
            "getAns",
            "getAnswer"
        ]);

        if (getter) {
            return engine[getter]();
        }

        return getStateValue(
            [
                "ans",
                "answer",
                "lastAnswer"
            ],
            0
        );
    }

    function setAns(value) {
        const result = callStateMethod(
            [
                "setAns",
                "setAnswer",
                "storeAnswer"
            ],
            value
        );

        return result.supported;
    }

    function insertAns() {
        const ans = getAns();

        appendExpression(
            normalizeExpression(ans)
        );

        return ans;
    }

    /* =========================================
       SHIFT
    ========================================= */

    function setShift(enabled) {
        const desired = Boolean(enabled);
        const engine = requireStateEngine();

        const setter = findMethod(engine, [
            "setShift"
        ]);

        if (setter) {
            engine[setter](desired);
        } else {
            const current = Boolean(
                getStateValue(
                    [
                        "shift",
                        "shiftActive",
                        "isShift"
                    ],
                    controlState.shift
                )
            );

            const toggle = findMethod(engine, [
                "toggleShift",
                "shift"
            ]);

            if (
                toggle &&
                current !== desired
            ) {
                engine[toggle]();
            }
        }

        controlState.shift = desired;

        return controlState.shift;
    }

    function toggleShift() {
        return setShift(
            !controlState.shift
        );
    }

    function consumeShift() {
        if (!controlState.shift) {
            return false;
        }

        setShift(false);

        return true;
    }

    /* =========================================
       ALPHA
    ========================================= */

    function setAlpha(enabled) {
        const desired = Boolean(enabled);
        const engine = requireStateEngine();

        const setter = findMethod(engine, [
            "setAlpha"
        ]);

        if (setter) {
            engine[setter](desired);
        } else {
            const current = Boolean(
                getStateValue(
                    [
                        "alpha",
                        "alphaActive",
                        "isAlpha"
                    ],
                    controlState.alpha
                )
            );

            const toggle = findMethod(engine, [
                "toggleAlpha",
                "alpha"
            ]);

            if (
                toggle &&
                current !== desired
            ) {
                engine[toggle]();
            }
        }

        controlState.alpha = desired;

        return controlState.alpha;
    }

    function toggleAlpha() {
        return setAlpha(
            !controlState.alpha
        );
    }

    function consumeAlpha() {
        if (!controlState.alpha) {
            return false;
        }

        setAlpha(false);

        return true;
    }

    /* =========================================
       ANGLE MODE
    ========================================= */

    function setAngleMode(mode) {
        const normalized =
            String(mode || "")
                .trim()
                .toUpperCase();

        if (
            !VALID_ANGLE_MODES.includes(
                normalized
            )
        ) {
            throw new Error(
                `Unsupported angle mode: ${mode}`
            );
        }

        callStateMethod(
            [
                "setAngleMode",
                "setAngle",
                "changeAngleMode"
            ],
            normalized
        );

        controlState.angleMode =
            normalized;
        
        if (
    window.ToolXoneScientificMath &&
    typeof window.ToolXoneScientificMath.setAngleMode === "function"
) {
    window.ToolXoneScientificMath.setAngleMode(normalized);
}

        return normalized;
    }

    function getAngleMode() {
        const stateMode =
            getStateValue(
                [
                    "angleMode",
                    "angle",
                    "angleUnit"
                ],
                null
            );

        if (stateMode) {
            return String(
                stateMode
            ).toUpperCase();
        }

        return controlState.angleMode;
    }

    function cycleAngleMode() {
        const current =
            getAngleMode();

        const index =
            VALID_ANGLE_MODES.indexOf(
                current
            );

        const next =
            VALID_ANGLE_MODES[
                index === -1
                    ? 0
                    : (
                        index + 1
                    ) %
                    VALID_ANGLE_MODES.length
            ];

        return setAngleMode(next);
    }

    /* =========================================
       CALCULATOR MODE
    ========================================= */

    function setMode(mode) {
        const normalized =
            String(mode || "")
                .trim()
                .toUpperCase();

        if (
            !VALID_CALCULATOR_MODES.includes(
                normalized
            )
        ) {
            throw new Error(
                `Unsupported calculator mode: ${mode}`
            );
        }

        callStateMethod(
            [
                "setMode",
                "changeMode",
                "setCalculatorMode"
            ],
            normalized
        );

        controlState.mode = normalized;

        return normalized;
    }

    function getMode() {
        const stateMode =
            getStateValue(
                [
                    "mode",
                    "calculatorMode",
                    "operationMode"
                ],
                null
            );

        return stateMode
            ? String(stateMode).toUpperCase()
            : controlState.mode;
    }

    /* =========================================
       MEMORY
    ========================================= */

    function getMemory() {
        const engine = requireStateEngine();

        const getter = findMethod(engine, [
            "getMemory",
            "recallMemory",
            "memoryRecall"
        ]);

        if (getter) {
            return engine[getter]();
        }

        return getStateValue(
            [
                "memory",
                "memoryValue"
            ],
            0
        );
    }


    /*
     * Resolve the number currently represented by
     * the calculator input.
     *
     * Priority:
     * 1. A simple numeric expression currently being typed.
     * 2. The current calculated result.
     */
    function getMemoryOperand() {

        const expression =
            normalizeExpression(
                getExpression()
            ).trim();

        if (expression) {

            const normalized =
                expression
                    .replace(/,/g, "")
                    .trim();

            /*
             * Only treat a standalone numeric value
             * as the current memory operand.
             *
             * Examples:
             * 25
             * -25
             * 25.5
             * .5
             * 2.5e3
             */
            const numericPattern =
                /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;

            if (numericPattern.test(normalized)) {

                const number =
                    Number(normalized);

                if (Number.isFinite(number)) {
                    return number;
                }
            }
        }

        const result =
            Number(getResult());

        return Number.isFinite(result)
            ? result
            : 0;
    }


    function memoryStore(
        value = getMemoryOperand()
    ) {

        const engine =
            requireStateEngine();

        const method =
            findMethod(
                engine,
                [
                    "setMemory",
                    "storeMemory",
                    "memoryStore"
                ]
            );

        if (!method) {
            throw new Error(
                "Memory store is not available."
            );
        }

        engine[method](value);

        return getMemory();
    }


    function memoryRecall() {

        const value =
            getMemory();

        const expression =
            normalizeExpression(
                getExpression()
            ).trim();

        /*
         * If there is no active expression,
         * or the previous calculation is complete,
         * recall memory as the new displayed value.
         *
         * Example:
         * 25 → MS → AC → MR
         * Result becomes 25.
         */
        if (
            !expression ||
            controlState.justEvaluated
        ) {

            setExpression("");
            setResult(value);

            controlState.error = null;
            controlState.justEvaluated = true;

            return value;
        }

        /*
         * If the user is currently entering a
         * standalone number, MR replaces it.
         *
         * Example:
         * 7 → MR
         * becomes 25 instead of 725.
         */
        const normalized =
            expression
                .replace(/,/g, "")
                .trim();

        const numericPattern =
            /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;

        if (
            numericPattern.test(normalized)
        ) {

            setExpression("");
            setResult(value);

            controlState.error = null;
            controlState.justEvaluated = true;

            return value;
        }

        /*
         * If the user is inside a larger expression,
         * insert the memory value into that expression.
         *
         * Example:
         * 5 + MR
         * → 5 + 25
         */
        appendExpression(
            normalizeExpression(value)
        );

        return value;
    }


    function memoryClear() {

        const result =
            callStateMethod([
                "clearMemory",
                "memoryClear",
                "mc"
            ]);

        if (!result.supported) {
            throw new Error(
                "Memory clear is not available."
            );
        }

        return getMemory();
    }


    function memoryAdd(
        value = getMemoryOperand()
    ) {

        const engine =
            requireStateEngine();

        const method =
            findMethod(
                engine,
                [
                    "memoryAdd",
                    "addMemory",
                    "mPlus"
                ]
            );

        if (method) {

            engine[method](value);

        } else {

            memoryStore(
                Number(getMemory() || 0) +
                Number(value || 0)
            );
        }

        return getMemory();
    }


    function memorySubtract(
        value = getMemoryOperand()
    ) {

        const engine =
            requireStateEngine();

        const method =
            findMethod(
                engine,
                [
                    "memorySubtract",
                    "subtractMemory",
                    "mMinus"
                ]
            );

        if (method) {

            engine[method](value);

        } else {

            memoryStore(
                Number(getMemory() || 0) -
                Number(value || 0)
            );
        }

        return getMemory();
    }
    
    /* =========================================
       HISTORY / REPLAY
    ========================================= */

    function addHistory(
        expression,
        result
    ) {
        const engine = requireStateEngine();

        const method = findMethod(engine, [
            "addHistory",
            "pushHistory",
            "recordHistory",
            "addHistoryEntry"
        ]);

        if (!method) {
            return false;
        }

        /*
         * State Engine QA confirmed addHistory
         * exists. Use an object so the record
         * remains extensible.
         */
        engine[method](
            expression,
            result
        );

        return true;
    }

    function historyUp() {
        const result = callStateMethod([
            "historyUp",
            "replayUp",
            "previousHistory"
        ]);

        if (!result.supported) {
            return null;
        }

        return result.value;
    }

    function historyDown() {
        const result = callStateMethod([
            "historyDown",
            "replayDown",
            "nextHistory"
        ]);

        if (!result.supported) {
            return null;
        }

        return result.value;
    }

    /* =========================================
       GRAND TOTAL
    ========================================= */

    function getGrandTotal() {
        return controlState.grandTotal;
    }

    function addGrandTotal(value) {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return controlState.grandTotal;
        }

        controlState.grandTotal += number;

        return controlState.grandTotal;
    }

    function clearGrandTotal() {
        controlState.grandTotal = 0;

        return controlState.grandTotal;
    }

    function recallGrandTotal() {

    const total =
        controlState.grandTotal;

    /*
    --------------------------------------------------------
    Recall the accumulated Grand Total into the calculator
    result without modifying the GT accumulator.
    --------------------------------------------------------
    */

    setExpression("");
    setResult(total);
    setAns(total);

    controlState.error = null;
    controlState.justEvaluated = true;

    return total;
}

    /* =========================================
       ERROR CONTROL
    ========================================= */

    function getError() {
        return controlState.error;
    }

    function setError(error) {
        const message =
            error instanceof Error
                ? error.message
                : String(
                    error || "Calculation error."
                );

        controlState.error = message;

        callStateMethod(
            [
                "setError",
                "setErrorState"
            ],
            message
        );

        return message;
    }

    function clearError() {
        controlState.error = null;

        callStateMethod([
            "clearError",
            "clearErrorState"
        ]);

        return null;
    }

    /* =========================================
       CLEAR / DELETE
    ========================================= */

    function clearEntry() {
        setExpression("");
        clearError();

        controlState.justEvaluated = false;

        return "";
    }

    function allClear() {
        const engine = requireStateEngine();

        const method = findMethod(engine, [
            "reset",
            "resetState",
            "clearState"
        ]);

        if (method) {
            engine[method]();
        } else {
            setExpression("");
            setResult(0);
        }

        /*
         * AC resets transient calculator state.
         * Memory and GT are intentionally kept.
         */
        controlState.shift = false;
        controlState.alpha = false;
        controlState.error = null;
        controlState.justEvaluated = false;

        return getSnapshot();
    }

    /* =========================================
       EVALUATION
    ========================================= */

    function evaluateExpression(
        expression = getExpression()
    ) {
        const evaluator =
            requireEvaluator();

        const source =
            normalizeExpression(expression)
                .trim();

        if (!source) {
            return {
                success: false,
                expression: "",
                result: null,
                error: "Enter an expression."
            };
        }

        try {
            let result;

            if (
                typeof evaluator.evaluateExpression ===
                "function"
            ) {
                result =
                    evaluator.evaluateExpression(
                        source
                    );
            } else if (
                typeof evaluator.evaluate ===
                "function"
            ) {
                result =
                    evaluator.evaluate(source);
            } else {
                throw new Error(
                    "Expression evaluator does not expose an evaluation method."
                );
            }

            if (
                typeof result === "number" &&
                !Number.isFinite(result)
            ) {
                throw new Error(
                    "Result is not finite."
                );
            }

            setResult(result);
            setAns(result);

            addHistory(
                source,
                result
            );

            if (isFiniteResult(result)) {
                addGrandTotal(result);
            }

            controlState.error = null;
            controlState.justEvaluated = true;

            /*
             * SHIFT and ALPHA behave as
             * temporary function modifiers.
             */
            consumeShift();
            consumeAlpha();

            return {
                success: true,
                expression: source,
                result,
                error: null
            };

} catch (error) {

    const message =
        setError(error);

    /*
     * Do not leave the previous successful result
     * visible after a failed calculation.
     *
     * Example:
     *   √4   = 2
     *   √(-4) → Error
     *
     * The failed calculation must replace the
     * previous result instead of displaying 2.
     */
    setResult("Error");

    controlState.justEvaluated = true;

    return {
        success: false,
        expression: source,
        result: null,
        error: message
    };
}
    }

    /* =========================================
       FUNCTION INSERTION
    ========================================= */

    const FUNCTION_MAP = {
    sin: "sin(",
    cos: "cos(",
    tan: "tan(",

    asin: "asin(",
    acos: "acos(",
    atan: "atan(",

    log: "log(",
    ln: "ln(",

    pow10: "pow10(",
    exp: "exp(",

    sqrt: "sqrt(",
    cbrt: "cbrt(",


    abs: "abs(",

    ncr: "ncr(",
    npr: "npr("
  
  };


    function insertFunction(name) {

    const key =
        String(name || "")
            .trim()
            .toLowerCase();

    const token =
        FUNCTION_MAP[key];

    if (!token) {
        throw new Error(
            `Unknown scientific function: ${name}`
        );
    }

    appendExpression(token);

    return token;
}

    /* =========================================
       SYMBOL INSERTION
    ========================================= */

    function insertPi() {
        return appendExpression("π");
    }

    function insertE() {
        return appendExpression("e");
    }

    function insertPower() {
        return appendExpression("^");
    }

    function insertSquare() {
        return appendExpression("^2");
    }

    function insertInverseSquare() {
        return appendExpression("^(-2)");
    }

    function insertFactorial() {
        return appendExpression("!");
    }

    function insertPercent() {
        return appendExpression("%");
    }

    function insertLeftParenthesis() {
        return appendExpression("(");
    }

    function insertRightParenthesis() {
        return appendExpression(")");
    }

    /* =========================================
       CONTROL SNAPSHOT
    ========================================= */

    function getSnapshot() {
        return {
            mode: getMode(),
            angleMode: getAngleMode(),

            shift: controlState.shift,
            alpha: controlState.alpha,

            expression: getExpression(),
            result: getResult(),
            ans: getAns(),

            memory: getMemory(),
            grandTotal:
                controlState.grandTotal,

            error: controlState.error,

            justEvaluated:
                controlState.justEvaluated
        };
    }

    /* =========================================
       CAPABILITIES
    ========================================= */

    function getCapabilities() {
        const stateEngine =
            getStateEngine();

        const evaluator =
            getEvaluator();

        return {
            stateEngine:
                !!stateEngine,

            evaluator:
                !!evaluator,

            shift: true,
            alpha: true,

            angleModes:
                VALID_ANGLE_MODES.slice(),

            calculatorModes:
                VALID_CALCULATOR_MODES.slice(),

            memory: true,
            ans: true,

            replay:
                !!findMethod(
                    stateEngine,
                    [
                        "historyUp",
                        "replayUp",
                        "previousHistory"
                    ]
                ),

            grandTotal: true,

            evaluation:
                !!findMethod(
                    evaluator,
                    [
                        "evaluateExpression",
                        "evaluate"
                    ]
                )
        };
    }

    /* =========================================
       PUBLIC API
    ========================================= */

    window.ToolXoneScientificControl = {

        // State
        getSnapshot,
        getCapabilities,

        // Expression
        getExpression,
        setExpression,
        appendExpression,
        deleteLast,

        // Result / ANS
        getResult,
        getAns,
        setAns,
        insertAns,

        // Evaluation
        evaluateExpression,

        // SHIFT
        setShift,
        toggleShift,
        consumeShift,

        // ALPHA
        setAlpha,
        toggleAlpha,
        consumeAlpha,

        // Angle
        getAngleMode,
        setAngleMode,
        cycleAngleMode,

        // Mode
        getMode,
        setMode,

        // Memory
        getMemory,
        memoryStore,
        memoryRecall,
        memoryClear,
        memoryAdd,
        memorySubtract,

        // History / Replay
        addHistory,
        historyUp,
        historyDown,

        // GT
        getGrandTotal,
        addGrandTotal,
        clearGrandTotal,
        recallGrandTotal,

        // Errors
        getError,
        setError,
        clearError,

        // Clear controls
        clearEntry,
        allClear,

        // Functions
        insertFunction,

        // Symbols
        insertPi,
        insertE,
        insertPower,
        insertSquare,
        insertInverseSquare,
        insertFactorial,

        insertPercent,
        insertLeftParenthesis,
        insertRightParenthesis

    };

})();