// ======================================
// TOOLXONE ROI CALCULATOR PRO
// Number Engine Integrated
// ======================================

function calculateROI() {
    const investment =
        parseFloat(
            document.getElementById(
                "investment"
            ).value
        );

    const returnAmount =
        parseFloat(
            document.getElementById(
                "returnAmount"
            ).value
        );

    if (
        Number.isNaN(investment) ||
        Number.isNaN(returnAmount) ||
        investment <= 0 ||
        returnAmount < 0
    ) {
        alert(
            "Please enter valid investment and return values."
        );

        return;
    }

    const profit =
        returnAmount -
        investment;

    const roi =
        (
            profit /
            investment
        ) * 100;

    const result =
        document.getElementById(
            "roiResult"
        );

    result.classList.add(
        "active"
    );

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

    document.getElementById(
        "roiBars"
    ).style.display =
        "block";

    const investmentPercent =
        returnAmount > 0
            ? Math.min(
                (
                    investment /
                    returnAmount
                ) * 100,
                100
            )
            : 100;

    const profitPercent =
        profit > 0 &&
        returnAmount > 0
            ? Math.min(
                (
                    profit /
                    returnAmount
                ) * 100,
                100
            )
            : 0;

    document.getElementById(
        "investmentBar"
    ).style.width =
        `${investmentPercent}%`;

    document.getElementById(
        "profitBar"
    ).style.width =
        `${profitPercent}%`;
}


/* ======================================
   RESULT BUILDERS
   ====================================== */

function createROIMoneyResult(
    label,
    value
) {
    const formattedValue =
        formatROINumber(
            value
        );

    const words =
        roiNumberToWords(
            value
        );

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
    if (
        window.ToolXoneNumberEngine
    ) {
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
    if (
        !window.ToolXoneNumberEngine
    ) {
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
    document.getElementById(
        "investment"
    ).value = "";

    document.getElementById(
        "returnAmount"
    ).value = "";

    document.getElementById(
        "roiResult"
    ).classList.remove(
        "active"
    );

    document.getElementById(
        "roiResult"
    ).innerHTML =
        "<p>Your ROI summary will appear here.</p>";

    document.getElementById(
        "roiBars"
    ).style.display =
        "none";

    document.getElementById(
        "investmentBar"
    ).style.width =
        "0%";

    document.getElementById(
        "profitBar"
    ).style.width =
        "0%";
}


/* ======================================
   ENTER KEY SUPPORT
   ====================================== */

document
    .querySelectorAll(
        "#investment, #returnAmount"
    )
    .forEach(input => {
        input.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Enter"
                ) {
                    calculateROI();
                }
            }
        );
    });


function runROICalculator() {
    calculateROI();
}