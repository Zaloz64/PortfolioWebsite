import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CLOUD_D, FLOWER_D, scallopOutline } from '../lib/svg'
import { useInView } from '../hooks'
import cesaImg from '../assets/cesa.jpg'
import teethImg from '../assets/teeth.jpg'
import lexImg from '../assets/lexenergy.jpg'

type Milestone = {
  id: string
  year: string
  title: string
  body: string
  // Longer copy shown in the click-through modal. Only the substantial
  // work/credibility milestones have one — those become clickable.
  detail?: string
  tags?: readonly string[]
}

const JOURNEY: readonly Milestone[] = [
  {
    id: 'school',
    year: '2018–21',
    title: 'High school · NTI',
    body: 'Gymnasium in information & media technology — where the code habit really started.',
  },
  {
    id: 'sailing',
    year: '2019–20',
    title: 'National sailing',
    body: 'Two-time Swedish youth champion (E-jolle), and a competitor at World, European and Nordic championships.',
  },
  {
    id: 'egoi',
    year: '2021',
    title: 'EGOI',
    body: 'Qualified for the European Girls’ Olympiad in Informatics.',
  },
  {
    id: 'ericsson',
    year: '2021',
    title: 'Ericsson',
    body: 'IT technician internship — hardware and server-room operations in an enterprise environment.',
    detail:
      'A summer as IT technician at Ericsson — my first time inside a large enterprise tech organisation. Hands-on with hardware and server-room operations, learning how production infrastructure is actually run and kept alive at scale.',
    // TODO: add one concrete responsibility or project to make this land harder.
  },
  {
    id: 'bsc',
    year: '2021–24',
    title: 'BSc, Chalmers',
    body: 'Bachelor of Science in Information Technology. Thesis: an AI system diagnosing misaligned teeth from clinical imagery.',
    detail:
      'Bachelor of Science in Information Technology at Chalmers. My thesis built an AI system that diagnoses misaligned teeth from clinical imagery — pairing real machine learning with a problem that has direct, human impact.',
    tags: ['AI / ML'],
    // TODO: add the approach (model / dataset) and any accuracy or result worth quoting.
  },
  {
    id: 'events',
    year: '2022',
    title: 'Student events · PR',
    body: 'PR lead for major student events — posters and social campaigns in Figma, Photoshop and Illustrator.',
  },
  {
    id: 'cesa',
    year: '2023–24',
    title: 'CESA × Star for Life',
    body: 'Core volunteer bringing tech access to South African schools — funding, logistics, and on-site setup.',
  },
  {
    id: 'ev-screen',
    year: '2024–25',
    title: 'LexEnergy',
    body: 'Solo-built the customer-facing frontend for LexEnergy’s EV charger network — the live station interface. React, TypeScript, Figma.',
    detail:
      'I solo-built the customer-facing frontend for LexEnergy’s EV charger network — the live interface drivers actually use at a station to start, monitor and pay for a charge. Sole frontend owner, from design in Figma through to shipped React + TypeScript.',
    tags: ['React', 'TypeScript', 'Figma', 'Frontend'],
    // TODO: add scale worth bragging about — stations live, drivers served, anything measurable.
  },
  {
    id: 'msc-cs',
    year: '2024–25',
    title: 'MSc · MPALG',
    body: 'First master’s at Chalmers — Computer Science: Algorithms, Languages & Logic. A year in, then I switched tracks.',
  },
  {
    id: 'msc-ebd',
    year: '2025–now',
    title: 'MSc · Entrepreneurship',
    body: 'A year into a second master’s at Chalmers — Entrepreneurship & Business Design.',
  },
  {
    id: 'dia-aid',
    year: '2025',
    title: 'Business analysis · Dia Aid',
    body: 'A 7.5 hp course project — a full business analysis for the startup Dia Aid, mapping their market and model.',
  },
  {
    id: 'velra',
    year: '2025–now',
    title: 'Starting Velra',
    body: 'Founding an energy-market startup through the master’s — a Chalmers × Lund venture. The work right now: proving real market need.',
    detail:
      'Velra is the company I’m founding through my entrepreneurship master’s — a Chalmers × Lund venture aimed at the energy market. The current phase is validation: pressure-testing the model and proving there’s genuine market need before building further.',
    // TODO: confirm 'Velra' is the final name, and add the specific problem/segment when you can share it.
  },
  {
    id: 'building-now',
    year: 'Now',
    title: 'Building my own',
    body: 'Flower Power and Focus Lilio in development, launching soon — with more on the way.',
    detail:
      'On my own time I design, build and ship iOS apps end to end. Flower Power (plant care) and Focus Lilio (deep work) are first to launch, with more behind them — the build-in-public side of how I work.',
    tags: ['iOS'],
    // TODO: add a launch window + App Store / waitlist link once live.
  },
]

