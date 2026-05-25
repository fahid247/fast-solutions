"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ─── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // ─── Scene & Camera ───────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 18);

    // ─── Lighting ─────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    const pointA = new THREE.PointLight(0xf97316, 4, 40); // orange
    pointA.position.set(-8, 6, 8);
    scene.add(pointA);

    const pointB = new THREE.PointLight(0xa78bfa, 3, 40); // violet
    pointB.position.set(8, -4, 6);
    scene.add(pointB);

    const pointC = new THREE.PointLight(0x14b8a6, 2, 30); // teal
    pointC.position.set(0, 10, -10);
    scene.add(pointC);

    // ─── Material helpers ─────────────────────────────────────────────────────
    const wireMat = (color: number, opacity = 0.55) =>
      new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity,
      });

    const glowMat = (color: number) =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.12,
        side: THREE.FrontSide,
      });

    // ─── Floating Meshes ──────────────────────────────────────────────────────
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);

    interface FloatingObject {
      wire: THREE.Mesh;
      glow: THREE.Mesh;
      rotSpeed: THREE.Vector3;
      floatSpeed: number;
      floatAmp: number;
      floatOffset: number;
    }

    const objects: FloatingObject[] = [];

    const addObject = (
      geo: THREE.BufferGeometry,
      wireColor: number,
      glowColor: number,
      position: [number, number, number],
      scale: number
    ) => {
      const wire = new THREE.Mesh(geo, wireMat(wireColor));
      const glow = new THREE.Mesh(geo, glowMat(glowColor));
      wire.position.set(...position);
      glow.position.set(...position);
      wire.scale.setScalar(scale);
      glow.scale.setScalar(scale * 1.05);
      meshGroup.add(wire, glow);
      objects.push({
        wire,
        glow,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.004
        ),
        floatSpeed: 0.4 + Math.random() * 0.6,
        floatAmp: 0.3 + Math.random() * 0.5,
        floatOffset: Math.random() * Math.PI * 2,
      });
    };

    // Large central icosahedron
    addObject(
      new THREE.IcosahedronGeometry(3.2, 1),
      0xf97316, 0xf97316,
      [0, 0, -2],
      1
    );

    // Left torus
    addObject(
      new THREE.TorusGeometry(1.8, 0.06, 16, 80),
      0xa78bfa, 0xa78bfa,
      [-5.5, 3.5, -3],
      1
    );

    // Right octahedron
    addObject(
      new THREE.OctahedronGeometry(2, 0),
      0x14b8a6, 0x14b8a6,
      [5.5, -3.0, -2.5],
      1
    );

    // Upper-left small icosahedron
    addObject(
      new THREE.IcosahedronGeometry(1.2, 1),
      0xfbbf24, 0xfbbf24,
      [4.5, 4.0, -4],
      1
    );

    // Far back big sphere (very transparent)
    addObject(
      new THREE.IcosahedronGeometry(5, 1),
      0xffffff, 0xffffff,
      [-2.5, -4.5, -12],
      1
    );

    // ─── Particle Field ───────────────────────────────────────────────────────
    const COUNT = 6000;
    const posArr = new Float32Array(COUNT * 3);
    const colArr = new Float32Array(COUNT * 3);
    const palettePairs = [
      [0xf9, 0x73, 0x16], // orange
      [0xa7, 0x8b, 0xfa], // violet
      [0x14, 0xb8, 0xa6], // teal
      [0xff, 0xff, 0xff], // white
    ];
    for (let i = 0; i < COUNT; i++) {
      posArr[i * 3]     = (Math.random() - 0.5) * 60;
      posArr[i * 3 + 1] = (Math.random() - 0.5) * 40;
      posArr[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5;
      const [r, g, b] = palettePairs[Math.floor(Math.random() * palettePairs.length)];
      colArr[i * 3]     = r / 255;
      colArr[i * 3 + 1] = g / 255;
      colArr[i * 3 + 2] = b / 255;
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
    partGeo.setAttribute("color", new THREE.BufferAttribute(colArr, 3));

    const partMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // ─── Mouse Parallax & Mesh Shift ─────────────────────────────────────────
    const mouse = { x: 0, y: 0 };

    const setMeshPosition = () => {
      if (window.innerWidth >= 1280) {
        meshGroup.position.x = 5.8;
      } else if (window.innerWidth >= 1024) {
        meshGroup.position.x = 4.8;
      } else {
        meshGroup.position.x = 0;
      }
    };
    setMeshPosition();

    const targetCam = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    // ─── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      setMeshPosition();
    };
    window.addEventListener("resize", onResize);

    // ─── Animation Loop ───────────────────────────────────────────────────────
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Camera parallax around 0 (keeps meshes projected onto the right half of the screen)
      targetCam.x += (mouse.x * 1.5 - targetCam.x) * 0.04;
      targetCam.y += (mouse.y * 1.0 - targetCam.y) * 0.04;
      camera.position.x = targetCam.x;
      camera.position.y = targetCam.y;
      camera.lookAt(0, 0, 0);

      // Rotate & float each object
      objects.forEach((obj) => {
        const float =
          Math.sin(t * obj.floatSpeed + obj.floatOffset) * obj.floatAmp;
        obj.wire.rotation.x += obj.rotSpeed.x;
        obj.wire.rotation.y += obj.rotSpeed.y;
        obj.wire.rotation.z += obj.rotSpeed.z;
        obj.glow.rotation.copy(obj.wire.rotation);
        obj.wire.position.y += float * 0.01;
        obj.glow.position.y = obj.wire.position.y;
      });

      // Slowly drift particles
      particles.rotation.y = t * 0.015;
      particles.rotation.x = t * 0.005;

      renderer.render(scene, camera);
    };
    animate();

    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
