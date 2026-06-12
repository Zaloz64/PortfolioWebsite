// Single source of truth for the top-nav anchors. Each `id` must match the
// `id` of a rendered element so the active-section observer can track it.
export const NAV_ITEMS = [
  { id: 'home', label: 'home' },
  { id: 'building', label: 'building' },
  { id: 'journey', label: 'journey' },
  { id: 'work', label: 'work' },
  { id: 'about', label: 'about' },
  { id: 'contact', label: 'say hi' },
] as const

export type SectionId = (typeof NAV_ITEMS)[number]['id']

// Collapsed height of the shrinking top band.
export const NAV_HEIGHT = 72
