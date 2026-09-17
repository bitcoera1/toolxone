/*
==========================================================
 ToolXone Performance Platform
 Master Controller
 Version: 1.0.0
==========================================================
*/

(function () {

"use strict";

const ENGINE_NAME = "ToolXone Performance Platform";
const ENGINE_VERSION = "1.0.0";

const CONFIG = {

    autoInitialize: true,

    debug: false,

    runValidation: true,

    collectMetrics: true,

    autoReport: false

};

const modules = {

    registry: null,

    engine: null,

    vitals: null,

    lazy: null,

    assets: null,

    images: null,

    validator: null,

};

const statistics = {

    initialized: 0,

    healthy: 0,

    unhealthy: 0,

    score: 0

};

function discoverModules(){

    modules.registry =
        window.ToolXonePerformanceRegistry || null;

    modules.engine =
        window.ToolXonePerformanceEngine || null;

    modules.vitals =
        window.ToolXoneCoreWebVitals || null;

    modules.lazy =
        window.ToolXoneLazyLoader || null;

    modules.assets =
        window.ToolXoneAssetOptimizer || null;

    modules.images =
        window.ToolXoneImageOptimizer || null;

    modules.validator =
        window.ToolXonePerformanceValidator || null;

}

function calculateHealth(){

    discoverModules();

    const list = Object.values(modules);

    statistics.initialized = 0;

    statistics.unhealthy = 0;

    statistics.healthy = 0;

    list.forEach(module=>{

        if(module){

            statistics.initialized++;

            statistics.healthy++;

        }else{

            statistics.unhealthy++;

        }

    });

    statistics.score = Math.round(

        (statistics.healthy/list.length)*100

    );

    return statistics;

}

function run(){

    calculateHealth();

    if(CONFIG.runValidation &&
        modules.validator &&
        modules.validator.run){

        modules.validator.run();

    }

    return{

        success:
            statistics.score===100,

        timestamp:
            Date.now(),

        statistics:{...statistics}

    };

}

function report(){

    const result = run();

    console.group(

        "%cToolXone Performance Platform",

        "color:#0ea5e9;font-size:14px;font-weight:bold;"

    );

    console.log("Version:", ENGINE_VERSION);

    console.log("Health Score:", statistics.score + "%");

    console.log("Modules Loaded:", statistics.initialized);

    console.log("Healthy:", statistics.healthy);

    console.log("Missing:", statistics.unhealthy);

    console.log("--------------------------------");

    Object.entries(modules).forEach(([name,module])=>{

        console.log(

            (module ? "✅ " : "❌ ") + name

        );

    });

    console.log("--------------------------------");

    if(result.success){

        console.log(

            "%cSTATUS: PERFORMANCE PLATFORM READY",

            "color:green;font-weight:bold;"

        );

    }else{

        console.warn(

            "STATUS: Performance platform requires attention."

        );

    }

    console.groupEnd();

    return result;

}

window.ToolXonePerformancePlatform = {

    name: ENGINE_NAME,

    version: ENGINE_VERSION,

    configuration: CONFIG,

    modules,

    statistics,

    run,

    report,

    health: calculateHealth,

    info(){

        return{

            name: ENGINE_NAME,

            version: ENGINE_VERSION,

            configuration: CONFIG,

            statistics,

            modules

        };

    }

};

if(CONFIG.autoInitialize){

    discoverModules();

    calculateHealth();

    console.info(

        "%c"+ENGINE_NAME+

        " v"+ENGINE_VERSION+

        " initialized",

        "color:#0ea5e9;font-weight:bold;"

    );

}

})();