// The 3 highlights shown before "See full journey" is clicked.
const TOP_JOURNEY_IDS = ['bsc', 'cesa', 'ev-screen']

// Optional photo per milestone (keyed by id).
const JOURNEY_IMAGES: Record<string, string> = {
  bsc: teethImg,
  cesa: cesaImg,
  'ev-screen': lexImg,
}

function ScallopButton({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setDims({ w: el.offsetWidth, h: el.offsetHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [children])
  const d = scallopOutline(dims.w, dims.h)
  return (
    <button ref={ref} className="journey-toggle" onClick={onClick}>
      {d && (
        <svg
          className="scallop-btn-border"
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={d} />
        </svg>
      )}
      <span className="journey-toggle-label">{children}</span>
    </button>
  )
}

// A single milestone card. When the milestone has `detail`, it becomes a
// button that opens the modal; otherwise it's a plain, non-interactive card.
function MilestoneCard({
  item,
  onOpen,
}: {
  item: Milestone
  onOpen: (id: string) => void
}) {
  const clickable = !!item.detail
  const img = JOURNEY_IMAGES[item.id]
  return (
    <article
      className={`top3-card ${img ? 'has-img' : ''} ${
        clickable ? 'is-clickable' : ''
      }`}
      {...(clickable
        ? {
            role: 'button',
            tabIndex: 0,
            'aria-label': `${item.title} — read more`,
            onClick: () => onOpen(item.id),
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onOpen(item.id)
              }
            },
          }
        : {})}
    >
      {img && <img className="top3-bg" src={img} alt="" />}
      <span className="top3-year">{item.year}</span>
      <h3 className="top3-title">{item.title}</h3>
      <p className="top3-body">{item.body}</p>
      {clickable && (
        <span className="top3-more" aria-hidden="true">
          Read more →
        </span>
      )}
    </article>
  )
}

