/*!
 * ==========================================================
 * ToolXone PDF to Image Engine
 * ----------------------------------------------------------
 * PDF → JPG / PNG / WEBP
 *
 * Version : 1.0.0
 * Author  : ToolXone
 *
 * Responsibilities
 * ----------------------------------------------------------
 * - PDF file loading
 * - PDF.js integration
 * - Page preview rendering
 * - Page selection
 * - Image format selection
 * - Image quality / resolution
 * - Browser-side conversion
 * - Individual downloads
 * - Download all
 * - Clear / reset
 *
 * ==========================================================
 */

(function (window, document) {

    "use strict";


    /* ======================================================
       CONFIGURATION
    ====================================================== */

    const CONFIG = {

        version:
            "1.0.0",

        maxFileSize:
            100 * 1024 * 1024,

        defaultFormat:
            "jpg",

        defaultQuality:
            "high",

        defaultScale:
            1,

        defaultBackground:
            "white",

        supportedFormats: [

            "jpg",

            "png",

            "webp"

        ],

        supportedExtensions: [

            ".pdf"

        ]

    };


    /* ======================================================
       DOM REFERENCES
    ====================================================== */

    const elements = {

        dropZone:
            document.getElementById(
                "pdfImageDropZone"
            ),

        browseBtn:
            document.getElementById(
                "pdfImageBrowseBtn"
            ),

        fileInput:
            document.getElementById(
                "pdfImageInput"
            ),

        fileStatus:
            document.getElementById(
                "pdfImageFileStatus"
            ),

        workspace:
            document.getElementById(
                "pdfImageWorkspace"
            ),

        replaceBtn:
            document.getElementById(
                "pdfImageReplaceBtn"
            ),

        selectAllBtn:
            document.getElementById(
                "pdfImageSelectAllBtn"
            ),

        deselectAllBtn:
            document.getElementById(
                "pdfImageDeselectAllBtn"
            ),

        selectionStatus:
            document.getElementById(
                "pdfImageSelectionStatus"
            ),

        previewGrid:
            document.getElementById(
                "pdfImagePreviewGrid"
            ),

        format:
            document.getElementById(
                "pdfImageFormat"
            ),

        quality:
            document.getElementById(
                "pdfImageQuality"
            ),

        scale:
            document.getElementById(
                "pdfImageScale"
            ),

        background:
            document.getElementById(
                "pdfImageBackground"
            ),

        convertBtn:
            document.getElementById(
                "pdfImageConvertBtn"
            ),

        clearBtn:
            document.getElementById(
                "pdfImageClearBtn"
            ),

        progress:
            document.getElementById(
                "pdfImageProgress"
            ),

        progressBar:
            document.getElementById(
                "pdfImageProgressBar"
            ),

        progressText:
            document.getElementById(
                "pdfImageProgressText"
            ),

        result:
            document.getElementById(
                "pdfImageResult"
            ),

        downloadList:
            document.getElementById(
                "pdfImageDownloadList"
            ),

        downloadAllBtn:
            document.getElementById(
                "pdfImageDownloadAllBtn"
            )

    };


    /* ======================================================
       STATE
    ====================================================== */

    const state = {

        file:
            null,

        pdf:
            null,

        pages:
            [],

        selectedPages:
            new Set(),

        results:
            [],

        converting:
            false,

        initialized:
            false

    };


    /* ======================================================
       PDF.JS
    ====================================================== */

    function getPDFJS() {

        if (
            window.pdfjsLib
        ) {

            return window.pdfjsLib;

        }

        if (
            window.pdfjs
        ) {

            return window.pdfjs;

        }

        return null;

    }


    /*
     * The page may expose PDF.js through
     * a global object after loading.
     *
     * If PDF.js is not available yet,
     * conversion will report a clear
     * diagnostic instead of failing silently.
     */


    /* ======================================================
       UTILITY — SAFE ELEMENT
    ====================================================== */

    function exists(element) {

        return (
            element !== null &&
            element !== undefined
        );

    }


    /* ======================================================
       STATUS
    ====================================================== */

    function setStatus(
        message,
        type = "normal"
    ) {

        if (
            !exists(
                elements.fileStatus
            )
        ) {

            return;

        }

        elements.fileStatus.textContent =
            message;


        elements.fileStatus.dataset.status =
            type;

    }


    /* ======================================================
       ERROR
    ====================================================== */

    function showError(message) {

        setStatus(
            message,
            "error"
        );

        console.error(
            "[ToolXone PDF to Image]",
            message
        );

    }


    /* ======================================================
       FILE VALIDATION
    ====================================================== */

    function validateFile(file) {

        if (!file) {

            return {

                valid:
                    false,

                message:
                    "Please select a PDF file."

            };

        }


        const name =
            String(
                file.name || ""
            ).toLowerCase();


        const isPDF =

            file.type ===
                "application/pdf"

            ||

            name.endsWith(
                ".pdf"
            );


        if (!isPDF) {

            return {

                valid:
                    false,

                message:
                    "Please select a valid PDF file."

            };

        }


        if (
            file.size >
            CONFIG.maxFileSize
        ) {

            return {

                valid:
                    false,

                message:
                    "The selected PDF is larger than 100 MB."

            };

        }


        return {

            valid:
                true,

            message:
                ""

        };

    }


    /* ======================================================
       LOAD FILE
    ====================================================== */

    async function loadFile(file) {

        const validation =
            validateFile(
                file
            );


        if (
            !validation.valid
        ) {

            showError(
                validation.message
            );

            return;

        }


        clearResults();

        clearPreview();


        state.file =
            file;


        setStatus(
            `Loading ${file.name}...`
        );


        try {

            const buffer =
                await file.arrayBuffer();


            await loadPDF(
                buffer
            );


        } catch (error) {

            console.error(
                error
            );


            resetPDFState();


            showError(
                "Unable to open this PDF. The file may be damaged, encrypted, or unsupported."
            );

        }

    }


    /* ======================================================
       LOAD PDF
    ====================================================== */

    async function loadPDF(
        buffer
    ) {

        const pdfjs =
            getPDFJS();


        if (!pdfjs) {

            throw new Error(
                "PDF.js is not available."
            );

        }


        if (
            !pdfjs.GlobalWorkerOptions ||
            !pdfjs.getDocument
        ) {

            throw new Error(
                "PDF.js API is incomplete."
            );

        }


        /*
         * Configure worker when a worker source
         * has not already been configured.
         */

        if (
            !pdfjs.GlobalWorkerOptions.workerSrc
        ) {

            pdfjs.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

        }


        const loadingTask =
            pdfjs.getDocument({

                data:
                    buffer

            });


        state.pdf =
            await loadingTask.promise;


        const totalPages =
            state.pdf.numPages;


        if (
            !totalPages
        ) {

            throw new Error(
                "The PDF does not contain any pages."
            );

        }

        state.pages =
            [];

        state.selectedPages.clear();

        for (
            let pageNumber = 1;
            pageNumber <= totalPages;
            pageNumber++
        ) {

            state.pages.push({

                number:
                    pageNumber,

                selected:
                    false,

                thumbnail:
                    null

            });

        }


        /*
         * Default behavior:
         * select all pages.
         */

        selectAllPages();


        await renderPagePreviews();


        showWorkspace();


        setStatus(
            `${fileName(state.file)} loaded successfully — ${totalPages} page${totalPages === 1 ? "" : "s"}.`,
            "success"
        );


        recordUsage(
            "pdf_to_image_loaded"
        );

    }


    /* ======================================================
       FILE NAME
    ====================================================== */

    function fileName(file) {

        if (!file) {

            return "PDF";

        }

        return (
            file.name ||
            "PDF"
        );

    }


    /* ======================================================
       RENDER PREVIEWS
    ====================================================== */

    async function renderPagePreviews() {

        if (
            !state.pdf ||
            !exists(
                elements.previewGrid
            )
        ) {

            return;

        }


        elements.previewGrid.innerHTML =
            "";


        for (
            let index = 0;
            index < state.pages.length;
            index++
        ) {

            const page =
                state.pages[index];


            await renderPreview(
                page
            );

        }

    }


    /* ======================================================
       RENDER SINGLE PREVIEW
    ====================================================== */

    async function renderPreview(
        pageState
    ) {

        const page =
            await state.pdf.getPage(
                pageState.number
            );


        const baseViewport =
            page.getViewport({

                scale:
                    0.55

            });


        const canvas =
            document.createElement(
                "canvas"
            );


        const context =
            canvas.getContext(
                "2d"
            );


        canvas.width =
            Math.ceil(
                baseViewport.width
            );


        canvas.height =
            Math.ceil(
                baseViewport.height
            );


        await page.render({

            canvasContext:
                context,

            viewport:
                baseViewport

        }).promise;


        pageState.thumbnail =
            canvas;


        const card =
            createPageCard(
                pageState,
                canvas
            );


        elements.previewGrid.appendChild(
            card
        );

    }


    /* ======================================================
       CREATE PAGE CARD
    ====================================================== */

    function createPageCard(
        pageState,
        canvas
    ) {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "pdf-image-page-card";


        card.dataset.page =
            String(
                pageState.number
            );


        const canvasClone =
            document.createElement(
                "canvas"
            );


        canvasClone.width =
            canvas.width;

        canvasClone.height =
            canvas.height;


        const cloneContext =
            canvasClone.getContext(
                "2d"
            );


        cloneContext.drawImage(
            canvas,
            0,
            0
        );


        const number =
            document.createElement(
                "div"
            );


        number.className =
            "pdf-image-page-number";


        number.textContent =
            `Page ${pageState.number}`;


        const check =
            document.createElement(
                "div"
            );


        check.className =
            "pdf-image-page-check";


        check.textContent =
            "✓";


        card.appendChild(
            canvasClone
        );

        card.appendChild(
            number
        );

        card.appendChild(
            check
        );


        card.addEventListener(
            "click",
            function () {

                togglePage(
                    pageState.number
                );

            }
        );


        updatePageCard(
            card,
            pageState
        );


        return card;

    }


    /* ======================================================
       TOGGLE PAGE
    ====================================================== */

    function togglePage(
        pageNumber
    ) {

        if (
            state.converting
        ) {

            return;

        }


        if (
            state.selectedPages.has(
                pageNumber
            )
        ) {

            state.selectedPages.delete(
                pageNumber
            );

        } else {

            state.selectedPages.add(
                pageNumber
            );

        }


        syncPageStates();

        updateAllPageCards();

        updateSelectionStatus();

    }


    /* ======================================================
       SELECT ALL
    ====================================================== */

    function selectAllPages() {

        state.selectedPages =
            new Set(
                state.pages.map(
                    page =>
                        page.number
                )
            );


        syncPageStates();

        updateAllPageCards();

        updateSelectionStatus();

    }


    /* ======================================================
       DESELECT ALL
    ====================================================== */

    function deselectAllPages() {

        state.selectedPages.clear();


        syncPageStates();

        updateAllPageCards();

        updateSelectionStatus();

    }


    /* ======================================================
       SYNC PAGE STATES
    ====================================================== */

    function syncPageStates() {

        state.pages.forEach(
            function (page) {

                page.selected =
                    state.selectedPages.has(
                        page.number
                    );

            }
        );

    }


    /* ======================================================
       UPDATE PAGE CARDS
    ====================================================== */

    function updateAllPageCards() {

        if (
            !exists(
                elements.previewGrid
            )
        ) {

            return;

        }


        const cards =
            elements.previewGrid.querySelectorAll(
                ".pdf-image-page-card"
            );


        cards.forEach(
            function (card) {

                const pageNumber =
                    Number(
                        card.dataset.page
                    );


                const selected =
                    state.selectedPages.has(
                        pageNumber
                    );


                card.classList.toggle(
                    "is-selected",
                    selected
                );

            }
        );

    }


    /* ======================================================
       UPDATE ONE CARD
    ====================================================== */

    function updatePageCard(
        card,
        pageState
    ) {

        card.classList.toggle(
            "is-selected",
            pageState.selected
        );

    }


    /* ======================================================
       SELECTION STATUS
    ====================================================== */

    function updateSelectionStatus() {

        if (
            !exists(
                elements.selectionStatus
            )
        ) {

            return;

        }


        const selected =
            state.selectedPages.size;


        const total =
            state.pages.length;


        if (
            selected === 0
        ) {

            elements.selectionStatus.textContent =
                "No pages selected";

            return;

        }


        elements.selectionStatus.textContent =

            `${selected} of ${total} page${total === 1 ? "" : "s"} selected`;

    }


    /* ======================================================
       SHOW WORKSPACE
    ====================================================== */

    function showWorkspace() {

        if (
            !exists(
                elements.workspace
            )
        ) {

            return;

        }


        elements.workspace.hidden =
            false;

        /*
         * Workspace mode: the upload surface and transient file
         * status belong to the initial state only. Once a PDF is
         * loaded, keep the user inside the active workspace board.
         */
        if (exists(elements.dropZone)) {
            elements.dropZone.hidden = true;
        }

        if (exists(elements.fileStatus)) {
            elements.fileStatus.hidden = true;
        }

    }


    /* ======================================================
       HIDE WORKSPACE
    ====================================================== */

    function hideWorkspace() {

        if (
            !exists(
                elements.workspace
            )
        ) {

            return;

        }


        elements.workspace.hidden =
            true;

        /* Restore the initial upload state after Clear All. */
        if (exists(elements.dropZone)) {
            elements.dropZone.hidden = false;
        }

        if (exists(elements.fileStatus)) {
            elements.fileStatus.hidden = false;
        }

    }


    /* ======================================================
       CONVERSION
    ====================================================== */

    async function convert() {

        if (
            state.converting
        ) {

            return;

        }


        if (
            !state.pdf
        ) {

            showError(
                "Please upload a PDF first."
            );

            return;

        }


        if (
            state.selectedPages.size === 0
        ) {

            showError(
                "Please select at least one PDF page."
            );

            return;

        }


        state.converting =
            true;


        clearResults();


        setControlsDisabled(
            true
        );


        showProgress();


        try {

            const selectedPages =
                Array.from(
                    state.selectedPages
                ).sort(
                    (a, b) =>
                        a - b
                );


            const total =
                selectedPages.length;


            for (
                let index = 0;
                index < total;
                index++
            ) {

                const pageNumber =
                    selectedPages[index];


                updateProgress(

                    (
                        index /
                        total
                    ) * 100,

                    `Converting page ${pageNumber} of ${total}...`

                );


                const result =
                    await renderPageToImage(
                        pageNumber
                    );


                state.results.push(
                    result
                );


                updateProgress(

                    (
                        (index + 1) /
                        total
                    ) * 100,

                    `Converted ${index + 1} of ${total} page${total === 1 ? "" : "s"}...`

                );

            }


            renderResults();


if (
    typeof ToolXoneStatisticsEvents !== "undefined" &&
    typeof ToolXoneStatisticsEvents.recordCalculation === "function"
) {
    ToolXoneStatisticsEvents.recordCalculation("pdf-to-image");
}

            setStatus(
                `Successfully converted ${total} page${total === 1 ? "" : "s"}.`,
                "success"
            );


        } catch (error) {

            console.error(
                "[ToolXone PDF to Image]",
                error
            );


            showError(
                "The PDF could not be converted. Please try again."
            );

        } finally {

            state.converting =
                false;


            setControlsDisabled(
                false
            );


            hideProgress();

        }

    }


    /* ======================================================
       RENDER PAGE TO IMAGE
    ====================================================== */

    async function renderPageToImage(
        pageNumber
    ) {

        const page =
            await state.pdf.getPage(
                pageNumber
            );


        const scale =
            getScale();


        const viewport =
            page.getViewport({

                scale:
                    scale

            });


        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            Math.ceil(
                viewport.width
            );


        canvas.height =
            Math.ceil(
                viewport.height
            );


        const context =
            canvas.getContext(
                "2d"
            );


        /*
         * Background handling
         */

        const format =
            getFormat();


        const background =
            getBackground();


        if (
            format !== "png" ||
            background !== "transparent"
        ) {

            context.fillStyle =
                "#ffffff";

            context.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

        }


        await page.render({

            canvasContext:
                context,

            viewport:
                viewport,

            background:
                background === "transparent"
                    ? "rgba(0,0,0,0)"
                    : "#ffffff"

        }).promise;


        const mimeType =
            getMimeType(
                format
            );


        const quality =
            getCanvasQuality(
                format
            );


        const blob =
            await canvasToBlob(
                canvas,
                mimeType,
                quality
            );


        const extension =
            format;


        const baseName =
            removeExtension(
                state.file.name
            );


        const filename =
            `${baseName}-page-${pageNumber}.${extension}`;


        return {

            page:
                pageNumber,

            filename:
                filename,

            blob:
                blob,

            url:
                URL.createObjectURL(
                    blob
                )

        };

    }


    /* ======================================================
       FORMAT
    ====================================================== */

    function getFormat() {

        const value =
            elements.format
                ? elements.format.value
                : CONFIG.defaultFormat;


        return CONFIG.supportedFormats.includes(
            value
        )
            ? value
            : CONFIG.defaultFormat;

    }


    /* ======================================================
       MIME TYPE
    ====================================================== */

    function getMimeType(
        format
    ) {

        switch (
            format
        ) {

            case "png":

                return "image/png";


            case "webp":

                return "image/webp";


            case "jpg":

            default:

                return "image/jpeg";

        }

    }


    /* ======================================================
       QUALITY
    ====================================================== */

    function getQuality() {

        const value =
            elements.quality
                ? elements.quality.value
                : CONFIG.defaultQuality;


        return value;

    }


    /* ======================================================
       CANVAS QUALITY
    ====================================================== */

    function getCanvasQuality(
        format
    ) {

        /*
         * PNG is lossless.
         */

        if (
            format === "png"
        ) {

            return undefined;

        }


        switch (
            getQuality()
        ) {

            case "medium":

                return 0.80;


            case "low":

                return 0.65;


            case "high":

            default:

                return 0.92;

        }

    }


    /* ======================================================
       SCALE
    ====================================================== */

    function getScale() {

        const value =
            elements.scale
                ? Number(
                    elements.scale.value
                )
                : CONFIG.defaultScale;


        if (
            !Number.isFinite(
                value
            ) ||
            value <= 0
        ) {

            return CONFIG.defaultScale;

        }


        return value;

    }


    /* ======================================================
       BACKGROUND
    ====================================================== */

    function getBackground() {

        const value =
            elements.background
                ? elements.background.value
                : CONFIG.defaultBackground;


        return value === "transparent"
            ? "transparent"
            : "white";

    }


    /* ======================================================
       CANVAS → BLOB
    ====================================================== */

    function canvasToBlob(
        canvas,
        mimeType,
        quality
    ) {

        return new Promise(
            function (resolve, reject) {

                canvas.toBlob(

                    function (blob) {

                        if (!blob) {

                            reject(
                                new Error(
                                    "Unable to create image."
                                )
                            );

                            return;

                        }


                        resolve(
                            blob
                        );

                    },

                    mimeType,

                    quality

                );

            }
        );

    }


    /* ======================================================
       REMOVE EXTENSION
    ====================================================== */

    function removeExtension(
        filename
    ) {

        return String(
            filename || "converted"
        ).replace(
            /\.[^/.]+$/,
            ""
        );

    }


    /* ======================================================
       RENDER RESULTS
    ====================================================== */

    function renderResults() {

        if (!exists(elements.downloadList)) {
            return;
        }

        elements.downloadList.innerHTML = "";

        state.results.forEach(function (result) {

            const item = document.createElement("article");
            item.className = "pdf-image-download-item";

            const preview = document.createElement("div");
            preview.className = "pdf-image-result-tile-preview";

            const image = document.createElement("img");
            image.className = "pdf-image-result-tile-image";
            image.src = result.url;
            image.alt = `Converted PDF page ${result.page}`;
            image.loading = "lazy";
            image.decoding = "async";

            const pageBadge = document.createElement("span");
            pageBadge.className = "pdf-image-result-tile-page";
            pageBadge.textContent = `Page ${result.page}`;

            preview.appendChild(image);
            preview.appendChild(pageBadge);

            const body = document.createElement("div");
            body.className = "pdf-image-result-tile-body";

            const name = document.createElement("div");
            name.className = "pdf-image-download-item-name";
            name.title = result.filename;
            name.textContent = result.filename;

            const link = document.createElement("a");
            link.className = "pdf-image-result-tile-download";
            link.href = result.url;
            link.download = result.filename;
            link.setAttribute("aria-label", `Download ${result.filename}`);
            link.textContent = "Download";

            body.appendChild(name);
            body.appendChild(link);

            item.appendChild(preview);
            item.appendChild(body);

            elements.downloadList.appendChild(item);
        });

        if (exists(elements.result)) {
            elements.result.hidden = false;
        }
    }

    /* ======================================================
       DOWNLOAD ALL
    ====================================================== */

    async function downloadAll() {

    if (!state.results.length) {
        return;
    }

    /*
     * If there is only one converted image, Download All should
     * behave like a normal direct image download instead of creating
     * a ZIP containing one file.
     */
    if (state.results.length === 1) {

        const result = state.results[0];

        triggerDownload(
            result.url,
            result.filename
        );

        return;
    }

    try {

        const files = [];

        // Fetch every converted image
        for (const result of state.results) {

            const response = await fetch(result.url);

            if (!response.ok) {
                throw new Error(
                    `Unable to fetch ${result.filename}`
                );
            }

            const blob = await response.blob();

            const buffer = await blob.arrayBuffer();

            files.push({
                filename: result.filename,
                data: new Uint8Array(buffer)
            });

        }


        /*
        ======================================================
        ZIP BUILDER
        ------------------------------------------------------
        Creates a ZIP archive directly in the browser.
        No external library required.
        ======================================================
        */

        const encoder = new TextEncoder();

        function crc32(data) {

            let crc = 0xFFFFFFFF;

            for (let i = 0; i < data.length; i++) {

                crc ^= data[i];

                for (let j = 0; j < 8; j++) {

                    crc =
                        (crc >>> 1) ^
                        (
                            0xEDB88320 &
                            -(crc & 1)
                        );

                }

            }

            return (
                (crc ^ 0xFFFFFFFF) >>> 0
            );

        }


        function writeUInt32LE(
            array,
            offset,
            value
        ) {

            array[offset] =
                value & 0xFF;

            array[offset + 1] =
                (value >>> 8) & 0xFF;

            array[offset + 2] =
                (value >>> 16) & 0xFF;

            array[offset + 3] =
                (value >>> 24) & 0xFF;

        }


        function writeUInt16LE(
            array,
            offset,
            value
        ) {

            array[offset] =
                value & 0xFF;

            array[offset + 1] =
                (value >>> 8) & 0xFF;

        }


        const localParts = [];
        const centralParts = [];

        let offset = 0;


        /*
        ======================================================
        LOCAL FILE HEADERS
        ======================================================
        */

        for (const file of files) {

            const filenameBytes =
                encoder.encode(
                    file.filename
                );

            const data =
                file.data;

            const crc =
                crc32(data);

            const header =
                new Uint8Array(
                    30 + filenameBytes.length
                );

            // Local file header signature
            writeUInt32LE(
                header,
                0,
                0x04034B50
            );

            // Version needed
            writeUInt16LE(
                header,
                4,
                20
            );

            // General purpose flag
            writeUInt16LE(
                header,
                6,
                0x0800
            );

            // Compression method: STORE
            writeUInt16LE(
                header,
                8,
                0
            );

            // Time
            writeUInt16LE(
                header,
                10,
                0
            );

            // Date
            writeUInt16LE(
                header,
                12,
                0
            );

            // CRC-32
            writeUInt32LE(
                header,
                14,
                crc
            );

            // Compressed size
            writeUInt32LE(
                header,
                18,
                data.length
            );

            // Uncompressed size
            writeUInt32LE(
                header,
                22,
                data.length
            );

            // Filename length
            writeUInt16LE(
                header,
                26,
                filenameBytes.length
            );

            // Extra field length
            writeUInt16LE(
                header,
                28,
                0
            );

            header.set(
                filenameBytes,
                30
            );


            localParts.push(header);
            localParts.push(data);


            /*
            ==================================================
            CENTRAL DIRECTORY ENTRY
            ==================================================
            */

            const central =
                new Uint8Array(
                    46 + filenameBytes.length
                );

            // Central directory signature
            writeUInt32LE(
                central,
                0,
                0x02014B50
            );

            // Version made by
            writeUInt16LE(
                central,
                4,
                20
            );

            // Version needed
            writeUInt16LE(
                central,
                6,
                20
            );

            // General purpose flag
            writeUInt16LE(
                central,
                8,
                0x0800
            );

            // Compression method
            writeUInt16LE(
                central,
                10,
                0
            );

            // Time
            writeUInt16LE(
                central,
                12,
                0
            );

            // Date
            writeUInt16LE(
                central,
                14,
                0
            );

            // CRC-32
            writeUInt32LE(
                central,
                16,
                crc
            );

            // Compressed size
            writeUInt32LE(
                central,
                20,
                data.length
            );

            // Uncompressed size
            writeUInt32LE(
                central,
                24,
                data.length
            );

            // Filename length
            writeUInt16LE(
                central,
                28,
                filenameBytes.length
            );

            // Extra length
            writeUInt16LE(
                central,
                30,
                0
            );

            // Comment length
            writeUInt16LE(
                central,
                32,
                0
            );

            // Disk number
            writeUInt16LE(
                central,
                34,
                0
            );

            // Internal attributes
            writeUInt16LE(
                central,
                36,
                0
            );

            // External attributes
            writeUInt32LE(
                central,
                38,
                0
            );

            // Relative offset
            writeUInt32LE(
                central,
                42,
                offset
            );

            central.set(
                filenameBytes,
                46
            );


            centralParts.push(
                central
            );


            offset +=
                header.length +
                data.length;

        }


        /*
        ======================================================
        CENTRAL DIRECTORY
        ======================================================
        */

        const centralDirectorySize =
            centralParts.reduce(
                (total, part) =>
                    total + part.length,
                0
            );

        const centralDirectoryOffset =
            offset;


        /*
        ======================================================
        END OF CENTRAL DIRECTORY
        ======================================================
        */

        const end =
            new Uint8Array(22);

        writeUInt32LE(
            end,
            0,
            0x06054B50
        );

        // Disk number
        writeUInt16LE(
            end,
            4,
            0
        );

        // Central directory disk
        writeUInt16LE(
            end,
            6,
            0
        );

        // Number of entries on disk
        writeUInt16LE(
            end,
            8,
            files.length
        );

        // Total number of entries
        writeUInt16LE(
            end,
            10,
            files.length
        );

        // Central directory size
        writeUInt32LE(
            end,
            12,
            centralDirectorySize
        );

        // Central directory offset
        writeUInt32LE(
            end,
            16,
            centralDirectoryOffset
        );

        // Comment length
        writeUInt16LE(
            end,
            20,
            0
        );


        /*
        ======================================================
        CREATE ZIP BLOB
        ======================================================
        */

        const zipBlob =
            new Blob(
                [
                    ...localParts,
                    ...centralParts,
                    end
                ],
                {
                    type:
                        "application/zip"
                }
            );


        const zipUrl =
            URL.createObjectURL(
                zipBlob
            );


        const now =
            new Date();

        const date =
            now
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, "");


        const filename =
            `toolxone-images-${date}.zip`;


        /*
        ======================================================
        SINGLE DOWNLOAD
        ======================================================
        */

        triggerDownload(
            zipUrl,
            filename
        );


        setTimeout(
            function () {

                URL.revokeObjectURL(
                    zipUrl
                );

            },
            5000
        );


    } catch (error) {

        console.error(
            "ToolXone PDF to Image - Download All Error:",
            error
        );

        alert(
            "Unable to create the ZIP file. Please try again."
        );

    }

}


    /* ======================================================
       TRIGGER DOWNLOAD
    ====================================================== */

    function triggerDownload(
        url,
        filename
    ) {

        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            filename;


        link.style.display =
            "none";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();

    }


    /* ======================================================
       CLEAR RESULTS
    ====================================================== */

    function clearResults() {

        state.results.forEach(
            function (result) {

                if (
                    result.url
                ) {

                    URL.revokeObjectURL(
                        result.url
                    );

                }

            }
        );


        state.results =
            [];


        if (
            exists(
                elements.downloadList
            )
        ) {

            elements.downloadList.innerHTML =
                "";

        }


        if (
            exists(
                elements.result
            )
        ) {

            elements.result.hidden =
                true;

        }

    }


    /* ======================================================
       CLEAR PREVIEW
    ====================================================== */

    function clearPreview() {

        if (
            exists(
                elements.previewGrid
            )
        ) {

            elements.previewGrid.innerHTML =
                "";

        }

    }


    /* ======================================================
       RESET PDF STATE
    ====================================================== */

    function resetPDFState() {

        state.file =
            null;

        state.pdf =
            null;

        state.pages =
            [];

        state.selectedPages.clear();

        clearResults();

        clearPreview();

        hideWorkspace();

        updateSelectionStatus();

    }


    /* ======================================================
       CLEAR ALL
    ====================================================== */

    function clearAll() {

        if (
            state.converting
        ) {

            return;

        }


        resetPDFState();


        if (
            exists(
                elements.fileInput
            )
        ) {

            elements.fileInput.value =
                "";

        }


        if (
            exists(
                elements.format
            )
        ) {

            elements.format.value =
                CONFIG.defaultFormat;

        }


        if (
            exists(
                elements.quality
            )
        ) {

            elements.quality.value =
                CONFIG.defaultQuality;

        }


        if (
            exists(
                elements.scale
            )
        ) {

            elements.scale.value =
                String(
                    CONFIG.defaultScale
                );

        }


        if (
            exists(
                elements.background
            )
        ) {

            elements.background.value =
                CONFIG.defaultBackground;

        }


        setStatus(
            ""
        );


        hideProgress();


        setControlsDisabled(
            false
        );

        if (
            exists(
                elements.dropZone
            )
        ) {

            requestAnimationFrame(
                function () {

                    elements.dropZone.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }
            );

        }

    }


    /* ======================================================
       REPLACE PDF
    ====================================================== */

    function replacePDF() {

        if (
            state.converting
        ) {

            return;

        }


        if (
            exists(
                elements.fileInput
            )
        ) {

            elements.fileInput.value =
                "";

            elements.fileInput.click();

        }

    }


    /* ======================================================
       PROGRESS
    ====================================================== */

    function showProgress() {

        if (
            exists(
                elements.progress
            )
        ) {

            elements.progress.hidden =
                false;

        }


        updateProgress(
            0,
            "Preparing conversion..."
        );

    }


    function hideProgress() {

        if (
            exists(
                elements.progress
            )
        ) {

            elements.progress.hidden =
                true;

        }

    }


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


        if (
            exists(
                elements.progressBar
            )
        ) {

            elements.progressBar.style.width =
                `${safePercentage}%`;

        }


        if (
            exists(
                elements.progressText
            )
        ) {

            elements.progressText.textContent =
                message;

        }

    }


    /* ======================================================
       CONTROL STATE
    ====================================================== */

    function setControlsDisabled(
        disabled
    ) {

        const controls = [

            elements.browseBtn,

            elements.replaceBtn,

            elements.selectAllBtn,

            elements.deselectAllBtn,

            elements.format,

            elements.quality,

            elements.scale,

            elements.background,

            elements.convertBtn,

            elements.clearBtn

        ];


        controls.forEach(
            function (control) {

                if (
                    exists(
                        control
                    )
                ) {

                    control.disabled =
                        disabled;

                }

            }
        );


        if (
            exists(
                elements.previewGrid
            )
        ) {

            elements.previewGrid.style.pointerEvents =
                disabled
                    ? "none"
                    : "";

        }

    }


    /* ======================================================
       DRAG & DROP
    ====================================================== */

    function setupDragAndDrop() {

        if (
            !exists(
                elements.dropZone
            )
        ) {

            return;

        }


        [
            "dragenter",
            "dragover"
        ].forEach(
            function (eventName) {

                elements.dropZone.addEventListener(
                    eventName,
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();

                        elements.dropZone.classList.add(
                            "is-dragover"
                        );

                    }
                );

            }
        );


        [
            "dragleave",
            "drop"
        ].forEach(
            function (eventName) {

                elements.dropZone.addEventListener(
                    eventName,
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();

                        elements.dropZone.classList.remove(
                            "is-dragover"
                        );

                    }
                );

            }
        );


        elements.dropZone.addEventListener(
            "drop",
            function (event) {

                const files =
                    event.dataTransfer &&
                    event.dataTransfer.files;


                if (
                    files &&
                    files.length
                ) {

                    loadFile(
                        files[0]
                    );

                }

            }
        );

    }


    /* ======================================================
       EVENT BINDINGS
    ====================================================== */

    function bindEvents() {

        if (
            exists(
                elements.browseBtn
            )
        ) {

            elements.browseBtn.addEventListener(
                "click",
                function () {

                    elements.fileInput.click();

                }
            );

        }


        if (
            exists(
                elements.fileInput
            )
        ) {

            elements.fileInput.addEventListener(
                "change",
                function (event) {

                    const file =
                        event.target.files &&
                        event.target.files[0];


                    if (file) {

                        loadFile(
                            file
                        );

                    }

                }
            );

        }


        if (
            exists(
                elements.replaceBtn
            )
        ) {

            elements.replaceBtn.addEventListener(
                "click",
                replacePDF
            );

        }


        if (
            exists(
                elements.selectAllBtn
            )
        ) {

            elements.selectAllBtn.addEventListener(
                "click",
                selectAllPages
            );

        }


        if (
            exists(
                elements.deselectAllBtn
            )
        ) {

            elements.deselectAllBtn.addEventListener(
                "click",
                deselectAllPages
            );

        }


        if (
            exists(
                elements.convertBtn
            )
        ) {

            elements.convertBtn.addEventListener(
                "click",
                convert
            );

        }


        if (
            exists(
                elements.clearBtn
            )
        ) {

            elements.clearBtn.addEventListener(
                "click",
                clearAll
            );

        }


        if (
            exists(
                elements.downloadAllBtn
            )
        ) {

            elements.downloadAllBtn.addEventListener(
                "click",
                downloadAll
            );

        }


        setupDragAndDrop();

    }


    /* ======================================================
       STATISTICS
    ====================================================== */

    function recordUsage(
        eventName,
        data = {}
    ) {

        try {

            if (
                window.ToolXoneStatistics &&
                typeof
                    window.ToolXoneStatistics.track ===
                    "function"
            ) {

                window.ToolXoneStatistics.track(
                    eventName,
                    data
                );

                return;

            }


            if (
                window.ToolXoneStatisticsEngine &&
                typeof
                    window.ToolXoneStatisticsEngine.track ===
                    "function"
            ) {

                window.ToolXoneStatisticsEngine.track(
                    eventName,
                    data
                );

                return;

            }

        } catch (error) {

            console.warn(
                "[ToolXone PDF to Image] Statistics hook unavailable.",
                error
            );

        }

    }


    /* ======================================================
       INITIALIZATION
    ====================================================== */

    function initialize() {

        if (
            state.initialized
        ) {

            return;

        }


        bindEvents();


        updateSelectionStatus();


        state.initialized =
            true;


        console.info(
            `ToolXone PDF to Image Engine v${CONFIG.version} initialized.`
        );

    }


    /* ======================================================
       PUBLIC API
    ====================================================== */

    window.ToolXonePDFToImage = {

        version:
            CONFIG.version,

        state,

        loadFile,

        convert,

        clearAll,

        selectAllPages,

        deselectAllPages,

        getFormat,

        getQuality,

        getScale,

        getBackground

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
            initialize
        );

    } else {

        initialize();

    }


})(window, document);