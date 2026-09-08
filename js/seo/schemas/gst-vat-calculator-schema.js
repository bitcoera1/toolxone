/*!
 * ==========================================================
 * ToolXone GST / VAT Calculator Schema
 * ----------------------------------------------------------
 * Page SEO configuration for the GST / VAT Calculator.
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

    const GSTVATCalculatorSchema =
        Object.freeze({

            version:
                "2.0.0",


            /* ======================================================
               META
            ====================================================== */

            meta: {

                basic: {

                    title:
                        "GST / VAT Calculator - Calculate Tax Amount & Final Price | ToolXone",

                    description:
                        "Use ToolXone's free GST / VAT Calculator to calculate GST or VAT, tax amount, base price and final price instantly from any tax rate.",

                    keywords: [

                        "gst calculator",

                        "gst calculator online",

                        "free gst calculator",

                        "gst tax calculator",

                        "goods and services tax calculator",

                        "vat calculator",

                        "vat calculator online",

                        "free vat calculator",

                        "vat tax calculator",

                        "gst vat calculator",

                        "tax calculator",

                        "sales tax calculator",

                        "tax amount calculator",

                        "tax inclusive calculator",

                        "tax exclusive calculator",

                        "calculate gst",

                        "calculate vat",

                        "calculate tax",

                        "tax inclusive price calculator",

                        "tax exclusive price calculator",

                        "base price calculator",

                        "final price after tax",

                        "ToolXone"

                    ]

                },


                canonical: {

                    href:
                        "https://www.toolxone.com/gst-vat-calculator.html"

                },


                robots: {

                    content:
                        "index,follow"

                },


                application: {

                    name:
                        "ToolXone GST / VAT Calculator"

                },


                mobile: {

                    appleTitle:
                        "GST / VAT Calculator",

                    themeColor:
                        "#0f172a"

                },


                openGraph: {

                    title:
                        "GST / VAT Calculator - Calculate Tax Amount & Final Price | ToolXone",

                    description:
                        "Calculate GST or VAT, tax amount, base price and final price instantly with ToolXone's free online GST / VAT Calculator.",

                    type:
                        "website",

                    url:
                        "https://www.toolxone.com/gst-vat-calculator.html",

                    image:
                        "https://www.toolxone.com/images/toolxone-logo.jpg",

                    imageWidth:
                        797,

                    imageHeight:
                        335,

                    imageAlt:
                        "ToolXone GST / VAT Calculator - Free Online GST and VAT Calculator",

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
                        "GST / VAT Calculator - Calculate Tax Amount & Final Price | ToolXone",

                    description:
                        "Calculate GST or VAT, tax amounts, base prices and final prices with ToolXone's free GST / VAT Calculator.",

                    image:
                        "https://www.toolxone.com/images/toolxone-logo.jpg",

                    imageAlt:
                        "ToolXone GST / VAT Calculator"

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
                        "GST / VAT Calculator",

                    url:
                        "https://www.toolxone.com/gst-vat-calculator.html",

                    description:
                        "Free online GST and VAT calculator for calculating tax amounts, base prices and final prices from a tax rate."

                },


                /* --------------------------------------------------
                   APPLICATION
                -------------------------------------------------- */

                application: {

                    name:
                        "ToolXone GST / VAT Calculator",

                    applicationCategory:
                        "FinanceApplication",

                    applicationSubCategory:
                        "GST / VAT Calculator",

                    operatingSystem:
                        "Any",

                    url:
                        "https://www.toolxone.com/gst-vat-calculator.html",

                    description:
                        "Free online GST / VAT calculator for adding tax to a price or extracting the tax component from a tax-inclusive amount.",

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
                            "GST / VAT Calculator",

                        url:
                            "https://www.toolxone.com/gst-vat-calculator.html"

                    }

                ],


                /* --------------------------------------------------
                   FAQ
                -------------------------------------------------- */

                faq: [


        {
            question:
                "What is GST / VAT?",

            answer:
                "GST (Goods and Services Tax) and VAT (Value Added Tax) are consumption taxes applied to goods and services. The terminology, rates, exemptions, and rules vary by jurisdiction, but both generally calculate tax as a percentage of a taxable amount."
        },


        {
            question:
                "How is GST or VAT calculated?",

            answer:
                "For a tax-exclusive amount, calculate the tax by multiplying the base price by the tax rate divided by 100. The final price is then the base price plus the tax amount. For example, a $100 price with a 15% tax rate produces $15 tax and a $115 final price."
        },


        {
            question:
                "What is the GST / VAT formula?",

            answer:
                "The standard tax formula for a tax-exclusive amount is: Tax Amount = Base Price × (Tax Rate ÷ 100). The final price is: Final Price = Base Price + Tax Amount."
        },


        {
            question:
                "How do I calculate GST / VAT on a tax-exclusive price?",

            answer:
                "Enter the price before tax, enter the applicable GST or VAT rate, and select the option to add tax. The calculator determines the tax amount and adds it to the base price to produce the final price."
        },


        {
            question:
                "How do I calculate GST / VAT from a tax-inclusive price?",

            answer:
                "When the entered amount already includes tax, calculate the underlying base price by dividing the tax-inclusive amount by 1 plus the tax rate divided by 100. The tax amount is then the tax-inclusive price minus the base price."
        },


        {
            question:
                "What is the formula for extracting GST / VAT from a tax-inclusive price?",

            answer:
                "The formula is: Base Price = Tax-Inclusive Price ÷ (1 + Tax Rate ÷ 100). The tax amount can then be calculated as: Tax Amount = Tax-Inclusive Price − Base Price."
        },


        {
            question:
                "What is the difference between adding tax and extracting tax?",

            answer:
                "Adding tax is used when the entered amount is before GST or VAT and you want to determine the final price after tax. Extracting tax is used when the entered amount already includes GST or VAT and you want to separate the base price from the tax component."
        },


        {
            question:
                "Can I calculate GST / VAT with decimal tax rates?",

            answer:
                "Yes. The calculator can mathematically work with decimal tax rates such as 7.5%, 12.5%, or 17.5%, provided the entered rate is valid for the calculation you are performing."
        },


        {
            question:
                "Does the GST / VAT calculator determine the legally applicable tax rate?",

            answer:
                "No. The calculator performs the mathematical calculation based on the amount and tax rate you provide. The correct tax rate, exemptions, registration requirements, filing obligations, and legal tax treatment depend on the applicable jurisdiction and transaction."
        },


        {
            question:
                "Why is tax-inclusive GST / VAT not calculated by simply multiplying the total by the tax rate?",

            answer:
                "A tax-inclusive amount already contains the tax. Multiplying the total by the tax rate would calculate the tax as though the total were tax-exclusive. To correctly extract the tax component, the tax-inclusive amount must first be divided by 1 plus the tax rate expressed as a decimal."
        },


        {
            question:
                "What is the final price after GST / VAT is added?",

            answer:
                "The final price is the base price plus the calculated tax amount. For example, a $500 base price with a 20% tax rate produces $100 tax and a final price of $600."
        },


        {
            question:
                "Can GST / VAT rates vary by country or product?",

            answer:
                "Yes. GST and VAT rates and treatments vary by jurisdiction and may also differ according to the type of product or service. Some transactions may have reduced rates, zero rates, exemptions, or special rules."
        },


        {
            question:
                "Can I use the GST / VAT calculator for invoices?",

            answer:
                "Yes. The calculator can help with the mathematical calculation of the base price, tax amount, and final price. However, official invoices should follow the applicable tax, rounding, documentation, and record-keeping requirements for the relevant jurisdiction."
        },


        {
            question:
                "Does the GST / VAT calculator provide tax or legal advice?",

            answer:
                "No. The calculator is designed to perform mathematical GST and VAT calculations. It does not determine legal tax obligations, eligibility, registration requirements, exemptions, or the tax treatment that legally applies to a particular transaction."
        }

    ]

            }

        });


    /* ==========================================================
       REGISTER PAGE
    ========================================================== */

    ToolXoneSchemaRegistry.register(

        "GSTVATCalculator",

        GSTVATCalculatorSchema

    );


    console.info(

        "✓ GST / VAT Calculator schema registered."

    );


})();