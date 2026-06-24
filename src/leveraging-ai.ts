import { siteMeta } from './content'
import './styles.css'
import './leveraging-ai.css'

/**
 * PLACEHOLDER CONTENT — edit this object to fill in the real tools.
 * Each pillar (Design / Speed / Printing) holds tool cards.
 * Replace name / tagline / description / built with the real details.
 * Add or remove `tools` freely; the layout adapts.
 */
const aiPage = {
  kicker: 'Leveraging AI',
  headline: 'Tools I built to make the work move faster.',
  lead:
    'I build AI-assisted tools for Adobe Illustrator that close the gap between idea and finished art — optimizing how I design, how fast I produce, and how clean it prints. Below is what I have made, and what it unlocks.',
  pillars: [
    {
      id: 'design',
      label: 'Design',
      intro: 'Assistive + generative tools that expand what I can make.',
      tools: [
        {
          name: 'Tool Name — Design 01',
          tagline: 'One line on what it does.',
          description:
            'PLACEHOLDER: describe how this tool expands your creative range inside Illustrator — what input you give it, what it produces, and why it beats doing it by hand.',
          built: 'AI + ExtendScript',
        },
        {
          name: 'Tool Name — Design 02',
          tagline: 'One line on what it does.',
          description:
            'PLACEHOLDER: another design-side tool. Swap in the real name, the problem it solves, and the kind of work it lets you take on.',
          built: 'AI-assisted',
        },
      ],
    },
    {
      id: 'speed',
      label: 'Speed',
      intro: 'Automation that removes the repetitive work.',
      tools: [
        {
          name: 'Tool Name — Speed 01',
          tagline: 'One line on what it does.',
          description:
            'PLACEHOLDER: describe the repetitive task this automates and the time it saves per job. Numbers land hard here (e.g. "cuts a 2-hour task to 5 minutes").',
          built: 'Script + AI',
        },
        {
          name: 'Tool Name — Speed 02',
          tagline: 'One line on what it does.',
          description:
            'PLACEHOLDER: another speed tool. What used to be manual, what is now one click.',
          built: 'Automation',
        },
      ],
    },
    {
      id: 'printing',
      label: 'Printing',
      intro: 'Production + print-prep that ships clean, press-ready files.',
      tools: [
        {
          name: 'Tool Name — Printing 01',
          tagline: 'One line on what it does.',
          description:
            'PLACEHOLDER: describe the print/production problem this solves — bleeds, color, cut lines, large-format prep — and how it guarantees a clean file every time.',
          built: 'AI + Print pipeline',
        },
        {
          name: 'Tool Name — Printing 02',
          tagline: 'One line on what it does.',
          description:
            'PLACEHOLDER: another production tool. What it checks or generates so nothing fails at the printer.',
          built: 'Production tool',
        },
      ],
    },
  ],
} as const

function renderAiPage() {
  return `
    <a class="skip-link" href="#ai-tools">Skip to tools</a>
    <div class="grain" aria-hidden="true"></div>

    <header class="ai-nav">
      <a class="ai-brand" href="./index.html">${siteMeta.name}</a>
      <nav class="ai-nav-links" aria-label="Primary">
        <a href="./index.html">Portfolio</a>
        <span class="nav-separator" aria-hidden="true">|</span>
        <a href="mailto:${siteMeta.email}">Contact</a>
      </nav>
    </header>

    <main class="ai-page">
      <section class="ai-hero" aria-label="Leveraging AI">
        <p class="ai-kicker">${aiPage.kicker}</p>
        <h1 class="ai-headline">${aiPage.headline}</h1>
        <span class="copper-rule"></span>
        <p class="ai-lead">${aiPage.lead}</p>
        <ul class="ai-pills" aria-hidden="true">
          ${aiPage.pillars.map((pillar) => `<li>${pillar.label}</li>`).join('')}
        </ul>
      </section>

      <div id="ai-tools" class="ai-pillars">
        ${aiPage.pillars
          .map(
            (pillar) => `
          <section class="ai-pillar" aria-label="${pillar.label} tools">
            <div class="ai-pillar-head" data-reveal>
              <p class="ai-pillar-label">${pillar.label}</p>
              <p class="ai-pillar-intro">${pillar.intro}</p>
            </div>
            <div class="ai-card-grid">
              ${pillar.tools
                .map(
                  (tool) => `
                <article class="ai-card" data-reveal>
                  <p class="ai-card-tag">${pillar.label}</p>
                  <h2 class="ai-card-name">${tool.name}</h2>
                  <p class="ai-card-tagline">${tool.tagline}</p>
                  <p class="ai-card-desc">${tool.description}</p>
                  <p class="ai-card-built">Built with ${tool.built}</p>
                </article>`,
                )
                .join('')}
            </div>
          </section>`,
          )
          .join('')}
      </div>

      <footer class="ai-footer">
        <p class="ai-footer-line">More in the full portfolio.</p>
        <a class="ai-back" href="./index.html">&larr; Back to Portfolio</a>
        <a class="ai-email" href="mailto:${siteMeta.email}">${siteMeta.email}</a>
      </footer>
    </main>
  `
}

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App root not found.')
}

app.innerHTML = renderAiPage()
document.title = `Leveraging AI | ${siteMeta.name}`

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const revealables = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealables.forEach((el) => el.classList.add('is-visible'))
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
  )

  revealables.forEach((el) => observer.observe(el))
}
