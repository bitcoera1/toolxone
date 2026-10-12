'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const g=require('../scripts/generate-static-articles.cjs');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const now='2026-10-11T12:00:00.000Z',stamp=172800;
const q='How often are the exchange rates updated?';
const a='ExchangeRate-API’s open endpoint updates its rate data once per day. ToolXone requests the latest available data when you perform a conversion. Retrieval time is separate from the provider’s rate-data update time.';
function harness(kind,value=stamp){
 const elements={},events={},intervals=[],calls=[],stats=[];
 const ids=kind==='home'?{heroBaseCurrency:'PKR',heroForexRows:'',marketTime:''}:{amount:'10',fromCurrency:'USD',toCurrency:'EUR',result:'',statusBar:'',chartTitle:'',currencyRetrievedAt:'',currencyRateUpdatedAt:''};
 for(const [id,val] of Object.entries(ids))elements[id]={value:val,innerHTML:'',textContent:'',listeners:{},addEventListener(n,fn){this.listeners[n]=fn;}};
 class Clock extends Date{constructor(...args){super(...(args.length?args:[now]));}}
 const ctx={Date:Clock,console:{error(){},info(){},warn(){},log(){}},document:{getElementById:id=>elements[id]||null,querySelectorAll:()=>[],addEventListener:(n,fn)=>events[n]=fn},setInterval:(fn,ms)=>intervals.push({fn,ms}),ToolXoneStatisticsEvents:{recordCalculation:k=>stats.push(k)}};
 ctx.fetch=async url=>{calls.push(url);const quote=kind==='home'?elements.heroBaseCurrency.value:elements.toCurrency.value;return {ok:true,json:async()=>url.includes('open.er-api.com')?{rates:{PKR:2,USD:0.5,EUR:2},...(value===undefined?{}:{time_last_update_unix:value})}:[{quote,rate:1,date:'2026-10-01'},{quote,rate:2,date:'2026-10-02'}]};};
 ctx.window=ctx;vm.createContext(ctx);vm.runInContext(read(kind==='home'?'js/home-forex.js':'js/currency-converter.js'),ctx);
 return {ctx,e:elements,events,intervals,calls,stats,run:()=>kind==='home'?ctx.loadHeroSnapshot():ctx.convertCurrency()};
}
for(const file of ['index.html','currency-converter.html'])test('Initial attribution and truthful copy: '+file,()=>{
 const html=read(file);assert.equal((html.match(/<a href="https:\/\/www\.exchangerate-api\.com">Rates By Exchange Rate API<\/a>/g)||[]).length,1);
 assert.doesNotMatch(html,/Live Financial Snapshot|Real-time exchange rates|● LIVE|Auto Updates Every Minute|live exchange rates/i);
});
test('Homepage per-response timestamps remain separate from refresh and history',async()=>{
 const h=harness('home');let next=stamp;const fetch=h.ctx.fetch;
 h.ctx.fetch=async url=>url.includes('open.er-api.com')?{ok:true,json:async()=>({rates:{PKR:2},time_last_update_unix:next++})}:fetch(url);
 await h.run();for(let i=0;i<4;i++)assert.ok(h.e.heroForexRows.innerHTML.includes(new Date((stamp+i)*1000).toISOString()));
 assert.equal(h.e.marketTime.textContent,now);assert.match(h.e.heroForexRows.innerHTML,/2\.0000/);assert.match(h.e.heroForexRows.innerHTML,/\+100\.00%/);
 assert.equal(h.calls.filter(x=>x.includes('frankfurter')).length,4);
});
test('Homepage identity/polling/selection are preserved',async()=>{
 const h=harness('home');h.e.heroBaseCurrency.value='USD';await h.run();assert.match(h.e.heroForexRows.innerHTML,/Same-currency rate; provider update not applicable/);assert.match(h.e.heroForexRows.innerHTML,/1\.0000/);assert.ok(!h.calls.includes('https://open.er-api.com/v6/latest/USD'));
 h.events.DOMContentLoaded();assert.equal(h.intervals[0].ms,60000);assert.equal(h.e.heroBaseCurrency.listeners.change,h.ctx.loadHeroSnapshot);await h.intervals[0].fn();
 assert.ok(read('index.html').includes('Checks every minute; provider updates daily'));
});
test('Converter arithmetic, formatting, retrieval and statistics remain intact',async()=>{
 const h=harness('converter');await h.run();assert.equal(h.e.currencyRetrievedAt.textContent,now);assert.equal(h.e.currencyRateUpdatedAt.textContent,'1970-01-03T00:00:00.000Z');
 assert.match(h.e.result.innerHTML,/20\.00 EUR/);assert.match(h.e.result.innerHTML,/1 USD =\s+2 EUR/);assert.deepEqual(h.stats,['currency-converter']);
});
for(const value of [null,'172800',0,-1,1.5,NaN,Infinity,1e20])test('Invalid timestamp: '+String(value),async()=>{
 for(const kind of ['home','converter']){const h=harness(kind,value);await h.run();if(kind==='home')assert.equal((h.e.heroForexRows.innerHTML.match(/Rate data updated: Unavailable/g)||[]).length,4);else{assert.equal(h.e.currencyRateUpdatedAt.textContent,'Unavailable');assert.equal(h.e.currencyRetrievedAt.textContent,now);assert.equal(h.stats.length,1);}}
});
test('Missing timestamp never substitutes browser time',async()=>{
 for(const kind of ['home','converter']){const h=harness(kind);const fetch=h.ctx.fetch;h.ctx.fetch=async url=>{const r=await fetch(url),data=await r.json();delete data.time_last_update_unix;return {ok:true,json:async()=>data};};await h.run();if(kind==='home')assert.equal((h.e.heroForexRows.innerHTML.match(/Rate data updated: Unavailable/g)||[]).length,4);else assert.equal(h.e.currencyRateUpdatedAt.textContent,'Unavailable');}
});
test('Loading/error clears old homepage freshness',async()=>{
 const h=harness('home');await h.run();h.ctx.fetch=()=>new Promise(()=>{});h.run();assert.equal(h.e.marketTime.textContent,'Unavailable');h.ctx.fetch=async()=>({ok:false});await h.run();assert.equal(h.e.marketTime.textContent,'Unavailable');assert.match(h.e.heroForexRows.innerHTML,/Unable to load exchange rates/);
});
test('Converter invalid/loading/error clears freshness without extra success events',async()=>{
 const h=harness('converter');await h.run();h.e.amount.value='0';await h.run();assert.equal(h.e.currencyRetrievedAt.textContent,'Unavailable');assert.equal(h.e.currencyRateUpdatedAt.textContent,'Unavailable');h.e.amount.value='10';h.ctx.fetch=()=>new Promise(()=>{});h.run();assert.equal(h.e.currencyRetrievedAt.textContent,'Unavailable');h.ctx.fetch=async()=>({ok:false});await h.run();assert.match(h.e.result.innerHTML,/Unable to fetch exchange rates/);assert.equal(h.e.currencyRateUpdatedAt.textContent,'Unavailable');assert.equal(h.stats.length,1);
});
test('Swap/Enter preserve requests and statistics',async()=>{
 const h=harness('converter');h.ctx.swapCurrencies();await new Promise(setImmediate);assert.equal(h.e.fromCurrency.value,'EUR');assert.equal(h.e.toCurrency.value,'USD');assert.match(h.calls[0],/latest\/EUR$/);h.events.DOMContentLoaded();let prevented=false;h.e.amount.listeners.keydown({key:'Enter',preventDefault(){prevented=true;}});await new Promise(setImmediate);assert.ok(prevented);assert.equal(h.stats.length,2);
});
test('Real registry/schema FAQ parity and generated article parity',()=>{
 const r=g.loadRuntime(),key='currency-converter',faq=r.registry.get('faq',key);assert.equal(faq[0].question,q);assert.equal(faq[0].answer,a);
 let schema;r.context.ToolXoneSchemaRegistry={register(name,data){schema=data;}};vm.runInContext(read('js/seo/schemas/currency-converter-schema.js'),r.context);
 const findFAQ=o=>{if(!o||typeof o!=='object')return null;if(Array.isArray(o.faq))return o.faq;for(const v of Object.values(o)){const found=findFAQ(v);if(found)return found;}return null;};
 const schemaFAQ=findFAQ(schema);assert.equal(schemaFAQ.filter(item=>item.question===q).length,1);assert.equal(faq.filter(item=>item.question===q).length,1);assert.equal(JSON.stringify(schemaFAQ[0]),JSON.stringify(faq[0]));assert.doesNotMatch(JSON.stringify(schema),/live exchange rates|live currency converter/i);assert.equal(r.registry.get('hero',key).title,'Currency Converter');
 const output=r.render(key),entry={file:'currency-converter.html',key,selector:'#financeInfo'},html=read(entry.file),region=g.region(html,entry);assert.match(output,/updates its rate data once per day/);assert.equal(html.slice(region.start,region.end),output.replace(/\n/g,g.eol(html,entry,region)));
});
