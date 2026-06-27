import { astroSequence, portfolioContent, siteMeta } from './content'
import { resolvePublicUrl } from './urls'

export function renderSite() {
  const { navigation, hero, reveal, projects, horizontalFlow, iris, build, meta, contact } = portfolioContent
  const firstProject = projects.items[0]
  const coverThumb = (cover: { kind: string; src: string; poster?: string }) =>
    cover.kind === 'video' ? cover.poster ?? cover.src : cover.src
  const revealTickerSeparator = '&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;'
  const revealTickerText = `${reveal.subheadline.split(' • ').join(revealTickerSeparator)}${revealTickerSeparator}`
  const revealTicker = Array.from({ length: 4 }, () => `<span class="reveal-subheadline-group">${revealTickerText}</span>`).join('')

  return `
    <a class="skip-link" href="#${horizontalFlow.id}">Skip to work</a>
    <div class="grain" aria-hidden="true"></div>

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
            <span class="reveal-subheadline-track" aria-hidden="true">
              ${revealTicker}
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
            <p class="project-glass-tag" data-glass-tag>${firstProject.tag}</p>
            <h3 class="project-glass-name" data-glass-name>${firstProject.name}</h3>
            <p class="project-glass-blurb" data-glass-blurb>${firstProject.blurb}</p>
            <button class="project-view" type="button" data-view-project>
              <span>${projects.viewLabel}</span>
              <span class="project-view-arrow" aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </aside>
      </section>

      <section class="horiz-flow" id="${horizontalFlow.id}" aria-label="${horizontalFlow.ariaLabel}" data-scene="horizontal-flow" data-horizontal-section>
        <div class="horiz-track" data-horizontal-track>
          <article class="horiz-panel brand-panel" data-horizontal-panel="brand" data-brand-panel>
            <div class="brand-art">
              <div class="can-study" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
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
                <div class="video-ph">
                  <span>${horizontalFlow.film.title}</span>
                </div>
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

      <section class="iris-section scene" aria-label="${iris.ariaLabel}" data-scene="iris" data-iris>
        <div class="iris-content">
          <p class="kicker">${iris.kicker}</p>
          <h2>${iris.headline}</h2>
        </div>
        <div class="iris-bars" aria-hidden="true">
          <span class="iris-bar iris-bar--top"></span>
          <span class="iris-bar iris-bar--right"></span>
          <span class="iris-bar iris-bar--bottom"></span>
          <span class="iris-bar iris-bar--left"></span>
          <span class="iris-glow" data-iris-glow></span>
        </div>
      </section>

      <section class="build scene" id="${build.id}" aria-label="${build.ariaLabel}" data-scene="build" data-build>
        <div class="build-copy" data-build-copy>
          <p class="kicker">${build.kicker}</p>
          <h2>${build.headline}</h2>
          <span class="copper-rule"></span>
          <p class="credit">${build.credit}</p>
          <p class="build-note">${build.note}</p>
        </div>

        <div class="device-stack" data-device-stack aria-hidden="true">
          <div class="device device--secondary">
            <div class="device-screen">
              <span></span><span></span><span></span>
            </div>
          </div>
          <div class="device device--primary">
            <div class="device-screen">
              <span></span><span></span><span></span><span class="screen-cta"></span>
            </div>
            <span class="home-indicator"></span>
          </div>
        </div>
      </section>

      <section class="meta scene" aria-label="${meta.ariaLabel}" data-scene="meta" data-meta>
        <div class="meta-copy" data-meta-copy>
          <h2>${meta.headline}</h2>
          <p>${meta.body}</p>
        </div>
      </section>

      <footer class="contact scene" id="${contact.id}" aria-label="${contact.ariaLabel}" data-scene="contact" data-contact>
        <div class="contact-content">
          <a class="contact-email" href="mailto:${siteMeta.email}">${siteMeta.email}</a>
          <p class="social-row">
            ${siteMeta.socials.map((social) => `<a href="${social.href}" target="_blank" rel="noreferrer">${social.label}</a>`).join(' / ')}
          </p>
          <a class="resume-link" href="${resolvePublicUrl(siteMeta.resumeLink)}" target="_blank" rel="noreferrer">${contact.resumeLabel}</a>
        </div>
        <div class="horizon-glow" aria-hidden="true"></div>
      </footer>
    </main>

    <div class="project-viewer" data-project-viewer aria-hidden="true">
      <div class="project-viewer-bar">
        <span class="project-viewer-title" data-viewer-title></span>
        <button class="project-viewer-close" type="button" data-viewer-close aria-label="${projects.closeLabel}">
          <span>${projects.closeLabel}</span>
        </button>
      </div>
      <div class="project-viewer-scroll" data-viewer-scroll></div>
    </div>
  `
}
