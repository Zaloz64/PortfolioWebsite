import { useEffect, useMemo, useState } from 'react'
import { FLOWER_D } from './lib/svg'
import { NAV_HEIGHT } from './lib/constants'
import { WORK, WORK_CATEGORIES, type WorkCategory } from './lib/work'
import { WorkModal } from './components/WorkModal'
import { SiteNav } from './components/SiteNav'
import { ScallopFrame } from './components/ScallopFrame'

type Filter = WorkCategory | 'all'
type Sort = 'curated' | 'newest' | 'type'

const SORTS: { id: Sort; label: string }[] = [
  { id: 'curated', label: 'Curated' },
  { id: 'newest', label: 'Newest' },
  { id: 'type', label: 'By type' },
]

// Sortable year: 'Now'/'Soon' read as latest; otherwise the largest 4-digit
// year found (so a range like '2024–25' sorts on 2024).
const yearKey = (y: string): number => {
  if (/now|soon/i.test(y)) return 9999
  const m = y.match(/\d{4}/g)
  return m ? Math.max(...m.map(Number)) : 0
}
const catRank = (item: (typeof WORK)[number]): number =>
  WORK_CATEGORIES.findIndex((c) => c.id === item.categories[0])

// Assign 6-col grid spans so every row fills exactly, except the last row
// which may hold a single tile (leaving a gap). Each row is a lead span
// (4/3/2, cycled for variety) plus one tile filling the remainder. Tile 0 is
// the intro tile, so it always leads with 4.
function bentoSpans(n: number, cols = 6): number[] {
  const leads = [4, 3, 2]
  const spans: number[] = []
  let i = 0
  let row = 0
  while (i < n) {
    if (n - i === 1) {
      spans.push(Math.min(4, cols)) // lone last tile, alone on its row
      break
    }
    const lead = i === 0 ? 4 : leads[row % leads.length]
    spans.push(lead, cols - lead)
    i += 2
    row++
  }
  return spans
}

