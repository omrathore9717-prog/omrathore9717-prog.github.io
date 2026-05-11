// LOADER

window.addEventListener("load", function(){

  document.getElementById("loader")
  .style.display = "none";

});

// COUNTER ANIMATION

const counters =
document.querySelectorAll('.counter');

counters.forEach(counter => {

  counter.innerText = '0';

  const updateCounter = () => {

    const target =
    +counter.getAttribute('data-target');

    const c =
    +counter.innerText;

    const increment = target / 100;

    if(c < target){

      counter.innerText =
      `${Math.ceil(c + increment)}`;

      setTimeout(updateCounter, 20);

    }else{

      counter.innerText =
      target + '+';

    }

  };

  updateCounter();

});

// SIP CALCULATOR

function calculateSIP(){

  const monthlyInvestment =
  document.getElementById(
  "monthlyInvestment").value;

  const years =
  document.getElementById(
  "years").value;

  const returnRate =
  document.getElementById(
  "returnRate").value;

  const monthlyRate =
  returnRate / 12 / 100;

  const months = years * 12;

  const futureValue =
  monthlyInvestment *

  (((Math.pow(
  1 + monthlyRate,
  months)) - 1)

  / monthlyRate)

  * (1 + monthlyRate);

  document.getElementById(
  "sipResult").innerHTML =

  "Estimated Value: ₹" +

  Math.round(
  futureValue).toLocaleString();

}

// EMI CALCULATOR

function calculateEMI(){

  const loan =
  document.getElementById(
  "loanAmount").value;

  const years =
  document.getElementById(
  "loanYears").value;

  const rate =
  document.getElementById(
  "loanRate").value;

  const monthlyRate =
  rate / 12 / 100;

  const months =
  years * 12;

  const emi =

  (loan * monthlyRate *

  Math.pow(
  1 + monthlyRate,
  months))

  /

  (Math.pow(
  1 + monthlyRate,
  months) - 1);

  document.getElementById(
  "emiResult").innerHTML =

  "Monthly EMI : ₹" +

  Math.round(
  emi).toLocaleString();

}

// BACK TO TOP

const topBtn =
document.getElementById("topBtn");

window.onscroll = function(){

  if(document.body.scrollTop > 300 ||

  document.documentElement
  .scrollTop > 300){

    topBtn.style.display =
    "block";

  }else{

    topBtn.style.display =
    "none";

  }

};

topBtn.onclick = function(){

  window.scrollTo({

    top:0,
    behavior:"smooth"

  });

};

// DARK MODE

const themeToggle =
document.getElementById(
"themeToggle");

themeToggle.onclick = function(){

  document.body.classList
  .toggle("light-mode");

  if(document.body.classList
  .contains("light-mode")){

    themeToggle.innerHTML =
    "☀️";

  }else{

    themeToggle.innerHTML =
    "🌙";

  }

};

// SAVE THEME

if(localStorage.getItem("theme")
=== "light"){

  document.body.classList
  .add("light-mode");

  themeToggle.innerHTML =
  "☀️";

}

themeToggle.addEventListener(
"click",

function(){

  if(document.body.classList
  .contains("light-mode")){

    localStorage.setItem(
    "theme",
    "light");

  }else{

    localStorage.setItem(
    "theme",
    "dark");

  }

});