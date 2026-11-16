// Builds the printable "Algarve golf courses map" PDF (A4 landscape) and a
// preview image for /algarve-golf-courses-map-pdf.
//
// Usage (from web/): node scripts/build-map-pdf.mjs
// Re-run it whenever a course is added, closes, reopens or goes private, and
// keep STATUS below in step with src/data/course-status.ts.
//
// Reads NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY / NEXT_PUBLIC_MAPBOX_TOKEN from .env.local.
// Writes public/downloads/algarve-golf-courses-map.pdf and ...-preview.jpg.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import puppeteer from 'puppeteer'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public', 'downloads')
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')
    .filter(l => /^[A-Z_]+=/.test(l)).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).trim().replace(/^"|"$/g, '')] }),
)
const TOKEN = env.NEXT_PUBLIC_MAPBOX_TOKEN
const CHECKED = '16 November 2026'
let courses = []

// ── Status (mirrors web/src/data/course-status.ts) ───────────────────────────
const STATUS = {
  'san-lorenzo': 'closed until mid-2028',
  'victoria-els-club': 'private members club',
}
const NAME_FIX = { 'victoria-els-club': 'The Els Club' }

const REGION = {
  west:    { label: 'Western Algarve', color: '#2E7D6B' },
  central: { label: 'Central Algarve', color: '#2B6090' },
  east:    { label: 'Eastern Algarve', color: '#B5651D' },
}

// Number west → east.
let list = []
function buildList() {
  list = courses
  .slice()
  .sort((a, b) => a.lng - b.lng || a.name.localeCompare(b.name))
    .map((c, i) => ({ ...c, n: i + 1, name: NAME_FIX[c.slug] ?? c.name, town: (c.town || '').split(' · ')[0] }))
}

// ── Map geometry ──────────────────────────────────────────────────────────────
// The base map is drawn with mapbox-gl in the headless browser (labels hidden,
// so we can place our own, bigger town names), and every position comes from
// map.project(), so markers and map always line up.
const W = 1047, H = 262
const CENTER = { lng: -8.165, lat: 37.125 }
const ZOOM = 8.85

const AIRPORT = { name: 'Faro Airport', code: 'FAO', lat: 37.0144, lng: -7.9659 }
const TOWNS = [
  { name: 'Sagres', lat: 37.0086, lng: -8.9403 },
  { name: 'Lagos', lat: 37.1028, lng: -8.6730 },
  { name: 'Portimão', lat: 37.1386, lng: -8.5378 },
  { name: 'Silves', lat: 37.1891, lng: -8.4386 },
  { name: 'Carvoeiro', lat: 37.0965, lng: -8.4719 },
  { name: 'Albufeira', lat: 37.0889, lng: -8.2503 },
  { name: 'Vilamoura', lat: 37.0777, lng: -8.1176 },
  { name: 'Loulé', lat: 37.1377, lng: -8.0197 },
  { name: 'Almancil', lat: 37.0868, lng: -8.0303 },
  { name: 'Faro', lat: 37.0194, lng: -7.9322 },
  { name: 'Olhão', lat: 37.0260, lng: -7.8411 },
  { name: 'Tavira', lat: 37.1273, lng: -7.6506 },
  { name: 'Castro Marim', lat: 37.2172, lng: -7.4434 },
]

const R = 10.5
function layoutCircles(nodes, fixed) {
  nodes.forEach((n, i) => { n.x = n.ax + Math.cos(i * 2.4) * 0.5; n.y = n.ay + Math.sin(i * 2.4) * 0.5 })
  for (let it = 0; it < 700; it++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j]
        let dx = b.x - a.x, dy = b.y - a.y
        const d = Math.hypot(dx, dy) || 0.01
        const min = 2 * R + 3
        if (d < min) { const p = (min - d) / 2; dx /= d; dy /= d; a.x -= dx * p; a.y -= dy * p; b.x += dx * p; b.y += dy * p }
      }
      for (const f of fixed) {
        const a = nodes[i]
        let dx = a.x - f.x, dy = a.y - f.y
        const d = Math.hypot(dx, dy) || 0.01
        const min = R + f.r + 3
        if (d < min) { a.x += dx / d * (min - d); a.y += dy / d * (min - d) }
      }
    }
    for (const n of nodes) {
      n.x += (n.ax - n.x) * 0.015; n.y += (n.ay - n.y) * 0.015
      n.x = Math.min(W - R - 2, Math.max(R + 2, n.x)); n.y = Math.min(H - R - 2, Math.max(R + 2, n.y))
    }
  }
}

