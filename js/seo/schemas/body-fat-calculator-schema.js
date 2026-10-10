/*!
==========================================================
 ToolXone Body Fat Calculator Schema

 ---------------------------------------------------------
 Page SEO configuration for the Body Fat Calculator.

 Version : 1.0.0
 Author  : ToolXone
==========================================================
*/

(function () {

"use strict";


const BodyFatCalculatorSchema =
Object.freeze({


version:
    "1.0.0",


/*=========================================================
 META
=========================================================*/

meta: {

    basic: {

        title:
            "Body Fat Calculator – Free Body Fat Percentage Calculator | ToolXone",

        description:
            "Use ToolXone's free Body Fat Calculator to estimate body fat percentage from sex, height, waist, neck and hip measurements.",

        keywords: [

            "body fat calculator",

            "body fat percentage calculator",

            "body fat calculator for men",

            "body fat calculator for women",

            "free body fat calculator",

            "online body fat calculator",

            "body fat percentage",

            "body fat calculator metric",

            "body fat calculator imperial",

            "body fat calculator waist neck",

            "body composition calculator",

            "body fat estimate",

            "ToolXone"

        ]

    },


    canonical: {

        href:
            "https://www.toolxone.com/body-fat-calculator.html"

    },


    robots: {

        content:
            "index,follow"

    },


    application: {

        name:
            "ToolXone Body Fat Calculator"

    },


    mobile: {

        appleTitle:
            "Body Fat Calculator",

        themeColor:
            "#0f172a"

    },


    openGraph: {

        title:
            "Body Fat Calculator – Free Body Fat Percentage Calculator | ToolXone",

        description:
            "Estimate your body fat percentage using sex, height and body measurements with ToolXone's free online Body Fat Calculator.",

        type:
            "website",

        url:
            "https://www.toolxone.com/body-fat-calculator.html",

        image:
            "https://www.toolxone.com/images/toolxone-logo.jpg",

        imageWidth:
            797,

        imageHeight:
            335,

        imageAlt:
            "ToolXone Body Fat Calculator - Free Body Fat Percentage Calculator",

        siteName:
            "ToolXone",

        locale:
            "en_US"

    },


    twitter: {

        card:
            "summary_large_image",

        site:
            "@ToolXone",

        title:
            "Body Fat Calculator – Free Body Fat Percentage Calculator | ToolXone",

        description:
            "Calculate your estimated body fat percentage using body measurements with ToolXone's free Body Fat Calculator.",

        image:
            "https://www.toolxone.com/images/toolxone-logo.jpg",

        imageAlt:
            "ToolXone Body Fat Calculator - Free Body Fat Percentage Calculator"

    }

},


/*=========================================================
 SCHEMA
=========================================================*/

schema: {

    organization: {

        name:
            "ToolXone",

        url:
            "https://www.toolxone.com"

    },


    website: {

        name:
            "ToolXone",

        url:
            "https://www.toolxone.com"

    },


    webpage: {

        name:
            "Body Fat Calculator",

        url:
            "https://www.toolxone.com/body-fat-calculator.html",

        description:
            "Free online Body Fat Calculator for estimating body fat percentage from sex, height and body measurements."

    },


    application: {

        name:
            "Body Fat Calculator",

        applicationCategory:
            "HealthApplication",

        operatingSystem:
            "Any",

        url:
            "https://www.toolxone.com/body-fat-calculator.html",

        description:
            "Free online Body Fat Calculator that estimates body fat percentage using sex, height and body measurements and supports metric and imperial measurements.",

        offers: {

            price:
                "0",

            priceCurrency:
                "USD"

        },

        publisher: {

            name:
                "ToolXone",

            url:
                "https://www.toolxone.com"

        }

    },


    breadcrumbs: [

        {

            name:
                "Home",

            url:
                "https://www.toolxone.com/"

        },

        {

            name:
                "Body Fat Calculator",

            url:
                "https://www.toolxone.com/body-fat-calculator.html"

        }

    ],


        /*=====================================================
     FAQ
    =====================================================*/

    faq: [

        {
            question:
                "What is body fat percentage?",

            answer:
                "Body fat percentage is the estimated proportion of total body weight that consists of body fat."
        },


        {
            question:
                "How is body fat percentage calculated?",

            answer:
                "ToolXone uses the historical Hodgdon–Beckett body-density equations with centimeter measurements and base-10 logarithms, followed by the separate Siri conversion: body fat percentage = 495 / density − 450."
        },


        {
            question:
                "What measurements are needed for the Body Fat Calculator?",

            answer:
                "Both calculations use height and neck circumference. Men use abdominal circumference at the navel; women use natural waist and hip circumference. Weight does not affect the calculation."
        },


        {
            question:
                "Why does the calculator ask for my sex?",

            answer:
                "The historical method provides separate male and female regression equations. The selected sex determines which equation and required circumference measurements this calculator uses."
        },


        {
            question:
                "Why do women need to enter hip measurement?",

            answer:
                "The female version of the circumference-based body fat equation includes hip circumference as an additional measurement."
        },


        {
            question:
                "What is the U.S. Navy body fat method?",

            answer:
                "Here, the name means the historical Hodgdon–Beckett circumference method. This calculator is an informational estimate, not an official or current military qualification assessment."
        },


        {
            question:
                "Can I use Metric measurements?",

            answer:
                "Yes. ToolXone's Body Fat Calculator supports Metric measurements in centimeters."
        },


        {
            question:
                "Can I use feet and inches?",

            answer:
                "Yes. Imperial mode supports height in feet and inches and circumference measurements in inches."
        },


        {
            question:
                "Is a body fat calculator accurate?",

            answer:
                "It provides an estimate. Measurement technique, body shape, fat distribution and the population represented by the equations can affect the result. One decimal place is display precision, not an accuracy guarantee."
        },


        {
            question:
                "Is body fat percentage better than BMI?",

            answer:
                "BMI and body fat percentage measure different things. BMI uses height and weight, while body fat percentage estimates the proportion of body weight that is fat. Both have different uses and limitations."
        },


        {
            question:
                "Can two people with the same BMI have different body fat percentages?",

            answer:
                "Yes. BMI does not directly measure body composition, so people with the same BMI can have different amounts of body fat and lean tissue."
        },


        {
            question:
                "Can two people with the same weight have different body fat percentages?",

            answer:
                "Yes. People with the same body weight can have different proportions of body fat, muscle and other tissues."
        },


        {
            question:
                "How should I measure my waist for the calculator?",

            answer:
                "For men, measure horizontally at the navel after a normal, relaxed exhalation. For women, measure the natural waist at the narrowest abdominal circumference, with arms at your sides, after a normal, relaxed exhalation. Keep the tape against the body without compressing the skin."
        },


        {
            question:
                "How should I measure my neck?",

            answer:
                "With your head upright and shoulders relaxed, measure just below the larynx (Adam’s apple), not over it. Position the tape perpendicular to the neck’s long axis and avoid including the shoulder muscles. Keep the tape as close to horizontal as anatomically feasible."
        },


        {
            question:
                "How often should I measure body fat?",

            answer:
                "If you are tracking changes over time, consistent measurement conditions are more useful than frequent measurements. Using the same technique and similar conditions makes comparisons easier."
        },


        {
            question:
                "Does body fat percentage directly measure body fat?",

            answer:
                "No. A circumference-based calculator estimates body fat percentage using measurements and an equation. It does not directly measure body fat tissue."
        },


        {
            question:
                "Is body fat percentage a medical diagnosis?",

            answer:
                "No. A calculator-based body fat percentage is an estimate and should not be treated as a medical diagnosis."
        },


        {
            question:
                "Can I use this calculator for fitness tracking?",

            answer:
                "Yes. Estimated body fat percentage can be one of several measurements used to track changes in body composition over time."
        },


        {
            question:
                "Who is this Body Fat Calculator intended for?",

            answer:
                "This tool is intended for adult informational use. The historical equations were developed using military samples; their performance is not established here for every population or individual. This page does not establish their suitability for children, pregnancy, or clinical decision-making."
        },


        {
            question:
                "Does this result determine a healthy range or military qualification?",

            answer:
                "No. ToolXone does not classify the estimate as a healthy range or determine military eligibility."
        }

    ]

}

});


/*=========================================================
 REGISTER PAGE
=========================================================*/

ToolXoneSchemaRegistry.register(

    "BodyFatCalculator",

    BodyFatCalculatorSchema

);


console.info(
    "✓ Body Fat Calculator schema registered."
);


})();