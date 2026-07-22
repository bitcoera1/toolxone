// ======================================
// TOOLXONE SAVINGS GOAL CALCULATOR PRO
// Number Engine Integrated
// ======================================

function calculateSavings() {
    const target =
        parseFloat(
            document.getElementById(
                "targetAmount"
            ).value
        );

    const current =
        parseFloat(
            document.getElementById(
                "currentSavings"
            ).value
        );

    const months =
        parseFloat(
            document.getElementById(
                "months"
            ).value
        );

    if (
        Number.isNaN(target) ||
        Number.isNaN(current) ||
        Number.isNaN(months) ||
        target <= 0 ||
        current < 0 ||
        months <= 0
    ) {
        alert(
            "Please enter valid values."
        );

        return;
    }

    const remaining =
        Math.max(
            target - current,
            0
        );

    const monthly =
        remaining / months;

    const weekly =
        monthly / 4.345;

    const daily =
        monthly / 30.44;

    const progress =
        Math.min(
            (
                current /
                target
            ) * 100,
            100
        );

    const result =
        document.getElementById(
            "savingsResult"
        );

    result.classList.add(
        "active"
    );

    result.innerHTML = `
        ${createSavingsMoneyResult(
            "Target Amount",
            target
        )}

        ${createSavingsMoneyResult(
            "Current Savings",
            current
        )}

        ${createSavingsMoneyResult(
            "Remaining Amount",
            remaining
        )}

        ${createSavingsMoneyResult(
            "Monthly Saving Needed",
            monthly
        )}

        ${createSavingsMoneyResult(
            "Weekly Saving Needed",
            weekly
        )}

        ${createSavingsMoneyResult(
            "Daily Saving Needed",
            daily
        )}

        ${createSavingsPercentResult(
            "Goal Completed",
            progress
        )}
    `;

    document.getElementById(
        "savingsBars"
    ).style.display =
        "block";

    document.getElementById(
        "currentBar"
    ).style.width =
        `${progress}%`;

    document.getElementById(
        "remainingBar"
    ).style.width =
        `${100 - progress}%`;

        // Record successful calculation
ToolXoneStatisticsEvents.recordCalculation(
    "savings-goal-calculator"
);

}


/* ======================================
   RESULT BUILDERS
   ====================================== */

function createSavingsMoneyResult(
    label,
    value
) {
    const formattedValue =
        formatSavingsNumber(
            value
        );

    const words =
        savingsNumberToWords(
            value
        );

    return `
        <div class="result-line savings-result-item">
            <span>${label}</span>

            <strong>
                ${formattedValue}
            </strong>

            ${
                words
                    ? `
                        <small class="savings-number-words">
                            ${words}
                        </small>
                    `
                    : ""
            }
        </div>
    `;
}


function createSavingsPercentResult(
    label,
    value
) {
    const formattedValue =
        window.ToolXoneNumberEngine
            ? ToolXoneNumberEngine.format(
                value,
                {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                }
            )
            : Number(value).toFixed(1);

    return `
        <div class="result-line savings-result-item">
            <span>${label}</span>

            <strong>
                ${formattedValue}%
            </strong>
        </div>
    `;
}


/* ======================================
   NUMBER ENGINE HELPERS
   ====================================== */

function formatSavingsNumber(value) {
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


function savingsNumberToWords(value) {
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

function resetSavings() {
    document.getElementById(
        "targetAmount"
    ).value = "";

    document.getElementById(
        "currentSavings"
    ).value = "";

    document.getElementById(
        "months"
    ).value = "";

    document.getElementById(
        "savingsResult"
    ).classList.remove(
        "active"
    );

    document.getElementById(
        "savingsResult"
    ).innerHTML =
        "<p>Your savings summary will appear here.</p>";

    document.getElementById(
        "savingsBars"
    ).style.display =
        "none";

    document.getElementById(
        "currentBar"
    ).style.width =
        "0%";

    document.getElementById(
        "remainingBar"
    ).style.width =
        "0%";
}


/* ======================================
   ENTER KEY SUPPORT
   ====================================== */

document
    .querySelectorAll(
        "#targetAmount, " +
        "#currentSavings, " +
        "#months"
    )
    .forEach(input => {
        input.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Enter"
                ) {
                    calculateSavings();
                }
            }
        );
    });


function runSavingsCalculator() {
    calculateSavings();
}