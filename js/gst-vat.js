// ======================================
// TOOLERS GST / VAT CALCULATOR PRO
// ======================================

function calculateTax() {

    const amount = parseFloat(document.getElementById("amount").value);
    const rate = parseFloat(document.getElementById("taxRate").value);
    const type = document.getElementById("taxType").value;

    if (!amount || isNaN(rate) || rate < 0) {
        alert("Please enter a valid amount and tax rate.");
        return;
    }

    let basePrice, taxAmount, finalPrice;

    if (type === "add") {

        // Add GST/VAT
        basePrice = amount;
        taxAmount = amount * (rate / 100);
        finalPrice = basePrice + taxAmount;

    } else {

        // Remove GST/VAT
        finalPrice = amount;
        basePrice = amount / (1 + rate / 100);
        taxAmount = finalPrice - basePrice;

    }

    const result = document.getElementById("taxResult");

    result.classList.add("active");

    result.innerHTML = `
        <div class="result-line">
            <span>Base Price</span>
            <strong>${basePrice.toLocaleString(undefined,{
                minimumFractionDigits:2,
                maximumFractionDigits:2
            })}</strong>
        </div>

        <div class="result-line">
            <span>Tax Amount</span>
            <strong>${taxAmount.toLocaleString(undefined,{
                minimumFractionDigits:2,
                maximumFractionDigits:2
            })}</strong>
        </div>

        <div class="result-line">
            <span>Final Price</span>
            <strong>${finalPrice.toLocaleString(undefined,{
                minimumFractionDigits:2,
                maximumFractionDigits:2
            })}</strong>
        </div>

        <div class="result-line">
            <span>Tax Rate</span>
            <strong>${rate.toFixed(2)}%</strong>
        </div>
    `;

    document.getElementById("taxBars").style.display = "block";

    const basePercent = (basePrice / finalPrice) * 100;
    const taxPercent = (taxAmount / finalPrice) * 100;

    document.getElementById("baseBar").style.width = basePercent + "%";
    document.getElementById("taxBar").style.width = taxPercent + "%";
}

function resetTax() {

    document.getElementById("amount").value = "";
    document.getElementById("taxRate").value = "";
    document.getElementById("taxType").value = "add";

    document.getElementById("taxResult").classList.remove("active");
    document.getElementById("taxResult").innerHTML =
        "<p>Your GST / VAT summary will appear here.</p>";

    document.getElementById("taxBars").style.display = "none";

    document.getElementById("baseBar").style.width = "0%";
    document.getElementById("taxBar").style.width = "0%";
}

// Calculate with Enter key
document.querySelectorAll("input").forEach(input => {

    input.addEventListener("keydown", function(e){

        if(e.key === "Enter"){
            calculateTax();
        }

    });

});
document.getElementById("taxType").addEventListener("change", () => {
    if (document.getElementById("amount").value !== "") {
        calculateTax();
    }
});

document.getElementById("taxRate").addEventListener("input", () => {
    if (document.getElementById("amount").value !== "") {
        calculateTax();
    }
});
document.getElementById("amount").addEventListener("input", () => {
    if (document.getElementById("taxRate").value !== "") {
        calculateTax();
    }
});