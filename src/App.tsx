import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { FLOWER_D } from './lib/svg'
import { Home } from './Home'
import { WorkPage } from './WorkPage'

type Route = 'home' | 'work'

const routeFromPath = (): Route =>
  window.location.pathname.includes('/work') ? 'work' : 'home'

function App() {
  const [route, setRoute] = useState<Route>(routeFromPath)

  // Back/forward buttons sync the rendered page with the URL.
  useEffect(() => {
    const onPop = () => setRoute(routeFromPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to: Route) => {
    const path = to === 'work' ? '/work' : '/'
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path)
    }
    setRoute(to)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  const goWork = useCallback(() => navigate('work'), [navigate])
  const goHome = useCallback(() => navigate('home'), [navigate])

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

  return route === 'work' ? (
    <WorkPage onBack={goHome} />
  ) : (
    <Home onNavigateWork={goWork} />
  )
}

export default App
