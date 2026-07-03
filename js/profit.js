// ======================================
// TOOLXONE PROFIT MARGIN CALCULATOR PRO
// ======================================

function calculateProfit() {

    const cost = parseFloat(document.getElementById("costPrice").value);
    const selling = parseFloat(document.getElementById("sellingPrice").value);

    if (!cost || !selling || selling <= 0 || cost < 0) {
        alert("Please enter valid cost and selling prices.");
        return;
    }

    const profit = selling - cost;
    const margin = (profit / selling) * 100;
    const markup = (profit / cost) * 100;

    const result = document.getElementById("profitResult");

    result.classList.add("active");

    result.innerHTML = `
        <div class="result-line">
            <span>Cost Price</span>
            <strong>${cost.toLocaleString(undefined,{
                minimumFractionDigits:2,
                maximumFractionDigits:2
            })}</strong>
        </div>

        <div class="result-line">
            <span>Selling Price</span>
            <strong>${selling.toLocaleString(undefined,{
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
            <span>Profit Margin</span>
            <strong>${margin.toFixed(2)}%</strong>
        </div>

        <div class="result-line">
            <span>Markup</span>
            <strong>${markup.toFixed(2)}%</strong>
        </div>
    `;

    document.getElementById("profitBars").style.display = "block";

    const costPercent = (cost / selling) * 100;
    const profitPercent = (profit / selling) * 100;

    document.getElementById("costBar").style.width = costPercent + "%";
    document.getElementById("profitBar").style.width = profitPercent + "%";
}

function resetProfit() {

    document.getElementById("costPrice").value = "";
    document.getElementById("sellingPrice").value = "";

    document.getElementById("profitResult").classList.remove("active");

    document.getElementById("profitResult").innerHTML =
        "<p>Your profit summary will appear here.</p>";

    document.getElementById("profitBars").style.display = "none";

    document.getElementById("costBar").style.width = "0%";
    document.getElementById("profitBar").style.width = "0%";
}