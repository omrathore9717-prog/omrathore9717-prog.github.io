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

const marketItems = [
    {symbol: '%5ENSEI', valueId: 'nifty-value', changeId: 'nifty-change'},
    {symbol: '%5EBSESN', valueId: 'sensex-value', changeId: 'sensex-change'},
    {symbol: '%5ENSEBANK', valueId: 'banknifty-value', changeId: 'banknifty-change'},
    {symbol: 'INR%3DX', valueId: 'usd-value', changeId: 'usd-change'}
];

const goldValue = document.getElementById('gold-value');
const goldChange = document.getElementById('gold-change');

function formatChange(amount, percent) {
    const arrow = amount > 0 ? '▲' : amount < 0 ? '▼' : '—';
    return `${arrow} ${Math.abs(amount).toFixed(2)} (${percent.toFixed(2)}%)`;
}

function setMarketLoading() {
    marketItems.forEach(item => {
        const valueEl = document.getElementById(item.valueId);
        const changeEl = document.getElementById(item.changeId);
        if(valueEl) valueEl.innerText = 'Loading...';
        if(changeEl) changeEl.innerText = 'Fetching...';
    });
    if(goldValue) goldValue.innerText = 'Loading...';
    if(goldChange) goldChange.innerText = 'Fetching...';
}

function setMarketError() {
    marketItems.forEach(item => {
        const valueEl = document.getElementById(item.valueId);
        const changeEl = document.getElementById(item.changeId);
        if(valueEl) valueEl.innerText = 'Market data unavailable';
        if(changeEl) changeEl.innerText = '';
    });
    if(goldValue) goldValue.innerText = 'Market data unavailable';
    if(goldChange) goldChange.innerText = '';
}

async function fetchMarketData() {
    setMarketLoading();
    try {
        const symbols = marketItems.map(item => item.symbol).join(',');
        const quoteUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://query1.finance.yahoo.com/v7/finance/quote?symbols=' + symbols);
        const quoteResp = await fetch(quoteUrl);
        if(!quoteResp.ok) throw new Error('Quote fetch failed');
        const quoteJson = await quoteResp.json();
        const quotes = quoteJson.quoteResponse?.result || [];

        marketItems.forEach(item => {
            const quote = quotes.find(q => q.symbol === decodeURIComponent(item.symbol));
            const valueEl = document.getElementById(item.valueId);
            const changeEl = document.getElementById(item.changeId);

            if(!quote || typeof quote.regularMarketPrice !== 'number') {
                if(valueEl) valueEl.innerText = 'Market data unavailable';
                if(changeEl) changeEl.innerText = '';
                return;
            }

            const price = quote.regularMarketPrice;
            const change = quote.regularMarketChange || 0;
            const percent = quote.regularMarketChangePercent || 0;
            if(valueEl) valueEl.innerText = item.symbol === 'INR%3DX' ? '₹' + price.toFixed(4) : price.toLocaleString('en-IN', {maximumFractionDigits: 2});
            if(changeEl) {
                changeEl.innerText = formatChange(change, percent);
                changeEl.className = 'market-detail ' + (change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral');
            }
        });

        const usdQuote = quotes.find(q => q.symbol === 'INR=X');
        const usdRate = usdQuote?.regularMarketPrice;

        if(!usdRate || typeof usdRate !== 'number') {
            throw new Error('USD/INR unavailable');
        }

        const goldResp = await fetch('https://api.metals.live/v1/spot/gold');
        if(!goldResp.ok) throw new Error('Gold fetch failed');
        const goldJson = await goldResp.json();
        const goldPriceUSD = Array.isArray(goldJson) ? (typeof goldJson[0] === 'object' ? goldJson[0].price : goldJson[0]) : null;
        if(!goldPriceUSD || typeof goldPriceUSD !== 'number') {
            throw new Error('Gold price unavailable');
        }

        const goldInrPer10g = goldPriceUSD * usdRate / 31.1035 * 10;
        if(goldValue) goldValue.innerText = '₹' + goldInrPer10g.toFixed(2);
        if(goldChange) {
            const lastGold = goldPriceUSD * usdRate / 31.1035 * 9.9; // approximate change fallback
            const diff = goldInrPer10g - lastGold;
            const pct = (diff / lastGold) * 100;
            goldChange.innerText = formatChange(diff, pct);
            goldChange.className = 'market-detail ' + (diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral');
        }
    } catch (error) {
        console.error('Market fetch error', error);
        setMarketError();
    }
}

fetchMarketData();
setInterval(fetchMarketData, 60000);



// =========================
// SIP CALCULATOR
// =========================


function calculateSIP(){

    const amount = parseFloat(document.getElementById("monthly").value);
    const rate = parseFloat(document.getElementById("rate").value);
    const years = parseFloat(document.getElementById("years").value);

    const investedEl = document.getElementById("invested");
    const returnsEl = document.getElementById("estimated");
    const resultEl = document.getElementById("result");

    if(isNaN(amount) || isNaN(rate) || isNaN(years)){
        if(resultEl) resultEl.innerText = "Please Enter Valid Values";
        return;
    }

    const monthlyRate = rate / 12 / 100;
    const months = years * 12;

    // build monthly progression for growth chart
    const labels = [];
    const data = [];

    let balance = 0;
    for(let m=1; m<=months; m++){
        balance = balance * (1 + monthlyRate) + amount;
        labels.push(m);
        data.push(Math.round(balance));
    }

    const maturity = Math.round(balance);
    const invested = Math.round(amount * months);
    const estimatedReturns = Math.max(0, maturity - invested);

    if(investedEl) investedEl.innerText = "₹" + invested.toLocaleString();
    if(returnsEl) returnsEl.innerText = "₹" + estimatedReturns.toLocaleString();
    if(resultEl) resultEl.innerText = "₹" + maturity.toLocaleString();

    if(typeof updateChart === 'function'){
        updateChart(invested, estimatedReturns);
    }

    updateGrowthChart(labels, data);

}




// =========================
// SIP CHART
// =========================

const sipChart = document.getElementById("sipChart");

let chart = null;
if(sipChart && typeof window !== 'undefined' && window.Chart){
    chart = new Chart(sipChart,{
        type:"doughnut",
        data:{
            labels:["Invested Amount","Estimated Returns"],
            datasets:[{
                data:[50,50],
                backgroundColor:["#111111","#d9d9d9"],
                borderWidth:0
            }]
        },
        options:{
            responsive:true,
            plugins:{
                legend:{ position:"bottom" }
            }
        }
    });
}

// SIP Growth Line Chart
const sipGrowthCanvas = document.getElementById("sipGrowthChart");
let sipGrowthChart = null;
if(sipGrowthCanvas && typeof window !== 'undefined' && window.Chart){
    sipGrowthChart = new Chart(sipGrowthCanvas,{
        type: 'line',
        data: { labels: [], datasets: [{ label: 'SIP Value', data: [], borderColor: '#111111', backgroundColor: 'rgba(0,0,0,0.06)', fill: true, tension: 0.3 }] },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } } } }
    });
}

