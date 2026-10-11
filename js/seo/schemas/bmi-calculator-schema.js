/*!
==========================================================
 ToolXone BMI Calculator Schema

 ---------------------------------------------------------
 Page SEO configuration for the BMI Calculator.

 Version : 1.0.0
 Author  : ToolXone
==========================================================
*/

(function () {

"use strict";


const BMICalculatorSchema =
Object.freeze({


version:
    "1.0.0",


/*=========================================================
 META
=========================================================*/

meta: {

    basic: {

        title:
            "BMI Calculator – Free Body Mass Index Calculator for Adults | ToolXone",

        description:
            "Use ToolXone's free BMI Calculator to calculate Body Mass Index from height and weight in metric or imperial units and view the corresponding adult BMI range.",

        keywords: [

            "BMI calculator",

            "body mass index calculator",

            "BMI calculator for adults",

            "free BMI calculator",

            "online BMI calculator",

            "BMI calculator metric",

            "BMI calculator imperial",

            "BMI calculator feet and pounds",

            "body mass index",

            "adult BMI calculator",

            "ToolXone"

        ]

    },


    canonical: {

        href:
            "https://www.toolxone.com/bmi-calculator.html"

    },


    robots: {

        content:
            "index,follow"

    },


    application: {

        name:
            "ToolXone BMI Calculator"

    },


    mobile: {

        appleTitle:
            "BMI Calculator",

        themeColor:
            "#0f172a"

    },


    openGraph: {

        title:
            "BMI Calculator – Free Body Mass Index Calculator for Adults | ToolXone",

        description:
            "Calculate BMI from height and weight using metric or imperial units and view the corresponding adult BMI range with ToolXone.",

        type:
            "website",

        url:
            "https://www.toolxone.com/bmi-calculator.html",

        image:
            "https://www.toolxone.com/images/toolxone-logo.jpg",

        imageWidth:
            797,

        imageHeight:
            335,

        imageAlt:
            "ToolXone BMI Calculator - Free Body Mass Index Calculator",

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
            "BMI Calculator – Free Body Mass Index Calculator | ToolXone",

        description:
            "Calculate your BMI from height and weight in metric or imperial units and view the corresponding adult BMI range with ToolXone.",

        image:
            "https://www.toolxone.com/images/toolxone-logo.jpg",

        imageAlt:
            "ToolXone BMI Calculator - Free Body Mass Index Calculator"

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
            "BMI Calculator",

        url:
            "https://www.toolxone.com/bmi-calculator.html",

        description:
            "Free online Body Mass Index calculator for adults using metric or imperial height and weight measurements."

    },


    application: {

        name:
            "BMI Calculator",

        applicationCategory:
            "HealthApplication",

        operatingSystem:
            "Any",

        url:
            "https://www.toolxone.com/bmi-calculator.html",

        description:
            "Free online Body Mass Index (BMI) calculator for adults that calculates BMI from height and weight using metric or imperial units and displays the corresponding BMI range.",

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
                "BMI Calculator",

            url:
                "https://www.toolxone.com/bmi-calculator.html"

        }

    ],


    faq: [

        {

            question:
                "What is BMI?",

            answer:
                "BMI stands for Body Mass Index. It is a screening measure calculated from a person's height and weight and is commonly used to group adult BMI values into ranges."

        },

        {

            question:
                "How is BMI calculated?",

            answer:
                "In metric units, BMI is calculated by dividing weight in kilograms by height in meters squared. In imperial units, weight in pounds is divided by height in inches squared and the result is multiplied by 703. The factor 703 is the conventional rounded conversion factor."

        },

        {

            question:
                "What are the adult BMI ranges?",

            answer:
                "The ranges used by this calculator are below 18.5 for underweight, 18.5 to below 25 for the healthy weight range, 25 to below 30 for overweight, and 30 or higher for the obesity range. These categories are intended for adults ages 20 and older and do not by themselves determine overall health."

        },

        {

            question:
                "Can I calculate BMI using feet and pounds?",

            answer:
                "Yes. ToolXone's BMI Calculator supports both metric units using centimeters and kilograms and imperial units using feet, inches and pounds."

        },

        {

            question:
                "Does BMI directly measure body fat?",

            answer:
                "No. BMI is calculated from height and weight and does not directly measure body fat or distinguish between fat, muscle, bone and other components of body composition."

        },

        {

            question:
                "Is BMI the same as a medical diagnosis?",

            answer:
                "No. BMI is a screening measure and does not diagnose a medical condition or determine a person's overall health."

        },

        {

            question:
                "Can people with the same BMI have different body compositions?",

            answer:
                "Yes. Two people with the same BMI can have different amounts of muscle, body fat and other body composition characteristics because BMI uses only height and weight."

        },

        {

            question:
                "Is this BMI Calculator intended for adults?",

            answer:
                "Yes. Its displayed categories are intended for adults ages 20 and older. People ages 2–19 require age- and sex-specific BMI-for-age interpretation, which this calculator does not provide."

        },

        {

            question:
                "Why can the displayed BMI appear inconsistent with its category?",

            answer:
                "Categories use the unrounded BMI; the displayed number is rounded to one decimal place. For example, 24.96 displays as 25.0 but remains below the category boundary of 25."

        },

        {

            question:
                "How should I measure height and weight?",

            answer:
                "Measure height without shoes, standing upright with feet flat and looking straight ahead. For weight, remove shoes, stand centrally on the scale with hands at your sides, and wait for a stable reading. Use the measurement units shown beside the inputs."

        }

    ]

}

});


/*=========================================================
 REGISTER PAGE
=========================================================*/

ToolXoneSchemaRegistry.register(

    "BMICalculator",

    BMICalculatorSchema

);


console.info(
    "✓ BMI Calculator schema registered."
);


})();