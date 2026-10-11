'use strict';
// Actual registry, renderers, integration and schema; synthetic DOM only.
// No writes, subprocesses, Git, network, or production access during tests.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const generator = require('../scripts/generate-static-articles.cjs');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const key = 'bmi-calculator';
const mapping = { file: 'bmi-calculator.html', key, selector: '#financeInfo' };
const referenceURLs = [
    'https://www.cdc.gov/bmi/faq/',
    'https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html',
    'https://wwwn.cdc.gov/nchs/data/nhanes/public/2019/manuals/2020-Anthropometry-Procedures-Manual-508.pdf'
];
const referenceTitles = [
    'CDC — BMI Frequently Asked Questions',
    'CDC — Adult BMI Categories',
    'CDC/NCHS — NHANES Anthropometry Procedures Manual, January 2020'
];
const population = 'The BMI ranges shown here are intended for adults ages 20 and older. People ages 2–19 require age- and sex-specific BMI interpretation.';
const placeholder = 'Your BMI range and information will appear here.';
const limitations = 'BMI uses only height and weight. It does not distinguish between body fat, muscle, bone and other components of body mass. As a result, two adults with the same height and weight can have the same BMI while having different body compositions. BMI also does not directly measure fitness, nutrition, body-fat distribution or overall health. For these reasons, the result should be treated as a screening value rather than a diagnosis or complete health assessment.';
const expectedFAQ = [
    ['What is BMI?', "BMI stands for Body Mass Index. It is a screening measure calculated from a person's height and weight and is commonly used to group adult BMI values into ranges."],
    ['How is BMI calculated?', 'In metric units, BMI is calculated by dividing weight in kilograms by height in meters squared. In imperial units, weight in pounds is divided by height in inches squared and the result is multiplied by 703. The factor 703 is the conventional rounded conversion factor.'],
    ['What are the adult BMI ranges?', 'The ranges used by this calculator are below 18.5 for underweight, 18.5 to below 25 for the healthy weight range, 25 to below 30 for overweight, and 30 or higher for the obesity range. These categories are intended for adults ages 20 and older and do not by themselves determine overall health.'],
    ['Can I calculate BMI using feet and pounds?', "Yes. ToolXone's BMI Calculator supports both metric units using centimeters and kilograms and imperial units using feet, inches and pounds."],
    ['Does BMI directly measure body fat?', 'No. BMI is calculated from height and weight and does not directly measure body fat or distinguish between fat, muscle, bone and other components of body composition.'],
    ['Is BMI the same as a medical diagnosis?', "No. BMI is a screening measure and does not diagnose a medical condition or determine a person's overall health."],
    ['Can people with the same BMI have different body compositions?', 'Yes. Two people with the same BMI can have different amounts of muscle, body fat and other body composition characteristics because BMI uses only height and weight.'],
    ['Is this BMI Calculator intended for adults?', 'Yes. Its displayed categories are intended for adults ages 20 and older. People ages 2–19 require age- and sex-specific BMI-for-age interpretation, which this calculator does not provide.'],
    ['Why can the displayed BMI appear inconsistent with its category?', 'Categories use the unrounded BMI; the displayed number is rounded to one decimal place. For example, 24.96 displays as 25.0 but remains below the category boundary of 25.'],
    ['How should I measure height and weight?', 'Measure height without shoes, standing upright with feet flat and looking straight ahead. For weight, remove shoes, stand centrally on the scale with hands at your sides, and wait for a stable reading. Use the measurement units shown beside the inputs.']
].map(([question, answer]) => ({ question, answer }));
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
            querySelector(selector) { return ({ '#financeInfo': target, '#financeFAQ': faqTarget })[selector] || null; },
            getElementById(id) { return id === 'toolHero' ? heroTarget : null; }
        },
        console: { info() {}, log() {}, warn() {}, error() {}, debug() {} },
        addEventListener() {},
        fetch() { throw new Error('Network forbidden'); },
        ToolXoneSchemaRegistry: { register(id, value) { assert.equal(id, 'BMICalculator'); assert.equal(schema, undefined); schema = value; } }
    };
    context.window = context;
    vm.createContext(context);
    for (const file of [
        'js/content/content-registry.js', 'js/content/content-data-bmi.js',
        'js/content/article-renderer.js', 'js/content/faq-renderer.js',
        'js/content/hero-renderer.js', 'js/content/content-integration-engine.js',
        'js/seo/schemas/bmi-calculator-schema.js'
    ]) vm.runInContext(read(file), context, { filename: file, timeout: 2000 });
    const integration = context.ToolXoneContentIntegrationEngine;
    integration.modules.registry = context.ToolXoneContentRegistry;
    integration.modules.articleRenderer = context.ToolXoneArticleRenderer;
    integration.modules.faqRenderer = context.ToolXoneFAQRenderer;
    const content = integration.getContent(key);
    assert.ok(content.article);
    assert.ok(schema);
    return {
        article: content.article, schema, target,
        faq: JSON.parse(JSON.stringify(context.ToolXoneContentRegistry.get('faq', key))),
        render() {
            assert.equal(integration.renderArticle(content.article, '#financeInfo'), true);
            return target.innerHTML;
        },
        renderFAQ() {
            assert.equal(integration.renderFAQ(content.faq, '#financeFAQ'), true);
            return faqTarget.innerHTML;
        },
        renderHero() {
            assert.equal(context.ToolXoneHeroRenderer.render(key), true);
            return heroTarget.innerHTML;
        }
    };
}

