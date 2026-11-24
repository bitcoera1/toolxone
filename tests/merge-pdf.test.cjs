'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'js/pdf/merge-pdf.js'), 'utf8');

function setup(withLibrary = true, outputSize = 4, previewOptions = {}) {
    const elements = new Map();
    const revoked = [];
    const timers = new Map();
    const canvases = [];
    let nextTimerId = 0;
    const previewLog = { workerSrc: null, renders: [], destroyedTasks: 0, destroyedDocuments: 0, cancelledRenders: 0 };
    class Element {
        constructor(tag = 'div') {
            this.tagName = tag;
            this.children = [];
            this.listeners = {};
            this.dataset = {};
            this.attributes = {};
            this.parentElement = null;
            this.hidden = false;
            this.disabled = false;
            this.value = '';
            const classes = new Set();
            this.classList = {
                add(...names) { names.forEach(name => classes.add(name)); },
                remove(...names) { names.forEach(name => classes.delete(name)); },
                contains(name) { return classes.has(name); }
            };
            this.textContent = '';
            this.files = [];
            this.width = 0;
            this.height = 0;
            if (tag === 'canvas') canvases.push(this);
        }
        addEventListener(type, callback) { this.listeners[type] = callback; }
        append(...nodes) { nodes.forEach(node => { node.parentElement = this; this.children.push(node); }); }
        appendChild(node) { this.append(node); return node; }
        replaceChildren(...nodes) { this.children.forEach(node => { node.parentElement = null; }); this.children = []; this.append(...nodes); }
        setAttribute(name, value) { this.attributes[name] = value; }
        removeAttribute(name) { delete this.attributes[name]; }
        getAttribute(name) { return this.attributes[name]; }
        contains(node) { return this === node || this.children.some(child => child.contains(node)); }
        closest(selector) {
            let node = this;
            while (node) {
                if (selector === '.merge-pdf-file' && /(^|\s)merge-pdf-file(\s|$)/.test(node.className || '')) return node;
                if (selector === 'button[data-action]' && node.tagName === 'button' && node.dataset.action) return node;
                const actionMatch = selector.match(/^\[data-action="([^"]+)"\]$/);
                if (actionMatch && node.dataset.action === actionMatch[1]) return node;
                node = node.parentElement;
            }
            return null;
        }
        querySelectorAll(selector) {
            const found = [];
            const visit = node => node.children.forEach(child => {
                if (selector === 'button[data-action]' && child.tagName === 'button' && child.dataset.action) found.push(child);
                const classMatch = selector.match(/^\.([\w-]+)$/);
                if (classMatch && (child.className || '').split(/\s+/).includes(classMatch[1])) found.push(child);
                visit(child);
            });
            visit(this);
            return found;
        }
        querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
        focus() { this.focused = true; }
        click() { this.clicked = true; if (this.listeners.click) this.listeners.click({ target: this }); }
        getContext() { return {}; }
        getBoundingClientRect() { return this.bounds || { top: 0, height: 100 }; }
    }
    const ids = ['mergePdfInput', 'mergePdfBrowse', 'mergePdfDrop', 'mergePdfFiles', 'mergePdfListViewport', 'mergePdfCount', 'mergePdfErrors', 'mergePdfStatus', 'mergePdfMerge', 'mergePdfClear', 'mergePdfProcessing', 'mergePdfProcessingTitle', 'mergePdfProcessingMessage', 'mergePdfProgress', 'mergePdfUploadWorkspace', 'mergePdfResultWorkspace', 'mergePdfResultHeading', 'mergePdfOutputName', 'mergePdfOutputSize', 'mergePdfDownload', 'mergePdfMore', 'mergePdfNew', 'mergePdfRetainedResult', 'mergePdfRetainedName', 'mergePdfRetainedSize', 'mergePdfRetainedDownload'];
    ids.forEach(id => elements.set(id, new Element()));
    const order = [];
    class PDFDocument {
        static async load(buffer) {
            const key = Buffer.from(buffer).toString();
            if (key.startsWith('encrypted')) throw new Error('Input document is encrypted');
            if (key.startsWith('malformed')) throw new Error('Failed to parse PDF document');
            if (key.startsWith('unsupported')) throw new Error('Unsupported PDF feature');
            return { key, getPageCount: () => 1, getPageIndices: () => [0] };
        }
        static async create() {
            return {
                async copyPages(doc, indices) { if (doc.key === 'merge-failure') throw new Error('Unable to copy PDF pages'); return indices.map(index => ({ source: doc.key, index })); },
                addPage(page) { order.push(page.source); },
                async save() { const bytes = new Uint8Array(outputSize); bytes.set([37, 80, 68, 70]); return bytes; }
            };
        }
    }
    const pdfjs = {
        GlobalWorkerOptions: {
            set workerSrc(value) { previewLog.workerSrc = value; },
            get workerSrc() { return previewLog.workerSrc; }
        },
        getDocument({ data }) {
            const key = Buffer.from(data).toString();
            const pages = Number((key.match(/pages:(\d+)/) || [])[1]) || 1;
            const document = {
                numPages: pages,
                async getPage(pageNumber) {
                    assert.equal(pageNumber, 1);
                    return {
                        getViewport({ scale }) { return { width: 612 * scale, height: 792 * scale }; },
                        cleanup() {},
                        render({ canvasContext, viewport }) {
                            previewLog.renders.push({ key, width: viewport.width, height: viewport.height });
                            const promise = previewOptions.renderPromise
                                ? previewOptions.renderPromise(key)
                                : Promise.resolve();
                            return { promise, cancel() { previewLog.cancelledRenders++; } };
                        }
                    };
                },
                async destroy() { previewLog.destroyedDocuments++; }
            };
            const loadingTask = { promise: Promise.resolve(document), async destroy() { previewLog.destroyedTasks++; } };
            return loadingTask;
        }
    };
    const testHook = {
        async importPDFJS() {
            if (previewOptions.importError) throw new Error('PDF.js CDN unavailable');
            return pdfjs;
        }
    };
    const context = {
        console,
        Blob,
        URL: { createObjectURL: () => `blob:test-${Math.random()}`, revokeObjectURL: url => revoked.push(url) },
        PDFLib: withLibrary ? { PDFDocument } : null,
        __TOOLXONE_MERGE_PDF_TEST__: testHook,
        document: { readyState: 'complete', activeElement: null, getElementById: id => elements.get(id) || null, createElement: tag => new Element(tag), addEventListener() {} },
        addEventListener() {},
        setTimeout(callback) { const id = ++nextTimerId; timers.set(id, callback); return id; },
        clearTimeout(id) { timers.delete(id); }
    };
    context.window = context;
    vm.createContext(context);
    vm.runInContext(source, context, { filename: 'js/pdf/merge-pdf.js' });
    return { api: context.ToolXoneMergePDF, elements, order, revoked, previewLog, canvases, runTimers() { for (const [id, callback] of Array.from(timers)) { timers.delete(id); callback(); } } };
}

