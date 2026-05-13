// ==========================
// REMOVE LOADER
// ==========================

window.addEventListener("load", () => {

  document.getElementById("loader")
  .style.display = "none";

});




// ==========================
// LIVE MARKET DATA
// ==========================

async function loadMarketData() {

  try {

    // DEMO LIVE STYLE VALUES

    const nifty =
    (24000 + Math.random() * 500)
    .toFixed(2);

    const sensex =
    (80000 + Math.random() * 1000)
    .toFixed(2);

    const gold =
    (95000 + Math.random() * 2000)
    .toFixed(2);

    const bitcoin =
    (60000 + Math.random() * 5000)
    .toFixed(2);

    const usd =
    (83 + Math.random())
    .toFixed(2);



    // TOP BAR

    document.getElementById("nifty")
    .innerHTML =
    `📈 NIFTY 50 : ${nifty}`;

    document.getElementById("sensex")
    .innerHTML =
    `💰 SENSEX : ${sensex}`;

    document.getElementById("gold")
    .innerHTML =
    `🥇 GOLD : ₹${gold}`;

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
// LIVE MUTUAL FUNDS
// ==========================

async function loadMutualFunds() {

  const container =
  document.getElementById(
    "fundContainer"
  );



  container.innerHTML =
  "Loading Mutual Funds...";



  try {

    const response =
    await fetch(
      "https://api.mfapi.in/mf"
    );



    const data =
    await response.json();



    container.innerHTML = "";



    // TOP 20 FUNDS

    const topFunds =
    data.slice(0, 20);



    topFunds.forEach(fund => {

      const card =
      document.createElement("div");



      card.className =
      "fund-card";



      card.innerHTML = `

      <h2>
        ${fund.schemeName}
      </h2>

      <p>
        Scheme Code :
        ${fund.schemeCode}
      </p>

      <button>
        Invest Now
      </button>

      `;



      container.appendChild(card);

    });

  }

  catch(error){

    container.innerHTML =
    "Unable to load funds";

  }

}



loadMutualFunds();




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



  if(!amount || !years){

    document.getElementById(
      "sipResult"
    ).innerHTML =
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

  document.getElementById(
    "sipResult"
  ).innerHTML = `

  <h3>

    Total Investment :
    ₹${invested.toLocaleString()}

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



  // GRAPH

  const labels = [];

  const values = [];



  for(let i = 1; i <= years; i++) {

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



  if(chart){

    chart.destroy();

  }



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
// SEARCH FILTER
// ==========================

const searchInput =
document.querySelector(
  ".search-box input"
);



searchInput.addEventListener(
"keyup",

function(){

  const value =
  searchInput.value
  .toLowerCase();



  const cards =
  document.querySelectorAll(
    ".fund-card"
  );



  cards.forEach(card => {

    const text =
    card.innerText
    .toLowerCase();



    if(text.includes(value)){

      card.style.display =
      "block";

    }

    else{

      card.style.display =
      "none";

    }

  });

});




// ==========================
// TYPING EFFECT
// ==========================

const heading =
document.querySelector(
  ".hero h1"
);



const text =
"Grow Your Wealth Smartly.";



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