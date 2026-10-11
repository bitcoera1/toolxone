/*
==========================================================
 ToolXone BMI Calculator Content
 Version: 1.0.0
==========================================================
*/

(function () {

"use strict";


/*=========================================================
 Registry Check
=========================================================*/

if (!window.ToolXoneContentRegistry) {

    console.error(
        "[BMI Content] Content Registry not found."
    );

    return;

}


/*=========================================================
 BMI CALCULATOR CONTENT
=========================================================*/

const BMI_CALCULATOR_CONTENT = {

    hero: {

        title:
            "BMI Calculator",

        subtitle:
            "Free Body Mass Index Calculator",

        description:
            "Calculate your Body Mass Index (BMI) instantly from height and weight using metric or imperial units and understand your adult BMI range.",

        badge:
            "Health Tool",

        category:
            "Health & Fitness",

        icon:
            "⚖️",

        highlights: [
            "Metric & Imperial Units",
            "Adult BMI Ranges",
            "Instant Results",
            "Mobile Friendly"
        ],

        statistics: {

            functions:
                "2",

            accuracy: {
                value: "Screening",
                label: "Measure"
            },

            availability:
                "24/7",

            price:
                "Free"

        },

    preview: `
    <div class="tx-tool-preview-card">

        <img
            class="tx-tool-preview-image"
            src="images/bmi-calculator-preview.webp"
            alt="BMI Calculator preview showing BMI result and health information"
            loading="lazy"
        >

    </div>

        `,

        cta: {

            primary:
                "Calculate BMI",

            secondary:
                "Learn More"

        }

    },

/*=========================================================
 ARTICLE
=========================================================*/

article: {

    title:
        "How BMI Is Calculated and What Your Result Means",

    introduction:
        "Body Mass Index (BMI) is a screening measure that relates an adult's weight to their height. It provides a numerical value that can be compared with commonly used adult BMI ranges. BMI is simple to calculate, but it should be interpreted as a screening measure rather than a complete assessment of health or body composition. The displayed categories follow the CDC convention for adults ages 20 and older.",

    sections: [

        {

            heading:
                "BMI Formula Using Kilograms and Meters",

            content:
                "When weight is measured in kilograms and height is measured in meters, BMI is calculated using the following formula: BMI = weight (kg) ÷ height² (m²). For example, an adult who weighs 70 kg and is 1.75 meters tall would have a BMI of approximately 22.9: BMI = 70 ÷ (1.75 × 1.75) ≈ 22.9. ToolXone's metric mode accepts height in centimeters, so the calculator converts the entered height to meters before calculating BMI."

        },

        {

            heading:
                "BMI Formula Using Pounds and Inches",

            content:
                "When weight is entered in pounds and height is measured in inches, the BMI formula used by this calculator is: BMI = [weight (lb) ÷ height² (in²)] × 703. ToolXone's Feet / Pounds mode allows height to be entered as feet and inches. The calculator converts the height to total inches before applying the formula. The factor 703 is the conventional rounded conversion factor used in the customary-unit BMI formula."

        },

        {

            heading:
                "Adult BMI Ranges",

            content:
                "This calculator groups adult BMI results into four ranges: Underweight — Below 18.5; Healthy Weight Range — 18.5 to below 25; Overweight — 25 to below 30; Obesity Range — 30 or higher. These are screening categories for adults ages 20 and older. “Healthy Weight Range” names a BMI category; it does not establish that an individual is healthy."

        },

        {

            heading:
                "Measuring Height and Weight",

            content:
                "<p><strong>Height:</strong> Measure without shoes, standing upright with both feet flat and weight evenly distributed. Look straight ahead and remove anything on top of your head that interferes with the measurement. Use a height-measuring device with a horizontal headpiece resting on top of the head.</p>\n<p><strong>Weight:</strong> Measure without shoes. Stand centrally on the scale with your hands at your sides and wait until the reading is stable.</p>\n<p>Enter height and weight in the units shown beside the selected inputs.</p>"

        },

        {

            heading:
                "How to Use the BMI Calculator",

            content:
                "Choose Metric if you want to enter height in centimeters and weight in kilograms. Choose Feet / Pounds if you want to enter height in feet and inches and weight in pounds. Enter your measurements and select Calculate BMI. The calculator displays your BMI rounded to one decimal place, the corresponding adult BMI range, and a visual marker showing where the result falls on the calculator's BMI scale. The category is determined from the unrounded BMI, while the displayed number is rounded to one decimal place. Near a boundary, the display can equal that boundary while the underlying value remains below it. For example, BMI 24.96 displays as 25.0 but remains in the Healthy Weight Range."

        },

        {

            heading:
                "What Does a BMI Result Tell You?",

            content:
                "BMI compares weight with height and provides a convenient screening value. It can be useful for looking at weight-related categories at a general level because the calculation requires only height and weight. However, BMI does not directly measure body fat and does not explain why a person has a particular weight. The same BMI value can occur in people with different body compositions."

        },

        {

            heading:
                "Limitations of BMI",

            content:
                "BMI uses only height and weight. It does not distinguish between body fat, muscle, bone and other components of body mass. As a result, two adults with the same height and weight can have the same BMI while having different body compositions. BMI also does not directly measure fitness, nutrition, body-fat distribution or overall health. For these reasons, the result should be treated as a screening value rather than a diagnosis or complete health assessment."

        },

        {

            heading:
                "Adult BMI and BMI for Children Are Not Interpreted the Same Way",

            content:
                "This calculator displays categories for adults ages 20 and older. For people ages 2–19, BMI requires interpretation relative to age and sex using BMI-for-age percentiles. This calculator does not provide that interpretation."

        },

        {

            heading:
                "Metric vs. Imperial BMI",

            content:
                "Equivalent metric and customary-unit measurements produce approximately the same BMI. Small differences can arise from the rounded factor 703 and from rounding the entered measurements. Very near a category boundary, those differences can place the results in different categories. If you need to convert a weight measurement before using a calculator, ToolXone's Weight Converter can help convert between common weight units."

        },

        {

            heading:
                "How to Interpret Your BMI Estimate",

            content:
                "Use the result to understand which adult BMI range corresponds to the height and weight entered. Avoid interpreting the number as a complete description of health, fitness or body composition. If an individual health assessment is needed, factors beyond BMI may need to be considered by an appropriately qualified healthcare professional."

        },

        {

            heading:
                "Methodology and Sources",

            content:
                "<p>These sources support the BMI formulas, adult screening categories, interpretation and measurement guidance described above. Their inclusion does not imply endorsement of ToolXone.</p>\n<ul>\n<li><a href=\"https://www.cdc.gov/bmi/faq/\">CDC — BMI Frequently Asked Questions</a></li>\n<li><a href=\"https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html\">CDC — Adult BMI Categories</a></li>\n<li><a href=\"https://wwwn.cdc.gov/nchs/data/nhanes/public/2019/manuals/2020-Anthropometry-Procedures-Manual-508.pdf\">CDC/NCHS — NHANES Anthropometry Procedures Manual, January 2020</a></li>\n</ul>"

        }

    ]

},


/*=========================================================
 FAQ
=========================================================*/

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

};


/*=========================================================
 Register Content
=========================================================*/

window.ToolXoneContentRegistry.register(
    "hero",
    "bmi-calculator",
    BMI_CALCULATOR_CONTENT.hero
);

window.ToolXoneContentRegistry.register(
    "articles",
    "bmi-calculator",
    BMI_CALCULATOR_CONTENT.article
);

window.ToolXoneContentRegistry.register(
    "faq",
    "bmi-calculator",
    BMI_CALCULATOR_CONTENT.faq
);


console.info(
    "✓ BMI Calculator hero, content and FAQ registered."
);


})();