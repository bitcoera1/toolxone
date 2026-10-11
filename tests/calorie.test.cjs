// Run without dependencies or generated artifacts: node --test tests/calorie.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/calorie.js'), 'utf8');
const base = 'Your estimated maintenance calories are based on your BMR and selected activity level. Calorie needs are estimates and can vary between individuals.';
const unavailable = 'A weight-loss target is unavailable because the calculator’s computed target is not below your estimated maintenance calories.';
const format = value => Math.round(value).toLocaleString();
const ordinary = { sex: 'male', age: 30, heightCm: 180, weightKg: 80, activityLevel: 'moderate' };
function harness() {
    const elements = new Map(), timers = new Map(), callbacks = new Map(), cleared = [], alerts = [], records = [], results = [];
    let ready, timerId = 0;
    function element(id) {
        if (!elements.has(id)) {
            const classes = new Set(), events = new Map();
            elements.set(id, { value: '', textContent: '', style: {}, events,
                addEventListener(type, fn) { events.set(type, fn); },
                classList: { add(v) { classes.add(v); }, remove(v) { classes.delete(v); }, contains(v) { return classes.has(v); } }
            });
        }
        return elements.get(id);
    }
    const inputIds = ['age', 'heightCm', 'weightKg', 'heightFt', 'heightIn', 'weightLb'];
    const context = { console: { log() {}, error() {} },
        document: { addEventListener(type, fn) { if (type === 'DOMContentLoaded') ready = fn; },
            getElementById: element, querySelector: element,
            querySelectorAll() { return inputIds.map(element); } },
        alert(message) { alerts.push(message); },
        ToolXoneStatisticsEvents: { recordCalculation(id) { records.push(id); } },
        setInterval(fn, delay) { assert.equal(delay, 20); timers.set(++timerId, fn); callbacks.set(timerId, fn); return timerId; },
        clearInterval(id) { cleared.push(id); timers.delete(id); }
    };
    vm.createContext(context);
    vm.runInContext(source, context);
    const display = context.displayCalorieResult;
    context.displayCalorieResult = (...args) => { results.push(args); display(...args); };
    ready();
    function flush() { for (let i = 0; timers.size && i < 100; i++) for (const fn of [...timers.values()]) fn(); assert.equal(timers.size, 0); }
    function set(inputs) { for (const [id, v] of Object.entries(inputs)) element(id).value = String(v); }
    function click(id) { element(id).events.get('click')(); }
    return { element, context, alerts, records, results, set, click, flush, timers, cleared,
        tick() { for (const [id, fn] of [...timers]) if (timers.has(id)) fn(); },
        stale(id) { assert.equal(typeof callbacks.get(id), "function"); callbacks.get(id)(); },
        run(inputs) { set(inputs); click('calculateBtn'); flush(); },
        imperial() { click('imperialBtn'); } };
}
const references = [
    ['original failure', { sex: 'female', age: 80, heightCm: 140, weightKg: 40, activityLevel: 'sedentary' }, [714, 856.8, 1200, 1356.8], true],
    ['below 1200', { sex: 'female', age: 40, heightCm: 160, weightKg: 36, activityLevel: 'sedentary' }, [999, 1198.8, 1200, 1698.8], true],
    ['exactly 1200', { sex: 'female', age: 40, heightCm: 160, weightKg: 36.1, activityLevel: 'sedentary' }, [1000, 1200, 1200, 1700], true],
    ['above 1200', { sex: 'female', age: 40, heightCm: 160, weightKg: 36.2, activityLevel: 'sedentary' }, [1001, 1201.2, 1200, 1701.2], false],
    ['ordinary valid', ordinary, [1780, 2759, 2259, 3259], false]
];
for (const [name, inputs, expected, hidden] of references) {
    test(name + ': formulas, formatting, animation, explanation and statistics', () => {
        const h = harness(); h.run(inputs);
        assert.deepEqual(h.results[0], expected);
        assert.deepEqual(h.alerts, []);
        assert.deepEqual(h.records, ['calorie-calculator']);
        for (const [id, value] of [['bmrValue', expected[0]], ['maintenanceValue', expected[1]], ['calorieValue', expected[1]], ['weightGainValue', expected[3]]]) assert.equal(h.element(id).textContent, format(value));
        assert.equal(h.element('weightLossValue').textContent, hidden ? '—' : format(expected[2]));
        assert.equal(h.element('calorieExplanation').textContent, base + (hidden ? ' ' + unavailable : ''));
        assert.equal(h.element('resultCard').style.display, 'block');
    });
}
for (const maintenance of [1199.9, 1200, 1200.1]) test('unrounded display boundary ' + maintenance, () => {
    const h = harness(); h.context.displayCalorieResult(1000, maintenance, 1200, maintenance + 500); h.flush();
    assert.equal(h.element('weightLossValue').textContent, maintenance <= 1200 ? '—' : format(1200));
    assert.deepEqual(h.records, []);
});
for (const index of [0, 4]) test('imperial equivalence: ' + references[index][0], () => {
    const inputs = references[index][1], metric = harness(), imperial = harness();
    metric.run(inputs); imperial.imperial();
    const inches = inputs.heightCm / 2.54, feet = Math.floor(inches / 12);
    imperial.run({ sex: inputs.sex, age: inputs.age, activityLevel: inputs.activityLevel, heightFt: feet, heightIn: inches - feet * 12, weightLb: inputs.weightKg / 0.45359237 });
    imperial.results[0].forEach((v, i) => assert.ok(Math.abs(v - metric.results[0][i]) < 1e-9));
    for (const id of ['bmrValue', 'maintenanceValue', 'calorieValue', 'weightLossValue', 'weightGainValue', 'calorieExplanation']) assert.equal(imperial.element(id).textContent, metric.element(id).textContent);
    assert.deepEqual(imperial.records, ['calorie-calculator']);
});
test('available/unavailable/available replaces output without stale explanation', () => {
    const h = harness();
    for (const index of [4, 0, 4]) { h.run(references[index][1]); assert.equal(h.element('calorieExplanation').textContent, base + (index === 0 ? ' ' + unavailable : '')); assert.equal(h.element('weightLossValue').textContent, index === 0 ? '—' : format(2259)); }
    assert.equal(h.records.length, 3);
});
for (const index of [0, 4]) test('reset after ' + references[index][0], () => {
    const h = harness(); h.run(references[index][1]); h.click('resetBtn');
    for (const id of ['age', 'heightCm', 'weightKg', 'heightFt', 'heightIn', 'weightLb']) assert.equal(h.element(id).value, '');
    for (const id of ['calorieValue', 'bmrValue', 'maintenanceValue', 'weightLossValue', 'weightGainValue']) assert.equal(h.element(id).textContent, '—');
    assert.equal(h.element('calorieExplanation').textContent, '');
    assert.equal(h.element('resultCard').style.display, 'none');
    assert.equal(h.element('sex').value, references[index][1].sex);
    assert.equal(h.element('activityLevel').value, references[index][1].activityLevel);
    assert.equal(h.records.length, 1);
});
for (const [name, overrides, imperial] of [
    ['blank age', { age: '' }], ['underage', { age: 17 }], ['over age limit', { age: 121 }],
    ['invalid activity', { activityLevel: 'invalid' }], ['blank height', { heightCm: '' }],
    ['height below range', { heightCm: 99 }], ['weight above range', { weightKg: 501 }],
    ['nonfinite weight', { weightKg: Infinity }],
    ['blank imperial inches', { heightFt: 5, heightIn: '', weightLb: 150 }, true],
    ['invalid imperial inches', { heightFt: 5, heightIn: 12, weightLb: 150 }, true],
    ['invalid imperial weight', { heightFt: 5, heightIn: 5, weightLb: 43 }, true]
]) test('validation preserved: ' + name, () => {
    const h = harness(); if (imperial) h.imperial(); h.run({ ...ordinary, ...overrides });
    assert.equal(h.alerts.length, 1); assert.equal(h.results.length, 0); assert.equal(h.records.length, 0);
});
test('Enter calculates once and unit switches preserve existing reset behavior', () => {
    const h = harness(); h.set(ordinary); let prevented = false;
    h.element('age').events.get('keydown')({ key: 'Enter', preventDefault() { prevented = true; } }); h.flush();
    assert.equal(prevented, true); assert.equal(h.records.length, 1);
    h.imperial(); assert.equal(h.element('.metric-inputs').style.display, 'none'); assert.equal(h.element('.imperial-inputs').style.display, 'block'); assert.equal(h.element('resultCard').style.display, 'none');
    h.click('metricBtn'); assert.equal(h.element('.metric-inputs').style.display, 'block'); assert.equal(h.element('.imperial-inputs').style.display, 'none');
    h.run(ordinary); assert.deepEqual(h.results[1], references[4][2]); assert.equal(h.records.length, 2);
});


