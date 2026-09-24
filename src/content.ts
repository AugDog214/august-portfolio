export const siteMeta = {
  name: 'August Pirraglia',
  role: 'Creative Director',
  email: 'apirr47@gmail.com',
  siteUrl: 'https://augdog214.github.io/august-portfolio/',
  ogImage: 'social/august-portfolio-social.jpg',
  description:
    'Portfolio of August Pirraglia, a Fort Myers creative director and graphic designer working across brand identity, signage and print production, packaging, AI film advertising, and shipped software.',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/august-pirraglia-56bb52261' },
    { label: 'Instagram', href: 'https://www.instagram.com/riffgraphics214/' },
  ],
  resumeLink: 'resume/august-pirraglia-resume.pdf',
} as const

export const astroSequence = {
  poster: 'media/astro-fools-hopper/poster.webp',
  framePath: 'media/astro-fools-hopper/frames/frame-',
  frameCount: 188,
} as const

export const projectToolMap = {
  illustrator: {
    label: 'Adobe Illustrator',
    icon: 'tool-icons/illustrator.svg',
  },
  photoshop: {
    label: 'Adobe Photoshop',
    icon: 'tool-icons/photoshop.svg',
  },
  indesign: {
    label: 'Adobe InDesign',
    icon: 'tool-icons/indesign.svg',
  },
  premiere: {
    label: 'Adobe Premiere Pro',
    icon: 'tool-icons/premiere-pro.svg',
  },
  afterEffects: {
    label: 'Adobe After Effects',
    icon: 'tool-icons/after-effects.svg',
  },
  figma: {
    label: 'Figma',
    icon: 'tool-icons/figma.svg',
  },
  blender: {
    label: 'Blender',
    icon: 'tool-icons/blender.svg',
  },
} as const

export type ProjectToolKey = keyof typeof projectToolMap

/** Media shown in the carousel frame or the View Project viewer. */
export type ProjectMedia = {
  kind: 'video' | 'image'
  src: string
  poster?: string
  pan?: boolean
  /** short caption shown under the panel in the viewer */
  caption?: string
}

/** One labelled block of the case study (Context / Challenge / Approach / Outcome...). */
export type CaseStudySection = { label: string; body: string }

export type Project = {
  name: string
  tag: string
  /** 1–2 sentences for the frosted brief panel */
  blurb: string
  role: string
  year: string
  client: string
  tools: ProjectToolKey[]
  accent: string
  cover: ProjectMedia
  /** optional images that cycle inside the frame instead of a single cover */
  slides?: ProjectMedia[]
  gallery: ProjectMedia[]
  /**
   * Case study copy for the View Project viewer.
   * Written from August's original project write-ups (riff-graphics.myportfolio.com),
   * tightened for this site. Sections render in order; media interleaves between them.
   */
  caseStudy: CaseStudySection[]
}

