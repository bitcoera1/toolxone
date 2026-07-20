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

    const subject =
    String(
        heroAsset?.subject || ""
    ).toLowerCase();

const primaryVisual =
    String(
        heroAsset?.primaryVisual || ""
    ).toLowerCase();

const toolId =
    String(
        heroAsset?.toolId || ""
    ).toLowerCase();

const category =
    String(
        heroAsset?.category || ""
    ).toLowerCase();

const signals = [
    heroId,
    subject,
    primaryVisual,
    toolId,
    category
]
    .filter(Boolean)
    .join(" ");

    if (
    /\bcalculator\b|\bscientific\b|\bmath\b|\babacus\b|\barithmetic\b/.test(
        signals
    )
) {
    return `
    <svg
        class="phoenix-svg-hero"
        viewBox="0 0 320 320"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Calculator illustration">

        <defs>
            <linearGradient
                id="calculatorBodyGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="1">

                <stop
                    offset="0%"
                    stop-color="#0f172a"/>

                <stop
                    offset="100%"
                    stop-color="#1e293b"/>
            </linearGradient>

            <linearGradient
                id="calculatorAccentGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="1">

                <stop
                    offset="0%"
                    stop-color="#10b981"/>

                <stop
                    offset="100%"
                    stop-color="#22d3ee"/>
            </linearGradient>

            <filter
                id="calculatorGlow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%">

                <feGaussianBlur
                    stdDeviation="7"
                    result="blur"/>

                <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        <rect
            x="66"
            y="34"
            width="188"
            height="252"
            rx="30"
            fill="url(#calculatorBodyGradient)"
            stroke="#ffffff"
            stroke-opacity="0.18"
            stroke-width="3"/>

        <rect
            x="88"
            y="62"
            width="144"
            height="58"
            rx="14"
            fill="#020617"
            stroke="#22d3ee"
            stroke-opacity="0.45"
            stroke-width="3"/>

        <text
            x="214"
            y="100"
            text-anchor="end"
            font-size="30"
            font-weight="800"
            fill="#f8fafc">
            123.45
        </text>

        <g fill="#1e293b" stroke="#ffffff" stroke-opacity="0.10">

            <rect x="88"  y="142" width="34" height="34" rx="9"/>
            <rect x="132" y="142" width="34" height="34" rx="9"/>
            <rect x="176" y="142" width="34" height="34" rx="9"/>

            <rect x="88"  y="186" width="34" height="34" rx="9"/>
            <rect x="132" y="186" width="34" height="34" rx="9"/>
            <rect x="176" y="186" width="34" height="34" rx="9"/>

            <rect x="88"  y="230" width="34" height="34" rx="9"/>
            <rect x="132" y="230" width="34" height="34" rx="9"/>
        </g>

        <g
            fill="#f8fafc"
            font-size="17"
            font-weight="800"
            text-anchor="middle">

            <text x="105" y="165">7</text>
            <text x="149" y="165">8</text>
            <text x="193" y="165">9</text>

            <text x="105" y="209">4</text>
            <text x="149" y="209">5</text>
            <text x="193" y="209">6</text>

            <text x="105" y="253">1</text>
            <text x="149" y="253">0</text>
        </g>

        <rect
            x="220"
            y="142"
            width="34"
            height="78"
            rx="9"
            fill="url(#calculatorAccentGradient)"
            filter="url(#calculatorGlow)"/>

        <text
            x="237"
            y="190"
            text-anchor="middle"
            font-size="26"
            font-weight="900"
            fill="#06251f">
            +
        </text>

        <rect
            x="176"
            y="230"
            width="78"
            height="34"
            rx="9"
            fill="#10b981"/>

        <text
            x="215"
            y="253"
            text-anchor="middle"
            font-size="22"
            font-weight="900"
            fill="#06251f">
            =
        </text>

        <circle
            cx="76"
            cy="66"
            r="9"
            fill="#22d3ee"
            filter="url(#calculatorGlow)"/>

        <circle
            cx="252"
            cy="260"
            r="8"
            fill="#10b981"
            filter="url(#calculatorGlow)"/>
    </svg>`;
}

    if (
    /\bcurrency\b|\bexchange\b|\bforex\b|\bconverter\b/.test(
        signals
    )
) {
    return `
    <svg
        class="phoenix-svg-hero"
        viewBox="0 0 320 320"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Currency exchange illustration">

        <defs>
            <linearGradient
                id="currencyCardGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="1">

                <stop
                    offset="0%"
                    stop-color="#0f172a"/>

                <stop
                    offset="100%"
                    stop-color="#1e3a8a"/>
            </linearGradient>

            <linearGradient
                id="currencyAccentGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="1">

                <stop
                    offset="0%"
                    stop-color="#10b981"/>

                <stop
                    offset="100%"
                    stop-color="#22d3ee"/>
            </linearGradient>

            <filter
                id="currencyGlow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%">

                <feGaussianBlur
                    stdDeviation="8"
                    result="blur"/>

                <feMerge>
                    <feMergeNode
                        in="blur"/>

                    <feMergeNode
                        in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        <rect
            x="34"
            y="48"
            width="252"
            height="224"
            rx="32"
            fill="url(#currencyCardGradient)"
            stroke="#ffffff"
            stroke-opacity="0.16"
            stroke-width="2"/>

        <circle
            cx="160"
            cy="160"
            r="92"
            fill="none"
            stroke="#22d3ee"
            stroke-opacity="0.22"
            stroke-width="3"/>

        <path
            d="M88 154
               C108 116, 150 96, 196 108
               C220 114, 238 128, 250 144"
            fill="none"
            stroke="#10b981"
            stroke-width="12"
            stroke-linecap="round"/>

        <path
            d="M236 126
               L254 145
               L230 150"
            fill="none"
            stroke="#10b981"
            stroke-width="10"
            stroke-linecap="round"
            stroke-linejoin="round"/>

        <path
            d="M232 174
               C212 212, 170 232, 124 220
               C100 214, 82 200, 70 184"
            fill="none"
            stroke="#22d3ee"
            stroke-width="12"
            stroke-linecap="round"/>

        <path
            d="M84 202
               L66 183
               L90 178"
            fill="none"
            stroke="#22d3ee"
            stroke-width="10"
            stroke-linecap="round"
            stroke-linejoin="round"/>

        <circle
            cx="112"
            cy="160"
            r="38"
            fill="#111827"
            stroke="#10b981"
            stroke-width="4"/>

        <circle
            cx="208"
            cy="160"
            r="38"
            fill="#111827"
            stroke="#22d3ee"
            stroke-width="4"/>

        <text
            x="112"
            y="172"
            text-anchor="middle"
            font-size="38"
            font-weight="800"
            fill="#f8fafc">
            $
        </text>

        <text
            x="208"
            y="172"
            text-anchor="middle"
            font-size="36"
            font-weight="800"
            fill="#f8fafc">
            €
        </text>

        <circle
            cx="160"
            cy="70"
            r="10"
            fill="#22d3ee"
            filter="url(#currencyGlow)"/>

        <circle
            cx="268"
            cy="220"
            r="8"
            fill="#10b981"
            filter="url(#currencyGlow)"/>
    </svg>`;
}

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