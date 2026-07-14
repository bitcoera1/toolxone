// ======================================
// TOOLXONE COMPOUND INTEREST CALCULATOR
// ======================================

function calculateCompound() {
    const principal =
        parseFloat(
            document.getElementById(
                "principal"
            ).value
        );

    const monthly =
        parseFloat(
            document.getElementById(
                "monthly"
            ).value
        ) || 0;

    const annualRate =
        parseFloat(
            document.getElementById(
                "rate"
            ).value
        );

    const years =
        parseFloat(
            document.getElementById(
                "years"
            ).value
        );

    const frequency =
        parseInt(
            document.getElementById(
                "frequency"
            ).value,
            10
        );

    if (
        !principal ||
        !annualRate ||
        !years
    ) {
        alert(
            "Please fill all required fields."
        );

        return;
    }

    const r =
        annualRate / 100;

    let balance =
        principal;

    const totalMonths =
        years * 12;

    // Simulate month-by-month growth
    for (
        let month = 1;
        month <= totalMonths;
        month++
    ) {
        balance += monthly;

        const periodicRate =
            r / frequency;

        balance *= Math.pow(
            1 + periodicRate,
            frequency / 12
        );
    }

    const totalContribution =
        principal +
        monthly * totalMonths;

    const interestEarned =
        balance -
        totalContribution;

    const growthPercent =
        (
            interestEarned /
            totalContribution
        ) * 100;

    const result =
        document.getElementById(
            "compoundResult"
        );

    result.classList.add(
        "active"
    );

    result.innerHTML = `
        ${createCompoundMoneyResult(
            "Future Value",
            balance
        )}

        ${createCompoundMoneyResult(
            "Total Contributions",
            totalContribution
        )}

        ${createCompoundMoneyResult(
            "Interest Earned",
            interestEarned
        )}

        ${createCompoundPercentResult(
            "Growth",
            growthPercent
        )}
    `;

    document.getElementById(
        "growthBars"
    ).style.display =
        "block";

    const investmentPercent =
        (
            totalContribution /
            balance
        ) * 100;

    const interestPercent =
        (
            interestEarned /
            balance
        ) * 100;

    document.getElementById(
        "investmentBar"
    ).style.width =
        `${investmentPercent}%`;

    document.getElementById(
        "interestBar"
    ).style.width =
        `${interestPercent}%`;
}


/* ======================================
   RESULT BUILDING
   ====================================== */

function createCompoundMoneyResult(
    label,
    value
) {
    const formattedValue =
        formatCompoundNumber(
            value
        );

    const words =
        compoundNumberToWords(
            value
        );

    return `
        <div class="result-line compound-result-item">
            <span>${label}</span>

            <strong>
                ${formattedValue}
            </strong>

            ${
                words
                    ? `
                        <small class="compound-number-words">
                            ${words}
                        </small>
                    `
                    : ""
            }
        </div>
    `;
}


function createCompoundPercentResult(
    label,
    value
) {
    const formattedPercent =
        Number(value).toFixed(2);

    return `
        <div class="result-line compound-result-item">
            <span>${label}</span>

            <strong>
                ${formattedPercent}%
            </strong>
        </div>
    `;
}


function formatCompoundNumber(value) {
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


function compoundNumberToWords(value) {
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

function resetCompound() {
    document.getElementById(
        "principal"
    ).value = "";

    document.getElementById(
        "monthly"
    ).value = "";

    document.getElementById(
        "rate"
    ).value = "";

    document.getElementById(
        "years"
    ).value = "";

    document.getElementById(
        "frequency"
    ).value = "12";

    document.getElementById(
        "compoundResult"
    ).classList.remove(
        "active"
    );

    document.getElementById(
        "compoundResult"
    ).innerHTML =
        "<p>Your investment summary will appear here.</p>";

    document.getElementById(
        "growthBars"
    ).style.display =
        "none";

    document.getElementById(
        "investmentBar"
    ).style.width =
        "0%";

    document.getElementById(
        "interestBar"
    ).style.width =
        "0%";
}


/* ======================================
   ENTER KEY SUPPORT
   ====================================== */

document
    .querySelectorAll(
        "input"
    )
    .forEach(input => {
        input.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Enter"
                ) {
                    calculateCompound();
                }
            }
        );
    });


function runCompoundCalculator() {
    calculateCompound();
}