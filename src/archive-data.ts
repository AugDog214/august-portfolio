import { brandIdentityItems, projectItems, type Project } from './content'

/**
 * The Archive: every project, client work first.
 *
 * The six Selected Work projects come straight from `projectItems` and the logo
 * projects reuse the copy and images in `brandIdentityItems`, so nothing is
 * written twice. Everything else was tightened from August's own write-ups on
 * his old portfolio (riff-graphics.myportfolio.com). No facts or numbers were
 * added; where the old site had no write-up there is a one-line placeholder
 * marked TODO for August to rewrite.
 */

export type ArchiveKind = 'Client' | 'Personal' | 'Student'
export const archiveDisciplines = ['Brand identity', 'Print + signage', 'Film + photo', 'Packaging + illustration'] as const
export type ArchiveDiscipline = (typeof archiveDisciplines)[number]

export type ArchiveProject = Project & {
  slug: string
  kind: ArchiveKind
  discipline: readonly ArchiveDiscipline[]
  /** 4:5 card image (8:5 when `wide`) */
  card: string
  /** wide card, used for the video projects */
  wide?: boolean
}

const A = 'media/archive'
const card = (slug: string) => `${A}/${slug}/card.webp`

const selected = (name: string) => {
  const item = projectItems.find((project) => project.name === name)
  if (!item) throw new Error(`Archive: no Selected Work project named "${name}"`)
  return item
}

/** A logo project from the Brand Identity showcase, in the Project shape. */
const fromBrand = (name: string, extra: Pick<Project, 'role' | 'client' | 'tools' | 'accent'> & Partial<Project>): Project => {
  const item = brandIdentityItems.find((brand) => brand.name === name)
  if (!item || item.media.kind !== 'image') throw new Error(`Archive: no Brand Identity piece named "${name}"`)
  return {
    name: item.name,
    tag: item.tag,
    blurb: item.description,
    year: item.pillar.split('·').pop()?.trim() ?? '',
    cover: { kind: 'image', src: item.media.src, caption: item.media.alt },
    gallery: [],
    caseStudy: [{ label: 'Scope', body: `${item.built}. ${item.description}` }],
    ...extra,
  }
}

export const archiveIntro = {
  kicker: 'Archive',
  headline: 'Client and production work, 2019 to now.',
  lead: 'Paid client work comes first. Personal and student projects sit behind it and are labelled as what they are.',
}

