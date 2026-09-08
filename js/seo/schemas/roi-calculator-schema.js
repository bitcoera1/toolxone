/*!
 * ==========================================================
 * ToolXone ROI Calculator Schema
 * ----------------------------------------------------------
 * Page SEO configuration for the ROI Calculator.
 *
 * Version : 1.0.0
 * Author  : ToolXone
 * ==========================================================
 */

(function () {

    "use strict";


    /* ==========================================================
       PAGE SCHEMA
    ========================================================== */

    const ROICalculatorSchema =
        Object.freeze({

            version: "1.0.0",


            /* ======================================================
               META
            ====================================================== */

            meta: {

                basic: {

                    title:
                        "ROI Calculator - Calculate Return on Investment | ToolXone",

                    description:
                        "Use ToolXone's free ROI Calculator to calculate return on investment, profit or loss, and evaluate investment performance instantly."

                },


                canonical: {

                    href:
                        "https://www.toolxone.com/roi-calculator.html"

                },


                robots: {

                    content:
                        "index,follow"

                },


                application: {

                    name:
                        "ToolXone ROI Calculator"

                },


                mobile: {

                    appleTitle:
                        "ROI Calculator",

                    themeColor:
                        "#0f172a"

                },


                openGraph: {

                    title:
                        "ROI Calculator - Calculate Return on Investment | ToolXone",

                    description:
                        "Calculate return on investment, profit or loss, and investment performance with ToolXone's free online ROI Calculator.",

                    type:
                        "website",

                    url:
                        "https://www.toolxone.com/roi-calculator.html",

                    image:
                        "https://www.toolxone.com/images/roi-calculator.webp",

                    imageWidth:
                        1536,

                    imageHeight:
                        1024,

                    imageAlt:
                        "ToolXone ROI Calculator for calculating return on investment",

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
                        "ROI Calculator - Calculate Return on Investment | ToolXone",

                    description:
                        "Calculate return on investment, profit or loss, and investment performance with ToolXone's free online ROI Calculator.",

                    image:
                        "https://www.toolxone.com/images/roi-calculator.webp",

                    imageAlt:
                        "ToolXone ROI Calculator"

                }

            },


            /* ======================================================
               STRUCTURED DATA
            ====================================================== */

            schema: {

                organization: {

                    name:
                        "ToolXone",

                    url:
                        "https://www.toolxone.com/"

                },


                website: {

                    name:
                        "ToolXone",

                    url:
                        "https://www.toolxone.com/"

                },


                webpage: {

                    name:
                        "ROI Calculator",

                    url:
                        "https://www.toolxone.com/roi-calculator.html",

                    description:
                        "Calculate return on investment, profit or loss, and investment performance and understand how an investment performs relative to its original cost."

                },


                application: {

                    name:
                        "ToolXone ROI Calculator",

                    applicationCategory:
                        "FinanceApplication",

                    applicationSubCategory:
                        "ROI Calculator",

                    operatingSystem:
                        "Any",

                    url:
                        "https://www.toolxone.com/roi-calculator.html",

                    description:
                        "Free online ROI calculator for calculating return on investment percentage, investment profit or loss, and overall investment performance.",

                    isAccessibleForFree:
                        true,

                    offers: {

                        "@type":
                            "Offer",

                        price:
                            "0",

                        priceCurrency:
                            "USD"

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
                            "ROI Calculator",

                        url:
                            "https://www.toolxone.com/roi-calculator.html"

                    }

                ],


                faq: [

                    {

                        question:
                            "What is ROI?",

                        answer:
                            "ROI stands for Return on Investment. It is a percentage used to measure how much profit or loss an investment generates compared with the original amount invested."

                    },

                    {

                        question:
                            "What is the ROI formula?",

                        answer:
                            "The standard ROI formula is ROI = ((Final Return - Investment Amount) / Investment Amount) × 100. The result expresses the investment gain or loss as a percentage of the original investment."

                    },

                    {

                        question:
                            "How do I calculate ROI?",

                        answer:
                            "Enter the original investment amount and the final return into the calculator. ToolXone calculates the difference between the return and investment, then divides that result by the original investment and converts it to a percentage."

                    },

                    {

                        question:
                            "What does a positive ROI mean?",

                        answer:
                            "A positive ROI means the final return is greater than the original investment, indicating that the investment generated a profit."

                    },

                    {

                        question:
                            "What does a negative ROI mean?",

                        answer:
                            "A negative ROI means the final return is lower than the original investment, indicating that the investment generated a loss."

                    },

                    {

                        question:
                            "What does a 0% ROI mean?",

                        answer:
                            "A 0% ROI means the final return is equal to the original investment, so the investment neither gained nor lost money before considering additional costs or fees."

                    },

                    {

                        question:
                            "Can ROI be used to compare investments?",

                        answer:
                            "Yes. ROI can help compare investment performance by expressing gains or losses as a percentage of the original investment. However, comparison should also consider factors such as investment duration, risk, fees, and cash-flow timing."

                    },

                    {

                        question:
                            "Can ROI be used for marketing campaigns?",

                        answer:
                            "Yes. ROI can be used to evaluate marketing campaigns by comparing the return generated by a campaign with its associated investment or cost."

                    },

                    {

                        question:
                            "What are the limitations of ROI?",

                        answer:
                            "ROI does not by itself account for the time required to generate a return, investment risk, cash-flow timing, taxes, inflation, or all associated costs. These factors should be considered when evaluating investment performance."

                    },

                    {

                        question:
                            "Is ROI the same as profit?",

                        answer:
                            "No. Profit or loss is the monetary difference between the final return and the original investment, while ROI expresses that gain or loss as a percentage of the original investment."

                    }

                ]

            }

        });


    /* ==========================================================
       REGISTER PAGE
    ========================================================== */

    ToolXoneSchemaRegistry.register(

        "ROICalculator",

        ROICalculatorSchema

    );


    console.info(
        "✓ ROI Calculator schema registered."
    );


})();