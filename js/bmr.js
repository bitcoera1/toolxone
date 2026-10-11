let currentUnit = "metric";
let bmrAnimationTimer = null;

document.addEventListener("DOMContentLoaded", function () {

    const metricBtn = document.getElementById("metricBtn");
    const imperialBtn = document.getElementById("imperialBtn");

    const metricInputs = document.querySelectorAll(".metric-inputs");
    const imperialInputs = document.querySelector(".imperial-inputs");

    /* =====================================================
       UNIT SWITCH — METRIC
       ===================================================== */

    if (metricBtn) {

        metricBtn.addEventListener("click", function () {

            currentUnit = "metric";

            metricBtn.classList.add("active");

            if (imperialBtn) {
                imperialBtn.classList.remove("active");
            }

            metricInputs.forEach(input => {
                input.style.display = "block";
            });

            if (imperialInputs) {
                imperialInputs.style.display = "none";
            }

            resetBMR();

        });

    }


    /* =====================================================
       UNIT SWITCH — IMPERIAL
       ===================================================== */

    if (imperialBtn) {

        imperialBtn.addEventListener("click", function () {

            currentUnit = "imperial";

            imperialBtn.classList.add("active");

            if (metricBtn) {
                metricBtn.classList.remove("active");
            }

            metricInputs.forEach(input => {
                input.style.display = "none";
            });

            if (imperialInputs) {
                imperialInputs.style.display = "block";
            }

            resetBMR();

        });

    }


    /* =====================================================
       CALCULATE BUTTON
       ===================================================== */

    const calculateButton =
        document.getElementById("calculateBtn");

    if (calculateButton) {

        calculateButton.addEventListener(
            "click",
            calculateBMR
        );

    }


    /* =====================================================
       RESET BUTTON
       ===================================================== */

const resetButton =
    document.getElementById("resetBtn");

if (resetButton) {

    resetButton.addEventListener(
        "click",
        resetBMR
    );

}


/* =====================================================
   ENTER KEY SUPPORT
   ===================================================== */

document.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        calculateBMR();
    }

});


console.log(
    "BMR JS Loaded Successfully!"
);

});


/* =========================================================
   CALCULATE BMR
   Mifflin-St Jeor Equation
   ========================================================= */

