'use strict';
// In-memory replacement/write spies only: never writes repository HTML or accesses a network.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const g=require('../scripts/generate-static-articles.cjs');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exceptions=['discount-calculator.html','emi-calculator.html','loan-calculator.html','mortgage-calculator.html',
 'roi-calculator.html','savings-goal-calculator.html','qr-code-generator.html','weight-converter.html'];
const entry=g.MANIFEST.find(e=>e.file==='discount-calculator.html');
const output='<section class="tool-article">\n<h1>Test article</h1>\n<p>Fabricated content.</p>\n</section>\n';
const ads='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3609883417414465"\n     crossorigin="anonymous"></script>';
function fixture({file=entry.file,newline='\r\n',ad=ads,inside=''}={}){
 const e={...entry,file},m=g.markers(e.key);
 return {e,html:'<!doctype html>'+newline+ad+newline+'<div id="financeInfo">'+m.start+inside+m.end+'</div>'+newline};
}
function select(html,e=entry){return g.eol(html,e,g.region(html,e));}
for(const file of exceptions)test('EOL exception and byte preservation: '+file,()=>{
 const e=g.MANIFEST.find(e=>e.file===file),bytes=fs.readFileSync(path.join(root,file)),html=g.decodeUTF8(bytes);
 assert.equal((html.match(/(?<!\r)\n/g)||[]).length,1);
 assert.equal(select(html,e),'\r\n');
 const before=g.region(html,e),after=g.replaceRegion(html,e,output),next=g.region(after,e);
 assert.deepEqual(Buffer.from(after.slice(0,next.start)),Buffer.from(html.slice(0,before.start)));
 assert.deepEqual(Buffer.from(after.slice(next.end)),Buffer.from(html.slice(before.end)));
 assert.equal(after.slice(next.start,next.end),output.replace(/\n/g,'\r\n'));
 assert.equal((after.match(/(?<!\r)\n/g)||[]).length,1);
 const at=html.search(/(?<!\r)\n/);assert.equal(after.slice(at-20,at+25),html.slice(at-20,at+25));
 assert.equal(g.replaceRegion(after,e,output),after);
 assert.deepEqual(Buffer.from(html),bytes);
});
for(const newline of ['\n','\r\n'])test('Uniform EOL remains supported: '+JSON.stringify(newline),()=>{
 const {e,html}=fixture({file:'age-calculator.html',newline,ad:ads.replace(/\n/g,newline)});
 assert.equal(select(html,e),newline);
 const after=g.replaceRegion(html,e,output),r=g.region(after,e);
 assert.equal(after.slice(r.start,r.end),output.replace(/\n/g,newline));
 assert.equal(g.replaceRegion(after,e,output),after);
});
test('Reject second bare LF',()=>{const {e,html}=fixture();assert.throws(()=>select(html+'\n',e),/Mixed/);});
test('Reject exception on unapproved filename',()=>{const {e,html}=fixture({file:'age-calculator.html'});assert.throws(()=>select(html,e),/Mixed/);});
test('Reject relocated bare LF outside tag',()=>{const {e,html}=fixture({ad:ads.replace('\n','\r\n')});assert.throws(()=>select(html+'\n',e),/outside AdSense/);});
test('Reject bare LF inside generated content',()=>{const {e,html}=fixture({ad:ads.replace('\n','\r\n'),inside:'\n'});assert.throws(()=>select(html,e),/inside generated/);});
test('Reject relocated LF within opening tag',()=>{const {e,html}=fixture({ad:ads.replace('script async','script\nasync').replace('"\n','" ')});assert.throws(()=>select(html,e),/Altered AdSense/);});
test('Reject altered AdSense context',()=>{
 for(const ad of [ads.replace('anonymous','use-credentials'),ads.replace('ca-pub-3609883417414465','ca-pub-0000000000000000'),ads.replace('crossorigin','data-crossorigin'),ads.replace('adsbygoogle.js','other.js')]){
  const {e,html}=fixture({ad});assert.throws(()=>select(html,e),/Altered AdSense/);
 }
});
test('Reject bare CR',()=>{const {e,html}=fixture();assert.throws(()=>select(html+'\r',e),/Bare CR/);});
test('Reject balanced mixed endings',()=>{const {e,html}=fixture();const mixed=html.replace(/\r\n/g,'');assert.throws(()=>select(mixed+'\r\n',e),/Mixed/);});
test('Strict UTF-8 round trip rejects malformed bytes and retains valid BOM/unicode',()=>{
 for(const bytes of [Buffer.from([0xff]),Buffer.from([0xc3,0x28]),Buffer.from([0xe2,0x82])])assert.throws(()=>g.decodeUTF8(bytes),/UTF-8/);
 for(const text of ['\ufeffExample π\r\n','Replacement character \ufffd\n'])assert.deepEqual(Buffer.from(g.decodeUTF8(Buffer.from(text))),Buffer.from(text));
});
test('--check is zero-write for fresh and stale synthetic views',()=>{
 const plan=g.prepare(),fresh=new Map(plan.map(p=>[p.file,p.after]));let writes=0;
 const view=file=>fresh.has(file)?fresh.get(file):read(file);
 assert.deepEqual(g.run(['--check'],{read:view,write(){writes++;}}),{checked:27,changed:0});
 const p=plan[0],r=g.region(p.after,p);fresh.set(p.file,p.after.slice(0,r.start)+p.after.slice(r.end));
 assert.throws(()=>g.run(['--check'],{read:view,write(){writes++;}}),/Stale/);
 assert.equal(writes,0);
});
test('Any invalid page prevents all generation writes',()=>{
 const bad=g.MANIFEST.at(-1);let writes=0;
 assert.throws(()=>g.run([],{read:file=>file===bad.file?read(file)+'\n':read(file),write(){writes++;}}),/Mixed/);
 assert.equal(writes,0);
});
test('Malformed UTF-8 input prevents all generation writes',()=>{
 const bad=g.MANIFEST.at(-1);let writes=0;
 assert.throws(()=>g.run([],{read:file=>file===bad.file?Buffer.concat([Buffer.from(read(file)),Buffer.from([0xff])]):read(file),write(){writes++;}}),/UTF-8/);
 assert.equal(writes,0);
});
test('Read-only focused tests leave all repository HTML bytes unchanged',()=>{
 const before=g.MANIFEST.map(e=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,e.file))).digest('hex'));
 g.prepare();
 const after=g.MANIFEST.map(e=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,e.file))).digest('hex'));
 assert.deepEqual(after,before);
});

