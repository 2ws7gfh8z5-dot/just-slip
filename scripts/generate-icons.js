/**
 * Generate Just Slip Icons
 * Creates PNG icons for all platforms
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Rounded rectangle background
  const radius = size * 0.2;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(0.5, '#764ba2');
  gradient.addColorStop(1, '#f093fb');
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Sun center
  const cx = size / 2;
  const cy = size / 2;
  const sunR = size * 0.22;
  
  // Glow
  const glow = ctx.createRadialGradient(cx, cy, sunR * 0.3, cx, cy, sunR * 1.8);
  glow.addColorStop(0, 'rgba(255, 255, 200, 0.9)');
  glow.addColorStop(0.4, 'rgba(255, 200, 100, 0.4)');
  glow.addColorStop(1, 'rgba(255, 200, 100, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, sunR * 1.8, 0, Math.PI * 2);
  ctx.fill();
  
  // Sun body
  ctx.beginPath();
  ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
  ctx.fillStyle = '#FFE4B5';
  ctx.fill();
  
  // Rays
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle - 0.08) * sunR * 1.1, cy + Math.sin(angle - 0.08) * sunR * 1.1);
    ctx.lineTo(cx + Math.cos(angle) * sunR * 1.5, cy + Math.sin(angle) * sunR * 1.5);
    ctx.lineTo(cx + Math.cos(angle + 0.08) * sunR * 1.1, cy + Math.sin(angle + 0.08) * sunR * 1.1);
    ctx.closePath();
    ctx.fillStyle = '#FFD700';
    ctx.fill();
  }
  
  // Swipe arc
  ctx.beginPath();
  ctx.arc(cx, cy, sunR * 2, Math.PI * 0.2, Math.PI * 0.8);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = size * 0.025;
  ctx.stroke();
  
  // Up arrow
  const arrowY = cy + sunR * 1.6;
  ctx.beginPath();
  ctx.moveTo(cx, arrowY - size * 0.06);
  ctx.lineTo(cx - size * 0.05, arrowY + size * 0.04);
  ctx.lineTo(cx - size * 0.015, arrowY + size * 0.04);
  ctx.lineTo(cx - size * 0.015, arrowY + size * 0.12);
  ctx.lineTo(cx + size * 0.015, arrowY + size * 0.12);
  ctx.lineTo(cx + size * 0.015, arrowY + size * 0.04);
  ctx.lineTo(cx + size * 0.05, arrowY + size * 0.04);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fill();
  
  return canvas;
}

async function generateIcons() {
  const assetsDir = path.join(__dirname, '../assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
  
  console.log('Generating Just Slip icons...\n');
  
  // Main icon
  const mainCanvas = createIcon(512);
  fs.writeFileSync(path.join(assetsDir, 'icon.png'), mainCanvas.toBuffer('image/png'));
  console.log('✓ icon.png (512x512)');
  
  // macOS icon set
  const macSizes = [16, 32, 64, 128, 256, 512, 1024];
  macSizes.forEach(size => {
    const canvas = createIcon(size);
    fs.writeFileSync(path.join(assetsDir, `icon_${size}x${size}.png`), canvas.toBuffer('image/png'));
  });
  console.log('✓ macOS icon set created');
  
  // Windows icons
  const winSizes = [16, 32, 48, 64, 128, 256];
  winSizes.forEach(size => {
    const canvas = createIcon(size);
    fs.writeFileSync(path.join(assetsDir, `icon_${size}x${size}.png`), canvas.toBuffer('image/png'));
  });
  console.log('✓ Windows PNG icons created');
  
  // Linux icons
  const linuxSizes = [16, 24, 32, 48, 64, 128, 256];
  linuxSizes.forEach(size => {
    const canvas = createIcon(size);
    fs.writeFileSync(path.join(assetsDir, `icon_${size}x${size}.png`), canvas.toBuffer('image/png'));
  });
  console.log('✓ Linux icon set created');
  
  // Create icns for macOS using iconutil
  const iconsetDir = path.join(assetsDir, 'icon.iconset');
  if (!fs.existsSync(iconsetDir)) fs.mkdirSync(iconsetDir);
  
  macSizes.forEach(size => {
    const src = path.join(assetsDir, `icon_${size}x${size}.png`);
    const dst = path.join(iconsetDir, `icon_${size}x${size}.png`);
    if (fs.existsSync(src)) fs.copyFileSync(src, dst);
  });
  
  console.log('\nIcons generated in assets/ directory');
}

generateIcons().catch(console.error);
