/* ==========================================================================
   forest-backdrop.js — the live forest behind the philosophy section on
   clarissachia.com.

   Same scene as where-intelligence-lives.html: same tree geometry, same
   mycelium network, same fireflies, same night palette. What it does NOT have:
   the HUD, the slider, the narration, the intro, the HQ, the stats — no words
   at all. It is a backdrop, and it drifts.

   Design rules:
     - Opaque. The forest is the background, not a layer over the page.
     - It never competes with the text. The camera sits high and far; the
       trees read as a dark canopy with a gold network glowing under it.
     - prefers-reduced-motion: render one static frame, no drift, no loop.
     - It pauses when the section is off-screen, and when the tab is hidden.
   ========================================================================== */
(() => {
  const F = window.FOREST;
  if (!F) { console.warn("forest-backdrop: FOREST constants missing"); return; }
  if (!window.THREE) { console.warn("forest-backdrop: THREE missing"); return; }

  const canvas = document.getElementById("forest-backdrop");
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const P = F.PAL, S = F.SCENE, MARK = F.MARK;

  /* ---------------- Renderer ---------------- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(P.bg);
  scene.fog = new THREE.FogExp2(P.bg, 0.022);

  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 300);

  const hemi = new THREE.HemisphereLight(0x9cc3b0, 0x0b1411, 0.6);
  scene.add(hemi);
  const moon = new THREE.DirectionalLight(0xc6d6ff, 0.75);
  moon.position.set(-12, 22, 8);
  scene.add(moon);

  /* ---------------- Glow sprite texture ---------------- */
  function makeGlowTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.22, "rgba(255,255,255,0.85)");
    gr.addColorStop(0.5, "rgba(255,255,255,0.25)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const GLOW = makeGlowTexture();
  const glowMat = (color, opacity = 1) => new THREE.SpriteMaterial({
    map: GLOW, color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false
  });

  /* ---------------- Ground + stars ---------------- */
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(S.radius + 9, 72),
    new THREE.MeshStandardMaterial({ color: P.ground, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  (function stars() {
    const n = 500, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const th = Math.random() * Math.PI * 2, ph = Math.random() * Math.PI * 0.42;
      const r = 120;
      p[i * 3] = Math.cos(th) * Math.sin(ph) * r;
      p[i * 3 + 1] = Math.cos(ph) * r * 0.9 + 6;
      p[i * 3 + 2] = Math.sin(th) * Math.sin(ph) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({
      color: P.star, size: 1.4, sizeAttenuation: false, fog: false,
      transparent: true, opacity: 0.7
    })));
  })();

  /* ---------------- Trees — the mark, in 3D ---------------- */
  const trunkGeo = new THREE.CylinderGeometry(1, 1 / 3, 1, 6);
  const coneGeo = new THREE.ConeGeometry(1, 1, 7);
  const trunkMat = new THREE.MeshStandardMaterial({ color: P.trunk, roughness: 1 });

  const trees = [];

  function makeTree(x, z, idx) {
    const h = 2.1 + Math.random() * 1.7;
    const s = (h * 1.05) / MARK.crownY;
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = Math.random() * Math.PI * 2;

    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    const tH = (MARK.trunk.y1 - MARK.trunk.y0) * s;
    const tR = MARK.trunk.rTop * s;
    trunk.scale.set(tR, tH, tR);
    trunk.position.y = (MARK.trunk.y0 + MARK.trunk.y1) / 2 * s;
    group.add(trunk);

    const base = new THREE.Color().setHSL(
      P.leafH + Math.random() * P.leafHVar, P.leafS,
      P.leafL + Math.random() * P.leafLVar
    );
    const mat = new THREE.MeshStandardMaterial({
      color: base.clone(), roughness: 0.85, flatShading: true
    });
    const foliage = [];
    for (const c of MARK.cones) {
      const r = c.r * s;
      const ch = (c.y1 - c.y0) * s;
      const m = new THREE.Mesh(coneGeo, mat);
      m.scale.set(r, ch, r);
      m.position.y = (c.y0 + c.y1) / 2 * s;
      group.add(m);
      foliage.push(m);
    }
    const top = MARK.crownY * s;
    const sparkOff = (MARK.sparkY - MARK.crownY) * s;

    const spark = new THREE.Sprite(glowMat(P.cyan, 0.95));
    spark.position.y = MARK.sparkY * s;
    spark.scale.set(0.001, 0.001, 1);
    group.add(spark);

    scene.add(group);
    const t = {
      idx, x, z, h, top, sparkOff, group, trunk, mat, base, foliage, spark,
      smart: Math.random() < 0.55, sparkS: 0
    };
    return t;
  }

  (function placeTrees() {
    let tries = 0;
    while (trees.length < S.treeCount && tries < 8000) {
      tries++;
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * S.radius;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (Math.hypot(x, z) < S.centerClear) continue;
      if (trees.some(t => Math.hypot(t.x - x, t.z - z) < S.minGap)) continue;
      trees.push(makeTree(x, z, trees.length));
    }
  })();

  /* ---------------- Mycelium network ---------------- */
  const N = trees.length;
  const adj = trees.map(() => new Set());
  const edgePts = new Map();
  const dist2 = (a, b) => Math.hypot(trees[a].x - trees[b].x, trees[a].z - trees[b].z);

  function addEdge(a, b) {
    if (a === b || adj[a].has(b)) return;
    adj[a].add(b); adj[b].add(a);
    const A = trees[a], B = trees[b];
    const mx = (A.x + B.x) / 2, mz = (A.z + B.z) / 2;
    const dx = B.x - A.x, dz = B.z - A.z, L = Math.hypot(dx, dz);
    const off = (Math.random() - 0.5) * 0.35 * L;
    const cx = mx - dz / L * off, cz = mz + dx / L * off;
    const pts = [];
    const S2 = 16;
    for (let i = 0; i <= S2; i++) {
      const u = i / S2, iu = 1 - u;
      pts.push(new THREE.Vector3(
        iu * iu * A.x + 2 * iu * u * cx + u * u * B.x,
        0.05,
        iu * iu * A.z + 2 * iu * u * cz + u * u * B.z
      ));
    }
    edgePts.set(a + "-" + b, pts);
  }
  for (let i = 0; i < N; i++) {
    const near = trees.map((_, j) => j).filter(j => j !== i)
      .sort((p, q) => dist2(i, p) - dist2(i, q));
    for (let k = 0; k < S.edgeDegree; k++) if (dist2(i, near[k]) < S.edgeReach) addEdge(i, near[k]);
  }
  (function ensureConnected() {
    const inTree = new Set([0]);
    while (inTree.size < N) {
      let best = null, bd = Infinity;
      inTree.forEach(a => {
        for (let b = 0; b < N; b++) if (!inTree.has(b)) {
          const d = dist2(a, b); if (d < bd) { bd = d; best = [a, b]; }
        }
      });
      addEdge(best[0], best[1]);
      const stack = [best[1]];
      while (stack.length) {
        const v = stack.pop();
        if (inTree.has(v)) continue;
        inTree.add(v);
        adj[v].forEach(w => { if (!inTree.has(w)) stack.push(w); });
      }
    }
  })();

  (function drawNetwork() {
    const pos = [];
    edgePts.forEach(pts => {
      for (let i = 0; i < pts.length - 1; i++)
        pos.push(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    scene.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({
      color: P.gold, transparent: true, opacity: 0.32,
      blending: THREE.AdditiveBlending, depthWrite: false
    })));

    // root filaments
    const rp = [];
    trees.forEach(t => {
      for (let k = 0; k < 8; k++) {
        let a = Math.random() * Math.PI * 2, x = t.x, z = t.z;
        const len = 0.7 + Math.random() * 1.1, steps = 5;
        for (let s = 0; s < steps; s++) {
          a += (Math.random() - 0.5) * 0.9;
          const nx = x + Math.cos(a) * len / steps, nz = z + Math.sin(a) * len / steps;
          rp.push(x, 0.045, z, nx, 0.045, nz);
          x = nx; z = nz;
        }
      }
    });
    const rg = new THREE.BufferGeometry();
    rg.setAttribute("position", new THREE.Float32BufferAttribute(rp, 3));
    scene.add(new THREE.LineSegments(rg, new THREE.LineBasicMaterial({
      color: P.gold, transparent: true, opacity: 0.16,
      blending: THREE.AdditiveBlending, depthWrite: false
    })));
  })();

  /* ---------------- Fireflies ---------------- */
  const FF = S.fireflies;
  const ffPos = new Float32Array(FF * 3), ffSeed = [];
  for (let i = 0; i < FF; i++) {
    const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * (S.radius + 2);
    ffSeed.push({
      x: Math.cos(a) * r, z: Math.sin(a) * r,
      y: 0.6 + Math.random() * 3.5, s: Math.random() * 10
    });
  }
  const ffGeo = new THREE.BufferGeometry();
  ffGeo.setAttribute("position", new THREE.BufferAttribute(ffPos, 3));
  scene.add(new THREE.Points(ffGeo, new THREE.PointsMaterial({
    color: P.firefly, size: 0.13, transparent: true, opacity: 0.75,
    blending: THREE.AdditiveBlending, depthWrite: false
  })));

  /* ---------------- Sizing ---------------- */
  const wrap = canvas.parentElement;
  let viewW = 1, viewH = 1, baseDist = 30;

  function resize() {
    const r = wrap.getBoundingClientRect();
    viewW = Math.max(1, Math.round(r.width));
    viewH = Math.max(1, Math.round(r.height));
    renderer.setSize(viewW, viewH, false);
    const aspect = viewW / viewH;
    camera.aspect = aspect;
    camera.fov = aspect < 0.9 ? 58 : 46;
    const tv = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    // Sit further back than the experiment so the canopy reads as a field,
    // not as individual trees. On a narrow (portrait) frame, pull in instead —
    // a wide shot in a tall frame leaves the forest as a thin distant band.
    const reach = aspect < 0.9 ? 12.5 : 17.5;
    baseDist = Math.max(reach / (tv * Math.min(aspect, 1.6)), reach / tv) * 0.95;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(wrap);
  resize();

  /* ---------------- Drift ---------------- */
  let camAngle = 0.7, camElev = 0.36;
  const clock = new THREE.Clock();
  let visible = true, tabVisible = true, raf = null;

  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    if (!reduceMotion) {
      camAngle += dt * 0.045;
      const d = baseDist;
      camera.position.set(
        Math.sin(camAngle) * Math.cos(camElev) * d,
        Math.sin(camElev) * d + 1,
        Math.cos(camAngle) * Math.cos(camElev) * d
      );
      camera.lookAt(0, 2.4, 0);

      // trees
      trees.forEach(tr => {
        const target = tr.smart ? 0.6 : 0;
        tr.sparkS += (target - tr.sparkS) * Math.min(1, dt * 6);
        const ss = tr.sparkS * (1 + 0.12 * Math.sin(t * 3 + tr.idx * 1.7));
        tr.spark.scale.set(ss + 0.001, ss + 0.001, 1);
        tr.spark.position.y = tr.top + tr.sparkOff + Math.sin(t * 1.6 + tr.idx) * 0.08;
      });

      // fireflies
      for (let i = 0; i < FF; i++) {
        const f = ffSeed[i];
        ffPos[i * 3] = f.x + Math.sin(t * 0.3 + f.s) * 0.6;
        ffPos[i * 3 + 1] = f.y + Math.sin(t * 0.7 + f.s * 2) * 0.3;
        ffPos[i * 3 + 2] = f.z + Math.cos(t * 0.25 + f.s) * 0.6;
      }
      ffGeo.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  function start() {
    if (raf === null) { clock.getDelta(); frame(); }
  }
  function stop() {
    if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }

  // Pause when scrolled away or the tab is hidden — no point burning a GPU
  // on a backdrop nobody is looking at.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible && tabVisible) start(); else stop();
    }, { threshold: 0.01 }).observe(wrap);
  }
  document.addEventListener("visibilitychange", () => {
    tabVisible = !document.hidden;
    if (visible && tabVisible) start(); else stop();
  });

  // Render one frame immediately so the backdrop is never blank on first paint.
  renderer.render(scene, camera);
  if (!reduceMotion) start();
  else {
    // Static frame for reduced motion: place the camera once, then render.
    const d = baseDist;
    camera.position.set(
      Math.sin(camAngle) * Math.cos(camElev) * d,
      Math.sin(camElev) * d + 1,
      Math.cos(camAngle) * Math.cos(camElev) * d
    );
    camera.lookAt(0, 2.4, 0);
    renderer.render(scene, camera);
  }
})();