function visibleArticle(html){return html.replace(/<\/?(?:strong|sup)>/g,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();}
test('EMI zero-interest formula is structurally valid with unchanged authored text and order',()=>{
 const runtime=g.loadRuntime(),html=runtime.render('emi-calculator');
 assert.equal(g.validateOutput(html),html);
 assert.ok(html.includes('<div class="finance-formula-box" aria-label="Zero interest EMI formula">'));
 assert.doesNotMatch(html,/<p>\s*class="finance-formula-box"/);
 const start=html.indexOf('<h2>How Does a 0% Interest Loan Work?</h2>');
 assert.ok(start>=0);
 const section=html.slice(start,html.indexOf('<h2>',start+4)),text=visibleArticle(section);
 const ordered=[
  'When the interest rate is 0%, there is no interest component in the basic EMI calculation. The principal is simply divided by the number of monthly installments.',
  '0% Interest Formula',
  'EMI = Principal ÷ Number of Months',
  'For example, a $120,000 loan repaid over 12 months at 0% interest would produce an estimated EMI of $10,000 per month, assuming there are no additional charges.',
  'A lender may still charge fees, insurance, taxes, or other costs, so a 0% stated interest rate does not necessarily mean that the loan has no additional cost.'
 ];
 let position=0;
 for(const wording of ordered){const next=text.indexOf(wording,position);assert.ok(next>=position,wording);position=next+wording.length;}
 const box=section.slice(section.indexOf('<div class="finance-formula-box"'),section.indexOf('</div>')+6);
 assert.ok(box.includes('<span class="formula-label">'));
 assert.ok(box.includes('<div class="formula-expression">'));
});
test('EMI main and Loan/Mortgage formula blocks retain exact existing markup',()=>{
 const runtime=g.loadRuntime();
 const expected=[
  ['emi-calculator','<div class="finance-formula-box" aria-label="EMI formula">\n\n    <span class="formula-label">\n        EMI Formula\n    </span>\n\n    <div class="formula-expression">\n        EMI = P × r × (1 + r)<sup>n</sup>\n        ÷ ((1 + r)<sup>n</sup> − 1)\n    </div>\n\n</div>'],
  ['loan-calculator','<div class="loan-formula-box">\n    Monthly Payment =\n    Loan Principal ÷ Number of Payments\n</div>'],
  ['mortgage-calculator','<div class="mortgage-formula">\n    Monthly Payment = Loan Amount ÷ Total Monthly Payments\n</div>']
 ];
 for(const [key,block] of expected){const html=runtime.render(key);assert.equal(g.validateOutput(html),html);assert.ok(html.includes(block),key+' unchanged formula block');}
});
test('All 27 registered articles pass the unchanged structural validator',()=>{
 const runtime=g.loadRuntime(),keys=runtime.registry.list('articles');assert.equal(keys.length,27);
 assert.deepEqual(Array.from(keys).sort(),g.MANIFEST.map(e=>e.key).sort());
 for(const key of keys){const target={innerHTML:'',classList:{add(){}}};
  assert.equal(runtime.context.ToolXoneArticleRenderer.renderArticle(target,runtime.registry.get('articles',key)),true);
  assert.equal(g.validateOutput(target.innerHTML),target.innerHTML,key);
 }
});


// Independent expectations: never inferred from generator or registry output.
const EXPECTED_MANIFEST=Object.freeze([
 ['age-calculator.html','age-calculator','#financeInfo'],
 ['gpa-cgpa-calculator.html','gpa-cgpa-calculator','#financeInfo'],
 ['calculator.html','basic','#financeInfo'],
 ['bmi-calculator.html','bmi-calculator','#financeInfo'],
 ['bmr-calculator.html','bmr-calculator','#financeInfo'],
 ['body-fat-calculator.html','body-fat-calculator','#financeInfo'],
 ['calorie-calculator.html','calorie-calculator','#healthInfo'],
 ['compound-interest-calculator.html','compound-interest-calculator','#financeInfo'],
 ['currency-converter.html','currency-converter','#financeInfo'],
 ['currency-profit-calculator.html','currency-profit-calculator','#financeInfo'],
 ['discount-calculator.html','discount-calculator','#financeInfo'],
 ['emi-calculator.html','emi-calculator','#financeInfo'],
 ['gst-vat-calculator.html','gst-vat-calculator','#financeInfo'],
 ['inflation-calculator.html','inflation-calculator','#financeInfo'],
 ['loan-calculator.html','loan-calculator','#financeInfo'],
 ['mortgage-calculator.html','mortgage-calculator','#financeInfo'],
 ['percentage-calculator.html','percentage-calculator','#financeInfo'],
 ['profit-margin-calculator.html','profit-margin-calculator','#financeInfo'],
 ['retirement-calculator.html','retirement-calculator','#financeInfo'],
 ['roi-calculator.html','roi-calculator','#financeInfo'],
 ['savings-goal-calculator.html','savings-goal-calculator','#financeInfo'],
 ['scientific-calculator.html','scientific-calculator','#financeInfo'],
 ['qr-code-generator.html','qr-code-generator','#financeInfo'],
 ['weight-converter.html','weight-converter','#financeInfo'],
 ['pdf-tools.html','pdf-tools','#pdfInfo'],
 ['pdf-to-image.html','pdf-to-image','#pdfInfo'],
 ['image-to-pdf.html','image-to-pdf','#pdfInfo']
].map(([file,key,selector])=>Object.freeze({file,key,selector})));
const EXPECTED_DATA_FILES=[
 'js/content/content-data-age.js','js/content/content-data-basic.js',
 'js/content/content-data-bmi.js','js/content/content-data-currency.js',
 'js/content/content-data-education.js',
 'js/content/content-data-finance.js','js/content/content-data-health.js',
 'js/content/content-data-pdf.js','js/content/content-data-percentage.js',
 'js/content/content-data-qr.js','js/content/content-data-scientific.js',
 'js/content/content-data-weight.js'
];
function independentHarness(){
 const vm=require('node:vm');
 class Element{constructor(){this.innerHTML='';this.classList={add(){}};}}
 const target=new Element();
 const context={HTMLElement:Element,location:{pathname:'/index.html'},
  console:{info(){},log(){},warn(){},error(){},debug(){}},addEventListener(){},
  document:{querySelector:selector=>selector===context.currentSelector?target:null},
  fetch(){throw new Error('Network forbidden in independent rendering tests');}};
 context.window=context;vm.createContext(context);
 for(const file of ['js/content/content-registry.js',...EXPECTED_DATA_FILES,
  'js/content/article-renderer.js','js/content/content-integration-engine.js'])
  vm.runInContext(read(file),context,{filename:file,timeout:2000});
 const integration=context.ToolXoneContentIntegrationEngine;
 integration.modules.registry=context.ToolXoneContentRegistry;
 integration.modules.articleRenderer=context.ToolXoneArticleRenderer;
 return {context,target,integration,registry:context.ToolXoneContentRegistry,
  render(key){context.testArticle=context.ToolXoneContentRegistry.get('articles',key);assert.ok(context.testArticle,key);
   context.testTarget=target;
   assert.equal(vm.runInContext('ToolXoneArticleRenderer.renderArticle(testTarget,testArticle)',context,{timeout:2000}),true);
   return target.innerHTML;
  }};
}
function literalRegion(html,e){
 const start='<!-- TOOLXONE:STATIC-ARTICLE:START '+e.key+' -->';
 const end='<!-- TOOLXONE:STATIC-ARTICLE:END '+e.key+' -->';
 assert.equal(html.split(start).length-1,1,e.file+' START count');
 assert.equal(html.split(end).length-1,1,e.file+' END count');
 const a=html.indexOf(start)+start.length,b=html.indexOf(end);
 assert.ok(b>a,e.file+' nonempty ordered region');
 return {start:a,end:b,html:html.slice(a,b)};
}
function expectedPageEOL(html){return html.includes('\r\n')?'\r\n':'\n';}
function articleStatic(key){const e=EXPECTED_MANIFEST.find(e=>e.key===key);assert.ok(e);return literalRegion(read(e.file),e).html;}
function articleHeadingSection(html,heading){
 const marker='<h2>'+heading+'</h2>',start=html.indexOf(marker);assert.ok(start>=0,heading);
 const end=html.indexOf('<h2>',start+marker.length);return html.slice(start,end<0?html.lastIndexOf('</section>'):end);
}
function orderedText(html,values){const text=visibleArticle(html);let at=0;
 for(const value of values){const next=text.indexOf(value,at);assert.ok(next>=at,value);at=next+value.length;}}

test('Frozen exact 27 file/key/selector triples and independent registry parity',()=>{
 assert.equal(EXPECTED_MANIFEST.length,27);
 assert.deepEqual(g.MANIFEST,EXPECTED_MANIFEST);
 assert.equal(new Set(EXPECTED_MANIFEST.map(e=>e.file)).size,27);
 assert.equal(new Set(EXPECTED_MANIFEST.map(e=>e.key)).size,27);
 const app=independentHarness();
 assert.deepEqual(Array.from(app.registry.list('articles')).sort(),EXPECTED_MANIFEST.map(e=>e.key).sort());
});
for(const e of EXPECTED_MANIFEST){
 test('Independent real renderer equals static initial HTML: '+e.file,()=>{
  const html=read(e.file),r=literalRegion(html,e),app=independentHarness();
  const expected=app.render(e.key).replace(/\r\n|\r|\n/g,expectedPageEOL(html));
  assert.equal(r.html,expected);
  assert.deepEqual(g.region(html,e),{start:r.start,end:r.end});
  const bounds=g.targetBounds(html,e.selector);assert.ok(r.start>=bounds.start&&r.end<=bounds.end);
  assert.equal(g.eol(html,e,r),expectedPageEOL(html));
  assert.ok(visibleArticle(r.html).length>100);
 });
 test('Real runtime replaces pre-populated static article twice: '+e.file,()=>{
  const app=independentHarness(),html=read(e.file),r=literalRegion(html,e);
  const expected=app.render(e.key);
  app.context.currentSelector=e.selector;app.context.location.pathname='/'+e.file;
  assert.equal(app.integration.detectCurrentPage(),e.key);
  assert.equal(app.integration.getRenderTargets(e.key).article,e.selector);
  app.target.innerHTML=r.html;
  const article=app.integration.getContent(e.key).article;assert.ok(article);
  assert.equal(app.integration.renderArticle(article,e.selector),true);
  assert.equal(app.target.innerHTML,expected);
  assert.equal(app.integration.renderArticle(article,e.selector),true);
  assert.equal(app.target.innerHTML,expected);
  assert.equal((app.target.innerHTML.match(/<section class="tool-article">/g)||[]).length,1);
  assert.equal((app.target.innerHTML.match(/<h1>/g)||[]).length,1);
  assert.equal(app.target.innerHTML.split('<h1>'+article.title+'</h1>').length-1,1);
  assert.doesNotMatch(app.target.innerHTML,/TOOLXONE:STATIC-ARTICLE:/);
 });
}

const safetyEntry=Object.freeze({file:'weight-converter.html',key:'weight-converter',selector:'#financeInfo'});
const literalStart='<!-- TOOLXONE:STATIC-ARTICLE:START weight-converter -->';
const literalEnd='<!-- TOOLXONE:STATIC-ARTICLE:END weight-converter -->';
const safetyHTML='<!doctype html>\n<div id="financeInfo">'+literalStart+output+literalEnd+'</div>\n';
function zeroWritesForHTML(html){
 let writes=0;
 const first=EXPECTED_MANIFEST[0],current=read(first.file),bounds=literalRegion(current,first);
 const stale=current.slice(0,bounds.start)+current.slice(bounds.end);
 assert.throws(()=>g.run([],{read:file=>file===safetyEntry.file?html:file===first.file?stale:read(file),write(){writes++;}}));
 assert.equal(writes,0,'All-page validation must precede even an earlier stale-page write');
}
const markerCases=[
 ['missing START',safetyHTML.replace(literalStart,'')],
 ['missing END',safetyHTML.replace(literalEnd,'')],
 ['duplicate START',safetyHTML.replace(literalStart,literalStart+literalStart)],
 ['duplicate END',safetyHTML.replace(literalEnd,literalEnd+literalEnd)],
 ['mismatched key',safetyHTML.replace(literalEnd,'<!-- TOOLXONE:STATIC-ARTICLE:END age-calculator -->')],
 ['reversed markers',safetyHTML.replace(literalStart,'REVERSE_START').replace(literalEnd,literalStart).replace('REVERSE_START',literalEnd)],
 ['nested markers',safetyHTML.replace(output,literalStart+output+literalEnd)],
 ['reserved marker',safetyHTML.replace(output,'<!-- TOOLXONE:STATIC-ARTICLE:OTHER weight-converter -->'+output)],
 ['both markers outside target','<!doctype html>\n'+literalStart+output+literalEnd+'<div id="financeInfo"></div>\n'],
 ['END outside target',safetyHTML.replace(literalEnd,'').replace('</div>\n','</div>'+literalEnd+'\n')]
];
for(const [name,html] of markerCases)test('Fail closed marker case: '+name,()=>{
 assert.throws(()=>g.region(html,safetyEntry));assert.throws(()=>g.replaceRegion(html,safetyEntry,output));zeroWritesForHTML(html);
});
for(const [name,html] of [
 ['missing target',safetyHTML.replace('id="financeInfo"','id="other"')],
 ['duplicate target',safetyHTML+'<div id="financeInfo"></div>\n']
])test('Fail closed target case: '+name,()=>{assert.throws(()=>g.targetBounds(html,safetyEntry.selector));zeroWritesForHTML(html);});
for(const selector of ['financeInfo','.financeInfo','#financeInfo > div'])test('Invalid selector rejected: '+selector,()=>{
 assert.throws(()=>g.targetBounds(safetyHTML,selector),/Invalid selector/);
});
const mappingCases=[
 ['wrong key',{key:'missing-article'}],['wrong selector',{selector:'#other'}],
 ['traversal',{file:'../weight-converter.html'}],['Windows absolute path',{file:'D:\\weight-converter.html'}],
 ['slash absolute path',{file:'/weight-converter.html'}],['unexpected root page',{file:'index.html'}],
 ['duplicate file',{file:'age-calculator.html'}],['duplicate key',{key:'age-calculator'}]
];
for(const [name,change] of mappingCases)test('Invalid mapping rejected before source reads: '+name,()=>{
 const manifest=EXPECTED_MANIFEST.map((e,i)=>i===22?{...e,...change}:{...e});let reads=0;
 assert.throws(()=>g.validateManifest(manifest),/Invalid\/duplicate/);
 assert.throws(()=>g.prepare({manifest,read(){reads++;throw new Error('Unexpected read');}}),/Invalid\/duplicate/);
 assert.equal(reads,0);
});
for(const count of [26,28])test('Wrong manifest count rejected: '+count,()=>{
 const manifest=count===26?EXPECTED_MANIFEST.slice(0,26):[...EXPECTED_MANIFEST,EXPECTED_MANIFEST[0]];
 assert.throws(()=>g.validateManifest(manifest),/exactly 27/);
});
test('Missing approved page prevents all writes',()=>{
 let writes=0;
 assert.throws(()=>g.run([],{read:file=>{if(file===safetyEntry.file){const error=new Error('Synthetic missing page');error.code='ENOENT';throw error;}return read(file);},write(){writes++;}}),/Synthetic missing page/);
 assert.equal(writes,0);
});
test('Missing actual registration/key fails real registry lookup and preparation',()=>{
 const view=file=>read(file)+(file==='js/content/content-data-weight.js'?'\ndelete ToolXoneContentRegistry.registry.articles["weight-converter"];':'');
 const runtime=g.loadRuntime(view);assert.equal(runtime.registry.get('articles','weight-converter'),null);
 assert.throws(()=>runtime.render('weight-converter'),/Invalid article/);
 let writes=0;assert.throws(()=>g.run([],{read:view,write(){writes++;}}),/Registry\/manifest mismatch/);assert.equal(writes,0);
});
test('Actual duplicate article registration safeguard rejects a second registration',()=>{
 const view=file=>read(file)+(file==='js/content/content-data-finance.js'?
  '\nToolXoneContentRegistry.register("articles","emi-calculator",ToolXoneContentRegistry.get("articles","emi-calculator"));':'');
 assert.throws(()=>g.loadRuntime(view),/Duplicate article registration/);
 let writes=0;assert.throws(()=>g.run([],{read:view,write(){writes++;}}),/Duplicate article registration/);assert.equal(writes,0);
});

test('Basic Calculator resolves to basic through actual registry slug mapping',()=>{
 const app=independentHarness();app.context.location.pathname='/calculator.html';
 assert.equal(app.integration.detectCurrentPage(),'basic');assert.ok(app.integration.getContent('basic').article);
});
for(const [key,selector] of [['bmr-calculator','#financeInfo'],['body-fat-calculator','#financeInfo'],['pdf-tools','#pdfInfo']])
 test('Special actual article target: '+key,()=>{
  const app=independentHarness();assert.equal(app.integration.getRenderTargets(key).article,selector);
  assert.ok(g.targetBounds(read(key+'.html'),selector));
 });
test('PDF hub leaves FAQ and related selectors unchanged',()=>{
 const app=independentHarness(),targets=app.integration.getRenderTargets('pdf-tools');
 assert.equal(targets.faq,'#financeFAQ');assert.equal(targets.related,'#relatedTools');
 assert.equal(targets.faq,app.integration.renderTargets.default.faq);
 assert.equal(targets.related,app.integration.renderTargets.default.related);
});
test('BMI removes only the competing inline writer and retains review/feedback calls',()=>{
 const html=read('bmi-calculator.html');assert.doesNotMatch(html,/renderFinanceInfo\s*\(/);
 assert.match(html,/renderToolReviews\(\s*"tool-reviews",\s*"BMI Calculator"\s*\)/);
 assert.match(html,/renderFinanceFeedback\("financeFeedback",\s*"BMI Calculator"\)/);
});

test('Currency Profit static HTML preserves representative restored formula/example/list/comparisons',()=>{
 const html=articleStatic('currency-profit-calculator');
 const buying=articleHeadingSection(html,'How Is Buying Cost Calculated?');
 assert.ok(buying.includes('<p>Buying Cost = Currency Amount × Buy Rate</p>'));
 assert.ok(buying.includes('<p>For example, if you evaluate 1,000 units of a currency at a buy rate of 278, the buying cost is 1,000 × 278 = 278,000.</p>'));
 const inputs=articleHeadingSection(html,'What Information Does the Currency Profit Calculator Use?');
 assert.equal((inputs.match(/<li>/g)||[]).length,4);
 orderedText(inputs,['Currency Amount','Buy Rate','Sell Rate','Exchange Fee / Commission']);
 const comparison=articleHeadingSection(html,'Buy Rate vs. Sell Rate: Why the Difference Matters');
 assert.ok(comparison.includes('<li><strong>Sell Rate &gt; Buy Rate</strong>'));
 assert.ok(comparison.includes('<li><strong>Sell Rate &lt; Buy Rate</strong>'));
 assert.equal((comparison.match(/<li>/g)||[]).length,2);
});
test('Currency Profit static HTML preserves all six costs and exactly one disclaimer',()=>{
 const html=articleStatic('currency-profit-calculator'),costs=articleHeadingSection(html,'Important Factors to Consider');
 assert.equal((costs.match(/<li>/g)||[]).length,6);
 orderedText(costs,['Bank or payment-provider fees','Broker commissions','Different quoted buy and sell rates',
  'Transfer or withdrawal charges','Rate changes between transactions','Taxes or other costs where applicable',
  "Include relevant transaction costs in the fee field when you want the calculator's net result to reflect those costs."]);
 assert.equal(html.split('<h2>Important Note</h2>').length-1,1);
 const disclaimer="Currency exchange rates and transaction costs can change, and actual results may differ from calculator estimates. ToolXone's Currency Exchange Profit Calculator is intended for informational and educational calculations and should not be treated as financial, investment, trading, tax, or legal advice.";
 assert.equal(visibleArticle(html).split(disclaimer).length-1,1);
});
test('Static contextual links preserve existing destinations without inventing Currency Profit links',()=>{
 assert.doesNotMatch(articleStatic('currency-profit-calculator'),/<a\b/i);
 assert.match(articleStatic('loan-calculator'),/<a\b[^>]*href="emi-calculator\.html"[^>]*>/);
});
test('QR exact authored introduction occurs once in initial HTML before the first section',()=>{
 const html=articleStatic('qr-code-generator');
 const introduction="Create scannable QR codes online with ToolXone's free QR Code Generator. Generate QR codes for websites, text, email addresses, phone numbers, SMS messages and WiFi information quickly from your browser.";
 assert.equal(html.split(introduction).length-1,1);assert.ok(html.indexOf(introduction)<html.indexOf('<h2>What Is a QR Code Generator?</h2>'));
});
test('Scientific static article preserves corrected reachable-capability guidance',()=>{
 const html=articleStatic('scientific-calculator'),features=articleHeadingSection(html,'Key Features');
 orderedText(features,['square and cube roots',
  'For positive values, nth roots can be calculated using fractional powers such as 27^(1/3).',
  'Values can also be entered as multiplication by powers of ten, such as 1.2*10^3.',
  'There is no dedicated nth-root control, direct exponent-notation input such as 1.2e3, or scientific-notation display mode.']);
 const intro=html.slice(0,html.indexOf('<h2>'));assert.ok(intro.includes('exponents, square and cube roots, constants'));
 const definition=articleHeadingSection(html,'What is a Scientific Calculator?');assert.ok(definition.includes('factorials and fractions'));assert.doesNotMatch(definition,/scientific notation/i);
});
test('Scientific initial HTML retains the existing registry-bound square control',()=>{
 const html=read('scientific-calculator.html');
 const buttons=[...html.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/g)].map(m=>m[0]);
 const square=buttons.filter(button=>/\bdata-sci-function="square"/.test(button));
 assert.equal(square.length,1);
 assert.match(square[0],/\bdata-sci-action="registry-function"/);
 assert.match(square[0],/\bdata-sci-value="square"/);
 assert.match(square[0],/>\s*x²\s*<\/button>/);
});

const scannerFixtures=[
 ['quoted greater-than','<div id="financeInfo" data-note="a > b">',output,'</div>'],
 ['fake target in comment','<!-- <div id="financeInfo">fake</div> --><div id="financeInfo">',output,'</div>'],
 ['fake target in script','<script>const fake=\'<div id="financeInfo">fake</div>\';</script><div id="financeInfo">',output,'</div>'],
 ['fake target in style','<style>.test::after{content:"<div id=\"financeInfo\">fake</div>";}</style><div id="financeInfo">',output,'</div>'],
 ['nested section target','<section id="financeInfo">','<section><section data-note="a > b">nested</section></section>','</section>']
];
for(const [name,prefix,inside,suffix] of scannerFixtures)test('Scanner independently bounded fixture: '+name,()=>{
 const html=prefix+literalStart+inside+literalEnd+suffix+'\n';
 assert.deepEqual(g.targetBounds(html,'#financeInfo'),{start:prefix.length,end:prefix.length+literalStart.length+inside.length+literalEnd.length});
 const expectedStart=prefix.length+literalStart.length,expectedEnd=expectedStart+inside.length;
 assert.deepEqual(g.region(html,safetyEntry),{start:expectedStart,end:expectedEnd});
 const replaced=g.replaceRegion(html,safetyEntry,output);
 assert.deepEqual(Buffer.from(replaced),Buffer.from(prefix+literalStart+output+literalEnd+suffix+'\n'));
 assert.deepEqual(Buffer.from(replaced.slice(0,expectedStart)),Buffer.from(html.slice(0,expectedStart)));
 assert.deepEqual(Buffer.from(replaced.slice(expectedStart+output.length)),Buffer.from(html.slice(expectedEnd)));
});
for(const [name,html] of [
 ['unclosed comment','<!-- unclosed <div id="financeInfo">'],
 ['unclosed raw text','<script>fake <div id="financeInfo">'],
 ['unclosed target','<section id="financeInfo"><section>nested</section>'],
 ['mismatched target nesting','<section id="financeInfo"><div></section></div>']
])test('Scanner fails closed: '+name,()=>{assert.throws(()=>g.targetBounds(html,'#financeInfo'));});
