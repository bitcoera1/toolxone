const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

// DOM plumbing only: actual HTML bindings, click handler, registry and engines.
function harness() {
    const listeners = new Map();
    const buttons = [...read('scientific-calculator.html').matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)]
        .filter(m => m[1].includes('data-sci-action')).map(m => {
            const attrs = Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a => [a[1], a[2]]));
            const dataset = {};
            for (const [k, v] of Object.entries(attrs)) if (k.startsWith('data-')) dataset[k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
            const b = { dataset, textContent: m[2].replace(/<[^>]*>/g, '').trim(), disabled: false,
                getAttribute: k => attrs[k], setAttribute(k, v) { attrs[k] = v; } };
            b.closest = () => b;
            return b;
        });
    const root = { dataset: {}, classList: { toggle() {} }, dispatchEvent() {},
        contains: b => buttons.includes(b), querySelector: () => null,
        querySelectorAll: () => buttons.filter(b => b.dataset.sciFunction) };
    const context = {
        console: Object.fromEntries(['log','info','warn','error','group','groupEnd','table'].map(k => [k, () => {}])),
        CustomEvent: class {},
        document: { readyState: 'loading', querySelector: s => s === '[data-scientific-calculator]' ? root : null,
            addEventListener(k, fn) { listeners.set(k, fn); }, removeEventListener() {} },
        fetch() { throw Error('Network forbidden'); }
    };
    context.window = context;
    vm.createContext(context);
    const load = file => vm.runInContext(read(file), context, { filename: file });
    for (const name of ['scientific-math-engine','expression-parser','expression-evaluator','scientific-state-engine','scientific-control-engine','scientific-function-registry','scientific-ui-engine']) load('js/math/' + name + '.js');
    const ui = context.ToolXoneScientificUI, control = context.ToolXoneScientificControl;
    assert.equal(ui.initialize().success, true);
    function button(action, value) {
        const b = buttons.find(b => b.dataset.sciAction === action && (value === undefined || b.dataset.sciValue === value));
        assert.ok(b, action + ':' + value); return b;
    }
    function click(action, value) { listeners.get('click')({ target: button(action, value) }); }
    function input(text) {
        for (const c of text) {
            if (c === '^') click('power');
            else if (c === '(') click('left-parenthesis');
            else if (c === ')') click('right-parenthesis');
            else click('input', c);
        }
    }
    const inverse = () => { click('shift'); click('registry-function', 'square'); };
    return { context, load, control, button, click, input, inverse, state: () => control.getSnapshot() };
}
function near(actual, expected) { assert.ok(Math.abs(actual - expected) <= 1e-12 * Math.max(1, Math.abs(expected)), actual + ' vs ' + expected); }

