import { useEffect, useRef, useState } from 'react'
import { FLOWER_D, scallopOutline } from '../lib/svg'
import { useInView } from '../hooks'
import meImg from '../assets/me.jpg'

// A small static label wearing a scalloped (bubbly), filled sticker edge.
function ScallopTag({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setDims({ w: el.offsetWidth, h: el.offsetHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [children])
  const d = scallopOutline(dims.w, dims.h)
  return (
    <span ref={ref} className="about-portrait-tag">
      {d && (
        <svg
          className="scallop-tag-bg"
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={d} />
        </svg>
      )}
      <span className="about-portrait-tag-label">{children}</span>
    </span>
  )
}

export function About() {
  const [aboutRef, aboutInView] = useInView<HTMLElement>()

  return (
    <section
      ref={aboutRef}
      className={`about ${aboutInView ? 'about-reveal' : ''}`}
      id="about"
    >
      <div className="about-text">
        <span className="section-eyebrow">a little about me</span>
      <p className="about-lead">
  I’m a multi-passionate person who loves to learn and take on new challenges.
  My background is in computer science, and I’ve been programming for nine years
  now. I still love the problem-solving and creativity it gives you: taking
  something from nothing into something real.
</p>
<p className="about-lead about-lead--muted">
  Right now I’m doing my master’s in entrepreneurship and business design,
  because I want to understand every part of a product: from what makes people
  buy it to the legal side of building a business.
</p>
<p className="about-lead about-lead--muted">
  Outside of that, I love snowboarding, sailing and climbing. So if you ever
  want to have a business meeting doing any of those, that would be the dream.
</p>
      </div>

      <aside className="about-portrait">
        <div className="about-portrait-frame">
          <img src={meImg} alt="Zoé" />
        </div>
        <svg
          className="about-portrait-flower"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path className="about-flower-petals" d={FLOWER_D} />
          <circle className="about-flower-center" cx="50" cy="50" r="14" />
        </svg>
        <ScallopTag>Gothenburg · SE</ScallopTag>
      </aside>
    </section>
  )
}
