/* Post-build static generation for GitHub Pages.
 *
 * Each route is emitted once per locale — English at /products/…, Chinese at
 * /zh/products/…, French at /fr/… — so every language has its own indexable URL
 * carrying that language's title, description and copy signals. Pages link to
 * each other with hreflang, canonicalise to themselves, and carry JSON-LD for
 * the organisation, the breadcrumb trail and, on catalogue pages, the products.
 *
 * Titles and descriptions are read from src/content.js so they can never drift
 * from what the page actually says.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { content, locales, LINKEDIN_URL } from '../src/content.js'
import { catalogBySlug } from '../src/catalog.js'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const BASE = 'https://xiliglobal.com'

const href = (locale, route) => (locale === 'en' ? '' : `/${locale}`) + (route === '/' ? '/' : `${route}/`)
const url = (locale, route) => BASE + href(locale, route)
/* Search engines want a language tag, not our internal key. */
const hreflangOf = { en: 'en', zh: 'zh-Hans', fr: 'fr' }

/* Every route, with the localised label used to build its title. */
function routesFor(locale) {
  const t = content[locale]
  const list = [
    { route: '/', label: null, desc: t.home.heroBody },
    { route: '/products', label: t.nav.products, desc: t.products.heroBody },
    ...t.products.categories.map((c) => ({
      route: `/products/${c.slug}`,
      label: c.name,
      desc: `${c.description} ${c.points.join(' · ')}`,
      catalogue: c.slug,
    })),
    { route: '/solutions', label: t.nav.solutions, desc: t.solutions.heroBody },
    ...t.solutions.items.map((i) => ({
      route: `/solutions/${i.slug}`,
      label: i.name,
      desc: i.description,
    })),
    { route: '/technology', label: t.nav.technology, desc: t.technology.heroBody },
    { route: '/about', label: t.nav.about, desc: t.about.heroBody },
    { route: '/news', label: t.nav.news, desc: t.news.heroBody },
    { route: '/careers', label: t.careers.title, desc: t.careers.heroBody },
    { route: '/contact', label: t.nav.contact, desc: t.contact.heroBody },
  ]
  return list.map((r) => ({
    ...r,
    title: r.label ? `${r.label} · ${t.meta.title}` : t.meta.title,
    desc: clamp(r.desc),
  }))
}

/* Meta descriptions past ~200 characters are cut off anyway; trim on a word
   boundary in latin scripts and mid-sentence in Chinese. */
function clamp(text, max = 200) {
  const clean = String(text).replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const space = cut.lastIndexOf(' ')
  return (space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[,;·、，]$/, '') + '…'
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const template = readFileSync(join(dist, 'index.html'), 'utf8')

/* ---------------- structured data ---------------- */

const organisation = {
  '@type': 'Organization',
  '@id': `${BASE}/#organization`,
  name: 'Hangzhou Xili Intelligent Technology Co., Ltd.',
  alternateName: '杭州西力智能科技股份有限公司',
  url: BASE,
  logo: `${BASE}/assets/xili-logo-clean.png`,
  foundingDate: '1968',
  email: 'hzxilidb@cnxili.com',
  telephone: '+86-571-87825461',
  tickerSymbol: '688616',
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: 'No. 173 Liangfu Road, Zhuantang, Xihu District',
      addressLocality: 'Hangzhou',
      addressRegion: 'Zhejiang',
      postalCode: '310024',
      addressCountry: 'CN',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: 'No. 733 North Huancheng Road, Deqing County',
      addressLocality: 'Huzhou',
      addressRegion: 'Zhejiang',
      postalCode: '313000',
      addressCountry: 'CN',
    },
  ],
  sameAs: ['https://www.cnxili.com', LINKEDIN_URL],
}

function breadcrumb(locale, entry) {
  const t = content[locale]
  const parts = entry.route.split('/').filter(Boolean)
  const items = [{ name: t.common.home, route: '/' }]
  if (parts[0] === 'products' && parts[1]) items.push({ name: t.nav.products, route: '/products' })
  if (parts[0] === 'solutions' && parts[1]) items.push({ name: t.nav.solutions, route: '/solutions' })
  if (entry.label) items.push({ name: entry.label, route: entry.route })
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: url(locale, it.route),
    })),
  }
}

/* Catalogue pages list their models so each one can surface in product search. */
function productList(locale, slug) {
  const groups = catalogBySlug[slug] || []
  const items = []
  for (const g of groups) {
    for (const it of g.items) {
      items.push({
        '@type': 'ListItem',
        position: items.length + 1,
        item: {
          '@type': 'Product',
          name: `${it.model} ${it.name[locale]}`,
          model: it.model,
          image: `${BASE}/assets/products/${it.img}.jpg`,
          category: g.title[locale],
          brand: { '@type': 'Brand', name: 'Xili' },
          manufacturer: { '@id': `${BASE}/#organization` },
        },
      })
    }
  }
  return items.length ? { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items } : null
}

