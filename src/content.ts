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
      'Exterior identity, monument signs, and wayfinding for Collier County, construction sites, and commercial properties — designed to read at street speed and produced print-ready.',
    role: 'Lead Graphic Designer / Production Specialist',
    year: '2025 — Present',
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
      { kind: 'image', src: 'media/projects/signage/wayfinding.webp', caption: 'Directional wayfinding — post-and-panel system for a county government campus.' },
    ],
    caseStudy: [
      {
        label: 'Context',
        body: 'As Lead Graphic Designer and Production Specialist at FASTSIGNS of Naples, I take brands from a logo file to aluminum, acrylic, and vinyl — large to small signage for clients like Collier County, construction sites, and commercial properties across Southwest Florida.',
      },
      {
        label: 'Approach',
        body: 'Every sign starts as a legibility problem: viewing distance, speed, light, and the building it has to live on. I mock pieces up to scale on real site photography so the client signs off on what the street will actually see, then build the production files that go straight to fabrication.',
      },
      {
        label: 'Systems',
        body: 'I build and code custom AI scripts and tools for Illustrator and the print process, cutting per-project turnaround time and cost by 16%. I also built a substrate tracking system from scratch that lowers cost of goods 7% month over month.',
      },
      {
        label: 'Outcome',
        body: 'Pairing design with self-directed social video campaigns, I hit 130% of our monthly sales target — $64K a month against a $30K goal. One signage package alone closed at $39K.',
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
      'Live-action commercial content, channel branding, and short-form video for Gap City Media — directed from concept to final cut and built to perform on feed.',
    role: 'Filmmaker / Creative Director',
    year: '2023 — 2025',
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
        label: 'Production',
        body: 'Directed and produced live-action commercial content — multi-camera DJ performances, brand promo reels, and event recaps — plus short-form spots for clients like Faded Jays in Naples, FL, cut vertical and paced to win the first second of the scroll.',
      },
      {
        label: 'Outcome',
        body: '40% growth in client video views across YouTube and Instagram, 13 new client accounts, and a 17% lift in social lead generation. A video-first client acquisition strategy pushed monthly revenue 15%+ past target.',
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

export type AiShowcaseMedia =
  | { kind: 'image'; src: string; alt: string; position?: string }
  | { kind: 'video'; src: string; poster: string; alt: string }
  | { kind: 'plate'; value: string; label: string }
  | { kind: 'gallery'; images: readonly { src: string; alt: string }[] }

export type AiShowcaseItem = {
  pillar: string
  name: string
  description: string
  built: string
  stat?: { value: string; label: string }
  link?: { label: string; href: string }
  media: AiShowcaseMedia
}

// August's Leveraging AI list (Sept 2026). The 16% figure is from his resume.
const aiShowcaseItems: AiShowcaseItem[] = [
  {
    pillar: 'Design + Print',
    name: 'Illustrator scripts + tool extensions',
    description: 'Five custom tools inside Adobe Illustrator that speed up the design workflow and the print process at FASTSIGNS.',
    built: 'Gemini',
    stat: { value: '16%', label: 'Faster, cheaper turnaround per project' },
    media: { kind: 'plate', value: '05', label: 'Custom Illustrator tools' },
  },
  {
    pillar: 'Tools',
    name: 'Orion Node Studio',
    description: 'My own node-based AI workflow editor. Preset flows like this pool visualization chain references, prompt writing, and batch renders into one run.',
    built: 'Codex + Claude Code',
    media: { kind: 'image', src: 'media/ai/orion-node-studio.webp', alt: 'Orion Node Studio canvas with the Pool and Landscape Design Visualization preset workflow' },
  },
  {
    pillar: 'Web',
    name: 'This website',
    description: 'A scroll-driven portfolio in Vite, TypeScript, and GSAP, art directed and built end to end. You are scrolling it.',
    built: 'Codex + Claude Code',
    media: { kind: 'image', src: 'media/ai/portfolio.webp', alt: "Selected Work section of August's portfolio site", position: '50% 30%' },
  },
  {
    pillar: 'Web',
    name: 'The Olea Group career site',
    description: 'The recruiting site for The Olea Group: brand, layout, and build, shipped live on its own domain.',
    built: 'Codex + Claude Code',
    link: { label: 'careers.myoleagroup.com', href: 'https://careers.myoleagroup.com/' },
    media: { kind: 'image', src: 'media/ai/olea-careers.webp', alt: 'The Olea Group careers site home page' },
  },
  {
    pillar: 'Web',
    name: "Macarena's Kitchen website",
    description: 'A restaurant site designed, built, and deployed on a custom domain, with Square online ordering wired in.',
    built: 'Codex + Claude Code',
    link: { label: 'macarenaskitchen.com', href: 'https://www.macarenaskitchen.com/' },
    media: { kind: 'image', src: 'media/ai/macarenas-kitchen.webp', alt: "Macarena's Kitchen website home page with the menu" },
  },
  {
    pillar: 'Web',
    name: "Mango's Photo Booth website",
    description: 'A booking-first site for a Southwest Florida photo booth company: event pages, gallery, and a date-check flow that sends visitors straight to reserve.',
    built: 'Claude Code',
    link: { label: 'mangosphotobooth.com', href: 'https://mangosphotobooth.com/' },
    media: { kind: 'image', src: 'media/ai/mangos-hero.webp', alt: "Mango's Photo Booth website hero" },
  },
  {
    pillar: 'Web',
    name: "Mango's: pricing built to convert",
    description: 'Three packages with a highlighted middle tier to anchor the choice, backed by city landing pages and structured data so the business shows up in local and AI search.',
    built: 'Claude Code',
    stat: { value: '4', label: 'City landing pages + LocalBusiness and FAQ schema' },
    media: { kind: 'image', src: 'media/ai/mangos-packages.webp', alt: "Mango's Photo Booth package pricing section" },
  },
  {
    pillar: '3D',
    name: 'Pool 3D mock-ups',
    description: 'An AI agent driving Blender through MCP to build pool and lanai mock-ups, so the homeowner sees the design before the dig.',
    built: 'Blender MCP + Codex + Claude Code',
    media: { kind: 'image', src: 'media/ai/pool-3d.webp', alt: '3D render of a pool and covered lanai built in Blender', position: '50% 55%' },
  },
  {
    pillar: '3D',
    name: 'Ruskin pool: final mock-ups',
    description: 'The final presentation for a lakefront pool and lanai build by Complete Renovation and Construction: aerials, the screened cage, and the view from across the lake, all before construction started.',
    built: 'Gemini + Higgsfield + Photoshop',
    media: {
      kind: 'gallery',
      images: [
        { src: 'media/ai/ruskin-1.webp', alt: 'Ruskin pool mock-up seen from across the lake' },
        { src: 'media/ai/ruskin-2.webp', alt: 'Ruskin pool mock-up, left side with fire bowls and sun shelf' },
        { src: 'media/ai/ruskin-3.webp', alt: 'Ruskin pool mock-up, aerial view of the house and pool' },
        { src: 'media/ai/ruskin-4.webp', alt: 'Ruskin pool mock-up, top-down view of the pool and fire pit' },
        { src: 'media/ai/ruskin-5.webp', alt: 'Ruskin pool mock-up with the screened lanai cage' },
      ],
    },
  },
  {
    pillar: 'Motion',
    name: 'AI video content',
    description: 'Generated video produced through the Higgsfield MCP, directed shot by shot from prompt to final cut.',
    built: 'Higgsfield MCP',
    media: { kind: 'video', src: 'media/ai/higgsfield.mp4', poster: 'media/ai/higgsfield-poster.webp', alt: 'AI-generated clip of astronauts brewing beer' },
  },
  {
    pillar: 'Motion',
    name: 'Animation',
    description: 'An 8-second loop of 8,800 particles: orbit, burst, and assemble into type. Every frame is a pure function of time, so there are zero keyframes and it loops perfectly.',
    built: 'Claude Code + Canvas',
    media: { kind: 'video', src: 'media/ai/animation.mp4', poster: 'media/ai/animation-poster.webp', alt: 'Code-rendered particle animation: a copper ring bursts and reassembles into the word MOTION' },
  },
]

const brandIdentityItems: AiShowcaseItem[] = [
  {
    pillar: 'School · 2022',
    name: 'Solar Home Kentucky',
    description: 'Identity for a Kentucky residential solar brand: a sun-and-roofline mark, responsive app-icon versions, reversed and alternate color variations, and a type system.',
    built: 'Logo system, color, typography',
    media: { kind: 'image', src: 'media/brand/solar-home-kentucky.webp', alt: 'Solar Home Kentucky logo system presentation' },
  },
  {
    pillar: 'Client · 2023',
    name: "River's Edge Cottage",
    description: 'A watercolor mark for a riverside cottage, with reduced and responsive versions, a reversed lockup, and a palette pulled from the river and woods.',
    built: 'Logo system, color, typography',
    media: { kind: 'image', src: 'media/brand/rivers-edge-cottage.webp', alt: "River's Edge Cottage logo presentation" },
  },
  {
    pillar: 'Client · 2023',
    name: 'Forage St.',
    description: 'A monoline script wordmark and mushroom icon for a food brand, shown on dark and light with its four-color palette.',
    built: 'Wordmark, icon, color',
    media: { kind: 'image', src: 'media/brand/forage.webp', alt: 'Forage St. logo final revision presentation' },
  },
  {
    pillar: 'Client · 2023',
    name: 'Novi',
    description: 'A hand-lettered circular mark for a restaurant brand, built with reversed and alternate color versions and a matching font pairing.',
    built: 'Logo, color, typography',
    media: { kind: 'image', src: 'media/brand/novi.webp', alt: 'Novi logo presentation with food photography' },
  },
  {
    pillar: 'Client · 2024',
    name: 'Novare',
    description: 'A bold chrome-gradient wordmark with a sunburst accent for a Naples, Florida client, plus simplified one-color versions and palette.',
    built: 'Wordmark, variations, color',
    media: { kind: 'image', src: 'media/brand/novare.webp', alt: 'Novare logo proposal' },
  },
  {
    pillar: 'Client · 2023',
    name: 'NvR Nine',
    description: 'A sharp interlocking K monogram with a serif wordmark, delivered as a full black, white, and color file kit.',
    built: 'Monogram, wordmark, file kit',
    media: { kind: 'image', src: 'media/brand/nvr-nine.webp', alt: 'NvR Nine monogram logo' },
  },
  {
    pillar: 'Gap City Media · 2024',
    name: 'Gap City Media',
    description: 'The studio identity I made while leading creative there: an 80s synthwave sunset, palms, and neon type that set the look for reels and client work.',
    built: 'Logo, merch, social',
    media: { kind: 'image', src: 'media/brand/gap-city-media.webp', alt: 'Gap City Media logo' },
  },
  {
    pillar: 'School · 2023',
    name: "Pirraglia's",
    description: 'An Italian restaurant identity with a crest monogram and elegant wordmark, responsive versions, a reversed badge, and a type pairing.',
    built: 'Logo system, color, typography',
    media: { kind: 'image', src: 'media/brand/pirraglias.webp', alt: "Pirraglia's restaurant logo presentation" },
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
    number: '$64K',
    line: 'a month in sales. The brand made it inevitable.',
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
      // from August's resume (June 2026)
      metrics: [
        { value: '$64K', label: 'Monthly sales, past our $30K goal' },
        { value: '16%', label: 'Faster, cheaper turnaround with custom AI tools' },
        { value: '7%', label: 'Lower cost of goods, month over month' },
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
  // Leveraging AI showcase — sits right after Selected Work. The headline flies
  // word-by-word from the middle of the screen to the top, then the pinned
  // section steps through each build (left: info, right: framed media).
  aiShowcase: {
    id: 'ai',
    ariaLabel: 'Leveraging AI',
    kicker: 'Leveraging AI',
    headline: 'From drawn notes, mock-ups, to working systems.',
    itemLabel: 'AI Build',
    metaLabel: 'Built with',
    pageLink: { label: 'Every AI build', href: './leveraging-ai.html' },
    items: aiShowcaseItems,
  },
  // Brand Identity: same pinned showcase as Leveraging AI, mirrored.
  brandIdentity: {
    id: 'identity',
    ariaLabel: 'Brand identity work',
    kicker: 'Brand Identity',
    headline: 'From a hundred sketches to one mark.',
    itemLabel: 'Identity',
    metaLabel: 'Scope',
    items: brandIdentityItems,
  },
  // About — condensed from August's original "About Me" page.
  about: {
    id: 'about',
    ariaLabel: 'About August Pirraglia',
    kicker: 'About me',
    headlineLines: ['Fine-art trained.', 'Service disciplined.', 'Always shipping.'],
    paragraphs: [
      'Born in Lewisville, Texas, I was drawing before I could do much else. In sixth grade I realized art and computers could be a career; a year later, after moving to Louisville, Kentucky, I designed my first logo — for my middle school track team.',
      'In high school I joined the Kentucky Army National Guard as a Fire Control Specialist, running artillery data from a computer to the gun line. In parallel I studied at the University of Kentucky across art history, digital media, sculpture, and 3D design, graduating with a BFA in Digital Media & Design.',
      'I moved to Florida with one goal: to immerse myself in exceptional art and design. I directed film as Creative Director at Gap City Media, and today I lead design and production at FASTSIGNS of Naples — where pairing design with my own social video campaigns hit 130% of our monthly sales target.',
    ],
    facts: [
      { label: 'Based', value: 'Fort Myers, Florida' },
      { label: 'Now', value: 'Lead Graphic Designer / Production Specialist, FASTSIGNS of Naples' },
      { label: 'Education', value: 'BFA, Digital Media & Design — University of Kentucky, 2023' },
      { label: 'Service', value: 'Kentucky Army National Guard — 13J Fire Control Specialist, 2016 — 2023' },
    ],
  },
  contact: {
    id: 'contact',
    ariaLabel: 'Contact',
    kicker: 'Open to creative director roles + select freelance',
    resumeLabel: 'August-Pirraglia-Resume.pdf',
  },
} as const
