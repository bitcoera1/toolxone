'use strict';
// Frozen literal contract and source fragments; no Git, network or writes.
const frozen = {
  "hashes": {
    "about.html": "8dcbe6c245aca8c74c8748065a0c28a9c7d2902c0d39fba7a7dfe68d522d0526",
    "contact.html": "d83e6b425e71a6cb64ab1bc133b8eb781308b7129f3688166e14ef7b52d0ddb4",
    "js/footer.js": "0852666e1fd98e18a3f888530d004895ab3e33119ffd0b7a2dfa4d1460f5e936"
  },
  "fixtures": {
    "about.html": [
      {
        "before": "Learn about ToolXone, our mission, vision and commitment to providing free, fast and accurate online calculators, converters and smart utility tools.",
        "after": "Learn about ToolXone’s free online calculators, converters and utility tools, calculation assumptions, limitations and ways to report issues."
      },
      {
        "before": "        <p>\n            Our development approach focuses on clear inputs, readable\n            results, responsive layouts and practical explanations.\n            Where a calculation depends on specific assumptions or\n            formulas, the relevant tool page is designed to explain\n            those factors so users can better understand what the result\n            represents.\n        </p>",
        "after": "        <p>\n            ToolXone’s calculator and tool implementations use formulas and assumptions appropriate to their individual tasks. Some tool pages include documented methods and source references, and automated tests cover selected calculation, interface and content behavior.\n        </p>"
      },
      {
        "before": "        <p>\n            We also work to keep the platform consistent across devices\n            and continuously improve existing tools as the ToolXone\n            system evolves.\n        </p>",
        "after": "        <p>\n            Methodology, assumptions, sources and limitations vary by tool. Read the explanations on the relevant tool page before interpreting a result. Automated tests do not establish that every result is error-free or that every tool has professional or expert review.\n        </p>"
      },
      {
        "before": "        <p>\n            ToolXone aims to provide clear and reliable results based on\n            the formulas, inputs and assumptions used by each tool.\n        </p>",
        "after": "        <p>\n            Results depend on the inputs, formulas and assumptions used by each tool. Some outputs are estimates or projections based on simplified models, and errors or outdated information are possible.\n        </p>"
      },
      {
        "before": "        <p>\n            Results can depend on the information entered by the user\n            and, for some tools, on assumptions or simplified models.\n            Where these factors are important, we aim to explain them\n            on the relevant tool page.\n        </p>",
        "after": "        <p>\n            ToolXone provides informational and educational tools. Where applicable, estimates and projections are not professional financial, medical, legal or other individualized advice. Independently verify important results and consult an appropriately qualified professional when needed.\n        </p>"
      },
      {
        "before": "        <p>\n            ToolXone tools are intended to provide useful information\n            and calculations. Users should independently verify important\n            financial, medical, legal or business decisions with an\n            appropriate qualified professional when necessary.\n        </p>",
        "after": "        <p>For more information about use and limitations, read our <a href=\"terms-conditions.html\">Terms &amp; Conditions</a> and <a href=\"disclaimer.html\">Disclaimer</a>.</p>"
      },
      {
        "before": "    <!-- ==================================================\n         WHO TOOLXONE IS FOR",
        "after": "    <div class=\"trust-card\">\n\n        <h2>Reporting Suspected Errors</h2>\n\n        <p>If you notice a suspected calculation error, outdated explanation or source/reference issue, use our <a href=\"contact.html\">Contact</a> page or <a href=\"feedback.html\">Feedback</a> page to send a report.</p>\n\n        <p>Include the page or tool name, the inputs and result where relevant, what you expected, and the wording or reference you believe needs attention. Avoid sending sensitive personal or account information.</p>\n\n        <p>A report does not establish that an error has occurred or guarantee a correction or response. ToolXone does not publish a fixed review schedule.</p>\n\n    </div>\n\n\n    <!-- ==================================================\n         WHO TOOLXONE IS FOR"
      }
    ],
    "contact.html": [
      {
        "before": "    <div class=\"trust-card\">\n\n        <h2>\n            🐛 Report a Bug or Technical Issue\n        </h2>\n\n        <p>\n            If you experience an unexpected result, broken feature,\n            display problem, or other technical issue, please let us know.\n            We appreciate detailed reports because they help us\n            investigate and improve the affected tool.\n        </p>\n\n    </div>",
        "after": "    <div class=\"trust-card\">\n\n        <h2>\n            🐛 Report a Bug or Technical Issue\n        </h2>\n\n        <p>\n            If you experience an unexpected result, broken feature,\n            display problem, or other technical issue, please let us know.\n            We appreciate detailed reports because they help us\n            investigate and improve the affected tool.\n        </p>\n\n        <p>\n            You can also report suspected calculation errors, outdated content or source/reference issues. Identify the affected page and the specific result, statement or reference so the issue can be understood.\n        </p>\n\n    </div>"
      },
      {
        "before": "    <div class=\"trust-card\">\n\n        <h2>\n            📝 When Contacting Us\n        </h2>\n\n        <p>\n            To help us respond efficiently, please include as much\n            relevant information as possible in your message.\n        </p>\n\n        <p>\n            For bug reports or technical issues, mentioning the tool name,\n            what you were trying to do, what happened, and the device or\n            browser you were using can help us understand the issue and\n            investigate it more effectively.\n        </p>\n\n    </div>",
        "after": "    <div class=\"trust-card\">\n\n        <h2>\n            📝 When Contacting Us\n        </h2>\n\n        <p>\n            To help us respond efficiently, please include as much\n            relevant information as possible in your message.\n        </p>\n\n        <p>\n            For bug reports or technical issues, mentioning the tool name,\n            what you were trying to do, what happened, and the device or\n            browser you were using can help us understand the issue and\n            investigate it more effectively.\n        </p>\n\n        <p>\n            For a calculation issue, include the inputs, units, result and expected result. For a content or reference issue, include the page link, relevant wording or source link, and a brief explanation of the concern.\n        </p>\n\n    </div>"
      },
      {
        "before": "        <p>\n            We aim to respond to all genuine inquiries within\n            <strong>24–48 business hours.</strong>\n            Response times may vary during weekends and public holidays.\n        </p>",
        "after": "        <p>\n            Response times can vary. Sending an inquiry does not guarantee a response within a particular timeframe or that a requested change will be made.\n        </p>"
      }
    ],
    "js/footer.js": [
      {
        "before": "Fast, Accurate & Free.",
        "after": "Practical Online Tools — Free to Use."
      }
    ]
  },
  "copy": {
    "meta": "Learn about ToolXone’s free online calculators, converters and utility tools, calculation assumptions, limitations and ways to report issues.",
    "process": [
      "ToolXone’s calculator and tool implementations use formulas and assumptions appropriate to their individual tasks. Some tool pages include documented methods and source references, and automated tests cover selected calculation, interface and content behavior.",
      "Methodology, assumptions, sources and limitations vary by tool. Read the explanations on the relevant tool page before interpreting a result. Automated tests do not establish that every result is error-free or that every tool has professional or expert review."
    ],
    "limitations": [
      "Results depend on the inputs, formulas and assumptions used by each tool. Some outputs are estimates or projections based on simplified models, and errors or outdated information are possible.",
      "ToolXone provides informational and educational tools. Where applicable, estimates and projections are not professional financial, medical, legal or other individualized advice. Independently verify important results and consult an appropriately qualified professional when needed.",
      "For more information about use and limitations, read our <a href=\"terms-conditions.html\">Terms &amp; Conditions</a> and <a href=\"disclaimer.html\">Disclaimer</a>."
    ],
    "report": [
      "If you notice a suspected calculation error, outdated explanation or source/reference issue, use our <a href=\"contact.html\">Contact</a> page or <a href=\"feedback.html\">Feedback</a> page to send a report.",
      "Include the page or tool name, the inputs and result where relevant, what you expected, and the wording or reference you believe needs attention. Avoid sending sensitive personal or account information.",
      "A report does not establish that an error has occurred or guarantee a correction or response. ToolXone does not publish a fixed review schedule."
    ],
    "contactReport": "You can also report suspected calculation errors, outdated content or source/reference issues. Identify the affected page and the specific result, statement or reference so the issue can be understood.",
    "contactDetails": "For a calculation issue, include the inputs, units, result and expected result. For a content or reference issue, include the page link, relevant wording or source link, and a brief explanation of the concern.",
    "response": "Response times can vary. Sending an inquiry does not guarantee a response within a particular timeframe or that a requested change will be made.",
    "slogan": "Practical Online Tools — Free to Use."
  },
  "aboutHeadings": [
    "🌐 What Is ToolXone?",
    "🌍 Our Mission",
    "🧰 What ToolXone Offers",
    "⚙️ How We Build Our Tools",
    "🎯 Accuracy & Transparency",
    "👥 Who ToolXone Is For",
    "💚 What We Believe",
    "🦁 Our Vision",
    "🔒 Privacy & Trust"
  ],
  "aboutHero": "ToolXone is a free online tools platform designed to make everyday calculations, conversions and digital tasks easier with practical, accessible and easy-to-use web tools.",
  "sensitive": "    <div class=\"trust-card\">\n\n        <h2>\n            🔒 Please Don't Send Sensitive Information\n        </h2>\n\n        <p>\n            Please avoid including passwords, payment information,\n            financial account credentials, or other sensitive personal\n            information in your message.\n        </p>\n\n        <p>\n            Only provide the information necessary for us to understand\n            and respond to your inquiry.\n        </p>\n\n    </div>",
  "categories": [
    "💰 Finance Tools",
    "🧮 Calculators",
    "🔄 Converters",
    "❤️ Health Tools",
    "🛠️ Utilities",
    "📄 PDF Tools"
  ]
};

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8').replace(/\r\n/g,'\n');
const count=(s,v)=>s.split(v).length-1;
const visible=s=>s.replace(/<!--[\s\S]*?-->/g,'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
function main(p){const m=read(p).match(/<main\b[^>]*>[\s\S]*?<\/main>/);assert.ok(m);return m[0];}
function section(s,title){const h=s.indexOf(title);assert.ok(h>=0,title);const start=s.lastIndexOf('<div class="trust-card">',h),end=s.indexOf('</div>',h);assert.ok(start>=0&&end>start);return s.slice(start,end+6);}
function requireCopy(s,items){for(const item of items)assert.equal(count(visible(s),visible(item)),1,item);}
const trustLinks=['about.html','contact.html','feedback.html','privacy-policy.html','terms-conditions.html','disclaimer.html','affiliate-disclosure.html'];
function hrefs(s){return [...s.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>m[1]);}
function footerHarness(state='complete',missing=false){
 const target={innerHTML:''},listeners=[];
 class FixedDate extends Date{constructor(...args){super(...(args.length?args:['2026-10-11T00:00:00.000Z']));}getFullYear(){return 2026;}}
 const context={Date:FixedDate,document:{readyState:state,getElementById(id){assert.equal(id,'siteFooter');return missing?null:target;},addEventListener(type,fn){assert.equal(type,'DOMContentLoaded');listeners.push(fn);}},console:{log(){},warn(){}},fetch(){assert.fail('Network forbidden');}};
 vm.runInNewContext(read('js/footer.js'),context,{filename:'js/footer.js',timeout:1000});
 return {target,listeners};
}
test('About initial HTML preserves purpose, original headings and six tool categories',()=>{
 const s=main('about.html');requireCopy(s,[frozen.aboutHero]);
 const headings=[...s.matchAll(/<h2>([\s\S]*?)<\/h2>/g)].map(m=>visible(m[1]));
 const expected=[...frozen.aboutHeadings];expected.splice(expected.indexOf('👥 Who ToolXone Is For'),0,'Reporting Suspected Errors');assert.deepEqual(headings,expected);
 for(const name of frozen.categories)assert.equal(count(s,'<strong>'+name+'</strong>'),1);
});
test('About states bounded documented-method and selected-test process',()=>{
 const s=section(main('about.html'),'⚙️ How We Build Our Tools');requireCopy(s,frozen.copy.process);
 assert.doesNotMatch(visible(s),/every tool (?:is|has been) (?:expert[- ]reviewed|fully tested)|all results are error-free/i);
});
test('About limitations and ordinary Terms and Disclaimer links match contract',()=>{
 const s=section(main('about.html'),'🎯 Accuracy & Transparency');requireCopy(s,frozen.copy.limitations);
 assert.ok(s.includes('<a href="terms-conditions.html">Terms &amp; Conditions</a>'));
 assert.ok(s.includes('<a href="disclaimer.html">Disclaimer</a>'));
});
test('About reporting card provides bounded correction routes in specified position',()=>{
 const s=main('about.html'),card=section(s,'Reporting Suspected Errors');requireCopy(card,frozen.copy.report);
 assert.deepEqual(hrefs(card),['contact.html','feedback.html']);assert.ok(s.indexOf('🎯 Accuracy & Transparency')<s.indexOf('Reporting Suspected Errors'));assert.ok(s.indexOf('Reporting Suspected Errors')<s.indexOf('👥 Who ToolXone Is For'));
});
test('About required local trust links have exact existing destinations',()=>{
 const links=hrefs(main('about.html'));for(const p of ['contact.html','feedback.html','privacy-policy.html','terms-conditions.html','disclaimer.html']){assert.equal(links.filter(x=>x===p).length,1);assert.ok(fs.statSync(path.join(root,p)).isFile());}
});
test('Contact reporting additions preserve email and sensitive-information guidance',()=>{
 const s=main('contact.html');requireCopy(section(s,'🐛 Report a Bug or Technical Issue'),[frozen.copy.contactReport]);requireCopy(section(s,'📝 When Contacting Us'),[frozen.copy.contactDetails]);
 assert.equal(count(s,'href="mailto:toolxone@gmail.com"'),1);assert.ok(s.includes(frozen.sensitive.trim()));
});
test('Contact response wording has no fixed response deadline',()=>{
 const s=section(main('contact.html'),'⚡ Response Time');requireCopy(s,[frozen.copy.response]);assert.doesNotMatch(s,/24[–-]48|business hours/);
});
test('Real ready-DOM footer renders conservative slogan and all existing trust links',()=>{
 const s=footerHarness().target.innerHTML;requireCopy(s,[frozen.copy.slogan]);assert.doesNotMatch(s,/Fast, Accurate & Free/);
 for(const p of trustLinks)assert.equal(hrefs(s).filter(x=>x===p).length,1);assert.ok(visible(s).includes('© 2026 ToolXone. All rights reserved.'));
});
test('Real loading-DOM footer waits and repeated callback replaces rather than duplicates',()=>{
 const h=footerHarness('loading');assert.equal(h.target.innerHTML,'');assert.equal(h.listeners.length,1);h.listeners[0]();const first=h.target.innerHTML;h.listeners[0]();assert.equal(h.target.innerHTML,first);assert.equal(count(first,'class="footer-content"'),1);requireCopy(first,[frozen.copy.slogan]);for(const p of trustLinks)assert.equal(hrefs(first).filter(x=>x===p).length,1);
});
test('Real footer safely handles a missing target',()=>{
 const h=footerHarness('complete',true);assert.equal(h.target.innerHTML,'');assert.equal(h.listeners.length,0);
});
function noUnsupportedClaims(text){
 const cleaned=text
 .replace(/Automated tests do not establish that every result is error-free or that every tool has professional or expert review\./g,'')
 .replace(/A report does not establish that an error has occurred or guarantee a correction or response\./g,'')
 .replace(/ToolXone does not publish a fixed review schedule\./g,'')
 .replace(/Sending an inquiry does not guarantee a response within a particular timeframe or that a requested change will be made\./g,'')
 .replace(/ToolXone does not guarantee accuracy\./g,'')
 .replace(/ToolXone is not endorsed by medical professionals\./g,'');
 assert.doesNotMatch(cleaned,/\bguaranteed[- ]accuracy\b|\bguarantees? (?:perfect |complete |100% )?accuracy\b|\b(?:all|every) (?:tools?|results?) (?:are|is) (?:100% accurate|error-free|expert[- ]reviewed|reviewed by experts)\b|\b(?:all|every) tools? (?:has|have|receives?|receive) (?:professional|expert) review\b|\b(?:guarantees? (?:a )?(?:response|reply)|(?:will|always) (?:respond|reply)) within\b|\b(?:endorsed|approved|certified) by (?:medical|financial|legal) professionals\b|\b(?:operated|owned|founded|managed) by\b|\b(?:licensed|certified) (?:doctor|physician|financial adviser|financial advisor|medical expert)\b|\b(?:our|the) team of (?:doctors|experts|professionals)\b|\b(?:weekly|monthly|quarterly) (?:expert )?review schedule\b|Tahir Aslam/i);
}
test('Claim guards reject affirmative claims, allow disclaimers and inspect actual trust content',()=>{
 for(const s of ['Guaranteed accuracy.','ToolXone guarantees perfect accuracy.','Every tool is expert-reviewed.','All tools have expert review.','We guarantee a response within 24 hours.','We will respond within 48 hours.','Endorsed by medical professionals.','Operated by Example Person.','Our team of doctors.','A certified financial advisor.','A monthly review schedule.','ToolXone does not guarantee accuracy. Guaranteed accuracy.'])assert.throws(()=>noUnsupportedClaims(s),assert.AssertionError,s);
 for(const s of [...frozen.copy.process,...frozen.copy.limitations,...frozen.copy.report,frozen.copy.response,'ToolXone does not guarantee accuracy.','ToolXone is not endorsed by medical professionals.'])assert.doesNotThrow(()=>noUnsupportedClaims(visible(s)),s);
 const descriptions=[read('about.html'),read('contact.html')].map(s=>s.match(/<meta name="description" content="([^"]*)"/)[1]);
 noUnsupportedClaims([visible(main('about.html')),visible(main('contact.html')),visible(footerHarness().target.innerHTML),...descriptions].join(' '));
 assert.equal(descriptions[0],frozen.copy.meta);
});
test('Frozen literal reversal preserves all source outside explicitly approved edits',()=>{
 for(const [p,changes]of Object.entries(frozen.fixtures)){
  let s=read(p);
  for(const {before,after}of [...changes].reverse()){assert.equal(count(s,after),1,p+' unique approved fragment');s=s.replace(after,before);}
  assert.equal(crypto.createHash('sha256').update(s).digest('hex'),frozen.hashes[p],p+' original normalized source');
 }
});
