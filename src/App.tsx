import { useEffect, useRef, useState } from 'react'
import './App.css'

const NAV_ITEMS = [
  { id: 'about', label: 'about' },
  { id: 'works', label: 'works' },
  { id: 'gallery', label: 'gallery' },
  { id: 'contact', label: 'contact' },
] as const

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

function App() {
  const active = useActiveSection(NAV_ITEMS.map((n) => n.id))
  const [dockHidden, setDockHidden] = useState(true)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setDockHidden(y < 80)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <main className="page">
        <header className="topbar">
          <span className="logo">Zoé Opdendries</span>
          <div className="meta">
            <span>Gothenburg — SE</span>
            <span>Developer &amp; generalist · 2026</span>
          </div>
        </header>

        <section className="hero" id="home">
          <h1 className="hero-name">Zoe</h1>

          <div className="hero-grid">
            <div className="hero-col left">
              Developer &amp; generalist based in Gothenburg — moving
              fluidly between frontend, AI, backend, and the
              everything-else.
            </div>

            <div className="hero-portrait" aria-hidden="true">
              <span>portrait</span>
            </div>

            <div className="hero-col right">
              MSc in Entrepreneurship &amp; Business Design and CS at
              Chalmers. Building across code, strategy, and IP — and
              learning whatever the next thing turns out to be.
            </div>
          </div>

          <div className="scrolling-tag" aria-hidden="true">
            <div className="track">
              {Array.from({ length: 2 }).flatMap((_, group) =>
                ['Frontend', 'AI', 'Backend', 'Design', 'Strategy', 'Generalist'].flatMap(
                  (word, i) => [
                    <span key={`w-${group}-${i}`}>{word}</span>,
                    <span key={`d-${group}-${i}`} className="dot" />,
                  ],
                ),
              )}
            </div>
          </div>
        </section>

        <section className="about" id="about">
          <h2 className="about-heading">about.</h2>
          <div className="about-body">
            <p>
              I'm a generalist at heart, with a deep specialisation in
              tech. I know a little bit of everything, and I've genuinely
              come to love it that way — wearing different hats keeps
              things interesting.
            </p>
            <p>
              My foundation is technical: EGOI 2021 qualifier, years
              building across frontend, AI, and backend systems. My MSc in
              Entrepreneurship &amp; Business Design at Chalmers (alongside
              CS) pushed me beyond the code — into strategy, IP, and
              commercialisation. Previously solo built the front-end for
              LexEnergy's EV-charger customer interface.
            </p>
            <p>
              The most useful thing I bring is the ability to move fluidly
              between the technical and the everything-else. Outside of
              work: rock climbing, sailing, hiking, and a general
              preference for being slightly lost somewhere interesting.
            </p>
            <a className="btn" href="#works" onClick={(e) => handleNav(e, 'works')}>
              See the work
            </a>
          </div>
        </section>

        <section className="works" id="works">
          <div className="section-label">
            <h2>Selected works</h2>
            <span className="num">— 04</span>
          </div>

          <div className="works-grid">
            <article className="project">
              <div className="project-card warm">
                <span className="blob b" />
                <span className="project-tag">— indie iOS</span>
                <h3 className="project-title">Focus
                  <br />Lilio</h3>
              </div>
              <div className="project-meta">
                <span className="role">React Native · App-blocking Pomodoro</span>
                <span className="year">2026</span>
              </div>
            </article>

            <article className="project">
              <div className="project-card olive">
                <span className="blob a" />
                <span className="project-tag">— frontend</span>
                <h3 className="project-title">Lex
                  <br />Energy</h3>
              </div>
              <div className="project-meta">
                <span className="role">Solo FE · EV charger UI · React, TS</span>
                <span className="year">'24–'25</span>
              </div>
            </article>

            <article className="project">
              <div className="project-card cream">
                <span className="project-tag">— research</span>
                <h3 className="project-title">Tooth
                  <br />AI</h3>
              </div>
              <div className="project-meta">
                <span className="role">BSc thesis · ML diagnosis of misalignment</span>
                <span className="year">2024</span>
              </div>
            </article>

            <article className="project">
              <div className="project-card dark">
                <span className="project-tag">— web</span>
                <h3 className="project-title">Sort
                  <br />Visualiser</h3>
              </div>
              <div className="project-meta">
                <span className="role">Vue · Top 3 NTI showcase</span>
                <span className="year">2021</span>
              </div>
            </article>
          </div>
        </section>

        <section className="gallery" id="gallery">
          <div className="section-label">
            <h2>Gallery</h2>
            <span className="num">— moments</span>
          </div>

          <div className="gallery-grid">
            <div className="tile tall olive" />
            <div className="tile cream" />
            <div className="tile warm" />
            <div className="tile" />
            <div className="tile wide rust" />
            <div className="tile cream" />
            <div className="tile" />
            <div className="tile olive" />
            <div className="tile warm" />
          </div>
        </section>

        <section className="contact" id="contact">
          <h2 className="contact-heading">
            let's
            <br />
            <em>make</em> something.
          </h2>

          <div className="contact-body">
            <a className="email" href="mailto:zoe@zalo.se">
              zoe@zalo.se
            </a>
            <div className="socials">
              <a
                href="https://www.tiktok.com/@zoetechandme"
                target="_blank"
                rel="noreferrer"
              >
                TikTok
              </a>
              <a href="#" onClick={(e) => e.preventDefault()}>YouTube</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Instagram</a>
              <a href="#" onClick={(e) => e.preventDefault()}>GitHub</a>
            </div>
          </div>
        </section>

        <footer className="footer">
          <span>© 2026 Zoe</span>
          <span>Made in Gothenburg · @zoetechandme</span>
        </footer>
      </main>

      <nav className={`dock ${dockHidden ? 'hidden' : ''}`} aria-label="Sections">
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
    </>
  )
}

export default App
