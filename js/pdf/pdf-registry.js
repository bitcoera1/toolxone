/*
==========================================================
TOOLXONE PDF REGISTRY
==========================================================

RESPONSIBILITY
----------------------------------------------------------
- Single source of truth for PDF tools
- Defines PDF tool identity and relationships
- Provides registry access for the shared PDF system
- Keeps PDF tools isolated from the original ToolXone
  calculator / converter architecture

IMPORTANT
----------------------------------------------------------
- Do NOT modify the global ToolXoneToolsRegistry
- Do NOT register PDF tools inside the first 20-tool system
- PDF tools are managed exclusively through this registry
==========================================================
*/

const ToolXonePDFRegistry = Object.freeze({

    category: {
        id: "pdf",
        name: "PDF Tools",
        description: "Free online tools for converting PDF pages to images and images to PDF documents."
    },

    tools: {

        pdfToImage: {
            id: "pdf-to-image",
            name: "PDF to Image",
            file: "pdf-to-image.html",
            engine: "pdf-to-image.js",
            status: "active"
        },

        imageToPdf: {
            id: "image-to-pdf",
            name: "Image to PDF",
            file: "image-to-pdf.html",
            engine: "image-to-pdf.js",
            status: "active"
        }

    }

});


/* ==========================================================
   REGISTRY ACCESS
   ========================================================== */

function getPDFTool(toolId) {

    if (!toolId) {
        return null;
    }

    const tools = Object.values(ToolXonePDFRegistry.tools);

    return tools.find(tool => tool.id === toolId) || null;
}


function getAllPDFTools() {

    return Object.values(ToolXonePDFRegistry.tools);

}


function getActivePDFTools() {

    return getAllPDFTools().filter(tool => tool.status === "active");

}


function getPDFCategory() {

    return ToolXonePDFRegistry.category;

}


/* ==========================================================
   GLOBAL ACCESS
   ========================================================== */

window.ToolXonePDFRegistry = ToolXonePDFRegistry;

window.getPDFTool = getPDFTool;
window.getAllPDFTools = getAllPDFTools;
window.getActivePDFTools = getActivePDFTools;
window.getPDFCategory = getPDFCategory;