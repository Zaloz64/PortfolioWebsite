export const NAV_ITEMS = [
  { id: 'now', label: 'now' },
  { id: 'building', label: 'building' },
  { id: 'about', label: 'about' },
  { id: 'contact', label: 'contact' },
] as const

export const NAV_HEIGHT = 72

export type SectionId = (typeof NAV_ITEMS)[number]['id']
