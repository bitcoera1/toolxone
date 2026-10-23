'use strict';
// Actual registries/config/renderers, in-memory DOM; no network, Git or file writes.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const g=require('../scripts/generate-static-articles.cjs'),root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ids=['pdf-to-image','image-to-pdf'];
const unavailable=/merge-pdf|split-pdf|extract-pdf|remove-pdf-pages|reorder-pdf-pages|compress-pdf|optimize-pdf|repair-pdf|word-to-pdf|excel-to-pdf|powerpoint-to-pdf|pdf-to-office|rotate-pdf|crop-pdf|watermark-pdf|add-page-numbers|edit-pdf|protect-pdf|unlock-pdf|sign-pdf|redact-pdf|ocr-pdf|pdf-metadata|summarize-pdf|ask-pdf|translate-pdf|Organize PDF|Compress & Optimize|PDF Security|Extract & OCR|PDF Intelligence/i;
function links(html){return [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>m[1]);}
function runtime(page='pdf-tools.html'){
 const elements={},events=[];
 class Element{
  constructor(){this._html='';this.children=[];this.hidden=false;this.dataset={};this.style={removeProperty(){}};this.value='';this.textContent='';this.listeners={};this.classList={add(){},remove(){},toggle(){},contains(){return false;}};}
  set innerHTML(s){this._html=s;this.children=links(s).map(()=>new Element());}get innerHTML(){return this._html;}
  setAttribute(k,v){this[k]=v;}getAttribute(k){return this[k]||null;}querySelectorAll(){return [];}querySelector(){return null;}addEventListener(k,fn){this.listeners[k]=fn;}appendChild(e){this.children.push(e);return e;}remove(){}scrollIntoView(){}getBoundingClientRect(){return {width:600,height:400};}
 }
 for(const m of read(page).matchAll(/\bid="([^"]+)"/g))elements[m[1]]=new Element();
 const c={console:{info(){},log(){},warn(){},error(){}},location:{href:''},document:{readyState:'loading',documentElement:{dataset:{}},head:{appendChild(){}},getElementById:id=>elements[id]||null,querySelectorAll:()=>[],createElement:()=>new Element(),addEventListener:(name,fn)=>events.push(fn)},addEventListener(){},fetch(){throw new Error('Network forbidden');}};c.window=c;vm.createContext(c);const load=file=>vm.runInContext(read(file),c,{filename:file});return {c,elements,events,load};
}
function hub(){const h=runtime();for(const p of ['js/config.js','js/config/tools-registry.js','js/tool-cards.js','js/pdf/pdf-category-config.js','js/pdf/pdf-registry.js','js/pdf/pdf-tools.js'])h.load(p);h.c.ToolXonePDFTools.init();return h;}
test('PDF config contains one conversion category and exactly the two available tools',()=>{
 const {c}=hub(),cfg=c.ToolXonePDFCategory;assert.deepEqual(Array.from(cfg.getToolIds()),ids);assert.equal(cfg.subcategories.length,1);assert.equal(cfg.subcategories[0].id,'convert');assert.deepEqual(Array.from(cfg.getFeaturedTools()),ids);assert.deepEqual(Array.from(cfg.conversionWorkflows,w=>w.id).sort(),[...ids].sort());assert.deepEqual(JSON.parse(JSON.stringify(cfg.capabilities)),{convert:true});assert.deepEqual(Array.from(cfg.getNavigation(),n=>n.id),['convert']);assert.equal(cfg.developmentPriority,undefined);assert.ok(cfg.conversionWorkflows.every(w=>!('futureOptions' in w)));
});
test('No unavailable catalog entries, flags or claims remain in PDF config/registry',()=>{
 const {c}=hub();assert.doesNotMatch(read('js/pdf/pdf-category-config.js'),unavailable);assert.doesNotMatch(JSON.stringify(c.ToolXonePDFCategory),unavailable);assert.doesNotMatch(JSON.stringify(c.ToolXonePDFRegistry),unavailable);assert.doesNotMatch(c.getPDFCategory().description,/manag|edit/i);
});
test('PDF registry retains exactly the two original active identities and engine mappings',()=>{
 const {c}=hub();assert.deepEqual(JSON.parse(JSON.stringify(c.getAllPDFTools())),[{id:'pdf-to-image',name:'PDF to Image',file:'pdf-to-image.html',engine:'pdf-to-image.js',status:'active'},{id:'image-to-pdf',name:'Image to PDF',file:'image-to-pdf.html',engine:'image-to-pdf.js',status:'active'}]);assert.equal(c.getActivePDFTools().length,2);for(const id of ids)assert.equal(c.getPDFTool(id).status,'active');assert.equal(c.getPDFTool('missing-pdf-tool'),null);
});
test('Global registry PDF relationships resolve only to real current tools',()=>{
 const {c}=hub(),pdf=c.ToolXoneToolsRegistry.filter(t=>t.categoryId==='pdf');assert.deepEqual(Array.from(pdf,t=>t.id).sort(),[...ids].sort());for(const t of pdf)for(const id of t.related)assert.ok(ids.includes(id));assert.equal(c.ToolXoneToolsRegistry.filter(t=>t.active).length,25);
});
test('Hub HTML contains only conversion and retains its article/FAQ/related targets',()=>{
 const html=read('pdf-tools.html');assert.deepEqual([...html.matchAll(/<section\s+id="pdf-([^"]+)"[^>]*data-pdf-category="([^"]+)"/g)].map(m=>m[2]),['convert']);assert.doesNotMatch(html,/id="pdf-(?:organize|compress|edit|security|extract|intelligence)/);for(const id of ['pdf-convert','pdf-convert-heading','pdf-convert-tools','pdfInfo','pdfFAQ','relatedTools'])assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id);
});
test('Real hub renders only active conversions, working navigation and lookup destinations',()=>{
 const h=hub();assert.deepEqual(links(h.elements['pdf-convert-tools'].innerHTML),['pdf-to-image.html','image-to-pdf.html']);assert.deepEqual(links(h.elements.pdfFeaturedTools.innerHTML),['pdf-to-image.html','image-to-pdf.html']);assert.deepEqual(links(h.elements.pdfCategoryNav.innerHTML),['#pdf-convert']);assert.equal(h.elements['pdf-convert'].hidden,false);assert.doesNotMatch(h.elements['pdf-convert-heading'].innerHTML,unavailable);assert.equal(h.c.ToolXonePDFTools.getCategories().length,1);assert.equal(h.c.ToolXonePDFTools.searchTools('Image').length,2);for(const id of ids){h.c.ToolXonePDFTools.openTool(id);assert.equal(h.c.location.href,id+'.html');}const before=h.elements['pdf-convert-tools'].innerHTML;h.c.ToolXonePDFTools.init();assert.equal(h.elements['pdf-convert-tools'].innerHTML,before);
});
test('Hub article, FAQ, hero, metadata and schema describe supported availability; static article stays current',()=>{
 const r=g.loadRuntime(),key='pdf-tools';let schema;r.context.ToolXoneSchemaRegistry={register(name,data){schema=data;}};vm.runInContext(read('js/seo/schemas/pdf-tools-schema.js'),r.context);for(const type of ['articles','faq','hero','metadata','related'])assert.doesNotMatch(JSON.stringify(r.registry.get(type,key)),unavailable);assert.doesNotMatch(JSON.stringify(schema),unavailable);const output=r.render(key),entry={file:'pdf-tools.html',key,selector:'#pdfInfo'},html=read(entry.file),region=g.region(html,entry);assert.equal(html.slice(region.start,region.end),output.replace(/\n/g,g.eol(html,entry,region)));assert.match(output,/PDF to Image/);assert.match(output,/Image to PDF/);
});
test('Actual converter APIs initialize and preserve no-input validation',async()=>{
 const image=runtime('image-to-pdf.html');image.load('js/pdf/image-to-pdf.js');for(const fn of image.events)fn();assert.equal(typeof image.c.ToolXoneImageToPDF.generate,'function');await image.c.ToolXoneImageToPDF.generate();assert.match(image.elements.imagePdfFileStatus.textContent,/Please add at least one image/);
 const pdf=runtime('pdf-to-image.html');pdf.load('js/pdf/pdf-to-image.js');for(const fn of pdf.events)fn();assert.equal(typeof pdf.c.ToolXonePDFToImage.loadFile,'function');await pdf.c.ToolXonePDFToImage.convert();assert.match(pdf.elements.pdfImageFileStatus.textContent,/Please upload a PDF first/);
});
const frozen={
 'js/pdf/pdf-to-image.js':'ff91b8340d1cfe6c7b99a535829fabd0fe5f09e75f8941a11a9df43e9b3b5788',
 'js/pdf/image-to-pdf.js':'a0c98eb670d8be0c2a8086c352079dc95426d830c030937351826c78ba05bfa1',
 'pdf-to-image.html':'142166869610e3f14ef4d3fde7bf35d5f1ac7dd2f375b03b033cf1e73638063f',
 'image-to-pdf.html':'ee99c19df2a7f15d4c938dd76482051d7eb3cc23809d9e2ae9dae86ce57921ab'
};
for(const [file,hash]of Object.entries(frozen))test('Existing converter implementation unchanged: '+file,()=>assert.equal(crypto.createHash('sha256').update(read(file).replace(/\r\n/g,'\n')).digest('hex'),hash));

