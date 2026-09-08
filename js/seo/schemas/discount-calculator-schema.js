/*!
 * ==========================================================
 * ToolXone Discount Calculator Schema
 * ----------------------------------------------------------
 * Page SEO configuration for the Discount Calculator.
 *
 * Version : 2.0.0
 * Author  : ToolXone
 * ==========================================================
 */

(function () {

    "use strict";


    /* ==========================================================
       PAGE SCHEMA
    ========================================================== */

    const DiscountCalculatorSchema =
        Object.freeze({

            version:
                "2.0.0",


            /* ======================================================
               META
            ====================================================== */

            meta: {

                basic: {

                    title:
                        "Discount Calculator - Calculate Sale Price & Savings | ToolXone",

                    description:
                        "Use ToolXone's free Discount Calculator to calculate the discount amount, savings and final price instantly from the original price and discount percentage.",

                    keywords: [

                        "discount calculator",

                        "discount calculator online",

                        "free discount calculator",

                        "percentage discount calculator",

                        "discount percentage calculator",

                        "sale price calculator",

                        "sale discount calculator",

                        "discount savings calculator",

                        "price after discount calculator",

                        "calculate discount",

                        "calculate sale price",

                        "discount amount calculator",

                        "shopping discount calculator",

                        "discount calculator tool",

                        "ToolXone"

                    ]

                },


                canonical: {

                    href:
                        "https://www.toolxone.com/discount-calculator.html"

                },


                robots: {

                    content:
                        "index,follow"

                },


                application: {

                    name:
                        "ToolXone Discount Calculator"

                },


                mobile: {

                    appleTitle:
                        "Discount Calculator",

                    themeColor:
                        "#0f172a"

                },


                openGraph: {

                    title:
                        "Discount Calculator - Calculate Sale Price & Savings | ToolXone",

                    description:
                        "Calculate discount amounts, savings and final sale prices instantly with ToolXone's free online Discount Calculator.",

                    type:
                        "website",

                    url:
                        "https://www.toolxone.com/discount-calculator.html",

                    image:
                        "https://www.toolxone.com/images/toolxone-logo.jpg",

                    imageWidth:
                        797,

                    imageHeight:
                        335,

                    imageAlt:
                        "ToolXone Discount Calculator - Free Online Discount Calculator",

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
                        "Discount Calculator - Calculate Sale Price & Savings | ToolXone",

                    description:
                        "Calculate discount amounts, savings and final sale prices with ToolXone's free Discount Calculator.",

                    image:
                        "https://www.toolxone.com/images/toolxone-logo.jpg",

                    imageAlt:
                        "ToolXone Discount Calculator"

                }

            },


            /* ======================================================
               STRUCTURED DATA
            ====================================================== */

            schema: {

                /* --------------------------------------------------
                   ORGANIZATION
                -------------------------------------------------- */

                organization: {

                    name:
                        "ToolXone",

                    url:
                        "https://www.toolxone.com/"

                },


                /* --------------------------------------------------
                   WEBSITE
                -------------------------------------------------- */

                website: {

                    name:
                        "ToolXone",

                    url:
                        "https://www.toolxone.com/"

                },


                /* --------------------------------------------------
                   WEBPAGE
                -------------------------------------------------- */

                webpage: {

                    name:
                        "Discount Calculator",

                    url:
                        "https://www.toolxone.com/discount-calculator.html",

                    description:
                        "Free online discount calculator for calculating discount amounts, savings and final prices from an original price and discount percentage."

                },


                /* --------------------------------------------------
                   APPLICATION
                -------------------------------------------------- */

                application: {

                    name:
                        "ToolXone Discount Calculator",

                    applicationCategory:
                        "FinanceApplication",

                    applicationSubCategory:
                        "Discount Calculator",

                    operatingSystem:
                        "Any",

                    url:
                        "https://www.toolxone.com/discount-calculator.html",

                    description:
                        "Free online discount calculator for calculating discount amounts, savings and final prices from an original price and discount percentage.",

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


                /* --------------------------------------------------
                   BREADCRUMBS
                -------------------------------------------------- */

                breadcrumbs: [

                    {

                        name:
                            "Home",

                        url:
                            "https://www.toolxone.com/"

                    },

                    {

                        name:
                            "Discount Calculator",

                        url:
                            "https://www.toolxone.com/discount-calculator.html"

                    }

                ],


                /* --------------------------------------------------
                   FAQ
                -------------------------------------------------- */

                faq: [

                    {

                        question:
                            "How is a discount calculated?",

                        answer:
                            "A percentage discount is calculated by multiplying the original price by the discount percentage divided by 100. For example, a 20% discount on a $100 item saves $20, leaving a final price of $80."

                    },


                    {

                        question:
                            "What does final price mean?",

                        answer:
                            "The final price is the amount you pay after the discount has been subtracted from the original price. Final Price = Original Price − Discount Amount."

                    },


                    {

                        question:
                            "How do I calculate the price after a percentage discount?",

                        answer:
                            "Subtract the discount percentage from 100% to find the percentage of the original price that remains, then multiply the original price by that percentage. For example, after a 25% discount, you pay 75% of the original price."

                    },


                    {

                        question:
                            "Can I calculate decimal discounts such as 12.5%?",

                        answer:
                            "Yes. The ToolXone Discount Calculator supports decimal discount percentages such as 12.5%, 17.375%, and 22.75%. For example, a 12.5% discount on $800 saves $100, giving a final price of $700."

                    },


                    {

                        question:
                            "Are two successive discounts the same as adding them together?",

                        answer:
                            "No. Successive discounts are applied one after another, with each discount calculated from the remaining price. For example, 20% off followed by 10% off produces an effective discount of 28%, not 30%."

                    },


                    {

                        question:
                            "What happens with a 100% discount?",

                        answer:
                            "A 100% discount removes the entire original price. You save 100% of the price and pay zero. For example, a 100% discount on a $250 item means you save $250 and pay $0."

                    },


                    {

                        question:
                            "Does a larger discount always mean a better deal?",

                        answer:
                            "Not necessarily. A larger discount gives greater savings relative to the stated original price, but the original price also matters. Compare the final price with comparable products rather than judging an offer only by its advertised discount percentage."

                    },


                    {

                        question:
                            "Does the Discount Calculator include GST, VAT, or sales tax?",

                        answer:
                            "No. The Discount Calculator calculates the discount amount, savings and final discounted price. GST, VAT, sales tax, or other taxes may need to be calculated separately depending on the transaction and applicable tax rules."

                    }

                ]

            }

        });


    /* ==========================================================
       REGISTER PAGE
    ========================================================== */

    ToolXoneSchemaRegistry.register(

        "DiscountCalculator",

        DiscountCalculatorSchema

    );


    console.info(

        "✓ Discount Calculator schema registered."

    );


})();