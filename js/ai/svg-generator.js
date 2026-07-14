(function () {
    "use strict";

    if (window.ToolXoneSVGGenerator) {
        return;
    }

    const ToolXoneSVGGenerator = {

        generateHeroSVG(heroAsset) {

    const heroId = String(
        heroAsset?.id || ""
    ).toLowerCase();

    if (heroId.includes("qr")) {
        return `
        <svg
            class="phoenix-svg-hero"
            viewBox="0 0 220 220"
            xmlns="http://www.w3.org/2000/svg">

            <rect
                width="220"
                height="220"
                rx="18"
                fill="#ffffff"/>

            <rect x="20" y="20" width="50" height="50"
                fill="#111827"/>

            <rect x="150" y="20" width="50" height="50"
                fill="#111827"/>

            <rect x="20" y="150" width="50" height="50"
                fill="#111827"/>

            <rect x="95" y="95"
                width="30"
                height="30"
                fill="#22d3ee"/>

            <rect x="130" y="95"
                width="20"
                height="20"
                fill="#111827"/>

            <rect x="95" y="130"
                width="20"
                height="20"
                fill="#111827"/>

            <rect x="130" y="130"
                width="20"
                height="20"
                fill="#22d3ee"/>

        </svg>`;
    }

    return null;

},

        generateSupportingSVG(asset) {
            return null;
        },

        generateDecorativeSVG(asset) {
            return null;
        }

    };

    window.ToolXoneSVGGenerator =
        ToolXoneSVGGenerator;

})();