// ======================================
// TOOLXONE INFLATION CALCULATOR PRO
// Number Engine Integrated
// ======================================

function calculateInflation() {
    const current =
        parseFloat(
            document.getElementById(
                "currentAmount"
            ).value
        );

    const rate =
        parseFloat(
            document.getElementById(
                "inflationRate"
            ).value
        );

    const years =
        parseFloat(
            document.getElementById(
                "years"
            ).value
        );

    if (
        Number.isNaN(current) ||
        Number.isNaN(rate) ||
        Number.isNaN(years) ||
        current <= 0 ||
        rate < 0 ||
        years <= 0
    ) {
        alert(
            "Please enter valid values."
        );

        return;
    }

    const inflationFactor =
        Math.pow(
            1 + rate / 100,
            years
        );

    const futureValue =
        current *
        inflationFactor;

    const increase =
        futureValue -
        current;

    const purchasingPower =
        current /
        inflationFactor;

    const result =
        document.getElementById(
            "inflationResult"
        );

    result.classList.add(
        "active"
    );

    result.innerHTML = `
        ${createInflationMoneyResult(
            "Current Amount",
            current
        )}

        ${createInflationMoneyResult(
            "Future Value",
            futureValue
        )}

        ${createInflationMoneyResult(
            "Total Increase",
            increase
        )}

        ${createInflationMoneyResult(
            "Today's Purchasing Power",
            purchasingPower
        )}

        ${createInflationCountResult(
            "Inflation Period",
            years,
            years === 1
                ? "Year"
                : "Years"
        )}
    `;

    document.getElementById(
        "inflationBars"
    ).style.display =
        "block";

    const originalPercent =
        (
            current /
            futureValue
        ) * 100;

    const increasePercent =
        (
            increase /
            futureValue
        ) * 100;

    document.getElementById(
        "originalBar"
    ).style.width =
        `${clampInflationPercent(
            originalPercent
        )}%`;

    document.getElementById(
        "increaseBar"
    ).style.width =
        `${clampInflationPercent(
            increasePercent
        )}%`;
}


/* ======================================
   RESULT BUILDERS
   ====================================== */

function createInflationMoneyResult(
    label,
    value
) {
    const formattedValue =
        formatInflationNumber(
            value
        );

    const words =
        inflationNumberToWords(
            value
        );

    return `
        <div class="result-line inflation-result-item">
            <span>${label}</span>

            <strong>
                ${formattedValue}
            </strong>

            ${
                words
                    ? `
                        <small class="inflation-number-words">
                            ${words}
                        </small>
                    `
                    : ""
            }
        </div>
    `;
}


function createInflationCountResult(
    label,
    value,
    suffix = ""
) {
    const formattedValue =
        window.ToolXoneNumberEngine
            ? ToolXoneNumberEngine.format(
                value,
                {
                    maximumFractionDigits: 2
                }
            )
            : String(value);

    return `
        <div class="result-line inflation-result-item">
            <span>${label}</span>

            <strong>
                ${formattedValue}
                ${suffix}
            </strong>
        </div>
    `;
}


/* ======================================
   NUMBER ENGINE HELPERS
   ====================================== */

function formatInflationNumber(value) {
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


function inflationNumberToWords(value) {
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

function clampInflationPercent(value) {
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

function resetInflation() {
    document.getElementById(
        "currentAmount"
    ).value = "";

    document.getElementById(
        "inflationRate"
    ).value = "";

    document.getElementById(
        "years"
    ).value = "";

    document.getElementById(
        "inflationResult"
    ).classList.remove(
        "active"
    );

    document.getElementById(
        "inflationResult"
    ).innerHTML =
        "<p>Your inflation summary will appear here.</p>";

    document.getElementById(
        "inflationBars"
    ).style.display =
        "none";

    document.getElementById(
        "originalBar"
    ).style.width =
        "0%";

    document.getElementById(
        "increaseBar"
    ).style.width =
        "0%";
}


/* ======================================
   ENTER KEY SUPPORT
   ====================================== */

document
    .querySelectorAll(
        "#currentAmount, " +
        "#inflationRate, " +
        "#years"
    )
    .forEach(input => {
        input.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Enter"
                ) {
                    calculateInflation();
                }
            }
        );
    });


function runInflationCalculator() {
    calculateInflation();
}