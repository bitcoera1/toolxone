// Actual shared renderer and submit handler; synthetic DOM/API only. No network or D1.
// Radio/select publication choices use private_feedback/public_review contract values.
// This small form model does not replace real-browser layout/accessibility verification.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/finance-components.js'), 'utf8');

function harness() {
    const events = new Map(), submissions = [], htmlWrites = [], container = { innerHTML: '' };
    const status = { className: '', textContent: '', set innerHTML(v) { htmlWrites.push(String(v)); } };
    const button = { disabled: false, innerHTML: '' };
    const context = {
        window: {}, console: { warn() {}, error() {} },
        ToolXoneToolsRegistry: [{ id: 'synthetic-tool', name: 'Synthetic Tool' }],
        document: { getElementById: () => container, addEventListener: (type, fn) => events.set(type, fn) },
        FeedbackAPI: { async submit(payload) {
            submissions.push(JSON.parse(JSON.stringify(payload)));
            return { success: true, feedbackId: 1 };
        } }
    };
    vm.createContext(context); vm.runInContext(source, context);
    context.renderFinanceFeedback('synthetic-container', 'Synthetic Tool');
    const markup = container.innerHTML;
    // Extract defaults from real markup instead of supplying an invented consent control.
    const attrs = text => Object.fromEntries([...text.matchAll(/([\w-]+)(?:\s*=\s*"([^"]*)")?/g)].map(m => [m[1], m[2] ?? '']));
    const controls = [...markup.matchAll(/<(input|select|textarea)\b([^>]*)(?:>([\s\S]*?)<\/\1>|>)/g)].map(m => {
        const a = attrs(m[2]);
        const options = [...(m[3] || '').matchAll(/<option\b([^>]*)>([^<]*)<\/option>/g)].map(o => {
            const oa = attrs(o[1]); return { value: oa.value ?? o[2].trim(), selected: 'selected' in oa };
        });
        const value = m[1] === 'select' ? (options.find(o => o.selected) || options[0])?.value ?? '' : a.value ?? '';
        return { ...a, tag: m[1], value, defaultValue: value, checked: 'checked' in a, defaultChecked: 'checked' in a, options };
    });
    function matches(c, selector) {
        const cls = selector.match(/\.([\w-]+)/)?.[1];
        const name = selector.match(/\[name=["']([^"']+)["']\]/)?.[1];
        const value = selector.match(/\[value=["']([^"']+)["']\]/)?.[1];
        return (!cls || (c.class || '').split(/\s+/).includes(cls)) &&
            (!name || c.name === name) && (!value || c.value === value) &&
            (!selector.includes(':checked') || c.checked) &&
            (!/^(input|select|textarea)/.test(selector) || selector.startsWith(c.tag));
    }
    const form = {
        classList: { contains: v => v === 'feedback-form' },
        closest: () => ({ dataset: { toolId: 'synthetic-tool', toolName: 'Synthetic Tool' } }),
        querySelector(selector) {
            if (selector === '.feedback-submit') return button;
            if (selector === '.feedback-status') return status;
            return controls.find(c => matches(c, selector)) || null;
        },
        querySelectorAll: selector => controls.filter(c => matches(c, selector)),
        reset() { for (const c of controls) { c.value = c.defaultValue; c.checked = c.defaultChecked; } }
    };
    function choose(value) {
        const c = controls.find(c => c.options.some(o => o.value === value) || c.value === value);
        assert.ok(c, 'Rendered form must offer explicit choice: ' + value);
        if (c.tag === 'select') c.value = value;
        else {
            assert.equal(c.type, 'radio', 'Publication choice must be an explicit radio/select choice');
            for (const peer of controls.filter(p => p.name === c.name)) peer.checked = peer === c;
        }
        events.get('change')?.({ target: c });
    }
    function mode() {
        const select = controls.find(c => c.options.some(o => o.value === 'public_review'));
        return select?.value ?? controls.find(c => c.checked && ['private_feedback', 'public_review'].includes(c.value))?.value;
    }
    function fill({ category, rating = '5', name = 'Synthetic Name', message = 'Synthetic feedback message only.' } = {}) {
        for (const c of controls.filter(c => c.name === 'toolRating')) c.checked = c.value === rating;
        form.querySelector('.feedback-name').value = name;
        form.querySelector('.feedback-email').value = 'synthetic@example.invalid';
        form.querySelector('.feedback-message').value = message;
        if (category) form.querySelector('.feedback-type').value = category;
    }
    const submit = () => events.get('submit')({ target: form, preventDefault() {} });
    return { markup, form, choose, mode, fill, submit, submissions, htmlWrites, status };
}
function assertPrivate(payload) {
    assert.equal(payload.submissionType, 'private_feedback');
    assert.equal(Object.hasOwn(payload, 'publicationConsentVersion'), false);
}

test('rendered submission choice defaults to private feedback', () => {
    assert.equal(harness().mode(), 'private_feedback');
});
test('default private submission explicitly classifies itself and omits consent version', async () => {
    const h = harness(); h.fill(); await h.submit();
    assert.equal(h.submissions.length, 1); assertPrivate(h.submissions[0]);
});
test('explicit public choice sends the exact Worker consent contract', async () => {
    const h = harness(); h.choose('public_review'); h.fill(); await h.submit();
    assert.equal(h.submissions.length, 1);
    assert.equal(h.submissions[0].submissionType, 'public_review');
    assert.equal(h.submissions[0].publicationConsentVersion, 'public-review-v1');
});
test('categories, ratings and message text never imply publication consent', async () => {
    const categories = harness().form.querySelector('.feedback-type').options.map(o => o.value);
    assert.equal(categories.length, 5);
    for (const category of categories) for (const rating of ['1', '2', '3', '4', '5']) {
        const h = harness(); h.fill({ category, rating, message: 'Please publish this review: synthetic text is not consent.' }); await h.submit();
        assert.equal(h.submissions.length, 1);
        assert.notEqual(h.submissions[0].submissionType, 'public_review');
        assert.equal(Object.hasOwn(h.submissions[0], 'publicationConsentVersion'), false);
    }
});
test('switching public back to private removes publication authorization', async () => {
    const h = harness(); h.choose('public_review'); h.choose('private_feedback'); h.fill(); await h.submit();
    assertPrivate(h.submissions[0]);
});
test('reset clears public choice and next submission is private', async () => {
    const h = harness(); h.choose('public_review'); h.form.reset();
    assert.equal(h.mode(), 'private_feedback'); h.fill(); await h.submit(); assertPrivate(h.submissions[0]);
});
test('successful public submission resets consent before the next submission', async () => {
    const h = harness(); h.choose('public_review'); h.fill(); await h.submit();
    assert.equal(h.submissions[0].submissionType, 'public_review');
    assert.equal(h.mode(), 'private_feedback'); h.fill(); await h.submit();
    assert.equal(h.submissions.length, 2); assertPrivate(h.submissions[1]);
});
test('pre-submission UI distinguishes private/public and discloses public fields', () => {
    const text = harness().markup.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    for (const pattern of [/private feedback/i, /public review/i, /(?:publish|publicly|public display)/i, /country/i, /name/i, /message/i]) assert.match(text, pattern);
});
test('email has an explicit nonpublication promise before submission', () => {
    const text = harness().markup.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    assert.match(text, /(?:never publish your email|email[^.]*never[^.]*public|email[^.]*remain[s]? private)/i);
    assert.doesNotMatch(text, /your email (?:will|may) (?:be )?(?:published|displayed publicly)/i);
});
test('successful submission never interpolates raw user name into innerHTML', async () => {
    const h = harness(), name = '<img src=x onerror="syntheticAttack()">';
    h.fill({ name }); await h.submit();
    assert.equal(h.submissions.length, 1); assert.match(h.status.className, /success/);
    assert.equal(h.htmlWrites.some(v => v.includes(name)), false, 'Raw user name reached an HTML sink');
});