function jsonLd(locale, entry) {
  const graph = [
    organisation,
    {
      '@type': 'WebPage',
      '@id': `${url(locale, entry.route)}#page`,
      url: url(locale, entry.route),
      name: entry.title,
      description: entry.desc,
      inLanguage: hreflangOf[locale],
      isPartOf: { '@type': 'WebSite', '@id': `${BASE}/#website`, url: BASE, name: 'Xili Technology', publisher: { '@id': `${BASE}/#organization` } },
    },
    breadcrumb(locale, entry),
  ]
  const products = entry.catalogue ? productList(locale, entry.catalogue) : null
  if (products) graph.push(products)
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}

/* ---------------- page emission ---------------- */

/* A representative image per section, so a shared link previews the right thing. */
const OG_IMAGE = {
  '/products/metering-instruments': '/assets/products/ddzy311.jpg',
  '/products/water-meters': '/assets/products/lxc-wf.jpg',
  '/products/metering-transformers': '/assets/photos/transformer-kit.jpg',
  '/products/distribution-network': '/assets/products/jp-cabinet.jpg',
  '/products/new-energy': '/assets/products/x1000.jpg',
  '/solutions/grid-intelligence': '/assets/photos/grid-city.jpg',
  '/technology': '/assets/photos/workshop-scale.jpg',
  '/about': '/assets/photos/deqing-park.jpg',
  '/careers': '/assets/photos/careers-team.jpg',
}

function render(locale, entry) {
  const alternates = locales
    .map((l) => `<link rel="alternate" hreflang="${hreflangOf[l]}" href="${url(l, entry.route)}" />`)
    .join('')
    + `<link rel="alternate" hreflang="x-default" href="${url('en', entry.route)}" />`
  const image = BASE + (OG_IMAGE[entry.route] || '/assets/video/hero-poster.jpg')

  return template
    .replace(/<html lang="[^"]*"/, `<html lang="${hreflangOf[locale]}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(entry.title)}</title>`)
    .replace(/(<meta name="description"\s+content=")[^"]*(")/s, `$1${esc(entry.desc)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(entry.title)}$2`)
    .replace(/(<meta property="og:description"\s+content=")[^"]*(")/s, `$1${esc(entry.desc)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url(locale, entry.route)}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${image}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url(locale, entry.route)}$2`)
    .replace('</head>', `${alternates}<meta property="og:locale" content="${hreflangOf[locale]}" /><meta property="og:site_name" content="Xili Technology" /><meta name="twitter:card" content="summary_large_image" /><script type="application/ld+json">${jsonLd(locale, entry)}</script></head>`)
}

let pages = 0
const sitemapEntries = []
for (const locale of locales) {
  for (const entry of routesFor(locale)) {
    const html = render(locale, entry)
    const rel = href(locale, entry.route)
    const dir = rel === '/' ? dist : join(dist, rel.replace(/^\/|\/$/g, ''))
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), html)
    pages += 1
    if (locale === 'en') sitemapEntries.push(entry.route)
  }
}

/* Launch-era product URLs: a static hop to the new slug. GitHub Pages cannot
   issue 301s, so these return 200 with a canonical + refresh to the new path and
   are kept out of the index. */
const REDIRECTS = [
  ['/products/power-intelligence', '/products/metering-instruments'],
  ['/products/battery-systems', '/products/new-energy'],
  ['/products/energy-storage', '/products/new-energy'],
]
for (const [from, to] of REDIRECTS) {
  const dir = join(dist, from.slice(1))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'),
    `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
    `<title>Moved · Xili Technology</title>` +
    `<meta name="robots" content="noindex,follow">` +
    `<link rel="canonical" href="${BASE}${to}/">` +
    `<meta http-equiv="refresh" content="0; url=${to}/">` +
    `</head><body><p>This page has moved to <a href="${to}/">${BASE}${to}/</a>.</p></body></html>\n`)
}

// Unknown URLs render the app shell (GitHub Pages serves 404.html with a 404 status).
writeFileSync(join(dist, '404.html'), template)

/* One sitemap entry per route, listing every language as an alternate. */
const today = new Date().toISOString().slice(0, 10)
writeFileSync(join(dist, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  sitemapEntries.map((route) => {
    const alts = locales
      .map((l) => `    <xhtml:link rel="alternate" hreflang="${hreflangOf[l]}" href="${url(l, route)}"/>`)
      .join('\n')
    return `  <url>\n    <loc>${url('en', route)}</loc>\n${alts}\n    <lastmod>${today}</lastmod>\n  </url>`
  }).join('\n') +
  '\n</urlset>\n')

writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`)

console.log(`postbuild: ${pages} pages across ${locales.length} locales, ${REDIRECTS.length} redirects, sitemap + robots + 404 written`)
