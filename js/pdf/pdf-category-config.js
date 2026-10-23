/*
==========================================================
TOOLXONE PDF CATEGORY CONFIG
Version 1.0.0
==========================================================

RESPONSIBILITY
----------------------------------------------------------
- Canonical PDF tools ecosystem configuration
- PDF category presentation
- PDF sub-category definitions
- Tool grouping and ordering
- Conversion workflow definitions
- SEO-friendly category metadata

IMPORTANT
----------------------------------------------------------
This file defines the PDF ecosystem only.

Actual tool definitions remain in:

    ToolXoneToolsRegistry

Actual tool engines remain in their dedicated modules.

This configuration must NOT contain:
- Tool calculation/conversion logic
- DOM manipulation
- Rendering logic
- File processing logic
- PDF engine implementation

==========================================================
*/


(function (window) {

    "use strict";


    /* ======================================================
       PDF CATEGORY IDENTITY
       ====================================================== */

    const PDF_CATEGORY = {

        id:
            "pdf",

        name:
            "PDF Tools",

        shortName:
            "PDF",

        icon:
            "📄",

        description:
            "Online tools for converting PDF pages to images and images to PDF documents.",

        shortDescription:
            "Convert PDF pages to images and images to PDF online.",

        theme:
            "pdf",

        order:
            10

    };


    /* ======================================================
       PDF SEO IDENTITY
       ====================================================== */

    const seo = {

        title:
            "Free Online PDF Tools - PDF to Image & Image to PDF | ToolXone",

        description:
            "Use ToolXone's free online tools to convert PDF pages to images and JPG, PNG and WebP images into PDF documents.",

        keywords: [

            "PDF tools",

            "free PDF tools",

            "online PDF tools",

            "PDF converter",

            "PDF converter online",

            "PDF to image",

            "image to PDF",

            "PDF utility"

        ]

    };


    /* ======================================================
       SUB-CATEGORY DEFINITIONS
       ====================================================== */

    const subcategories = [
        {
            id: "convert",
            name: "Convert PDF",
            icon: "🔄",
            description: "Convert PDF pages to JPG, PNG or WebP images, and convert supported images into PDF documents.",
            order: 1,
            tools: ["pdf-to-image", "image-to-pdf"]
        }
    ];

    const featuredTools = ["pdf-to-image", "image-to-pdf"];

    /* ======================================================
       CONVERSION WORKFLOW DEFINITIONS
       ====================================================== */

    const conversionWorkflows = [

        {

            id:
                "image-to-pdf",

            name:
                "Image to PDF",

            direction:
                "image-to-pdf",

            inputTypes: [

                "image/jpeg",

                "image/png",

                "image/webp"

            ],

            inputExtensions: [

                ".jpg",

                ".jpeg",

                ".png",

                ".webp"

            ],

            outputType:
                "application/pdf",

            outputExtension:
                ".pdf",

            multipleFiles:
                true,

            description:
                "Convert JPG, PNG, and WebP images into PDF documents."

        },


        {

            id:
                "pdf-to-image",

            name:
                "PDF to Image",

            direction:
                "pdf-to-image",

            inputTypes: [

                "application/pdf"

            ],

            inputExtensions: [

                ".pdf"

            ],

            outputTypes: [

                "image/jpeg",

                "image/png",

                "image/webp"

            ],

            outputExtensions: [

                ".jpg",

                ".png",

                ".webp"

            ],

            multipleFiles:
                false,

            description:
                "Convert PDF pages into JPG, PNG, or WebP images."

        }

    ];


    /* ======================================================
       PDF CAPABILITY GROUPS
       ====================================================== */

    const capabilities = { convert: true };

    /* ======================================================
       CATEGORY NAVIGATION
       ====================================================== */

    const navigation = [
        { id: "convert", label: "Convert", icon: "🔄" }
    ];


    /* ======================================================
       PUBLIC API
       ====================================================== */

    const PDF_CONFIG = {

        category:
            PDF_CATEGORY,

        seo:
            seo,

        subcategories:
            subcategories,

        featuredTools:
            featuredTools,

        conversionWorkflows:
            conversionWorkflows,

        capabilities:
            capabilities,

        navigation:
            navigation

    };


    /* ======================================================
       HELPER METHODS
       ====================================================== */

    PDF_CONFIG.getSubcategory =
        function (id) {

            return subcategories.find(
                function (subcategory) {

                    return (
                        subcategory &&
                        subcategory.id === id
                    );

                }
            ) || null;

        };


    PDF_CONFIG.getToolIds =
        function () {

            return subcategories.reduce(
                function (allTools, subcategory) {

                    return allTools.concat(
                        subcategory.tools
                    );

                },
                []
            );

        };


    PDF_CONFIG.getConversionWorkflow =
        function (id) {

            return conversionWorkflows.find(
                function (workflow) {

                    return (
                        workflow &&
                        workflow.id === id
                    );

                }
            ) || null;

        };


    PDF_CONFIG.getNavigation =
        function () {

            return [
                ...navigation
            ];

        };


    PDF_CONFIG.getFeaturedTools =
        function () {

            return [
                ...featuredTools
            ];

        };


    /* ======================================================
       GLOBAL EXPOSURE
       ====================================================== */

    window.ToolXonePDFCategory =
        PDF_CONFIG;


    /* ======================================================
       DIAGNOSTICS
       ====================================================== */

    console.info(
        "ToolXone PDF Category Config v1.0.0 initialized.",
        {
            category:
                PDF_CATEGORY.id,

            subcategories:
                subcategories.length,

            conversionWorkflows:
                conversionWorkflows.length,

            featuredTools:
                featuredTools.length

        }
    );


})(window);