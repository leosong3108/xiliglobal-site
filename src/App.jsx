import { useEffect, useRef, useState } from 'react'
import { content, locales, LINKEDIN_URL } from './content'
import { ScrollProgress } from './motion.jsx'
import {
  Home, ProductsIndex, ProductCategory, SolutionsIndex, SolutionDetail,
  Technology, About, News, Careers, Contact, Arrow,
} from './pages.jsx'

// Legacy #/ links (pre-launch) redirect to real paths once, before first render.
if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1))
}

/* The product taxonomy was re-cut to match the official leaflets; the launch-era
   slugs still resolve so shared links and any early crawls do not break. */
const LEGACY_ROUTES = {
  '/products/power-intelligence': '/products/metering-instruments',
  '/products/battery-systems': '/products/new-energy',
  '/products/energy-storage': '/products/new-energy',
}

/* Locale lives in the path so each language has its own indexable URL:
   English stays at /products/…, Chinese at /zh/products/…, French at /fr/…. */
const LOCALE_PREFIX = /^\/(zh|fr)(?=\/|$)/

const currentPath = () => window.location.pathname.replace(/\/+$/, '') || '/'
const localeInPath = () => (currentPath().match(LOCALE_PREFIX) || [])[1] || null

const readRoute = () => {
  const path = currentPath().replace(LOCALE_PREFIX, '') || '/'
  return LEGACY_ROUTES[path] || path
}

export const LinkedInMark = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.4 8.9h3.1V21H3.4V8.9Zm5.5 0h2.97v1.65h.04c.41-.78 1.42-1.6 2.93-1.6 3.13 0 3.71 2.06 3.71 4.74V21h-3.09v-5.6c0-1.34-.02-3.06-1.86-3.06-1.87 0-2.15 1.46-2.15 2.96V21H8.9V8.9Z" />
  </svg>
)

/* Build an href for a route under a given locale. */
export const localeHref = (locale, route) =>
  (locale === 'en' ? '' : `/${locale}`) + (route === '/' ? '/' : route)

function useInitialLocale() {
  return useState(() => {
    // A locale in the path wins — that is the canonical form for each language.
    const fromPath = localeInPath()
    if (fromPath) return fromPath
    // ?lang=zh still works for links already shared in that form.
    const asked = new URLSearchParams(window.location.search).get('lang')
    if (locales.includes(asked)) {
      try { window.localStorage.setItem('xili-locale', asked) } catch { /* unavailable */ }
      return asked
    }
    try {
      const saved = window.localStorage.getItem('xili-locale')
      if (locales.includes(saved)) return saved
    } catch { /* storage unavailable */ }
    // International site: default to English; auto-detect only between EN/FR.
    // Chinese stays available via the manual switch (domestic site is separate).
    const preferred = (navigator.languages || [navigator.language || 'en']).map((l) => l.slice(0, 2).toLowerCase())
    return ['fr'].find((l) => preferred.includes(l)) || 'en'
  })
}

function LanguageSwitch({ locale, setLocale }) {
  return (
    <div className="locale-switch" aria-label="Language selector">
      {locales.map((item) => (
        <button
          key={item}
          className={locale === item ? 'active' : ''}
          onClick={() => setLocale(item)}
          aria-pressed={locale === item}
        >
          {content[item].locale}
        </button>
      ))}
    </div>
  )
}

function Brand({ go }) {
  return (
    <a className="brand" href="/" onClick={(e) => { e.preventDefault(); go('/') }} aria-label="Xili Technology home">
      <span className="brand-mark" aria-hidden="true">
        <img src="/assets/xili-logo-clean.png" alt="" />
      </span>
      <span className="brand-type">HANGZHOU XILI INTELLIGENT TECHNOLOGY</span>
    </a>
  )
}

