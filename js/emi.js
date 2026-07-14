// ======================================
// TOOLXONE EMI CALCULATOR PRO
// Number Engine Integrated
// ======================================

function calculateEMI() {
    const loan =
        parseFloat(
            document.getElementById(
                "loanAmount"
            ).value
        );

    const annualRate =
        parseFloat(
            document.getElementById(
                "interestRate"
            ).value
        );

    const years =
        parseFloat(
            document.getElementById(
                "loanYears"
            ).value
        );

    if (
        Number.isNaN(loan) ||
        Number.isNaN(annualRate) ||
        Number.isNaN(years) ||
        loan <= 0 ||
        annualRate < 0 ||
        years <= 0
    ) {
        alert(
            "Please enter valid values."
        );

        return;
    }

    const monthlyRate =
        annualRate /
        100 /
        12;

    const months =
        years * 12;

    let emi;

    if (
        monthlyRate === 0
    ) {
        emi =
            loan /
            months;
    } else {
        const growthFactor =
            Math.pow(
                1 + monthlyRate,
                months
            );

        emi =
            loan *
            (
                monthlyRate *
                growthFactor
            ) /
            (
                growthFactor - 1
            );
    }

    const totalPayment =
        emi * months;

    const totalInterest =
        totalPayment -
        loan;

    const result =
        document.getElementById(
            "emiResult"
        );

    result.classList.add(
        "active"
    );

    result.innerHTML = `
        ${createEMIMoneyResult(
            "Loan Amount",
            loan
        )}

        ${createEMIMoneyResult(
            "Monthly EMI",
            emi
        )}

        ${createEMIMoneyResult(
            "Total Interest",
            totalInterest
        )}

        ${createEMIMoneyResult(
            "Total Payment",
            totalPayment
        )}

        ${createEMICountResult(
            "Loan Tenure",
            months,
            months === 1
                ? "Month"
                : "Months"
        )}
    `;

    document.getElementById(
        "emiBars"
    ).style.display =
        "block";

    const principalPercent =
        (
            loan /
            totalPayment
        ) * 100;

    const interestPercent =
        (
            totalInterest /
            totalPayment
        ) * 100;

    document.getElementById(
        "principalBar"
    ).style.width =
        `${clampEMIPercent(
            principalPercent
        )}%`;

    document.getElementById(
        "interestBar"
    ).style.width =
        `${clampEMIPercent(
            interestPercent
        )}%`;
}


/* ======================================
   RESULT BUILDERS
   ====================================== */

function createEMIMoneyResult(
    label,
    value
) {
    const formattedValue =
        formatEMINumber(
            value
        );

    const words =
        emiNumberToWords(
            value
        );

    return `
        <div class="result-line emi-result-item">
            <span>${label}</span>

            <strong>
                ${formattedValue}
            </strong>

            ${
                words
                    ? `
                        <small class="emi-number-words">
                            ${words}
                        </small>
                    `
                    : ""
            }
        </div>
    `;
}


function createEMICountResult(
    label,
    value,
    suffix = ""
) {
    const formattedValue =
        window.ToolXoneNumberEngine
            ? ToolXoneNumberEngine.format(
                value,
                {
                    maximumFractionDigits: 0
                }
            )
            : String(value);

    return `
        <div class="result-line emi-result-item">
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

function formatEMINumber(value) {
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


function emiNumberToWords(value) {
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

function clampEMIPercent(value) {
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

function resetEMI() {
    document.getElementById(
        "loanAmount"
    ).value = "";

    document.getElementById(
        "interestRate"
    ).value = "";

    document.getElementById(
        "loanYears"
    ).value = "";

    document.getElementById(
        "emiResult"
    ).classList.remove(
        "active"
    );

    document.getElementById(
        "emiResult"
    ).innerHTML =
        "<p>Your EMI summary will appear here.</p>";

    document.getElementById(
        "emiBars"
    ).style.display =
        "none";

    document.getElementById(
        "principalBar"
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
        "#loanAmount, " +
        "#interestRate, " +
        "#loanYears"
    )
    .forEach(input => {
        input.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Enter"
                ) {
                    calculateEMI();
                }
            }
        );
    });


function runEMICalculator() {
    calculateEMI();
}