// ======================================
// TOOLXONE CURRENCY PROFIT CALCULATOR
// Number Engine Integrated
// ======================================

function calculateCurrencyProfit() {
    const amount =
        parseFloat(
            document.getElementById(
                "currencyAmount"
            ).value
        );

    const buyRate =
        parseFloat(
            document.getElementById(
                "buyRate"
            ).value
        );

    const sellRate =
        parseFloat(
            document.getElementById(
                "sellRate"
            ).value
        );

    const fee =
        parseFloat(
            document.getElementById(
                "exchangeFee"
            ).value
        ) || 0;

    if (
        Number.isNaN(amount) ||
        Number.isNaN(buyRate) ||
        Number.isNaN(sellRate) ||
        amount <= 0 ||
        buyRate <= 0 ||
        sellRate <= 0 ||
        fee < 0
    ) {
        alert(
            "Please enter valid values."
        );

        return;
    }

    const buyingCost =
        amount * buyRate;

    const sellingValue =
        amount * sellRate;

    const grossProfit =
        sellingValue -
        buyingCost;

    const netProfit =
        grossProfit -
        fee;

    const profitPercent =
        buyingCost > 0
            ? (
                netProfit /
                buyingCost
            ) * 100
            : 0;

    const result =
        document.getElementById(
            "currencyProfitResult"
        );

    result.classList.add(
        "active"
    );

    result.innerHTML = `
        ${createCurrencyProfitMoneyResult(
            "Buying Cost",
            buyingCost
        )}

        ${createCurrencyProfitMoneyResult(
            "Selling Value",
            sellingValue
        )}

        ${createCurrencyProfitMoneyResult(
            grossProfit >= 0
                ? "Gross Profit"
                : "Gross Loss",
            grossProfit
        )}

        ${createCurrencyProfitMoneyResult(
            "Exchange Fee",
            fee
        )}

        ${createCurrencyProfitMoneyResult(
            netProfit >= 0
                ? "Net Profit"
                : "Net Loss",
            netProfit
        )}

        ${createCurrencyProfitPercentResult(
            netProfit >= 0
                ? "Profit %"
                : "Loss %",
            profitPercent
        )}

        ${createCurrencyProfitInsight(
            netProfit
        )}
    `;

    document.getElementById(
        "currencyProfitBars"
    ).style.display =
        "block";

    const buyPercent =
        sellingValue > 0
            ? (
                buyingCost /
                sellingValue
            ) * 100
            : 0;

    const profitPercentOfSelling =
        sellingValue > 0 &&
        netProfit > 0
            ? (
                netProfit /
                sellingValue
            ) * 100
            : 0;

    document.getElementById(
        "buyBar"
    ).style.width =
        `${clampCurrencyProfitPercent(
            buyPercent
        )}%`;

    document.getElementById(
        "profitBar"
    ).style.width =
        `${clampCurrencyProfitPercent(
            profitPercentOfSelling
        )}%`;
}


/* ======================================
   RESULT BUILDERS
   ====================================== */

function createCurrencyProfitMoneyResult(
    label,
    value
) {
    const isNegative =
        value < 0;

    const formattedValue =
        formatCurrencyProfitNumber(
            value
        );

    const words =
        currencyProfitNumberToWords(
            value
        );

    return `
        <div class="result-line currency-profit-result-item">
            <span>${label}</span>

            <strong class="${
                isNegative
                    ? "currency-profit-negative-value"
                    : ""
            }">
                ${formattedValue}
            </strong>

            ${
                words
                    ? `
                        <small class="currency-profit-number-words ${
                            isNegative
                                ? "currency-profit-negative-words"
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


function createCurrencyProfitPercentResult(
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
        <div class="result-line currency-profit-result-item">
            <span>${label}</span>

            <strong class="${
                value < 0
                    ? "currency-profit-negative-value"
                    : ""
            }">
                ${formattedValue}%
            </strong>
        </div>
    `;
}


function createCurrencyProfitInsight(
    netProfit
) {
    let insightText;
    let insightClass;

    if (
        netProfit > 0
    ) {
        insightText =
            "📈 Profitable Exchange";

        insightClass =
            "currency-profit-positive-insight";
    } else if (
        netProfit < 0
    ) {
        insightText =
            "📉 Exchange Results in a Loss";

        insightClass =
            "currency-profit-negative-insight";
    } else {
        insightText =
            "⚖️ Break-Even Exchange";

        insightClass =
            "currency-profit-neutral-insight";
    }

    return `
        <div class="result-line currency-profit-insight-item ${insightClass}">
            <span>ToolXone Insight</span>

            <strong>
                ${insightText}
            </strong>
        </div>
    `;
}


/* ======================================
   NUMBER ENGINE HELPERS
   ====================================== */

function formatCurrencyProfitNumber(
    value
) {
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


function currencyProfitNumberToWords(
    value
) {
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
   BAR HELPERS
   ====================================== */

function clampCurrencyProfitPercent(
    value
) {
    return Math.max(
        0,
        Math.min(
            Number.isFinite(value)
                ? value
                : 0,
            100
        )
    );
}


/* ======================================
   RESET
   ====================================== */

function resetCurrencyProfit() {
    document.getElementById(
        "currencyAmount"
    ).value = "";

    document.getElementById(
        "buyRate"
    ).value = "";

    document.getElementById(
        "sellRate"
    ).value = "";

    document.getElementById(
        "exchangeFee"
    ).value = "";

    document.getElementById(
        "currencyProfitResult"
    ).classList.remove(
        "active"
    );

    document.getElementById(
        "currencyProfitResult"
    ).innerHTML =
        "<p>Your exchange summary will appear here.</p>";

    document.getElementById(
        "currencyProfitBars"
    ).style.display =
        "none";

    document.getElementById(
        "buyBar"
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
        "#currencyAmount, " +
        "#buyRate, " +
        "#sellRate, " +
        "#exchangeFee"
    )
    .forEach(input => {
        input.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Enter"
                ) {
                    calculateCurrencyProfit();
                }
            }
        );
    });


function runCurrencyProfitCalculator() {
    calculateCurrencyProfit();
}