test('actual SHIFT square route changes label, invokes method and consumes SHIFT once', () => {
    const h = harness(); h.input('2'); h.click('shift');
    assert.equal(h.button('registry-function', 'square').textContent, 'x⁻²');
    assert.equal(typeof h.control.insertInverseSquare, 'function');
    h.click('registry-function', 'square');
    assert.equal(h.state().expression, '2^(-2)'); assert.equal(h.state().shift, false);
    assert.equal(h.button('registry-function', 'square').textContent, 'x²');
    h.click('equals'); near(h.state().result, .25);
    h.click('registry-function', 'square'); assert.equal(h.state().expression, '0.25^2');
});
for (const [input, expected] of [['2',.25],['0.5',4],['(-2)',.25],['-2',-.25],['2+3',2+1/9],['(2+3)',.04]]) {
    test('inverse square: ' + input, () => {
        const h = harness(); h.input(input); h.inverse();
        assert.equal(h.state().expression, input + '^(-2)'); h.click('equals'); near(h.state().result, expected);
    });
}
for (const [input, operand, expected] of [['2+3','5',.04],['1-3','-2',.25]]) {
    test('inverse square after equals: ' + input, () => {
        const h = harness(); h.input(input); h.click('equals'); h.inverse();
        assert.equal(h.state().expression, '(' + operand + ')^(-2)'); h.click('equals'); near(h.state().result, expected);
    });
}
for (const input of ['0','','2+']) {
    test('error and new-input recovery: ' + JSON.stringify(input), () => {
        const h = harness(); h.input(input); h.inverse(); h.click('equals');
        assert.equal(h.state().result, 'Error'); assert.ok(h.state().error);
        h.input('2'); assert.equal(h.state().expression, '2'); assert.equal(h.state().error, null);
        h.inverse(); h.click('equals'); near(h.state().result, .25);
        h.click('ac'); assert.equal(h.state().expression, '');
    });
}
test('inverse after error does not reuse the previous successful answer', () => {
    const h = harness(); h.input('4'); h.click('equals'); h.input('0'); h.inverse(); h.click('equals');
    h.inverse(); assert.equal(h.state().expression, '^(-2)');
    h.click('equals'); assert.equal(h.state().result, 'Error'); h.click('ac'); h.input('3'); h.click('equals'); near(h.state().result, 3);
});
test('delete allows correction of incomplete inverse expression', () => {
    const h = harness(); h.input('2+'); h.inverse();
    for (let i=0;i<5;i++) h.click('delete');
    assert.equal(h.state().expression, '2+'); h.input('3'); h.click('equals'); near(h.state().result, 5);
});
test('ordinary square before/after equals keeps existing precedence', () => {
    const h = harness(); h.input('-2'); h.click('registry-function','square');
    assert.equal(h.state().expression,'-2^2'); h.click('equals'); near(h.state().result,-4);
    h.click('registry-function','square'); assert.equal(h.state().expression,'-4^2'); h.click('equals'); near(h.state().result,-16);
});
for (const [input, expected] of [['2^3^2',512],['-2^2',-4],['(-2)^2',4],['27^(1/3)',3],['1.2*10^3',1200]]) {
    test('existing power UI: '+input, () => { const h=harness(); h.input(input); h.click('equals'); near(h.state().result,expected); });
}
test('SHIFT asin in DEG followed by ordinary sin', () => {
    const h=harness(); h.click('shift'); h.click('registry-function','sin');
    assert.equal(h.state().expression,'asin('); assert.equal(h.state().shift,false);
    h.input('0.5)'); h.click('equals'); near(h.state().result,30);
    h.click('registry-function','sin'); assert.equal(h.state().expression,'sin(');
    h.input('30)'); h.click('equals'); near(h.state().result,.5);
});
for (const [key,token,arg,expected] of [['log','pow10(','2)',100],['ln','exp(','1)',Math.E]]) {
    test('SHIFT exponential: '+key, () => {
        const h=harness(); h.click('shift'); h.click('registry-function',key);
        assert.equal(h.state().expression,token); assert.equal(h.state().shift,false);
        h.input(arg); h.click('equals'); near(h.state().result,expected);
    });
}
test('registered article and FAQ contain exact approved qualifications', () => {
    const h=harness(), records={};
    h.context.ToolXoneContentRegistry={register(type,id,value){records[type]=value;}};
    h.load('js/content/content-data-scientific.js');
    const q='For positive values, nth roots can be calculated using fractional powers such as 27^(1/3). Values can also be entered as multiplication by powers of ten, such as 1.2*10^3. There is no dedicated nth-root control, direct exponent-notation input such as 1.2e3, or scientific-notation display mode.';
    const a=records.articles;
    assert.ok(a.introduction.includes('trigonometric functions, logarithms, exponents, square and cube roots, constants'));
    assert.ok(a.sections.find(s=>s.heading==='What is a Scientific Calculator?').content.includes('factorials and fractions'));
    assert.equal(a.sections.find(s=>s.heading==='Key Features').content,'The calculator supports basic arithmetic, trigonometric functions, inverse trigonometry, logarithms, natural logarithms, powers, exponents, square and cube roots, factorials, percentages, memory functions, constants such as π (Pi) and e, and multiple angle modes including Degrees, Radians and Gradians. '+q+' These features make it suitable for both everyday calculations and advanced mathematical work.');
    assert.equal(records.faq.find(f=>f.question==='What mathematical functions are supported?').answer,'The calculator supports basic arithmetic, trigonometric functions, logarithms, natural logarithms, powers, square and cube roots, factorials, percentages, memory operations, constants such as π and e, and multiple angle modes. '+q);
    assert.ok(records.faq.find(f=>f.question==='What is a scientific calculator?').answer.endsWith('It supports functions such as trigonometry, logarithms, exponents, roots, percentages and many other advanced calculations.'));
    assert.doesNotMatch(JSON.stringify([a,records.faq]),/roots, scientific notation|percentages, scientific notation|square roots, nth roots|fractions and scientific notation/);
});
test('existing scientific math QA unchanged', t => {
    const h=harness(); h.load('js/math/scientific-math-tests.js');
    const r=h.context.ToolXoneScientificMathTests.runAll();
    t.diagnostic(JSON.stringify({total:r.total,passed:r.passed,failed:r.failed}));
    assert.equal(r.failed,0,JSON.stringify(r.results.filter(x=>!x.passed)));
});

function magnitudeNear(actual, expected) {
    assert.equal(typeof actual, 'number');
    assert.ok(Number.isFinite(actual), 'result must be finite');
    if (expected === 0) {
        assert.equal(actual, 0);
    } else {
        assert.ok(Math.abs(actual / expected - 1) <= 1e-12, actual + ' vs ' + expected);
    }
}

