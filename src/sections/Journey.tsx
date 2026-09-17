import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks'
import meImg from '../assets/me2.webp'

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
    year: '2018 to 2021',
    title: 'High school · NTI',
    body: 'Gymnasium in information & media technology, where the code habit really started.',
  },
  {
    id: 'sailing',
    year: '2019 to 2020',
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
    body: 'IT technician internship. Hardware and server-room operations in an enterprise environment.',
    detail:
      'A summer as IT technician at Ericsson, my first time inside a large enterprise tech organisation. Hands-on with hardware and server-room operations, learning how production infrastructure is actually run and kept alive at scale.',
    role: 'IT technician intern',
    // TODO: add one concrete responsibility or project to make this land harder.
  },
  {
    id: 'bsc',
    year: '2021 to 2024',
    title: 'BSc, Chalmers',
    body: 'Bachelor of Science in Information Technology. Thesis: an AI system diagnosing misaligned teeth from clinical imagery.',
    detail:
      'Bachelor of Science in Information Technology at Chalmers. My thesis built an AI system that diagnoses misaligned teeth from clinical imagery, pairing real machine learning with a problem that has direct, human impact.',
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
    body: 'PR lead for major student events. Posters and social campaigns in Figma, Photoshop and Illustrator.',
  },
  {
    id: 'cesa',
    year: '2023 to 2024',
    title: 'CESA × Star for Life',
    body: 'Core volunteer bringing tech access to South African schools: funding, logistics, and on-site setup.',
    detail:
      'CESA, Computer Education in Southern Africa, is a Chalmers student-run project that sends donated computers to rural schools in South Africa. I was Vice Chairman in 2023 to 2024, working with fundraising, logistics and travelling to KwaZulu-Natal with the team to help set everything up on site. We worked together with Star for Life, who support the schools year round and guided us on the ground.\n\nEach computer was prepared with Ubuntu and offline learning programs before being shipped. Once we arrived, the work became more practical: troubleshooting, maintenance, setup and helping with whatever the schools needed.\n\nWhat stayed with me was how much 15 computers could mean. For the schools, it was not just hardware. It was a way to teach computer education properly and give students a better chance in a world where basic digital skills are expected.',
    role: 'Vice Chairman',
    highlights: [
      'Raised funding and planned logistics',
      'Helped set up computers on site in KwaZulu-Natal',
      'Supported digital access in rural South African schools',
    ],
    link: { label: 'Visit cesaproject.com', href: 'https://cesaproject.com' },
  },
  {
    id: 'ev-screen',
    year: '2024 to 2025',
    title: 'LexEnergy',
    body: 'Solo-built the customer-facing frontend for LexEnergy’s EV charger network, the live station interface. React, TypeScript, Figma.',
    detail:
      'I solo-built the customer-facing frontend for LexEnergy’s EV charger network, the live interface drivers actually use at a station to start, monitor and pay for a charge. Sole frontend owner, from design in Figma through to shipped React + TypeScript.',
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
    year: '2024 to 2025',
    title: 'MSc · MPALG',
    body: 'First master’s at Chalmers in Computer Science: Algorithms, Languages & Logic. A year in, then I switched tracks.',
  },
  {
    id: 'msc-ebd',
    year: '2025 to now',
    title: 'MSc · Entrepreneurship',
    body: 'A year into a second master’s at Chalmers in Entrepreneurship & Business Design.',
  },
  {
    id: 'dia-aid',
    year: '2025',
    title: 'Business analysis · Dia Aid',
    body: 'A 7.5 hp course project: a full business analysis for the startup Dia Aid, mapping their market and model.',
  },
  // {
  //   id: 'velra',
  //   year: '2025–now',
  //   title: 'Starting Velra',
  //   body: 'Founding an energy-market startup through the master’s — a Chalmers × Lund venture. The work right now: proving real market need.',
  //   detail:
  //     'Velra is the company I’m founding through my entrepreneurship master’s — a Chalmers × Lund venture aimed at the energy market. The current phase is validation: pressure-testing the model and proving there’s genuine market need before building further.',
  //   role: 'Co-founder',
  //   // TODO: confirm 'Velra' is the final name, and add the specific problem/segment when you can share it.
  // },
  {
    id: 'building-now',
    year: 'Now',
    title: 'Building my own systems/apps',
    body: 'Systems and apps for my life and work, built to make things easier. Flower Power and Digital Friction launching soon, with more on the way.',
    detail:
      'On my own time I design, build and ship iOS apps end to end. Flower Power (plant care) and Digital Friction (focus) are first to launch, with more behind them. This is the build-in-public side of how I work.',
    tags: ['iOS'],
    role: 'Designer & developer',
    highlights: [
      'Design, build and ship iOS apps end to end',
      'Flower Power and Digital Friction first to launch',
      'Built in public',
    ],
    // TODO: add a launch window + App Store / waitlist link once live.
  },
]

