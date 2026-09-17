/*
==========================================================
 ToolXone Related Content Loader
 Dynamic Related Content Loading Platform
 Version: 2.0.0
==========================================================
*/

(function(){

"use strict";

/*=========================================================
 Constants
=========================================================*/

const LOADER_NAME = "ToolXone Related Loader";

const LOADER_VERSION = "2.0.0";

/*=========================================================
 Configuration
=========================================================*/

const configuration = {

    autoInitialize : true,

    cacheRelated : true,

    validateRelated : true,

    debug : false

};

/*=========================================================
 State
=========================================================*/

const state = {

    initialized : false,

    loading : false,

    loaded : 0,

    failed : 0,

    cached : 0,

    lastUpdated : null

};

/*=========================================================
 Cache
=========================================================*/

const cache = new Map();

/*=========================================================
 Statistics
=========================================================*/

const statistics = {

    totalRelated : 0,

    successfulLoads : 0,

    failedLoads : 0,

    cacheHits : 0,

    cacheMisses : 0

};

/*=========================================================
 Discover
=========================================================*/

function discover(){

    if(!window.ToolXoneContentRegistry){

        return [];

    }

    return window.ToolXoneContentRegistry.list(

        "related"

    );

}


/*=========================================================
 Validation
=========================================================*/

function validate(content){

    if(Array.isArray(content)){

        return true;

    }

    if(

        content &&

        typeof content === "object" &&

        Array.isArray(content.tools)

    ){

        return true;

    }

    return false;

}

/*=========================================================
 Cache
=========================================================*/

function saveCache(id, content){

    cache.set(id, content);

    state.cached++;

}

function getCache(id){

    return cache.get(id) || null;

}

function clearCache(){

    cache.clear();

    state.cached = 0;

}

/*=========================================================
 Load One
=========================================================*/

async function load(id){

    if(configuration.cacheRelated){

        const cached = getCache(id);

        if(cached){

            statistics.cacheHits++;

            return cached;

        }

    }

    statistics.cacheMisses++;

    const related = window.ToolXoneContentRegistry.get(

        "related",

        id

    );

    if(!related){

        return null;

    }

    const content = related;

    if(

        configuration.validateRelated &&

        !validate(content)

    ){

        throw new Error(

            "Invalid related content: " + id

        );

    }

    saveCache(

        id,

        content

    );

    state.loaded++;

    statistics.successfulLoads++;

    statistics.totalRelated = cache.size;

    return content;

}

/*=========================================================
 Load All
=========================================================*/

async function loadAll(){

    const ids = discover();

    if(ids.length === 0){

        return;

    }

    for(const id of ids){

        try{

            await load(id);

        }

        catch(error){

            state.failed++;

            statistics.failedLoads++;

            console.error(error);

        }

    }

}

/*=========================================================
 Refresh
=========================================================*/

async function refresh(){

    state.loaded = 0;

    state.failed = 0;

    clearCache();

    statistics.totalRelated = 0;

    statistics.successfulLoads = 0;

    statistics.failedLoads = 0;

    statistics.cacheHits = 0;

    statistics.cacheMisses = 0;

    await loadAll();

    state.lastUpdated = Date.now();

}

/*=========================================================
 Initialize
=========================================================*/

async function initialize(){

    if(

    state.initialized ||

    state.loading

){

    return;

}

    state.loading = true;

    await loadAll();

    state.loading = false;

    state.initialized = true;

    state.lastUpdated = Date.now();

}

/*=========================================================
 Information
=========================================================*/

function info(){

    return {

        name : LOADER_NAME,

        version : LOADER_VERSION,

        configuration,

        state,

        statistics

    };

}

/*=========================================================
 Report
=========================================================*/

function report(){

    console.group(

        LOADER_NAME

    );

    console.groupEnd();

}

/*=========================================================
 Public API
=========================================================*/

window.ToolXoneRelatedLoader = {

    name : LOADER_NAME,

    version : LOADER_VERSION,

    configuration,

    state,

    statistics,

    initialize,

    refresh,

    discover,

    load,

    loadAll,

    validate,

    report,

    info,

    getCache,

    clearCache

};

/*=========================================================
 Auto Initialize
=========================================================*/

if(configuration.autoInitialize){

    initialize();

}

console.info(

    LOADER_NAME +

    " v" +

    LOADER_VERSION +

    " initialized"

);

})();