function formatHeroRateUpdate(value) {
    if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value) || value <= 0) return "Unavailable";
    const date = new Date(value * 1000);
    return Number.isFinite(date.getTime()) ? date.toISOString() : "Unavailable";
}

const heroCurrencies = ["USD", "EUR", "GBP", "AED"];

const currencyData = {
    USD: { name: "US Dollar", flag: "https://flagcdn.com/us.svg" },
    EUR: { name: "Euro", flag: "https://flagcdn.com/eu.svg" },
    GBP: { name: "British Pound", flag: "https://flagcdn.com/gb.svg" },
    AED: { name: "UAE Dirham", flag: "https://flagcdn.com/ae.svg" },
    PKR: { name: "Pakistani Rupee", flag: "https://flagcdn.com/pk.svg" },
    SAR: { name: "Saudi Riyal", flag: "https://flagcdn.com/sa.svg" },
    CAD: { name: "Canadian Dollar", flag: "https://flagcdn.com/ca.svg" },
    AUD: { name: "Australian Dollar", flag: "https://flagcdn.com/au.svg" },
    JPY: { name: "Japanese Yen", flag: "https://flagcdn.com/jp.svg" },
    CNY: { name: "Chinese Yuan", flag: "https://flagcdn.com/cn.svg" },
    INR: { name: "Indian Rupee", flag: "https://flagcdn.com/in.svg" },
    TRY: { name: "Turkish Lira", flag: "https://flagcdn.com/tr.svg" }
};

function getCurrencyInfo(code){
    return currencyData[code] || {
        name: code,
        flag: "https://flagcdn.com/un.svg"
    };
}

async function getTrend(base, quote){
    if(base === quote){
        return {
            isUp: true,
            text: "0.00%",
            points: "0,20 17,20 34,20 51,20 68,20 85,20 102,20 119,20"
        };
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 10);

    const formatDate = (date) => {
        return date.toISOString().split("T")[0];
    };

    const url =
        `https://api.frankfurter.dev/v2/rates` +
        `?base=${encodeURIComponent(base)}` +
        `&quotes=${encodeURIComponent(quote)}` +
        `&from=${formatDate(startDate)}` +
        `&to=${formatDate(endDate)}`;

    const response = await fetch(url);

    if(!response.ok){
        throw new Error("Historical rate API error");
    }

    const data = await response.json();

    const history = data
        .filter(item =>
            item.quote === quote &&
            typeof item.rate === "number"
        )
        .sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );

    if(history.length < 2){
        throw new Error("Not enough historical rate data");
    }

    const firstRate = history[0].rate;
    const latestRate = history[history.length - 1].rate;

    const change = ((latestRate - firstRate) / firstRate) * 100;

    const isUp = change >= 0;

    const text = isUp
        ? `▲ +${change.toFixed(2)}%`
        : `▼ ${change.toFixed(2)}%`;

    const rates = history.map(item => item.rate);

    const minRate = Math.min(...rates);
    const maxRate = Math.max(...rates);

    const points = rates.map((rate, index) => {
        const x = rates.length === 1
            ? 0
            : (index / (rates.length - 1)) * 119;

        const y = maxRate === minRate
            ? 20
            : 34 - ((rate - minRate) / (maxRate - minRate)) * 28;

        return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

    return {
        isUp,
        text,
        points
    };
}

async function loadHeroSnapshot(){
    const select = document.getElementById("heroBaseCurrency");
    const rowsBox = document.getElementById("heroForexRows");
    const marketTime = document.getElementById("marketTime");

    if(!select || !rowsBox) return;

    const quote = select.value || "PKR";
    if(marketTime) marketTime.textContent = "Unavailable";

    rowsBox.innerHTML = `<div class="market-loading">Loading latest exchange rates...</div>`;

    try{
        rowsBox.innerHTML = "";

        for(const base of heroCurrencies){
            let rate = 1;
            let rateUpdate = "Same-currency rate; provider update not applicable.";

            if(base !== quote){
                const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
                if(!response.ok) throw new Error("API Error");

                const data = await response.json();
                rate = data.rates[quote];
                rateUpdate = "Rate data updated: " + formatHeroRateUpdate(data.time_last_update_unix);

                if(!rate) throw new Error("Rate not found");
            }

            const baseInfo = getCurrencyInfo(base);
            const quoteInfo = getCurrencyInfo(quote);
            const trend = await getTrend(base, quote);

            rowsBox.innerHTML += `
                <div class="market-row">

                    <div class="currency-info">
                        <img class="currency-flag-img" src="${baseInfo.flag}" alt="${base} flag">

                        <div>
                            <strong>${base} / ${quote}</strong>
                            <small>${baseInfo.name} to ${quoteInfo.name}</small>
                            <small>${rateUpdate}</small>
                        </div>
                    </div>

                    <div class="currency-rate">
                        ${Number(rate).toFixed(4)}
                    </div>

                    <div class="currency-change">
                        <span class="${trend.isUp ? "trend-up" : "trend-down"}">
                            ${trend.text}
                        </span>
                    </div>

                    <div class="sparkline ${trend.isUp ? "spark-up" : "spark-down"}">
                        <svg viewBox="0 0 120 40" preserveAspectRatio="none">
                            <polyline
                                points="${trend.points}"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </div>

                </div>
            `;
        }

        if(marketTime){
            marketTime.textContent = new Date().toISOString();
        }

    }catch(error){
        console.error(error);
        rowsBox.innerHTML = `<div class="market-loading rate-error">Unable to load exchange rates.</div>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("heroBaseCurrency");

    loadHeroSnapshot();

    if(select){
        select.addEventListener("change", loadHeroSnapshot);
    }

    setInterval(loadHeroSnapshot, 60000);
});