import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { WORK } from '../lib/work'
import { WorkModal } from '../components/WorkModal'

const BUILDING_APPS = [
  {
    id: 'velra',
    name: 'Velra',
    tag: 'Market validation',
    body: 'An energy market venture, done through my entrepreneurship master’s and backed by Chalmers and Lund ventures.',
  },
  {
    id: 'digital-friction',
    name: 'Digital Friction',
    tag: 'On the App Store',
    body: "Turns your phone into a dumb phone. App access stays blocked until you finish what you said you'd do. Frictionless is the problem.",
  },
] as const

function AppIcon({ id }: { id: string }) {
  if (id === 'digital-friction') {
    return (
      <svg className="app-icon" viewBox="0 0 100 100" aria-hidden="true">
        <rect
          x="30"
          y="14"
          width="40"
          height="72"
          rx="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
        />
        <line x1="44" y1="74" x2="56" y2="74" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    )
  }
  if (id === 'velra') {
    return (
      <svg className="app-icon" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M56 8 L26 54 L48 54 L44 92 L74 42 L52 42 Z" fill="currentColor" />
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

export function BuildingSection({
  onSeeWork,
  onContact,
  onNavSection,
}: {
  onSeeWork: () => void
  onContact: () => void
  onNavSection?: (id: string) => void
}) {
  const [velra, friction] = BUILDING_APPS
  const bentoRef = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)
  const [dropped, setDropped] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [nope, setNope] = useState(false)
  const openItem = openId ? WORK.find((w) => w.id === openId) ?? null : null

  // Make a tile open the shared detail modal (same pattern as the archive
  // grid and the journey timeline). Closing returns to this section.
  const tileProps = (id: string) => ({
    role: 'button' as const,
    tabIndex: 0,
    onClick: () => setOpenId(id),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpenId(id)
      }
    },
  })

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
          <span className="section-eyebrow">things i’m making</span>
          <button
            className="building-archive-link"
            onClick={onSeeWork}
            aria-label="See everything I've made"
          >
            Everything I’ve made
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="build-bento" ref={bentoRef}>
          <article className="bento-tile bento-a" {...tileProps(friction.id)}>
            <div className="bento-ghost" aria-hidden="true">
              <AppIcon id={friction.id} />
            </div>
            <AppIcon id={friction.id} />
            <div>
              <span className="bento-tag">{friction.tag}</span>
              <h3 className="bento-name">{friction.name}</h3>
              <p className="bento-note">{friction.body}</p>
            </div>
          </article>
          <article
            className={`bento-tile bento-b${nope ? ' bento-nope' : ''}`}
            onClick={() => setNope(true)}
            onAnimationEnd={() => setNope(false)}
          >
            <div className="bento-ghost" aria-hidden="true">
              <AppIcon id={velra.id} />
            </div>
            <AppIcon id={velra.id} />
            <div>
              <span className="bento-tag">{velra.tag}</span>
              <h3 className="bento-name">{velra.name}</h3>
              <p className="bento-note">
                {velra.body} <strong>More information to come.</strong>
              </p>
            </div>
          </article>
          <article className="bento-tile bento-c">
            <div>
              <span className="bento-tag">Available</span>
              <h3 className="bento-name">Selected projects</h3>
              <p className="bento-note">
                Websites and software, designed and built to spec. I take on a
                few projects a year alongside Velra. Contact me if you have
                something.
              </p>
            </div>
          </article>
        </div>
        <button className="building-contact-cta" onClick={onContact}>
          Need something built? Contact me
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 13l7 7 7-7" />
          </svg>
        </button>
      </div>

      {openItem && (
        <WorkModal
          year={openItem.year}
          title={openItem.title}
          wrapTitle={openItem.wrapTitle}
          overview={openItem.blurb}
          body={openItem.detail}
          role={openItem.role}
          tags={openItem.tags}
          highlights={openItem.highlights}
          link={openItem.link}
          img={openItem.img}
          gallery={openItem.gallery}
          backLabel="Back"
          onClose={() => setOpenId(null)}
          onNavSection={(id) => {
            setOpenId(null)
            requestAnimationFrame(() => onNavSection?.(id))
          }}
          onSeeWork={() => {
            setOpenId(null)
            onSeeWork()
          }}
        />
      )}
    </section>
  )
}
