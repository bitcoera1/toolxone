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
- Future PDF ecosystem extensibility

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

        /* --------------------------------------------------
           01 — ORGANIZE
           -------------------------------------------------- */

        {

            id:
                "organize",

            name:
                "Organize PDF",

            icon:
                "🗂️",

            description:
                "Organize PDF pages and documents with practical page management tools.",

            order:
                1,

            tools: [

                "merge-pdf",

                "split-pdf",

                "extract-pdf-pages",

                "remove-pdf-pages",

                "reorder-pdf-pages"

            ]

        },


        /* --------------------------------------------------
           02 — COMPRESS & OPTIMIZE
           -------------------------------------------------- */

        {

            id:
                "compress-optimize",

            name:
                "Compress & Optimize",

            icon:
                "⚡",

            description:
                "Reduce PDF file size and optimize documents for easier storage and sharing.",

            order:
                2,

            tools: [

                "compress-pdf",

                "optimize-pdf",

                "repair-pdf"

            ]

        },


        /* --------------------------------------------------
           03 — CONVERT
           -------------------------------------------------- */

        {

            id:
                "convert",

            name:
                "Convert PDF",

            icon:
                "🔄",

            description:
                "Convert PDF pages to JPG, PNG or WebP images, and convert supported images into PDF documents.",

            order:
                3,

            tools: [

                "image-to-pdf",

                "pdf-to-image",

                "word-to-pdf",

                "excel-to-pdf",

                "powerpoint-to-pdf",

                "pdf-to-office"

            ]

        },


        /* --------------------------------------------------
           04 — EDIT
           -------------------------------------------------- */

        {

            id:
                "edit",

            name:
                "Edit PDF",

            icon:
                "✏️",

            description:
                "Make practical changes to PDF documents including rotation, cropping, watermarks, and page numbering.",

            order:
                4,

            tools: [

                "rotate-pdf",

                "crop-pdf",

                "watermark-pdf",

                "add-page-numbers",

                "edit-pdf"

            ]

        },


        /* --------------------------------------------------
           05 — SECURITY
           -------------------------------------------------- */

        {

            id:
                "security",

            name:
                "PDF Security",

            icon:
                "🔐",

            description:
                "Protect and manage PDF documents with security and privacy-focused tools.",

            order:
                5,

            tools: [

                "protect-pdf",

                "unlock-pdf",

                "sign-pdf",

                "redact-pdf"

            ]

        },


        /* --------------------------------------------------
           06 — EXTRACT & OCR
           -------------------------------------------------- */

        {

            id:
                "extract-ocr",

            name:
                "Extract & OCR",

            icon:
                "🔍",

            description:
                "Extract useful information from PDFs and work with scanned documents using OCR.",

            order:
                6,

            tools: [

                "ocr-pdf",

                "extract-pdf-text",

                "extract-pdf-images",

                "pdf-metadata"

            ]

        },


        /* --------------------------------------------------
           07 — PDF INTELLIGENCE
           -------------------------------------------------- */

        {

            id:
                "intelligence",

            name:
                "PDF Intelligence",

            icon:
                "🤖",

            description:
                "Use intelligent PDF workflows to understand, summarize, translate, and work with documents.",

            order:
                7,

            tools: [

                "summarize-pdf",

                "ask-pdf",

                "translate-pdf"

            ]

        }

    ];


    /* ======================================================
       FEATURED PDF TOOLS
       ======================================================

       These are the tools we expect to become major
       entry points within the PDF ecosystem.

       They can be changed later without modifying the
       category architecture.
       ====================================================== */

    const featuredTools = [

        "image-to-pdf",

        "pdf-to-image",

        "merge-pdf",

        "compress-pdf",

        "split-pdf",

        "ocr-pdf"

    ];


    /* ======================================================
       NEWEST / DEVELOPMENT PRIORITY
       ====================================================== */

    const developmentPriority = [

        "image-to-pdf",

        "pdf-to-image",

        "merge-pdf",

        "split-pdf",

        "compress-pdf"

    ];


    /* ======================================================
       CONVERSION WORKFLOW DEFINITIONS
       ======================================================

       These definitions intentionally describe the
       USER WORKFLOW rather than individual formats.

       Example:

           PDF → JPG
           PDF → PNG
           PDF → WEBP

       become:

           PDF → Image

       Likewise:

           JPG → PDF
           PNG → PDF
           WEBP → PDF

       become:

           Image → PDF

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
                "Convert JPG, PNG, and WebP images into PDF documents.",

            futureOptions: [

                "page-size",

                "orientation",

                "margin",

                "image-fit",

                "image-quality",

                "page-order"

            ]

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
                "Convert PDF pages into JPG, PNG, or WebP images.",

            futureOptions: [

                "page-selection",

                "image-quality",

                "resolution",

                "output-format",

                "zip-download"

            ]

        }

    ];


    /* ======================================================
       PDF CAPABILITY GROUPS
       ====================================================== */

    const capabilities = {

        organize:
            true,

        compress:
            true,

        convert:
            true,

        edit:
            true,

        security:
            true,

        extraction:
            true,

        ocr:
            true,

        intelligence:
            true

    };


    /* ======================================================
       CATEGORY NAVIGATION
       ====================================================== */

    const navigation = [

        {

            id:
                "organize",

            label:
                "Organize",

            icon:
                "🗂️"

        },

        {

            id:
                "compress-optimize",

            label:
                "Compress & Optimize",

            icon:
                "⚡"

        },

        {

            id:
                "convert",

            label:
                "Convert",

            icon:
                "🔄"

        },

        {

            id:
                "edit",

            label:
                "Edit",

            icon:
                "✏️"

        },

        {

            id:
                "security",

            label:
                "Security",

            icon:
                "🔐"

        },

        {

            id:
                "extract-ocr",

            label:
                "Extract & OCR",

            icon:
                "🔍"

        },

        {

            id:
                "intelligence",

            label:
                "PDF Intelligence",

            icon:
                "🤖"

        }

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

        developmentPriority:
            developmentPriority,

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