function MegaMenu({ t, go, menu, onClose }) {
  if (!menu) return null
  const isProducts = menu === 'products'
  const entries = isProducts ? t.products.categories : t.solutions.items
  const base = isProducts ? '/products' : '/solutions'
  return (
    <div className="mega" onMouseLeave={onClose}>
      <div className="mega-inner page-gutter">
        <div className="mega-lead">
          <p className="section-index">{isProducts ? t.products.title : t.solutions.title}</p>
          <p className="mega-lead-text">{isProducts ? t.products.heroTitle : t.solutions.heroTitle}</p>
          <button className="text-button" onClick={() => { go(base); onClose() }}>
            {t.common.viewAll}<Arrow />
          </button>
        </div>
        <div className="mega-cols">
          {entries.map((entry, i) => (
            <button key={entry.slug} className="mega-item" style={{ '--mega-i': i }} onClick={() => { go(`${base}/${entry.slug}`); onClose() }}>
              <span className="card-number">{String(i + 1).padStart(2, '0')}</span>
              <strong>{entry.name}</strong>
              <p>{entry.tagline}</p>
              <em className="mega-item-cta">{t.common.explore} <Arrow /></em>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [locale, setLocale] = useInitialLocale()
  const [route, setRoute] = useState(readRoute)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mega, setMega] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const megaTimer = useRef(null)
  const t = content[locale]

  /* Switching language moves to that language's URL for the same route. */
  const switchLocale = (next) => {
    setLocale(next)
    window.history.replaceState(null, '', localeHref(next, route))
  }

  const go = (path) => {
    setMenuOpen(false)
    setMega(null)
    if (path === route) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.history.pushState(null, '', localeHref(locale, path))
    setRoute(path)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  useEffect(() => {
    const onPop = () => setRoute(readRoute())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    document.documentElement.lang = { zh: 'zh-Hans', fr: 'fr', en: 'en' }[locale]
    const segs = route.split('/').filter(Boolean)
    let label = ''
    if (segs[0] === 'products') {
      label = segs[1] ? (t.products.categories.find((c) => c.slug === segs[1])?.name || t.nav.products) : t.nav.products
    } else if (segs[0] === 'solutions') {
      label = segs[1] ? (t.solutions.items.find((i) => i.slug === segs[1])?.name || t.nav.solutions) : t.nav.solutions
    } else if (segs[0]) {
      label = { technology: t.nav.technology, about: t.nav.about, news: t.nav.news, careers: t.careers.title, contact: t.nav.contact }[segs[0]] || ''
    }
    document.title = label ? `${label} · ${t.meta.title}` : t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    const canonicalPath = localeHref(locale, route)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href',
      `https://xiliglobal.com${canonicalPath.endsWith('/') ? canonicalPath : `${canonicalPath}/`}`)
    try { window.localStorage.setItem('xili-locale', locale) } catch { /* unavailable */ }
  }, [locale, t, route])

  useEffect(() => {
    let frame = 0
    const update = () => { frame = 0; setScrolled(window.scrollY > 12) }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame) }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [menuOpen])

  const openMega = (which) => { clearTimeout(megaTimer.current); setMega(which) }
  const scheduleMegaClose = () => { clearTimeout(megaTimer.current); megaTimer.current = setTimeout(() => setMega(null), 180) }

  const segments = route.split('/').filter(Boolean)
  let page
  if (segments.length === 0) page = <Home t={t} go={go} />
  else if (segments[0] === 'products' && segments[1]) page = <ProductCategory t={t} go={go} slug={segments[1]} />
  else if (segments[0] === 'products') page = <ProductsIndex t={t} go={go} />
  else if (segments[0] === 'solutions' && segments[1]) page = <SolutionDetail t={t} go={go} slug={segments[1]} />
  else if (segments[0] === 'solutions') page = <SolutionsIndex t={t} go={go} />
  else if (segments[0] === 'technology') page = <Technology t={t} go={go} />
  else if (segments[0] === 'about') page = <About t={t} go={go} />
  else if (segments[0] === 'news') page = <News t={t} go={go} />
  else if (segments[0] === 'careers') page = <Careers t={t} go={go} />
  else if (segments[0] === 'contact') page = <Contact t={t} go={go} />
  else page = <Home t={t} go={go} />

  const navItems = [
    ['products', t.nav.products, '/products', true],
    ['solutions', t.nav.solutions, '/solutions', true],
    ['technology', t.nav.technology, '/technology', false],
    ['about', t.nav.about, '/about', false],
    ['news', t.nav.news, '/news', false],
    ['careers', t.nav.careers, '/careers', false],
  ]
  const sectionOf = (path) => path.split('/').filter(Boolean)[0] || ''

  return (
    <div className="site-shell">
      <ScrollProgress />

      <header
        className={`site-header ${scrolled ? 'is-scrolled' : ''} ${mega ? 'mega-open' : ''}`}
        onMouseLeave={scheduleMegaClose}
      >
        <div className="header-inner">
          <Brand go={go} />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map(([key, label, path, hasMega]) => (
              <button
                key={key}
                className={sectionOf(route) === key ? 'active' : ''}
                onClick={() => go(path)}
                onMouseEnter={() => (hasMega ? openMega(key) : setMega(null))}
                aria-expanded={hasMega ? mega === key : undefined}
              >
                {label}
                {hasMega && <i className="nav-caret" aria-hidden="true" />}
              </button>
            ))}
          </nav>
          <div className="header-actions">
            <LanguageSwitch locale={locale} setLocale={switchLocale} />
            <button className="header-contact" onClick={() => go('/contact')}>{t.nav.contact}</button>
            <button
              className="menu-button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? t.common.close : t.common.menu}
              aria-expanded={menuOpen}
            >
              <svg aria-hidden="true" viewBox="0 0 28 28" width="28" height="28" fill="none">
                {menuOpen
                  ? <path d="M7 7l14 14M21 7L7 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  : <path d="M4 9h20M4 19h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
              </svg>
            </button>
          </div>
        </div>
        <div onMouseEnter={() => clearTimeout(megaTimer.current)}>
          <MegaMenu t={t} go={go} menu={mega} onClose={() => setMega(null)} />
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-inner">
          {[...navItems.map(([, label, path]) => [label, path]), [t.nav.contact, '/contact']].map(([label, path], index) => (
            <button key={path} style={{ '--menu-index': index }} onClick={() => go(path)} tabIndex={menuOpen ? 0 : -1}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {label}
            </button>
          ))}
          <div className="mobile-menu-sub">
            {t.products.categories.map((cat) => (
              <button key={cat.slug} onClick={() => go(`/products/${cat.slug}`)} tabIndex={menuOpen ? 0 : -1}>{cat.name}</button>
            ))}
            {t.solutions.items.map((item) => (
              <button key={item.slug} onClick={() => go(`/solutions/${item.slug}`)} tabIndex={menuOpen ? 0 : -1}>{item.name}</button>
            ))}
          </div>
          <div className="mobile-menu-meta">
            <LanguageSwitch locale={locale} setLocale={switchLocale} />
            <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
          </div>
        </div>
      </div>

      <main key={route} className="page">{page}</main>

      <footer className="site-footer page-gutter">
        <p className="footer-word" aria-hidden="true">XILI</p>
        <div className="footer-top">
          <div className="footer-brand">
            <Brand go={go} />
            <p>{t.footer.descriptor}</p>
          </div>
          <nav className="footer-col" aria-label={t.footer.colProducts}>
            <p>{t.footer.colProducts}</p>
            <button onClick={() => go('/products')}>{t.common.viewAll}</button>
            {t.products.categories.map((cat) => (
              <button key={cat.slug} onClick={() => go(`/products/${cat.slug}`)}>{cat.name}</button>
            ))}
          </nav>
          <nav className="footer-col" aria-label={t.footer.colSolutions}>
            <p>{t.footer.colSolutions}</p>
            <button onClick={() => go('/solutions')}>{t.common.viewAll}</button>
            {t.solutions.items.map((item) => (
              <button key={item.slug} onClick={() => go(`/solutions/${item.slug}`)}>{item.name}</button>
            ))}
          </nav>
          <nav className="footer-col" aria-label={t.footer.colCompany}>
            <p>{t.footer.colCompany}</p>
            <button onClick={() => go('/technology')}>{t.nav.technology}</button>
            <button onClick={() => go('/about')}>{t.nav.about}</button>
            <button onClick={() => go('/news')}>{t.nav.news}</button>
            <button onClick={() => go('/careers')}>{t.nav.careers}</button>
            <button onClick={() => go('/contact')}>{t.nav.contact}</button>
            <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-legal">{t.footer.legal}</p>
          <a
            className="footer-social"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer me"
          >
            <LinkedInMark />
            <span>{t.contact.linkedinCta}</span>
          </a>
        </div>
      </footer>

    </div>
  )
}

export default App
