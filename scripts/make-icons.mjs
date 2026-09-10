/**
 * Generates the PWA icons without any image dependency.
 * Draws the Passerelle mark — a circumflex, the accent that looks like a small
 * bridge — and encodes the result as a PNG using Node's built-in zlib.
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
mkdirSync(OUT, { recursive: true })

const BG = [0x33, 0x40, 0x9b]
const FG = [0xff, 0xff, 0xff]

/** Shortest distance from a point to a line segment. */
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const lenSq = dx * dx + dy * dy
  let t = lenSq === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / lenSq
  t = Math.max(0, Math.min(1, t))
  const cx = x1 + t * dx
  const cy = y1 + t * dy
  return Math.hypot(px - cx, py - cy)
}

/** Signed distance to a rounded rectangle; negative inside. */
function roundedRectSD(px, py, w, h, r) {
  const qx = Math.abs(px - w / 2) - (w / 2 - r)
  const qy = Math.abs(py - h / 2) - (h / 2 - r)
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}

function coverage(sd) {
  // 1px analytic antialiasing band around the edge.
  return Math.max(0, Math.min(1, 0.5 - sd))
}

function renderIcon(size, { maskable = false } = {}) {
  const s = size / 512
  const radius = maskable ? size / 2 : 115 * s
  // Maskable icons need their content inside a safe circle, so shrink the mark.
  const inset = maskable ? 0.78 : 1

  const cx = size / 2
  const strokeW = 46 * s * inset
  const ax = cx - 128 * s * inset
  const ay = size / 2 + 56 * s * inset
  const bx = cx
  const by = size / 2 - 80 * s * inset
  const dotY = size / 2 + 132 * s * inset
  const dotR = 24 * s * inset

  const px = Buffer.alloc(size * size * 4)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const cxp = x + 0.5
      const cyp = y + 0.5

      const bgA = coverage(roundedRectSD(cxp, cyp, size, size, radius))
      if (bgA <= 0) continue

      // Chevron: two mirrored segments meeting at the apex.
      const dLeft = distToSegment(cxp, cyp, ax, ay, bx, by)
      const dRight = distToSegment(cxp, cyp, 2 * cx - ax, ay, bx, by)
      const chevron = coverage(Math.min(dLeft, dRight) - strokeW / 2)
      const dot = coverage(Math.hypot(cxp - cx, cyp - dotY) - dotR)
      const fgA = Math.min(1, chevron + dot * 0.7)

      const r = BG[0] * (1 - fgA) + FG[0] * fgA
      const g = BG[1] * (1 - fgA) + FG[1] * fgA
      const b = BG[2] * (1 - fgA) + FG[2] * fgA

      px[i] = r
      px[i + 1] = g
      px[i + 2] = b
      px[i + 3] = Math.round(bgA * 255)
    }
  }
  return px
}

function crc32(buf) {
  let c
  const table = []
  for (let n = 0; n < 256; n++) {
    c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  let crc = 0xffffffff
  for (const byte of buf) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePNG(size, pixels) {
  // Each scanline is prefixed with filter byte 0 (none).
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0
    pixels.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // colour type: RGBA
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const targets = [
  ['pwa-192.png', 192, {}],
  ['pwa-512.png', 512, {}],
  ['apple-touch-icon.png', 180, { maskable: true }],
]

for (const [name, size, opts] of targets) {
  writeFileSync(join(OUT, name), encodePNG(size, renderIcon(size, opts)))
  console.log(`✓ ${name} (${size}×${size})`)
}

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="9" fill="#33409b"/>
  <path d="M8 19.5 L16 11 L24 19.5" stroke="#fff" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="16" cy="24" r="1.6" fill="#fff" opacity=".65"/>
</svg>
`
writeFileSync(join(OUT, 'favicon.svg'), favicon)
console.log('✓ favicon.svg')
