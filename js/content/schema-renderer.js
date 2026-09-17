/*
==========================================================
ToolXone Schema Renderer
Structured Data Rendering Platform
Version: 1.0.0
==========================================================
*/

(function(){

"use strict";

/*
==========================================================
Constants
==========================================================
*/

const RENDERER_NAME = "ToolXone Schema Renderer";

const RENDERER_VERSION = "1.0.0";

/*
==========================================================
Configuration
==========================================================
*/

const configuration = {

    prettyPrint : true,

    sanitize : true,

    autoInitialize : true,

    debug : false

};

/*
==========================================================
State
==========================================================
*/

const state = {

    initialized : false,

    rendered : 0,

    failed : 0,

    lastUpdated : null

};

/*
==========================================================
Statistics
==========================================================
*/

const statistics = {

    renderOperations : 0,

    renderedSchemas : 0

};

/*
==========================================================
Validation
==========================================================
*/

function validate(schema){

    return (

        schema &&

        typeof schema === "object"

    );

}

/*
==========================================================
Sanitize
==========================================================
*/

function sanitize(value){

    if(!configuration.sanitize){

        return value;

    }

    return JSON.parse(

        JSON.stringify(value)

    );

}

/*
==========================================================
Render Schema
==========================================================
*/

function render(schema){

    statistics.renderOperations++;

    if(!validate(schema)){

        state.failed++;

        return "";

    }

    const json = configuration.prettyPrint

        ? JSON.stringify(

            sanitize(schema),

            null,

            4

        )

        : JSON.stringify(

            sanitize(schema)

        );

    state.rendered++;

    statistics.renderedSchemas++;
    
    state.lastUpdated = Date.now();

    return `<script type="application/ld+json">\n${json}\n</script>`;

}

/*
==========================================================
Initialize
==========================================================
*/

function initialize(){

    if(state.initialized){

        return;

    }

    state.initialized = true;

    state.lastUpdated = Date.now();

}

/*
==========================================================
Refresh
==========================================================
*/

function refresh(){

    state.rendered = 0;

    state.failed = 0;

    statistics.renderOperations = 0;

    statistics.renderedSchemas = 0;

    state.lastUpdated = Date.now();

}

/*
==========================================================
Information
==========================================================
*/

function info(){

    return {

        name : RENDERER_NAME,

        version : RENDERER_VERSION,

        configuration,

        state,

        statistics

    };

}

/*
==========================================================
Report
==========================================================
*/

function report(){

    console.group(

        RENDERER_NAME

    );

    console.groupEnd();

}

/*
==========================================================
Public API
==========================================================
*/

window.ToolXoneSchemaRenderer = {

    name : RENDERER_NAME,

    version : RENDERER_VERSION,

    configuration,

    state,

    statistics,

    initialize,

    refresh,

    validate,

    render,

    report,

    info

};

/*
==========================================================
Auto Initialize
==========================================================
*/

if(configuration.autoInitialize){

    initialize();

}

console.info(

    RENDERER_NAME +

    " v" +

    RENDERER_VERSION +

    " initialized"

);

})();