test('Actual BMI article rendering preserves formulas, numerical example and adult thresholds', () => {
    const h = harness(), html = h.render(), text = visible(html);
    assert.equal(generator.validateOutput(html), html);
    includesAll(text, [
        'BMI = weight (kg) ÷ height² (m²)',
        'BMI = 70 ÷ (1.75 × 1.75) ≈ 22.9',
        'converts the entered height to meters',
        'BMI = [weight (lb) ÷ height² (in²)] × 703',
        'converts the height to total inches',
        'Underweight — Below 18.5', 'Healthy Weight Range — 18.5 to below 25',
        'Overweight — 25 to below 30', 'Obesity Range — 30 or higher'
    ]);
    assert.doesNotMatch(html, /undefined|\[object Object\]/);
});

test('Rendered interpretation uses the 20+ convention and excludes pediatric interpretation', () => {
    const text = visible(harness().render());
    includesAll(text, [
        'CDC convention for adults ages 20 and older',
        'screening categories for adults ages 20 and older',
        'For people ages 2–19, BMI requires interpretation relative to age and sex using BMI-for-age percentiles',
        'This calculator does not provide that interpretation',
        '“Healthy Weight Range” names a BMI category; it does not establish that an individual is healthy'
    ]);
});

test('Rendered methodology distinguishes unrounded categories, one-decimal display and 703 approximation', () => {
    const text = visible(harness().render());
    includesAll(text, [
        'The category is determined from the unrounded BMI',
        'the displayed number is rounded to one decimal place',
        'BMI 24.96 displays as 25.0 but remains in the Healthy Weight Range',
        '703 is the conventional rounded conversion factor',
        'approximately the same BMI', 'rounding the entered measurements',
        'Very near a category boundary, those differences can place the results in different categories',
        "If you need to convert a weight measurement before using a calculator, ToolXone's Weight Converter can help convert between common weight units."
    ]);
});

test('Rendered measurement guidance is practical and appears before usage instructions', () => {
    const html = harness().render(), text = visible(html);
    includesAll(text, [
        'Measure without shoes, standing upright with both feet flat and weight evenly distributed',
        'Look straight ahead', 'remove anything on top of your head that interferes with the measurement',
        'horizontal headpiece resting on top of the head',
        'Stand centrally on the scale with your hands at your sides',
        'wait until the reading is stable', 'Enter height and weight in the units shown beside the selected inputs'
    ]);
    assert.ok(html.indexOf('Measuring Height and Weight') < html.indexOf('How to Use the BMI Calculator'));
    assert.doesNotMatch(text, /reproduces the full NHANES|full NHANES examination protocol/i);
});

test('Existing supported BMI limitations remain intact in generated output', () => {
    const text = visible(harness().render());
    assert.equal(count(text, limitations), 1);
    includesAll(text, [
        'BMI does not directly measure body fat',
        'same BMI value can occur in people with different body compositions',
        'Avoid interpreting the number as a complete description of health, fitness or body composition'
    ]);
});

