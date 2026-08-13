import { useEffect, useRef } from 'react'
import {
  Reveal, SplitTitle, CountUp, Magnetic,
  EnergyCanvas, TwinCanvas, GlobeCanvas,
} from './motion.jsx'
import { partnersList } from './content'
import { catalogBySlug, specLabels } from './catalog'

/* Image frame: real photo when src is given, designed placeholder otherwise. */
export function ImageSlot({ label, src, ratio = '16 / 9', className = '', decorative = false }) {
  if (src) {
    return (
      <div className={`img-slot img-slot-photo ${className}`} style={{ aspectRatio: ratio }}>
        <img src={src} alt={decorative ? '' : label} loading="lazy" />
      </div>
    )
  }
  return (
    <div className={`img-slot ${className}`} style={{ aspectRatio: ratio }} role="img" aria-label={label}>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M3.5 5h17v14h-17zM3.5 15.5l5-5 4 4 3-3 5.5 5.5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        <circle cx="9.2" cy="9.2" r="1.5" stroke="currentColor" strokeWidth="1.1" />
      </svg>
      <span>{label}</span>
    </div>
  )
}

/* Force muted before play() — React can set the property after the autoplay
   attempt, which some browsers then block. */
function useAutoplay() {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    const tryPlay = () => { if (v.paused) v.play().catch(() => {}) }
    tryPlay()
    const timers = [setTimeout(tryPlay, 400), setTimeout(tryPlay, 1500)]
    v.addEventListener('canplay', tryPlay)
    document.addEventListener('visibilitychange', tryPlay)
    window.addEventListener('pointerdown', tryPlay, { once: true })
    return () => {
      timers.forEach(clearTimeout)
      v.removeEventListener('canplay', tryPlay)
      document.removeEventListener('visibilitychange', tryPlay)
      window.removeEventListener('pointerdown', tryPlay)
    }
  }, [])
  return ref
}

/* Muted looping video frame; reduced-motion users get the poster still. */
export function VideoLoop({ src, poster, ratio, className = '' }) {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const ref = useAutoplay()
  return (
    <div className={`img-slot img-slot-photo media-cover ${className}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      {reduced ? (
        <img src={poster} alt="" loading="lazy" />
      ) : (
        <video ref={ref} src={src} poster={poster} autoPlay muted loop playsInline preload="metadata" />
      )}
    </div>
  )
}

function HeroVideo() {
  const ref = useAutoplay()
  return (
    <video
      ref={ref}
      className="hero-v-media"
      src="/assets/video/hero.mp4"
      poster="/assets/video/hero-poster.jpg"
      autoPlay muted loop playsInline preload="auto"
    />
  )
}

export const Arrow = () => (
  <svg aria-hidden="true" viewBox="0 0 18 18" width="18" height="18" fill="none">
    <path d="M3 9h11M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function Crumbs({ trail, go }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {trail.map(([label, path], i) => (
        <span key={i}>
          {path ? (
            <a href={`#${path}`} onClick={(e) => { e.preventDefault(); go(path) }}>{label}</a>
          ) : (
            <em>{label}</em>
          )}
          {i < trail.length - 1 && <i aria-hidden="true">/</i>}
        </span>
      ))}
    </nav>
  )
}

export function PageHero({ trail, go, title, body, index, compact = false }) {
  return (
    <section className={`page-hero ${compact ? 'page-hero-compact' : ''}`}>
      <EnergyCanvas className="page-hero-canvas" density={16} pulses={4} />
      <div className="page-hero-inner page-gutter">
        {trail && <Crumbs trail={trail} go={go} />}
        {index && <Reveal as="p" className="giant-index" delay={60}>{index}</Reveal>}
        <SplitTitle as="h1" text={title} />
        {body && <Reveal as="p" className="page-hero-body" delay={380}>{body}</Reveal>}
      </div>
      <div className="hero-baseline" aria-hidden="true" />
    </section>
  )
}

export function CtaBand({ t, go }) {
  return (
    <section className="cta-band">
      <EnergyCanvas className="cta-canvas" density={12} pulses={3} />
      <Reveal className="cta-inner page-gutter">
        <p className="section-index">{t.nav.contact}</p>
        <SplitTitle as="h2" text={t.home.ctaTitle} />
        <p className="cta-body">{t.home.ctaBody}</p>
        <Magnetic className="button button-glow" onClick={() => go('/contact')}>
          <span>{t.contact.action}</span><Arrow />
        </Magnetic>
      </Reveal>
    </section>
  )
}

