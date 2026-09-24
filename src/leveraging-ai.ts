import { siteMeta } from './content'
import './styles.css'
import './leveraging-ai.css'

/**
 * Content from August's resume (June 2026). Only verified facts — no invented tool
 * names. Add named tools as extra entries in `tools` when the details are ready;
 * the layout adapts to any count.
 */
const aiPage = {
  kicker: 'Leveraging AI',
  headline: 'Tools I built to make the work move faster.',
  lead:
    'At FASTSIGNS of Naples I integrate AI into the design workflow by building and coding my own scripts and tools for Adobe Illustrator and the print process — cutting per-project turnaround time and cost by 16%. Design, speed, and print-ready output, engineered instead of repeated by hand.',
  pillars: [
    {
      id: 'design',
      label: 'Design',
      intro: 'Custom tooling inside Illustrator, where the work actually happens.',
      tools: [
        {
          name: 'Custom Illustrator scripts',
          tagline: 'Coded tools that live inside the design workflow.',
          description:
            'Scripts and tools I build and code for Adobe Illustrator, so repeatable design and layout steps run the same way every time instead of by hand.',
          built: 'Claude Code + Codex',
        },
      ],
    },
    {
      id: 'speed',
      label: 'Speed',
      intro: 'Automation measured in hours and dollars, not novelty.',
      tools: [
        {
          name: '16% faster, cheaper turnaround',
          tagline: 'Per project, across the shop.',
          description:
            'Wiring AI into the design-to-print workflow cut per-project turnaround time and cost by 16% — the same team shipping more, faster.',
          built: 'AI-assisted workflow',
        },
      ],
    },
    {
      id: 'printing',
      label: 'Printing',
      intro: 'Production systems that keep print jobs clean and costs down.',
      tools: [
        {
          name: 'Print-process automation',
          tagline: 'Scripts that carry files from design to press-ready.',
          description:
            'Tools built for the printing process itself, so large- and small-format jobs move from artwork to production files with fewer manual steps.',
          built: 'Claude Code + Codex',
        },
        {
          name: 'Substrate tracking system',
          tagline: 'Built from scratch for the production floor.',
          description:
            'A tracking system for print substrates that reduced cost of goods by 7% month over month.',
          built: 'Custom build',
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
