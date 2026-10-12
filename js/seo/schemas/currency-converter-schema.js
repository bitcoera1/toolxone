/*!
 * ==========================================================
 * ToolXone Currency Converter Schema
 * ----------------------------------------------------------
 * Page SEO configuration for the Currency Converter.
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

const CurrencyConverterSchema =
Object.freeze({

    version: "1.0.0",

    /* ======================================================
       META
    ====================================================== */

    meta: {

        basic: {

            title:
                "Currency Converter - Exchange Rates | ToolXone",

            description:
                "Use ToolXone's free Currency Converter to convert amounts between international currencies using the latest available exchange rates quickly and accurately.",

            keywords: [

                "currency converter",

                "currency converter online",

                "free currency converter",

                "exchange rate converter",

                "currency exchange calculator",

                "foreign exchange calculator",

                "USD to PKR converter",

                "PKR to USD converter",

                "international currency converter",

                "currency conversion calculator",

                "ToolXone"

            ]

        },

        canonical: {

            href:
                "https://www.toolxone.com/currency-converter.html"

        },

        robots: {

            content:
                "index,follow"

        },

        application: {

            name:
                "ToolXone Currency Converter"

        },

        mobile: {

            appleTitle:
                "Currency Converter",

            themeColor:
                "#0f172a"

        },

        openGraph: {

            title:
                "Currency Converter - Exchange Rates | ToolXone",

            description:
                "Convert currencies instantly with ToolXone's free online Currency Converter using the latest available exchange rates.",

            type:
                "website",

            url:
                "https://www.toolxone.com/currency-converter.html",

            image:
                "https://www.toolxone.com/images/toolxone-logo.jpg",

            imageWidth:
                797,

            imageHeight:
                335,

            imageAlt:
                "ToolXone Currency Converter - Free Online Currency Converter",

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
                "Currency Converter - Exchange Rates | ToolXone",

            description:
                "Convert international currencies quickly with ToolXone's free online Currency Converter.",

            image:
                "https://www.toolxone.com/images/toolxone-logo.jpg",

            imageAlt:
                "ToolXone Currency Converter - Free Online Currency Converter"

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
                "Currency Converter",

            url:
                "https://www.toolxone.com/currency-converter.html",

            description:
                "Free online currency converter for converting amounts between supported international currencies using the latest available exchange rates."

        },

        application: {

            name:
                "ToolXone Currency Converter",

            applicationCategory:
                "FinanceApplication",

            applicationSubCategory:
                "Currency Converter",

            operatingSystem:
                "Any",

            url:
                "https://www.toolxone.com/currency-converter.html",

            description:
                "A free online currency converter for converting amounts between supported international currencies using the latest available exchange rates.",

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
                    "Currency Converter",

                url:
                    "https://www.toolxone.com/currency-converter.html"

            }

        ],

        faq: [

            {

                question:
                    "How often are the exchange rates updated?",

                answer:
                    "ExchangeRate-API’s open endpoint updates its rate data once per day. ToolXone requests the latest available data when you perform a conversion. Retrieval time is separate from the provider’s rate-data update time."

            },

            {

                question:
                    "How do I convert currencies with ToolXone?",

                answer:
                    "Enter an amount, select the currency you are converting from, select the currency you want to convert to, and select Convert. The converter calculates the result using the applicable exchange rate."

            },

            {

                question:
                    "Can I swap the selected currencies?",

                answer:
                    "Yes. Select the Swap Currencies button to reverse the source and target currencies and perform the conversion again."

            },

            {

                question:
                    "Which currencies are supported?",

                answer:
                    "The converter includes commonly used currencies such as USD, EUR, GBP, CNY, JPY, CAD, AUD, NZD, CHF, SGD, HKD, KRW, TRY, AED, SAR, INR and PKR."

            },

            {

                question:
                    "Can I convert USD to PKR?",

                answer:
                    "Yes. Select USD as the source currency and PKR as the target currency, enter the amount and select Convert."

            },

            {

                question:
                    "Can I convert PKR to USD?",

                answer:
                    "Yes. Select PKR as the source currency and USD as the target currency. You can also use the Swap Currencies button when reversing a previous USD to PKR conversion."

            },

            {

                question:
                    "Why do currency exchange rates change?",

                answer:
                    "Exchange rates can change because of factors such as supply and demand, inflation, interest rates, economic conditions, international trade and global financial events."

            },

            {

                question:
                    "Is the Currency Converter free?",

                answer:
                    "Yes. The ToolXone Currency Converter is available online for free."

            },

            {

                question:
                    "Can I use the Currency Converter on my phone?",

                answer:
                    "Yes. The converter is designed to work in modern web browsers on desktop computers, tablets and smartphones."

            },

            {

                question:
                    "Do I need to install software to use the Currency Converter?",

                answer:
                    "No. The converter runs in your web browser and does not require dedicated software installation."

            }

        ]

    }

});

/* ==========================================================
   REGISTER PAGE
========================================================== */

ToolXoneSchemaRegistry.register(

    "CurrencyConverter",

    CurrencyConverterSchema

);

console.info(
    "✓ Currency Converter schema registered."
);

})();