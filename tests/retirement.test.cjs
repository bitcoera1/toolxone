'use strict';
// Actual initialized calculator and number engine; synthetic DOM, no network or writes.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const fields=['currentAge','retirementAge','currentSavings','monthlyContribution','annualReturn'];
const labels=['Years Remaining','Future Retirement Fund','Total Contributions','Investment Growth','Estimated Monthly Retirement Income'];
const ordinary=[30,60,50000,1000,8];
function harness({numberEngine=true,statistics=true}={}){
 const elements=new Map(),alerts=[],records=[],results=[];let ready;
 function element(id){if(!elements.has(id)){const classes=new Set();elements.set(id,{value:'',innerHTML:'',style:{},events:new Map(),classList:{add(v){classes.add(v);},remove(v){classes.delete(v);},contains(v){return classes.has(v);}},addEventListener(type,fn){this.events.set(type,fn);}});}return elements.get(id);}
 const context={document:{getElementById:element,querySelectorAll(selector){assert.equal(selector,'#currentAge, #retirementAge, #currentSavings, #monthlyContribution, #annualReturn');return fields.map(element);},addEventListener(type,fn){assert.equal(type,'DOMContentLoaded');assert.equal(ready,undefined);ready=fn;}},alert(message){alerts.push(message);},
 setInterval(){assert.fail('Retirement must not schedule an interval');},setTimeout(){assert.fail('Retirement must not schedule a timeout');},requestAnimationFrame(){assert.fail('Retirement must not schedule animation callbacks');},fetch(){assert.fail('Network forbidden');}};
 context.window=context;if(statistics)context.ToolXoneStatisticsEvents={recordCalculation(id){records.push(id);}};
 vm.createContext(context);if(numberEngine)vm.runInContext(read('js/number-engine.js'),context,{filename:'js/number-engine.js'});
 vm.runInContext(read('js/retirement.js'),context,{filename:'js/retirement.js'});
 let values={};
 for(const name of ['createRetirementMoneyResult','createRetirementCountResult']){const original=context[name];context[name]=(label,value,...rest)=>{values[label]=value;return original(label,value,...rest);};}
 ready();
 return {element,context,alerts,records,results,set(input){fields.forEach((id,i)=>element(id).value=String(input[i]));},run(input){this.set(input);values={};context.runRetirementCalculator();results.push({...values});return {...values};},snapshot(){return {html:element('retirementResult').innerHTML,active:element('retirementResult').classList.contains('active'),bars:[element('retirementBars').style.display,element('contributionBar').style.width,element('growthBar').style.width]};}};
}
function close(actual,expected,tolerance=1e-12){assert.equal(typeof actual,'number');assert.ok(Number.isFinite(actual));if(expected===0)assert.equal(actual,0);else assert.ok(Math.abs(actual/expected-1)<=tolerance,actual+' != '+expected);}
// Frozen independent oracles: prior month-by-month audit recurrence and analytic limits.
// No production formula is recomputed to obtain these expected values.
const references=[
 ['positive return',ordinary,[30,2037145.9315511303,410000,1627145.9315511303,6790.4864385037675]],
 ['zero return',[30,60,50000,1000,0],[30,410000,410000,0,1366.6666666666667]],
 ['zero savings',[30,60,0,1000,8],[30,1490359.4486633516,360000,1130359.4486633516,4967.864828877839]],
 ['zero contribution',[30,60,50000,0,8],[30,546786.4828877789,50000,496786.4828877789,1822.6216096259296]],
 ['fractional ages, 363 months',[30.25,60.5,50000,1000,8],[30.25,2081181.1176829317,413000,1668181.1176829317,6937.270392276439]],
 ['approximately one month, end-month deposit',[60,60+1/12,50000,1000,12],[1/12,51500,51000,500,171.66666666666667]],
 ['half month preserves legitimate negative growth',[60,60+1/24,0,1000,12],[1/24,498.75621120887433,500,-1.24378879109725,1.662520704029581]],
 ['tiny positive annual return 1e-14',[30,60,0,1000,1e-14],[30,360000,360000,0,1200]],
 ['tiny return retains current savings and contributions',[30,60,50000,1000,1e-14],[30,410000,410000,0,1366.6666666666667]],
 ['small positive annual return 1e-8',[30,60,0,1000,1e-8],[30,360000.0005385,360000,0.0005385,1200.000001795]],
 ['age zero remains accepted',[0,1,0,1000,0],[1,12000,12000,0,40]]
];
for(const [name,input,expected]of references)test('Numerical reference: '+name,()=>{
 const h=harness(),v=h.run(input);assert.deepEqual(h.alerts,[]);assert.deepEqual(h.records,['retirement-calculator']);assert.deepEqual(Object.keys(v),labels);
 labels.forEach((label,i)=>{
 // Cancellation-sized growth has an absolute error bound independent of the fund comparison.
 if(label==='Investment Growth'&&Math.abs(expected[i])<0.001){assert.ok(Number.isFinite(v[label]));assert.ok(Math.abs(v[label]-expected[i])<1e-7);}
 else close(v[label],expected[i]);});assert.equal(h.element('retirementResult').classList.contains('active'),true);
});
test('Tiny-value comparison cannot silently accept zero for nonzero expectations',()=>assert.throws(()=>close(0,1e-300),assert.AssertionError));
test('A one-month contribution alone receives no monthly interest',()=>{
 const h=harness(),v=h.run([0,1/12,0,1000,12]);close(v['Future Retirement Fund'],1000);close(v['Total Contributions'],1000);assert.ok(Math.abs(v['Investment Growth'])<1e-10);
});
test('Zero-rate branch remains active when the monthly rate underflows to zero',()=>{
 const h=harness(),v=h.run([30,60,0,1000,Number.MIN_VALUE]);assert.equal(v['Future Retirement Fund'],360000);assert.equal(v['Investment Growth'],0);assert.equal(h.records.length,1);
});
const invalid=[
 ...fields.flatMap((field,i)=>['','not-a-number','NaN'].map(value=>[field+'='+value,i,value])),
 ['negative current age',0,-1],['equal ages',1,30],['earlier retirement',1,29],['negative retirement age',1,-1],
 ['negative savings',2,-1],['negative contribution',3,-1],['negative return',4,-1],
 ...fields.map((f,i)=>[f+'=Infinity',i,Infinity]),...fields.map((f,i)=>[f+'=-Infinity',i,-Infinity])
];
for(const [name,index,value]of invalid)test('Reject before result/statistics: '+name,()=>{
 const h=harness();h.context.resetRetirement();const before=h.snapshot(),input=[...ordinary];input[index]=value;
 const v=h.run(input);assert.equal(h.alerts.length,1);assert.deepEqual(v,{});assert.deepEqual(h.records,[]);assert.deepEqual(h.snapshot(),before);
});
const unusable=[
 ['both deposits zero',[30,60,0,0,8]],
 ['savings growth overflow',[30,60,1e308,1000,8]],
 ['contributions overflow',[30,60,0,1e308,8]],
 ['power overflow',[0,1000,50000,1000,100]],
 ['months overflow',[0,1e308,50000,0,0]],
 ['positive deposits and period underflow',[0,Number.MIN_VALUE,0,Number.MIN_VALUE,0]],
 ['contribution underflow despite usable current savings',[0,1/24,50000,Number.MIN_VALUE,0]],
 ['income underflow',[0,1,Number.MIN_VALUE,0,0]],
 ['nonzero-rate contribution underflow',[0,1/24,50000,Number.MIN_VALUE,12]]
];
for(const [name,input]of unusable)test('Numerically unusable projection rejected: '+name,()=>{
 const h=harness();h.context.resetRetirement();const before=h.snapshot();assert.deepEqual(h.run(input),{});assert.equal(h.alerts.length,1);assert.deepEqual(h.records,[]);assert.deepEqual(h.snapshot(),before);
});
test('Large finite monetary values remain allowed without arbitrary financial limits',()=>{
 const h=harness(),v=h.run([30,31,1e308,0,0]);assert.equal(v['Future Retirement Fund'],1e308);assert.equal(v['Investment Growth'],0);assert.equal(h.records.length,1);assert.deepEqual(h.alerts,[]);
});
test('Existing parsing accepts fractional values, exponents and numeric prefixes',()=>{
 const h=harness(),v=h.run(['30.25','60.5','5e4suffix','1000','8']);close(v['Future Retirement Fund'],2081181.1176829317);assert.equal(v['Years Remaining'],30.25);assert.equal(h.records.length,1);
});
test('Money/years formatting and number words use the real number engine',()=>{
 const h=harness();h.run(ordinary);const html=h.element('retirementResult').innerHTML;
 for(const text of ['30','Years','2,037,145.93','410,000.00','1,627,145.93','6,790.49','Two Million','ToolXone Insight'])assert.ok(html.includes(text),text);
 assert.equal((html.match(/retirement-result-item/g)||[]).length,5);
 h.run([30,31,0,1000,0]);assert.match(h.element('retirementResult').innerHTML,/\b1\s+Year\s*</);
 h.run([30,30.125,0,1000,0]);assert.match(h.element('retirementResult').innerHTML,/0\.13\s+Years/);
});
test('Fallback formatting and absent statistics module preserve successful rendering',()=>{
 const h=harness({numberEngine:false,statistics:false});h.run(ordinary);const html=h.element('retirementResult').innerHTML;assert.ok(html.includes('2037145.93'));assert.ok(!html.includes('retirement-number-words'));assert.deepEqual(h.alerts,[]);
});
test('Bars preserve contribution/growth percentages, zero return and fractional negative growth clamping',()=>{
 const h=harness();h.run(ordinary);close(parseFloat(h.element('contributionBar').style.width),20.12619683499142);close(parseFloat(h.element('growthBar').style.width),79.87380316500858);
 assert.equal(h.element('retirementBars').style.display,'block');h.run([30,60,50000,1000,0]);assert.equal(h.element('contributionBar').style.width,'100%');assert.equal(h.element('growthBar').style.width,'0%');
 h.run([60,60+1/24,0,1000,12]);assert.equal(h.element('contributionBar').style.width,'100%');assert.equal(h.element('growthBar').style.width,'0%');
});
test('Reset clears all fields, summary and bars without events or queued callbacks',()=>{
 const h=harness();h.run(ordinary);h.context.resetRetirement();assert.deepEqual(fields.map(id=>h.element(id).value),['','','','','']);
 assert.deepEqual(h.snapshot(),{html:'<p>Your retirement summary will appear here.</p>',active:false,bars:['none','0%','0%']});assert.deepEqual(h.records,['retirement-calculator']);
});
test('Replacement is synchronous, contains one summary and records once per successful call',()=>{
 const h=harness();h.run(ordinary);h.run([30,31,0,100,0]);const html=h.element('retirementResult').innerHTML;
 assert.ok(html.includes('1,200.00'));assert.ok(!html.includes('2,037,145.93'));assert.equal((html.match(/Future Retirement Fund/g)||[]).length,1);assert.equal((html.match(/retirement-result-item/g)||[]).length,5);assert.deepEqual(h.records,['retirement-calculator','retirement-calculator']);
 const before=h.snapshot();h.run([30,30,0,100,0]);assert.deepEqual(h.snapshot(),before);assert.equal(h.records.length,2);
});
test('Enter on every input calculates once; other keys do nothing without preventing default',()=>{
 for(const field of fields){const h=harness();h.set(ordinary);const keydown=h.element(field).events.get('keydown');assert.equal(typeof keydown,'function');
 keydown({key:'Escape',preventDefault(){assert.fail('Unexpected preventDefault');}});assert.deepEqual(h.records,[]);
 keydown({key:'Enter',preventDefault(){assert.fail('Existing Enter behavior must remain unchanged');}});assert.deepEqual(h.records,['retirement-calculator']);assert.ok(h.element('retirementResult').innerHTML.includes('2,037,145.93'));}
});
