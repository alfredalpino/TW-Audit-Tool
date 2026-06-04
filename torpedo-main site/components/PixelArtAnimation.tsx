import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const MERIDIANS = 24;
const PARALLELS = 16;

function latLonToVector3(radius: number, lat: number, lon: number) {
  const phi = THREE.MathUtils.degToRad(lat);
  const theta = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.cos(theta)
  );
}

const PixelArtAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isMobileViewport = window.innerWidth < 1024;
    const isMobileLike = isCoarsePointer || isMobileViewport;
    const heroSection = canvas.closest('section');
    let heroInView = true;
    let pageVisible = true;
    const snakeLineOpacity = isMobileLike ? 0.38 : 0.9;
    const snakeBodyOpacity = isMobileLike ? 0.2 : 0.44;
    const baseSparkIntensity = isMobileLike ? 0.44 : 0.68;
    const accentGlowTarget = isMobileLike ? 0.56 : 0.72;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
    camera.position.set(0, 0, 420);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const computedStyles = getComputedStyle(document.documentElement);
    const orangeHex = computedStyles.getPropertyValue('--torpedo-orange').trim() || '#FF5500';
    const orangeRgb = computedStyles.getPropertyValue('--torpedo-orange-rgb').trim() || '255 85 0';
    const [orangeR = 255, orangeG = 85, orangeB = 0] = orangeRgb
      .split(/\s+/)
      .map((part) => Number.parseInt(part, 10));
    const orangeColor = new THREE.Color(orangeHex);
    const orangeColorVec = new THREE.Vector3(orangeR / 255, orangeG / 255, orangeB / 255);

    // Split transform responsibilities:
    // - globeRoot: responsive placement/scale in layout
    // - globeVisual: animation/parallax so resize doesn't fight motion timelines
    const globeRoot = new THREE.Group();
    const globeVisual = new THREE.Group();
    globeVisual.rotation.x = THREE.MathUtils.degToRad(15);
    globeRoot.add(globeVisual);
    scene.add(globeRoot);

    const radius = 150;

    // Grid lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xc9ced6,
      transparent: true,
      opacity: 0.76,
      blending: THREE.NormalBlending,
    });

    for (let i = 0; i < MERIDIANS; i += 1) {
      const lon = (360 / MERIDIANS) * i;
      const points: THREE.Vector3[] = [];
      for (let s = 0; s <= 48; s += 1) {
        const lat = -90 + (180 * s) / 48;
        points.push(latLonToVector3(radius, lat, lon));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      globeVisual.add(new THREE.Line(geometry, lineMaterial));
    }

    for (let i = 1; i < PARALLELS; i += 1) {
      const lat = -90 + (180 / PARALLELS) * i;
      const points: THREE.Vector3[] = [];
      for (let s = 0; s <= 64; s += 1) {
        const lon = (360 * s) / 64;
        points.push(latLonToVector3(radius, lat, lon));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      globeVisual.add(new THREE.Line(geometry, lineMaterial));
    }

    // Base pixel points
    const basePositions: number[] = [];
    const accentPositions: number[] = [];
    for (let u = 0; u < MERIDIANS; u += 1) {
      for (let v = 1; v < PARALLELS; v += 1) {
        const lon = (360 / MERIDIANS) * u;
        const lat = -90 + (180 / PARALLELS) * v;
        const p = latLonToVector3(radius, lat, lon);
        basePositions.push(p.x, p.y, p.z);
        if ((u + v) % 7 === 0) accentPositions.push(p.x, p.y, p.z);
      }
    }

    const baseGeometry = new THREE.BufferGeometry();
    baseGeometry.setAttribute('position', new THREE.Float32BufferAttribute(basePositions, 3));

    const baseMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.3 },
      },
      vertexShader: `
        uniform float uTime;
        varying float vDepth;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = 2.8;
          vDepth = smoothstep(-220.0, 140.0, mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying float vDepth;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float alpha = smoothstep(0.45, 0.0, length(uv)) * uOpacity * (0.55 + vDepth * 0.45);
          gl_FragColor = vec4(0.82, 0.84, 0.88, alpha);
        }
      `,
    });

    const basePoints = new THREE.Points(baseGeometry, baseMaterial);
    globeVisual.add(basePoints);

    // Accent points
    const accentGeometry = new THREE.BufferGeometry();
    accentGeometry.setAttribute('position', new THREE.Float32BufferAttribute(accentPositions, 3));

    const accentMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uGlow: { value: accentGlowTarget },
        uColor: { value: orangeColorVec },
      },
      vertexShader: `
        uniform float uTime;
        varying float vPulse;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          float pulse = 0.8 + 0.2 * sin(uTime * 2.0 + position.x * 0.06 + position.y * 0.03);
          gl_PointSize = 4.4 * pulse;
          vPulse = pulse;
        }
      `,
      fragmentShader: `
        uniform float uGlow;
        uniform vec3 uColor;
        varying float vPulse;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float core = smoothstep(0.35, 0.0, length(uv));
          float alpha = core * uGlow * vPulse;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });

    const accentPoints = new THREE.Points(accentGeometry, accentMaterial);
    globeVisual.add(accentPoints);

    // Extra orange spark particles for a stronger electrified look
    const sparkPositions: number[] = [];
    for (let i = 0; i < 140; i += 1) {
      const lon = Math.random() * 360;
      const lat = -72 + Math.random() * 144;
      const p = latLonToVector3(radius * 1.01, lat, lon);
      sparkPositions.push(p.x, p.y, p.z);
    }
    const sparkGeometry = new THREE.BufferGeometry();
    sparkGeometry.setAttribute('position', new THREE.Float32BufferAttribute(sparkPositions, 3));

    const sparkMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: baseSparkIntensity },
        uColor: { value: orangeColorVec },
      },
      vertexShader: `
        uniform float uTime;
        varying float vPulse;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          float pulse = 0.75 + 0.25 * sin(uTime * 3.2 + position.y * 0.05 + position.x * 0.03);
          gl_PointSize = 2.6 + pulse * 2.0;
          vPulse = pulse;
        }
      `,
      fragmentShader: `
        uniform float uIntensity;
        uniform vec3 uColor;
        varying float vPulse;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d = length(uv);
          float alpha = smoothstep(0.5, 0.0, d) * uIntensity * vPulse;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });
    const sparkPoints = new THREE.Points(sparkGeometry, sparkMaterial);
    globeVisual.add(sparkPoints);

    // Snake trails that move only on globe grid lines
    type GridPoint = { u: number; v: number };
    type ActiveSegment = {
      index: number;
      from: GridPoint;
      to: GridPoint;
      dir: GridPoint;
      midU: number;
      midV: number;
    };
    type SnakeTrail = {
      trail: GridPoint[];
      current: GridPoint;
      next: GridPoint;
      progress: number;
      speed: number;
      line: THREE.Line;
      body: THREE.Points;
      dir: GridPoint;
      chaos: number;
    };

    const uvToVec3 = (u: number, v: number) => {
      const lon = (360 / MERIDIANS) * ((u + MERIDIANS) % MERIDIANS);
      const lat = -90 + (180 / PARALLELS) * THREE.MathUtils.clamp(v, 1, PARALLELS - 1);
      return latLonToVector3(radius * 1.012, lat, lon);
    };

    const snakes: SnakeTrail[] = [];
    const SNAKE_COUNT = isMobileLike ? 24 : 55;
    const SNAKE_MAX_LENGTH = Math.ceil(12 * 1.05);

    const stepDirection = (from: GridPoint, to: GridPoint) => {
      const duRaw = (to.u - from.u + MERIDIANS) % MERIDIANS;
      const du = duRaw === 0 ? 0 : duRaw === 1 ? 1 : -1;
      const dv = to.v === from.v ? 0 : to.v > from.v ? 1 : -1;
      return { u: du, v: dv };
    };

    const circularDistanceU = (a: number, b: number) => {
      const d = Math.abs(a - b);
      return Math.min(d, MERIDIANS - d);
    };

    const edgeKey = (a: GridPoint, b: GridPoint) => {
      const aKey = `${a.u},${a.v}`;
      const bKey = `${b.u},${b.v}`;
      return aKey < bKey ? `${aKey}|${bKey}` : `${bKey}|${aKey}`;
    };

    const buildActiveSegments = (): ActiveSegment[] =>
      snakes.map((snake, index) => {
        const from = snake.current;
        const to = snake.next;
        const dir = stepDirection(from, to);
        let toU = to.u;
        let fromU = from.u;
        if (Math.abs(toU - fromU) > 1) {
          if (toU < fromU) toU += MERIDIANS;
          else fromU += MERIDIANS;
        }
        const midU = ((fromU + toU) * 0.5 + MERIDIANS) % MERIDIANS;
        const midV = (from.v + to.v) * 0.5;
        return { index, from, to, dir, midU, midV };
      });

    const pickNextPoint = (
      current: GridPoint,
      dir: GridPoint,
      snakeIndex: number,
      t: number,
      activeSegments: ActiveSegment[]
    ) => {
      const candidates: GridPoint[] = [
        { u: (current.u + 1) % MERIDIANS, v: current.v },
        { u: (current.u - 1 + MERIDIANS) % MERIDIANS, v: current.v },
        { u: current.u, v: current.v + 1 },
        { u: current.u, v: current.v - 1 },
      ];

      const valid = candidates.filter((candidate) => {
        if (candidate.v < 1 || candidate.v > PARALLELS - 1) return false;
        const d = stepDirection(current, candidate);
        // Never hard reverse direction unless there is no alternative.
        if (d.u === -dir.u && d.v === -dir.v) return false;
        return true;
      });

      if (valid.length === 0) return candidates[0];

      const edgeUsage = new Set<string>();
      activeSegments.forEach((seg) => {
        if (seg.index !== snakeIndex) edgeUsage.add(edgeKey(seg.from, seg.to));
      });

      let best = valid[0];
      let bestScore = Number.NEGATIVE_INFINITY;
      for (const candidate of valid) {
        const step = stepDirection(current, candidate);
        const candidateEdge = edgeKey(current, candidate);
        // Hard avoid exact overlap on same edge.
        if (edgeUsage.has(candidateEdge)) continue;

        let score = 0;
        // Keep smooth directional continuity.
        if (step.u === dir.u && step.v === dir.v) score += 2.2;
        // Mild penalty for turns to avoid jitter.
        if (step.u !== dir.u || step.v !== dir.v) score -= 0.45;

        // Penalize near-parallel adjacency and close path crowding.
        const candidateMidU = (current.u + candidate.u) * 0.5;
        const candidateMidV = (current.v + candidate.v) * 0.5;
        for (const seg of activeSegments) {
          if (seg.index === snakeIndex) continue;
          const parallel = step.u === seg.dir.u && step.v === seg.dir.v;
          const antiParallel = step.u === -seg.dir.u && step.v === -seg.dir.v;
          const du = circularDistanceU(candidateMidU, seg.midU);
          const dv = Math.abs(candidateMidV - seg.midV);

          if ((parallel || antiParallel) && du <= 1.15 && dv <= 1.15) score -= 4.0;
          if (du <= 0.55 && dv <= 0.55) score -= 2.8;
        }

        // Snake-specific pseudo-random energy term to avoid copy behavior.
        const chaos = Math.sin(
          (candidate.u * 12.9898 + candidate.v * 78.233 + snakeIndex * 37.719 + t * 0.8) * 0.37
        );
        score += chaos * 0.42;

        if (score > bestScore) {
          bestScore = score;
          best = candidate;
        }
      }

      return best;
    };

    for (let i = 0; i < SNAKE_COUNT; i += 1) {
      const start: GridPoint = {
        u: Math.floor(Math.random() * MERIDIANS),
        v: 2 + Math.floor(Math.random() * (PARALLELS - 3)),
      };
      const initialCandidates: GridPoint[] = [
        { u: (start.u + 1) % MERIDIANS, v: start.v },
        { u: (start.u - 1 + MERIDIANS) % MERIDIANS, v: start.v },
      ];
      if (start.v < PARALLELS - 1) initialCandidates.push({ u: start.u, v: start.v + 1 });
      if (start.v > 1) initialCandidates.push({ u: start.u, v: start.v - 1 });
      const second = initialCandidates[Math.floor(Math.random() * initialCandidates.length)];
      const rawPoints = [uvToVec3(start.u, start.v), uvToVec3(second.u, second.v)];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(rawPoints);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: orangeColor,
        transparent: true,
        opacity: snakeLineOpacity,
        linewidth: 1.8,
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      globeVisual.add(line);

      const bodyGeometry = new THREE.BufferGeometry().setFromPoints(rawPoints);
      const bodyMaterial = new THREE.PointsMaterial({
        color: orangeColor,
        transparent: true,
        opacity: snakeBodyOpacity,
        size: 1.4,
        sizeAttenuation: true,
      });
      const body = new THREE.Points(bodyGeometry, bodyMaterial);
      globeVisual.add(body);

      snakes.push({
        trail: [start],
        current: start,
        next: second,
        progress: 0,
        speed: 0.34 + Math.random() * 0.02,
        line,
        body,
        dir: stepDirection(start, second),
        chaos: 0.85 + Math.random() * 0.4,
      });
    }

    // Soft halo for depth and presence
    const haloCanvas = document.createElement('canvas');
    haloCanvas.width = 256;
    haloCanvas.height = 256;
    const haloCtx = haloCanvas.getContext('2d');
    if (haloCtx) {
      const grad = haloCtx.createRadialGradient(128, 128, 20, 128, 128, 128);
      grad.addColorStop(0, `rgba(${orangeR}, ${orangeG}, ${orangeB}, 0.22)`);
      grad.addColorStop(0.5, `rgba(${orangeR}, ${orangeG}, ${orangeB}, 0.08)`);
      grad.addColorStop(1, `rgba(${orangeR}, ${orangeG}, ${orangeB}, 0)`);
      haloCtx.fillStyle = grad;
      haloCtx.fillRect(0, 0, 256, 256);
    }
    const haloTexture = new THREE.CanvasTexture(haloCanvas);
    const haloMaterial = new THREE.SpriteMaterial({
      map: haloTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const halo = new THREE.Sprite(haloMaterial);
    halo.scale.set(420, 420, 1);
    globeVisual.add(halo);

    // Cursor parallax + GSAP smoothing
    const pointerSmoothed = { x: 0, y: 0 };
    const scrollSmooth = { progress: 0 };
    const toX = gsap.quickTo(pointerSmoothed, 'x', { duration: 0.22, ease: 'power3.out' });
    const toY = gsap.quickTo(pointerSmoothed, 'y', { duration: 0.22, ease: 'power3.out' });
    const toScroll = gsap.quickTo(scrollSmooth, 'progress', { duration: 0.6, ease: 'power3.out' });

    const onPointerMove = (event: PointerEvent) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const nx = event.clientX / width - 0.5;
      const ny = event.clientY / height - 0.5;
      toX(nx);
      toY(ny);
    };
    if (!isMobileLike) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    const onScroll = () => {
      const max = Math.max(window.innerHeight, 1);
      const progress = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
      toScroll(progress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const onVisibilityChange = () => {
      pageVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const heroObserver =
      heroSection &&
      new IntersectionObserver(
        ([entry]) => {
          heroInView = entry.isIntersecting;
        },
        { threshold: 0.05, rootMargin: '100px 0px' }
      );
    if (heroObserver && heroSection) heroObserver.observe(heroSection);

    // Fast intro reveal so the globe is visible almost immediately.
    globeVisual.scale.setScalar(0.96);
    gsap.to(globeVisual.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.22,
      ease: 'power3.out',
    });
    gsap.fromTo(
      baseMaterial.uniforms.uOpacity,
      { value: 0.14 },
      { value: 0.3, duration: 0.2, ease: 'power2.out' }
    );
    gsap.fromTo(
      accentMaterial.uniforms.uGlow,
      { value: isMobileLike ? 0.36 : 0.45 },
      { value: accentGlowTarget, duration: 0.24, ease: 'power2.out' }
    );
    gsap.fromTo(
      sparkMaterial.uniforms.uIntensity,
      { value: isMobileLike ? 0.3 : 0.42 },
      { value: baseSparkIntensity, duration: 0.24, ease: 'power2.out' }
    );

    let baseScale = 1;
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 1024;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const xOffset = isMobile ? 0 : Math.min(120, width * 0.09);
      globeRoot.position.set(xOffset, 0, 0);

      baseScale = Math.min(width, height) / (isMobile ? 820 : 760);
      globeRoot.scale.setScalar(baseScale);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const timer = new THREE.Timer();
    timer.connect(document);
    let rafId = 0;
    const tick = () => {
      if (!pageVisible) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }
      timer.update();
      const delta = Math.min(timer.getDelta(), 0.05);
      const t = timer.getElapsed();
      baseMaterial.uniforms.uTime.value = t;
      accentMaterial.uniforms.uTime.value = t;
      sparkMaterial.uniforms.uTime.value = t;

      const scrollP = scrollSmooth.progress;
      const rotationSpeed = 0.0014 + scrollP * 0.0015;
      const zoomFactor = 1 + scrollP * 0.42;
      const targetScale = baseScale * zoomFactor;
      const nextScale = THREE.MathUtils.lerp(globeRoot.scale.x, targetScale, 0.06);
      globeRoot.scale.setScalar(nextScale);
      globeVisual.rotation.y += rotationSpeed;
      globeVisual.rotation.z = pointerSmoothed.x * 0.16 + scrollP * 0.08;
      globeVisual.rotation.x = THREE.MathUtils.degToRad(15) - pointerSmoothed.y * 0.16 - scrollP * 0.08;
      globeRoot.position.y = Math.sin(t * 0.45) * 4 - scrollP * 56;
      globeRoot.position.x += (scrollP * 18 - globeRoot.position.x) * 0.05;

      const pointerEnergy = Math.min(1, Math.hypot(pointerSmoothed.x, pointerSmoothed.y) * 2.4);
      sparkMaterial.uniforms.uIntensity.value = baseSparkIntensity + scrollP * 0.12 + pointerEnergy * 0.08;
      halo.material.opacity = 0.42 + Math.sin(t * 1.35) * 0.08 + pointerEnergy * 0.12;

      const activeSegments = buildActiveSegments();
      snakes.forEach((snake, snakeIndex) => {
        snake.progress += snake.speed * (1 + scrollP * 0.35) * delta;

        while (snake.progress >= 1) {
          snake.progress -= 1;
          snake.current = snake.next;
          snake.trail.push(snake.current);
          if (snake.trail.length > SNAKE_MAX_LENGTH) snake.trail.shift();
          const next = pickNextPoint(snake.current, snake.dir, snakeIndex, t * snake.chaos, activeSegments);
          snake.dir = stepDirection(snake.current, next);
          snake.next = next;
        }

        const currentVec = uvToVec3(snake.current.u, snake.current.v);
        const nextVec = uvToVec3(snake.next.u, snake.next.v);
        const headVec = currentVec.clone().lerp(nextVec, snake.progress);
        const points = snake.trail.map((p) => uvToVec3(p.u, p.v));
        points.push(headVec);

        snake.line.geometry.dispose();
        snake.line.geometry = new THREE.BufferGeometry().setFromPoints(points);
        snake.body.geometry.dispose();
        snake.body.geometry = new THREE.BufferGeometry().setFromPoints(points);
      });

      if (heroInView) renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      if (!isMobileLike) {
        window.removeEventListener('pointermove', onPointerMove);
      }
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (heroObserver) heroObserver.disconnect();
      gsap.killTweensOf(pointerSmoothed);
      gsap.killTweensOf(scrollSmooth);
      gsap.killTweensOf(globeVisual.scale);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Line || obj instanceof THREE.Points || obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const material = obj.material;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material.dispose();
        }
      });
      haloTexture.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="block h-full w-full pointer-events-none" />;
};

export default PixelArtAnimation;