/*
==========================================================
TOOLXONE AI
TOOL INTELLIGENCE ENGINE

Responsibility

Maintain the complete knowledge base for every
ToolXone tool.

Every tool is described here only once.

Other AI modules simply ask:

getToolProfile("currency-converter")

instead of maintaining duplicate information.
==========================================================
*/


window.ToolXoneToolIntelligence = (function () {

"use strict";

const TOOLS = {

  "currency-converter": {

    id:
        "currency-converter",

    name:
        "Currency Converter",

    icon:
        "💱",

    category:
        "Finance",

    type:
        "Utility",

    complexity:
        "Simple",

    purpose:
        "Convert world currencies instantly using live exchange rates.",

    benefits: [

        "Real-time exchange rates",
        "Fast conversion",
        "Accurate results",
        "190+ currencies"

    ],

    emotions: [

        "Confidence",
        "Trust",
        "Speed"

    ],

    audience: [

        "Travelers",
        "Businesses",
        "Students",
        "Freelancers"

    ],

    cta:
        "Convert Now"

},
};
function getToolProfile(id) {

    const profile =
        TOOLS[id];

    if (!profile) {
        return null;
    }

    return structuredClone(profile);

}

return Object.freeze({

    getToolProfile

});

})();