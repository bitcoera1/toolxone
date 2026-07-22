// ======================================
// TOOLXONE RETIREMENT CALCULATOR PRO
// Number Engine Integrated
// ======================================

function calculateRetirement() {
    const currentAge =
        parseFloat(
            document.getElementById(
                "currentAge"
            ).value
        );

    const retirementAge =
        parseFloat(
            document.getElementById(
                "retirementAge"
            ).value
        );

    const currentSavings =
        parseFloat(
            document.getElementById(
                "currentSavings"
            ).value
        );

    const monthlyContribution =
        parseFloat(
            document.getElementById(
                "monthlyContribution"
            ).value
        );

    const annualReturn =
        parseFloat(
            document.getElementById(
                "annualReturn"
            ).value
        );

    if (
        Number.isNaN(currentAge) ||
        Number.isNaN(retirementAge) ||
        Number.isNaN(currentSavings) ||
        Number.isNaN(monthlyContribution) ||
        Number.isNaN(annualReturn) ||
        currentAge < 0 ||
        retirementAge <= currentAge ||
        currentSavings < 0 ||
        monthlyContribution < 0 ||
        annualReturn < 0 ||
        (
            currentSavings === 0 &&
            monthlyContribution === 0
        )
    ) {
        alert(
            "Please enter valid values. Add current savings or a monthly contribution."
        );

        return;
    }

    const years =
        retirementAge -
        currentAge;

    const months =
        years * 12;

    const monthlyRate =
        annualReturn /
        100 /
        12;

    let futureCurrentSavings;
    let futureContributions;

    if (
        monthlyRate === 0
    ) {
        futureCurrentSavings =
            currentSavings;

        futureContributions =
            monthlyContribution *
            months;
    } else {
        futureCurrentSavings =
            currentSavings *
            Math.pow(
                1 + monthlyRate,
                months
            );

        futureContributions =
            monthlyContribution *
            (
                (
                    Math.pow(
                        1 + monthlyRate,
                        months
                    ) - 1
                ) /
                monthlyRate
            );
    }

    const futureFund =
        futureCurrentSavings +
        futureContributions;

    const totalContributions =
        currentSavings +
        (
            monthlyContribution *
            months
        );

    const investmentGrowth =
        futureFund -
        totalContributions;

    /*
     * Estimated monthly retirement income
     * based on a 4% annual withdrawal estimate.
     */
    const estimatedMonthlyIncome =
        (
            futureFund *
            0.04
        ) /
        12;

    const result =
        document.getElementById(
            "retirementResult"
        );

    result.classList.add(
        "active"
    );

    result.innerHTML = `
        ${createRetirementCountResult(
            "Years Remaining",
            years,
            "Years"
        )}

        ${createRetirementMoneyResult(
            "Future Retirement Fund",
            futureFund
        )}

        ${createRetirementMoneyResult(
            "Total Contributions",
            totalContributions
        )}

        ${createRetirementMoneyResult(
            "Investment Growth",
            investmentGrowth
        )}

        ${createRetirementMoneyResult(
            "Estimated Monthly Retirement Income",
            estimatedMonthlyIncome
        )}

        ${createRetirementInsight()}
    `;

    updateRetirementBars({
        futureFund,
        totalContributions,
        investmentGrowth
    });

// Record successful calculation
ToolXoneStatisticsEvents.recordCalculation(
    "retirement-calculator"
);

}


/* ======================================
   RESULT BUILDERS
   ====================================== */

function createRetirementMoneyResult(
    label,
    value
) {
    const formattedValue =
        formatRetirementNumber(
            value
        );

    const words =
        retirementNumberToWords(
            value
        );

    return `
        <div class="result-line retirement-result-item">
            <span>${label}</span>

            <strong>
                ${formattedValue}
            </strong>

            ${
                words
                    ? `
                        <small class="retirement-number-words">
                            ${words}
                        </small>
                    `
                    : ""
            }
        </div>
    `;
}


function createRetirementCountResult(
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
        <div class="result-line retirement-result-item">
            <span>${label}</span>

            <strong>
                ${formattedValue}
                ${suffix}
            </strong>
        </div>
    `;
}


function createRetirementInsight() {
    return `
        <div class="result-line retirement-insight-item">
            <span>ToolXone Insight</span>

            <strong>
                💡 Starting early gives compound growth
                more time to work for you.
            </strong>
        </div>
    `;
}


/* ======================================
   NUMBER ENGINE HELPERS
   ====================================== */

function formatRetirementNumber(value) {
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


function retirementNumberToWords(value) {
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
   PROGRESS BARS
   ====================================== */

function updateRetirementBars({
    futureFund,
    totalContributions,
    investmentGrowth
}) {
    const bars =
        document.getElementById(
            "retirementBars"
        );

    bars.style.display =
        "block";

    const contributionPercent =
        futureFund > 0
            ? (
                totalContributions /
                futureFund
            ) * 100
            : 0;

    const growthPercent =
        futureFund > 0
            ? (
                investmentGrowth /
                futureFund
            ) * 100
            : 0;

    document.getElementById(
        "contributionBar"
    ).style.width =
        `${clampRetirementPercent(
            contributionPercent
        )}%`;

    document.getElementById(
        "growthBar"
    ).style.width =
        `${clampRetirementPercent(
            growthPercent
        )}%`;
}


function clampRetirementPercent(value) {
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

function resetRetirement() {
    document.getElementById(
        "currentAge"
    ).value = "";

    document.getElementById(
        "retirementAge"
    ).value = "";

    document.getElementById(
        "currentSavings"
    ).value = "";

    document.getElementById(
        "monthlyContribution"
    ).value = "";

    document.getElementById(
        "annualReturn"
    ).value = "";

    document.getElementById(
        "retirementResult"
    ).classList.remove(
        "active"
    );

    document.getElementById(
        "retirementResult"
    ).innerHTML =
        "<p>Your retirement summary will appear here.</p>";

    document.getElementById(
        "retirementBars"
    ).style.display =
        "none";

    document.getElementById(
        "contributionBar"
    ).style.width =
        "0%";

    document.getElementById(
        "growthBar"
    ).style.width =
        "0%";
}


/* ======================================
   ENTER KEY SUPPORT
   ====================================== */

document
    .querySelectorAll(
        "#currentAge, " +
        "#retirementAge, " +
        "#currentSavings, " +
        "#monthlyContribution, " +
        "#annualReturn"
    )
    .forEach(input => {
        input.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Enter"
                ) {
                    calculateRetirement();
                }
            }
        );
    });


function runRetirementCalculator() {
    calculateRetirement();
}