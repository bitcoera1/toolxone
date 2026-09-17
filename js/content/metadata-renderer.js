/*
==========================================================
ToolXone Metadata Renderer
Metadata Rendering Platform
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

const RENDERER_NAME = "ToolXone Metadata Renderer";

const RENDERER_VERSION = "1.0.0";

/*
==========================================================
Configuration
==========================================================
*/

const configuration = {

    animate : false,

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

    renderedMetadata : 0

};

/*
==========================================================
Validation
==========================================================
*/

function validate(metadata){

    return (

        metadata &&

        typeof metadata === "object"

    );

}

/*
==========================================================
Sanitize
==========================================================
*/

function sanitize(text){

    if(!configuration.sanitize){

        return text;

    }

    return String(text)

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;")

        .replace(/"/g,"&quot;");

}
/*
==========================================================
Render Metadata
==========================================================
*/

function render(metadata){

    statistics.renderOperations++;

    if(!validate(metadata)){

        state.failed++;

        return false;

    }

    /*==========================================
    Page Title
    ==========================================*/

    if(metadata.title){

        document.title = metadata.title;

    }

    /*==========================================
    Description
    ==========================================*/

    if(metadata.description){

        let tag = document.querySelector(

            'meta[name="description"]'

        );

        if(tag){

            tag.setAttribute(

                "content",

                metadata.description

            );

        }

    }

    /*==========================================
    Keywords
    ==========================================*/

    if(metadata.keywords){

        let tag = document.querySelector(

            'meta[name="keywords"]'

        );

        if(tag){

            tag.setAttribute(

                "content",

                Array.isArray(metadata.keywords)

                    ? metadata.keywords.join(", ")

                    : metadata.keywords

            );

        }

    }

    /*==========================================
    Canonical
    ==========================================*/

    if(metadata.canonical){

        let tag = document.querySelector(

            'link[rel="canonical"]'

        );

        if(tag){

            tag.setAttribute(

                "href",

                metadata.canonical

            );

        }

    }

    /*==========================================
    Robots
    ==========================================*/

    if(metadata.robots){

        let tag = document.querySelector(

            'meta[name="robots"]'

        );

        if(tag){

            tag.setAttribute(

                "content",

                metadata.robots

            );

        }

    }

    state.rendered++;

    statistics.renderedMetadata++;
    
    state.lastUpdated = Date.now();

    return true;


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

    statistics.renderedMetadata = 0;

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

window.ToolXoneMetadataRenderer = {

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