import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FLOWER_D } from './lib/svg'
import { NAV_HEIGHT } from './lib/constants'
import { WORK, WORK_CATEGORIES, type WorkCategory } from './lib/work'
import { WorkModal } from './components/WorkModal'
import { SiteNav } from './components/SiteNav'
import { ScallopFrame } from './components/ScallopFrame'

function TileIcon({ icon }: { icon: 'flower' | 'rings' }) {
  if (icon === 'rings') {
    return (
      <svg className="work-icon" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="7" />
        <circle cx="50" cy="50" r="19" fill="none" stroke="currentColor" strokeWidth="7" />
        <circle cx="50" cy="50" r="6" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg className="work-icon" viewBox="0 0 100 100" aria-hidden="true">
      <path d={FLOWER_D} fill="currentColor" />
    </svg>
  )
}

// The full "everything I've made" view as its own page (route: /work),
// reached from the Building section. Self-contained: header with a back
// link, filter chips, the bento grid and the shared detail modal.
export function WorkPage({
  onBack,
  onNavSection,
}: {
  onBack: () => void
  onNavSection: (id: string) => void
}) {
  const [filter, setFilter] = useState<WorkCategory | 'all'>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [bandFull, setBandFull] = useState(0)
  const bandRef = useRef<HTMLDivElement>(null)

  // play the entrance once on mount
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Track scroll (rAF-throttled) to drive the collapsing band.
  useEffect(() => {
    let rafId: number | null = null
    const onScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        rafId = null
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Measure the band's natural (fully-expanded) height. scrollHeight reports
  // the content extent even while we clamp the box smaller on scroll.
  useLayoutEffect(() => {
    const el = bandRef.current
    if (!el) return
    const measure = () => setBandFull(el.scrollHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const collapseRange = bandFull ? Math.max(1, bandFull - NAV_HEIGHT) : 1
  const bandHeight = bandFull ? Math.max(NAV_HEIGHT, bandFull - scrollY) : undefined
  // Title fades out a touch before the band finishes collapsing.
  const titleFade = Math.max(0, 1 - scrollY / (collapseRange * 0.8))
  const compact = scrollY > collapseRange * 0.5
  // reach full-bleed (bumps-only) right as the band finishes collapsing
  const scallopExpand = Math.min(80, (scrollY / collapseRange) * 90)

  const items =
    filter === 'all' ? WORK : WORK.filter((w) => w.categories.includes(filter))
  const open = openId ? WORK.find((w) => w.id === openId) ?? null : null
  const plate = (id: string) =>
    `N°${String(WORK.findIndex((w) => w.id === id) + 1).padStart(2, '0')}`

  return (
    <main className={`workpage${ready ? ' work-reveal' : ''}`}>
      {/* Collapsing navy band: nav + title block shrink into a compact
          scalloped nav as you scroll, like the home top band. */}
      <div
        ref={bandRef}
        className={`work-band${compact ? ' compact' : ' expanded'}${
          menuOpen ? ' menu-open' : ''
        }`}
        style={bandHeight !== undefined ? { height: `${bandHeight}px` } : undefined}
      >
        <ScallopFrame expand={scallopExpand} photoOpacity={0} />
        <SiteNav
          isWork
          onNavSection={onNavSection}
          onSeeWork={() => {}}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
        <div
          className="work-band-hero"
          style={{
            opacity: titleFade,
            pointerEvents: titleFade < 0.05 ? 'none' : 'auto',
          }}
        >
          <button className="workpage-back" onClick={onBack}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
            Back
          </button>
          <span className="section-eyebrow">the full archive</span>
          <h1 className="workpage-title">everything I’ve made</h1>
          <p className="workpage-lead">
            Apps, code, design, ventures and the things in between — filter by
            what you’re curious about.
          </p>
        </div>
      </div>
      <div
        className="work-band-spacer"
        aria-hidden="true"
        style={bandFull ? { height: `${bandFull}px` } : undefined}
      />

      {/* filters pin just under the collapsed nav so you can refine while scrolling */}
      <div
        className="work-filters-bar"
        role="group"
        aria-label="Filter work by type"
      >
        <div className="work-filters">
          <button
            className={`work-filter${filter === 'all' ? ' is-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {WORK_CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`work-filter${filter === c.id ? ' is-active' : ''}`}
              onClick={() => setFilter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="workpage-inner">
        {/* key remounts the grid per filter so the stagger replays */}
        <div className="work-grid" key={filter}>
          {items.map((item, i) => (
            <article
              key={item.id}
              className={`work-tile${item.featured ? ' is-featured' : ''}${
                item.img ? ' has-img' : ''
              }${item.icon ? ' is-app' : ''}`}
              style={{ animationDelay: `${Math.min(i, 9) * 0.05}s` }}
              role="button"
              tabIndex={0}
              aria-label={`${item.title} — read more`}
              onClick={() => setOpenId(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setOpenId(item.id)
                }
              }}
            >
              {item.img && <img className="work-bg" src={item.img} alt="" />}
              {item.icon && (
                <div className="work-ghost" aria-hidden="true">
                  <TileIcon icon={item.icon} />
                </div>
              )}
              <div className="work-tile-top">
                {item.icon ? (
                  <TileIcon icon={item.icon} />
                ) : (
                  <span className="work-year">{item.year}</span>
                )}
                <span className="work-index" aria-hidden="true">
                  {plate(item.id)}
                </span>
              </div>
              <div className="work-tile-main">
                {item.icon && <span className="work-year">{item.year}</span>}
                <h3 className="work-title">{item.title}</h3>
                <p className="work-blurb">{item.blurb}</p>
                <ul className="work-cats" aria-hidden="true">
                  {item.categories.map((c) => (
                    <li key={c}>
                      {WORK_CATEGORIES.find((wc) => wc.id === c)?.label}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>

      {open && (
        <WorkModal
          year={open.year}
          title={open.title}
          overview={open.blurb}
          body={open.detail}
          role={open.role}
          tags={open.tags}
          highlights={open.highlights}
          link={open.link}
          img={open.img}
          onClose={() => setOpenId(null)}
        />
      )}
    </main>
  )
}
