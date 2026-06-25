// ======================================
// TOOLERS ROI CALCULATOR PRO
// ======================================

function calculateROI() {

    const investment = parseFloat(document.getElementById("investment").value);
    const returnAmount = parseFloat(document.getElementById("returnAmount").value);

    if (!investment || !returnAmount || investment <= 0) {
        alert("Please enter valid investment and return values.");
        return;
    }

    const profit = returnAmount - investment;
    const roi = (profit / investment) * 100;

    const result = document.getElementById("roiResult");

    result.classList.add("active");

    result.innerHTML = `
        <div class="result-line">
            <span>Investment</span>
            <strong>${investment.toLocaleString(undefined,{
                minimumFractionDigits:2,
                maximumFractionDigits:2
            })}</strong>
        </div>

        <div class="result-line">
            <span>Final Return</span>
            <strong>${returnAmount.toLocaleString(undefined,{
                minimumFractionDigits:2,
                maximumFractionDigits:2
            })}</strong>
        </div>

        <div class="result-line">
            <span>Profit</span>
            <strong>${profit.toLocaleString(undefined,{
                minimumFractionDigits:2,
                maximumFractionDigits:2
            })}</strong>
        </div>

        <div class="result-line">
            <span>ROI</span>
            <strong>${roi.toFixed(2)}%</strong>
        </div>
    `;

    document.getElementById("roiBars").style.display = "block";

    const investmentPercent = (investment / returnAmount) * 100;
    const profitPercent = (profit / returnAmount) * 100;

    document.getElementById("investmentBar").style.width = investmentPercent + "%";
    document.getElementById("profitBar").style.width = profitPercent + "%";
}

function resetROI() {

    document.getElementById("investment").value = "";
    document.getElementById("returnAmount").value = "";

    document.getElementById("roiResult").classList.remove("active");

    document.getElementById("roiResult").innerHTML =
        "<p>Your ROI summary will appear here.</p>";

    document.getElementById("roiBars").style.display = "none";

    document.getElementById("investmentBar").style.width = "0%";
    document.getElementById("profitBar").style.width = "0%";
}

// Calculate using Enter key
document.querySelectorAll("input").forEach(input => {

    input.addEventListener("keydown", function(e){

        if(e.key === "Enter"){
            calculateROI();
        }

    });

});