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
