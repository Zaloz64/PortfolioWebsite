import cesaImg from '../assets/cesa.jpg'
import teethImg from '../assets/teeth.jpg'
import lexImg from '../assets/lexenergy.jpg'

// Everything in one place: the work grid renders all of it, the filter
// narrows by category. Items can belong to several categories.
export const WORK_CATEGORIES = [
  { id: 'apps', label: 'Apps' },
  { id: 'code', label: 'Code & AI' },
  { id: 'design', label: 'Design' },
  { id: 'business', label: 'Business' },
  { id: 'impact', label: 'Impact' },
] as const

export type WorkCategory = (typeof WORK_CATEGORIES)[number]['id']

export type WorkItem = {
  id: string
  title: string
  year: string
  blurb: string
  detail: string
  categories: readonly WorkCategory[]
  tags?: readonly string[]
  img?: string
  icon?: 'flower' | 'rings'
  // featured tiles span two columns in the bento
  featured?: boolean
}

export const WORK: readonly WorkItem[] = [
  {
    id: 'flower-power',
    title: 'Flower Power',
    year: 'Soon',
    blurb:
      'A watering app that keeps your plants alive — care reminders tuned to what you actually grow.',
    detail:
      'A watering app that keeps your plants alive. Care reminders tuned to the plants you actually own, designed and built end to end — one of the first apps shipping under my buy-once philosophy.',
    categories: ['apps', 'design', 'code'],
    tags: ['iOS', 'Product design'],
    icon: 'flower',
    featured: true,
  },
  {
    id: 'focus-lilio',
    title: 'Focus Lilio',
    year: 'Soon',
    blurb:
      'A focus app that makes deep work the path of least resistance instead of the path of willpower.',
    detail:
      'A focus app that makes deep work the path of least resistance instead of the path of willpower. Designed and built end to end on my own time — launching soon.',
    categories: ['apps', 'design', 'code'],
    tags: ['iOS', 'Product design'],
    icon: 'rings',
  },
  {
    id: 'lexenergy',
    title: 'LexEnergy',
    year: '2024–25',
    blurb:
      'Solo-built the customer-facing frontend for an EV charger network — the live station interface.',
    detail:
      'I solo-built the customer-facing frontend for LexEnergy’s EV charger network — the live interface drivers actually use at a station to start, monitor and pay for a charge. Sole frontend owner, from design in Figma through to shipped React + TypeScript.',
    categories: ['code', 'design'],
    tags: ['React', 'TypeScript', 'Figma'],
    img: lexImg,
    featured: true,
  },
  {
    id: 'thesis',
    title: 'AI dental diagnosis',
    year: '2024',
    blurb:
      'Bachelor thesis: an AI system diagnosing misaligned teeth from clinical imagery.',
    detail:
      'My bachelor thesis at Chalmers built an AI system that diagnoses misaligned teeth from clinical imagery — pairing real machine learning with a problem that has direct, human impact.',
    categories: ['code'],
    tags: ['AI / ML'],
    img: teethImg,
  },
  {
    id: 'cesa',
    title: 'CESA × Star for Life',
    year: '2023–24',
    blurb:
      'Core volunteer bringing tech access to South African schools — funding, logistics, on-site setup.',
    detail:
      'Core volunteer in a Chalmers initiative bringing tech access to South African schools — from raising the funding and planning the logistics to being on site setting everything up.',
    categories: ['impact'],
    img: cesaImg,
  },
  {
    id: 'velra',
    title: 'Velra',
    year: '2025–now',
    blurb:
      'Founding an energy-market startup through my master’s — currently proving real market need.',
    detail:
      'Velra is the company I’m founding through my entrepreneurship master’s — a Chalmers × Lund venture aimed at the energy market. The current phase is validation: pressure-testing the model and proving there’s genuine market need before building further.',
    categories: ['business'],
  },
  {
    id: 'dia-aid',
    title: 'Dia Aid analysis',
    year: '2025',
    blurb:
      'A full business analysis for the startup Dia Aid — mapping their market and model.',
    detail:
      'A full business analysis for the startup Dia Aid, done as a 7.5 hp course project — mapping their market, model and the strategic options on the table.',
    categories: ['business'],
  },
  {
    id: 'events-pr',
    title: 'Student events PR',
    year: '2022',
    blurb:
      'PR lead for major student events — posters and social campaigns in Figma, Photoshop, Illustrator.',
    detail:
      'PR lead for major student events at Chalmers — posters, visual identities and social campaigns built in Figma, Photoshop and Illustrator.',
    categories: ['design'],
    tags: ['Figma', 'Photoshop', 'Illustrator'],
  },
  {
    id: 'egoi',
    title: 'EGOI qualifier',
    year: '2021',
    blurb:
      'Qualified for the European Girls’ Olympiad in Informatics.',
    detail:
      'Qualified for the European Girls’ Olympiad in Informatics — competitive programming at the national level, back where the code habit got serious.',
    categories: ['code'],
  },
  {
    id: 'ericsson',
    title: 'Ericsson',
    year: '2021',
    blurb:
      'IT technician internship — hardware and server-room operations in an enterprise environment.',
    detail:
      'A summer as IT technician at Ericsson — my first time inside a large enterprise tech organisation. Hands-on with hardware and server-room operations, learning how production infrastructure is run at scale.',
    categories: ['code'],
  },
]
