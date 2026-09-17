import { useEffect, useRef, useState } from 'react'
import { FLOWER_D, buildScallopPath } from '../lib/svg'
import { NAV_ITEMS } from '../lib/constants'

// A navy strip with a scalloped bottom edge, hung under the nav. Only shown on
// mobile Home, where its opacity tracks `--nav-reveal` (set from scroll) so the
// scalloped edge fades in on the same curve as the hero/photo fade out. Reuses
// the hero's `bottomOnly` path so the bumps match exactly.
function NavScallop() {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setW(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const H = 24
  const d = w > 0 ? buildScallopPath(w, H, 0, true) : ''

  return (
    <div ref={ref} className="topnav-scallop" aria-hidden="true" style={{ height: H }}>
      {d && (
        <svg viewBox={`0 0 ${w} ${H}`} preserveAspectRatio="none">
          <path d={d} />
        </svg>
      )}
    </div>
  )
}

// Scalloped bottom edge of the full-screen mobile menu. Rides the bottom of the
// navy panel as it drops from the top, so the "wavy" band sweeps down the screen
// and off the bottom, leaving it all blue. Reuses the same bumps as the top band.
function MenuScallop() {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setW(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const H = 26
  const d = w > 0 ? buildScallopPath(w, H, 0, true) : ''

  return (
    <div ref={ref} className="topnav-menu-scallop" aria-hidden="true">
      {d && (
        <svg viewBox={`0 0 ${w} ${H}`} preserveAspectRatio="none">
          <path d={d} />
        </svg>
      )}
    </div>
  )
}

type SiteNavProps = {
  // Currently active section id (only Home tracks this via IntersectionObserver).
  active?: string | null
  // Navigate to an in-page section: smooth-scroll on Home, route-home-then-scroll on Work.
  onNavSection: (id: string) => void
  // Open the full /work archive page.
  onSeeWork: () => void
  // True when we're already on the /work page, so the building entry reads as active.
  isWork?: boolean
  // When on /work, a Back control is shown leftmost in the nav.
  onBack?: () => void
  menuOpen: boolean
  setMenuOpen: (open: boolean | ((o: boolean) => boolean)) => void
}

// Shared top navigation used on both routes. On Home it sits inside the
// shrinking top-band; on Work it sits in a fixed compact bar. Clicking
// "building" jumps to that section; a hover/focus menu also offers the full
// archive (/work).
export function SiteNav({
  active,
  onNavSection,
  onSeeWork,
  isWork,
  onBack,
  menuOpen,
  setMenuOpen,
}: SiteNavProps) {
  const buildingActive = active === 'building' || isWork

  return (
    <header className="topnav" aria-label="Top navigation">
      {isWork && onBack && (
        <button className="topnav-back" onClick={onBack}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          Back
        </button>
      )}
      <a
        className="topnav-logo"
        href="#home"
        onClick={(e) => {
          e.preventDefault()
          setMenuOpen(false)
          onNavSection('home')
        }}
      >
        <svg className="topnav-flower" viewBox="0 0 100 100" aria-hidden="true">
          <path className="topnav-flower-petals" d={FLOWER_D} />
          <circle className="topnav-flower-center" cx="50" cy="50" r="14" />
        </svg>
        Zoé Opdendries
      </a>
      <div className="topnav-right">
        <button
          className="topnav-burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          id="site-nav"
          className={`topnav-links${menuOpen ? ' is-open' : ''}`}
          aria-label="Sections"
        >
          {NAV_ITEMS.map((item) =>
            item.id === 'building' ? (
              <div key={item.id} className="topnav-dropdown">
                <button
                  className={`topnav-dropbtn${buildingActive ? ' active' : ''}`}
                  aria-haspopup="true"
                  onClick={() => {
                    setMenuOpen(false)
                    onNavSection('building')
                  }}
                >
                  {item.label}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div className="topnav-menu">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onSeeWork()
                    }}
                  >
                    Everything I’ve made
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  setMenuOpen(false)
                  onNavSection(item.id)
                }}
                className={active === item.id ? 'active' : ''}
              >
                {item.label}
              </a>
            ),
          )}
          <MenuScallop />
        </nav>
      </div>
      <NavScallop />
    </header>
  )
}
