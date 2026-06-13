// SVG path generators for the recurring scalloped borders, flower motif, and
// transition blobs. Pure functions returning path `d` strings.

export function buildScallopPath(w: number, h: number, expand = 0): string {
  const isMobile = w < 700
  const baseInset = isMobile ? 22 : 30
  const inset = Math.max(8, Math.min(baseInset, h * 0.25))
  const target = isMobile ? 30 : 44
  const x0 = inset - expand
  const y0 = inset - expand
  const x1 = w - inset + expand
  const y1 = h - inset
  if (x1 <= x0 || y1 <= y0) return ''
  const innerW = x1 - x0
  const innerH = y1 - y0
  const nW = Math.max(2, Math.round(innerW / target))
  const nH = Math.max(2, Math.round(innerH / target))
  const sW = innerW / nW
  const sH = innerH / nH
  const rW = sW / 2
  const rH = sH / 2
  const parts: string[] = [`M ${x0.toFixed(2)} ${y0.toFixed(2)}`]
  for (let i = 0; i < nW; i++)
    parts.push(`a ${rW.toFixed(2)} ${rW.toFixed(2)} 0 0 1 ${sW.toFixed(2)} 0`)
  for (let i = 0; i < nH; i++)
    parts.push(`a ${rH.toFixed(2)} ${rH.toFixed(2)} 0 0 1 0 ${sH.toFixed(2)}`)
  for (let i = 0; i < nW; i++)
    parts.push(`a ${rW.toFixed(2)} ${rW.toFixed(2)} 0 0 1 ${(-sW).toFixed(2)} 0`)
  for (let i = 0; i < nH; i++)
    parts.push(`a ${rH.toFixed(2)} ${rH.toFixed(2)} 0 0 1 0 ${(-sH).toFixed(2)}`)
  parts.push('Z')

  return parts.join(' ')
}

export function buildFlowerPath(
  cx: number,
  cy: number,
  mid: number,
  amp: number,
  petals = 8,
  steps = 180,
): string {
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const r = mid + amp * Math.cos(petals * t)
    const x = cx + r * Math.cos(t)
    const y = cy + r * Math.sin(t)
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)} `
  }
  return `${d}Z`
}

export const FLOWER_D = buildFlowerPath(50, 50, 33, 13)

// Scalloped (bubbly) outline for button/tag borders.
export function scallopOutline(w: number, h: number): string {
  if (w <= 4 || h <= 4) return ''
  const target = 18
  const nW = Math.max(2, Math.round(w / target))
  const sW = w / nW
  const rW = sW / 2
  const nH = Math.max(1, Math.round(h / target))
  const sH = h / nH
  const rH = sH / 2
  const p: string[] = ['M 0 0']
  for (let i = 0; i < nW; i++)
    p.push(`a ${rW.toFixed(2)} ${rW.toFixed(2)} 0 0 1 ${sW.toFixed(2)} 0`)
  for (let i = 0; i < nH; i++)
    p.push(`a ${rH.toFixed(2)} ${rH.toFixed(2)} 0 0 1 0 ${sH.toFixed(2)}`)
  for (let i = 0; i < nW; i++)
    p.push(`a ${rW.toFixed(2)} ${rW.toFixed(2)} 0 0 1 ${(-sW).toFixed(2)} 0`)
  for (let i = 0; i < nH; i++)
    p.push(`a ${rH.toFixed(2)} ${rH.toFixed(2)} 0 0 1 0 ${(-sH).toFixed(2)}`)
  p.push('Z')
  return p.join(' ')
}

// Puffy cloud blob for the journey open transition.
export function cloudBlob(cx: number, cy: number, r: number, bumps = 9): string {
  const pts: [number, number][] = []
  for (let i = 0; i < bumps; i++) {
    const a = (i / bumps) * Math.PI * 2 - Math.PI / 2
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)} `
  for (let i = 0; i < bumps; i++) {
    const cur = pts[i]
    const next = pts[(i + 1) % bumps]
    const chord = Math.hypot(next[0] - cur[0], next[1] - cur[1])
    const br = (chord / 2) * 1.08
    d += `A ${br.toFixed(2)} ${br.toFixed(2)} 0 0 1 ${next[0].toFixed(2)} ${next[1].toFixed(2)} `
  }
  return `${d}Z`
}

export const CLOUD_D = cloudBlob(50, 50, 30, 9)
