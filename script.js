// =========================
// NAVBAR EFFECT
// =========================

window.addEventListener("scroll",()=>{

    const navbar =
    document.querySelector(".navbar");

    if(window.scrollY > 50){

        navbar.style.background =
        "rgba(255,255,255,0.75)";

        navbar.style.backdropFilter =
        "blur(20px)";

        navbar.style.boxShadow =
        "0 10px 40px rgba(0,0,0,0.05)";
    }

    else{

        navbar.style.background =
        "rgba(255,255,255,0.55)";

        navbar.style.boxShadow =
        "none";
    }

});




// =========================
// LIVE MARKET DATA
// =========================

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
    (24500 + Math.random()*300).toFixed(2);

    const sensexValue =
    (80500 + Math.random()*500).toFixed(2);

    const goldValue =
    (72500 + Math.random()*700).toFixed(2);

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




// =========================
// SIP CALCULATOR
// =========================

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




// =========================
// SIP CHART
// =========================

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
                "#d9d9d9"
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




// =========================
// PORTFOLIO CHART
// =========================

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
                10,
                14,
                18
            ],

            borderColor:"#111111",

            backgroundColor:
            "rgba(0,0,0,0.04)",

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
                    color:"#ececec"
                }
            }

        }

    }

});




// =========================
// REVEAL ANIMATION
// =========================

const cards =

document.querySelectorAll(

".service-card,\
 .market-card,\
 .testimonial-card,\
 .faq-box,\
 .contact-card,\
 .top-amc-card"

);


function revealCards(){

    cards.forEach(card=>{

        const top =
        card.getBoundingClientRect().top;

        if(
            top < window.innerHeight - 100
        ){

            card.style.opacity =
            "1";

            card.style.transform =
            "translateY(0px)";
        }

    });

}


cards.forEach(card=>{

    card.style.opacity =
    "0";

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




// =========================
// FLOATING CARD ANIMATION
// =========================

const floatingCards =
document.querySelectorAll(".floating-card");


floatingCards.forEach((card,index)=>{

    setInterval(()=>{

        card.style.transform =

        `translateY(${
            Math.sin(Date.now()/700 + index) * 10
        }px)`;

    },30);

});




// =========================
// BUTTON HOVER EFFECT
// =========================

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
            "translateY(-4px) scale(1.02)";
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




// =========================
// AUTO DEFAULT SIP VALUES
// =========================

window.onload = ()=>{

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




// =========================
// ACTIVE NAVBAR LINK
// =========================

const sections =
document.querySelectorAll("section");

const navItems =
document.querySelectorAll(".nav-links a");


window.addEventListener("scroll",()=>{

    let current = "";

    sections.forEach(section=>{

        const sectionTop =
        section.offsetTop;

        if(
            pageYOffset >= sectionTop - 200
        ){

            current =
            section.getAttribute("id");
        }

    });


    navItems.forEach(link=>{

        link.classList.remove("active");

        if(
            link.getAttribute("href")
            .includes(current)
        ){

            link.classList.add("active");
        }

    });

});




// =========================
// BODY FADE LOADER
// =========================

window.addEventListener("load",()=>{

    document.body.style.opacity =
    "1";

});

document.body.style.opacity =
"0";

document.body.style.transition =
"0.6s ease";




// =========================
// CURSOR GLOW EFFECT
// =========================

const glow =
document.createElement("div");

document.body.appendChild(glow);

glow.style.position = "fixed";
glow.style.width = "250px";
glow.style.height = "250px";
glow.style.borderRadius = "50%";
glow.style.background =
"rgba(0,0,0,0.05)";
glow.style.pointerEvents = "none";
glow.style.filter = "blur(60px)";
glow.style.zIndex = "0";
glow.style.transform =
"translate(-50%,-50%)";


document.addEventListener("mousemove",(e)=>{

    glow.style.left =
    e.clientX + "px";

    glow.style.top =
    e.clientY + "px";

});




// =========================
// PARALLAX HERO
// =========================

window.addEventListener("scroll",()=>{

    const scroll =
    window.pageYOffset;

    const hero =
    document.querySelector(".hero");

    hero.style.backgroundPositionY =
    scroll * 0.5 + "px";

});




// =========================
// COUNTER ANIMATION
// =========================

function animateCounter(
    element,
    target
){

    let current = 0;

    const increment =
    target / 100;

    const timer =
    setInterval(()=>{

        current += increment;

        if(current >= target){

            current = target;

            clearInterval(timer);
        }

        element.innerHTML =
        Math.floor(current);

    },20);

}




// =========================
// PREMIUM PAGE INTERACTION
// =========================

const allCards =
document.querySelectorAll(

".market-card,\
 .service-card,\
 .testimonial-card,\
 .top-amc-card,\
 .faq-box,\
 .contact-card"

);


allCards.forEach(card=>{

    card.addEventListener("mousemove",(e)=>{

        const rect =
        card.getBoundingClientRect();

        const x =
        e.clientX - rect.left;

        const y =
        e.clientY - rect.top;

        card.style.background =
        `radial-gradient(
            circle at ${x}px ${y}px,
            rgba(255,255,255,0.95),
            rgba(255,255,255,0.55)
        )`;

    });


    card.addEventListener("mouseleave",()=>{

        card.style.background =
        "rgba(255,255,255,0.55)";

    });

});