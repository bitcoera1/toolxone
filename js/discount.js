// ======================================
// TOOLXONE DISCOUNT CALCULATOR PRO
// ======================================

function calculateDiscount() {

    const original = parseFloat(document.getElementById("originalPrice").value);
    const discount = parseFloat(document.getElementById("discountPercent").value);

    if (!original || isNaN(discount) || discount < 0 || discount > 100) {
        alert("Please enter a valid price and discount percentage.");
        return;
    }

    const saved = original * (discount / 100);
    const finalPrice = original - saved;

    const result = document.getElementById("discountResult");

    result.classList.add("active");

    result.innerHTML = `
        <div class="result-line">
            <span>Original Price</span>
            <strong>${original.toLocaleString(undefined,{
                minimumFractionDigits:2,
                maximumFractionDigits:2
            })}</strong>
        </div>

        <div class="result-line">
            <span>You Save</span>
            <strong>${saved.toLocaleString(undefined,{
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
            <span>Discount</span>
            <strong>${discount.toFixed(2)}%</strong>
        </div>
    `;

    document.getElementById("discountBars").style.display = "block";

    const payPercent = (finalPrice / original) * 100;
    const savePercent = (saved / original) * 100;

    document.getElementById("payBar").style.width = payPercent + "%";
    document.getElementById("saveBar").style.width = savePercent + "%";
}

function resetDiscount() {

    document.getElementById("originalPrice").value = "";
    document.getElementById("discountPercent").value = "";

    document.getElementById("discountResult").classList.remove("active");
    document.getElementById("discountResult").innerHTML =
        "<p>Your discount summary will appear here.</p>";

    document.getElementById("discountBars").style.display = "none";

    document.getElementById("payBar").style.width = "0%";
    document.getElementById("saveBar").style.width = "0%";
}