// Collapsed by default to these flagship milestones; the toggle reveals all.
const FLAGSHIP_IDS = ['ev-screen', 'cesa', 'building-now']

// Milestones that exist as projects in the /work archive. Only these show
// "Read more", and it deep-links to the real archive entry (ids differ from
// work.ts) instead of duplicating the project in a local modal.
const ARCHIVE_WORK_ID: Record<string, string> = {
  bsc: 'thesis',
  cesa: 'cesa',
  'ev-screen': 'lexenergy',
}

// One milestone in the vertical accordion. Collapsed it shows only year + title;
// when it scrolls to centre (`open`) it expands its body, photo and tags. Cards
// with `detail` that are in the archive show a "Read more" linking to /work.
function MilestoneRow({
  item,
  index,
  open,
  onOpen,
}: {
  item: Milestone
  index: number
  open: boolean
  onOpen: (id: string) => void
}) {
  const clickable = !!item.detail
  return (
    <li data-id={item.id} className={`jitem ${open ? 'is-open' : ''}`}>
      <span className="jitem-num" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="jitem-body-col">
        <div className="jitem-head">
          <span className="jitem-year">{item.year}</span>
          <h3 className="jitem-title">{item.title}</h3>
        </div>

        <div className="jitem-detail">
          <div className="jitem-detail-inner">
            <p className="jitem-body">{item.body}</p>
          {item.tags && item.tags.length > 0 && (
            <ul className="jitem-tags">
              {item.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
            {clickable && item.id in ARCHIVE_WORK_ID && (
              <button
                type="button"
                className="jitem-more"
                onClick={() => onOpen(item.id)}
              >
                Read more →
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}

export function JourneySection({
  onSeeWork,
}: {
  // Open the /work archive, optionally deep-linked to a specific project.
  onSeeWork?: (projectId?: string) => void
} = {}) {
  const [sectionRef, inView] = useInView<HTMLElement>(0.05)
  const listRef = useRef<HTMLOListElement>(null)
  // -1 means none open — the state you land on before scrolling through
  const [active, setActive] = useState(-1)
  // collapsed shows only the flagship trio; the toggle reveals the full timeline
  const [showAll, setShowAll] = useState(false)
  // > 0 only when the section is pinned (collapsed trio OR full windowed list)
  const [sectionH, setSectionH] = useState(0)
  // vertical offset applied to the full-timeline list so the open row centres
  const [listShift, setListShift] = useState(0)
  const shiftRef = useRef(0)
  const pinned = sectionH > 0
  const visible = showAll
    ? JOURNEY
    : JOURNEY.filter((j) => FLAGSHIP_IDS.includes(j.id))

  const toggle = () => {
    setShowAll((v) => {
      // snap back to the section top so the (new) list starts from the
      // beginning instead of being stranded mid-scroll as it resizes
      requestAnimationFrame(() =>
        sectionRef.current?.scrollIntoView({ block: 'start' }),
      )
      return !v
    })
  }

  // Scroll-driven accordion. Three modes:
  //  • Collapsed trio (desktop, motion ok): the section pins; scroll progress
  //    maps to which milestone is open — the eras cycle first → last in place.
  //  • Full timeline (desktop, motion ok): the section pins too, but the list
  //    is windowed — the open row is held in the middle and the list slides so
  //    the first/last eras move off and on screen as you scroll.
  //  • Mobile / reduced-motion: no pin — the open one is the row nearest the
  //    viewport centre as the page scrolls naturally.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 861px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const section = sectionRef.current
    const list = listRef.current
    if (!section || !list) return
    const pinActive = () => desktop.matches && !reduce.matches
    let raf: number | null = null

    const count = () => list.querySelectorAll('.jitem').length

    const apply = () => {
      raf = null
      const n = count()
      const rows = list.querySelectorAll<HTMLElement>('.jitem')
      if (pinActive() && section.offsetHeight > window.innerHeight) {
        const total = section.offsetHeight - window.innerHeight
        const scrolled = -section.getBoundingClientRect().top
        const p = Math.min(1, Math.max(0, scrolled / total))
        if (showAll) {
          // full timeline: the list translate tracks scroll *continuously* (no
          // eased snap) so the open era follows your scroll like the highlights
          // accordion. A uniform row step keeps it from jittering when the open
          // era expands; the era nearest the focus is the open one.
          const win = list.parentElement
          if (win && rows.length) {
            const f = p * (n - 1) // continuous position through the eras
            setActive(Math.round(f))
            // uniform closed-row step = smallest gap between adjacent rows
            // (gaps spanning the open era are larger, so the min is the closed
            // step) — keeps the slide steady as eras open/close
            let step = Infinity
            for (let i = 1; i < rows.length; i++) {
              step = Math.min(step, rows[i].offsetTop - rows[i - 1].offsetTop)
            }
            if (!isFinite(step)) step = 0
            const winRect = win.getBoundingClientRect()
            const olTop0 = list.getBoundingClientRect().top - shiftRef.current
            const anchor = winRect.top + winRect.height * 0.28
            const shift = Math.round(
              anchor - (olTop0 + rows[0].offsetTop) - f * step,
            )
            shiftRef.current = shift
            setListShift(shift)
          }
        } else {
          // collapsed trio: first slice (of n+1) opens nothing, so you land
          // with the whole list closed and the eras reveal as you scroll in
          const idx = Math.floor(p * (n + 1)) - 1
          setActive(Math.max(-1, Math.min(n - 1, idx)))
        }
        return
      }
      // nearest-centre fallback
      const center = window.innerHeight / 2
      let best = 0
      let bestDist = Infinity
      rows.forEach((r, i) => {
        const rect = r.getBoundingClientRect()
        const mid = rect.top + rect.height / 2
        const d = Math.abs(mid - center)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      setActive(best)
    }

    const measure = () => {
      // one viewport-ish of scroll per milestone, plus the pinned screen itself
      if (!pinActive()) {
        shiftRef.current = 0
        setListShift(0)
        setSectionH(0)
      } else {
        setSectionH(
          Math.round(window.innerHeight * (1 + (count() + 1) * 0.45)),
        )
      }
      apply()
    }

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(apply)
    }

    measure()
    // re-measure after layout settles (toggle changes the item count)
    const settle = window.setTimeout(measure, 200)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    desktop.addEventListener('change', measure)
    reduce.addEventListener('change', measure)
    return () => {
      clearTimeout(settle)
      if (raf !== null) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      desktop.removeEventListener('change', measure)
      reduce.removeEventListener('change', measure)
    }
  }, [sectionRef, showAll])

  return (
    <>
      <section
        className={`journey ${inView ? 'journey-reveal' : ''} ${
          pinned ? 'journey--pinned' : ''
        } ${showAll ? 'journey--full' : 'journey--collapsed'} ${
          pinned && showAll ? 'journey--windowed' : ''
        }`}
        id="journey"
        ref={sectionRef}
        style={pinned ? { height: sectionH } : undefined}
      >
        <div className="journey-inner">
          <span className="journey-watermark" aria-hidden="true">
            Highlights
          </span>
          <div className="journey-head section-heading">
            <span className="section-eyebrow">My journey</span>
            <button
              className="journey-archive-link"
              onClick={toggle}
              aria-expanded={showAll}
            >
              {showAll ? 'Show less' : 'See full timeline'}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <aside className="journey-aside">
            <div className="journey-media" aria-hidden="true">
              <img className="journey-media-img" src={meImg} alt="" />
            </div>
          </aside>

          <div className="journey-list-window">
            <ol
              className="journey-list"
              ref={listRef}
              style={
                pinned && showAll
                  ? { transform: `translateY(${listShift}px)` }
                  : undefined
              }
            >
              {visible.map((item, i) => (
                <MilestoneRow
                  key={item.id}
                  item={item}
                  index={i}
                  open={i === active}
                  onOpen={(id) => onSeeWork?.(ARCHIVE_WORK_ID[id])}
                />
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  )
}
