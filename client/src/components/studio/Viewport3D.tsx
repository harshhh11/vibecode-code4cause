import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useProject } from '../../context/ProjectContext';
import { useUI } from '../../context/UIContext';
import { buildRealisticFurnitureMesh } from '../../utils/furniture3DBuilder';
import { createWoodFloorTexture } from '../../utils/proceduralTextures';
import type { WallSide } from '../../types/project';
import {
  RotateCcw,
  RotateCw,
  Sun,
  Moon,
  Sparkles,
  Camera,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Play,
  Pause,
  Compass,
  Maximize2,
  Minimize2,
  X,
  Plus,
  Minus,
  Activity,
  ArrowLeft as BackIcon,
} from 'lucide-react';

export const Viewport3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    activeProject,
    activeRoom,
    furniture,
    selectedFurnitureId,
    setSelectedFurnitureId,
    selectedDoorId,
    setSelectedDoorId,
    updateFurniture,
    removeFurniture,
    duplicateFurniture,
    updateDoor,
    removeDoor,
    activeTheme,
  } = useProject();

  const {
    camera3DPreset,
    isWholeHome3D,
    is360ImmersiveView,
    setIs360ImmersiveView,
    isAutoTour,
    setIsAutoTour,
  } = useUI();


  // Lighting atmospheres: 'daylight' (5500K) | 'warm_evening' (2700K) | 'night_mood' (Atmospheric Dark)
  const [lightingMode, setLightingMode] = useState<'warm_evening' | 'daylight' | 'night_mood'>('warm_evening');
  // Camera Projection mode: True Ortho Isometric vs Cinematic Perspective
  const [projectionMode, setProjectionMode] = useState<'perspective' | 'orthographic'>('perspective');
  // Snapshot export status
  const [snapshotTaken, setSnapshotTaken] = useState<boolean>(false);
  // Fullscreen status
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  // Debug HUD visibility
  const [showDebugHUD, setShowDebugHUD] = useState<boolean>(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orthographicCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const activeCameraRef = useRef<THREE.Camera | null>(null);

  const lightsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const roomGroupRef = useRef<THREE.Group>(new THREE.Group());

  const isAutoTourRef = useRef(isAutoTour);
  isAutoTourRef.current = isAutoTour;

  const isDraggingRef = useRef(false);
  const isPanningRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraSphericalRef = useRef({ radius: 24, theta: Math.PI / 4, phi: Math.PI / 3.4 });
  const panOffsetRef = useRef(new THREE.Vector3(0, 0, 0));
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const orthoFrustumSizeRef = useRef<number>(20);

  const raycasterRef = useRef(new THREE.Raycaster());
  const mousePosRef = useRef(new THREE.Vector2());

  const selectedItem = furniture.find((f) => f.id === selectedFurnitureId);
  const selectedDoor = activeRoom.doors.find((d) => d.id === selectedDoorId);

  // -------------------------------------------------------------
  // Camera Position Updater
  // -------------------------------------------------------------
  const updateCameraPosition = useCallback(() => {
    if (!rendererRef.current) return;
    const { radius, theta, phi } = cameraSphericalRef.current;
    const center = targetRef.current.clone().add(panOffsetRef.current);

    const x = center.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = center.y + radius * Math.cos(phi);
    const z = center.z + radius * Math.sin(phi) * Math.cos(theta);

    if (perspectiveCameraRef.current) {
      perspectiveCameraRef.current.position.set(x, y, z);
      perspectiveCameraRef.current.lookAt(center);
    }

    if (orthographicCameraRef.current) {
      orthographicCameraRef.current.position.set(x, y, z);
      orthographicCameraRef.current.lookAt(center);
    }
  }, []);

  // -------------------------------------------------------------
  // 1. Master Three.js Scene Mount (Runs ONCE on Mount)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const aspect = width / height;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#14161A');
    sceneRef.current = scene;

    scene.add(lightsGroupRef.current);
    scene.add(roomGroupRef.current);

    // Perspective Camera
    const perspCam = new THREE.PerspectiveCamera(42, aspect, 0.1, 1000);
    perspectiveCameraRef.current = perspCam;

    // True Isometric Orthographic Camera
    const frustum = orthoFrustumSizeRef.current;
    const orthoCam = new THREE.OrthographicCamera(
      (-frustum * aspect) / 2,
      (frustum * aspect) / 2,
      frustum / 2,
      -frustum / 2,
      0.1,
      1000
    );
    orthographicCameraRef.current = orthoCam;

    activeCameraRef.current = projectionMode === 'orthographic' ? orthoCam : perspCam;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    updateCameraPosition();

    // Render & Auto Tour Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth Auto Tour 360 Turntable rotation
      if (isAutoTourRef.current && !isDraggingRef.current && !isPanningRef.current) {
        cameraSphericalRef.current.theta += 0.0035;
        updateCameraPosition();
      }

      if (rendererRef.current && sceneRef.current && activeCameraRef.current) {
        rendererRef.current.render(sceneRef.current, activeCameraRef.current);
      }
    };
    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const asp = w / h;

      if (perspectiveCameraRef.current) {
        perspectiveCameraRef.current.aspect = asp;
        perspectiveCameraRef.current.updateProjectionMatrix();
      }
      if (orthographicCameraRef.current) {
        const fr = orthoFrustumSizeRef.current;
        orthographicCameraRef.current.left = (-fr * asp) / 2;
        orthographicCameraRef.current.right = (fr * asp) / 2;
        orthographicCameraRef.current.top = fr / 2;
        orthographicCameraRef.current.bottom = -fr / 2;
        orthographicCameraRef.current.updateProjectionMatrix();
      }
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []); // Run once on mount!

  // -------------------------------------------------------------
  // 2. Dynamic Lighting & Atmosphere Updates (Reactive to lightingMode)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    const lightsGroup = lightsGroupRef.current;

    // Clear previous lights
    while (lightsGroup.children.length > 0) {
      lightsGroup.remove(lightsGroup.children[0]);
    }

    const L = activeRoom.dimensions.length;
    const W = activeRoom.dimensions.width;

    if (lightingMode === 'warm_evening') {
      scene.background = new THREE.Color('#14161A');
      if (rendererRef.current) rendererRef.current.toneMappingExposure = 1.25;

      const ambientLight = new THREE.AmbientLight('#FFF1E0', 0.95);
      lightsGroup.add(ambientLight);

      const sunLight = new THREE.DirectionalLight('#FFE8C2', 2.0);
      sunLight.position.set(22, 34, 24);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      sunLight.shadow.bias = -0.0003;
      lightsGroup.add(sunLight);

      const skyFill = new THREE.HemisphereLight('#FFF6ED', '#D2BA99', 0.65);
      lightsGroup.add(skyFill);
    } else if (lightingMode === 'daylight') {
      scene.background = new THREE.Color('#181B22');
      if (rendererRef.current) rendererRef.current.toneMappingExposure = 1.3;

      const ambientLight = new THREE.AmbientLight('#FFFFFF', 1.05);
      lightsGroup.add(ambientLight);

      const sunLight = new THREE.DirectionalLight('#FFFFFF', 2.2);
      sunLight.position.set(18, 36, 18);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      sunLight.shadow.bias = -0.0003;
      lightsGroup.add(sunLight);

      const skyFill = new THREE.HemisphereLight('#F0F7FF', '#E4DCD0', 0.75);
      lightsGroup.add(skyFill);
    } else {
      // DRAMATIC NIGHT MOOD
      scene.background = new THREE.Color('#090B0E');
      if (rendererRef.current) rendererRef.current.toneMappingExposure = 1.1;

      const ambientLight = new THREE.AmbientLight('#18202A', 0.5);
      lightsGroup.add(ambientLight);

      const moonLight = new THREE.DirectionalLight('#93C5FD', 0.5);
      moonLight.position.set(16, 28, 16);
      moonLight.castShadow = true;
      lightsGroup.add(moonLight);

      const warmBedsideL = new THREE.PointLight('#FFA726', 1.5, 16);
      warmBedsideL.position.set(2.0, 3.0, 1.5);
      lightsGroup.add(warmBedsideL);

      const warmBedsideR = new THREE.PointLight('#FFA726', 1.5, 16);
      warmBedsideR.position.set(L - 2.0, 3.0, 1.5);
      lightsGroup.add(warmBedsideR);

      const tvGlow = new THREE.PointLight('#60A5FA', 1.1, 14);
      tvGlow.position.set(L / 2, 3.0, W - 1.5);
      lightsGroup.add(tvGlow);

      const centerSpot = new THREE.SpotLight('#FFE8C2', 1.5, 22, Math.PI / 4, 0.5);
      centerSpot.position.set(L / 2, 8, W / 2);
      centerSpot.target.position.set(L / 2, 0, W / 2);
      lightsGroup.add(centerSpot, centerSpot.target);
    }
  }, [lightingMode, activeRoom]);

  // -------------------------------------------------------------
  // 3. Camera Projection Mode Updates
  // -------------------------------------------------------------
  useEffect(() => {
    activeCameraRef.current =
      projectionMode === 'orthographic' ? orthographicCameraRef.current : perspectiveCameraRef.current;
    updateCameraPosition();
  }, [projectionMode, updateCameraPosition]);

  // -------------------------------------------------------------
  // 4. Camera Presets
  // -------------------------------------------------------------
  useEffect(() => {
    if (camera3DPreset === 'isometric') {
      cameraSphericalRef.current = { radius: 24, theta: Math.PI / 4, phi: Math.PI / 3.4 };
      setProjectionMode('orthographic');
    } else if (camera3DPreset === 'top') {
      cameraSphericalRef.current = { radius: 26, theta: 0, phi: 0.05 };
      setProjectionMode('orthographic');
    } else if (camera3DPreset === 'walkthrough') {
      cameraSphericalRef.current = { radius: 12, theta: Math.PI / 2.2, phi: Math.PI / 2.2 };
      setProjectionMode('perspective');
    }
    updateCameraPosition();
  }, [camera3DPreset, updateCameraPosition]);

  // -------------------------------------------------------------
  // 5. Build 3D Architecture, Walls, Windows, Doors & Furniture
  // -------------------------------------------------------------
  useEffect(() => {
    const roomGroup = roomGroupRef.current;

    // Clear previous room objects
    while (roomGroup.children.length > 0) {
      roomGroup.remove(roomGroup.children[0]);
    }

    const renderRooms = isWholeHome3D ? activeProject.rooms : [activeRoom];

    const totalL = activeRoom.dimensions.length;
    const totalW = activeRoom.dimensions.width;

    if (isWholeHome3D) {
      targetRef.current.set(totalL, 0, totalW);
    } else {
      targetRef.current.set(totalL / 2, 0, totalW / 2);
    }
    updateCameraPosition();

    renderRooms.forEach((room, roomIdx) => {
      const singleRoomGroup = new THREE.Group();
      singleRoomGroup.name = `room_${room.id}`;

      const L = room.dimensions.length;
      const W = room.dimensions.width;
      const H = 4.2;

      const roomOffsetX = isWholeHome3D ? (roomIdx % 2) * (L + 1.2) : 0;
      const roomOffsetZ = isWholeHome3D ? Math.floor(roomIdx / 2) * (W + 1.2) : 0;
      singleRoomGroup.position.set(roomOffsetX, 0, roomOffsetZ);

      // 1. Flooring with Procedural Oak Wood Planks
      const floorGeo = new THREE.PlaneGeometry(L, W);
      const floorMat = new THREE.MeshStandardMaterial({
        roughness: 0.35,
        metalness: 0.05,
        map: createWoodFloorTexture('oak'),
      });
      const floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.position.set(L / 2, 0, W / 2);
      floorMesh.receiveShadow = true;
      singleRoomGroup.add(floorMesh);

      // Foundation Slab / Shadow Plinth
      const plinthMat = new THREE.MeshStandardMaterial({
        color: '#111418',
        roughness: 0.8,
      });
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(L + 0.8, 0.4, W + 0.8), plinthMat);
      plinth.position.set(L / 2, -0.2, W / 2);
      singleRoomGroup.add(plinth);

      // Perimeter Baseboard / Skirting
      const baseboardMat = new THREE.MeshStandardMaterial({ color: '#242424', roughness: 0.5 });
      const bbN = new THREE.Mesh(new THREE.BoxGeometry(L, 0.22, 0.08), baseboardMat);
      bbN.position.set(L / 2, 0.11, 0.04);
      const bbW = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, W), baseboardMat);
      bbW.position.set(0.04, 0.11, W / 2);
      singleRoomGroup.add(bbN, bbW);

      // 2. High Architectural Cutout Walls
      const wallColor = new THREE.Color(activeTheme.palette.walls || '#FAF8F5');
      const wallMat = new THREE.MeshStandardMaterial({
        color: wallColor,
        roughness: 0.9,
      });

      // North Wall (Back)
      const backWallGeo = new THREE.BoxGeometry(L, H, 0.4);
      const backWall = new THREE.Mesh(backWallGeo, wallMat);
      backWall.position.set(L / 2, H / 2, -0.2);
      backWall.castShadow = true;
      backWall.receiveShadow = true;
      singleRoomGroup.add(backWall);

      // West Wall (Left)
      const leftWallGeo = new THREE.BoxGeometry(0.4, H, W);
      const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
      leftWall.position.set(-0.2, H / 2, W / 2);
      leftWall.castShadow = true;
      leftWall.receiveShadow = true;
      singleRoomGroup.add(leftWall);

      // Low Open Front & Right Isometric Cutaway Walls
      const cutH = 1.0;
      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, cutH, W), wallMat);
      rightWall.position.set(L + 0.2, cutH / 2, W / 2);
      const frontWall = new THREE.Mesh(new THREE.BoxGeometry(L, cutH, 0.4), wallMat);
      frontWall.position.set(L / 2, cutH / 2, W + 0.2);
      singleRoomGroup.add(rightWall, frontWall);

      // 3. ARCHITECTURAL 3D WINDOWS WITH ACTUAL SIZES & MULTI-WALL ORIENTATION
      room.windows.forEach((win) => {
        const winGroup = new THREE.Group();
        winGroup.name = `win_${win.id}`;

        const winW = win.width || 5.0;
        const winH = win.height || 4.5;
        const sillH = win.sillHeight || 2.5;
        const centerY = sillH + winH / 2;

        let posX = 0;
        let posZ = 0;
        let rotY = 0;

        if (win.wall === 'north') {
          posX = win.offset + winW / 2;
          posZ = -0.2;
          rotY = 0;
        } else if (win.wall === 'south') {
          posX = win.offset + winW / 2;
          posZ = W + 0.2;
          rotY = Math.PI;
        } else if (win.wall === 'west') {
          posX = -0.2;
          posZ = win.offset + winW / 2;
          rotY = Math.PI / 2;
        } else {
          // East
          posX = L + 0.2;
          posZ = win.offset + winW / 2;
          rotY = -Math.PI / 2;
        }

        winGroup.position.set(posX, 0, posZ);
        winGroup.rotation.y = rotY;

        // Architectural Outer Frame & Casing
        const frameMat = new THREE.MeshStandardMaterial({ color: '#242424', roughness: 0.4 });
        const frameGeo = new THREE.BoxGeometry(winW, winH, 0.38);
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.set(0, centerY, 0);

        // Deep Window Sill Ledge (protrudes into the room)
        const sillMat = new THREE.MeshStandardMaterial({ color: '#E8E5DD', roughness: 0.3 });
        const sillGeo = new THREE.BoxGeometry(winW + 0.4, 0.12, 0.55);
        const sill = new THREE.Mesh(sillGeo, sillMat);
        sill.position.set(0, sillH, 0.08);

        // Double-Glazed Translucent Glass Pane
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: '#E0F2FE',
          transparent: true,
          opacity: 0.35,
          roughness: 0.05,
          transmission: 0.92,
          reflectivity: 0.8,
        });
        const glassGeo = new THREE.BoxGeometry(winW - 0.2, winH - 0.2, 0.04);
        const glass = new THREE.Mesh(glassGeo, glassMat);
        glass.position.set(0, centerY, 0);

        // Mullions / Window Grids (4-pane cross bars)
        const mullionMat = new THREE.MeshStandardMaterial({ color: '#1A1A1A', roughness: 0.3 });
        const vertMullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, winH - 0.2, 0.08), mullionMat);
        vertMullion.position.set(0, centerY, 0);
        const horizMullion = new THREE.Mesh(new THREE.BoxGeometry(winW - 0.2, 0.08, 0.08), mullionMat);
        horizMullion.position.set(0, centerY, 0);

        // Exterior Natural Daylight Spill Beam
        const sunbeam = new THREE.SpotLight('#FFF8ED', 1.6, 20, Math.PI / 4, 0.6);
        sunbeam.position.set(0, centerY + 1.5, -2);
        sunbeam.target.position.set(0, 0, 4);
        winGroup.add(sunbeam.target);

        winGroup.add(frame, sill, glass, vertMullion, horizMullion, sunbeam);
        singleRoomGroup.add(winGroup);
      });

      // 4. ARCHITECTURAL 3D DOORS WITH FRAMES, HINGES & HANDLES
      room.doors.forEach((door) => {
        const doorGroup = new THREE.Group();
        doorGroup.name = `door_${door.id}`;
        doorGroup.userData = { id: door.id, type: 'door', door };

        const isSelected = door.id === selectedDoorId;
        const doorFrameH = 3.5;
        const doorWidth = door.width;
        const frameMat = new THREE.MeshStandardMaterial({
          color: isSelected ? '#D97706' : '#242424',
          roughness: 0.4,
        });

        // Compute wall position coordinates
        let posX = 0;
        let posZ = 0;
        let rotY = 0;

        if (door.wall === 'south') {
          posX = door.offset + doorWidth / 2;
          posZ = W;
          rotY = 0;
        } else if (door.wall === 'north') {
          posX = door.offset + doorWidth / 2;
          posZ = 0;
          rotY = Math.PI;
        } else if (door.wall === 'west') {
          posX = 0;
          posZ = door.offset + doorWidth / 2;
          rotY = Math.PI / 2;
        } else {
          // East
          posX = L;
          posZ = door.offset + doorWidth / 2;
          rotY = -Math.PI / 2;
        }

        doorGroup.position.set(posX, 0, posZ);
        doorGroup.rotation.y = rotY;

        // Left Frame Post
        const postLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, doorFrameH, 0.35), frameMat);
        postLeft.position.set(-doorWidth / 2, doorFrameH / 2, 0);
        // Right Frame Post
        const postRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, doorFrameH, 0.35), frameMat);
        postRight.position.set(doorWidth / 2, doorFrameH / 2, 0);
        // Top Header Transom
        const header = new THREE.Mesh(new THREE.BoxGeometry(doorWidth + 0.24, 0.15, 0.35), frameMat);
        header.position.set(0, doorFrameH + 0.075, 0);

        doorGroup.add(postLeft, postRight, header);

        // Hinge Pivot & 3D Door Leaf
        const hingePivot = new THREE.Group();
        const isLeftHinged = door.swing.includes('left');
        const hingeX = isLeftHinged ? -doorWidth / 2 + 0.05 : doorWidth / 2 - 0.05;
        hingePivot.position.set(hingeX, 0, 0);

        const leafMat = new THREE.MeshStandardMaterial({
          color: activeTheme.palette.furniture || '#6E472A',
          roughness: 0.45,
        });
        const leafGeo = new THREE.BoxGeometry(doorWidth - 0.1, doorFrameH - 0.1, 0.08);
        const leafMesh = new THREE.Mesh(leafGeo, leafMat);
        leafMesh.position.set(isLeftHinged ? (doorWidth - 0.1) / 2 : -(doorWidth - 0.1) / 2, doorFrameH / 2, 0);
        leafMesh.castShadow = true;
        leafMesh.receiveShadow = true;
        hingePivot.add(leafMesh);

        // Brass Door Lever Handle on both sides
        const handleMat = new THREE.MeshStandardMaterial({ color: '#D4AF37', roughness: 0.3, metalness: 0.9 });
        const handleX = isLeftHinged ? doorWidth - 0.4 : -doorWidth + 0.4;

        const handleLever1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.15), handleMat);
        handleLever1.position.set(handleX, 1.4, 0.08);
        const handleLever2 = handleLever1.clone();
        handleLever2.position.z = -0.08;
        hingePivot.add(handleLever1, handleLever2);

        // Open swing angle (45 degrees)
        const openAngle = door.swing.includes('inside') ? (isLeftHinged ? Math.PI / 4 : -Math.PI / 4) : (isLeftHinged ? -Math.PI / 4 : Math.PI / 4);
        hingePivot.rotation.y = openAngle;
        doorGroup.add(hingePivot);

        // 3D Door Swing Ground Projection Arc
        const swingArcGeo = new THREE.RingGeometry(doorWidth * 0.95, doorWidth * 1.0, 32, 1, 0, Math.PI / 2);
        const swingArcMat = new THREE.MeshBasicMaterial({
          color: isSelected ? '#D97706' : '#B26A4A',
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const swingArc = new THREE.Mesh(swingArcGeo, swingArcMat);
        swingArc.rotation.x = -Math.PI / 2;
        swingArc.position.set(hingeX, 0.02, 0);
        doorGroup.add(swingArc);

        // Selection Highlight
        if (isSelected) {
          const selRing = new THREE.Mesh(
            new THREE.RingGeometry(doorWidth * 0.6, doorWidth * 0.7, 32),
            new THREE.MeshBasicMaterial({ color: '#D97706', side: THREE.DoubleSide })
          );
          selRing.rotation.x = -Math.PI / 2;
          selRing.position.y = 0.04;
          doorGroup.add(selRing);
        }

        singleRoomGroup.add(doorGroup);
      });

      // 5. Columns & Obstacles
      room.obstacles?.forEach((obs) => {
        const obsGeo = new THREE.BoxGeometry(obs.width, H, obs.depth);
        const obsMat = new THREE.MeshStandardMaterial({
          color: '#E5E2DA',
          roughness: 0.8,
        });
        const obsMesh = new THREE.Mesh(obsGeo, obsMat);
        obsMesh.position.set(obs.x + obs.width / 2, H / 2, obs.y + obs.depth / 2);
        obsMesh.castShadow = true;
        obsMesh.receiveShadow = true;
        singleRoomGroup.add(obsMesh);
      });

      // 6. Furniture items for active room
      if (!isWholeHome3D || room.id === activeRoom.id) {
        furniture.forEach((item) => {
          const isSelected = item.id === selectedFurnitureId;
          const group = buildRealisticFurnitureMesh(item, activeTheme, isSelected);

          const isRotated = Math.abs(item.rotation % 180) === 90;
          const effW = isRotated ? item.depth : item.width;
          const effD = isRotated ? item.width : item.depth;

          group.position.set(item.x + effW / 2, 0, item.y + effD / 2);
          group.rotation.y = -(item.rotation * Math.PI) / 180;

          singleRoomGroup.add(group);
        });
      }

      roomGroup.add(singleRoomGroup);
    });
  }, [activeRoom, activeProject, furniture, selectedFurnitureId, selectedDoorId, activeTheme, isWholeHome3D, updateCameraPosition]);

  // -------------------------------------------------------------
  // Mouse & Orbit & Raycasting Interaction
  // -------------------------------------------------------------
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
      isPanningRef.current = true;
    } else {
      isDraggingRef.current = true;
    }
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    if (isPanningRef.current) {
      const panFactor = 0.03;
      panOffsetRef.current.x -= deltaX * panFactor;
      panOffsetRef.current.z -= deltaY * panFactor;
      updateCameraPosition();
    } else if (isDraggingRef.current) {
      cameraSphericalRef.current.theta -= deltaX * 0.008;
      cameraSphericalRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2 - 0.05, cameraSphericalRef.current.phi - deltaY * 0.008)
      );
      updateCameraPosition();
    }

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDraggingRef.current && Math.abs(e.clientX - previousMousePositionRef.current.x) < 4) {
      if (mountRef.current && rendererRef.current && activeCameraRef.current && sceneRef.current) {
        const rect = mountRef.current.getBoundingClientRect();
        mousePosRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mousePosRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mousePosRef.current, activeCameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

        let hitId: string | null = null;
        let hitType: string | null = null;

        for (const hit of intersects) {
          let curr: THREE.Object3D | null = hit.object;
          while (curr) {
            if (curr.userData && curr.userData.id) {
              hitId = curr.userData.id;
              hitType = curr.userData.type || 'furniture';
              break;
            }
            curr = curr.parent;
          }
          if (hitId) break;
        }

        if (hitType === 'door') {
          setSelectedFurnitureId(null);
          setSelectedDoorId(hitId);
        } else if (hitId) {
          setSelectedDoorId(null);
          setSelectedFurnitureId(hitId);
        } else {
          setSelectedFurnitureId(null);
          setSelectedDoorId(null);
        }
      }
    }

    isDraggingRef.current = false;
    isPanningRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (projectionMode === 'orthographic' && orthographicCameraRef.current) {
      orthoFrustumSizeRef.current = Math.max(8, Math.min(60, orthoFrustumSizeRef.current + e.deltaY * 0.02));
      const w = mountRef.current?.clientWidth || 800;
      const h = mountRef.current?.clientHeight || 600;
      const asp = w / h;
      const fr = orthoFrustumSizeRef.current;
      orthographicCameraRef.current.left = (-fr * asp) / 2;
      orthographicCameraRef.current.right = (fr * asp) / 2;
      orthographicCameraRef.current.top = fr / 2;
      orthographicCameraRef.current.bottom = -fr / 2;
      orthographicCameraRef.current.updateProjectionMatrix();
    } else {
      cameraSphericalRef.current.radius = Math.max(
        6,
        Math.min(60, cameraSphericalRef.current.radius + e.deltaY * 0.02)
      );
    }
    updateCameraPosition();
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    if (projectionMode === 'orthographic' && orthographicCameraRef.current) {
      orthoFrustumSizeRef.current = Math.max(8, Math.min(60, orthoFrustumSizeRef.current + delta * 2));
      const w = mountRef.current?.clientWidth || 800;
      const h = mountRef.current?.clientHeight || 600;
      const asp = w / h;
      const fr = orthoFrustumSizeRef.current;
      orthographicCameraRef.current.left = (-fr * asp) / 2;
      orthographicCameraRef.current.right = (fr * asp) / 2;
      orthographicCameraRef.current.top = fr / 2;
      orthographicCameraRef.current.bottom = -fr / 2;
      orthographicCameraRef.current.updateProjectionMatrix();
    } else {
      cameraSphericalRef.current.radius = Math.max(
        6,
        Math.min(60, cameraSphericalRef.current.radius + delta * 2)
      );
    }
    updateCameraPosition();
  };

  // Furniture in-3D adjustments
  const rotateSelected = (degrees = 90) => {
    if (!selectedItem) return;
    const nextRot = (selectedItem.rotation + degrees) % 360;
    updateFurniture(selectedItem.id, { rotation: nextRot });
  };

  const nudgeSelected = (dx: number, dy: number) => {
    if (!selectedItem) return;
    let newX = Math.max(0, Math.min(activeRoom.dimensions.length - selectedItem.width, selectedItem.x + dx));
    let newY = Math.max(0, Math.min(activeRoom.dimensions.width - selectedItem.depth, selectedItem.y + dy));
    newX = Math.round(newX * 4) / 4;
    newY = Math.round(newY * 4) / 4;
    updateFurniture(selectedItem.id, { x: newX, y: newY });
  };

  // Door in-3D adjustments
  const cycleDoorWall = (doorId: string, currentWall: WallSide) => {
    const wallOrder: WallSide[] = ['south', 'west', 'north', 'east'];
    const nextWall = wallOrder[(wallOrder.indexOf(currentWall) + 1) % wallOrder.length];
    updateDoor(doorId, { wall: nextWall, offset: 2.0 });
  };

  const cycleDoorSwing = (doorId: string, currentSwing: string) => {
    const swings: Array<'inside_left' | 'inside_right' | 'outside_left' | 'outside_right'> = [
      'inside_left',
      'inside_right',
      'outside_left',
      'outside_right',
    ];
    const nextSwing = swings[(swings.indexOf(currentSwing as any) + 1) % swings.length];
    updateDoor(doorId, { swing: nextSwing });
  };

  const nudgeDoorOffset = (doorId: string, currentOffset: number, delta: number) => {
    const isHorizontal = selectedDoor?.wall === 'north' || selectedDoor?.wall === 'south';
    const wallMax = isHorizontal ? activeRoom.dimensions.length : activeRoom.dimensions.width;
    const nextOffset = Math.max(0.5, Math.min(wallMax - (selectedDoor?.width || 3) - 0.5, currentOffset + delta));
    updateDoor(doorId, { offset: Math.round(nextOffset * 4) / 4 });
  };

  // Export High-Res Isometric Snapshot
  const exportSnapshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `AERA_360_View_${activeRoom.name.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    link.click();
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 3000);
  };

  // Toggle Fullscreen mode
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden select-none font-sans ${
        lightingMode === 'night_mood' ? 'bg-[#090B0E]' : 'bg-[#14161A]'
      }`}
    >
      {/* 3D Canvas Viewport */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* 360 IMMERSIVE HEADER BAR (Only visible in Full-Bleed 360 Mode) */}
      {is360ImmersiveView ? (
        <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-30">
          {/* Left: Exit 360 View Button */}
          <button
            onClick={() => setIs360ImmersiveView(false)}
            className="pointer-events-auto bg-[#161B22]/90 hover:bg-[#21262D] text-white border border-[#30363D] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all active:scale-95"
          >
            <BackIcon className="w-4 h-4 text-neutral-300" />
            <span>Exit 360° View</span>
          </button>

          {/* Center: Gold/Dark Glass Room Capsule */}
          <div className="bg-[#12151B]/95 border border-[#3A2F1D] shadow-2xl px-5 py-2 rounded-2xl flex items-center gap-2.5 text-xs backdrop-blur-md pointer-events-auto">
            <Compass className="w-4 h-4 text-[#D4AF37] animate-spin-slow" />
            <span className="font-extrabold text-[#D4AF37] uppercase tracking-wider text-[11px]">
              AERA 360° IMMERSIVE VIEW
            </span>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-200 font-semibold text-xs">
              {activeRoom.name}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400 font-mono text-[11px]">
              {activeRoom.dimensions.length} × {activeRoom.dimensions.width} × 10 ft
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-[#D4AF37] text-[11px] font-bold">
              {activeTheme.name}
            </span>
          </div>

          {/* Right: Auto Tour, Reset, Snapshot & Fullscreen Toolbar */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setIsAutoTour(!isAutoTour)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xl backdrop-blur-md border transition-all ${
                isAutoTour
                  ? 'bg-[#D4AF37] text-neutral-950 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                  : 'bg-[#161B22]/90 hover:bg-[#21262D] text-white border-[#30363D]'
              }`}
            >
              {isAutoTour ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Auto Tour</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Auto Tour</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                cameraSphericalRef.current = { radius: 24, theta: Math.PI / 4, phi: Math.PI / 3.4 };
                panOffsetRef.current.set(0, 0, 0);
                updateCameraPosition();
              }}
              title="Reset Angle"
              className="bg-[#161B22]/90 hover:bg-[#21262D] text-white border border-[#30363D] p-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xl backdrop-blur-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-300" />
            </button>

            <button
              onClick={exportSnapshot}
              title="Take Snapshot"
              className="bg-[#161B22]/90 hover:bg-[#21262D] text-white border border-[#30363D] px-2.5 py-2 rounded-xl shadow-2xl backdrop-blur-md transition-colors flex items-center gap-1 text-xs font-bold"
            >
              <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden xl:inline">{snapshotTaken ? 'Saved!' : 'Snapshot'}</span>
            </button>

            <button
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
              className="bg-[#161B22]/90 hover:bg-[#21262D] text-white border border-[#30363D] p-2 rounded-xl shadow-2xl backdrop-blur-md transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setIs360ImmersiveView(false)}
              title="Close"
              className="bg-[#161B22]/90 hover:bg-red-950/50 hover:text-red-300 text-neutral-400 border border-[#30363D] p-2 rounded-xl shadow-2xl backdrop-blur-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Regular 3D Studio Minimal Toolbar */
        <div className="absolute top-4 right-16 flex items-center gap-2 pointer-events-auto z-20">
          <button
            onClick={() => setIsAutoTour(!isAutoTour)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md backdrop-blur-md border transition-all ${
              isAutoTour
                ? 'bg-[#D4AF37] text-neutral-950 border-[#D4AF37]'
                : 'bg-white/90 dark:bg-[#161B22]/90 text-neutral-800 dark:text-white border-[#E8E6DF] dark:border-[#30363D]'
            }`}
          >
            {isAutoTour ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>Auto Tour</span>
          </button>
          <button
            onClick={exportSnapshot}
            title="Snapshot"
            className="p-1.5 bg-white/90 dark:bg-[#161B22]/90 text-neutral-800 dark:text-white border border-[#E8E6DF] dark:border-[#30363D] rounded-xl shadow-md backdrop-blur-md"
          >
            <Camera className="w-4 h-4 text-[#B26A4A]" />
          </button>
        </div>
      )}


      {/* BOTTOM LEFT: DARK / LIGHT MODE SWITCHER & DEBUG HUD */}
      <div className="absolute bottom-5 left-5 flex items-center gap-2.5 z-30 pointer-events-auto">
        {/* Dark / Light / Night Mode Pill Selector */}
        <div className="bg-[#161B22]/95 border border-[#30363D] p-1 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-1">
          <button
            onClick={() => setLightingMode('warm_evening')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              lightingMode === 'warm_evening'
                ? 'bg-[#FAF4ED] text-[#8C5232] shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-[#B26A4A]" />
            <span>Day</span>
          </button>

          <button
            onClick={() => setLightingMode('daylight')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              lightingMode === 'daylight'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => setLightingMode('night_mood')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              lightingMode === 'night_mood'
                ? 'bg-amber-400 text-neutral-950 font-black shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5 fill-current" />
            <span>Night</span>
          </button>
        </div>

        {/* Debug HUD Toggle (Only in 360 Mode or large screens) */}
        {is360ImmersiveView && (
          <button
            onClick={() => setShowDebugHUD(!showDebugHUD)}
            className={`hidden sm:flex px-2.5 py-1.5 rounded-xl text-[11px] font-bold border items-center gap-1.5 backdrop-blur-md transition-all ${
              showDebugHUD
                ? 'bg-[#1F242C] text-emerald-400 border-emerald-500/40 shadow-xs'
                : 'bg-[#161B22]/90 text-neutral-400 border-[#30363D] hover:text-white'
            }`}
          >
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>HUD</span>
          </button>
        )}
      </div>

      {/* DEBUG HUD INFO BOX (Shows when toggled) */}
      {showDebugHUD && is360ImmersiveView && (
        <div className="absolute bottom-16 left-5 bg-[#12151B]/95 border border-[#30363D] p-3 rounded-xl shadow-2xl text-[11px] font-mono text-neutral-300 z-30 backdrop-blur-md flex flex-col gap-1 select-text">
          <div className="text-[#D4AF37] font-bold text-xs">📐 3D Scene Metrics</div>
          <div>Azimuth (θ): {cameraSphericalRef.current.theta.toFixed(2)} rad ({( (cameraSphericalRef.current.theta * 180 / Math.PI) % 360 ).toFixed(0)}°)</div>
          <div>Elevation (φ): {cameraSphericalRef.current.phi.toFixed(2)} rad</div>
          <div>Distance (r): {cameraSphericalRef.current.radius.toFixed(1)} ft</div>
          <div>Furniture Items: {furniture.length} loaded</div>
          <div>Atmosphere: {lightingMode.toUpperCase()}</div>
        </div>
      )}

      {/* BOTTOM CENTER: NAVIGATION HINT (Only visible on wide screens to prevent overlap) */}
      {is360ImmersiveView && (
        <div className="hidden xl:flex absolute bottom-5 left-1/2 -translate-x-1/2 bg-[#161B22]/90 border border-[#30363D] px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-300 shadow-2xl pointer-events-none items-center gap-2 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Drag to explore 360° • Scroll to Zoom</span>
        </div>
      )}


      {/* BOTTOM RIGHT: SMOOTH ZOOM CONTROLS */}
      <div className="absolute bottom-5 right-5 flex items-center gap-1 bg-[#161B22]/95 border border-[#30363D] p-1 rounded-2xl shadow-2xl backdrop-blur-md z-30 pointer-events-auto">
        <button
          onClick={() => handleZoom(1.5)}
          title="Zoom Out"
          className="p-2 hover:bg-[#21262D] text-neutral-300 hover:text-white rounded-xl transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-1.5)}
          title="Zoom In"
          className="p-2 hover:bg-[#21262D] text-neutral-300 hover:text-white rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Floating 3D In-Place Adjustment HUD for Selected Furniture */}
      {selectedItem && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#161B22]/95 border border-[#3A2F1D] p-3.5 rounded-2xl shadow-2xl flex items-center gap-4 z-30 backdrop-blur-md animate-fadeIn text-white">
          <div className="border-r border-[#30363D] pr-3 text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs text-white">{selectedItem.name}</span>
              <span className="text-[10px] font-mono font-bold bg-[#3A2F1D] text-[#D4AF37] px-1.5 py-0.5 rounded">
                {selectedItem.width} × {selectedItem.depth} ft
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 font-medium block">
              Pos: ({selectedItem.x}ft, {selectedItem.y}ft) • Rot: {selectedItem.rotation}°
            </span>
          </div>

          {/* Quick Rotation Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => rotateSelected(90)}
              title="Rotate 90°"
              className="p-2 bg-[#21262D] hover:bg-[#30363D] text-white rounded-xl transition-colors border border-[#30363D] flex items-center gap-1 text-xs font-bold"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>90°</span>
            </button>
            <button
              onClick={() => rotateSelected(45)}
              title="Rotate 45°"
              className="p-2 bg-[#21262D] hover:bg-[#30363D] text-white rounded-xl transition-colors border border-[#30363D] text-xs font-bold"
            >
              45°
            </button>
          </div>

          {/* Nudge Position Controls */}
          <div className="grid grid-cols-3 gap-1 bg-[#12151B] p-1 rounded-xl border border-[#30363D]">
            <div />
            <button
              onClick={() => nudgeSelected(0, -0.5)}
              title="Nudge Up"
              className="p-1.5 hover:bg-[#21262D] text-neutral-300 rounded-lg flex items-center justify-center"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <div />
            <button
              onClick={() => nudgeSelected(-0.5, 0)}
              title="Nudge Left"
              className="p-1.5 hover:bg-[#21262D] text-neutral-300 rounded-lg flex items-center justify-center"
            >
              <ArrowLeft className="w-3 h-3" />
            </button>
            <div className="flex items-center justify-center text-[9px] font-mono text-neutral-400">
              0.5'
            </div>
            <button
              onClick={() => nudgeSelected(0.5, 0)}
              title="Nudge Right"
              className="p-1.5 hover:bg-[#21262D] text-neutral-300 rounded-lg flex items-center justify-center"
            >
              <ArrowRight className="w-3 h-3" />
            </button>
            <div />
            <button
              onClick={() => nudgeSelected(0, 0.5)}
              title="Nudge Down"
              className="p-1.5 hover:bg-[#21262D] text-neutral-300 rounded-lg flex items-center justify-center"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
            <div />
          </div>

          {/* Duplicate & Delete */}
          <div className="flex items-center gap-1 border-l border-[#30363D] pl-3">
            <button
              onClick={() => duplicateFurniture(selectedItem.id)}
              title="Duplicate piece"
              className="p-2 bg-[#21262D] hover:bg-[#30363D] text-neutral-300 rounded-xl border border-[#30363D]"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => removeFurniture(selectedItem.id)}
              title="Delete piece"
              className="p-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 rounded-xl border border-red-800/60"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating 3D In-Place Adjustment HUD for Selected Door */}
      {selectedDoor && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#161B22]/95 border border-amber-500/60 p-3.5 rounded-2xl shadow-2xl flex items-center gap-4 z-30 backdrop-blur-md animate-fadeIn text-white">
          <div className="border-r border-[#30363D] pr-3 text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs text-white">🚪 {selectedDoor.name}</span>
              <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-700/50">
                Wall: {selectedDoor.wall.toUpperCase()}
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 font-medium block">
              Offset: {selectedDoor.offset} ft • Width: {selectedDoor.width} ft
            </span>
          </div>

          {/* Flip Wall & Flip Swing */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => cycleDoorWall(selectedDoor.id, selectedDoor.wall)}
              className="px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-[#D4AF37] rounded-xl text-xs font-bold flex items-center gap-1 border border-[#30363D]"
            >
              <RefreshCw className="w-3 h-3 text-[#D4AF37]" />
              <span>Flip Wall</span>
            </button>

            <button
              onClick={() => cycleDoorSwing(selectedDoor.id, selectedDoor.swing)}
              className="px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-white rounded-xl text-xs font-bold border border-[#30363D]"
            >
              Flip Swing
            </button>
          </div>

          {/* Nudge Offset Along Wall */}
          <div className="flex items-center gap-1 bg-[#12151B] p-1 rounded-xl border border-[#30363D]">
            <button
              onClick={() => nudgeDoorOffset(selectedDoor.id, selectedDoor.offset, -0.5)}
              className="px-2 py-1 bg-[#21262D] hover:bg-[#30363D] text-white rounded-lg text-xs font-bold font-mono"
            >
              -0.5'
            </button>
            <span className="text-[10px] font-mono font-bold text-neutral-300 px-1">
              {selectedDoor.offset} ft
            </span>
            <button
              onClick={() => nudgeDoorOffset(selectedDoor.id, selectedDoor.offset, 0.5)}
              className="px-2 py-1 bg-[#21262D] hover:bg-[#30363D] text-white rounded-lg text-xs font-bold font-mono"
            >
              +0.5'
            </button>
          </div>

          {/* Delete Door */}
          <button
            onClick={() => removeDoor(selectedDoor.id)}
            title="Delete Door"
            className="p-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 rounded-xl border border-red-800/60"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
