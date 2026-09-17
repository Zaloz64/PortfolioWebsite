import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks'

const SKILLS = [
  'Fullstack',
  'AI / ML',
  'React / TypeScript',
  'Product design',
  'Figma',
  'Strategy',
  'Business design',
] as const

function Ticker({ className = '' }: { className?: string }) {
  const phrase =
    'Developer · Designer · Frontend · AI · Backend · Strategy · Generalist · Maker · '
  return (
    <div className={`ticker${className ? ` ${className}` : ''}`} aria-hidden="true">
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

export function Footer() {
  const tickerZoneRef = useRef<HTMLDivElement>(null)
  const [footerRef, footerInView] = useInView<HTMLDivElement>()
  const [reveal, setReveal] = useState(0)
  const [parallax, setParallax] = useState(0)
  const [sent, setSent] = useState(false)

  // Reveal the footer banner over the last ~half viewport of scroll (fully
  // shown at the bottom), and drift it with a fraction of scroll speed that
  // fades to 0 as it lands centred.
  useEffect(() => {
    let rafId: number | null = null
    const onScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight
        const range = window.innerHeight * 0.5
        const dist = maxScroll - window.scrollY
        const revealVal =
          range > 0 ? Math.min(1, Math.max(0, 1 - dist / range)) : 1
        setReveal(revealVal)
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

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const message = String(fd.get('message') ?? '').trim()
    const subject = name ? `Portfolio contact from ${name}` : 'Portfolio contact'
    const body = `From: ${name} <${email}>\n\n${message}`
    window.location.href = `mailto:zoe@zalo.se?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    // mailto can silently no-op if no mail client is configured — surface a
    // fallback so the lead isn't lost.
    setSent(true)
  }

  return (
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
      <div
        ref={footerRef}
        className={`footer ${footerInView ? 'footer-reveal' : ''}`}
        id="contact"
      >
        {/* On mobile the band-above-footer ticker scrolls off-screen, so show
            a copy flush under the scallop where it stays visible at the bottom. */}
        {/* <Ticker className="ticker--footer" /> */}
        <span className="footer-watermark" aria-hidden="true">
          Say hi
        </span>
        <div className="footer-grid">
          <div className="footer-intro">
            <span className="section-eyebrow">Let’s work together</span>
            <h2 className="footer-headline">
              Need a hand with <em>something</em>?
            </h2>
            <p className="footer-sub">
              I do design, code, and the in-between. Drop me a message and we’ll
              figure out what we can do together.
            </p>
            <div className="footer-links">
              <a className="footer-email" href="mailto:zoe@zalo.se">
                zoe@zalo.se
              </a>
              <a
                className="footer-linkedin"
                href="https://www.linkedin.com/in/zo%C3%A9-opdendries-007b19132/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <form className="footer-form" onSubmit={handleContactSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              aria-label="Name"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              aria-label="Email"
              required
            />
            <textarea
              name="message"
              placeholder="What do you have in mind?"
              aria-label="What do you have in mind?"
              rows={4}
              required
            />
            <button type="submit">Say hi</button>
            {sent && (
              <p className="footer-form-note" role="status">
                Opening your email app… if nothing happens, write me directly at{' '}
                <a href="mailto:zoe@zalo.se">zoe@zalo.se</a>.
              </p>
            )}
          </form>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Zoé Opdendries</span>
          <span>Made in Gothenburg</span>
        </div>
      </div>
    </footer>
  )
}
