import { useState } from 'react'
import { FLOWER_D } from '../lib/svg'
import { useInView } from '../hooks'
import { WORK, WORK_CATEGORIES, type WorkCategory } from '../lib/work'
import { WorkModal } from '../components/WorkModal'

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

export function WorkSection() {
  const [sectionRef, inView] = useInView<HTMLElement>()
  const [filter, setFilter] = useState<WorkCategory | 'all'>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  const items =
    filter === 'all' ? WORK : WORK.filter((w) => w.categories.includes(filter))
  const open = openId ? WORK.find((w) => w.id === openId) ?? null : null
  // stable plate numbers, independent of the active filter
  const plate = (id: string) =>
    `N°${String(WORK.findIndex((w) => w.id === id) + 1).padStart(2, '0')}`

  return (
    <section
      ref={sectionRef}
      className={`work ${inView ? 'work-reveal' : ''}`}
      id="work"
    >
      <div className="work-inner">
        <div className="work-head">
          <span className="section-eyebrow">everything I’ve made</span>
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
        </div>

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
    </section>
  )
}
