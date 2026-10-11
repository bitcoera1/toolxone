'use strict';
// Actual registry/renderers/integration/schema; synthetic DOM, no Git/network/writes.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const generator = require('../scripts/generate-static-articles.cjs');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const key = 'bmr-calculator';
const mapping = {file: 'bmr-calculator.html', key, selector: '#financeInfo'};
const referenceURL = 'https://pubmed.ncbi.nlm.nih.gov/2305711/';
const referenceTitle = "Mifflin et al. (1990) — A new predictive equation for resting energy expenditure in healthy individuals";
const description = "Estimate resting energy expenditure (REE) from age, sex, height and weight using the Mifflin–St Jeor equation. This calculator labels the estimate BMR.";
const disclosure = "The BMR-labelled result predicts resting energy expenditure (REE). It is not a laboratory measurement, total daily energy expenditure or a recommended calorie intake.";
const expectedFAQ = [
    {
        "question": "What does BMR stand for?",
        "answer": "BMR stands for Basal Metabolic Rate. This calculator uses that familiar label for a Mifflin–St Jeor prediction of resting energy expenditure (REE), rather than a direct measurement of basal metabolism."
    },
    {
        "question": "How is this calculator’s result calculated?",
        "answer": "It uses age, sex, height and weight in the simplified Mifflin–St Jeor equations to predict resting energy expenditure in calories per day."
    },
    {
        "question": "What is the Mifflin–St Jeor equation?",
        "answer": "It is a predictive equation for resting energy expenditure. The original study compared equation predictions with resting energy expenditure measured by indirect calorimetry."
    },
    {
        "question": "What is the formula for the male selection?",
        "answer": "REE = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + 5. The calculator displays this predicted REE under the BMR label."
    },
    {
        "question": "What is the formula for the female selection?",
        "answer": "REE = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) − 161. The calculator displays this predicted REE under the BMR label."
    },
    {
        "question": "Is this result the same as total daily calorie needs?",
        "answer": "No. It predicts resting energy expenditure. Total daily energy expenditure also includes physical activity and the energy used to process food; this calculator does not calculate that total."
    },
    {
        "question": "Can I calculate the estimate using metric or imperial units?",
        "answer": "Yes. Metric mode accepts centimeters and kilograms. Feet / Pounds mode accepts feet, inches and pounds, then converts them to centimeters and kilograms before applying the equation."
    },
    {
        "question": "Can people with similar inputs have different measured results?",
        "answer": "Yes. People with similar age, sex, height and weight can have different measured resting energy expenditure. The equation does not capture every individual difference."
    },
    {
        "question": "How accurate is this estimate?",
        "answer": "It is a prediction rather than a laboratory measurement or an exact individual metabolic requirement. An individual’s measured resting energy expenditure can differ from the calculated value."
    },
    {
        "question": "Does this result prescribe calorie intake or a weight-loss plan?",
        "answer": "No. Predicted resting energy expenditure alone does not determine appropriate calorie intake or prescribe a weight-management plan. This calculator does not provide individualized dietary advice."
    },
    {
        "question": "What ages does the calculator accept, and what ages were studied?",
        "answer": "The software accepts ages 18–120. The original Mifflin study reported 498 healthy participants aged 19–78. Software acceptance does not establish validation across the entire accepted range, and this is not a pediatric energy-needs calculator."
    },
    {
        "question": "Does this calculator directly measure metabolism or diagnose a condition?",
        "answer": "No. It predicts resting energy expenditure from the entered measurements. It does not directly measure metabolism or diagnose a medical condition."
    }
];
function visible(html) {
    return html.replace(/<[^>]*>/g, ' ')
        .replace(/&#039;|&#39;/g, "'").replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ').trim();
}
function includesAll(text, values) {
    for (const value of values) assert.ok(text.includes(value), 'Missing: ' + value);
}
function count(text, value) { return text.split(value).length - 1; }
function harness(initialArticle = '') {
    class Element {
        constructor(html = '') { this.innerHTML = html; this.classList = { add() {} }; }
        querySelectorAll() { return []; }
    }
    const target = new Element(initialArticle), faqTarget = new Element(), heroTarget = new Element();
    let schema;
    const context = {
        HTMLElement: Element,
        document: {
            body: { dataset: { tool: key } },
            querySelector(selector) { return ({ '#financeInfo': target, '#healthFAQ': faqTarget })[selector] || null; },
            getElementById(id) { return id === 'toolHero' ? heroTarget : null; }
        },
        console: { info() {}, log() {}, warn() {}, error() {}, debug() {} },
        addEventListener() {},
        fetch() { throw new Error('Network forbidden'); },
        ToolXoneSchemaRegistry: { register(id, value) { assert.equal(id, 'BMRCalculator'); assert.equal(schema, undefined); schema = value; } }
    };
    context.window = context;
    vm.createContext(context);
    for (const file of [
        'js/content/content-registry.js', 'js/content/content-data-health.js',
        'js/content/article-renderer.js', 'js/content/faq-renderer.js',
        'js/content/hero-renderer.js', 'js/content/content-integration-engine.js',
        'js/seo/schemas/bmr-calculator-schema.js'
    ]) vm.runInContext(read(file), context, { filename: file, timeout: 2000 });
    const integration = context.ToolXoneContentIntegrationEngine;
    integration.modules.registry = context.ToolXoneContentRegistry;
    integration.modules.articleRenderer = context.ToolXoneArticleRenderer;
    integration.modules.faqRenderer = context.ToolXoneFAQRenderer;
    const targets = integration.getRenderTargets(key);
    const content = integration.getContent(key);
    assert.ok(content.article);
    assert.ok(schema);
    return {
        article: content.article, schema, target, targets,
        faq: JSON.parse(JSON.stringify(context.ToolXoneContentRegistry.get('faq', key))),
        render() {
            assert.equal(integration.renderArticle(content.article, targets.article), true);
            return target.innerHTML;
        },
        renderFAQ() {
            assert.equal(integration.renderFAQ(content.faq, targets.faq), true);
            return faqTarget.innerHTML;
        },
        renderHero() {
            assert.equal(context.ToolXoneHeroRenderer.render(key), true);
            return heroTarget.innerHTML;
        }
    };
}


test('Real rendered BMR article preserves formulas, units, conversions and numerical example', () => {
    const html = harness().render(); assert.equal(generator.validateOutput(html), html);
    includesAll(visible(html), [
        'REE = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + 5',
        'REE = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) − 161',
        '30-year-old man who weighs 70 kg and is 175 cm tall',
        'REE = (10 × 70) + (6.25 × 175) − (5 × 30) + 5',
        'approximately 1,649 calories per day', '2.54 centimeters per inch',
        '0.45359237 kilograms per pound', 'Metric mode accepts kilograms and centimeters directly'
    ]);
    assert.doesNotMatch(html, /undefined|\[object Object\]/);
});
test('Interpretation distinguishes predicted REE, BMR naming and non-prescriptive limitations', () => {
    includesAll(visible(harness().render()), [
        'implements the Mifflin–St Jeor prediction equation for resting energy expenditure (REE)',
        'presents it under the familiar BMR label; it does not measure either value directly',
        'not a laboratory measurement, an exact individual metabolic requirement, total daily energy expenditure or a recommended calorie intake',
        'Two people with similar characteristics can still have different actual energy requirements',
        'Actual resting energy expenditure can differ from the calculated value because individual physiology and other factors vary',
        'does not calculate total daily energy expenditure, diagnose a condition, determine appropriate calorie intake or prescribe a weight-management plan',
        'BMR alone does not determine whether a person will gain, maintain or lose weight',
        'Physical activity, food intake, body composition and other factors also influence overall energy balance'
    ]);
});
test('Study population and software acceptance are explicitly distinguished', () => {
    includesAll(visible(harness().render()), [
        'software accepts ages 18–120', '498 healthy participants aged 19–78',
        'Acceptance of an age by the calculator does not establish that the equation was validated for that age or population',
        'not a pediatric energy-needs calculator'
    ]);
});
test('Exactly one methodology reference has the approved raw destination and title', () => {
    const html = harness().render();
    const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    assert.deepEqual(links.map(m => m[1]), [referenceURL]);
    assert.deepEqual(links.map(m => visible(m[2])), [referenceTitle]);
    assert.doesNotMatch(links[0][1], /[\[\]()]/);
    includesAll(visible(html), ['simplified sex-specific REE equations', 'REE measured by indirect calorimetry',
        'Citing the publication identifies the methodology; it does not imply endorsement of ToolXone']);
    assert.ok(html.indexOf('Methodology and Reference') > html.indexOf('Who Can Use This BMR Calculator?'));
});
test('Twelve unique visible/schema FAQs match independently frozen exact text and order', () => {
    const h = harness(), schemaFAQ = JSON.parse(JSON.stringify(h.schema.schema.faq));
    assert.equal(h.faq.length, 12); assert.equal(schemaFAQ.length, 12);
    assert.equal(new Set(h.faq.map(f => f.question)).size, 12);
    assert.equal(new Set(schemaFAQ.map(f => f.question)).size, 12);
    assert.deepEqual(h.faq, expectedFAQ); assert.deepEqual(schemaFAQ, expectedFAQ);
    const output = h.renderFAQ();
    assert.equal((output.match(/<details\s+class="toolxone-faq-item"/g) || []).length, 12);
    let previous = -1;
    for(const item of expectedFAQ) {
        const text = visible(output), position = text.indexOf(item.question);
        assert.ok(position > previous); previous = position;
        assert.equal(count(text, item.question), 1); assert.equal(count(text, item.answer), 1);
    }
});
test('Actual hero renders Predicted / REE using existing statistics model', () => {
    const html = harness().renderHero();
    assert.match(html, /<strong>\s*Predicted\s*<\/strong>\s*<span>\s*REE\s*<\/span>/);
    assert.ok(visible(html).includes(description));
    assert.doesNotMatch(visible(html), /High\s+Accuracy/);
    assert.doesNotMatch(html, /undefined|\[object Object\]/);
});
test('Existing BMR integration mapping uses the authored healthFAQ target successfully', () => {
    const page = read(mapping.file), h = harness();
    assert.equal(h.targets.article, '#financeInfo'); assert.equal(h.targets.faq, '#healthFAQ');
    assert.equal(h.targets.related, '#relatedTools');
    assert.equal((page.match(/\bid="healthFAQ"/g) || []).length, 1);
    assert.doesNotMatch(page, /\bid="financeFAQ"/);
    assert.ok(h.renderFAQ().includes('What does BMR stand for?'));
});
test('Authored subtitle and permanent disclosure sit outside generated content and after explanation', () => {
    const page = read(mapping.file), bounds = generator.region(page, mapping);
    const authored = page.slice(0,bounds.start) + page.slice(bounds.end);
    assert.match(authored, /<p class="tool-subtitle">[\s\S]*?<\/p>/);
    assert.equal(count(visible(authored), description), 1);
    assert.equal(count(authored, disclosure), 1);
    assert.match(authored, /id="bmrExplanation"[\s\S]*?<\/div>\s*<p>The BMR-labelled result predicts resting energy expenditure \(REE\)\. It is not a laboratory measurement, total daily energy expenditure or a recommended calorie intake\.<\/p>/);
});
test('Static article matches independent actual rendering with only page EOL conversion', () => {
    const page = read(mapping.file), bounds = generator.region(page, mapping);
    const eol = generator.eol(page, mapping, bounds);
    assert.equal(page.slice(bounds.start,bounds.end), harness().render().replace(/\r\n/g,'\n').replace(/\n/g,eol));
});
test('Runtime replaces pre-populated static article and repeated rendering leaves one wrapper', () => {
    const page = read(mapping.file), bounds = generator.region(page, mapping);
    const h = harness(page.slice(bounds.start,bounds.end));
    const first = h.render(), second = h.render(); assert.equal(second, first);
    assert.equal(count(second, 'class="tool-article"'), 1);
    assert.equal(count(second, 'What Is BMR and How Is Basal Metabolic Rate Calculated?'), 1);
    assert.equal(count(second, 'Methodology and Reference'), 1);
});
function noAffirmativeAuthority(text) {
    const cleaned = text.replace(/\bdoes not imply endorsement\b/gi, '')
        .replace(/\bnot (?:a )?guaranteed[- ]accuracy(?: specification)?\b/gi, '')
        .replace(/\bdoes not provide individualized dietary advice\b/gi, '')
        .replace(/\bnot endorsed by\b/gi, '');
    assert.doesNotMatch(cleaned, /\bHigh\s+Accuracy\b|\bguaranteed[- ]accuracy\b|\b(?:provides?|offers?|is) (?:a )?(?:medical )?diagnosis\b|\b(?:provides?|offers?) (?:personalized|individualized) (?:dietary advice|calorie prescription)\b|\b(?:endorsed|approved) by (?:Mifflin|St Jeor|NIH|NLM)\b|\bimplies? endorsement\b/i);
}
test('Authority guard rejects affirmative claims while permitting explicit disclaimers', () => {
    for(const text of ['High Accuracy', 'Guaranteed accuracy.', 'Provides a medical diagnosis.',
        'Provides individualized calorie prescription.', 'Endorsed by Mifflin.', 'Implies endorsement.'])
        assert.throws(() => noAffirmativeAuthority(text), assert.AssertionError);
    for(const text of ['Not a guaranteed accuracy specification.', 'Does not imply endorsement.',
        'Does not provide individualized dietary advice.', 'Not endorsed by Mifflin.',
        'It does not directly measure metabolism or diagnose a medical condition.'])
        assert.doesNotThrow(() => noAffirmativeAuthority(text));
});
test('Actual article, FAQ, hero and schema avoid prohibited affirmative authority claims', () => {
    const h = harness(); noAffirmativeAuthority([visible(h.render()), visible(h.renderFAQ()), visible(h.renderHero()),
        JSON.stringify(h.schema)].join(' '));
    assert.ok(!h.schema.meta.basic.keywords.includes('calorie needs calculator'));
});
// Independently obtained from git show 3f88026:<path> during preparation only.
// Normal execution reads local files and normalizes only CRLF for frozen comparison.
const baselines = [
    ['js/bmr.js', '3a7da42e6457c99fdcb2d72862f929dfba6662a2c7ca904cabbac43e79783a60'],
    ['tests/bmr.test.cjs', '1b8c05d191e9d59ca3579ff5268a128ecbfc5e130dc3469ef435f67bffeb45bc']
];
for(const [file, expected] of baselines) test('Correctness baseline unchanged from 3f88026: ' + file, () => {
    assert.equal(crypto.createHash('sha256').update(read(file).replace(/\r\n/g,'\n')).digest('hex'), expected);
});
