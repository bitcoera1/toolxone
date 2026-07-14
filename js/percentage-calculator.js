// ======================================
// TOOLXONE PERCENTAGE CALCULATOR PRO
// Number Engine Integrated
// ======================================


/* ======================================
   MODE SWITCHING
   ====================================== */

function showMode(
    mode,
    button
) {
    document
        .querySelectorAll(
            ".calc-section"
        )
        .forEach(section => {
            section.classList.remove(
                "active"
            );
        });

    document
        .querySelectorAll(
            ".mode-btn"
        )
        .forEach(modeButton => {
            modeButton.classList.remove(
                "active"
            );
        });

    button.classList.add(
        "active"
    );

    const resultBox =
        document.getElementById(
            "percentResult"
        );

    resultBox.style.display =
        "none";

    resultBox.innerHTML =
        "";

    if (
        mode === "of"
    ) {
        document
            .getElementById(
                "modeOf"
            )
            .classList.add(
                "active"
            );
    } else if (
        mode === "what"
    ) {
        document
            .getElementById(
                "modeWhat"
            )
            .classList.add(
                "active"
            );
    } else {
        document
            .getElementById(
                "modeChange"
            )
            .classList.add(
                "active"
            );
    }
}


/* ======================================
   RESULT DISPLAY
   ====================================== */

function showResult(
    content,
    type = "success"
) {
    const resultBox =
        document.getElementById(
            "percentResult"
        );

    resultBox.style.display =
        "block";

    resultBox.className =
        `percent-result ${type}`;

    resultBox.innerHTML =
        content;
}


function showPercentageError(
    message
) {
    showResult(
        `
            <div class="percentage-message">
                ${message}
            </div>
        `,
        "error"
    );
}


/* ======================================
   NUMBER ENGINE HELPERS
   ====================================== */

function formatPercentageNumber(
    value,
    maximumFractionDigits = 4
) {
    if (
        window.ToolXoneNumberEngine
    ) {
        return ToolXoneNumberEngine.format(
            value,
            {
                maximumFractionDigits
            }
        );
    }

    return Number(
        Number(value).toFixed(
            maximumFractionDigits
        )
    ).toLocaleString();
}


function percentageNumberToWords(
    value
) {
    if (
        !window.ToolXoneNumberEngine
    ) {
        return "";
    }

    const roundedValue =
        Number(
            Number(value).toFixed(4)
        );

    return ToolXoneNumberEngine.words(
        roundedValue,
        {
            decimalLimit: 4
        }
    );
}


function createPercentageValueResult({
    statement,
    value
}) {
    const formattedValue =
        formatPercentageNumber(
            value,
            4
        );

    const words =
        percentageNumberToWords(
            value
        );

    return `
        <div class="percentage-result-summary">
            <div class="percentage-statement">
                ${statement}
            </div>

            <strong class="percentage-main-value">
                📌 ${formattedValue}
            </strong>

            ${
                words
                    ? `
                        <small class="percentage-number-words">
                            ${words}
                        </small>
                    `
                    : ""
            }
        </div>
    `;
}


function createPercentageOnlyResult({
    statement,
    percentage,
    note = ""
}) {
    const formattedPercentage =
        formatPercentageNumber(
            percentage,
            4
        );

    return `
        <div class="percentage-result-summary">
            <div class="percentage-statement">
                ${statement}
            </div>

            <strong class="percentage-main-value">
                📌 ${formattedPercentage}%
            </strong>

            ${
                note
                    ? `
                        <small class="percentage-result-note">
                            ${note}
                        </small>
                    `
                    : ""
            }
        </div>
    `;
}


/* ======================================
   MODE 1 — PERCENT OF NUMBER
   ====================================== */

function calculatePercentOf() {
    const percent =
        parseFloat(
            document.getElementById(
                "percentValue"
            ).value
        );

    const total =
        parseFloat(
            document.getElementById(
                "totalValue"
            ).value
        );

    if (
        Number.isNaN(percent) ||
        Number.isNaN(total)
    ) {
        showPercentageError(
            "Please enter both values."
        );

        return;
    }

    const result =
        (
            percent /
            100
        ) *
        total;

    const formattedPercent =
        formatPercentageNumber(
            percent,
            4
        );

    const formattedTotal =
        formatPercentageNumber(
            total,
            4
        );

    showResult(
        createPercentageValueResult({
            statement:
                `${formattedPercent}% of ${formattedTotal} equals`,

            value:
                result
        })
    );
}


