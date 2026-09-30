/*!
==========================================================
 ToolXone Body Fat Calculator

 ---------------------------------------------------------
 Calculates estimated body fat percentage using the
 U.S. Navy body fat estimation method.

 Supports:
 - Male / Female
 - Metric measurements
 - Imperial measurements
 - Body fat percentage category
 - Animated result
 - ToolXone statistics

 Version : 1.0.0
 Author  : ToolXone
==========================================================
*/

"use strict";


let currentUnit = "metric";


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const sexElement =
        document.getElementById("sex");

    const metricBtn =
        document.getElementById("metricBtn");

    const imperialBtn =
        document.getElementById("imperialBtn");

    const metricInputs =
        document.querySelectorAll(".metric-inputs");

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
        ".body-fat-page input"
    );

    calculatorInputs.forEach(function (input) {

        input.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    calculateBodyFat();

                }

            }
        );

    });    

    /* =====================================================
       SEX CHANGE
    ===================================================== */

    if (sexElement) {

        sexElement.addEventListener(
            "change",
            updateHipVisibility
        );

    }


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


                metricInputs.forEach(function (input) {

                    input.style.display = "block";

                });


                if (imperialInputs) {

                    imperialInputs.style.display = "none";

                }


                resetBodyFat();

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


                metricInputs.forEach(function (input) {

                    input.style.display = "none";

                });


                if (imperialInputs) {

                    imperialInputs.style.display = "block";

                }


                resetBodyFat();

            }
        );

    }


    /* =====================================================
       CALCULATE BUTTON
       ===================================================== */

    if (calculateButton) {

        calculateButton.addEventListener(
            "click",
            calculateBodyFat
        );

    }


    /* =====================================================
       RESET BUTTON
       ===================================================== */

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetBodyFat
        );

    }


    /* =====================================================
       INITIAL UI STATE
       ===================================================== */

    updateHipVisibility();


    console.log(
        "Body Fat JS Loaded Successfully!"
    );

});


/* =========================================================
   UPDATE HIP VISIBILITY
   ========================================================= */

function updateHipVisibility() {


    const sexElement =
        document.getElementById("sex");

    const hipGroups =
        document.querySelectorAll(".female-only");


    if (!sexElement) {
        return;
    }


    const sex =
        sexElement.value.toLowerCase();


    hipGroups.forEach(function (group) {

        if (sex === "female") {

            group.style.display = "block";

        }

        else {

            group.style.display = "none";

        }

    });

}


/* =========================================================
   CALCULATE BODY FAT
   U.S. NAVY METHOD
   ========================================================= */

