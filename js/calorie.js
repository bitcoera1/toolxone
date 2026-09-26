/*!
==========================================================
 ToolXone Calorie Calculator
----------------------------------------------------------
 Calculates estimated:
 - Basal Metabolic Rate (BMR)
 - Maintenance Calories (TDEE)
 - Weight Loss Target
 - Weight Gain Target

 Method:
 - Mifflin-St Jeor equation
 - Activity multiplier for TDEE

 Supports:
 - Male / Female
 - Metric measurements
 - Imperial measurements
 - Activity levels
 - Animated result
 - ToolXone statistics

 Version : 1.0.0
 Author  : ToolXone
==========================================================
*/

"use strict";


/* =========================================================
   CURRENT UNIT
========================================================= */

let currentUnit = "metric";


/* =========================================================
   ACTIVITY MULTIPLIERS
========================================================= */

const ACTIVITY_MULTIPLIERS = {

    sedentary: 1.20,

    light: 1.375,

    moderate: 1.55,

    very: 1.725,

    extra: 1.90

};


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const metricBtn =
        document.getElementById("metricBtn");


    const imperialBtn =
        document.getElementById("imperialBtn");


    const metricInputs =
        document.querySelector(".metric-inputs");


    const imperialInputs =
        document.querySelector(".imperial-inputs");


    const calculateButton =
        document.getElementById("calculateBtn");


    const resetButton =
        document.getElementById("resetBtn");

    /* =====================================================
       ENTER KEY SUPPORT
    ===================================================== */

    const calculatorInputs = document.querySelectorAll(
        ".calorie-page input"
    );

    calculatorInputs.forEach(function (input) {

        input.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    calculateCalories();

                }

            }
        );

    });        

    /* =====================================================
       UNIT SWITCH — METRIC
    ===================================================== */

    if (metricBtn) {

        metricBtn.addEventListener(
            "click",
            function () {

                currentUnit = "metric";


                metricBtn.classList.add("active");


                if (imperialBtn) {

                    imperialBtn.classList.remove("active");

                }


                if (metricInputs) {

                    metricInputs.style.display = "block";

                }


                if (imperialInputs) {

                    imperialInputs.style.display = "none";

                }


                resetCalorieCalculator();

            }
        );

    }


    /* =====================================================
       UNIT SWITCH — IMPERIAL
    ===================================================== */

    if (imperialBtn) {

        imperialBtn.addEventListener(
            "click",
            function () {

                currentUnit = "imperial";


                imperialBtn.classList.add("active");


                if (metricBtn) {

                    metricBtn.classList.remove("active");

                }


                if (metricInputs) {

                    metricInputs.style.display = "none";

                }


                if (imperialInputs) {

                    imperialInputs.style.display = "block";

                }


                resetCalorieCalculator();

            }
        );

    }


    /* =====================================================
       CALCULATE BUTTON
    ===================================================== */

    if (calculateButton) {

        calculateButton.addEventListener(
            "click",
            calculateCalories
        );

    }


    /* =====================================================
       RESET BUTTON
    ===================================================== */

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetCalorieCalculator
        );

    }


    /* =====================================================
       INITIAL UI STATE
    ===================================================== */

    if (metricInputs) {

        metricInputs.style.display = "block";

    }


    if (imperialInputs) {

        imperialInputs.style.display = "none";

    }


    console.log(
        "Calorie Calculator JS Loaded Successfully!"
    );

});


/* =========================================================
   CALCULATE CALORIES
========================================================= */

