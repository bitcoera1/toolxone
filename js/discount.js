// ======================================
// TOOLXONE DISCOUNT CALCULATOR PRO
// Number Engine Integrated
// ======================================

// ======================================
// D2.4 — RESULT STATE EXPERIENCE
// ======================================

function setDiscountResultState(state) {
    const resultCard =
        document.querySelector(".result-card");

    const result =
        document.getElementById("discountResult");

    if (!resultCard || !result) {
        return;
    }

    resultCard.classList.remove(
        "state-initial",
        "state-success",
        "state-error"
    );

    resultCard.classList.add(
        `state-${state}`
    );

    result.setAttribute(
        "data-result-state",
        state
    );
}


function setDiscountResultBusy(isBusy) {
    const resultCard =
        document.querySelector(".result-card");

    if (!resultCard) {
        return;
    }

    resultCard.setAttribute(
        "aria-busy",
        isBusy ? "true" : "false"
    );
}

/* =========================================
   D3.2 — DISCOUNT CALCULATION ENGINE
   ========================================= */

/**
 * Performs the core discount calculation.
 *
 * This function contains no DOM logic,
 * validation UI, rendering, bars or statistics.
 *
 * @param {number} originalPrice
 * @param {number} discountPercent
 * @returns {{
 *   originalPrice: number,
 *   discountPercent: number,
 *   savedAmount: number,
 *   finalPrice: number,
 *   payPercent: number,
 *   savePercent: number
 * }}
 */
function calculateDiscountValues(
    originalPrice,
    discountPercent
) {

    const savedAmount =
    roundDiscountMoney(
        originalPrice *
        (
            discountPercent /
            100
        )
    );

const finalPrice =
    roundDiscountMoney(
        originalPrice -
        savedAmount
    );

const payPercent =
    originalPrice > 0
        ? (
            finalPrice /
            originalPrice
        ) * 100
        : 0;

const savePercent =
    originalPrice > 0
        ? (
            savedAmount /
            originalPrice
        ) * 100
        : 0;


const calculation = {
    originalPrice,
    discountPercent,
    savedAmount,
    finalPrice,
    payPercent,
    savePercent
};

calculation.valueSignal =
    classifyDiscountValue(calculation);

return calculation;

}


/* ======================================
   D3.3 — SMART RESULT INSIGHT ENGINE
   Converts validated calculation data
   into a human-readable explanation.
   ====================================== */

function generateDiscountInsight(calculation) {

    if (!calculation) {
        return "";
    }

    const discount = calculation.discountPercent;
    const savePercent = calculation.savePercent;
    const payPercent = calculation.payPercent;

    /* --------------------------------------
       EDGE CASE — NO DISCOUNT
       -------------------------------------- */

    if (discount === 0) {
        return `
            <div class="discount-insight">
                <div class="discount-insight-title">
                    💡 Smart Insight
                </div>

                <p>
                    No discount is applied.
                    You pay <strong>100%</strong> of the original price.
                </p>
            </div>
        `;
    }

    /* --------------------------------------
       EDGE CASE — FULL DISCOUNT
       -------------------------------------- */

    if (discount === 100) {
        return `
            <div class="discount-insight">
                <div class="discount-insight-title">
                    🎉 Smart Insight
                </div>

                <p>
                    This is a <strong>100% discount</strong>.
                    You save the entire original price and pay
                    <strong>nothing</strong>.
                </p>
            </div>
        `;
    }

    /* --------------------------------------
       STANDARD DISCOUNT
       -------------------------------------- */

    const savePer100 = savePercent;
    const payPer100 = payPercent;

    return `
        <div class="discount-insight">

            <div class="discount-insight-title">
                💡 Smart Insight
            </div>

            <p>
                You save <strong>${formatDiscountPercentCompact(savePercent)}</strong>
                of the original price and pay
                <strong>${formatDiscountPercentCompact(payPercent)}</strong>.
            </p>

            <p class="discount-insight-example">
                For every <strong>$100</strong> of the original price,
                you save approximately
                <strong>$${formatDiscountNumber(savePer100)}</strong>
                and pay
                <strong>$${formatDiscountNumber(payPer100)}</strong>.
            </p>

        </div>
    `;
}

/* ======================================
   D3.4.1 — DISCOUNT STRENGTH CLASSIFIER
   Classifies the magnitude of a validated
   discount without judging deal quality.
   ====================================== */

