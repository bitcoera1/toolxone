'use strict';
// Actual calculator, synthetic DOM/timers only. No network or generated files.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/body-fat.js'), 'utf8');
const explanation = 'Estimated using historical Hodgdon–Beckett circumference equations and Siri conversion. This is not a medical diagnosis, health category, or military qualification result.';
const inputIds = ['heightCm','neckCm','waistCm','hipCm','heightFt','heightIn','neckIn','waistIn','hipIn','weightKg','weightLb'];
function harness() {
    const elements = new Map(), timers = new Map(), alerts = [], records = [], results = [];
    let ready, timerId = 0;
    function element(id) {
        if (!elements.has(id)) {
            const classes = new Set(), events = new Map();
            elements.set(id, { value: '', textContent: '', style: {}, events,
                addEventListener(type, fn) { events.set(type, fn); },
                classList: { add(v) { classes.add(v); }, remove(v) { classes.delete(v); }, contains(v) { return classes.has(v); } } });
        }
        return elements.get(id);
    }
    const groups = [element('metricGroup'),element('metricHipGroup')];
    const hips = [element('metricHipGroup'),element('imperialHipGroup')];
    element('sex').value = 'male';
    const context = { console: { log() {}, error() {} },
        document: { addEventListener(type, fn) { if (type === 'DOMContentLoaded') ready = fn; },
            getElementById: element, querySelector: () => element('imperialGroup'),
            querySelectorAll(selector) {
                if (selector === '.metric-inputs') return groups;
                if (selector === '.female-only') return hips;
                if (selector === '.body-fat-page input') return inputIds.map(element);
                throw new Error('Unexpected selector: ' + selector);
            } },
        alert(message) { alerts.push(message); },
        ToolXoneStatisticsEvents: { recordCalculation(id) { records.push(id); } },
        setInterval(fn) { timers.set(++timerId, fn); return timerId; }, clearInterval(id) { timers.delete(id); }
    };
    vm.createContext(context);
    vm.runInContext(source, context, { filename: 'js/body-fat.js', timeout: 2000 });
    const display = context.displayBodyFatResult;
    context.displayBodyFatResult = (...args) => { results.push(args); display(...args); };
    assert.equal(typeof ready, 'function'); ready();
    function flush() {
        for (let i = 0; timers.size && i < 100; i++) for (const fn of [...timers.values()]) fn();
        assert.equal(timers.size, 0, 'Animation must finish');
    }
    function set(values) { for (const [id,value] of Object.entries(values)) element(id).value = String(value); }
    function click(id) { const fn = element(id).events.get('click'); assert.equal(typeof fn,'function'); fn(); }
    return { element, context, alerts, records, results, groups, hips, set, click, flush,
        run(values) { set(values); click('calculateBtn'); flush(); }, imperial() { click('imperialBtn'); } };
}
function close(actual,expected) {
    assert.equal(typeof actual,'number'); assert.ok(Number.isFinite(actual));
    assert.ok(Math.abs(actual-expected) <= 1e-10, actual + ' versus ' + expected);
}
// Fixed independent evaluations of published centimeter density equations + Siri.
// Expected percentages are literals, never computed using a copied production formula.
const references = [
    ['male metric',{sex:'male',heightCm:177.8,waistCm:91.44,neckCm:38.10},21.1236649803767,'Circumference-based estimate',false],
    ['male imperial',{sex:'male',heightFt:5,heightIn:10,waistIn:36,neckIn:15},21.1236649803767,'Circumference-based estimate',true],
    ['female metric',{sex:'female',heightCm:165.10,waistCm:76.20,neckCm:33.02,hipCm:96.52},28.2573793515133,'Circumference-based estimate',false],
    ['female imperial',{sex:'female',heightFt:5,heightIn:5,waistIn:30,neckIn:13,hipIn:38},28.2573793515133,'Circumference-based estimate',true],
    ['male original unit failure',{sex:'male',heightCm:175,waistCm:90,neckCm:40},19.2070089251118,'Circumference-based estimate',false],
    ['female original unit failure',{sex:'female',heightCm:165,waistCm:75,neckCm:34,hipCm:95},26.4058821429019,'Circumference-based estimate',false]
];
for (const [name,inputs,expected,category,imperial] of references) test(name + ': numeric oracle, display, category and statistics',()=>{
    const h=harness(); if(imperial) h.imperial(); h.run(inputs);
    assert.equal(h.results.length,1); close(h.results[0][0],expected); assert.equal(h.results[0][1],inputs.sex);
    assert.deepEqual(h.alerts,[]); assert.deepEqual(h.records,['body-fat-calculator']);
    assert.equal(h.element('bodyFatValue').textContent,expected.toFixed(1)+'%');
    assert.equal(h.element('bodyFatDetails').textContent,'Estimated body fat: '+expected.toFixed(1)+'%');
    assert.equal(h.element('bodyFatCategory').textContent,category);
    assert.equal(h.element('bodyFatExplanation').textContent,explanation);
    assert.equal(h.element('resultCard').style.display,'block');
});
for(const [mi,ii] of [[0,1],[2,3]]) test('Metric/imperial equivalence: '+references[mi][0],()=>{
    const m=harness(),i=harness(); m.run(references[mi][1]); i.imperial(); i.run(references[ii][1]);
    close(m.results[0][0],references[mi][2]); close(i.results[0][0],m.results[0][0]);
    for(const id of ['bodyFatValue','bodyFatDetails','bodyFatCategory','bodyFatExplanation']) assert.equal(i.element(id).textContent,m.element(id).textContent);
});
for(const hipCm of ['',0,-1,'not-a-number',Infinity,1000]) test('Male ignores hip: '+hipCm,()=>{
    const h=harness(); h.run({...references[0][1],hipCm}); close(h.results[0][0],references[0][2]); assert.deepEqual(h.alerts,[]);
});
const invalid=[];
for(const id of ['heightCm','neckCm','waistCm']) for(const value of ['','not-a-number',NaN,Infinity,-Infinity,0,-1]) invalid.push([id+'='+value,{...references[0][1],[id]:value},false]);
for(const hipCm of ['','not-a-number',NaN,Infinity,-Infinity,0,-1]) invalid.push(['female hip='+hipCm,{...references[2][1],hipCm},false]);
for(const id of ['heightFt','heightIn','neckIn','waistIn']) for(const value of ['','not-a-number',Infinity,-Infinity]) invalid.push([id+'='+value,{...references[1][1],[id]:value},true]);
for(const hipIn of ['','not-a-number',Infinity,0,-1]) invalid.push(['female imperial hip='+hipIn,{...references[3][1],hipIn},true]);
invalid.push(
    ['negative feet',{...references[1][1],heightFt:-1},true],
    ['negative inches',{...references[1][1],heightIn:-1},true],
    ['inches equal 12',{...references[1][1],heightIn:12},true],
    ['zero total height',{...references[1][1],heightFt:0,heightIn:0},true],
    ['zero imperial neck',{...references[1][1],neckIn:0},true],
    ['negative imperial waist',{...references[1][1],waistIn:-1},true],
    ['male equal domain',{...references[0][1],waistCm:38.1},false],
    ['male negative domain',{...references[0][1],waistCm:30},false],
    ['female equal domain',{...references[2][1],waistCm:76,hipCm:96,neckCm:172},false],
    ['female negative domain',{...references[2][1],neckCm:200},false],
    ['male imperial equal domain',{...references[1][1],waistIn:15},true],
    ['female imperial equal domain',{...references[3][1],neckIn:68},true],
    ['percentage below zero',{sex:'male',heightCm:175,neckCm:40,waistCm:45},false],
    ['percentage above 70',{sex:'male',heightCm:175,neckCm:40,waistCm:250},false],
    ['nonfinite arithmetic',{sex:'female',heightFt:5,heightIn:5,neckIn:13,waistIn:Number.MAX_VALUE,hipIn:Number.MAX_VALUE},true]
);
for(const [name,inputs,imperial] of invalid) test('Reject without display/statistics: '+name,()=>{
    const h=harness(); if(imperial) h.imperial();
    h.element('bodyFatValue').textContent='unchanged'; h.element('bodyFatDetails').textContent='unchanged details';
    h.run(inputs); assert.equal(h.alerts.length,1); assert.equal(h.results.length,0); assert.deepEqual(h.records,[]);
    assert.equal(h.element('bodyFatValue').textContent,'unchanged'); assert.equal(h.element('bodyFatDetails').textContent,'unchanged details');
});
for(const sex of ['male','female']) test('Neutral descriptor across former category bands: '+sex,()=>{
    const h=harness();
    for(const value of [0,2,5.999,6,13.999,14,17.999,18,20.999,21,24.999,25,31.999,32,50,70]) {
        h.context.displayBodyFatResult(value,sex); h.flush();
        assert.equal(h.element('bodyFatValue').textContent,value.toFixed(1)+'%');
        assert.equal(h.element('bodyFatDetails').textContent,'Estimated body fat: '+value.toFixed(1)+'%');
        assert.equal(h.element('bodyFatCategory').textContent,'Circumference-based estimate');
        assert.equal(h.element('bodyFatExplanation').textContent,explanation);
    }
    assert.deepEqual(h.records,[]);
    assert.equal(typeof h.context.getBodyFatCategory,'undefined');
});
for(const index of [0,3]) test('Reset preserves sex and clears input/results: '+references[index][0],()=>{
    const h=harness(); if(references[index][4]) h.imperial(); h.run(references[index][1]); h.click('resetBtn');
    for(const id of inputIds) assert.equal(h.element(id).value,'');
    assert.equal(h.element('sex').value,references[index][1].sex); assert.equal(h.element('bodyFatValue').textContent,'—');
    for(const id of ['bodyFatCategory','bodyFatDetails','bodyFatExplanation']) assert.equal(h.element(id).textContent,'');
    assert.equal(h.element('resultCard').style.display,'none'); assert.deepEqual(h.records,['body-fat-calculator']);
    for(const hip of h.hips) assert.equal(hip.style.display,references[index][1].sex==='female'?'block':'none');
});
test('Unit switching resets and selects actual input/calculation mode',()=>{
    const h=harness(); h.run(references[0][1]); h.imperial();
    assert.equal(h.element('imperialBtn').classList.contains('active'),true); assert.equal(h.element('metricBtn').classList.contains('active'),false);
    assert.equal(h.element('imperialGroup').style.display,'block'); assert.equal(h.groups[0].style.display,'none');
    assert.equal(h.element('heightCm').value,''); assert.equal(h.element('bodyFatValue').textContent,'—');
    h.run(references[1][1]); close(h.results[1][0],references[1][2]); h.click('metricBtn');
    assert.equal(h.element('metricBtn').classList.contains('active'),true); assert.equal(h.element('imperialBtn').classList.contains('active'),false);
    assert.equal(h.groups[0].style.display,'block'); assert.equal(h.element('imperialGroup').style.display,'none');
    assert.equal(h.element('heightFt').value,''); h.run(references[0][1]); close(h.results[2][0],references[0][2]);
});
test('Actual sex change handler controls hip visibility',()=>{
    const h=harness(); for(const hip of h.hips) assert.equal(hip.style.display,'none');
    for(const sex of ['female','male']) { h.element('sex').value=sex; h.element('sex').events.get('change')(); for(const hip of h.hips) assert.equal(hip.style.display,sex==='female'?'block':'none'); }
});
test('Actual Enter handler calculates once and ignores other keys',()=>{
    const h=harness(); h.set(references[0][1]); let prevented=0; const handler=h.element('waistCm').events.get('keydown');
    handler({key:'Escape',preventDefault(){prevented++;}}); assert.equal(h.results.length,0);
    handler({key:'Enter',preventDefault(){prevented++;}}); h.flush();
    assert.equal(prevented,1); assert.equal(h.results.length,1); close(h.results[0][0],references[0][2]); assert.deepEqual(h.records,['body-fat-calculator']);
});