export const archiveProjects: ArchiveProject[] = [
  // ---------------------------------------------------------------- Client
  { ...selected('Signage'), slug: 'signage', kind: 'Client', discipline: ['Print + signage'], card: card('signage'), wide: true },
  { ...selected('Gap City Media'), slug: 'gap-city-media', kind: 'Client', discipline: ['Film + photo', 'Brand identity'], card: card('gap-city-media'), wide: true },
  { ...selected('Kebabz Heaven: Menu'), slug: 'kebabz-heaven', kind: 'Client', discipline: ['Print + signage'], card: card('kebabz-heaven') },
  {
    ...fromBrand('Novare', { role: 'Logo Designer', client: 'Novare — Naples, FL', tools: [], accent: '#2a4bd0' }),
    slug: 'novare',
    kind: 'Client',
    discipline: ['Brand identity'],
    card: card('novare'),
  },
  {
    ...fromBrand("Mango's Habanero Hot Sauce", { role: 'Label Designer / Illustrator', client: "Mango's Photo Booth", tools: ['illustrator'], accent: '#d99a1c' }),
    slug: 'mangos-hot-sauce',
    kind: 'Client',
    discipline: ['Packaging + illustration'],
    card: card('mangos-hot-sauce'),
  },
  {
    ...fromBrand("River's Edge Cottage", { role: 'Logo Designer', client: "River's Edge Cottage", tools: [], accent: '#3f7a56' }),
    slug: 'rivers-edge-cottage',
    kind: 'Client',
    discipline: ['Brand identity'],
    card: card('rivers-edge-cottage'),
  },
  {
    ...fromBrand('Forage St.', { role: 'Logo Designer', client: 'Forage St.', tools: [], accent: '#7a8a3c' }),
    slug: 'forage-st',
    kind: 'Client',
    discipline: ['Brand identity'],
    card: card('forage-st'),
  },
  {
    ...fromBrand('Novi', { role: 'Logo Designer', client: 'Novi', tools: [], accent: '#2f8a4a' }),
    slug: 'novi',
    kind: 'Client',
    discipline: ['Brand identity'],
    card: card('novi'),
  },
  {
    ...fromBrand('NvR Nine', { role: 'Logo Designer', client: 'NvR Nine — TenKey', tools: [], accent: '#b03a3a' }),
    slug: 'nvr-nine',
    kind: 'Client',
    discipline: ['Brand identity'],
    card: card('nvr-nine'),
    tag: 'Clothing Brand Logo',
    blurb: 'A monogram and wordmark for NvR Nine, a clothing brand started by Kentucky rapper TenKey for his growing fan base.',
    cover: { kind: 'image', src: `${A}/nvr-nine/logo-dark.webp`, caption: 'NvR Nine logo, reversed on black.' },
    slides: [
      { kind: 'image', src: `${A}/nvr-nine/logo-dark.webp` },
      { kind: 'image', src: `${A}/nvr-nine/logo-light.webp` },
    ],
    gallery: [
      { kind: 'image', src: `${A}/nvr-nine/logo-light.webp`, caption: 'Logo on white.' },
      { kind: 'image', src: `${A}/nvr-nine/logo-sheet.webp`, caption: 'Logo sheet: how the mark is built, alternates, reversed versions, and type.' },
      { kind: 'image', src: `${A}/nvr-nine/sketches.webp`, caption: 'Pencil sketches on grid paper.' },
      { kind: 'image', src: `${A}/nvr-nine/hoodie-gold.webp`, caption: 'Mark on a gold hoodie.' },
      { kind: 'image', src: `${A}/nvr-nine/hoodie-red.webp`, caption: 'Mark on a red hoodie.' },
    ],
    caseStudy: [
      {
        label: 'Context',
        body: 'NvR Nine is a clothing brand started by a client of mine, TenKey, who is known locally in Kentucky for his rap. His fan base was growing and the brand was the next step.',
      },
      {
        label: 'Process',
        body: 'TenKey came in with a basic idea to work from. The hard part was the typeface: it had to speak to his personality and his style of rap. We tried and combined different fonts until we landed on Mortal Kombat.',
      },
    ],
  },
  {
    name: 'The Wok',
    slug: 'the-wok',
    kind: 'Client',
    discipline: ['Print + signage'],
    card: card('the-wok'),
    tag: 'Restaurant Flyer / Advertising',
    blurb: 'Campus flyers for The Wok Asian Café. My boss credited them with a 15% rise in customers that semester.',
    role: 'Flyer Designer',
    year: '2022',
    client: 'The Wok Asian Café — Lexington, KY',
    tools: [],
    accent: '#b3261e',
    cover: { kind: 'image', src: `${A}/the-wok/flyer.webp`, caption: 'The Wok campus flyer.' },
    gallery: [],
    caseStudy: [
      {
        label: 'Context',
        body: 'I was working as a line cook at The Wok, an Asian restaurant near the university. I saw a chance to help beyond the kitchen: more presence on campus.',
      },
      {
        label: 'Approach',
        body: 'I designed flyers built around the food itself and posted them around campus, where a wider audience would see them.',
      },
      {
        label: 'Outcome',
        body: 'My boss noted a 15% increase in customers that semester.',
      },
    ],
  },
  {
    name: 'Lance-Scapes',
    slug: 'lance-scapes',
    kind: 'Client',
    discipline: ['Print + signage', 'Brand identity'],
    card: card('lance-scapes'),
    tag: 'Business Card',
    blurb: 'A business card for a small local landscaping and lawn maintenance service, built on an off-white, blue-green, and green palette.',
    role: 'Business Card Designer',
    year: '2022',
    client: 'Lance-Scapes Landscaping & Design',
    tools: [],
    accent: '#3d6b4f',
    cover: { kind: 'image', src: `${A}/lance-scapes/card-mockup.webp`, caption: 'Business card mockup.' },
    gallery: [
      { kind: 'image', src: `${A}/lance-scapes/card-front.webp`, caption: 'Card front.' },
      { kind: 'image', src: `${A}/lance-scapes/card-back.webp`, caption: 'Card back. Contact details shown are not the client’s real information.' },
    ],
    caseStudy: [
      {
        label: 'Brief',
        body: 'Lance-Scapes is a small landscaping business. The goal was a card that shows the character of the work and the person behind it.',
      },
      {
        label: 'Color',
        body: 'An off-white cream adds warmth, a dark blue-green reads as trustworthy, and the green carries the passion for the craft. Together they feel professional and reliable.',
      },
      {
        label: 'Type',
        body: 'The typeface had to balance simplicity with a personal touch. I studied similar business cards for reference, then refined the choice until it was readable and still felt individual.',
      },
    ],
  },
  {
    name: 'Nissan Z Posters',
    slug: 'nissan-z-posters',
    kind: 'Client',
    discipline: ['Print + signage'],
    card: card('nissan-z-posters'),
    tag: 'Poster Design',
    blurb: 'Two car posters, a 370Z and a 350Z, made with Josh Barr in Fort Myers. The look comes from the color grade and textures I photographed myself.',
    role: 'Poster Designer',
    year: '2024',
    client: 'Josh Barr — Fort Myers, FL',
    tools: [],
    accent: '#5b6fd6',
    cover: { kind: 'image', src: `${A}/nissan-z-posters/370z.webp`, caption: 'Nissan 370Z poster.' },
    slides: [
      { kind: 'image', src: `${A}/nissan-z-posters/370z.webp` },
      { kind: 'image', src: `${A}/nissan-z-posters/350z.webp` },
    ],
    gallery: [{ kind: 'image', src: `${A}/nissan-z-posters/350z.webp`, caption: '350Z poster.' }],
    caseStudy: [
      {
        label: 'Context',
        body: 'I made these with Josh Barr, a chef working in Fort Myers, Florida. Instagram was where I found my inspiration.',
      },
      {
        label: 'Look',
        body: 'The most important part was finding the right color grade. My favorite part is the texture: I went looking around me for something rough but subtle, crumpled up some graph paper and photographed it, and used a small piece of melted metal that had dropped into an organic spatter shape.',
      },
    ],
  },
  {
    name: 'The Devil Might',
    slug: 'the-devil-might',
    kind: 'Client',
    discipline: ['Print + signage'],
    card: card('the-devil-might'),
    tag: 'Single Cover Art',
    blurb: 'Cover art for a single, made closely with the artist to her direction.',
    role: 'Cover Designer',
    year: '2024',
    client: 'Recording artist',
    tools: [],
    accent: '#d58a98',
    cover: { kind: 'image', src: `${A}/the-devil-might/cover.webp`, caption: 'The Devil Might, single cover.' },
    gallery: [],
    caseStudy: [
      {
        label: 'Process',
        body: 'My client and I worked through this together. I tried to capture what she wanted while representing her voice. She came with specific instructions that limited some of the creative choices, and that was not a bad thing.',
      },
    ],
  },
  {
    name: "Tico's World",
    slug: 'ticos-world',
    kind: 'Client',
    discipline: ['Film + photo'],
    card: card('ticos-world'),
    tag: 'Motorcycle Photography / Video',
    blurb: 'Rolling shots of a rider on the bike he built himself, taken from the bed of a moving truck.',
    role: 'Photographer / Videographer',
    year: '2023',
    client: "Tico's World",
    tools: [],
    accent: '#c96a4a',
    cover: { kind: 'image', src: `${A}/ticos-world/photo-6.webp`, caption: 'Rolling shot at sunset.' },
    slides: [
      { kind: 'image', src: `${A}/ticos-world/photo-6.webp` },
      { kind: 'image', src: `${A}/ticos-world/photo-4.webp` },
      { kind: 'image', src: `${A}/ticos-world/photo-1.webp` },
    ],
    gallery: [
      { kind: 'image', src: `${A}/ticos-world/photo-7.webp`, caption: 'Rolling shot at sunset, second frame.' },
      { kind: 'image', src: `${A}/ticos-world/photo-4.webp`, caption: 'Roller, side on.' },
      { kind: 'image', src: `${A}/ticos-world/photo-5.webp`, caption: 'Roller, side on, second frame.' },
      { kind: 'image', src: `${A}/ticos-world/photo-3.webp`, caption: 'Head on.' },
      { kind: 'image', src: `${A}/ticos-world/photo-1.webp`, caption: 'Portrait on the bike.' },
      { kind: 'image', src: `${A}/ticos-world/photo-2.webp`, caption: 'Profile.' },
    ],
    caseStudy: [
      {
        label: 'Shoot',
        body: 'This client wanted to be filmed on the bike he built himself. To get the shots I was after, I sat in the bed of my buddy’s truck. It was as scary as it was fun, and it taught me a lot about capturing fast-moving subjects.',
      },
      {
        label: 'Edit',
        body: 'The video edit was inspired by Fonzal and the McGloughlin Brothers, and I cut it to follow the Radiohead / Kendrick reel trend. What drew me in was the way many photos fixed on one point create a flash-like animation.',
      },
      {
        // TODO(August): no write-up existed for the photo set itself
        label: 'Photos',
        body: 'Photos taken of the client during the shoot.',
      },
    ],
  },
  // -------------------------------------------------------------- Personal
  { ...selected("Astro Fool's Hopper"), slug: 'astro-fools-hopper', kind: 'Personal', discipline: ['Film + photo', 'Packaging + illustration'], card: card('astro-fools-hopper'), wide: true },
  { ...selected('Rage Energy Drink'), slug: 'rage-energy-drink', kind: 'Personal', discipline: ['Packaging + illustration'], card: card('rage-energy-drink') },
  { ...selected('Art Posters'), slug: 'art-posters', kind: 'Personal', discipline: ['Print + signage'], card: card('art-posters') },
  {
    name: 'Floyd Land',
    slug: 'floyd-land',
    kind: 'Personal',
    discipline: ['Print + signage'],
    card: card('floyd-land'),
    tag: 'Photoshop Collage',
    blurb: 'A fantasy landscape built entirely from Pink Floyd references. One of my first photo collages, and it hangs on my wall at home.',
    role: 'Designer',
    year: '2023',
    client: 'Personal work',
    tools: ['photoshop'],
    accent: '#7a4bd0',
    cover: { kind: 'image', src: `${A}/floyd-land/floyd-land.webp`, caption: 'Floyd Land.' },
    gallery: [{ kind: 'image', src: `${A}/floyd-land/floyd-land-alt.webp`, caption: 'Floyd Land, second version.' }],
    caseStudy: [
      {
        label: 'Idea',
        body: 'Pink Floyd is my all-time favorite band. I had seen a poster that combined Pink Floyd, Led Zeppelin, and the Beatles, and I wanted to make a fantasy world out of Pink Floyd alone, with a touch of realism.',
      },
      {
        label: 'Process',
        body: 'This was one of my earliest ventures into photo collage and photo bashing. In Photoshop I cut out each object by hand and worked on the lighting so the pieces felt like they belonged in one scene. It was challenging, but with good references it came together.',
      },
    ],
  },
  // --------------------------------------------------------------- Student
  {
    ...fromBrand('Solar Home Kentucky', { role: 'Logo / Brand Designer', client: 'School project', tools: [], accent: '#e29a2e' }),
    slug: 'solar-home-kentucky',
    kind: 'Student',
    discipline: ['Brand identity'],
    card: card('solar-home-kentucky'),
    gallery: [
      { kind: 'image', src: `${A}/solar-home-kentucky/business-cards.webp`, caption: 'Business cards.' },
      { kind: 'image', src: `${A}/solar-home-kentucky/alternates.webp`, caption: 'Alternate logo directions.' },
      { kind: 'image', src: `${A}/solar-home-kentucky/tube-mockup.webp`, caption: 'Logo on a mailing tube.' },
      { kind: 'image', src: `${A}/solar-home-kentucky/moodboard.webp`, caption: 'Moodboard.' },
    ],
    caseStudy: [
      {
        label: 'Brief',
        body: 'A school project: a logo and layout for a fictitious company my professor came up with, a solar home installation and maintenance business in Louisville, Kentucky. The logo had to be conceptual, with fonts and colors chosen for the audience, and the layout had to read as professional.',
      },
      {
        label: 'Process',
        body: 'When I hit a creative block I explored around 100 ideas, branching out from five core variations. The layout took about 60 iterations.',
      },
      {
        label: 'Takeaway',
        body: 'When I got stuck again, what worked was stepping back: a change of scenery and some physical activity. I came back with a fresh view and finished it.',
      },
    ],
  },
  {
    ...fromBrand("Pirraglia's", { role: 'Logo / Brand Designer', client: 'School project', tools: [], accent: '#c9a03c' }),
    slug: 'pirraglias',
    kind: 'Student',
    discipline: ['Brand identity'],
    card: card('pirraglias'),
  },
  {
    name: 'Food Photography',
    slug: 'food-photography',
    kind: 'Student',
    discipline: ['Film + photo'],
    card: card('food-photography'),
    tag: 'Photography',
    blurb: 'A school project on my family’s tradition of homemade ravioli, plated and shot with the principles of design in mind.',
    role: 'Photographer / Food Stylist',
    year: '2023',
    client: 'School project',
    tools: [],
    accent: '#b5402f',
    cover: { kind: 'image', src: `${A}/food-photography/ravioli-1.webp`, caption: 'Homemade ravioli.' },
    slides: [
      { kind: 'image', src: `${A}/food-photography/ravioli-1.webp` },
      { kind: 'image', src: `${A}/food-photography/plate-1.webp` },
    ],
    gallery: [
      { kind: 'image', src: `${A}/food-photography/plate-1.webp`, caption: 'Plated, with the marinara shaped on the plate.' },
      { kind: 'image', src: `${A}/food-photography/ravioli-2.webp`, caption: 'Homemade ravioli, second frame.' },
      { kind: 'image', src: `${A}/food-photography/plate-2.webp`, caption: 'Plated, angled.' },
    ],
    caseStudy: [
      {
        label: 'Idea',
        body: 'I am of Italian descent, and making ravioli by hand is a family tradition. I used a school project to show it. Working at a 4.5-star Italian restaurant had already sharpened my cooking and my sense of how a dish should be presented.',
      },
      {
        label: 'Composition',
        body: 'I planned the layout of every organic object so each element supported the whole frame. The marinara was shaped deliberately on the plate to add an artistic touch.',
      },
      {
        // TODO(August): camera, lighting, and class details were not in the old write-up
        label: 'Details',
        body: 'Four frames from the shoot.',
      },
    ],
  },
]

export const archiveNumber = (index: number) => String(index + 1).padStart(2, '0')
export const projectHref = (slug: string) => `./project.html?p=${slug}`