function classifyDiscountStrength(discountPercent) {

    const discount = Number(discountPercent);

    /* --------------------------------------
       INTEGRITY GUARD
       -------------------------------------- */

    if (
        !Number.isFinite(discount) ||
        discount < 0 ||
        discount > 100
    ) {
        return {
            key: "invalid",
            label: "Invalid Discount"
        };
    }


    /* --------------------------------------
       NO DISCOUNT
       -------------------------------------- */

    if (discount === 0) {
        return {
            key: "none",
            label: "No Discount"
        };
    }


    /* --------------------------------------
       SMALL DISCOUNT
       -------------------------------------- */

    if (discount < 10) {
        return {
            key: "small",
            label: "Small Discount"
        };
    }


    /* --------------------------------------
       MODERATE DISCOUNT
       -------------------------------------- */

    if (discount < 25) {
        return {
            key: "moderate",
            label: "Moderate Discount"
        };
    }


    /* --------------------------------------
       HIGH DISCOUNT
       -------------------------------------- */

    if (discount < 50) {
        return {
            key: "high",
            label: "High Discount"
        };
    }


    /* --------------------------------------
       VERY HIGH DISCOUNT
       -------------------------------------- */

    if (discount < 75) {
        return {
            key: "very-high",
            label: "Very High Discount"
        };
    }


    /* --------------------------------------
       EXCEPTIONAL DISCOUNT
       -------------------------------------- */

    if (discount < 100) {
        return {
            key: "exceptional",
            label: "Exceptional Discount"
        };
    }


    /* --------------------------------------
       FULL DISCOUNT
       -------------------------------------- */

    return {
        key: "full",
        label: "Full Discount"
    };
}
/* =========================================================
   D3.4.2 — DISCOUNT STRENGTH PRESENTATION
   ========================================================= */

function renderDiscountStrength(classification, discountPercent) {
  const container = document.getElementById("discountStrength");
  const icon = document.getElementById("discountStrengthIcon");
  const label = document.getElementById("discountStrengthLabel");
  const percent = document.getElementById("discountStrengthPercent");

  if (!container || !icon || !label || !percent) return;

  const presentations = {

    invalid: {
        label: "Invalid Discount",
        icon: "!"
    },

    none: {
        label: "No Discount",
        icon: "○"
    },

    small: {
        label: "Small Discount",
        icon: "•"
    },

    moderate: {
        label: "Moderate Discount",
        icon: "✓"
    },

    high: {
        label: "High Discount",
        icon: "★"
    },

    "very-high": {
        label: "Very High Discount",
        icon: "🔥"
    },

    exceptional: {
        label: "Exceptional Discount",
        icon: "⚡"
    },

    full: {
        label: "Full Discount",
        icon: "🎉"
    }

};

/*
 * Accept either:
 *
 * "high"
 *
 * OR:
 *
 * {
 *   key: "high",
 *   label: "High Discount"
 * }
 */

  const rawKey =
    typeof classification === "string"
      ? classification
      : classification?.key ||
        classification?.id ||
        classification?.level ||
        classification?.strength;

  const key = String(rawKey || "none")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-");

  const state = presentations[key] || presentations.none;

  container.dataset.strength = presentations[key] ? key : "none";

  icon.textContent = state.icon;
  label.textContent = state.label;

  const value = Number(discountPercent);

  percent.textContent =
    Number.isFinite(value)
      ? `${formatStrengthPercent(value)}%`
      : "0%";
}


