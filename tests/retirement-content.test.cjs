'use strict';
// Real registry/renderers/integration/schema; synthetic DOM, no Git/network/writes.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const generator = require('../scripts/generate-static-articles.cjs');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const key = 'retirement-calculator';
const mapping = {file:'retirement-calculator.html', key, selector:'#financeInfo'};
const subtitle = "Explore illustrative retirement savings projections using your own assumptions.";
const description = "Use ToolXone's free Retirement Calculator to estimate how your current savings and monthly contributions may grow over time. Enter your current age, retirement age, existing savings, monthly contribution and expected annual return to explore your projected retirement savings.";
const calculatorSubtitle = "Explore an illustrative retirement savings projection based on your age, current savings, monthly contributions and annual return assumption.";
const disclosure = "This is an illustrative projection, not financial advice or a guaranteed outcome. Estimated monthly retirement income equals the projected fund × 4% ÷ 12. The fixed 4% assumption does not establish a sustainable withdrawal amount or how long savings will last.";
const expectedIntroduction = "Retirement planning involves estimating how your savings may grow over time and understanding how factors such as your current savings, monthly contributions, investment returns and retirement age can affect your financial future. ToolXone's Retirement Calculator helps you explore these factors by projecting the future value of your retirement savings. Inflation is not included in the projection and should be considered separately.";
const expectedHeadings = [
    "How This Retirement Calculator Works",
    "Calculation Methodology and Output Definitions",
    "Why Starting Earlier Can Matter",
    "Monthly Contributions and Retirement Savings",
    "Investment Returns and Retirement Planning",
    "Remember the Effect of Inflation",
    "The Fixed 4% Monthly-Income Illustration",
    "How to Interpret Your Retirement Estimate",
    "References and Source Context"
];
const preservedSections = [
    {
        "heading": "How This Retirement Calculator Works",
        "content": "\n<p>\n    Enter your current age, planned retirement age, current savings,\n    monthly contribution and expected annual return. The calculator\n    estimates how your existing savings and future contributions may grow\n    during the years remaining until retirement.\n</p>\n\n<p>\n    The result is a projection based on the assumptions you enter.\n    Actual investment returns can vary, so it can be useful to calculate\n    several scenarios using different contribution amounts and expected\n    returns.\n</p>\n"
    },
    {
        "heading": "Why Starting Earlier Can Matter",
        "content": "\n<p>\n    A longer investment period gives savings and investment returns more\n    time to compound. Starting earlier may therefore have a significant\n    effect on the projected value of a retirement fund, even when monthly\n    contributions remain the same.\n</p>\n\n<p>\n    You can explore the effect of compounding separately with ToolXone's\n    <a href=\"compound-interest-calculator.html\">\n        Compound Interest Calculator\n    </a>.\n</p>\n"
    },
    {
        "heading": "Monthly Contributions and Retirement Savings",
        "content": "\n<p>\n    Regular contributions can play an important role in building retirement\n    savings. Increasing the amount contributed each month can increase both\n    total contributions and the amount that may benefit from investment\n    growth over time.\n</p>\n\n<p>\n    If you are working toward a specific savings target, the\n    <a href=\"savings-goal-calculator.html\">\n        Savings Goal Calculator\n    </a>\n    can help you explore how much you may need to save toward that goal.\n</p>\n"
    },
    {
        "heading": "Investment Returns and Retirement Planning",
        "content": "\n<p>\n    The expected annual return is an assumption about how investments may\n    grow over time. Because future returns are uncertain, retirement\n    planning should not rely on a single assumed rate. Comparing multiple\n    scenarios can provide a better understanding of how different returns\n    may affect the projected retirement balance.\n</p>\n\n<p>\n    To examine investment performance from another perspective, you can\n    also use the\n    <a href=\"roi-calculator.html\">\n        ROI Calculator\n    </a>.\n</p>\n"
    },
    {
        "heading": "Remember the Effect of Inflation",
        "content": "\n<p>\n    A future retirement balance may look much larger than today's savings,\n    but inflation can reduce the purchasing power of money over time.\n    This Retirement Calculator does not automatically adjust its result\n    for inflation, so inflation should be considered separately when\n    evaluating long-term retirement plans.\n</p>\n\n<p>\n    Use ToolXone's\n    <a href=\"inflation-calculator.html\">\n        Inflation Calculator\n    </a>\n    to explore how changes in purchasing power may affect the value of\n    money over time.\n</p>\n"
    },
    {
        "heading": "How to Interpret Your Retirement Estimate",
        "content": "\n<p>\n    Treat the calculated amount as an estimate rather than a guaranteed\n    retirement outcome. Your actual results can be affected by investment\n    performance, contribution changes, inflation, taxes, fees and other\n    financial circumstances.\n</p>\n\n<p>\n    Try several scenarios instead of relying on a single calculation.\n    Changing your retirement age, monthly contribution or expected return\n    can help you understand which assumptions have the greatest effect on\n    your projected savings.\n</p>\n"
    }
];
const methodology = [
    "Let S represent current savings, P the constant monthly contribution, A the entered annual return percentage, n the number of months and r the monthly rate. Use the same monetary unit for current savings and monthly contributions.",
    "years = retirementAge − currentAge",
    "n = years × 12",
    "r = A ÷ 100 ÷ 12",
    "The calculator treats the entered annual return as a nominal annual rate and divides it by 12 to obtain a constant monthly rate. It does not convert an effective annual return into a monthly rate. The entered value is an assumption for the scenario, not a forecast, recommended return or historically expected return.",
    "Current savings compound monthly under the constant-rate assumption.",
    "Future current savings = S × (1 + r)^n",
    "When r is nonzero, future contributions use the ordinary-annuity formula. For a whole number of months, this assumes equal contributions at the end of each month, so the last contribution receives no interest before the projection endpoint.",
    "Future contributions = P × ((1 + r)^n − 1) ÷ r",
    "At zero annual return, current savings remain unchanged and future contributions equal the monthly contribution multiplied by the number of months.",
    "Future current savings = S",
    "Future contributions = P × n",
    "Fractional ages produce fractional years and months. The calculator uses those fractional periods directly in the formulas without rounding the number of months. This is a mathematical extension of the formulas, not a simulation of partial-month deposits."
];
const definitions = [
    [
        "Projected fund:",
        "Future current savings plus future contributions."
    ],
    [
        "Total contributions:",
        "Current savings plus monthly contribution × months. This includes the starting savings balance."
    ],
    [
        "Investment growth:",
        "Projected fund minus total contributions. For fractional periods, this formula can produce negative investment growth even when the entered return is positive."
    ]
];
const outputFormulas = [
    "Projected fund = future current savings + future contributions",
    "Total contributions = S + P × n",
    "Investment growth = projected fund − total contributions"
];
const income = [
    "Estimated monthly retirement income is calculated by multiplying the projected fund by 0.04 and dividing by 12.",
    "Estimated monthly retirement income = projected fund × 0.04 ÷ 12",
    "The 4% figure is a fixed illustrative withdrawal assumption and cannot be adjusted in this calculator. The output is not a recommended withdrawal amount, a sustainable-income determination or a retirement-income plan.",
    "The calculator does not simulate withdrawals after retirement, subsequent inflation adjustments, changing investment returns or portfolio depletion. It does not determine how long the fund will last."
];
const additions = [
    "This calculator provides illustrative projections, not financial advice, individualized recommendations or guaranteed outcomes.",
    "The calculator does not model inflation, taxes, fees, changing returns, changing contributions, pre-retirement withdrawals, pensions or Social Security, spending needs, asset allocation, longevity or drawdown, or individualized circumstances. It uses a constant return assumption and a constant monthly contribution.",
    "Calculations retain unrounded values. Monetary results display two decimal places, while years remaining display up to two decimal places. Display rounding does not change the values used in the calculations.",
    "The bars show contribution and investment-growth proportions, not probabilities or retirement adequacy. Their widths are limited to 0%–100%; negative investment growth displays a zero-width growth bar."
];
const referenceURLs = [
    "https://www.financialplanningassociation.org/sites/default/files/2021-04/MAR04%20Determining%20Withdrawal%20Rates%20Using%20Historical%20Data.pdf",
    "https://www.investor.gov/introduction-investing/investing-basics/what-risk"
];
const referenceTitles = [
    "William P. Bengen (1994) — Determining Withdrawal Rates Using Historical Data (publisher-hosted reprint)",
    "SEC Investor.gov — What is Risk?"
];
const referenceStatements = [
    "This historical research provides context for discussing an initial withdrawal followed by inflation-adjusted withdrawals using historical portfolio returns. It does not validate ToolXone's accumulation projection or fixed monthly-income illustration, and it does not guarantee future sustainability.",
    "This source provides general context about investment uncertainty, potential loss, volatility and inflation's effect on purchasing power. It does not validate ToolXone's entered return assumption, fixed 4% assumption or calculator."
];
const endorsement = "These references provide context and imply no endorsement of ToolXone by the authors, publishers or institutions.";
const expectedFAQ = [
    {
        "question": "What does this retirement calculator estimate?",
        "answer": "This calculator provides an illustrative projection of the future value of current savings and constant monthly contributions under the annual return assumption you enter. It also shows total contributions, investment growth and a fixed monthly-income illustration. It does not determine whether your savings are sufficient for retirement."
    },
    {
        "question": "How is the retirement projection calculated?",
        "answer": "Years remaining equal retirement age minus current age, and months equal years remaining multiplied by 12. The monthly rate equals the entered annual return percentage divided by 100 and then by 12. The projected fund combines the future value of current savings and monthly contributions."
    },
    {
        "question": "How are current savings compounded?",
        "answer": "Current savings are multiplied by (1 + monthly rate) raised to the number of months. This applies a constant monthly compounding assumption throughout the projection."
    },
    {
        "question": "When are monthly contributions assumed to occur?",
        "answer": "For whole-month periods, contributions are assumed to occur at the end of each month. The final contribution receives no interest before the projection endpoint. Contributions are assumed to remain constant."
    },
    {
        "question": "What happens when the annual return is zero?",
        "answer": "Current savings remain unchanged. Future contributions equal monthly contribution multiplied by months, so the projected fund equals current savings plus those contributions and investment growth is zero."
    },
    {
        "question": "Can I enter fractional ages or periods?",
        "answer": "The calculation accepts fractional ages and uses the resulting fractional years and months without rounding the period. Fractional-period results are mathematical extensions of the formulas, not simulations of partial-month deposits."
    },
    {
        "question": "What do total contributions and investment growth mean?",
        "answer": "Total contributions equal current savings plus monthly contribution multiplied by months, including the starting savings balance. Investment growth equals projected fund minus total contributions. Fractional periods can produce negative calculated investment growth even with a positive entered return."
    },
    {
        "question": "What does the annual return input mean?",
        "answer": "It is your scenario assumption, not a forecast, recommended return or historically expected return. The calculator treats it as a nominal annual rate divided by 12, rather than converting an effective annual return. Actual investment returns can vary and include losses."
    },
    {
        "question": "How is estimated monthly retirement income calculated?",
        "answer": "Estimated monthly retirement income equals projected fund multiplied by 0.04 and divided by 12. This is a fixed illustration, not a recommended withdrawal amount, a sustainable-income determination or a retirement-income plan."
    },
    {
        "question": "Can I change the withdrawal assumption?",
        "answer": "No. The calculator uses a fixed 4% annual assumption for its monthly-income illustration. It does not provide a withdrawal-rate input or simulate a retirement withdrawal schedule."
    },
    {
        "question": "Does the 4% illustration guarantee that savings will last?",
        "answer": "No. Historical withdrawal-rate research provides context for discussing an initial withdrawal followed by inflation adjustments. ToolXone does not implement that historical analysis or test portfolio longevity. Its fixed illustration does not establish future sustainability."
    },
    {
        "question": "Does this calculator account for inflation?",
        "answer": "No. The projection is nominal and is not automatically adjusted for inflation. Inflation can reduce purchasing power, so a future balance does not represent an equivalent amount of purchasing power today."
    },
    {
        "question": "What other factors are excluded?",
        "answer": "The calculator does not model taxes, fees, changing returns, changing contributions, pre-retirement withdrawals, pensions or Social Security, spending needs, asset allocation, longevity or drawdown, or individualized circumstances. It uses a constant return assumption and a constant monthly contribution."
    },
    {
        "question": "How are displayed results rounded?",
        "answer": "Calculations retain unrounded values. Monetary results display two decimal places, and years remaining display up to two decimal places. Display rounding does not change the values used in the calculations."
    },
    {
        "question": "Are these results financial advice or guaranteed outcomes?",
        "answer": "No. The results are illustrative projections based on your inputs and simplified assumptions. They are not financial advice, individualized recommendations or guaranteed retirement outcomes."
    }
];
const originalSchema = {
    "version": "2.0.0",
    "meta": {
        "basic": {
            "title": "Retirement Calculator - Calculate Future Retirement Savings | ToolXone",
            "description": "Use ToolXone's free Retirement Calculator to estimate future retirement savings and investment growth based on your age, current savings, monthly contributions and expected return.",
            "keywords": [
                "retirement calculator",
                "retirement calculator online",
                "free retirement calculator",
                "retirement calculator free",
                "retirement planning calculator",
                "retirement savings calculator",
                "retirement savings calculator online",
                "future retirement savings calculator",
                "calculate retirement savings",
                "retirement investment calculator",
                "retirement investment growth calculator",
                "retirement fund calculator",
                "retirement planning tool",
                "retirement age calculator",
                "monthly contribution retirement calculator",
                "retirement corpus calculator",
                "future savings calculator",
                "retirement estimate calculator",
                "retirement investment growth",
                "ToolXone"
            ]
        },
        "canonical": {
            "href": "https://www.toolxone.com/retirement-calculator.html"
        },
        "robots": {
            "content": "index,follow"
        },
        "application": {
            "name": "ToolXone Retirement Calculator"
        },
        "mobile": {
            "appleTitle": "Retirement Calculator",
            "themeColor": "#0f172a"
        },
        "openGraph": {
            "title": "Retirement Calculator - Calculate Future Retirement Savings | ToolXone",
            "description": "Estimate your future retirement savings and investment growth with ToolXone's free online Retirement Calculator.",
            "type": "website",
            "url": "https://www.toolxone.com/retirement-calculator.html",
            "image": "https://www.toolxone.com/images/retirement-calculator.webp",
            "imageWidth": 1536,
            "imageHeight": 1024,
            "imageAlt": "ToolXone Retirement Calculator for estimating future retirement savings and investment growth",
            "siteName": "ToolXone",
            "locale": "en_US"
        },
        "twitter": {
            "card": "summary_large_image",
            "site": "@ToolXone",
            "title": "Retirement Calculator - Calculate Future Retirement Savings | ToolXone",
            "description": "Estimate future retirement savings and investment growth with ToolXone's free online Retirement Calculator.",
            "image": "https://www.toolxone.com/images/retirement-calculator.webp",
            "imageAlt": "ToolXone Retirement Calculator"
        }
    },
    "schema": {
        "organization": {
            "name": "ToolXone",
            "url": "https://www.toolxone.com/"
        },
        "website": {
            "name": "ToolXone",
            "url": "https://www.toolxone.com/"
        },
        "webpage": {
            "name": "Retirement Calculator",
            "url": "https://www.toolxone.com/retirement-calculator.html",
            "description": "Free online retirement calculator for estimating future retirement savings and investment growth based on age, current savings, monthly contributions and expected annual return."
        },
        "application": {
            "name": "ToolXone Retirement Calculator",
            "applicationCategory": "FinanceApplication",
            "applicationSubCategory": "Retirement Calculator",
            "operatingSystem": "Any",
            "url": "https://www.toolxone.com/retirement-calculator.html",
            "description": "Free online retirement calculator for estimating future retirement savings and investment growth based on current age, planned retirement age, current savings, monthly contributions and expected annual return.",
            "isAccessibleForFree": true,
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            }
        },
        "breadcrumbs": [
            {
                "name": "Home",
                "url": "https://www.toolxone.com/"
            },
            {
                "name": "Retirement Calculator",
                "url": "https://www.toolxone.com/retirement-calculator.html"
            }
        ]
    }
};
const originalHeadHash = "fc6c0ea860094c5ded1db6ca718da17097261e0854f25b8771ea5d875f16c7a1";
const baselines = [
    [
        "js/retirement.js",
        "8e67fced297fc19e4f6abaed440ce070868dc6d84f870d9b76ecce07c8f66650"
    ],
    [
        "tests/retirement.test.cjs",
        "488c0938fc79ba05901eae5001d5c16f01f25cad230ac70b3412b9c7e13009b4"
    ]
];

