export const siteMeta = {
  name: 'August Pirraglia',
  role: 'Creative Director',
  email: 'apirr47@gmail.com',
  siteUrl: 'https://augdog214.github.io/august-portfolio/',
  ogImage: 'social/august-portfolio-social.svg',
  description:
    'Single-page scroll film portfolio for August Pirraglia, a creative director working across brand, film, production, AI, and software.',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/august-pirraglia-56bb52261' },
  ],
  resumeLink: 'resume/august-pirraglia-resume.pdf',
} as const

export const astroSequence = {
  poster: 'media/astro-fools-hopper/poster.webp',
  framePath: 'media/astro-fools-hopper/frames/frame-',
  frameCount: 188,
} as const

export const portfolioContent = {
  navigation: {
    brandLabel: 'PORTFOLIO',
    brandNextLabel: 'PROJECT',
    links: [
      { label: 'Work', href: '#work' },
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
  // Each item has one `cover` (the media that plays in the stationary frame)
  // and a `gallery` of extra media shown in the full-screen View Project viewer.
  // cover/gallery media: { kind: 'video' | 'image', src, poster?, pan? }
  projects: {
    id: 'projects',
    ariaLabel: 'Selected art projects',
    eyebrow: 'Selected Work',
    viewLabel: 'View Project',
    closeLabel: 'Close',
    autoMs: 6500,
    items: [
      {
        name: 'Signage',
        tag: 'Environmental / Large Format',
        blurb:
          'Brand-first environmental signage and wayfinding — exterior identity built for the street and produced print-ready.',
        accent: '#2f5f8f',
        cover: { kind: 'video', src: 'media/projects/signage/cover.mp4', poster: 'media/projects/signage/poster.webp' },
        gallery: [
          { kind: 'image', src: 'media/projects/signage/belamo.webp' },
          { kind: 'image', src: 'media/projects/signage/wayfinding.webp' },
        ],
      },
      {
        name: "Astro Fool's Hopper",
        tag: 'AI Film / Art Direction',
        blurb:
          'An AI-assisted product film for an IPA concept — world-building, character, and edit rhythm authored as one system.',
        accent: '#d8552f',
        cover: { kind: 'video', src: 'media/projects/astro/cover.mp4', poster: 'media/projects/astro/poster.webp' },
        gallery: [{ kind: 'image', src: 'media/projects/astro/can.webp' }],
      },
      {
        name: 'Gap City Media',
        tag: 'Brand / Social / Video',
        blurb:
          'Brand, social, and short-form video for Gap City Media — identity through motion, built to perform on feed.',
        accent: '#e0398f',
        cover: { kind: 'video', src: 'media/projects/gapcity/cover.mp4', poster: 'media/projects/gapcity/poster.webp' },
        gallery: [
          { kind: 'image', src: 'media/projects/gapcity/logo.webp' },
          { kind: 'image', src: 'media/projects/gapcity/banner.webp', pan: true },
        ],
      },
      {
        name: 'Kababz: Menu',
        tag: 'Menu / Print Design',
        blurb:
          'Menu and print design for Kababz Heaven — appetite-first hierarchy and clean, press-ready artwork.',
        accent: '#c08a3c',
        cover: { kind: 'image', src: 'media/projects/kababz/cover.webp' },
        // both menu pages cycle in the frame while this card is active
        slides: [
          { kind: 'image', src: 'media/projects/kababz/cover.webp' },
          { kind: 'image', src: 'media/projects/kababz/menu-2.webp' },
        ],
        gallery: [{ kind: 'image', src: 'media/projects/kababz/menu-2.webp' }],
      },
      {
        name: 'Art Posters',
        tag: 'Poster Series / Motion',
        blurb:
          'An original poster series and motion piece — bold type, composition, and experimental layout.',
        accent: '#c2354a',
        cover: { kind: 'video', src: 'media/projects/posters/cover.mp4', poster: 'media/projects/posters/poster.webp' },
        gallery: [{ kind: 'image', src: 'media/projects/posters/antidesign.webp' }],
      },
      {
        name: 'Rage Energy Drink',
        tag: 'Packaging / 3D Render',
        blurb:
          'Packaging and 3D product rendering for an energy drink concept — can design, finish, and shelf presence.',
        accent: '#6a4bd0',
        cover: { kind: 'image', src: 'media/projects/rage/cover.webp' },
        gallery: [],
      },
    ],
  },
  horizontalFlow: {
    id: 'work',
    ariaLabel: 'Featured work',
    brand: {
      kicker: 'FEATURE 01 / BRAND',
      headline: 'Brand systems that move product.',
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
      credit: "Astro Fool's Hopper / Creative Direction / Motion System",
    },
  },
  iris: {
    ariaLabel: 'Screen transition',
    kicker: 'TRANSITION / BUILD',
    headline: 'From campaign to working system.',
  },
  build: {
    id: 'about',
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
  contact: {
    id: 'contact',
    ariaLabel: 'Contact',
    resumeLabel: 'August-Pirraglia-Resume.pdf',
  },
} as const
