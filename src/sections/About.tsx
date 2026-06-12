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
          I’ve always been drawn to both math and art, but they felt like
          separate worlds until I found{' '}
          <em>programming</em>, where logic and creativity finally clicked,
          and where ideas could become reality.
        </p>
        <p className="about-lead about-lead--muted">
          It started with the arts, then expanded into design and code as I
          became drawn to building things from the ground up. Today I’m just
          as interested in the business side of it: strategy, IP, and the
          work it takes to get a product from idea to reality.
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
