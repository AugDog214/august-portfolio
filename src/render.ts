import { astroSequence, portfolioContent, projectToolMap, siteMeta, type AiShowcaseItem, type AiShowcaseMedia, type ProjectToolKey } from './content'
import { resolvePublicUrl } from './urls'

export function renderSite() {
  const { navigation, hero, reveal, projects, horizontalFlow, about, contact } = portfolioContent
  const firstProject = projects.items[0]
  const coverThumb = (cover: { kind: string; src: string; poster?: string }) =>
    cover.kind === 'video' ? cover.poster ?? cover.src : cover.src
  const toolList = (tools: readonly ProjectToolKey[]) =>
    tools
      .map((toolKey) => {
        const tool = projectToolMap[toolKey]

        return `<li class="project-tool">
          <img src="${resolvePublicUrl(tool.icon)}" alt="${tool.label}" title="${tool.label}" loading="lazy" decoding="async" />
        </li>`
      })
      .join('')
  const revealTickerSeparator = '&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;'
  const revealTickerText = `${reveal.subheadline.split(' • ').join(revealTickerSeparator)}${revealTickerSeparator}`
  const revealTicker = Array.from({ length: 4 }, () => `<span class="reveal-subheadline-group">${revealTickerText}</span>`).join('')

  return `
    <a class="skip-link" href="#${horizontalFlow.id}">Skip to work</a>
    <div class="grain" aria-hidden="true"></div>
    <div class="loop-veil" aria-hidden="true" data-loop-veil></div>

    <header class="site-nav" data-nav>
      <a class="nav-brand" href="#${hero.id}" aria-label="${siteMeta.name} home" data-nav-brand>
        <span class="nav-brand-inner" data-nav-brand-inner>
          <span class="nav-brand-face nav-brand-face--front">${navigation.brandLabel}</span>
          <span class="nav-brand-face nav-brand-face--back">${navigation.brandNextLabel}</span>
        </span>
      </a>
      <nav class="nav-links" aria-label="Primary">
        ${navigation.links.map((link, index) => `${index > 0 ? '<span class="nav-separator" aria-hidden="true">|</span>' : ''}<a href="${link.href}">${link.label}</a>`).join('')}
      </nav>
    </header>

    <main>
      <section class="hero scene" id="${hero.id}" aria-label="${hero.ariaLabel}" data-scene="hero" data-hero>
        <div class="hero-media" aria-hidden="true">
          <img class="hero-poster" src="${resolvePublicUrl(astroSequence.poster)}" alt="" loading="eager" decoding="async" data-hero-poster />
          <canvas class="hero-canvas" data-hero-canvas></canvas>
          <div class="hero-fade hero-fade--top"></div>
          <div class="hero-fade hero-fade--bottom"></div>
          <div class="hero-grade"></div>
        </div>

        <div class="hero-identity" data-hero-identity>
          <h1>${hero.nameLines.join(' ')}</h1>
          <p class="hero-tagline">${hero.tagline}</p>
          <span class="copper-rule"></span>
          <p class="hero-role">${hero.role}</p>
          <p class="hero-range">${hero.range}</p>
        </div>

        <div class="hero-progress" aria-hidden="true">
          <span data-hero-progress></span>
        </div>
      </section>

      <section class="reveal scene" aria-label="${reveal.ariaLabel}" data-scene="reveal" data-reveal>
        <div class="reveal-inner">
          <p class="reveal-subheadline" aria-label="${reveal.subheadline}" data-reveal-banner>
            <span class="reveal-subheadline-mask" aria-hidden="true">
              <span class="reveal-subheadline-track">
                ${revealTicker}
              </span>
            </span>
          </p>
          <figure class="reveal-artwork" data-reveal-artwork>
            <div class="reveal-video-frame">
              <video
                aria-label="${reveal.artwork.ariaLabel}"
                autoplay
                loop
                muted
                playsinline
                preload="metadata"
                poster="${resolvePublicUrl(reveal.artwork.poster)}"
                data-reveal-video
              >
                <source src="${resolvePublicUrl(reveal.artwork.video)}" type="video/mp4" />
              </video>
            </div>
          </figure>
          <div class="reveal-copy" data-reveal-copy>
            <p class="reveal-number">${reveal.number}</p>
            <p class="reveal-line">${reveal.line}</p>
          </div>
          <div class="reveal-editorial" data-reveal-editorial>
            <span class="copper-rule reveal-rule"></span>
            <h2 class="reveal-headline">${reveal.headline}</h2>
          </div>
        </div>
      </section>

      <section class="projects scene" id="${projects.id}" aria-label="${projects.ariaLabel}" data-scene="projects" data-projects>
        <div class="projects-grain" aria-hidden="true"></div>
        <div class="projects-inner">
          <header class="projects-head">
            <p class="projects-eyebrow">${projects.eyebrow}</p>
            <h2 class="projects-title" data-projects-title>${firstProject.name}</h2>
          </header>

          <div class="pf-stage" data-pf-stage>
          <div class="pf-strip" data-pf-strip>
            ${projects.items
              .map(
                (project, index) => `
              <button class="pf-thumb" type="button" data-pf-thumb data-index="${index}" style="--accent: ${project.accent}" aria-label="${project.name}">
                <img class="pf-thumb-img" src="${resolvePublicUrl(coverThumb(project.cover))}" alt="" loading="lazy" decoding="async" />
              </button>`,
              )
              .join('')}
          </div>

          <div class="pf-frame" data-pf-frame style="--accent: ${firstProject.accent}">
            <div class="pf-backdrop" data-pf-backdrop aria-hidden="true"></div>
            <div class="pf-media" data-pf-media></div>
            <span class="pf-frameline" aria-hidden="true"></span>
            <span class="pf-progress" data-pf-progress aria-hidden="true"></span>
            <button class="pf-mute" type="button" data-pf-mute aria-label="Unmute" hidden>
              <span class="pf-mute-icon" data-pf-mute-icon aria-hidden="true">&#128263;</span>
            </button>
          </div>
        </div>
        </div>

        <aside class="project-glass" data-project-glass>
          <div class="project-glass-inner">
            <div class="project-brief-main">
              <p class="project-glass-tag" data-glass-tag>${firstProject.tag}</p>
              <h3 class="project-glass-name" data-glass-name>${firstProject.name}</h3>
              <p class="project-glass-blurb" data-glass-blurb>${firstProject.blurb}</p>
            </div>
            <dl class="project-brief-meta">
              <div class="project-brief-row project-brief-row--client">
                <dt>Client</dt>
                <dd data-glass-client>${firstProject.client}</dd>
              </div>
              <div class="project-brief-row">
                <dt>My Role</dt>
                <dd data-glass-role>${firstProject.role}</dd>
              </div>
              <div class="project-brief-row">
                <dt>Year</dt>
                <dd data-glass-year>${firstProject.year}</dd>
              </div>
              <div class="project-brief-row project-brief-row--tools">
                <dt>Tools</dt>
                <dd>
                  <ul class="project-tools" data-glass-tools aria-label="Project tools">
                    ${toolList(firstProject.tools)}
                  </ul>
                </dd>
              </div>
            </dl>
            <button class="project-view" type="button" data-view-project>
              <span>${projects.viewLabel}</span>
              <span class="project-view-arrow" aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </aside>
      </section>

      <div class="section-dusk" aria-hidden="true"></div>

      ${renderShowcase(portfolioContent.aiShowcase)}

      <section class="horiz-flow" id="${horizontalFlow.id}" aria-label="${horizontalFlow.ariaLabel}" data-scene="horizontal-flow" data-horizontal-section>
        <div class="horiz-track" data-horizontal-track>
          <article class="horiz-panel brand-panel" data-horizontal-panel="brand" data-brand-panel>
            <figure class="brand-art">
              <img class="brand-art-img" src="${resolvePublicUrl(horizontalFlow.brand.image)}" alt="${horizontalFlow.brand.imageAlt}" loading="lazy" decoding="async" />
            </figure>
            <div class="brand-copy">
              <p class="kicker">${horizontalFlow.brand.kicker}</p>
              <h2>${horizontalFlow.brand.headline}</h2>
              <span class="copper-rule"></span>
              <dl class="metric-stack">
                ${horizontalFlow.brand.metrics.map((metric) => `<div><dt>${metric.value}</dt><dd>${metric.label}</dd></div>`).join('')}
              </dl>
              <p class="credit">${horizontalFlow.brand.credit}</p>
            </div>
          </article>

          <article class="horiz-panel film-panel" data-horizontal-panel="film" data-film-panel>
            <div class="film-inner" data-film-inner>
              <div class="video-stage">
                <video
                  class="film-video"
                  aria-label="${horizontalFlow.film.title} product film"
                  muted
                  loop
                  playsinline
                  preload="none"
                  poster="${resolvePublicUrl(horizontalFlow.film.poster)}"
                  data-film-video
                >
                  <source src="${resolvePublicUrl(horizontalFlow.film.video)}" type="video/mp4" />
                </video>
              </div>
              <div class="film-copy">
                <p class="kicker">${horizontalFlow.film.kicker}</p>
                <h2>${horizontalFlow.film.headline}</h2>
                <p>${horizontalFlow.film.body}</p>
                <p class="credit">${horizontalFlow.film.credit}</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      ${renderShowcase(portfolioContent.brandIdentity, true)}

      <section class="about" id="${about.id}" aria-label="${about.ariaLabel}" data-about>
        <div class="about-inner">
          <header class="about-head" data-about-reveal>
            <h2>${about.headlineLines.map((line) => `<span>${line}</span>`).join(' ')}</h2>
            <span class="copper-rule"></span>
          </header>
          <div class="about-body" data-about-reveal>
            <h3 class="about-label">${about.kicker}</h3>
            ${about.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')}
          </div>
          <dl class="about-facts" data-about-reveal>
            ${about.facts.map((fact) => `<div><dt>${fact.label}</dt><dd>${fact.value}</dd></div>`).join('')}
          </dl>
        </div>
      </section>

      <footer class="contact scene" id="${contact.id}" aria-label="${contact.ariaLabel}" data-scene="contact" data-contact>
        <div class="contact-content">
          <p class="kicker contact-kicker">${contact.kicker}</p>
          <a class="contact-email" href="mailto:${siteMeta.email}">${siteMeta.email}</a>
          <p class="social-row">
            ${siteMeta.socials.map((social) => `<a href="${social.href}" target="_blank" rel="noreferrer">${social.label}</a>`).join(' / ')}
          </p>
          <a class="resume-link" href="${resolvePublicUrl(siteMeta.resumeLink)}" target="_blank" rel="noreferrer">${contact.resumeLabel}</a>
        </div>
        <div class="horizon-glow" aria-hidden="true"></div>
      </footer>

      <div class="loop-bridge" aria-hidden="true" data-loop-bridge></div>
    </main>

    <div class="project-viewer" data-project-viewer role="dialog" aria-modal="true" aria-labelledby="viewer-title" aria-hidden="true">
      <div class="project-viewer-bar">
        <span class="project-viewer-count" data-viewer-count aria-hidden="true"></span>
        <span class="project-viewer-title" id="viewer-title" data-viewer-title></span>
        <button class="project-viewer-close" type="button" data-viewer-close>
          <span>${projects.closeLabel}</span>
          <span class="project-viewer-close-key" aria-hidden="true">Esc</span>
        </button>
      </div>
      <div class="project-viewer-scroll" data-viewer-scroll data-lenis-prevent></div>
    </div>
  `
}

