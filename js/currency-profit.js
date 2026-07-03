// ======================================
// TOOLXONE CURRENCY EXCHANGE PROFIT CALCULATOR
// ======================================

function calculateCurrencyProfit() {

    const amount = parseFloat(document.getElementById("currencyAmount").value);
    const buyRate = parseFloat(document.getElementById("buyRate").value);
    const sellRate = parseFloat(document.getElementById("sellRate").value);
    const fee = parseFloat(document.getElementById("exchangeFee").value) || 0;

    if (
        isNaN(amount) || isNaN(buyRate) || isNaN(sellRate) ||
        amount <= 0 || buyRate <= 0 || sellRate <= 0 || fee < 0
    ) {
        alert("Please enter valid values.");
        return;
    }

    const buyingCost = amount * buyRate;
    const sellingValue = amount * sellRate;
    const grossProfit = sellingValue - buyingCost;
    const netProfit = grossProfit - fee;
    const profitPercent = (netProfit / buyingCost) * 100;

    const result = document.getElementById("currencyProfitResult");

    result.classList.add("active");

    result.innerHTML = `
        <div class="result-line">
            <span>Buying Cost</span>
            <strong>${buyingCost.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Selling Value</span>
            <strong>${sellingValue.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Gross Profit</span>
            <strong>${grossProfit.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Exchange Fee</span>
            <strong>${fee.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Net Profit</span>
            <strong>${netProfit.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
        </div>

        <div class="result-line">
            <span>Profit %</span>
            <strong>${profitPercent.toFixed(2)}%</strong>
        </div>

        <div class="result-line">
            <span>ToolXone Insight</span>
            <strong>${sellRate > buyRate ? "📈 Profitable Exchange" : "📉 No Profit"}</strong>
        </div>
    `;

    document.getElementById("currencyProfitBars").style.display = "block";

    const buyPercent = (buyingCost / sellingValue) * 100;
    const profitBar = Math.max((netProfit / sellingValue) * 100, 0);

    document.getElementById("buyBar").style.width = buyPercent + "%";
    document.getElementById("profitBar").style.width = profitBar + "%";
}

function resetCurrencyProfit() {

    document.getElementById("currencyAmount").value = "";
    document.getElementById("buyRate").value = "";
    document.getElementById("sellRate").value = "";
    document.getElementById("exchangeFee").value = "";

    document.getElementById("currencyProfitResult").classList.remove("active");
    document.getElementById("currencyProfitResult").innerHTML =
        "<p>Your exchange summary will appear here.</p>";

    document.getElementById("currencyProfitBars").style.display = "none";

    document.getElementById("buyBar").style.width = "0%";
    document.getElementById("profitBar").style.width = "0%";
}