import { useEffect, useRef, useState } from 'react'
import { buildScallopPath } from '../lib/scallop'
import './ScallopFrame.css'

export function ScallopFrame({ expand = 0 }: { expand?: number }) {
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
      {path && <path d={path} fillRule="evenodd" />}
    </svg>
  )
}
