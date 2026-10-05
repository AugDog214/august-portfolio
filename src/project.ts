import gsap from 'gsap'
import { archiveNumber, archiveProjects, projectHref, type ArchiveProject } from './archive-data'
import { subNavHtml, subPageLinks } from './chrome'
import { portfolioContent, siteMeta, type ProjectMedia } from './content'
import { layoutProjectStage } from './project-stage'
import { resolvePublicUrl } from './urls'
import { createCaseStudyViewer, renderProjectTools, viewerShellHtml } from './viewer'
import './styles.css'
import './archive.css'

/**
 * One project per page, laid out like the Selected Work section on the home
 * page: fixed centre frame with a blurred backdrop, editorial title, frosted
 * brief panel, and the View Project pill that opens the shared case-study viewer.
 * No carousel: Previous / Next links replace the thumbnail strip.
 */

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('App root not found.')

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const slug = new URL(window.location.href).searchParams.get('p') ?? ''
const index = archiveProjects.findIndex((project) => project.slug === slug)

if (index < 0) {
  // unknown or missing project: the archive is the right place to land
  window.location.replace('./archive.html')
} else {
  renderProject(archiveProjects[index], index)
}

function kindLine(project: ArchiveProject) {
  return project.kind === 'Client' ? 'Client work' : `${project.kind} work`
}

