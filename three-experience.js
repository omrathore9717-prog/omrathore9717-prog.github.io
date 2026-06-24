// =========================================================
// OM FINANCIAL — FUTURISTIC 3D (Optimized for smoothness)
// Monochrome platinum + electric cyan
// Single rAF loop · throttled scroll · low particle counts
// =========================================================
(function(){
  if(typeof THREE === 'undefined'){ console.warn('THREE missing'); return; }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = ('ontouchstart' in window);
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  /* ============ GLOBAL POINTER (throttled) ============ */
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  let lastMove = 0;
  window.addEventListener('mousemove', (e)=>{
    const now = performance.now();
    if(now - lastMove < 16) return; // ~60fps cap
    lastMove = now;
    ptr.tx = (e.clientX / window.innerWidth) * 2 - 1;
    ptr.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });

  /* ============ SHARED SCROLL CACHE (1 listener) ============ */
  const scrollState = { y: 0, vh: window.innerHeight };
  let scrollRaf = 0;
  function onGlobalScroll(){
    if(scrollRaf) return;
    scrollRaf = requestAnimationFrame(()=>{
      scrollState.y = window.scrollY;
      scrollState.vh = window.innerHeight;
      scrollRaf = 0;
    });
  }
  window.addEventListener('scroll', onGlobalScroll, { passive: true });
  window.addEventListener('resize', ()=>{ scrollState.vh = window.innerHeight; }, { passive: true });

  /* ============ MATERIALS ============ */
  const CYAN = 0x5cf0ff;
  const PLATINUM = 0xd6dfeb;
  const DARK = 0x0e1320;

  function makeAccent(){
    return new THREE.MeshStandardMaterial({
      color: CYAN, metalness: 0.6, roughness: 0.25,
      emissive: 0x0a3d44, emissiveIntensity: 0.6
    });
  }
  function makePlatinum(){
    return new THREE.MeshStandardMaterial({
      color: PLATINUM, metalness: 1.0, roughness: 0.32,
      emissive: 0x0a0e16, emissiveIntensity: 0.15
    });
  }
  function makeDark(){
    return new THREE.MeshStandardMaterial({
      color: DARK, metalness: 0.85, roughness: 0.45,
      emissive: 0x05080f, emissiveIntensity: 0.2
    });
  }
  function makeWire(){
    return new THREE.MeshBasicMaterial({
      color: CYAN, wireframe: true, transparent: true, opacity: 0.4
    });
  }

  /* ============ PARTICLES (low count, single material) ============ */
  function buildParticles(count, spread, color, size){
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for(let i = 0; i < count; i++){
      positions[i*3+0] = (Math.random() - 0.5) * spread;
      positions[i*3+1] = (Math.random() - 0.5) * spread * 0.6;
      positions[i*3+2] = (Math.random() - 0.5) * spread;
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const m = new THREE.PointsMaterial({
      color: color || CYAN, size: size || 0.035, sizeAttenuation: true,
      transparent: true, opacity: 0.7, depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    return new THREE.Points(g, m);
  }

  /* =====================================================
     HERO 3D — Floating data sphere + ring system
     ===================================================== */
  function initHero3D(){
    const mount = document.getElementById('hero-3d');
    if(!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights — minimal
    scene.add(new THREE.AmbientLight(0x1a1f2e, 0.7));
    const l1 = new THREE.PointLight(0x5cf0ff, 2.2, 20); l1.position.set(4, 4, 6); scene.add(l1);
    const l2 = new THREE.PointLight(0xffffff, 0.9, 16); l2.position.set(-5, -2, 3); scene.add(l2);

    const accent = makeAccent();
    const platinum = makePlatinum();
    const dark = makeDark();
    const wire = makeWire();

    const group = new THREE.Group();
    scene.add(group);

    // Central icosphere (data core)
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.1, 1),
      new THREE.MeshStandardMaterial({
        color: 0x0e1626, metalness: 0.9, roughness: 0.3,
        emissive: 0x062028, emissiveIntensity: 0.6
      })
    );
    group.add(core);

    // Wireframe shell around core
    const coreWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.32, 1),
      new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.6 })
    );
    group.add(coreWire);

    // 3 rings at different angles
    const ringMat = new THREE.MeshStandardMaterial({
      color: CYAN, metalness: 0.9, roughness: 0.2,
      emissive: 0x0a3d44, emissiveIntensity: 0.5
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.018, 12, 120), ringMat);
    ring1.rotation.x = Math.PI / 2.4;
    group.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.012, 12, 120), ringMat);
    ring2.rotation.x = Math.PI / 3.2;
    ring2.rotation.z = Math.PI / 5;
    group.add(ring2);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.008, 12, 120),
      new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.35 }));
    ring3.rotation.x = Math.PI / 2;
    ring3.rotation.y = Math.PI / 4;
    group.add(ring3);

    // 8 orbiting nodes — kept low for performance
    const nodes = [];
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, metalness: 0.4, roughness: 0.3,
      emissive: 0x5cf0ff, emissiveIntensity: 0.4
    });
    for(let i = 0; i < 8; i++){
      const n = new THREE.Mesh(new THREE.IcosahedronGeometry(0.08, 0), nodeMat);
      const a = (i / 8) * Math.PI * 2;
      const radius = i % 2 === 0 ? 2.0 : 2.4;
      n.userData = { angle: a, radius: radius, speed: 0.2 + (i % 3) * 0.05, tilt: (i % 3) * 0.4 };
      group.add(n);
      nodes.push(n);
    }

    // 6 floating glass shards (icosahedrons in cyan wireframe)
    const shards = [];
    for(let i = 0; i < 6; i++){
      const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 0), wire);
      const a = (i / 6) * Math.PI * 2 + 0.4;
      const r = 3.8 + Math.random() * 0.8;
      s.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 2.5, Math.sin(a) * r * 0.45 - 1);
      s.userData = {
        spin: { x: (Math.random()-0.5)*0.006, y: (Math.random()-0.5)*0.008 },
        baseY: s.position.y,
        bobSpeed: 0.4 + Math.random() * 0.4,
        bobAmp: 0.15 + Math.random() * 0.2
      };
      group.add(s);
      shards.push(s);
    }

    // Particle dust (300 — light)
    const dust = buildParticles(300, 14, CYAN, 0.03);
    scene.add(dust);

    function resize(){
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    const clock = new THREE.Clock();
    let visible = true;
    const io = new IntersectionObserver(([e])=>{ visible = e.isIntersecting; }, { threshold: 0.01 });
    io.observe(mount);

    function tick(){
      requestAnimationFrame(tick);
      if(!visible) return;
      const t = clock.getElapsedTime();
      ptr.x += (ptr.tx - ptr.x) * 0.05;
      ptr.y += (ptr.ty - ptr.y) * 0.05;

      const rect = mount.getBoundingClientRect();
      const scrollT = 1 - Math.min(Math.max((rect.top + rect.height) / (scrollState.vh + rect.height), 0), 1);

      group.rotation.y = t * 0.08 + ptr.x * 0.3 + scrollT * 0.8;
      group.rotation.x = ptr.y * 0.2 + scrollT * 0.3;

      core.rotation.y = t * 0.15;
      core.rotation.x = t * 0.1;
      coreWire.rotation.y = -t * 0.18;
      coreWire.rotation.x = -t * 0.12;

      ring1.rotation.z = t * 0.2;
      ring2.rotation.z = -t * 0.15;
      ring3.rotation.z = t * 0.1;

      for(let i = 0; i < nodes.length; i++){
        const n = nodes[i];
        const a = n.userData.angle + t * n.userData.speed;
        n.position.set(
          Math.cos(a) * n.userData.radius,
          Math.sin(a + n.userData.tilt) * 0.4,
          Math.sin(a) * n.userData.radius
        );
      }

      for(let i = 0; i < shards.length; i++){
        const s = shards[i];
        s.rotation.x += s.userData.spin.x;
        s.rotation.y += s.userData.spin.y;
        s.position.y = s.userData.baseY + Math.sin(t * s.userData.bobSpeed + i) * s.userData.bobAmp;
      }

      dust.rotation.y = t * 0.015;

      camera.position.x = ptr.x * 0.4;
      camera.position.y = ptr.y * 0.3 + scrollT * 0.5;
      camera.position.z = 8 - scrollT * 1.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    tick();
  }

  /* =====================================================
     SCROLL 3D — Cinematic chart cityscape
     ===================================================== */
  function initScroll3D(){
    const mount = document.getElementById('scroll-3d');
    if(!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x07090f, 8, 18);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 2, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x1a1f2e, 0.6));
    const l1 = new THREE.PointLight(0x5cf0ff, 2.2, 22); l1.position.set(3, 5, 5); scene.add(l1);
    const l2 = new THREE.PointLight(0xffffff, 0.8, 18); l2.position.set(-4, 2, 3); scene.add(l2);

    // floor (subtle)
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0x07090f, metalness: 0.6, roughness: 0.8 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // grid (cheap)
    const grid = new THREE.GridHelper(20, 24, 0x5cf0ff, 0x141a26);
    grid.material.transparent = true; grid.material.opacity = 0.25;
    grid.position.y = 0.001;
    scene.add(grid);

    // chart bars — 9 nice & smooth
    const bars = [];
    const barMatA = new THREE.MeshStandardMaterial({
      color: PLATINUM, metalness: 0.9, roughness: 0.32,
      emissive: 0x0a0e16, emissiveIntensity: 0.2
    });
    const barMatB = new THREE.MeshStandardMaterial({
      color: CYAN, metalness: 0.8, roughness: 0.25,
      emissive: 0x0a3d44, emissiveIntensity: 0.5
    });
    for(let i = 0; i < 9; i++){
      const h = 0.5;
      const m = i === 4 ? barMatB : barMatA;
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.32, h, 0.32), m);
      b.position.set(-3.2 + i * 0.8, h / 2, 0);
      b.userData = { base: h, peak: 0.5 + Math.random() * 2.4, phase: i * 0.3 };
      bars.push(b); scene.add(b);
    }

    // ring stack
    const ringGroup = new THREE.Group();
    for(let i = 0; i < 4; i++){
      const m = new THREE.MeshStandardMaterial({
        color: i === 1 ? CYAN : PLATINUM,
        metalness: 0.9, roughness: 0.22,
        emissive: i === 1 ? 0x0a3d44 : 0x0a0e16,
        emissiveIntensity: i === 1 ? 0.5 : 0.2
      });
      const r = new THREE.Mesh(new THREE.TorusGeometry(1.5 + i * 0.32, 0.018, 12, 100), m);
      r.rotation.x = Math.PI / 2 - i * 0.1;
      r.rotation.z = i * 0.2;
      ringGroup.add(r);
    }
    ringGroup.position.set(0, 2.4, -1);
    scene.add(ringGroup);

    // light dust
    const dust = buildParticles(180, 12, CYAN, 0.025);
    dust.position.y = 1.5;
    scene.add(dust);

    function resize(){
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    let visible = true;
    const io = new IntersectionObserver(([e])=>{ visible = e.isIntersecting; }, { threshold: 0.01 });
    io.observe(mount);

    const clock = new THREE.Clock();
    function tick(){
      requestAnimationFrame(tick);
      if(!visible) return;
      const t = clock.getElapsedTime();
      const r = mount.getBoundingClientRect();
      const total = scrollState.vh + r.height;
      const progress = Math.min(Math.max((scrollState.vh - r.top) / total, 0), 1);

      for(let i = 0; i < bars.length; i++){
        const b = bars[i];
        const wave = Math.sin(b.userData.phase + progress * Math.PI * 1.6 + t * 0.4) * 0.5 + 0.5;
        const target = 0.4 + wave * b.userData.peak * (0.25 + progress * 0.9);
        const next = b.scale.y + (target / b.userData.base - b.scale.y) * 0.08;
        b.scale.y = next;
        b.position.y = (b.userData.base * next) / 2;
      }

      ringGroup.rotation.y = progress * Math.PI * 2 + t * 0.1;
      ringGroup.rotation.x = -0.2 + progress * 0.4;
      ringGroup.children.forEach((r, i)=>{ r.rotation.z += 0.004 * (i + 1); });

      dust.rotation.y = t * 0.03;

      camera.position.x = Math.sin(progress * Math.PI) * 1.6;
      camera.position.y = 2 + progress * 0.9;
      camera.position.z = 7 - progress * 0.8;
      camera.lookAt(0, 1.8, 0);

      renderer.render(scene, camera);
    }
    tick();
  }

  /* =====================================================
     SERVICES — Subtle background knot
     ===================================================== */
  function initServices3D(){
    const services = document.getElementById('services');
    if(!services) return;
    const mount = document.createElement('div');
    mount.id = 'services-3d';
    mount.setAttribute('aria-hidden', 'true');
    services.prepend(mount);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x1a1f2e, 0.5));
    const l1 = new THREE.PointLight(CYAN, 1.6, 16); l1.position.set(3, 3, 5); scene.add(l1);

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.5, 0.035, 200, 10, 3, 5),
      new THREE.MeshStandardMaterial({
        color: CYAN, metalness: 0.85, roughness: 0.2,
        emissive: 0x0a3d44, emissiveIntensity: 0.4
      })
    );
    scene.add(knot);

    function resize(){
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    let visible = true;
    const io = new IntersectionObserver(([e])=>{ visible = e.isIntersecting; }, { threshold: 0.01 });
    io.observe(mount);

    const clock = new THREE.Clock();
    function tick(){
      requestAnimationFrame(tick);
      if(!visible) return;
      const t = clock.getElapsedTime();
      knot.rotation.x = t * 0.12;
      knot.rotation.y = t * 0.18;
      camera.position.x = ptr.x * 0.5;
      camera.position.y = ptr.y * 0.3;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    tick();
  }

  /* =====================================================
     CARD TILT — light, GPU-only, mouse-tracked
     ===================================================== */
  function initTilt(){
    if(reduceMotion || isTouch) return;
    const sel = '.card, .solution-card, .glass-card, .impact-card, .planner-card, .testimonial-card, .blog-card, .amc-card, .cta-card';
    document.querySelectorAll(sel).forEach(card => {
      card.style.willChange = 'transform';
      let raf = 0;
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
        card.style.setProperty('--my', `${(y + 0.5) * 100}%`);
        if(raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform =
            `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(4px)`;
        });
      }, { passive: true });
      card.addEventListener('mouseleave', () => {
        if(raf) cancelAnimationFrame(raf);
        card.style.transform = '';
      });
    });
  }

  /* =====================================================
     MAGNETIC BUTTONS — subtle
     ===================================================== */
  function initMagnetic(){
    if(reduceMotion || isTouch) return;
    document.querySelectorAll('.primary-btn, .secondary-btn, .whatsapp-btn').forEach(btn => {
      const strength = 8;
      btn.addEventListener('mousemove', (e)=>{
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2) / (r.width/2);
        const y = (e.clientY - r.top - r.height/2) / (r.height/2);
        btn.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
      }, { passive: true });
      btn.addEventListener('mouseleave', ()=>{ btn.style.transform = ''; });
    });
  }

  /* =====================================================
     SPLIT LETTER REVEAL
     ===================================================== */
  function initLetterReveal(){
    const h1 = document.querySelector('.hero-content h1');
    if(!h1 || h1.dataset.split) return;
    h1.dataset.split = '1';
    const text = h1.innerText;
    h1.innerHTML = '';
    const words = text.split(/\s+/);
    words.forEach((w, wi) => {
      const wEl = document.createElement('span'); wEl.className = 'om-word';
      [...w].forEach((ch, ci) => {
        const s = document.createElement('span'); s.className = 'om-char';
        s.textContent = ch;
        s.style.animationDelay = `${0.03 * (wi * 5 + ci)}s`;
        wEl.appendChild(s);
      });
      h1.appendChild(wEl);
      if(wi < words.length - 1) h1.appendChild(document.createTextNode(' '));
    });
    h1.classList.add('om-h1-reveal');
  }

  /* =====================================================
     STAGGER REVEAL on grid items
     ===================================================== */
  function initStagger(){
    if(reduceMotion || !('IntersectionObserver' in window)) return;
    const groups = [
      { c: '.grid', i: '.card' },
      { c: '.solutions-grid', i: '.solution-card' },
      { c: '.blog-grid', i: '.blog-card' },
      { c: '.impact-grid', i: '.impact-card' },
      { c: '.dashboard-grid', i: '.glass-card' },
      { c: '.planner-grid', i: '.planner-card' },
      { c: '.testimonial-grid', i: '.testimonial-card' },
      { c: '.amc-grid', i: '.amc-card' }
    ];
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if(e.isIntersecting){
          const items = e.target.querySelectorAll(e.target.dataset.staggerSel);
          items.forEach((el, i) => {
            el.style.transitionDelay = `${i * 60}ms`;
            el.classList.add('om-stagger-in');
          });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    groups.forEach(g => {
      document.querySelectorAll(g.c).forEach(c => {
        c.dataset.staggerSel = g.i;
        c.querySelectorAll(g.i).forEach(el => el.classList.add('om-stagger'));
        io.observe(c);
      });
    });
  }

  /* =====================================================
     PARALLAX — hero copy only, throttled
     ===================================================== */
  function initParallax(){
    if(reduceMotion) return;
    const heroContent = document.querySelector('.hero-content');
    if(!heroContent) return;
    let raf = 0;
    function update(){
      raf = 0;
      const y = scrollState.y;
      heroContent.style.transform = `translate3d(0, ${y * -0.08}px, 0)`;
      heroContent.style.opacity = String(Math.max(0, 1 - y / 800));
    }
    window.addEventListener('scroll', ()=>{
      if(!raf) raf = requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  /* ============ BOOT ============ */
  function boot(){
    try{ initLetterReveal(); }catch(e){ console.error(e); }
    try{ initHero3D(); }catch(e){ console.error(e); }
    try{ initScroll3D(); }catch(e){ console.error(e); }
    try{ initServices3D(); }catch(e){ console.error(e); }
    try{ initTilt(); }catch(e){ console.error(e); }
    try{ initMagnetic(); }catch(e){ console.error(e); }
    try{ initStagger(); }catch(e){ console.error(e); }
    try{ initParallax(); }catch(e){ console.error(e); }
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
