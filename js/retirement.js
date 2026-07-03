// ======================================
// TOOLXONE RETIREMENT CALCULATOR PRO
// ======================================

function calculateRetirement() {

    const currentAge = parseFloat(document.getElementById("currentAge").value);
    const retirementAge = parseFloat(document.getElementById("retirementAge").value);
    const currentSavings = parseFloat(document.getElementById("currentSavings").value);
    const monthlyContribution = parseFloat(document.getElementById("monthlyContribution").value);
    const annualReturn = parseFloat(document.getElementById("annualReturn").value);

    if (
        isNaN(currentAge) ||
        isNaN(retirementAge) ||
        isNaN(currentSavings) ||
        isNaN(monthlyContribution) ||
        isNaN(annualReturn) ||
        retirementAge <= currentAge ||
        currentSavings < 0 ||
        monthlyContribution < 0 ||
        annualReturn < 0
    ) {
        alert("Please enter valid values.");
        return;
    }

    const years = retirementAge - currentAge;
    const months = years * 12;
    const monthlyRate = annualReturn / 100 / 12;

    // Future value of current savings
    const futureCurrentSavings =
        currentSavings * Math.pow(1 + monthlyRate, months);

    // Future value of monthly contributions
    let futureContributions = 0;

    if (monthlyRate === 0) {
        futureContributions = monthlyContribution * months;
    } else {
        futureContributions =
            monthlyContribution *
            ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }

    const futureFund = futureCurrentSavings + futureContributions;
    const totalContributions =
        currentSavings + (monthlyContribution * months);

    const investmentGrowth =
        futureFund - totalContributions;

    // 4% retirement withdrawal rule
    const estimatedMonthlyIncome =
        (futureFund * 0.04) / 12;

    const result = document.getElementById("retirementResult");

    result.classList.add("active");

    result.innerHTML = `
        <div class="result-line">
            <span>Years Remaining</span>
            <strong>${years} Years</strong>
        </div>

        <div class="result-line">
            <span>Future Retirement Fund</span>
            <strong>${futureFund.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Total Contributions</span>
            <strong>${totalContributions.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Investment Growth</span>
            <strong>${investmentGrowth.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Estimated Monthly Retirement Income</span>
            <strong>${estimatedMonthlyIncome.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>ToolXone Insight</span>
            <strong>💡 Starting early helps compound growth work for you.</strong>
        </div>
    `;

    document.getElementById("retirementBars").style.display = "block";

    const contributionPercent =
        (totalContributions / futureFund) * 100;

    const growthPercent =
        (investmentGrowth / futureFund) * 100;

    document.getElementById("contributionBar").style.width =
        contributionPercent + "%";

    document.getElementById("growthBar").style.width =
        growthPercent + "%";
}

function resetRetirement() {

    document.getElementById("currentAge").value = "";
    document.getElementById("retirementAge").value = "";
    document.getElementById("currentSavings").value = "";
    document.getElementById("monthlyContribution").value = "";
    document.getElementById("annualReturn").value = "";

    document.getElementById("retirementResult").classList.remove("active");

    document.getElementById("retirementResult").innerHTML =
        "<p>Your retirement summary will appear here.</p>";

    document.getElementById("retirementBars").style.display = "none";

    document.getElementById("contributionBar").style.width = "0%";
    document.getElementById("growthBar").style.width = "0%";
}

document.querySelectorAll("input").forEach(input => {

    input.addEventListener("keydown", function(e){

        if(e.key === "Enter"){
            calculateRetirement();
        }

    });

});
function runRetirementCalculator() {
    calculateRetirement();
}