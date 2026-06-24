// =========================================================
// OM FINANCIAL — PROFESSIONAL 3D (Refined)
// Slower cinematic motion · refined materials · institutional feel
// =========================================================
(function(){
  if(typeof THREE === 'undefined'){ console.warn('THREE missing'); return; }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = ('ontouchstart' in window);
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  /* ============ POINTER (throttled) ============ */
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  let lastMove = 0;
  window.addEventListener('mousemove', (e)=>{
    const now = performance.now();
    if(now - lastMove < 16) return;
    lastMove = now;
    ptr.tx = (e.clientX / window.innerWidth) * 2 - 1;
    ptr.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });

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

  /* ============ REFINED PALETTE ============ */
  const ACCENT = 0x6fc7d4;   // sophisticated teal-cyan
  const ACCENT_HEX = '#6fc7d4';
  const PLATINUM = 0xc7d0dc;
  const DARK = 0x0a1018;

  function matAccent(){
    return new THREE.MeshStandardMaterial({
      color: ACCENT, metalness: 0.75, roughness: 0.28,
      emissive: 0x0a2530, emissiveIntensity: 0.4
    });
  }
  function matPlatinum(){
    return new THREE.MeshStandardMaterial({
      color: PLATINUM, metalness: 0.95, roughness: 0.32,
      emissive: 0x0a0e16, emissiveIntensity: 0.12
    });
  }
  function matDark(){
    return new THREE.MeshStandardMaterial({
      color: DARK, metalness: 0.9, roughness: 0.45,
      emissive: 0x04060c, emissiveIntensity: 0.18
    });
  }
  function matWire(){
    return new THREE.MeshBasicMaterial({
      color: ACCENT, wireframe: true, transparent: true, opacity: 0.32
    });
  }

  function makeParticles(count, spread, size){
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for(let i = 0; i < count; i++){
      positions[i*3+0] = (Math.random() - 0.5) * spread;
      positions[i*3+1] = (Math.random() - 0.5) * spread * 0.6;
      positions[i*3+2] = (Math.random() - 0.5) * spread;
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const m = new THREE.PointsMaterial({
      color: ACCENT, size: size || 0.028, sizeAttenuation: true,
      transparent: true, opacity: 0.55, depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    return new THREE.Points(g, m);
  }

  /* =====================================================
     SCENE 1 — HERO  (data sphere + orbiting nodes)
     Slow, cinematic, institutional
     ===================================================== */
  function initHero3D(){
    const mount = document.getElementById('hero-3d');
    if(!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x182030, 0.65));
    const l1 = new THREE.PointLight(ACCENT, 1.8, 22); l1.position.set(4, 4, 6); scene.add(l1);
    const l2 = new THREE.PointLight(0xffffff, 0.7, 18); l2.position.set(-5, -2, 3); scene.add(l2);
    const l3 = new THREE.PointLight(ACCENT, 0.6, 14); l3.position.set(0, -3, 0); scene.add(l3);

    const group = new THREE.Group();
    scene.add(group);

    // Core — institutional dark sphere with subtle accent
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.1, 1),
      new THREE.MeshStandardMaterial({
        color: 0x101828, metalness: 0.9, roughness: 0.35,
        emissive: 0x041419, emissiveIntensity: 0.5
      })
    );
    group.add(core);

    // Wireframe shell
    const coreWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.34, 1),
      new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.5 })
    );
    group.add(coreWire);

    // 3 institutional rings — refined torus
    const ringMat = new THREE.MeshStandardMaterial({
      color: ACCENT, metalness: 0.9, roughness: 0.25,
      emissive: 0x082530, emissiveIntensity: 0.4
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.012, 12, 140), ringMat);
    ring1.rotation.x = Math.PI / 2.4;
    group.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.45, 0.009, 12, 140), ringMat);
    ring2.rotation.x = Math.PI / 3.2;
    ring2.rotation.z = Math.PI / 5;
    group.add(ring2);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.006, 12, 140),
      new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.25 }));
    ring3.rotation.x = Math.PI / 2;
    ring3.rotation.y = Math.PI / 4;
    group.add(ring3);

    // 8 orbiting nodes — refined
    const nodes = [];
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xeaf2f8, metalness: 0.4, roughness: 0.3,
      emissive: ACCENT, emissiveIntensity: 0.35
    });
    for(let i = 0; i < 8; i++){
      const n = new THREE.Mesh(new THREE.IcosahedronGeometry(0.065, 0), nodeMat);
      const a = (i / 8) * Math.PI * 2;
      const radius = i % 2 === 0 ? 2.0 : 2.45;
      n.userData = { angle: a, radius, speed: 0.10 + (i % 3) * 0.025, tilt: (i % 3) * 0.35 };
      group.add(n);
      nodes.push(n);
    }

    // 5 refined wire shards (less than before, calmer)
    const shards = [];
    const wire = matWire();
    for(let i = 0; i < 5; i++){
      const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 0), wire);
      const a = (i / 5) * Math.PI * 2 + 0.5;
      const r = 3.9 + Math.random() * 0.6;
      s.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 2.2, Math.sin(a) * r * 0.45 - 1);
      s.userData = {
        spin: { x: (Math.random()-0.5)*0.004, y: (Math.random()-0.5)*0.005 },
        baseY: s.position.y,
        bobSpeed: 0.25 + Math.random() * 0.3,
        bobAmp: 0.12 + Math.random() * 0.18
      };
      group.add(s);
      shards.push(s);
    }

    // refined particle field (lower count, smaller)
    const dust = makeParticles(220, 14, 0.024);
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
      ptr.x += (ptr.tx - ptr.x) * 0.04;
      ptr.y += (ptr.ty - ptr.y) * 0.04;

      const rect = mount.getBoundingClientRect();
      const scrollT = 1 - Math.min(Math.max((rect.top + rect.height) / (scrollState.vh + rect.height), 0), 1);

      // SLOWER cinematic rotation
      group.rotation.y = t * 0.05 + ptr.x * 0.22 + scrollT * 0.5;
      group.rotation.x = ptr.y * 0.14 + scrollT * 0.22;

      core.rotation.y = t * 0.08;
      core.rotation.x = t * 0.06;
      coreWire.rotation.y = -t * 0.10;
      coreWire.rotation.x = -t * 0.07;

      ring1.rotation.z = t * 0.12;
      ring2.rotation.z = -t * 0.09;
      ring3.rotation.z = t * 0.06;

      for(let i = 0; i < nodes.length; i++){
        const n = nodes[i];
        const a = n.userData.angle + t * n.userData.speed;
        n.position.set(
          Math.cos(a) * n.userData.radius,
          Math.sin(a + n.userData.tilt) * 0.35,
          Math.sin(a) * n.userData.radius
        );
      }

      for(let i = 0; i < shards.length; i++){
        const s = shards[i];
        s.rotation.x += s.userData.spin.x;
        s.rotation.y += s.userData.spin.y;
        s.position.y = s.userData.baseY + Math.sin(t * s.userData.bobSpeed + i) * s.userData.bobAmp;
      }

      dust.rotation.y = t * 0.008;

      // cinematic dolly — slow
      camera.position.x = ptr.x * 0.32;
      camera.position.y = ptr.y * 0.22 + scrollT * 0.4;
      camera.position.z = 9 - scrollT * 1.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    tick();
  }

  /* =====================================================
     SCENE 2 — SCROLL 3D (chart cityscape)
     Refined — smaller fog, slower animation
     ===================================================== */
  function initScroll3D(){
    const mount = document.getElementById('scroll-3d');
    if(!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x06090f, 9, 20);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 2, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x182030, 0.55));
    const l1 = new THREE.PointLight(ACCENT, 1.9, 22); l1.position.set(3, 5, 5); scene.add(l1);
    const l2 = new THREE.PointLight(0xffffff, 0.7, 18); l2.position.set(-4, 2, 3); scene.add(l2);

    // floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 22),
      new THREE.MeshStandardMaterial({ color: 0x06090f, metalness: 0.7, roughness: 0.85 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // cleaner grid (fewer lines)
    const grid = new THREE.GridHelper(22, 18, ACCENT, 0x121826);
    grid.material.transparent = true; grid.material.opacity = 0.18;
    grid.position.y = 0.001;
    scene.add(grid);

    // refined bars — 11
    const bars = [];
    const barMatA = matPlatinum();
    const barMatB = matAccent();
    for(let i = 0; i < 11; i++){
      const h = 0.5;
      const m = (i === 5) ? barMatB : barMatA;
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.28, h, 0.28), m);
      b.position.set(-3.5 + i * 0.7, h / 2, 0);
      b.userData = { base: h, peak: 0.6 + Math.random() * 2.2, phase: i * 0.32 };
      bars.push(b); scene.add(b);
    }

    // refined ring stack
    const ringGroup = new THREE.Group();
    for(let i = 0; i < 4; i++){
      const m = new THREE.MeshStandardMaterial({
        color: i === 1 ? ACCENT : PLATINUM,
        metalness: 0.9, roughness: 0.25,
        emissive: i === 1 ? 0x082530 : 0x0a0e16,
        emissiveIntensity: i === 1 ? 0.4 : 0.12
      });
      const r = new THREE.Mesh(new THREE.TorusGeometry(1.5 + i * 0.3, 0.014, 12, 110), m);
      r.rotation.x = Math.PI / 2 - i * 0.09;
      r.rotation.z = i * 0.2;
      ringGroup.add(r);
    }
    ringGroup.position.set(0, 2.5, -1);
    scene.add(ringGroup);

    const dust = makeParticles(140, 12, 0.022);
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
        const wave = Math.sin(b.userData.phase + progress * Math.PI * 1.6 + t * 0.3) * 0.5 + 0.5;
        const target = 0.4 + wave * b.userData.peak * (0.25 + progress * 0.9);
        const next = b.scale.y + (target / b.userData.base - b.scale.y) * 0.06;
        b.scale.y = next;
        b.position.y = (b.userData.base * next) / 2;
      }

      ringGroup.rotation.y = progress * Math.PI * 1.8 + t * 0.06;
      ringGroup.rotation.x = -0.2 + progress * 0.4;
      ringGroup.children.forEach((r, i)=>{ r.rotation.z += 0.0025 * (i + 1); });

      dust.rotation.y = t * 0.02;

      camera.position.x = Math.sin(progress * Math.PI) * 1.4;
      camera.position.y = 2 + progress * 0.8;
      camera.position.z = 7 - progress * 0.6;
      camera.lookAt(0, 1.8, 0);

      renderer.render(scene, camera);
    }
    tick();
  }

  /* =====================================================
     SCENE 3 — Subtle services orb
     ===================================================== */
  function initServices3D(){
    const services = document.getElementById('services');
    if(!services) return;
    if(document.getElementById('services-3d')) return;

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

    scene.add(new THREE.AmbientLight(0x182030, 0.5));
    const l1 = new THREE.PointLight(ACCENT, 1.3, 16); l1.position.set(3, 3, 5); scene.add(l1);

    // refined torus knot
    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.5, 0.022, 240, 12, 3, 5),
      new THREE.MeshStandardMaterial({
        color: ACCENT, metalness: 0.8, roughness: 0.28,
        emissive: 0x082530, emissiveIntensity: 0.3
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
      knot.rotation.x = t * 0.06;
      knot.rotation.y = t * 0.09;
      camera.position.x = ptr.x * 0.4;
      camera.position.y = ptr.y * 0.25;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    tick();
  }

  /* =====================================================
     CARD TILT — institutional restraint (smaller angles)
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
            `perspective(1400px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateZ(2px)`;
        });
      }, { passive: true });
      card.addEventListener('mouseleave', () => {
        if(raf) cancelAnimationFrame(raf);
        card.style.transform = '';
      });
    });
  }

  /* =====================================================
     MAGNETIC BUTTONS (subtler)
     ===================================================== */
  function initMagnetic(){
    if(reduceMotion || isTouch) return;
    document.querySelectorAll('.primary-btn, .secondary-btn, .whatsapp-btn').forEach(btn => {
      const strength = 5;
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
        s.style.animationDelay = `${0.035 * (wi * 5 + ci)}s`;
        wEl.appendChild(s);
      });
      h1.appendChild(wEl);
      if(wi < words.length - 1) h1.appendChild(document.createTextNode(' '));
    });
    h1.classList.add('om-h1-reveal');
  }

  /* =====================================================
     STAGGER REVEAL
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
            el.style.transitionDelay = `${i * 70}ms`;
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
     PARALLAX — hero copy, gentler
     ===================================================== */
  function initParallax(){
    if(reduceMotion) return;
    const heroContent = document.querySelector('.hero-content');
    if(!heroContent) return;
    let raf = 0;
    function update(){
      raf = 0;
      const y = scrollState.y;
      heroContent.style.transform = `translate3d(0, ${y * -0.06}px, 0)`;
      heroContent.style.opacity = String(Math.max(0, 1 - y / 900));
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
