import { FLOWER_D } from '../lib/svg'
import { NAV_ITEMS } from '../lib/constants'

type SiteNavProps = {
  // Currently active section id (only Home tracks this via IntersectionObserver).
  active?: string | null
  // Navigate to an in-page section: smooth-scroll on Home, route-home-then-scroll on Work.
  onNavSection: (id: string) => void
  // Open the full /work archive page.
  onSeeWork: () => void
  // True when we're already on the /work page, so the building entry reads as active.
  isWork?: boolean
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
  menuOpen,
  setMenuOpen,
}: SiteNavProps) {
  const buildingActive = active === 'building' || isWork

  return (
    <header className="topnav" aria-label="Top navigation">
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
        </nav>
      </div>
    </header>
  )
}