function calculateCalories() {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sexElement =
        document.getElementById("sex");


    const ageElement =
        document.getElementById("age");


    const activityElement =
        document.getElementById("activityLevel");


    if (
        !sexElement ||
        !ageElement ||
        !activityElement
    ) {

        console.error(
            "Calorie Calculator required elements are missing."
        );

        return;

    }


    const sex =
        sexElement.value.toLowerCase();


    const age =
        parseFloat(ageElement.value);


    const activityLevel =
        activityElement.value;


    /* =====================================================
       BASIC VALIDATION
    ===================================================== */

    if (
        !Number.isFinite(age) ||
        age < 18 ||
        age > 120
    ) {

        alert(
            "Please enter a valid age between 18 and 120 years."
        );

        return;

    }


    /* =====================================================
       ACTIVITY VALIDATION
    ===================================================== */

    const activityMultiplier =
        ACTIVITY_MULTIPLIERS[activityLevel];


    if (
        !Number.isFinite(activityMultiplier)
    ) {

        alert(
            "Please select a valid activity level."
        );

        return;

    }


    /* =====================================================
       VARIABLES
    ===================================================== */

    let heightCm;

    let weightKg;


    /* =====================================================
       METRIC
    ===================================================== */

    if (currentUnit === "metric") {


        const heightElement =
            document.getElementById("heightCm");


        const weightElement =
            document.getElementById("weightKg");


        if (
            !heightElement ||
            !weightElement
        ) {

            console.error(
                "Metric Calorie Calculator input elements are missing."
            );

            return;

        }


        heightCm =
            parseFloat(heightElement.value);


        weightKg =
            parseFloat(weightElement.value);


        /* =================================================
           VALIDATION
        ================================================= */

        if (
            !Number.isFinite(heightCm) ||
            !Number.isFinite(weightKg)
        ) {

            alert(
                "Please enter your height and weight."
            );

            return;

        }


        if (
            heightCm < 100 ||
            heightCm > 250
        ) {

            alert(
                "Please enter a valid height between 100 and 250 cm."
            );

            return;

        }


        if (
            weightKg < 20 ||
            weightKg > 500
        ) {

            alert(
                "Please enter a valid weight between 20 and 500 kg."
            );

            return;

        }

    }


    /* =====================================================
       IMPERIAL
    ===================================================== */

    else {


        const heightFtElement =
            document.getElementById("heightFt");


        const heightInElement =
            document.getElementById("heightIn");


        const weightLbElement =
            document.getElementById("weightLb");


        if (
            !heightFtElement ||
            !heightInElement ||
            !weightLbElement
        ) {

            console.error(
                "Imperial Calorie Calculator input elements are missing."
            );

            return;

        }


        const feetInput =
            heightFtElement.value.trim();


        const inchesInput =
            heightInElement.value.trim();


        const poundsInput =
            weightLbElement.value.trim();


        const feet =
            parseFloat(feetInput);


        const inches =
            parseFloat(inchesInput);


        const pounds =
            parseFloat(poundsInput);


        /* =================================================
           REQUIRED FIELD VALIDATION
        ================================================= */

        if (
            feetInput === "" ||
            inchesInput === "" ||
            poundsInput === "" ||
            !Number.isFinite(feet) ||
            !Number.isFinite(inches) ||
            !Number.isFinite(pounds)
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
            feet < 3 ||
            feet > 8 ||
            inches < 0 ||
            inches >= 12
        ) {

            alert(
                "Please enter a valid height."
            );

            return;

        }


        if (
            pounds < 44 ||
            pounds > 1100
        ) {

            alert(
                "Please enter a valid weight between 44 and 1100 pounds."
            );

            return;

        }


        /* =================================================
           CONVERT IMPERIAL → METRIC
        ================================================= */

        const totalHeightInches =
            (feet * 12) + inches;


        heightCm =
            totalHeightInches * 2.54;


        weightKg =
            pounds * 0.45359237;

    }


    /* =====================================================
       FINAL VALIDATION
    ===================================================== */

    if (
        !Number.isFinite(heightCm) ||
        !Number.isFinite(weightKg) ||
        heightCm <= 0 ||
        weightKg <= 0
    ) {

        alert(
            "Unable to calculate calories. Please check your measurements."
        );

        return;

    }


    /* =====================================================
       MIFFLIN-ST JEOR BMR
    ===================================================== */

    let bmr;


    if (sex === "male") {


        /*
        Mifflin-St Jeor equation for men:

        BMR =
        (10 × weight in kg)
        + (6.25 × height in cm)
        - (5 × age)
        + 5
        */


        bmr =
            (10 * weightKg) +
            (6.25 * heightCm) -
            (5 * age) +
            5;

    }


    else {


        /*
        Mifflin-St Jeor equation for women:

        BMR =
        (10 × weight in kg)
        + (6.25 × height in cm)
        - (5 × age)
        - 161
        */


        bmr =
            (10 * weightKg) +
            (6.25 * heightCm) -
            (5 * age) -
            161;

    }


    /* =====================================================
       BMR VALIDATION
    ===================================================== */

    if (
        !Number.isFinite(bmr) ||
        bmr <= 0
    ) {

        alert(
            "Unable to calculate BMR. Please check your information."
        );

        return;

    }


    /* =====================================================
       TDEE / MAINTENANCE CALORIES
    ===================================================== */

    const maintenanceCalories =
        bmr * activityMultiplier;


    /* =====================================================
       CALORIE TARGETS
    ===================================================== */

    const weightLossCalories =
        Math.max(
            1200,
            maintenanceCalories - 500
        );


    const weightGainCalories =
        maintenanceCalories + 500;


    /* =====================================================
       RESULT VALIDATION
    ===================================================== */

    if (
        !Number.isFinite(maintenanceCalories) ||
        !Number.isFinite(weightLossCalories) ||
        !Number.isFinite(weightGainCalories)
    ) {

        alert(
            "Unable to calculate your calorie targets."
        );

        return;

    }


    /* =====================================================
       DISPLAY RESULT
    ===================================================== */

    displayCalorieResult(
        bmr,
        maintenanceCalories,
        weightLossCalories,
        weightGainCalories
    );


    /* =====================================================
       RECORD TOOLXONE STATISTICS
    ===================================================== */

    if (
        typeof ToolXoneStatisticsEvents !==
        "undefined"
    ) {

        ToolXoneStatisticsEvents.recordCalculation(
            "calorie-calculator"
        );

    }

}


