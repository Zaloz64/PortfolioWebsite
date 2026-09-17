import cesaImg from '../assets/Cesa assets/cesa.jpg'
import teethImg from '../assets/teeth.jpg'
import lexImg from '../assets/lexenergy.jpg'
import FPIcon from '../assets/FlowerPowerAppAssets/flowerPowerIcon.png'
import egoiImg from '../assets/egoiAssets/MedalEgoi.jpg'

// Everything in one place: the work grid renders all of it, the filter
// narrows by category. Items can belong to several categories.
export const WORK_CATEGORIES = [
  { id: 'apps', label: 'Apps' },
  { id: 'code', label: 'Code & AI' },
  { id: 'design', label: 'Design' },
  { id: 'business', label: 'Business' },
  { id: 'impact', label: 'Impact' },
  // { id: 'Hardware', label: 'Hardware' },
] as const

export type WorkCategory = (typeof WORK_CATEGORIES)[number]['id']

export type WorkItem = {
  id: string
  title: string
  year: string
  blurb: string
  detail: string
  // one-line result/credibility signal shown under the blurb on the tile
  outcome?: string
  categories: readonly WorkCategory[]
  tags?: readonly string[]
  img?: string
  icon?: 'flower' | 'rings'
  // let the detail-page title wrap to two rows instead of shrinking to one line
  wrapTitle?: boolean
  // tile size in the bento grid: default = small (span 2, 3/row),
  // featured = long (span 3, 2/row), big = span 4 (pairs with one small)
  featured?: boolean
  big?: boolean
  // --- detail-page extras (all optional) ---
  // my role on the project, shown in the meta strip
  role?: string
  // short bulleted takeaways shown under the overview
  highlights?: readonly string[]
  // outbound link (live site, App Store, repo…) shown as a button
  link?: { label: string; href: string }
  // extra product/process shots shown in the detail-view gallery
  gallery?: readonly string[]

  

}

