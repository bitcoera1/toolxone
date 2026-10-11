/*!
==========================================================
 ToolXone Calorie Calculator Schema

 ---------------------------------------------------------
 Page SEO configuration for the Calorie Calculator.

 Version : 1.0.0
 Author  : ToolXone
==========================================================
*/

(function () {

"use strict";


const CalorieCalculatorSchema =
Object.freeze({


version:
    "1.0.0",


/*=========================================================
 META
=========================================================*/

meta: {

    basic: {

        title:
            "Calorie Calculator – Free Daily Calorie Calculator | ToolXone",

        description:
            "Use ToolXone's free Calorie Calculator to estimate daily calorie needs, BMR and illustrative calorie scenarios based on age, sex, height, weight and activity level.",

        keywords: [

            "calorie calculator",

            "calorie calculator for adults",

            "daily calorie calculator",

            "calorie needs calculator",

            "BMR calorie calculator",

            "maintenance calorie calculator",

            "calories per day calculator",

            "free calorie calculator",

            "online calorie calculator",

            "calorie calculator metric",

            "calorie calculator imperial",

            "daily calorie needs",

            "maintenance calories",

            "ToolXone"

        ]

    },


    canonical: {

        href:
            "https://www.toolxone.com/calorie-calculator.html"

    },


    robots: {

        content:
            "index,follow"

    },


    application: {

        name:
            "ToolXone Calorie Calculator"

    },


    mobile: {

        appleTitle:
            "Calorie Calculator",

        themeColor:
            "#0f172a"

    },


    openGraph: {

        title:
            "Calorie Calculator – Free Daily Calorie Calculator | ToolXone",

        description:
            "Estimate your daily calorie needs, BMR and illustrative calorie scenarios using ToolXone's free online Calorie Calculator.",

        type:
            "website",

        url:
            "https://www.toolxone.com/calorie-calculator.html",

        image:
            "https://www.toolxone.com/images/toolxone-logo.jpg",

        imageWidth:
            797,

        imageHeight:
            335,

        imageAlt:
            "ToolXone Calorie Calculator - Free Daily Calorie Calculator",

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
            "Calorie Calculator – Free Daily Calorie Calculator | ToolXone",

        description:
            "Calculate your estimated daily calorie needs and BMR with ToolXone's free Calorie Calculator.",

        image:
            "https://www.toolxone.com/images/toolxone-logo.jpg",

        imageAlt:
            "ToolXone Calorie Calculator - Free Daily Calorie Calculator"

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
            "Calorie Calculator",

        url:
            "https://www.toolxone.com/calorie-calculator.html",

        description:
            "Free online Calorie Calculator for estimating daily calorie needs, basal metabolic rate and illustrative calorie scenarios based on personal measurements and activity level."

    },


    application: {

        name:
            "Calorie Calculator",

        applicationCategory:
            "HealthApplication",

        operatingSystem:
            "Any",

        url:
            "https://www.toolxone.com/calorie-calculator.html",

        description:
            "Free online Calorie Calculator that estimates daily calorie needs and BMR using age, sex, height, weight and activity level, with support for metric and imperial measurements.",

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
                "Calorie Calculator",

            url:
                "https://www.toolxone.com/calorie-calculator.html"

        }

    ],


    /*=====================================================
     FAQ
    =====================================================*/

    faq: [
        {
            "question": "What does ToolXone’s Calorie Calculator estimate?",
            "answer": "It predicts resting energy expenditure and applies a simplified activity factor to estimate daily maintenance calories. It also shows fixed loss and gain scenarios for informational comparison."
        },
        {
            "question": "Why does the calculator use the BMR label?",
            "answer": "The familiar BMR label refers here to a Mifflin–St Jeor prediction of resting energy expenditure (REE), not a direct laboratory measurement of basal metabolism."
        },
        {
            "question": "Which resting-energy equations are used?",
            "answer": "The male equation is 10W + 6.25H − 5A + 5; the female equation is 10W + 6.25H − 5A − 161. W is weight in kilograms, H is height in centimeters and A is age in years."
        },
        {
            "question": "How are imperial measurements converted?",
            "answer": "Height in feet and inches is converted to total inches and multiplied by 2.54. Weight in pounds is multiplied by 0.45359237 to obtain kilograms."
        },
        {
            "question": "How is the maintenance estimate calculated?",
            "answer": "Predicted REE is multiplied by the selected activity factor. This is a simplified estimate, not a measurement of total daily energy expenditure."
        },
        {
            "question": "Which activity factors does ToolXone use?",
            "answer": "The factors are 1.20 for Sedentary, 1.375 for Lightly Active, 1.55 for Moderately Active, 1.725 for Very Active and 1.90 for Extra Active."
        },
        {
            "question": "Are those activity factors individualized or validated by Mifflin?",
            "answer": "No. They are simplified calculator assumptions, separate from the original resting-energy equation. Exercise frequency alone does not measure whole-day activity."
        },
        {
            "question": "How is the loss scenario calculated?",
            "answer": "It is the greater of 1,200 and the maintenance estimate minus 500 calories/day. This fixed calculation is not an individualized dietary recommendation."
        },
        {
            "question": "Why can the loss scenario display “—”?",
            "answer": "It displays “—” when the calculated loss scenario is not below the unrounded maintenance estimate."
        },
        {
            "question": "Is 1,200 calories a universal safe minimum?",
            "answer": "No. It is this calculator’s numerical floor and does not establish a safe or nutritionally adequate intake for an individual."
        },
        {
            "question": "How is the gain scenario calculated?",
            "answer": "It is the maintenance estimate plus 500 calories/day. This fixed assumption is not an individualized recommendation or a guarantee of weight gain."
        },
        {
            "question": "Which ages does the calculator accept?",
            "answer": "The software accepts ages 18–120. The original Mifflin study reported 498 healthy participants aged 19–78 and does not establish validation across the entire accepted range."
        },
        {
            "question": "Who should not use these values as dietary guidance?",
            "answer": "This general adult estimator is not designed for children, pregnancy or breastfeeding, or individualized clinical dietary planning. Specific dietary needs require qualified professional guidance."
        },
        {
            "question": "How are results rounded?",
            "answer": "Displayed values are rounded to whole calories/day. Calculations and the unavailable-loss comparison use unrounded values."
        },
        {
            "question": "Do the results measure metabolism or prescribe calorie intake?",
            "answer": "No. They are predictions and arithmetic scenarios, not direct measurements, diagnoses or individualized calorie prescriptions. Individual physiology, body composition and activity can change actual requirements."
        }
    ]

}

});


/*=========================================================
 REGISTER PAGE
=========================================================*/

ToolXoneSchemaRegistry.register(

    "CalorieCalculator",

    CalorieCalculatorSchema

);


console.info(
    "✓ Calorie Calculator schema registered."
);


})();