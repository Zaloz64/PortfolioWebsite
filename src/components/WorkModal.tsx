import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FLOWER_D } from '../lib/svg'

const CLOSE_MS = 260

// Full-screen detail "page" shared by the work grid and the journey timeline.
// Portalled over the site as a takeover (not a small popup): image banner, a
// labelled meta strip, overview + detail copy, highlights and an optional link.
// Plays a short exit animation before unmounting. Closes on the back button,
// the backdrop edge, or Escape.
export function WorkModal({
  year,
  title,
  overview,
  body,
  role,
  tags,
  highlights,
  link,
  img,
  onClose,
}: {
  year: string
  title: string
  // short lead paragraph shown large under the title
  overview?: string
  // the longer detail copy
  body: string
  role?: string
  tags?: readonly string[]
  highlights?: readonly string[]
  link?: { label: string; href: string }
  img?: string
  onClose: () => void
}) {
  const backRef = useRef<HTMLButtonElement>(null)
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)

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

  // overview defaults to nothing extra; if absent the detail carries the page
  const lead = overview && overview !== body ? overview : undefined

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
      <article className="workdetail-page">
        <header className="workdetail-bar">
          <button
            ref={backRef}
            className="workdetail-back"
            onClick={requestClose}
            aria-label="Back"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Back
          </button>
          <svg
            className="workdetail-mark"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <path className="workdetail-mark-petals" d={FLOWER_D} />
            <circle className="workdetail-mark-center" cx="50" cy="50" r="14" />
          </svg>
        </header>

        {img && (
          <div className="workdetail-hero">
            <img className="workdetail-img" src={img} alt="" />
          </div>
        )}

        <div className="workdetail-intro">
          <span className="workdetail-year">{year}</span>
          <h1 className="workdetail-title">{title}</h1>
          {lead && <p className="workdetail-lead">{lead}</p>}
        </div>

        {(role || (tags && tags.length > 0)) && (
          <dl className="workdetail-meta">
            {role && (
              <div className="workdetail-meta-cell">
                <dt>Role</dt>
                <dd>{role}</dd>
              </div>
            )}
            <div className="workdetail-meta-cell">
              <dt>Year</dt>
              <dd>{year}</dd>
            </div>
            {tags && tags.length > 0 && (
              <div className="workdetail-meta-cell">
                <dt>Stack</dt>
                <dd>{tags.join(' · ')}</dd>
              </div>
            )}
          </dl>
        )}

        <div className="workdetail-content">
          <p className="workdetail-body">{body}</p>

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

          {link && (
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
          )}
        </div>
      </article>
    </div>,
    document.body,
  )
}
