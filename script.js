const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  if (document.body.classList.contains("light-mode")) {
    themeToggle.innerHTML = "☀️";
  } else {
    themeToggle.innerHTML = "🌙";
  }
});


// LIVE MARKET DATA

async function loadMarketData() {

  // NIFTY

  document.getElementById("nifty").innerHTML =
    "📈 NIFTY 50 : 24,850 ▲ +125";

  // SENSEX

  document.getElementById("sensex").innerHTML =
    "💰 SENSEX : 81,450 ▲ +410";

  // GOLD

  document.getElementById("gold").innerHTML =
    "🥇 GOLD : ₹96,200";

  // USD INR

  document.getElementById("usd").innerHTML =
    "💵 USD/INR : ₹83.45";

  // BITCOIN

  document.getElementById("bitcoin").innerHTML =
    "🪙 BITCOIN : $104,000";

}

loadMarketData();


// AUTO REFRESH EVERY 10 SECONDS

setInterval(loadMarketData, 10000);



// CONTACT FORM

const form = document.getElementById("contactForm");

form.addEventListener("submit", function (e) {

  e.preventDefault();

  alert(
    "Thank You! We will contact you soon."
  );

  form.reset();

});



// SCROLL ANIMATION

const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {

  sections.forEach((section) => {

    const sectionTop =
      section.getBoundingClientRect().top;

    if (sectionTop < window.innerHeight - 100) {

      section.classList.add("show");

    }

  });

});