// =========================================================
// OM FINANCIAL — CINEMATIC 3D EXPERIENCE (Three.js)
// Hero scene + Scroll scene + Services orb + Particles
// Magnetic buttons + Cursor glow + Smooth scroll + Letter reveal
// Premium luxe gold + tech blue
// =========================================================
(function(){
  if(typeof THREE === 'undefined'){ console.warn('THREE missing'); return; }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ GLOBAL POINTER ============ */
  const ptr = { x: 0, y: 0, tx: 0, ty: 0, cx: 0, cy: 0 };
  window.addEventListener('mousemove', (e)=>{
    ptr.tx = (e.clientX / window.innerWidth) * 2 - 1;
    ptr.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    ptr.cx = e.clientX; ptr.cy = e.clientY;
  }, { passive: true });

  /* ============ SMOOTH SCROLL (lerp) ============ */
  function initSmoothScroll(){
    if(reduceMotion) return;
    if('ontouchstart' in window) return; // skip on touch (native is smoother)
    let target = window.scrollY, current = window.scrollY, raf = 0;
    const html = document.documentElement;
    html.style.scrollBehavior = 'auto';
    function loop(){
      current += (target - current) * 0.12;
      if(Math.abs(target - current) < 0.4) current = target;
      window.scrollTo(0, current);
      if(Math.abs(target - current) > 0.4){ raf = requestAnimationFrame(loop); }
      else raf = 0;
    }
    window.addEventListener('wheel', (e)=>{
      e.preventDefault();
      target += e.deltaY * 1.0;
      target = Math.max(0, Math.min(target, document.body.scrollHeight - window.innerHeight));
      if(!raf) raf = requestAnimationFrame(loop);
    }, { passive: false });
    window.addEventListener('keydown', (e)=>{
      const k = e.key;
      if(k === 'ArrowDown' || k === 'PageDown' || k === ' '){ target += window.innerHeight * 0.85; }
      else if(k === 'ArrowUp' || k === 'PageUp'){ target -= window.innerHeight * 0.85; }
      else if(k === 'Home'){ target = 0; }
      else if(k === 'End'){ target = document.body.scrollHeight; }
      target = Math.max(0, Math.min(target, document.body.scrollHeight - window.innerHeight));
      if(!raf) raf = requestAnimationFrame(loop);
    });
  }

  /* ============ CURSOR GLOW + DOT ============ */
  function initCursor(){
    if(reduceMotion) return;
    if('ontouchstart' in window) return;
    const glow = document.createElement('div'); glow.className = 'om-cursor-glow';
    const dot = document.createElement('div');  dot.className = 'om-cursor-dot';
    document.body.appendChild(glow); document.body.appendChild(dot);
    let gx=0, gy=0, dx=0, dy=0;
    function loop(){
      gx += (ptr.cx - gx) * 0.08;
      gy += (ptr.cy - gy) * 0.08;
      dx += (ptr.cx - dx) * 0.32;
      dy += (ptr.cy - dy) * 0.32;
      glow.style.transform = `translate3d(${gx-180}px, ${gy-180}px, 0)`;
      dot.style.transform  = `translate3d(${dx-4}px, ${dy-4}px, 0)`;
      requestAnimationFrame(loop);
    }
    loop();
    const hoverSel = 'a, button, .card, .solution-card, .glass-card, .impact-card, .planner-card, .testimonial-card, .blog-card, .amc-card, input';
    document.querySelectorAll(hoverSel).forEach(el => {
      el.addEventListener('mouseenter', ()=> document.body.classList.add('om-cursor-hover'));
      el.addEventListener('mouseleave', ()=> document.body.classList.remove('om-cursor-hover'));
    });
  }

  /* ============ MAGNETIC BUTTONS ============ */
  function initMagnetic(){
    if(reduceMotion) return;
    document.querySelectorAll('.primary-btn, .secondary-btn, .whatsapp-btn').forEach(btn => {
      const strength = 18;
      btn.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';
      btn.addEventListener('mousemove', (e)=>{
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2) / (r.width/2);
        const y = (e.clientY - r.top - r.height/2) / (r.height/2);
        btn.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0) scale(1.04)`;
      });
      btn.addEventListener('mouseleave', ()=>{ btn.style.transform = ''; });
    });
  }

  /* ============ SPLIT LETTER REVEAL on H1 ============ */
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
        s.style.animationDelay = `${0.04 * (wi * 6 + ci)}s`;
        wEl.appendChild(s);
      });
      h1.appendChild(wEl);
      if(wi < words.length - 1) h1.appendChild(document.createTextNode(' '));
    });
    h1.classList.add('om-h1-reveal');
  }

  /* ============ MATERIALS ============ */
  function makeGold(){
    return new THREE.MeshStandardMaterial({
      color: 0xd4af37, metalness: 1.0, roughness: 0.16,
      emissive: 0x3a2608, emissiveIntensity: 0.55
    });
  }
  function makeDark(){
    return new THREE.MeshStandardMaterial({
      color: 0x0a0d18, metalness: 0.9, roughness: 0.32,
      emissive: 0x05080f, emissiveIntensity: 0.25
    });
  }
  function makeWire(){
    return new THREE.MeshStandardMaterial({
      color: 0xd4af37, metalness: 0.5, roughness: 0.5,
      wireframe: true, transparent: true, opacity: 0.65
    });
  }
  function makeBlueMetal(){
    return new THREE.MeshStandardMaterial({
      color: 0x4f86ff, metalness: 1.0, roughness: 0.22,
      emissive: 0x07112a, emissiveIntensity: 0.45
    });
  }

  /* ============ DENSE PARTICLE FIELD (gold sparks) ============ */
  function buildParticles(count, spread){
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for(let i = 0; i < count; i++){
      positions[i*3+0] = (Math.random() - 0.5) * spread;
      positions[i*3+1] = (Math.random() - 0.5) * spread * 0.6;
      positions[i*3+2] = (Math.random() - 0.5) * spread;
      sizes[i] = Math.random() * 2 + 0.5;
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    const m = new THREE.PointsMaterial({
      color: 0xffd87a, size: 0.04, sizeAttenuation: true,
      transparent: true, opacity: 0.85, depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    return new THREE.Points(g, m);
  }

  /* =====================================================
     SCENE 1 — HERO (cinematic premium)
     ===================================================== */
  function initHero3D(){
    const mount = document.getElementById('hero-3d');
    if(!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060a, 0.06);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.5, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    // Lights — cinematic
    const key = new THREE.PointLight(0xffd87a, 3.2, 26); key.position.set(5, 6, 7); scene.add(key);
    const fill = new THREE.PointLight(0x4f86ff, 1.6, 24); fill.position.set(-7, -3, 5); scene.add(fill);
    const rim = new THREE.PointLight(0xfff2c8, 1.2, 18); rim.position.set(0, -4, -6); scene.add(rim);
    scene.add(new THREE.AmbientLight(0x1c1a14, 0.6));

    const gold = makeGold(), dark = makeDark(), wire = makeWire(), blue = makeBlueMetal();

    const group = new THREE.Group();
    scene.add(group);

    // Central beveled coin (cylinder + torus halo + inner ring)
    const coinGroup = new THREE.Group();
    const coinBody = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.22, 96, 1, false), gold);
    coinBody.rotation.x = Math.PI / 2;
    coinGroup.add(coinBody);

    // bevel rims
    const rim1 = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.07, 24, 96), gold);
    rim1.position.z = 0.11; coinGroup.add(rim1);
    const rim2 = rim1.clone(); rim2.position.z = -0.11; coinGroup.add(rim2);

    // inner engraving rings
    for(let i = 0; i < 3; i++){
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.95 - i*0.18, 0.012, 12, 96),
        new THREE.MeshStandardMaterial({ color: 0xfff0c2, metalness: 1, roughness: 0.1, emissive: 0x402b08, emissiveIntensity: 0.6 }));
      r.position.z = 0.115; coinGroup.add(r);
      const rb = r.clone(); rb.position.z = -0.115; coinGroup.add(rb);
    }

    // ₹ approximation with extruded "OM" via simple bars
    const omMat = new THREE.MeshStandardMaterial({ color: 0xfff0c2, metalness: 0.9, roughness: 0.18, emissive: 0x3a2105, emissiveIntensity: 0.7 });
    const bar1 = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.08, 0.06), omMat); bar1.position.set(0, 0.35, 0.13); coinGroup.add(bar1);
    const bar2 = bar1.clone(); bar2.position.y = 0.15; coinGroup.add(bar2);
    const bar3 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.06), omMat); bar3.position.set(0.0, -0.05, 0.13); coinGroup.add(bar3);
    const bar4 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.06), omMat); bar4.position.set(0.18, -0.55, 0.13); bar4.rotation.z = -0.45; coinGroup.add(bar4);

    group.add(coinGroup);

    // Outer halo torus
    const halo = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.025, 24, 200), gold);
    halo.rotation.x = Math.PI / 2 + 0.1;
    group.add(halo);
    const halo2 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.012, 20, 180),
      new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.35 }));
    halo2.rotation.x = Math.PI / 2 - 0.18;
    halo2.rotation.z = 0.4;
    group.add(halo2);

    // floating shards (icos, octa, cubes, tori)
    const shards = [];
    const geos = [
      new THREE.IcosahedronGeometry(0.32, 0),
      new THREE.OctahedronGeometry(0.36, 0),
      new THREE.BoxGeometry(0.42, 0.42, 0.42),
      new THREE.TorusGeometry(0.32, 0.06, 12, 48),
      new THREE.DodecahedronGeometry(0.28, 0),
      new THREE.TetrahedronGeometry(0.42, 0)
    ];
    for(let i = 0; i < 22; i++){
      const g = geos[i % geos.length];
      const m = i % 4 === 0 ? blue : (i % 3 === 0 ? gold : (i % 2 === 0 ? dark : wire));
      const mesh = new THREE.Mesh(g, m);
      const a = (i / 22) * Math.PI * 2 + Math.random() * 0.4;
      const rad = 3.4 + Math.random() * 2.2;
      mesh.position.set(
        Math.cos(a) * rad,
        (Math.random() - 0.5) * 4,
        Math.sin(a) * rad * 0.5 - 1.5
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh.userData = {
        spin: { x: (Math.random()-0.5)*0.012, y: (Math.random()-0.5)*0.014, z: (Math.random()-0.5)*0.01 },
        bobSpeed: 0.3 + Math.random() * 0.9,
        bobAmp: 0.2 + Math.random() * 0.35,
        baseY: mesh.position.y,
        orbitSpeed: 0.05 + Math.random() * 0.1,
        orbitR: rad,
        orbitA: a
      };
      group.add(mesh);
      shards.push(mesh);
    }

    // Particle dust
    const dust = buildParticles(600, 18);
    scene.add(dust);

    function resize(){
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    let scrollT = 0;
    function onScroll(){
      const r = mount.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = 1 - Math.min(Math.max((r.top + r.height) / (vh + r.height), 0), 1);
      scrollT = p;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const clock = new THREE.Clock();
    function tick(){
      const t = clock.getElapsedTime();
      ptr.x += (ptr.tx - ptr.x) * 0.06;
      ptr.y += (ptr.ty - ptr.y) * 0.06;

      group.rotation.y = t * 0.14 + ptr.x * 0.4 + scrollT * 1.4;
      group.rotation.x = ptr.y * 0.25 + Math.sin(t * 0.4) * 0.04 + scrollT * 0.3;

      coinGroup.rotation.y = t * 0.5;
      coinGroup.rotation.z = Math.sin(t * 0.3) * 0.08;
      halo.rotation.z = t * 0.2;
      halo2.rotation.z = -t * 0.15;

      shards.forEach((s, i)=>{
        s.rotation.x += s.userData.spin.x;
        s.rotation.y += s.userData.spin.y;
        s.rotation.z += s.userData.spin.z;
        const a = s.userData.orbitA + t * s.userData.orbitSpeed;
        s.position.x = Math.cos(a) * s.userData.orbitR;
        s.position.z = Math.sin(a) * s.userData.orbitR * 0.5 - 1.5;
        s.position.y = s.userData.baseY + Math.sin(t * s.userData.bobSpeed + i) * s.userData.bobAmp;
      });

      dust.rotation.y = t * 0.02 + ptr.x * 0.1;
      dust.rotation.x = ptr.y * 0.08;

      // cinematic camera dolly + look
      camera.position.x = ptr.x * 0.5;
      camera.position.y = 0.5 + ptr.y * 0.4 + scrollT * 0.8;
      camera.position.z = 9 - scrollT * 2.2;
      camera.lookAt(0, scrollT * 0.4, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* =====================================================
     SCENE 2 — SCROLL-DRIVEN (chart bars + revolving rings)
     ===================================================== */
  function initScroll3D(){
    const mount = document.getElementById('scroll-3d');
    if(!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060a, 0.07);
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 1.6, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x202028, 0.55));
    const l1 = new THREE.PointLight(0xffd87a, 2.4, 22); l1.position.set(3, 5, 5); scene.add(l1);
    const l2 = new THREE.PointLight(0x4f86ff, 1.6, 22); l2.position.set(-4, -1, 3); scene.add(l2);

    // Reflective floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.MeshStandardMaterial({ color: 0x07090f, metalness: 0.85, roughness: 0.55 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // grid floor
    const grid = new THREE.GridHelper(14, 20, 0xd4af37, 0x1a1a22);
    grid.material.transparent = true; grid.material.opacity = 0.35;
    grid.position.y = 0.001;
    scene.add(grid);

    // chart bars
    const bars = [];
    const barMat = makeGold();
    const barBlue = makeBlueMetal();
    for(let i = 0; i < 9; i++){
      const h = 0.5;
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.32, h, 0.32), i % 3 === 1 ? barBlue : barMat);
      b.position.set(-3.2 + i * 0.8, h / 2, 0);
      b.userData = { base: h, peak: 0.6 + Math.random() * 2.6 };
      bars.push(b); scene.add(b);
    }

    // rings stack
    const ringGroup = new THREE.Group();
    for(let i = 0; i < 5; i++){
      const r = new THREE.Mesh(
        new THREE.TorusGeometry(1.5 + i * 0.32, 0.022, 16, 120),
        new THREE.MeshStandardMaterial({
          color: i === 2 ? 0x4f86ff : 0xd4af37,
          metalness: 1, roughness: 0.18,
          emissive: i === 2 ? 0x0a1530 : 0x2a1d05,
          emissiveIntensity: 0.55
        })
      );
      r.rotation.x = Math.PI / 2 - i * 0.12;
      r.rotation.z = i * 0.25;
      r.userData = { speed: 0.15 + i * 0.08 };
      ringGroup.add(r);
    }
    ringGroup.position.set(0, 2.0, -0.8);
    scene.add(ringGroup);

    // particle field
    const dust = buildParticles(280, 12);
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

    let progress = 0;
    function update(){
      const r = mount.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = vh + r.height;
      progress = Math.min(Math.max((vh - r.top) / total, 0), 1);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();

    const clock = new THREE.Clock();
    function tick(){
      const t = clock.getElapsedTime();
      update();

      bars.forEach((b, i)=>{
        const wave = Math.sin(i * 0.7 + progress * Math.PI * 1.4) * 0.5 + 0.5;
        const target = 0.5 + wave * b.userData.peak * (0.2 + progress * 0.9);
        const cur = b.scale.y;
        const next = cur + (target / b.userData.base - cur) * 0.1;
        b.scale.y = next;
        b.position.y = (b.userData.base * next) / 2;
      });

      ringGroup.rotation.y = progress * Math.PI * 2.5 + t * 0.12;
      ringGroup.rotation.x = -0.25 + progress * 0.5;
      ringGroup.children.forEach((r, i)=>{ r.rotation.z += 0.006 * (i + 1); });

      dust.rotation.y = t * 0.04;

      camera.position.x = Math.sin(progress * Math.PI) * 2.0;
      camera.position.y = 1.6 + progress * 1.3;
      camera.position.z = 7 - progress * 1.0;
      camera.lookAt(0, 1.4, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* =====================================================
     SCENE 3 — SERVICES ORB (3D background for services)
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x222228, 0.6));
    const l1 = new THREE.PointLight(0xffd87a, 2.2, 18); l1.position.set(4, 4, 6); scene.add(l1);
    const l2 = new THREE.PointLight(0x4f86ff, 1.4, 18); l2.position.set(-5, -2, 4); scene.add(l2);

    // Knotted wireframe sphere
    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.4, 0.04, 256, 12, 3, 5),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.18, emissive: 0x2a1d05, emissiveIntensity: 0.45 })
    );
    scene.add(knot);

    const icos = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.05, 1),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.6, roughness: 0.4, wireframe: true, transparent: true, opacity: 0.45 })
    );
    scene.add(icos);

    const dust = buildParticles(180, 10);
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
    let scrollT = 0;
    function onScroll(){
      const r = services.getBoundingClientRect();
      const vh = window.innerHeight;
      scrollT = Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function tick(){
      const t = clock.getElapsedTime();
      knot.rotation.x = t * 0.18 + scrollT * Math.PI;
      knot.rotation.y = t * 0.22;
      icos.rotation.x = -t * 0.15;
      icos.rotation.y = t * 0.12 + scrollT * Math.PI * 0.8;
      icos.scale.setScalar(1 + Math.sin(t * 0.8) * 0.04);
      dust.rotation.y = t * 0.05;
      camera.position.x = ptr.x * 0.6;
      camera.position.y = ptr.y * 0.4;
      camera.lookAt(0,0,0);
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* =====================================================
     CARD 3D TILT — richer with shine + parallax inner
     ===================================================== */
  function initTilt(){
    if(reduceMotion) return;
    const sel = '.card, .solution-card, .glass-card, .impact-card, .planner-card, .testimonial-card, .blog-card, .amc-card, .cta-card';
    document.querySelectorAll(sel).forEach(card => {
      card.style.transformStyle = 'preserve-3d';
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
            `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px) scale(1.02)`;
        });
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* =====================================================
     STAGGER REVEAL ANIMATIONS
     ===================================================== */
  function initStagger(){
    if(reduceMotion) return;
    const groups = [
      { container: '.grid', items: '.card' },
      { container: '.solutions-grid', items: '.solution-card' },
      { container: '.blog-grid', items: '.blog-card' },
      { container: '.impact-grid', items: '.impact-card' },
      { container: '.dashboard-grid', items: '.glass-card' },
      { container: '.planner-grid', items: '.planner-card' },
      { container: '.testimonial-grid', items: '.testimonial-card' },
      { container: '.amc-grid', items: '.amc-card' }
    ];
    if(!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if(e.isIntersecting){
          const items = e.target.querySelectorAll(e.target.dataset.staggerSel);
          items.forEach((el, i) => {
            el.style.transitionDelay = `${i * 80}ms`;
            el.classList.add('om-stagger-in');
          });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    groups.forEach(g => {
      document.querySelectorAll(g.container).forEach(c => {
        c.dataset.staggerSel = g.items;
        c.querySelectorAll(g.items).forEach(el => el.classList.add('om-stagger'));
        io.observe(c);
      });
    });
  }

  /* =====================================================
     PARALLAX hero text + sections
     ===================================================== */
  function initParallax(){
    if(reduceMotion) return;
    const heroContent = document.querySelector('.hero-content');
    const sections = document.querySelectorAll('.section-title, .scroll-showcase-copy, .contact-box, .cta-card');
    function onScroll(){
      const y = window.scrollY;
      if(heroContent){
        heroContent.style.transform = `translate3d(0, ${y * -0.14}px, 0)`;
        heroContent.style.opacity = String(Math.max(0, 1 - y / 750));
      }
      sections.forEach(el => {
        const r = el.getBoundingClientRect();
        const mid = (r.top + r.bottom) / 2 - window.innerHeight / 2;
        const offset = Math.max(-50, Math.min(50, -mid * 0.05));
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* =====================================================
     BOOT
     ===================================================== */
  function boot(){
    try { initLetterReveal(); } catch(e){ console.error(e); }
    try { initSmoothScroll(); } catch(e){ console.error(e); }
    try { initCursor(); } catch(e){ console.error(e); }
    try { initMagnetic(); } catch(e){ console.error(e); }
    try { initHero3D(); } catch(e){ console.error(e); }
    try { initScroll3D(); } catch(e){ console.error(e); }
    try { initServices3D(); } catch(e){ console.error(e); }
    try { initTilt(); } catch(e){ console.error(e); }
    try { initStagger(); } catch(e){ console.error(e); }
    try { initParallax(); } catch(e){ console.error(e); }
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