/* Horizontal snap-scrolling shell: axis track, drag-to-scroll, prev/next. */
export function HScroller({ className = '', children }) {
  const trackRef = useRef(null)
  const drag = useRef(null)

  const page = (dir) => {
    const el = trackRef.current
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 760), behavior: 'smooth' })
  }
  const onPointerDown = (e) => {
    const el = trackRef.current
    if (!el) return
    drag.current = { x: e.clientX, left: el.scrollLeft }
    el.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    const el = trackRef.current
    if (!el || !drag.current) return
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x)
  }
  const onPointerUp = () => { drag.current = null }

  return (
    <div className={`tl ${className}`}>
      <div className="tl-controls">
        <button type="button" aria-label="Previous" onClick={() => page(-1)}><Arrow /></button>
        <button type="button" aria-label="Next" onClick={() => page(1)}><Arrow /></button>
      </div>
      <div
        className="tl-track"
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {children}
      </div>
    </div>
  )
}

/* Milestone timeline on the shared scroller */
export function HTimeline({ items }) {
  return (
    <HScroller>
      {items.map(([year, title, text], i) => (
        <Reveal key={year + title} delay={(i % 4) * 80} className="tl-item">
          <strong>{year}</strong>
          <i className="tl-node" aria-hidden="true" />
          <h3>{title}</h3>
          <p>{text}</p>
        </Reveal>
      ))}
    </HScroller>
  )
}

const cardImg = {
  'metering-instruments': '/assets/products/ddzy311.jpg',
  'metering-transformers': '/assets/products/jzzv1-10.jpg',
  'distribution-network': '/assets/products/jp-cabinet.jpg',
  'new-energy': '/assets/products/x1000.jpg',
}
const cardCover = {}
/* Wide photo band under each series intro (metering instruments lead with the catalogue). */
const seriesBand = {
  'metering-transformers': '/assets/photos/robot-cell.jpg',
  'distribution-network': '/assets/photos/warehouse.jpg',
  'new-energy': '/assets/photos/portable-power.jpg',
}
/* Export-market coordinates, same order as t.about.globalMarkets. */
const marketCoords = [
  [13.75, 100.5], [23.8, 90.4], [-6.2, 106.85], [37.55, 127.0], [14.6, 121.0],
  [49.0, 31.0],
  [5.6, -0.2], [6.45, 3.4], [-33.45, -70.66], [-0.18, -78.47], [24.86, 67.0],
]
const HUB_COORDS = [30.25, 120.16]

const solImg = {
  'grid-intelligence': '/assets/photos/grid-kit.jpg',
  'pv-storage-charging': '/assets/photos/pv-solution.jpg',
  'commercial-energy': '/assets/photos/ci-energy.jpg',
  'apartment-energy': '/assets/photos/apartment-solution.jpg',
  'campus-energy': '/assets/photos/campus-solution.jpg',
}

/* ---------------- Home ---------------- */

