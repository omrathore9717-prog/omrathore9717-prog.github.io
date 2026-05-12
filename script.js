// LIVE MARKET DATA

async function loadMarketData() {

  // DEMO LIVE VALUES

  const nifty =
  "📈 NIFTY 50 : 24,850 ▲ +125";

  const sensex =
  "💰 SENSEX : 81,450 ▲ +410";

  const gold =
  "🥇 GOLD : ₹96,200";

  const bitcoin =
  "🪙 BITCOIN : $104,000";



  // TOP TICKER

  document.getElementById("nifty")
  .innerHTML = nifty;

  document.getElementById("sensex")
  .innerHTML = sensex;

  document.getElementById("gold")
  .innerHTML = gold;

  document.getElementById("bitcoin")
  .innerHTML = bitcoin;



  // DASHBOARD CARD

  document.getElementById("cardNifty")
  .innerHTML = "+1.20%";

  document.getElementById("cardSensex")
  .innerHTML = "+620";

  document.getElementById("cardGold")
  .innerHTML = "₹96,200";

  document.getElementById("cardBitcoin")
  .innerHTML = "$104K";

}

loadMarketData();

setInterval(loadMarketData, 10000);





// SIP CALCULATOR

let chart;

function calculateSIP() {

  const amount =
  parseFloat(
    document.getElementById("sipAmount").value
  );

  const years =
  parseFloat(
    document.getElementById("sipYears").value
  );



  if (!amount || !years) {

    document.getElementById("sipResult")
    .innerHTML =
    "⚠️ Please enter valid details";

    return;

  }



  const annualRate = 12;

  const monthlyRate =
  annualRate / 12 / 100;

  const months =
  years * 12;



  const futureValue =
  amount *
  (
    (
      Math.pow(
        1 + monthlyRate,
        months
      ) - 1
    ) / monthlyRate
  ) *
  (1 + monthlyRate);



  const invested =
  amount * months;

  const profit =
  futureValue - invested;



  // RESULT

  document.getElementById("sipResult")
  .innerHTML = `

  <h3>
    Total Investment :
    ₹${invested.toLocaleString()}
  </h3>

  <h3>
    Estimated Returns :
    ₹${Math.round(profit).toLocaleString()}
  </h3>

  <h2>
    Total Value :
    ₹${Math.round(futureValue).toLocaleString()}
  </h2>

  `;



  // GRAPH DATA

  const labels = [];

  const values = [];



  for(let i = 1; i <= years; i++) {

    const totalMonths = i * 12;

    const value =
    amount *
    (
      (
        Math.pow(
          1 + monthlyRate,
          totalMonths
        ) - 1
      ) / monthlyRate
    ) *
    (1 + monthlyRate);

    labels.push(i + " Year");

    values.push(
      Math.round(value)
    );

  }



  // DESTROY OLD CHART

  if(chart) {

    chart.destroy();

  }



  // CREATE CHART

  const ctx =
  document.getElementById("sipChart");



  chart = new Chart(ctx, {

    type:"line",

    data:{

      labels:labels,

      datasets:[{

        label:"SIP Growth",

        data:values,

        borderColor:"#00d4ff",

        backgroundColor:
        "rgba(0,212,255,0.2)",

        fill:true,

        tension:0.4

      }]

    },

    options:{

      responsive:true,

      plugins:{

        legend:{
          labels:{
            color:"white"
          }
        }

      },

      scales:{

        x:{
          ticks:{
            color:"white"
          }
        },

        y:{
          ticks:{
            color:"white"
          }
        }

      }

    }

  });

}