import { siteMeta } from './content'
import './styles.css'
import './leveraging-ai.css'

/**
 * Leveraging AI — August's own list (Sept 2026) + the 16% figure from his resume.
 * Each pillar holds cards; `href` renders a text link. Add/remove freely.
 */
type AiTool = { name: string; tagline: string; description: string; built: string; href?: string; linkLabel?: string }
type AiPillar = { id: string; label: string; intro: string; tools: AiTool[] }

const aiPage: { kicker: string; headline: string; lead: string; pillars: AiPillar[] } = {
  kicker: 'Leveraging AI',
  headline: 'Tools I built to make the work move faster.',
  lead:
    'I direct AI the way I direct a crew: clear intent, tight feedback, final calls stay mine. At FASTSIGNS of Naples that meant five Illustrator tools that cut per-project turnaround and cost by 16%. Beyond the shop it means shipped websites, 3D pool mock-ups, AI video, and code-driven animation — built with Gemini, Codex, Claude Code, and MCP-connected tools like Blender and Higgsfield.',
  pillars: [
    {
      id: 'design-print',
      label: 'Design + Print',
      intro: 'Custom tooling inside Illustrator, where the production work actually happens.',
      tools: [
        {
          name: 'Illustrator scripts + tool extensions',
          tagline: 'Five custom tools for the design and print workflow.',
          description:
            'Five scripts and tool extensions I built for Adobe Illustrator to speed up the graphic design workflow and the printing process at FASTSIGNS — cutting per-project turnaround time and cost by 16%.',
          built: 'Gemini',
        },
      ],
    },
    {
      id: 'tools',
      label: 'Tools',
      intro: 'My own software for running AI production end to end.',
      tools: [
        {
          name: 'Orion Node Studio',
          tagline: 'A node-based AI workflow editor.',
          description:
            'A canvas where image, text, and assistant nodes connect into reusable production flows, with batch runs and preset workflows such as pool and landscape visualization. Built in vanilla JavaScript with a Node/Express backend connected to Gemini and OpenAI.',
          built: 'Codex + Claude Code',
        },
      ],
    },
    {
      id: 'web',
      label: 'Web',
      intro: 'Designed and shipped as working software — no templates.',
      tools: [
        {
          name: 'This website',
          tagline: 'You are scrolling it.',
          description:
            'A scroll-driven portfolio in Vite, TypeScript, and GSAP — frame-sequence hero, pinned section transitions, and a custom case-study viewer, art directed and built end to end.',
          built: 'Codex + Claude Code',
          href: './index.html',
          linkLabel: 'Back to the portfolio',
        },
        {
          name: 'The Olea Group career site',
          tagline: 'Recruiting site, designed and built.',
          description: 'The careers site for The Olea Group — brand, layout, and build, shipped live on its own domain.',
          built: 'Codex + Claude Code',
          href: 'https://careers.myoleagroup.com/',
          linkLabel: 'careers.myoleagroup.com',
        },
        {
          name: "Macarena's Kitchen website",
          tagline: 'Restaurant site with online ordering.',
          description:
            "Website for Macarena's Kitchen, a restaurant client — designed, built, and deployed on a custom domain, with Square online ordering wired in.",
          built: 'Codex + Claude Code',
          href: 'https://www.macarenaskitchen.com/',
          linkLabel: 'macarenaskitchen.com',
        },
        {
          name: "Mango's Photo Booth website",
          tagline: 'Booking-first site for an events business.',
          description:
            "Website for Mango's Photo Booth in Southwest Florida: tiered packages with an anchored middle option, event and gallery pages, four city landing pages, and LocalBusiness and FAQ structured data for local and AI search.",
          built: 'Claude Code',
          href: 'https://mangosphotobooth.com/',
          linkLabel: 'mangosphotobooth.com',
        },
      ],
    },
    {
      id: '3d',
      label: '3D',
      intro: 'An AI agent driving Blender, directed toward a client-ready render.',
      tools: [
        {
          name: 'Pool 3D mock-ups',
          tagline: 'Blender, driven through MCP.',
          description:
            'Using the Blender MCP to build 3D pool mock-ups for a luxury pool construction client — so the homeowner can see the design before a shovel hits the ground.',
          built: 'Blender MCP + Codex + Claude Code',
        },
        {
          name: 'Ruskin pool: final mock-ups',
          tagline: 'A lakefront pool, sold before the dig.',
          description:
            'The final presentation for a lakefront pool and lanai build by Complete Renovation and Construction: aerials, the screened cage, and the view from across the lake, generated and composited before construction started.',
          built: 'Gemini + Higgsfield + Photoshop',
        },
      ],
    },
    {
      id: 'motion',
      label: 'Motion',
      intro: 'Generated video and animation, directed shot by shot.',
      tools: [
        {
          name: 'AI video content',
          tagline: 'Generated video through the Higgsfield MCP.',
          description:
            'Producing AI-generated video content by connecting to Higgsfield through MCP — directing shots and iterating from prompt to final cut.',
          built: 'Higgsfield MCP',
        },
        {
          name: 'Animation',
          tagline: 'Motion written as code.',
          description:
            'A code-rendered 8-second loop: 8,800 particles orbit, burst, and assemble into type. Every frame is a pure function of time, rendered headless and encoded with ffmpeg. Zero keyframes.',
          built: 'Claude Code',
        },
      ],
    },
  ],
}

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
                  ${
                    tool.href
                      ? `<a class="ai-card-link" href="${tool.href}"${tool.href.startsWith('http') ? ' target="_blank" rel="noreferrer"' : ''}>${tool.linkLabel ?? 'Visit'} <span aria-hidden="true">&rarr;</span></a>`
                      : ''
                  }
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
