import * as THREE from 'three';
import type { FurnitureItem } from '../types/furniture';
import type { ColorTheme } from '../types/theme';
import {
  createWoodFloorTexture,
  createMarbleTexture,
  createFabricTexture,
  createRugTexture,
} from './proceduralTextures';

/**
 * Builds realistic, dimensionally accurate 3D procedural architectural models for all furniture types.
 */
export function buildRealisticFurnitureMesh(
  item: FurnitureItem,
  theme: ColorTheme,
  isSelected: boolean
): THREE.Group {
  const group = new THREE.Group();
  group.name = `furniture_${item.id}`;
  group.userData = { id: item.id, item };

  // Theme materials & textures
  const woodColor = new THREE.Color(item.color || theme.palette.furniture || '#6E472A');
  const fabricColorHex = theme.palette.curtains || '#E6DFD5';
  const accentColor = new THREE.Color(theme.palette.accent || '#B26A4A');

  const woodTexture = createWoodFloorTexture('oak');
  const fabricTexture = createFabricTexture(fabricColorHex);
  const marbleTexture = createMarbleTexture();

  const woodMat = new THREE.MeshStandardMaterial({
    color: woodColor,
    roughness: 0.45,
    metalness: 0.05,
    map: woodTexture,
  });

  const flutedWoodMat = new THREE.MeshStandardMaterial({
    color: woodColor.clone().multiplyScalar(0.95),
    roughness: 0.5,
    metalness: 0.02,
  });

  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: '#1A1A1A',
    roughness: 0.25,
    metalness: 0.85,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: '#E5E7EB',
    roughness: 0.15,
    metalness: 0.95,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: '#D4AF37',
    roughness: 0.25,
    metalness: 0.92,
  });

  const fabricMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(fabricColorHex),
    roughness: 0.88,
    map: fabricTexture,
  });

  const accentFabricMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    roughness: 0.85,
  });

  const marbleMat = new THREE.MeshStandardMaterial({
    roughness: 0.2,
    metalness: 0.05,
    map: marbleTexture,
  });


  const frostedGlassMat = new THREE.MeshPhysicalMaterial({
    color: '#FFF8EB',
    roughness: 0.2,
    transmission: 0.8,
    thickness: 0.5,
    transparent: true,
    opacity: 0.85,
  });

  const W = Math.max(0.8, item.width);
  const D = Math.max(0.8, item.depth);
  const H = item.height || 2.5;

  const cat = (item.category || '').toLowerCase();
  const mType = (item.modelType || '').toLowerCase();
  const title = (item.name || '').toLowerCase();

  // Helper to enable shadows recursively
  const tagShadows = (mesh: THREE.Object3D) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  };

  // =========================================================================
  // 1. BED / MASTER BED / GUEST BED
  // =========================================================================
  if (cat === 'bedroom' && (mType.includes('bed') || title.includes('bed'))) {
    // Area Rug under the bed
    const rugGeo = new THREE.PlaneGeometry(W + 2.5, D + 2.0);
    const rugMat = new THREE.MeshStandardMaterial({
      roughness: 0.9,
      map: createRugTexture('neutral'),
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.015, 0.4);
    rug.receiveShadow = true;
    group.add(rug);

    // Bedframe Platform with Oak Chamfer
    const baseHeight = 0.75;
    const baseGeo = new THREE.BoxGeometry(W, baseHeight, D);
    const base = new THREE.Mesh(baseGeo, woodMat);
    base.position.y = baseHeight / 2 + 0.15;
    tagShadows(base);
    group.add(base);

    // 4 Brass Tapered Legs
    const legGeo = new THREE.CylinderGeometry(0.08, 0.05, 0.3, 16);
    const legPositions = [
      [-W / 2 + 0.2, 0.15, -D / 2 + 0.2],
      [W / 2 - 0.2, 0.15, -D / 2 + 0.2],
      [-W / 2 + 0.2, 0.15, D / 2 - 0.2],
      [W / 2 - 0.2, 0.15, D / 2 - 0.2],
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, brassMat);
      leg.position.set(lx, ly, lz);
      tagShadows(leg);
      group.add(leg);
    });

    // Padded Premium Mattress
    const matHeight = 0.85;
    const matGeo = new THREE.BoxGeometry(W - 0.2, matHeight, D - 0.3);
    const mattress = new THREE.Mesh(matGeo, fabricMat);
    mattress.position.set(0, baseHeight + matHeight / 2 + 0.05, 0.1);
    tagShadows(mattress);
    group.add(mattress);

    // Fluted Wood / Bouclé Headboard
    const headboardHeight = 2.6;
    const headboardDepth = 0.35;
    const headboardGeo = new THREE.BoxGeometry(W + 0.3, headboardHeight, headboardDepth);
    const headboard = new THREE.Mesh(headboardGeo, fabricMat);
    headboard.position.set(0, headboardHeight / 2 + 0.15, -D / 2 + headboardDepth / 2);
    tagShadows(headboard);
    group.add(headboard);

    // Headboard warm LED cove backlight strip
    const headboardLed = new THREE.PointLight('#FFE6C2', 0.6, 6);
    headboardLed.position.set(0, headboardHeight + 0.2, -D / 2 + 0.4);
    group.add(headboardLed);

    // Duvet / Bed Runner Fold
    const duvetGeo = new THREE.BoxGeometry(W - 0.15, 0.14, D * 0.55);
    const duvet = new THREE.Mesh(duvetGeo, accentFabricMat);
    duvet.position.set(0, baseHeight + matHeight + 0.07, 0.35);
    tagShadows(duvet);
    group.add(duvet);

    // Layered Pillows
    const pillowGeo = new THREE.BoxGeometry((W - 0.8) / 2, 0.3, 1.1);
    const pillowMat = new THREE.MeshStandardMaterial({ color: '#FAF8F5', roughness: 0.85 });
    const p1 = new THREE.Mesh(pillowGeo, pillowMat);
    p1.position.set(-(W - 0.8) / 4 - 0.15, baseHeight + matHeight + 0.16, -D / 2 + 0.9);
    p1.rotation.x = -0.15;
    tagShadows(p1);

    const p2 = p1.clone();
    p2.position.x = (W - 0.8) / 4 + 0.15;
    tagShadows(p2);

    // Accent throw pillows
    const accPillowGeo = new THREE.BoxGeometry(0.8, 0.22, 0.8);
    const accP1 = new THREE.Mesh(accPillowGeo, accentFabricMat);
    accP1.position.set(-(W - 0.8) / 4 - 0.15, baseHeight + matHeight + 0.25, -D / 2 + 1.4);
    accP1.rotation.x = -0.25;
    tagShadows(accP1);

    const accP2 = accP1.clone();
    accP2.position.x = (W - 0.8) / 4 + 0.15;
    tagShadows(accP2);

    group.add(p1, p2, accP1, accP2);
  }

  // =========================================================================
  // 2. NIGHTSTAND / SIDE TABLE
  // =========================================================================
  else if (mType.includes('nightstand') || title.includes('side table') || title.includes('nightstand') || title.includes('end_table')) {
    const tableH = Math.min(H, 1.8);
    // Drawer Cabinet Body
    const cabinetH = tableH * 0.7;
    const cabinetGeo = new THREE.BoxGeometry(W, cabinetH, D);
    const cabinet = new THREE.Mesh(cabinetGeo, flutedWoodMat);
    cabinet.position.y = cabinetH / 2 + (tableH - cabinetH);
    tagShadows(cabinet);
    group.add(cabinet);

    // Brushed Brass Drawer Pull
    const pullGeo = new THREE.BoxGeometry(W * 0.35, 0.04, 0.04);
    const pull = new THREE.Mesh(pullGeo, brassMat);
    pull.position.set(0, tableH - cabinetH / 2, D / 2 + 0.03);
    tagShadows(pull);
    group.add(pull);

    // 4 Slim Metal Legs
    const legGeo = new THREE.CylinderGeometry(0.04, 0.03, tableH - cabinetH, 16);
    [
      [-W / 2 + 0.12, -D / 2 + 0.12],
      [W / 2 - 0.12, -D / 2 + 0.12],
      [-W / 2 + 0.12, D / 2 - 0.12],
      [W / 2 - 0.12, D / 2 - 0.12],
    ].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, darkMetalMat);
      leg.position.set(lx, (tableH - cabinetH) / 2, lz);
      tagShadows(leg);
      group.add(leg);
    });

    // Bedside Lamp on Top
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.08, 24), brassMat);
    lampBase.position.set(0, tableH + 0.04, 0);

    const lampSphere = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), frostedGlassMat);
    lampSphere.position.set(0, tableH + 0.32, 0);

    const lampGlow = new THREE.PointLight('#FFE2B8', 0.6, 4.5);
    lampGlow.position.set(0, tableH + 0.35, 0);

    group.add(lampBase, lampSphere, lampGlow);
  }

  // =========================================================================
  // 3. STUDY DESK / OFFICE WORKSTATION
  // =========================================================================
  else if (cat === 'office' || mType.includes('desk') || title.includes('desk') || (title.includes('table') && !title.includes('coffee') && !title.includes('side'))) {
    const deskH = 1.45;

    // Solid Oak Desktop with beveled front edge
    const topGeo = new THREE.BoxGeometry(W, 0.12, D);
    const top = new THREE.Mesh(topGeo, woodMat);
    top.position.y = deskH;
    tagShadows(top);
    group.add(top);

    // Slim Hairpin Black Legs
    const legGeo = new THREE.CylinderGeometry(0.05, 0.04, deskH, 16);
    [
      [-W / 2 + 0.25, -D / 2 + 0.25],
      [W / 2 - 0.25, -D / 2 + 0.25],
      [-W / 2 + 0.25, D / 2 - 0.25],
      [W / 2 - 0.25, D / 2 - 0.25],
    ].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, darkMetalMat);
      leg.position.set(lx, deskH / 2, lz);
      tagShadows(leg);
      group.add(leg);
    });

    // Laptop with glowing screen
    const laptopBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.03, 0.75),
      new THREE.MeshStandardMaterial({ color: '#E5E7EB', metalness: 0.9, roughness: 0.2 })
    );
    laptopBase.position.set(0, deskH + 0.07, 0.05);

    const laptopScreen = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.7, 0.03),
      new THREE.MeshBasicMaterial({ color: '#1E293B' })
    );
    laptopScreen.position.set(0, deskH + 0.42, -0.3);
    laptopScreen.rotation.x = -0.15;

    const screenGlow = new THREE.PointLight('#93C5FD', 0.5, 3.5);
    screenGlow.position.set(0, deskH + 0.45, 0.1);

    // Designer brass task lamp
    const lampPost = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 16), brassMat);
    lampPost.position.set(W / 2 - 0.45, deskH + 0.35, -D / 2 + 0.4);

    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.25, 24), brassMat);
    lampShade.position.set(W / 2 - 0.55, deskH + 0.7, -D / 2 + 0.4);
    lampShade.rotation.z = -0.6;

    const lampLight = new THREE.PointLight('#FFF1D6', 0.6, 4.0);
    lampLight.position.set(W / 2 - 0.6, deskH + 0.6, -D / 2 + 0.4);

    group.add(top, laptopBase, laptopScreen, screenGlow, lampPost, lampShade, lampLight);
  }

  // =========================================================================
  // 4. OFFICE CHAIR / ERGONOMIC DESK CHAIR
  // =========================================================================
  else if (mType.includes('chair') || title.includes('chair') || title.includes('armchair')) {
    const seatW = Math.min(W, 1.8);
    const seatD = Math.min(D, 1.8);


    // Contoured Padded Seat Cushion
    const seatGeo = new THREE.BoxGeometry(seatW, 0.18, seatD);
    const seat = new THREE.Mesh(seatGeo, darkMetalMat);
    seat.position.set(0, 0.85, 0);
    tagShadows(seat);
    group.add(seat);

    // Contoured Ergonomic Mesh Backrest
    const backGeo = new THREE.BoxGeometry(seatW * 0.9, 1.1, 0.12);
    const back = new THREE.Mesh(backGeo, darkMetalMat);
    back.position.set(0, 1.4, -seatD / 2 + 0.08);
    back.rotation.x = -0.1;
    tagShadows(back);
    group.add(back);

    // Chrome Center Cylinder Column
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16), chromeMat);
    column.position.set(0, 0.55, 0);
    group.add(column);

    // 5-Star Caster Base
    for (let c = 0; c < 5; c++) {
      const angle = (c * Math.PI * 2) / 5;
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.7), chromeMat);
      arm.position.set(Math.sin(angle) * 0.35, 0.25, Math.cos(angle) * 0.35);
      arm.rotation.y = angle;
      group.add(arm);

      // Caster Wheel
      const wheel = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), darkMetalMat);
      wheel.position.set(Math.sin(angle) * 0.68, 0.1, Math.cos(angle) * 0.68);
      group.add(wheel);
    }
  }

  // =========================================================================
  // 5. WARDROBE / CLOSET (Fluted Doors & Brass Handles)
  // =========================================================================
  else if (cat === 'storage' || mType.includes('wardrobe') || title.includes('wardrobe') || title.includes('cupboard')) {
    const wardrobeHeight = Math.max(3.8, H);
    const cabinetGeo = new THREE.BoxGeometry(W, wardrobeHeight, D);
    const cabinet = new THREE.Mesh(cabinetGeo, woodMat);
    cabinet.position.y = wardrobeHeight / 2;
    tagShadows(cabinet);
    group.add(cabinet);

    // Door dividers & Full-Height Brass Handles
    const doorCount = W > 5 ? 4 : 2;
    const doorWidth = W / doorCount;
    for (let i = 1; i < doorCount; i++) {
      const grooveGeo = new THREE.BoxGeometry(0.04, wardrobeHeight - 0.2, 0.05);
      const groove = new THREE.Mesh(grooveGeo, new THREE.MeshBasicMaterial({ color: '#1A1A1A' }));
      groove.position.set(-W / 2 + i * doorWidth, wardrobeHeight / 2, D / 2 + 0.01);
      group.add(groove);
    }

    for (let i = 0; i < doorCount; i++) {
      const handleGeo = new THREE.BoxGeometry(0.04, 1.4, 0.06);
      const handle = new THREE.Mesh(handleGeo, brassMat);
      const isLeft = i % 2 === 0;
      handle.position.set(
        -W / 2 + (i + 0.5) * doorWidth + (isLeft ? doorWidth * 0.35 : -doorWidth * 0.35),
        wardrobeHeight * 0.5,
        D / 2 + 0.04
      );
      tagShadows(handle);
      group.add(handle);
    }
  }

  // =========================================================================
  // 6. SOFA / COUCH
  // =========================================================================
  else if (cat === 'living' && (mType.includes('sofa') || title.includes('sofa') || title.includes('couch'))) {
    // Area Rug
    const rugGeo = new THREE.PlaneGeometry(W + 2.0, D + 2.5);
    const rugMat = new THREE.MeshStandardMaterial({
      roughness: 0.92,
      map: createRugTexture('sage'),
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.015, 0.5);
    rug.receiveShadow = true;
    group.add(rug);

    // Sofa Base Cushion
    const seatHeight = 0.75;
    const seatGeo = new THREE.BoxGeometry(W, seatHeight, D - 0.4);
    const seat = new THREE.Mesh(seatGeo, fabricMat);
    seat.position.set(0, seatHeight / 2 + 0.2, 0.1);
    tagShadows(seat);
    group.add(seat);

    // Backrest
    const backHeight = 1.6;
    const backDepth = 0.5;
    const backGeo = new THREE.BoxGeometry(W, backHeight, backDepth);
    const back = new THREE.Mesh(backGeo, fabricMat);
    back.position.set(0, backHeight / 2 + 0.3, -D / 2 + backDepth / 2);
    tagShadows(back);
    group.add(back);

    // Left & Right Armrests
    const armWidth = 0.35;
    const armHeight = 1.1;
    const armGeo = new THREE.BoxGeometry(armWidth, armHeight, D);
    const leftArm = new THREE.Mesh(armGeo, fabricMat);
    leftArm.position.set(-W / 2 + armWidth / 2, armHeight / 2 + 0.2, 0);
    tagShadows(leftArm);

    const rightArm = new THREE.Mesh(armGeo, fabricMat);
    rightArm.position.set(W / 2 - armWidth / 2, armHeight / 2 + 0.2, 0);
    tagShadows(rightArm);
    group.add(leftArm, rightArm);

    // Cushions
    const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.25), accentFabricMat);
    c1.position.set(-W / 2 + 0.8, seatHeight + 0.45, -D / 2 + 0.55);
    c1.rotation.y = 0.2;
    tagShadows(c1);

    const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.25), accentFabricMat);
    c2.position.set(W / 2 - 0.8, seatHeight + 0.45, -D / 2 + 0.55);
    c2.rotation.y = -0.2;
    tagShadows(c2);
    group.add(c1, c2);
  }

  // =========================================================================
  // 7. TELEVISION & MEDIA CONSOLE
  // =========================================================================
  else if (mType.includes('tv') || title.includes('television') || title.includes('tv') || title.includes('entertainment')) {
    const tvW = Math.min(W, 5.0);
    const tvH = 2.8;

    const consoleH = 1.2;
    const consoleMesh = new THREE.Mesh(new THREE.BoxGeometry(W, consoleH, D), woodMat);
    consoleMesh.position.y = consoleH / 2;
    tagShadows(consoleMesh);

    const tvPanel = new THREE.Mesh(
      new THREE.BoxGeometry(tvW * 0.85, tvH * 0.85, 0.08),
      new THREE.MeshBasicMaterial({ color: '#111827' })
    );
    tvPanel.position.set(0, consoleH + (tvH * 0.85) / 2 + 0.15, 0);
    tagShadows(tvPanel);

    const tvGlow = new THREE.PointLight('#7DD3FC', 0.5, 4.5);
    tvGlow.position.set(0, consoleH + (tvH * 0.85) / 2 + 0.15, -0.15);

    group.add(consoleMesh, tvPanel, tvGlow);
  }

  // =========================================================================
  // 8. POUF / OTTOMAN
  // =========================================================================
  else if (mType.includes('pouf') || mType.includes('ottoman') || title.includes('pouf') || title.includes('ottoman')) {
    const poufH = Math.min(H, 1.4);
    const poufGeo = new THREE.CylinderGeometry(W / 2, W / 2, poufH - 0.15, 32);
    const poufMesh = new THREE.Mesh(poufGeo, accentFabricMat);
    poufMesh.position.y = (poufH - 0.15) / 2 + 0.15;
    tagShadows(poufMesh);

    const brassRing = new THREE.Mesh(
      new THREE.CylinderGeometry(W / 2 + 0.02, W / 2 + 0.02, 0.15, 32),
      brassMat
    );
    brassRing.position.y = 0.075;
    tagShadows(brassRing);

    group.add(poufMesh, brassRing);
  }

  // =========================================================================
  // 9. DINING TABLE
  // =========================================================================
  else if (cat === 'dining' || mType.includes('dining') || title.includes('dining')) {
    const tableH = 1.45;
    const top = new THREE.Mesh(new THREE.BoxGeometry(W, 0.14, D), marbleMat);
    top.position.y = tableH;
    tagShadows(top);
    group.add(top);

    const baseLegGeo = new THREE.BoxGeometry(0.12, tableH, D * 0.7);
    const legLeft = new THREE.Mesh(baseLegGeo, darkMetalMat);
    legLeft.position.set(-W / 2 + 0.6, tableH / 2, 0);
    const legRight = legLeft.clone();
    legRight.position.x = W / 2 - 0.6;
    tagShadows(legLeft);
    tagShadows(legRight);
    group.add(legLeft, legRight);
  }

  // =========================================================================
  // 10. BOTANICAL PLANTER
  // =========================================================================
  else if (cat === 'decor' || mType.includes('plant') || title.includes('plant')) {
    const potHeight = 0.8;
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.35, potHeight, 24),
      new THREE.MeshStandardMaterial({ color: '#D97706', roughness: 0.8 })
    );
    pot.position.y = potHeight / 2 + 0.2;
    tagShadows(pot);

    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 0.9), darkMetalMat);
    stand.position.y = 0.12;
    group.add(pot, stand);

    const leafMat = new THREE.MeshStandardMaterial({
      color: '#2E6930',
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    for (let l = 0; l < 8; l++) {
      const angle = (l * Math.PI * 2) / 8;
      const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 1.1), leafMat);
      leaf.position.set(Math.sin(angle) * 0.2, potHeight + 0.7, Math.cos(angle) * 0.2);
      leaf.rotation.y = angle;
      leaf.rotation.x = 0.4;
      tagShadows(leaf);
      group.add(leaf);
    }
  }

  // =========================================================================
  // 11. GENERIC FALLBACK
  // =========================================================================
  else {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), woodMat);
    mesh.position.y = H / 2;
    tagShadows(mesh);
    group.add(mesh);
  }

  // =========================================================================
  // SELECTION GLOW & BOUNDING RING
  // =========================================================================
  if (isSelected) {
    const outlineGeo = new THREE.RingGeometry(Math.max(W, D) * 0.55, Math.max(W, D) * 0.62, 32);
    const outlineMat = new THREE.MeshBasicMaterial({ color: '#D97706', side: THREE.DoubleSide });
    const outline = new THREE.Mesh(outlineGeo, outlineMat);
    outline.rotation.x = -Math.PI / 2;
    outline.position.y = 0.03;
    group.add(outline);

    const boxHelper = new THREE.BoxHelper(group, 0xd97706);
    group.add(boxHelper);
  }

  return group;
}
