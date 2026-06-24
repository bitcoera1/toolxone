document.getElementById("calculateBMI").addEventListener("click", calculateBMI);
document.getElementById("resetBMI").addEventListener("click", resetBMI);
console.log("BMI JS Loaded Successfully!");

function calculateBMI() {
    const height = parseFloat(document.getElementById("heightCm").value);
    const weight = parseFloat(document.getElementById("weightKg").value);

    if (!height || !weight) {
        alert("Please enter your height and weight.");
        return;
    }

    const bmi = weight / Math.pow(height / 100, 2);

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

    document.getElementById("bmiCategory").textContent = category;
    document.getElementById("bmiAdvice").textContent = advice;
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

    document.getElementById("bmiNumber").textContent = "--";

    document.getElementById("bmiCategory").textContent =
        "Enter your height and weight";

    document.getElementById("bmiAdvice").textContent =
        "Your health category and advice will appear here.";
}
function moveBMIMarker(bmi) {
    const marker = document.getElementById("scaleMarker");

    if (!marker) {
        return;
    }

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