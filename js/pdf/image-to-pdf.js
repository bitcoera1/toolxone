/*
==========================================================
TOOLXONE IMAGE TO PDF ENGINE
----------------------------------------------------------
Image → PDF conversion engine

Version : 1.0.0
Author  : ToolXone

Responsibilities
----------------------------------------------------------
- Image file selection
- Drag & drop
- File validation
- Multiple image handling
- Image previews
- Individual image removal
- Add more images
- Clear all images
- PDF page configuration
- Page sizing
- Orientation
- Margins
- Image fitting
- PDF generation
- Progress reporting
- PDF download
- ToolXone event integration

Supported formats
----------------------------------------------------------
- JPG
- JPEG
- PNG
- WEBP

Processing
----------------------------------------------------------
Images are processed locally in the browser.

==========================================================
*/


(function (window, document) {

    "use strict";


    /* ======================================================
       CONFIGURATION
    ====================================================== */

    const CONFIG = Object.freeze({

        version: "1.2.0",

        maxFiles: 100,

        maxFileSize:
            25 * 1024 * 1024,

        acceptedTypes: [

            "image/jpeg",

            "image/png",

            "image/webp"

        ],

        acceptedExtensions: [

            ".jpg",

            ".jpeg",

            ".png",

            ".webp"

        ]

    });


    /* ======================================================
       STATE
    ====================================================== */

    const state = {

        files: [],

        generatedPdf: null,

        generatedPdfName:
            "toolxone-images.pdf",

        isGenerating: false

    };


    /* ======================================================
       DOM REFERENCES
    ====================================================== */

    let elements = {};

    let draggedFileId = null;


    /* ======================================================
       INITIALIZE
    ====================================================== */

    function init() {

        cacheElements();

        if (!elements.input) {

            console.warn(
                "ToolXone Image to PDF: required elements not found."
            );

            return;

        }


        bindEvents();

        renderPreview();

        updateWorkspace();


        console.info(
            "ToolXone Image to PDF Engine v1.2.0 initialized."
        );

    }


    /* ======================================================
       CACHE DOM
    ====================================================== */

    function cacheElements() {

        elements = {

            dropZone:
                document.getElementById(
                    "imagePdfDropZone"
                ),

            input:
                document.getElementById(
                    "imagePdfInput"
                ),

            browseBtn:
                document.getElementById(
                    "imagePdfBrowseBtn"
                ),

            addMoreBtn:
                document.getElementById(
                    "imagePdfAddMoreBtn"
                ),

            count:
                document.getElementById(
                    "imagePdfCount"
                ),

            workspace:
                document.getElementById(
                    "imagePdfWorkspace"
                ),

            fileStatus:
                document.getElementById(
                    "imagePdfFileStatus"
                ),

            previewGrid:
                document.getElementById(
                    "imagePdfPreviewGrid"
                ),

            pageSize:
                document.getElementById(
                    "imagePdfPageSize"
                ),

            orientation:
                document.getElementById(
                    "imagePdfOrientation"
                ),

            margin:
                document.getElementById(
                    "imagePdfMargin"
                ),

            fit:
                document.getElementById(
                    "imagePdfFit"
                ),

            createBtn:
                document.getElementById(
                    "imagePdfCreateBtn"
                ),

            clearBtn:
                document.getElementById(
                    "imagePdfClearBtn"
                ),

            progress:
                document.getElementById(
                    "imagePdfProgress"
                ),

            progressBar:
                document.getElementById(
                    "imagePdfProgressBar"
                ),

            progressText:
                document.getElementById(
                    "imagePdfProgressText"
                ),

            result:
                document.getElementById(
                    "imagePdfResult"
                ),

            downloadBtn:
                document.getElementById(
                    "imagePdfDownloadBtn"
                )

        };

    }


    /* ======================================================
       EVENT BINDINGS
    ====================================================== */

    function bindEvents() {


        /* --------------------------------------------------
           Browse
        -------------------------------------------------- */

        elements.browseBtn.addEventListener(
            "click",
            function () {

                elements.input.click();

            }
        );


        /* --------------------------------------------------
           Add More
        -------------------------------------------------- */

        elements.addMoreBtn.addEventListener(
            "click",
            function () {

                if (!state.isGenerating) {

                    elements.input.click();

                }

            }
        );


        /* --------------------------------------------------
           File Input
        -------------------------------------------------- */

        elements.input.addEventListener(
            "change",
            function (event) {

                handleFiles(
                    event.target.files
                );

                /*
                 * Reset input so selecting the same
                 * file again still triggers change.
                 */

                event.target.value = "";

            }
        );


        /* --------------------------------------------------
           Drag Enter
        -------------------------------------------------- */

        elements.dropZone.addEventListener(
            "dragenter",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                elements.dropZone.classList.add(
                    "is-dragover"
                );

            }
        );


        /* --------------------------------------------------
           Drag Over
        -------------------------------------------------- */

        elements.dropZone.addEventListener(
            "dragover",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                elements.dropZone.classList.add(
                    "is-dragover"
                );

            }
        );


        /* --------------------------------------------------
           Drag Leave
        -------------------------------------------------- */

        elements.dropZone.addEventListener(
            "dragleave",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                elements.dropZone.classList.remove(
                    "is-dragover"
                );

            }
        );


        /* --------------------------------------------------
           Drop
        -------------------------------------------------- */

        elements.dropZone.addEventListener(
            "drop",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                elements.dropZone.classList.remove(
                    "is-dragover"
                );


                handleFiles(
                    event.dataTransfer.files
                );

            }
        );


        /* --------------------------------------------------
           Create PDF
        -------------------------------------------------- */

        elements.createBtn.addEventListener(
            "click",
            function () {

                generatePDF();

            }
        );


        /* --------------------------------------------------
           Clear
        -------------------------------------------------- */

        elements.clearBtn.addEventListener(
            "click",
            function () {

                clearAll();

            }
        );


        /* --------------------------------------------------
           Download
        -------------------------------------------------- */

        elements.downloadBtn.addEventListener(
            "click",
            function () {

                downloadPDF();

            }
        );


        /* --------------------------------------------------
           Settings
        -------------------------------------------------- */

        [

            elements.pageSize,

            elements.orientation,

            elements.margin,

            elements.fit

        ].forEach(function (element) {

            if (element) {

                element.addEventListener(
                    "change",
                    function () {

                        clearGeneratedResult();

                    }
                );

            }

        });

    }


    /* ======================================================
       FILE HANDLING
    ====================================================== */

    function handleFiles(fileList) {

        if (!fileList || !fileList.length) {

            return;

        }


        const incoming =
            Array.from(fileList);


        let added = 0;

        let rejected = 0;


        for (
            let i = 0;
            i < incoming.length;
            i++
        ) {

            const file =
                incoming[i];


            if (
                state.files.length >=
                CONFIG.maxFiles
            ) {

                rejected +=
                    incoming.length - i;

                break;

            }


            const validation =
                validateFile(file);


            if (!validation.valid) {

                rejected++;

                continue;

            }


            /*
             * Avoid adding the exact same file
             * multiple times in one session.
             */

            const duplicate =
                state.files.some(function (item) {

                    return (

                        item.file.name ===
                            file.name &&

                        item.file.size ===
                            file.size &&

                        item.file.lastModified ===
                            file.lastModified

                    );

                });


            if (duplicate) {

                rejected++;

                continue;

            }


            state.files.push({

                id:
                    createFileId(),

                file:
                    file,

                previewUrl:
                    URL.createObjectURL(file),

                width:
                    null,

                height:
                    null,

                image:
                    null

            });


            added++;

        }


        if (added > 0) {

            clearGeneratedResult();

        }


        renderPreview();

        updateWorkspace();


        if (rejected > 0) {

            setStatus(

                added +
                " image" +
                (added === 1 ? "" : "s") +
                " added. " +
                rejected +
                " file" +
                (rejected === 1 ? "" : "s") +
                " skipped."

            );

        }
        else {

            setStatus(

                added +
                " image" +
                (added === 1 ? "" : "s") +
                " added successfully."

            );

        }

    }


    /* ======================================================
       VALIDATE FILE
    ====================================================== */

    function validateFile(file) {

        if (!file) {

            return {

                valid: false,

                reason:
                    "Invalid file."

            };

        }


        const typeValid =
            CONFIG.acceptedTypes.includes(
                file.type
            );


        const extensionValid =
            CONFIG.acceptedExtensions.some(
                function (extension) {

                    return file.name
                        .toLowerCase()
                        .endsWith(extension);

                }
            );


        if (
            !typeValid &&
            !extensionValid
        ) {

            return {

                valid: false,

                reason:
                    "Unsupported image format."

            };

        }


        if (
            file.size >
            CONFIG.maxFileSize
        ) {

            return {

                valid: false,

                reason:
                    "File exceeds the 25 MB limit."

            };

        }


        return {

            valid: true,

            reason:
                ""

        };

    }


    /* ======================================================
       FILE ID
    ====================================================== */

    function createFileId() {

        return (

            "img_" +

            Date.now().toString(36) +

            "_" +

            Math.random()
                .toString(36)
                .slice(2, 9)

        );

    }


    /* ======================================================
       RENDER PREVIEW
    ====================================================== */

    function renderPreview() {

        if (!elements.previewGrid) {

            return;

        }


        elements.previewGrid.innerHTML =
            "";


        if (!state.files.length) {

            const empty =
                document.createElement("div");


            empty.className =
                "image-pdf-empty";


            empty.textContent =
                "Add one or more images to begin.";


            elements.previewGrid.appendChild(
                empty
            );


            return;

        }


        state.files.forEach(function (item, index) {

            const card =
                document.createElement("article");


            card.className =
                "image-pdf-preview-item";


            card.dataset.id =
                item.id;

            card.draggable =
                !state.isGenerating;

            card.addEventListener(
                "dragstart",
                function (event) {

                    if (state.isGenerating) {
                        event.preventDefault();
                        return;
                    }

                    draggedFileId =
                        item.id;

                    card.classList.add(
                        "is-dragging"
                    );

                    event.dataTransfer.effectAllowed =
                        "move";

                    event.dataTransfer.setData(
                        "text/plain",
                        item.id
                    );

                }
            );

            card.addEventListener(
                "dragend",
                function () {

                    draggedFileId =
                        null;

                    card.classList.remove(
                        "is-dragging"
                    );

                    elements.previewGrid
                        .querySelectorAll(
                            ".image-pdf-preview-item"
                        )
                        .forEach(function (tile) {
                            tile.classList.remove(
                                "is-drag-over"
                            );
                        });

                }
            );

            card.addEventListener(
                "dragover",
                function (event) {

                    if (
                        state.isGenerating ||
                        !draggedFileId ||
                        draggedFileId === item.id
                    ) {
                        return;
                    }

                    event.preventDefault();

                    event.dataTransfer.dropEffect =
                        "move";

                    card.classList.add(
                        "is-drag-over"
                    );

                }
            );

            card.addEventListener(
                "dragleave",
                function () {

                    card.classList.remove(
                        "is-drag-over"
                    );

                }
            );

            card.addEventListener(
                "drop",
                function (event) {

                    if (
                        state.isGenerating ||
                        !draggedFileId
                    ) {
                        return;
                    }

                    event.preventDefault();

                    card.classList.remove(
                        "is-drag-over"
                    );

                    reorderFiles(
                        draggedFileId,
                        item.id
                    );

                }
            );


            /* --------------------------------------------
               Remove Button
            -------------------------------------------- */

            const removeBtn =
                document.createElement("button");


            removeBtn.type =
                "button";


            removeBtn.className =
                "image-pdf-remove-btn";


            removeBtn.setAttribute(
                "aria-label",
                "Remove " + item.file.name
            );


            removeBtn.title =
                "Remove image";


            removeBtn.textContent =
                "×";


            removeBtn.addEventListener(
                "click",
                function () {

                    removeFile(
                        item.id
                    );

                }
            );


            /* --------------------------------------------
               Image Wrapper
            -------------------------------------------- */

            const imageWrap =
                document.createElement("div");


            imageWrap.className =
                "image-pdf-preview-image-wrap";


            const image =
                document.createElement("img");


            image.src =
                item.previewUrl;


            image.alt =
                item.file.name;


            image.loading =
                "lazy";


            image.addEventListener(
                "load",
                function () {

                    item.width =
                        image.naturalWidth;

                    item.height =
                        image.naturalHeight;

                }
            );


            imageWrap.appendChild(
                image
            );

            const pageBadge =
                document.createElement(
                    "span"
                );

            pageBadge.className =
                "image-pdf-page-badge";

            pageBadge.textContent =
                "Page " + (index + 1);

            imageWrap.appendChild(
                pageBadge
            );

            const dragHandle =
                document.createElement(
                    "span"
                );

            dragHandle.className =
                "image-pdf-drag-handle";

            dragHandle.textContent =
                "⋮⋮";

            dragHandle.setAttribute(
                "aria-hidden",
                "true"
            );

            imageWrap.appendChild(
                dragHandle
            );


            /* --------------------------------------------
               Information
            -------------------------------------------- */

            const info =
                document.createElement("div");


            info.className =
                "image-pdf-preview-info";


            const name =
                document.createElement("p");


            name.className =
                "image-pdf-preview-name";


            name.textContent =
                (index + 1) +
                ". " +
                item.file.name;


            const size =
                document.createElement("p");


            size.className =
                "image-pdf-preview-size";


            size.textContent =
                formatFileSize(
                    item.file.size
                );


            info.appendChild(
                name
            );


            info.appendChild(
                size
            );


            card.appendChild(
                removeBtn
            );


            card.appendChild(
                imageWrap
            );


            card.appendChild(
                info
            );


            elements.previewGrid.appendChild(
                card
            );

        });

    }


    /* ======================================================
       REORDER FILES
    ====================================================== */

    function reorderFiles(
        sourceId,
        targetId
    ) {

        if (
            !sourceId ||
            !targetId ||
            sourceId === targetId ||
            state.isGenerating
        ) {
            return;
        }

        const fromIndex =
            state.files.findIndex(
                function (item) {
                    return item.id === sourceId;
                }
            );

        const toIndex =
            state.files.findIndex(
                function (item) {
                    return item.id === targetId;
                }
            );

        if (
            fromIndex === -1 ||
            toIndex === -1
        ) {
            return;
        }

        const moved =
            state.files.splice(
                fromIndex,
                1
            )[0];

        state.files.splice(
            toIndex,
            0,
            moved
        );

        clearGeneratedResult();

        renderPreview();

        updateWorkspace();

        setStatus(
            "Page order updated."
        );

    }


    /* ======================================================
       REMOVE FILE
    ====================================================== */

    function removeFile(id) {

        const index =
            state.files.findIndex(
                function (item) {

                    return item.id === id;

                }
            );


        if (index === -1) {

            return;

        }


        const item =
            state.files[index];


        if (item.previewUrl) {

            URL.revokeObjectURL(
                item.previewUrl
            );

        }


        state.files.splice(
            index,
            1
        );


        clearGeneratedResult();

        renderPreview();

        updateWorkspace();


        setStatus(

            state.files.length +

            " image" +

            (
                state.files.length === 1
                    ? ""
                    : "s"
            ) +

            " remaining."

        );

    }


    /* ======================================================
       CLEAR ALL
    ====================================================== */

    function clearAll() {

        if (state.isGenerating) {

            return;

        }


        state.files.forEach(
            function (item) {

                if (item.previewUrl) {

                    URL.revokeObjectURL(
                        item.previewUrl
                    );

                }

            }
        );


        state.files = [];

        clearGeneratedResult();

        renderPreview();

        updateWorkspace();


        setStatus(
            "All images cleared."
        );


        /*
         * Keep the restored upload area in view after the
         * populated workspace collapses.
         */

        if (elements.dropZone) {

            elements.dropZone.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    }


/* ======================================================
   WORKSPACE VISIBILITY
====================================================== */

function updateWorkspace() {

    if (!elements.workspace) {
        return;
    }

    const hasImages =
        state.files.length > 0;


    /*
     * --------------------------------------------------
     * INITIAL UPLOAD AREA
     * --------------------------------------------------
     *
     * Visible only when there are no images.
     *
     * IMPORTANT:
     * Use display:none with !important instead of only
     * the hidden attribute because the drop-zone CSS may
     * explicitly define its display property.
     */

    if (elements.dropZone) {

        if (hasImages) {

            elements.dropZone.hidden = true;

            elements.dropZone.style.setProperty(
                "display",
                "none",
                "important"
            );

        }
        else {

            elements.dropZone.hidden = false;

            elements.dropZone.style.removeProperty(
                "display"
            );

        }

    }


    /*
     * --------------------------------------------------
     * IMAGE WORKSPACE
     * --------------------------------------------------
     *
     * Hidden until at least one image exists.
     *
     * Once images are uploaded, this becomes the
     * active workspace containing:
     *
     * - Your Images
     * - PDF Pages
     * - PDF Settings
     * - Create PDF
     * - Clear All
     */

    elements.workspace.hidden =
        !hasImages;


    /*
     * --------------------------------------------------
     * IMAGE COUNT
     * --------------------------------------------------
     */

    if (elements.count) {

        elements.count.textContent =
            state.files.length +
            " image" +
            (
                state.files.length === 1
                    ? ""
                    : "s"
            );

    }


    /*
     * --------------------------------------------------
     * CREATE PDF BUTTON
     * --------------------------------------------------
     */

    if (elements.createBtn) {

        elements.createBtn.disabled =
            !hasImages ||
            state.isGenerating;

    }

}


    /* ======================================================
       STATUS
    ====================================================== */

    function setStatus(message) {

        if (
            elements.fileStatus
        ) {

            elements.fileStatus.textContent =
                message || "";

        }

    }


    /* ======================================================
       PDF GENERATION
    ====================================================== */

    async function generatePDF() {

        if (state.isGenerating) {

            return;

        }


        if (!state.files.length) {

            setStatus(
                "Please add at least one image."
            );

            return;

        }


        if (
            !window.jspdf ||
            !window.jspdf.jsPDF
        ) {

            setStatus(
                "PDF engine is unavailable. Please reload the page and try again."
            );

            console.error(
                "ToolXone Image to PDF: jsPDF was not loaded."
            );

            return;

        }


        state.isGenerating =
            true;


        clearGeneratedResult();

        setGeneratingState(
            true
        );


        try {

            const settings =
                getSettings();


            const jsPDF =
                window.jspdf.jsPDF;


            let pdf =
                null;


            for (
                let i = 0;
                i < state.files.length;
                i++
            ) {

                const item =
                    state.files[i];


                updateProgress(

                    i /
                    state.files.length *
                    100,

                    "Preparing image " +
                    (i + 1) +
                    " of " +
                    state.files.length +
                    "..."

                );


                const imageData =
                    await loadImageForPDF(
                        item
                    );


                const page =
                    calculatePage(
                        imageData.width,
                        imageData.height,
                        settings
                    );


                if (!pdf) {

                    pdf =
                        new jsPDF({

                            orientation:
                                page.orientation,

                            unit:
                                "pt",

                            format:
                                page.format,

                            compress:
                                true

                        });

                }
                else {

                    pdf.addPage(

                        page.format,

                        page.orientation

                    );

                }


                const pageDimensions =
                    getPageDimensions(
                        page.format,
                        page.orientation
                    );


                const placement =
                    calculateImagePlacement(

                        imageData.width,

                        imageData.height,

                        pageDimensions.width,

                        pageDimensions.height,

                        settings

                    );


                pdf.addImage(

                    imageData.data,

                    imageData.format,

                    placement.x,

                    placement.y,

                    placement.width,

                    placement.height,

                    undefined,

                    "FAST"

                );


                updateProgress(

                    (
                        (i + 1) /
                        state.files.length
                    ) * 100,

                    "Added page " +
                    (i + 1) +
                    " of " +
                    state.files.length

                );

            }


            if (!pdf) {

                throw new Error(
                    "Unable to create PDF."
                );

            }


            updateProgress(
                100,
                "Finalizing PDF..."
            );


            const blob =
                pdf.output(
                    "blob"
                );


            state.generatedPdf =
                blob;


            state.generatedPdfName =
                buildFileName();


            showResult();


            trackConversion();


            setStatus(
                "PDF created successfully."
            );


        }
        catch (error) {

            console.error(
                "ToolXone Image to PDF generation failed:",
                error
            );


            setStatus(
                "Unable to create the PDF. Please check your images and try again."
            );


        }
        finally {

            state.isGenerating =
                false;


            setGeneratingState(
                false
            );

        }

    }


    /* ======================================================
       SETTINGS
    ====================================================== */

    function getSettings() {

        return {

            pageSize:
                elements.pageSize
                    ? elements.pageSize.value
                    : "a4",

            orientation:
                elements.orientation
                    ? elements.orientation.value
                    : "auto",

            margin:
                elements.margin
                    ? elements.margin.value
                    : "normal",

            fit:
                elements.fit
                    ? elements.fit.value
                    : "contain"

        };

    }


    /* ======================================================
       PAGE CALCULATION
    ====================================================== */

    function calculatePage(
        imageWidth,
        imageHeight,
        settings
    ) {

        let orientation =
            settings.orientation;


        if (
            orientation === "auto"
        ) {

            orientation =
                imageWidth >= imageHeight
                    ? "landscape"
                    : "portrait";

        }


        /*
         * "Auto" page size is intentionally
         * represented using A4 here.
         *
         * The image is still scaled proportionally.
         */

        let format =
            settings.pageSize;


        if (
            format === "auto"
        ) {

            format =
                "a4";

        }


        return {

            format:
                format,

            orientation:
                orientation

        };

    }


    /* ======================================================
       PAGE DIMENSIONS
       ====================================================== */

    function getPageDimensions(
        format,
        orientation
    ) {

        const sizes = {

            a4: {

                width:
                    595.28,

                height:
                    841.89

            },

            letter: {

                width:
                    612,

                height:
                    792

            },

            legal: {

                width:
                    612,

                height:
                    1008

            }

        };


        const base =
            sizes[format] ||
            sizes.a4;


        if (
            orientation ===
            "landscape"
        ) {

            return {

                width:
                    base.height,

                height:
                    base.width

            };

        }


        return {

            width:
                base.width,

            height:
                base.height

        };

    }


    /* ======================================================
       IMAGE PLACEMENT
    ====================================================== */

    function calculateImagePlacement(

        imageWidth,

        imageHeight,

        pageWidth,

        pageHeight,

        settings

    ) {

        const margin =
            getMargin(settings.margin);


        const availableWidth =
            pageWidth -
            margin.left -
            margin.right;


        const availableHeight =
            pageHeight -
            margin.top -
            margin.bottom;


        let width =
            imageWidth;


        let height =
            imageHeight;


        const ratio =
            imageWidth /
            imageHeight;


        /* --------------------------------------------------
           ORIGINAL
        -------------------------------------------------- */

        if (
            settings.fit ===
            "original"
        ) {

            /*
             * Preserve the image's pixel-derived
             * dimensions but scale down if it
             * cannot physically fit on the page.
             */

            const scale =
                Math.min(

                    1,

                    availableWidth /
                    width,

                    availableHeight /
                    height

                );


            width *=
                scale;

            height *=
                scale;

        }


        /* --------------------------------------------------
           CONTAIN
        -------------------------------------------------- */

        else if (
            settings.fit ===
            "contain"
        ) {

            const scale =
                Math.min(

                    availableWidth /
                    imageWidth,

                    availableHeight /
                    imageHeight

                );


            width =
                imageWidth *
                scale;


            height =
                imageHeight *
                scale;

        }


        /* --------------------------------------------------
           COVER
        -------------------------------------------------- */

        else if (
            settings.fit ===
            "cover"
        ) {

            const scale =
                Math.max(

                    availableWidth /
                    imageWidth,

                    availableHeight /
                    imageHeight

                );


            width =
                imageWidth *
                scale;


            height =
                imageHeight *
                scale;


            /*
             * For PDF generation we do not crop
             * the image outside the page. Instead
             * center it and clip visually by the
             * page boundary.
             */

        }


        /*
         * Safety fallback.
         */

        if (
            !Number.isFinite(width) ||
            !Number.isFinite(height) ||
            width <= 0 ||
            height <= 0
        ) {

            width =
                availableWidth;

            height =
                width /
                ratio;

        }


        const x =
            margin.left +
            (
                availableWidth -
                width
            ) / 2;


        const y =
            margin.top +
            (
                availableHeight -
                height
            ) / 2;


        return {

            x:
                x,

            y:
                y,

            width:
                width,

            height:
                height

        };

    }


    /* ======================================================
       MARGIN
    ====================================================== */

    function getMargin(
        value
    ) {

        switch (value) {

            case "none":

                return {

                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0

                };


            case "small":

                return {

                    top: 18,
                    right: 18,
                    bottom: 18,
                    left: 18

                };


            case "normal":

            default:

                return {

                    top: 36,
                    right: 36,
                    bottom: 36,
                    left: 36

                };

        }

    }


    /* ======================================================
       LOAD IMAGE
    ====================================================== */

    function loadImageForPDF(
        item
    ) {

        return new Promise(
            function (resolve, reject) {

                const image =
                    new Image();


                image.onload =
                    function () {

                        try {

                            const result =
                                convertImageToPDFData(
                                    image
                                );


                            item.width =
                                image.naturalWidth;

                            item.height =
                                image.naturalHeight;

                            item.image =
                                image;


                            resolve(
                                result
                            );

                        }
                        catch (error) {

                            reject(
                                error
                            );

                        }

                    };


                image.onerror =
                    function () {

                        reject(
                            new Error(
                                "Unable to load image: " +
                                item.file.name
                            )
                        );

                    };


                image.src =
                    item.previewUrl;

            }
        );

    }


    /* ======================================================
       CONVERT IMAGE DATA
    ====================================================== */

    function convertImageToPDFData(
        image
    ) {

        const canvas =
            document.createElement(
                "canvas"
            );


        const width =
            image.naturalWidth ||
            image.width;


        const height =
            image.naturalHeight ||
            image.height;


        canvas.width =
            width;

        canvas.height =
            height;


        const context =
            canvas.getContext(
                "2d",
                {
                    alpha: false
                }
            );


        if (!context) {

            throw new Error(
                "Canvas rendering is unavailable."
            );

        }


        /*
         * White background prevents transparent
         * PNG / WEBP pixels from becoming black
         * or undefined in JPEG output.
         */

        context.fillStyle =
            "#ffffff";


        context.fillRect(
            0,
            0,
            width,
            height
        );


        context.drawImage(
            image,
            0,
            0,
            width,
            height
        );


        /*
         * JPEG provides broad compatibility
         * with PDF embedding.
         */

        const data =
            canvas.toDataURL(
                "image/jpeg",
                0.92
            );


        return {

            data:
                data,

            format:
                "JPEG",

            width:
                width,

            height:
                height

        };

    }


    /* ======================================================
       BUILD FILE NAME
    ====================================================== */

    function buildFileName() {

        const date =
            new Date();


        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );


        return (

            "toolxone-images-" +

            year +

            month +

            day +

            ".pdf"

        );

    }


    /* ======================================================
       DOWNLOAD PDF
    ====================================================== */

    function downloadPDF() {

        if (
            !state.generatedPdf
        ) {

            setStatus(
                "Create the PDF before downloading."
            );

            return;

        }


        const url =
            URL.createObjectURL(
                state.generatedPdf
            );


        const anchor =
            document.createElement(
                "a"
            );


        anchor.href =
            url;


        anchor.download =
            state.generatedPdfName;


        document.body.appendChild(
            anchor
        );


        anchor.click();


        anchor.remove();


        setTimeout(
            function () {

                URL.revokeObjectURL(
                    url
                );

            },
            1000
        );


        emitToolEvent(
            "image_to_pdf_download",
            {

                fileCount:
                    state.files.length,

                fileName:
                    state.generatedPdfName

            }
        );

    }


    /* ======================================================
       RESULT
    ====================================================== */

    function showResult() {

        if (!elements.result) {

            return;

        }


        /*
         * Keep the generated PDF result inside the
         * current ToolXone workspace.
         *
         * Do not force the browser to scroll the user
         * to another section after conversion. The
         * workspace remains in control of the viewport.
         */

        elements.result.hidden =
            false;

    }


    /* ======================================================
       CLEAR GENERATED RESULT
    ====================================================== */

    function clearGeneratedResult() {

        state.generatedPdf =
            null;


        if (elements.result) {

            elements.result.hidden =
                true;

        }


        if (elements.progress) {

            elements.progress.hidden =
                true;

        }


        if (elements.progressBar) {

            elements.progressBar.style.width =
                "0%";

        }

    }


    /* ======================================================
       GENERATING STATE
    ====================================================== */

    function setGeneratingState(
        generating
    ) {

        if (elements.createBtn) {

            elements.createBtn.disabled =
                generating ||
                state.files.length === 0;


            elements.createBtn.textContent =
                generating
                    ? "⏳ Creating PDF..."
                    : "📄 Create PDF";

        }


        if (elements.clearBtn) {

            elements.clearBtn.disabled =
                generating;

        }


        if (elements.addMoreBtn) {

            elements.addMoreBtn.disabled =
                generating;

        }


        if (elements.progress) {

            elements.progress.hidden =
                !generating;

        }

    }


    /* ======================================================
       PROGRESS
    ====================================================== */

    function updateProgress(
        percentage,
        message
    ) {

        const safePercentage =
            Math.max(

                0,

                Math.min(
                    100,
                    percentage
                )

            );


        if (elements.progressBar) {

            elements.progressBar.style.width =
                safePercentage + "%";

        }


        if (elements.progressText) {

            elements.progressText.textContent =
                message || "";

        }

    }


    /* ======================================================
       FILE SIZE
    ====================================================== */

    function formatFileSize(
        bytes
    ) {

        if (
            !Number.isFinite(bytes) ||
            bytes <= 0
        ) {

            return "0 KB";

        }


        const units = [

            "Bytes",
            "KB",
            "MB",
            "GB"

        ];


        const index =
            Math.min(

                Math.floor(
                    Math.log(bytes) /
                    Math.log(1024)
                ),

                units.length - 1

            );


        const value =
            bytes /
            Math.pow(
                1024,
                index
            );


        return (

            value.toFixed(
                index === 0
                    ? 0
                    : 1
            ) +

            " " +

            units[index]

        );

    }


    /* ======================================================
       STATISTICS / TOOL EVENTS
    ====================================================== */

    function trackConversion() {

        emitToolEvent(

            "image_to_pdf_conversion",

            {

                fileCount:
                    state.files.length,

                totalBytes:
                    state.files.reduce(
                        function (
                            total,
                            item
                        ) {

                            return (
                                total +
                                item.file.size
                            );

                        },
                        0
                    ),

                pageSize:
                    elements.pageSize
                        ? elements.pageSize.value
                        : "a4",

                orientation:
                    elements.orientation
                        ? elements.orientation.value
                        : "auto",

                fit:
                    elements.fit
                        ? elements.fit.value
                        : "contain"

            }

            
        );
if (
    typeof ToolXoneStatisticsEvents !== "undefined" &&
    typeof ToolXoneStatisticsEvents.recordConversion === "function"
) {
    ToolXoneStatisticsEvents.recordConversion("image-to-pdf");
}

    }


    function emitToolEvent(
        eventName,
        detail
    ) {

        try {

            document.dispatchEvent(

                new CustomEvent(
                    "toolxone:tool-event",
                    {

                        detail: {

                            tool:
                                "image-to-pdf",

                            event:
                                eventName,

                            data:
                                detail || {},

                            timestamp:
                                Date.now()

                        }

                    }
                )

            );

        }
        catch (error) {

            /*
             * Older browsers without
             * CustomEvent support should
             * not break the converter.
             */

            console.debug(
                "ToolXone event unavailable.",
                error
            );

        }

    }


    /* ======================================================
       PUBLIC API
    ====================================================== */

    window.ToolXoneImageToPDF = {

        version:
            CONFIG.version,

        getFiles:
            function () {

                return state.files.map(
                    function (item) {

                        return item.file;

                    }
                );

            },

        clear:
            clearAll,

        generate:
            generatePDF,

        download:
            downloadPDF

    };


    /* ======================================================
       START
    ====================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    }
    else {

        init();

    }


})(window, document);