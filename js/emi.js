// ======================================
// TOOLERS EMI CALCULATOR PRO
// ======================================

function calculateEMI() {

    const loan = parseFloat(document.getElementById("loanAmount").value);
    const annualRate = parseFloat(document.getElementById("interestRate").value);
    const years = parseFloat(document.getElementById("loanYears").value);

    if (isNaN(loan) || isNaN(annualRate) || isNaN(years) ||
        loan <= 0 || annualRate < 0 || years <= 0) {

        alert("Please enter valid values.");
        return;
    }

    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;

    let emi;

    if (monthlyRate === 0) {
        emi = loan / months;
    } else {
        emi =
            loan *
            (monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayment = emi * months;
    const totalInterest = totalPayment - loan;

    const result = document.getElementById("emiResult");

    result.classList.add("active");

    result.innerHTML = `
        <div class="result-line">
            <span>Loan Amount</span>
            <strong>${loan.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Monthly EMI</span>
            <strong>${emi.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
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
            <span>Loan Tenure</span>
            <strong>${months} Months</strong>
        </div>
    `;

    document.getElementById("emiBars").style.display = "block";

    const principalPercent = (loan / totalPayment) * 100;
    const interestPercent = (totalInterest / totalPayment) * 100;

    document.getElementById("principalBar").style.width = principalPercent + "%";
    document.getElementById("interestBar").style.width = interestPercent + "%";
}

function resetEMI() {

    document.getElementById("loanAmount").value = "";
    document.getElementById("interestRate").value = "";
    document.getElementById("loanYears").value = "";

    document.getElementById("emiResult").classList.remove("active");
    document.getElementById("emiResult").innerHTML =
        "<p>Your EMI summary will appear here.</p>";

    document.getElementById("emiBars").style.display = "none";

    document.getElementById("principalBar").style.width = "0%";
    document.getElementById("interestBar").style.width = "0%";
}

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("keydown", function(e){
        if(e.key === "Enter"){
            calculateEMI();
        }
    });
});