/* ======================================
   MODE 2 — WHAT PERCENT?
   ====================================== */

function calculateWhatPercent() {
    const part =
        parseFloat(
            document.getElementById(
                "partValue"
            ).value
        );

    const whole =
        parseFloat(
            document.getElementById(
                "wholeValue"
            ).value
        );

    if (
        Number.isNaN(part) ||
        Number.isNaN(whole)
    ) {
        showPercentageError(
            "Please enter both values."
        );

        return;
    }

    if (
        whole === 0
    ) {
        showPercentageError(
            "Total value cannot be zero."
        );

        return;
    }

    const result =
        (
            part /
            whole
        ) *
        100;

    const formattedPart =
        formatPercentageNumber(
            part,
            4
        );

    const formattedWhole =
        formatPercentageNumber(
            whole,
            4
        );

    showResult(
        createPercentageOnlyResult({
            statement:
                `${formattedPart} is what percent of ${formattedWhole}?`,

            percentage:
                result
        })
    );
}


/* ======================================
   MODE 3 — PERCENTAGE CHANGE
   ====================================== */

function calculateChange() {
    const oldValue =
        parseFloat(
            document.getElementById(
                "oldValue"
            ).value
        );

    const newValue =
        parseFloat(
            document.getElementById(
                "newValue"
            ).value
        );

    if (
        Number.isNaN(oldValue) ||
        Number.isNaN(newValue)
    ) {
        showPercentageError(
            "Please enter both values."
        );

        return;
    }

    if (
        oldValue === 0
    ) {
        showPercentageError(
            "Old value cannot be zero."
        );

        return;
    }

    const change =
        (
            (
                newValue -
                oldValue
            ) /
            oldValue
        ) *
        100;

    const absoluteChange =
        Math.abs(
            change
        );

    let changeType;
    let changeClass;

    if (
        change > 0
    ) {
        changeType =
            "Increase";

        changeClass =
            "percentage-positive";
    } else if (
        change < 0
    ) {
        changeType =
            "Decrease";

        changeClass =
            "percentage-negative";
    } else {
        changeType =
            "No Change";

        changeClass =
            "percentage-neutral";
    }

    const formattedOldValue =
        formatPercentageNumber(
            oldValue,
            4
        );

    const formattedNewValue =
        formatPercentageNumber(
            newValue,
            4
        );

    showResult(
        `
            <div class="percentage-result-summary ${changeClass}">
                <div class="percentage-statement">
                    From ${formattedOldValue}
                    to ${formattedNewValue}
                </div>

                <strong class="percentage-main-value">
                    📌 ${
                        formatPercentageNumber(
                            absoluteChange,
                            4
                        )
                    }% ${changeType}
                </strong>
            </div>
        `
    );
}


/* ======================================
   RESET
   ====================================== */

function resetPercentage() {
    document.getElementById(
        "percentValue"
    ).value = "";

    document.getElementById(
        "totalValue"
    ).value = "";

    document.getElementById(
        "partValue"
    ).value = "";

    document.getElementById(
        "wholeValue"
    ).value = "";

    document.getElementById(
        "oldValue"
    ).value = "";

    document.getElementById(
        "newValue"
    ).value = "";

    const resultBox =
        document.getElementById(
            "percentResult"
        );

    resultBox.style.display =
        "none";

    resultBox.className =
        "percent-result";

    resultBox.innerHTML =
        "";
}


/* ======================================
   ENTER KEY SUPPORT
   ====================================== */

document
    .querySelectorAll(
        "#percentValue, #totalValue"
    )
    .forEach(input => {
        input.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Enter"
                ) {
                    calculatePercentOf();
                }
            }
        );
    });

document
    .querySelectorAll(
        "#partValue, #wholeValue"
    )
    .forEach(input => {
        input.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Enter"
                ) {
                    calculateWhatPercent();
                }
            }
        );
    });

document
    .querySelectorAll(
        "#oldValue, #newValue"
    )
    .forEach(input => {
        input.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Enter"
                ) {
                    calculateChange();
                }
            }
        );
    });