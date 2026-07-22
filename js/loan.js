// ======================================
// TOOLXONE LOAN / EMI CALCULATOR PRO
// ======================================

function calculateLoan() {
    const amount =
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

    let duration =
        parseFloat(
            document.getElementById(
                "loanTenure"
            ).value
        );

    const tenureType =
        document.getElementById(
            "tenureType"
        ).value;

    if (
        !amount ||
        !annualRate ||
        !duration
    ) {
        alert(
            "Please fill all fields."
        );

        return;
    }

    if (
        tenureType === "years"
    ) {
        duration *= 12;
    }

    const monthlyRate =
        annualRate / 12 / 100;

    const growthFactor =
        Math.pow(
            1 + monthlyRate,
            duration
        );

    const emi =
        (
            amount *
            monthlyRate *
            growthFactor
        ) /
        (
            growthFactor - 1
        );

    const totalPayment =
        emi * duration;

    const totalInterest =
        totalPayment - amount;

    const result =
        document.getElementById(
            "loanResult"
        );

    result.classList.add(
        "active"
    );

    result.innerHTML = `
        ${createLoanResultLine(
            "Monthly EMI",
            emi
        )}

        ${createLoanResultLine(
            "Total Interest",
            totalInterest
        )}

        ${createLoanResultLine(
            "Total Payment",
            totalPayment
        )}
    `;

    document.getElementById(
        "loanBars"
    ).style.display = "block";

    const principalPercent =
        (
            amount /
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
        `${principalPercent}%`;

    document.getElementById(
    "interestBar"
).style.width =
    `${interestPercent}%`;

// Record successful calculation
ToolXoneStatisticsEvents.recordCalculation(
    "loan-calculator"
);

}


/* ======================================
   RESULT BUILDING
   ====================================== */

function createLoanResultLine(
    label,
    value
) {
    const formattedValue =
        formatLoanNumber(
            value
        );

    const words =
        loanNumberToWords(
            value
        );

    return `
        <div class="result-line loan-result-item">
            <span>${label}</span>

            <strong>
                ${formattedValue}
            </strong>

            ${
                words
                    ? `
                        <small class="loan-number-words">
                            ${words}
                        </small>
                    `
                    : ""
            }
        </div>
    `;
}


function formatLoanNumber(value) {
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


function loanNumberToWords(value) {
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

function resetLoan() {
    document.getElementById(
        "loanAmount"
    ).value = "";

    document.getElementById(
        "interestRate"
    ).value = "";

    document.getElementById(
        "loanTenure"
    ).value = "";

    document.getElementById(
        "tenureType"
    ).value = "years";

    document.getElementById(
        "loanResult"
    ).classList.remove(
        "active"
    );

    document.getElementById(
        "loanResult"
    ).innerHTML =
        "<p>Your loan summary will appear here.</p>";

    document.getElementById(
        "loanBars"
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
        "input"
    )
    .forEach(input => {
        input.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Enter"
                ) {
                    calculateLoan();
                }
            }
        );
    });


function runLoanCalculator() {
    calculateLoan();
}