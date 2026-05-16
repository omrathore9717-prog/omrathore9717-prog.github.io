// MOBILE MENU

const menuBtn =
document.querySelector(".menu-btn");

const navLinks =
document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("active");

});




// LIVE MARKET DATA

const nifty =
document.getElementById("nifty");

const sensex =
document.getElementById("sensex");

const gold =
document.getElementById("gold");

const usd =
document.getElementById("usd");

function updateMarketData(){

    const niftyValue =
    (24500 + Math.random() * 300).toFixed(2);

    const sensexValue =
    (80500 + Math.random() * 500).toFixed(2);

    const goldValue =
    (72500 + Math.random() * 700).toFixed(2);

    const usdValue =
    (83 + Math.random()).toFixed(2);


    nifty.innerHTML =
    niftyValue;

    sensex.innerHTML =
    sensexValue;

    gold.innerHTML =
    "₹" + goldValue;

    usd.innerHTML =
    "₹" + usdValue;

}

updateMarketData();

setInterval(updateMarketData,3000);




// SIP CALCULATOR

function calculateSIP(){

    const amount =
    parseFloat(
        document.getElementById("sipAmount").value
    );

    const rate =
    parseFloat(
        document.getElementById("sipRate").value
    );

    const years =
    parseFloat(
        document.getElementById("sipYears").value
    );

    const result =
    document.getElementById("sipResult");


    if(
        isNaN(amount) ||
        isNaN(rate) ||
        isNaN(years)
    ){

        result.innerHTML =
        "Please Enter Values";

        return;

    }


    const monthlyRate =
    rate / 12 / 100;

    const months =
    years * 12;


    const maturityValue =

    amount *

    (
        (
            Math.pow(
                1 + monthlyRate,
                months
            ) - 1
        ) / monthlyRate
    )

    *

    (
        1 + monthlyRate
    );


    result.innerHTML =

    "₹" +

    Math.round(
        maturityValue
    ).toLocaleString();


    updateChart(
        amount * months,
        maturityValue - (amount * months)
    );

}




// SIP CHART

const sipChart =
document.getElementById("sipChart");

const chart = new Chart(sipChart, {

    type:"doughnut",

    data:{

        labels:[
            "Invested Amount",
            "Estimated Growth"
        ],

        datasets:[{

            data:[50,50],

            backgroundColor:[
                "#111111",
                "#d1d5db"
            ],

            borderWidth:0

        }]

    },

    options:{

        responsive:true,

        plugins:{

            legend:{

                position:"bottom"

            }

        }

    }

});



function updateChart(
    invested,
    returns
){

    chart.data.datasets[0].data = [
        invested,
        returns
    ];

    chart.update();

}




// PORTFOLIO CHART

const portfolioChart =
document.getElementById("portfolioChart");

new Chart(portfolioChart,{

    type:"line",

    data:{

        labels:[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun"
        ],

        datasets:[{

            label:"Portfolio Growth",

            data:[
                4,
                6,
                8,
                7,
                10,
                14
            ],

            borderColor:"#111111",

            backgroundColor:"rgba(0,0,0,0.05)",

            fill:true,

            tension:0.4

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

            x:{
                grid:{
                    display:false
                }
            },

            y:{
                grid:{
                    color:"#eeeeee"
                }
            }

        }

    }

});




// NAVBAR EFFECT

window.addEventListener("scroll", () => {

    const navbar =
    document.querySelector(".navbar");

    if(window.scrollY > 50){

        navbar.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.08)";

    }

    else{

        navbar.style.boxShadow =
        "none";

    }

});




// SCROLL ANIMATION

const animatedCards =

document.querySelectorAll(

    ".service-card,\
     .market-card,\
     .fund-card,\
     .amc-card,\
     .contact-card,\
     .stat-card"

);


function revealCards(){

    animatedCards.forEach(card => {

        const top =
        card.getBoundingClientRect().top;

        if(
            top < window.innerHeight - 80
        ){

            card.style.opacity = "1";

            card.style.transform =
            "translateY(0px)";

        }

    });

}


animatedCards.forEach(card => {

    card.style.opacity = "0";

    card.style.transform =
    "translateY(50px)";

    card.style.transition =
    "0.8s ease";

});


window.addEventListener(
    "scroll",
    revealCards
);

revealCards();




// AUTO SIP EXAMPLE

window.onload = () => {

    document.getElementById(
        "sipAmount"
    ).value = 5000;

    document.getElementById(
        "sipRate"
    ).value = 12;

    document.getElementById(
        "sipYears"
    ).value = 10;

    calculateSIP();

};