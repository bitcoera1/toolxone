// ======================================
// TOOLXONE PROFIT MARGIN CALCULATOR PRO
// Number Engine Integrated
// ======================================

function calculateProfit() {
    const cost =
        parseFloat(
            document.getElementById(
                "costPrice"
            ).value
        );

    const selling =
        parseFloat(
            document.getElementById(
                "sellingPrice"
            ).value
        );

    if (
        Number.isNaN(cost) ||
        Number.isNaN(selling) ||
        selling <= 0 ||
        cost < 0
    ) {
        alert(
            "Please enter valid cost and selling prices."
        );

        return;
    }

    const profit =
        selling - cost;

    const margin =
        (
            profit /
            selling
        ) * 100;

    const markup =
        cost > 0
            ? (
                profit /
                cost
            ) * 100
            : 0;

    const result =
        document.getElementById(
            "profitResult"
        );

    result.classList.add(
        "active"
    );

    result.innerHTML = `
        ${createProfitMoneyResult(
            "Cost Price",
            cost
        )}

        ${createProfitMoneyResult(
            "Selling Price",
            selling
        )}

        ${createProfitMoneyResult(
            profit >= 0
                ? "Profit"
                : "Loss",
            profit
        )}

        ${createProfitPercentResult(
            "Profit Margin",
            margin
        )}

        ${createProfitPercentResult(
            "Markup",
            markup
        )}
    `;

    document.getElementById(
        "profitBars"
    ).style.display =
        "block";

    const costPercent =
        Math.max(
            0,
            Math.min(
                (
                    cost /
                    selling
                ) * 100,
                100
            )
        );

    const profitPercent =
        profit > 0
            ? Math.max(
                0,
                Math.min(
                    (
                        profit /
                        selling
                    ) * 100,
                    100
                )
            )
            : 0;

    document.getElementById(
        "costBar"
    ).style.width =
        `${costPercent}%`;

    document.getElementById(
        "profitBar"
    ).style.width =
        `${profitPercent}%`;
}


/* ======================================
   RESULT BUILDERS
   ====================================== */

function createProfitMoneyResult(
    label,
    value
) {
    const formattedValue =
        formatProfitNumber(
            value
        );

    const words =
        profitNumberToWords(
            value
        );

    const isNegative =
        value < 0;

    return `
        <div class="result-line profit-result-item">
            <span>${label}</span>

            <strong class="${
                isNegative
                    ? "profit-negative-value"
                    : ""
            }">
                ${formattedValue}
            </strong>

            ${
                words
                    ? `
                        <small class="profit-number-words ${
                            isNegative
                                ? "profit-negative-words"
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


function createProfitPercentResult(
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
        <div class="result-line profit-result-item">
            <span>${label}</span>

            <strong class="${
                value < 0
                    ? "profit-negative-value"
                    : ""
            }">
                ${formattedValue}%
            </strong>
        </div>
    `;
}


function formatProfitNumber(value) {
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


function profitNumberToWords(value) {
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

function resetProfit() {
    document.getElementById(
        "costPrice"
    ).value = "";

    document.getElementById(
        "sellingPrice"
    ).value = "";

    document.getElementById(
        "profitResult"
    ).classList.remove(
        "active"
    );

    document.getElementById(
        "profitResult"
    ).innerHTML =
        "<p>Your profit summary will appear here.</p>";

    document.getElementById(
        "profitBars"
    ).style.display =
        "none";

    document.getElementById(
        "costBar"
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
        "#costPrice, #sellingPrice"
    )
    .forEach(input => {
        input.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Enter"
                ) {
                    calculateProfit();
                }
            }
        );
    });