// =========================
// NAVBAR SCROLL EFFECT - OPTIMIZED
// =========================

document.body.classList.add("site-redesign");

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

function setMobileMenuState(isOpen){
    if(!navToggle || !navMenu) return;

    navMenu.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("mobile-menu-open", isOpen && window.innerWidth <= 860);
}

if(navToggle && navMenu){
    navToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = !navMenu.classList.contains("is-open");
        setMobileMenuState(isOpen);
    });

    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => setMobileMenuState(false));
    });

    document.addEventListener("click", (event) => {
        if(!navMenu.classList.contains("is-open")) return;
        if(!navMenu.contains(event.target) && !navToggle.contains(event.target)){
            setMobileMenuState(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if(event.key === "Escape" && navMenu.classList.contains("is-open")){
            setMobileMenuState(false);
        }
    });

    window.addEventListener("resize", () => {
        if(window.innerWidth > 860 && navMenu.classList.contains("is-open")){
            setMobileMenuState(false);
        }
    });
}

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if(!navbar) return;

    navbar.style.boxShadow = window.scrollY > 50 ? "0 10px 30px rgba(15,23,42,0.08)" : "0 2px 12px rgba(15,23,42,0.04)";
    // Removed blur for performance
}, {passive: true});

// =========================
// SCROLL SHOWCASE
// =========================

const scrollShowcase = document.querySelector(".scroll-showcase");
const scrollDevice = document.querySelector("[data-scroll-device]");
const scrollShowcaseCopy = document.querySelector(".scroll-showcase-copy");
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let showcaseTicking = false;

function clampProgress(value){
    return Math.min(Math.max(value, 0), 1);
}

function updateScrollShowcase(){
    showcaseTicking = false;

    if(!scrollShowcase || !scrollDevice || reduceMotionQuery.matches) return;

    const rect = scrollShowcase.getBoundingClientRect();
    const travel = window.innerHeight + rect.height;
    const progress = clampProgress((window.innerHeight - rect.top) / travel);
    const isMobile = window.innerWidth <= 768;
    const rotate = 20 - (20 * progress);
    const scaleStart = isMobile ? 0.92 : 1.05;
    const scaleEnd = 1;
    const scale = scaleStart + ((scaleEnd - scaleStart) * progress);
    const cardY = isMobile ? 0 : -100 * progress;
    const titleY = -80 * progress;

    scrollDevice.style.setProperty("--showcase-rotate", `${rotate}deg`);
    scrollDevice.style.setProperty("--showcase-scale", scale.toFixed(3));
    scrollDevice.style.setProperty("--showcase-card-y", `${cardY.toFixed(1)}px`);

    if(scrollShowcaseCopy){
        scrollShowcaseCopy.style.setProperty("--showcase-title-y", `${titleY.toFixed(1)}px`);
    }
}

function requestScrollShowcaseUpdate(){
    if(showcaseTicking) return;
    showcaseTicking = true;
    requestAnimationFrame(updateScrollShowcase);
}

if(scrollShowcase && scrollDevice){
    window.addEventListener("scroll", requestScrollShowcaseUpdate, {passive: true});
    window.addEventListener("resize", requestScrollShowcaseUpdate);
    requestScrollShowcaseUpdate();
}

// =========================
// HERO SHADER ANIMATION
// =========================

const shaderCanvas = document.querySelector("[data-shader-animation]");