export const WORK: readonly WorkItem[] = [
{
  id: 'velra',
  title: 'Velra',
  year: 'Now',
  blurb:
    'An energy market venture, done through my entrepreneurship master’s and backed by Chalmers and Lund ventures.',
  detail:
    'Velra is an early exploration into the energy market.\n\nThis is done through my venture and is backed by Chalmers and Lund ventures. A website for the project is to come. If you know someone we should meet, or somewhere we should be, please reach out.',
  outcome: 'Business developer',
  categories: ['business'],
  tags: ['Energy', 'Deeptech', 'Validation'],
  featured: true,
  role: 'Business developer',
  highlights: [
    'Deeptech in the energy market',
    'Early stage, follow the build',
  ],
},
{
  id: 'digital-friction',
  title: 'Digital Friction',
  year: '2025',
  blurb:
    'Turns your phone into a dumb phone. App access stays blocked until you finish what you said you would do.',
  detail:
    'Digital Friction turns your phone into a dumb phone. App access stays blocked until you finish what you said you would do.\n\nFrictionless is the problem. Most apps are built to be as easy to open as possible. This one puts the friction back where it belongs.\n\nMore information to come soon on the App Store.',
  outcome: 'Designed and built solo · on the App Store',
  categories: ['apps', 'design', 'code'],
  tags: ['iOS', 'Product design', 'Indie app'],
  role: 'Designer and developer',
  highlights: [
    'Turns your phone into a dumb phone',
    'Apps stay blocked until you finish your task',
    'Frictionless is the problem',
  ],
},
{
  id: 'flower-power',
  title: 'Flower Power',
  year: 'Soon',
  blurb:
    'A simple plant care app I built because I kept forgetting to water my own plants.',
  detail:
    'Flower Power is a small plant care app I designed and built from scratch because I kept forgetting, or putting off, watering my own plants.\n\nThe icon is inspired by Ferdinand, the gentle bull who just wanted to smell flowers. I wanted the app to have that same calm, friendly and playful feeling.\n\nThe app helps you keep track of the plants you actually own and reminds you when they need care. I wanted it to feel useful and fair, not like another app that locks basic features behind a subscription.\n\nThe core functionality will stay free. If someone likes the app and wants to support me as an indie developer, they can leave a tip. I may add a small subscription later for features that create real costs, like AI care tips, cloud sync, shared households or humidity sensor support.\n\nI built this because I wanted the app myself and could not find one that felt simple enough.',
  outcome: 'Designed and built solo · core features free',
  categories: ['apps', 'design', 'code'],
  tags: ['iOS', 'Product design', 'Indie app', 'React Native'],
  img: FPIcon,
  icon: 'flower',
  featured: true,
  role: 'Designer and developer',
  highlights: [
    'Built because I kept killing my own plants',
    'Care reminders for the plants you actually own',
    'Core features free with optional tips',
  ],
},
// Focus Lilio — hidden for now
// {
//   id: 'focus-lilio',
//   title: 'Focus Lilio',
//   year: 'Soon',
//   ...
// },
{
  id: 'lexenergy',
  title: 'LexEnergy',
  year: '2024 to 2025',
  blurb:
    'Frontend for a battery-backed EV charging network that helps chargers work in places where normal grid capacity can be limited.',
  detail:
    'LexEnergy builds EV charging stations with batteries that support the grid, making it possible to place chargers in more locations. I was the sole frontend owner for the customer-facing charging interface. I designed the full UI and user flow in Figma, then built it with React.\n\nThe interface was used by EV drivers to start a charge, follow the session, handle payment and get support. It supported Swedish and English, and connected to our own API, a pricing API and an external payment partner.\n\nThe hardest part was designing around real charging edge cases. Different cars behaved differently, requirements changed often, and the flow still had to feel simple for someone standing at a charger.\n\nWhen I left, the product was live at three stations. What I am most proud of is owning the whole frontend from design to production on a tight deadline.',
  outcome: 'Sole frontend owner · React, Vite and TypeScript',
  categories: ['code', 'design'],
  tags: ['React', 'TypeScript', 'Vite', 'Figma'],
  img: lexImg,
  featured: true,
  role: 'Sole frontend developer',
  highlights: [
    'Owned the frontend from Figma to production',
    'Built the charging flow for drivers',
    'Designed around real EV charging edge cases',
    'Live at three stations',
  ],
},
{
  id: 'thesis',
  title: 'AI dental diagnosis',
  year: '2024',
  blurb:
    'Bachelor thesis: an AI system diagnosing misaligned teeth from clinical imagery.',
  detail:
    'My bachelor thesis at Chalmers studied whether teeth misalignment could be diagnosed from ordinary clinical photos, judged against Swedish treatment guidelines. Not every misalignment is severe enough to need treatment, so the goal was not just to detect teeth, but to understand whether the case looked clinically relevant.\n\nAt the time, most research leaned on MRI scans. We could not find anything published before we started our thesis who had tried the same kind of diagnosis with a normal camera, so that becoame our reaserch question, was it pluasble.\n\nWe built and compared three CNNs: YOLOv8, VGG19 and ResNet50. YOLOv8 came out on top with 90% accuracy and 94% sensitivity. All three reached the accuracy level an orthodontist had asked for, which was the main thing we set out to test.\n\nTo compare the models with real clinical judgment, a practicing orthodontist evaluated each model’s output and graded how difficult each image was to diagnose. Interestingly, the cases the specialist found difficult did not reliably match the cases where the models struggled, which showed how differently they read the same problem.\n\nThe preprocessing is the part I would revisit. Grayscaling looked like it hurt performance at first, but that turned out to be undertraining, not a real result. Those runs only got 10 epochs and were still improving, while the normal-data models had already settled. When we retrained ResNet50 on the grayscaled set for longer, it reached 96%. So the preprocessing was not bad, we just had not trained it long enough.',
  outcome: 'Bachelor thesis · Chalmers',
  categories: ['code'],
  tags: ['AI / ML', 'Computer vision', 'Python', 'PyTorch'],
  img: teethImg,
  role: 'Researcher and developer',
  highlights: [
    'Diagnosed teeth misalignment from clinical imagery',
    'Compared YOLOv8, VGG19 and ResNet50',
    'Bachelor thesis at Chalmers',
  ],
},
  {
  id: 'cesa',
  title: 'Bridging the Digital Education Gap',
  year: '2023 to 2024',
  blurb:
    'Vice Chairman of a Chalmers initiative bringing computers and offline learning tools to schools in KwaZulu-Natal, South Africa.',
  detail:
    'CESA, Computer Education in Southern Africa, is a Chalmers student-run project that sends donated computers to rural schools in South Africa. I was Vice Chairman in 2023 to 2024, working with fundraising, logistics and travelling to KwaZulu-Natal with the team to help set everything up on site. We worked together with Star for Life, who support the schools year round and guided us on the ground.\n\nEach computer was prepared with Ubuntu and offline learning programs before being shipped. Once we arrived, the work became more practical: troubleshooting, maintenance, setup and helping with whatever the schools needed.\n\nWhat stayed with me was how much 15 computers could mean. For the schools, it was not just hardware. It was a way to teach computer education properly and give students a better chance in a world where basic digital skills are expected. Some students reach university on scholarships having barely used a keyboard or mouse before, but are still expected to write assignments and use digital systems from day one. That gap can become the difference between keeping an opportunity and losing it.\n\nSeeing the computers arrive caught me off guard. The joy was completely open. I had never been in a room where something I take for granted meant that much to someone else. If you want to support the project, you can donate computers or money by contacting the new board at cesaproject.com.',
  outcome: 'Funded, planned and set up on site',
  categories: ['impact', 'business'],
  img: cesaImg,
  wrapTitle: true,
  role: 'Vice Chairman',
  highlights: [
    'Raised funding and planned logistics',
    'Helped set up computers on site in KwaZulu-Natal',
    'Supported digital access in rural South African schools',
  ],
  link: { label: 'Visit cesaproject.com', href: 'https://cesaproject.com' },
},
  // {
  //   id: 'velra',
  //   title: 'Velra',
  //   year: '2025–now',
  //   blurb:
  //     'Founding an energy-market startup through my master’s — currently proving real market need.',
  //   detail:
  //     'Velra is the company I’m founding through my entrepreneurship master’s — a Chalmers × Lund venture aimed at the energy market. The current phase is validation: pressure-testing the model and proving there’s genuine market need before building further.',
  //   categories: ['business'],
  //   role: 'Co-founder',
  // },
//   {
//     id: 'dia-aid',
//     title: 'Dia Aid analysis',
//     year: '2025',
//     blurb:
//       'A full business analysis for the startup Dia Aid, mapping their market and model.',
//     detail:
//       'A full business analysis for the startup Dia Aid, done as a 7.5 hp course project — mapping their market, model and the strategic options on the table.',
//     categories: ['business'],
//     role: 'Business analyst',
//   },
//   {
//     id: 'events-pr',
//     title: 'PR Manager',
//     year: '2022',
//     blurb:
//       'PR Manager for major student events, making posters and social campaigns using Figma, Photoshop, Illustrator.',
//     detail:
//       'We where a team of 8 people orginising and hosting dinners (sittningar) and club events. My responsibility was the PR and graphics for each event, meaning posters, social media posts, song books, menus and drink tickets. The events was at chalmers with around 50 to 300 participants, everytime with a specific theme. I also created the visual identity of our year, and everything was cerated using Figma, Photoshop and Illustrator. \n\n The themes we had was ...',
//     categories: ['design'],
//     tags: ['Figma', 'Photoshop', 'Illustrator'],
//     role: 'PR lead',
//   },
{
  id: 'egoi',
  title: 'EGOI',
  year: '2021',
  blurb:
    'Qualified nationally for the European Girls’ Olympiad in Informatics.',
  detail:
    'I competed in the national qualification rounds for the European Girls’ Olympiad in Informatics and placed in the top three, which earned me a spot at EGOI.\n\nIt was my first real experience with competitive programming and gave me a much deeper interest in algorithms, data structures and solving problems under pressure.\n\nThat experience was one of the reasons I later chose Computer Science: Algorithms, Languages and Logic, MPALG, as my first master’s at Chalmers. I studied it for a year before switching to Entrepreneurship and Business Design, but I still really value that year and the way it shaped how I think about code and problem solving.',
  categories: ['code'],
  tags: ['Competitive programming', 'Algorithms'],
  img: egoiImg,
  role: 'Competitor',
},
  // {
  //   id: 'ericsson',
  //   title: 'Ericsson',
  //   year: '2021',
  //   blurb:
  //     'IT summer technician internship: Hardware and server room operations in an enterprise environment.',
  //   detail:
  //     'A summer as IT technician at Ericsson, which was my first time inside a large enterprise tech organisation. I worked hands on with hardware and server-room operations, setting up and removing servers.', 
  //   categories: ['Hardware'],
  //   role: 'IT technician intern',
  // },
]
