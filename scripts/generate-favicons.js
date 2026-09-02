/**
 * Generates the CardCraft favicon / icon set with zero dependencies.
 *
 * Draws the brand mark (indigo rounded tile + white address-card glyph,
 * matching the in-app logo) in a 64x64 design space, rasterizes it with
 * 4x supersampling, and writes:
 *
 *   public/favicon.svg            — vector source (modern browsers)
 *   public/favicon.ico            — 16/32/48 multi-size
 *   public/favicon-16x16.png      — small tab icon
 *   public/favicon-32x32.png      — default tab icon
 *   public/apple-touch-icon.png   — 180x180, full-bleed (iOS rounds it)
 *   public/logo512.png            — PWA install icon
 *
 * Usage: node scripts/generate-favicons.js
 */
'use strict';

const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// ─── Brand palette ─────────────────────────────────────────────────────────────
const C_START = [79, 70, 229];   // #4f46e5 (--theme-color)
const C_END = [99, 102, 241];    // #6366f1
const C_WHITE = [255, 255, 255];

// ─── Scene (64x64 design space) ────────────────────────────────────────────────
// Rounded indigo tile; fullBleed renders the whole canvas (for iOS icons).
function tileFor(fullBleed) {
    return fullBleed
        ? { x: 0, y: 0, size: 64, radius: 0 }
        : { x: 2, y: 2, size: 60, radius: 14 };
}

const CARD = { x: 15, y: 19, w: 34, h: 26 };

function inTile(px, py, tile) {
    if (px < tile.x || px > tile.x + tile.size || py < tile.y || py > tile.y + tile.size) return false;
    const r = tile.radius;
    const cx = Math.max(tile.x + r, Math.min(px, tile.x + tile.size - r));
    const cy = Math.max(tile.y + r, Math.min(py, tile.y + tile.size - r));
    const dx = px - cx;
    const dy = py - cy;
    return dx * dx + dy * dy <= r * r;
}

function inCutout(px, py) {
    // Portrait head
    const dxh = px - 24;
    const dyh = py - 27.5;
    if (dxh * dxh + dyh * dyh <= 3.5 * 3.5) return true;
    // Shoulders
    const ex = (px - 24) / 4.8;
    const ey = (py - 32.5) / 2.6;
    if (ex * ex + ey * ey <= 1) return true;
    // Vertical divider
    if (px >= 31.5 && px <= 33.5 && py >= 21.5 && py <= 42.5) return true;
    // ID text lines
    const lines = [
        [35, 24, 13, 2.8],
        [35, 29.5, 13, 2.8],
        [35, 35, 13, 2.8],
        [35, 40.5, 9.5, 2.8],
    ];
    for (const [lx, ly, lw, lh] of lines) {
        if (px >= lx && px <= lx + lw && py >= ly && py <= ly + lh) return true;
    }
    return false;
}

function gradientAt(px, py) {
    const t = (px + py) / 128;
    return [
        Math.round(C_START[0] + (C_END[0] - C_START[0]) * t),
        Math.round(C_START[1] + (C_END[1] - C_START[1]) * t),
        Math.round(C_START[2] + (C_END[2] - C_START[2]) * t),
    ];
}

function sample(px, py, fullBleed) {
    const tile = tileFor(fullBleed);
    if (!inTile(px, py, tile)) return [0, 0, 0, 0];
    const base = gradientAt(px, py);
    if (px >= CARD.x && px <= CARD.x + CARD.w && py >= CARD.y && py <= CARD.y + CARD.h) {
        return inCutout(px, py) ? [...base, 255] : [...C_WHITE, 255];
    }
    return [...base, 255];
}

// ─── Rasterizer (4x supersampling for smooth edges) ────────────────────────────
function rasterize(size, fullBleed = false) {
    const SS = 4;
    const scale = 64 / size;
    const rgba = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            for (let sy = 0; sy < SS; sy++) {
                for (let sx = 0; sx < SS; sx++) {
                    const px = (x + (sx + 0.5) / SS) * scale;
                    const py = (y + (sy + 0.5) / SS) * scale;
                    const [cr, cg, cb, ca] = sample(px, py, fullBleed);
                    r += cr; g += cg; b += cb; a += ca;
                }
            }
            const n = SS * SS;
            const o = (y * size + x) * 4;
            rgba[o] = Math.round(r / n);
            rgba[o + 1] = Math.round(g / n);
            rgba[o + 2] = Math.round(b / n);
            rgba[o + 3] = Math.round(a / n);
        }
    }
    return rgba;
}

