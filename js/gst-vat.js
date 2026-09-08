// ======================================
// TOOLXONE GST / VAT CALCULATOR PRO
// Number Engine Integrated
// ======================================

function calculateTax() {
    const amount =
        parseFloat(
            document.getElementById(
                "amount"
            ).value
        );

    const rate =
        parseFloat(
            document.getElementById(
                "taxRate"
            ).value
        );

    const type =
        document.getElementById(
            "taxType"
        ).value;

if (
    !Number.isFinite(amount) ||
    !Number.isFinite(rate) ||
    amount <= 0 ||
    rate < 0
) {
        alert(
            "Please enter a valid amount and tax rate."
        );

        return;
    }

    let basePrice;
    let taxAmount;
    let finalPrice;

    if (
        type === "add"
    ) {
        basePrice =
            amount;

        taxAmount =
            amount *
            (
                rate /
                100
            );

        finalPrice =
            basePrice +
            taxAmount;
    } else {
        finalPrice =
            amount;

        basePrice =
            amount /
            (
                1 +
                rate /
                100
            );

        taxAmount =
            finalPrice -
            basePrice;
    }

    const result =
        document.getElementById(
            "taxResult"
        );

    result.classList.add(
        "active"
    );

    result.innerHTML = `
        ${createTaxMoneyResult(
            "Base Price",
            basePrice
        )}

        ${createTaxMoneyResult(
            "Tax Amount",
            taxAmount
        )}

        ${createTaxMoneyResult(
            "Final Price",
            finalPrice
        )}

        ${createTaxPercentResult(
            "Tax Rate",
            rate
        )}
    `;

    document.getElementById(
        "taxBars"
    ).style.display =
        "block";

    const basePercent =
        finalPrice > 0
            ? (
                basePrice /
                finalPrice
            ) * 100
            : 0;

    const taxPercent =
        finalPrice > 0
            ? (
                taxAmount /
                finalPrice
            ) * 100
            : 0;

    document.getElementById(
        "baseBar"
    ).style.width =
        `${clampTaxPercent(
            basePercent
        )}%`;

    document.getElementById(
        "taxBar"
    ).style.width =
        `${clampTaxPercent(
            taxPercent
        )}%`;

// Record successful calculation
if (
    typeof ToolXoneStatisticsEvents !== "undefined" &&
    typeof ToolXoneStatisticsEvents.recordCalculation ===
        "function"
) {
    ToolXoneStatisticsEvents.recordCalculation(
        "gst-vat-calculator"
    );
}

    }


/* ======================================
   RESULT BUILDERS
   ====================================== */

function createTaxMoneyResult(
    label,
    value
) {
    const formattedValue =
        formatTaxNumber(
            value
        );

    const words =
        taxNumberToWords(
            value
        );

    return `
        <div class="result-line tax-result-item">
            <span>${label}</span>

            <strong>
                ${formattedValue}
            </strong>

            ${
                words
                    ? `
                        <small class="tax-number-words">
                            ${words}
                        </small>
                    `
                    : ""
            }
        </div>
    `;
}


function createTaxPercentResult(
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
        <div class="result-line tax-result-item">
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

function formatTaxNumber(value) {
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


function taxNumberToWords(value) {
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

function clampTaxPercent(value) {
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

function resetTax() {

    ToolXoneValidationUI.clearAllErrors();

    document.getElementById(
        "amount"
    ).value = "";

    document.getElementById(
        "taxRate"
    ).value = "";

    document.getElementById(
        "taxType"
    ).value = "add";

    document.getElementById(
        "taxResult"
    ).classList.remove(
        "active"
    );

    document.getElementById(
        "taxResult"
    ).innerHTML =
        "<p>Your GST / VAT summary will appear here.</p>";

    document.getElementById(
        "taxBars"
    ).style.display =
        "none";

    document.getElementById(
        "baseBar"
    ).style.width =
        "0%";

    document.getElementById(
        "taxBar"
    ).style.width =
        "0%";
}


/* ======================================
   ENTER KEY SUPPORT
   Dynamic Form Compatible
   ====================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Enter") {
            return;
        }

        const target = event.target;

        if (
            target &&
            (
                target.id === "amount" ||
                target.id === "taxRate"
            )
        ) {
            event.preventDefault();
            calculateTax();
        }
    }
);


/* ==================================
   LIVE RECALCULATION
================================== */

document.addEventListener("change", function (event) {
    if (event.target && event.target.id === "taxType") {
        const amountInput = document.getElementById("amount");
        const taxRateInput = document.getElementById("taxRate");

        if (
            amountInput &&
            taxRateInput &&
            amountInput.value !== "" &&
            taxRateInput.value !== ""
        ) {
            calculateTax();
        }
    }
});