function formatStrengthPercent(value) {
  const rounded = Math.round(value * 100) / 100;

  return Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

/* =========================================
   D3.4.3 — ADAPTIVE DISCOUNT INTELLIGENCE
   Creates contextual interpretation from
   validated calculation + classification.
   ========================================= */

function generateAdaptiveDiscountMessage(
    calculation,
    classification
) {

    if (!calculation || !classification) {
        return "";
    }

    const discount =
        Number(calculation.discountPercent);

    const payPercent =
        Number(calculation.payPercent);

    const key =
        classification.key;


    /* --------------------------------------
       INTEGRITY GUARD
       -------------------------------------- */

    if (
        !Number.isFinite(discount) ||
        !Number.isFinite(payPercent)
    ) {
        return "";
    }


    /* --------------------------------------
       EXACT LANDMARKS
       -------------------------------------- */

    if (discount === 0) {
        return "The original price remains unchanged.";
    }

    if (discount === 25) {
        return "You save one quarter of the original price and pay about three quarters.";
    }

    if (discount === 50) {
        return "The price is cut in half — you save and pay equal amounts.";
    }

    if (discount === 75) {
        return "You save three quarters of the original price and pay only one quarter.";
    }

    if (discount === 100) {
        return "The entire original price is discounted, so nothing remains to pay.";
    }


    /* --------------------------------------
       ADAPTIVE STRENGTH INTERPRETATION
       -------------------------------------- */

    switch (key) {

        case "small":
            return `A small portion of the original price is removed, leaving ${formatStrengthPercent(payPercent)}% to pay.`;

        case "moderate":
            return `A noticeable portion of the original price is reduced, leaving ${formatStrengthPercent(payPercent)}% to pay.`;

        case "high":
            return `A substantial portion of the original price is reduced, leaving ${formatStrengthPercent(payPercent)}% to pay.`;

        case "very-high":
            return `Most of the original price is being reduced, leaving ${formatStrengthPercent(payPercent)}% to pay.`;

        case "exceptional":
            return `Only ${formatStrengthPercent(payPercent)}% of the original price remains to be paid.`;

        case "full":
            return "The entire original price is discounted.";

        case "none":
            return "The original price remains unchanged.";

        default:
            return "";
    }
}

/* =========================================
   D3.4.4.1 — VALUE SIGNAL ENGINE
   Classifies the absolute saved amount
   without duplicating discount strength.
   ========================================= */

function classifyDiscountValue(calculation) {

    if (!calculation) {
        return null;
    }

    const savedAmount =
        Number(calculation.savedAmount);

    if (
        !Number.isFinite(savedAmount) ||
        savedAmount < 0
    ) {
        return null;
    }


    /* --------------------------------------
       VALUE SIGNAL CLASSIFICATION
       -------------------------------------- */

    if (savedAmount === 0) {
        return {
            key: "none",
            label: "No Savings",
            icon: "○"
        };
    }

    if (savedAmount < 10) {
        return {
            key: "minimal",
            label: "Minimal Savings",
            icon: "•"
        };
    }

    if (savedAmount < 50) {
        return {
            key: "small",
            label: "Small Savings",
            icon: "✓"
        };
    }

    if (savedAmount < 100) {
        return {
            key: "moderate",
            label: "Moderate Savings",
            icon: "✓"
        };
    }

    if (savedAmount < 500) {
        return {
            key: "strong",
            label: "Strong Savings",
            icon: "★"
        };
    }

    if (savedAmount < 1000) {
        return {
            key: "major",
            label: "Major Savings",
            icon: "🔥"
        };
    }

    return {
        key: "exceptional",
        label: "Exceptional Savings",
        icon: "⚡"
    };
}

/* =========================================
   D3.4.4.4 — VALUE-AWARE INTELLIGENCE
   Combines percentage strength with the
   absolute value signal to understand the
   practical significance of the discount.
   ========================================= */

function generateValueAwareIntelligence(
    calculation,
    discountStrength
) {

    if (
        !calculation ||
        !discountStrength ||
        !calculation.valueSignal
    ) {
        return null;
    }

    const valueSignal =
        calculation.valueSignal;

    const strengthKey =
        discountStrength.key;

    const valueKey =
        valueSignal.key;


    /* --------------------------------------
       NO DISCOUNT
       -------------------------------------- */

    if (
        strengthKey === "none" ||
        valueKey === "none"
    ) {
        return {
            key: "none",
            message:
                "No savings are generated because no discount is applied."
        };
    }


    /* --------------------------------------
       HIGH % + LOW ABSOLUTE SAVINGS
       -------------------------------------- */

    if (
        (
            strengthKey === "very-high" ||
            strengthKey === "exceptional" ||
            strengthKey === "full"
        ) &&
        (
            valueKey === "minimal" ||
            valueKey === "small"
        )
    ) {
        return {
            key: "high-rate-low-value",
            message:
                "The discount rate is substantial, but the actual amount saved remains relatively small."
        };
    }


    /* --------------------------------------
       LOW % + HIGH ABSOLUTE SAVINGS
       -------------------------------------- */

    if (
        (
            strengthKey === "small" ||
            strengthKey === "moderate"
        ) &&
        (
            valueKey === "major" ||
            valueKey === "exceptional"
        )
    ) {
        return {
            key: "low-rate-high-value",
            message:
                "The discount percentage is relatively modest, but it produces substantial savings in absolute value."
        };
    }


    /* --------------------------------------
       HIGH % + HIGH ABSOLUTE SAVINGS
       -------------------------------------- */

    if (
        (
            strengthKey === "high" ||
            strengthKey === "very-high" ||
            strengthKey === "exceptional" ||
            strengthKey === "full"
        ) &&
        (
            valueKey === "strong" ||
            valueKey === "major" ||
            valueKey === "exceptional"
        )
    ) {
        return {
            key: "high-impact",
            message:
                "This discount is significant both in percentage terms and in the actual amount saved."
        };
    }


    /* --------------------------------------
       BALANCED / GENERAL CASE
       -------------------------------------- */

    return {
        key: "balanced",
        message:
            "The discount provides meaningful savings relative to both the discount rate and the amount saved."
    };
}


/* =========================================
   D3.4.4.6 — VALUE-AWARE INTELLIGENCE RENDERER
   Renders the combined percentage + value
   interpretation without recalculating data.
   ========================================= */

function renderValueAwareIntelligence(intelligence) {

    const container =
        document.getElementById(
            "valueAwareIntelligence"
        );

    if (!container) {
        return;
    }

    if (
        !intelligence ||
        !intelligence.key ||
        !intelligence.message
    ) {
        container.innerHTML = "";
        container.style.display = "none";
        return;
    }

    container.innerHTML = `
        <div class="value-aware-intelligence
                    value-aware-${intelligence.key}">

            <div class="value-aware-heading">
                <span class="value-aware-icon">
                    🧠
                </span>

                <span class="value-aware-title">
                    Value Perspective
                </span>
            </div>

            <p class="value-aware-message">
                ${intelligence.message}
            </p>

        </div>
    `;

    container.style.display = "block";
}

/* =========================================
   D3.4.5.1 — DEAL CONTEXT CLASSIFIER
   Classifies the relationship between the
   saved amount and the final amount paid.
   Does not judge product or deal quality.
   ========================================= */

function classifyDiscountDealContext(calculation) {

    if (!calculation) {
        return null;
    }

    const savedAmount =
        Number(calculation.savedAmount);

    const finalPrice =
        Number(calculation.finalPrice);

    const discountPercent =
        Number(calculation.discountPercent);


    /* --------------------------------------
       INTEGRITY GUARD
       -------------------------------------- */

    if (
        !Number.isFinite(savedAmount) ||
        !Number.isFinite(finalPrice) ||
        !Number.isFinite(discountPercent) ||
        savedAmount < 0 ||
        finalPrice < 0 ||
        discountPercent < 0 ||
        discountPercent > 100
    ) {
        return null;
    }


    /* --------------------------------------
       NO SAVINGS
       -------------------------------------- */

    if (savedAmount === 0) {
        return {
            key: "none",
            label: "No Savings",
            relationship: "save-none"
        };
    }


    /* --------------------------------------
       FULL SAVING
       Nothing remains to pay
       -------------------------------------- */

    if (finalPrice === 0) {
        return {
            key: "full-saving",
            label: "Full Saving",
            relationship: "pay-none"
        };
    }


    /* --------------------------------------
       SAVE = PAY
       -------------------------------------- */

    if (savedAmount === finalPrice) {
        return {
            key: "save-equals-pay",
            label: "Save Equals Pay",
            relationship: "equal"
        };
    }


    /* --------------------------------------
       SAVE > PAY
       -------------------------------------- */

    if (savedAmount > finalPrice) {
        return {
            key: "save-more-than-pay",
            label: "Save More Than Pay",
            relationship: "save-greater"
        };
    }


    /* --------------------------------------
       SAVE < PAY
       -------------------------------------- */

    return {
        key: "save-less-than-pay",
        label: "Save Less Than Pay",
        relationship: "pay-greater"
    };
}

/* =========================================
   D3.4.6.1 — SAVINGS EFFICIENCY CLASSIFIER
   Classifies how efficiently the original
   price is converted into savings.

   Does not judge product or deal quality.
   ========================================= */

function classifySavingsEfficiency(calculation) {
    if (!calculation) {
        return null;
    }

    const originalPrice = Number(calculation.originalPrice);
    const savedAmount = Number(calculation.savedAmount);

    /* -----------------------------------------
       INTEGRITY GUARD
       ----------------------------------------- */

    if (
        !Number.isFinite(originalPrice) ||
        !Number.isFinite(savedAmount) ||
        originalPrice <= 0 ||
        savedAmount < 0 ||
        savedAmount > originalPrice
    ) {
        return null;
    }

    /* -----------------------------------------
       SAVINGS EFFICIENCY RATIO
       ----------------------------------------- */

    const efficiencyRatio = savedAmount / originalPrice;
    const efficiencyPercent = efficiencyRatio * 100;

    /* -----------------------------------------
       CLASSIFICATION
       ----------------------------------------- */

    if (efficiencyPercent === 0) {
        return {
            key: "none",
            label: "No Savings Efficiency",
            efficiencyRatio,
            efficiencyPercent
        };
    }

    if (efficiencyPercent <= 10) {
        return {
            key: "minimal",
            label: "Minimal Savings Efficiency",
            efficiencyRatio,
            efficiencyPercent
        };
    }

    if (efficiencyPercent <= 25) {
        return {
            key: "moderate",
            label: "Moderate Savings Efficiency",
            efficiencyRatio,
            efficiencyPercent
        };
    }

    if (efficiencyPercent <= 50) {
        return {
            key: "strong",
            label: "Strong Savings Efficiency",
            efficiencyRatio,
            efficiencyPercent
        };
    }

    if (efficiencyPercent <= 75) {
        return {
            key: "very-strong",
            label: "Very Strong Savings Efficiency",
            efficiencyRatio,
            efficiencyPercent
        };
    }

    if (efficiencyPercent < 100) {
        return {
            key: "exceptional",
            label: "Exceptional Savings Efficiency",
            efficiencyRatio,
            efficiencyPercent
        };
    }

    return {
        key: "maximum",
        label: "Maximum Savings Efficiency",
        efficiencyRatio,
        efficiencyPercent
    };
}

/* =========================================
   D3.4.6.2 — SAVINGS EFFICIENCY
   INTELLIGENCE ENGINE

   Interprets the Savings Efficiency
   classification without recalculating
   discount values.
   ========================================= */

function generateSavingsEfficiencyIntelligence(
    savingsEfficiency
) {

    if (
        !savingsEfficiency ||
        typeof savingsEfficiency !== "object"
    ) {
        return {
            key: "unknown",
            message: "Savings efficiency could not be determined."
        };
    }

    const {
        key,
        efficiencyPercent
    } = savingsEfficiency;

    switch (key) {

        case "none":
            return {
                key: "none",
                message:
                    "No savings efficiency is generated because no portion of the original price is saved."
            };

        case "minimal":
            return {
                key: "minimal",
                message:
                    "Savings efficiency is limited, with only a small portion of the original price being saved."
            };

        case "moderate":
            return {
                key: "moderate",
                message:
                    "Savings efficiency is moderate, with a meaningful portion of the original price being retained as savings."
            };

        case "strong":
            return {
                key: "strong",
                message:
                    "Savings efficiency is strong, with a substantial portion of the original price being preserved as savings."
            };

        case "very-strong":
            return {
                key: "very-strong",
                message:
                    "Savings efficiency is very strong, with savings representing a major portion of the original price."
            };

        case "exceptional":
            return {
                key: "exceptional",
                message:
                    "Savings efficiency is exceptional, with most of the original price being retained as savings."
            };

        case "maximum":
            return {
                key: "maximum",
                message:
                    "Savings efficiency is maximized because the entire original price is saved."
            };

        default:
            return {
                key: "unknown",
                message:
                    Number.isFinite(efficiencyPercent)
                        ? `Savings efficiency is ${efficiencyPercent}% of the original price.`
                        : "Savings efficiency could not be determined."
            };
    }
}

/* =========================================
   D3.4.6.3 — SAVINGS EFFICIENCY RENDERER
   Renders savings-efficiency intelligence
   into the dedicated result UI container.
   ========================================= */

function renderSavingsEfficiencyIntelligence(
    savingsEfficiency,
    intelligence
) {
    const container = document.getElementById(
        "savingsEfficiencyIntelligence"
    );

    if (!container) {
        return;
    }

    if (!savingsEfficiency || !intelligence) {
        container.innerHTML = "";
        return;
    }

    const stateConfig = {
        none: {
            icon: "○",
            title: "No Savings Efficiency"
        },

        minimal: {
            icon: "◔",
            title: "Minimal Savings Efficiency"
        },

        moderate: {
            icon: "✓",
            title: "Moderate Savings Efficiency"
        },

        strong: {
            icon: "★",
            title: "Strong Savings Efficiency"
        },

        "very-strong": {
            icon: "🔥",
            title: "Very Strong Savings Efficiency"
        },

        exceptional: {
            icon: "⚡",
            title: "Exceptional Savings Efficiency"
        },

        maximum: {
            icon: "🏆",
            title: "Maximum Savings Efficiency"
        }
    };

    const state =
        stateConfig[savingsEfficiency.key] ||
        stateConfig.none;

    container.dataset.efficiency =
        savingsEfficiency.key || "none";

    container.innerHTML = `
        <div class="savings-efficiency-intelligence-card">
            <div class="savings-efficiency-intelligence-header">

                <span
                    class="savings-efficiency-intelligence-icon"
                    aria-hidden="true"
                >
                    ${state.icon}
                </span>

                <div class="savings-efficiency-intelligence-heading">
                    <span class="savings-efficiency-intelligence-eyebrow">
                        Savings Efficiency
                    </span>

                    <strong class="savings-efficiency-intelligence-title">
                        ${state.title}
                    </strong>
                </div>

                <span class="savings-efficiency-intelligence-percent">
                    ${savingsEfficiency.efficiencyPercent}%
                </span>

            </div>

            <p class="savings-efficiency-intelligence-message">
                ${intelligence.message}
            </p>
        </div>
    `;
}

/* =========================================
   D3.4.5.2 — DEAL CONTEXT INTELLIGENCE ENGINE
   Interprets the relationship between the
   amount saved and the amount paid without
   recalculating discount values.
   ========================================= */

function generateDealContextIntelligence(
    dealContext
) {

    if (
        !dealContext ||
        !dealContext.key
    ) {
        return null;
    }


    /* --------------------------------------
       NO SAVINGS
       -------------------------------------- */

    if (dealContext.key === "none") {
        return {
            key: "none",
            message:
                "There are no savings to compare with the amount paid because the full original price remains payable."
        };
    }


    /* --------------------------------------
       SAVE LESS THAN PAY
       -------------------------------------- */

    if (
        dealContext.key ===
        "save-less-than-pay"
    ) {
        return {
            key: "save-less-than-pay",
            message:
                "The savings reduce the price, but the amount you still pay is greater than the amount you save."
        };
    }


    /* --------------------------------------
       SAVE EQUALS PAY
       -------------------------------------- */

    if (
        dealContext.key ===
        "save-equals-pay"
    ) {
        return {
            key: "save-equals-pay",
            message:
                "The savings and the amount you pay are equal, creating an even split of the original price."
        };
    }


    /* --------------------------------------
       SAVE MORE THAN PAY
       -------------------------------------- */

    if (
        dealContext.key ===
        "save-more-than-pay"
    ) {
        return {
            key: "save-more-than-pay",
            message:
                "The amount you save is greater than the amount you still pay, so savings represent the larger share of the original price."
        };
    }


    /* --------------------------------------
       FULL SAVING
       -------------------------------------- */

    if (
        dealContext.key ===
        "full-saving"
    ) {
        return {
            key: "full-saving",
            message:
                "The entire original price is saved, leaving nothing to pay."
        };
    }


    /* --------------------------------------
       UNKNOWN STATE
       -------------------------------------- */

    return null;
}

/* =========================================
   D3.4.5.3 — DEAL CONTEXT INTELLIGENCE RENDERER
   Renders the relationship between the
   amount saved and the amount paid.

   Presentation only:
   - No recalculation
   - No reclassification
   - No business logic duplication
   ========================================= */

function renderDealContextIntelligence(intelligence) {

    const container =
        document.getElementById(
            "dealContextIntelligence"
        );

    if (!container) {
        return;
    }


    /* --------------------------------------
       EMPTY / INVALID INTELLIGENCE
       -------------------------------------- */

    if (
        !intelligence ||
        !intelligence.key ||
        !intelligence.message
    ) {
        container.innerHTML = "";
        container.style.display = "none";
        return;
    }


    /* --------------------------------------
       RENDER INTELLIGENCE
       -------------------------------------- */

    container.innerHTML = `
        <div class="
            deal-context-intelligence
            deal-context-${intelligence.key}
        ">

            <div class="deal-context-heading">

                <span class="deal-context-icon">
                    ⚖️
                </span>

                <span class="deal-context-title">
                    Deal Context
                </span>

            </div>

            <p class="deal-context-message">
                ${intelligence.message}
            </p>

        </div>
    `;

    container.style.display = "block";
}

function calculateDiscount() {

    /* ======================================
       VALIDATION
       ====================================== */

    const validation =
        ToolXoneValidation.validateForm(
            discountCalculator.fields
        );

    ToolXoneValidationUI.clearAllErrors();

    

    if (!validation.valid) {

        ToolXoneValidationUI.showErrors(
            validation.errors
        );

        ToolXoneValidationUI.focusFirstInvalid(
            validation.errors
        );

        return;
    }


    /* ======================================
       VALUES
       ====================================== */

    const original =
        Number(
            validation.values.originalPrice
        );

    const discount =
        Number(
            validation.values.discountPercent
        );


    /* ======================================
   D3.2 — CALCULATION ENGINE
   ====================================== */

const calculation =
    calculateDiscountValues(
        original,
        discount
    );

/* ======================================
   D3.2.7 — ENGINE INTEGRITY GUARD
   ====================================== */

if (
    !calculation ||
    !Number.isFinite(calculation.originalPrice) ||
    !Number.isFinite(calculation.discountPercent) ||
    !Number.isFinite(calculation.savedAmount) ||
    !Number.isFinite(calculation.finalPrice) ||
    !Number.isFinite(calculation.payPercent) ||
    !Number.isFinite(calculation.savePercent)
) {
    console.error(
        "Discount calculation engine returned an invalid result.",
        calculation
    );

    return;
}

const saved =
    calculation.savedAmount;

const finalPrice =
    calculation.finalPrice;

/* -----------------------------------------
   D3.4.5.1 — DEAL CONTEXT CLASSIFICATION
   ----------------------------------------- */

calculation.dealContext =
    classifyDiscountDealContext(calculation);


/* -----------------------------------------
   D3.4.5.2 — DEAL CONTEXT INTELLIGENCE
   Must run AFTER dealContext exists.
   ----------------------------------------- */

const dealContextIntelligence =
    generateDealContextIntelligence(
        calculation.dealContext
    );

renderDealContextIntelligence(
    dealContextIntelligence
);

const savingsEfficiency =
    classifySavingsEfficiency(calculation);

const savingsEfficiencyIntelligence =
    generateSavingsEfficiencyIntelligence(
        savingsEfficiency
    );    

renderSavingsEfficiencyIntelligence(
    savingsEfficiency,
    savingsEfficiencyIntelligence
);

/* -----------------------------------------
   TEMPORARY VALIDATION
   ----------------------------------------- */

console.log(
    "Deal Context:",
    calculation.dealContext
);

console.log(
    "Deal Context Intelligence:",
    dealContextIntelligence
);

console.log(
    "Savings Efficiency:",
    savingsEfficiency
);

console.log(
    "Savings Efficiency Intelligence:",
    savingsEfficiencyIntelligence
);

    /* ======================================
   D3.4.1 — DISCOUNT STRENGTH
   ====================================== */

const discountStrength = classifyDiscountStrength(discount);

renderDiscountStrength(discountStrength, discount);

/* =========================================
   D3.4.4.4 — VALUE-AWARE INTELLIGENCE
   ========================================= */

const valueAwareIntelligence =
    generateValueAwareIntelligence(
        calculation,
        discountStrength
    );

console.log(
    "Discount Strength:",
    discountStrength
);

console.log(
    "Value Signal:",
    calculation.valueSignal
);

console.log(
    "Value-Aware Intelligence:",
    valueAwareIntelligence
);

/* =========================================
   D3.4.4.6.1 — VALUE-AWARE RENDERER WIRING
   ========================================= */

renderValueAwareIntelligence(
    valueAwareIntelligence
);

/* ======================================
   D3.4.3 — ADAPTIVE INTELLIGENCE MESSAGE
   ====================================== */

const adaptiveDiscountMessage =
    generateAdaptiveDiscountMessage(
        calculation,
        discountStrength
    );

const discountStrengthMessage =
    document.getElementById(
        "discountStrengthMessage"
    );

if (discountStrengthMessage) {
    discountStrengthMessage.textContent =
        adaptiveDiscountMessage;
}
 
/* =========================================
   D3.4.4.3 — VALUE SIGNAL CONSUMER
   ========================================= */

const discountValue =
    calculation.valueSignal;


    /* ======================================
       RESULTS
       ====================================== */

    const result =
        document.getElementById(
            "discountResult"
        );

    result.classList.add(
        "active"
    );

    setDiscountResultState("success");

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


    
    /* ======================================
       VISUAL BARS
       ====================================== */

    document.getElementById(
        "discountBars"
    ).style.display =
        "block";


        
    /* ======================================
   D3.2.4 — ENGINE PERCENTAGES
   ====================================== */

const payPercent =
    calculation.payPercent;

const savePercent =
    calculation.savePercent;

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

// ======================================
// D2 — RESULT EXPERIENCE
// Bar values + accessibility
// ======================================

const safePayPercent =
    clampDiscountPercent(payPercent);

const safeSavePercent =
    clampDiscountPercent(savePercent);


// --------------------------------------
// Visible bar values
// --------------------------------------

const payBarValue =
    document.getElementById("payBarValue");

const saveBarValue =
    document.getElementById("saveBarValue");


if (payBarValue) {
    payBarValue.textContent =
        `${formatDiscountNumber(finalPrice)} · ${formatDiscountPercentCompact(safePayPercent)}`;
}

if (saveBarValue) {
    saveBarValue.textContent =
        `${formatDiscountNumber(saved)} · ${formatDiscountPercentCompact(safeSavePercent)}`;
}



// --------------------------------------
// Accessible progress information
// --------------------------------------

const payProgress =
    document.getElementById("payProgress");

const saveProgress =
    document.getElementById("saveProgress");


if (payProgress) {
    payProgress.setAttribute(
        "aria-valuenow",
        safePayPercent.toFixed(2)
    );

    payProgress.setAttribute(
        "aria-valuetext",
        `You pay ${formatDiscountNumber(finalPrice)}, which is ${safePayPercent.toFixed(2)}% of the original price.`
    );
}


if (saveProgress) {
    saveProgress.setAttribute(
        "aria-valuenow",
        safeSavePercent.toFixed(2)
    );

    saveProgress.setAttribute(
        "aria-valuetext",
        `You save ${formatDiscountNumber(saved)}, which is ${safeSavePercent.toFixed(2)}% of the original price.`
    );
}

/* ======================================
   D3.3.1 — SMART INSIGHT RENDER
   ====================================== */

const discountInsight =
    document.getElementById("discountInsight");

if (discountInsight) {
    discountInsight.innerHTML =
        generateDiscountInsight(calculation);
}

    /* ======================================
       STATISTICS
       ====================================== */

    if (
    typeof ToolXoneStatisticsEvents !== "undefined" &&
    typeof ToolXoneStatisticsEvents.recordCalculation ===
        "function"
) {
    ToolXoneStatisticsEvents.recordCalculation(
        "discount-calculator"
    );
}
}

/* =========================================
   D3 — CALCULATION INTELLIGENCE
   Money precision helper
   ========================================= */

function roundDiscountMoney(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Math.round(
        (number + Number.EPSILON) * 100
    ) / 100;
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

function formatDiscountPercentCompact(value) {
    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return "0%";
    }

    if (
        Math.abs(
            number -
            Math.round(number)
        ) < 0.000001
    ) {
        return `${Math.round(number)}%`;
    }

    if (window.ToolXoneNumberEngine) {
        return `${ToolXoneNumberEngine.format(
            number,
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        )}%`;
    }

    return `${number.toFixed(2).replace(/\.?0+$/, "")}%`;
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

    renderDiscountStrength("none", 0);
    
    const discountInsight =
    document.getElementById("discountInsight");

    /* Clear validation state */
    ToolXoneValidationUI.clearAllErrors();

    const valueAwareIntelligence =
    document.getElementById("valueAwareIntelligence");

const dealContextIntelligence =
    document.getElementById("dealContextIntelligence");

const savingsEfficiencyIntelligence =
    document.getElementById("savingsEfficiencyIntelligence");

if (valueAwareIntelligence) {
    valueAwareIntelligence.innerHTML = "";
    valueAwareIntelligence.style.display = "none";
}

if (dealContextIntelligence) {
    dealContextIntelligence.innerHTML = "";
    dealContextIntelligence.style.display = "none";
}

if (savingsEfficiencyIntelligence) {
    savingsEfficiencyIntelligence.innerHTML = "";
}

const discountStrengthMessage =
    document.getElementById("discountStrengthMessage");

if (discountStrengthMessage) {
    discountStrengthMessage.textContent = "";
}

if (discountInsight) {
    discountInsight.innerHTML = "";
}
    document.getElementById(
        "discountResult"
    ).classList.remove(
        "active"
    );

    setDiscountResultState("initial");

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


const payBarValue =
    document.getElementById("payBarValue");

const saveBarValue =
    document.getElementById("saveBarValue");

const payProgress =
    document.getElementById("payProgress");

const saveProgress =
    document.getElementById("saveProgress");


if (payBarValue) {
    payBarValue.textContent = "0.00 · 0%";
}

if (saveBarValue) {
    saveBarValue.textContent = "0.00 · 0%";
}

if (payProgress) {
    payProgress.setAttribute(
        "aria-valuenow",
        "0"
    );

    payProgress.setAttribute(
        "aria-valuetext",
        "No calculation yet."
    );
}


if (saveProgress) {
    saveProgress.setAttribute(
        "aria-valuenow",
        "0"
    );

    saveProgress.setAttribute(
        "aria-valuetext",
        "No calculation yet."
    );
}

}

/* ======================================
   LIVE VALIDATION RECOVERY
   ====================================== */

ToolXoneValidationUI.enableLiveRecovery();


/* ======================================
   ENTER KEY SUPPORT
   Works with dynamically rendered fields
   ====================================== */

document.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") {
        return;
    }

    const target = event.target;

    if (
        target &&
        (
            target.id === "originalPrice" ||
            target.id === "discountPercent"
        )
    ) {
        event.preventDefault();

        calculateDiscount();
    }
});

// ======================================
// D2.4 — INITIAL RESULT STATE
// ======================================

setDiscountResultState("initial");
setDiscountResultBusy(false);