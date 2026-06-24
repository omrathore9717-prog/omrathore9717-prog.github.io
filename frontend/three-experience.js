// =========================
// OM FINANCIAL — 3D EXPERIENCE (Three.js)
// Premium luxe gold + tech-blue
// Hero 3D scene + scroll-driven 3D scene + tilt cards + parallax
// =========================
(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(typeof THREE === 'undefined'){ console.warn('THREE not loaded'); return; }

  /* ============================================
     SHARED — pointer normalized
  ============================================ */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('mousemove', (e)=>{
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });

  /* ============================================
     SCENE 1 — HERO: floating gold coins / torus / cubes
  ============================================ */
  function initHero3D(){
    const mount = document.getElementById('hero-3d');
    if(!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x05060a, 6, 18);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights — luxe gold + cool fill
    const key = new THREE.PointLight(0xffd87a, 2.4, 22);
    key.position.set(4, 5, 6);
    scene.add(key);
    const fill = new THREE.PointLight(0x4f86ff, 1.4, 22);
    fill.position.set(-6, -3, 4);
    scene.add(fill);
    scene.add(new THREE.AmbientLight(0x1a1a22, 0.7));

    const gold = new THREE.MeshStandardMaterial({
      color: 0xd4af37, metalness: 1.0, roughness: 0.18, emissive: 0x2a1d05, emissiveIntensity: 0.55
    });
    const dark = new THREE.MeshStandardMaterial({
      color: 0x0e1320, metalness: 0.85, roughness: 0.35, emissive: 0x0a0c14, emissiveIntensity: 0.25
    });
    const wire = new THREE.MeshStandardMaterial({
      color: 0xd4af37, metalness: 0.6, roughness: 0.4, wireframe: true, transparent: true, opacity: 0.55
    });

    const group = new THREE.Group();
    scene.add(group);

    // Central torus (rupee-coin halo)
    const torus = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.22, 32, 128), gold);
    torus.rotation.x = Math.PI * 0.18;
    group.add(torus);

    // Coin disc
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.18, 64), gold);
    coin.rotation.z = Math.PI / 2;
    coin.position.set(0, 0, 0);
    group.add(coin);

    // Engraved "₹" via extruded text — fall back to plain disc if font fails
    const fontLoader = new THREE.FontLoader ? new THREE.FontLoader() : null;
    // Skip font — keep it simple and fast

    // Floating shards (cubes / icos)
    const shards = [];
    const shardGeos = [
      new THREE.IcosahedronGeometry(0.28, 0),
      new THREE.OctahedronGeometry(0.32, 0),
      new THREE.BoxGeometry(0.36, 0.36, 0.36),
      new THREE.TorusGeometry(0.28, 0.06, 16, 48),
    ];
    for(let i = 0; i < 14; i++){
      const geo = shardGeos[i % shardGeos.length];
      const mat = i % 3 === 0 ? gold : (i % 3 === 1 ? dark : wire);
      const m = new THREE.Mesh(geo, mat);
      const r = 3.2 + Math.random() * 1.8;
      const a = (i / 14) * Math.PI * 2;
      m.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 3.2, Math.sin(a) * r * 0.45 - 1.5);
      m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      m.userData = {
        spin: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.012, z: (Math.random() - 0.5) * 0.008 },
        bobSpeed: 0.4 + Math.random() * 0.8,
        bobAmp: 0.18 + Math.random() * 0.22,
        baseY: m.position.y
      };
      group.add(m);
      shards.push(m);
    }

    // Outer halo ring (faint)
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(2.6, 2.62, 128),
      new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
    );
    halo.rotation.x = Math.PI / 2;
    group.add(halo);

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
      const rect = mount.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = 1 - Math.min(Math.max((rect.top + rect.height) / (vh + rect.height), 0), 1);
      scrollT = p;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const clock = new THREE.Clock();
    function tick(){
      const t = clock.getElapsedTime();
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      group.rotation.y = t * 0.18 + pointer.x * 0.35 + scrollT * 1.2;
      group.rotation.x = pointer.y * 0.25 + Math.sin(t * 0.4) * 0.04;

      torus.rotation.x = Math.PI * 0.18 + t * 0.12;
      torus.rotation.y = t * 0.18;
      coin.rotation.y = t * 0.9;

      for(const s of shards){
        s.rotation.x += s.userData.spin.x;
        s.rotation.y += s.userData.spin.y;
        s.rotation.z += s.userData.spin.z;
        s.position.y = s.userData.baseY + Math.sin(t * s.userData.bobSpeed) * s.userData.bobAmp;
      }

      // camera dolly on scroll
      camera.position.z = 8 - scrollT * 1.8;
      camera.position.y = scrollT * 0.6;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ============================================
     SCENE 2 — Scroll-driven 3D scene that pins to "Portfolio Experience"
     Floating chart bars + revolving rings that progress with scroll
  ============================================ */
  function initScroll3D(){
    const mount = document.getElementById('scroll-3d');
    if(!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 1.2, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x222233, 0.6));
    const l1 = new THREE.PointLight(0xffd87a, 2.0, 20); l1.position.set(3, 4, 5); scene.add(l1);
    const l2 = new THREE.PointLight(0x4f86ff, 1.4, 20); l2.position.set(-4, -2, 3); scene.add(l2);

    const bars = [];
    const barMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.22, emissive: 0x1a1003, emissiveIntensity: 0.4 });
    for(let i = 0; i < 7; i++){
      const h = 0.4 + Math.random() * 1.6;
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.34, h, 0.34), barMat);
      b.position.set(-2.4 + i * 0.8, h / 2, 0);
      b.userData = { target: h, base: h };
      bars.push(b); scene.add(b);
    }
    // floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({ color: 0x07090f, metalness: 0.5, roughness: 0.9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);

    // revolving rings
    const ringGroup = new THREE.Group();
    for(let i = 0; i < 3; i++){
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.6 + i * 0.4, 0.025, 16, 96),
        new THREE.MeshStandardMaterial({ color: i === 1 ? 0x4f86ff : 0xd4af37, metalness: 0.9, roughness: 0.2, emissive: 0x0a0a14, emissiveIntensity: 0.4 })
      );
      ring.rotation.x = Math.PI / 2 - i * 0.2;
      ring.rotation.z = i * 0.3;
      ring.userData = { speed: 0.2 + i * 0.15, axis: i };
      ringGroup.add(ring);
    }
    ringGroup.position.set(0, 1.5, -1);
    scene.add(ringGroup);

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
      const rect = mount.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = vh + rect.height;
      progress = Math.min(Math.max((vh - rect.top) / total, 0), 1);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();

    const clock = new THREE.Clock();
    function tick(){
      const t = clock.getElapsedTime();
      update();

      // bars rise with scroll
      bars.forEach((b, i)=>{
        const target = 0.4 + (Math.sin(i * 1.3 + progress * Math.PI * 1.5) * 0.5 + 0.5) * 2.1 * (0.2 + progress * 0.9);
        const cur = b.scale.y;
        const next = cur + (target / b.userData.base - cur) * 0.08;
        b.scale.y = next;
        b.position.y = (b.userData.base * next) / 2;
      });

      ringGroup.rotation.y = progress * Math.PI * 2 + t * 0.1;
      ringGroup.rotation.x = -0.3 + progress * 0.6;
      ringGroup.children.forEach((r, i)=>{ r.rotation.z += 0.005 * (i + 1); });

      camera.position.x = Math.sin(progress * Math.PI) * 1.6;
      camera.position.y = 1.2 + progress * 1.2;
      camera.lookAt(0, 1, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ============================================
     TILT CARDS — 3D hover transform
  ============================================ */
  function initTiltCards(){
    if(reduceMotion) return;
    const selectors = '.card, .solution-card, .glass-card, .impact-card, .planner-card, .testimonial-card, .blog-card, .amc-card';
    document.querySelectorAll(selectors).forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';
      let raf = 0;
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        if(raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(8px)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============================================
     PARALLAX scroll for hero text + sections
  ============================================ */
  function initParallax(){
    if(reduceMotion) return;
    const heroContent = document.querySelector('.hero-content');
    const sections = document.querySelectorAll('.section-title, .scroll-showcase-copy, .contact-box, .cta-card');
    function onScroll(){
      const y = window.scrollY;
      if(heroContent){
        heroContent.style.transform = `translate3d(0, ${y * -0.12}px, 0)`;
        heroContent.style.opacity = String(Math.max(0, 1 - y / 700));
      }
      sections.forEach(el => {
        const r = el.getBoundingClientRect();
        const mid = (r.top + r.bottom) / 2 - window.innerHeight / 2;
        const offset = Math.max(-60, Math.min(60, -mid * 0.06));
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================
     INIT
  ============================================ */
  function boot(){
    try { initHero3D(); } catch(e){ console.error(e); }
    try { initScroll3D(); } catch(e){ console.error(e); }
    try { initTiltCards(); } catch(e){ console.error(e); }
    try { initParallax(); } catch(e){ console.error(e); }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
