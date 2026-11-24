(function (window, document) {
    "use strict";

    const LIMITS = Object.freeze({
        maxFiles: 10,
        maxFileBytes: 25 * 1024 * 1024,
        maxTotalBytes: 100 * 1024 * 1024
    });
    const state = {
        files: [],
        busy: false,
        validating: false,
        acceptQueue: Promise.resolve(),
        resultUrl: null,
        resultBlob: null,
        continuing: false,
        objectUrls: new Set(),
        downloadTimers: new Map(),
        previewQueue: Promise.resolve(),
        previewJobs: new Map(),
        draggingId: null,
        dragOriginId: null,
        dropIndicator: null,
        movedId: null,
        movedTimer: null,
        id: 0
    };
    const byId = id => document.getElementById(id);
    const ui = {};
    let live = false;
    let pdfJsPromise = null;

    const PDFJS_MODULE_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";
    const PDFJS_WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";
    const PREVIEW_MAX_WIDTH = 144;
    const PREVIEW_MAX_HEIGHT = 184;
    const PREVIEW_MAX_PIXELS = 26496;

    function loadPDFJS() {
        if (!pdfJsPromise) {
            pdfJsPromise = (async () => {
                // The optional hook is only used by the isolated Node test harness.
                const testHook = window.__TOOLXONE_MERGE_PDF_TEST__;
                const pdfjs = testHook && typeof testHook.importPDFJS === "function"
                    ? await testHook.importPDFJS()
                    : await import(PDFJS_MODULE_URL);
                if (!pdfjs || typeof pdfjs.getDocument !== "function" || !pdfjs.GlobalWorkerOptions) {
                    throw new Error("PDF preview library did not expose the expected APIs.");
                }
                pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
                return pdfjs;
            })();
        }
        return pdfJsPromise;
    }

    function getPDFDocument() {
        const library = window.PDFLib;
        return library && typeof library.PDFDocument === "function" ? library.PDFDocument : null;
    }

    function entryName(entry) { return entry.internal ? entry.name : entry.file.name || "Unnamed PDF"; }
    function entrySize(entry) { return entry.internal ? entry.size : entry.file.size; }
    function entryBytes(entry) { return entry.internal ? entry.blob.arrayBuffer() : entry.file.arrayBuffer(); }

    function formatSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KiB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
    }

    function safeError(error) {
        const text = error && error.message ? error.message : String(error || "Unknown PDF error");
        if (/encrypt|password|encrypted/i.test(text)) return "This PDF is encrypted or password-protected and is not supported.";
        if (/unsupported|not supported|unknown compression|invalid pdf structure|failed to parse|endobj|xref/i.test(text)) return "This PDF is malformed or uses an unsupported PDF feature.";
        return "ToolXone could not read this PDF. It may be malformed, encrypted, or use an unsupported feature.";
    }

    function setStatus(message, kind = "info") {
        if (!ui.status) return;
        ui.status.textContent = message;
        ui.status.dataset.kind = kind;
    }

    function setBusy(value) {
        state.busy = value;
        if (ui.merge) ui.merge.disabled = value || state.validating || state.files.length < 2 || !getPDFDocument();
        if (ui.clear) ui.clear.disabled = value || state.validating || !state.files.length;
        if (ui.input) ui.input.disabled = value || state.validating;
        renderFiles();
    }

    function renderFiles() {
        if (!ui.list) return;
        if (state.draggingId !== null) return;
        const scrollTop = ui.listViewport ? ui.listViewport.scrollTop : 0;
        const active = document.activeElement;
        const restoreFocus = active && ui.list.contains(active)
            ? { action: active.dataset.action, id: active.dataset.id }
            : null;
        ui.list.replaceChildren();
        state.files.forEach((entry, index) => {
            const item = document.createElement("li");
            item.className = "merge-pdf-file";
            item.dataset.id = String(entry.id);
            item.draggable = !entry.internal;
            item.setAttribute("draggable", entry.internal ? "false" : "true");
            if (state.draggingId === entry.id) item.classList.add("is-dragging");
            if (state.dropIndicator && state.dropIndicator.id === entry.id) {
                item.classList.add(state.dropIndicator.position === "before" ? "is-drop-before" : "is-drop-after");
            }
            if (state.movedId === entry.id) item.classList.add("is-reordered");
            const info = document.createElement("div");
            info.className = "merge-pdf-file-info";
            const preview = document.createElement("div");
            preview.className = "merge-pdf-preview";
            preview.dataset.entryId = String(entry.id);
            preview.setAttribute("aria-label", `First page preview of ${entryName(entry)}`);
            if (entry.previewCanvas) preview.append(entry.previewCanvas);
            else {
                const placeholder = document.createElement("span");
                placeholder.className = "merge-pdf-preview-placeholder";
                placeholder.textContent = entry.previewState === "loading" ? "Loading preview…" : "Preview unavailable";
                preview.append(placeholder);
            }
            const name = document.createElement("strong");
            name.textContent = entry.internal ? `Previous Merged Result — ${entryName(entry)}` : entryName(entry);
            const size = document.createElement("span");
            size.textContent = formatSize(entrySize(entry));
            const pages = document.createElement("span");
            pages.className = "merge-pdf-page-count";
            pages.dataset.entryId = String(entry.id);
            pages.textContent = Number.isInteger(entry.pageCount)
                ? `${entry.pageCount} ${entry.pageCount === 1 ? "page" : "pages"}`
                : entry.previewState === "loading" ? "Reading page count…" : "Page count unavailable";
            info.append(preview, name, size, pages);

            const actions = document.createElement("div");
            actions.className = "merge-pdf-file-actions";
            if (entry.internal) {
                const pinned = document.createElement("span");
                pinned.className = "merge-pdf-pinned-label";
                pinned.textContent = "Pinned first";
                actions.append(pinned);
            } else {
                const handle = document.createElement("button");
                handle.type = "button";
                handle.className = "merge-pdf-drag-handle";
                handle.textContent = "⠿";
                handle.setAttribute("aria-label", `Press and hold the grip to drag ${entryName(entry)} to reorder`);
                handle.title = "Press and hold to drag this PDF";
                handle.draggable = false;
                handle.dataset.action = "drag-handle";
                handle.dataset.id = String(entry.id);
                actions.append(handle);
            }
            const up = document.createElement("button");
            up.type = "button";
            up.textContent = "Move Up";
            up.setAttribute("aria-label", `Move ${entryName(entry)} up`);
            up.disabled = state.busy || state.validating || index === 0 || (state.continuing && index === 1);
            up.dataset.action = "up";
            up.dataset.id = String(entry.id);
            const down = document.createElement("button");
            down.type = "button";
            down.textContent = "Move Down";
            down.setAttribute("aria-label", `Move ${entryName(entry)} down`);
            down.disabled = state.busy || state.validating || index === state.files.length - 1 || entry.internal;
            down.dataset.action = "down";
            down.dataset.id = String(entry.id);
            const remove = document.createElement("button");
            remove.type = "button";
            remove.textContent = "Remove";
            remove.setAttribute("aria-label", `Remove ${entryName(entry)}`);
            remove.disabled = state.busy || state.validating || entry.internal;
            remove.dataset.action = "remove";
            remove.dataset.id = String(entry.id);
            actions.append(up, down, remove);
            item.append(info, actions);
            ui.list.append(item);
        });
        if (ui.listViewport) ui.listViewport.scrollTop = scrollTop;
        if (ui.count) ui.count.textContent = `${state.files.length} of ${LIMITS.maxFiles} PDFs selected`;
        if (ui.merge) ui.merge.disabled = state.busy || state.validating || state.files.length < 2 || !getPDFDocument();
        if (ui.clear) ui.clear.disabled = state.busy || state.validating || !state.files.length;
        if (restoreFocus) {
            const target = Array.from(ui.list.querySelectorAll("button[data-action]")).find(button =>
                button.dataset.action === restoreFocus.action && button.dataset.id === restoreFocus.id
            );
            if (target) target.focus();
        }
    }

    function showProcessing(visible, title, message, percent = null) {
        if (!ui.processing) return;
        ui.processing.hidden = !visible;
        if (title && ui.processingTitle) ui.processingTitle.textContent = title;
        if (message && ui.processingMessage) ui.processingMessage.textContent = message;
        if (ui.progress) {
            if (percent === null) {
                ui.progress.removeAttribute("value");
                ui.progress.setAttribute("aria-label", message || "Processing PDFs");
            } else {
                ui.progress.value = percent;
                ui.progress.setAttribute("aria-label", `${percent}% complete`);
            }
        }
    }

    function showResult(blob) {
        state.resultBlob = blob;
        const url = state.resultUrl || URL.createObjectURL(blob);
        if (!state.resultUrl) { state.objectUrls.add(url); state.resultUrl = url; }
        if (ui.uploadWorkspace) ui.uploadWorkspace.hidden = true;
        if (ui.resultWorkspace) ui.resultWorkspace.hidden = false;
        ui.download.href = url;
        ui.download.download = "toolxone-merged.pdf";
        if (ui.outputName) ui.outputName.textContent = ui.download.download;
        if (ui.outputSize) ui.outputSize.textContent = formatSize(blob.size);
        if (ui.retainedResult) ui.retainedResult.hidden = true;
        if (ui.resultHeading && typeof ui.resultHeading.focus === "function") ui.resultHeading.focus();
    }

    function revokeObjectUrl(url) {
        if (!url) return;
        const timer = state.downloadTimers.get(url);
        if (timer !== undefined) {
            window.clearTimeout(timer);
            state.downloadTimers.delete(url);
        }
        if (state.objectUrls.delete(url)) URL.revokeObjectURL(url);
    }

    function releaseResult() {
        if (state.resultUrl && !state.downloadTimers.has(state.resultUrl)) revokeObjectUrl(state.resultUrl);
        state.resultUrl = null;
        state.resultBlob = null;
        state.continuing = false;
        if (ui.resultWorkspace) ui.resultWorkspace.hidden = true;
        if (ui.retainedResult) ui.retainedResult.hidden = true;
    }

    function resetSession(focusBrowse = false) {
        if (state.busy || state.validating) return false;
        state.files.forEach(cleanupPreview);
        state.files = [];
        releaseResult();
        if (ui.input) ui.input.value = "";
        if (ui.errors) ui.errors.replaceChildren();
        showProcessing(false, "Reading PDFs", "Preparing your files.", null);
        if (ui.progress) ui.progress.value = 0;
        if (ui.uploadWorkspace) ui.uploadWorkspace.hidden = false;
        setStatus("Choose at least two PDFs to begin.");
        renderFiles();
        if (focusBrowse && ui.browse && typeof ui.browse.focus === "function") ui.browse.focus();
        return true;
    }

    function clearAll() {
        if (!state.continuing) return resetSession(false);
        if (state.busy || state.validating) return false;
        const base = state.files.find(entry => entry.internal);
        state.files.filter(entry => !entry.internal).forEach(cleanupPreview);
        state.files = base ? [base] : [];
        if (ui.input) ui.input.value = "";
        if (ui.errors) ui.errors.replaceChildren();
        showProcessing(false, "Reading PDFs", "Preparing your files.", null);
        if (ui.progress) ui.progress.value = 0;
        renderFiles();
        setStatus("New selections cleared. The previous result remains first and will be included.");
        return true;
    }

    function startNewSession() { return resetSession(true); }

    async function continueWithResult() {
        if (state.busy || state.validating || !state.resultBlob) return false;
        const PDFDocument = getPDFDocument();
        if (!PDFDocument) { setStatus("The PDF processing library did not load. Your previous result is still available to download.", "error"); return false; }
        state.validating = true;
        setStatus("Checking the previous merged result…");
        try {
            const parsed = await PDFDocument.load(await state.resultBlob.arrayBuffer());
            if (!parsed || typeof parsed.getPageCount !== "function" || parsed.getPageCount() < 1) throw new Error("No readable pages");
            const blob = state.resultBlob;
            state.files.forEach(cleanupPreview);
            const retained = { id: ++state.id, internal: true, name: "toolxone-merged.pdf", size: blob.size, blob, previewState: "loading", pageCount: null, previewToken: 0 };
            state.files = [retained];
            state.continuing = true;
            ui.input.value = ""; ui.errors.replaceChildren();
            ui.uploadWorkspace.hidden = false; ui.resultWorkspace.hidden = true; ui.retainedResult.hidden = false;
            ui.retainedName.textContent = "toolxone-merged.pdf"; ui.retainedSize.textContent = formatSize(blob.size);
            ui.retainedDownload.href = state.resultUrl; ui.retainedDownload.download = "toolxone-merged.pdf";
            renderFiles(); enqueuePreview(retained); setStatus("Previous result checked. Add PDFs to continue merging."); ui.browse.focus();
            return true;
        } catch (error) {
            setStatus(`${safeError(error)} Your previous result is still available to download.`, "error");
            return false;
        } finally { state.validating = false; renderFiles(); }
    }

    function retainDownload(url) {
        if (!url || !state.objectUrls.has(url)) return;
        const previousTimer = state.downloadTimers.get(url);
        if (previousTimer !== undefined) window.clearTimeout(previousTimer);
        const timer = window.setTimeout(() => revokeObjectUrl(url), 60000);
        state.downloadTimers.set(url, timer);
    }

    function addError(file, message) {
        const row = document.createElement("li");
        row.textContent = `${file && file.name ? file.name : "Selected file"}: ${message}`;
        ui.errors.append(row);
    }

    function isCurrentPreview(entry, token) {
        return entry.previewToken === token && state.files.includes(entry);
    }

    function cleanupPreview(entry) {
        if (!entry) return;
        entry.previewToken = (entry.previewToken || 0) + 1;
        const job = state.previewJobs.get(entry.id);
        if (job) {
            if (job.renderTask && typeof job.renderTask.cancel === "function") {
                try { job.renderTask.cancel(); } catch (_) { /* A completed render cannot be cancelled. */ }
            }
            if (job.loadingTask && typeof job.loadingTask.destroy === "function") {
                try { job.destroyPromise = Promise.resolve(job.loadingTask.destroy()).catch(() => {}); } catch (_) { /* Best-effort cleanup. */ }
            }
            if (job.pdfDocument && typeof job.pdfDocument.destroy === "function") {
                try { Promise.resolve(job.pdfDocument.destroy()).catch(() => {}); } catch (_) { /* Best-effort cleanup. */ }
            }
            state.previewJobs.delete(entry.id);
        }
        if (entry.previewCanvas) {
            entry.previewCanvas.width = 0;
            entry.previewCanvas.height = 0;
            entry.previewCanvas = null;
        }
        entry.previewState = "unavailable";
        entry.pageCount = null;
    }

    async function renderPreview(entry, token) {
        if (!isCurrentPreview(entry, token)) return;
        let loadingTask = null;
        let pdfDocument = null;
        let renderTask = null;
        let page = null;
        let canvas = null;
        const job = {};
        state.previewJobs.set(entry.id, job);
        try {
            const pdfjs = await loadPDFJS();
            if (!isCurrentPreview(entry, token)) return;
            const bytes = await entryBytes(entry);
            if (!isCurrentPreview(entry, token)) return;
            loadingTask = pdfjs.getDocument({ data: bytes });
            job.loadingTask = loadingTask;
            pdfDocument = await loadingTask.promise;
            job.pdfDocument = pdfDocument;
            if (!isCurrentPreview(entry, token)) return;

            entry.pageCount = pdfDocument.numPages;
            if (!Number.isInteger(entry.pageCount) || entry.pageCount < 1) throw new Error("PDF page count unavailable");
            updatePreviewDisplay(entry);
            page = await pdfDocument.getPage(1);
            if (!isCurrentPreview(entry, token)) return;
            const baseViewport = page.getViewport({ scale: 1 });
            const scale = Math.min(
                1,
                PREVIEW_MAX_WIDTH / baseViewport.width,
                PREVIEW_MAX_HEIGHT / baseViewport.height,
                Math.sqrt(PREVIEW_MAX_PIXELS / (baseViewport.width * baseViewport.height))
            );
            const viewport = page.getViewport({ scale });
            canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.floor(viewport.width));
            canvas.height = Math.max(1, Math.floor(viewport.height));
            const context = canvas.getContext("2d", { alpha: false });
            if (!context) throw new Error("Canvas rendering is unavailable");
            renderTask = page.render({ canvasContext: context, viewport });
            job.renderTask = renderTask;
            await renderTask.promise;
            if (!isCurrentPreview(entry, token)) {
                canvas.width = 0; canvas.height = 0;
                return;
            }
            entry.previewCanvas = canvas;
            entry.previewState = "ready";
            updatePreviewDisplay(entry);
        } catch (_) {
            if (isCurrentPreview(entry, token)) {
                if (canvas) { canvas.width = 0; canvas.height = 0; }
                entry.previewState = "unavailable";
                updatePreviewDisplay(entry);
            }
        } finally {
            if (page && typeof page.cleanup === "function") {
                try { page.cleanup(); } catch (_) { /* Best-effort cleanup. */ }
            }
            if (renderTask && typeof renderTask.cancel === "function" && !entry.previewCanvas) {
                try { renderTask.cancel(); } catch (_) { /* No-op after completion. */ }
            }
            if (job.destroyPromise) {
                await job.destroyPromise;
            } else if (loadingTask && typeof loadingTask.destroy === "function") {
                try { await loadingTask.destroy(); } catch (_) { /* Best-effort cleanup. */ }
            } else if (pdfDocument && typeof pdfDocument.destroy === "function") {
                try { await pdfDocument.destroy(); } catch (_) { /* Best-effort cleanup. */ }
            }
            if (state.previewJobs.get(entry.id) === job) state.previewJobs.delete(entry.id);
        }
    }

    function updatePreviewDisplay(entry) {
        if (!ui.list || !entry) return;
        const row = Array.from(ui.list.children || []).find(item => Number(item.dataset.id) === entry.id);
        if (!row || typeof row.querySelector !== "function") return;
        const preview = row.querySelector(".merge-pdf-preview");
        const pages = row.querySelector(".merge-pdf-page-count");
        if (preview) {
            preview.replaceChildren();
            if (entry.previewCanvas) {
                preview.append(entry.previewCanvas);
            } else {
                const placeholder = document.createElement("span");
                placeholder.className = "merge-pdf-preview-placeholder";
                placeholder.textContent = entry.previewState === "loading" ? "Loading preview…" : "Preview unavailable";
                preview.append(placeholder);
            }
        }
        if (pages) {
            pages.textContent = Number.isInteger(entry.pageCount)
                ? `${entry.pageCount} ${entry.pageCount === 1 ? "page" : "pages"}`
                : entry.previewState === "loading" ? "Reading page count…" : "Page count unavailable";
        }
    }

    function enqueuePreview(entry) {
        const token = (entry.previewToken || 0) + 1;
        entry.previewToken = token;
        entry.previewState = "loading";
        entry.pageCount = null;
        renderFiles();
        const operation = state.previewQueue.then(() => renderPreview(entry, token), () => renderPreview(entry, token));
        state.previewQueue = operation.catch(() => {});
        return operation;
    }

    function isPDFCandidate(file) {
        return Boolean(file && (file.type === "application/pdf" || /\.pdf$/i.test(file.name || "")));
    }

    function currentTotal() {
        return state.files.reduce((sum, entry) => sum + entrySize(entry), 0);
    }

    function acceptFiles(fileList) {
        const incoming = Array.from(fileList || []);
        const process = () => processFiles(incoming);
        const operation = state.acceptQueue.then(process, process);
        state.acceptQueue = operation.catch(() => {});
        return operation;
    }

    async function processFiles(incoming) {
        const PDFDocument = getPDFDocument();
        if (!PDFDocument) {
            setStatus("The PDF processing library did not load. Refresh the page and try again.", "error");
            return { accepted: 0, rejected: incoming.length };
        }
        if (!incoming.length || state.busy) return { accepted: 0, rejected: 0 };
        ui.errors.replaceChildren();
        state.validating = true;
        renderFiles();
        let accepted = 0;
        try {
            for (const file of incoming) {
                if (!isPDFCandidate(file)) {
                    addError(file, "Choose a PDF file.");
                    continue;
                }
                if (state.files.length >= LIMITS.maxFiles) {
                    addError(file, `The maximum is ${LIMITS.maxFiles} PDFs per merge.`);
                    continue;
                }
                if (file.size > LIMITS.maxFileBytes) {
                    addError(file, `This file exceeds the ${formatSize(LIMITS.maxFileBytes)} per-file limit.`);
                    continue;
                }
                if (currentTotal() + file.size > LIMITS.maxTotalBytes) {
                    addError(file, `Adding this file would exceed the ${formatSize(LIMITS.maxTotalBytes)} total input limit.`);
                    continue;
                }
                try {
                    setStatus(`Checking ${file.name}…`);
                    const bytes = await file.arrayBuffer();
                    const parsed = await PDFDocument.load(bytes);
                    if (!parsed || typeof parsed.getPageCount !== "function" || parsed.getPageCount() < 1) {
                        throw new Error("PDF contains no readable pages");
                    }
                    const entry = { id: ++state.id, file, internal: false, previewState: "loading", pageCount: null, previewToken: 0 };
                    state.files.push(entry);
                    enqueuePreview(entry);
                    accepted++;
                } catch (error) {
                    addError(file, safeError(error));
                }
            }
            renderFiles();
            if (accepted) setStatus(`${accepted} PDF${accepted === 1 ? "" : "s"} added and checked. Arrange the list, then merge.`);
            else if (!ui.errors.children.length) setStatus("No files were added.", "error");
            return { accepted, rejected: incoming.length - accepted };
        } finally {
            state.validating = false;
            renderFiles();
        }
    }

    function findIndex(id) {
        return state.files.findIndex(entry => entry.id === Number(id));
    }

    function reorderFile(id, direction) {
        if (state.busy || state.validating) return false;
        const index = findIndex(id);
        const next = direction === "up" ? index - 1 : direction === "down" ? index + 1 : -1;
        if (index < 0 || next < 0 || next >= state.files.length) return false;
        if (state.continuing && (index === 0 || next === 0)) return false;
        [state.files[index], state.files[next]] = [state.files[next], state.files[index]];
        renderFiles();
        announcePosition(state.files[next], next);
        return true;
    }

    function announcePosition(entry, index) {
        setStatus(`${entryName(entry)} moved to position ${index + 1} of ${state.files.length}.`, "success");
    }

    function clearDropIndicators() {
        if (!ui.list) return;
        ui.list.querySelectorAll(".merge-pdf-file").forEach(item => {
            item.classList.remove("is-drop-before", "is-drop-after");
        });
    }

    function findDropPosition(event, target) {
        if (target.internal) return "after";
        const bounds = target.element.getBoundingClientRect();
        return event.clientY < bounds.top + bounds.height / 2 ? "before" : "after";
    }

    function reorderByDrop(sourceId, targetId, position) {
        if (state.busy || state.validating) return false;
        const sourceIndex = findIndex(sourceId);
        const targetIndex = findIndex(targetId);
        if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return false;
        const source = state.files[sourceIndex];
        const target = state.files[targetIndex];
        if (source.internal || (position !== "before" && position !== "after")) return false;

        let insertionIndex = target.internal ? 1 : targetIndex + (position === "after" ? 1 : 0);
        if (sourceIndex < insertionIndex) insertionIndex--;
        insertionIndex = Math.max(state.continuing ? 1 : 0, Math.min(state.files.length - 1, insertionIndex));
        if (sourceIndex === insertionIndex) return false;

        state.files.splice(sourceIndex, 1);
        state.files.splice(insertionIndex, 0, source);
        state.movedId = source.id;
        if (state.movedTimer !== null) window.clearTimeout(state.movedTimer);
        state.movedTimer = window.setTimeout(() => {
            state.movedId = null;
            state.movedTimer = null;
            const movedItem = Array.from(ui.list.children || []).find(item => Number(item.dataset.id) === source.id);
            if (movedItem) movedItem.classList.remove("is-reordered");
        }, 1500);
        state.draggingId = null;
        state.dropIndicator = null;
        renderFiles();
        announcePosition(source, insertionIndex);
        return true;
    }

    function handleDragStart(event) {
        const item = event.target && event.target.closest ? event.target.closest(".merge-pdf-file") : null;
        if (!item || !ui.list.contains(item)) return;
        const id = Number(item.dataset.id);
        const index = findIndex(id);
        if (index < 0 || state.files[index].internal || state.dragOriginId !== id || state.busy || state.validating) {
            event.preventDefault();
            state.dragOriginId = null;
            return;
        }
        state.draggingId = state.files[index].id;
        state.dragOriginId = null;
        state.dropIndicator = null;
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", String(state.draggingId));
        }
        item.classList.add("is-dragging");
    }

    function handleDragEnter(event) {
        handleDragOver(event);
    }

    function handleDragLeave(event) {
        if (state.draggingId === null) return;
        const item = event.target && event.target.closest ? event.target.closest(".merge-pdf-file") : null;
        if (!item || !ui.list.contains(item) || (event.relatedTarget && item.contains(event.relatedTarget))) return;
        if (state.dropIndicator && state.dropIndicator.id === Number(item.dataset.id)) {
            item.classList.remove("is-drop-before", "is-drop-after");
            state.dropIndicator = null;
        }
    }

    function handleDragOver(event) {
        if (state.draggingId === null || state.busy || state.validating) return;
        const item = event.target && event.target.closest ? event.target.closest(".merge-pdf-file") : null;
        if (!item || !ui.list.contains(item)) return;
        const targetIndex = findIndex(item.dataset.id);
        if (targetIndex < 0 || Number(item.dataset.id) === state.draggingId) return;
        const target = state.files[targetIndex];
        const position = findDropPosition(event, { internal: target.internal, element: item });
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
        if (state.dropIndicator && state.dropIndicator.id === target.id && state.dropIndicator.position === position) return;
        clearDropIndicators();
        state.dropIndicator = { id: target.id, position };
        item.classList.add(position === "before" ? "is-drop-before" : "is-drop-after");
    }

    function handleDrop(event) {
        if (state.draggingId === null) return;
        const item = event.target && event.target.closest ? event.target.closest(".merge-pdf-file") : null;
        if (!item || !ui.list.contains(item)) {
            finishDrag(false);
            return;
        }
        const targetIndex = findIndex(item.dataset.id);
        const sourceId = state.draggingId;
        const target = targetIndex >= 0 ? state.files[targetIndex] : null;
        const position = target && state.dropIndicator && state.dropIndicator.id === target.id
            ? state.dropIndicator.position
            : target && target.internal ? "after" : null;
        const changed = target && position ? reorderByDrop(sourceId, target.id, position) : false;
        event.preventDefault();
        if (!changed) {
            finishDrag(false);
            setStatus("No change. Drop a PDF on another document to reorder it.");
        }
    }

    function finishDrag(keepMovedHighlight) {
        state.draggingId = null;
        state.dragOriginId = null;
        state.dropIndicator = null;
        if (!keepMovedHighlight) renderFiles();
        else clearDropIndicators();
    }

    function removeFile(id) {
        if (state.busy || state.validating) return false;
        const index = findIndex(id);
        if (index < 0) return false;
        if (state.files[index].internal) return false;
        const restoreFocus = document.activeElement && ui.list.contains(document.activeElement);
        cleanupPreview(state.files[index]);
        state.files.splice(index, 1);
        renderFiles();
        if (restoreFocus) {
            const removeButtons = Array.from(ui.list.querySelectorAll('button[data-action="remove"]'));
            const target = removeButtons[Math.min(index, removeButtons.length - 1)];
            if (target) target.focus();
            else ui.browse.focus();
        }
        setStatus(state.files.length ? "PDF removed. The remaining files are ready." : "Choose at least two PDFs to begin.");
        return true;
    }

    async function merge() {
        const PDFDocument = getPDFDocument();
        if (!PDFDocument) {
            setStatus("The PDF processing library did not load. Refresh the page and try again.", "error");
            return false;
        }
        if (state.busy || state.validating) return false;
        if (state.files.length < 2) {
            setStatus("Please add at least two valid PDF files.", "error");
            return false;
        }
        setBusy(true);
        if (ui.errors) ui.errors.replaceChildren();
        try {
            showProcessing(true, "Reading PDFs", "Opening selected files in their displayed order.", null);
            const output = await PDFDocument.create();
            for (let index = 0; index < state.files.length; index++) {
                const entry = state.files[index], name = entryName(entry);
                showProcessing(true, "Reading PDFs", `Reading ${name} (${index + 1} of ${state.files.length}).`, null);
                let source;
                try {
                    source = await PDFDocument.load(await entryBytes(entry));
                } catch (error) {
                    throw new Error(`${name}: ${safeError(error)}`);
                }
                showProcessing(true, "Copying pages", `Adding pages from ${name} (${index + 1} of ${state.files.length}).`, Math.round(index / state.files.length * 90));
                const pages = await output.copyPages(source, source.getPageIndices());
                pages.forEach(page => output.addPage(page));
                source = null;
                showProcessing(true, "Copying pages", `Added ${name}.`, Math.round((index + 1) / state.files.length * 90));
            }
            showProcessing(true, "Saving merged PDF", "Preparing your download.", 95);
            const bytes = await output.save();
            const verified = await PDFDocument.load(bytes);
            if (!verified || verified.getPageCount() < 1) throw new Error("The merged output could not be verified.");
            const blob = new Blob([bytes], { type: "application/pdf" });
            showProcessing(false);
            const oldUrl = state.resultUrl;
            state.resultBlob = blob;
            state.resultUrl = URL.createObjectURL(blob);
            state.objectUrls.add(state.resultUrl);
            state.files.forEach(cleanupPreview);
            state.files = [];
            state.continuing = false;
            if (oldUrl && !state.downloadTimers.has(oldUrl)) revokeObjectUrl(oldUrl);
            showResult(blob);
            return true;
        } catch (error) {
            showProcessing(false);
            if (ui.uploadWorkspace) ui.uploadWorkspace.hidden = false;
            if (ui.resultWorkspace) ui.resultWorkspace.hidden = true;
            if (ui.retainedResult) ui.retainedResult.hidden = !state.continuing;
            const message = error && error.message ? error.message : "The selected PDFs could not be merged.";
            setStatus(message, "error");
            return false;
        } finally {
            setBusy(false);
        }
    }

    function download() {
        const target = state.continuing ? ui.retainedDownload : ui.download;
        if (!state.resultUrl || !target) return false;
        target.click();
        return true;
    }

    function bind() {
        if (live) return;
        document.addEventListener("click", event => {
            const button = event.target.closest("[data-hero-action]");
            if (!button) return;
            if (button.dataset.heroAction === "start-calculating") {
                if (ui.uploadWorkspace && ui.uploadWorkspace.hidden) startNewSession();
                if (ui.uploadWorkspace) ui.uploadWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
                ui.input.click();
            } else if (button.dataset.heroAction === "learn-more") {
                const article = byId("pdfInfo");
                if (article) {
                    article.scrollIntoView({ behavior: "smooth", block: "start" });
                    article.focus({ preventScroll: true });
                }
            }
        });
        ui.input.addEventListener("change", async event => {
            await acceptFiles(event.target.files);
            event.target.value = "";
        });
        ui.browse.addEventListener("click", () => ui.input.click());
        ui.drop.addEventListener("dragover", event => {
            event.preventDefault();
            ui.drop.classList.add("is-dragging");
        });
        ui.drop.addEventListener("dragleave", event => {
            if (!ui.drop.contains(event.relatedTarget)) ui.drop.classList.remove("is-dragging");
        });
        ui.drop.addEventListener("drop", async event => {
            event.preventDefault();
            ui.drop.classList.remove("is-dragging");
            await acceptFiles(event.dataTransfer.files);
        });
        ui.list.addEventListener("click", event => {
            const button = event.target.closest("button[data-action]");
            if (!button) return;
            if (button.dataset.action === "remove") removeFile(button.dataset.id);
            else if (button.dataset.action === "up" || button.dataset.action === "down") reorderFile(button.dataset.id, button.dataset.action);
        });
        ui.list.addEventListener("dragstart", handleDragStart);
        ui.list.addEventListener("mousedown", event => {
            const handle = event.target && event.target.closest ? event.target.closest('[data-action="drag-handle"]') : null;
            const item = handle && ui.list.contains(handle) ? handle.closest(".merge-pdf-file") : null;
            state.dragOriginId = event.button === 0 && item ? Number(item.dataset.id) : null;
        });
        ui.list.addEventListener("dragover", handleDragOver);
        ui.list.addEventListener("dragenter", handleDragEnter);
        ui.list.addEventListener("dragleave", handleDragLeave);
        ui.list.addEventListener("drop", handleDrop);
        ui.list.addEventListener("dragend", () => finishDrag(false));
        window.addEventListener("mouseup", () => { state.dragOriginId = null; });
        ui.clear.addEventListener("click", clearAll);
        ui.merge.addEventListener("click", merge);
        if (ui.more) ui.more.addEventListener("click", continueWithResult);
        if (ui.newMerge) ui.newMerge.addEventListener("click", startNewSession);
        if (ui.download) ui.download.addEventListener("click", () => retainDownload(state.resultUrl));
        if (ui.retainedDownload) ui.retainedDownload.addEventListener("click", () => retainDownload(state.resultUrl));
        window.addEventListener("beforeunload", cleanup);
        live = true;
    }

    function init() {
        ui.input = byId("mergePdfInput"); ui.browse = byId("mergePdfBrowse"); ui.drop = byId("mergePdfDrop");
        ui.list = byId("mergePdfFiles"); ui.count = byId("mergePdfCount"); ui.errors = byId("mergePdfErrors");
        ui.listViewport = byId("mergePdfListViewport");
        ui.status = byId("mergePdfStatus"); ui.merge = byId("mergePdfMerge"); ui.clear = byId("mergePdfClear");
        ui.retainedResult = byId("mergePdfRetainedResult"); ui.retainedName = byId("mergePdfRetainedName"); ui.retainedSize = byId("mergePdfRetainedSize"); ui.retainedDownload = byId("mergePdfRetainedDownload");
        ui.processing = byId("mergePdfProcessing"); ui.processingTitle = byId("mergePdfProcessingTitle");
        ui.processingMessage = byId("mergePdfProcessingMessage"); ui.progress = byId("mergePdfProgress");
        ui.uploadWorkspace = byId("mergePdfUploadWorkspace"); ui.resultWorkspace = byId("mergePdfResultWorkspace");
        ui.resultHeading = byId("mergePdfResultHeading"); ui.outputName = byId("mergePdfOutputName"); ui.outputSize = byId("mergePdfOutputSize");
        ui.download = byId("mergePdfDownload"); ui.more = byId("mergePdfMore"); ui.newMerge = byId("mergePdfNew");
        if (!ui.input || !ui.list) return;
        bind();
        renderFiles();
        if (!getPDFDocument()) {
            ui.merge.disabled = true;
            setStatus("PDF processing is unavailable because the library did not load. Refresh to try again.", "error");
        }
    }

    function cleanup() {
        state.downloadTimers.forEach(timer => window.clearTimeout(timer));
        state.downloadTimers.clear();
        state.objectUrls.forEach(url => URL.revokeObjectURL(url));
        state.objectUrls.clear();
        state.resultUrl = null;
        state.resultBlob = null;
        state.files.forEach(cleanupPreview);
        state.files = [];
        state.continuing = false;
    }

    window.ToolXoneMergePDF = {
        version: "1.0.0", limits: LIMITS, init, acceptFiles, reorderFile, removeFile, clearAll, startNewSession, continueWithResult, merge, download, cleanup,
        getState: () => ({ files: state.files.map(entry => ({ name: entryName(entry), size: entrySize(entry), internal: Boolean(entry.internal), previewState: entry.previewState || "unavailable", pageCount: entry.pageCount || null, previewDimensions: entry.previewCanvas ? { width: entry.previewCanvas.width, height: entry.previewCanvas.height } : null })), busy: state.busy, resultUrl: state.resultUrl, hasResult: Boolean(state.resultBlob), continuing: state.continuing }),
        waitForPreviews: () => state.previewQueue,
        getPDFDocument
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})(window, document);
