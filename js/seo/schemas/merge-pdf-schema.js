(function () {
    "use strict";

    const schema = Object.freeze({
        version: "1.0.0",
        meta: {
            basic: {
                title: "Merge PDF Files Online Free | ToolXone",
                description: "Combine multiple PDF files into one document. Arrange files in order and merge them locally in your browser with ToolXone.",
                keywords: ["merge PDF", "combine PDF files", "join PDF", "PDF merger", "merge PDF online"]
            },
            canonical: { href: "https://www.toolxone.com/merge-pdf.html" },
            robots: { content: "index,follow" },
            application: { name: "ToolXone Merge PDF" },
            mobile: { appleTitle: "Merge PDF", themeColor: "#0f172a" },
            openGraph: {
                title: "Merge PDF Files Online Free | ToolXone",
                description: "Combine PDFs in your chosen order. Files are processed locally in your browser.",
                type: "website", url: "https://www.toolxone.com/merge-pdf.html",
                image: "https://www.toolxone.com/images/merge-pdf.png",
                imageWidth: 1536, imageHeight: 1024, imageAlt: "Three PDF documents flowing into one merged PDF", siteName: "ToolXone", locale: "en_US"
            },
            twitter: {
                card: "summary_large_image", site: "@ToolXone",
                title: "Merge PDF Files Online | ToolXone",
                description: "Arrange and combine PDF files locally in your browser.",
                image: "https://www.toolxone.com/images/merge-pdf.png", imageAlt: "Three PDF documents flowing into one merged PDF"
            }
        },
        schema: {
            organization: { name: "ToolXone", url: "https://www.toolxone.com", logo: undefined, description: undefined, email: undefined, sameAs: undefined },
            webpage: {
                name: "Merge PDF",
                url: "https://www.toolxone.com/merge-pdf.html",
                description: "Combine multiple PDF documents in a chosen order in the browser.", isPartOf: undefined, breadcrumb: undefined
            },
            application: { name: "ToolXone Merge PDF", applicationCategory: "UtilitiesApplication" },
            breadcrumbs: [
                { name: "Home", url: "https://www.toolxone.com/" },
                { name: "PDF Tools", url: "https://www.toolxone.com/pdf-tools.html" },
                { name: "Merge PDF", url: "https://www.toolxone.com/merge-pdf.html" }
            ],
            get faq() {
                const entries = window.ToolXoneContentRegistry && window.ToolXoneContentRegistry.get("faq", "merge-pdf");
                return Array.isArray(entries) ? entries : [];
            }
        }
    });

    ToolXoneSchemaRegistry.register("MergePDF", schema);
})();
