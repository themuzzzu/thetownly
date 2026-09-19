import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, ArrowRight, Star, Clock, MapPin, Sparkles, Navigation, X } from 'lucide-react';

export default function Interactive3DTown({ onSelectStore }) {
  const mountRef = useRef(null);
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040814, 0.028);

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(22, 20, 24);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x1a2e5a, 1.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xe0f0ff, 2.4);
    sunLight.position.set(16, 28, 18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 65;
    sunLight.shadow.camera.left = -16;
    sunLight.shadow.camera.right = 16;
    sunLight.shadow.camera.top = 16;
    sunLight.shadow.camera.bottom = -16;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Warm Town Accent Light
    const townGlow = new THREE.PointLight(0x007FFF, 3.5, 25);
    townGlow.position.set(0, 4, 0);
    scene.add(townGlow);

    // 3. Materials Palette
    const mats = {
      baseIsland: new THREE.MeshStandardMaterial({ color: 0x091226, roughness: 0.85, metalness: 0.1 }),
      islandEdge: new THREE.MeshStandardMaterial({ color: 0x060c1c, roughness: 0.95 }),
      road: new THREE.MeshStandardMaterial({ color: 0x111b33, roughness: 0.8 }),
      roadLine: new THREE.MeshBasicMaterial({ color: 0x4da6ff }),
      grass: new THREE.MeshStandardMaterial({ color: 0x0a1e3b, roughness: 0.9 }),
      curb: new THREE.MeshStandardMaterial({ color: 0x22355e, roughness: 0.6 }),
      
      // Building materials
      bakery: new THREE.MeshStandardMaterial({ color: 0xff9966, roughness: 0.4 }),
      bakeryRoof: new THREE.MeshStandardMaterial({ color: 0xcc5200, roughness: 0.3 }),
      pharmacy: new THREE.MeshStandardMaterial({ color: 0xf0f6fc, roughness: 0.2 }),
      pharmacyRoof: new THREE.MeshStandardMaterial({ color: 0x007FFF, roughness: 0.3 }),
      techStore: new THREE.MeshStandardMaterial({ color: 0x182647, roughness: 0.2, metalness: 0.5 }),
      market: new THREE.MeshStandardMaterial({ color: 0x2a9d8f, roughness: 0.4 }),
      serviceHub: new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.3 }),
      
      windowLit: new THREE.MeshBasicMaterial({ color: 0xffe099 }),
      windowBlue: new THREE.MeshBasicMaterial({ color: 0x80c0ff }),
      scooterBody: new THREE.MeshStandardMaterial({ color: 0x007FFF, roughness: 0.2, metalness: 0.6 }),
      scooterMetal: new THREE.MeshStandardMaterial({ color: 0xd9e2ec, roughness: 0.1, metalness: 0.9 }),
      scooterLight: new THREE.MeshBasicMaterial({ color: 0xffffff }),
      treeLeaves: new THREE.MeshStandardMaterial({ color: 0x104b75, roughness: 0.7 }),
      treeTrunk: new THREE.MeshStandardMaterial({ color: 0x2b1d0c, roughness: 0.9 }),
      lampGlow: new THREE.MeshBasicMaterial({ color: 0xfff0b3 })
    };

    // 4. Floating Island Base
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    // Top Platform
    const platformGeo = new THREE.CylinderGeometry(15, 14, 1.4, 8);
    const platform = new THREE.Mesh(platformGeo, mats.baseIsland);
    platform.position.y = -0.7;
    platform.receiveShadow = true;
    islandGroup.add(platform);

    // Underground Geological Strata
    const bottomGeo = new THREE.CylinderGeometry(14, 3, 5, 8);
    const bottomMesh = new THREE.Mesh(bottomGeo, mats.islandEdge);
    bottomMesh.position.y = -3.9;
    islandGroup.add(bottomMesh);

    // 5. Road Network (Circular / Crossway)
    const roadGroup = new THREE.Group();
    islandGroup.add(roadGroup);

    // Outer Loop Road
    const roadOuter = new THREE.RingGeometry(7.2, 10.4, 32);
    const roadMesh = new THREE.Mesh(roadOuter, mats.road);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.y = 0.02;
    roadMesh.receiveShadow = true;
    roadGroup.add(roadMesh);

    // Center Plaza Ground
    const plazaGeo = new THREE.CircleGeometry(6.8, 32);
    const plazaMesh = new THREE.Mesh(plazaGeo, mats.grass);
    plazaMesh.rotation.x = -Math.PI / 2;
    plazaMesh.position.y = 0.01;
    plazaMesh.receiveShadow = true;
    roadGroup.add(plazaMesh);

    // Decorative Streetlights
    const lampPositions = [
      [6, 6], [-6, 6], [6, -6], [-6, -6],
      [9.5, 0], [-9.5, 0], [0, 9.5], [0, -9.5]
    ];
    lampPositions.forEach(([lx, lz]) => {
      const poleGeo = new THREE.CylinderGeometry(0.06, 0.08, 2.2, 6);
      const pole = new THREE.Mesh(poleGeo, mats.scooterMetal);
      pole.position.set(lx, 1.1, lz);
      pole.castShadow = true;
      islandGroup.add(pole);

      const bulbGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const bulb = new THREE.Mesh(bulbGeo, mats.lampGlow);
      bulb.position.set(lx, 2.2, lz);
      islandGroup.add(bulb);
    });

    // 6. Interactive Buildings
    const interactiveBuildings = [];

    const buildingData = [
      {
        id: 'bakery',
        name: 'Old Town Artisanal Bakery',
        category: 'Fresh Breads & Pastries',
        rating: '4.9 ★ (180+ orders)',
        eta: '12 min delivery',
        pos: [-3.8, 0, -2.8],
        size: [3.4, 4.2, 3],
        color: mats.bakery,
        roofColor: mats.bakeryRoof,
        deal: 'Fresh sourdough daily &bull; 0% markup'
      },
      {
        id: 'pharmacy',
        name: 'CityCare 24/7 Medix Pharmacy',
        category: 'Prescriptions & Health',
        rating: '4.95 ★ (320+ orders)',
        eta: '8 min drop',
        pos: [3.6, 0, -2.8],
        size: [3.2, 4.8, 3.2],
        color: mats.pharmacy,
        roofColor: mats.pharmacyRoof,
        deal: 'Authentic MRP &bull; Direct pharmacist chat'
      },
      {
        id: 'tech',
        name: 'NovaTech Micro Hub',
        category: 'Components & Fast Repair',
        rating: '4.88 ★ (90 orders)',
        eta: 'Same-day delivery',
        pos: [-3.6, 0, 3.4],
        size: [3.4, 3.8, 3.2],
        color: mats.techStore,
        roofColor: mats.techStore,
        deal: 'Verified warranty &bull; Instant WhatsApp quote'
      },
      {
        id: 'market',
        name: 'Central Organic Kirana',
        category: 'Daily Farm-Fresh Groceries',
        rating: '4.98 ★ (450+ orders)',
        eta: '15 min drop',
        pos: [3.8, 0, 3.2],
        size: [3.6, 3.6, 3.4],
        color: mats.market,
        roofColor: mats.market,
        deal: 'Direct harvest prices &bull; ₹0 platform fee'
      }
    ];

    buildingData.forEach((data) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(data.pos[0], 0, data.pos[2]);

      // Main Body
      const bodyGeo = new THREE.BoxGeometry(data.size[0], data.size[1], data.size[2]);
      const bodyMesh = new THREE.Mesh(bodyGeo, data.color);
      bodyMesh.position.y = data.size[1] / 2;
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      bGroup.add(bodyMesh);

      // Roof
      const roofGeo = new THREE.ConeGeometry(data.size[0] * 0.75, 1.4, 4);
      const roofMesh = new THREE.Mesh(roofGeo, data.roofColor);
      roofMesh.position.y = data.size[1] + 0.7;
      roofMesh.rotation.y = Math.PI / 4;
      roofMesh.castShadow = true;
      bGroup.add(roofMesh);

      // Glowing Windows
      for (let w = -0.9; w <= 0.9; w += 0.9) {
        const winGeo = new THREE.PlaneGeometry(0.6, 0.8);
        const winMesh = new THREE.Mesh(winGeo, mats.windowLit);
        winMesh.position.set(w, data.size[1] * 0.6, data.size[2] / 2 + 0.02);
        bGroup.add(winMesh);
      }

      // Storefront Entrance
      const doorGeo = new THREE.PlaneGeometry(1, 1.6);
      const doorMesh = new THREE.Mesh(doorGeo, mats.windowBlue);
      doorMesh.position.set(0, 0.8, data.size[2] / 2 + 0.02);
      bGroup.add(doorMesh);

      // Hover hit target box
      const hitBoxGeo = new THREE.BoxGeometry(data.size[0] + 0.6, data.size[1] + 2, data.size[2] + 0.6);
      const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
      hitBox.position.y = (data.size[1] + 2) / 2;
      hitBox.userData = data;
      bGroup.add(hitBox);

      interactiveBuildings.push(hitBox);
      islandGroup.add(bGroup);
      data.group = bGroup;
    });

    // 7. Trees & Greenery
    const treePositions = [
      [-1, -1], [1, -1], [-1, 1], [1, 1],
      [-5.5, 0], [5.5, 0], [0, -5.5], [0, 5.5],
      [-11, 2], [11, -2], [-8, -8], [8, 8]
    ];
    treePositions.forEach(([tx, tz]) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(tx, 0, tz);

      const trunkGeo = new THREE.CylinderGeometry(0.12, 0.18, 1, 6);
      const trunk = new THREE.Mesh(trunkGeo, mats.treeTrunk);
      trunk.position.y = 0.5;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      const foliageGeo = new THREE.DodecahedronGeometry(0.8);
      const foliage = new THREE.Mesh(foliageGeo, mats.treeLeaves);
      foliage.position.y = 1.3;
      foliage.castShadow = true;
      treeGroup.add(foliage);

      islandGroup.add(treeGroup);
    });

    // 8. Animated 3D Delivery Scooter & Rider
    const scooter = new THREE.Group();
    islandGroup.add(scooter);

    // Chassis
    const chassisGeo = new THREE.BoxGeometry(0.7, 0.25, 1.4);
    const chassis = new THREE.Mesh(chassisGeo, mats.scooterBody);
    chassis.position.y = 0.35;
    scooter.add(chassis);

    // Delivery Box on Back
    const boxGeo = new THREE.BoxGeometry(0.65, 0.6, 0.6);
    const box = new THREE.Mesh(boxGeo, mats.scooterBody);
    box.position.set(0, 0.75, -0.4);
    box.castShadow = true;
    scooter.add(box);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 12);
    wheelGeo.rotateZ(Math.PI / 2);
    const frontWheel = new THREE.Mesh(wheelGeo, mats.scooterMetal);
    frontWheel.position.set(0, 0.2, 0.55);
    scooter.add(frontWheel);

    const rearWheel = new THREE.Mesh(wheelGeo, mats.scooterMetal);
    rearWheel.position.set(0, 0.2, -0.55);
    scooter.add(rearWheel);

    // Rider Figure
    const torsoGeo = new THREE.CylinderGeometry(0.22, 0.2, 0.7, 8);
    const torso = new THREE.Mesh(torsoGeo, mats.scooterBody);
    torso.position.set(0, 0.9, 0.1);
    scooter.add(torso);

    const headGeo = new THREE.SphereGeometry(0.22, 12, 12);
    const head = new THREE.Mesh(headGeo, mats.pharmacyRoof);
    head.position.set(0, 1.45, 0.15);
    scooter.add(head);

    // Headlight Beam
    const headlight = new THREE.SpotLight(0xffffff, 4, 12, Math.PI / 6, 0.3);
    headlight.position.set(0, 0.5, 0.75);
    headlight.target.position.set(0, 0, 4);
    scooter.add(headlight);
    scooter.add(headlight.target);

    // 9. Mouse Interaction & Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    let targetRotY = 0;
    let targetRotX = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    const onMouseMove = (e) => {
      onPointerMove(e);
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.004;
        targetRotX = Math.max(-0.25, Math.min(0.4, targetRotX));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveBuildings);
      if (intersects.length > 0) {
        const hit = intersects[0].object.userData;
        setSelectedBuilding(hit);
        if (onSelectStore) onSelectStore(hit);
      }
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('click', onClick);

    // 10. Animation Loop
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      const time = clock.getElapsedTime();

      // Gentle Island Floating & Smooth Camera Rotation
      if (!isDragging) {
        targetRotY += 0.0018; // Slow cinematic orbital rotation
      }
      islandGroup.rotation.y += (targetRotY - islandGroup.rotation.y) * 0.06;
      islandGroup.rotation.x += (targetRotX - islandGroup.rotation.x) * 0.06;
      islandGroup.position.y = Math.sin(time * 1.2) * 0.22;

      // Scooter Looping on Outer Road (Radius ~ 8.8)
      const roadRadius = 8.8;
      const scooterSpeed = 0.55;
      const scooterAngle = time * scooterSpeed;
      
      const sX = Math.cos(scooterAngle) * roadRadius;
      const sZ = Math.sin(scooterAngle) * roadRadius;
      scooter.position.set(sX, 0.05, sZ);
      scooter.rotation.y = -scooterAngle + Math.PI / 2;

      // Raycasting for building hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveBuildings);
      if (intersects.length > 0) {
        container.style.cursor = 'pointer';
        const building = intersects[0].object.userData;
        setHoveredBuilding(building);
        // Bounce building slightly
        building.group.position.y = 0.25;
      } else {
        container.style.cursor = isDragging ? 'grabbing' : 'grab';
        setHoveredBuilding(null);
        buildingData.forEach((b) => {
          if (b.group) b.group.position.y = 0;
        });
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('click', onClick);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onSelectStore]);

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-[#070D1F] via-[#040814] to-[#02050E] shadow-2xl shadow-black/80">
      
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Instructions */}
      <div className="absolute top-5 left-5 pointer-events-none z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-300">
        <span className="w-2 h-2 rounded-full bg-[#007FFF] animate-ping" />
        <span>LIVING 3D ISOMETRIC TOWN // DRAG TO ROTATE &bull; CLICK STORES</span>
      </div>

      {/* Live Hover Tooltip */}
      <AnimatePresence>
        {hoveredBuilding && !selectedBuilding && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          >
            <div className="px-5 py-3 rounded-2xl bg-[#070D1F]/95 backdrop-blur-xl border border-[#007FFF]/40 shadow-2xl shadow-[#007FFF]/20 flex items-center gap-4 text-xs font-mono">
              <div className="w-8 h-8 rounded-xl bg-[#007FFF]/20 text-[#007FFF] flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">{hoveredBuilding.name}</div>
                <div className="text-slate-400 text-[11px]">{hoveredBuilding.category} &bull; <span className="text-emerald-400">{hoveredBuilding.eta}</span></div>
              </div>
              <span className="text-[#007FFF] font-bold text-[11px] bg-[#007FFF]/10 px-2 py-1 rounded-lg border border-[#007FFF]/30">
                Click to Inspect
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Store Inspector Card Drawer */}
      <AnimatePresence>
        {selectedBuilding && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-5 right-5 bottom-5 w-80 sm:w-88 z-30 p-5 rounded-2xl bg-[#070E24]/95 backdrop-blur-2xl border border-[#007FFF]/50 shadow-2xl shadow-black flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#007FFF] font-bold">
                  <Store className="w-3.5 h-3.5" />
                  <span>LOCAL STORE PROFILE</span>
                </div>
                <button
                  onClick={() => setSelectedBuilding(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h4 className="text-xl font-extrabold text-white">{selectedBuilding.name}</h4>
              <p className="text-xs text-[#007FFF] font-mono mt-0.5">{selectedBuilding.category}</p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-slate-500 text-[10px]">ETA</div>
                  <div className="text-emerald-400 font-bold">{selectedBuilding.eta}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-slate-500 text-[10px]">RATING</div>
                  <div className="text-amber-300 font-bold">{selectedBuilding.rating}</div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-[#007FFF]/10 border border-[#007FFF]/30 text-xs">
                <div className="text-slate-400 text-[10px] font-mono uppercase">Direct Community Deal</div>
                <div className="text-white font-medium mt-0.5" dangerouslySetInnerHTML={{ __html: selectedBuilding.deal }} />
              </div>
            </div>

            <div className="space-y-2 mt-4 pt-3 border-t border-white/[0.08]">
              <a
                href="#app"
                className="w-full py-3 rounded-xl font-bold text-white bg-[#007FFF] hover:bg-[#0066d6] flex items-center justify-center gap-2 text-xs shadow-lg shadow-[#007FFF]/30"
              >
                <span>Order via Direct Connect</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setSelectedBuilding(null)}
                className="w-full py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Return to Town Orbit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
