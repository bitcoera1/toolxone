/*!
 * ==========================================================
 * ToolXone Compound Interest Calculator Schema
 * ----------------------------------------------------------
 * Page SEO configuration for the Compound Interest Calculator.
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

    const CompoundInterestCalculatorSchema =
        Object.freeze({

            version: "1.0.0",


            /* ======================================================
               META
            ====================================================== */

            meta: {

                basic: {

                    title:
                        "Compound Interest Calculator - Calculate Investment Growth | ToolXone",

                    description:
                        "Use ToolXone's free Compound Interest Calculator to estimate future value, total contributions, interest earned and investment growth with regular contributions and different compounding frequencies."

                },


                canonical: {

                    href:
                        "https://www.toolxone.com/compound-interest-calculator.html"

                },


                robots: {

                    content:
                        "index,follow"

                },


                application: {

                    name:
                        "ToolXone Compound Interest Calculator"

                },


                mobile: {

                    appleTitle:
                        "Compound Interest Calculator",

                    themeColor:
                        "#0f172a"

                },


                openGraph: {

                    title:
                        "Compound Interest Calculator - Calculate Investment Growth | ToolXone",

                    description:
                        "Calculate future value, total contributions, interest earned and investment growth with ToolXone's free online Compound Interest Calculator.",

                    type:
                        "website",

                    url:
                        "https://www.toolxone.com/compound-interest-calculator.html",

                    image:
                        "https://www.toolxone.com/images/toolxone-logo.jpg",

                    imageWidth:
                        797,

                    imageHeight:
                        335,

                    imageAlt:
                        "ToolXone Compound Interest Calculator",

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
                        "Compound Interest Calculator - Calculate Investment Growth | ToolXone",

                    description:
                        "Calculate future value, total contributions, interest earned and investment growth with ToolXone's free online Compound Interest Calculator.",

                    image:
                        "https://www.toolxone.com/images/toolxone-logo.jpg",

                    imageAlt:
                        "ToolXone Compound Interest Calculator"

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
                        "Compound Interest Calculator",

                    url:
                        "https://www.toolxone.com/compound-interest-calculator.html",

                    description:
                        "Calculate future investment value, total contributions, interest earned and growth while exploring how compounding frequency, regular contributions and investment time affect results."

                },


                application: {

                    name:
                        "ToolXone Compound Interest Calculator",

                    applicationCategory:
                        "FinanceApplication",

                    applicationSubCategory:
                        "Compound Interest Calculator",

                    operatingSystem:
                        "Any",

                    url:
                        "https://www.toolxone.com/compound-interest-calculator.html",

                    description:
                        "Free online compound interest calculator for estimating future value, total contributions, interest earned and investment growth with different compounding frequencies.",

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
                            "Compound Interest Calculator",

                        url:
                            "https://www.toolxone.com/compound-interest-calculator.html"

                    }

                ],


                faq: [

                    {

                        question:
                            "What is compound interest?",

                        answer:
                            "Compound interest is interest calculated on both the original amount and previously accumulated interest. Over time, this can allow an investment or balance to grow faster than simple interest when interest is regularly added to the principal."

                    },

                    {

                        question:
                            "How does compound interest differ from simple interest?",

                        answer:
                            "Simple interest is calculated only on the original principal, while compound interest can be calculated on the principal plus previously accumulated interest. This difference can become more significant over longer periods."

                    },

                    {

                        question:
                            "Does adding monthly contributions affect compound growth?",

                        answer:
                            "Yes. Deposits are added at the beginning of each month, starting alongside the initial investment. There is one deposit per month and no extra deposit at the ending valuation instant. The first deposit grows for the full duration and the final deposit for one month."

                    },

                    {

                        question:
                            "Does compounding frequency affect the result?",

                        answer:
                            "Yes. Yearly, quarterly, monthly and daily compounding each imply an equivalent monthly growth rate from the entered nominal annual rate. Monthly deposits grow at that equivalent rate, including fractional compounding periods. The selected frequency still determines effective annual growth."

                    },

                    {

                        question:
                            "What happens if I invest for a longer period?",

                        answer:
                            "A longer investment period gives compound growth more time to accumulate. When returns are reinvested, the effect of compounding can become increasingly significant over longer periods."

                    },

                    {

                        question:
                            "What is the difference between total contributions and interest earned?",

                        answer:
                            "Total contributions represent the original investment plus any regular contributions made during the investment period. Interest earned is the estimated growth above those contributions."

                    },

                    {

                        question:
                            "Can inflation reduce the real value of investment growth?",

                        answer:
                            "Yes. Inflation can reduce the purchasing power of money over time. A nominal investment return may therefore represent a smaller increase in real purchasing power after accounting for inflation."

                    },

                    {

                        question:
                            "Are Compound Interest Calculator results guaranteed?",

                        answer:
                            "No. The calculator provides estimates based on the values and assumptions entered. Actual investment returns may vary because of market performance, fees, taxes, changing rates, contribution timing and other factors."

                    },

                    {

                        question:
                            "Is the annual interest rate an effective annual yield or APY?",

                        answer:
                            "No. Enter a nominal annual rate quoted with the selected compounding frequency. Its effective annual growth is (1 + r/n)^n - 1, where r is the nominal rate as a decimal and n is the number of compounding periods per year."

                    },

                    {

                        question:
                            "How are partial compounding periods handled?",

                        answer:
                            "The projection includes fractional-exponent compound growth for each amount from its deposit time to the ending valuation. It does not discard growth after the last completed annual or quarterly period and does not model a bank's interest-crediting schedule."

                    },

                    {

                        question:
                            "Can I enter a duration that includes part of a year?",

                        answer:
                            "Yes, if it represents a whole number of months. For example, 1.5 years equals 18 months. Decimal approximations extremely close to a whole month are accepted; a genuine fractional month such as 1.1 years (13.2 months) is rejected."

                    },

                    {

                        question:
                            "How is daily compounding approximated?",

                        answer:
                            "Daily compounding assumes 365 days per year and equal one-twelfth-year months of 365/12 days. The calculator does not collect a start date or model actual calendar month lengths and leap years."

                    },

                    {

                        question:
                            "What does the growth percentage mean?",

                        answer:
                            "Growth percentage is interest earned divided by total contributions, multiplied by 100. It is not an annualized or money-weighted return."

                    },

                    {

                        question:
                            "What happens at zero interest?",

                        answer:
                            "Future value equals the initial investment plus all monthly contributions. Interest earned and growth percentage are zero for every supported compounding frequency."

                    }

                ]

            }

        });


    /* ==========================================================
       REGISTER PAGE
    ========================================================== */

    ToolXoneSchemaRegistry.register(

        "CompoundInterestCalculator",

        CompoundInterestCalculatorSchema

    );


    console.info(

        "✓ Compound Interest Calculator schema registered."

    );


})();