/* ======================================
   CONFIGURATION
   ====================================== */

const STATISTICS_REFRESH_INTERVAL = 10 * 1000;
const COUNTER_ANIMATION_DURATION = 1200;

/* ==========================================================
   TOOLXONE LIVE STATISTICS
   Homepage Statistics Controller
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeStatistics
);

function initializeStatistics() {

    if (
        typeof ToolXoneStatisticsAPI ===
        "undefined"
    ) {
        console.warn(
            "[Statistics] API unavailable."
        );

        return;
    }

    loadStatistics();

}

function loadStatistics() {

    const totals =
        ToolXoneStatisticsAPI.getTotals();

    const tools =
        ToolXoneStatisticsAPI.getTools();

    animateCounter(
        "totalToolActions",
        totals.toolActions
    );

    animateCounter(
        "totalCalculations",
        totals.calculations
    );

    animateCounter(
        "totalConversions",
        totals.conversions
    );

    animateCounter(
        "totalUtilities",
        totals.utilities
    );

    updateMostUsedTool(
        tools
    );

}

function animateCounter(
    elementId,
    target
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {

        return;

    }

    const duration = COUNTER_ANIMATION_DURATION;

    const start =
        performance.now();

    function update(
        currentTime
    ) {

        const progress =
            Math.min(
                (
                    currentTime -
                    start
                ) /
                duration,
                1
            );

        const value =
            Math.floor(
                progress *
                target
            );

        element.textContent =
            value.toLocaleString();

        if (
            progress < 1
        ) {

            requestAnimationFrame(
                update
            );

        }

    }

    requestAnimationFrame(
        update
    );

}

function updateMostUsedTool(
    tools
) {

    let winner =
        null;

    let highest = -1;

    Object.values(
        tools
    ).forEach(tool => {

        if (
    tool.actions >
    highest
) {

            highest =
                tool.actions;

            winner =
                tool;

        }

    });

    const element =
        document.getElementById(
            "mostUsedTool"
        );

    if (!element) {

        return;

    }

    if (
        winner
    ) {

        element.textContent =
            winner.name;

    } else {

        element.textContent =
            "No data yet";

    }

}

setInterval(
    loadStatistics,
    STATISTICS_REFRESH_INTERVAL
);