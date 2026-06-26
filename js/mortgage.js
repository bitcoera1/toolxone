// ======================================
// TOOLERS MORTGAGE CALCULATOR PRO
// ======================================

function calculateMortgage() {

    const loan = parseFloat(document.getElementById("loanAmount").value);
    const annualRate = parseFloat(document.getElementById("interestRate").value);
    const years = parseFloat(document.getElementById("loanYears").value);

    if (isNaN(loan) || isNaN(annualRate) || isNaN(years) ||
        loan <= 0 || annualRate < 0 || years <= 0) {

        alert("Please enter valid values.");
        return;
    }

    const monthlyRate = annualRate / 100 / 12;
    const payments = years * 12;

    let monthlyPayment;

    if (monthlyRate === 0) {

        monthlyPayment = loan / payments;

    } else {

        monthlyPayment =
            loan *
            (monthlyRate * Math.pow(1 + monthlyRate, payments)) /
            (Math.pow(1 + monthlyRate, payments) - 1);

    }

    const totalPayment = monthlyPayment * payments;
    const totalInterest = totalPayment - loan;

    const result = document.getElementById("mortgageResult");

    result.classList.add("active");

    result.innerHTML = `
        <div class="result-line">
            <span>Loan Amount</span>
            <strong>${loan.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Monthly Payment</span>
            <strong>${monthlyPayment.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Total Interest</span>
            <strong>${totalInterest.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Total Payment</span>
            <strong>${totalPayment.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Total Payments</span>
            <strong>${payments}</strong>
        </div>
    `;

    document.getElementById("mortgageBars").style.display = "block";

    const principalPercent = (loan / totalPayment) * 100;
    const interestPercent = (totalInterest / totalPayment) * 100;

    document.getElementById("principalBar").style.width =
        principalPercent + "%";

    document.getElementById("interestBar").style.width =
        interestPercent + "%";
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

document.querySelectorAll("input").forEach(input => {

    input.addEventListener("keydown", function(e){

        if(e.key === "Enter"){
            calculateMortgage();
        }

    });

});