function convertWeight() {
    const value = parseFloat(document.getElementById("value").value);
    const conversion = document.getElementById("conversion").value;
    const resultBox = document.getElementById("result");

    if (isNaN(value)) {
        resultBox.textContent = "Please enter a value.";
        return;
    }

    if (conversion === "kgToLb") {
        resultBox.textContent = value + " kg = " + (value * 2.20462).toFixed(2) + " lbs";
    } else {
        resultBox.textContent = value + " lbs = " + (value / 2.20462).toFixed(2) + " kg";
    }
}