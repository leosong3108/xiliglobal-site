/* Post-build SSG pass for GitHub Pages:
 * - copies dist/index.html into dist/<route>/index.html for every known route,
 *   injecting per-route <title>, meta description and canonical, so each URL
 *   returns HTTP 200 with route-specific metadata for crawlers;
 * - emits sitemap.xml, robots.txt and 404.html. */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const BASE = 'https://xiliglobal.com'

const ROUTES = [
  ['/', 'Xili Technology — Energy intelligence', 'Smart meters, battery systems and energy storage by Hangzhou Xili Intelligent Technology (688616.SH) — utility-grade measurement trusted by State Grid, exported worldwide.'],
  ['/products', 'Products · Xili Technology', 'Smart electricity meters, water meters, acquisition terminals, distribution hardware, LFP batteries and energy-storage systems — the full Xili catalogue.'],
  ['/products/power-intelligence', 'Power intelligence · Xili Technology', 'Single- and three-phase smart meters, smart water meters, concentrators, smart breakers and IoT metering enclosures — Grade-A State Grid supplier since 2019.'],
  ['/products/battery-systems', 'Battery systems · Xili Technology', 'LFP power batteries by Zhejiang Xili New Energy — steel-shell full-tab cells, 170 Wh/kg, 2,000–2,500 cycles, full-domain BMS.'],
  ['/products/energy-storage', 'Energy storage · Xili Technology', 'Portable power stations, home energy storage and commercial systems — IP67, V0 flame-retardant, smart BMS.'],
  ['/solutions', 'Solutions · Xili Technology', 'Grid intelligence, PV-storage-charging, commercial, apartment and campus energy management — five solution directions.'],
  ['/solutions/grid-intelligence', 'Grid intelligence · Xili Technology', 'Smart metering, acquisition and metering-box systems for utilities — an accurate, continuous view of the grid edge.'],
  ['/solutions/pv-storage-charging', 'PV · Storage · Charging · Xili Technology', 'Photovoltaic generation, battery storage and charging integrated under one measurement and control loop.'],
  ['/solutions/commercial-energy', 'Commercial energy management · Xili Technology', 'Integrated energy management for parks, office buildings, enterprises and malls — measurement, storage and control in one system.'],
  ['/solutions/apartment-energy', 'Apartment energy management · Xili Technology', 'Smart management for rental apartments — contracts, rent, door locks and utilities on one platform with tenant apps.'],
  ['/solutions/campus-energy', 'Campus energy management · Xili Technology', 'Water and electricity for schools on one platform — remote reading, prepaid billing and dormitory safety policies.'],
  ['/technology', 'Technology · Xili Technology', 'Digital factory, AI-enabled manufacturing, CNAS-accredited automated laboratories and a live digital twin — 132 patents, 42 standards co-drafted.'],
  ['/about', 'About us · Xili Technology', 'From a 1968 pump station to the first STAR-Market-listed smart-meter company — 500+ clients, 33 provinces, exports across four continents.'],
  ['/news', 'News · Xili Technology', 'Announcements and milestones — State Grid tender wins, ESG reports, green-factory recognition and more.'],
  ['/careers', 'Careers · Xili Technology', 'Join a team where measurement is a craft and energy is the mission.'],
  ['/contact', 'Contact · Xili Technology', 'Talk to Xili about metering, batteries and storage — Hangzhou headquarters and Deqing intelligent industrial park.'],
]

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const template = readFileSync(join(dist, 'index.html'), 'utf8')

const render = (path, title, desc) => template
  .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
  .replace(/(<meta name="description"\s+content=")[^"]*(")/s, `$1${esc(desc)}$2`)
  .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
  .replace(/(<meta property="og:description"\s+content=")[^"]*(")/s, `$1${esc(desc)}$2`)
  .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${BASE}${path}$2`)
  .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${BASE}${path === '/' ? '/' : path}$2`)

for (const [path, title, desc] of ROUTES) {
  const html = render(path, title, desc)
  if (path === '/') {
    writeFileSync(join(dist, 'index.html'), html)
  } else {
    const dir = join(dist, path.slice(1))
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), html)
  }
}

// Unknown URLs render the app shell (GitHub Pages serves 404.html with a 404 status).
writeFileSync(join(dist, '404.html'), template)

const today = new Date().toISOString().slice(0, 10)
writeFileSync(join(dist, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  ROUTES.map(([p]) => `  <url><loc>${BASE}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  '\n</urlset>\n')

writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`)

console.log(`postbuild: ${ROUTES.length} routes prerendered, sitemap + robots + 404 written`)
