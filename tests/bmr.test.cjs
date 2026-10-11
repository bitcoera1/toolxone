'use strict';
// Actual initialized production script and event handlers; isolated DOM/timers only.
// No network, dependencies, filesystem writes or copied calculation oracle.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/bmr.js'), 'utf8');
const explanation = 'Your estimated BMR is the approximate number of calories your body may need each day to support basic physiological functions while at rest.';
const metricValues = { sex: 'male', age: 30, heightCm: 175, weightKg: 70 };
const imperialValues = { sex: 'male', age: 30, heightFt: 5, heightIn: 9, weightLb: 154 };
const fields = ['age', 'heightCm', 'weightKg', 'heightFt', 'heightIn', 'weightLb'];
function harness({ statistics = true } = {}) {
    const elements = new Map(), events = new Map(), timers = new Map(), callbacks = new Map();
    const alerts = [], records = [], targets = [], created = [], cleared = [], errors = [];
    let nextTimer = 0;
    function makeElement(id) {
        const classes = new Set(), handlers = new Map();
        const element = {
            value: '', textContent: '', style: {}, handlers,
            classList: { add(value) { classes.add(value); }, remove(value) { classes.delete(value); }, contains(value) { return classes.has(value); } },
            addEventListener(name, fn) { assert.equal(handlers.has(name), false); handlers.set(name, fn); }
        };
        elements.set(id, element); return element;
    }
    for (const id of [...fields, 'sex', 'metricBtn', 'imperialBtn', 'calculateBtn', 'resetBtn', 'bmrValue', 'bmrExplanation', 'resultCard']) makeElement(id);
    const element = id => { assert.ok(elements.has(id), id); return elements.get(id); };
    element('sex').value = 'male'; element('bmrValue').textContent = '—'; element('resultCard').style.display = 'none';
    element('metricBtn').classList.add('active');
    const metric = [makeElement('metricHeightGroup'), makeElement('metricWeightGroup')], imperial = makeElement('imperialGroup');
    imperial.style.display = 'none';
    const context = {
        document: {
            getElementById(id) { return elements.get(id) || null; },
            addEventListener(name, fn) { assert.equal(events.has(name), false); events.set(name, fn); },
            querySelectorAll(selector) { assert.equal(selector, '.metric-inputs'); return metric; },
            querySelector(selector) { assert.equal(selector, '.imperial-inputs'); return imperial; }
        },
        console: { log() {}, error(message) { errors.push(message); } },
        alert(message) { alerts.push(message); },
        fetch() { throw new Error('Network forbidden'); },
        setInterval(fn, delay) {
            assert.equal(delay, 20); const id = nextTimer++;
            timers.set(id, fn); callbacks.set(id, fn); created.push(id); return id;
        },
        clearInterval(id) { cleared.push(id); timers.delete(id); }
    };
    if (statistics) context.ToolXoneStatisticsEvents = { recordCalculation(id) { records.push(id); } };
    vm.createContext(context);
    vm.runInContext(source, context, { filename: 'js/bmr.js', timeout: 2000 });
    // Observe unrounded values while continuing through the actual display/animation.
    const display = context.displayBMRResult;
    context.displayBMRResult = value => { targets.push(value); return display(value); };
    assert.equal(typeof events.get('DOMContentLoaded'), 'function'); events.get('DOMContentLoaded')();
    function set(values) { for (const [id, value] of Object.entries(values)) element(id).value = String(value); }
    function click(id) { const handler = element(id).handlers.get('click'); assert.equal(typeof handler, 'function'); handler(); }
    function tick() { for (const [id, fn] of [...timers]) if (timers.has(id)) fn(); }
    function flush() { for (let i = 0; timers.size && i < 100; i++) tick(); assert.equal(timers.size, 0, 'Animation must finish'); }
    function stale(id) { assert.equal(typeof callbacks.get(id), 'function'); callbacks.get(id)(); }
    return { element, elements, events, timers, alerts, records, targets, created, cleared, errors, metric, imperial, set, click, tick, flush, stale,
        calculate(values) { set(values); click('calculateBtn'); } };
}
function close(actual, expected) {
    assert.equal(typeof actual, 'number'); assert.ok(Number.isFinite(actual));
    assert.ok(Math.abs(actual - expected) <= 1e-10, actual + ' versus frozen reference ' + expected);
}
function snapshot(h) {
    return [h.element('bmrValue').textContent, h.element('bmrExplanation').textContent, h.element('resultCard').style.display];
}
// Literal independent exact-decimal references frozen before the lifecycle edit.
const references = [
    ['male metric', false, metricValues, 1648.75, '1,649'],
    ['female metric', false, { ...metricValues, sex: 'female' }, 1482.75, '1,483'],
    ['male imperial', true, imperialValues, 1648.9072498, '1,649'],
    ['male equivalent metric', false, { ...metricValues, heightCm: 175.26, weightKg: 69.85322498 }, 1648.9072498, '1,649'],
    ['female imperial at age 30', true, { ...imperialValues, sex: 'female' }, 1482.9072498, '1,483'],
    ['female equivalent metric at age 30', false, { ...metricValues, sex: 'female', heightCm: 175.26, weightKg: 69.85322498 }, 1482.9072498, '1,483'],
    ['female metric at age 40', false, { sex: 'female', age: 40, heightCm: 165, weightKg: 60 }, 1270.25, '1,270'],
    ['female imperial at age 40', true, { sex: 'female', age: 40, heightFt: 5, heightIn: 5, weightLb: 130 }, 1260.545081, '1,261'],
    ['female equivalent metric at age 40', false, { sex: 'female', age: 40, heightCm: 165.1, weightKg: 58.9670081 }, 1260.545081, '1,261'],
    ['lower age boundary', false, { ...metricValues, age: 18 }, 1708.75, '1,709'],
    ['upper age boundary', false, { ...metricValues, age: 120 }, 1198.75, '1,199'],
    ['fractional age remains accepted', false, { ...metricValues, age: 18.5 }, 1706.25, '1,706'],
    ['existing parseFloat at JS layer', false, { ...metricValues, age: '30.5 years', heightCm: '175 cm', weightKg: '70 kg' }, 1646.25, '1,646'],
    ['metric HTML hints are not new JS limits', false, { ...metricValues, heightCm: 50, weightKg: 10 }, 267.5, '268'],
    ['fractional feet remain accepted at JS layer', true, { ...imperialValues, heightFt: 5.5, heightIn: 3 }, 1648.9072498, '1,649'],
    ['zero feet with positive inches remains accepted', true, { ...imperialValues, heightFt: 0, heightIn: 11.9 }, 742.4447498, '742'],
    ['male case folding remains unchanged', false, { ...metricValues, sex: 'MALE' }, 1648.75, '1,649'],
    ['existing non-male fallback remains female', false, { ...metricValues, sex: 'unsupported' }, 1482.75, '1,483'],
    ['empty sex fallback remains female', false, { ...metricValues, sex: '' }, 1482.75, '1,483']
];
for (const [name, imperial, inputs, expected, display] of references) test('Calculation preserved: ' + name, () => {
    const h = harness(); if (imperial) h.click('imperialBtn'); h.calculate(inputs);
    assert.equal(h.targets.length, 1); close(h.targets[0], expected);
    assert.deepEqual(h.alerts, []); assert.deepEqual(h.errors, []);
    assert.equal(h.timers.size, 1); assert.deepEqual(h.records, ['bmr-calculator']);
    assert.equal(h.element('resultCard').style.display, 'block');
    assert.equal(h.element('bmrExplanation').textContent, explanation);
    h.tick(); assert.equal(h.element('bmrValue').textContent, Math.round(expected / 40).toLocaleString());
    h.flush(); assert.equal(h.element('bmrValue').textContent, display);
    assert.deepEqual(h.records, ['bmr-calculator']); assert.ok(h.cleared.includes(h.created[0]));
});

