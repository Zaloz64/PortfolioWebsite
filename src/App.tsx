import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './App.css'
import landingImg from './assets/landing.jpeg'
import meImg from './assets/me.jpg'
import cesaImg from './assets/cesa.jpg'
import teethImg from './assets/teeth.jpg'
import lexImg from './assets/lexenergy.jpg'

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

const JOURNEY = [
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
  },
  {
    id: 'bsc',
    year: '2021–24',
    title: 'BSc, Chalmers',
    body: 'Bachelor of Science in Information Technology. Thesis: an AI system diagnosing misaligned teeth from clinical imagery.',
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
    title: 'EV charging startup',
    body: 'Solo-built the customer-facing frontend for an EV charger network — the live station interface. React, TypeScript, Figma.',
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
    body: 'Founding a startup through the master’s — provisionally Velra, a Chalmers × Lund venture. The job: prove there’s real market need.',
  },
  {
    id: 'building-now',
    year: 'Now',
    title: 'Building my own',
    body: 'Flower Power and Focus Lilio in development, launching soon — with more on the way.',
  },
] as const

// The 3 highlights shown before "See full journey" is clicked.
const TOP_JOURNEY_IDS = ['bsc', 'cesa', 'ev-screen']

// Optional photo per milestone (keyed by id).
const JOURNEY_IMAGES: Record<string, string> = {
  bsc: teethImg,
  cesa: cesaImg,
  'ev-screen': lexImg,
}

const NAV_ITEMS = [
  { id: 'home', label: 'home' },
  { id: 'building', label: 'building' },
  { id: 'journey', label: 'journey' },
  { id: 'about', label: 'about' },
  { id: 'contact', label: 'say hi' },
] as const

const SKILLS = [
  'Fullstack',
  'AI / ML',
  'React / TypeScript',
  'Product design',
  'Figma',
  'Strategy',
  'Business design',
] as const

function buildScallopPath(w: number, h: number, expand = 0): string {
  const isMobile = w < 700
  const baseInset = isMobile ? 22 : 30
  const inset = Math.max(8, Math.min(baseInset, h * 0.25))
  const target = isMobile ? 30 : 44
  const x0 = inset - expand
  const y0 = inset - expand
  const x1 = w - inset + expand
  const y1 = h - inset
  if (x1 <= x0 || y1 <= y0) return ''
  const innerW = x1 - x0
  const innerH = y1 - y0
  const nW = Math.max(2, Math.round(innerW / target))
  const nH = Math.max(2, Math.round(innerH / target))
  const sW = innerW / nW
  const sH = innerH / nH
  const rW = sW / 2
  const rH = sH / 2
  const parts: string[] = [`M ${x0.toFixed(2)} ${y0.toFixed(2)}`]
  for (let i = 0; i < nW; i++)
    parts.push(`a ${rW.toFixed(2)} ${rW.toFixed(2)} 0 0 1 ${sW.toFixed(2)} 0`)
  for (let i = 0; i < nH; i++)
    parts.push(`a ${rH.toFixed(2)} ${rH.toFixed(2)} 0 0 1 0 ${sH.toFixed(2)}`)
  for (let i = 0; i < nW; i++)
    parts.push(`a ${rW.toFixed(2)} ${rW.toFixed(2)} 0 0 1 ${(-sW).toFixed(2)} 0`)
  for (let i = 0; i < nH; i++)
    parts.push(`a ${rH.toFixed(2)} ${rH.toFixed(2)} 0 0 1 0 ${(-sH).toFixed(2)}`)
  parts.push('Z')

  return parts.join(' ')
}

// One continuous trail of gentle, uniform long waves. Each milestone's
// segment shares its boundary height with the next and meets it flat, so the
// dotted line flows as a single calm wave (dots land near the centre line).
const TL_BOUNDS = [35, 27, 43, 27, 43, 27, 43, 27, 43, 27, 43, 27, 43, 35]

const TL_SEGMENTS = TL_BOUNDS.slice(0, -1).map((a, i) => {
  const b = TL_BOUNDS[i + 1]
  return {
    d: `M0 ${a} C 35 ${a} 65 ${b} 100 ${b}`,
    top: `${(((a + b) / 2) / 70) * 100}%`,
  }
})

// Matching gentle waves for the off-screen tails on each side.
const TL_TAIL_D = 'M0 35 Q 17 28 34 35 T 68 35 T 100 35'

