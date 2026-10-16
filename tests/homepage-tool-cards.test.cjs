'use strict';
// Real registry, card renderer and app initialization; in-memory DOM only, no network or writes.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const expected=['calculator.html','scientific-calculator.html','percentage-calculator.html','bmi-calculator.html','bmr-calculator.html','body-fat-calculator.html','calorie-calculator.html','loan-calculator.html','emi-calculator.html','mortgage-calculator.html','compound-interest-calculator.html','roi-calculator.html','profit-margin-calculator.html','discount-calculator.html','gst-vat-calculator.html','inflation-calculator.html','currency-profit-calculator.html','savings-goal-calculator.html','retirement-calculator.html','currency-converter.html','weight-converter.html','age-calculator.html','qr-code-generator.html','pdf-to-image.html','image-to-pdf.html'];
function anchors(html){return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(m=>({href:m[1].match(/\bhref="([^"]+)"/)?.[1],classes:(m[1].match(/\bclass="([^"]*)"/)?.[1]||'').trim().split(/\s+/),content:m[2]}));}
function harness(){
 const html=read('index.html'),elements={},events={},scrolls=[];
 class Element{constructor(id){this.id=id;this._html='';this.listeners={};}set innerHTML(value){this._html=value;for(const m of value.matchAll(/\bid="([^"]+)"/g))elements[m[1]]=new Element(m[1]);}get innerHTML(){return this._html;}addEventListener(name,fn){this.listeners[name]=fn;}scrollIntoView(options){scrolls.push({id:this.id,options});}}
 for(const m of html.matchAll(/\bid="([^"]+)"/g))elements[m[1]]=new Element(m[1]);
 const c={console:{info(){},log(){},warn(){}},document:{head:{appendChild(){}},createElement(){return {};},body:{dataset:{}},getElementById:id=>elements[id]||null,querySelectorAll:()=>[],addEventListener:(name,fn)=>events[name]=fn},addEventListener(){},setTimeout(){},requestAnimationFrame(){},fetch(){throw new Error('Network forbidden');}};c.window=c;vm.createContext(c);
 for(const p of ['js/config.js','js/tool-cards.js','js/config/tools-registry.js','js/app.js'])vm.runInContext(read(p),c,{filename:p});
 events.DOMContentLoaded();
 const individuals=anchors(elements['category-tool-sections'].innerHTML).filter(a=>a.classes.includes('tool-card'));
 const gateways=anchors(elements.categoryCards.innerHTML).filter(a=>a.classes.includes('category-card--showcase'));
 return {html,c,elements,events,scrolls,individuals,gateways};
}
test('Homepage initializes exactly 25 individual cards plus the separate PDF gateway, with 26 unique destinations',()=>{
 const h=harness(),all=[...h.individuals,...h.gateways];assert.equal(h.individuals.length,25);assert.equal(h.gateways.length,1);assert.equal(all.length,26);assert.equal(new Set(all.map(a=>a.href)).size,26);assert.deepEqual(h.individuals.map(a=>a.href).sort(),[...expected].sort());assert.equal(h.gateways[0].href,'pdf-tools.html');
});
test('Every active canonical registry tool remains represented exactly once and the gateway remains outside that registry',()=>{
 const h=harness(),active=h.c.ToolXoneToolsRegistry.filter(t=>t.active===true);assert.equal(active.length,25);assert.ok(!active.some(t=>t.url==='pdf-tools.html'));
 for(const tool of active){const matches=h.individuals.filter(a=>a.href===tool.url);assert.equal(matches.length,1,tool.id);assert.ok(matches[0].content.includes(tool.name));assert.ok(fs.existsSync(path.join(root,tool.url)));}assert.ok(fs.existsSync(path.join(root,'pdf-tools.html')));
});
test('Canonical category membership and category navigation remain intact',()=>{
 const h=harness(),output=h.elements['category-tool-sections'].innerHTML;
 for(const category of h.c.TOOLXONE.getCategories()){const marker='<section\n                        id="'+category.id+'"';assert.ok(output.includes(marker),category.id);const start=output.indexOf(marker),next=output.indexOf('<section\n                        id="',start+marker.length),section=output.slice(start,next<0?undefined:next);assert.deepEqual(anchors(section).filter(a=>a.classes.includes('tool-card')).map(a=>a.href).sort(),Array.from(category.tools,t=>t.link).sort());h.c.scrollToCategory(category.id);assert.equal(h.scrolls.at(-1).id,category.id);}
});
test('Redundant collection containers and the empty recommended section are absent',()=>{
 const h=harness();for(const id of ['toolCards','newTools','recommendedTools','recommended-section'])assert.equal(h.elements[id],undefined,id);
 assert.equal((h.html.match(/id="dashboard"/g)||[]).length,1);assert.equal((h.html.match(/id="whats-new"/g)||[]).length,1);
});
test('Featured and New fragment destinations retain non-card discovery links matching current configuration',()=>{
 const h=harness();for(const [id,label,tools]of [['dashboard','Featured tools',h.c.TOOLXONE.getFeaturedTools()],['whats-new','Recently added tools',h.c.TOOLXONE.getNewestTools()]]){
 const match=h.html.match(new RegExp('<section id="'+id+'">([\\s\\S]*?)<ul aria-label="'+label+'">([\\s\\S]*?)<\\/ul>'));assert.ok(match,id);const links=anchors(match[2]);assert.deepEqual(links.map(a=>a.href),Array.from(tools,t=>t.url||t.link));assert.ok(links.every(a=>!a.classes.includes('tool-card')));
 }
});
test('Browse All Tools scrolls to the actual canonical card collection',()=>{
 const h=harness();h.elements.exploreToolsBtn.listeners.click();assert.equal(h.scrolls.length,1);assert.equal(h.scrolls[0].id,'category-tool-sections');assert.equal(h.scrolls[0].options.behavior,'smooth');assert.ok(h.elements['category-tool-sections'].innerHTML.includes('tool-card'));
});
test('Existing navbar/footer homepage fragment destinations resolve to meaningful retained sections',()=>{
 const h=harness();for(const file of ['js/navbar.js','js/footer.js'])for(const m of read(file).matchAll(/href="index\.html#([^"]+)"/g)){assert.ok(h.elements[m[1]],file+' #'+m[1]);assert.ok(['dashboard','whats-new','categories-section'].includes(m[1]));}
});
test('Repeated actual app initialization replaces category output without duplicating cards or the PDF gateway',()=>{
 const h=harness(),cards=h.elements['category-tool-sections'].innerHTML,gateway=h.elements.categoryCards.innerHTML;h.events.DOMContentLoaded();assert.equal(h.elements['category-tool-sections'].innerHTML,cards);assert.equal(h.elements.categoryCards.innerHTML,gateway);assert.equal(anchors(cards).filter(a=>a.classes.includes('tool-card')).length,25);assert.equal(anchors(gateway).filter(a=>a.href==='pdf-tools.html').length,1);
});
