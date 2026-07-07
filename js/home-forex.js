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

function getTrend(){
    const isUp = Math.random() > 0.45;
    const change = (Math.random() * 0.45 + 0.03).toFixed(2);

    return {
        isUp,
        text: `${isUp ? "▲ +" : "▼ -"}${change}%`
    };
}

function generateSparklinePoints(isUp){
    const points = [];
    let y = isUp ? 28 : 12;

    for(let i = 0; i < 8; i++){
        const x = i * 17;

        y += isUp
            ? Math.floor(Math.random() * 9) - 5
            : Math.floor(Math.random() * 9) - 3;

        if(isUp){
            y -= 1;
        }else{
            y += 1;
        }

        y = Math.max(6, Math.min(34, y));
        points.push(`${x},${y}`);
    }

    return points.join(" ");
}

async function loadHeroSnapshot(){
    const select = document.getElementById("heroBaseCurrency");
    const rowsBox = document.getElementById("heroForexRows");
    const marketTime = document.getElementById("marketTime");

    if(!select || !rowsBox) return;

    const quote = select.value || "PKR";

    rowsBox.innerHTML = `<div class="market-loading">Loading latest exchange rates...</div>`;

    try{
        rowsBox.innerHTML = "";

        for(const base of heroCurrencies){
            let rate = 1;

            if(base !== quote){
                const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
                if(!response.ok) throw new Error("API Error");

                const data = await response.json();
                rate = data.rates[quote];

                if(!rate) throw new Error("Rate not found");
            }

            const baseInfo = getCurrencyInfo(base);
            const quoteInfo = getCurrencyInfo(quote);
            const trend = getTrend();

            rowsBox.innerHTML += `
                <div class="market-row">

                    <div class="currency-info">
                        <img class="currency-flag-img" src="${baseInfo.flag}" alt="${base} flag">

                        <div>
                            <strong>${base} / ${quote}</strong>
                            <small>${baseInfo.name} to ${quoteInfo.name}</small>
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
                                points="${generateSparklinePoints(trend.isUp)}"
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
            marketTime.textContent = new Date().toLocaleTimeString();
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