const projectItems: Project[] = [
  {
    name: 'Signage',
    tag: 'Environmental / Large Format',
    blurb:
      'Exterior identity, monument signs, and wayfinding for Southwest Florida businesses — designed to read at street speed and produced print-ready.',
    role: 'Lead Graphic Designer / Production Specialist',
    year: '2025 — 2026',
    client: 'FASTSIGNS of Naples',
    tools: ['illustrator', 'photoshop'],
    accent: '#2f5f8f',
    cover: {
      kind: 'video',
      src: 'media/projects/signage/cover.mp4',
      poster: 'media/projects/signage/poster.webp',
      caption: 'Twin Dragon Games — illuminated exterior channel letters.',
    },
    gallery: [
      { kind: 'image', src: 'media/projects/signage/belamo.webp', caption: 'Belamo Patio Furniture — monument sign mockup on site, 48 × 36 in.' },
      { kind: 'image', src: 'media/projects/signage/wayfinding.webp', caption: 'Directional wayfinding — post-and-panel system for a public campus.' },
    ],
    caseStudy: [
      {
        label: 'Context',
        body: 'As Lead Graphic Designer and Production Specialist at FASTSIGNS of Naples, I take brands from a logo file to aluminum, acrylic, and vinyl — exterior identity, monument signs, and directional wayfinding for businesses across Southwest Florida.',
      },
      {
        label: 'Approach',
        body: 'Every sign starts as a legibility problem: viewing distance, speed, light, and the building it has to live on. I mock pieces up to scale on real site photography so the client signs off on what the street will actually see, then build the production files that go straight to fabrication.',
      },
      {
        label: 'Outcome',
        body: 'Work that ships at architectural scale — including a signage package that closed at $39K.',
      },
    ],
  },
  {
    name: "Astro Fool's Hopper",
    tag: 'AI Film / Packaging Illustration',
    blurb:
      'A space-jester IPA brand that started as packaging illustration and grew into an AI-directed product film — character, world, and edit rhythm authored as one system.',
    role: 'Creative Director / Illustrator / AI Film Art Direction',
    year: '2023 — 2026',
    client: 'Original brand concept',
    tools: ['photoshop', 'premiere', 'afterEffects'],
    accent: '#d8552f',
    cover: {
      kind: 'video',
      src: 'media/projects/astro/cover.mp4',
      poster: 'media/projects/astro/poster.webp',
      caption: 'Product film — four-scene montage.',
    },
    gallery: [{ kind: 'image', src: 'media/projects/astro/can.webp', caption: 'Hero can render — the original jester-astronaut illustration on pack.' }],
    caseStudy: [
      {
        label: 'Origin',
        body: 'Astro Fool’s Hopper began in my advanced digital drawing and illustration class as an IPA packaging project. Inspired by the Starship launches and a long fascination with astronauts, I pictured a witchcraft-inspired brewery — brewing gear, a giant pot, a touch of literal magic — run by space-suited jesters.',
      },
      {
        label: 'Character',
        body: 'To give the characters whimsy, I posed each one in a jester-like contrapposto stance so the gesture carries the personality. I used Midjourney as a reference board for what jester astronauts could look like, and ChatGPT to workshop names — “Astro Fool’s Hopper” landed because it captured the playful, cosmic tone of the characters and their brewery.',
      },
      {
        label: 'Film',
        body: 'The film takes the illustrated brand into motion: AI-assisted product worlds, art direction, and a four-scene edit, all directed toward a single look.',
      },
      {
        label: 'Takeaway',
        body: 'AI widened the exploration; the drawing, the design calls, and the final cut stayed mine. That balance is how I use these tools on every project.',
      },
    ],
  },
  {
    name: 'Gap City Media',
    tag: 'Brand / Social / Video',
    blurb:
      'Logo, channel branding, and short-form video for Gap City Media — a synthwave identity built to perform on feed.',
    role: 'Brand Designer / Video Editor',
    year: '2026',
    client: 'Gap City Media',
    tools: ['illustrator', 'photoshop', 'premiere', 'afterEffects'],
    accent: '#e0398f',
    cover: {
      kind: 'video',
      src: 'media/projects/gapcity/cover.mp4',
      poster: 'media/projects/gapcity/poster.webp',
      caption: 'Short-form promo for Faded Jays, a Gap City client in Naples, FL.',
    },
    gallery: [
      { kind: 'image', src: 'media/projects/gapcity/logo.webp', caption: 'Primary mark.' },
      { kind: 'image', src: 'media/projects/gapcity/banner.webp', pan: true, caption: 'Channel banner.' },
    ],
    caseStudy: [
      {
        label: 'Identity',
        body: 'A retro-synthwave mark — sunset stripes, palms, and a neon wordmark — built as a system, so the same pieces carry from a profile avatar to a full-width channel banner.',
      },
      {
        label: 'Video',
        body: 'Short-form edits for the channel and its clients, including promo spots for Faded Jays in Naples, FL — cut vertical, captioned, and paced to win the first second of the scroll.',
      },
    ],
  },
  {
    name: 'Kebabz Heaven: Menu',
    tag: 'Menu / Print Design',
    blurb:
      'Digital menu boards and a tri-fold menu for a family-run Mediterranean grill — appetite-first hierarchy, with the family’s keffiyeh pattern woven into the brand.',
    role: 'Menu Designer / Print Production',
    year: '2024',
    client: 'Kebabz Heaven Mediterranean Grill',
    tools: ['indesign', 'photoshop'],
    accent: '#c08a3c',
    cover: { kind: 'image', src: 'media/projects/kababz/menu-2.webp' },
    // both menu boards cycle in the frame; board 2 plays first
    slides: [
      { kind: 'image', src: 'media/projects/kababz/menu-2.webp' },
      { kind: 'image', src: 'media/projects/kababz/cover.webp' },
    ],
    gallery: [{ kind: 'image', src: 'media/projects/kababz/cover.webp', caption: 'Menu board — wraps, platters, vegetarian, soups and salads. Sized for mounted TV screens.' }],
    caseStudy: [
      {
        label: 'Context',
        body: 'Client work for Kebabz Heaven, a family-run Mediterranean grill. The family had a big say in the direction — the menu had to represent their brand identity exactly.',
      },
      {
        label: 'Process',
        body: 'I sketch as many ideas as come to mind, then narrow them to the three strongest mid- to high-fidelity roughs. Finding the look took a few rounds: the family wanted the keffiyeh pattern in the design to represent their culture’s patterns and art.',
      },
      {
        label: 'Execution',
        body: 'Layouts were built in InDesign with the food photography handled in Photoshop — full creative control while keeping a large menu organized. Deliverables included a tri-fold menu and 1080 × 1920 px boards for the restaurant’s mounted TV screens.',
      },
      {
        label: 'Takeaway',
        body: 'Working this closely with a client and their family sharpened how I present options and communicate decisions.',
      },
    ],
  },
  {
    name: 'Art Posters',
    tag: 'Poster Series / Motion',
    blurb:
      'Personal poster work — a motion poster for Starship’s fifth flight and collage pieces that pull art history into experimental layouts.',
    role: 'Graphic Designer / Motion Designer',
    year: '2024',
    client: 'Personal work',
    tools: ['photoshop', 'afterEffects'],
    accent: '#c2354a',
    cover: {
      kind: 'video',
      src: 'media/projects/posters/cover.mp4',
      poster: 'media/projects/posters/poster.webp',
      caption: 'Mission to Mars — motion poster.',
    },
    gallery: [{ kind: 'image', src: 'media/projects/posters/antidesign.webp', caption: 'AntiDesign — collage poster.' }],
    caseStudy: [
      {
        label: 'Mission to Mars',
        body: 'A motion poster made ahead of Starship’s fifth flight test: SpaceX launching the largest, most powerful rocket ever built, then attempting to catch its reusable booster with robotic arms — the first attempt of its kind.',
      },
      {
        label: 'Motion',
        body: 'I wanted the poster to feel like it’s launching without the ship ever moving. In After Effects I animated the type and ran the space scenes as a slideshow passing through, fixed on a single star.',
      },
      {
        label: 'Collage',
        body: 'The rest of the series is about finding a style that separates my work in a crowded field. I like to bring historical paintings into contemporary layouts — art history has always been my biggest influence.',
      },
    ],
  },
  {
    name: 'Rage Energy Drink',
    tag: 'Packaging / Illustration / 3D',
    blurb:
      'Packaging, logo, and character illustration for a snow-sport energy drink aimed at 16–30-year-old skiers and snowboarders — rendered in 3D.',
    role: 'Packaging Designer / Illustrator',
    year: '2023',
    client: 'Original brand concept',
    tools: ['illustrator', 'photoshop', 'blender'],
    accent: '#6a4bd0',
    cover: { kind: 'image', src: 'media/projects/rage/cover.webp', caption: 'Electric Ice — zero-sugar lineup, 3D render.' },
    gallery: [],
    caseStudy: [
      {
        label: 'Brief',
        body: 'Rage grew out of high-school ski trips with friends and the rush of snow sports. It targets 16- to 30-year-olds — skiers and snowboarders hitting ramps and rails, where courage is the essential ingredient.',
      },
      {
        label: 'Challenge',
        body: 'Balancing size and layout across every element, especially the character: a mash-up of free-spirited ’80s skiers and adventurous ’90s skateboarders. The goal was to fuse my illustration and packaging work into one idea.',
      },
      {
        label: 'Color + Type',
        body: 'Purple reads as power and trust and grabs attention on shelf. White brings a natural feel and negative space; deep blue gives contrast and pairs with everything. The script wordmark is drawn to feel native to snow-sport culture.',
      },
      {
        label: '3D',
        body: 'I rendered the cans in 3D and built an experimental animated commercial concept around them.',
      },
    ],
  },
]

