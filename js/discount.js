// ======================================
// TOOLXONE DISCOUNT CALCULATOR PRO
// Number Engine Integrated
// ======================================

function calculateDiscount() {
    const original =
        parseFloat(
            document.getElementById(
                "originalPrice"
            ).value
        );

    const discount =
        parseFloat(
            document.getElementById(
                "discountPercent"
            ).value
        );

    if (
        Number.isNaN(original) ||
        Number.isNaN(discount) ||
        original <= 0 ||
        discount < 0 ||
        discount > 100
    ) {
        alert(
            "Please enter a valid price and discount percentage."
        );

        return;
    }

    const saved =
        original *
        (
            discount /
            100
        );

    const finalPrice =
        original -
        saved;

    const result =
        document.getElementById(
            "discountResult"
        );

    result.classList.add(
        "active"
    );

    result.innerHTML = `
        ${createDiscountMoneyResult(
            "Original Price",
            original
        )}

        ${createDiscountMoneyResult(
            "You Save",
            saved
        )}

        ${createDiscountMoneyResult(
            "Final Price",
            finalPrice
        )}

        ${createDiscountPercentResult(
            "Discount",
            discount
        )}
    `;

    document.getElementById(
        "discountBars"
    ).style.display =
        "block";

    const payPercent =
        (
            finalPrice /
            original
        ) * 100;

    const savePercent =
        (
            saved /
            original
        ) * 100;

    document.getElementById(
        "payBar"
    ).style.width =
        `${clampDiscountPercent(
            payPercent
        )}%`;

    document.getElementById(
        "saveBar"
    ).style.width =
        `${clampDiscountPercent(
            savePercent
        )}%`;
}


/* ======================================
   RESULT BUILDERS
   ====================================== */

function createDiscountMoneyResult(
    label,
    value
) {
    const formattedValue =
        formatDiscountNumber(
            value
        );

    const words =
        discountNumberToWords(
            value
        );

    return `
        <div class="result-line discount-result-item">
            <span>${label}</span>

            <strong>
                ${formattedValue}
            </strong>

            ${
                words
                    ? `
                        <small class="discount-number-words">
                            ${words}
                        </small>
                    `
                    : ""
            }
        </div>
    `;
}


function createDiscountPercentResult(
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
        <div class="result-line discount-result-item">
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

function formatDiscountNumber(value) {
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


function discountNumberToWords(value) {
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

function clampDiscountPercent(value) {
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

function resetDiscount() {
    document.getElementById(
        "originalPrice"
    ).value = "";

    document.getElementById(
        "discountPercent"
    ).value = "";

    document.getElementById(
        "discountResult"
    ).classList.remove(
        "active"
    );

    document.getElementById(
        "discountResult"
    ).innerHTML =
        "<p>Your discount summary will appear here.</p>";

    document.getElementById(
        "discountBars"
    ).style.display =
        "none";

    document.getElementById(
        "payBar"
    ).style.width =
        "0%";

    document.getElementById(
        "saveBar"
    ).style.width =
        "0%";
}


/* ======================================
   ENTER KEY SUPPORT
   ====================================== */

document
    .querySelectorAll(
        "#originalPrice, " +
        "#discountPercent"
    )
    .forEach(input => {
        input.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Enter"
                ) {
                    calculateDiscount();
                }
            }
        );
    });