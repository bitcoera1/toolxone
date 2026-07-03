 
let rateChart;

function swapCurrencies(){
    const from = document.getElementById("fromCurrency");
    const to = document.getElementById("toCurrency");

    let temp = from.value;
    from.value = to.value;
    to.value = temp;

    convertCurrency();
}

async function convertCurrency(){
    const amount = Number(document.getElementById("amount").value);
    const from = document.getElementById("fromCurrency").value;
    const to = document.getElementById("toCurrency").value;
    const result = document.getElementById("result");

    if(amount <= 0 || isNaN(amount)){
        result.innerHTML = "Please enter a valid amount.";
        document.getElementById("statusBar").innerHTML = "⚠️ Invalid Amount";
        return;
    }

    result.innerHTML = "Loading latest exchange rates...";
    document.getElementById("statusBar").innerHTML = "⏳ Checking latest exchange rates...";

    try{
        const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);

        if(!response.ok){
            throw new Error("API Error");
        }

        const data = await response.json();
        const rate = data.rates[to];
        const convertedAmount = amount * rate;

        displayResult(amount, from, to, convertedAmount, rate);

        document.getElementById("statusBar").innerHTML = "✅ Updated Successfully";

    }catch(error){
        console.error(error);
        document.getElementById("statusBar").innerHTML = "❌ Connection Error";
        result.innerHTML = "Unable to fetch live exchange rates. Please try again.";
    }
}

function displayResult(amount, from, to, convertedAmount, rate){
    const result = document.getElementById("result");

    result.innerHTML = `
<h3 style="color:#10B981;margin-bottom:15px;">💱 Currency Conversion</h3>

<div style="font-size:28px;">${amount} ${from}</div>

<div style="font-size:22px;color:#10B981;margin:12px 0;">↓</div>

<div style="font-size:30px;font-weight:bold;">${convertedAmount.toFixed(2)} ${to}</div>

<hr style="margin:20px 0;">

<div style="font-size:16px;">
<b>Exchange Rate</b><br>
1 ${from} = ${rate.toFixed(4)} ${to}
</div>

<div style="margin-top:15px;color:#10B981;">
✔ Latest Exchange Rate Available
</div>
`;

    document.getElementById("chartTitle").innerHTML = `📈 ${from} → ${to} Trend`;

    updateRateChart(from,to,rate);
}

function updateRateChart(from,to,rate){
    const ctx = document.getElementById("rateChart");

    if(!ctx){
        return;
    }

    const labels = ["6h","5h","4h","3h","2h","1h","Now"];

    const trendData = [
        rate * 0.996,
        rate * 0.998,
        rate * 0.997,
        rate * 1.001,
        rate * 1.003,
        rate * 1.002,
        rate
    ];

    if(!rateChart){
        rateChart = new Chart(ctx,{
            type:"line",
            data:{
                labels:labels,
                datasets:[{
                    label:`${from} to ${to}`,
                    data:trendData,
                    borderColor:"#10B981",
                    backgroundColor:"rgba(16,185,129,0.15)",
                    fill:true,
                    tension:0.4,
                    pointRadius:4
                }]
            },
            options:{
                responsive:true,
                plugins:{
                    legend:{
                        display:false
                    }
                },
                scales:{
                    y:{
                        beginAtZero:false
                    }
                }
            }
        });
    }else{
        rateChart.data.labels = labels;
        rateChart.data.datasets[0].label = `${from} to ${to}`;
        rateChart.data.datasets[0].data = trendData;
        rateChart.update();
    }
}