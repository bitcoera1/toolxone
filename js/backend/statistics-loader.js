/*
==============================================

ToolXone Backend

Statistics Loader

Version:
1.0.0

Responsibility

Loads live statistics
from Cloudflare Worker
and updates homepage.

==============================================
*/

const StatisticsLoader = {

    refreshInterval: 60000,

    animationTimers: {},

    lastUpdated: null,

    statusTimer: null,

    async load() {

        try {

            const response = await StatisticsAPI.getAll();

            if (!response || !response.success) {

                return;

            }

            this.updateStatistics(response.data);

            this.lastUpdated = Date.now();

            this.updateStatus();

        }

        catch (error) {

            console.error(

                "Statistics Loader:",

                error

            );

        }

    },

    updateStatistics(data) {

    if (!Array.isArray(data)) {

        return;

    }

    const statistics = {};

    data.forEach(stat => {

    statistics[stat.stat_key] = Number(
        stat.stat_value
    );

});

    const mappings = {

    totalToolActions: "tool_actions",

    totalCalculations: "calculations",

    totalConversions: "conversions",

    totalUtilities: "utilities"

};

Object.entries(mappings).forEach(

    ([elementId, statKey]) => {

        this.updateCounter(

            elementId,

            statistics[statKey] ?? 0

        );

    }

);

    this.updateMostUsedTool(

        statistics

    );

},
    

    updateCounter(id, targetValue) {

    const element = document.getElementById(id);

    if (!element) {

        return;

    }

    targetValue = Number(targetValue ?? 0);

    const currentValue = Number(

        element.textContent.replace(/,/g, "")

    ) || 0;

    if (currentValue === targetValue) {

        return;

    }

    const duration = 800;

    const frameRate = 60;

    const totalFrames = Math.max(

        1,

        Math.round(duration / (1000 / frameRate))

    );

    let frame = 0;

    const difference = targetValue - currentValue;

    if (this.animationTimers[id]) {

    clearInterval(

        this.animationTimers[id]

    );

}

this.animationTimers[id] = setInterval(() => {

        frame++;

        const progress = frame / totalFrames;

        const value = Math.round(

            currentValue +

            (difference * progress)

        );

        element.textContent =

            value.toLocaleString();

        if (frame >= totalFrames) {

            clearInterval(

    this.animationTimers[id]

);

delete this.animationTimers[id];

            element.textContent =

                targetValue.toLocaleString();

        }

    }, 1000 / frameRate);

},

    updateMostUsedTool(statistics) {

    const element = document.getElementById(

        "mostUsedTool"

    );

    if (!element) {

        return;

    }

    const stats = {

        "Calculations":
            statistics.calculations || 0,

        "Conversions":
            statistics.conversions || 0,

        "Utilities":
            statistics.utilities || 0,

        "Tool Actions":
            statistics.tool_actions || 0

    };

    let highestName = "None";

    let highestValue = Number.NEGATIVE_INFINITY;

    Object.entries(stats).forEach(

        ([name, value]) => {

            if (value > highestValue) {

                highestValue = value;

                highestName = name;

            }

        }

    );

    element.textContent = highestName;

},

    startAutoRefresh() {

        setInterval(() => {

            this.load();

        }, this.refreshInterval);

    },

    updateStatus() {

    const element = document.getElementById(

        "statisticsStatus"

    );

    if (!element) {

        return;

    }

    if (!this.lastUpdated) {

        element.textContent =

            "Connecting...";

        return;

    }

    const seconds = Math.floor(

        (Date.now() - this.lastUpdated) / 1000

    );

    if (seconds < 5) {

        element.textContent =

            "🟢 Live • Updated just now";

    }

    else if (seconds < 60) {

        element.textContent =

            `🟢 Live • Updated ${seconds} seconds ago`;

    }

    else {

        const minutes = Math.floor(

            seconds / 60

        );

        element.textContent =

            `🟢 Live • Updated ${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

    }

},
    
    init() {

    this.load();

    this.startAutoRefresh();

    this.statusTimer = setInterval(

        () => {

            this.updateStatus();

        },

        1000

    );

},

};

Object.freeze(

    StatisticsLoader

);