/* =========================================================
   DISPLAY CALORIE RESULT
========================================================= */

function displayCalorieResult(
    bmr,
    maintenanceCalories,
    weightLossCalories,
    weightGainCalories
) {


    /* =====================================================
       MAIN CALORIE VALUE
    ===================================================== */

    const calorieElement =
        document.getElementById("calorieValue");


    if (calorieElement) {

        animateCalorieValue(
            maintenanceCalories
        );

    }


    /* =====================================================
       BMR
    ===================================================== */

    const bmrElement =
        document.getElementById("bmrValue");


    if (bmrElement) {

        bmrElement.textContent =
            Math.round(bmr).toLocaleString();

    }


    /* =====================================================
       MAINTENANCE
    ===================================================== */

    const maintenanceElement =
        document.getElementById(
            "maintenanceValue"
        );


    if (maintenanceElement) {

        maintenanceElement.textContent =
            Math.round(
                maintenanceCalories
            ).toLocaleString();

    }


    /* =====================================================
       WEIGHT LOSS
    ===================================================== */

    const weightLossUnavailable =
        weightLossCalories >= maintenanceCalories;

    const weightLossElement =
        document.getElementById(
            "weightLossValue"
        );


    if (weightLossElement) {

        weightLossElement.textContent =
            weightLossUnavailable
                ? "—"
                : Math.round(
                    weightLossCalories
                ).toLocaleString();

    }


    /* =====================================================
       WEIGHT GAIN
    ===================================================== */

    const weightGainElement =
        document.getElementById(
            "weightGainValue"
        );


    if (weightGainElement) {

        weightGainElement.textContent =
            Math.round(
                weightGainCalories
            ).toLocaleString();

    }


    /* =====================================================
       EXPLANATION
    ===================================================== */

    const explanationElement =
        document.getElementById(
            "calorieExplanation"
        );


    if (explanationElement) {

        explanationElement.textContent =
            "Your estimated maintenance calories are based on your BMR and selected activity level. Calorie needs are estimates and can vary between individuals.";

        if (weightLossUnavailable) {
            explanationElement.textContent +=
                " A weight-loss target is unavailable because the calculator’s computed target is not below your estimated maintenance calories.";
        }

    }


    /* =====================================================
       RESULT CARD
    ===================================================== */

    const resultCard =
        document.getElementById(
            "resultCard"
        );


    if (resultCard) {

        resultCard.style.display =
            "block";

    }

}


/* =========================================================
   CALORIE ANIMATION
========================================================= */

function animateCalorieValue(
    target
) {


    const element =
        document.getElementById(
            "calorieValue"
        );


    if (!element) {

        return;

    }


    let current = 0;


    const increment =
        target / 40;


    const timer =
        setInterval(
            function () {


                current += increment;


                if (current >= target) {

                    current =
                        target;


                    clearInterval(
                        timer
                    );

                }


                element.textContent =
                    Math.round(
                        current
                    ).toLocaleString();


            },
            20
        );

}


/* =========================================================
   RESET CALORIE CALCULATOR
========================================================= */

function resetCalorieCalculator() {


    /* =====================================================
       INPUT FIELDS
    ===================================================== */

    const fields = [

        "age",

        "heightCm",

        "weightKg",

        "heightFt",

        "heightIn",

        "weightLb"

    ];


    fields.forEach(
        function (id) {


            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.value =
                    "";

            }

        }
    );


    /* =====================================================
       RESULT VALUES
    ===================================================== */

    const calorieElement =
        document.getElementById(
            "calorieValue"
        );


    if (calorieElement) {

        calorieElement.textContent =
            "—";

    }


    const bmrElement =
        document.getElementById(
            "bmrValue"
        );


    if (bmrElement) {

        bmrElement.textContent =
            "—";

    }


    const maintenanceElement =
        document.getElementById(
            "maintenanceValue"
        );


    if (maintenanceElement) {

        maintenanceElement.textContent =
            "—";

    }


    const weightLossElement =
        document.getElementById(
            "weightLossValue"
        );


    if (weightLossElement) {

        weightLossElement.textContent =
            "—";

    }


    const weightGainElement =
        document.getElementById(
            "weightGainValue"
        );


    if (weightGainElement) {

        weightGainElement.textContent =
            "—";

    }


    /* =====================================================
       EXPLANATION
    ===================================================== */

    const explanationElement =
        document.getElementById(
            "calorieExplanation"
        );


    if (explanationElement) {

        explanationElement.textContent =
            "";

    }


    /* =====================================================
       RESULT CARD
    ===================================================== */

    const resultCard =
        document.getElementById(
            "resultCard"
        );


    if (resultCard) {

        resultCard.style.display =
            "none";

    }

}