function updateChart(invested, returns){
    if(!chart) return;
    chart.data.datasets[0].data = [invested, returns];
    chart.update();
}

function updateGrowthChart(labels, data){
    if(!sipGrowthChart) return;
    sipGrowthChart.data.labels = labels;
    sipGrowthChart.data.datasets[0].data = data;
    sipGrowthChart.update();
}


// =========================
// EMI CALCULATOR
// =========================

function calculateEMI(){
    const P = parseFloat(document.getElementById('loanAmount').value);
    const annualR = parseFloat(document.getElementById('loanRate').value);
    const years = parseFloat(document.getElementById('loanTenure').value);
    const emiEl = document.getElementById('emiResult');

    if(isNaN(P) || isNaN(annualR) || isNaN(years) || years<=0){
        if(emiEl) emiEl.innerText = 'Please enter valid values';
        return;
    }

    const r = annualR/12/100;
    const n = years*12;
    let emi = 0;

    if(r === 0){
        emi = P / n;
    } else {
        emi = P * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1);
    }

    if(emiEl) emiEl.innerText = '₹' + Math.round(emi).toLocaleString();
}




// =========================
// PORTFOLIO CHART
// =========================

const portfolioChart = document.getElementById("portfolioChart");

if(portfolioChart && typeof window !== 'undefined' && window.Chart){
    new Chart(portfolioChart,{
        type:"line",
        data:{
            labels:["Jan","Feb","Mar","Apr","May","Jun"],
            datasets:[{
                label:"Growth",
                data:[2,5,7,10,14,18],
                borderColor:"#111111",
                backgroundColor:"rgba(0,0,0,0.04)",
                fill:true,
                tension:0.4,
                pointRadius:4
            }]
        },
        options:{
            responsive:true,
            plugins:{ legend:{ display:false } },
            scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:"#ececec" } } }
        }
    });
}




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

    const monthlyEl = document.getElementById("monthly");
    const rateEl = document.getElementById("rate");
    const yearsEl = document.getElementById("years");

    if(monthlyEl) monthlyEl.value = 5000;
    if(rateEl) rateEl.value = 12;
    if(yearsEl) yearsEl.value = 10;

    calculateSIP();

};

// Set default values for lumpsum inputs
window.addEventListener('load', ()=>{
    const lsAmount = document.getElementById('lumpsumAmount');
    const lsRate = document.getElementById('lumpsumRate');
    const lsYears = document.getElementById('lumpsumYears');

    if(lsAmount && !lsAmount.value) lsAmount.value = 100000;
    if(lsRate && !lsRate.value) lsRate.value = 8;
    if(lsYears && !lsYears.value) lsYears.value = 5;
});


// Lumpsum Calculator
function calculateLumpsum(){
    const P = parseFloat(document.getElementById('lumpsumAmount').value);
    const rate = parseFloat(document.getElementById('lumpsumRate').value);
    const years = parseFloat(document.getElementById('lumpsumYears').value);

    const investedEl = document.getElementById('lumpsum_invested');
    const returnsEl = document.getElementById('lumpsum_estimated');
    const resultEl = document.getElementById('lumpsum_result');

    if(isNaN(P) || isNaN(rate) || isNaN(years)){
        if(resultEl) resultEl.innerText = 'Please enter valid values';
        return;
    }

    const r = rate / 100;
    const t = years;

    const M = P * Math.pow(1 + r, t);
    const invested = P;
    const estimated = M - invested;

    if(investedEl) investedEl.innerText = '₹' + Math.round(invested).toLocaleString();
    if(returnsEl) returnsEl.innerText = '₹' + Math.round(estimated).toLocaleString();
    if(resultEl) resultEl.innerText = '₹' + Math.round(M).toLocaleString();
}




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

// Observe dashboard counters and animate when visible
const counters = document.querySelectorAll('.counter');
if(counters && counters.length){
    const obs = new IntersectionObserver((entries, observer)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target')) || 0;
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    },{ threshold: 0.6 });

    counters.forEach(c=> obs.observe(c));
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