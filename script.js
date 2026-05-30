// =========================
// NAVBAR SCROLL EFFECT - OPTIMIZED
// =========================

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if(!navbar) return;

    navbar.style.boxShadow = window.scrollY > 50 ? "0 10px 30px rgba(15,23,42,0.08)" : "0 2px 12px rgba(15,23,42,0.04)";
    // Removed blur for performance
}, {passive: true});




// =========================
// SIP CALCULATOR
// =========================

const sipFieldIds = ["monthly", "rate", "years"];

function calculateSIP(){

    const amountEl = document.getElementById("monthly");
    const rateEl = document.getElementById("rate");
    const yearsEl = document.getElementById("years");

    const investedEl = document.getElementById("invested");
    const returnsEl = document.getElementById("estimated");
    const resultEl = document.getElementById("result");
    const warningEl = document.getElementById("sipWarning");
    const resultBox = resultEl ? resultEl.closest(".result-box") : null;

    const fields = [amountEl, rateEl, yearsEl].filter(Boolean);
    fields.forEach(field => field.classList.remove("input-warning"));

    const hasEmptyField = fields.some(field => field.value.trim() === "");
    if(hasEmptyField){
        fields.forEach(field => {
            if(field.value.trim() === "") field.classList.add("input-warning");
        });
        if(warningEl) warningEl.innerText = "Please fill all SIP calculator fields.";
        return;
    }

    const amount = parseFloat(amountEl.value);
    const rate = parseFloat(rateEl.value);
    const years = parseFloat(yearsEl.value);

    const hasInvalidNumber = [amount, rate, years].some(value => Number.isNaN(value));
    if(hasInvalidNumber){
        if(warningEl) warningEl.innerText = "Please enter valid numbers.";
        return;
    }

    const hasNegativeValue = [amount, rate, years].some(value => value < 0);
    if(hasNegativeValue){
        fields.forEach(field => {
            if(parseFloat(field.value) < 0) field.classList.add("input-warning");
        });
        if(warningEl) warningEl.innerText = "Negative values are not allowed.";
        return;
    }

    if(warningEl) warningEl.innerText = "";

    const r = rate / 12 / 100;
    const n = years * 12;

    // build monthly progression for growth chart
    const labels = [];
    const data = [];

    for(let m=1; m<=n; m++){
        const value = r === 0
            ? amount * m
            : amount * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
        labels.push(m);
        data.push(Math.round(value));
    }

    const maturity = r === 0
        ? amount * n
        : amount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = amount * n;
    const estimatedReturns = maturity - invested;

    const formatCurrency = value => "₹" + Math.round(value).toLocaleString("en-IN");

    if(investedEl) investedEl.innerText = formatCurrency(invested);
    if(returnsEl) returnsEl.innerText = formatCurrency(estimatedReturns);
    if(resultEl) resultEl.innerText = formatCurrency(maturity);

    if(resultBox){
        resultBox.classList.remove("result-updated");
        void resultBox.offsetWidth;
        resultBox.classList.add("result-updated");
    }

    if(typeof updateChart === 'function'){
        updateChart(invested, estimatedReturns);
    }

    updateGrowthChart(labels, data);

}