test('Rendered sources contain exactly the three approved raw URLs and titles in order', () => {
    const html = harness().render();
    const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    assert.deepEqual(links.map(m => m[1]), referenceURLs);
    assert.deepEqual(links.map(m => visible(m[2])), referenceTitles);
    for (const link of links) assert.doesNotMatch(link[1], /[\[\]()]/);
    assert.ok(html.includes('These sources support the BMI formulas, adult screening categories, interpretation and measurement guidance described above. Their inclusion does not imply endorsement of ToolXone.'));
    assert.doesNotMatch(html, /href="https:\/\/www\.cdc\.gov\/bmi\/about\//);
    assert.ok(html.indexOf('Methodology and Sources') > html.indexOf('How to Interpret Your BMI Estimate'));
});

test('Ten unique visible FAQs and ten schema FAQs match frozen questions and answers exactly', () => {
    const h = harness();
    const schemaFAQ = JSON.parse(JSON.stringify(h.schema.schema.faq));
    assert.equal(h.faq.length, 10);
    assert.equal(schemaFAQ.length, 10);
    assert.equal(new Set(h.faq.map(f => f.question)).size, 10);
    assert.equal(new Set(schemaFAQ.map(f => f.question)).size, 10);
    assert.deepEqual(h.faq, expectedFAQ);
    assert.deepEqual(schemaFAQ, expectedFAQ);
    const output = h.renderFAQ(), text = visible(output);
    assert.equal((output.match(/<details\s+class="toolxone-faq-item"/g) || []).length, 10);
    for (const item of expectedFAQ) {
        assert.equal(count(text, item.question), 1);
        assert.equal(count(text, item.answer), 1);
    }
});

test('Actual hero renderer displays Screening / Measure instead of High / Accuracy', () => {
    const html = harness().renderHero();
    assert.match(html, /<strong>\s*Screening\s*<\/strong>\s*<span>\s*Measure\s*<\/span>/);
    assert.doesNotMatch(visible(html), /High\s+Accuracy|\bAccuracy\b/);
    assert.doesNotMatch(html, /\[object Object\]|undefined/);
});

test('Authored HTML has exact neutral placeholder and population wording before calculator inputs', () => {
    const html = read(mapping.file), region = generator.region(html, mapping);
    const authored = html.slice(0, region.start) + html.slice(region.end);
    assert.equal(count(authored, '<p>' + population + '</p>'), 1);
    assert.equal(count(authored, placeholder), 1);
    assert.match(authored, /<p class="bmi-advice" id="bmiAdvice">\s*Your BMI range and information will appear here\.\s*<\/p>/);
    assert.ok(authored.indexOf(population) > authored.indexOf('class="tool-subtitle"'));
    assert.ok(authored.indexOf(population) < authored.indexOf('<h2>Check Your BMI</h2>'));
    assert.doesNotMatch(authored, /Your health category and advice will appear here\.|<input\b[^>]*\bid=["']age["']/);
});

test('Static BMI article matches independent real rendering with only page EOL conversion', () => {
    const output = harness().render(), html = read(mapping.file);
    const region = generator.region(html, mapping), eol = generator.eol(html, mapping, region);
    const actual = html.slice(region.start, region.end);
    assert.equal(actual, output.replace(/\r\n/g, '\n').replace(/\n/g, eol),
        'Regenerate the BMI static article from its authored source before running this test');
    assert.equal(count(actual, 'class="tool-article"'), 1);
});

test('Integration replaces a pre-populated static target and repeated rendering never appends articles', () => {
    const page = read(mapping.file), region = generator.region(page, mapping);
    const h = harness(page.slice(region.start, region.end));
    const first = h.render(), second = h.render();
    assert.equal(second, first);
    assert.equal(h.target.innerHTML, first);
    assert.equal(count(second, 'class="tool-article"'), 1);
    assert.equal(count(second, 'How BMI Is Calculated and What Your Result Means'), 1);
    assert.equal(count(second, 'Methodology and Sources'), 1);
});

function assertNoAffirmativeAuthority(text) {
    // Allow explicit negation, not an unqualified claim containing these terms.
    const cleaned = text
        .replace(/\b(?:not|no)\s+(?:a\s+)?(?:medical\s+)?diagnosis\b/gi, '')
        .replace(/\b(?:not|no)\s+(?:a\s+)?guaranteed[- ]accuracy(?: specification)?\b/gi, '')
        .replace(/\b(?:does not|doesn't)\s+(?:provide|offer)\s+personalized[- ](?:medical[- ]|health[- ])?advice\b/gi, '')
        .replace(/\b(?:does not imply|doesn't imply|no)\s+endorsement\b/gi, '')
        .replace(/\bnot\s+endorsed by\b/gi, '');
    assert.doesNotMatch(cleaned, /\b(?:provides?|offers?|delivers?|is)\s+(?:a\s+)?(?:medical\s+)?diagnosis\b|\bguaranteed[- ]accuracy\b|\bpersonalized[- ](?:medical[- ]|health[- ])?advice\b|\b(?:endorsed|approved) by (?:the )?(?:CDC|NIH|WHO|NCHS)\b|\b(?:CDC|NIH|WHO|NCHS)[- ](?:endorsed|approved)\b|\bimplies? endorsement\b/i);
}

test('Authority assertion rejects affirmative claims and permits explicit negative disclaimers', () => {
    for (const text of [
        'BMI provides a medical diagnosis.', 'Guaranteed accuracy.',
        'Personalized medical advice.', 'Endorsed by CDC.', 'CDC-approved.',
        'Their inclusion implies endorsement.'
    ]) assert.throws(() => assertNoAffirmativeAuthority(text), assert.AssertionError);
    for (const text of [
        'BMI is not a diagnosis.', 'Not a guaranteed accuracy specification.',
        'This calculator does not provide personalized medical advice.',
        'Their inclusion does not imply endorsement.', 'Not endorsed by CDC.'
    ]) assert.doesNotThrow(() => assertNoAffirmativeAuthority(text));
});

test('Actual visible content, FAQs, hero and schema contain no prohibited affirmative authority claims', () => {
    const h = harness();
    const text = [visible(h.render()), visible(h.renderFAQ()), visible(h.renderHero()),
        ...h.schema.schema.faq.map(f => f.question + ' ' + f.answer),
        JSON.stringify(h.schema.meta), h.schema.schema.application.description].join(' ');
    assertNoAffirmativeAuthority(text);
    assert.doesNotMatch(text, /High\s+Accuracy/);
});

// Frozen from read-only git show e587ce1:<path>, not computed from production code.
// Git blobs use LF; existing Windows checkout bytes were also frozen before this edit.
// tests/bmi.test.cjs already had one CRLF among LF lines; no file was normalized.
// Check both the exact approved checkout bytes and independently frozen commit content.
const baselineHashes = [
    {
        file: 'js/bmi.js',
        commit: '73f80b5faa04344dcdf61029b137dc928442827888290fdc3562de57b81e1033',
        approvedCheckout: '34cb7377d7ed3fc2c77c88994e45edb320db1a91e1ae35eecbaf32fbe9ee9458'
    },
    {
        file: 'tests/bmi.test.cjs',
        commit: '6efceaa3a3807b01cbe60d52dff99d3006ba900c7b8156d91687e1b2bed88899',
        approvedCheckout: '7a9f1ae9c704d57fc09c4c328f4f0a3144becc9d752e0c3666b57c7f42c92c53'
    }
];
for (const baseline of baselineHashes) test('Correctness baseline bytes remain unchanged: ' + baseline.file, () => {
    const bytes = fs.readFileSync(path.join(root, baseline.file));
    const hash = value => crypto.createHash('sha256').update(value).digest('hex');
    // Accept the unchanged approved checkout or the exact original commit blob.
    assert.ok([baseline.commit, baseline.approvedCheckout].includes(hash(bytes)),
        'File bytes differ from both frozen e587ce1 and approved pre-milestone checkout');
    assert.equal(hash(Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n'), 'utf8')), baseline.commit,
        'Content differs from the independently retrieved e587ce1 baseline');
});
