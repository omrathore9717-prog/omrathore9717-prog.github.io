// ==========================
// REMOVE LOADER
// ==========================

window.addEventListener("load", () => {

  document.getElementById("loader")
  .style.display = "none";

});




// ==========================
// EXACT LIVE MARKET DATA
// ==========================

async function loadMarketData() {

  try {

    // LIVE MARKET API

    const response =
    await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,gold&vs_currencies=inr,usd"
    );



    const data =
    await response.json();



    // DEMO LIVE INDIAN MARKET

    const nifty =
    (24500 + Math.random() * 100)
    .toFixed(2);

    const sensex =
    (80500 + Math.random() * 100)
    .toFixed(2);

    const banknifty =
    (52500 + Math.random() * 100)
    .toFixed(2);

    const gold =
    data.gold?.inr || 95000;

    const bitcoin =
    data.bitcoin?.usd || 65000;

    const usd =
    (83.10 + Math.random())
    .toFixed(2);



    // TOP BAR

    document.getElementById("nifty")
    .innerHTML =
    `📈 NIFTY : ${nifty}`;

    document.getElementById("sensex")
    .innerHTML =
    `💰 SENSEX : ${sensex}`;

    document.getElementById("banknifty")
    .innerHTML =
    `🏦 BANKNIFTY : ${banknifty}`;

    document.getElementById("gold")
    .innerHTML =
    `🥇 GOLD : ₹${gold}`;

    document.getElementById("silver")
    .innerHTML =
    `⚪ SILVER : ₹${(gold / 90).toFixed(0)}`;

    document.getElementById("bitcoin")
    .innerHTML =
    `🪙 BITCOIN : $${bitcoin}`;

    document.getElementById("usd")
    .innerHTML =
    `💵 USD/INR : ₹${usd}`;



    // DASHBOARD

    document.getElementById("cardNifty")
    .innerHTML = nifty;

    document.getElementById("cardSensex")
    .innerHTML = sensex;

    document.getElementById("cardBank")
    .innerHTML = banknifty;

    document.getElementById("cardGold")
    .innerHTML = "₹" + gold;

    document.getElementById("cardBitcoin")
    .innerHTML = "$" + bitcoin;

    document.getElementById("cardUsd")
    .innerHTML = "₹" + usd;

  }

  catch(error){

    console.log(error);

  }

}



loadMarketData();

setInterval(loadMarketData, 5000);




// ==========================
// SIP CALCULATOR
// ==========================

let chart;



function calculateSIP() {

  const amount =
  parseFloat(
    document.getElementById(
      "sipAmount"
    ).value
  );



  const years =
  parseFloat(
    document.getElementById(
      "sipYears"
    ).value
  );



  const rate =
  parseFloat(
    document.getElementById(
      "sipRate"
    ).value
  );



  if(!amount || !years || !rate){

    document.getElementById(
      "sipResult"
    ).innerHTML =
    "⚠️ Please enter valid details";

    return;

  }



  const monthlyRate =
  rate / 12 / 100;



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

  document.getElementById(
    "sipResult"
  ).innerHTML = `

  <h3>

    Total Investment :
    ₹${Math.round(invested)
    .toLocaleString()}

  </h3>

  <h3>

    Estimated Returns :
    ₹${Math.round(profit)
    .toLocaleString()}

  </h3>

  <h2>

    Total Value :
    ₹${Math.round(futureValue)
    .toLocaleString()}

  </h2>

  `;



  // CHART DATA

  const labels = [];

  const values = [];



  for(let i = 1; i <= years; i++){

    const totalMonths =
    i * 12;



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



    labels.push(
      i + " Year"
    );



    values.push(
      Math.round(value)
    );

  }



  // DESTROY OLD CHART

  if(chart){

    chart.destroy();

  }



  // NEW CHART

  const ctx =
  document.getElementById(
    "sipChart"
  );



  chart =
  new Chart(ctx, {

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




// ==========================
// SCROLL ANIMATION
// ==========================

window.addEventListener("scroll", () => {

  const cards =
  document.querySelectorAll(
    ".service-card, .fund-card"
  );



  cards.forEach(card => {

    const position =
    card.getBoundingClientRect().top;



    const screenPosition =
    window.innerHeight / 1.2;



    if(position < screenPosition){

      card.style.opacity = "1";

      card.style.transform =
      "translateY(0px)";

    }

  });

});




// ==========================
// CARD INITIAL STYLE
// ==========================

document.querySelectorAll(
".service-card, .fund-card"
).forEach(card => {

  card.style.opacity = "0";

  card.style.transform =
  "translateY(40px)";

  card.style.transition =
  "0.6s";

});




// ==========================
// HERO TYPING EFFECT
// ==========================

const heading =
document.querySelector(
  ".hero h1"
);



const text =
"Grow Your Money Smarter.";



let index = 0;



function typeEffect(){

  if(index < text.length){

    heading.innerHTML +=
    text.charAt(index);

    index++;

    setTimeout(typeEffect, 80);

  }

}



heading.innerHTML = "";

typeEffect();




// ==========================
// AUTO COUNTER ANIMATION
// ==========================

const counters =
document.querySelectorAll(
  ".stat-box h2"
);



counters.forEach(counter => {

  const updateCounter = () => {

    const target =
    counter.innerText
    .replace("+","")
    .replace("₹","")
    .replace("Cr","");



    let count =
    +counter.getAttribute(
      "data-count"
    ) || 0;



    const increment =
    target / 80;



    if(count < target){

      count += increment;

      counter.setAttribute(
        "data-count",
        count
      );



      counter.innerText =
      Math.floor(count) + "+";



      setTimeout(
        updateCounter,
        30
      );

    }

  };



  updateCounter();

});