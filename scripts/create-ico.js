const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create ICO file from canvas
function canvasToICO(canvas, sizes) {
  const buffers = sizes.map(size => {
    const c = createCanvas(size, size);
    const ctx = c.getContext('2d');
    
    // Draw same icon
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
    
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(0.5, '#764ba2');
    gradient.addColorStop(1, '#f093fb');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    const cx = size / 2, cy = size / 2, sunR = size * 0.22;
    const glow = ctx.createRadialGradient(cx, cy, sunR * 0.3, cx, cy, sunR * 1.8);
    glow.addColorStop(0, 'rgba(255, 255, 200, 0.9)');
    glow.addColorStop(0.4, 'rgba(255, 200, 100, 0.4)');
    glow.addColorStop(1, 'rgba(255, 200, 100, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, sunR * 1.8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
    ctx.fillStyle = '#FFE4B5';
    ctx.fill();
    
    return c.toBuffer('image/png');
  });
  
  // Build ICO
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(buffers.length, 4);
  
  let offset = 22 + buffers.length * 16;
  const entries = [];
  
  for (let i = 0; i < buffers.length; i++) {
    entries.push({
      width: Math.min(sizes[i], 256),
      height: Math.min(sizes[i], 256),
      size: buffers[i].length,
      offset: offset
    });
    offset += buffers[i].length;
  }
  
  entries.forEach((entry, i) => {
    const pos = 22 + i * 16;
    header.writeUInt8(entry.width, pos);
    header.writeUInt8(entry.height, pos + 1);
    header.writeUInt8(0, pos + 2);
    header.writeUInt8(0, pos + 3);
    header.writeUInt16LE(1, pos + 4);
    header.writeUInt16LE(32, pos + 6);
    header.writeUInt32LE(entry.size, pos + 8);
    header.writeUInt32LE(entry.offset, pos + 12);
  });
  
  const result = Buffer.concat([header, ...buffers]);
  return result;
}

const sizes = [16, 24, 32, 48, 64, 128, 256];
const icoBuffer = canvasToICO(null, sizes);
fs.writeFileSync(path.join(__dirname, 'icon.ico'), icoBuffer);
console.log('✓ Created icon.ico');
