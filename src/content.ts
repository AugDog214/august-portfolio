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
    brandNextLabel: 'BRANDS',
    links: [
      { label: 'Work', href: '#work' },
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
