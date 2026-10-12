function formatCurrencyRateUpdate(value) {
    if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value) || value <= 0) return "Unavailable";
    const date = new Date(value * 1000);
    return Number.isFinite(date.getTime()) ? date.toISOString() : "Unavailable";
}

function clearCurrencyFreshness() {
    for (const id of ["currencyRetrievedAt", "currencyRateUpdatedAt"]) {
        const element = document.getElementById(id);
        if (element) element.textContent = "Unavailable";
    }
}

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
    clearCurrencyFreshness();
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

        const retrievedAt = new Date().toISOString();
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
            "✅ Rates retrieved successfully";

        const retrieved = document.getElementById("currencyRetrievedAt");
        const updated = document.getElementById("currencyRateUpdatedAt");
        if (retrieved) retrieved.textContent = retrievedAt;
        if (updated) updated.textContent = formatCurrencyRateUpdate(data.time_last_update_unix);

            // Record successful conversion
ToolXoneStatisticsEvents.recordCalculation(
    "currency-converter"
);

    }
    
    catch (error) {
        clearCurrencyFreshness();
        console.error(
            "Currency conversion error:",
            error
        );

        statusBar.innerHTML =
            "❌ Connection Error";

        result.innerHTML =
            "Unable to fetch exchange rates. Please try again.";
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
                ✔ Indicative exchange rate
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
        "5D"
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
   REAL HISTORICAL RATE CHART
   ToolXone Currency Converter
   ====================================== */

const RATE_HISTORY_API =
    "https://api.frankfurter.dev/v2/rates";

const RATE_HISTORY_RANGES = {
    "1D": {
        label: "1D",
        days: 1
    },

    "5D": {
        label: "5D",
        days: 5
    },

    "1M": {
        label: "1M",
        months: 1
    },

    "3M": {
        label: "3M",
        months: 3
    },

    "6M": {
        label: "6M",
        months: 6
    },

    "YTD": {
        label: "YTD",
        ytd: true
    },

    "1Y": {
        label: "1Y",
        months: 12
    }
};


/* ======================================
   DATE HELPERS
   ====================================== */

function formatISODate(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function subtractMonths(
    date,
    months
) {

    const result =
        new Date(date);

    result.setMonth(
        result.getMonth() - months
    );

    return result;
}


function subtractDays(
    date,
    days
) {

    const result =
        new Date(date);

    result.setDate(
        result.getDate() - days
    );

    return result;
}


function getHistoryStartDate(
    rangeKey
) {

    const today =
        new Date();

    const config =
        RATE_HISTORY_RANGES[
            rangeKey
        ];

    if (!config) {
        return subtractDays(
            today,
            5
        );
    }

    if (config.ytd) {

        return new Date(
            today.getFullYear(),
            0,
            1
        );
    }

    if (config.months) {

        return subtractMonths(
            today,
            config.months
        );
    }

    return subtractDays(
        today,
        config.days
    );
}


/* ======================================
   LOAD REAL HISTORICAL DATA
   ====================================== */

async function fetchHistoricalRates(
    from,
    to,
    rangeKey
) {

    const startDate =
        getHistoryStartDate(
            rangeKey
        );

    const endDate =
        new Date();

    const start =
        formatISODate(
            startDate
        );

    const end =
        formatISODate(
            endDate
        );

    const url =
        `${RATE_HISTORY_API}` +
        `?base=${encodeURIComponent(from)}` +
        `&quotes=${encodeURIComponent(to)}` +
        `&from=${start}` +
        `&to=${end}`;

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            `Historical API error: ${response.status}`
        );
    }

    const data =
        await response.json();

    if (!Array.isArray(data)) {

        throw new Error(
            "Invalid historical rate response."
        );
    }

    const points =
        data
            .filter(
                item =>
                    item &&
                    item.date &&
                    item.quote === to &&
                    Number.isFinite(
                        Number(item.rate)
                    )
            )
            .map(
                item => ({
                    date:
                        item.date,

                    rate:
                        Number(item.rate)
                })
            )
            .sort(
                (a, b) =>
                    a.date.localeCompare(
                        b.date
                    )
            );

    if (!points.length) {

        throw new Error(
            `No historical data available for ${from}/${to}.`
        );
    }

    return points;
}


/* ======================================
   CHART LABEL FORMATTING
   ====================================== */

function formatChartDate(
    dateString,
    rangeKey
) {

    const date =
        new Date(
            `${dateString}T00:00:00`
        );

    if (
        rangeKey === "1D" ||
        rangeKey === "5D"
    ) {

        return date.toLocaleDateString(
            undefined,
            {
                month: "short",
                day: "numeric"
            }
        );
    }

    if (
        rangeKey === "YTD" ||
        rangeKey === "1Y"
    ) {

        return date.toLocaleDateString(
            undefined,
            {
                month: "short",
                year: "numeric"
            }
        );
    }

    return date.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric"
        }
    );
}


