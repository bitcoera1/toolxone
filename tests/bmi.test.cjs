'use strict';
// Real production script/event bindings; synthetic DOM/timers, no network.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/bmi.js'), 'utf8');
function harness() {
    const elements = new Map(), events = new Map(), timers = new Map();
    const alerts = [], records = [], created = [], cleared = [], targets = [];
    let timerId = 0;
    function element(id) {
        if (!elements.has(id)) {
            const classes = new Set(), handlers = new Map();
            elements.set(id, { value: '', textContent: '', innerHTML: '', style: {}, handlers,
                classList: { add(v) { classes.add(v); }, remove(v) { classes.delete(v); }, contains(v) { return classes.has(v); } },
                addEventListener(type, fn) { handlers.set(type, fn); } });
        }
        return elements.get(id);
    }
    const metric = [element('heightGroup'), element('weightGroup')], imperial = element('imperialGroup');
    const context = {
        document: { getElementById: element, addEventListener(type, fn) { events.set(type, fn); },
            querySelectorAll(selector) { assert.equal(selector, '.metric-inputs'); return metric; },
            querySelector(selector) { assert.equal(selector, '.imperial-inputs'); return imperial; } },
        console: { log() {} }, alert(message) { alerts.push(message); },
        fetch() { throw new Error('Network forbidden'); },
        ToolXoneStatisticsEvents: { recordCalculation(id) { records.push(id); } },
        setInterval(fn, delay) { assert.equal(delay, 20); const id = ++timerId; timers.set(id, fn); created.push(id); return id; },
        clearInterval(id) { cleared.push(id); timers.delete(id); }
    };
    vm.createContext(context);
    vm.runInContext(source, context, { filename: 'js/bmi.js', timeout: 2000 });
    const animate = context.animateBMI;
    context.animateBMI = value => { targets.push(value); animate(value); };
    assert.equal(typeof events.get('DOMContentLoaded'), 'function'); events.get('DOMContentLoaded')();
    function set(values) { for (const [id, value] of Object.entries(values)) element(id).value = String(value); }
    function click(id) { const fn = element(id).handlers.get('click'); assert.equal(typeof fn, 'function'); fn(); }
    function tick() { for (const [id, fn] of [...timers]) if (timers.has(id)) fn(); }
    function flush() { for (let i = 0; timers.size && i < 100; i++) tick(); assert.equal(timers.size, 0, 'Animation must finish'); }
    return { element, events, timers, alerts, records, created, cleared, targets, metric, imperial, set, click, tick, flush,
        calculate(values) { set(values); click('calculateBMI'); } };
}
function close(actual, expected) {
    assert.equal(typeof actual, 'number'); assert.ok(Number.isFinite(actual));
    assert.ok(Math.abs(actual - expected) <= 1e-12, actual + ' versus ' + expected);
}
// Frozen independent arithmetic references, not calculated by a copied formula.
const references = [
    ['metric reference', false, {heightCm:175,weightKg:70}, 22.857142857142858, '22.9', '🟢 Healthy Weight Range', 'healthy weight'],
    ['imperial 703 reference', true, {heightFt:5,heightIn:8,weightLb:200}, 30.406574394463664, '30.4', '🔴 Obesity Range', 'obesity'],
    ['below 18.5', false, {heightCm:200,weightKg:73.96}, 18.49, '18.5', '🔵 Underweight', 'underweight'],
    ['exact 18.5', false, {heightCm:200,weightKg:74}, 18.5, '18.5', '🟢 Healthy Weight Range', 'healthy weight'],
    ['unrounded 24.96', false, {heightCm:200,weightKg:99.84}, 24.96, '25.0', '🟢 Healthy Weight Range', 'healthy weight'],
    ['exact 25', false, {heightCm:200,weightKg:100}, 25, '25.0', '🟠 Overweight', 'overweight'],
    ['below 30', false, {heightCm:200,weightKg:119.96}, 29.99, '30.0', '🟠 Overweight', 'overweight'],
    ['exact 30', false, {heightCm:200,weightKg:120}, 30, '30.0', '🔴 Obesity Range', 'obesity']
];
for (const [name, imperial, inputs, expected, display, category, range] of references) test(name, () => {
    const h = harness(); if (imperial) h.click('imperialBtn'); h.calculate(inputs);
    assert.equal(h.targets.length, 1); close(h.targets[0], expected);
    assert.equal(h.timers.size, 1); assert.equal(h.element('bmiCategory').innerHTML, category);
    assert.deepEqual(h.records, ['bmi-calculator']); assert.deepEqual(h.alerts, []);
    assert.equal(h.element('bmiResultCard').classList.contains('show-result'), true);
    assert.equal(h.element('bmiAdvice').textContent, 'This BMI falls within the ' + range + ' range for adults. BMI is a screening measure and does not assess overall health.');
    h.flush(); assert.equal(h.element('bmiNumber').textContent, display); assert.deepEqual(h.records, ['bmi-calculator']);
});
test('Existing marker positions at category boundaries and upper clamp', () => {
    for (const [weightKg, position] of [[74,'25%'],[100,'55%'],[120,'75%'],[160,'100%']]) {
        const h = harness(); h.calculate({heightCm:200,weightKg});
        assert.equal(h.element('scaleMarker').style.left, position); h.flush();
    }
});
const invalid = [];
for (const field of ['heightCm','weightKg']) for (const value of ['', 'not-a-number', Infinity, -Infinity, 0, -1])
    invalid.push(['metric ' + field + '=' + value, false, {heightCm:175,weightKg:70,[field]:value}, 'Please enter valid height and weight values.']);