for (const [sex, metric, imperial] of [
    ['male', { ...metricValues, heightCm: 175.26, weightKg: 69.85322498 }, imperialValues],
    ['female', { sex: 'female', age: 40, heightCm: 165.1, weightKg: 58.9670081 }, { sex: 'female', age: 40, heightFt: 5, heightIn: 5, weightLb: 130 }]
]) test('Metric/imperial equivalence: ' + sex, () => {
    const m = harness(), i = harness(); i.click('imperialBtn'); m.calculate(metric); i.calculate(imperial);
    close(m.targets[0], i.targets[0]); m.flush(); i.flush();
    assert.deepEqual(snapshot(m), snapshot(i));
});

const invalid = [];
for (const value of ['', 'not-a-number', 'NaN', Infinity, -Infinity, 17.99, 120.01])
    invalid.push(['age=' + value, false, { ...metricValues, age: value }, 'Please enter a valid adult age between 18 and 120 years.']);
for (const field of ['heightCm', 'weightKg']) for (const value of ['', 'not-a-number', 'NaN', Infinity, -Infinity, 0, -1])
    invalid.push(['metric ' + field + '=' + value, false, { ...metricValues, [field]: value }, 'Please enter valid height and weight values.']);
for (const field of ['heightFt', 'heightIn', 'weightLb']) for (const value of ['', '   ', 'not-a-number', 'NaN', Infinity, -Infinity])
    invalid.push(['imperial ' + field + '=' + value, true, { ...imperialValues, [field]: value }, 'Please enter your height and weight.']);
