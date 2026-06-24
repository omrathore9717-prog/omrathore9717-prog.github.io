// =========================================================
// OM FINANCIAL — ADVANCED FEATURES
// Preloader · Market Ticker · Counters · Lead Widget · Sticky CTA
// Back-to-Top · Cmd-K · Risk Quiz · Goal Planner · Smooth Anchors
// =========================================================
(function(){
  const PHONE_RAW = '919717857755';
  const WA_URL = `https://wa.me/${PHONE_RAW}`;
  const TEL_URL = `tel:+${PHONE_RAW}`;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ 1. PRELOADER ============ */
  function initPreloader(){
    if(document.querySelector('.om-preloader')) return;
    const el = document.createElement('div');
    el.className = 'om-preloader';
    el.innerHTML = `
      <div class="om-preloader-mark">OM</div>
      <div class="om-preloader-bar"></div>
      <div class="om-preloader-text">Loading wealth experience</div>
    `;
    document.body.appendChild(el);
    const hide = () => { el.classList.add('is-hidden'); setTimeout(()=>el.remove(), 800); };
    if(document.readyState === 'complete'){ setTimeout(hide, 900); }
    else window.addEventListener('load', ()=> setTimeout(hide, 900));
    // Safety: force-hide after 4s no matter what
    setTimeout(hide, 4000);
  }

  /* ============ 2. LIVE MARKET TICKER ============ */
  function initTicker(){
    const items = [
      { s: 'NIFTY 50',   v: '23,847.20', c: '+0.62%', dir: 'up' },
      { s: 'SENSEX',     v: '78,924.16', c: '+0.48%', dir: 'up' },
      { s: 'BANK NIFTY', v: '50,612.85', c: '-0.21%', dir: 'down' },
      { s: 'GOLD ₹/10g', v: '74,860',    c: '+1.12%', dir: 'up' },
      { s: 'SILVER ₹/kg',v: '92,140',    c: '+0.84%', dir: 'up' },
      { s: 'USD/INR',    v: '83.42',     c: '-0.08%', dir: 'down' },
      { s: 'BTC',        v: '$96,420',   c: '+2.18%', dir: 'up' },
      { s: 'CRUDE ₹/bbl',v: '6,284',     c: '-0.45%', dir: 'down' },
      { s: 'NASDAQ',     v: '19,478.88', c: '+0.71%', dir: 'up' },
      { s: '10Y G-SEC',  v: '6.82%',     c: '-0.02%', dir: 'down' }
    ];
    const buildItem = it => `
      <span class="om-ticker-item">
        <span class="om-ticker-symbol">${it.s}</span>
        <span class="om-ticker-val">${it.v}</span>
        <span class="om-ticker-change ${it.dir}">${it.c}</span>
      </span>`;
    const trackHtml = items.map(buildItem).join('') + items.map(buildItem).join('');
    const bar = document.createElement('div');
    bar.className = 'om-ticker';
    bar.innerHTML = `
      <div class="om-ticker-label">● LIVE MARKETS</div>
      <div class="om-ticker-track">${trackHtml}</div>
    `;
    document.body.insertBefore(bar, document.body.firstChild);
    document.body.classList.add('om-has-ticker');
  }

  /* ============ 3. ANIMATED COUNTERS ============ */
  function initCounters(){
    const sel = '.impact-counter, [data-counter]';
    const els = document.querySelectorAll(sel);
    if(!els.length || !('IntersectionObserver' in window)) return;

    function parseTarget(str){
      const num = parseFloat(String(str).replace(/[^0-9.]/g, ''));
      return isNaN(num) ? 0 : num;
    }
    function formatLike(val, original){
      const hasPlus = /\+/.test(original);
      const hasPercent = /%/.test(original);
      const hasCr = /Cr/i.test(original);
      const hasK = /K\b/i.test(original);
      const hasL = /L\b/i.test(original);
      const hasCurrency = /[₹$]/.test(original);
      const currencyPrefix = original.match(/^[₹$]/)?.[0] || '';
      let str;
      if(Number.isInteger(val)) str = val.toLocaleString('en-IN');
      else str = val.toFixed(1);
      return `${currencyPrefix}${str}${hasK ? 'K' : ''}${hasL ? 'L' : ''}${hasCr ? 'Cr' : ''}${hasPercent ? '%' : ''}${hasPlus ? '+' : ''}`;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        const el = entry.target;
        if(el.classList.contains('is-done')) return;
        const original = el.dataset.original || el.textContent.trim();
        el.dataset.original = original;
        const target = parseTarget(original);
        if(target <= 0){ el.classList.add('is-done'); obs.unobserve(el); return; }
        el.classList.add('is-counting');
        el.setAttribute('data-counting', '1');
        const duration = 1800;
        const start = performance.now();
        function step(now){
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
          const val = target * eased;
          el.textContent = formatLike(val, original);
          if(t < 1) requestAnimationFrame(step);
          else { el.classList.remove('is-counting'); el.classList.add('is-done'); }
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.4 });
    els.forEach(e => io.observe(e));
  }

  /* ============ 4. FLOATING LEAD WIDGET ============ */
  function initLead(){
    if(document.querySelector('.om-lead')) return;
    const wrap = document.createElement('div');
    wrap.className = 'om-lead';
    wrap.innerHTML = `
      <button class="om-lead-trigger" aria-label="Open lead form" data-testid="lead-trigger">+</button>
      <div class="om-lead-panel" role="dialog" aria-label="Free consultation">
        <div class="om-lead-title">Get a Free Consultation</div>
        <div class="om-lead-sub">Personalised wealth advice via WhatsApp in 24 hours.</div>
        <form class="om-lead-form" novalidate>
          <div class="om-lead-field">
            <label>Your name</label>
            <input type="text" name="name" autocomplete="name" placeholder="Rahul Sharma" required data-testid="lead-name"/>
          </div>
          <div class="om-lead-field">
            <label>Phone number</label>
            <input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="9999999999" required data-testid="lead-phone"/>
          </div>
          <div class="om-lead-field">
            <label>I'm interested in</label>
            <select name="interest" data-testid="lead-interest">
              <option>SIP / Mutual Funds</option>
              <option>Insurance Planning</option>
              <option>Loan Advisory</option>
              <option>Retirement Planning</option>
              <option>Tax Saving</option>
              <option>General Consultation</option>
            </select>
          </div>
          <button type="submit" class="om-lead-submit" data-testid="lead-submit">Request Callback →</button>
          <div class="om-lead-note">No spam · We reply within 24 hours</div>
        </form>
      </div>
    `;
    document.body.appendChild(wrap);

    const trigger = wrap.querySelector('.om-lead-trigger');
    const panel = wrap.querySelector('.om-lead-panel');
    const form = wrap.querySelector('.om-lead-form');
    trigger.addEventListener('click', ()=> wrap.classList.toggle('is-open'));
    document.addEventListener('click', (e)=>{
      if(!wrap.contains(e.target) && wrap.classList.contains('is-open')) wrap.classList.remove('is-open');
    });
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const interest = form.interest.value;
      if(!name || !phone) return;
      const text = `Hi OM Financial Service, I'm ${name} (${phone}). I'd like to know more about ${interest}.`;
      const url = `${WA_URL}?text=${encodeURIComponent(text)}`;
      panel.innerHTML = `<div class="om-lead-success">✓ Opening WhatsApp...<br><span style="font-size:.8rem;color:var(--ink-2);font-family:'Manrope',sans-serif;">We've prefilled your message.</span></div>`;
      setTimeout(()=>{
        window.open(url, '_blank');
        setTimeout(()=>{
          wrap.classList.remove('is-open');
          // restore form after a few seconds
          setTimeout(()=> location.reload(), 100);
        }, 600);
      }, 700);
    });
  }

  /* ============ 5. STICKY BOTTOM CTA ============ */
  function initStickyCTA(){
    if(document.querySelector('.om-sticky-cta')) return;
    const el = document.createElement('div');
    el.className = 'om-sticky-cta';
    el.innerHTML = `
      <div class="om-sticky-cta-text">
        Talk to a wealth advisor
        <small>+91 9717857755 · Free 15-min call</small>
      </div>
      <a href="${WA_URL}" target="_blank" rel="noopener" class="om-sticky-cta-btn" data-testid="sticky-cta-btn">Chat now</a>
    `;
    document.body.appendChild(el);
    let raf = 0;
    function check(){
      raf = 0;
      const show = window.scrollY > window.innerHeight * 0.7
                 && window.scrollY < document.body.scrollHeight - window.innerHeight * 1.4;
      el.classList.toggle('is-visible', show);
    }
    window.addEventListener('scroll', ()=>{ if(!raf) raf = requestAnimationFrame(check); }, { passive: true });
    check();
  }

  /* ============ 6. BACK TO TOP ============ */
  function initBackToTop(){
    if(document.querySelector('.om-top')) return;
    const btn = document.createElement('button');
    btn.className = 'om-top';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Back to top');
    btn.setAttribute('data-testid', 'back-to-top');
    document.body.appendChild(btn);
    let raf = 0;
    function check(){
      raf = 0;
      btn.classList.toggle('is-visible', window.scrollY > window.innerHeight * 1.5);
    }
    window.addEventListener('scroll', ()=>{ if(!raf) raf = requestAnimationFrame(check); }, { passive: true });
    btn.addEventListener('click', ()=> window.scrollTo({ top: 0, behavior: 'smooth' }));
    check();
  }

  /* ============ 7. CMD+K SEARCH PALETTE ============ */
  function initCmdK(){
    if(document.querySelector('.om-cmdk-overlay')) return;
    const items = [
      { type: 'Navigate', label: 'Home', icon: '⌂', href: '#home' },
      { type: 'Navigate', label: 'Services', icon: '◇', href: '#services' },
      { type: 'Navigate', label: 'Mutual Funds & AMCs', icon: '◆', href: '#funds' },
      { type: 'Navigate', label: 'Solutions', icon: '◈', href: '#solutions' },
      { type: 'Navigate', label: 'SIP Calculator', icon: '∑', href: '#calculator' },
      { type: 'Navigate', label: 'Goal Planner', icon: '◎', href: '#om-goal-planner' },
      { type: 'Navigate', label: 'FAQ', icon: '?', href: '#faq' },
      { type: 'Navigate', label: 'Contact OM Financial', icon: '☎', href: '#contact' },
      { type: 'Action', label: 'Call +91 9717857755', icon: '☎', href: TEL_URL, external: true },
      { type: 'Action', label: 'WhatsApp chat', icon: '✦', href: WA_URL, external: true },
      { type: 'Action', label: 'Take Risk Profile Quiz', icon: '⌥', action: 'open-quiz' }
    ];
    const overlay = document.createElement('div');
    overlay.className = 'om-cmdk-overlay';
    overlay.innerHTML = `
      <div class="om-cmdk" role="dialog">
        <input type="text" class="om-cmdk-input" placeholder="Search pages, actions, FAQ…  (try 'sip' or 'tax')" data-testid="cmdk-input" />
        <div class="om-cmdk-results" data-testid="cmdk-results"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    const input = overlay.querySelector('.om-cmdk-input');
    const results = overlay.querySelector('.om-cmdk-results');
    let activeIdx = 0;

    function gatherFaq(){
      const out = [];
      document.querySelectorAll('.faq-item').forEach((it, idx) => {
        const q = it.querySelector('.faq-question')?.textContent?.trim();
        if(q) out.push({ type: 'FAQ', label: q, icon: '?', faq: it });
      });
      return out;
    }

    function render(filter = ''){
      const all = items.concat(gatherFaq());
      const q = filter.trim().toLowerCase();
      const filtered = q
        ? all.filter(i => i.label.toLowerCase().includes(q))
        : all;
      if(!filtered.length){
        results.innerHTML = `<div class="om-cmdk-empty">No matches for "${q}"</div>`;
        return;
      }
      // group
      const grouped = {};
      filtered.forEach(i => { (grouped[i.type] ||= []).push(i); });
      let html = '';
      Object.keys(grouped).forEach(key => {
        html += `<div class="om-cmdk-section">${key}</div>`;
        grouped[key].forEach((i, idx) => {
          html += `<div class="om-cmdk-item" data-idx="${idx}" data-type="${i.type}">
            <span class="om-cmdk-item-icon">${i.icon}</span>
            <span>${i.label}</span>
          </div>`;
        });
      });
      results.innerHTML = html;
      results.querySelectorAll('.om-cmdk-item').forEach((node, idx) => {
        node.addEventListener('click', ()=>{
          const item = filtered[idx];
          if(item.action === 'open-quiz'){ close(); openQuiz(); return; }
          if(item.faq){ close(); item.faq.scrollIntoView({ behavior: 'smooth', block: 'center' }); item.faq.classList.add('faq-active'); return; }
          if(item.external){ window.open(item.href, '_blank'); close(); return; }
          if(item.href?.startsWith('#')){
            close();
            const target = document.querySelector(item.href);
            if(target) target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }
    function open(){
      overlay.classList.add('is-open');
      input.value = '';
      render('');
      setTimeout(()=> input.focus(), 50);
    }
    function close(){ overlay.classList.remove('is-open'); }

    input.addEventListener('input', ()=> render(input.value));
    overlay.addEventListener('click', (e)=>{ if(e.target === overlay) close(); });
    document.addEventListener('keydown', (e)=>{
      if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); overlay.classList.contains('is-open') ? close() : open(); }
      else if(e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });

    // Add nav search hint button
    const nav = document.querySelector('.nav-links');
    if(nav){
      const hint = document.createElement('button');
      hint.className = 'om-search-hint';
      hint.setAttribute('data-testid', 'cmdk-trigger');
      hint.innerHTML = `<span>Search</span><span class="om-cmdk-kbd">⌘ K</span>`;
      hint.addEventListener('click', open);
      nav.appendChild(hint);
    }
  }

  /* ============ 8. RISK PROFILE QUIZ ============ */
  const QUIZ = [
    {
      q: "What's your investment horizon?",
      opts: [
        { t: "Less than 1 year", s: 1 },
        { t: "1 to 3 years", s: 2 },
        { t: "3 to 7 years", s: 3 },
        { t: "More than 7 years", s: 4 }
      ]
    },
    {
      q: "If your portfolio dropped 20% in a month, you would:",
      opts: [
        { t: "Sell everything immediately", s: 1 },
        { t: "Sell some to limit losses", s: 2 },
        { t: "Hold and wait it out", s: 3 },
        { t: "Invest more — it's a discount", s: 4 }
      ]
    },
    {
      q: "What's your primary goal?",
      opts: [
        { t: "Preserve capital safely", s: 1 },
        { t: "Steady income with low risk", s: 2 },
        { t: "Growth with moderate risk", s: 3 },
        { t: "Maximum long-term growth", s: 4 }
      ]
    },
    {
      q: "Monthly investment capacity?",
      opts: [
        { t: "Up to ₹5,000", s: 2 },
        { t: "₹5,000 — ₹25,000", s: 3 },
        { t: "₹25,000 — ₹1,00,000", s: 3 },
        { t: "More than ₹1,00,000", s: 4 }
      ]
    },
    {
      q: "Investment experience?",
      opts: [
        { t: "Complete beginner", s: 1 },
        { t: "Done a few SIPs", s: 2 },
        { t: "Comfortable with funds", s: 3 },
        { t: "Active investor", s: 4 }
      ]
    }
  ];
  const PROFILES = [
    { min: 0,  max: 8,  name: "Conservative",  desc: "Capital safety matters most. We'll recommend debt funds, FDs, and gold for stability with modest returns.", fund: "Debt + Hybrid" },
    { min: 9,  max: 12, name: "Moderate",      desc: "A balanced approach mixing safety and growth. Look at hybrid funds and large-cap equity SIPs.", fund: "Hybrid + Large Cap" },
    { min: 13, max: 16, name: "Growth",        desc: "Comfortable with market swings for higher returns. Diversified equity, flexi-cap, and index funds suit you.", fund: "Flexi Cap + Index" },
    { min: 17, max: 20, name: "Aggressive",    desc: "Long horizon, high tolerance. Small-cap, mid-cap, and thematic funds can power compounding for you.", fund: "Mid + Small Cap" }
  ];

  function buildQuizModal(){
    const overlay = document.createElement('div');
    overlay.className = 'om-modal-overlay';
    overlay.innerHTML = `
      <div class="om-modal" role="dialog" aria-label="Risk profile quiz">
        <button class="om-modal-close" aria-label="Close" data-testid="quiz-close">✕</button>
        <div class="om-modal-eyebrow">Risk Profile · 60 seconds</div>
        <h2 class="om-modal-title" data-testid="quiz-title">Find Your Investor Type</h2>
        <p class="om-modal-sub">5 quick questions. Get a personalised investment style.</p>
        <div class="om-quiz-progress" data-testid="quiz-progress"></div>
        <div class="om-quiz-body" data-testid="quiz-body"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }
  let quizOverlay;
  let quizIdx = 0;
  let quizScore = 0;

  function renderQuizStep(){
    const body = quizOverlay.querySelector('.om-quiz-body');
    const prog = quizOverlay.querySelector('.om-quiz-progress');
    prog.innerHTML = QUIZ.map((_, i) => `<span class="${i <= quizIdx ? 'done' : ''}"></span>`).join('');
    if(quizIdx >= QUIZ.length){ renderQuizResult(); return; }
    const step = QUIZ[quizIdx];
    body.innerHTML = `
      <div class="om-quiz-q">${quizIdx + 1}. ${step.q}</div>
      <div class="om-quiz-options">
        ${step.opts.map((o, i) => `<button class="om-quiz-option" data-score="${o.s}" data-testid="quiz-opt-${i}">${o.t}</button>`).join('')}
      </div>
    `;
    body.querySelectorAll('.om-quiz-option').forEach(btn => {
      btn.addEventListener('click', ()=>{
        quizScore += parseInt(btn.dataset.score, 10);
        quizIdx++;
        renderQuizStep();
      });
    });
  }
  function renderQuizResult(){
    const body = quizOverlay.querySelector('.om-quiz-body');
    const prog = quizOverlay.querySelector('.om-quiz-progress');
    prog.innerHTML = QUIZ.map(()=> `<span class="done"></span>`).join('');
    const p = PROFILES.find(pp => quizScore >= pp.min && quizScore <= pp.max) || PROFILES[1];
    const text = `Hi OM Financial Service, I just completed the risk quiz. My profile is "${p.name}" (score ${quizScore}/20). I'd like advice on ${p.fund} funds.`;
    const waUrl = `${WA_URL}?text=${encodeURIComponent(text)}`;
    body.innerHTML = `
      <div class="om-quiz-result">
        <div class="om-quiz-result-label">YOUR SCORE</div>
        <div class="om-quiz-result-score" data-testid="quiz-result-score">${quizScore}<span style="font-size:1.6rem;color:var(--ink-2);">/20</span></div>
        <div class="om-quiz-result-profile" data-testid="quiz-result-profile">${p.name} Investor</div>
        <div class="om-quiz-result-desc">${p.desc}</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.32em;text-transform:uppercase;color:var(--ink-2);margin-bottom:24px;">
          Recommended · <span style="color:var(--accent);">${p.fund}</span>
        </div>
        <a href="${waUrl}" target="_blank" rel="noopener" class="om-quiz-result-btn" data-testid="quiz-cta">Get a personalised plan →</a>
      </div>
    `;
  }
  function openQuiz(){
    if(!quizOverlay) quizOverlay = buildQuizModal();
    quizIdx = 0; quizScore = 0;
    renderQuizStep();
    quizOverlay.classList.add('is-open');
    const close = ()=> quizOverlay.classList.remove('is-open');
    quizOverlay.querySelector('.om-modal-close').onclick = close;
    quizOverlay.addEventListener('click', (e)=>{ if(e.target === quizOverlay) close(); });
    document.addEventListener('keydown', function once(e){
      if(e.key === 'Escape'){ close(); document.removeEventListener('keydown', once); }
    });
  }
  window.OM_openQuiz = openQuiz;

  /* ============ 9. GOAL PLANNER SECTION ============ */
  function initGoalPlanner(){
    // Find existing calculator section to insert after
    const calcSection = document.getElementById('calculator');
    if(!calcSection) return;
    if(document.getElementById('om-goal-planner')) return;

    const section = document.createElement('section');
    section.className = 'section om-goal-section';
    section.id = 'om-goal-planner';
    section.innerHTML = `
      <div class="section-title" style="text-align:center;margin-bottom:50px;">
        <span class="section-eyebrow">Goal Planner</span>
        <h2 style="margin-top:14px;">Plan any life goal in seconds</h2>
        <p>Drag the sliders — we'll calculate the SIP you need to reach your target.</p>
      </div>
      <div class="om-goal-wrap">
        <div class="om-goal-form">
          <h3>Your goal</h3>
          <div class="om-goal-row">
            <label>Target amount <span data-testid="goal-target-label">₹50,00,000</span></label>
            <input type="range" id="goal-target" min="100000" max="50000000" step="100000" value="5000000" data-testid="goal-target"/>
          </div>
          <div class="om-goal-row">
            <label>Time horizon <span data-testid="goal-years-label">10 years</span></label>
            <input type="range" id="goal-years" min="1" max="40" step="1" value="10" data-testid="goal-years"/>
          </div>
          <div class="om-goal-row">
            <label>Expected return <span data-testid="goal-rate-label">12% p.a.</span></label>
            <input type="range" id="goal-rate" min="4" max="20" step="0.5" value="12" data-testid="goal-rate"/>
          </div>
          <div class="om-goal-row">
            <label>Goal type</label>
            <select id="goal-type" style="background:rgba(255,255,255,0.03);border:1px solid var(--line);color:var(--ink-0);border-radius:12px;padding:11px 14px;font-family:'Manrope',sans-serif;font-size:0.95rem;outline:none;" data-testid="goal-type">
              <option value="retirement">Retirement</option>
              <option value="education">Child Education</option>
              <option value="home">Home Purchase</option>
              <option value="car">Car Purchase</option>
              <option value="travel">Dream Travel</option>
              <option value="emergency">Emergency Fund</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div class="om-goal-output">
          <div class="om-goal-output-eyebrow">Required SIP</div>
          <div class="om-goal-output-value" data-testid="goal-sip-value">₹0</div>
          <div class="om-goal-output-label">monthly investment to reach your goal</div>
          <div class="om-goal-stats">
            <div class="om-goal-stat">
              <label>Total invested</label>
              <strong data-testid="goal-invested">₹0</strong>
            </div>
            <div class="om-goal-stat">
              <label>Wealth gained</label>
              <strong data-testid="goal-gained">₹0</strong>
            </div>
            <div class="om-goal-stat">
              <label>One-time alternative</label>
              <strong data-testid="goal-lumpsum">₹0</strong>
            </div>
            <div class="om-goal-stat">
              <label>Goal type</label>
              <strong data-testid="goal-type-display">Retirement</strong>
            </div>
          </div>
        </div>
      </div>
    `;
    calcSection.parentNode.insertBefore(section, calcSection.nextSibling);

    const t = section.querySelector('#goal-target');
    const y = section.querySelector('#goal-years');
    const r = section.querySelector('#goal-rate');
    const typeSel = section.querySelector('#goal-type');
    const tLabel = section.querySelector('[data-testid="goal-target-label"]');
    const yLabel = section.querySelector('[data-testid="goal-years-label"]');
    const rLabel = section.querySelector('[data-testid="goal-rate-label"]');
    const sipOut = section.querySelector('[data-testid="goal-sip-value"]');
    const invOut = section.querySelector('[data-testid="goal-invested"]');
    const gainOut = section.querySelector('[data-testid="goal-gained"]');
    const lumpOut = section.querySelector('[data-testid="goal-lumpsum"]');
    const typeDisplay = section.querySelector('[data-testid="goal-type-display"]');

    function fmt(num){
      if(num >= 1e7) return `₹${(num/1e7).toFixed(2)} Cr`;
      if(num >= 1e5) return `₹${(num/1e5).toFixed(2)} L`;
      return `₹${Math.round(num).toLocaleString('en-IN')}`;
    }

    function compute(){
      const target = parseFloat(t.value);
      const years = parseFloat(y.value);
      const rate = parseFloat(r.value);
      const months = years * 12;
      const i = rate / 100 / 12;
      const factor = (Math.pow(1 + i, months) - 1) / i * (1 + i);
      const sip = target / factor;
      const invested = sip * months;
      const gained = target - invested;
      const lumpsum = target / Math.pow(1 + rate / 100, years);

      tLabel.textContent = fmt(target);
      yLabel.textContent = `${years} ${years === 1 ? 'year' : 'years'}`;
      rLabel.textContent = `${rate}% p.a.`;
      sipOut.textContent = `${fmt(sip)}/mo`;
      invOut.textContent = fmt(invested);
      gainOut.textContent = fmt(Math.max(0, gained));
      lumpOut.textContent = fmt(lumpsum);
      typeDisplay.textContent = typeSel.options[typeSel.selectedIndex].text;
    }

    [t, y, r].forEach(el => el.addEventListener('input', compute));
    typeSel.addEventListener('change', compute);
    compute();
  }

  /* ============ 10. SMOOTH ANCHOR SCROLL ============ */
  function initSmoothAnchors(){
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e)=>{
        const href = a.getAttribute('href');
        if(!href || href === '#') return;
        const target = document.querySelector(href);
        if(!target) return;
        e.preventDefault();
        const navH = document.querySelector('.navbar')?.offsetHeight || 80;
        const tickerH = document.querySelector('.om-ticker')?.offsetHeight || 0;
        const offset = navH + tickerH + 14;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        // close mobile nav if open
        document.querySelector('.nav-links')?.classList.remove('open');
        document.querySelector('.menu-toggle')?.classList.remove('open');
      });
    });
  }

  /* ============ BOOT ============ */
  function boot(){
    try{ initPreloader(); }catch(e){ console.error(e); }
    try{ initTicker(); }catch(e){ console.error(e); }
    try{ initCounters(); }catch(e){ console.error(e); }
    try{ initLead(); }catch(e){ console.error(e); }
    try{ initStickyCTA(); }catch(e){ console.error(e); }
    try{ initBackToTop(); }catch(e){ console.error(e); }
    try{ initCmdK(); }catch(e){ console.error(e); }
    try{ initGoalPlanner(); }catch(e){ console.error(e); }
    try{ initSmoothAnchors(); }catch(e){ console.error(e); }
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
