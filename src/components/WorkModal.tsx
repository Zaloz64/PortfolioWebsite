import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FLOWER_D } from '../lib/svg'
import { SiteNav } from './SiteNav'
import { ScallopFrame } from './ScallopFrame'

const CLOSE_MS = 260

// Full-screen detail "page" shared by the work grid and the journey timeline.
// Portalled over the site as a light editorial takeover: the shared site nav, a
// big title header, then a two-column body — a sticky facts sidebar and the
// story with a product-image gallery and highlights. Plays a short exit
// animation before unmounting. Closes on the back pill, the backdrop edge, or
// Escape. The nav links route via the optional onNavSection / onSeeWork.
export function WorkModal({
  year,
  title,
  wrapTitle,
  overview,
  body,
  role,
  tags,
  highlights,
  link,
  img,
  gallery,
  onClose,
  onNavSection,
  onSeeWork,
  backLabel = 'Back to archive',
}: {
  year: string
  title: string
  // allow the title to wrap onto two rows instead of shrinking to one line
  wrapTitle?: boolean
  // short lead paragraph shown large under the title
  overview?: string
  // the longer detail copy
  body: string
  role?: string
  tags?: readonly string[]
  highlights?: readonly string[]
  link?: { label: string; href: string }
  img?: string
  // extra shots; falls back to the single img if absent
  gallery?: readonly string[]
  onClose: () => void
  // navigate to a home section / the archive (parent closes + routes)
  onNavSection?: (id: string) => void
  onSeeWork?: () => void
  // back-pill text; defaults to the archive wording used on /work
  backLabel?: string
}) {
  const backRef = useRef<HTMLButtonElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const requestClose = () => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)
    window.setTimeout(onClose, CLOSE_MS)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    backRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
    // requestClose is stable for the lifetime of the modal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // size the title to fit: wrapTitle → biggest size that stays within two
  // rows; otherwise → shrink to keep it on a single line
  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const fit = () => {
      el.style.fontSize = ''
      if (wrapTitle) {
        // binary-search the largest font size that wraps into ≤ 2 lines
        el.style.webkitLineClamp = 'unset'
        const LINE_H = 0.92 // matches .workdetail-title line-height
        let lo = 20
        let hi = 120
        for (let i = 0; i < 14; i++) {
          const mid = (lo + hi) / 2
          el.style.fontSize = `${mid}px`
          const lines = Math.round(el.scrollHeight / (mid * LINE_H))
          if (lines <= 2) lo = mid
          else hi = mid
        }
        el.style.fontSize = `${lo}px`
        el.style.webkitLineClamp = ''
        return
      }
      const base = parseFloat(getComputedStyle(el).fontSize)
      if (el.scrollWidth > el.clientWidth) {
        const scaled = base * (el.clientWidth / el.scrollWidth)
        el.style.fontSize = `${Math.max(scaled, 18)}px`
      }
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [title, wrapTitle])

  // overview defaults to nothing extra; if absent the detail carries the page
  const lead = overview && overview !== body ? overview : undefined
  const shots = gallery && gallery.length ? gallery : img ? [img] : []

  // Link + "see the results" live in the sidebar on desktop; on phone they
  // surface as a CTA row under the intro (CSS toggles which copy shows).
  const linkEl = link ? (
    <a
      className="workdetail-link"
      href={link.href}
      target="_blank"
      rel="noreferrer"
    >
      {link.label}
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </a>
  ) : null
  const jumpEl =
    shots.length > 0 ? (
      <button
        className="workdetail-jump"
        onClick={() =>
          galleryRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
      >
        See the results
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </button>
    ) : null

  return createPortal(
    <div
      className={`workdetail${closing ? ' is-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        // only the scroll container (the backdrop edge), not its children
        if (e.target === e.currentTarget) requestClose()
      }}
    >
      {/* navy nav strip with the scalloped bottom edge, like the other pages */}
      <div className="workdetail-nav">
        <ScallopFrame expand={80} photoOpacity={0} bottomOnly />
        <SiteNav
          isWork
          onNavSection={(id) => onNavSection?.(id)}
          onSeeWork={() => onSeeWork?.()}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      </div>

      <article className="workdetail-page">
        <button
          ref={backRef}
          className="workdetail-back"
          onClick={requestClose}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          {backLabel}
        </button>

        <div className="workdetail-grid">
          {/* the story: title, lead, body, then the image gallery */}
          <div className="workdetail-story">
            <header className="workdetail-header">
              <span className="workdetail-year">{year}</span>
              <h1
                ref={titleRef}
                className={`workdetail-title${wrapTitle ? ' is-wrap' : ''}`}
              >
                {title}
              </h1>
            </header>
            {lead && <p className="workdetail-lead">{lead}</p>}
            {(linkEl || jumpEl) && (
              <div className="workdetail-cta-mobile">
                {linkEl}
                {jumpEl}
              </div>
            )}
            {body.split(/\n\s*\n/).map((para, i) => (
              <p className="workdetail-body" key={i}>
                {para}
              </p>
            ))}

            {shots.length > 0 && (
              <div className="workdetail-gallery-block" ref={galleryRef}>
                <h2 className="workdetail-h">Gallery</h2>
                <div
                  className={`workdetail-gallery${
                    shots.length > 1 ? ' is-multi' : ''
                  }`}
                >
                  {shots.map((src, i) => (
                    <figure className="workdetail-shot" key={i}>
                      <img src={src} alt="" />
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* sticky facts sidebar, on the right */}
          <aside className="workdetail-aside">
            <dl className="workdetail-facts">
              {role && (
                <div className="workdetail-fact">
                  <dt>Role</dt>
                  <dd>{role}</dd>
                </div>
              )}
              <div className="workdetail-fact">
                <dt>Year</dt>
                <dd>{year}</dd>
              </div>
              {tags && tags.length > 0 && (
                <div className="workdetail-fact">
                  <dt>Stack</dt>
                  <dd>
                    <ul className="workdetail-chips">
                      {tags.map((t) => (
                        <li key={t} className="workdetail-chip">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>

            {highlights && highlights.length > 0 && (
              <div className="workdetail-highlights">
                <h2 className="workdetail-h">Highlights</h2>
                <ul>
                  {highlights.map((h) => (
                    <li key={h}>
                      <svg viewBox="0 0 100 100" aria-hidden="true">
                        <path d={FLOWER_D} />
                      </svg>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="workdetail-aside-cta">
              {linkEl}
              {jumpEl}
            </div>
          </aside>
        </div>
      </article>
    </div>,
    document.body,
  )
}