function file(name, content = 'valid', size = 10, type = 'application/pdf') {
    return { name, size, type, async arrayBuffer() { return Buffer.from(content); } };
}

function dragFile(elements, fromIndex, toIndex, placement = 'before', expectStart = true) {
    const list = elements.get('mergePdfFiles');
    const sourceRow = list.children[fromIndex];
    const sourceHandle = sourceRow.children[1].children[0];
    const targetRow = list.children[toIndex];
    targetRow.bounds = { top: 100, height: 100 };
    const dataTransfer = { effectAllowed: '', dropEffect: '', data: '', setData(type, value) { this.data = value; } };
    const mouseDown = { target: sourceHandle, button: 0 };
    list.listeners.mousedown(mouseDown);
    const event = { target: sourceRow, dataTransfer, prevented: false, preventDefault() { this.prevented = true; } };
    list.listeners.dragstart(event);
    assert.equal(event.prevented, !expectStart, 'only the grip may initiate row dragging');
    if (expectStart) assert.equal(sourceRow.draggable, true, 'document row is the native drag source');
    const over = { target: targetRow, clientY: placement === 'before' ? 101 : 199, dataTransfer, preventDefault() { this.prevented = true; } };
    list.listeners.dragenter(over);
    list.listeners.dragover(over);
    const drop = { target: targetRow, clientY: over.clientY, dataTransfer, preventDefault() { this.prevented = true; } };
    list.listeners.drop(drop);
    list.listeners.dragend({ target: sourceHandle });
    return { dataTransfer, drop, targetRow };
}

test('Merges multiple PDFs in the displayed order and creates a downloadable PDF', async () => {
    const { api, elements, order } = setup();
    await api.acceptFiles([file('first.pdf', 'first'), file('second.pdf', 'second')]);
    assert.deepEqual(Array.from(api.getState().files, item => item.name), ['first.pdf', 'second.pdf']);
    assert.equal(await api.merge(), true);
    assert.deepEqual(order, ['first', 'second']);
    assert.match(api.getState().resultUrl, /^blob:test-/);
    assert.equal(elements.get('mergePdfDownload').download, 'toolxone-merged.pdf');
    assert.equal(elements.get('mergePdfUploadWorkspace').hidden, true);
    assert.equal(elements.get('mergePdfResultWorkspace').hidden, false);
    assert.equal(elements.get('mergePdfOutputName').textContent, 'toolxone-merged.pdf');
    assert.equal(elements.get('mergePdfOutputSize').textContent, '4 B');
});

