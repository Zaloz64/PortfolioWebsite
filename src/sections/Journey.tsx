import { useEffect, useRef, useState } from 'react'
import { FLOWER_D } from '../lib/svg'
import { useInView } from '../hooks'
import { WorkModal } from '../components/WorkModal'
import meImg from '../assets/me.jpg'
import cesaImg from '../assets/cesa.jpg'
import teethImg from '../assets/teeth.jpg'
import lexImg from '../assets/lexenergy.jpg'

type Milestone = {
  id: string
  year: string
  title: string
  body: string
  // Longer copy shown in the click-through detail page. Only the substantial
  // work/credibility milestones have one — those become clickable.
  detail?: string
  tags?: readonly string[]
  // detail-page extras (optional), mirror of lib/work.ts WorkItem
  role?: string
  highlights?: readonly string[]
  link?: { label: string; href: string }
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
    role: 'IT technician intern',
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
    role: 'Researcher & developer',
    highlights: [
      'Diagnoses misaligned teeth from clinical imagery',
      'Real machine learning on a problem with human impact',
      'Bachelor thesis at Chalmers',
    ],
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
    role: 'Sole frontend developer',
    highlights: [
      'Sole owner of the customer-facing frontend',
      'Designed in Figma, shipped in React + TypeScript',
      'The live interface drivers use to start, monitor and pay for a charge',
    ],
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
    role: 'Co-founder',
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
    role: 'Designer & developer',
    highlights: [
      'Design, build and ship iOS apps end to end',
      'Flower Power and Focus Lilio first to launch',
      'Built in public',
    ],
    // TODO: add a launch window + App Store / waitlist link once live.
  },
]

// Optional photo per milestone (keyed by id), shown at the top of a card.
const JOURNEY_IMAGES: Record<string, string> = {
  bsc: teethImg,
  cesa: cesaImg,
  'ev-screen': lexImg,
}

// The big side portrait — a single background-free cutout of me. Drop a
// transparent PNG into src/assets and point this at it (e.g. me-cutout.png)
// for the true floating-cutout look; `me.jpg` is a placeholder until then.
const PORTRAIT_CUTOUT = meImg

