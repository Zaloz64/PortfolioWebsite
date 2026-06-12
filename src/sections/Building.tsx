import { useEffect, useRef, useState } from 'react'
import { FLOWER_D } from '../lib/svg'

const BUILDING_APPS = [
  {
    id: 'flower-power',
    name: 'Flower Power',
    tag: 'Coming soon',
    body: 'A watering app that keeps your plants alive — care reminders tuned to what you actually grow.',
  },
  {
    id: 'focus-lilio',
    name: 'Focus Lilio',
    tag: 'Coming soon',
    body: 'A focus app that makes deep work the path of least resistance instead of the path of willpower.',
  },
] as const

function AppIcon({ id }: { id: string }) {
  if (id === 'focus-lilio') {
    return (
      <svg className="app-icon" viewBox="0 0 100 100" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
        />
        <circle
          cx="50"
          cy="50"
          r="19"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
        />
        <circle cx="50" cy="50" r="6" fill="currentColor" />
      </svg>
    )
  }
  if (id === 'flower-power') {
    return (
      <svg className="app-icon" viewBox="0 0 100 100" aria-hidden="true">
        <path d={FLOWER_D} fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg className="app-icon" viewBox="0 0 100 100" aria-hidden="true">
      <path
        d="M50 8 L58 42 L92 50 L58 58 L50 92 L42 58 L8 50 L42 42 Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function BuildingSection() {
  const [flower, focus] = BUILDING_APPS
  const bentoRef = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)
  const [dropped, setDropped] = useState(false)

  // Animate only on wider screens with motion allowed; elsewhere the tiles
  // just render in place.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 721px)')
    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)')
    const decide = () => setArmed(wide.matches && motionOk.matches)
    decide()
    wide.addEventListener('change', decide)
    motionOk.addEventListener('change', decide)
    return () => {
      wide.removeEventListener('change', decide)
      motionOk.removeEventListener('change', decide)
    }
  }, [])

  // Scrolling the bento area into view marks the section "dropped" once,
  // triggering the tile drop (when armed). Watching the bento itself (not a
  // bottom label) means the drop fires on arrival even on short viewports
  // where the section is taller than the screen.
  useEffect(() => {
    const el = bentoRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDropped(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      className={`building${armed ? ' building--armed' : ''}${
        dropped ? ' is-dropped' : ''
      }`}
      id="building"
    >
      <div className="building-stage">
        <span className="building-watermark" aria-hidden="true">
          building
        </span>
        <div className="building-head section-heading">
          <span className="section-eyebrow">in the works</span>
        </div>
        <div className="build-bento" ref={bentoRef}>
          <article className="bento-tile bento-a">
            <div className="bento-ghost" aria-hidden="true">
              <AppIcon id={flower.id} />
            </div>
            <span className="bento-index" aria-hidden="true">
              N°01
            </span>
            <AppIcon id={flower.id} />
            <div>
              <span className="bento-tag">{flower.tag}</span>
              <h3 className="bento-name">{flower.name}</h3>
              <p className="bento-note">{flower.body}</p>
            </div>
          </article>
          <article className="bento-tile bento-b">
            <div className="bento-ghost" aria-hidden="true">
              <AppIcon id={focus.id} />
            </div>
            <span className="bento-index" aria-hidden="true">
              N°02
            </span>
            <AppIcon id={focus.id} />
            <div>
              <span className="bento-tag">{focus.tag}</span>
              <h3 className="bento-name">{focus.name}</h3>
              <p className="bento-note">{focus.body}</p>
            </div>
          </article>
          <article className="bento-tile bento-c">
            <span className="bento-index" aria-hidden="true">
              ✶
            </span>
            <div>
              <span className="bento-tag">My philosophy</span>
              <h3 className="bento-name">Buy it once. Keep it yours.</h3>
              <p className="bento-note">
                I’m tired of paying monthly for things that should just be mine.
                So you buy my apps once and they’re yours to keep — the only
                exception being real running costs, like AI, where a small
                subscription might be needed.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
