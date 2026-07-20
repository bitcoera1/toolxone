/*
==========================================================
TOOLXONE PHOENIX AI
Audience Intelligence v1.0

Responsibility:
Understand WHO the generated design is intended for.

This module never generates graphics.

It only returns structured audience intelligence
that other Phoenix AI engines can use.
==========================================================
*/

window.ToolXoneAudienceIntelligence =
(function () {

"use strict";


/* =====================================================
   1. AUDIENCE PROFILES
   ===================================================== */

const AUDIENCE_PROFILES = [

{

id:
"students",

keywords:[
"student",
"students",
"school",
"college",
"university",
"education",
"study"
],

label:
"Students"

},

{

id:
"teachers",

keywords:[
"teacher",
"teachers",
"educator",
"academy",
"training"
],

label:
"Teachers"

},

{

id:
"developers",

keywords:[
"developer",
"developers",
"programmer",
"coding",
"software"
],

label:
"Developers"

},

{

id:
"business",

keywords:[
"business",
"company",
"office",
"startup",
"enterprise"
],

label:
"Businesses"

},

{

id:
"travelers",

keywords:[
"travel",
"traveler",
"tourism",
"currency",
"exchange"
],

label:
"Travelers"

},

{

id:
"health",

keywords:[
"health",
"fitness",
"bmi",
"medical",
"wellness"
],

label:
"Health Users"

}

];


/* =====================================================
   2. DETECT AUDIENCE
   ===================================================== */

function detectAudience(
prompt=""
){

const normalized =
String(prompt)
.toLowerCase();

const detected=[];

AUDIENCE_PROFILES.forEach(
profile=>{

const matched=
profile.keywords.some(
keyword=>
normalized.includes(
keyword
)
);

if(matched){

detected.push({

id:
profile.id,

label:
profile.label

});

}

});

if(!detected.length){

detected.push({

id:
"general",

label:
"General Audience"

});

}

return detected;

}


/* =====================================================
   3. PUBLIC API
   ===================================================== */

return Object.freeze({

detectAudience

});

})();