export const portfolioContent = {
  navigation: {
    brandLabel: 'PORTFOLIO',
    brandNextLabel: 'PROJECT',
    links: [
      { label: 'Work', href: '#projects' },
      { label: 'Leveraging AI', href: './leveraging-ai.html' },
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  hero: {
    id: 'hero',
    ariaLabel: 'Portfolio hero',
    nameLines: ['AUGUST', 'PIRRAGLIA'],
    tagline: 'Building Brands through Designing Identity & AI Film Advertising',
    role: siteMeta.role,
    range: 'Brand / Film / Build',
  },
  reveal: {
    ariaLabel: 'Brand impact',
    number: '$39K',
    line: 'of signage. The brand made it inevitable.',
    headline: 'Managing Creative Art Direction',
    subheadline: 'Brand Identity Design • AI Film Ads • Marketing • Signage',
    artwork: {
      video: 'media/signage-artwork/artwork.mp4',
      poster: 'media/signage-artwork/poster.webp',
      ariaLabel: 'Twin Dragon Games exterior signage',
    },
  },
  // SECTION 3 — Projects (fixed-frame carousel, light theme).
  // Each item has one `cover` (the media that plays in the stationary frame),
  // a `gallery` of extra media, and `caseStudy` copy for the View Project viewer.
  projects: {
    id: 'projects',
    ariaLabel: 'Selected work',
    eyebrow: 'Selected Work',
    viewLabel: 'View Project',
    closeLabel: 'Close',
    nextLabel: 'Next Project',
    autoMs: 6500,
    items: projectItems,
  },
  horizontalFlow: {
    id: 'work',
    ariaLabel: 'Featured work',
    brand: {
      kicker: 'FEATURE 01 / BRAND',
      headline: 'Brand systems that move product.',
      image: 'media/projects/signage/belamo.webp',
      imageAlt: 'Belamo Patio Furniture monument sign mockup, 48 by 36 inches, placed on site photography',
      metrics: [
        { value: '$39K', label: 'Signage package' },
        { value: '130%', label: 'Higher campaign read' },
        { value: '7%', label: 'Lift in conversion path' },
      ],
      credit: 'FASTSIGNS Naples / Lead Graphic Designer / Production Specialist',
    },
    film: {
      kicker: 'FEATURE 02 / FILM',
      title: "ASTRO FOOL'S HOPPER",
      headline: 'Ad creative that performs.',
      body: 'Product worlds, AI-assisted art direction, edit rhythm, and final presentation built as one authored system.',
      video: 'media/projects/astro/cover.mp4',
      poster: 'media/projects/astro/poster.webp',
      credit: "Astro Fool's Hopper / Creative Direction / Motion System",
    },
  },
  iris: {
    ariaLabel: 'Screen transition',
    kicker: 'TRANSITION / BUILD',
    headline: 'From campaign to working system.',
  },
  build: {
    id: 'build',
    ariaLabel: 'Build capability',
    kicker: 'FEATURE 03 / BUILD',
    headline: 'Brands that ship as working software.',
    credit: 'Orion Node Studio / Designer + Builder',
    note: 'Vanilla JS + GSAP / No templates / Creative systems that move from idea to interface.',
  },
  meta: {
    ariaLabel: 'Site proof',
    headline: "You're reading this on it.",
    body: 'BUILT IN VANILLA JS + GSAP / NO TEMPLATES. NO TRACKER. NO AGENCY.',
  },
  // About — condensed from August's original "About Me" page.
  about: {
    id: 'about',
    ariaLabel: 'About August Pirraglia',
    kicker: 'ABOUT',
    headlineLines: ['Fine-art trained.', 'Service disciplined.', 'Always shipping.'],
    paragraphs: [
      'Born in Lewisville, Texas, I was drawing before I could do much else. In sixth grade I realized art and computers could be a career; a year later, after moving to Louisville, Kentucky, I designed my first logo — for my middle school track team.',
      'In high school I joined the Kentucky Army National Guard as a Fire Control Specialist, running artillery data from a computer to the gun line. In parallel I studied at the University of Kentucky across art history, digital media, sculpture, and 3D design, graduating with a BFA in Digital Media & Design.',
      'I moved to Florida with one goal: to immerse myself in exceptional art and design, and to be better every day than I was the day before.',
    ],
    facts: [
      { label: 'Based', value: 'Fort Myers, Florida' },
      { label: 'Now', value: 'Lead Graphic Designer / Production Specialist, FASTSIGNS of Naples' },
      { label: 'Education', value: 'BFA, Digital Media & Design — University of Kentucky' },
      { label: 'Service', value: 'Kentucky Army National Guard — 13J Fire Control Specialist, six years' },
    ],
  },
  contact: {
    id: 'contact',
    ariaLabel: 'Contact',
    kicker: 'Open to creative director roles + select freelance',
    resumeLabel: 'August-Pirraglia-Resume.pdf',
  },
} as const