test('Reads PDF.js page counts and renders bounded first-page previews sequentially', async () => {
    const { api, previewLog } = setup();
    await api.acceptFiles([file('one.pdf', 'one pages:2'), file('two.pdf', 'two pages:4')]);
    await api.waitForPreviews();
    const files = api.getState().files;
    assert.deepEqual(Array.from(files, item => item.pageCount), [2, 4]);
    assert.ok(files.every(item => item.previewState === 'ready'));
    assert.ok(files.every(item => item.previewDimensions.width <= 144 && item.previewDimensions.height <= 184));
    assert.ok(files.every(item => item.previewDimensions.width * item.previewDimensions.height <= 26496));
    assert.equal(previewLog.workerSrc, 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs');
    assert.equal(previewLog.renders.length, 2);
    assert.equal(previewLog.destroyedTasks, 2);
    assert.equal(api.getState().files[0].name, 'one.pdf');
});

test('A retained prior result receives a page count and preview during continuation', async () => {
    const { api, previewLog } = setup();
    await api.acceptFiles([file('one.pdf', 'one'), file('two.pdf', 'two')]);
    await api.merge();
    await api.continueWithResult();
    await api.waitForPreviews();
    const previous = api.getState().files[0];
    assert.equal(previous.internal, true);
    assert.equal(previous.pageCount, 1);
    assert.equal(previous.previewState, 'ready');
    assert.equal(previewLog.renders.at(-1).key, '%PDF');
});

test('PDF.js preview failure is nonfatal and reports unavailable metadata', async () => {
    const { api, elements } = setup(true, 4, { importError: true });
    await api.acceptFiles([file('one.pdf'), file('two.pdf')]);
    await api.waitForPreviews();
    assert.equal(api.getState().files[0].previewState, 'unavailable');
    assert.equal(api.getState().files[0].pageCount, null);
    assert.equal(await api.merge(), true);
    assert.equal(elements.get('mergePdfResultWorkspace').hidden, false);
});

test('Removing an entry during a pending render prevents stale preview updates and releases the canvas', async () => {
    let finishRender;
    let markRenderStarted;
    const renderStarted = new Promise(resolve => { markRenderStarted = resolve; });
    const renderPromise = key => key.startsWith('pending')
        ? new Promise(resolve => { finishRender = resolve; markRenderStarted(); })
        : Promise.resolve();
    const { api, previewLog, canvases } = setup(true, 4, { renderPromise });
    await api.acceptFiles([file('pending.pdf', 'pending'), file('other.pdf', 'other')]);
    await renderStarted;
    const firstId = 1;
    assert.equal(api.removeFile(firstId), true);
    if (finishRender) finishRender();
    await api.waitForPreviews();
    assert.deepEqual(Array.from(api.getState().files, item => item.name), ['other.pdf']);
    assert.equal(api.getState().files[0].previewState, 'ready');
    assert.equal(canvases[0].width, 0);
    assert.equal(canvases[0].height, 0);
    assert.ok(previewLog.cancelledRenders >= 1);
});

test('Resetting the session during a pending preview invalidates the stale result and releases resources', async () => {
    let finishRender;
    let markRenderStarted;
    const renderStarted = new Promise(resolve => { markRenderStarted = resolve; });
    const renderPromise = key => key.startsWith('pending')
        ? new Promise(resolve => { finishRender = resolve; markRenderStarted(); })
        : Promise.resolve();
    const { api, previewLog, canvases } = setup(true, 4, { renderPromise });
    await api.acceptFiles([file('pending.pdf', 'pending')]);
    await renderStarted;
    assert.equal(api.startNewSession(), true);
    if (finishRender) finishRender();
    await api.waitForPreviews();
    assert.equal(api.getState().files.length, 0);
    assert.equal(canvases[0].width, 0);
    assert.equal(canvases[0].height, 0);
    assert.ok(previewLog.cancelledRenders >= 1);
});

test('Add More PDFs retains the previous result as the first input; Start a New Merge clears it', async () => {
    const { api, elements, revoked, runTimers, order } = setup();
    await api.acceptFiles([file('first.pdf'), file('second.pdf')]);
    assert.equal(await api.merge(), true);
    const previousUrl = api.getState().resultUrl;
    const previousBlob = api.getState().hasResult;
    assert.equal(api.download(), true);
    assert.equal(await api.continueWithResult(), true);
    assert.equal(elements.get('mergePdfUploadWorkspace').hidden, false);
    assert.equal(elements.get('mergePdfResultWorkspace').hidden, true);
    assert.equal(api.getState().files.length, 1);
    assert.equal(api.getState().files[0].internal, true);
    assert.equal(api.getState().hasResult, previousBlob);
    assert.equal(elements.get('mergePdfRetainedResult').hidden, false);
    assert.equal(elements.get('mergePdfRetainedDownload').href, previousUrl);
    await api.acceptFiles([file('third.pdf', 'third')]);
    assert.equal(api.getState().files.length, 2);
    assert.equal(api.getState().files[0].name, 'toolxone-merged.pdf');
    assert.equal(await api.merge(), true);
    assert.equal(order[order.length - 2], '%PDF');
    assert.equal(order[order.length - 1], 'third');
    assert.notEqual(api.getState().resultUrl, previousUrl);
    assert.equal(revoked.includes(previousUrl), false);
    const currentUrl = api.getState().resultUrl;
    elements.get('mergePdfNew').click();
    assert.equal(api.getState().hasResult, false);
    assert.equal(api.getState().resultUrl, null);
    assert.equal(api.getState().files.length, 0);
    assert.ok(revoked.includes(currentUrl));
    runTimers();
    assert.ok(revoked.includes(previousUrl));
});

test('Continuation failure preserves the previous result and keeps its download available', async () => {
    const { api, elements, order } = setup();
    await api.acceptFiles([file('a.pdf', 'a'), file('b.pdf', 'b')]);
    assert.equal(await api.merge(), true);
    const previousUrl = api.getState().resultUrl;
    const priorPageSources = order.length;
    assert.equal(await api.continueWithResult(), true);
    await api.acceptFiles([file('bad-copy.pdf', 'merge-failure')]);
    assert.equal(await api.merge(), false);
    assert.equal(api.getState().resultUrl, previousUrl);
    assert.equal(api.getState().hasResult, true);
    assert.equal(elements.get('mergePdfRetainedDownload').href, previousUrl);
    assert.equal(api.download(), true);
    assert.equal(elements.get('mergePdfRetainedDownload').clicked, true);
    assert.equal(order[priorPageSources], '%PDF');
});

test('Continuation includes the previous result over 25 MiB but still enforces new-file and combined limits', async () => {
    const { api, elements } = setup(true, 26 * 1024 * 1024);
    await api.acceptFiles([file('a.pdf', 'a'), file('b.pdf', 'b')]);
    assert.equal(await api.merge(), true);
    assert.equal(await api.continueWithResult(), true);
    assert.equal(api.getState().files[0].size, 26 * 1024 * 1024);
    await api.acceptFiles([file('too-large.pdf', 'x', api.limits.maxFileBytes + 1)]);
    assert.equal(api.getState().files.length, 1);
    assert.match(elements.get('mergePdfErrors').children[0].textContent, /25\.0 MiB/);
    await api.acceptFiles([file('twenty-five-one.pdf', 'x', 25 * 1024 * 1024)]);
    assert.equal(api.getState().files.length, 2);
    await api.acceptFiles([file('twenty-five-two.pdf', 'x', 25 * 1024 * 1024)]);
    assert.equal(api.getState().files.length, 3);
    await api.acceptFiles([file('twenty-five-three.pdf', 'x', 25 * 1024 * 1024)]);
    assert.equal(api.getState().files.length, 3);
    assert.match(elements.get('mergePdfErrors').children[0].textContent, /total input limit/);
    await api.acceptFiles(Array.from({ length: 9 }, (_, i) => file(`ok${i}.pdf`, `ok${i}`, 1)));
    assert.equal(api.getState().files.length, 10);
    await api.acceptFiles([file('eleventh.pdf')]);
    assert.equal(api.getState().files.length, 10);
    assert.match(elements.get('mergePdfErrors').children[0].textContent, /maximum is 10/);
    assert.equal(api.getState().hasResult, true);
});

test('A failed internal-result validation leaves the result workspace and download intact', async () => {
    const { api, elements } = setup();
    await api.acceptFiles([file('a.pdf'), file('b.pdf')]);
    assert.equal(await api.merge(), true);
    const previousUrl = api.getState().resultUrl;
    const resultBlob = api.getState().hasResult;
    const originalLoad = api.getPDFDocument().load;
    api.getPDFDocument().load = async bytes => {
        if (Buffer.from(bytes).toString().startsWith('%PDF')) throw new Error('Failed to parse PDF document');
        return originalLoad.call(api.getPDFDocument(), bytes);
    };
    assert.equal(await api.continueWithResult(), false);
    assert.equal(api.getState().resultUrl, previousUrl);
    assert.equal(api.getState().hasResult, resultBlob);
    assert.equal(elements.get('mergePdfResultWorkspace').hidden, false);
    assert.equal(api.download(), true);
});

test('A merge error stays in the upload workspace and keeps a useful message visible', async () => {
    const { api, elements } = setup();
    await api.acceptFiles([file('first.pdf', 'first'), file('second.pdf', 'merge-failure')]);
    assert.equal(await api.merge(), false);
    assert.equal(elements.get('mergePdfUploadWorkspace').hidden, false);
    assert.equal(elements.get('mergePdfResultWorkspace').hidden, true);
    assert.match(elements.get('mergePdfStatus').textContent, /Unable to copy PDF pages/);
});

test('Move controls change merge order and remove deletes only the selected file', async () => {
    const { api, order } = setup();
    await api.acceptFiles([file('one.pdf', 'one'), file('two.pdf', 'two'), file('three.pdf', 'three')]);
    assert.equal(api.reorderFile(3, 'up'), true);
    assert.equal(api.reorderFile(1, 'down'), true);
    assert.equal(api.removeFile(2), true);
    assert.deepEqual(Array.from(api.getState().files, item => item.name), ['three.pdf', 'one.pdf']);
    assert.equal(await api.merge(), true);
    assert.deepEqual(order, ['three', 'one']);
    assert.equal(api.download(), true);
});

test('Mouse dragging reorders PDFs earlier and later, and merge follows the displayed order', async () => {
    const { api, elements, order } = setup();
    await api.acceptFiles([file('one.pdf', 'one'), file('two.pdf', 'two'), file('three.pdf', 'three')]);
    const firstHandle = elements.get('mergePdfFiles').children[0].children[1].children[0];
    assert.match(firstHandle.getAttribute('aria-label'), /grip to drag one\.pdf/);
    assert.equal(firstHandle.draggable, false);
    dragFile(elements, 2, 0, 'before');
    assert.deepEqual(Array.from(api.getState().files, item => item.name), ['three.pdf', 'one.pdf', 'two.pdf']);
    assert.match(elements.get('mergePdfStatus').textContent, /three\.pdf moved to position 1 of 3/);
    dragFile(elements, 0, 2, 'after');
    assert.deepEqual(Array.from(api.getState().files, item => item.name), ['one.pdf', 'two.pdf', 'three.pdf']);
    await api.merge();
    assert.deepEqual(order, ['one', 'two', 'three']);
});

test('Invalid drag targets do not change the document order', async () => {
    const { api, elements } = setup();
    await api.acceptFiles([file('one.pdf', 'one'), file('two.pdf', 'two')]);
    const list = elements.get('mergePdfFiles');
    const handle = list.children[0].children[1].children[0];
    const sourceRow = list.children[0];
    const dataTransfer = { setData() {}, effectAllowed: '', dropEffect: '' };
    list.listeners.mousedown({ target: handle, button: 0 });
    list.listeners.dragstart({ target: sourceRow, dataTransfer, preventDefault() {} });
    list.listeners.dragover({ target: sourceRow, clientY: 1, dataTransfer, preventDefault() {} });
    list.listeners.drop({ target: sourceRow, dataTransfer, preventDefault() {} });
    list.listeners.dragend({ target: handle });
    assert.deepEqual(Array.from(api.getState().files, item => item.name), ['one.pdf', 'two.pdf']);
    assert.match(elements.get('mergePdfStatus').textContent, /No change/);

    const outsideTarget = new (sourceRow.constructor)('div');
    const secondHandle = list.children[0].children[1].children[0];
    list.listeners.mousedown({ target: secondHandle, button: 0 });
    list.listeners.dragstart({ target: list.children[0], dataTransfer, preventDefault() {} });
    list.listeners.drop({ target: outsideTarget, dataTransfer, preventDefault() {} });
    list.listeners.dragend({ target: secondHandle });
    assert.deepEqual(Array.from(api.getState().files, item => item.name), ['one.pdf', 'two.pdf']);
});

test('Action buttons cannot initiate dragging from their row', async () => {
    const { api, elements } = setup();
    await api.acceptFiles([file('one.pdf', 'one'), file('two.pdf', 'two')]);
    const list = elements.get('mergePdfFiles');
    const row = list.children[0];
    const remove = row.children[1].children[3];
    const dataTransfer = { setData() {}, effectAllowed: '', dropEffect: '' };
    let prevented = false;
    list.listeners.mousedown({ target: remove, button: 0 });
    list.listeners.dragstart({ target: row, dataTransfer, preventDefault() { prevented = true; } });
    assert.equal(prevented, true);
    list.listeners.dragover({ target: list.children[1], clientY: 101, dataTransfer, preventDefault() {} });
    list.listeners.drop({ target: list.children[1], dataTransfer, preventDefault() {} });
    list.listeners.dragend({ target: row });
    assert.deepEqual(Array.from(api.getState().files, item => item.name), ['one.pdf', 'two.pdf']);
});

test('Continuation keeps the previous result pinned while new PDFs reorder among themselves', async () => {
    const { api, elements, order } = setup();
    await api.acceptFiles([file('base-a.pdf', 'base-a'), file('base-b.pdf', 'base-b')]);
    await api.merge();
    await api.continueWithResult();
    await api.waitForPreviews();
    await api.acceptFiles([file('a.pdf', 'a'), file('b.pdf', 'b'), file('c.pdf', 'c')]);

    const list = elements.get('mergePdfFiles');
    assert.equal(list.children[0].children[1].children[0].textContent, 'Pinned first');
    dragFile(elements, 0, 2, 'after', false);
    assert.deepEqual(Array.from(api.getState().files, item => item.name), ['toolxone-merged.pdf', 'a.pdf', 'b.pdf', 'c.pdf']);
    dragFile(elements, 3, 1, 'before');
    assert.deepEqual(Array.from(api.getState().files, item => item.name), ['toolxone-merged.pdf', 'c.pdf', 'a.pdf', 'b.pdf']);
    dragFile(elements, 3, 0, 'before');
    assert.deepEqual(Array.from(api.getState().files, item => item.name), ['toolxone-merged.pdf', 'b.pdf', 'c.pdf', 'a.pdf']);
    assert.equal(api.reorderFile(1, 'up'), false);
    assert.equal(api.getState().files[0].internal, true);
    assert.equal(await api.merge(), true);
    assert.deepEqual(order.slice(-4), ['%PDF', 'b', 'c', 'a']);
});

test('Reordering preserves preview metadata and does not regenerate thumbnails', async () => {
    const { api, elements, previewLog } = setup();
    await api.acceptFiles([file('one.pdf', 'one pages:2'), file('two.pdf', 'two pages:5')]);
    await api.waitForPreviews();
    const list = elements.get('mergePdfFiles');
    const originalCanvases = new Map(list.children.map(row => [row.children[0].children[1].textContent, row.children[0].children[0].children[0]]));
    const renderedCount = previewLog.renders.length;
    dragFile(elements, 1, 0, 'before');
    const files = api.getState().files;
    assert.deepEqual(Array.from(files, item => [item.name, item.pageCount]), [['two.pdf', 5], ['one.pdf', 2]]);
    assert.equal(previewLog.renders.length, renderedCount);
    assert.equal(list.children[0].children[0].children[0].children[0], originalCanvases.get('two.pdf'));
    assert.equal(list.children[1].children[0].children[0].children[0], originalCanvases.get('one.pdf'));
});

test('Preview completion during a drag updates the row in place and keeps the source valid', async () => {
    let finishRender;
    let markRenderStarted;
    const renderStarted = new Promise(resolve => { markRenderStarted = resolve; });
    const renderPromise = key => key.startsWith('pending')
        ? new Promise(resolve => { finishRender = resolve; markRenderStarted(); })
        : Promise.resolve();
    const { api, elements } = setup(true, 4, { renderPromise });
    await api.acceptFiles([file('pending.pdf', 'pending pages:2'), file('source.pdf', 'source pages:3')]);
    await renderStarted;

    const list = elements.get('mergePdfFiles');
    const sourceRow = list.children[1];
    const targetRow = list.children[0];
    const sourceHandle = sourceRow.children[1].children[0];
    const dataTransfer = { setData() {}, effectAllowed: '', dropEffect: '' };
    list.listeners.mousedown({ target: sourceHandle, button: 0 });
    list.listeners.dragstart({ target: sourceRow, dataTransfer, preventDefault() { throw new Error('grip drag was unexpectedly rejected'); } });

    finishRender();
    await api.waitForPreviews();
    assert.equal(list.children[1], sourceRow, 'preview completion must not replace the active drag row');
    assert.equal(list.children[0], targetRow, 'preview completion must update the target row in place');
    assert.equal(targetRow.querySelector('.merge-pdf-page-count').textContent, '2 pages');

    const over = { target: targetRow, clientY: 1, dataTransfer, preventDefault() {} };
    list.listeners.dragover(over);
    list.listeners.drop({ target: targetRow, dataTransfer, preventDefault() {} });
    list.listeners.dragend({ target: sourceRow });
    assert.deepEqual(Array.from(api.getState().files, item => [item.name, item.pageCount]), [['source.pdf', 3], ['pending.pdf', 2]]);
});

test('Removal and Clear All still work after mouse reordering', async () => {
    const { api, elements } = setup();
    await api.acceptFiles([file('one.pdf', 'one'), file('two.pdf', 'two'), file('three.pdf', 'three')]);
    dragFile(elements, 2, 0, 'before');
    assert.equal(api.removeFile(2), true);
    assert.deepEqual(Array.from(api.getState().files, item => item.name), ['three.pdf', 'one.pdf']);
    assert.equal(api.clearAll(), true);
    assert.equal(api.getState().files.length, 0);
});

test('Rejects wrong types, malformed, encrypted, and unsupported PDFs with filename context', async () => {
    const { api, elements } = setup();
    const result = await api.acceptFiles([
        file('notes.txt', 'valid', 10, 'text/plain'),
        file('broken.pdf', 'malformed'),
        file('locked.pdf', 'encrypted'),
        file('feature.pdf', 'unsupported')
    ]);
    assert.equal(result.accepted, 0);
    const messages = elements.get('mergePdfErrors').children.map(item => item.textContent).join('\n');
    for (const name of ['notes.txt', 'broken.pdf', 'locked.pdf', 'feature.pdf']) assert.ok(messages.includes(name));
    assert.match(messages, /encrypted or password-protected/);
    assert.match(messages, /malformed or uses an unsupported/);
});

test('Enforces file count, per-file, and combined size limits', async () => {
    const { api, elements } = setup();
    const largeFile = file('oversize.pdf', 'valid', api.limits.maxFileBytes + 1);
    await api.acceptFiles([largeFile]);
    assert.equal(api.getState().files.length, 0);
    assert.match(elements.get('mergePdfErrors').children[0].textContent, /oversize\.pdf/);
    const collection = Array.from({ length: api.limits.maxFiles }, (_, i) => file(`${i}.pdf`, `valid-${i}`, 10));
    await api.acceptFiles(collection);
    assert.equal(api.getState().files.length, 10);
    await api.acceptFiles([file('eleventh.pdf')]);
    assert.equal(api.getState().files.length, 10);
    assert.match(elements.get('mergePdfErrors').children[0].textContent, /maximum is 10/);
    api.clearAll();
    await api.acceptFiles(Array.from({ length: 4 }, (_, i) => file(`twenty-five-${i}.pdf`, `twenty-five-${i}`, 25 * 1024 * 1024)));
    await api.acceptFiles([file('one-more.pdf', 'one-more', 1 * 1024 * 1024)]);
    assert.equal(api.getState().files.length, 4);
    assert.match(elements.get('mergePdfErrors').children[0].textContent, /total input limit/);
});

test('Requires two valid files and cleans up replaced or cleared output URLs', async () => {
    const { api, elements, revoked } = setup();
    assert.equal(await api.merge(), false);
    assert.match(elements.get('mergePdfStatus').textContent, /at least two/);
    await api.acceptFiles([file('a.pdf', 'a'), file('b.pdf', 'b')]);
    assert.equal(await api.merge(), true);
    const previous = api.getState().resultUrl;
    api.clearAll();
    assert.ok(revoked.includes(previous));
    assert.equal(api.getState().resultUrl, null);
});

test('Cleans up object URLs on page teardown', async () => {
    const { api, revoked } = setup();
    await api.acceptFiles([file('a.pdf', 'a'), file('b.pdf', 'b')]);
    await api.merge();
    const url = api.getState().resultUrl;
    api.cleanup();
    assert.ok(revoked.includes(url));
    assert.equal(api.getState().files.length, 0);
    assert.equal(api.getState().resultUrl, null);
});

test('Stops safely when the pinned PDF library is unavailable', async () => {
    const { api, elements } = setup(false);
    const outcome = await api.acceptFiles([file('one.pdf')]);
    assert.equal(outcome.accepted, 0);
    assert.equal(outcome.rejected, 1);
    assert.match(elements.get('mergePdfStatus').textContent, /library did not load/);
    assert.equal(elements.get('mergePdfMerge').disabled, true);
});

test('Registers Merge PDF page content and SEO schema', () => {
    const generator = require('../scripts/generate-static-articles.cjs');
    const contentRuntime = generator.loadRuntime();
    for (const type of ['articles', 'faq', 'related', 'hero', 'metadata']) assert.ok(contentRuntime.registry.get(type, 'merge-pdf'));
    const output = contentRuntime.render('merge-pdf');
    const entry = { file: 'merge-pdf.html', key: 'merge-pdf', selector: '#pdfInfo' };
    const html = fs.readFileSync(path.join(__dirname, '..', entry.file), 'utf8');
    const region = generator.region(html, entry);
    assert.equal(html.slice(region.start, region.end), output.replace(/\n/g, generator.eol(html, entry, region)));

    const jsonLdScripts = [];
    const head = { appendChild(script) { jsonLdScripts.push(script); }, querySelectorAll() { return jsonLdScripts; } };
    const context = {
        console,
        document: {
            head,
            body: head,
            createElement() { return { attributes: {}, setAttribute(name, value) { this.attributes[name] = value; }, remove() {} }; },
            querySelectorAll() { return jsonLdScripts; }
        }
    };
    context.window = context;
    vm.createContext(context);
    const load = file => vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
    // Match page order: schema config precedes the content registry, but its FAQ getter
    // is only evaluated by render(), after content-data-pdf.js registers the FAQ.
    load('js/seo/schema-registry.js');
    load('js/seo/schemas/merge-pdf-schema.js');
    load('js/seo/schema-engine.js');
    load('js/content/content-registry.js');
    load('js/content/content-data-pdf.js');
    assert.equal(context.ToolXoneSchemaRegistry.has('MergePDF'), true);
    assert.equal(context.ToolXoneSchemaRegistry.get('MergePDF').meta.canonical.href, 'https://www.toolxone.com/merge-pdf.html');
    const authoritativeFAQ = context.ToolXoneContentRegistry.get('faq', 'merge-pdf');
    const configuredFAQ = context.ToolXoneSchemaRegistry.get('MergePDF').schema.faq;
    assert.ok(configuredFAQ.some(item => /change the order of PDFs/i.test(item.question)));
    assert.equal(configuredFAQ.length, 5);
    assert.deepEqual(JSON.parse(JSON.stringify(configuredFAQ)), JSON.parse(JSON.stringify(authoritativeFAQ)));
    assert.equal(new Set(configuredFAQ.map(item => item.question)).size, 5, 'FAQ questions are unique');

    context.ToolXoneSchema.render(context.ToolXoneSchemaRegistry.get('MergePDF').schema);
    assert.equal(jsonLdScripts.length, 5, 'one JSON-LD block is emitted for each configured schema entity');
    const emitted = jsonLdScripts.map(script => JSON.parse(script.textContent));
    const byType = type => emitted.find(item => item['@type'] === type);
    const faqPage = byType('FAQPage');
    assert.ok(faqPage);
    assert.equal(faqPage.mainEntity.length, 5);
    assert.deepEqual(
        JSON.parse(JSON.stringify(faqPage.mainEntity.map(item => ({ question: item.name, answer: item.acceptedAnswer.text })))),
        JSON.parse(JSON.stringify(authoritativeFAQ.map(item => ({ question: item.question, answer: item.answer }))))
    );
    const organization = byType('Organization');
    for (const key of ['logo', 'description', 'email', 'sameAs']) assert.ok(!(key in organization), `Organization omits ${key}`);
    const webpage = byType('WebPage');
    for (const key of ['isPartOf', 'breadcrumb']) assert.ok(!(key in webpage), `WebPage omits ${key}`);
    for (const entity of [organization, webpage]) {
        for (const value of Object.values(entity)) {
            assert.notEqual(value, '', 'no empty string properties are emitted');
            assert.ok(!Array.isArray(value) || value.length > 0, 'no empty arrays are emitted');
            assert.ok(!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length > 0, 'no empty objects are emitted');
        }
    }
    const breadcrumbs = byType('BreadcrumbList');
    assert.equal(breadcrumbs.itemListElement.length, 3);
    assert.deepEqual(Array.from(breadcrumbs.itemListElement, item => [item.position, item.name, item.item]), [
        [1, 'Home', 'https://www.toolxone.com/'],
        [2, 'PDF Tools', 'https://www.toolxone.com/pdf-tools.html'],
        [3, 'Merge PDF', 'https://www.toolxone.com/merge-pdf.html']
    ]);
    const application = byType('SoftwareApplication');
    assert.ok(application);
    assert.equal(application.name, 'ToolXone Merge PDF');
    assert.equal(application.applicationCategory, 'UtilitiesApplication');
});

test('Keeps the upload panels inside the upload state and result as its sibling', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'merge-pdf.html'), 'utf8');
    const uploadStart = html.indexOf('<div id="mergePdfUploadWorkspace">');
    const panelsStart = html.indexOf('<div class="merge-pdf-panels">', uploadStart);
    const operationsStart = html.indexOf('<section class="merge-pdf-operations-panel"', panelsStart);
    const documentStart = html.indexOf('<section class="merge-pdf-document-panel"', operationsStart);
    const uploadEnd = html.indexOf('</div>', html.indexOf('</div>', html.indexOf('</div>', documentStart) + 6) + 6);
    const resultStart = html.indexOf('<section id="mergePdfResultWorkspace"', uploadStart);
    assert.ok(uploadStart >= 0 && panelsStart > uploadStart);
    assert.ok(operationsStart > panelsStart && documentStart > operationsStart);
    assert.ok(resultStart > uploadEnd, 'result workspace follows the closed upload workspace');
    for (const id of ['mergePdfDrop', 'mergePdfInput', 'mergePdfBrowse', 'mergePdfStatus', 'mergePdfErrors', 'mergePdfMerge', 'mergePdfClear', 'mergePdfProcessing', 'mergePdfProgress', 'mergePdfCount', 'mergePdfListViewport', 'mergePdfFiles', 'mergePdfResultWorkspace', 'mergePdfDownload', 'mergePdfMore', 'mergePdfNew']) {
        assert.equal((html.match(new RegExp(`\\bid=["']${id}["']`, 'g')) || []).length, 1, `${id} remains present exactly once`);
    }
    const ids = Array.from(html.matchAll(/\bid=["']([^"']+)["']/g), match => match[1]);
    assert.equal(ids.length, new Set(ids).size, 'all HTML IDs are unique');
});
