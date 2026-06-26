// ======================================
// TOOLERS INFLATION CALCULATOR PRO
// ======================================

function calculateInflation() {

    const current = parseFloat(document.getElementById("currentAmount").value);
    const rate = parseFloat(document.getElementById("inflationRate").value);
    const years = parseFloat(document.getElementById("years").value);

    if (isNaN(current) || isNaN(rate) || isNaN(years) ||
        current <= 0 || rate < 0 || years <= 0) {

        alert("Please enter valid values.");
        return;
    }

    const futureValue = current * Math.pow(1 + rate / 100, years);
    const increase = futureValue - current;
    const purchasingPower = current / Math.pow(1 + rate / 100, years);

    const result = document.getElementById("inflationResult");

    result.classList.add("active");

    result.innerHTML = `
        <div class="result-line">
            <span>Current Amount</span>
            <strong>${current.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Future Value</span>
            <strong>${futureValue.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Total Increase</span>
            <strong>${increase.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Today's Purchasing Power</span>
            <strong>${purchasingPower.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Inflation Period</span>
            <strong>${years} Years</strong>
        </div>
    `;

    document.getElementById("inflationBars").style.display = "block";

    const originalPercent = (current / futureValue) * 100;
    const increasePercent = (increase / futureValue) * 100;

    document.getElementById("originalBar").style.width = originalPercent + "%";
    document.getElementById("increaseBar").style.width = increasePercent + "%";
}

function resetInflation() {

    document.getElementById("currentAmount").value = "";
    document.getElementById("inflationRate").value = "";
    document.getElementById("years").value = "";

    document.getElementById("inflationResult").classList.remove("active");

    document.getElementById("inflationResult").innerHTML =
        "<p>Your inflation summary will appear here.</p>";

    document.getElementById("inflationBars").style.display = "none";

    document.getElementById("originalBar").style.width = "0%";
    document.getElementById("increaseBar").style.width = "0%";
}

document.querySelectorAll("input").forEach(input => {

    input.addEventListener("keydown", function(e){

        if(e.key === "Enter"){
            calculateInflation();
        }

    });

});