// Place each label at the first spot around its point that hits nothing.
function placeLabels(labels, circles) {
  const placed = []
  const hitsCircle = (b) => circles.some(c => {
    const nx = Math.max(b.x, Math.min(c.x, b.x + b.w)), ny = Math.max(b.y, Math.min(c.y, b.y + b.h))
    return Math.hypot(c.x - nx, c.y - ny) < c.r + 1.5
  })
  const hitsBox = (b) => placed.some(p => b.x < p.x + p.w + 3 && b.x + b.w + 3 > p.x && b.y < p.y + p.h + 2 && b.y + b.h + 2 > p.y)
  for (const l of labels) {
    const w = l.w, h = l.h, g = l.gap
    // Rings of 8 positions, further out each time; nearer spots win ties.
    const cands = []
    for (const [ring, d] of [g, g + 12, g + 26, g + 42, g + 60].entries()) {
      cands.push(
        { dx: d, dy: -h / 2, ring }, { dx: -w - d, dy: -h / 2, ring },
        { dx: -w / 2, dy: d, ring }, { dx: -w / 2, dy: -h - d, ring },
        { dx: d * 0.7, dy: d * 0.7, ring }, { dx: d * 0.7, dy: -h - d * 0.7, ring },
        { dx: -w - d * 0.7, dy: d * 0.7, ring }, { dx: -w - d * 0.7, dy: -h - d * 0.7, ring },
      )
    }
    let best = null, bestScore = Infinity
    cands.forEach(({ dx, dy, ring }, i) => {
      const b = { x: l.px + dx, y: l.py + dy, w, h, ring }
      const out = b.x < 2 || b.y < 2 || b.x + w > W - 2 || b.y + h > H - 2
      const score = (hitsCircle(b) ? 1000 : 0) + (hitsBox(b) ? 1000 : 0) + (out ? 5000 : 0) + ring * 10 + (i % 8)
      if (score < bestScore) { bestScore = score; best = b }
    })
    l.box = best
    placed.push(best)
  }
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

async function main() {
  const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/courses?select=slug,name,town,region,holes,par,lat,lng,active`, {
    headers: { apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
  })
  courses = await res.json()
  // Inactive courses are kept only if they have a status (e.g. a private club).
  courses = courses.filter(c => c.active || STATUS[c.slug])
  buildList()
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await puppeteer.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  const mp = await browser.newPage()
  await mp.setViewport({ width: W, height: H, deviceScaleFactor: 2 })
  await mp.setContent(`<!doctype html><html><head>
    <link href="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css" rel="stylesheet">
    <script src="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.js"></script>
    <style>body{margin:0}#m{width:${W}px;height:${H}px}</style></head><body><div id="m"></div></body></html>`, { waitUntil: 'networkidle0' })
  const pts = [...list.map(c => [c.lng, c.lat]), [AIRPORT.lng, AIRPORT.lat], ...TOWNS.map(t => [t.lng, t.lat])]
  const rendered = await mp.evaluate((token, center, zoom, pts) => new Promise((resolve, reject) => {
    mapboxgl.accessToken = token
    const map = new mapboxgl.Map({
      container: 'm', style: 'mapbox://styles/mapbox/light-v11', center: [center.lng, center.lat], zoom,
      projection: 'mercator', interactive: false, preserveDrawingBuffer: true, attributionControl: false, fadeDuration: 0,
    })
    map.on('error', e => reject(String(e.error && e.error.message)))
    map.on('load', () => {
      for (const l of map.getStyle().layers) if (l.type === 'symbol') map.setLayoutProperty(l.id, 'visibility', 'none')
      map.once('idle', () => resolve({
        png: map.getCanvas().toDataURL('image/png'),
        pts: pts.map(p => { const q = map.project(p); return [q.x, q.y] }),
      }))
    })
  }), TOKEN, CENTER, ZOOM, pts)
  await mp.close()
  const mapB64 = rendered.png.split(',')[1]
  const P = rendered.pts
  const airportPt = { x: P[list.length][0], y: P[list.length][1] }
  const townPts = TOWNS.map((t, i) => ({ ...t, x: P[list.length + 1 + i][0], y: P[list.length + 1 + i][1] }))

  const nodes = list.map((c, i) => ({ c, ax: P[i][0], ay: P[i][1] }))
  layoutCircles(nodes, [{ x: airportPt.x, y: airportPt.y, r: 11 }, ...townPts.map(t => ({ x: t.x, y: t.y, r: 3 }))])

  const circles = [
    ...nodes.map(n => ({ x: n.x, y: n.y, r: R })),
    ...nodes.map(n => ({ x: n.ax, y: n.ay, r: 2.5 })),
    { x: airportPt.x, y: airportPt.y, r: 11 },
    ...townPts.map(t => ({ x: t.x, y: t.y, r: 3 })),
  ]
  const labels = [
    { kind: 'airport', text: 'Faro Airport (FAO)', px: airportPt.x, py: airportPt.y, w: 'Faro Airport (FAO)'.length * 6.3, h: 13, gap: 14 },
    ...townPts.map(t => ({ kind: 'town', text: t.name, px: t.x, py: t.y, w: t.name.length * 7.2, h: 15, gap: 5 })),
  ]
  placeLabels(labels, circles)

  const qrSvg = await QRCode.toString('https://www.algarvegolfmap.com/?utm_source=map-pdf&utm_medium=qr', { type: 'svg', margin: 0, color: { dark: '#222222', light: '#ffffff' } })

  const townSvg = townPts.map(t => `<circle cx="${t.x}" cy="${t.y}" r="2.6" fill="#555" stroke="#fff" stroke-width="1"/>`).join('')
  const labelSvg = labels.map(l => {
    const isAir = l.kind === 'airport'
    const far = l.box.ring >= 2
    const lx = Math.max(l.box.x, Math.min(l.px, l.box.x + l.box.w)), ly = Math.max(l.box.y, Math.min(l.py, l.box.y + l.box.h))
    return (far ? `<line x1="${l.px}" y1="${l.py}" x2="${lx}" y2="${ly}" stroke="#777" stroke-width="0.8"/>` : '') + `<text x="${l.box.x}" y="${l.box.y + l.box.h - 3}" font-size="${isAir ? 11 : 13}" font-weight="${isAir ? 700 : 600}" fill="${isAir ? '#111' : '#3a3a3a'}"
      stroke="#fff" stroke-width="3.2" stroke-linejoin="round" paint-order="stroke">${esc(l.text)}</text>`
  }).join('')
  const airportSvg = `
    <circle cx="${airportPt.x}" cy="${airportPt.y}" r="11" fill="#222" stroke="#fff" stroke-width="1.6"/>
    <g transform="translate(${airportPt.x - 7.5},${airportPt.y - 7.5}) scale(0.625)" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
    </g>`
  const markers = nodes.map(n => {
    const reg = REGION[n.c.region] ?? REGION.central
    const off = STATUS[n.c.slug]
    const fill = off ? '#9a9a9a' : reg.color
    const moved = Math.hypot(n.x - n.ax, n.y - n.ay) > R * 0.6
    return `
      ${moved ? `<line x1="${n.ax}" y1="${n.ay}" x2="${n.x}" y2="${n.y}" stroke="${fill}" stroke-width="1" opacity=".8"/>` : ''}
      <circle cx="${n.ax}" cy="${n.ay}" r="2.2" fill="${fill}"/>
      <circle cx="${n.x}" cy="${n.y}" r="${R}" fill="${fill}" stroke="#fff" stroke-width="1.6"/>
      <text x="${n.x}" y="${n.y + 3.6}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#fff">${n.c.n}</text>`
  }).join('')

  const legend = Object.entries(REGION).map(([key, reg]) => {
    const rows = list.filter(c => c.region === key)
    return `
      <div class="reg"><span class="dot" style="background:${reg.color}"></span>${reg.label} <span class="cnt">· ${rows.length}</span></div>
      ${rows.map(c => `
        <div class="row${STATUS[c.slug] ? ' off' : ''}">
          <span class="num" style="background:${STATUS[c.slug] ? '#9a9a9a' : reg.color}">${c.n}</span>
          <span class="nm">${esc(c.name)}${STATUS[c.slug] ? ` <em>(${STATUS[c.slug]})</em>` : ''}</span>
          <span class="meta">${c.holes}h · ${esc(c.town)}</span>
        </div>`).join('')}`
  }).join('')

  const open = list.filter(c => !STATUS[c.slug]).length
  const html = `<!doctype html><html><head><meta charset="utf-8">
  <style>
    @page { size: A4 landscape; margin: 0 }
    * { box-sizing: border-box }
    body { margin: 0; width: 297mm; height: 210mm; font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; color: #222; }
    .page { padding: 9mm 10mm 7mm; height: 210mm; display: flex; flex-direction: column }
    header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 3mm }
    h1 { font-size: 22px; margin: 0; letter-spacing: -.01em }
    .sub { font-size: 11.5px; color: #555; margin-top: 2px }
    .brand { font-size: 12px; font-weight: 700; color: #2B6090; text-align: right }
    .brand span { display: block; font-weight: 400; color: #767676; font-size: 10px }
    .map { position: relative; width: ${W}px; height: ${H}px; border-radius: 8px; overflow: hidden; border: 1px solid #e3e3e3 }
    .map img, .map svg { position: absolute; inset: 0; width: ${W}px; height: ${H}px }
    .map svg text { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif }
    .bottom { display: flex; gap: 6mm; margin-top: 3.5mm; flex: 1; min-height: 0 }
    .legend { flex: 1; column-count: 4; column-gap: 5mm; font-size: 11.2px; line-height: 1.3 }
    .reg { font-weight: 800; font-size: 12.5px; margin: 0 0 3px; break-after: avoid; display: flex; align-items: center; gap: 5px }
    .reg:not(:first-child) { margin-top: 6px }
    .reg .cnt { font-weight: 400; color: #767676 }
    .dot { width: 9px; height: 9px; border-radius: 50% }
    .row { display: grid; grid-template-columns: 17px 1fr; column-gap: 4px; margin-bottom: 5px; break-inside: avoid }
    .num { grid-row: span 2; width: 15px; height: 15px; border-radius: 50%; color: #fff; font-weight: 700; font-size: 9px; display: flex; align-items: center; justify-content: center }
    .nm { font-weight: 600 }
    .nm em { font-weight: 400; color: #8a1f1f; font-style: normal }
    .meta { color: #6a6a6a; font-size: 10px }
    .side { width: 34mm; display: flex; flex-direction: column; align-items: center; text-align: center; font-size: 9px; color: #444 }
    .side .qr { width: 26mm; height: 26mm }
    .side .qr svg { width: 100%; height: 100% }
    .side p { margin: 4px 0 0; line-height: 1.35 }
    .side strong { color: #2B6090 }
    .foot { font-size: 8px; color: #8a8a8a; margin-top: 2mm; display: flex; justify-content: space-between }
  </style></head><body><div class="page">
    <header>
      <div>
        <h1>Algarve golf courses map</h1>
        <div class="sub">${list.length} golf courses from Sagres to the Spanish border · ${open} open to visitors · numbered west to east</div>
      </div>
      <div class="brand">algarvegolfmap.com<span>Green fees, maps and hotels for every course</span></div>
    </header>
    <div class="map">
      <img src="data:image/png;base64,${mapB64}" alt="">
      <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${townSvg}${markers}${airportSvg}${labelSvg}</svg>
    </div>
    <div class="bottom">
      <div class="legend">${legend}</div>
      <div class="side">
        <div class="qr">${qrSvg}</div>
        <p>Scan for the <strong>interactive map</strong>, green fees and tee times for every course.</p>
      </div>
    </div>
    <div class="foot">
      <span>Course list checked ${CHECKED}. Course positions are approximate (clubhouse location).</span>
      <span>Map data © Mapbox © OpenStreetMap contributors</span>
    </div>
  </div></body></html>`

  const page = await browser.newPage()
  await page.setViewport({ width: 1123, height: 794, deviceScaleFactor: 2 })
  await page.setContent(html, { waitUntil: 'load' })
  await page.pdf({ path: path.join(OUT, 'algarve-golf-courses-map.pdf'), format: 'A4', landscape: true, printBackground: true, preferCSSPageSize: true })
  await page.setViewport({ width: 1123, height: 794, deviceScaleFactor: 1.5 })
  await page.screenshot({ path: path.join(OUT, 'algarve-golf-courses-map-preview.jpg'), type: 'jpeg', quality: 82 })
  const overflow = await page.evaluate(() => {
    const l = document.querySelector('.legend'); return { sh: l.scrollHeight, ch: l.clientHeight, sw: l.scrollWidth, cw: l.clientWidth, body: document.body.scrollHeight }
  })
  console.log('legend', JSON.stringify(overflow))
  await browser.close()
}
main().catch(e => { console.error(e); process.exit(1) })