// Click-through detail view for a milestone. Portalled over the page with a
// dimmed backdrop; closes on backdrop click, the close button, or Escape.
function MilestoneModal({
  item,
  onClose,
}: {
  item: Milestone
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const img = JOURNEY_IMAGES[item.id]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return createPortal(
    <div className="milestone-overlay" onClick={onClose}>
      <div
        className="milestone-modal"
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          className="milestone-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {img && <img className="milestone-img" src={img} alt="" />}
        <span className="milestone-year">{item.year}</span>
        <h3 className="milestone-title">{item.title}</h3>
        <p className="milestone-detail">{item.detail ?? item.body}</p>
        {item.tags && (
          <ul className="milestone-tags">
            {item.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body,
  )
}

export function JourneySection() {
  const [showAll, setShowAll] = useState(false)
  const [cloud, setCloud] = useState(false)
  const [cloudPos, setCloudPos] = useState({ x: 0, y: 0 })
  const railRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [sectionRef, inView] = useInView<HTMLElement>()
  const [active, setActive] = useState(0)
  const [trackH, setTrackH] = useState(0)
  const [openId, setOpenId] = useState<string | null>(null)
  const pinned = showAll && trackH > 0
  const collapsingRef = useRef(false)
  const openItem = openId ? JOURNEY.find((j) => j.id === openId) ?? null : null

  const items = showAll
    ? JOURNEY
    : JOURNEY.filter((j) => TOP_JOURNEY_IDS.includes(j.id))

  const reset = (next: boolean) => {
    setShowAll(next)
    setActive(0)
    if (railRef.current) railRef.current.scrollLeft = 0
  }

  // Collapsing the timeline shrinks the section by several screens, which would
  // otherwise leave you stranded down by the footer. Re-centre on the journey
  // once the (now short) layout has committed.
  useLayoutEffect(() => {
    if (!collapsingRef.current) return
    collapsingRef.current = false
    const section = sectionRef.current
    if (!section) return
    const docTop = section.getBoundingClientRect().top + window.scrollY
    const target = docTop + section.offsetHeight / 2 - window.innerHeight / 2
    window.scrollTo({ top: Math.max(0, target) })
  }, [showAll, sectionRef])

  // Native horizontal scroll (mobile / before pinning): track which card is
  // centred. When pinned, the pin effect owns this instead.
  useEffect(() => {
    const el = railRef.current
    if (!el || !showAll || pinned) return
    let raf: number | null = null
    const update = () => {
      const center = el.scrollLeft + el.clientWidth / 2
      const cards = Array.from(el.querySelectorAll<HTMLElement>('.vt-item'))
      let best = 0
      let bestDist = Infinity
      cards.forEach((c, i) => {
        const mid = c.offsetLeft + c.offsetWidth / 2
        const d = Math.abs(mid - center)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      setActive(best)
    }
    const onScroll = () => {
      if (raf !== null) return
      raf = requestAnimationFrame(() => {
        update()
        raf = null
      })
    }
    update()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf !== null) cancelAnimationFrame(raf)
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [showAll, pinned])

  // Full timeline → pin the section and drive the rail horizontally with the
  // page's vertical scroll (desktop only). Track height = viewport + the rail's
  // horizontal overflow, so one scroll-through finishes the timeline exactly.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 721px)')
    if (!showAll || !desktop.matches) {
      setTrackH(0)
      return
    }
    const rail = railRef.current
    const track = trackRef.current
    if (!rail || !track) return
    const measure = () => {
      const max = track.scrollWidth - rail.clientWidth
      setTrackH(max > 0 ? window.innerHeight + max : 0)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [showAll])

  // Map page scroll through the pinned section onto a translateX of the track.
  // The rail uses `overflow: clip` (not a scroll container), so the vertical
  // wheel passes straight through to the page with full native momentum.
  useEffect(() => {
    if (!showAll || trackH === 0) return
    const section = sectionRef.current
    const rail = railRef.current
    const track = trackRef.current
    if (!section || !rail || !track) return
    let raf: number | null = null
    const apply = () => {
      const max = track.scrollWidth - rail.clientWidth
      const total = section.offsetHeight - window.innerHeight
      const scrolled = -section.getBoundingClientRect().top
      const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0
      const shift = p * max
      track.style.transform = `translateX(${-shift}px)`
      // active card = the one nearest the viewport centre
      const center = shift + rail.clientWidth / 2
      const cards = track.children
      let best = 0
      let bestDist = Infinity
      for (let i = 0; i < cards.length; i++) {
        const c = cards[i] as HTMLElement
        const mid = c.offsetLeft + c.offsetWidth / 2
        const d = Math.abs(mid - center)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      }
      setActive(best)
      raf = null
    }
    const onScroll = () => {
      if (raf !== null) return
      raf = requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf !== null) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      track.style.transform = ''
    }
  }, [showAll, trackH, sectionRef])

  const toggle = () => {
    if (showAll) {
      collapsingRef.current = true
      reset(false)
      return
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      reset(true)
      return
    }
    const btn = document.querySelector('.journey-toggle')
    const rect = btn?.getBoundingClientRect()
    setCloudPos({
      x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
      y: rect ? rect.top + rect.height / 2 : window.innerHeight / 2,
    })
    setCloud(true)
    window.setTimeout(() => reset(true), 520)
    window.setTimeout(() => setCloud(false), 1120)
  }

  return (
    <section
      className={`journey ${inView ? 'journey-reveal' : ''} ${
        pinned ? 'journey--pinned' : ''
      }`}
      id="journey"
      ref={sectionRef}
      style={pinned ? { height: trackH } : undefined}
    >
      <div className="journey-inner">
      <div className="journey-head">
        <div className="section-heading">
          <span className="section-eyebrow">
            — {showAll ? 'The journey started with…' : 'A few highlights'}
          </span>
          <h2 className="section-title">
            my journey<span className="section-title-dot">.</span>
          </h2>
        </div>
      </div>

      {!showAll && (
        <div className="journey-top3">
          {items.map((item) => (
            <MilestoneCard key={item.id} item={item} onOpen={setOpenId} />
          ))}
        </div>
      )}

      {showAll && (
        <div className="vtimeline" ref={railRef}>
          <div className="vt-track" ref={trackRef}>
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`vt-item ${i === active ? 'is-active' : ''}`}
              style={
                { animationDelay: `${Math.min(i, 7) * 0.07}s` } as React.CSSProperties
              }
            >
              <span className="vt-node" aria-hidden="true">
                <svg className="vt-flower" viewBox="0 0 100 100">
                  <path className="vt-flower-petals" d={FLOWER_D} />
                  <circle className="vt-flower-center" cx="50" cy="50" r="14" />
                </svg>
              </span>
              <MilestoneCard item={item} onOpen={setOpenId} />
            </div>
          ))}
          </div>
        </div>
      )}

      <div className="journey-actions">
        <ScallopButton onClick={toggle}>
          {showAll ? 'Show less' : 'See the full journey'}
        </ScallopButton>
      </div>
      </div>

      {openItem && (
        <MilestoneModal item={openItem} onClose={() => setOpenId(null)} />
      )}

      {cloud &&
        createPortal(
          <div className="journey-cloud" aria-hidden="true">
            <svg
              className="cloud-blob"
              viewBox="0 0 100 100"
              style={{ left: cloudPos.x, top: cloudPos.y }}
            >
              <path d={CLOUD_D} />
            </svg>
          </div>,
          document.body,
        )}
    </section>
  )
}