function initializeSIPCalculator(){
    if(initializeSIPCalculator.initialized) return;
    initializeSIPCalculator.initialized = true;

    sipFieldIds.forEach(id => {
        const field = document.getElementById(id);
        if(field) field.addEventListener("input", calculateSIP);
    });

    calculateSIP();
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
                backgroundColor:["#00b386","#dfe7e4"],
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
        data: { labels: [], datasets: [{ label: 'SIP Value', data: [], borderColor: '#00b386', backgroundColor: 'rgba(0,179,134,0.10)', fill: true, tension: 0.3 }] },
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
                borderColor:"#00b386",
                backgroundColor:"rgba(0,179,134,0.08)",
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
 .solution-card,\
 .testimonial-card,\
 .planner-card,\
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

document.addEventListener("DOMContentLoaded", initializeSIPCalculator);

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

function calculateRiskProfile(){
    const riskResult = document.getElementById('riskResult');
    const horizon = document.querySelector('input[name="horizon"]:checked');
    const tolerance = document.querySelector('input[name="riskTolerance"]:checked');
    const goalType = document.querySelector('input[name="goalType"]:checked');

    if(!horizon || !tolerance || !goalType){
        if(riskResult) riskResult.innerText = 'Please answer all questions to get your profile.';
        return;
    }

    let score = 0;
    [horizon.value, tolerance.value, goalType.value].forEach(value => {
        if(value === 'conservative') score += 1;
        if(value === 'moderate') score += 2;
        if(value === 'aggressive') score += 3;
    });

    let profile = 'Balanced Investor';
    let detail = 'A balanced strategy combining growth and stability.';
    if(score <= 4){
        profile = 'Conservative Investor';
        detail = 'Your preference is for steady savings and lower risk exposure.';
    } else if(score >= 7){
        profile = 'Aggressive Investor';
        detail = 'You are comfortable with higher volatility for stronger long-term returns.';
    }

    if(riskResult) riskResult.innerText = `${profile} — ${detail}`;
}

function downloadReport(title, body){
    if(window.jsPDF){
        const doc = new window.jsPDF();
        doc.setFontSize(22);
        doc.text(title, 20, 30);
        doc.setFontSize(14);
        doc.text(body, 20, 50);
        doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
    } else {
        alert(`Download ready: ${title}`);
    }
}

function calculateRetirement(){
    const currentAge = parseFloat(document.getElementById('retireCurrentAge').value);
    const retireAge = parseFloat(document.getElementById('retireAge').value);
    const monthly = parseFloat(document.getElementById('retireMonthly').value);
    const rate = parseFloat(document.getElementById('retireReturn').value);

    const corpusEl = document.getElementById('retireCorpus');
    const futureEl = document.getElementById('retireFuture');
    const growthEl = document.getElementById('retireGrowth');

    if(isNaN(currentAge) || isNaN(retireAge) || isNaN(monthly) || isNaN(rate) || retireAge <= currentAge){
        if(corpusEl) corpusEl.innerText = 'Enter valid values';
        if(futureEl) futureEl.innerText = '—';
        if(growthEl) growthEl.innerText = '—';
        return;
    }

    const years = retireAge - currentAge;
    const months = years * 12;
    const monthlyRate = rate / 12 / 100;
    const futureValue = monthlyRate === 0
        ? monthly * months
        : monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    const invested = monthly * months;
    const growth = futureValue - invested;

    if(corpusEl) corpusEl.innerText = '₹' + Math.round(invested).toLocaleString();
    if(futureEl) futureEl.innerText = '₹' + Math.round(futureValue).toLocaleString();
    if(growthEl) growthEl.innerText = '₹' + Math.round(growth).toLocaleString();
}

function calculateEducation(){
    const childAge = parseFloat(document.getElementById('childAge').value);
    const target = parseFloat(document.getElementById('childTarget').value);
    const years = parseFloat(document.getElementById('childYears').value);

    const corpusEl = document.getElementById('childCorpus');
    const futureEl = document.getElementById('childFuture');
    const growthEl = document.getElementById('childGrowth');

    if(isNaN(childAge) || isNaN(target) || isNaN(years) || years <= 0){
        if(corpusEl) corpusEl.innerText = 'Enter valid values';
        if(futureEl) futureEl.innerText = '—';
        if(growthEl) growthEl.innerText = '—';
        return;
    }

    const annualRate = 0.09;
    const monthlyRate = annualRate / 12;
    const months = years * 12;
    const monthlySip = target * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
    const invested = monthlySip * months;
    const growth = target - invested;

    if(corpusEl) corpusEl.innerText = '₹' + Math.round(target).toLocaleString();
    if(futureEl) futureEl.innerText = '₹' + Math.round(monthlySip).toLocaleString();
    if(growthEl) growthEl.innerText = '₹' + Math.round(growth).toLocaleString();
}

function calculateWealthBuilder(){
    const monthly = parseFloat(document.getElementById('wealthMonthly').value);
    const years = parseFloat(document.getElementById('wealthYears').value);
    const rate = parseFloat(document.getElementById('wealthReturn').value);

    const corpusEl = document.getElementById('wealthCorpus');
    const futureEl = document.getElementById('wealthFuture');
    const growthEl = document.getElementById('wealthGrowth');

    if(isNaN(monthly) || isNaN(years) || isNaN(rate) || years <= 0){
        if(corpusEl) corpusEl.innerText = 'Enter valid values';
        if(futureEl) futureEl.innerText = '—';
        if(growthEl) growthEl.innerText = '—';
        return;
    }

    const months = years * 12;
    const monthlyRate = rate / 12 / 100;
    const futureValue = monthlyRate === 0
        ? monthly * months
        : monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    const invested = monthly * months;
    const growth = futureValue - invested;

    if(corpusEl) corpusEl.innerText = '₹' + Math.round(invested).toLocaleString();
    if(futureEl) futureEl.innerText = '₹' + Math.round(futureValue).toLocaleString();
    if(growthEl) growthEl.innerText = '₹' + Math.round(growth).toLocaleString();
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




// Glow cursor effect disabled for performance
// window.addEventListener("mousemove", (e) => { ... });




// =========================
// SCROLL PERFORMANCE OPTIMIZATION
// =========================

// Disabled parallax and heavy blur effects for better performance
// Using GPU acceleration instead




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

".solution-card,\
 .service-card,\
 .testimonial-card,\
 .top-amc-card,\
 .planner-card,\
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
        "#ffffff";

    });

});


// =========================
// FAQ ACCORDION
// =========================
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item=>{
    const button = item.querySelector('.faq-question');
    button.addEventListener('click', ()=>{
        faqItems.forEach(other=>{
            if(other !== item) other.classList.remove('active');
        });
        item.classList.toggle('active');
    });
});

// =========================
// WHATSAPP POPUP
// =========================
const whatsappPopup = document.getElementById('whatsappPopup');
const closeWhatsapp = document.getElementById('closeWhatsapp');
if(closeWhatsapp && whatsappPopup){
    closeWhatsapp.addEventListener('click', ()=>{
        whatsappPopup.style.display = 'none';
    });
}
