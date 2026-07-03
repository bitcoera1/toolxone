// ======================================
// TOOLXONE MORTGAGE CALCULATOR PRO
// Framework-Ready Version
// ======================================

function getMortgageInputValues() {
    return {
        loan: Number(document.getElementById("loanAmount").value),
        annualRate: Number(document.getElementById("interestRate").value),
        years: Number(document.getElementById("loanYears").value)
    };
}

function calculateMortgageValues(data) {
    const monthlyRate = data.annualRate / 100 / 12;
    const payments = data.years * 12;

    let monthlyPayment;

    if (monthlyRate === 0) {
        monthlyPayment = data.loan / payments;
    } else {
        monthlyPayment =
            data.loan *
            (monthlyRate * Math.pow(1 + monthlyRate, payments)) /
            (Math.pow(1 + monthlyRate, payments) - 1);
    }

    const totalPayment = monthlyPayment * payments;
    const totalInterest = totalPayment - data.loan;

    return {
        loan: data.loan,
        monthlyPayment,
        totalInterest,
        totalPayment,
        payments
    };
}

function renderMortgageSummary(resultData) {
    const result = document.getElementById("mortgageResult");

    result.classList.add("active");

    result.innerHTML = `
        <div class="result-line">
            <span>Loan Amount</span>
            <strong>${resultData.loan.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Monthly Payment</span>
            <strong>${resultData.monthlyPayment.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Total Interest</span>
            <strong>${resultData.totalInterest.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Total Payment</span>
            <strong>${resultData.totalPayment.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Total Payments</span>
            <strong>${resultData.payments}</strong>
        </div>
    `;
}

function updateMortgageBars(resultData) {
    document.getElementById("mortgageBars").style.display = "block";

    const principalPercent = (resultData.loan / resultData.totalPayment) * 100;
    const interestPercent = (resultData.totalInterest / resultData.totalPayment) * 100;

    document.getElementById("principalBar").style.width = principalPercent + "%";
    document.getElementById("interestBar").style.width = interestPercent + "%";
}

function runMortgageCalculator() {
    const data = getMortgageInputValues();

    if (
    isNaN(data.loan) ||
    isNaN(data.annualRate) ||
    isNaN(data.years) ||
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

    const resultData = calculateMortgageValues(data);

    clearMortgageMessage();
    
    renderMortgageSummary(resultData);
    updateMortgageBars(resultData);
}

function calculateMortgage() {
    runMortgageCalculator();
}

function resetMortgage() {
    document.getElementById("loanAmount").value = "";
    document.getElementById("interestRate").value = "";
    document.getElementById("loanYears").value = "";

    document.getElementById("mortgageResult").classList.remove("active");

    document.getElementById("mortgageResult").innerHTML =
        "<p>Your mortgage summary will appear here.</p>";

    document.getElementById("mortgageBars").style.display = "none";

    document.getElementById("principalBar").style.width = "0%";
    document.getElementById("interestBar").style.width = "0%";
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        runMortgageCalculator();
    }
});
function showMortgageMessage(message, type){

    const box = document.getElementById("mortgageMessage");

    box.className = "calculator-message " + type;
    box.textContent = message;

}

function clearMortgageMessage(){

    const box = document.getElementById("mortgageMessage");

    box.className = "calculator-message";
    box.textContent = "";

}