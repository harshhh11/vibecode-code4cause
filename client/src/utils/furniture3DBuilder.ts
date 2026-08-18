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
 * Builds realistic, dimensionally accurate 3D procedural models for all furniture types.
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
    roughness: 0.55,
    metalness: 0.05,
    map: woodTexture,
  });

  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: '#1F1F1F',
    roughness: 0.35,
    metalness: 0.8,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: '#D4AF37',
    roughness: 0.3,
    metalness: 0.9,
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

  const leatherMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#6E472A'),
    roughness: 0.4,
    metalness: 0.1,
  });

  const marbleMat = new THREE.MeshStandardMaterial({
    roughness: 0.25,
    metalness: 0.05,
    map: marbleTexture,
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

  // ==========================================
  // 1. BED / MASTER BED / GUEST BED
  // ==========================================
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

    // Bedframe Platform
    const baseHeight = 0.7;
    const baseGeo = new THREE.BoxGeometry(W, baseHeight, D);
    const base = new THREE.Mesh(baseGeo, woodMat);
    base.position.y = baseHeight / 2 + 0.15;
    tagShadows(base);
    group.add(base);

    // 4 Tapered Bedframe Legs with brass feet
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

    // Padded Mattress
    const matHeight = 0.85;
    const matGeo = new THREE.BoxGeometry(W - 0.2, matHeight, D - 0.3);
    const mattress = new THREE.Mesh(matGeo, fabricMat);
    mattress.position.set(0, baseHeight + matHeight / 2 + 0.05, 0.1);
    tagShadows(mattress);
    group.add(mattress);

    // Fluted Headboard
    const headboardHeight = 2.4;
    const headboardDepth = 0.35;
    const headboardGeo = new THREE.BoxGeometry(W + 0.2, headboardHeight, headboardDepth);
    const headboard = new THREE.Mesh(headboardGeo, fabricMat);
    headboard.position.set(0, headboardHeight / 2 + 0.15, -D / 2 + headboardDepth / 2);
    tagShadows(headboard);
    group.add(headboard);

    // Headboard warm LED cove backlight strip
    const headboardLed = new THREE.PointLight('#FFE6C2', 0.6, 6);
    headboardLed.position.set(0, headboardHeight + 0.2, -D / 2 + 0.4);
    group.add(headboardLed);

    // Duvet / Bed Runner Fold
    const duvetGeo = new THREE.BoxGeometry(W - 0.15, 0.12, D * 0.55);
    const duvet = new THREE.Mesh(duvetGeo, accentFabricMat);
    duvet.position.set(0, baseHeight + matHeight + 0.06, 0.35);
    tagShadows(duvet);
    group.add(duvet);

    // Pillows
    const pillowGeo = new THREE.BoxGeometry((W - 0.8) / 2, 0.28, 1.1);
    const pillowMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.9 });
    const p1 = new THREE.Mesh(pillowGeo, pillowMat);
    p1.position.set(-(W - 0.8) / 4 - 0.15, baseHeight + matHeight + 0.15, -D / 2 + 0.9);
    p1.rotation.x = -0.15;
    tagShadows(p1);

    const p2 = p1.clone();
    p2.position.x = (W - 0.8) / 4 + 0.15;
    tagShadows(p2);
    group.add(p1, p2);
  }

  // ==========================================
  // 2. POUF / OTTOMAN / FLOOR CUSHION
  // ==========================================
  else if (mType.includes('pouf') || mType.includes('ottoman') || mType.includes('floor_cushion') || title.includes('pouf') || title.includes('ottoman')) {
    const poufH = Math.min(H, 1.5);
    if (mType.includes('leather') || mType.includes('ottoman')) {
      // Leather Cube Ottoman with Tufting
      const cubeGeo = new THREE.BoxGeometry(W, poufH, D);
      const cube = new THREE.Mesh(cubeGeo, leatherMat);
      cube.position.y = poufH / 2;
      tagShadows(cube);
      group.add(cube);

      // Brass Corner Corner Protectors
      const footGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.1, 16);
      [[-W/2+0.1, -D/2+0.1], [W/2-0.1, -D/2+0.1], [-W/2+0.1, D/2-0.1], [W/2-0.1, D/2-0.1]].forEach(([fx, fz]) => {
        const foot = new THREE.Mesh(footGeo, brassMat);
        foot.position.set(fx, 0.05, fz);
        group.add(foot);
      });
    } else {
      // Round Cylinder Velvet / Bouclé Pouf with Brass Base
      const poufGeo = new THREE.CylinderGeometry(W / 2, W / 2, poufH - 0.15, 32);
      const poufMesh = new THREE.Mesh(poufGeo, accentFabricMat);
      poufMesh.position.y = (poufH - 0.15) / 2 + 0.15;
      tagShadows(poufMesh);

      const brassRing = new THREE.Mesh(new THREE.CylinderGeometry(W / 2 + 0.02, W / 2 + 0.02, 0.15, 32), brassMat);
      brassRing.position.y = 0.075;
      tagShadows(brassRing);

      group.add(poufMesh, brassRing);
    }
  }

  // ==========================================
  // 3. BOOKSHELF / DISPLAY CABINET / OPEN SHELVING
  // ==========================================
  else if (mType.includes('bookshelf') || mType.includes('bookcase') || title.includes('bookshelf') || title.includes('bookcase') || title.includes('shelving')) {
    const shelfH = Math.max(H, 6.0);
    // Outer Frame
    const frameGeo = new THREE.BoxGeometry(W, shelfH, D);
    const frameMat = woodMat;
    const outerFrame = new THREE.Mesh(frameGeo, frameMat);
    outerFrame.position.y = shelfH / 2;
    tagShadows(outerFrame);
    group.add(outerFrame);

    // 5 Tier Shelves with colorful book stacks
    const tiers = 5;
    const tierH = shelfH / tiers;
    const bookColors = ['#DC2626', '#2563EB', '#D97706', '#059669', '#7C3AED', '#4B5563'];

    for (let t = 1; t < tiers; t++) {
      const shelfY = t * tierH;
      // Shelf Divider Line
      const shelfLine = new THREE.Mesh(new THREE.BoxGeometry(W - 0.1, 0.06, D + 0.02), darkMetalMat);
      shelfLine.position.y = shelfY;
      group.add(shelfLine);

      // Book clusters on this shelf
      const bookCount = Math.floor(Math.random() * 4) + 3;
      for (let b = 0; b < bookCount; b++) {
        const bW = 0.12 + Math.random() * 0.1;
        const bH = 0.6 + Math.random() * 0.4;
        const bD = D * 0.75;
        const bColor = bookColors[(t + b) % bookColors.length];
        const bookMesh = new THREE.Mesh(
          new THREE.BoxGeometry(bW, bH, bD),
          new THREE.MeshStandardMaterial({ color: bColor, roughness: 0.6 })
        );
        bookMesh.position.set(-W / 2 + 0.3 + b * 0.25, shelfY + bH / 2 + 0.03, 0);
        tagShadows(bookMesh);
        group.add(bookMesh);
      }

      // Miniature Planter / Vase on alternate shelves
      if (t % 2 === 0) {
        const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.1, 0.4, 16), brassMat);
        vase.position.set(W / 2 - 0.4, shelfY + 0.2, 0);
        group.add(vase);
      }
    }
  }

  // ==========================================
  // 4. TELEVISION & ENTERTAINMENT WALL / UNIT
  // ==========================================
  else if (mType.includes('tv') || title.includes('television') || title.includes('tv') || title.includes('entertainment')) {
    const isWallMounted = mType.includes('wall') || title.includes('wall');
    const tvW = Math.min(W, 5.0);
    const tvH = 2.8;

    if (isWallMounted) {
      // Slim OLED Screen
      const tvPanel = new THREE.Mesh(
        new THREE.BoxGeometry(tvW, tvH, 0.08),
        new THREE.MeshBasicMaterial({ color: '#111827' })
      );
      tvPanel.position.set(0, 3.2, 0);
      tagShadows(tvPanel);

      // Wall Mount Bracket & Backlit LED Glow
      const ledBacklight = new THREE.PointLight('#60A5FA', 0.6, 5);
      ledBacklight.position.set(0, 3.2, -0.15);

      // Slim Wall Soundbar
      const soundbar = new THREE.Mesh(
        new THREE.BoxGeometry(tvW * 0.7, 0.15, 0.15),
        new THREE.MeshStandardMaterial({ color: '#1E293B', roughness: 0.3 })
      );
      soundbar.position.set(0, 3.2 - tvH / 2 - 0.25, 0);
      tagShadows(soundbar);

      group.add(tvPanel, ledBacklight, soundbar);
    } else {
      // Console Base + OLED TV
      const consoleH = 1.2;
      const consoleMesh = new THREE.Mesh(new THREE.BoxGeometry(W, consoleH, D), woodMat);
      consoleMesh.position.y = consoleH / 2;
      tagShadows(consoleMesh);

      const tvPanel = new THREE.Mesh(
        new THREE.BoxGeometry(tvW * 0.85, tvH * 0.85, 0.08),
        new THREE.MeshBasicMaterial({ color: '#111827' })
      );
      tvPanel.position.set(0, consoleH + tvH * 0.85 / 2 + 0.15, 0);
      tagShadows(tvPanel);

      const tvGlow = new THREE.PointLight('#7DD3FC', 0.5, 4.5);
      tvGlow.position.set(0, consoleH + tvH * 0.85 / 2 + 0.15, -0.15);

      group.add(consoleMesh, tvPanel, tvGlow);
    }
  }

  // ==========================================
  // 5. STUDY DESK / OFFICE / COMPUTER WORKSTATION
  // ==========================================
  else if (cat === 'office' || mType.includes('desk') || title.includes('desk') || title.includes('table_study')) {
    const isLDesk = mType.includes('desk_l') || title.includes('l-shape');
    const deskH = 1.4;

    // Solid Wood Tabletop
    const topGeo = new THREE.BoxGeometry(W, 0.12, D);
    const top = new THREE.Mesh(topGeo, woodMat);
    top.position.y = deskH;
    tagShadows(top);
    group.add(top);

    if (isLDesk) {
      // Return L-Wing
      const returnGeo = new THREE.BoxGeometry(D * 0.8, 0.12, W * 0.6);
      const returnTop = new THREE.Mesh(returnGeo, woodMat);
      returnTop.position.set(-W / 2 + (D * 0.8) / 2, deskH, D / 2 + (W * 0.6) / 2 - 0.2);
      tagShadows(returnTop);
      group.add(returnTop);
    }

    // Drawer Pedestal
    const pedestalW = Math.min(1.4, W * 0.35);
    const pedestalGeo = new THREE.BoxGeometry(pedestalW, deskH - 0.12, D - 0.1);
    const pedestal = new THREE.Mesh(pedestalGeo, woodMat);
    pedestal.position.set(-W / 2 + pedestalW / 2 + 0.1, (deskH - 0.12) / 2, 0);
    tagShadows(pedestal);
    group.add(pedestal);

    // Metal Legs
    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, deskH, 16);
    const rLeg1 = new THREE.Mesh(legGeo, darkMetalMat);
    rLeg1.position.set(W / 2 - 0.2, deskH / 2, -D / 2 + 0.2);
    const rLeg2 = new THREE.Mesh(legGeo, darkMetalMat);
    rLeg2.position.set(W / 2 - 0.2, deskH / 2, D / 2 - 0.2);
    tagShadows(rLeg1);
    tagShadows(rLeg2);
    group.add(rLeg1, rLeg2);

    // Desktop Monitor & Illuminated Screen
    const monGeo = new THREE.BoxGeometry(Math.min(2.0, W * 0.6), 0.8, 0.08);
    const monitor = new THREE.Mesh(monGeo, new THREE.MeshBasicMaterial({ color: '#2B3945' }));
    monitor.position.set(0.2, deskH + 0.55, -D / 2 + 0.4);
    tagShadows(monitor);

    const screenGlow = new THREE.PointLight('#7DD3FC', 0.5, 3.5);
    screenGlow.position.set(0.2, deskH + 0.6, -D / 2 + 0.8);

    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 16), darkMetalMat);
    stand.position.set(0.2, deskH + 0.2, -D / 2 + 0.4);

    const kb = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.03, 0.35), new THREE.MeshStandardMaterial({ color: '#262626', roughness: 0.4 }));
    kb.position.set(0.2, deskH + 0.07, 0.1);

    group.add(monitor, screenGlow, stand, kb);
  }

  // ==========================================
  // 6. VANITY DRESSING TABLE & ILLUMINATED MIRROR
  // ==========================================
  else if (mType.includes('vanity') || title.includes('vanity') || title.includes('dresser_vanity')) {
    const tableH = 1.4;
    // Table body
    const table = new THREE.Mesh(new THREE.BoxGeometry(W, tableH, D), woodMat);
    table.position.y = tableH / 2;
    tagShadows(table);
    group.add(table);

    // Circular Illuminated LED Vanity Mirror
    const mirrorRadius = Math.min(W * 0.4, 1.4);
    const mirrorRing = new THREE.Mesh(
      new THREE.RingGeometry(mirrorRadius - 0.05, mirrorRadius, 32),
      new THREE.MeshBasicMaterial({ color: '#FFF8E7', side: THREE.DoubleSide })
    );
    mirrorRing.position.set(0, tableH + mirrorRadius + 0.2, -D / 2 + 0.05);

    const mirrorGlass = new THREE.Mesh(
      new THREE.CircleGeometry(mirrorRadius - 0.05, 32),
      new THREE.MeshPhysicalMaterial({ color: '#E0F2FE', roughness: 0.0, reflectivity: 1.0 })
    );
    mirrorGlass.position.set(0, tableH + mirrorRadius + 0.2, -D / 2 + 0.04);

    const mirrorGlow = new THREE.PointLight('#FFF1D6', 0.8, 5);
    mirrorGlow.position.set(0, tableH + mirrorRadius + 0.2, -D / 2 + 0.3);

    // Vanity Stool with Velvet Cushion
    const stoolMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.7, 24), accentFabricMat);
    stoolMesh.position.set(0, 0.35, D / 2 + 0.6);
    tagShadows(stoolMesh);

    group.add(mirrorRing, mirrorGlass, mirrorGlow, stoolMesh);
  }

  // ==========================================
  // 7. SOFA / SECTIONAL / COUCH
  // ==========================================
  else if (cat === 'living' && (mType.includes('sofa') || title.includes('sofa') || title.includes('couch'))) {
    // Area Rug under the sofa
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

    // Sofa Base Seat Cushion
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

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.06, 0.04, 0.4, 16);
    [[-W / 2 + 0.25, -D / 2 + 0.25], [W / 2 - 0.25, -D / 2 + 0.25], [-W / 2 + 0.25, D / 2 - 0.25], [W / 2 - 0.25, D / 2 - 0.25]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, darkMetalMat);
      leg.position.set(lx, 0.2, lz);
      tagShadows(leg);
      group.add(leg);
    });

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

  // ==========================================
  // 8. WARDROBE / CLOSET
  // ==========================================
  else if (cat === 'storage' && (mType.includes('wardrobe') || title.includes('wardrobe'))) {
    const wardrobeHeight = Math.max(3.8, H);
    const cabinetGeo = new THREE.BoxGeometry(W, wardrobeHeight, D);
    const cabinet = new THREE.Mesh(cabinetGeo, woodMat);
    cabinet.position.y = wardrobeHeight / 2;
    tagShadows(cabinet);
    group.add(cabinet);

    // Door dividers & Brass Handles
    const doorCount = W > 5 ? 4 : 2;
    const doorWidth = W / doorCount;
    for (let i = 1; i < doorCount; i++) {
      const grooveGeo = new THREE.BoxGeometry(0.04, wardrobeHeight - 0.2, 0.05);
      const groove = new THREE.Mesh(grooveGeo, new THREE.MeshBasicMaterial({ color: '#1A1A1A' }));
      groove.position.set(-W / 2 + i * doorWidth, wardrobeHeight / 2, D / 2 + 0.01);
      group.add(groove);
    }

    for (let i = 0; i < doorCount; i++) {
      const handleGeo = new THREE.BoxGeometry(0.04, 1.2, 0.06);
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

  // ==========================================
  // 9. DINING TABLE & CHAIRS SET
  // ==========================================
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

    // Pendant lamp
    const pendant = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 0.5, 24), darkMetalMat);
    pendant.position.set(0, tableH + 2.2, 0);
    const diningLight = new THREE.PointLight('#FFE2B8', 0.9, 8);
    diningLight.position.set(0, tableH + 2.0, 0);
    group.add(pendant, diningLight);
  }

  // ==========================================
  // 10. BOTANICAL PLANTER
  // ==========================================
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

    const leafMat = new THREE.MeshStandardMaterial({ color: '#2E6930', roughness: 0.4, side: THREE.DoubleSide });
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

  // ==========================================
  // 11. GENERIC FALLBACK
  // ==========================================
  else {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), woodMat);
    mesh.position.y = H / 2;
    tagShadows(mesh);
    group.add(mesh);
  }

  // ==========================================
  // SELECTION OUTLINE
  // ==========================================
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