for (const [field, value] of [['heightFt', -1], ['heightIn', -1], ['heightIn', 12], ['heightIn', 13], ['weightLb', 0], ['weightLb', -1]])
    invalid.push(['imperial measurement ' + field + '=' + value, true, { ...imperialValues, [field]: value }, 'Please enter valid height and weight values.']);
invalid.push(['zero imperial height', true, { ...imperialValues, heightFt: 0, heightIn: 0 }, 'Please enter valid height and weight values.']);
const derived = [
    ['metric height multiplication overflow', false, { ...metricValues, heightCm: '1e308' }],
    ['metric weight multiplication overflow', false, { ...metricValues, weightKg: '1e308' }],
    ['metric addition overflow', false, { ...metricValues, heightCm: '1e307', weightKg: '1.5e307' }],
    ['imperial total-height overflow', true, { ...imperialValues, heightFt: '1e308', heightIn: 0 }],
    ['imperial centimeter conversion overflow', true, { ...imperialValues, heightFt: '1e307', heightIn: 0 }],
    ['imperial converted height equation overflow', true, { ...imperialValues, heightFt: '5e306', heightIn: 0 }],
    ['imperial converted weight equation overflow', true, { ...imperialValues, weightLb: '1e308' }],
    ['male exact zero', false, { sex: 'male', age: 18, heightCm: 12, weightKg: 1 }],
    ['female exact zero', false, { sex: 'female', age: 18, heightCm: 24, weightKg: 10.1 }],
    ['negative estimate', false, { sex: 'male', age: 18, heightCm: 1, weightKg: 1 }]
].map(([name, imperial, inputs]) => [name, imperial, inputs, 'Unable to calculate BMR. Please check your values.']);
for (const [name, imperial, inputs, message] of [...invalid, ...derived]) test('Rejected without success side effects: ' + name, () => {
    const h = harness(); if (imperial) h.click('imperialBtn');
    h.element('bmrValue').textContent = 'unchanged';
    h.element('bmrExplanation').textContent = 'unchanged explanation';
    const before = snapshot(h); h.calculate(inputs);
    assert.deepEqual(h.alerts, [message]); assert.deepEqual(h.targets, []);
    assert.deepEqual(h.records, []); assert.deepEqual(h.created, []); assert.equal(h.timers.size, 0);
    assert.deepEqual(snapshot(h), before);
});

for (const [name, unit, inputs] of [['metric', 'metricBtn', metricValues], ['imperial', 'imperialBtn', imperialValues]])
    test('Reset cancels active animation and preserves all reset semantics: ' + name, () => {
        const h = harness(); h.click(unit);
        h.set({ age: 30, heightCm: 175, weightKg: 70, heightFt: 5, heightIn: 9, weightLb: 154, sex: 'female' });
        h.calculate({ ...inputs, sex: 'female' }); h.tick(); const old = h.created[0];
        assert.equal(h.timers.size, 1); h.click('resetBtn');
        assert.ok(h.cleared.includes(old)); assert.equal(h.timers.size, 0);
        for (const field of fields) assert.equal(h.element(field).value, '');
        assert.equal(h.element('sex').value, 'female');
        assert.deepEqual(snapshot(h), ['—', '', 'none']);
        assert.equal(h.element(unit).classList.contains('active'), true);
        // Deliberately invoke a captured callback after clearInterval, not a new timer.
        h.stale(old); h.tick(); h.flush(); assert.deepEqual(snapshot(h), ['—', '', 'none']);
        assert.deepEqual(h.records, ['bmr-calculator']);
        h.click('resetBtn'); assert.equal(h.timers.size, 0); assert.deepEqual(snapshot(h), ['—', '', 'none']);
    });

for (const [start, next, values] of [
    ['metricBtn', 'imperialBtn', metricValues], ['imperialBtn', 'metricBtn', imperialValues]
]) test('Unit switching cancels and blocks stale callbacks: ' + start + ' to ' + next, () => {
    const h = harness(); h.click(start); h.calculate(values); h.tick(); const old = h.created[0];
    h.click(next); assert.equal(h.timers.size, 0); assert.ok(h.cleared.includes(old));
    assert.deepEqual(snapshot(h), ['—', '', 'none']);
    assert.equal(h.element(next).classList.contains('active'), true);
    assert.equal(h.element(start).classList.contains('active'), false);
    assert.equal(h.imperial.style.display, next === 'imperialBtn' ? 'block' : 'none');
    for (const group of h.metric) assert.equal(group.style.display, next === 'metricBtn' ? 'block' : 'none');
    for (const field of fields) assert.equal(h.element(field).value, '');
    h.stale(old); h.tick(); assert.deepEqual(snapshot(h), ['—', '', 'none']);
    assert.deepEqual(h.records, ['bmr-calculator']);
    h.calculate(next === 'imperialBtn' ? imperialValues : metricValues); h.flush();
    assert.equal(h.element('bmrValue').textContent, '1,649'); assert.equal(h.records.length, 2);
});

