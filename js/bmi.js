let currentUnit = "metric";

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

    console.log("BMI JS Loaded Successfully!");
});

function calculateBMI() {
    let bmi;

    if (currentUnit === "metric") {
        const height = parseFloat(document.getElementById("heightCm").value);
        const weight = parseFloat(document.getElementById("weightKg").value);

        if (!height || !weight) {
            alert("Please enter your height and weight.");
            return;
        }

        bmi = weight / Math.pow(height / 100, 2);
    } else {
        const feet = parseFloat(document.getElementById("heightFt").value) || 0;
        const inches = parseFloat(document.getElementById("heightIn").value) || 0;
        const weightLb = parseFloat(document.getElementById("weightLb").value);

        const totalInches = (feet * 12) + inches;

        if (!totalInches || !weightLb) {
            alert("Please enter your height and weight.");
            return;
        }

        bmi = (weightLb / Math.pow(totalInches, 2)) * 703;
    }

    animateBMI(bmi);
    moveBMIMarker(bmi);

    let category = "";
    let advice = "";

    if (bmi < 18.5) {
        category = "🔵 Underweight";
        advice = "Consider a balanced diet and consult a healthcare professional if needed.";
    } else if (bmi < 25) {
        category = "🟢 Normal Weight";
        advice = "Excellent! Maintain your healthy lifestyle.";
    } else if (bmi < 30) {
        category = "🟠 Overweight";
        advice = "Regular exercise and balanced nutrition can help.";
    } else {
        category = "🔴 Obese";
        advice = "Consult a healthcare professional for personalized guidance.";
    }

    document.getElementById("bmiCategory").innerHTML = category;
document.getElementById("bmiAdvice").textContent = advice;

const resultCard = document.getElementById("bmiResultCard");
if (resultCard) {
    resultCard.classList.add("show-result");
}
}

function animateBMI(target) {
    const element = document.getElementById("bmiNumber");

    let current = 0;
    const increment = target / 40;

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        element.textContent = current.toFixed(1);
    }, 20);
}

function resetBMI() {
    document.getElementById("heightCm").value = "";
    document.getElementById("weightKg").value = "";
    document.getElementById("heightFt").value = "";
    document.getElementById("heightIn").value = "";
    document.getElementById("weightLb").value = "";

    document.getElementById("bmiNumber").textContent = "--";
    document.getElementById("bmiCategory").textContent = "Enter your height and weight";
    document.getElementById("bmiAdvice").textContent = "Your health category and advice will appear here.";

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
const resultCard = document.getElementById("bmiResultCard");
if (resultCard) {
    resultCard.classList.remove("show-result");

// Record successful calculation
ToolXoneStatisticsEvents.recordCalculation(
    "bmi-calculator"
);

}