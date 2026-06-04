'use client';

/**
 * Wireframe globe + arcs for Systems hero (desktop). Mouse-tilt via GSAP quickTo.
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
}

export default function WebGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || isMobileViewport() || prefersReducedMotion()) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const tiltGroup = new THREE.Group();
    const spinGroup = new THREE.Group();
    tiltGroup.add(spinGroup);
    scene.add(tiltGroup);

    const orange = 0xff4e00;

    const outerGeo = new THREE.SphereGeometry(2, 32, 32);
    const outerEdges = new THREE.EdgesGeometry(outerGeo);
    const outerMat = new THREE.LineBasicMaterial({
      color: orange,
      transparent: true,
      opacity: 0.15,
    });
    const outerWire = new THREE.LineSegments(outerEdges, outerMat);
    spinGroup.add(outerWire);

    const innerGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const innerEdges = new THREE.EdgesGeometry(innerGeo);
    const innerMat = new THREE.LineBasicMaterial({
      color: orange,
      transparent: true,
      opacity: 0.06,
    });
    const innerWire = new THREE.LineSegments(innerEdges, innerMat);
    spinGroup.add(innerWire);

    const nodeCount = 120;
    const nodePositions: number[] = [];
    const rnd = () => Math.random() * Math.PI * 2;
    for (let i = 0; i < nodeCount; i++) {
      const u = Math.random() * 2 - 1;
      const t = rnd();
      const s = Math.sqrt(1 - u * u) * 1.95;
      nodePositions.push(s * Math.cos(t), u * 1.95, s * Math.sin(t));
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: orange,
      size: 0.06,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    spinGroup.add(nodePoints);

    const arcGroup = new THREE.Group();
    spinGroup.add(arcGroup);
    const lines: THREE.Line[] = [];
    const lineMats: THREE.LineBasicMaterial[] = [];

    const tmpV = new THREE.Vector3();
    for (let a = 0; a < 30; a++) {
      const i = Math.floor(Math.random() * nodeCount);
      const j = Math.floor(Math.random() * nodeCount);
      if (i === j) continue;
      const ax = nodePositions[i * 3];
      const ay = nodePositions[i * 3 + 1];
      const az = nodePositions[i * 3 + 2];
      const bx = nodePositions[j * 3];
      const by = nodePositions[j * 3 + 1];
      const bz = nodePositions[j * 3 + 2];
      const mid = tmpV.set((ax + bx) / 2, (ay + by) / 2 + 0.35, (az + bz) / 2);
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(ax, ay, az),
        mid,
        new THREE.Vector3(bx, by, bz),
      );
      const pts = curve.getPoints(24);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: orange,
        transparent: true,
        opacity: 0,
      });
      const line = new THREE.Line(geo, mat);
      arcGroup.add(line);
      lines.push(line);
      lineMats.push(mat);
      (line.userData as { phase: number }).phase = Math.random() * Math.PI * 2;
    }

    const rotXTo = gsap.quickTo(tiltGroup.rotation, 'x', { duration: 0.55, ease: 'power3.out' });
    const rotYTo = gsap.quickTo(tiltGroup.rotation, 'y', { duration: 0.55, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      const maxTilt = THREE.MathUtils.degToRad(15);
      rotYTo(nx * maxTilt);
      rotXTo(ny * -maxTilt);
    };
    mount.addEventListener('mousemove', onMove);

    let raf = 0;
    const t0 = performance.now();

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      spinGroup.rotation.y += 0.002;
      innerWire.rotation.y -= 0.0008;

      const pulse = (phase: number) => 0.12 + 0.28 * (0.5 + 0.5 * Math.sin(t * Math.PI + phase));
      lineMats.forEach((mat, idx) => {
        const phase = (lines[idx].userData as { phase: number }).phase;
        mat.opacity = pulse(phase);
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mount.removeEventListener('mousemove', onMove);
      outerGeo.dispose();
      outerEdges.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerEdges.dispose();
      innerMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      lines.forEach((ln) => {
        ln.geometry.dispose();
        (ln.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  if (typeof window !== 'undefined' && (prefersReducedMotion() || isMobileViewport())) {
    return null;
  }

  return (
    <div
      ref={mountRef}
      className="pointer-events-auto absolute right-0 top-0 z-0 hidden h-full w-[50vw] min-[768px]:block"
      aria-hidden
    />
  );
}