function calculateBodyFat() {


    const sexElement =
        document.getElementById("sex");


    if (!sexElement) {

        console.error(
            "Body Fat calculator sex element is missing."
        );

        return;

    }


    const sex =
        sexElement.value.toLowerCase();


    let heightInches;
    let neckInches;
    let waistInches;
    let hipInches = null;


    /* =====================================================
       METRIC
       ===================================================== */

    if (currentUnit === "metric") {


        const heightElement =
            document.getElementById("heightCm");

        const neckElement =
            document.getElementById("neckCm");

        const waistElement =
            document.getElementById("waistCm");

        const hipElement =
            document.getElementById("hipCm");


        if (
            !heightElement ||
            !neckElement ||
            !waistElement
        ) {

            console.error(
                "Metric Body Fat input elements are missing."
            );

            return;

        }


        const height =
            parseFloat(heightElement.value);

        const neck =
            parseFloat(neckElement.value);

        const waist =
            parseFloat(waistElement.value);


        /* =================================================
           BASIC VALIDATION
           ================================================= */

        if (
            !Number.isFinite(height) ||
            !Number.isFinite(neck) ||
            !Number.isFinite(waist) ||
            height <= 0 ||
            neck <= 0 ||
            waist <= 0
        ) {

            alert(
                "Please enter valid height, neck and waist measurements."
            );

            return;

        }


        heightInches =
            height / 2.54;

        neckInches =
            neck / 2.54;

        waistInches =
            waist / 2.54;


        /* =================================================
           FEMALE HIP
           ================================================= */

        if (sex === "female") {


            if (!hipElement) {

                console.error(
                    "Female hip input element is missing."
                );

                return;

            }


            const hip =
                parseFloat(hipElement.value);


            if (
                !Number.isFinite(hip) ||
                hip <= 0
            ) {

                alert(
                    "Please enter a valid hip measurement."
                );

                return;

            }


            hipInches =
                hip / 2.54;

        }

    }


    /* =====================================================
       IMPERIAL
       Feet + Inches
       ===================================================== */

    else {


        const heightFtElement =
            document.getElementById("heightFt");

        const heightInElement =
            document.getElementById("heightIn");

        const neckElement =
            document.getElementById("neckIn");

        const waistElement =
            document.getElementById("waistIn");

        const hipElement =
            document.getElementById("hipIn");


        if (
            !heightFtElement ||
            !heightInElement ||
            !neckElement ||
            !waistElement
        ) {

            console.error(
                "Imperial Body Fat input elements are missing."
            );

            return;

        }


        const feetInput =
            heightFtElement.value.trim();

        const heightInInput =
            heightInElement.value.trim();

        const neckInput =
            neckElement.value.trim();

        const waistInput =
            waistElement.value.trim();


        const feet =
            parseFloat(feetInput);

        const heightIn =
            parseFloat(heightInInput);

        const neck =
            parseFloat(neckInput);

        const waist =
            parseFloat(waistInput);


        /* =================================================
           REQUIRED FIELD VALIDATION
           ================================================= */

        if (
            feetInput === "" ||
            heightInInput === "" ||
            neckInput === "" ||
            waistInput === "" ||
            !Number.isFinite(feet) ||
            !Number.isFinite(heightIn) ||
            !Number.isFinite(neck) ||
            !Number.isFinite(waist)
        ) {

            alert(
                "Please enter all required measurements."
            );

            return;

        }


        /* =================================================
           MEASUREMENT VALIDATION
           ================================================= */

        if (
            feet < 0 ||
            heightIn < 0 ||
            heightIn >= 12 ||
            neck <= 0 ||
            waist <= 0
        ) {

            alert(
                "Please enter valid height, neck and waist measurements."
            );

            return;

        }


        heightInches =
            (feet * 12) + heightIn;

        neckInches =
            neck;

        waistInches =
            waist;


        /* =================================================
           FEMALE HIP
           ================================================= */

        if (sex === "female") {


            if (!hipElement) {

                console.error(
                    "Female hip input element is missing."
                );

                return;

            }


            const hipInput =
                hipElement.value.trim();

            const hip =
                parseFloat(hipInput);


            if (
                hipInput === "" ||
                !Number.isFinite(hip) ||
                hip <= 0
            ) {

                alert(
                    "Please enter a valid hip measurement."
                );

                return;

            }


            hipInches =
                hip;

        }

    }


    /* =====================================================
       FINAL MEASUREMENT VALIDATION
       ===================================================== */

    if (
        !Number.isFinite(heightInches) ||
        !Number.isFinite(neckInches) ||
        !Number.isFinite(waistInches) ||
        heightInches <= 0 ||
        neckInches <= 0 ||
        waistInches <= 0
    ) {

        alert(
            "Unable to calculate body fat. Please check your measurements."
        );

        return;

    }


    /* =====================================================
       NAVY METHOD VALIDATION
       ===================================================== */

    if (sex === "male") {


        if (
            waistInches <= neckInches
        ) {

            alert(
                "Waist measurement must be greater than neck measurement."
            );

            return;

        }

    }


    else {


        if (
            waistInches + hipInches <= neckInches
        ) {

            alert(
                "Please check your waist, hip and neck measurements."
            );

            return;

        }

    }


    /* =====================================================
       CALCULATE BODY FAT
       ===================================================== */

    let bodyFat;


    if (sex === "male") {


        /*
         U.S. Navy formula for men:

         Body Fat % =
         495 /
         (1.0324
         - 0.19077 × log10(waist - neck)
         + 0.15456 × log10(height))
         - 450
        */


        bodyFat =
            495 /
            (
                1.0324
                - (
                    0.19077 *
                    Math.log10(
                        waistInches - neckInches
                    )
                )
                + (
                    0.15456 *
                    Math.log10(
                        heightInches
                    )
                )
            )
            - 450;

    }


    else {


        /*
         U.S. Navy formula for women:

         Body Fat % =
         495 /
         (1.29579
         - 0.35004 × log10(waist + hip - neck)
         + 0.22100 × log10(height))
         - 450
        */


        bodyFat =
            495 /
            (
                1.29579
                - (
                    0.35004 *
                    Math.log10(
                        waistInches +
                        hipInches -
                        neckInches
                    )
                )
                + (
                    0.22100 *
                    Math.log10(
                        heightInches
                    )
                )
            )
            - 450;

    }


    /* =====================================================
       RESULT VALIDATION
       ===================================================== */

    if (
        !Number.isFinite(bodyFat) ||
        bodyFat < 0 ||
        bodyFat > 70
    ) {

        alert(
            "Unable to calculate body fat. Please check your measurements."
        );

        return;

    }


    /* =====================================================
       DISPLAY RESULT
       ===================================================== */

    displayBodyFatResult(
        bodyFat,
        sex
    );


    /* =====================================================
       RECORD TOOLXONE STATISTICS
       ===================================================== */

    if (
        typeof ToolXoneStatisticsEvents !==
        "undefined"
    ) {

        ToolXoneStatisticsEvents.recordCalculation(
            "body-fat-calculator"
        );

    }

}


