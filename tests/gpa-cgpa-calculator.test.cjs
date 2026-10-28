// Run without dependencies: node --test tests/gpa-cgpa-calculator.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'js/gpa-cgpa-calculator.js'), 'utf8');

function loadMath() {
    const document = { querySelectorAll() { return []; }, getElementById() { return null; } };
    const context = { document, window: {}, console };
    vm.createContext(context);
    vm.runInContext(source, context);
    return context.window.ToolXoneGpaMath;
}

function loadCalculatorUI() {
    const ids = [...fs.readFileSync(path.join(root, 'gpa-cgpa-calculator.html'), 'utf8').matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    const elements = new Map();
    const listeners = {};

    function matches(element, selector) {
        return selector.split(',').some(part => {
            const value = part.trim();
            const tag = value.match(/^[a-z]+/i)?.[0]?.toLowerCase();
            if (tag && element.tagName.toLowerCase() !== tag) return false;
            const type = value.match(/\[type="([^"]+)"\]/)?.[1];
            if (type && element.type !== type) return false;
            const dataAttributes = [...value.matchAll(/\[data-([\w-]+)\]/g)];
            return dataAttributes.every(match => element.dataset[match[1].replace(/-([a-z])/g, (_, char) => char.toUpperCase())] !== undefined);
        });
    }

    class Element {
        constructor(tagName = 'div', id = '') {
            this.tagName = tagName.toUpperCase();
            this.id = id;
            this.children = [];
            this.dataset = {};
            this.attributes = {};
            this.listeners = {};
            this.parentElement = null;
            this.textContent = '';
            this.type = '';
            this.checked = false;
            this._value = '';
        }
        set value(value) { this._value = String(value); }
        get value() {
            if (this.tagName === 'SELECT' && !this.children.some(child => child.value === this._value)) {
                return this.children[0]?.value || '';
            }
            return this._value;
        }
        appendChild(child) { child.parentElement = this; this.children.push(child); return child; }
        replaceChildren(...children) { this.children = []; children.forEach(child => this.appendChild(child)); }
        setAttribute(name, value) { this.attributes[name] = String(value); }
        addEventListener(type, callback) { this.listeners[type] = callback; }
        querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
        querySelectorAll(selector) {
            const found = [];
            const visit = parent => parent.children.forEach(child => {
                if (matches(child, selector)) found.push(child);
                visit(child);
            });
            visit(this);
            return found;
        }
    }

    ids.forEach(id => elements.set(id, new Element('div', id)));
    const quickMode = new Element('input');
    quickMode.type = 'radio'; quickMode.value = 'quick'; quickMode.checked = true;
    const customMode = new Element('input');
    customMode.type = 'radio'; customMode.value = 'custom';
    const cgpaPrevious = new Element('input');
    cgpaPrevious.type = 'radio'; cgpaPrevious.value = 'previous'; cgpaPrevious.checked = true;
    const cgpaSemesters = new Element('input');
    cgpaSemesters.type = 'radio'; cgpaSemesters.value = 'semesters';
    const courseModes = [quickMode, customMode];
    const cgpaModes = [cgpaPrevious, cgpaSemesters];
    const document = {
        getElementById(id) { return elements.get(id) || null; },
        createElement(tagName) { return new Element(tagName); },
        querySelectorAll(selector) {
            if (selector === 'input[name="courseMode"]') return courseModes;
            if (selector === 'input[name="cgpaMode"]') return cgpaModes;
            return [];
        },
        querySelector(selector) {
            if (selector === 'input[name="courseMode"]:checked') return courseModes.find(input => input.checked);
            if (selector === 'input[name="cgpaMode"]:checked') return cgpaModes.find(input => input.checked);
            return null;
        },
        addEventListener(type, callback) { listeners[type] = callback; }
    };
    const context = { document, window: {}, console };
    context.window = context;
    vm.createContext(context);
    vm.runInContext(source, context);
    return { context, elements, listeners, courseModes };
}

test('weighted average weights each course by its credit hours', () => {
    const result = loadMath().weightedAverage([
        { gradePoints: 3.7, credits: 4 },
        { gradePoints: 3, credits: 2 }
    ]);
    assert.equal(result.credits, 6);
    assert.ok(Math.abs(result.average - 3.466666666666667) < 1e-12);
});

test('weighted average preserves zero grade points and fractional credits', () => {
    const result = loadMath().weightedAverage([
        { gradePoints: 0, credits: 1.5 },
        { gradePoints: 4, credits: 2.5 }
    ]);
    assert.equal(result.credits, 4);
    assert.equal(result.average, 2.5);
});

test('weighted average returns null when there are no credits', () => {
    assert.equal(loadMath().weightedAverage([]), null);
});

test('Quick GPA accepts a 5.0 grade point on 15 credits and carries it into CGPA', () => {
    const { elements } = loadCalculatorUI();
    const course = elements.get('quickCourses').children[0];
    course.querySelector('[data-grade-points]').value = '5.0';
    course.querySelector('[data-credits]').value = '15';
    elements.get('calculateSemester').listeners.click();
    assert.equal(elements.get('semesterGpaValue').textContent, '5.000');
    assert.equal(elements.get('semesterCredits').textContent, '15');

    elements.get('previousCgpa').value = '4.5';
    elements.get('completedCredits').value = '30';
    elements.get('calculateCgpa').listeners.click();
    assert.equal(elements.get('cgpaValue').textContent, '4.667');
});

test('Quick GPA keeps zero valid and rejects negative grade points', () => {
    const { elements } = loadCalculatorUI();
    const course = elements.get('quickCourses').children[0];
    const points = course.querySelector('[data-grade-points]');
    const credits = course.querySelector('[data-credits]');
    credits.value = '15';
    points.value = '0';
    elements.get('calculateSemester').listeners.click();
    assert.equal(elements.get('semesterGpaValue').textContent, '0.000');

    points.value = '-0.01';
    elements.get('calculateSemester').listeners.click();
    assert.match(elements.get('gpaMessage').textContent, /valid non-negative grade-point value/);
    assert.equal(elements.get('semesterResult').hidden, true);
});

test('GPA Reset clears only course entries and semester result', () => {
    const { elements } = loadCalculatorUI();
    const course = elements.get('quickCourses').children[0];
    course.querySelector('[data-grade-points]').value = '3.5';
    course.querySelector('[data-credits]').value = '3';
    elements.get('calculateSemester').listeners.click();
    elements.get('previousCgpa').value = '3.2';
    elements.get('completedCredits').value = '24';
    elements.get('calculateCgpa').listeners.click();
    const cgpaBeforeReset = elements.get('cgpaValue').textContent;
    const scaleValue = elements.get('gradeScale').children[0].querySelector('[data-scale-letter]').value;
    elements.get('resetCalculator').listeners.click();

    assert.equal(elements.get('quickCourses').children.length, 1);
    assert.equal(elements.get('quickCourses').children[0].querySelector('[data-grade-points]').value, '');
    assert.equal(elements.get('semesterResult').hidden, true);
    assert.equal(elements.get('previousCgpa').value, '3.2');
    assert.equal(elements.get('completedCredits').value, '24');
    assert.equal(elements.get('cgpaResult').hidden, false);
    assert.equal(elements.get('cgpaValue').textContent, cgpaBeforeReset);
    assert.equal(elements.get('gradeScale').children[0].querySelector('[data-scale-letter]').value, scaleValue);
});

test('CGPA Reset clears only cumulative inputs and result', () => {
    const { elements } = loadCalculatorUI();
    const course = elements.get('quickCourses').children[0];
    course.querySelector('[data-grade-points]').value = '4';
    course.querySelector('[data-credits]').value = '3';
    elements.get('calculateSemester').listeners.click();
    elements.get('previousCgpa').value = '3.2';
    elements.get('completedCredits').value = '24';
    elements.get('calculateCgpa').listeners.click();
    elements.get('resetCgpa').listeners.click();

    assert.equal(elements.get('previousCgpa').value, '');
    assert.equal(elements.get('completedCredits').value, '');
    assert.equal(elements.get('cgpaResult').hidden, true);
    assert.equal(elements.get('quickCourses').children[0].querySelector('[data-grade-points]').value, '4');
    assert.equal(elements.get('quickCourses').children[0].querySelector('[data-credits]').value, '3');
    assert.equal(elements.get('semesterResult').hidden, false);
    assert.equal(elements.get('semesterGpaValue').textContent, '4.000');
});

test('CGPA combines a previous cumulative result and current semester by credits', () => {
    const result = loadMath().combinePrevious(3.2, 30, 3.8, 15);
    assert.equal(result.credits, 45);
    assert.ok(Math.abs(result.average - 3.4) < 1e-12);
});

test('custom grading scale options populate every existing and newly added course row', () => {
    const { elements, courseModes } = loadCalculatorUI();
    courseModes[0].checked = false;
    courseModes[1].checked = true;
    courseModes[1].listeners.change();

    const scale = elements.get('gradeScale');
    let scaleRow = scale.children[0];
    scaleRow.querySelector('[data-scale-letter]').value = 'A';
    scaleRow.querySelector('[data-scale-points]').value = '3.7';
    scale.listeners.input();

    const first = elements.get('customCourses').children[0].querySelector('[data-letter-grade]');
    first.value = 'A';
    elements.get('addCustomCourse').listeners.click();
    elements.get('addCustomCourse').listeners.click();

    const courses = elements.get('customCourses').children;
    assert.equal(courses.length, 3);
    for (const row of courses) {
        const dropdown = row.querySelector('[data-letter-grade]');
        assert.deepEqual(dropdown.children.map(option => option.value), ['', 'A']);
    }
    assert.equal(courses[0].querySelector('[data-letter-grade]').value, 'A');

    elements.get('addScaleGrade').listeners.click();
    scaleRow = scale.children[1];
    scaleRow.querySelector('[data-scale-letter]').value = 'B';
    scaleRow.querySelector('[data-scale-points]').value = '3';
    scale.listeners.input();
    for (const row of courses) {
        assert.deepEqual(row.querySelector('[data-letter-grade]').children.map(option => option.value), ['', 'A', 'B']);
    }

    courses[0].querySelector('[data-credits]').value = '3';
    courses[1].querySelector('[data-letter-grade]').value = 'B';
    courses[1].querySelector('[data-credits]').value = '3';
    courses[2].querySelector('[data-letter-grade]').value = 'A';
    courses[2].querySelector('[data-credits]').value = '2';
    elements.get('calculateSemester').listeners.click();
    assert.equal(elements.get('semesterGpaValue').textContent, '3.438');
});

test('custom scale ignores a letter without points in options and calculation', () => {
    const { elements, courseModes } = loadCalculatorUI();
    courseModes[0].checked = false;
    courseModes[1].checked = true;
    courseModes[1].listeners.change();

    const scale = elements.get('gradeScale');
    const validRow = scale.children[0];
    validRow.querySelector('[data-scale-letter]').value = 'A';
    validRow.querySelector('[data-scale-points]').value = '3.7';
    elements.get('addScaleGrade').listeners.click();
    scale.children[1].querySelector('[data-scale-letter]').value = 'B';
    scale.listeners.input();

    const course = elements.get('customCourses').children[0];
    const dropdown = course.querySelector('[data-letter-grade]');
    assert.deepEqual(dropdown.children.map(option => option.value), ['', 'A']);
    dropdown.value = 'A';
    course.querySelector('[data-credits]').value = '3';
    elements.get('calculateSemester').listeners.click();

    assert.equal(elements.get('gpaMessage').textContent, '');
    assert.equal(elements.get('semesterGpaValue').textContent, '3.700');
});

test('custom scale ignores points without a letter in options and calculation', () => {
    const { elements, courseModes } = loadCalculatorUI();
    courseModes[0].checked = false;
    courseModes[1].checked = true;
    courseModes[1].listeners.change();

    const scale = elements.get('gradeScale');
    const validRow = scale.children[0];
    validRow.querySelector('[data-scale-letter]').value = 'A';
    validRow.querySelector('[data-scale-points]').value = '3.7';
    elements.get('addScaleGrade').listeners.click();
    scale.children[1].querySelector('[data-scale-points]').value = '3';
    scale.listeners.input();

    const course = elements.get('customCourses').children[0];
    const dropdown = course.querySelector('[data-letter-grade]');
    assert.deepEqual(dropdown.children.map(option => option.value), ['', 'A']);
    dropdown.value = 'A';
    course.querySelector('[data-credits]').value = '3';
    elements.get('calculateSemester').listeners.click();

    assert.equal(elements.get('gpaMessage').textContent, '');
    assert.equal(elements.get('semesterGpaValue').textContent, '3.700');
});

test('page registers GPA content, feedback, schema, tool card and sitemap entry', () => {
    const page = fs.readFileSync(path.join(root, 'gpa-cgpa-calculator.html'), 'utf8');
    const registry = fs.readFileSync(path.join(root, 'js/config/tools-registry.js'), 'utf8');
    const content = fs.readFileSync(path.join(root, 'js/content/content-data-education.js'), 'utf8');
    const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
    assert.match(page, /id="toolHero"/);
    assert.match(page, /id="relatedTools"/);
    assert.match(page, /id="financeInfo"/);
    assert.match(page, /id="financeFAQ"/);
    assert.match(page, /id="tool-reviews"/);
    assert.match(page, /renderFinanceFeedback\("financeFeedback", "GPA \/ CGPA Calculator"\)/);
    assert.match(registry, /id: "gpa-cgpa-calculator"/);
    assert.match(content, /register\("articles", toolId, content\.article\)/);
    assert.match(sitemap, /gpa-cgpa-calculator\.html/);
});

test('GPA layout constrains card grid and contains wide course tables', () => {
    const styles = fs.readFileSync(path.join(root, 'css/gpa-cgpa-calculator.css'), 'utf8');
    assert.match(styles, /\.gpa-page\s*\{[^}]*min-width:\s*0[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s);
    assert.match(styles, /\.gpa-card\s*\{[^}]*max-width:\s*100%[^}]*min-width:\s*0/s);
    assert.match(styles, /\.gpa-mode-panel\s*\{[^}]*min-width:\s*0/s);
    assert.match(styles, /\.gpa-table-wrap\s*\{[^}]*display:\s*block[^}]*min-width:\s*0[^}]*overflow-x:\s*auto/s);
    assert.match(styles, /\.gpa-table\s*\{[^}]*min-width:\s*500px/s);

    const page = fs.readFileSync(path.join(root, 'gpa-cgpa-calculator.html'), 'utf8');
    assert.equal((page.match(/<div class="gpa-table-wrap">\s*<table class="gpa-table/g) || []).length, 4);

    const mobileStart = styles.indexOf('@media (max-width: 600px) {');
    const mobileEnd = styles.indexOf('\n}', mobileStart);
    const mobileStyles = mobileStart >= 0 && mobileEnd >= 0 ? styles.slice(mobileStart, mobileEnd) : '';
    assert.match(mobileStyles, /\.gpa-table\s*\{[^}]*width:\s*100%[^}]*min-width:\s*0[^}]*table-layout:\s*fixed/s);
    assert.match(styles, /\.gpa-table-wrap\s*\{[^}]*overflow-x:\s*auto/s);
    assert.match(mobileStyles, /\.gpa-remove-button\s*\{[^}]*min-width:\s*0/s);
});
