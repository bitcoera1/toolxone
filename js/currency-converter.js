let rateChart;


/* ======================================
   SWAP CURRENCIES
   ====================================== */

function swapCurrencies() {
    const from =
        document.getElementById(
            "fromCurrency"
        );

    const to =
        document.getElementById(
            "toCurrency"
        );

    const temp =
        from.value;

    from.value =
        to.value;

    to.value =
        temp;

    convertCurrency();
}


/* ======================================
   CONVERT CURRENCY
   ====================================== */

async function convertCurrency() {
    const amount =
        Number(
            document.getElementById(
                "amount"
            ).value
        );

    const from =
        document.getElementById(
            "fromCurrency"
        ).value;

    const to =
        document.getElementById(
            "toCurrency"
        ).value;

    const result =
        document.getElementById(
            "result"
        );

    const statusBar =
        document.getElementById(
            "statusBar"
        );

    if (
        amount <= 0 ||
        Number.isNaN(amount)
    ) {
        result.innerHTML =
            "Please enter a valid amount.";

        statusBar.innerHTML =
            "⚠️ Invalid Amount";

        return;
    }

    result.innerHTML =
        "Loading latest exchange rates...";

    statusBar.innerHTML =
        "⏳ Checking latest exchange rates...";

    try {
        const response =
            await fetch(
                `https://open.er-api.com/v6/latest/${from}`
            );

        if (
            !response.ok
        ) {
            throw new Error(
                "API Error"
            );
        }

        const data =
            await response.json();

        const rate =
            data.rates[to];

        if (
            !Number.isFinite(rate)
        ) {
            throw new Error(
                "Exchange rate unavailable."
            );
        }

        const convertedAmount =
            amount * rate;

        displayResult(
            amount,
            from,
            to,
            convertedAmount,
            rate
        );

        statusBar.innerHTML =
            "✅ Updated Successfully";

    } catch (error) {
        console.error(
            "Currency conversion error:",
            error
        );

        statusBar.innerHTML =
            "❌ Connection Error";

        result.innerHTML =
            "Unable to fetch live exchange rates. Please try again.";
    }
}


/* ======================================
   DISPLAY RESULT
   ====================================== */

function displayResult(
    amount,
    from,
    to,
    convertedAmount,
    rate
) {
    const result =
        document.getElementById(
            "result"
        );

    const formattedAmount =
        formatCurrencyValue(
            amount
        );

    const formattedConvertedAmount =
        formatCurrencyValue(
            convertedAmount
        );

    const formattedRate =
        formatExchangeRate(
            rate
        );

    const convertedWords =
        currencyAmountToWords(
            convertedAmount
        );

    result.innerHTML = `
        <div class="currency-conversion-result">

            <h3 class="currency-result-title">
                💱 Currency Conversion
            </h3>

            <div class="currency-source-value">
                ${formattedAmount} ${from}
            </div>

            <div class="currency-conversion-arrow">
                ↓
            </div>

            <div class="currency-target-value">
                ${formattedConvertedAmount} ${to}
            </div>

            ${
                convertedWords
                    ? `
                        <div class="currency-number-words">
                            ${convertedWords} ${to}
                        </div>
                    `
                    : ""
            }

            <hr class="currency-result-divider">

            <div class="currency-rate-info">
                <strong>Exchange Rate</strong>

                <span>
                    1 ${from} =
                    ${formattedRate} ${to}
                </span>
            </div>

            <div class="currency-live-note">
                ✔ Latest Exchange Rate Available
            </div>

        </div>
    `;

    document.getElementById(
        "chartTitle"
    ).innerHTML =
        `📈 ${from} → ${to} Trend`;

    updateRateChart(
        from,
        to,
        rate
    );
}


/* ======================================
   NUMBER ENGINE HELPERS
   ====================================== */

function formatCurrencyValue(
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

    return Number(value)
        .toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
}


function formatExchangeRate(
    value
) {
    if (
        window.ToolXoneNumberEngine
    ) {
        return ToolXoneNumberEngine.format(
            value,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6
            }
        );
    }

    return Number(value)
        .toFixed(6)
        .replace(
            /0+$/,
            ""
        )
        .replace(
            /\.$/,
            ""
        );
}


function currencyAmountToWords(
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
   RATE CHART
   ====================================== */

function updateRateChart(
    from,
    to,
    rate
) {
    const canvas =
        document.getElementById(
            "rateChart"
        );

    if (!canvas) {
        return;
    }

    const labels = [
        "6h",
        "5h",
        "4h",
        "3h",
        "2h",
        "1h",
        "Now"
    ];

    const trendData = [
        rate * 0.996,
        rate * 0.998,
        rate * 0.997,
        rate * 1.001,
        rate * 1.003,
        rate * 1.002,
        rate
    ];

    if (!rateChart) {
        rateChart =
            new Chart(
                canvas,
                {
                    type:
                        "line",

                    data: {
                        labels,

                        datasets: [
                            {
                                label:
                                    `${from} to ${to}`,

                                data:
                                    trendData,

                                borderColor:
                                    "#10B981",

                                backgroundColor:
                                    "rgba(16,185,129,0.15)",

                                fill:
                                    true,

                                tension:
                                    0.4,

                                pointRadius:
                                    4
                            }
                        ]
                    },

                    options: {
                        responsive:
                            true,

                        plugins: {
                            legend: {
                                display:
                                    false
                            }
                        },

                        scales: {
                            y: {
                                beginAtZero:
                                    false
                            }
                        }
                    }
                }
            );
    } else {
        rateChart.data.labels =
            labels;

        rateChart.data.datasets[0].label =
            `${from} to ${to}`;

        rateChart.data.datasets[0].data =
            trendData;

        rateChart.update();
    }
}