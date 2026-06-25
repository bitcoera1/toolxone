// ======================================
// TOOLERS SAVINGS GOAL CALCULATOR PRO
// ======================================

function calculateSavings() {

    const target = parseFloat(document.getElementById("targetAmount").value);
    const current = parseFloat(document.getElementById("currentSavings").value);
    const months = parseFloat(document.getElementById("months").value);

    if (isNaN(target) || isNaN(current) || isNaN(months) ||
        target <= 0 || current < 0 || months <= 0) {

        alert("Please enter valid values.");
        return;
    }

    const remaining = Math.max(target - current, 0);
    const monthly = remaining / months;
    const weekly = monthly / 4.345;
    const daily = monthly / 30.44;

    const progress = Math.min((current / target) * 100, 100);

    const result = document.getElementById("savingsResult");

    result.classList.add("active");

    result.innerHTML = `
        <div class="result-line">
            <span>Target Amount</span>
            <strong>${target.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Current Savings</span>
            <strong>${current.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Remaining Amount</span>
            <strong>${remaining.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Monthly Saving Needed</span>
            <strong>${monthly.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Weekly Saving Needed</span>
            <strong>${weekly.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Daily Saving Needed</span>
            <strong>${daily.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Goal Completed</span>
            <strong>${progress.toFixed(1)}%</strong>
        </div>
    `;

    document.getElementById("savingsBars").style.display = "block";

    document.getElementById("currentBar").style.width = progress + "%";
    document.getElementById("remainingBar").style.width = (100 - progress) + "%";
}

function resetSavings() {

    document.getElementById("targetAmount").value = "";
    document.getElementById("currentSavings").value = "";
    document.getElementById("months").value = "";

    document.getElementById("savingsResult").classList.remove("active");
    document.getElementById("savingsResult").innerHTML =
        "<p>Your savings summary will appear here.</p>";

    document.getElementById("savingsBars").style.display = "none";

    document.getElementById("currentBar").style.width = "0%";
    document.getElementById("remainingBar").style.width = "0%";
}

document.querySelectorAll("input").forEach(input => {

    input.addEventListener("keydown", function(e){

        if(e.key === "Enter"){
            calculateSavings();
        }

    });

});