function renderProject(project: ArchiveProject, at: number) {
  const total = archiveProjects.length
  const prev = archiveProjects[(at - 1 + total) % total]
  const next = archiveProjects[(at + 1) % total]
  const labels = portfolioContent.projects

  document.title = `${project.name} | ${siteMeta.name}`
  document.querySelector('meta[name="description"]')?.setAttribute('content', project.blurb)
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${siteMeta.siteUrl}project.html?p=${project.slug}`)

  app!.innerHTML = `
    <div class="grain" aria-hidden="true"></div>
    ${subNavHtml({ brand: 'Archive', brandHref: './archive.html', light: true, current: 'Archive' })}

    <main>
      <section class="projects scene project-page" aria-label="${project.name}" data-projects>
        <div class="projects-grain" aria-hidden="true"></div>
        <div class="projects-inner">
          <header class="projects-head">
            <p class="projects-eyebrow"><a class="pp-back" href="./archive.html"><span aria-hidden="true">&larr;</span> Back to archive</a><span class="pp-where">${archiveNumber(at)} / ${archiveNumber(total - 1)} &middot; ${kindLine(project)}</span></p>
            <h1 class="projects-title">${project.name}</h1>
          </header>

          <div class="pf-stage" data-pf-stage>
            <a class="pp-step pp-step--prev" href="${projectHref(prev.slug)}" rel="prev" aria-label="Previous project: ${prev.name}">
              <span class="pp-step-arrow" aria-hidden="true">&larr;</span>
              <span class="pp-step-text"><span class="pp-step-label">Previous</span><span class="pp-step-name">${prev.name}</span></span>
            </a>

            <div class="pf-frame" data-pf-frame style="--accent: ${project.accent}">
              <div class="pf-backdrop" data-pf-backdrop aria-hidden="true"></div>
              <div class="pf-media" data-pf-media></div>
              <span class="pf-frameline" aria-hidden="true"></span>
              <button class="pf-mute" type="button" data-pf-mute aria-label="Unmute" hidden>
                <span class="pf-mute-icon" data-pf-mute-icon aria-hidden="true">&#128263;</span>
              </button>
            </div>

            <button class="project-view" type="button" data-view-project>
              <span>${labels.viewLabel}</span>
              <span class="project-view-arrow" aria-hidden="true">&rarr;</span>
            </button>

            <a class="pp-step pp-step--next" href="${projectHref(next.slug)}" rel="next" aria-label="Next project: ${next.name}">
              <span class="pp-step-text"><span class="pp-step-label">Next</span><span class="pp-step-name">${next.name}</span></span>
              <span class="pp-step-arrow" aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>

        <aside class="project-glass" data-project-glass>
          <div class="project-glass-inner">
            <div class="project-brief-main">
              <p class="project-glass-tag">${project.tag}</p>
              <h2 class="project-glass-name">${project.name}</h2>
              <p class="project-glass-blurb">${project.blurb}</p>
            </div>
            <dl class="project-brief-meta">
              <div class="project-brief-row project-brief-row--client">
                <dt>Client</dt>
                <dd>${project.client}</dd>
              </div>
              <div class="project-brief-row">
                <dt>My Role</dt>
                <dd>${project.role}</dd>
              </div>
              <div class="project-brief-row">
                <dt>Year</dt>
                <dd>${project.year}</dd>
              </div>
              ${
                project.tools.length
                  ? `<div class="project-brief-row project-brief-row--tools">
                <dt>Tools</dt>
                <dd><ul class="project-tools" aria-label="Project tools">${renderProjectTools(project.tools)}</ul></dd>
              </div>`
                  : ''
              }
            </dl>
          </div>
        </aside>
      </section>
    </main>

    ${viewerShellHtml(subPageLinks, labels.closeLabel)}
  `

  const section = document.querySelector<HTMLElement>('[data-projects]')
  const stage = document.querySelector<HTMLElement>('[data-pf-stage]')
  const frame = document.querySelector<HTMLElement>('[data-pf-frame]')
  const glass = document.querySelector<HTMLElement>('[data-project-glass]')
  const openButton = document.querySelector<HTMLElement>('[data-view-project]')
  if (!section || !stage || !frame || !glass || !openButton) return

  const layout = () => layoutProjectStage(section, stage, frame, glass)
  layout()
  window.addEventListener('resize', layout)
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(glass)
  document.fonts?.ready.then(layout).catch(() => undefined)

  const media = mountFrameMedia(project)

  const viewer = createCaseStudyViewer({
    items: archiveProjects,
    nextLabel: labels.nextLabel,
    reducedMotion: prefersReducedMotion,
    clipFrom: () => frame,
    onOpen: () => media.pause(),
    onClose: (viewIndex, openedIndex) => {
      // paged to another project inside the viewer: go to that project's own page
      if (viewIndex !== openedIndex) window.location.href = projectHref(archiveProjects[viewIndex].slug)
      else media.resume()
    },
  })
  if (viewer) openButton.addEventListener('click', () => viewer.open(at))

  // arrow keys step through the archive (not while the viewer is open)
  document.addEventListener('keydown', (event) => {
    if (viewer?.isOpen() || event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key === 'ArrowLeft') window.location.href = projectHref(prev.slug)
    if (event.key === 'ArrowRight') window.location.href = projectHref(next.slug)
  })

  if (!prefersReducedMotion) {
    gsap.from('.project-page .pf-frame, .project-page .project-view', { autoAlpha: 0, y: 26, duration: 0.7, ease: 'power3.out', stagger: 0.08, clearProps: 'transform,opacity,visibility' })
    gsap.from('.project-page .projects-head, .project-page .pp-step', { autoAlpha: 0, duration: 0.6, delay: 0.15, ease: 'power2.out', clearProps: 'opacity,visibility' })
    gsap.from(glass, { autoAlpha: 0, duration: 0.7, delay: 0.1, ease: 'power2.out', clearProps: 'opacity,visibility' })
  }
}

/** Cover image, muted looping video (with an unmute toggle), or cycling slides, over a blurred copy of itself. */
function mountFrameMedia(project: ArchiveProject) {
  const backdrop = document.querySelector<HTMLElement>('[data-pf-backdrop]')
  const box = document.querySelector<HTMLElement>('[data-pf-media]')
  const muteBtn = document.querySelector<HTMLButtonElement>('[data-pf-mute]')
  const muteIcon = document.querySelector<HTMLElement>('[data-pf-mute-icon]')
  const none = { pause: () => undefined, resume: () => undefined }
  if (!backdrop || !box) return none

  const cover: ProjectMedia = project.cover
  const still = cover.kind === 'video' ? cover.poster ?? cover.src : cover.src
  let video: HTMLVideoElement | null = null
  let soundOn = false
  let timer = 0

  const showImage = (src: string) => {
    box.innerHTML = ''
    const img = document.createElement('img')
    img.className = 'pf-img'
    img.src = resolvePublicUrl(src)
    img.alt = project.name
    box.appendChild(img)
    backdrop.style.backgroundImage = `url("${resolvePublicUrl(src)}")`
  }

  if (cover.kind === 'video' && !prefersReducedMotion) {
    backdrop.style.backgroundImage = `url("${resolvePublicUrl(still)}")`
    video = document.createElement('video')
    video.className = 'pf-video'
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.preload = 'auto'
    if (cover.poster) video.poster = resolvePublicUrl(cover.poster)
    const source = document.createElement('source')
    source.src = resolvePublicUrl(cover.src)
    source.type = 'video/mp4'
    video.appendChild(source)
    box.appendChild(video)
    void video.play().catch(() => undefined)
    if (muteBtn && muteIcon) {
      muteBtn.hidden = false
      muteBtn.addEventListener('click', () => {
        if (!video) return
        soundOn = !soundOn
        video.muted = !soundOn
        muteIcon.innerHTML = soundOn ? '&#128266;' : '&#128263;'
        muteBtn.setAttribute('aria-label', soundOn ? 'Mute' : 'Unmute')
        muteBtn.classList.toggle('is-on', soundOn)
      })
    }
  } else {
    const slides = project.slides
    showImage(slides?.[0]?.src ?? still)
    if (slides && slides.length > 1 && !prefersReducedMotion) {
      let at = 0
      const start = () => {
        timer = window.setInterval(() => {
          at = (at + 1) % slides.length
          showImage(slides[at].src)
        }, portfolioContent.projects.autoMs / 2)
      }
      start()
      return { pause: () => window.clearInterval(timer), resume: start }
    }
  }

  return {
    pause: () => video?.pause(),
    resume: () => void video?.play().catch(() => undefined),
  }
}
