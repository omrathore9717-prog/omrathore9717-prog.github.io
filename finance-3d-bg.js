// =========================================================
// OM FINANCIAL — TRUE 3D FINANCE BACKGROUND
// Full-viewport WebGL: candlestick chart cityscape +
// floating currency symbols + depth grid
// Runs behind everything, paused when tab hidden.
// =========================================================
(function(){
  if(typeof THREE === 'undefined'){ console.warn('THREE missing for finance bg'); return; }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.4);

  // Mount the canvas
  const mount = document.createElement('div');
  mount.id = 'om-finance-3d-bg';
  mount.setAttribute('aria-hidden', 'true');
  Object.assign(mount.style, {
    position: 'fixed', inset: '0', zIndex: '-1',
    pointerEvents: 'none', overflow: 'hidden'
  });
  document.body.insertBefore(mount, document.body.firstChild);

  const ACCENT = 0x6fc7d4;
  const POSITIVE = 0x4dcfa7;
  const NEGATIVE = 0xe57391;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x06090f, 18, 48);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 2.5, 12);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0x2a3548, 0.85));
  const l1 = new THREE.PointLight(ACCENT, 2.8, 30); l1.position.set(8, 10, 6); scene.add(l1);
  const l2 = new THREE.PointLight(0xffffff, 0.9, 25); l2.position.set(-8, 6, 8); scene.add(l2);

  // --- DEPTH GRID FLOOR ---
  const grid = new THREE.GridHelper(80, 40, ACCENT, 0x1b2438);
  grid.material.transparent = true; grid.material.opacity = 0.32;
  grid.position.y = -2.5;
  scene.add(grid);

  // --- CANDLESTICK CHART (rows of 3D candles) ---
  // Build a wide chart with multiple rows fading into distance.
  const candleGroup = new THREE.Group();
  scene.add(candleGroup);

  const candleRows = 5;
  const candlesPerRow = 32;
  const rowSpacing = 3.5;
  const candleSpacing = 0.7;

  const candles = [];
  const wickMat = new THREE.MeshBasicMaterial({ color: 0x4a5468, transparent: true, opacity: 0.55 });
  const greenMat = new THREE.MeshStandardMaterial({
    color: POSITIVE, metalness: 0.5, roughness: 0.28,
    emissive: POSITIVE, emissiveIntensity: 0.6, transparent: true, opacity: 1.0
  });
  const redMat = new THREE.MeshStandardMaterial({
    color: NEGATIVE, metalness: 0.5, roughness: 0.28,
    emissive: NEGATIVE, emissiveIntensity: 0.55, transparent: true, opacity: 1.0
  });

  // Use OHLC-like pseudo-random seed for nice realistic-feeling chart
  function seedRand(seed){ let s = seed; return ()=>{ s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  const rnd = seedRand(2026);

  for(let row = 0; row < candleRows; row++){
    let prevClose = 1.8 + rnd() * 1.0;
    for(let i = 0; i < candlesPerRow; i++){
      const open = prevClose;
      const trend = (rnd() - 0.45) * 0.9;
      const close = Math.max(0.6, Math.min(5.0, open + trend));
      const high = Math.max(open, close) + rnd() * 0.3;
      const low = Math.min(open, close) - rnd() * 0.3;
      const isUp = close >= open;

      const bodyHeight = Math.max(0.1, Math.abs(close - open) + 0.2);
      const bodyY = (open + close) / 2;

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.30, bodyHeight, 0.30),
        isUp ? greenMat : redMat
      );
      body.position.set(
        -((candlesPerRow - 1) * candleSpacing) / 2 + i * candleSpacing,
        bodyY,
        -3 - row * rowSpacing
      );
      candleGroup.add(body);

      const wickHeight = Math.max(0.05, high - low);
      const wick = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, wickHeight, 0.04),
        wickMat
      );
      wick.position.set(body.position.x, (high + low) / 2, body.position.z);
      candleGroup.add(wick);

      candles.push({
        body, wick,
        baseY: bodyY,
        baseHeight: bodyHeight,
        wickBaseY: (high + low) / 2,
        wickHeight,
        phase: (row * candlesPerRow + i) * 0.16
      });
      prevClose = close;
    }
  }

  // --- FLOATING 3D CURRENCY SYMBOLS ---
  // Create simple 3D ₹ / $ / % glyphs using ExtrudeGeometry on canvas-drawn paths
  // Use a sprite-canvas approach for performance.
  function makeGlyphSprite(text, color){
    const c = document.createElement('canvas');
    const size = 256; c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    ctx.clearRect(0,0,size,size);
    ctx.fillStyle = color;
    ctx.font = '600 200px "Fraunces", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = color;
    ctx.shadowBlur = 30;
    ctx.fillText(text, size/2, size/2 + 4);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  }

  const glyphTextures = {
    rupee:    makeGlyphSprite('\u20B9', 'rgba(111,199,212,0.85)'),
    dollar:   makeGlyphSprite('$',      'rgba(111,199,212,0.6)'),
    percent:  makeGlyphSprite('%',      'rgba(140,210,220,0.7)'),
    plus:     makeGlyphSprite('+',      'rgba(77,207,167,0.8)'),
    arrow:    makeGlyphSprite('\u2197', 'rgba(111,199,212,0.7)')
  };

  const glyphs = [];
  const glyphPool = ['rupee', 'rupee', 'dollar', 'percent', 'plus', 'arrow', 'rupee'];
  for(let i = 0; i < 14; i++){
    const key = glyphPool[i % glyphPool.length];
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glyphTextures[key],
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    const scale = 0.7 + Math.random() * 0.7;
    sprite.scale.set(scale, scale, 1);
    sprite.position.set(
      (Math.random() - 0.5) * 28,
      1 + Math.random() * 6,
      -8 - Math.random() * 12
    );
    sprite.userData = {
      drift: 0.1 + Math.random() * 0.15,
      bobSpeed: 0.3 + Math.random() * 0.4,
      bobAmp: 0.25 + Math.random() * 0.35,
      baseY: sprite.position.y,
      baseX: sprite.position.x,
      driftAmp: 0.4 + Math.random() * 0.6,
      driftSpeed: 0.05 + Math.random() * 0.08
    };
    scene.add(sprite);
    glyphs.push(sprite);
  }

  // --- DISTANT VERTICAL LINES (like data streams) ---
  const streamGroup = new THREE.Group();
  for(let i = 0; i < 18; i++){
    const geo = new THREE.BufferGeometry();
    const x = -22 + i * 2.6;
    const y1 = -2.4, y2 = -2.4 + 1.5 + Math.random() * 3.5;
    const positions = new Float32Array([x, y1, -16, x, y2, -16]);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.LineBasicMaterial({
      color: ACCENT, transparent: true, opacity: 0.18
    });
    const line = new THREE.Line(geo, mat);
    line.userData = { phase: i * 0.4 };
    streamGroup.add(line);
  }
  scene.add(streamGroup);

  // --- PARTICLE DUST (sparse, just for depth) ---
  const dustGeo = new THREE.BufferGeometry();
  const dustCount = 120;
  const dustPos = new Float32Array(dustCount * 3);
  for(let i = 0; i < dustCount; i++){
    dustPos[i*3+0] = (Math.random() - 0.5) * 36;
    dustPos[i*3+1] = (Math.random() - 0.5) * 14 + 2;
    dustPos[i*3+2] = -2 - Math.random() * 18;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: ACCENT, size: 0.04, transparent: true, opacity: 0.5,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  scene.add(dust);

  // --- RESIZE ---
  function resize(){
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // --- VISIBILITY: pause when tab hidden ---
  let tabVisible = !document.hidden;
  document.addEventListener('visibilitychange', ()=>{ tabVisible = !document.hidden; });

  // --- SCROLL TRACKER (for camera glide) ---
  let scrollY = 0, scrollMax = 1;
  function trackScroll(){
    scrollY = window.scrollY;
    scrollMax = Math.max(1, document.body.scrollHeight - window.innerHeight);
  }
  window.addEventListener('scroll', trackScroll, { passive: true });
  trackScroll();

  // --- ANIMATION LOOP ---
  const clock = new THREE.Clock();
  // Throttle to ~45fps to save CPU
  let lastTick = 0;
  const targetFrameMs = 1000 / 45;

  function tick(now){
    requestAnimationFrame(tick);
    if(!tabVisible) return;
    if(now - lastTick < targetFrameMs) return;
    lastTick = now;

    const t = clock.getElapsedTime();
    const scrollT = scrollY / scrollMax; // 0..1

    // candles breathe gently — height pulses, simulating live chart
    for(let i = 0; i < candles.length; i++){
      const c = candles[i];
      const pulse = 1 + Math.sin(t * 0.5 + c.phase) * 0.08;
      c.body.scale.y = pulse;
      c.body.position.y = c.baseY * pulse;
    }

    // candle group slow horizontal scroll (like ticker tape)
    candleGroup.position.x = -((t * 0.35) % candleSpacing);

    // glyphs drift up and sideways
    for(let i = 0; i < glyphs.length; i++){
      const g = glyphs[i];
      g.position.y = g.userData.baseY + Math.sin(t * g.userData.bobSpeed + i) * g.userData.bobAmp;
      g.position.x = g.userData.baseX + Math.cos(t * g.userData.driftSpeed + i) * g.userData.driftAmp;
      // wrap when fully drifted off top
      g.position.y += g.userData.drift * 0.005;
      if(g.position.y > 8){ g.position.y = -1; g.userData.baseY = -1; }
    }

    // streams flicker
    streamGroup.children.forEach((line, i)=>{
      line.material.opacity = 0.10 + Math.sin(t * 1.4 + line.userData.phase) * 0.10;
    });

    // dust slow rotation
    dust.rotation.y = t * 0.01;

    // Camera: low angle that keeps the chart wall visible across the page.
    // Pan with scroll for a cinematic dolly effect.
    camera.position.x = Math.sin(t * 0.06) * 1.4;
    camera.position.y = 2.2 + Math.sin(t * 0.04) * 0.4 - scrollT * 1.5;
    camera.position.z = 12 - scrollT * 2.5;
    camera.lookAt(0, 1.6, -8);

    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
})();