function createShader(gl, type, source){
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function initializeHeroShader(){
    if(!shaderCanvas || reduceMotionQuery.matches) return;

    const gl = shaderCanvas.getContext("webgl", {
        antialias: true,
        alpha: false,
        powerPreference: "low-power"
    });

    if(!gl) return;

    const vertexShaderSource = `
        attribute vec2 position;

        void main(){
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision highp float;

        uniform vec2 resolution;
        uniform float time;

        float channel(float offset, vec2 uv, float t){
            float lineWidth = 0.002;
            float value = 0.0;

            for(int i = 0; i < 5; i++){
                value += lineWidth * float(i * i) / abs(fract(t - offset + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
            }

            return value;
        }

        void main(){
            vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
            float t = time * 0.05;
            vec3 color = vec3(channel(0.0, uv, t), channel(0.01, uv, t), channel(0.02, uv, t));
            vec3 financeTint = vec3(color.g * 0.28, color.g * 0.78 + color.b * 0.18, color.b * 0.48);
            gl_FragColor = vec4(financeTint, 1.0);
        }
    `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if(!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        gl.deleteProgram(program);
        return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "position");
    const resolutionLocation = gl.getUniformLocation(program, "resolution");
    const timeLocation = gl.getUniformLocation(program, "time");
    let animationFrame = 0;
    let time = 1;

    function resizeShader(){
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
        const width = Math.max(1, Math.floor(shaderCanvas.clientWidth * pixelRatio));
        const height = Math.max(1, Math.floor(shaderCanvas.clientHeight * pixelRatio));

        if(shaderCanvas.width !== width || shaderCanvas.height !== height){
            shaderCanvas.width = width;
            shaderCanvas.height = height;
            gl.viewport(0, 0, width, height);
        }
    }

    function renderShader(){
        resizeShader();
        time += 0.05;

        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(resolutionLocation, shaderCanvas.width, shaderCanvas.height);
        gl.uniform1f(timeLocation, time);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        animationFrame = requestAnimationFrame(renderShader);
    }

    window.addEventListener("resize", resizeShader);
    renderShader();

    window.addEventListener("beforeunload", () => {
        cancelAnimationFrame(animationFrame);
        window.removeEventListener("resize", resizeShader);
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
    }, {once: true});
}

initializeHeroShader();

// =========================
// SITE-WIDE SCROLL REDESIGN
// =========================

const scrollProgress = document.createElement("div");
scrollProgress.className = "scroll-progress";
scrollProgress.setAttribute("aria-hidden", "true");
document.body.prepend(scrollProgress);

const revealSelectors = [
    ".section-title",
    ".hero-content",
    ".hero-media",
    ".scroll-showcase-copy",
    ".scroll-device",
    ".about-feature",
    ".about-visual-card",
    ".card",
    ".blog-card",
    ".solution-card",
    ".impact-card",
    ".glass-card",
    ".amc-card",
    ".calculator",
    ".lumpsum-calculator",
    ".planner-card",
    ".testimonial-card",
    ".faq-item",
    ".contact-box",
    ".cta-card",
    ".site-footer"
].join(",");

const revealElements = Array.from(document.querySelectorAll(revealSelectors));

function updatePageScrollProgress(){
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
}

if(!reduceMotionQuery.matches && "IntersectionObserver" in window){
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.14, rootMargin: "0px 0px -8% 0px"});

    revealElements.forEach((element, index) => {
        element.classList.add("scroll-reveal");
        element.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(element => element.classList.add("is-visible"));
}

window.addEventListener("scroll", updatePageScrollProgress, {passive: true});
window.addEventListener("resize", updatePageScrollProgress);
updatePageScrollProgress();




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

".solution-card,\
 .testimonial-card,\
 .planner-card,\
 .faq-box"

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
// BUTTON HOVER EFFECT
// =========================

const buttons =

document.querySelectorAll(

".primary-btn,\
 .secondary-btn"

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
// IMPACT COUNTER ANIMATION
// =========================

function animateImpactCounter(element){
    if(!element || element.dataset.animated === "true") return;

    element.dataset.animated = "true";

    const target = parseInt(element.getAttribute("data-target"), 10) || 0;
    const prefix = element.getAttribute("data-prefix") || "";
    const suffix = element.getAttribute("data-suffix") || "";
    const duration = 1500;
    const startTime = performance.now();

    const easeOutCubic = progress => 1 - Math.pow(1 - progress, 3);
    const setValue = value => {
        element.textContent = `${prefix}${Math.floor(value)}${suffix}`;
    };

    function updateCounter(now){
        const progress = Math.min((now - startTime) / duration, 1);
        const easedValue = target * easeOutCubic(progress);

        setValue(easedValue);

        if(progress < 1){
            requestAnimationFrame(updateCounter);
        } else {
            setValue(target);
        }
    }

    requestAnimationFrame(updateCounter);
}

const impactCards = document.querySelectorAll(".impact-card");
const impactCounters = document.querySelectorAll(".impact-counter");

if(impactCards.length && impactCounters.length){
    const revealImpactCard = card => {
        card.classList.add("visible");
        const counter = card.querySelector(".impact-counter");
        animateImpactCounter(counter);
    };

    if("IntersectionObserver" in window){
        const impactObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    revealImpactCard(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.35 });

        impactCards.forEach(card => impactObserver.observe(card));
    } else {
        impactCards.forEach(revealImpactCard);
    }
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

    if(document.body.classList.contains("site-redesign")) return;

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
