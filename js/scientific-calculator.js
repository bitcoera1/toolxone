/*
==========================================================
TOOLXONE SCIENTIFIC CALCULATOR
----------------------------------------------------------
Features
--------
- Scientific calculations
- Live thousands separators
- Number-to-words results
- Decimal support
- Keyboard support
- Sound feedback
==========================================================
*/

let expression = "";
let ans = 0;
let soundEnabled = false;
let justCalculated = false;

const expressionDisplay =
    document.getElementById("expression");

const resultDisplay =
    document.getElementById("result");

const numberWordsDisplay =
    document.getElementById(
        "scientificNumberWords"
    );


/* =====================================================
   1. DISPLAY
   ===================================================== */

function updateDisplay() {
    expressionDisplay.textContent =
        formatScientificExpression(
            expression
        );
}


function updateResultDisplay(value) {
    if (
        !window.ToolXoneNumberEngine
    ) {
        resultDisplay.textContent =
            String(value);

        return;
    }

    resultDisplay.textContent =
        ToolXoneNumberEngine.format(
            value,
            {
                maximumFractionDigits: 12
            }
        );
}


/* =====================================================
   2. NUMBER WORDS
   ===================================================== */

function showNumberWords(value) {
    if (
        !numberWordsDisplay ||
        !window.ToolXoneNumberEngine
    ) {
        return;
    }

    const words =
        ToolXoneNumberEngine.words(
            value,
            {
                decimalLimit: 12
            }
        );

    numberWordsDisplay.textContent =
        words;

    numberWordsDisplay.hidden =
        !words;
}


function clearNumberWords() {
    if (!numberWordsDisplay) {
        return;
    }

    numberWordsDisplay.textContent = "";
    numberWordsDisplay.hidden = true;
}


/* =====================================================
   3. SOUND
   ===================================================== */

function playSound() {
    if (!soundEnabled) {
        return;
    }

    try {
        const audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        const oscillator =
            audioContext.createOscillator();

        const gainNode =
            audioContext.createGain();

        oscillator.connect(
            gainNode
        );

        gainNode.connect(
            audioContext.destination
        );

        oscillator.type = "square";
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.05;

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime +
            0.05
        );
    } catch (error) {
        console.warn(
            "Calculator sound unavailable:",
            error
        );
    }
}


/* =====================================================
   4. VALUE INPUT
   ===================================================== */

function appendValue(value) {
    if (justCalculated) {
        if (
            "0123456789.".includes(
                value
            ) ||
            value === "π" ||
            value === "e"
        ) {
            expression = "";
            updateResultDisplay(0);
        } else if (
            [
                "+",
                "-",
                "*",
                "/",
                "%",
                "^"
            ].includes(value)
        ) {
            expression =
                normalizeResult(ans);
        }

        justCalculated = false;
    }

    if (
        value === "." &&
        currentNumberHasDecimal()
    ) {
        return;
    }

    expression += value;

    updateDisplay();
    clearNumberWords();
    playSound();
}


/* =====================================================
   5. SCIENTIFIC FUNCTIONS
   ===================================================== */

function appendFunction(func) {
    if (justCalculated) {
        expression = "";
        updateResultDisplay(0);
        justCalculated = false;
    }

    expression += `${func}(`;

    updateDisplay();
    clearNumberWords();
    playSound();
}


/* =====================================================
   6. CLEAR AND DELETE
   ===================================================== */

function clearAll() {
    expression = "";
    ans = 0;
    justCalculated = false;

    updateResultDisplay(0);
    updateDisplay();
    clearNumberWords();
}


function clearResult() {
    updateResultDisplay(0);
    clearNumberWords();
}


function backspace() {
    expression =
        expression.slice(0, -1);

    justCalculated = false;

    updateDisplay();
    clearNumberWords();
}


/* =====================================================
   7. ANS AND CONSTANTS
   ===================================================== */

function useAns() {
    if (justCalculated) {
        expression = "";
        justCalculated = false;
    }

    expression +=
        normalizeResult(ans);

    updateDisplay();
    clearNumberWords();
}


function insertPi() {
    appendValue("π");
}


function insertE() {
    appendValue("e");
}


/* =====================================================
   8. SOUND TOGGLE
   ===================================================== */

function toggleSound() {
    soundEnabled =
        !soundEnabled;

    const status =
        document.getElementById(
            "status"
        );

    if (status) {
        status.textContent =
            soundEnabled
                ? "Sound ON"
                : "Sound OFF";
    }
}


/* =====================================================
   9. EXPRESSION PROCESSING
   ===================================================== */