for (const field of ['heightFt','heightIn','weightLb']) for (const value of ['', 'not-a-number', Infinity, -Infinity])
    invalid.push(['imperial ' + field + '=' + value, true, {heightFt:5,heightIn:8,weightLb:200,[field]:value}, 'Please enter your height and weight.']);
for (const [field, value] of [['heightFt',-1],['heightIn',-1],['heightIn',12],['weightLb',0],['weightLb',-1]])
    invalid.push(['imperial invalid ' + field + '=' + value, true, {heightFt:5,heightIn:8,weightLb:200,[field]:value}, 'Please enter valid height and weight values.']);
invalid.push(['zero imperial height', true, {heightFt:0,heightIn:0,weightLb:200}, 'Please enter valid height and weight values.']);
const unsafe = [
    ['metric denominator underflow', false, {heightCm:'1e-200',weightKg:70}],
    ['metric height conversion underflow', false, {heightCm:Number.MIN_VALUE,weightKg:70}],
    ['metric denominator overflow', false, {heightCm:'1e200',weightKg:70}],
    ['metric division overflow', false, {heightCm:1,weightKg:Number.MAX_VALUE}],
    ['metric final BMI underflow', false, {heightCm:'1e150',weightKg:Number.MIN_VALUE}],
    ['positive BMI animation increment underflow', false, {heightCm:100,weightKg:Number.MIN_VALUE}],
    ['imperial total height overflow', true, {heightFt:'1e308',heightIn:0,weightLb:200}],
    ['imperial denominator overflow', true, {heightFt:'1e200',heightIn:0,weightLb:200}],
    ['imperial denominator underflow', true, {heightFt:0,heightIn:'1e-200',weightLb:200}],
    ['imperial final BMI overflow', true, {heightFt:0,heightIn:1,weightLb:Number.MAX_VALUE}],
    ['imperial final BMI underflow', true, {heightFt:5,heightIn:8,weightLb:Number.MIN_VALUE}]
];
for (const [name, imperial, inputs, message = 'Please enter valid height and weight values.'] of [...invalid,...unsafe])
    test('Reject without success side effects: ' + name, () => {
        const h = harness(); if (imperial) h.click('imperialBtn');
        h.element('bmiNumber').textContent = 'unchanged'; h.element('bmiCategory').innerHTML = 'unchanged category';
        h.element('bmiAdvice').textContent = 'unchanged explanation'; h.element('scaleMarker').style.left = '42%';
        h.calculate(inputs);
        assert.deepEqual(h.alerts, [message]); assert.deepEqual(h.targets, []); assert.deepEqual(h.created, []);
        assert.equal(h.timers.size, 0); assert.deepEqual(h.records, []);
        assert.equal(h.element('bmiNumber').textContent, 'unchanged');
        assert.equal(h.element('bmiCategory').innerHTML, 'unchanged category');
        assert.equal(h.element('bmiAdvice').textContent, 'unchanged explanation');
        assert.equal(h.element('scaleMarker').style.left, '42%');
        assert.equal(h.element('bmiResultCard').classList.contains('show-result'), false);
    });
