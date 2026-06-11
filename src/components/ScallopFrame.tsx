import { useEffect, useRef, useState } from 'react'
import { buildScallopPath } from '../lib/svg'
import landingImg from '../assets/landing.jpeg'

// The scalloped, photo-filled frame behind the landing band. Re-measures its
// own box and regenerates the path on resize.
export function ScallopFrame({
  expand = 0,
  photoOpacity = 1,
}: {
  expand?: number
  photoOpacity?: number
}) {
  const ref = useRef<SVGSVGElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setDims({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const path = dims.w && dims.h ? buildScallopPath(dims.w, dims.h, expand) : ''

  return (
    <svg
      ref={ref}
      className="scallop-border"
      viewBox={`0 0 ${dims.w || 1} ${dims.h || 1}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {path && (
        <>
          <defs>
            <clipPath id="hero-scallop-clip">
              <path d={path} fillRule="evenodd" />
            </clipPath>
            <linearGradient id="hero-scallop-wash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d1352" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0d1352" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <path d={path} fillRule="evenodd" fill="#0d1352" />
          <g
            clipPath="url(#hero-scallop-clip)"
            style={{ opacity: photoOpacity }}
          >
            <image
              href={landingImg}
              x="0"
              y="0"
              width={dims.w}
              height={dims.h}
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
          <path d={path} fillRule="evenodd" fill="url(#hero-scallop-wash)" />
        </>
      )}
    </svg>
  )
}