function visible(html) {
    return html.replace(/<[^>]*>/g,' ').replace(/&#039;|&#39;/g,"'").replace(/&quot;/g,'"')
        .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
}
const count=(text,value)=>text.split(value).length-1;
function includesAll(text,values){for(const value of values)assert.ok(text.includes(value),'Missing: '+value);}
function harness(initialArticle='') {
    class Element {
        constructor(html=''){this.innerHTML=html;this.classList={add(){}};}
        querySelectorAll(){return [];}
    }
    const target=new Element(initialArticle),faqTarget=new Element(),heroTarget=new Element();
    let schema;
    const context={
        HTMLElement:Element,
        document:{
            body:{dataset:{tool:key}},
            querySelector(selector){return ({'#financeInfo':target,'#financeFAQ':faqTarget})[selector]||null;},
            getElementById(id){return id==='toolHero'?heroTarget:null;}
        },
        console:{info(){},log(){},warn(){},error(){},debug(){}},
        addEventListener(){},
        fetch(){assert.fail('Network forbidden');},
        ToolXoneSchemaRegistry:{register(id,value){assert.equal(id,'RetirementCalculator');assert.equal(schema,undefined);schema=value;}}
    };
    context.window=context;vm.createContext(context);
    for(const file of [
        'js/content/content-registry.js','js/content/content-data-finance.js',
        'js/content/article-renderer.js','js/content/faq-renderer.js',
        'js/content/hero-renderer.js','js/content/content-integration-engine.js',
        'js/seo/schemas/retirement-calculator-schema.js'
    ])vm.runInContext(read(file),context,{filename:file,timeout:2000});
    const integration=context.ToolXoneContentIntegrationEngine;
    integration.modules.registry=context.ToolXoneContentRegistry;
    integration.modules.articleRenderer=context.ToolXoneArticleRenderer;
    integration.modules.faqRenderer=context.ToolXoneFAQRenderer;
    const targets=integration.getRenderTargets(key),content=integration.getContent(key);
    assert.ok(content.article);assert.ok(schema);
    return {
        article:content.article,targets,schema,context,target,
        faq:JSON.parse(JSON.stringify(content.faq)),
        render(){assert.equal(integration.renderArticle(content.article,targets.article),true);return target.innerHTML;},
        renderFAQ(){assert.equal(integration.renderFAQ(content.faq,targets.faq),true);return faqTarget.innerHTML;},
        renderHero(){assert.equal(context.ToolXoneHeroRenderer.render(key),true);return heroTarget.innerHTML;}
    };
}
test('Real article has the exact nine-section order, introduction and valid markup',()=>{
    const h=harness(),html=h.render();
    assert.equal(generator.validateOutput(html),html);
    assert.equal(h.article.title,'How to Plan for Retirement');
    assert.equal(h.article.introduction,expectedIntroduction);
    assert.equal(count(visible(html),expectedIntroduction),1);
    assert.deepEqual(Array.from(h.article.sections,s=>s.heading),expectedHeadings);
    const headings=[...html.matchAll(/<h2>([\s\S]*?)<\/h2>/g)].map(m=>visible(m[1]));
    assert.deepEqual(headings,expectedHeadings);
    assert.doesNotMatch(html,/undefined|\[object Object\]/);
});
test('Existing six sections keep exact authored prose and contextual tool links',()=>{
    const h=harness(),html=h.render();
    for(const old of preservedSections){
        const section=h.article.sections.find(s=>s.heading===old.heading);
        assert.ok(section,old.heading);
        if(old.heading==='How to Interpret Your Retirement Estimate'){
            assert.ok(section.content.startsWith(old.content));
        }else assert.equal(section.content,old.content);
        assert.ok(visible(html).includes(visible(old.content)),old.heading);
    }
    const internal=[...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)].map(m=>m[1]).filter(v=>!/^https:/.test(v));
    assert.deepEqual(internal,['compound-interest-calculator.html','savings-goal-calculator.html','roi-calculator.html','inflation-calculator.html']);
});
test('Real rendering contains exact formulas, rate semantics and output definitions',()=>{
    const h=harness(),html=h.render(),text=visible(html);
    includesAll(text,methodology);includesAll(text,outputFormulas);
    includesAll(text,definitions.map(([title,body])=>title+' '+body));
    const section=h.article.sections.find(s=>s.heading==='Calculation Methodology and Output Definitions');
    assert.equal((section.content.match(/<ul>/g)||[]).length,1);
    assert.equal((section.content.match(/<li>/g)||[]).length,3);
    let previous=-1;
    for(const paragraph of methodology){const position=html.indexOf('<p>'+paragraph+'</p>');assert.ok(position>previous);previous=position;}
});
test('End-month, zero-rate and fractional-period explanations preserve model interpretation',()=>{
    includesAll(visible(harness().render()),[
        methodology[7],methodology[9],methodology[10],methodology[11],methodology[12],
        definitions[2][1]
    ]);
});
test('Fixed income illustration and full exclusions, rounding and bar interpretation render exactly',()=>{
    const text=visible(harness().render());
    includesAll(text,income);includesAll(text,additions);
    assert.equal(count(text,income[1]),1);
    assert.ok(text.indexOf(income[0])<text.indexOf(additions[0]));
});
test('Exactly two approved external reference entries in order with conservative source framing',()=>{
    const h=harness(),html=h.render();
    const links=[...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].filter(m=>/^https:/.test(m[1]));
    assert.deepEqual(links.map(m=>m[1]),referenceURLs);
    assert.deepEqual(links.map(m=>visible(m[2])),referenceTitles);
    for(const link of links)assert.doesNotMatch(link[1],/[\[\]()]/);
    includesAll(visible(html),referenceStatements);assert.equal(count(visible(html),endorsement),1);
    const section=h.article.sections.at(-1);
    assert.equal(section.heading,'References and Source Context');
    assert.equal((section.content.match(/<ol>/g)||[]).length,1);
    assert.equal((section.content.match(/<li>/g)||[]).length,2);
    assert.ok(section.content.indexOf(referenceStatements[0])<section.content.indexOf(referenceStatements[1]));
});
test('15 unique visible and schema FAQs match independent canonical text and order',()=>{
    const h=harness(),schemaFAQ=JSON.parse(JSON.stringify(h.schema.schema.faq));
    assert.equal(h.faq.length,15);assert.equal(schemaFAQ.length,15);
    assert.equal(new Set(h.faq.map(f=>f.question)).size,15);
    assert.equal(new Set(schemaFAQ.map(f=>f.question)).size,15);
    assert.deepEqual(h.faq,expectedFAQ);assert.deepEqual(schemaFAQ,expectedFAQ);
    const output=h.renderFAQ(),text=visible(output);
    assert.equal((output.match(/<details\s+class="toolxone-faq-item"/g)||[]).length,15);
    let previous=-1;
    for(const item of expectedFAQ){
        const position=text.indexOf(item.question);assert.ok(position>previous);previous=position;
        assert.equal(count(text,item.question),1);assert.equal(count(text,item.answer),1);
    }
});
test('Actual hero renders exact Illustrative / Projection and approved copy',()=>{
    const h=harness(),html=h.renderHero(),text=visible(html);
    assert.match(html,/<strong>\s*Illustrative\s*<\/strong>\s*<span>\s*Projection\s*<\/span>/);
    includesAll(text,[subtitle,description,'Compare retirement savings scenarios']);
    const hero=h.context.ToolXoneContentRegistry.get('hero',key);
    assert.equal(hero.subtitle,subtitle);assert.equal(hero.description,description);
    assert.deepEqual(Array.from(hero.highlights),['Estimate your future retirement savings','Account for current savings and contributions','Compare different retirement ages and returns','Compare retirement savings scenarios']);
    assert.doesNotMatch(text,/Formula\s+Accuracy|financially secure future|Plan your long-term retirement strategy/);
});
test('Existing integration uses exactly the authored article and FAQ targets',()=>{
    const page=read(mapping.file),h=harness();
    assert.equal(h.targets.article,'#financeInfo');assert.equal(h.targets.faq,'#financeFAQ');assert.equal(h.targets.related,'#relatedTools');
    for(const id of ['financeInfo','financeFAQ'])assert.equal(count(page,'id="'+id+'"'),1);
    assert.ok(visible(h.renderFAQ()).includes(expectedFAQ[0].question));
});
test('Permanent authored disclosure follows replaceable result and precedes bars',()=>{
    const page=read(mapping.file),b=generator.region(page,mapping),authored=page.slice(0,b.start)+page.slice(b.end);
    assert.equal(count(authored,disclosure),1);
    assert.match(authored,/<div id="retirementResult" class="retirement-result">\s*<p>Your retirement summary will appear here\.<\/p>\s*<\/div>\s*<p>This is an illustrative projection, not financial advice or a guaranteed outcome\./);
    const start=authored.indexOf('<div id="retirementResult"'),end=authored.indexOf('</div>',start);
    assert.ok(authored.indexOf(disclosure)>end);
    assert.ok(authored.indexOf(disclosure)<authored.indexOf('<div id="retirementBars"'));
    assert.equal(count(authored,'subtitle: '+JSON.stringify(calculatorSubtitle)),1);
    for(const id of ['currentAge','retirementAge','currentSavings','monthlyContribution','annualReturn'])assert.equal(count(authored,'id: "'+id+'"'),1);
    includesAll(authored,['ToolXoneHeroRenderer.render("retirement-calculator");','renderFinanceFeedback("financeFeedback", "Retirement Calculator");','onclick="runRetirementCalculator()"','onclick="resetRetirement()"']);
});
test('Generated initial article equals independently executed real rendering with EOL conversion only',()=>{
    const page=read(mapping.file),bounds=generator.region(page,mapping);
    const newline=generator.eol(page,mapping,bounds);
    const independent=harness().render();
    assert.equal(page.slice(bounds.start,bounds.end),independent.replace(/\r\n/g,'\n').replace(/\n/g,newline));
    const staticText=visible(page.slice(bounds.start,bounds.end));
    includesAll(staticText,[methodology[8],income[1],additions[1],referenceStatements[0],referenceStatements[1]]);
});
test('Runtime replaces pre-populated static content and leaves one wrapper after repeated rendering',()=>{
    const page=read(mapping.file),b=generator.region(page,mapping),h=harness(page.slice(b.start,b.end));
    const first=h.render(),second=h.render();assert.equal(second,first);
    assert.equal(count(second,'class="tool-article"'),1);
    assert.equal(count(visible(second),h.article.title),1);
    assert.equal(count(second,'References and Source Context'),1);
    assert.doesNotMatch(second,/TOOLXONE:STATIC-ARTICLE:/);
});
test('Schema cleanup changes only the prohibited age-calculator keyword and adds exact FAQ',()=>{
    const actual=JSON.parse(JSON.stringify(harness().schema));
    assert.deepEqual(actual.schema.faq,expectedFAQ);delete actual.schema.faq;
    const expected=JSON.parse(JSON.stringify(originalSchema));
    expected.meta.basic.keywords=expected.meta.basic.keywords.filter(k=>k!=='retirement age calculator');
    assert.deepEqual(actual,expected);
    assert.ok(!actual.meta.basic.keywords.includes('retirement age calculator'));
});
test('HTML head metadata and Retirement content metadata registration remain unchanged',()=>{
    const page=read(mapping.file);
    assert.equal(crypto.createHash('sha256').update(page.slice(0,page.indexOf('</head>')+7).replace(/\r\n/g,'\n')).digest('hex'),originalHeadHash);
    const metadata=JSON.parse(JSON.stringify(harness().context.ToolXoneContentRegistry.get('metadata',key)));
    assert.deepEqual(metadata,{
        title:'Retirement Calculator - Calculate Future Retirement Savings | ToolXone',
        description:"Use ToolXone's free Retirement Calculator to estimate future retirement savings and investment growth based on your age, current savings, monthly contributions and expected return.",
        canonical:'https://www.toolxone.com/retirement-calculator.html',robots:'index,follow',author:'ToolXone'
    });
});
function noAffirmativeAuthority(text){
    const cleaned=text
        .replace(/Does the 4% illustration guarantee that savings will last\?/g,'')
        .replace(/not financial advice or a guaranteed outcome/gi,'')
        .replace(/not financial advice, individualized recommendations or guaranteed outcomes/gi,'')
        .replace(/not financial advice, individualized recommendations or guaranteed retirement outcomes/gi,'')
        .replace(/not a recommended withdrawal amount, a sustainable-income determination or a retirement-income plan/gi,'')
        .replace(/does not establish a sustainable withdrawal amount or how long savings will last/gi,'')
        .replace(/does not guarantee future sustainability/gi,'')
        .replace(/imply no endorsement of ToolXone/gi,'')
        .replace(/not endorsed by/gi,'');
    assert.doesNotMatch(cleaned,/\b(?:safe|sustainable|recommended|guaranteed|personalized) (?:retirement )?(?:income|withdrawal amount|withdrawal rate|retirement-income plan)\b|\bguarantees? (?:future sustainability|retirement outcomes?|that savings will last|your retirement)\b|\b(?:provides?|offers?) (?:personalized |individualized )?(?:financial advice|retirement recommendations)\b|\b(?:endorsed|approved) by (?:Bengen|SEC|Investor\.gov|FPA)\b|\bimplies? endorsement of ToolXone\b/i);
}
test('Claim guard rejects affirmative claims and permits the exact approved negative disclaimers',()=>{
    for(const text of ['Safe retirement income','Sustainable withdrawal amount','Recommended withdrawal rate','Guaranteed retirement income','Personalized retirement income',
        'Guarantees future sustainability','Guarantees that savings will last','Provides personalized financial advice','Offers individualized retirement recommendations',
        'Endorsed by Bengen','Approved by SEC','Implies endorsement of ToolXone',
        'It does not guarantee future sustainability. Guarantees future sustainability.']){
        assert.throws(()=>noAffirmativeAuthority(text),assert.AssertionError,text);
    }
    for(const text of [disclosure,...income,...additions,...referenceStatements,endorsement,'Not endorsed by SEC']){
        assert.doesNotThrow(()=>noAffirmativeAuthority(text),text);
    }
});
test('Actual rendered article, FAQ, hero, authored disclosure and schema have no prohibited affirmative claims',()=>{
    const h=harness();noAffirmativeAuthority([visible(h.render()),visible(h.renderFAQ()),visible(h.renderHero()),disclosure,JSON.stringify(h.schema)].join(' '));
});
for(const [file,expected] of baselines)test('Frozen normalized correctness baseline 9645729: '+file,()=>{
    assert.equal(crypto.createHash('sha256').update(read(file).replace(/\r\n/g,'\n'),'utf8').digest('hex'),expected);
});