function lifecycleSnapshot(h) {
    return ['calorieValue', 'bmrValue', 'maintenanceValue', 'weightLossValue',
        'weightGainValue', 'calorieExplanation'].map(id => h.element(id).textContent)
        .concat(h.element('resultCard').style.display);
}
function startPending(h, values) {
    h.set(values); h.click('calculateBtn');
    assert.equal(h.timers.size, 1);
    const id = [...h.timers.keys()][0];
    h.tick();
    return id;
}

test('Reset during animation cancels ownership and blocks captured stale callbacks', () => {
    const h = harness(), id = startPending(h, ordinary);
    assert.deepEqual(h.records, ['calorie-calculator']);
    h.click('resetBtn');
    assert.equal(h.timers.size, 0);
    assert.ok(h.cleared.includes(id));
    const reset = lifecycleSnapshot(h);
    assert.deepEqual(reset, ['—', '—', '—', '—', '—', '', 'none']);
    h.stale(id); h.tick(); h.flush();
    assert.deepEqual(lifecycleSnapshot(h), reset);
    assert.deepEqual(h.records, ['calorie-calculator']);
});

for (const [from, to] of [['metricBtn', 'imperialBtn'], ['imperialBtn', 'metricBtn']]) {
    test('Pending unit switch cancels and blocks stale animation: ' + from + ' to ' + to, () => {
        const h = harness(); h.click(from);
        const values = from === 'metricBtn' ? ordinary : {
            sex: 'male', age: 30, heightFt: 5, heightIn: 9, weightLb: 154, activityLevel: 'moderate'
        };
        const id = startPending(h, values);
        h.click(to);
        assert.equal(h.timers.size, 0); assert.ok(h.cleared.includes(id));
        const reset = lifecycleSnapshot(h);
        assert.deepEqual(reset, ['—', '—', '—', '—', '—', '', 'none']);
        for (const field of ['age', 'heightCm', 'weightKg', 'heightFt', 'heightIn', 'weightLb'])
            assert.equal(h.element(field).value, '');
        assert.equal(h.element(to).classList.contains('active'), true);
        assert.equal(h.element(from).classList.contains('active'), false);
        h.stale(id); h.tick(); h.flush();
        assert.deepEqual(lifecycleSnapshot(h), reset);
        assert.deepEqual(h.records, ['calorie-calculator']);
    });
}