/* ======================================
   BUILD CHART
   ====================================== */

function renderHistoricalRateChart(
    from,
    to,
    points,
    rangeKey
) {

    const canvas =
        document.getElementById(
            "rateChart"
        );

    if (!canvas) {
        return;
    }

    const labels =
        points.map(
            point =>
                formatChartDate(
                    point.date,
                    rangeKey
                )
        );

    const values =
        points.map(
            point =>
                point.rate
        );

    const chartLabel =
        `${from} → ${to}`;

    if (!rateChart) {

        rateChart =
            new Chart(
                canvas,
                {
                    type: "line",

                    data: {

                        labels,

                        datasets: [
                            {
                                label:
                                    chartLabel,

                                data:
                                    values,

                                borderColor:
                                    "#10B981",

                                backgroundColor:
                                    "rgba(16,185,129,0.15)",

                                fill:
                                    true,

                                tension:
                                    0.25,

                                pointRadius:
                                    rangeKey === "1D" ||
                                    rangeKey === "5D"
                                        ? 3
                                        : 2,

                                pointHoverRadius:
                                    5,

                                borderWidth:
                                    3
                            }
                        ]
                    },

                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            true,

                        interaction: {
                            mode:
                                "index",

                            intersect:
                                false
                        },

                        plugins: {

                            legend: {
                                display:
                                    false
                            },

                            tooltip: {

                                callbacks: {

                                    label:
                                        context => {

                                            const value =
                                                context.parsed.y;

                                            return (
                                                ` 1 ${from} = ` +
                                                formatExchangeRate(
                                                    value
                                                ) +
                                                ` ${to}`
                                            );
                                        }
                                }
                            }
                        },

                        scales: {

                            x: {

                                ticks: {
                                    maxTicksLimit:
                                        rangeKey === "1D"
                                            ? 2
                                            : rangeKey === "5D"
                                                ? 5
                                                : 8
                                }
                            },

                            y: {

                                beginAtZero:
                                    false,

                                ticks: {

                                    callback:
                                        value =>
                                            formatExchangeRate(
                                                value
                                            )
                                }
                            }
                        }
                    }
                }
            );

    } else {

        rateChart.data.labels =
            labels;

        rateChart.data.datasets[0].label =
            chartLabel;

        rateChart.data.datasets[0].data =
            values;

        rateChart.data.datasets[0].pointRadius =
            rangeKey === "1D" ||
            rangeKey === "5D"
                ? 3
                : 2;

        rateChart.update();
    }
}


/* ======================================
   UPDATE REAL CHART
   ====================================== */

async function updateRateChart(
    from,
    to,
    rangeKey = "5D"
) {

    const canvas =
        document.getElementById(
            "rateChart"
        );

    if (!canvas) {
        return;
    }

    const chartTitle =
        document.getElementById(
            "chartTitle"
        );

    const chartStatus =
        document.getElementById(
            "chartStatus"
        );

    if (chartTitle) {

        chartTitle.innerHTML =
            `📈 ${from} → ${to} Trend`;
    }

    if (chartStatus) {

        chartStatus.innerHTML =
            "⏳ Loading historical exchange rates...";
    }

    try {

        const points =
            await fetchHistoricalRates(
                from,
                to,
                rangeKey
            );

        renderHistoricalRateChart(
            from,
            to,
            points,
            rangeKey
        );

        if (chartStatus) {

            chartStatus.innerHTML =
                `✓ Real historical data · ${points.length} data points`;
        }

    } catch (error) {

        console.error(
            "Historical chart error:",
            error
        );

        if (chartStatus) {

            chartStatus.innerHTML =
                "⚠️ Historical chart data unavailable.";
        }
    }
}

/* ======================================
   CHART RANGE CONTROLS
   ====================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* ======================================
           ENTER KEY SUPPORT
           ====================================== */

        const amountInput =
            document.getElementById(
                "amount"
            );

        if (amountInput) {

            amountInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        convertCurrency();
                    }

                }
            );

        }


        /* ======================================
           CHART RANGE CONTROLS
           ====================================== */

        const rangeButtons =
            document.querySelectorAll(
                ".chart-range-btn"
            );

        rangeButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const range =
                            button.dataset.range;

                        const from =
                            document.getElementById(
                                "fromCurrency"
                            )?.value;

                        const to =
                            document.getElementById(
                                "toCurrency"
                            )?.value;

                        if (
                            !from ||
                            !to ||
                            !range
                        ) {
                            return;
                        }

                        /*
                         * Update active button
                         */
                        rangeButtons.forEach(
                            item => {
                                item.classList.remove(
                                    "active"
                                );
                            }
                        );

                        button.classList.add(
                            "active"
                        );

                        /*
                         * Load real historical data
                         */
                        await updateRateChart(
                            from,
                            to,
                            range
                        );
                    }
                );
            }
        );

    }
);