function buildFlowerPath(
  cx: number,
  cy: number,
  mid: number,
  amp: number,
  petals = 8,
  steps = 180,
): string {
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const r = mid + amp * Math.cos(petals * t)
    const x = cx + r * Math.cos(t)
    const y = cy + r * Math.sin(t)
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)} `
  }
  return `${d}Z`
}

const FLOWER_D = buildFlowerPath(50, 50, 33, 13)

// Scalloped (bubbly) outline for the journey button border.
function scallopOutline(w: number, h: number): string {
  if (w <= 4 || h <= 4) return ''
  const target = 18
  const nW = Math.max(2, Math.round(w / target))
  const sW = w / nW
  const rW = sW / 2
  const nH = Math.max(1, Math.round(h / target))
  const sH = h / nH
  const rH = sH / 2
  const p: string[] = ['M 0 0']
  for (let i = 0; i < nW; i++)
    p.push(`a ${rW.toFixed(2)} ${rW.toFixed(2)} 0 0 1 ${sW.toFixed(2)} 0`)
  for (let i = 0; i < nH; i++)
    p.push(`a ${rH.toFixed(2)} ${rH.toFixed(2)} 0 0 1 0 ${sH.toFixed(2)}`)
  for (let i = 0; i < nW; i++)
    p.push(`a ${rW.toFixed(2)} ${rW.toFixed(2)} 0 0 1 ${(-sW).toFixed(2)} 0`)
  for (let i = 0; i < nH; i++)
    p.push(`a ${rH.toFixed(2)} ${rH.toFixed(2)} 0 0 1 0 ${(-sH).toFixed(2)}`)
  p.push('Z')
  return p.join(' ')
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

// Puffy cloud blob for the journey open transition.
function cloudBlob(cx: number, cy: number, r: number, bumps = 9): string {
  const pts: [number, number][] = []
  for (let i = 0; i < bumps; i++) {
    const a = (i / bumps) * Math.PI * 2 - Math.PI / 2
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)} `
  for (let i = 0; i < bumps; i++) {
    const cur = pts[i]
    const next = pts[(i + 1) % bumps]
    const chord = Math.hypot(next[0] - cur[0], next[1] - cur[1])
    const br = (chord / 2) * 1.08
    d += `A ${br.toFixed(2)} ${br.toFixed(2)} 0 0 1 ${next[0].toFixed(2)} ${next[1].toFixed(2)} `
  }
  return `${d}Z`
}

const CLOUD_D = cloudBlob(50, 50, 30, 9)

function FlowerSticker() {
  return (
    <svg className="hero-flower" viewBox="0 0 100 100" aria-hidden="true">
      <path className="hero-flower-petals" d={FLOWER_D} />
      <circle className="hero-flower-center" cx="50" cy="50" r="14" />
    </svg>
  )
}

// A small static label wearing a scalloped (bubbly), filled sticker edge.
function ScallopTag({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
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
    <span ref={ref} className="about-portrait-tag">
      {d && (
        <svg
          className="scallop-tag-bg"
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={d} />
        </svg>
      )}
      <span className="about-portrait-tag-label">{children}</span>
    </span>
  )
}

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