function calculateBMR() {

    const sexElement =
        document.getElementById("sex");

    const ageElement =
        document.getElementById("age");

    if (!sexElement || !ageElement) {

        console.error(
            "BMR calculator input elements are missing."
        );

        return;

    }

    const sex =
        sexElement.value;

    const age =
        parseFloat(ageElement.value);


    /* =====================================================
       BASIC AGE VALIDATION
       ===================================================== */

    if (
        !Number.isFinite(age) ||
        age < 18 ||
        age > 120
    ) {

        alert(
            "Please enter a valid adult age between 18 and 120 years."
        );

        return;

    }


    let weightKg;
    let heightCm;


    /* =====================================================
       METRIC
       ===================================================== */

    if (currentUnit === "metric") {

        const heightElement =
            document.getElementById("heightCm");

        const weightElement =
            document.getElementById("weightKg");

        if (!heightElement || !weightElement) {

            console.error(
                "Metric BMR input elements are missing."
            );

            return;

        }

        const height =
            parseFloat(heightElement.value);

        const weight =
            parseFloat(weightElement.value);


        if (
            !Number.isFinite(height) ||
            !Number.isFinite(weight) ||
            height <= 0 ||
            weight <= 0
        ) {

            alert(
                "Please enter valid height and weight values."
            );

            return;

        }


        heightCm = height;

        weightKg = weight;

    }


    /* =====================================================
       IMPERIAL
       Feet + Inches + Pounds
       ===================================================== */

    else {

        const feetElement =
            document.getElementById("heightFt");

        const inchesElement =
            document.getElementById("heightIn");

        const weightElement =
            document.getElementById("weightLb");

        if (
            !feetElement ||
            !inchesElement ||
            !weightElement
        ) {

            console.error(
                "Imperial BMR input elements are missing."
            );

            return;

        }

        const feetInput =
            feetElement.value.trim();

        const inchesInput =
            inchesElement.value.trim();

        const weightInput =
            weightElement.value.trim();


        const feet =
            parseFloat(feetInput);

        const inches =
            parseFloat(inchesInput);

        const weightLb =
            parseFloat(weightInput);


        /* =================================================
           REQUIRED FIELD VALIDATION
           ================================================= */

        if (
            feetInput === "" ||
            inchesInput === "" ||
            weightInput === "" ||
            !Number.isFinite(feet) ||
            !Number.isFinite(inches) ||
            !Number.isFinite(weightLb)
        ) {

            alert(
                "Please enter your height and weight."
            );

            return;

        }


        /* =================================================
           MEASUREMENT VALIDATION
           ================================================= */

        if (
            feet < 0 ||
            inches < 0 ||
            inches >= 12 ||
            weightLb <= 0
        ) {

            alert(
                "Please enter valid height and weight values."
            );

            return;

        }


        const totalInches =
            (feet * 12) + inches;


        if (totalInches <= 0) {

            alert(
                "Please enter valid height and weight values."
            );

            return;

        }


        /* =================================================
           CONVERT TO METRIC
           ================================================= */

        heightCm =
            totalInches * 2.54;

        weightKg =
            weightLb * 0.45359237;

    }


    /* =====================================================
       MIFFLIN-ST JEOR EQUATION
       ===================================================== */

    let bmr;


    if (
        sex.toLowerCase() === "male"
    ) {

        bmr =
            (10 * weightKg) +
            (6.25 * heightCm) -
            (5 * age) +
            5;

    }

    else {

        bmr =
            (10 * weightKg) +
            (6.25 * heightCm) -
            (5 * age) -
            161;

    }


    if (
        !Number.isFinite(bmr) ||
        bmr <= 0
    ) {

        alert(
            "Unable to calculate BMR. Please check your values."
        );

        return;

    }


    /* =====================================================
       DISPLAY RESULT
       ===================================================== */

    displayBMRResult(bmr);


    /* =====================================================
       RECORD TOOLXONE STATISTICS
       ===================================================== */

    if (
        typeof ToolXoneStatisticsEvents !==
        "undefined"
    ) {

        ToolXoneStatisticsEvents.recordCalculation(
            "bmr-calculator"
        );

    }

}


/* =========================================================
   DISPLAY BMR RESULT
   ========================================================= */

function displayBMRResult(bmr) {

    const numberElement =
        document.getElementById("bmrValue");

    if (numberElement) {

        animateBMR(bmr);

    }


    const explanationElement =
        document.getElementById("bmrExplanation");

    if (explanationElement) {

        explanationElement.textContent =
            "Your estimated BMR is the approximate number of calories your body may need each day to support basic physiological functions while at rest.";

    }


    const resultCard =
        document.getElementById("resultCard");

    if (resultCard) {

        resultCard.style.display = "block";

    }

}


/* =========================================================
   BMR ANIMATION
   ========================================================= */

function animateBMR(target) {

    const element =
        document.getElementById("bmrValue");

    if (!element) {
        return;
    }


    if (bmrAnimationTimer !== null) {
        clearInterval(bmrAnimationTimer);
        bmrAnimationTimer = null;
    }

    let current = 0;

    const increment =
        target / 40;


    const timer =
        setInterval(function () {

            if (bmrAnimationTimer !== timer) {
                return;
            }

            current += increment;


            if (current >= target) {

                current = target;

                clearInterval(timer);
                bmrAnimationTimer = null;

            }


            element.textContent =
                Math.round(current).toLocaleString();

        }, 20);

    bmrAnimationTimer = timer;

}


/* =========================================================
   RESET BMR
   ========================================================= */

function resetBMR() {

    if (bmrAnimationTimer !== null) {
        clearInterval(bmrAnimationTimer);
        bmrAnimationTimer = null;
    }

    const fields = [

        "age",
        "heightCm",
        "weightKg",
        "heightFt",
        "heightIn",
        "weightLb"

    ];


    fields.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.value = "";

        }

    });


    const numberElement =
        document.getElementById("bmrValue");

    if (numberElement) {

        numberElement.textContent =
            "—";

    }


    const explanationElement =
        document.getElementById("bmrExplanation");

    if (explanationElement) {

        explanationElement.textContent =
            "";

    }


    const resultCard =
        document.getElementById("resultCard");

    if (resultCard) {

        resultCard.style.display =
            "none";

    }

}