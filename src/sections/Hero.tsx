import { FLOWER_D } from '../lib/svg'

function FlowerSticker() {
  return (
    <svg className="hero-flower" viewBox="0 0 100 100" aria-hidden="true">
      <path className="hero-flower-petals" d={FLOWER_D} />
      <circle className="hero-flower-center" cx="50" cy="50" r="14" />
    </svg>
  )
}

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
            <FlowerSticker />
            I make the things
          </span>
          <span className="hl-display">
            I wish <span className="hl-blue">exist</span>
          </span>
        </h1>
        <p className="hero-subtitle">
          Developer &amp; designer in Gothenburg, turning ideas
          into real things. Got something you want built?
        </p>
        <a
          className="hero-cta"
          href="#contact"
          onClick={(e) => onNav(e, 'contact')}
        >
          Just say hi →
        </a>
      </div>

      <a
        className="hero-scrolldown"
        href="#building"
        onClick={(e) => onNav(e, 'building')}
        aria-label="Scroll to explore"
      >
        <span>Enter my world</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4v14M6 13l6 6 6-6" />
        </svg>
      </a>
    </section>
  )
}
