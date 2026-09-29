/*!
 * ==========================================================
 * ToolXone PDF Tools Schema
 * ----------------------------------------------------------
 * Page SEO configuration for the ToolXone PDF Tools Hub.
 *
 * Version : 1.0.0
 * Author  : ToolXone
 * ==========================================================
 */

(function () {

"use strict";

const PDFToolsSchema =
Object.freeze({

version:"1.0.0",

    meta: {

    basic: {

        title:
            "PDF Tools – Free Online PDF Tools for PDF to Image & Image to PDF | ToolXone",

        description:
            "Use ToolXone's free online PDF Tools to convert PDF pages to images and convert images to PDF documents. Free, practical and mobile-friendly PDF conversion tools.",

        keywords: [

            "PDF tools",

            "online PDF tools",

            "free PDF tools",

            "PDF converter",

            "PDF to image",

            "image to PDF",

            "PDF to JPG",

            "PDF to PNG",

            "PDF to WebP",

            "online PDF converter",

            "free PDF converter",

            "PDF utilities",

            "document tools",

            "ToolXone"

        ]

    },

    canonical: {

        href:
            "https://www.toolxone.com/pdf-tools.html"

    },

    robots: {

        content:
            "index,follow"

    },

    application: {

        name:
            "ToolXone PDF Tools"

    },

    mobile: {

        appleTitle:
            "PDF Tools",

        themeColor:
            "#0f172a"

    },

    openGraph: {

        title:
            "PDF Tools – Free Online PDF Tools | ToolXone",

        description:
            "Use ToolXone's free online PDF Tools to convert PDF pages to images and convert images to PDF documents with practical, easy-to-use workflows.",

        type:
            "website",

        url:
            "https://www.toolxone.com/pdf-tools.html",

        image:
            "https://www.toolxone.com/images/toolxone-logo.jpg",

        imageWidth:
            797,

        imageHeight:
            335,

        imageAlt:
            "ToolXone PDF Tools - Free Online PDF Tools",

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
            "PDF Tools - Free Online PDF Tools | ToolXone",

        description:
            "Convert PDF pages to images or turn JPG, PNG and WebP images into PDF documents with ToolXone's free online PDF Tools.",

        image:
            "https://www.toolxone.com/images/toolxone-logo.jpg",

        imageAlt:
            "ToolXone PDF Tools - Free Online PDF Tools"

    }

},

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
                "PDF Tools",

            url:
                "https://www.toolxone.com/pdf-tools.html",

            description:
                "A collection of practical online PDF tools for converting PDF pages to images and converting images into PDF documents."

        },

        application: {

            name:
                "ToolXone PDF Tools",

            applicationCategory:
                "UtilitiesApplication"

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
                    "PDF Tools",

                url:
                    "https://www.toolxone.com/pdf-tools.html"

            }

        ],

        faq: [

        {

                question:
                    "What are PDF tools?",

                answer:
                    "ToolXone currently provides two PDF conversion tools: PDF to Image and Image to PDF."

            },

            {

                question:
                    "Are ToolXone PDF tools free?",

                answer:
                        "Yes. ToolXone's current PDF tools are available free to use online, with simple workflows designed for everyday PDF conversion tasks."

            },

            {

                question:
                    "Can I convert PDF files to images?",

                answer:
                    "Yes. ToolXone's PDF to Image workflow is designed to convert PDF pages into image formats such as JPG, PNG and WebP."

            },

            {

                question:
                    "Can I convert images into PDF files?",

                answer:
                    "Yes. ToolXone's Image to PDF workflow supports common image formats including JPG, PNG and WebP."

            },

            {

                question:
                    "What PDF tasks can ToolXone support?",

                answer:
                    "You can convert PDF pages into JPG, PNG or WebP images, and convert JPG, PNG or WebP images into PDF documents."

            },

            {

                question:
                    "Can I use ToolXone PDF tools on mobile devices?",

                answer:
                    "ToolXone's online tools are designed with responsive interfaces so supported workflows can be accessed from modern desktop and mobile web browsers."

            }

        ]

    }

});


/* ==========================================================
   REGISTER PAGE
========================================================== */

ToolXoneSchemaRegistry.register(

    "PDFTools",

    PDFToolsSchema

);

})();