export const siteMeta = {
  name: 'August Pirraglia',
  role: 'Creative Director',
  email: 'apirr4@gmail.com',
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
  // SECTION 3 — Projects carousel (light theme). Placeholder content:
  // swap `blurb` for real copy, set `accent` per project, and the full-screen
  // viewer renders `gallery` placeholder panels (replace with real artwork later).
  projects: {
    id: 'projects',
    ariaLabel: 'Selected art projects',
    eyebrow: 'Selected Work',
    viewLabel: 'View Project',
    closeLabel: 'Close',
    items: [
      {
        name: 'Signage',
        tag: 'Environmental / Large Format',
        blurb:
          'Placeholder: large-format environmental signage built brand-first — exterior identity, wayfinding, and print-ready production.',
        accent: '#c77a3c',
        gallery: 6,
      },
      {
        name: "Astro Fool's Hopper",
        tag: 'AI Film / Art Direction',
        blurb:
          'Placeholder: an AI-assisted product film — world-building, art direction, and edit rhythm authored as one system.',
        accent: '#d8552f',
        gallery: 7,
      },
      {
        name: 'Gap City Media',
        tag: 'Brand Identity',
        blurb:
          'Placeholder: a full brand identity system — logo, type, color, and the rules that keep it consistent everywhere.',
        accent: '#3c7ac7',
        gallery: 5,
      },
      {
        name: 'Kababz: Menu',
        tag: 'Menu / Print Design',
        blurb:
          'Placeholder: menu and print design — appetite-first hierarchy, photography direction, and clean press files.',
        accent: '#b8923c',
        gallery: 5,
      },
      {
        name: 'Art Posters',
        tag: 'Poster Series',
        blurb:
          'Placeholder: an original poster series — bold type, composition, and experimental layout systems.',
        accent: '#8a5cc7',
        gallery: 8,
      },
      {
        name: 'Faded Jays',
        tag: 'Brand / Apparel',
        blurb:
          'Placeholder: brand and apparel direction — identity, garment graphics, and the lookbook around it.',
        accent: '#3cb38a',
        gallery: 6,
      },
      {
        name: 'Rage Energy Drink',
        tag: 'Packaging / Brand',
        blurb:
          'Placeholder: packaging and brand for an energy drink — can design, shelf presence, and campaign assets.',
        accent: '#d83c5e',
        gallery: 6,
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
