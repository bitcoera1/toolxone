// ======================================
// TOOLERS LOAN / EMI CALCULATOR PRO
// ======================================

function calculateLoan() {

    const amount = parseFloat(document.getElementById("loanAmount").value);

    const annualRate = parseFloat(document.getElementById("interestRate").value);

    let duration = parseFloat(document.getElementById("loanTenure").value);

    const tenureType = document.getElementById("tenureType").value;

    if (!amount || !annualRate || !duration) {
        alert("Please fill all fields.");
        return;
    }

    // Convert years to months
    if (tenureType === "years") {
        duration *= 12;
    }

    const monthlyRate = annualRate / 12 / 100;

    const emi =
        (amount * monthlyRate * Math.pow(1 + monthlyRate, duration)) /
        (Math.pow(1 + monthlyRate, duration) - 1);

    const totalPayment = emi * duration;

    const totalInterest = totalPayment - amount;

    const result = document.getElementById("loanResult");

    result.classList.add("active");

    result.innerHTML = `
        <div class="result-line">
            <span>Monthly EMI</span>
            <strong>${emi.toFixed(2)}</strong>
        </div>

        <div class="result-line">
            <span>Total Interest</span>
            <strong>${totalInterest.toFixed(2)}</strong>
        </div>

        <div class="result-line">
            <span>Total Payment</span>
            <strong>${totalPayment.toFixed(2)}</strong>
        </div>
    `;

    document.getElementById("loanBars").style.display = "block";

    const principalPercent = (amount / totalPayment) * 100;

    const interestPercent = (totalInterest / totalPayment) * 100;

    document.getElementById("principalBar").style.width =
        principalPercent + "%";

    document.getElementById("interestBar").style.width =
        interestPercent + "%";
}

function resetLoan() {

    document.getElementById("loanAmount").value = "";

    document.getElementById("interestRate").value = "";

    document.getElementById("loanTenure").value = "";

    document.getElementById("tenureType").value = "years";

    document.getElementById("loanResult").classList.remove("active");

    document.getElementById("loanResult").innerHTML =
        "<p>Your loan summary will appear here.</p>";

    document.getElementById("loanBars").style.display = "none";

    document.getElementById("principalBar").style.width = "0%";

    document.getElementById("interestBar").style.width = "0%";
}

// Press Enter to calculate
document.querySelectorAll("input").forEach(input => {

    input.addEventListener("keydown", function(e){

        if(e.key === "Enter"){

            calculateLoan();

        }

    });

});