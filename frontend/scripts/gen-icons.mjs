// Genera los PNG de la PWA a partir del SVG fuente.
// Uso: node scripts/gen-icons.mjs
import sharp from 'sharp'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pub = join(__dirname, '..', 'public')
const svg = readFileSync(join(pub, 'favicon.svg'))

// Versión maskable: el contenido va dentro de la zona segura (80%), fondo lleno
const maskableSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#F5B042"/><stop offset="50%" stop-color="#FFD700"/><stop offset="100%" stop-color="#C8860A"/>
  </linearGradient></defs>
  <rect width="512" height="512" fill="#0A0A0A"/>
  <text x="256" y="290" font-family="Georgia, serif" font-size="190" font-weight="bold" fill="url(#g)" text-anchor="middle">G</text>
  <text x="256" y="370" font-family="Arial, sans-serif" font-size="40" letter-spacing="6" fill="url(#g)" text-anchor="middle">GIORGIO</text>
</svg>`)

const tasks = [
  { src: svg,         size: 192, out: 'icon-192.png' },
  { src: svg,         size: 512, out: 'icon-512.png' },
  { src: maskableSvg, size: 512, out: 'icon-512-maskable.png' },
  { src: svg,         size: 180, out: 'apple-touch-icon.png' },
]

for (const t of tasks) {
  await sharp(t.src, { density: 300 })
    .resize(t.size, t.size)
    .png()
    .toFile(join(pub, t.out))
  console.log(`✓ ${t.out} (${t.size}x${t.size})`)
}
console.log('Iconos generados.')
