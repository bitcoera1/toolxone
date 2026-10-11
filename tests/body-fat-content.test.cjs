'use strict';
// Real registry/renderer/integration; synthetic DOM only. Never writes or uses a network.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const generator = require('../scripts/generate-static-articles.cjs');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const key = 'body-fat-calculator';
const referenceURLs = [
    'https://escholarship.org/content/qt9451r851/qt9451r851.pdf',
    'https://www.mynavyhr.navy.mil/Portals/55/Support/Culture%20Resilience/Physical/Guide%204%20-%20Body%20Composition%20Assessment.pdf?ver=E7NbYxxBqU4PkbWxQqnglQ%3D%3D',
    'https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2022.868627/full'
];
function harness() {
    class Element {
        constructor() { this.innerHTML = ''; this.classList = { add() {} }; }
    }
    const target = new Element();
    let pageSchema;
    const context = {
        HTMLElement: Element,
        document: { querySelector(selector) { return selector === '#financeInfo' ? target : null; } },
        console: { info() {}, log() {}, warn() {}, error() {}, debug() {} },
        addEventListener() {},
        fetch() { throw new Error('Network forbidden'); },
        ToolXoneSchemaRegistry: { register(id, value) { assert.equal(id, 'BodyFatCalculator'); pageSchema = value; } }
    };
    context.window = context;
    vm.createContext(context);
    for (const file of [
        'js/content/content-registry.js',
        'js/content/content-data-health.js',
        'js/content/article-renderer.js',
        'js/content/content-integration-engine.js',
        'js/seo/schemas/body-fat-calculator-schema.js'
    ]) vm.runInContext(read(file), context, { filename: file, timeout: 2000 });
    const integration = context.ToolXoneContentIntegrationEngine;
    integration.modules.registry = context.ToolXoneContentRegistry;
    integration.modules.articleRenderer = context.ToolXoneArticleRenderer;
    const article = integration.getContent(key).article;
    assert.ok(article);
    return {
        article, registry: context.ToolXoneContentRegistry, schema: pageSchema,
        render() {
            assert.equal(integration.renderArticle(article, '#financeInfo'), true);
            return target.innerHTML;
        }
    };
}
const visible = html => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
function includesAll(text, expected) {
    for (const value of expected) assert.ok(text.includes(value), 'Missing: ' + value);
}
function section(h, heading) {
    const item = h.article.sections.find(value => value.heading === heading);
    assert.ok(item, heading);
    return visible(item.content);
}

test('Real rendered Body Fat article identifies historical density method and exact formulas', () => {
    const h = harness(), html = h.render();
    assert.equal(generator.validateOutput(html), html);
    includesAll(visible(html), [
        'historical Hodgdon–Beckett circumference-based body-density equations published in 1984',
        'D = 1.0324 − 0.19077 × log10(A − N) + 0.15456 × log10(H)',
        'D = 1.29579 − 0.35004 × log10(W + P − N) + 0.22100 × log10(H)',
        'Estimated body fat (%) = 495 / D − 450',
        'All measurements below are in centimeters', 'base-10 logarithm',
        'D is expressed in g/cm³', 'The logarithm arguments must be positive',
        '0–70% output range; this software range is not a healthy-range recommendation',
        '1 inch = 2.54 centimeters', 'It does not apply military half-inch rounding'
    ]);
    assert.match(section(h, 'Calculation Formulas'), /Siri conversion, applied separately/);
    assert.doesNotMatch(html, /undefined|\[object Object\]/);
});

test('Real rendered measurement instructions distinguish male abdomen from female waist and hips', () => {
    const h = harness(); h.render();
    const male = section(h, 'Measurements Needed for Men');
    const female = section(h, 'Measurements Needed for Women');
    for (const text of [male, female]) includesAll(text, [
        'without shoes', 'head level and looking forward',
        'just below the larynx (Adam’s apple), not over it',
        'perpendicular to the neck’s long axis', 'shoulders relaxed',
        'avoid including the shoulder muscles', 'as close to horizontal as anatomically feasible'
    ]);
    includesAll(male, ['field labelled Waist', 'at the level of the navel', 'normal, relaxed exhalation', 'without drawing in your abdomen']);
    includesAll(female, ['narrowest abdominal circumference', 'lower end of the breastbone', 'arms at your sides',
        'normal, relaxed exhalation', 'greatest protrusion of the buttocks', 'Avoid shaping or compressive clothing']);
    includesAll(section(h, 'How to Measure Your Waist and Neck'), ['non-stretch tape', 'without compressing the skin',
        'Repeat measurements', 'same sites and technique', 'without military rounding']);
});

test('Real rendered limitations and interpretation avoid medical and military authority claims', () => {
    const h = harness(), text = visible(h.render());
    includesAll(text, [
        'Body weight is not an input to these equations; the displayed weight fields do not affect the result',
        'not endorsed by the U.S. Navy, Department of Defense, or the cited authors or institutions',
        'does not implement a current military qualification assessment',
        'Tape placement, tension, posture and breathing', 'body shape, fat distribution',
        'two-compartment density model', 'The displayed decimal place does not establish the estimate’s accuracy',
        'does not assign a body-fat category', 'not a health classification, athletic-status assessment, recommended target',
        'adult informational use', 'developed using military samples',
        'does not establish their suitability for children, pregnancy, or clinical decision-making'
    ]);
    assert.doesNotMatch(text.replaceAll('not a guaranteed accuracy specification for ToolXone', ''), /Essential Fat|Athletes|Above Average|military-approved|guaranteed accuracy/i);
});

