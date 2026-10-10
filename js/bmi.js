let currentUnit = "metric";
let bmiAnimationTimer = null;

document.addEventListener("DOMContentLoaded", function () {
    const metricBtn = document.getElementById("metricBtn");
    const imperialBtn = document.getElementById("imperialBtn");
    const metricInputs = document.querySelectorAll(".metric-inputs");
    const imperialInputs = document.querySelector(".imperial-inputs");

    metricBtn.addEventListener("click", function () {
        currentUnit = "metric";

        metricBtn.classList.add("active");
        imperialBtn.classList.remove("active");

        metricInputs.forEach(input => {
            input.style.display = "block";
        });

        imperialInputs.style.display = "none";
        resetBMI();
    });

    imperialBtn.addEventListener("click", function () {
        currentUnit = "imperial";

        imperialBtn.classList.add("active");
        metricBtn.classList.remove("active");

        metricInputs.forEach(input => {
            input.style.display = "none";
        });

        imperialInputs.style.display = "block";
        resetBMI();
    });

document.getElementById("calculateBMI").addEventListener("click", calculateBMI);
document.getElementById("resetBMI").addEventListener("click", resetBMI);

});

// Enter key support
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        calculateBMI();
    }
});

console.log("BMI JS Loaded Successfully!");

function calculateBMI() {
    let bmi;

    if (currentUnit === "metric") {
        const height = parseFloat(document.getElementById("heightCm").value);
        const weight = parseFloat(document.getElementById("weightKg").value);

        if (
    !Number.isFinite(height) ||
    !Number.isFinite(weight) ||
    height <= 0 ||
    weight <= 0
) {
    alert("Please enter valid height and weight values.");
    return;
}

        const heightMeters = height / 100;
        const denominator = Math.pow(heightMeters, 2);
        if (
            !Number.isFinite(heightMeters) || heightMeters <= 0 ||
            !Number.isFinite(denominator) || denominator <= 0
        ) {
            alert("Please enter valid height and weight values.");
            return;
        }

        bmi = weight / denominator;
    } else {
        const feetInput = document.getElementById("heightFt").value.trim();
const inchesInput = document.getElementById("heightIn").value.trim();
const weightInput = document.getElementById("weightLb").value.trim();

const feet = parseFloat(feetInput);
const inches = parseFloat(inchesInput);
const weightLb = parseFloat(weightInput);

// Reject missing or non-numeric values
if (
    feetInput === "" ||
    inchesInput === "" ||
    weightInput === "" ||
    !Number.isFinite(feet) ||
    !Number.isFinite(inches) ||
    !Number.isFinite(weightLb)
) {
    alert("Please enter your height and weight.");
    return;
}

// Reject negative/zero measurements and invalid inch values
if (
    feet < 0 ||
    inches < 0 ||
    inches >= 12 ||
    weightLb <= 0
) {
    alert("Please enter valid height and weight values.");
    return;
}

const totalInches = (feet * 12) + inches;

// Total height must be greater than zero
if (totalInches <= 0) {
    alert("Please enter valid height and weight values.");
    return;
}

const denominator = Math.pow(totalInches, 2);
if (
    !Number.isFinite(totalInches) || totalInches <= 0 ||
    !Number.isFinite(denominator) || denominator <= 0
) {
    alert("Please enter valid height and weight values.");
    return;
}

bmi = (weightLb / denominator) * 703;
    }

    // A positive animation increment must remain representable as well.
    if (!Number.isFinite(bmi) || bmi <= 0 || bmi / 40 <= 0) {
        alert("Please enter valid height and weight values.");
        return;
    }

    animateBMI(bmi);
    moveBMIMarker(bmi);

    let category = "";
    let advice = "";

    if (bmi < 18.5) {
    category = "🔵 Underweight";
    advice = "This BMI falls within the underweight range for adults. BMI is a screening measure and does not assess overall health.";
} else if (bmi < 25) {
    category = "🟢 Healthy Weight Range";
    advice = "This BMI falls within the healthy weight range for adults. BMI is a screening measure and does not assess overall health.";
} else if (bmi < 30) {
    category = "🟠 Overweight";
    advice = "This BMI falls within the overweight range for adults. BMI is a screening measure and does not assess overall health.";
} else {
    category = "🔴 Obesity Range";
    advice = "This BMI falls within the obesity range for adults. BMI is a screening measure and does not assess overall health.";
}

    document.getElementById("bmiCategory").innerHTML = category;
document.getElementById("bmiAdvice").textContent = advice;

const resultCard = document.getElementById("bmiResultCard");
if (resultCard) {
    resultCard.classList.add("show-result");
}

// Record ToolXone statistics
if (
    typeof ToolXoneStatisticsEvents !== "undefined"
) {
    ToolXoneStatisticsEvents.recordCalculation(
        "bmi-calculator"
    );
}

}

function animateBMI(target) {
    if (bmiAnimationTimer !== null) {
        clearInterval(bmiAnimationTimer);
        bmiAnimationTimer = null;
    }
    const element = document.getElementById("bmiNumber");

    let current = 0;
    const increment = target / 40;

    bmiAnimationTimer = setInterval(() => {
        current += increment;

        if (current >= target) {
            current = target;
            clearInterval(bmiAnimationTimer);
            bmiAnimationTimer = null;
        }

        element.textContent = current.toFixed(1);
    }, 20);
}

function resetBMI() {
    if (bmiAnimationTimer !== null) {
        clearInterval(bmiAnimationTimer);
        bmiAnimationTimer = null;
    }
    document.getElementById("heightCm").value = "";
    document.getElementById("weightKg").value = "";
    document.getElementById("heightFt").value = "";
    document.getElementById("heightIn").value = "";
    document.getElementById("weightLb").value = "";

    document.getElementById("bmiNumber").textContent = "--";
    document.getElementById("bmiCategory").textContent = "Enter your height and weight";
    document.getElementById("bmiAdvice").textContent =
    "Your BMI range and information will appear here.";

    const marker = document.getElementById("scaleMarker");
    if (marker) marker.style.left = "0%";
}

function moveBMIMarker(bmi) {
    const marker = document.getElementById("scaleMarker");

    if (!marker) return;

    let position = 0;

    if (bmi < 18.5) {
        position = (bmi / 18.5) * 25;
    } else if (bmi < 25) {
        position = 25 + ((bmi - 18.5) / 6.5) * 30;
    } else if (bmi < 30) {
        position = 55 + ((bmi - 25) / 5) * 20;
    } else {
        position = 75 + Math.min((bmi - 30) / 10, 1) * 25;
    }

    marker.style.left = position + "%";
}