function BuildingSection() {
  const [flower, focus] = BUILDING_APPS
  return (
    <section className="building" id="building">
      <span className="building-side">Building</span>
      <div className="build-bento">
        <article className="bento-tile bento-a">
          <AppIcon id={flower.id} />
          <div>
            <span className="bento-tag">{flower.tag}</span>
            <h3 className="bento-name">{flower.name}</h3>
            <p className="bento-note">{flower.body}</p>
          </div>
        </article>
        <article className="bento-tile bento-b">
          <AppIcon id={focus.id} />
          <div>
            <span className="bento-tag">{focus.tag}</span>
            <h3 className="bento-name">{focus.name}</h3>
            <p className="bento-note">{focus.body}</p>
          </div>
        </article>
        <article className="bento-tile bento-c">
          <AppIcon id="more" />
          <div>
            <span className="bento-tag">No subscriptions</span>
            <h3 className="bento-name">Buy it once</h3>
            <p className="bento-note">
              I’m tired of subscriptions — so my apps are one-time purchases.
              Pay once, it’s yours. The only exception is when running costs
              (like AI) genuinely demand it.
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}

function JourneySection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [cloud, setCloud] = useState(false)
  const [cloudPos, setCloudPos] = useState({ x: 0, y: 0 })

  const items = showAll
    ? JOURNEY
    : JOURNEY.filter((j) => TOP_JOURNEY_IDS.includes(j.id))

  const reset = (next: boolean) => {
    setShowAll(next)
    setActive(0)
    setScrolled(false)
    if (trackRef.current) trackRef.current.scrollLeft = 0
  }

  const toggle = () => {
    if (showAll) {
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

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let raf: number | null = null
    const update = () => {
      setScrolled(el.scrollLeft > 30)
      const center = el.scrollLeft + el.clientWidth / 2
      const items = Array.from(
        el.querySelectorAll<HTMLElement>('.tl-item'),
      )
      let best = 0
      let bestDist = Infinity
      items.forEach((it, i) => {
        const c = it.offsetLeft + it.offsetWidth / 2
        const d = Math.abs(c - center)
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
  }, [showAll])

  return (
    <section className="journey" id="journey">
      <div
        className={`journey-head ${showAll ? 'journey-head--side' : ''} ${
          scrolled ? 'faded' : ''
        }`}
      >
        <h2 className="journey-title">Journey</h2>
        <p className="journey-lead">
          {showAll ? 'The journey started with…' : 'A few highlights.'}
        </p>
      </div>

      {!showAll && (
        <div className="journey-top3">
          {items.map((item) => (
            <article
              key={item.id}
              className={`top3-card ${
                JOURNEY_IMAGES[item.id] ? 'has-img' : ''
              }`}
            >
              {JOURNEY_IMAGES[item.id] && (
                <img
                  className="top3-bg"
                  src={JOURNEY_IMAGES[item.id]}
                  alt=""
                />
              )}
              <span className="top3-year">{item.year}</span>
              <h3 className="top3-title">{item.title}</h3>
              <p className="top3-body">{item.body}</p>
            </article>
          ))}
        </div>
      )}

      {showAll && (
        <div className="timeline">
          <div className="timeline-track" ref={trackRef}>
          <div className="tl-tail" aria-hidden="true">
            <div className="tl-node-row">
              <svg
                className="tl-path"
                viewBox="0 0 100 70"
                preserveAspectRatio="none"
              >
                <path d={TL_TAIL_D} />
              </svg>
            </div>
          </div>

          {items.map((item, i) => {
            const seg = TL_SEGMENTS[i % TL_SEGMENTS.length]
            return (
              <div
                key={item.id}
                className={`tl-item ${i === active ? 'active' : ''}`}
              >
                <div
                  className="tl-node-row"
                  style={{ '--node-top': seg.top } as React.CSSProperties}
                >
                  <svg
                    className="tl-path"
                    viewBox="0 0 100 70"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path d={seg.d} />
                  </svg>
                  <svg
                    className="tl-flower"
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                  >
                    <path className="tl-flower-petals" d={FLOWER_D} />
                    <circle
                      className="tl-flower-center"
                      cx="50"
                      cy="50"
                      r="14"
                    />
                  </svg>
                  <span className="tl-node" />
                </div>
                <article
                  className={`tl-card ${
                    JOURNEY_IMAGES[item.id] ? 'has-img' : ''
                  }`}
                >
                  {JOURNEY_IMAGES[item.id] && (
                    <img
                      className="tl-bg"
                      src={JOURNEY_IMAGES[item.id]}
                      alt=""
                    />
                  )}
                  <span className="tl-year-in">{item.year}</span>
                  <h3 className="tl-title">{item.title}</h3>
                  <p className="tl-body">{item.body}</p>
                </article>
              </div>
            )
          })}

          <div className="tl-tail" aria-hidden="true">
            <div className="tl-node-row">
              <svg
                className="tl-path"
                viewBox="0 0 100 70"
                preserveAspectRatio="none"
              >
                <path d={TL_TAIL_D} />
              </svg>
            </div>
          </div>
          </div>
        </div>
      )}
      <div className="journey-actions">
        <ScallopButton onClick={toggle}>
          {showAll ? 'Show less' : 'See the full journey'}
        </ScallopButton>
      </div>

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

function Ticker() {
  const phrase =
    'Developer · Designer · Frontend · AI · Backend · Strategy · Generalist · Maker · '
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        <span>{phrase.repeat(4)}</span>
        <span>{phrase.repeat(4)}</span>
      </div>
    </div>
  )
}

function FooterScallop() {
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

  const target = 50
  const n = w > 0 ? Math.max(2, Math.round(w / target)) : 0
  const s = n > 0 ? w / n : 0
  const r = s / 2

  let d = ''
  if (w > 0 && n > 0) {
    const parts = [`M 0 ${r.toFixed(2)}`]
    for (let i = 0; i < n; i++)
      parts.push(`a ${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${s.toFixed(2)} 0`)
    parts.push(`L 0 ${r.toFixed(2)}`, 'Z')
    d = parts.join(' ')
  }

  return (
    <div
      ref={ref}
      className="footer-scallop"
      style={{ height: r || 0 }}
      aria-hidden="true"
    >
      {d && (
        <svg viewBox={`0 0 ${w} ${r}`} preserveAspectRatio="none">
          <path d={d} />
        </svg>
      )}
    </div>
  )
}

function ScallopFrame({
  expand = 0,
  photoOpacity = 1,
}: {
  expand?: number
  photoOpacity?: number
}) {
  const ref = useRef<SVGSVGElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setDims({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const path = dims.w && dims.h ? buildScallopPath(dims.w, dims.h, expand) : ''

  return (
    <svg
      ref={ref}
      className="scallop-border"
      viewBox={`0 0 ${dims.w || 1} ${dims.h || 1}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {path && (
        <>
          <defs>
            <clipPath id="hero-scallop-clip">
              <path d={path} fillRule="evenodd" />
            </clipPath>
            <linearGradient id="hero-scallop-wash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d1352" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0d1352" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <path d={path} fillRule="evenodd" fill="#0d1352" />
          <g
            clipPath="url(#hero-scallop-clip)"
            style={{ opacity: photoOpacity }}
          >
            <image
              href={landingImg}
              x="0"
              y="0"
              width={dims.w}
              height={dims.h}
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
          <path d={path} fillRule="evenodd" fill="url(#hero-scallop-wash)" />
        </>
      )}
    </svg>
  )
}

type SectionId = (typeof NAV_ITEMS)[number]['id']

function useActiveSection(ids: readonly SectionId[]): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id as SectionId)
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [ids])

  return active
}

const NAV_HEIGHT = 72

function App() {
  const active = useActiveSection(NAV_ITEMS.map((n) => n.id))
  const [vh, setVh] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [reveal, setReveal] = useState(0)
  const [parallax, setParallax] = useState(0)
  const tickerZoneRef = useRef<HTMLDivElement>(null)
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number; container: HTMLElement }>
  >([])

  useEffect(() => {
    let counter = 0
    const blueSelector = '.top-band, .support-card, .footer'
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const container = target?.closest(blueSelector) as HTMLElement | null
      if (!container) return
      const rect = container.getBoundingClientRect()
      const id = counter++
      setRipples((prev) => [
        ...prev,
        { id, x: e.clientX - rect.left, y: e.clientY - rect.top, container },
      ])
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 3600)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

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
        // Reveal the footer banner over the last ~half viewport of scroll,
        // fully shown once you hit the bottom.
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight
        const range = window.innerHeight * 0.5
        const dist = maxScroll - window.scrollY
        const revealVal =
          range > 0 ? Math.min(1, Math.max(0, 1 - dist / range)) : 1
        setReveal(revealVal)
        // Parallax: drift the banner at a fraction of scroll speed based on
        // where its band sits relative to the viewport centre. Fades to 0 as
        // it reaches the revealed state so the banner lands centred.
        const zone = tickerZoneRef.current
        if (zone) {
          const rect = zone.getBoundingClientRect()
          const fromCenter =
            rect.top + rect.height / 2 - window.innerHeight / 2
          setParallax(-fromCenter * 0.08 * (1 - revealVal))
        }
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
    const SNAP_THRESHOLD = 220
    const SNAP_DURATION = 900
    const STILLNESS_MS = 130

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
      const building = document.getElementById('building')
      if (building) candidates.push(building.offsetTop - NAV_HEIGHT)
      // Journey is a tall full-bleed band with centered content — snap to its
      // centre so the timeline sits in the middle of the viewport.
      const journey = document.getElementById('journey')
      if (journey) {
        candidates.push(
          journey.offsetTop + journey.offsetHeight / 2 - window.innerHeight / 2,
        )
      }
      // Frame the end of About with the footer scallop peeking in by the same
      // amount the nav shows at the top.
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
    // The hero (#home) lives inside the fixed top-band, so scrollIntoView
    // can't reach it — scroll the page to the top instead.
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const message = String(fd.get('message') ?? '').trim()
    const subject = name ? `Portfolio contact from ${name}` : 'Portfolio contact'
    const body = `From: ${name} <${email}>\n\n${message}`
    window.location.href = `mailto:zoe@zalo.se?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <>
      <main className="page">
        <div
          className={`top-band ${compact ? 'compact' : 'expanded'}`}
          style={vh > 0 ? { height: `${bandHeight}px` } : undefined}
        >
          <ScallopFrame expand={scallopExpand} photoOpacity={photoFade} />
          <header className="topnav" aria-label="Top navigation">
            <a
              className="topnav-logo"
              href="#home"
              onClick={(e) => handleNav(e, 'home')}
            >
              <svg
                className="topnav-flower"
                viewBox="0 0 100 100"
                aria-hidden="true"
              >
                <path className="topnav-flower-petals" d={FLOWER_D} />
                <circle className="topnav-flower-center" cx="50" cy="50" r="14" />
              </svg>
              Zoé Opdendries
            </a>
            <div className="topnav-right">
              <nav className="topnav-links" aria-label="Sections">
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

          <section
            className="hero"
            id="home"
            style={{
              opacity: heroFade,
              pointerEvents: heroFade < 0.05 ? 'none' : 'auto',
            }}
          >
            <div className="hero-inner">
              <h1 className="hero-headline">
                <span className="hl-serif">
                  <FlowerSticker />
                  I make the things
                </span>
                <span className="hl-display">
                  I wish <span className="hl-blue">exist</span>
                </span>
              </h1>
              <p className="hero-subtitle">
                Developer &amp; designer in Gothenburg, turning ideas
                into real things. Need help with something?
              </p>
              <a
                className="hero-cta"
                href="#contact"
                onClick={(e) => handleNav(e, 'contact')}
              >
                Just Say hi →
              </a>
            </div>

            <a
              className="hero-scrolldown"
              href="#building"
              onClick={(e) => handleNav(e, 'building')}
              aria-label="Scroll to explore"
            >
              <span>Enter in my world</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4v14M6 13l6 6 6-6" />
              </svg>
            </a>
          </section>
        </div>
        <div className="top-band-spacer" aria-hidden="true" />

        <BuildingSection />

        <JourneySection />

        <section className="about" id="about">
          <div className="about-text">
            <span className="about-eyebrow">— a little about me</span>
            <h2 className="about-heading">
              about<span className="about-heading-dot">.</span>
            </h2>
            <p className="about-lead">
              I’ve always been drawn to both math and art, but they felt like
              separate worlds until I found{' '}
              <em>programming</em> — where logic and creativity finally clicked,
              and where ideas could become something real.
            </p>
            <p className="about-lead about-lead--muted">
              It started with the arts, then expanded into design and code as I
              became drawn to building things from the ground up. Today I’m just
              as interested in the business side of it — strategy, IP, and the
              work it takes to get a product from idea to reality.
            </p>
          </div>

          <aside className="about-portrait">
            <div className="about-portrait-frame">
              <img src={meImg} alt="Zoe" />
            </div>
            <svg
              className="about-portrait-flower"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <path className="about-flower-petals" d={FLOWER_D} />
              <circle className="about-flower-center" cx="50" cy="50" r="14" />
            </svg>
            <ScallopTag>Gothenburg · SE</ScallopTag>
          </aside>
        </section>

        <footer className="footer-wrap">
          <div
            ref={tickerZoneRef}
            className="ticker-zone"
            style={
              {
                '--reveal': reveal,
                '--parallax': `${parallax}px`,
              } as React.CSSProperties
            }
          >
            <div className="about-skills">
              <span className="about-skills-label">What I bring</span>
              <ul className="skill-tags">
                {SKILLS.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <Ticker />
          </div>
          <FooterScallop />
          <div className="footer" id="contact">
          <div className="footer-grid">
            <div className="footer-intro">
              <h2 className="footer-headline">Need a hand with something?</h2>
              <p className="footer-sub">
                I do design, code, and the in-between. Drop me a line and
                we'll figure it out.
              </p>
              <div className="footer-links">
                <a className="footer-email" href="mailto:zoe@zalo.se">
                  zoe@zalo.se
                </a>
                <div className="footer-socials">
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    LinkedIn
                  </a>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    GitHub
                  </a>
                </div>
              </div>
            </div>

            <form className="footer-form" onSubmit={handleContactSubmit}>
              <h3 className="footer-heading">Tell me about it</h3>
              <input type="text" name="name" placeholder="Name" required />
              <input type="email" name="email" placeholder="Email" required />
              <textarea
                name="message"
                placeholder="What do you have in mind?"
                rows={4}
                required
              />
              <button type="submit">Say hi</button>
            </form>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Zoe</span>
            <span>Made in Gothenburg · @zoetechandme</span>
          </div>
          </div>
        </footer>
      </main>

      {ripples.map((r) =>
        createPortal(
          <span
            key={r.id}
            className="ripple"
            style={{ left: r.x, top: r.y }}
            aria-hidden="true"
          />,
          r.container,
        ),
      )}
    </>
  )
}

export default App