function balanceParentheses(expr) {
    const open =
        (
            expr.match(/\(/g) ||
            []
        ).length;

    const close =
        (
            expr.match(/\)/g) ||
            []
        ).length;

    if (open > close) {
        expr += ")".repeat(
            open - close
        );
    }

    return expr;
}


function preprocessExpression(expr) {
    expr =
        balanceParentheses(expr);

    expr =
        expr.replace(
            /π/g,
            `(${Math.PI})`
        );

    expr =
        expr.replace(
            /\be\b/g,
            `(${Math.E})`
        );

    expr =
        expr.replace(
            /√\(/g,
            "Math.sqrt("
        );

    expr =
        expr.replace(
            /\^/g,
            "**"
        );

    expr =
        expr.replace(
            /sin\(/g,
            "sinDeg("
        );

    expr =
        expr.replace(
            /cos\(/g,
            "cosDeg("
        );

    expr =
        expr.replace(
            /tan\(/g,
            "tanDeg("
        );

    expr =
        expr.replace(
            /log\(/g,
            "Math.log10("
        );

    expr =
        expr.replace(
            /ln\(/g,
            "Math.log("
        );

    return expr;
}


/* =====================================================
   10. CALCULATE
   ===================================================== */

function calculate() {
    if (!expression) {
        return;
    }

    try {
        const sinDeg =
            value =>
                Math.sin(
                    value *
                    Math.PI /
                    180
                );

        const cosDeg =
            value =>
                Math.cos(
                    value *
                    Math.PI /
                    180
                );

        const tanDeg =
            value =>
                Math.tan(
                    value *
                    Math.PI /
                    180
                );

        const processed =
            preprocessExpression(
                expression
            );

        let result =
            Function(
                "sinDeg",
                "cosDeg",
                "tanDeg",
                `"use strict"; return (${processed});`
            )(
                sinDeg,
                cosDeg,
                tanDeg
            );

        if (
            !Number.isFinite(result)
        ) {
            throw new Error(
                "Invalid calculation result."
            );
        }

        result =
            Number(
                result.toFixed(12)
            );

        ans = result;

        expression =
            normalizeResult(result);

        updateResultDisplay(
            result
        );

        showNumberWords(
            result
        );

        justCalculated = true;

        updateDisplay();

    } catch (error) {
        resultDisplay.textContent =
            "Error";

        clearNumberWords();

        console.error(
            "Scientific calculator error:",
            error
        );
    }
}


/* =====================================================
   11. LIVE EXPRESSION FORMATTING
   ===================================================== */

function formatScientificExpression(
    rawExpression
) {
    if (!rawExpression) {
        return "";
    }

    /*
     Match normal decimal numbers while leaving
     functions, operators, π, e and parentheses intact.
    */
    return rawExpression.replace(
        /(?:\d+\.\d*|\.\d+|\d+)/g,
        numberToken =>
            formatNumberToken(
                numberToken
            )
    );
}


function formatNumberToken(
    value
) {
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
        return `${formattedInteger}.`;
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


/* =====================================================
   12. HELPERS
   ===================================================== */

function currentNumberHasDecimal() {
    const matches =
        expression.match(
            /(?:\d+\.\d*|\.\d+|\d+)$/g
        );

    const currentNumber =
        matches?.[0] || "";

    return currentNumber.includes(".");
}


function normalizeResult(value) {
    /*
     Avoid floating-point noise such as:
     0.1 + 0.2 =
     0.30000000000000004
    */
    return String(
        Number(
            Number(value)
                .toPrecision(15)
        )
    );
}


/* =====================================================
   13. KEYBOARD SUPPORT
   ===================================================== */

document.addEventListener(
    "keydown",
    function (event) {
        const key =
            event.key;

        if (
            "0123456789".includes(
                key
            )
        ) {
            appendValue(key);
            return;
        }

        if (
            [
                "+",
                "-",
                "*",
                "/",
                ".",
                "%",
                "(",
                ")",
                "^"
            ].includes(key)
        ) {
            appendValue(key);
            return;
        }

        if (
            key === "Enter" ||
            key === "="
        ) {
            event.preventDefault();
            calculate();
            return;
        }

        if (
            key === "Backspace"
        ) {
            event.preventDefault();
            backspace();
            return;
        }

        if (
            key === "Delete" ||
            key === "Escape"
        ) {
            clearAll();
        }
    }
);


/* =====================================================
   14. INITIAL STATE
   ===================================================== */

updateResultDisplay(0);
updateDisplay();
clearNumberWords();