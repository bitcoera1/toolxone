// ======================================
// TOOLXONE ROI CALCULATOR PRO
// Number Engine Integrated
// ======================================

function calculateROI(options = {}) {
    const {
        silent = false,
        recordStatistics = true
    } = options;

    const investmentInput =
        document.getElementById("investment");

    const returnInput =
        document.getElementById("returnAmount");

    const result =
        document.getElementById("roiResult");

    const roiBars =
        document.getElementById("roiBars");

    const investmentBar =
        document.getElementById("investmentBar");

    const profitBar =
        document.getElementById("profitBar");

    // --------------------------------------
    // DOM SAFETY
    // --------------------------------------

    if (
        !investmentInput ||
        !returnInput ||
        !result
    ) {
        return;
    }

    const investment =
        parseFloat(investmentInput.value);

    const returnAmount =
        parseFloat(returnInput.value);

    // --------------------------------------
    // VALIDATION
    // --------------------------------------

    if (
    !Number.isFinite(investment) ||
    !Number.isFinite(returnAmount) ||
    investment <= 0 ||
    returnAmount < 0
) {
        if (!silent) {
            alert(
                "Please enter an investment greater than 0 and a final return of 0 or more."
            );
        }

        return;
    }

    // --------------------------------------
    // CALCULATION
    // --------------------------------------

    const profit =
        returnAmount - investment;

    const roi =
        (profit / investment) * 100;

    // --------------------------------------
    // RESULT
    // --------------------------------------

    result.classList.add("active");

    result.innerHTML = `
        ${createROIMoneyResult(
            "Investment",
            investment
        )}

        ${createROIMoneyResult(
            "Final Return",
            returnAmount
        )}

        ${createROIMoneyResult(
            profit >= 0
                ? "Profit"
                : "Loss",
            profit
        )}

        ${createROIPercentResult(
            "ROI",
            roi
        )}
    `;

    // --------------------------------------
    // VISUAL BARS
    // --------------------------------------

    if (
        roiBars &&
        investmentBar &&
        profitBar
    ) {
        roiBars.style.display = "block";

        const investmentPercent =
            returnAmount > 0
                ? Math.min(
                    (investment / returnAmount) * 100,
                    100
                )
                : 100;

        const profitPercent =
            profit > 0 &&
            returnAmount > 0
                ? Math.min(
                    (profit / returnAmount) * 100,
                    100
                )
                : 0;

        investmentBar.style.width =
            `${investmentPercent}%`;

        profitBar.style.width =
            `${profitPercent}%`;
    }

    // --------------------------------------
    // STATISTICS
    // --------------------------------------

    if (
        recordStatistics &&
        typeof ToolXoneStatisticsEvents !== "undefined" &&
        typeof ToolXoneStatisticsEvents.recordCalculation ===
            "function"
    ) {
        ToolXoneStatisticsEvents.recordCalculation(
            "roi-calculator"
        );
    }
}


/* ======================================
   RESULT BUILDERS
   ====================================== */

function createROIMoneyResult(
    label,
    value
) {
    const formattedValue =
        formatROINumber(value);

    const words =
        roiNumberToWords(value);

    return `
        <div class="result-line roi-result-item">

            <span>${label}</span>

            <strong class="${
                value < 0
                    ? "roi-negative-value"
                    : ""
            }">
                ${formattedValue}
            </strong>

            ${
                words
                    ? `
                        <small class="roi-number-words ${
                            value < 0
                                ? "roi-negative-words"
                                : ""
                        }">
                            ${words}
                        </small>
                    `
                    : ""
            }

        </div>
    `;
}


function createROIPercentResult(
    label,
    value
) {
    const formattedValue =
        window.ToolXoneNumberEngine
            ? ToolXoneNumberEngine.format(
                value,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )
            : Number(value).toFixed(2);

    return `
        <div class="result-line roi-result-item">

            <span>${label}</span>

            <strong class="${
                value < 0
                    ? "roi-negative-value"
                    : ""
            }">
                ${formattedValue}%
            </strong>

        </div>
    `;
}


function formatROINumber(value) {
    if (window.ToolXoneNumberEngine) {
        return ToolXoneNumberEngine.format(
            value,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    }

    return Number(value).toFixed(2);
}


function roiNumberToWords(value) {
    if (!window.ToolXoneNumberEngine) {
        return "";
    }

    const roundedValue =
        Number(
            Number(value).toFixed(2)
        );

    return ToolXoneNumberEngine.words(
        roundedValue,
        {
            decimalLimit: 2
        }
    );
}


/* ======================================
   RESET
   ====================================== */

function resetROI() {
    const investmentInput =
        document.getElementById("investment");

    const returnInput =
        document.getElementById("returnAmount");

    const result =
        document.getElementById("roiResult");

    const roiBars =
        document.getElementById("roiBars");

    const investmentBar =
        document.getElementById("investmentBar");

    const profitBar =
        document.getElementById("profitBar");

    if (investmentInput) {
        investmentInput.value = "";
    }

    if (returnInput) {
        returnInput.value = "";
    }

    if (result) {
        result.classList.remove("active");

        result.innerHTML =
            "<p>Your ROI summary will appear here.</p>";
    }

    if (roiBars) {
        roiBars.style.display = "none";
    }

    if (investmentBar) {
        investmentBar.style.width = "0%";
    }

    if (profitBar) {
        profitBar.style.width = "0%";
    }

    if (investmentInput) {
        investmentInput.focus();
    }
}


/* ======================================
   LIVE CALCULATION
   ====================================== */

function initializeROICalculator() {
    const investmentInput =
        document.getElementById("investment");

    const returnInput =
        document.getElementById("returnAmount");

    if (
        !investmentInput ||
        !returnInput
    ) {
        return;
    }

    const inputs = [
        investmentInput,
        returnInput
    ];

    inputs.forEach(input => {

        // ----------------------------------
        // LIVE RECALCULATION
        // ----------------------------------

        input.addEventListener(
            "input",
            function () {
                if (
                    investmentInput.value !== "" &&
                    returnInput.value !== ""
                ) {
                    calculateROI({
                        silent: true,
                        recordStatistics: false
                    });
                }
            }
        );

        // ----------------------------------
        // ENTER KEY SUPPORT
        // ----------------------------------

        input.addEventListener(
            "keydown",
            function (event) {
                if (event.key === "Enter") {
                    calculateROI();
                }
            }
        );
    });
}


/* ======================================
   INITIALIZE
   ====================================== */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeROICalculator
    );
} else {
    initializeROICalculator();
}


/* ======================================
   SHARED ENGINE SUPPORT
   ====================================== */

function runROICalculator() {
    calculateROI();
}