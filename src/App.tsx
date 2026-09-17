import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './App.css'
import { FLOWER_D } from './lib/svg'
import { Home } from './Home'
import { WorkPage } from './WorkPage'

type Route = 'home' | 'work'

// Vite serves the app under this base (e.g. '/PortfolioWebsite/' on GitHub
// Pages). Build URLs against it so deep links / refreshes resolve.
const BASE = import.meta.env.BASE_URL
const workUrl = (search = '') => `${BASE}work${search}`

const routeFromPath = (): Route =>
  window.location.pathname.includes('/work') ? 'work' : 'home'

function App() {
  const [route, setRoute] = useState<Route>(routeFromPath)
  // Where the landing page was scrolled when we left for /work, so Back
  // returns you to the same spot rather than the top.
  const homeScroll = useRef(0)
  // A section to scroll to after we land back on Home (set when a nav link is
  // clicked from /work). Overrides the saved scroll for that one transition.
  const pendingSection = useRef<string | null>(null)

  // We restore scroll ourselves on route changes; stop the browser fighting us.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Back/forward buttons sync the rendered page with the URL.
  useEffect(() => {
    const onPop = () => setRoute(routeFromPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // After landing back on Home, jump to the saved scroll position; Work
  // always opens at the top.
  useLayoutEffect(() => {
    // A nav link from /work asked for a specific section: jump there instead
    // of the saved scroll position.
    if (route === 'home' && pendingSection.current) {
      const id = pendingSection.current
      pendingSection.current = null
      requestAnimationFrame(() => {
        if (id === 'home') {
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
        } else {
          document
            .getElementById(id)
            ?.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' })
        }
      })
      return
    }
    const y = route === 'home' ? homeScroll.current : 0
    // The Journey section inflates its (pinned) height in a later effect, so on
    // the first frame the page can be too short to reach `y` and the scroll
    // clamps into the navy overscroll. Re-apply until the page is tall enough
    // to actually land at `y`, capped so we don't loop near the true bottom.
    let raf = 0
    let tries = 0
    const restore = () => {
      window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })
      if (Math.abs(window.scrollY - y) > 2 && tries++ < 30) {
        raf = requestAnimationFrame(restore)
      }
    }
    raf = requestAnimationFrame(restore)
    return () => cancelAnimationFrame(raf)
  }, [route])

  const navigate = useCallback(
    (to: Route) => {
      if (to !== 'home' && route === 'home') {
        homeScroll.current = window.scrollY
      }
      const path = to === 'work' ? workUrl() : BASE
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path)
      }
      setRoute(to)
    },
    [route],
  )

  // Optionally open a specific project on the archive (deep-linked via ?p=),
  // e.g. from a journey "Read more" so it lands on the real work item instead
  // of a duplicate modal.
  const goWork = useCallback(
    (projectId?: string) => {
      if (route === 'home') homeScroll.current = window.scrollY
      window.history.pushState({}, '', workUrl(projectId ? `?p=${projectId}` : ''))
      setRoute('work')
    },
    [route],
  )
  const goHome = useCallback(() => navigate('home'), [navigate])
  // From /work: return to Home and scroll to a given section.
  const goHomeSection = useCallback(
    (id: string) => {
      pendingSection.current = id
      navigate('home')
    },
    [navigate],
  )

  // Flower-shaped cursor site-wide: blooms bigger on clickable things and
  // changes colour while pressed. Text fields keep a caret. Site-wide so it
  // persists across both routes.
  useEffect(() => {
    const flower = (petals: string, center: string, size: number) => {
      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">` +
        `<path d="${FLOWER_D}" fill="${petals}"/>` +
        `<circle cx="50" cy="50" r="14" fill="${center}"/></svg>`
      const hot = Math.round(size / 2)
      return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hot} ${hot}, auto`
    }
    const base = flower('#2444e8', '#0d1352', 34)
    const hover = flower('#a9b8ff', '#2444e8', 44)
    const press = flower('#0d1352', '#a9b8ff', 30)
    const style = document.createElement('style')
    style.textContent =
      `* { cursor: ${base} !important; }` +
      `a, a *, button, button *, [role="button"], [role="button"] *, label, label *, summary, summary *, .hero-cta, .hero-cta * { cursor: ${hover} !important; }` +
      `input, textarea, select { cursor: text !important; }` +
      `html.cursor-press, html.cursor-press * { cursor: ${press} !important; }`
    document.head.appendChild(style)

    const root = document.documentElement
    const down = () => root.classList.add('cursor-press')
    const up = () => root.classList.remove('cursor-press')
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      root.classList.remove('cursor-press')
      style.remove()
    }
  }, [])

  return (
    <>
      {/* one film-grain layer over the whole page (every route/section), so
          the grain is consistent everywhere instead of only on the band */}
      <div className="page-grain" aria-hidden="true" />
      {route === 'work' ? (
        <WorkPage onBack={goHome} onNavSection={goHomeSection} />
      ) : (
        <Home onNavigateWork={goWork} />
      )}
    </>
  )
}

export default App