const pad2 = (value: number) => String(value).padStart(2, '0')

function renderAiMedia(media: AiShowcaseMedia) {
  if (media.kind === 'plate') {
    // no photos exist of the Illustrator tools, so this is a typographic plate:
    // a drawn pen path (anchor points + handles) behind the tool count
    return `<div class="ai-plate">
      <svg class="ai-plate-path" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g transform="translate(190 64) scale(0.7)">
        <path class="ai-plate-curve" d="M40 310 C 150 120, 250 90, 330 200 S 520 330, 600 110" />
        <path class="ai-plate-handle" d="M40 310 L150 120 M330 200 L250 90 M330 200 L410 310 M600 110 L520 330" />
        <rect x="34" y="304" width="12" height="12" /><rect x="324" y="194" width="12" height="12" /><rect x="594" y="104" width="12" height="12" />
        <circle cx="150" cy="120" r="5" /><circle cx="250" cy="90" r="5" /><circle cx="410" cy="310" r="5" /><circle cx="520" cy="330" r="5" />
        </g>
      </svg>
      <p class="ai-plate-value">${media.value}</p>
      <p class="ai-plate-label">${media.label}</p>
    </div>`
  }

  if (media.kind === 'gallery') {
    return `<div class="ai-gallery" style="--g-count: ${media.images.length}">
      ${media.images
        .map(
          (image, index) =>
            `<img class="ai-media-el ai-gallery-img" style="--g-i: ${index}" src="${resolvePublicUrl(image.src)}" alt="${image.alt}" loading="lazy" decoding="async" />`,
        )
        .join('')}
    </div>`
  }

  if (media.kind === 'video') {
    return `<video class="ai-media-el" muted loop playsinline preload="none" poster="${resolvePublicUrl(media.poster)}" aria-label="${media.alt}" data-ai-video>
      <source src="${resolvePublicUrl(media.src)}" type="video/mp4" />
    </video>`
  }

  return `<img class="ai-media-el" src="${resolvePublicUrl(media.src)}" alt="${media.alt}" loading="lazy" decoding="async"${media.position ? ` style="object-position: ${media.position}"` : ''} />`
}

