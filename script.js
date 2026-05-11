const themeToggle =
document.getElementById("themeToggle");

if (themeToggle) {

  themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    if (
      document.body.classList.contains(
        "light-mode"
      )
    ) {

      themeToggle.innerHTML = "☀️";

    } else {

      themeToggle.innerHTML = "🌙";

    }

  });

}



// MARKET TEXT

function loadMarketData() {

  const nifty =
  document.getElementById("nifty");

  const sensex =
  document.getElementById("sensex");

  const gold =
  document.getElementById("gold");

  const usd =
  document.getElementById("usd");

  const bitcoin =
  document.getElementById("bitcoin");

  if (nifty)
    nifty.innerHTML =
    "📈 NIFTY 50 : 24,850 ▲ +125";

  if (sensex)
    sensex.innerHTML =
    "💰 SENSEX : 81,450 ▲ +410";

  if (gold)
    gold.innerHTML =
    "🥇 GOLD : ₹96,200";

  if (usd)
    usd.innerHTML =
    "💵 USD/INR : ₹83.45";

  if (bitcoin)
    bitcoin.innerHTML =
    "🪙 BITCOIN : $104,000";

}

loadMarketData();

setInterval(loadMarketData, 10000);