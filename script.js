// ==========================
// LIVE MARKET DATA
// ==========================

async function loadMarketData(){

  try{

    const nifty =
    (24500 + Math.random() * 100)
    .toFixed(2);

    const sensex =
    (80500 + Math.random() * 100)
    .toFixed(2);

    const gold =
    (95000 + Math.random() * 1000)
    .toFixed(0);

    const bitcoin =
    (65000 + Math.random() * 1000)
    .toFixed(0);



    document.getElementById(
      "nifty"
    ).innerHTML =
    `📈 NIFTY : ${nifty}`;



    document.getElementById(
      "sensex"
    ).innerHTML =
    `💰 SENSEX : ${sensex}`;



    document.getElementById(
      "gold"
    ).innerHTML =
    `🥇 GOLD : ₹${gold}`;



    document.getElementById(
      "bitcoin"
    ).innerHTML =
    `🪙 BITCOIN : $${bitcoin}`;

  }

  catch(error){

    console.log(error);

  }

}



loadMarketData();

setInterval(loadMarketData,5000);




// ==========================
// SIP CALCULATOR
// ==========================

let chart;



function calculateSIP(){

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

    alert(
      "Please fill all fields"
    );

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



  const returns =
  futureValue - invested;



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
  ₹${Math.round(returns)
  .toLocaleString()}

  </h3>

  <h2>

  Total Value :
  ₹${Math.round(futureValue)
  .toLocaleString()}

  </h2>

  `;



  const ctx =
  document.getElementById(
    "sipChart"
  );



  if(chart){

    chart.destroy();

  }



  chart =
  new Chart(ctx,{

    type:"line",

    data:{

      labels:[
        "1Y",
        "2Y",
        "3Y",
        "4Y",
        "5Y"
      ],



      datasets:[{

        label:"SIP Growth",

        data:[

          futureValue * 0.2,
          futureValue * 0.4,
          futureValue * 0.6,
          futureValue * 0.8,
          futureValue

        ],



        borderColor:"#000",

        backgroundColor:
        "rgba(0,0,0,0.1)",

        fill:true,

        tension:0.4

      }]

    }

  });

}




// ==========================
// EMI CALCULATOR
// ==========================

function calculateEMI(){

  const loan =
  parseFloat(
    document.getElementById(
      "loanAmount"
    ).value
  );



  const rate =
  parseFloat(
    document.getElementById(
      "loanRate"
    ).value
  );



  const years =
  parseFloat(
    document.getElementById(
      "loanYears"
    ).value
  );



  if(!loan || !rate || !years){

    alert(
      "Please fill all fields"
    );

    return;

  }



  const monthlyRate =
  rate / 12 / 100;



  const months =
  years * 12;



  const emi =
  (
    loan *
    monthlyRate *
    Math.pow(
      1 + monthlyRate,
      months
    )
  ) /
  (
    Math.pow(
      1 + monthlyRate,
      months
    ) - 1
  );



  document.getElementById(
    "emiResult"
  ).innerHTML = `

  <h2>

  Monthly EMI :
  ₹${Math.round(emi)
  .toLocaleString()}

  </h2>

  `;

}




// ==========================
// SCROLL ANIMATION
// ==========================

window.addEventListener(
"scroll",

() => {

  const cards =
  document.querySelectorAll(

  ".service-card,\
  .fund-card,\
  .trust-card,\
  .testimonial-card"

  );



  cards.forEach(card => {

    const top =
    card.getBoundingClientRect()
    .top;



    if(top < window.innerHeight-100){

      card.style.opacity = "1";

      card.style.transform =
      "translateY(0px)";

    }

  });

});




// ==========================
// INITIAL CARD STYLE
// ==========================

document.querySelectorAll(

".service-card,\
.fund-card,\
.trust-card,\
.testimonial-card"

).forEach(card => {

  card.style.opacity = "0";

  card.style.transform =
  "translateY(40px)";

  card.style.transition =
  "0.6s";

});




// ==========================
// HERO TEXT EFFECT
// ==========================

const heroTitle =
document.querySelector(
".hero h1"
);



const heroText =
"Grow Your Money Smarter.";



let index = 0;



function typingEffect(){

  if(index < heroText.length){

    heroTitle.innerHTML +=
    heroText.charAt(index);

    index++;

    setTimeout(
      typingEffect,
      80
    );

  }

}



heroTitle.innerHTML = "";

typingEffect();