export function Home({ t, go }) {
  return (
    <>
      <section className="hero-v">
        <HeroVideo />
        <div className="hero-v-scrim" aria-hidden="true" />
        <div className="hero-v-inner page-gutter">
          <Reveal as="p" className="hero-kicker on-video" delay={60}><i aria-hidden="true" />{t.home.heroKicker}</Reveal>
          <SplitTitle as="h1" text={t.home.heroTitle} />
          <Reveal as="p" className="hero-v-body" delay={300}>{t.home.heroBody}</Reveal>
          <Reveal className="hero-actions" delay={420}>
            <Magnetic className="button button-glow" onClick={() => go('/products')}>
              <span>{t.home.heroPrimary}</span><Arrow />
            </Magnetic>
            <Magnetic className="text-button on-video" onClick={() => go('/about')}>
              {t.home.heroSecondary}<Arrow />
            </Magnetic>
          </Reveal>
        </div>
      </section>

      <section className="stats-band">
        <Reveal as="dl" className="hero-stats page-gutter" delay={80}>
          {t.home.stats.map(([value, suffix, label]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd><CountUp value={value} />{suffix}</dd>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="products-m page-gutter">
        <Reveal className="section-head split-head">
          <div>
            <p className="section-index">{t.home.productsIndex}</p>
            <h2>{t.home.productsTitle}</h2>
          </div>
          <div className="split-head-side">
            <p>{t.home.productsBody}</p>
            <button className="text-button" onClick={() => go('/products')}>{t.common.viewAll}<Arrow /></button>
          </div>
        </Reveal>
        <div className="product-cards">
          {t.products.categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 90}>
              <article
                className="product-card"
                role="link" tabIndex={0}
                onClick={() => go(`/products/${cat.slug}`)}
                onKeyDown={(e) => { if (e.key === 'Enter') go(`/products/${cat.slug}`) }}
              >
                <ImageSlot
                  src={cardImg[cat.slug]}
                  label={cardImg[cat.slug] ? cat.name : `${t.common.imageSoon} · ${cat.name}`}
                  ratio="16 / 10"
                  className={cardCover[cat.slug] ? 'media-cover' : ''}
                />
                <div className="product-card-body">
                  <span className="card-index">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{cat.name}</h3>
                  <p>{cat.tagline}</p>
                  <ul>
                    {cat.items.map(([name]) => <li key={name}>{name}</li>)}
                  </ul>
                  <span className="card-cta">{t.common.explore}<Arrow /></span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="solutions-m page-gutter">
        <Reveal className="section-head split-head">
          <div>
            <p className="section-index">{t.home.solutionsIndex}</p>
            <h2>{t.home.solutionsTitle}</h2>
          </div>
          <div className="split-head-side">
            <p>{t.home.solutionsBody}</p>
            <button className="text-button" onClick={() => go('/solutions')}>{t.common.viewAll}<Arrow /></button>
          </div>
        </Reveal>
        <div className="solution-cards">
          {t.solutions.items.map((item, i) => (
            <Reveal key={item.slug} delay={i * 90}>
              <article
                className="solution-card"
                role="link" tabIndex={0}
                onClick={() => go(`/solutions/${item.slug}`)}
                onKeyDown={(e) => { if (e.key === 'Enter') go(`/solutions/${item.slug}`) }}
              >
                <ImageSlot src={solImg[item.slug]} label={item.name} ratio="16 / 9" className="media-cover" />
                <div className="solution-card-body">
                  <h3>{item.name}</h3>
                  <p className="solution-card-tag">{item.tagline}</p>
                  <p className="solution-card-desc">{item.description}</p>
                  <span className="card-cta">{t.common.learnMore}<Arrow /></span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="tech-m page-gutter">
        <Reveal className="tech-m-grid">
          <div className="tech-m-copy">
            <p className="section-index">{t.home.technologyIndex}</p>
            <h2>{t.home.technologyTitle}</h2>
            <p className="section-lede">{t.home.technologyBody}</p>
            <Magnetic className="text-button" onClick={() => go('/technology')}>
              {t.home.technologyAction}<Arrow />
            </Magnetic>
          </div>
          <VideoLoop src="/assets/video/tech-robot.mp4" poster="/assets/video/tech-robot-poster.jpg" ratio="16 / 11" className="tech-m-media" />
        </Reveal>
      </section>

      <section className="news-m page-gutter">
        <Reveal className="section-head split-head">
          <div>
            <p className="section-index">{t.home.newsIndex}</p>
            <h2>{t.home.newsTitle}</h2>
          </div>
          <div className="split-head-side">
            <button className="text-button" onClick={() => go('/news')}>{t.common.viewAll}<Arrow /></button>
          </div>
        </Reveal>
        <div className="news-cards">
          {t.news.items.slice(0, 3).map(([year, tag, title, text, img], i) => (
            <Reveal key={title} delay={i * 90}>
              <article
                className="news-card"
                role="link" tabIndex={0}
                onClick={() => go('/news')}
                onKeyDown={(e) => { if (e.key === 'Enter') go('/news') }}
              >
                <ImageSlot
                  src={img ? `/assets/photos/${img}.jpg` : undefined}
                  label={img ? title : `${t.common.imageSoon} · ${tag}`}
                  decorative
                  ratio="16 / 9"
                  className={img && !img.startsWith('doc-') ? 'media-cover' : ''}
                />
                <div className="news-card-body">
                  <p className="news-card-meta"><span>{year}</span><em>{tag}</em></p>
                  <h3>{title}</h3>
                  <p className="news-card-text">{text}</p>
                  <span className="card-cta">{t.common.readMore}<Arrow /></span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="partners page-gutter">
        <Reveal className="section-head partners-head">
          <p className="section-index">{t.home.partnersIndex}</p>
          <h2>{t.home.partnersTitle}</h2>
          <p className="section-lede">{t.home.partnersBody}</p>
        </Reveal>
        <div className="partner-wall">
          {partnersList.map(([latin, zh, logo], i) => {
            const name = t.home.zhFirst ? (zh || latin) : (latin || zh)
            return (
              <Reveal key={logo} delay={(i % 5) * 45} className="partner-cell">
                <img src={`/assets/partners/${logo}.png`} alt={name} loading="lazy" title={name} />
                <span className="partner-name">{name}</span>
              </Reveal>
            )
          })}
        </div>
      </section>

      <CtaBand t={t} go={go} />
    </>
  )
}

/* ---------------- Products ---------------- */

export function ProductsIndex({ t, go }) {
  return (
    <>
      <PageHero
        go={go}
        trail={[[t.common.home, '/'], [t.products.title, null]]}
        title={t.products.heroTitle}
        body={t.products.heroBody}
      />
      <section className="index-cards page-gutter">
        <Reveal as="p" className="section-index">{t.common.categories}</Reveal>
        <div className="product-cards">
          {t.products.categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 90}>
              <article
                className="product-card"
                role="link" tabIndex={0}
                onClick={() => go(`/products/${cat.slug}`)}
                onKeyDown={(e) => { if (e.key === 'Enter') go(`/products/${cat.slug}`) }}
              >
                <ImageSlot
                  src={cardImg[cat.slug]}
                  label={cardImg[cat.slug] ? cat.name : `${t.common.imageSoon} · ${cat.name}`}
                  ratio="16 / 10"
                  className={cardCover[cat.slug] ? 'media-cover' : ''}
                />
                <div className="product-card-body">
                  <span className="card-index">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{cat.name}</h3>
                  <p>{cat.tagline}</p>
                  <p className="solution-card-desc">{cat.description}</p>
                  <ul>
                    {cat.items.map(([name]) => <li key={name}>{name}</li>)}
                  </ul>
                  <span className="card-cta">{t.common.explore}<Arrow /></span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand t={t} go={go} />
    </>
  )
}

export function ProductCategory({ t, go, slug }) {
  const idx = t.products.categories.findIndex((c) => c.slug === slug)
  const cat = t.products.categories[idx]
  if (!cat) return null
  const others = t.products.categories.filter((c) => c.slug !== slug)
  const groups = catalogBySlug[slug] || []
  return (
    <>
      <PageHero
        go={go}
        trail={[[t.common.home, '/'], [t.common.breadcrumbProducts, '/products'], [cat.name, null]]}
        index={String(idx + 1).padStart(2, '0')}
        title={cat.tagline}
        body={cat.description}
        compact
      />
      <section className="detail-intro page-gutter">
        <Reveal className="detail-grid">
          <div>
            <p className="section-index">{cat.name}</p>
            <p className="detail-long">{cat.longText}</p>
          </div>
          <ul className="point-list">
            {cat.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
        </Reveal>
        {seriesBand[slug] && (
          <Reveal delay={120}>
            <ImageSlot src={seriesBand[slug]} label={cat.name} ratio="21 / 8" className="photo-band media-cover" decorative />
          </Reveal>
        )}
      </section>

      <section className="panel-section page-gutter">
        <Reveal as="p" className="section-index">{t.products.catalogIndex}</Reveal>
        {groups.map((group) => (
          <div className="catalog-group" key={group.key}>
            <Reveal as="h2" className="catalog-title">{group.title[t.code]}</Reveal>
            {group.note && <Reveal as="p" className="catalog-note">{group.note[t.code]}</Reveal>}
            <div className="model-grid">
              {group.items.map((item, i) => (
                <Reveal key={item.img} delay={(i % 4) * 60}>
                  <article className="model-card">
                    <ImageSlot src={`/assets/products/${item.img}.jpg`} label={item.model} decorative ratio="1 / 1" />
                    <div className="model-card-body">
                      <strong>{item.model}</strong>
                      <p>{item.name[t.code]}</p>
                      {item.specs && (
                        <dl className="model-specs">
                          {item.specs.map(([key, value]) => (
                            <div key={key}>
                              <dt>{specLabels[key]?.[t.code] || key}</dt>
                              <dd>{value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
        <Reveal as="p" className="tech-note">{t.products.seriesNote}</Reveal>
      </section>

      <section className="related page-gutter">
        <Reveal as="p" className="section-index">{t.common.related}</Reveal>
        <div className="related-grid">
          {others.map((other) => (
            <Reveal key={other.slug}>
              <button className="related-card" onClick={() => go(`/products/${other.slug}`)}>
                <strong>{other.name}</strong>
                <p>{other.tagline}</p>
                <i className="row-arrow" aria-hidden="true"><Arrow /></i>
              </button>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand t={t} go={go} />
    </>
  )
}

/* ---------------- Solutions ---------------- */

export function SolutionsIndex({ t, go }) {
  return (
    <>
      <PageHero
        go={go}
        trail={[[t.common.home, '/'], [t.solutions.title, null]]}
        title={t.solutions.heroTitle}
        body={t.solutions.heroBody}
      />
      <section className="index-cards page-gutter">
        <Reveal as="p" className="section-index">{t.common.directions}</Reveal>
        <div className="solution-cards">
          {t.solutions.items.map((item, i) => (
            <Reveal key={item.slug} delay={i * 90}>
              <article
                className="solution-card"
                role="link" tabIndex={0}
                onClick={() => go(`/solutions/${item.slug}`)}
                onKeyDown={(e) => { if (e.key === 'Enter') go(`/solutions/${item.slug}`) }}
              >
                <ImageSlot src={solImg[item.slug]} label={item.name} ratio="16 / 9" className="media-cover" />
                <div className="solution-card-body">
                  <h3>{item.name}</h3>
                  <p className="solution-card-tag">{item.tagline}</p>
                  <p className="solution-card-desc">{item.description}</p>
                  <ul className="mini-chips">
                    {item.points.map(([point]) => <li key={point}>{point}</li>)}
                  </ul>
                  <span className="card-cta">{t.common.learnMore}<Arrow /></span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand t={t} go={go} />
    </>
  )
}

export function SolutionDetail({ t, go, slug }) {
  const idx = t.solutions.items.findIndex((s) => s.slug === slug)
  const item = t.solutions.items[idx]
  if (!item) return null
  const others = t.solutions.items.filter((s) => s.slug !== slug)
  return (
    <>
      <PageHero
        go={go}
        trail={[[t.common.home, '/'], [t.common.breadcrumbSolutions, '/solutions'], [item.name, null]]}
        index={String(idx + 1).padStart(2, '0')}
        title={item.tagline}
        body={item.description}
        compact
      />
      <section className="detail-intro page-gutter">
        <Reveal className="detail-grid">
          <div>
            <p className="section-index">{item.name}</p>
            <p className="detail-long">{item.longText}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <ImageSlot src={solImg[item.slug]} label={item.name} ratio="21 / 8" className="photo-band media-cover" />
        </Reveal>
      </section>
      <section className="panel-section page-gutter">
        <Reveal as="p" className="section-index">{t.common.keyPoints}</Reveal>
        <div className="panel-grid">
          {item.points.map(([title, description], i) => (
            <Reveal key={title} delay={i * 80}>
              <article className="glass-panel">
                <span className="giant-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="steps-section page-gutter">
        <Reveal as="p" className="section-index">{t.common.process}</Reveal>
        <div className="steps">
          {item.steps.map((step, i) => (
            <Reveal key={step} delay={i * 80} className="step">
              <span className="step-number">{String(i + 1).padStart(2, '0')}</span>
              <p>{step}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="related page-gutter">
        <Reveal as="p" className="section-index">{t.common.related}</Reveal>
        <div className="related-grid">
          {others.map((other) => (
            <Reveal key={other.slug}>
              <button className="related-card" onClick={() => go(`/solutions/${other.slug}`)}>
                <strong>{other.name}</strong>
                <p>{other.tagline}</p>
                <i className="row-arrow" aria-hidden="true"><Arrow /></i>
              </button>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand t={t} go={go} />
    </>
  )
}

/* ---------------- Technology ---------------- */

export function Technology({ t, go }) {
  return (
    <>
      <PageHero
        go={go}
        trail={[[t.common.home, '/'], [t.technology.title, null]]}
        title={t.technology.heroTitle}
        body={t.technology.heroBody}
      />
      <section className="panel-section page-gutter">
        <Reveal className="section-head">
          <p className="section-index">{t.technology.title}</p>
          <SplitTitle as="h2" text={t.technology.sectionTitle} />
          <p className="section-lede">{t.technology.sectionBody}</p>
        </Reveal>
        <div className="panel-grid panel-grid-4">
          {t.technology.list.map(([title, description], i) => (
            <Reveal key={title} delay={i * 80}>
              <article className="glass-panel">
                <span className="giant-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal as="p" className="tech-note">{t.technology.note}</Reveal>
        <Reveal delay={120}>
          <VideoLoop src="/assets/video/tech-line.mp4" poster="/assets/video/tech-line-poster.jpg" ratio="21 / 8" className="photo-band" />
        </Reveal>
      </section>

      <section className="twin-section page-gutter">
        <Reveal className="section-head">
          <p className="section-index">{t.technology.twinIndex}</p>
          <SplitTitle as="h2" text={t.technology.twinTitle} />
          <p className="section-lede">{t.technology.twinBody}</p>
        </Reveal>
        <Reveal delay={100}>
          <div className="twin-band">
            <TwinCanvas />
            <div className="twin-tags">
              {t.technology.twinTags.map((tag) => (
                <span key={tag} className="twin-tag">{tag}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="panel-section page-gutter">
        <Reveal className="section-head">
          <p className="section-index">{t.technology.aiIndex}</p>
          <SplitTitle as="h2" text={t.technology.aiTitle} />
          <p className="section-lede">{t.technology.aiBody}</p>
        </Reveal>
        <div className="panel-grid panel-grid-4">
          {t.technology.aiList.map(([title, description], i) => (
            <Reveal key={title} delay={i * 80}>
              <article className="glass-panel">
                <span className="giant-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <ImageSlot src="/assets/photos/robot-glow.jpg" label={t.technology.aiIndex} ratio="21 / 8" className="photo-band media-cover" decorative />
        </Reveal>
      </section>

      <section className="panel-section page-gutter">
        <Reveal className="section-head">
          <p className="section-index">{t.technology.labsIndex}</p>
          <SplitTitle as="h2" text={t.technology.labsTitle} />
          <p className="section-lede">{t.technology.labsBody}</p>
        </Reveal>
        <div className="panel-grid panel-grid-4">
          {t.technology.labsList.map(([title, description], i) => (
            <Reveal key={title} delay={i * 80}>
              <article className="glass-panel">
                <span className="giant-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <ImageSlot src="/assets/photos/lab-auto.jpg" label={t.technology.labsIndex} ratio="21 / 8" className="photo-band media-cover" decorative />
        </Reveal>
      </section>

      <section className="ip-band page-gutter">
        <Reveal className="ip-band-inner">
          <div className="ip-band-head">
            <p className="section-index">{t.technology.ipIndex}</p>
            <h2>{t.technology.ipTitle}</h2>
            <p className="ip-note">{t.technology.ipNote}</p>
          </div>
          <dl className="ip-stats">
            {t.technology.ipStats.map(([value, suffix, label]) => (
              <div key={label}>
                <dd><CountUp value={value} />{suffix}</dd>
                <dt>{label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="timeline-section page-gutter">
        <Reveal as="p" className="section-index">{t.technology.milestonesTitle}</Reveal>
        <HTimeline items={t.technology.milestones} />
      </section>
      <CtaBand t={t} go={go} />
    </>
  )
}

/* ---------------- About ---------------- */

export function About({ t, go }) {
  return (
    <>
      <PageHero
        go={go}
        trail={[[t.common.home, '/'], [t.about.title, null]]}
        title={t.about.heroTitle}
        body={t.about.heroBody}
      />
      <section className="detail-intro page-gutter">
        <Reveal className="detail-grid">
          <div>
            <p className="section-index">{t.about.storyTitle}</p>
            <p className="detail-long">{t.about.storyBody}</p>
            <a className="text-button" href={t.about.officialUrl} target="_blank" rel="noopener noreferrer">
              {t.about.officialAction}<Arrow />
            </a>
          </div>
          <dl className="about-facts">
            {t.about.honorStats.slice(0, 3).map(([value, suffix, label]) => (
              <div key={label}>
                <dd><CountUp value={value} />{suffix}</dd>
                <dt>{label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={120}>
          <ImageSlot src="/assets/photos/deqing-park.jpg" label={t.about.title} ratio="21 / 8" className="photo-band media-cover" decorative />
        </Reveal>
      </section>

      <section className="about-timeline page-gutter">
        <Reveal as="p" className="section-index">{t.about.timelineTitle}</Reveal>
        <HTimeline items={t.about.timeline} />
      </section>

      <section className="global-section page-gutter">
        <Reveal className="global-grid">
          <div>
            <p className="section-index">{t.about.globalIndex}</p>
            <SplitTitle as="h2" text={t.about.globalTitle} />
            <p className="section-lede">{t.about.globalBody}</p>
            <div className="market-chips">
              {t.about.globalMarkets.map((m) => (
                <span key={m} className="market-chip">{m}</span>
              ))}
            </div>
          </div>
          <dl className="about-facts">
            {t.about.globalStats.map(([value, suffix, label]) => (
              <div key={label}>
                <dd><CountUp value={value} />{suffix}</dd>
                <dt>{label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={120}>
          <div className="globe-band">
            <GlobeCanvas
              hub={[HUB_COORDS[0], HUB_COORDS[1], t.about.globalHub]}
              markets={t.about.globalMarkets.map((name, i) => [name, marketCoords[i][0], marketCoords[i][1]])}
            />
          </div>
        </Reveal>
      </section>

      <section className="ip-band page-gutter">
        <Reveal className="ip-band-inner">
          <div className="ip-band-head">
            <p className="section-index">{t.about.investorIndex}</p>
            <h2>{t.about.investorTitle}</h2>
            <p className="ip-note">{t.about.investorNote}</p>
          </div>
          <dl className="ip-stats">
            {t.about.investorStats.map(([value, label]) => (
              <div key={label}>
                <dd>{value}</dd>
                <dt>{label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="panel-section page-gutter">
        <Reveal className="section-head">
          <p className="section-index">{t.about.subsidiariesIndex}</p>
          <SplitTitle as="h2" text={t.about.subsidiariesTitle} />
        </Reveal>
        <div className="sub-grid">
          {t.about.subsidiaries.map(([name, field, body], i) => (
            <Reveal key={name} delay={i * 90}>
              <article className="sub-card">
                <span className="card-number">{String(i + 1).padStart(2, '0')}</span>
                <h3>{name}</h3>
                <p className="sub-field">{field}</p>
                <p>{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="panel-section page-gutter">
        <Reveal className="section-head">
          <p className="section-index">{t.about.valuesTitle}</p>
          <p className="section-lede">{t.about.valuesLede}</p>
        </Reveal>
        <div className="panel-grid">
          {t.about.values.map(([title, description], i) => (
            <Reveal key={title} delay={i * 80}>
              <article className="glass-panel value-panel">
                <span className="giant-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="honors-section page-gutter">
        <Reveal as="p" className="section-index">{t.about.honorsTitle}</Reveal>
        <Reveal as="dl" className="honor-stats" delay={80}>
          {t.about.honorStats.map(([value, suffix, label]) => (
            <div key={label}>
              <dd><CountUp value={value} />{suffix}</dd>
              <dt>{label}</dt>
            </div>
          ))}
        </Reveal>
        <Reveal as="ul" className="honor-badges" delay={160}>
          {t.about.honors.map((h) => <li key={h}>{h}</li>)}
        </Reveal>
      </section>

      <section className="panel-section page-gutter">
        <Reveal as="p" className="section-index">{t.about.csrTitle}</Reveal>
        <div className="panel-grid">
          {t.about.csr.map(([title, description], i) => (
            <Reveal key={title} delay={i * 80}>
              <article className="glass-panel">
                <span className="giant-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand t={t} go={go} />
    </>
  )
}

/* ---------------- News ---------------- */

export function News({ t, go }) {
  return (
    <>
      <PageHero
        go={go}
        trail={[[t.common.home, '/'], [t.news.title, null]]}
        title={t.news.heroTitle}
        body={t.news.heroBody}
      />
      <section className="news-tl page-gutter">
        <HScroller className="ntl">
          {t.news.items.map(([year, tag, title, text, img], i) => (
            <Reveal key={title} delay={(i % 3) * 90} className="tl-item ntl-item">
              <p className="ntl-year"><strong>{year}</strong><em>{tag}</em></p>
              <i className="tl-node" aria-hidden="true" />
              <article className="ntl-card">
                <ImageSlot
                  src={img ? `/assets/photos/${img}.jpg` : undefined}
                  label={title}
                  decorative
                  ratio="16 / 9"
                  className={img && !img.startsWith('doc-') ? 'media-cover' : ''}
                />
                <div className="ntl-body">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </HScroller>
        <Reveal as="p" className="news-note">{t.news.note}</Reveal>
      </section>
      <CtaBand t={t} go={go} />
    </>
  )
}

/* ---------------- Careers ---------------- */

export function Careers({ t, go }) {
  return (
    <>
      <PageHero
        go={go}
        trail={[[t.common.home, '/'], [t.careers.title, null]]}
        title={t.careers.heroTitle}
        body={t.careers.heroBody}
      />
      <section className="panel-section page-gutter">
        <Reveal as="p" className="section-index">{t.careers.whyTitle}</Reveal>
        <div className="panel-grid">
          {t.careers.why.map(([title, description], i) => (
            <Reveal key={title} delay={i * 80}>
              <article className="glass-panel">
                <span className="giant-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <ImageSlot src="/assets/photos/careers-team.jpg" label={t.careers.title} ratio="21 / 8" className="photo-band media-cover" />
        </Reveal>
      </section>
      <section className="careers-areas page-gutter">
        <Reveal as="p" className="section-index">{t.careers.areasTitle}</Reveal>
        <div className="area-rows">
          {t.careers.areas.map(([title, description], i) => (
            <Reveal key={title} delay={i * 70}>
              <a className="area-row" href={`mailto:${t.contact.email}?subject=${encodeURIComponent(title)}`}>
                <span className="giant-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <strong>{title}</strong>
                <p>{description}</p>
                <i className="row-arrow" aria-hidden="true"><Arrow /></i>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal className="careers-cta">
          <Magnetic as="a" className="button button-glow" href={`mailto:${t.contact.email}`}>
            <span>{t.careers.action}</span><Arrow />
          </Magnetic>
          <p>{t.careers.note}</p>
        </Reveal>
      </section>
    </>
  )
}

/* ---------------- Contact ---------------- */

export function Contact({ t }) {
  return (
    <>
    <section className="contact-hero">
      <EnergyCanvas className="page-hero-canvas" density={20} pulses={5} />
      <div className="contact-hero-inner page-gutter">
        <div>
          <p className="section-index">{t.contact.title}</p>
          <SplitTitle as="h1" text={t.contact.heroTitle} />
          <Reveal as="p" className="page-hero-body" delay={350}>{t.contact.heroBody}</Reveal>
        </div>
        <Reveal className="contact-card" delay={200}>
          <p className="section-index">{t.contact.channelsTitle}</p>
          <div className="contact-field">
            <span>{t.contact.emailTitle}</span>
            <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
          </div>
          <div className="contact-field">
            <span>{t.contact.officeTitle}</span>
            <em>{t.contact.offices}</em>
          </div>
          <Magnetic as="a" className="button button-glow" href={`mailto:${t.contact.email}`}>
            <span>{t.contact.action}</span><Arrow />
          </Magnetic>
          <p className="contact-note">{t.contact.responseNote}</p>
        </Reveal>
      </div>
    </section>
    <section className="locations page-gutter">
      <Reveal as="p" className="section-index">{t.contact.officeTitle}</Reveal>
      <div className="location-grid">
        {t.contact.locations.map(([img, city, name], i) => (
          <Reveal key={img} delay={i * 90}>
            <figure className="location-card">
              <ImageSlot src={`/assets/photos/${img}.jpg`} label={name} decorative ratio="16 / 9" className="media-cover" />
              <figcaption>
                <span>{city}</span>
                <strong>{name}</strong>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
    </>
  )
}
