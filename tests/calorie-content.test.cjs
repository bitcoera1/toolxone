'use strict';
// Real registry/renderers/integration/schema; synthetic DOM, no Git/network/writes.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const generator=require('../scripts/generate-static-articles.cjs');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const key='calorie-calculator';
const mapping={file:'calorie-calculator.html',key,selector:'#healthInfo'};
const description="Estimate resting energy expenditure and a simplified daily maintenance value using the Mifflin–St Jeor equation and fixed activity assumptions.";
const disclosure="These values combine predicted resting energy expenditure with simplified activity and calorie-adjustment assumptions. They are not measured energy expenditure or individualized dietary prescriptions. The 1,200-calorie floor does not establish a safe or nutritionally adequate intake.";
const referenceURLs=["https://pubmed.ncbi.nlm.nih.gov/2305711/","https://www.fao.org/4/y5686e/y5686e07.htm"];
const referenceTitles=["Mifflin et al. (1990) — A new predictive equation for resting energy expenditure in healthy individuals","FAO/WHO/UNU — Human energy requirements: Energy requirements of adults"];
const expectedFAQ=[
    {
        "question": "What does ToolXone’s Calorie Calculator estimate?",
        "answer": "It predicts resting energy expenditure and applies a simplified activity factor to estimate daily maintenance calories. It also shows fixed loss and gain scenarios for informational comparison."
    },
    {
        "question": "Why does the calculator use the BMR label?",
        "answer": "The familiar BMR label refers here to a Mifflin–St Jeor prediction of resting energy expenditure (REE), not a direct laboratory measurement of basal metabolism."
    },
    {
        "question": "Which resting-energy equations are used?",
        "answer": "The male equation is 10W + 6.25H − 5A + 5; the female equation is 10W + 6.25H − 5A − 161. W is weight in kilograms, H is height in centimeters and A is age in years."
    },
    {
        "question": "How are imperial measurements converted?",
        "answer": "Height in feet and inches is converted to total inches and multiplied by 2.54. Weight in pounds is multiplied by 0.45359237 to obtain kilograms."
    },
    {
        "question": "How is the maintenance estimate calculated?",
        "answer": "Predicted REE is multiplied by the selected activity factor. This is a simplified estimate, not a measurement of total daily energy expenditure."
    },
    {
        "question": "Which activity factors does ToolXone use?",
        "answer": "The factors are 1.20 for Sedentary, 1.375 for Lightly Active, 1.55 for Moderately Active, 1.725 for Very Active and 1.90 for Extra Active."
    },
    {
        "question": "Are those activity factors individualized or validated by Mifflin?",
        "answer": "No. They are simplified calculator assumptions, separate from the original resting-energy equation. Exercise frequency alone does not measure whole-day activity."
    },
    {
        "question": "How is the loss scenario calculated?",
        "answer": "It is the greater of 1,200 and the maintenance estimate minus 500 calories/day. This fixed calculation is not an individualized dietary recommendation."
    },
    {
        "question": "Why can the loss scenario display “—”?",
        "answer": "It displays “—” when the calculated loss scenario is not below the unrounded maintenance estimate."
    },
    {
        "question": "Is 1,200 calories a universal safe minimum?",
        "answer": "No. It is this calculator’s numerical floor and does not establish a safe or nutritionally adequate intake for an individual."
    },
    {
        "question": "How is the gain scenario calculated?",
        "answer": "It is the maintenance estimate plus 500 calories/day. This fixed assumption is not an individualized recommendation or a guarantee of weight gain."
    },
    {
        "question": "Which ages does the calculator accept?",
        "answer": "The software accepts ages 18–120. The original Mifflin study reported 498 healthy participants aged 19–78 and does not establish validation across the entire accepted range."
    },
    {
        "question": "Who should not use these values as dietary guidance?",
        "answer": "This general adult estimator is not designed for children, pregnancy or breastfeeding, or individualized clinical dietary planning. Specific dietary needs require qualified professional guidance."
    },
    {
        "question": "How are results rounded?",
        "answer": "Displayed values are rounded to whole calories/day. Calculations and the unavailable-loss comparison use unrounded values."
    },
    {
        "question": "Do the results measure metabolism or prescribe calorie intake?",
        "answer": "No. They are predictions and arithmetic scenarios, not direct measurements, diagnoses or individualized calorie prescriptions. Individual physiology, body composition and activity can change actual requirements."
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
            querySelector(selector) { return ({ '#healthInfo': target, '#healthFAQ': faqTarget })[selector] || null; },
            getElementById(id) { return id === 'toolHero' ? heroTarget : null; }
        },
        console: { info() {}, log() {}, warn() {}, error() {}, debug() {} },
        addEventListener() {},
        fetch() { throw new Error('Network forbidden'); },
        ToolXoneSchemaRegistry: { register(id, value) { assert.equal(id, 'CalorieCalculator'); assert.equal(schema, undefined); schema = value; } }
    };
    context.window = context;
    vm.createContext(context);
    for (const file of [
        'js/content/content-registry.js', 'js/content/content-data-health.js',
        'js/content/article-renderer.js', 'js/content/faq-renderer.js',
        'js/content/hero-renderer.js', 'js/content/content-integration-engine.js',
        'js/seo/schemas/calorie-calculator-schema.js'
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



test('Real article discloses REE equations, units, conversions, maintenance and rounding',()=>{
 const html=harness().render();assert.equal(generator.validateOutput(html),html);
 includesAll(visible(html),['familiar BMR label for a Mifflin–St Jeor prediction of resting energy expenditure (REE)',
 'REE = 10W + 6.25H − 5A + 5','REE = 10W + 6.25H − 5A − 161','W in kilograms, H in centimeters and A in years',
 'total inches × 2.54','pounds × 0.45359237','Maintenance estimate = predicted REE × selected activity factor',
 'Calculations occur before rounding; displayed calorie values use whole calories/day.']);assert.doesNotMatch(html,/undefined|\[object Object\]/);
});
test('Five exact activity factors and dropdown assumptions are explicitly qualified',()=>{
 includesAll(visible(harness().render()),['Sedentary — 1.20','Lightly Active — 1.375','Moderately Active — 1.55','Very Active — 1.725','Extra Active — 1.90',
 'dropdown exercise-frequency descriptions are simplified calculator assumptions','do not measure whole-day activity','are not validated individualized activity factors','not part of the original Mifflin equation']);
});
test('Loss/gain arithmetic, qualified numerical floor and unrounded unavailable rule',()=>{
 includesAll(visible(harness().render()),['Loss scenario = max(1200, maintenance − 500) calories/day','Gain scenario = maintenance + 500 calories/day',
 'not recommended intakes or guarantees of weight change',"calculator's numerical floor, not a universal safety threshold or a determination of adequate nutrition",
 'not below the unrounded maintenance estimate, its field displays “—”','comparison uses unrounded values even when displayed values round to the same whole calorie']);
});
test('Population and interpretation limits distinguish software acceptance from study evidence',()=>{
 includesAll(visible(harness().render()),['software accepts ages 18–120','498 healthy participants aged 19–78','does not establish validation across the calculator’s entire accepted age range',
 'not designed for children, pregnancy or breastfeeding, or individualized clinical dietary planning',
 'Neither value is a direct measurement of individual metabolism or total daily energy expenditure','Individual physiology, body composition and whole-day activity can make actual requirements differ']);
});
test('Exactly two raw methodology references in order with non-endorsement and validation limits',()=>{
 const html=harness().render(),links=[...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
 assert.deepEqual(links.map(m=>m[1]),referenceURLs);assert.deepEqual(links.map(m=>visible(m[2])),referenceTitles);for(const m of links)assert.doesNotMatch(m[1],/[\[\]()]/);
 includesAll(visible(html),['REE measured by indirect calorimetry','general energy-expenditure and activity context',"Neither source validates ToolXone's exact activity factors or adjustment rules",'neither citation implies endorsement of ToolXone']);
});
test('15 unique visible/schema FAQs equal independently frozen canonical text and order',()=>{
 const h=harness(),s=JSON.parse(JSON.stringify(h.schema.schema.faq));assert.equal(h.faq.length,15);assert.equal(s.length,15);
 assert.equal(new Set(h.faq.map(f=>f.question)).size,15);assert.equal(new Set(s.map(f=>f.question)).size,15);assert.deepEqual(h.faq,expectedFAQ);assert.deepEqual(s,expectedFAQ);
 const html=h.renderFAQ(),text=visible(html);assert.equal((html.match(/<details\s+class="toolxone-faq-item"/g)||[]).length,15);let last=-1;
 for(const f of expectedFAQ){const pos=text.indexOf(f.question);assert.ok(pos>last);last=pos;assert.equal(count(text,f.question),1);assert.equal(count(text,f.answer),1);}
});
test('Actual hero renders Estimated / Energy and approved description',()=>{
 const html=harness().renderHero();assert.match(html,/<strong>\s*Estimated\s*<\/strong>\s*<span>\s*Energy\s*<\/span>/);assert.ok(visible(html).includes(description));assert.doesNotMatch(visible(html),/High\s+Accuracy|Estimate Accuracy/);
});
test('Existing integration targets authored healthInfo and healthFAQ',()=>{
 const h=harness(),page=read(mapping.file);assert.equal(h.targets.article,'#healthInfo');assert.equal(h.targets.faq,'#healthFAQ');
 for(const id of ['healthInfo','healthFAQ'])assert.equal((page.match(new RegExp('\\bid="'+id+'"','g'))||[]).length,1);assert.ok(h.renderFAQ().includes(expectedFAQ[0].question));
});
test('Authored result labels preserve IDs and permanent disclosure follows explanation',()=>{
 const page=read(mapping.file),b=generator.region(page,mapping),authored=page.slice(0,b.start)+page.slice(b.end);
 for(const [id,label] of [['bmrValue','Predicted REE (BMR label)'],['maintenanceValue','Maintenance Estimate'],['weightLossValue','Loss Scenario'],['weightGainValue','Gain Scenario']]){
 assert.equal((authored.match(new RegExp('\\bid="'+id+'"','g'))||[]).length,1);assert.match(authored,new RegExp('<strong>\\s*'+label.replaceAll('(','\\(').replaceAll(')','\\)')+'\\s*</strong>\\s*<span id="'+id+'">'));}
 assert.equal(count(authored,disclosure),1);assert.match(authored,/<p\s+id="calorieExplanation"\s+class="result-explanation"\s*>\s*<\/p>\s*<p>These values combine/);assert.doesNotMatch(authored,/Weight Loss Target|Weight Gain Target/);
});
test('Static article equals independent actual rendering with only page EOL conversion',()=>{
 const page=read(mapping.file),b=generator.region(page,mapping),eol=generator.eol(page,mapping,b);assert.equal(page.slice(b.start,b.end),harness().render().replace(/\r\n/g,'\n').replace(/\n/g,eol));
});
test('Runtime replaces pre-populated static article without duplicate wrappers',()=>{
 const page=read(mapping.file),b=generator.region(page,mapping),h=harness(page.slice(b.start,b.end));const a=h.render(),c=h.render();assert.equal(c,a);assert.equal(count(c,'class="tool-article"'),1);assert.equal(count(c,h.article.title),1);assert.equal(count(c,'Methodology and References'),1);
});
function noAffirmativeAuthority(text){
 const cleaned=text.replace(/\bneither citation implies endorsement\b/gi,'').replace(/\bnot a universal safety threshold\b/gi,'').replace(/\bnot recommended intakes or guarantees of weight change\b/gi,'').replace(/\bnot an individualized recommendation or a guarantee of weight gain\b/gi,'').replace(/\bnot endorsed by\b/gi,'');
 assert.doesNotMatch(cleaned,/\bHigh\s+Accuracy\b|\bguaranteed accuracy\b|\b(?:provides?|offers?) (?:a )?(?:medical )?diagnosis\b|\b(?:provides?|offers?) individualized dietary prescriptions?\b|\b(?:is a |provides? a )universal safety threshold\b|\bguarantees? (?:of )?weight (?:loss|gain|change)\b|\bendorsed by (?:Mifflin|FAO|WHO|NIH)\b|\bimplies endorsement\b/i);
}
test('Authority guard rejects affirmative claims and allows explicit negative disclaimers',()=>{
 for(const s of ['High Accuracy','Guaranteed accuracy','Provides a diagnosis','Offers individualized dietary prescriptions','It is a universal safety threshold','Guarantees weight loss','Guarantees weight gain','Not an individualized recommendation or a guarantee of weight gain. Guarantees weight gain.','Endorsed by WHO','Implies endorsement'])assert.throws(()=>noAffirmativeAuthority(s),assert.AssertionError);
 for(const s of ['Not a universal safety threshold','Not recommended intakes or guarantees of weight change','Not an individualized recommendation or a guarantee of weight gain','Neither citation implies endorsement','Not endorsed by WHO','They are not individualized dietary prescriptions'])assert.doesNotThrow(()=>noAffirmativeAuthority(s));
});
test('Rendered article, FAQ, hero and schema avoid prohibited authority/prescription claims',()=>{
 const h=harness();noAffirmativeAuthority([visible(h.render()),visible(h.renderFAQ()),visible(h.renderHero()),JSON.stringify(h.schema)].join(' '));for(const k of ['calorie intake calculator','calorie target calculator'])assert.ok(!h.schema.meta.basic.keywords.includes(k));assert.doesNotMatch(JSON.stringify(h.schema),/calorie targets/);
});
// Read-only a4f0a16 baseline obtained during preparation; no Git in normal execution.
for(const [file,hash] of [['js/calorie.js','86c259ddeb34fcbf5c7679a4d93a806bc8f19714b52434009f98ea61d4e78130'],['tests/calorie.test.cjs','511500296b4ba46150045d99e624e116fddfbd8510dba2b8e80326972e170be1']])test('Frozen correctness baseline a4f0a16: '+file,()=>assert.equal(crypto.createHash('sha256').update(read(file).replace(/\r\n/g,'\n')).digest('hex'),hash));