test('magnitude assertion rejects zero for tiny nonzero expectations', () => {
    assert.throws(() => magnitudeNear(0, 1e-42), assert.AssertionError);
    assert.throws(() => magnitudeNear('1e-42', 1e-42), assert.AssertionError);
    assert.throws(() => magnitudeNear(Infinity, 1e-42), assert.AssertionError);
    magnitudeNear(1e-42, 1e-42);
    magnitudeNear(0, 0);
});

for (const [input, previous, operand, expected] of [
    ['10^(-7)', 1e-7, '0.0000001', 1e14],
    ['-10^(-7)', -1e-7, '-0.0000001', 1e14],
    ['10^21', 1e21, '1000000000000000000000', 1e-42],
    ['-10^21', -1e21, '-1000000000000000000000', 1e-42],
    ['1.25*10^(-7)', 1.25e-7, '0.000000125', 6.4e13],
    ['-1.25*10^(-7)', -1.25e-7, '-0.000000125', 6.4e13],
    ['1.25*10^21', 1.25e21, '1250000000000000000000', 6.4e-43],
    ['-1.25*10^21', -1.25e21, '-1250000000000000000000', 6.4e-43]
]) {
    test('exponent-form result through actual after-equals SHIFT route: ' + input, () => {
        const h = harness();
        h.input(input);
        h.click('equals');
        assert.equal(h.state().error, null);
        assert.equal(h.state().justEvaluated, true);
        assert.equal(h.state().result, previous);
        h.inverse();
        assert.equal(h.state().expression, '(' + operand + ')^(-2)');
        assert.doesNotMatch(h.state().expression, /[eE]/);
        assert.equal(h.state().shift, false);
        assert.equal(h.state().justEvaluated, false);
        assert.equal(h.button('registry-function', 'square').textContent, 'x²');
        h.click('equals');
        assert.equal(h.state().error, null);
        magnitudeNear(h.state().result, expected);
        assert.ok(h.state().result > 0);
    });
}

for (const [label, value] of [
    ['integer', 2], ['negative integer', -2],
    ['decimal', 0.5], ['negative decimal', -0.5],
    ['zero', 0], ['negative zero', -0],
    ['1e-6', 1e-6], ['-1e-6', -1e-6],
    ['1e-7', 1e-7], ['-1e-7', -1e-7],
    ['1e20', 1e20], ['-1e20', -1e20],
    ['1e21', 1e21], ['-1e21', -1e21],
    ['MIN_VALUE', Number.MIN_VALUE], ['-MIN_VALUE', -Number.MIN_VALUE],
    ['MAX_VALUE', Number.MAX_VALUE], ['-MAX_VALUE', -Number.MAX_VALUE]
]) {
    test('synthetic finite-result serialization boundary: ' + label, () => {
        const h = harness();
        h.input('2');
        h.click('equals');
        // Test-only state setup: exercise the private serializer through its real caller.
        h.context.ToolXoneScientificState.setResult(value);
        assert.equal(h.state().error, null);
        assert.equal(h.state().justEvaluated, true);
        h.inverse();
        const expression = h.state().expression;
        assert.ok(expression.startsWith('(') && expression.endsWith(')^(-2)'));
        const operand = expression.slice(1, -6);
        assert.match(operand, /^-?\d+(?:\.\d+)?$/);
        assert.doesNotMatch(operand, /[eE]/);
        assert.equal(Number(operand), value === 0 ? 0 : value);
        const parser = h.context.ToolXoneExpressionParser;
        assert.doesNotThrow(() => parser.parse(operand));
        assert.doesNotThrow(() => parser.parse(expression));
        const token = parser.tokenize(operand).find(t => t.type === parser.TOKEN.NUMBER);
        assert.equal(token.value, Math.abs(value));
        if (!/[eE]/.test(String(value))) assert.equal(operand, String(value));
        assert.equal(h.state().shift, false);
        assert.equal(h.control.serializeInverseSquareOperand, undefined);
        // Extreme inverse squares may overflow/underflow; only parsing is required here.
    });
}

test('zero after equals retains the existing inverse-square error and recovery', () => {
    const h = harness();
    h.input('0');
    h.click('equals');
    assert.equal(h.state().error, null);
    h.inverse();
    assert.equal(h.state().expression, '(0)^(-2)');
    h.click('equals');
    assert.equal(h.state().result, 'Error');
    assert.ok(h.state().error);
    h.input('2');
    h.inverse();
    h.click('equals');
    magnitudeNear(h.state().result, 0.25);
});
