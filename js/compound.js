// ======================================
// TOOLXONE COMPOUND INTEREST CALCULATOR
// ======================================

function calculateCompound() {

    const principal = parseFloat(document.getElementById("principal").value);
    const monthly = parseFloat(document.getElementById("monthly").value) || 0;
    const annualRate = parseFloat(document.getElementById("rate").value);
    const years = parseFloat(document.getElementById("years").value);
    const frequency = parseInt(document.getElementById("frequency").value);

    if (!principal || !annualRate || !years) {
        alert("Please fill all required fields.");
        return;
    }

    const r = annualRate / 100;

    let balance = principal;
    const totalMonths = years * 12;

    // Simulate month-by-month growth
    for (let month = 1; month <= totalMonths; month++) {

        balance += monthly;

        const monthlyRate = r / frequency;

        balance *= Math.pow(1 + monthlyRate, frequency / 12);
    }

    const totalContribution = principal + (monthly * totalMonths);

    const interestEarned = balance - totalContribution;

    const growthPercent = (interestEarned / totalContribution) * 100;

    const result = document.getElementById("compoundResult");

    result.classList.add("active");

    result.innerHTML = `
        <div class="result-line">
            <span>Future Value</span>
            <strong>${balance.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Total Contributions</span>
            <strong>${totalContribution.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Interest Earned</span>
            <strong>${interestEarned.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Growth</span>
            <strong>${growthPercent.toFixed(2)}%</strong>
        </div>
    `;

    document.getElementById("growthBars").style.display = "block";

    const investmentPercent = (totalContribution / balance) * 100;
    const interestPercent = (interestEarned / balance) * 100;

    document.getElementById("investmentBar").style.width =
        investmentPercent + "%";

    document.getElementById("interestBar").style.width =
        interestPercent + "%";
}

function resetCompound() {

    document.getElementById("principal").value = "";
    document.getElementById("monthly").value = "";
    document.getElementById("rate").value = "";
    document.getElementById("years").value = "";
    document.getElementById("frequency").value = "12";

    document.getElementById("compoundResult").classList.remove("active");
    document.getElementById("compoundResult").innerHTML =
        "<p>Your investment summary will appear here.</p>";

    document.getElementById("growthBars").style.display = "none";

    document.getElementById("investmentBar").style.width = "0%";
    document.getElementById("interestBar").style.width = "0%";
}

// Enter key support
document.querySelectorAll("input").forEach(input => {

    input.addEventListener("keydown", function(e){

        if(e.key === "Enter"){
            calculateCompound();
        }

    });

});

function runCompoundCalculator() {
    calculateCompound();
}