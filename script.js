// LIVE MARKET VALUES

const nifty = document.getElementById("nifty");
const sensex = document.getElementById("sensex");
const gold = document.getElementById("gold");

function updateMarket() {

    const niftyValue =
        (22000 + Math.random() * 500).toFixed(2);

    const sensexValue =
        (72000 + Math.random() * 1000).toFixed(2);

    const goldValue =
        (72000 + Math.random() * 500).toFixed(2);

    nifty.innerHTML = niftyValue;

    sensex.innerHTML = sensexValue;

    gold.innerHTML =
        "₹" + goldValue;
}

updateMarket();

setInterval(updateMarket, 3000);


// SIP CALCULATOR

function calculateSIP() {

    const amount =
        document.getElementById("amount").value;

    const years =
        document.getElementById("years").value;

    const result =
        document.getElementById("result");

    if (amount === "" || years === "") {

        result.innerHTML =
            "Please Enter Values";

        return;
    }

    const monthlyInvestment =
        parseFloat(amount);

    const investmentYears =
        parseFloat(years);

    const rate =
        12 / 100 / 12;

    const months =
        investmentYears * 12;

    const maturity =
        monthlyInvestment *
        (((Math.pow(1 + rate, months)) - 1) / rate) *
        (1 + rate);

    result.innerHTML =
        "Expected Return: ₹" +
        maturity.toFixed(0);
}


// NAVBAR SHADOW EFFECT

window.addEventListener("scroll", function () {

    const navbar =
        document.querySelector(".navbar");

    if (window.scrollY > 50) {

        navbar.style.background =
            "#000";

        navbar.style.boxShadow =
            "0 0 20px rgba(255,255,255,0.08)";
    }

    else {

        navbar.style.background =
            "rgba(0,0,0,0.85)";

        navbar.style.boxShadow =
            "none";
    }
});


// SCROLL ANIMATION

const cards =
    document.querySelectorAll(
        ".service-card, .market-card, .glass-card"
    );

window.addEventListener("scroll", () => {

    cards.forEach((card) => {

        const cardTop =
            card.getBoundingClientRect().top;

        if (cardTop < window.innerHeight - 100) {

            card.style.opacity = "1";

            card.style.transform =
                "translateY(0px)";
        }
    });
});

cards.forEach((card) => {

    card.style.opacity = "0";

    card.style.transform =
        "translateY(40px)";

    card.style.transition =
        "0.8s ease";
});