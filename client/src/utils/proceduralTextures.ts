import * as THREE from 'three';

// Cache generated textures to avoid redundant canvas rendering
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Generates a high-quality procedural wood floor texture (Oak or Walnut with subtle plank lines).
 */
export function createWoodFloorTexture(type: 'oak' | 'walnut' | 'light_wood' = 'oak'): THREE.CanvasTexture {
  const cacheKey = `wood_${type}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const baseColors = {
    oak: { bg: '#D4B38C', dark: '#B5946D', light: '#E8CA9E', line: '#8A6A4B' },
    walnut: { bg: '#6E4E38', dark: '#543B2A', light: '#7F5B42', line: '#3A271C' },
    light_wood: { bg: '#EFE7DA', dark: '#D8CEBD', light: '#FAF4E8', line: '#BDB19C' },
  }[type];

  ctx.fillStyle = baseColors.bg;
  ctx.fillRect(0, 0, 1024, 1024);

  // Draw planks with subtle variation
  const plankWidth = 64;
  const plankHeight = 256;
  const cols = 1024 / plankWidth;
  const rows = 1024 / plankHeight + 1;

  for (let c = 0; c < cols; c++) {
    const colOffset = (c % 2) * (plankHeight / 2);
    for (let r = -1; r < rows; r++) {
      const x = c * plankWidth;
      const y = r * plankHeight + colOffset;

      // Subtle plank color jitter
      const toneJitter = (Math.random() - 0.5) * 18;
      ctx.fillStyle = shadeColor(baseColors.bg, toneJitter);
      ctx.fillRect(x + 1, y + 1, plankWidth - 2, plankHeight - 2);

      // Subtle wood grain lines
      ctx.strokeStyle = baseColors.line;
      ctx.globalAlpha = 0.08;
      ctx.lineWidth = 1;
      for (let g = 0; g < 4; g++) {
        const gx = x + Math.random() * plankWidth;
        ctx.beginPath();
        ctx.moveTo(gx, y);
        ctx.bezierCurveTo(
          gx + (Math.random() - 0.5) * 8,
          y + plankHeight * 0.3,
          gx + (Math.random() - 0.5) * 8,
          y + plankHeight * 0.7,
          gx,
          y + plankHeight
        );
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
    }
  }

  // Plank seam lines
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.lineWidth = 1.5;
  for (let c = 0; c <= cols; c++) {
    ctx.beginPath();
    ctx.moveTo(c * plankWidth, 0);
    ctx.lineTo(c * plankWidth, 1024);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Generates an Italian Carrara marble texture with soft gray veins.
 */
export function createMarbleTexture(): THREE.CanvasTexture {
  const cacheKey = 'marble_carrara';
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F8F8F6';
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft subtle marble veins
  const drawVein = (startX: number, startY: number, color: string, alpha: number, width: number) => {
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(startX, startY);

    let curX = startX;
    let curY = startY;
    while (curY < 1024 && curX < 1024) {
      curX += (Math.random() - 0.3) * 60;
      curY += Math.random() * 80 + 20;
      ctx.lineTo(curX, curY);
    }
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  };

  for (let i = 0; i < 8; i++) {
    drawVein(Math.random() * 1024, 0, '#9CA3AF', 0.15, 3);
    drawVein(Math.random() * 1024, 0, '#6B7280', 0.08, 1.5);
  }

  // Soft cloudy noise
  for (let p = 0; p < 20; p++) {
    const rx = Math.random() * 1024;
    const ry = Math.random() * 1024;
    const rad = Math.random() * 120 + 40;
    const grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, rad);
    grad.addColorStop(0, 'rgba(220, 220, 215, 0.25)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(rx, ry, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Generates an area rug texture with geometric borders and woven crosshatch.
 */
export function createRugTexture(palette: 'neutral' | 'terracotta' | 'sage' = 'neutral'): THREE.CanvasTexture {
  const cacheKey = `rug_${palette}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const colors = {
    neutral: { base: '#EBE7DE', border: '#CFC7B8', inner: '#DCD4C4', accent: '#9C9281' },
    terracotta: { base: '#EAD7CD', border: '#C2846B', inner: '#DDBFA8', accent: '#9E5B42' },
    sage: { base: '#DDE5DE', border: '#8A9E8D', inner: '#CAD4CB', accent: '#5E7260' },
  }[palette];

  ctx.fillStyle = colors.base;
  ctx.fillRect(0, 0, 512, 512);

  // Outer border
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 16;
  ctx.strokeRect(12, 12, 488, 488);

  // Inner decorative border
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, 456, 456);

  // Center subtle motif
  ctx.strokeStyle = colors.inner;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(50, 50, 412, 412);

  // Micro fabric crosshatch
  ctx.strokeStyle = 'rgba(0,0,0,0.03)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 512; i += 6) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Generates textured bouclé / woven linen fabric for sofas and bedding.
 */
export function createFabricTexture(colorHex = '#E6DFD5'): THREE.CanvasTexture {
  const cacheKey = `fabric_${colorHex}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 256, 256);

  // Bouclé flecks
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const radius = Math.random() * 1.5 + 0.5;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  textureCache.set(cacheKey, texture);
  return texture;
}

function shadeColor(color: string, percent: number): string {
  let num = parseInt(color.replace('#', ''), 16);
  if (isNaN(num)) return color;
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) + amt;
  let G = ((num >> 8) & 0x00ff) + amt;
  let B = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