test('Rendered references contain exactly the three approved destinations and historical attribution', () => {
    const h = harness(), html = h.render();
    const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    assert.deepEqual(links.map(match => match[1]), referenceURLs);
    includesAll(visible(html), [
        'Zhang, Huizenga, Arens and Yu (2001)',
        'Considering individual physiological differences in a human thermal model',
        'U.S. Navy, Guide 4: Body Composition Assessment, January 2024',
        'Circumference-Based Predictions of Body Fat Revisited: Preliminary Results From a US Marine Corps Body Composition Survey (2022)',
        'Hodgdon and Beckett (1984)', 'Report 84-11', 'Report 84-29',
        'Siri (1961), Body Composition from Fluid Spaces and Density: Analysis of Methods',
        'not a guaranteed accuracy specification for ToolXone'
    ]);
    assert.doesNotMatch(html, /UCSF|75d68933|original documents were directly inspected/i);
});

test('Visible registered FAQs and page schema remain exactly synchronized', () => {
    const h = harness();
    const faq = JSON.parse(JSON.stringify(h.registry.get('faq', key)));
    assert.deepEqual(JSON.parse(JSON.stringify(h.schema.schema.faq)), faq);
    assert.equal(faq.length, 20);
    assert.equal(new Set(faq.map(item => item.question)).size, faq.length);
    const answer = question => faq.find(item => item.question === question).answer;
    assert.equal(answer('How is body fat percentage calculated?'),
        'ToolXone uses the historical Hodgdon–Beckett body-density equations with centimeter measurements and base-10 logarithms, followed by the separate Siri conversion: body fat percentage = 495 / density − 450.');
    includesAll(answer('How should I measure my neck?'), ['just below the larynx', 'perpendicular', 'as close to horizontal as anatomically feasible']);
    includesAll(answer('How should I measure my waist for the calculator?'), ['For men', 'at the navel', 'For women', 'natural waist', 'normal, relaxed exhalation', 'without compressing the skin']);
    assert.equal(answer('Does this result determine a healthy range or military qualification?'),
        'No. ToolXone does not classify the estimate as a healthy range or determine military eligibility.');
    assert.equal(h.schema.meta.basic.keywords.includes('healthy body fat percentage'), false);
    const hero = h.registry.get('hero', key);
    assert.ok(hero.highlights.includes('Historical Circumference Method'));
    assert.equal(hero.highlights.includes('U.S. Navy Method'), false);
});

test('Authored calculator help discloses measurement sites and unused weight before inputs', () => {
    const html = read('body-fat-calculator.html');
    const help = 'Use abdominal circumference at the navel for men, and natural waist plus hip circumference for women. See the measurement instructions below. Weight does not affect this calculation.';
    assert.equal(html.split(help).length - 1, 1);
    assert.ok(html.indexOf(help) < html.indexOf('id="sex"'));
    assert.ok(html.indexOf(help) < html.indexOf('TOOLXONE:STATIC-ARTICLE:START'));
    assert.match(html, /id="bodyFatCategory"\s+class="result-category"/);
});

test('Generated Body Fat region equals independent real integration-rendered article after regeneration', () => {
    const h = harness(), output = h.render(), html = read('body-fat-calculator.html');
    const mapping = { file: 'body-fat-calculator.html', key, selector: '#financeInfo' };
    const region = generator.region(html, mapping);
    const eol = generator.eol(html, mapping, region);
    assert.equal(html.slice(region.start, region.end), output.replace(/\r\n/g, '\n').replace(/\n/g, eol),
        'Regenerate the static article from authored data before validating this assertion');
    assert.equal((html.slice(region.start, region.end).match(/class="tool-article"/g) || []).length, 1);
});

test('Runtime rendering replaces existing article rather than duplicating it', () => {
    const h = harness(), first = h.render(), second = h.render();
    assert.equal(second, first);
    assert.equal((second.match(/class="tool-article"/g) || []).length, 1);
    assert.equal(second.split('Methodology and Sources').length - 1, 1);
});

test('Body Fat registration/content remains byte-equivalent after line-ending normalization', () => {
    const source = read('js/content/content-data-health.js').replace(/\r\n/g, '\n');
    const start = source.indexOf('const BODY_FAT_CALCULATOR_CONTENT = {');
    const end = source.indexOf('/*=========================================================\n RELATED TOOLS — BMR CALCULATOR', start);
    assert.ok(start >= 0 && end > start);
    const bodyFat = source.slice(start, end);
    assert.equal(crypto.createHash('sha256').update(bodyFat).digest('hex'), '5d4bb1e98a97cec1deb64918d078e41077edf87d3ad9a2fbdd975c70f20e1495');
});
