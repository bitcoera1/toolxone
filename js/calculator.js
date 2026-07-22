/*
==========================================================
TOOLXONE BASIC CALCULATOR
----------------------------------------------------------
Features
--------
- Accurate raw-expression calculations
- Formatted number display
- Number-to-words result
- Keyboard support
==========================================================
*/

let justCalculated = false;
let rawExpression = "";


/* =====================================================
   1. APPEND VALUE
   ===================================================== */

function appendValue(value) {
    const operators = [
        "+",
        "-",
        "*",
        "/"
    ];

    if (justCalculated) {
        if (
            operators.includes(value)
        ) {
            justCalculated = false;
        } else if (
            isDigit(value) ||
            value === "."
        ) {
            rawExpression = "";
            justCalculated = false;
        }
    }

    if (
        operators.includes(value)
    ) {
        appendOperator(value);
    } else {
        appendNumberCharacter(value);
    }

    updateDisplay();
}


/* =====================================================
   2. NUMBER INPUT
   ===================================================== */

function appendNumberCharacter(value) {
    if (
        value === "." &&
        currentNumberHasDecimal()
    ) {
        return;
    }

    rawExpression += value;

    clearNumberWords();
}


/* =====================================================
   3. OPERATOR INPUT
   ===================================================== */

function appendOperator(operator) {
    if (!rawExpression) {
        if (operator === "-") {
            rawExpression = "-";
        }

        return;
    }

    const lastCharacter =
        rawExpression.slice(-1);

    if (
        isOperator(lastCharacter)
    ) {
        rawExpression =
            rawExpression.slice(0, -1) +
            operator;
    } else {
        rawExpression += operator;
    }

    clearNumberWords();
}


/* =====================================================
   4. CLEAR
   ===================================================== */

function clearDisplay() {
    rawExpression = "";
    justCalculated = false;

    updateDisplay();
    clearNumberWords();
}


/* =====================================================
   5. BACKSPACE
   ===================================================== */

function deleteLastCharacter() {
    rawExpression =
        rawExpression.slice(0, -1);

    justCalculated = false;

    updateDisplay();
    clearNumberWords();
}


/* =====================================================
   6. CALCULATE
   ===================================================== */

function calculate() {
    const display =
        document.getElementById(
            "display"
        );

    if (!rawExpression) {
        return;
    }

    const lastCharacter =
        rawExpression.slice(-1);

    if (
        isOperator(lastCharacter) ||
        lastCharacter === "."
    ) {
        return;
    }

    try {
        /*
         * rawExpression contains only characters that
         * our calculator allows: digits, decimals and
         * arithmetic operators.
         */
        const result =
            Function(
                `"use strict"; return (${rawExpression});`
            )();

        if (
            !Number.isFinite(result)
        ) {
            throw new Error(
                "Invalid calculation result."
            );
        }

        rawExpression =
            normalizeResult(result);

        display.value =
            formatExpression(
                rawExpression
            );

        showNumberWords(
    result
);

// Record successful calculation
ToolXoneStatisticsEvents.recordCalculation(
    "basic-calculator"
);

justCalculated = true;

    } catch (error) {
        display.value = "Error";

        rawExpression = "";
        justCalculated = true;

        clearNumberWords();

        console.error(
            "Calculator error:",
            error
        );
    }
}


/* =====================================================
   7. DISPLAY FORMATTING
   ===================================================== */

function updateDisplay() {
    const display =
        document.getElementById(
            "display"
        );

    display.value =
        formatExpression(
            rawExpression
        );
}


function formatExpression(expression) {
    if (!expression) {
        return "";
    }

    return expression
        .split(/([+\-*/])/)
        .map(part => {
            if (
                !part ||
                isOperator(part)
            ) {
                return part;
            }

            return formatNumberPart(
                part
            );
        })
        .join("");
}


function formatNumberPart(value) {
    if (
        value === "." ||
        value === "-"
    ) {
        return value;
    }

    const hasTrailingDecimal =
        value.endsWith(".");

    const [
        integerPart,
        decimalPart
    ] = value.split(".");

    const formattedInteger =
        formatIntegerString(
            integerPart
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


function formatIntegerString(value) {
    const sign =
        value.startsWith("-")
            ? "-"
            : "";

    const digits =
        value.replace("-", "");

    if (!digits) {
        return sign;
    }

    const formatted =
        digits.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
        );

    return sign + formatted;
}


/* =====================================================
   8. NUMBER WORDS
   ===================================================== */

function showNumberWords(value) {
    const wordsElement =
        document.getElementById(
            "numberWords"
        );

    if (!wordsElement) {
        return;
    }

    if (
        !window.ToolXoneNumberEngine
    ) {
        wordsElement.textContent = "";
        return;
    }

    wordsElement.textContent =
        ToolXoneNumberEngine.words(
            value
        );

    wordsElement.hidden =
        !wordsElement.textContent;
}


function clearNumberWords() {
    const wordsElement =
        document.getElementById(
            "numberWords"
        );

    if (!wordsElement) {
        return;
    }

    wordsElement.textContent = "";
    wordsElement.hidden = true;
}


/* =====================================================
   9. HELPERS
   ===================================================== */

function isDigit(value) {
    return /^\d$/.test(
        String(value)
    );
}


function isOperator(value) {
    return [
        "+",
        "-",
        "*",
        "/"
    ].includes(value);
}


function currentNumberHasDecimal() {
    const parts =
        rawExpression.split(
            /[+\-*/]/
        );

    const currentNumber =
        parts[
            parts.length - 1
        ] || "";

    return currentNumber.includes(".");
}


function normalizeResult(value) {
    /*
     * Prevent ugly floating-point displays such as:
     * 0.1 + 0.2 = 0.30000000000000004
     */
    return String(
        Number(
            value.toPrecision(15)
        )
    );
}


/* =====================================================
   10. KEYBOARD SUPPORT
   ===================================================== */

document.addEventListener(
    "keydown",
    function (event) {
        if (
            isDigit(event.key)
        ) {
            appendValue(
                event.key
            );

            return;
        }

        if (
            [
                "+",
                "-",
                "*",
                "/",
                "."
            ].includes(
                event.key
            )
        ) {
            appendValue(
                event.key
            );

            return;
        }

        if (
            event.key === "Enter" ||
            event.key === "="
        ) {
            event.preventDefault();
            calculate();
            return;
        }

        if (
            event.key === "Backspace"
        ) {
            event.preventDefault();
            deleteLastCharacter();
            return;
        }

        if (
            event.key === "Delete" ||
            event.key === "Escape"
        ) {
            clearDisplay();
        }
    }
);


/* =====================================================
   11. INITIAL STATE
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {
        updateDisplay();
        clearNumberWords();
    }
);