test('Replacement owns the only active timer and cancelled callbacks cannot alter it', () => {
    const h = harness(); h.calculate(metricValues); h.tick(); const first = h.created[0];
    h.calculate({ sex: 'female', age: 40, heightCm: 165, weightKg: 60 }); const second = h.created[1];
    assert.equal(h.timers.size, 1); assert.equal(h.timers.has(first), false); assert.equal(h.timers.has(second), true);
    assert.ok(h.cleared.includes(first)); close(h.targets[1], 1270.25);
    const before = snapshot(h); h.stale(first); assert.deepEqual(snapshot(h), before);
    h.tick(); const afterNewestTick = snapshot(h); h.stale(first); assert.deepEqual(snapshot(h), afterNewestTick);
    h.flush(); assert.equal(h.element('bmrValue').textContent, '1,270');
    const completed = snapshot(h); h.stale(first); h.stale(second); assert.deepEqual(snapshot(h), completed);
    assert.deepEqual(h.records, ['bmr-calculator', 'bmr-calculator']);
});

test('Rapid replacements then reset leave no callback able to repopulate the result', () => {
    const h = harness();
    for (const sex of ['male', 'female', 'male']) { h.calculate({ ...metricValues, sex }); assert.equal(h.timers.size, 1); h.tick(); }
    h.click('resetBtn'); assert.equal(h.timers.size, 0);
    for (const id of h.created) { assert.ok(h.cleared.includes(id)); h.stale(id); }
    assert.deepEqual(snapshot(h), ['—', '', 'none']); assert.equal(h.records.length, 3);
});

test('Rejected calculation preserves the existing valid animation and does not replace it', () => {
    const h = harness(); h.calculate(metricValues); h.tick(); const first = h.created[0], before = snapshot(h);
    h.calculate({ ...metricValues, heightCm: '1e308' });
    assert.deepEqual(snapshot(h), before); assert.deepEqual(h.records, ['bmr-calculator']);
    assert.equal(h.created.length, 1); assert.equal(h.timers.has(first), true);
    h.flush(); assert.equal(h.element('bmrValue').textContent, '1,649');
});

test('Rejected calculation preserves an already completed result and statistics', () => {
    const h = harness(); h.calculate(metricValues); h.flush(); const before = snapshot(h);
    h.calculate({ ...metricValues, weightKg: 0 });
    assert.deepEqual(snapshot(h), before); assert.equal(h.timers.size, 0);
    assert.equal(h.created.length, 1); assert.deepEqual(h.records, ['bmr-calculator']);
});

test('Completed animation releases ownership before reset and later calculation', () => {
    const h = harness(); h.calculate(metricValues); h.flush(); const first = h.created[0];
    h.click('resetBtn'); assert.deepEqual(snapshot(h), ['—', '', 'none']);
    h.calculate({ ...metricValues, sex: 'female' });
    const before = snapshot(h); h.stale(first); assert.deepEqual(snapshot(h), before);
    h.flush(); assert.equal(h.element('bmrValue').textContent, '1,483');
    assert.deepEqual(h.records, ['bmr-calculator', 'bmr-calculator']);
});

test('Existing document Enter behavior calculates once and other keys do nothing', () => {
    const h = harness(); h.set(metricValues);
    h.events.get('keydown')({ key: 'Escape' }); assert.deepEqual(h.records, []); assert.equal(h.created.length, 0);
    h.events.get('keydown')({ key: 'Enter' });
    assert.deepEqual(h.records, ['bmr-calculator']); close(h.targets[0], 1648.75);
    h.flush(); assert.equal(h.element('bmrValue').textContent, '1,649');
});

test('Statistics remains optional without changing successful calculation/display', () => {
    const h = harness({ statistics: false }); h.calculate(metricValues); h.flush();
    close(h.targets[0], 1648.75); assert.equal(h.element('bmrValue').textContent, '1,649'); assert.deepEqual(h.alerts, []);
});

for (const id of ['sex', 'age', 'heightCm', 'weightKg', 'heightFt', 'heightIn', 'weightLb'])
    test('Missing input element returns safely: ' + id, () => {
        const h = harness(); if (['heightFt', 'heightIn', 'weightLb'].includes(id)) h.click('imperialBtn');
        h.set({ ...metricValues, ...imperialValues }); h.elements.delete(id); h.click('calculateBtn');
        assert.equal(h.errors.length, 1); assert.deepEqual(h.targets, []); assert.deepEqual(h.records, []);
        assert.equal(h.timers.size, 0); assert.deepEqual(h.alerts, []);
    });
