// ======================================
// TOOLXONE MORTGAGE CALCULATOR PRO
// Framework-Ready Version
// Number Engine Integrated
// ======================================


/* ======================================
   INPUTS
   ====================================== */

function getMortgageInputValues() {
    return {
        loan:
            Number(
                document.getElementById(
                    "loanAmount"
                ).value
            ),

        annualRate:
            Number(
                document.getElementById(
                    "interestRate"
                ).value
            ),

        years:
            Number(
                document.getElementById(
                    "loanYears"
                ).value
            )
    };
}


/* ======================================
   CALCULATION
   ====================================== */

function calculateMortgageValues(data) {
    const monthlyRate =
        data.annualRate /
        100 /
        12;

    const payments =
        data.years * 12;

    let monthlyPayment;

    if (
        monthlyRate === 0
    ) {
        monthlyPayment =
            data.loan /
            payments;
    } else {
        const growthFactor =
            Math.pow(
                1 + monthlyRate,
                payments
            );

        monthlyPayment =
            data.loan *
            (
                monthlyRate *
                growthFactor
            ) /
            (
                growthFactor - 1
            );
    }

    const totalPayment =
        monthlyPayment *
        payments;

    const totalInterest =
        totalPayment -
        data.loan;

    return {
        loan:
            data.loan,

        monthlyPayment,

        totalInterest,

        totalPayment,

        payments
    };
}


/* ======================================
   SUMMARY RENDERING
   ====================================== */

function renderMortgageSummary(
    resultData
) {
    const result =
        document.getElementById(
            "mortgageResult"
        );

    result.classList.add(
        "active"
    );

    result.innerHTML = `
        ${createMortgageMoneyResult(
            "Loan Amount",
            resultData.loan
        )}

        ${createMortgageMoneyResult(
            "Monthly Payment",
            resultData.monthlyPayment
        )}

        ${createMortgageMoneyResult(
            "Total Interest",
            resultData.totalInterest
        )}

        ${createMortgageMoneyResult(
            "Total Payment",
            resultData.totalPayment
        )}

        ${createMortgageCountResult(
            "Total Payments",
            resultData.payments
        )}
    `;
}


/* ======================================
   RESULT BUILDERS
   ====================================== */

function createMortgageMoneyResult(
    label,
    value
) {
    const formattedValue =
        formatMortgageNumber(
            value
        );

    const words =
        mortgageNumberToWords(
            value
        );

    return `
        <div class="result-line mortgage-result-item">
            <span>${label}</span>

            <strong>
                ${formattedValue}
            </strong>

            ${
                words
                    ? `
                        <small class="mortgage-number-words">
                            ${words}
                        </small>
                    `
                    : ""
            }
        </div>
    `;
}


function createMortgageCountResult(
    label,
    value
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
        <div class="result-line mortgage-result-item">
            <span>${label}</span>

            <strong>
                ${formattedValue}
            </strong>
        </div>
    `;
}


function formatMortgageNumber(value) {
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


function mortgageNumberToWords(value) {
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
   BARS
   ====================================== */

function updateMortgageBars(
    resultData
) {
    document.getElementById(
        "mortgageBars"
    ).style.display =
        "block";

    const principalPercent =
        (
            resultData.loan /
            resultData.totalPayment
        ) * 100;

    const interestPercent =
        (
            resultData.totalInterest /
            resultData.totalPayment
        ) * 100;

    document.getElementById(
        "principalBar"
    ).style.width =
        `${principalPercent}%`;

    document.getElementById(
        "interestBar"
    ).style.width =
        `${interestPercent}%`;
}


/* ======================================
   MAIN WORKFLOW
   ====================================== */

function runMortgageCalculator() {
    const data =
        getMortgageInputValues();

    if (
        Number.isNaN(
            data.loan
        ) ||
        Number.isNaN(
            data.annualRate
        ) ||
        Number.isNaN(
            data.years
        ) ||
        data.loan <= 0 ||
        data.annualRate < 0 ||
        data.years <= 0
    ) {
        showMortgageMessage(
            "Please enter valid positive values.",
            "error"
        );

        return;
    }

    const resultData =
        calculateMortgageValues(
            data
        );

    clearMortgageMessage();

    renderMortgageSummary(
        resultData
    );

    updateMortgageBars(
        resultData
    );
}


function calculateMortgage() {
    runMortgageCalculator();
}


/* ======================================
   RESET
   ====================================== */

function resetMortgage() {
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
        "mortgageResult"
    ).classList.remove(
        "active"
    );

    document.getElementById(
        "mortgageResult"
    ).innerHTML =
        "<p>Your mortgage summary will appear here.</p>";

    document.getElementById(
        "mortgageBars"
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

    clearMortgageMessage();
}


/* ======================================
   KEYBOARD SUPPORT
   ====================================== */

document.addEventListener(
    "keydown",
    function (event) {
        if (
            event.key === "Enter"
        ) {
            runMortgageCalculator();
        }
    }
);


/* ======================================
   MESSAGES
   ====================================== */

function showMortgageMessage(
    message,
    type
) {
    const box =
        document.getElementById(
            "mortgageMessage"
        );

    if (!box) {
        return;
    }

    box.className =
        `calculator-message ${type}`;

    box.textContent =
        message;
}


function clearMortgageMessage() {
    const box =
        document.getElementById(
            "mortgageMessage"
        );

    if (!box) {
        return;
    }

    box.className =
        "calculator-message";

    box.textContent =
        "";
}