// True at the 6-col breakpoint, where the computed spans apply. Below that the
// CSS media queries own the layout (4-col / single-col), so we skip inlining.
function useWideGrid(): boolean {
  const [wide, setWide] = useState(
    () => window.matchMedia('(min-width: 1025px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return wide
}

// Read / build the /work URL query (?type=…&p=…) so filters and the open
// project are shareable and survive back/forward.
const parseFilter = (): Filter => {
  const t = new URLSearchParams(window.location.search).get('type')
  return t && WORK_CATEGORIES.some((c) => c.id === t) ? (t as Filter) : 'all'
}
const parseOpen = (): string | null => {
  const p = new URLSearchParams(window.location.search).get('p')
  return p && WORK.some((w) => w.id === p) ? p : null
}
const buildUrl = (filter: Filter, openId: string | null): string => {
  const params = new URLSearchParams()
  if (filter !== 'all') params.set('type', filter)
  if (openId) params.set('p', openId)
  const qs = params.toString()
  // keep the Vite base (e.g. '/PortfolioWebsite/') so deep links resolve
  return `${import.meta.env.BASE_URL}work${qs ? `?${qs}` : ''}`
}

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
export function WorkPage({
  onBack,
  onNavSection,
}: {
  onBack: () => void
  onNavSection: (id: string) => void
}) {
  const [filter, setFilter] = useState<Filter>(parseFilter)
  const [sort, setSort] = useState<Sort>('curated')
  const [openId, setOpenId] = useState<string | null>(parseOpen)
  const [menuOpen, setMenuOpen] = useState(false)
  // Velra isn't clickable yet ("more information to come"); a click just shakes.
  const [nope, setNope] = useState(false)
  // Phone-only: the filter chips collapse behind a toggle so they don't eat
  // three rows of vertical space above the grid.
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Keep state and the URL in sync. Filter is a replace (no history spam); an
  // opened project is a push so the browser Back closes it. popstate re-reads.
  const chooseFilter = (f: Filter) => {
    setFilter(f)
    setFiltersOpen(false)
    window.history.replaceState({}, '', buildUrl(f, openId))
  }
  const openItem = (id: string) => {
    if (id === 'velra') {
      setNope(true)
      return
    }
    setOpenId(id)
    window.history.pushState({}, '', buildUrl(filter, id))
  }
  const closeItem = () => {
    setOpenId(null)
    window.history.replaceState({}, '', buildUrl(filter, null))
  }
  useEffect(() => {
    const onPop = () => {
      setFilter(parseFilter())
      setOpenId(parseOpen())
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  // play the entrance once on mount
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const filtered =
    filter === 'all' ? WORK : WORK.filter((w) => w.categories.includes(filter))
  const items =
    sort === 'curated'
      ? filtered
      : [...filtered].sort((a, b) =>
          sort === 'newest'
            ? yearKey(b.year) - yearKey(a.year)
            : catRank(a) - catRank(b),
        )
  // The varied tile sizes (is-big/is-featured) are hand-tuned to tile the
  // 6-col grid only in curated order; for other sorts every tile is uniform.
  const bento = sort === 'curated'
  // Dynamic column spans so bento rows always fill (desktop 6-col only). +1 for
  // the intro tile that leads the grid. Null → fall back to the CSS classes.
  const wideGrid = useWideGrid()
  const spans = useMemo(
    () => (bento && wideGrid ? bentoSpans(items.length + 1) : null),
    [bento, wideGrid, items.length],
  )
  const open = openId ? WORK.find((w) => w.id === openId) ?? null : null
  const plate = (id: string) =>
    `N°${String(WORK.findIndex((w) => w.id === id) + 1).padStart(2, '0')}`
  const catLabels = (cats: readonly WorkCategory[]) =>
    cats.map((c) => WORK_CATEGORIES.find((wc) => wc.id === c)?.label).join(', ')
  const filterLabel =
    filter === 'all'
      ? 'All'
      : WORK_CATEGORIES.find((c) => c.id === filter)?.label ?? 'All'

  return (
    <main className={`workpage${ready ? ' work-reveal' : ''}`}>
      {/* slim navy nav bar with a scalloped bottom edge */}
      <div
        className={`work-band${menuOpen ? ' menu-open' : ''}`}
        style={{ height: NAV_HEIGHT }}
      >
        <ScallopFrame expand={80} photoOpacity={0} bottomOnly />
        <SiteNav
          isWork
          onNavSection={onNavSection}
          onSeeWork={() => {}}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      </div>
      <div
        className="work-band-spacer"
        aria-hidden="true"
        style={{ height: NAV_HEIGHT }}
      />

      {/* page intro: back control, title and a quick note on the archive */}
      <header className="archives-head">
        <div className="archives-head-inner">
          <button className="archives-back" onClick={onBack}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
            Back to home
          </button>
          <h1 className="section-eyebrow archives-eyebrow">the archives</h1>
        </div>
      </header>

      {/* filters sit just under the intro so you can refine the grid */}
      <div
        className="work-filters-bar"
        role="group"
        aria-label="Filter work by type"
      >
        <div className="work-filters-inner">
        <button
          className="work-filters-toggle"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((o) => !o)}
        >
          <svg
            className="work-filters-flower"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <path d={FLOWER_D} fill="currentColor" />
          </svg>
          <span className="work-filters-eyebrow">Filter</span>
          <span className="work-filters-value">{filterLabel}</span>
        </button>
        <div className={`work-filters${filtersOpen ? ' is-open' : ''}`}>
          <button
            className={`work-filter${filter === 'all' ? ' is-active' : ''}`}
            onClick={() => chooseFilter('all')}
          >
            All
          </button>
          {WORK_CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`work-filter${filter === c.id ? ' is-active' : ''}`}
              onClick={() => chooseFilter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="work-toolbar">
          <span className="work-count" aria-live="polite">
            {items.length} {items.length === 1 ? 'project' : 'projects'}
          </span>
          <div
            className={`work-sort${filtersOpen ? ' is-open' : ''}`}
            role="group"
            aria-label="Sort work"
          >
            {SORTS.map((s) => (
              <button
                key={s.id}
                className={`work-sort-btn${sort === s.id ? ' is-active' : ''}`}
                onClick={() => setSort(s.id)}
                aria-pressed={sort === s.id}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        </div>
      </div>

      <div className="workpage-inner">
        {/* key remounts the grid per filter/sort so the stagger replays */}
        <div className="work-grid" key={`${filter}-${sort}`}>
          {/* intro tile — a quick note on the archive, leads the bento */}
          <article
            className="work-tile is-big is-info"
            style={spans ? { gridColumn: `span ${spans[0]}` } : undefined}
          >
            <div className="info-top">
              <p className="info-greet">
                <b>Hi :) Happy you are intressted in my work!</b>
              </p>
              <p className="info-main">
                Here you have a <mark>running catalogue</mark> of what I have <mark>designd and buildt</mark>, form products, client/job
                work, and some experiences i have hade in between. Not everything I have made is here yet, more to come.
              </p>
            </div>
            <p className="info-note"><i>Open any tile to find the full story behind it.</i></p>
          </article>
          {items.map((item, i) => (
            <article
              key={item.id}
              className={`work-tile${bento && item.featured ? ' is-featured' : ''}${
                bento && item.big ? ' is-big' : ''
              }${item.img ? ' has-img' : ''}${item.icon ? ' is-app' : ''}${
                item.id === 'velra' && nope ? ' work-nope' : ''
              }`}
              style={{
                animationDelay: `${Math.min(i, 9) * 0.05}s`,
                ...(spans ? { gridColumn: `span ${spans[i + 1]}` } : {}),
              }}
              role="button"
              tabIndex={0}
              aria-label={
                item.id === 'velra'
                  ? `${item.title}, more information to come`
                  : `${item.title}, ${catLabels(item.categories)}, read more`
              }
              onClick={() => openItem(item.id)}
              onAnimationEnd={
                item.id === 'velra' ? () => setNope(false) : undefined
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openItem(item.id)
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
                <p className="work-blurb">
                  {item.blurb}
                  {item.id === 'velra' && (
                    <> <strong>More information to come.</strong></>
                  )}
                </p>
                {item.outcome && (
                  <span className="work-outcome">{item.outcome}</span>
                )}
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
          {items.length === 0 && (
            <p className="work-empty">
              Nothing under that filter yet, try another.
            </p>
          )}
        </div>
      </div>

      {open && (
        <WorkModal
          year={open.year}
          title={open.title}
          wrapTitle={open.wrapTitle}
          overview={open.blurb}
          body={open.detail}
          role={open.role}
          tags={open.tags}
          highlights={open.highlights}
          link={open.link}
          img={open.img}
          gallery={open.gallery}
          onClose={closeItem}
          onNavSection={onNavSection}
          onSeeWork={closeItem}
        />
      )}
    </main>
  )
}
