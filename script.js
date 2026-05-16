// NAVBAR SHADOW EFFECT

window.addEventListener("scroll", () => {

    const navbar =
    document.querySelector(".navbar");

    if(window.scrollY > 50){

        navbar.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.08)";

        navbar.style.background =
        "rgba(255,255,255,0.98)";

    }

    else{

        navbar.style.boxShadow =
        "none";

        navbar.style.background =
        "rgba(255,255,255,0.92)";
    }

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
    (24500 + Math.random() * 350).toFixed(2);

    const sensexValue =
    (80500 + Math.random() * 600).toFixed(2);

    const goldValue =
    (72500 + Math.random() * 800).toFixed(2);

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
        "Please Enter Valid Values";

        return;
    }


    const monthlyRate =
    rate / 12 / 100;

    const months =
    years * 12;


    const maturity =

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
        maturity
    ).toLocaleString();


    updateChart(
        amount * months,
        maturity - (amount * months)
    );

}




// SIP DOUGHNUT CHART

const sipChart =
document.getElementById("sipChart");


const chart = new Chart(sipChart,{

    type:"doughnut",

    data:{

        labels:[
            "Invested Amount",
            "Estimated Returns"
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




// PORTFOLIO LINE CHART

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

            label:"Growth",

            data:[
                2,
                5,
                7,
                9,
                11,
                15
            ],

            borderColor:"#111111",

            backgroundColor:
            "rgba(0,0,0,0.05)",

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




// CARD SCROLL ANIMATION

const cards =

document.querySelectorAll(

    ".service-card,\
     .market-card,\
     .fund-card,\
     .contact-card"

);


function revealCards(){

    cards.forEach(card => {

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


cards.forEach(card => {

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




// HERO FLOATING ANIMATION

const floatingBoxes =
document.querySelectorAll(".floating-box");


floatingBoxes.forEach((box,index)=>{

    setInterval(()=>{

        box.style.transform =
        `translateY(${
            Math.sin(Date.now()/700 + index) * 10
        }px)`;

    },30);

});




// AUTO SIP DEFAULT VALUES

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




// BUTTON HOVER EFFECT

const buttons =
document.querySelectorAll(
    ".primary-btn,\
     .secondary-btn,\
     .calculate-btn,\
     .nav-btn"
);


buttons.forEach(button=>{

    button.addEventListener(
        "mouseenter",
        ()=>{

            button.style.transform =
            "translateY(-5px) scale(1.02)";

        }
    );



    button.addEventListener(
        "mouseleave",
        ()=>{

            button.style.transform =
            "translateY(0px) scale(1)";

        }
    );

});