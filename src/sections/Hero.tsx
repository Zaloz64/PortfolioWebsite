// Landing content. Lives inside the fixed top-band, which App owns; the band's
// scroll-driven fade is passed in as `heroFade`.
export function Hero({
  heroFade,
  onNav,
}: {
  heroFade: number
  onNav: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void
}) {
  return (
    <section
      className="hero"
      id="home"
      style={{
        opacity: heroFade,
        pointerEvents: heroFade < 0.05 ? 'none' : 'auto',
      }}
    >
      <div className="hero-inner">
        <h1 className="hero-headline">
          <span className="hl-serif">
            I make the things
          </span>
          <span className="hl-display">I wish exist</span>
        </h1>
        <p className="hero-subtitle">
          Business strategist, coder & designer in Gothenburg.
        </p>
        <a
          className="hero-cta"
          href="#contact"
          onClick={(e) => onNav(e, 'contact')}
        >
          Work with me →
        </a>
      </div>

      <div className="hero-marginalia" aria-hidden="true">
        <span>Business developer at Velra ✶</span>
        <span>SELECTIVELY TAKING PROJECTS ✶</span>
      </div>

      <a
        className="hero-scrolldown"
        href="#building"
        onClick={(e) => onNav(e, 'building')}
        aria-label="Scroll to explore"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4v14M6 13l6 6 6-6" />
        </svg>
      </a>
    </section>
  )
}
