import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FLOWER_D } from '../lib/svg'

const CLOSE_MS = 220

// Detail popup shared by the work grid and the journey timeline. Portalled
// over the page; plays a short exit animation before unmounting. Closes on
// backdrop click, the close button, or Escape.
export function WorkModal({
  year,
  title,
  body,
  tags,
  img,
  onClose,
}: {
  year: string
  title: string
  body: string
  tags?: readonly string[]
  img?: string
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
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
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
    // requestClose is stable for the lifetime of the modal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return createPortal(
    <div
      className={`milestone-overlay${closing ? ' is-closing' : ''}`}
      onClick={requestClose}
    >
      <div
        className="milestone-shell"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <svg className="milestone-flower" viewBox="0 0 100 100" aria-hidden="true">
          <path className="milestone-flower-petals" d={FLOWER_D} />
          <circle className="milestone-flower-center" cx="50" cy="50" r="14" />
        </svg>
        <button
          ref={closeRef}
          className="milestone-close"
          onClick={requestClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className={`milestone-modal${img ? ' has-img' : ''}`}>
          {img && (
            <div className="milestone-media">
              <img className="milestone-img" src={img} alt="" />
            </div>
          )}
          <div className="milestone-body">
            <span className="milestone-year">{year}</span>
            <h3 className="milestone-title">{title}</h3>
            <p className="milestone-detail">{body}</p>
            {tags && tags.length > 0 && (
              <ul className="milestone-tags">
                {tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
