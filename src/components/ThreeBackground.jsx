import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function ThreeBackground() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const groupRef = useRef(null);
  const clockRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const aspect = window.innerWidth / window.innerHeight;
    const d = 10;
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    camera.position.set(20, 20, 20);
    camera.lookAt(scene.position);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Colors matching the theme (based on the project's cyan accent)
    const c_chalk = 0xf0f0f0;
    const c_cyan = 0x00d4ff;
    const c_green = 0x00ff88;
    const c_orange = 0xff4d00;

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    const mat = (color, opacity = 0.25) => new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      linewidth: 1
    });

    // Multiple nested cubes
    const cubeGeo = new THREE.BoxGeometry(8, 8, 8);
    const cubeEdges = new THREE.EdgesGeometry(cubeGeo);
    const cube1 = new THREE.LineSegments(cubeEdges, mat(c_chalk, 0.15));
    group.add(cube1);

    const cube2 = new THREE.LineSegments(cubeEdges, mat(c_chalk, 0.08));
    cube2.rotation.set(Math.PI / 4, Math.PI / 4, 0);
    cube2.scale.set(1.5, 1.5, 1.5);
    group.add(cube2);

    const cube3 = new THREE.LineSegments(cubeEdges, mat(c_chalk, 0.05));
    cube3.rotation.set(-Math.PI / 6, Math.PI / 3, 0);
    cube3.scale.set(2.2, 2.2, 2.2);
    group.add(cube3);

    // Octahedron
    const octGeo = new THREE.OctahedronGeometry(6);
    const octEdges = new THREE.EdgesGeometry(octGeo);
    const octahedron = new THREE.LineSegments(octEdges, mat(c_green, 0.25));
    octahedron.position.set(12, -4, -5);
    group.add(octahedron);

    // Concentric circles
    const circleGroup = new THREE.Group();
    for (let i = 1; i <= 6; i++) {
      const circleGeo = new THREE.CircleGeometry(i * 1.2, 64);
      const edges = new THREE.EdgesGeometry(circleGeo);
      const circle = new THREE.LineSegments(edges, mat(i % 2 === 0 ? c_cyan : c_chalk, 0.3));
      circleGroup.add(circle);
    }
    circleGroup.position.set(-10, 5, 0);
    circleGroup.rotation.x = Math.PI / 3;
    group.add(circleGroup);

    // Icosahedron for extra geometry
    const icosaGeo = new THREE.IcosahedronGeometry(4);
    const icosaEdges = new THREE.EdgesGeometry(icosaGeo);
    const icosahedron = new THREE.LineSegments(icosaEdges, mat(c_orange, 0.2));
    icosahedron.position.set(-8, -8, 2);
    group.add(icosahedron);

    // Torus knot
    const torusGeo = new THREE.TorusKnotGeometry(3, 0.8, 100, 16);
    const torusEdges = new THREE.EdgesGeometry(torusGeo);
    const torusKnot = new THREE.LineSegments(torusEdges, mat(c_cyan, 0.3));
    torusKnot.position.set(8, 8, -3);
    group.add(torusKnot);

    // Wave forms
    function createWave(color, amplitude, frequency, offset, length) {
      const points = [];
      for (let i = -length / 2; i <= length / 2; i += 0.2) {
        points.push(new THREE.Vector3(i, Math.sin(i * frequency + offset) * amplitude, Math.cos(i * frequency + offset) * amplitude));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.Line(geo, mat(color, 0.4));
    }

    const wave1 = createWave(c_cyan, 3, 0.5, 0, 30);
    wave1.rotation.z = Math.PI / 4;
    group.add(wave1);

    const wave2 = createWave(c_chalk, 3, 0.5, Math.PI, 30);
    wave2.rotation.z = Math.PI / 4;
    group.add(wave2);

    // Random floating points - adds more visual interest
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsCount = 200;
    const positions = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40;
      positions[i + 1] = (Math.random() - 0.5) * 40;
      positions[i + 2] = (Math.random() - 0.5) * 40;
    }
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pointsMaterial = new THREE.PointsMaterial({ color: c_cyan, size: 0.15, opacity: 0.4, transparent: true });
    const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);
    group.add(pointCloud);

    const clock = new THREE.Clock();
    clockRef.current = clock;

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Gentle overall rotation
      group.rotation.y = Math.sin(t * 0.05) * 0.2;
      group.rotation.x = Math.cos(t * 0.05) * 0.1;

      // Individual rotations
      cube1.rotation.x = t * 0.1;
      cube1.rotation.y = t * 0.15;
      cube2.rotation.x = t * 0.08;
      cube2.rotation.y = t * 0.12;
      cube3.rotation.x = -t * 0.05;
      cube3.rotation.z = t * 0.03;

      octahedron.rotation.y = -t * 0.2;
      icosahedron.rotation.y = t * 0.15;
      icosahedron.rotation.x = t * 0.1;

      torusKnot.rotation.x = t * 0.2;
      torusKnot.rotation.y = t * 0.1;

      circleGroup.rotation.z = t * 0.05;

      wave1.rotation.x = t * 0.5;
      wave2.rotation.x = t * 0.5;

      pointCloud.rotation.y = t * 0.02;

      renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    function handleResize() {
      const aspect = window.innerWidth / window.innerHeight;
      camera.left = -d * aspect;
      camera.right = d * aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="three-bg-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    />
  );
}

export default ThreeBackground;
