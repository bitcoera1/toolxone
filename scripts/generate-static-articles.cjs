'use strict';
const fs=require('node:fs'), path=require('node:path'), vm=require('node:vm');
const ROOT=path.resolve(__dirname,'..');
const MANIFEST=Object.freeze([
['age-calculator.html','age-calculator','#financeInfo'],
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
const DATA_FILES=Object.freeze(['age','basic','bmi','currency','finance','health','pdf','percentage','qr','scientific','weight'].map(n=>`js/content/content-data-${n}.js`));
const VOID=new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
function fail(message){throw new Error(message);}
// Quote-aware tokenizer skips comments and raw text rather than interpreting fake tags.
function scan(html){
 const tokens=[]; let i=0;
 while(i<html.length){
  if(html[i]!=='<'){i++;continue;}
  const start=i;
  if(html.startsWith('<!--',i)){
   const end=html.indexOf('-->',i+4);if(end<0)fail('Unclosed comment');
   tokens.push({kind:'comment',start,end:end+3,text:html.slice(start,end+3)});i=end+3;continue;
  }
  let quote=null;
  for(i++;i<html.length;i++){
   const ch=html[i];if(quote){if(ch===quote)quote=null;}
   else if(ch==='"'||ch==="'")quote=ch;else if(ch==='>')break;
  }
  if(i>=html.length)fail('Unclosed tag');
  const text=html.slice(start,++i);if(/^<!|^<\?/.test(text))continue;
  const m=text.match(/^<\s*(\/?)\s*([a-z][\w:-]*)\b([\s\S]*?)>$/i);if(!m)fail('Malformed tag');
  const name=m[2].toLowerCase();tokens.push({kind:'tag',start,end:i,text,name,close:!!m[1],attrs:m[3]});
  if(!m[1]&&['script','style','textarea','title'].includes(name)){
   const closing=new RegExp(`<\\/\\s*${name}\\s*>`,'ig');closing.lastIndex=i;const end=closing.exec(html);
   if(!end)fail('Unclosed raw text');
   tokens.push({kind:'tag',start:end.index,end:closing.lastIndex,name,close:true,attrs:'',text:end[0]});i=closing.lastIndex;
  }
 }
 return tokens;
}
function attributes(t){
 const result={},pattern=/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;let m;
 while((m=pattern.exec(t.attrs))){const key=m[1].toLowerCase();if(Object.hasOwn(result,key))fail('Duplicate attribute');result[key]=m[2]??m[3]??m[4]??'';}
 return result;
}
function targetBounds(html,selector){
 if(!/^#[a-zA-Z][\w-]*$/.test(selector))fail('Invalid selector');
 const tokens=scan(html),matches=tokens.filter(t=>t.kind==='tag'&&!t.close&&attributes(t).id===selector.slice(1));
 if(matches.length!==1)fail('Missing/duplicate target: '+selector);
 const target=matches[0],stack=[];if(!['div','section'].includes(target.name))fail('Unsupported target');
 for(const t of tokens.filter(t=>t.start>=target.start)){
  if(t.kind!=='tag')continue;
  if(t.close){if(stack.pop()!==t.name)fail('Malformed target nesting');if(!stack.length)return {start:target.end,end:t.start};}
  else if(!VOID.has(t.name))stack.push(t.name);
 }
 fail('Unclosed target');
}
function markers(key){return {start:`<!-- TOOLXONE:STATIC-ARTICLE:START ${key} -->`,end:`<!-- TOOLXONE:STATIC-ARTICLE:END ${key} -->`};}
function region(html,entry){
 const bounds=targetBounds(html,entry.selector),expected=markers(entry.key);
 const comments=scan(html).filter(t=>t.kind==='comment'&&t.text.includes('TOOLXONE:STATIC-ARTICLE:'));
 if(comments.length!==2||comments[0].text!==expected.start||comments[1].text!==expected.end)fail('Invalid markers: '+entry.file);
 if(comments[0].start<bounds.start||comments[1].end>bounds.end||comments[0].end>comments[1].start)fail('Markers outside target');
 if(html.slice(bounds.start,comments[0].start).trim()||html.slice(comments[1].end,bounds.end).trim())fail('Unexpected target content');
 return {start:comments[0].end,end:comments[1].start};
}
const EOL_EXCEPTIONS=new Set([
 'discount-calculator.html','emi-calculator.html','loan-calculator.html','mortgage-calculator.html',
 'roi-calculator.html','savings-goal-calculator.html','qr-code-generator.html','weight-converter.html'
]);
function eol(html,entry,bounds){
 if(/\r(?!\n)/.test(html))fail('Bare CR line ending');
 const crlf=(html.match(/\r\n/g)||[]).length;
 const bare=[...html.matchAll(/(?<!\r)\n/g)];
 if(!crlf&&!bare.length)fail('Missing line-ending convention');
 if(!bare.length)return '\r\n';
 if(!crlf)return '\n';
 if(!entry||!bounds||!EOL_EXCEPTIONS.has(entry.file)||bare.length!==1||crlf<=bare.length)
  fail('Mixed/unsupported line endings');
 const at=bare[0].index;
 if(at>=bounds.start&&at<bounds.end)fail('Mixed endings inside generated region');
 const tag=scan(html).find(t=>t.kind==='tag'&&!t.close&&t.name==='script'&&at>t.start&&at<t.end);
 if(!tag)fail('Line-ending anomaly outside AdSense opening tag');
 const attrs=attributes(tag);
 const src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3609883417414465';
 const local=tag.text.match(/\bsrc="([^"]*)"(\n)[ \t]+crossorigin="anonymous"/);
 if(attrs.src!==src||attrs.crossorigin!=='anonymous'||!local||local[1]!==src||
    tag.start+local.index+local[0].indexOf('\n')!==at)
  fail('Altered AdSense line-ending context');
 return '\r\n';
}
function decodeUTF8(bytes){
 if(!Buffer.isBuffer(bytes))fail('Expected input bytes');
 const text=bytes.toString('utf8');
 if(!Buffer.from(text,'utf8').equals(bytes))fail('Non-round-trippable UTF-8 input');
 return text;
}
function validateOutput(html){
 if(!html.trim()||/undefined|\[object Object\]|TOOLXONE:STATIC-ARTICLE:/.test(html))fail('Unexpected renderer output');
 const stack=[];let wrappers=0;
 for(const t of scan(html)){
  if(t.kind!=='tag')continue;
  if(t.close){if(stack.pop()!==t.name)fail('Malformed article output');continue;}
  const attrs=attributes(t);
  if(t.name==='script'||Object.keys(attrs).some(k=>/^on/i.test(k))||Object.entries(attrs).some(([k,v])=>['href','src'].includes(k)&&/^\s*javascript:/i.test(v)))fail('Executable article output');
  if((attrs.class||'').split(/\s+/).includes('tool-article'))wrappers++;
  if(!VOID.has(t.name))stack.push(t.name);
 }
 if(stack.length||wrappers!==1||!/<h[1-6]\b/i.test(html))fail('Invalid article wrapper/content');return html;
}
function replaceRegion(html,entry,output){
 validateOutput(output);const bounds=region(html,entry),newline=eol(html,entry,bounds);
 return html.slice(0,bounds.start)+output.replace(/\r\n|\r|\n/g,newline)+html.slice(bounds.end);
}
function validateManifest(manifest){
 if(manifest.length!==26)fail('Expected exactly 26 mappings');const files=new Set(),keys=new Set();
 for(const e of manifest){const approved=MANIFEST.find(m=>m.file===e.file);
  if(!approved||e.key!==approved.key||e.selector!==approved.selector||files.has(e.file)||keys.has(e.key))fail('Invalid/duplicate mapping');files.add(e.file);keys.add(e.key);
 }
}
const readSource=file=>decodeUTF8(fs.readFileSync(path.join(ROOT,file)));
function loadRuntime(read=readSource){
 class Element{constructor(){this.innerHTML='';this.classList={add(){}};}}
 const context={HTMLElement:Element,document:{querySelector(){return null;}},console:{info(){},log(){},warn(){},error(){},debug(){}},addEventListener(){},fetch(){fail('Network forbidden');}};
 context.window=context;vm.createContext(context);
 const execute=file=>vm.runInContext(read(file),context,{filename:file,timeout:2000});execute('js/content/content-registry.js');
 const registry=context.ToolXoneContentRegistry,register=registry.register,seen=new Set();
 registry.register=function(type,key,data){if(type==='articles'){if(seen.has(key))fail('Duplicate article registration');seen.add(key);}return register(type,key,data);};
 for(const file of DATA_FILES)execute(file);execute('js/content/article-renderer.js');context.staticTarget=new Element();
 return {context,registry,render(key){
  const a=registry.get('articles',key);
  if(!a||typeof a.title!=='string'||!a.title.trim()||(!(typeof a.html==='string'&&a.html.trim())&&(!Array.isArray(a.sections)||!a.sections.length||a.sections.some(s=>typeof s.heading!=='string'||!s.heading.trim()||typeof s.content!=='string'||!s.content.trim()))))fail('Invalid article: '+key);
  context.staticArticle=a;if(vm.runInContext('ToolXoneArticleRenderer.renderArticle(staticTarget, staticArticle)',context,{timeout:2000})!==true)fail('Renderer failed');return validateOutput(context.staticTarget.innerHTML);
 }};
}
function prepare({manifest=MANIFEST,read=readSource}={}){
 validateManifest(manifest);const runtime=loadRuntime(read),keys=runtime.registry.list('articles');
 if(keys.length!==26||manifest.some(m=>!keys.includes(m.key)))fail('Registry/manifest mismatch');
 return manifest.map(entry=>{const input=read(entry.file),before=Buffer.isBuffer(input)?decodeUTF8(input):input,output=runtime.render(entry.key),after=replaceRegion(before,entry,output);return {...entry,before,after,output,changed:before!==after};});
}
function run(args,{read,write=(file,text)=>fs.writeFileSync(path.join(ROOT,file),text,'utf8')}={}){
 if(args.length>1||(args.length&&args[0]!=='--check'))fail('Unknown arguments');
 const plan=prepare({read}),changed=plan.filter(p=>p.changed);
 // Validate every page before writing any page.
 if(args[0]==='--check'){if(changed.length)fail('Stale generated articles: '+changed.map(p=>p.file).join(', '));}
 else for(const item of changed)write(item.file,item.after);
 return {checked:plan.length,changed:changed.length};
}
module.exports={MANIFEST,DATA_FILES,scan,targetBounds,markers,region,eol,decodeUTF8,validateOutput,replaceRegion,validateManifest,loadRuntime,prepare,run};
if(require.main===module){try{const r=run(process.argv.slice(2));console.log(`Articles: ${r.checked}; changed: ${r.changed}`);}catch(error){console.error(error.message);process.exitCode=1;}}