test('Replacement cancels older animation, rejects stale writes and completes newest result once', () => {
    const h = harness(), first = startPending(h, ordinary);
    h.set({ sex: 'female', age: 40, heightCm: 165, weightKg: 60, activityLevel: 'sedentary' });
    h.click('calculateBtn');
    assert.equal(h.timers.size, 1);
    assert.equal(h.timers.has(first), false); assert.ok(h.cleared.includes(first));
    const second = [...h.timers.keys()][0]; assert.notEqual(second, first);
    assert.deepEqual(h.results[1], [1270.25, 1524.3, 1200, 2024.3]);
    const before = lifecycleSnapshot(h); h.stale(first);
    assert.deepEqual(lifecycleSnapshot(h), before);
    h.tick(); const afterTick = lifecycleSnapshot(h); h.stale(first);
    assert.deepEqual(lifecycleSnapshot(h), afterTick);
    h.flush();
    assert.equal(h.element('calorieValue').textContent, '1,524');
    assert.equal(h.element('maintenanceValue').textContent, '1,524');
    assert.ok(h.cleared.includes(second)); assert.equal(h.timers.size, 0);
    const completed = lifecycleSnapshot(h);
    h.stale(first); h.stale(second);
    assert.deepEqual(lifecycleSnapshot(h), completed);
    assert.deepEqual(h.records, ['calorie-calculator', 'calorie-calculator']);
});

test('Completed animation releases ownership before reset and another calculation', () => {
    const h = harness(), first = startPending(h, ordinary);
    h.flush(); assert.equal(h.timers.size, 0);
    const clearsAfterCompletion = h.cleared.length;
    h.click('resetBtn');
    assert.equal(h.cleared.length, clearsAfterCompletion, 'Reset must not retain a completed timer');
    h.set(ordinary); h.click('calculateBtn');
    const before = lifecycleSnapshot(h); h.stale(first);
    assert.deepEqual(lifecycleSnapshot(h), before);
    h.flush();
    assert.equal(h.element('calorieValue').textContent, '2,759');
    assert.deepEqual(h.records, ['calorie-calculator', 'calorie-calculator']);
});
