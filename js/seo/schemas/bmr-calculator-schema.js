/*!
==========================================================
 ToolXone BMR Calculator Schema

 ---------------------------------------------------------
 Page SEO configuration for the BMR Calculator.

 Version : 1.0.0
 Author  : ToolXone
==========================================================
*/

(function () {

"use strict";


const BMRCalculatorSchema =
Object.freeze({


version:
    "1.0.0",


/*=========================================================
 META
=========================================================*/

meta: {

    basic: {

        title:
            "BMR Calculator – Free Basal Metabolic Rate Calculator | ToolXone",

        description:
            "Use ToolXone's free BMR Calculator to estimate Basal Metabolic Rate from age, sex, height and weight using the Mifflin-St Jeor equation.",

        keywords: [

            "BMR calculator",

            "basal metabolic rate calculator",

            "BMR calculator for adults",

            "free BMR calculator",

            "online BMR calculator",

            "BMR calculator metric",

            "BMR calculator imperial",

            "BMR calculator feet and pounds",

            "Mifflin-St Jeor calculator",

            "basal metabolic rate",

            "adult BMR calculator",

            "ToolXone"

        ]

    },


    canonical: {

        href:
            "https://www.toolxone.com/bmr-calculator.html"

    },


    robots: {

        content:
            "index,follow"

    },


    application: {

        name:
            "ToolXone BMR Calculator"

    },


    mobile: {

        appleTitle:
            "BMR Calculator",

        themeColor:
            "#0f172a"

    },


    openGraph: {

        title:
            "BMR Calculator – Free Basal Metabolic Rate Calculator | ToolXone",

        description:
            "Estimate your Basal Metabolic Rate from age, sex, height and weight using the Mifflin-St Jeor equation with ToolXone.",

        type:
            "website",

        url:
            "https://www.toolxone.com/bmr-calculator.html",

        image:
            "https://www.toolxone.com/images/toolxone-logo.jpg",

        imageWidth:
            797,

        imageHeight:
            335,

        imageAlt:
            "ToolXone BMR Calculator - Free Basal Metabolic Rate Calculator",

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
            "BMR Calculator – Free Basal Metabolic Rate Calculator | ToolXone",

        description:
            "Calculate your estimated Basal Metabolic Rate from age, sex, height and weight using the Mifflin-St Jeor equation.",

        image:
            "https://www.toolxone.com/images/toolxone-logo.jpg",

        imageAlt:
            "ToolXone BMR Calculator - Free Basal Metabolic Rate Calculator"

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
            "BMR Calculator",

        url:
            "https://www.toolxone.com/bmr-calculator.html",

        description:
            "Free online Basal Metabolic Rate calculator for adults using age, sex, height and weight with the Mifflin-St Jeor equation."

    },


    application: {

        name:
            "BMR Calculator",

        applicationCategory:
            "HealthApplication",

        operatingSystem:
            "Any",

        url:
            "https://www.toolxone.com/bmr-calculator.html",

        description:
            "Free online BMR Calculator for adults that estimates Basal Metabolic Rate from age, sex, height and weight using the Mifflin-St Jeor equation and supports metric and imperial measurements.",

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
                "BMR Calculator",

            url:
                "https://www.toolxone.com/bmr-calculator.html"

        }

    ],


    faq: [

        {
            question:
                "What does BMR stand for?",

            answer:
                "BMR stands for Basal Metabolic Rate. This calculator uses that familiar label for a Mifflin–St Jeor prediction of resting energy expenditure (REE), rather than a direct measurement of basal metabolism."
        },

        {
            question:
                "How is this calculator’s result calculated?",

            answer:
                "It uses age, sex, height and weight in the simplified Mifflin–St Jeor equations to predict resting energy expenditure in calories per day."
        },

        {
            question:
                "What is the Mifflin–St Jeor equation?",

            answer:
                "It is a predictive equation for resting energy expenditure. The original study compared equation predictions with resting energy expenditure measured by indirect calorimetry."
        },

        {
            question:
                "What is the formula for the male selection?",

            answer:
                "REE = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + 5. The calculator displays this predicted REE under the BMR label."
        },

        {
            question:
                "What is the formula for the female selection?",

            answer:
                "REE = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) − 161. The calculator displays this predicted REE under the BMR label."
        },

        {
            question:
                "Is this result the same as total daily calorie needs?",

            answer:
                "No. It predicts resting energy expenditure. Total daily energy expenditure also includes physical activity and the energy used to process food; this calculator does not calculate that total."
        },

        {
            question:
                "Can I calculate the estimate using metric or imperial units?",

            answer:
                "Yes. Metric mode accepts centimeters and kilograms. Feet / Pounds mode accepts feet, inches and pounds, then converts them to centimeters and kilograms before applying the equation."
        },

        {
            question:
                "Can people with similar inputs have different measured results?",

            answer:
                "Yes. People with similar age, sex, height and weight can have different measured resting energy expenditure. The equation does not capture every individual difference."
        },

        {
            question:
                "How accurate is this estimate?",

            answer:
                "It is a prediction rather than a laboratory measurement or an exact individual metabolic requirement. An individual’s measured resting energy expenditure can differ from the calculated value."
        },

        {
            question:
                "Does this result prescribe calorie intake or a weight-loss plan?",

            answer:
                "No. Predicted resting energy expenditure alone does not determine appropriate calorie intake or prescribe a weight-management plan. This calculator does not provide individualized dietary advice."
        },

        {
            question:
                "What ages does the calculator accept, and what ages were studied?",

            answer:
                "The software accepts ages 18–120. The original Mifflin study reported 498 healthy participants aged 19–78. Software acceptance does not establish validation across the entire accepted range, and this is not a pediatric energy-needs calculator."
        },

        {
            question:
                "Does this calculator directly measure metabolism or diagnose a condition?",

            answer:
                "No. It predicts resting energy expenditure from the entered measurements. It does not directly measure metabolism or diagnose a medical condition."
        }
    ]

}

});


/*=========================================================
 REGISTER PAGE
=========================================================*/

ToolXoneSchemaRegistry.register(

    "BMRCalculator",

    BMRCalculatorSchema

);


console.info(
    "✓ BMR Calculator schema registered."
);


})();