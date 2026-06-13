import { memo, useEffect, useState } from 'react'
import { FLOWER_D } from './lib/svg'
import { NAV_ITEMS, NAV_HEIGHT } from './lib/constants'
import { useActiveSection } from './hooks'
import { ScallopFrame } from './components/ScallopFrame'
import { Hero } from './sections/Hero'
import { BuildingSection } from './sections/Building'
import { JourneySection } from './sections/Journey'
import { About } from './sections/About'
import { Footer } from './sections/Footer'

// These sections take no scroll-derived props, so memoising them keeps them
// from reconciling on every scroll frame (App/Home re-render as scrollY ticks).
const Building = memo(BuildingSection)
const Journey = memo(JourneySection)
const AboutMemo = memo(About)
const FooterMemo = memo(Footer)

// The scrolling landing page: shrinking top band + the section stack. Lives
// behind the "/" route so none of its scroll listeners run on the work page.
export function Home({ onNavigateWork }: { onNavigateWork: () => void }) {
  const active = useActiveSection(NAV_ITEMS.map((n) => n.id))
  const [vh, setVh] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    const updateVh = () => setVh(window.innerHeight)
    updateVh()
    window.addEventListener('resize', updateVh)
    return () => window.removeEventListener('resize', updateVh)
  }, [])

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

  useEffect(() => {
    // Only snap when you've come to rest very close to a target (small
    // threshold) and have been still for a beat — so it tidies the framing
    // without grabbing the scroll out from under you.
    const SNAP_THRESHOLD = 180
    const SNAP_DURATION = 900
    const STILLNESS_MS = 200

    let stillTimer: number | null = null
    let snapRafId: number | null = null
    let isSnapping = false

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const animateScrollTo = (targetY: number) => {
      const startY = window.scrollY
      const distance = targetY - startY
      if (Math.abs(distance) < 2) return
      const startTime = performance.now()
      isSnapping = true

      const step = () => {
        const elapsed = performance.now() - startTime
        const progress = Math.min(1, elapsed / SNAP_DURATION)
        const eased = easeInOutCubic(progress)
        window.scrollTo({
          top: startY + distance * eased,
          behavior: 'instant' as ScrollBehavior,
        })
        if (progress < 1) {
          snapRafId = requestAnimationFrame(step)
        } else {
          snapRafId = null
          isSnapping = false
        }
      }
      snapRafId = requestAnimationFrame(step)
    }

    const cancelSnap = () => {
      if (snapRafId !== null) {
        cancelAnimationFrame(snapRafId)
        snapRafId = null
      }
      isSnapping = false
    }

    const findSnapTarget = (): number | null => {
      const y = window.scrollY
      const candidates: number[] = [0]
      // Building snaps so its one-screen stage frames cleanly under the nav.
      const building = document.getElementById('building')
      if (building) {
        candidates.push(building.offsetTop)
      }
      // Journey (tall band) centres in the viewport — but not when it's the
      // pinned full timeline, which drives its own horizontal scroll.
      const journeyCenter = document.getElementById('journey')
      if (
        journeyCenter &&
        !journeyCenter.classList.contains('journey--pinned')
      ) {
        candidates.push(
          journeyCenter.offsetTop +
            journeyCenter.offsetHeight / 2 -
            window.innerHeight / 2,
        )
      }
      // About snaps to frame its end with the footer scallop peeking in by the
      // same amount the nav shows at the top.
      const scallop = document.querySelector<HTMLElement>('.footer-scallop')
      if (scallop) {
        candidates.push(scallop.offsetTop - window.innerHeight + NAV_HEIGHT)
      }
      let best: number | null = null
      let bestDist = Infinity
      for (const c of candidates) {
        const d = Math.abs(y - c)
        if (d < bestDist && d <= SNAP_THRESHOLD) {
          best = c
          bestDist = d
        }
      }
      return best
    }

    const onScroll = () => {
      if (isSnapping) return
      if (stillTimer !== null) clearTimeout(stillTimer)
      stillTimer = window.setTimeout(() => {
        const target = findSnapTarget()
        if (target !== null) animateScrollTo(target)
      }, STILLNESS_MS)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', cancelSnap, { passive: true })
    window.addEventListener('touchstart', cancelSnap, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', cancelSnap)
      window.removeEventListener('touchstart', cancelSnap)
      if (stillTimer !== null) clearTimeout(stillTimer)
      if (snapRafId !== null) cancelAnimationFrame(snapRafId)
    }
  }, [])

  const bandHeight = vh > 0 ? Math.max(NAV_HEIGHT, vh - scrollY) : 0
  const heroFade = vh > 0 ? Math.max(0, 1 - scrollY / (vh * 0.3)) : 1
  const photoFade = vh > 0 ? Math.max(0, 1 - scrollY / (vh * 0.55)) : 1
  const compact = vh > 0 && scrollY > vh * 0.5
  const scallopExpand = Math.min(80, scrollY * 0.2)

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setMenuOpen(false)
    // The hero (#home) lives inside the fixed top-band, so scrollIntoView
    // can't reach it — scroll the page to the top instead.
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="page">
      <div
        className={`top-band ${compact ? 'compact' : 'expanded'}${menuOpen ? ' menu-open' : ''}`}
        style={vh > 0 ? { height: `${bandHeight}px` } : undefined}
      >
        {/* once compact, kill the photo entirely so the collapsed nav is a
            clean, flat navy matching the other sections (no blue-tinted seam) */}
        <ScallopFrame
          expand={scallopExpand}
          photoOpacity={compact ? 0 : photoFade}
        />
        <div className="band-grain" aria-hidden="true" />
        <header className="topnav" aria-label="Top navigation">
          <a
            className="topnav-logo"
            href="#home"
            onClick={(e) => handleNav(e, 'home')}
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
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNav(e, item.id)}
                  className={active === item.id ? 'active' : ''}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <Hero heroFade={heroFade} onNav={handleNav} />
      </div>
      <div className="top-band-spacer" aria-hidden="true" />

      <Building onSeeWork={onNavigateWork} />

      <Journey />

      <AboutMemo />

      <FooterMemo />
    </main>
  )
}