// ─── PNG encoder ───────────────────────────────────────────────────────────────
const CRC_TABLE = (() => {
    const t = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        t[n] = c;
    }
    return t;
})();

function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeBuf = Buffer.from(type, 'ascii');
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
    return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(rgba, size) {
    const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(size, 0);
    ihdr.writeUInt32BE(size, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // RGBA
    const stride = size * 4 + 1;
    const raw = Buffer.alloc(size * stride);
    for (let y = 0; y < size; y++) {
        raw[y * stride] = 0; // filter: none
        rgba.copy(raw, y * stride + 1, y * size * 4, (y + 1) * size * 4);
    }
    const idat = zlib.deflateSync(raw, { level: 9 });
    return Buffer.concat([sig, pngChunk('IHDR', ihdr), pngChunk('IDAT', idat), pngChunk('IEND', Buffer.alloc(0))]);
}

// ─── ICO container (PNG-compressed entries) ────────────────────────────────────
function encodeICO(entries) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(entries.length, 4);
    const dir = Buffer.alloc(16 * entries.length);
    let offset = 6 + dir.length;
    entries.forEach(({ size, data }, i) => {
        const e = i * 16;
        dir[e] = size >= 256 ? 0 : size;
        dir[e + 1] = size >= 256 ? 0 : size;
        dir.writeUInt16LE(1, e + 4);   // planes
        dir.writeUInt16LE(32, e + 6);  // bpp
        dir.writeUInt32LE(data.length, e + 8);
        dir.writeUInt32LE(offset, e + 12);
        offset += data.length;
    });
    return Buffer.concat([header, dir, ...entries.map((e) => e.data)]);
}

// ─── SVG source (matches the raster scene) ─────────────────────────────────────
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4f46e5"/>
      <stop offset="1" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#bg)"/>
  <rect x="15" y="19" width="34" height="26" rx="5" fill="#ffffff"/>
  <g fill="#4f46e5">
    <circle cx="24" cy="27.5" r="3.5"/>
    <ellipse cx="24" cy="32.5" rx="4.8" ry="2.6"/>
    <rect x="31.5" y="21.5" width="2" height="21" rx="1"/>
    <rect x="35" y="24" width="13" height="2.8" rx="1.4"/>
    <rect x="35" y="29.5" width="13" height="2.8" rx="1.4"/>
    <rect x="35" y="35" width="13" height="2.8" rx="1.4"/>
    <rect x="35" y="40.5" width="9.5" height="2.8" rx="1.4"/>
  </g>
</svg>
`;

// ─── Main ──────────────────────────────────────────────────────────────────────
const outDir = path.join(__dirname, '..', 'public');

const fav16 = encodePNG(rasterize(16), 16);
const fav32 = encodePNG(rasterize(32), 32);
const fav48 = encodePNG(rasterize(48), 48);
const apple = encodePNG(rasterize(180, true), 180);
const logo512 = encodePNG(rasterize(512), 512);

fs.writeFileSync(path.join(outDir, 'favicon.svg'), SVG);
fs.writeFileSync(path.join(outDir, 'favicon.ico'), encodeICO([
    { size: 16, data: fav16 },
    { size: 32, data: fav32 },
    { size: 48, data: fav48 },
]));
fs.writeFileSync(path.join(outDir, 'favicon-16x16.png'), fav16);
fs.writeFileSync(path.join(outDir, 'favicon-32x32.png'), fav32);
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), apple);
fs.writeFileSync(path.join(outDir, 'logo512.png'), logo512);

console.log('Generated favicon set in public/:');
console.log('  favicon.svg, favicon.ico, favicon-16x16.png, favicon-32x32.png,');
console.log('  apple-touch-icon.png (180x180), logo512.png (512x512)');