test('Reset cancels an in-flight animation and preserves reset wording', () => {
    const h = harness(); h.calculate({heightCm:175,weightKg:70}); h.tick(); const id = h.created[0];
    assert.equal(h.timers.size, 1); h.click('resetBMI'); assert.ok(h.cleared.includes(id)); assert.equal(h.timers.size, 0); h.flush();
    for (const field of ['heightCm','weightKg','heightFt','heightIn','weightLb']) assert.equal(h.element(field).value, '');
    assert.equal(h.element('bmiNumber').textContent, '--'); assert.equal(h.element('bmiCategory').textContent, 'Enter your height and weight');
    assert.equal(h.element('bmiAdvice').textContent, 'Your BMI range and information will appear here.');
    assert.equal(h.element('scaleMarker').style.left, '0%'); assert.deepEqual(h.records, ['bmi-calculator']);
});
test('Second calculation replaces the active timer and only the latest result finishes', () => {
    const h = harness(); h.calculate({heightCm:175,weightKg:70}); h.tick(); const first = h.created[0];
    h.calculate({heightCm:200,weightKg:120});
    assert.equal(h.timers.size, 1); assert.ok(h.cleared.includes(first)); assert.equal(h.timers.has(first), false);
    h.flush(); assert.equal(h.element('bmiNumber').textContent, '30.0');
    assert.equal(h.element('bmiCategory').innerHTML, '🔴 Obesity Range'); assert.equal(h.element('scaleMarker').style.left, '75%');
    assert.deepEqual(h.records, ['bmi-calculator','bmi-calculator']);
});
test('Switching either unit resets and cancels its preceding animation', () => {
    const h = harness(); h.calculate({heightCm:175,weightKg:70}); h.tick(); h.click('imperialBtn'); h.flush();
    assert.equal(h.element('bmiNumber').textContent, '--'); assert.equal(h.imperial.style.display, 'block');
    assert.equal(h.element('imperialBtn').classList.contains('active'), true);
    for (const input of h.metric) assert.equal(input.style.display, 'none');
    h.calculate({heightFt:5,heightIn:8,weightLb:200}); h.tick(); h.click('metricBtn'); h.flush();
    assert.equal(h.element('bmiNumber').textContent, '--'); assert.equal(h.imperial.style.display, 'none');
    assert.equal(h.element('metricBtn').classList.contains('active'), true);
    for (const input of h.metric) assert.equal(input.style.display, 'block');
    assert.equal(h.created.length, 2); assert.ok(h.created.every(id => h.cleared.includes(id)));
    assert.deepEqual(h.records, ['bmi-calculator','bmi-calculator']);
});
test('Rejected derived calculation preserves an existing completed result', () => {
    const h = harness(); h.calculate({heightCm:175,weightKg:70}); h.flush();
    const previous = [h.element('bmiNumber').textContent,h.element('bmiCategory').innerHTML,h.element('bmiAdvice').textContent,h.element('scaleMarker').style.left];
    h.calculate({heightCm:'1e-200',weightKg:70});
    assert.deepEqual([h.element('bmiNumber').textContent,h.element('bmiCategory').innerHTML,h.element('bmiAdvice').textContent,h.element('scaleMarker').style.left],previous);
    assert.equal(h.created.length, 1); assert.equal(h.timers.size, 0); assert.deepEqual(h.records, ['bmi-calculator']);
});
test('Existing Enter binding calculates once and other keys do not', () => {
    const h = harness(); h.set({heightCm:175,weightKg:70});
    h.events.get('keydown')({key:'Escape'}); assert.deepEqual(h.records, []);
    h.events.get('keydown')({key:'Enter'}); h.flush();
    assert.equal(h.element('bmiNumber').textContent, '22.9'); assert.deepEqual(h.records, ['bmi-calculator']);
});
