import { useEffect, useState } from 'react'
import { FLOWER_D } from './lib/svg'
import { WORK, WORK_CATEGORIES, type WorkCategory } from './lib/work'
import { WorkModal } from './components/WorkModal'

function TileIcon({ icon }: { icon: 'flower' | 'rings' }) {
  if (icon === 'rings') {
    return (
      <svg className="work-icon" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="7" />
        <circle cx="50" cy="50" r="19" fill="none" stroke="currentColor" strokeWidth="7" />
        <circle cx="50" cy="50" r="6" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg className="work-icon" viewBox="0 0 100 100" aria-hidden="true">
      <path d={FLOWER_D} fill="currentColor" />
    </svg>
  )
}

// The full "everything I've made" view as its own page (route: /work),
// reached from the Building section. Self-contained: header with a back
// link, filter chips, the bento grid and the shared detail modal.
export function WorkPage({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState<WorkCategory | 'all'>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  // play the entrance once on mount
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const items =
    filter === 'all' ? WORK : WORK.filter((w) => w.categories.includes(filter))
  const open = openId ? WORK.find((w) => w.id === openId) ?? null : null
  const plate = (id: string) =>
    `N°${String(WORK.findIndex((w) => w.id === id) + 1).padStart(2, '0')}`

  return (
    <main className={`workpage${ready ? ' work-reveal' : ''}`}>
      <div className="workpage-inner">
        <header className="workpage-head">
          <button className="workpage-back" onClick={onBack}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
            Back
          </button>
          <span className="section-eyebrow">the full archive</span>
          <h1 className="workpage-title">everything I’ve made</h1>
          <p className="workpage-lead">
            Apps, code, design, ventures and the things in between — filter by
            what you’re curious about.
          </p>
          <div
            className="work-filters"
            role="group"
            aria-label="Filter work by type"
          >
            <button
              className={`work-filter${filter === 'all' ? ' is-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {WORK_CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`work-filter${filter === c.id ? ' is-active' : ''}`}
                onClick={() => setFilter(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </header>

        {/* key remounts the grid per filter so the stagger replays */}
        <div className="work-grid" key={filter}>
          {items.map((item, i) => (
            <article
              key={item.id}
              className={`work-tile${item.featured ? ' is-featured' : ''}${
                item.img ? ' has-img' : ''
              }${item.icon ? ' is-app' : ''}`}
              style={{ animationDelay: `${Math.min(i, 9) * 0.05}s` }}
              role="button"
              tabIndex={0}
              aria-label={`${item.title} — read more`}
              onClick={() => setOpenId(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setOpenId(item.id)
                }
              }}
            >
              {item.img && <img className="work-bg" src={item.img} alt="" />}
              {item.icon && (
                <div className="work-ghost" aria-hidden="true">
                  <TileIcon icon={item.icon} />
                </div>
              )}
              <div className="work-tile-top">
                {item.icon ? (
                  <TileIcon icon={item.icon} />
                ) : (
                  <span className="work-year">{item.year}</span>
                )}
                <span className="work-index" aria-hidden="true">
                  {plate(item.id)}
                </span>
              </div>
              <div className="work-tile-main">
                {item.icon && <span className="work-year">{item.year}</span>}
                <h3 className="work-title">{item.title}</h3>
                <p className="work-blurb">{item.blurb}</p>
                <ul className="work-cats" aria-hidden="true">
                  {item.categories.map((c) => (
                    <li key={c}>
                      {WORK_CATEGORIES.find((wc) => wc.id === c)?.label}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>

      {open && (
        <WorkModal
          year={open.year}
          title={open.title}
          body={open.detail}
          tags={open.tags}
          img={open.img}
          onClose={() => setOpenId(null)}
        />
      )}
    </main>
  )
}