// One milestone on the timeline: a photo (when it has one), a bold year and a
// short note, alternating sides of a central dashed line. Entries with `detail`
// are clickable and open the shared full-page WorkModal.
function TimelineItem({
  item,
  current,
  onOpen,
}: {
  item: Milestone
  current: boolean
  onOpen: (id: string) => void
}) {
  const clickable = !!item.detail
  const img = JOURNEY_IMAGES[item.id]
  return (
    <li
      className={`jtl-item ${clickable ? 'is-clickable' : ''} ${
        img ? 'has-photo' : ''
      } ${current ? 'is-current' : ''}`}
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
      <span className="jtl-dot" aria-hidden="true" />
      <span className="jtl-flower" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <path className="jtl-flower-petals" d={FLOWER_D} />
          <circle className="jtl-flower-center" cx="50" cy="50" r="14" />
        </svg>
      </span>
      <div className="jtl-entry">
        {img && <img className="jtl-photo" src={img} alt="" />}
        <span className="jtl-year">{item.year}</span>
        <h3 className="jtl-title">{item.title}</h3>
        <p className="jtl-body">{item.body}</p>
        {item.tags && item.tags.length > 0 && (
          <ul className="jtl-tags">
            {item.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        {clickable && (
          <span className="jtl-more" aria-hidden="true">
            Read more →
          </span>
        )}
      </div>
    </li>
  )
}

export function JourneySection() {
  const [sectionRef, inView] = useInView<HTMLElement>(0.05)
  const railRef = useRef<HTMLOListElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [active, setActive] = useState(0)
  // > 0 only on desktop, once measured — drives the pinned scroll layout
  const [sectionH, setSectionH] = useState(0)
  const pinned = sectionH > 0
  const openItem = openId ? JOURNEY.find((j) => j.id === openId) ?? null : null

  // Scroll-driven pin (desktop, motion ok): the section is inflated to
  // viewport + the rail's vertical overflow; page scroll through it translates
  // the rail past the sticky portrait, and picks the centred milestone.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 861px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const enabled = () => desktop.matches && !reduce.matches
    const section = sectionRef.current
    const rail = railRef.current
    const viewport = viewportRef.current
    if (!section || !rail || !viewport) return

    let railMax = 0
    let raf: number | null = null
    // snap-to-nearest when the user rests between entries
    const STILL_MS = 150
    const SNAP_MS = 520
    let stillTimer: number | null = null
    let snapRaf: number | null = null
    let snapping = false

    const apply = () => {
      raf = null
      if (!enabled() || railMax === 0) return
      // shift == how far we've scrolled into the section (total === railMax)
      const shift = Math.min(railMax, Math.max(0, -section.getBoundingClientRect().top))
      rail.style.transform = `translateY(${-shift}px)`
      // active = the entry whose centre is nearest the viewport centre
      const centerY = window.innerHeight / 2
      const items = rail.children
      let best = 0
      let bestDist = Infinity
      for (let i = 0; i < items.length; i++) {
        const r = (items[i] as HTMLElement).getBoundingClientRect()
        const mid = r.top + r.height / 2
        const d = Math.abs(mid - centerY)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      }
      setActive(best)
    }

    // page scrollY that centres the entry nearest the viewport centre — or null
    // if we're not really near any entry (so the section can still be left).
    const snapTarget = (): number | null => {
      const vh = window.innerHeight
      const items = rail.children
      const sectionTopDoc = section.getBoundingClientRect().top + window.scrollY
      let best: HTMLElement | null = null
      let bestDist = Infinity
      for (let i = 0; i < items.length; i++) {
        const el = items[i] as HTMLElement
        const r = el.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - vh / 2)
        if (d < bestDist) {
          bestDist = d
          best = el
        }
      }
      if (!best || bestDist > vh * 0.42) return null
      const shift = best.offsetTop + best.offsetHeight / 2 - vh / 2
      const target = sectionTopDoc + Math.min(railMax, Math.max(0, shift))
      return Math.abs(target - window.scrollY) < 2 ? null : target
    }

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const animateTo = (targetY: number) => {
      const startY = window.scrollY
      const dist = targetY - startY
      const startT = performance.now()
      snapping = true
      const step = () => {
        const e = easeInOutCubic(Math.min(1, (performance.now() - startT) / SNAP_MS))
        window.scrollTo({ top: startY + dist * e, behavior: 'instant' as ScrollBehavior })
        if (e < 1) {
          snapRaf = requestAnimationFrame(step)
        } else {
          snapRaf = null
          snapping = false
        }
      }
      snapRaf = requestAnimationFrame(step)
    }

    const cancelSnap = () => {
      if (snapRaf !== null) {
        cancelAnimationFrame(snapRaf)
        snapRaf = null
      }
      snapping = false
    }

    const measure = () => {
      if (!enabled()) {
        railMax = 0
        rail.style.transform = ''
        setSectionH(0)
        setActive(0)
        return
      }
      // measure against the viewport height (the pinned column will be 100vh),
      // not the rail's own box — that box is only constrained once pinned
      railMax = Math.max(0, rail.scrollHeight - window.innerHeight)
      setSectionH(railMax > 0 ? window.innerHeight + railMax : 0)
      apply()
    }

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(apply)
      // arm the snap once scrolling settles (unless we're mid-snap)
      if (snapping) return
      if (stillTimer !== null) clearTimeout(stillTimer)
      stillTimer = window.setTimeout(() => {
        if (!enabled() || railMax === 0) return
        const t = snapTarget()
        if (t !== null) animateTo(t)
      }, STILL_MS)
    }

    const onUserInput = () => {
      cancelSnap()
      if (stillTimer !== null) clearTimeout(stillTimer)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(rail)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    window.addEventListener('wheel', onUserInput, { passive: true })
    window.addEventListener('touchstart', onUserInput, { passive: true })
    desktop.addEventListener('change', measure)
    reduce.addEventListener('change', measure)
    return () => {
      if (raf !== null) cancelAnimationFrame(raf)
      if (snapRaf !== null) cancelAnimationFrame(snapRaf)
      if (stillTimer !== null) clearTimeout(stillTimer)
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      window.removeEventListener('wheel', onUserInput)
      window.removeEventListener('touchstart', onUserInput)
      desktop.removeEventListener('change', measure)
      reduce.removeEventListener('change', measure)
      rail.style.transform = ''
    }
  }, [sectionRef])

  const activeItem = JOURNEY[active]

  return (
    <section
      className={`journey ${inView ? 'journey-reveal' : ''} ${
        pinned ? 'journey--pinned' : ''
      }`}
      id="journey"
      ref={sectionRef}
      style={pinned ? { height: sectionH } : undefined}
    >
      {/* heading shown on mobile (on desktop it lives in the portrait caption) */}
      <div className="journey-head journey-head--mobile">
        <div className="section-heading">
          <span className="section-eyebrow">My journey — where it started</span>
        </div>
      </div>

      <div className="journey-pin">
        <div className="journey-portrait">
          <img
            className="journey-portrait-img"
            src={PORTRAIT_CUTOUT}
            alt="Portrait of Zoë"
          />
          <div className="journey-portrait-cap">
            <span className="section-eyebrow">My journey</span>
            <span className="journey-cap-year">{activeItem.year}</span>
            <span className="journey-cap-title">{activeItem.title}</span>
          </div>
        </div>

        <div className="jtl-viewport" ref={viewportRef}>
          <ol className="jtl" ref={railRef}>
            {JOURNEY.map((item, i) => (
              <TimelineItem
                key={item.id}
                item={item}
                current={pinned && i === active}
                onOpen={setOpenId}
              />
            ))}
          </ol>
        </div>
      </div>

      {openItem && (
        <WorkModal
          year={openItem.year}
          title={openItem.title}
          overview={openItem.body}
          body={openItem.detail ?? openItem.body}
          role={openItem.role}
          tags={openItem.tags}
          highlights={openItem.highlights}
          link={openItem.link}
          img={JOURNEY_IMAGES[openItem.id]}
          onClose={() => setOpenId(null)}
        />
      )}
    </section>
  )
}
