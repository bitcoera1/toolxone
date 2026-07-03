function showMode(mode, button){
    document.querySelectorAll(".calc-section").forEach(section => {
        section.classList.remove("active");
    });

    document.querySelectorAll(".mode-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    document.getElementById("percentResult").style.display = "none";

    if(mode === "of"){
        document.getElementById("modeOf").classList.add("active");
    } else if(mode === "what"){
        document.getElementById("modeWhat").classList.add("active");
    } else {
        document.getElementById("modeChange").classList.add("active");
    }
}

function showResult(message){
    const resultBox = document.getElementById("percentResult");
    resultBox.style.display = "block";
    resultBox.innerHTML = message;
}

function formatNumber(num){
    return Number(num.toFixed(4)).toLocaleString();
}

function calculatePercentOf(){
    const percent = parseFloat(document.getElementById("percentValue").value);
    const total = parseFloat(document.getElementById("totalValue").value);

    if(isNaN(percent) || isNaN(total)){
        showResult("Please enter both values.");
        return;
    }

    const result = (percent / 100) * total;

    showResult(
        percent + "% of " + total + " =<br>" +
        "📌 " + formatNumber(result)
    );
}

function calculateWhatPercent(){
    const part = parseFloat(document.getElementById("partValue").value);
    const whole = parseFloat(document.getElementById("wholeValue").value);

    if(isNaN(part) || isNaN(whole)){
        showResult("Please enter both values.");
        return;
    }

    if(whole === 0){
        showResult("Total value cannot be zero.");
        return;
    }

    const result = (part / whole) * 100;

    showResult(
        part + " is what percent of " + whole + "?<br>" +
        "📌 " + formatNumber(result) + "%"
    );
}

function calculateChange(){
    const oldValue = parseFloat(document.getElementById("oldValue").value);
    const newValue = parseFloat(document.getElementById("newValue").value);

    if(isNaN(oldValue) || isNaN(newValue)){
        showResult("Please enter both values.");
        return;
    }

    if(oldValue === 0){
        showResult("Old value cannot be zero.");
        return;
    }

    const change = ((newValue - oldValue) / oldValue) * 100;
    const type = change >= 0 ? "Increase" : "Decrease";

    showResult(
        "From " + oldValue + " to " + newValue + "<br>" +
        "📌 " + formatNumber(Math.abs(change)) + "% " + type
    );
}

function resetPercentage(){

    document.getElementById("percentValue").value = "";
    document.getElementById("totalValue").value = "";

    document.getElementById("partValue").value = "";
    document.getElementById("wholeValue").value = "";

    document.getElementById("oldValue").value = "";
    document.getElementById("newValue").value = "";

    const resultBox = document.getElementById("percentResult");

    resultBox.style.display = "none";
    resultBox.innerHTML = "";
}