type ShowcaseConfig = {
  id: string
  ariaLabel: string
  kicker: string
  headline: string
  itemLabel: string
  metaLabel: string
  pageLink?: { label: string; href: string }
  items: readonly AiShowcaseItem[]
}

// One pinned showcase layout, used twice: Leveraging AI (info left, frame right)
// and Brand Identity (mirrored: frame left, info right, headline top-left).
function renderShowcase(ai: ShowcaseConfig, mirror = false) {
  const total = pad2(ai.items.length)
  // each word gets its own box so it can fly from the centre to the top on its own
  // (the last two words, "working systems.", land in copper)
  const headlineWords = ai.headline.split(' ')
  const words = headlineWords
    .map((word, index) => `<span class="ai-word${index >= headlineWords.length - 2 ? ' ai-word--accent' : ''}" data-ai-word>${word}</span>`)
    .join(' ')

  return `
      <section class="ai-show scene${mirror ? ' ai-show--mirror' : ''}" id="${ai.id}" aria-label="${ai.ariaLabel}" data-scene="ai" data-ai-show style="--ai-count: ${ai.items.length}">
        <div class="ai-show-inner">
          <header class="ai-show-head">
            <p class="kicker ai-show-kicker" data-ai-kicker>${ai.kicker}</p>
            <h2 class="ai-show-title" data-ai-title aria-label="${ai.headline}"><span aria-hidden="true">${words}</span></h2>
            <span class="ai-show-rule" data-ai-rule aria-hidden="true"></span>
          </header>

          <div class="ai-show-body" data-ai-body>
            <div class="ai-show-info" data-ai-info>
              <div class="ai-items">
                ${ai.items
                  .map(
                    (item, index) => `
                <article class="ai-item${index === 0 ? ' is-active' : ''}" data-ai-item aria-hidden="${index === 0 ? 'false' : 'true'}">
                  <p class="kicker ai-item-kicker">${ai.itemLabel} ${pad2(index + 1)} / ${item.pillar}</p>
                  <h3 class="ai-item-name">${item.name}</h3>
                  <span class="copper-rule"></span>
                  <p class="ai-item-desc">${item.description}</p>
                  <dl class="ai-item-meta">
                    <div><dt>${ai.metaLabel}</dt><dd>${item.built}</dd></div>
                    ${item.stat ? `<div class="ai-item-stat"><dt>${item.stat.value}</dt><dd>${item.stat.label}</dd></div>` : ''}
                  </dl>
                  ${item.link ? `<a class="ai-item-link" href="${item.link.href}" target="_blank" rel="noreferrer" tabindex="${index === 0 ? '0' : '-1'}">${item.link.label} <span aria-hidden="true">&nearr;</span></a>` : ''}
                </article>`,
                  )
                  .join('')}
              </div>

              <div class="ai-show-foot">
                <p class="ai-count" aria-hidden="true"><span data-ai-count>01</span> / ${total}</p>
                <ol class="ai-ticks" aria-label="${ai.ariaLabel}">
                  ${ai.items
                    .map(
                      (item, index) => `<li><button class="ai-tick${index === 0 ? ' is-active' : ''}" type="button" data-ai-tick="${index}" aria-label="Show ${item.name}"${index === 0 ? ' aria-current="true"' : ''}><span></span></button></li>`,
                    )
                    .join('')}
                </ol>
                ${ai.pageLink ? `<a class="ai-page-link" href="${ai.pageLink.href}">${ai.pageLink.label} <span aria-hidden="true">&rarr;</span></a>` : ''}
              </div>
            </div>

            <figure class="ai-frame" data-ai-frame>
              <span class="ai-bracket" aria-hidden="true"></span>
              <span class="ai-dash" aria-hidden="true"></span>
              <div class="ai-frame-window" data-ai-window>
                ${ai.items
                  .map(
                    (item, index) => `<div class="ai-media${index === 0 ? ' is-active' : ''}" data-ai-media>${renderAiMedia(item.media)}</div>`,
                  )
                  .join('')}
              </div>
              <span class="ai-flare" data-ai-flare aria-hidden="true">
                <span class="ai-flare-inner" data-ai-flare-inner>
                  <span class="ai-flare-rays"></span>
                  <span class="ai-flare-beam"></span>
                  <span class="ai-flare-streak"></span>
                  <span class="ai-flare-core"></span>
                </span>
              </span>
            </figure>
          </div>
        </div>
      </section>`
}