/* =========================================================
   DISPLAY BODY FAT RESULT
   ========================================================= */

function displayBodyFatResult(
    bodyFat,
    sex
) {


    const numberElement =
        document.getElementById("bodyFatValue");


    if (numberElement) {

        animateBodyFat(bodyFat);

    }


    const categoryElement =
        document.getElementById("bodyFatCategory");


    if (categoryElement) {

        categoryElement.textContent =
            getBodyFatCategory(
                bodyFat,
                sex
            );

    }


    const detailsElement =
        document.getElementById("bodyFatDetails");


    if (detailsElement) {

        detailsElement.textContent =
            "Estimated body fat: " +
            bodyFat.toFixed(1) +
            "%";

    }


    const explanationElement =
        document.getElementById("bodyFatExplanation");


    if (explanationElement) {

        explanationElement.textContent =
            "This result is an estimate based on your body measurements and the U.S. Navy body fat estimation method.";

    }


    const resultCard =
        document.getElementById("resultCard");


    if (resultCard) {

        resultCard.style.display =
            "block";

    }

}


/* =========================================================
   BODY FAT CATEGORY
   ========================================================= */

function getBodyFatCategory(
    bodyFat,
    sex
) {


    /*
     Approximate adult reference categories.
     These are used for general informational display
     and are not a medical diagnosis.
    */


    if (sex === "male") {


        if (bodyFat < 6) {

            return "Essential Fat";

        }

        if (bodyFat < 14) {

            return "Athletes";

        }

        if (bodyFat < 18) {

            return "Fitness";

        }

        if (bodyFat < 25) {

            return "Average";

        }

        return "Above Average";

    }


    else {


        if (bodyFat < 14) {

            return "Essential Fat";

        }

        if (bodyFat < 21) {

            return "Athletes";

        }

        if (bodyFat < 25) {

            return "Fitness";

        }

        if (bodyFat < 32) {

            return "Average";

        }

        return "Above Average";

    }

}


/* =========================================================
   BODY FAT ANIMATION
   ========================================================= */

function animateBodyFat(
    target
) {


    const element =
        document.getElementById("bodyFatValue");


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

                    clearInterval(timer);

                }


                element.textContent =
                    current.toFixed(1) + "%";


            },
            20
        );

}


/* =========================================================
   RESET BODY FAT
   ========================================================= */

function resetBodyFat() {


    const fields = [

        "heightCm",

        "neckCm",

        "waistCm",

        "hipCm",

        "heightFt",

        "heightIn",

        "neckIn",

        "waistIn",

        "hipIn",

        "weightKg",

        "weightLb"

    ];


    fields.forEach(
        function (id) {


            const element =
                document.getElementById(id);


            if (element) {

                element.value = "";

            }

        }
    );


    const numberElement =
        document.getElementById("bodyFatValue");


    if (numberElement) {

        numberElement.textContent =
            "—";

    }


    const categoryElement =
        document.getElementById("bodyFatCategory");


    if (categoryElement) {

        categoryElement.textContent =
            "";

    }


    const detailsElement =
        document.getElementById("bodyFatDetails");


    if (detailsElement) {

        detailsElement.textContent =
            "";

    }


    const explanationElement =
        document.getElementById("bodyFatExplanation");


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


    updateHipVisibility();

}