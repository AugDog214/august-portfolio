import gsap from 'gsap'
import { projectToolMap, type Project, type ProjectMedia, type ProjectToolKey } from './content'
import { resolvePublicUrl } from './urls'

/**
 * The full-screen case-study viewer, shared by the home carousel and the
 * archive's project pages. Each page supplies its own list of projects and a few
 * hooks (what to pause, where the open animation starts, what to do on close).
 */

const pad = (n: number) => String(n).padStart(2, '0')

export const renderProjectTools = (tools: readonly ProjectToolKey[]) =>
  tools
    .map((toolKey) => {
      const tool = projectToolMap[toolKey]

      return `<li class="project-tool">
        <img src="${resolvePublicUrl(tool.icon)}" alt="${tool.label}" title="${tool.label}" loading="lazy" decoding="async" />
      </li>`
    })
    .join('')

/** The dialog shell (bar + scroll area). Links are the site's nav links. */
export const viewerShellHtml = (links: readonly { label: string; href: string }[], closeLabel: string) => `
    <div class="project-viewer" data-project-viewer role="dialog" aria-modal="true" aria-labelledby="viewer-title" aria-hidden="true">
      <div class="project-viewer-bar">
        <span class="project-viewer-count" data-viewer-count aria-hidden="true"></span>
        <span class="project-viewer-title" id="viewer-title" data-viewer-title></span>
        <nav class="project-viewer-links" aria-label="Site sections">
          ${links.map((link) => `<a href="${link.href}" data-viewer-link>${link.label}</a>`).join('')}
        </nav>
        <button class="project-viewer-close" type="button" data-viewer-close>
          <span>${closeLabel}</span>
          <span class="project-viewer-close-key" aria-hidden="true">Esc</span>
        </button>
      </div>
      <div class="project-viewer-scroll" data-viewer-scroll data-lenis-prevent></div>
    </div>
  `

export const panelHtml = (media: ProjectMedia, name: string, eager = false) => {
  const caption = media.caption ? `<figcaption class="viewer-caption">${media.caption}</figcaption>` : ''
  const inner =
    media.kind === 'video'
      ? `<video src="${resolvePublicUrl(media.src)}"${media.poster ? ` poster="${resolvePublicUrl(media.poster)}"` : ''} controls playsinline preload="metadata"></video>`
      : `<img src="${resolvePublicUrl(media.src)}" alt="${media.caption ?? name}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" />`
  const mod = media.kind === 'video' ? ' viewer-panel--video' : media.wide ? ' viewer-panel--wide' : media.pan ? ' viewer-panel--pan' : ''
  // a wide banner is always shown whole; on phones a swipeable close-up sits under it
  const zoom = media.wide
    ? `<div class="viewer-zoom" data-lenis-prevent><img src="${resolvePublicUrl(media.src)}" alt="" loading="lazy" decoding="async" /></div>`
    : ''
  // a known shape is applied up front; otherwise it is measured once the video loads
  const fit = media.kind === 'video' && media.aspect ? ` viewer-panel--fit${media.aspect < 1 ? ' viewer-panel--portrait' : ''}` : ''
  const shape = media.kind === 'video' && media.aspect ? ` style="--ar: ${media.aspect.toFixed(4)}"` : ''
  return `<figure class="viewer-figure${media.wide ? ' viewer-figure--wide' : ''}">
      <div class="viewer-panel${mod}${fit}"${shape}>${inner}</div>
      ${zoom}
      ${caption}
    </figure>`
}

export const blockHtml = (label: string, body: string, n: number) => `
    <section class="cs-block">
      <h3 class="cs-label"><span class="cs-num">${pad(n)}</span>${label}</h3>
      <p class="cs-body">${body}</p>
    </section>`

/** The <article class="cs"> for one project, with a link to the next one. */
export const caseStudyHtml = (item: Project, next: Project, nextNumber: number, total: number, nextLabel: string) => {
  const sections = item.caseStudy
  const gallery = item.gallery
  const flow: string[] = [panelHtml(item.viewer ?? item.cover, item.name, true)]

  // interleave: two copy blocks, then a gallery image — keeps the read editorial
  let g = 0
  sections.forEach((section, i) => {
    flow.push(blockHtml(section.label, section.body, i + 1))
    if (i % 2 === 1 && g < gallery.length) flow.push(panelHtml(gallery[g++], item.name))
  })
  while (g < gallery.length) flow.push(panelHtml(gallery[g++], item.name))

  return `
      <article class="cs" style="--accent: ${item.accent}">
        <header class="cs-intro">
          <div class="cs-intro-main">
            <p class="cs-tag">${item.tag}</p>
            <h2 class="cs-title">${item.name}</h2>
            <p class="cs-lede">${item.blurb}</p>
          </div>
          <dl class="cs-meta">
            <div><dt>Client</dt><dd>${item.client}</dd></div>
            <div><dt>My Role</dt><dd>${item.role}</dd></div>
            <div><dt>Year</dt><dd>${item.year}</dd></div>
            ${item.tools.length ? `<div class="cs-meta-tools"><dt>Tools</dt><dd><ul class="project-tools" aria-label="Project tools">${renderProjectTools(item.tools)}</ul></dd></div>` : ''}
            ${item.aiTools ? `<div><dt>AI Tools</dt><dd class="cs-meta-ai">${item.aiTools.join(' · ')}</dd></div>` : ''}
          </dl>
        </header>
        <div class="cs-flow">${flow.join('')}</div>
        <footer class="cs-next" style="--next-accent: ${next.accent}">
          <button class="cs-next-link" type="button" data-viewer-next aria-label="${nextLabel}: ${next.name}">
            <span class="cs-next-label">${nextLabel} &mdash; ${pad(nextNumber)} / ${pad(total)}</span>
            <span class="cs-next-title"><span class="cs-next-name">${next.name}</span><span class="cs-next-arrow" aria-hidden="true">&rarr;</span></span>
            <span class="cs-next-peek" aria-hidden="true">
              <img src="${resolvePublicUrl(next.cover.kind === 'video' ? next.cover.poster ?? next.cover.src : next.cover.src)}" alt="" loading="lazy" decoding="async" />
            </span>
          </button>
        </footer>
      </article>`
}

/** Size every video panel to the video itself, so a portrait piece never sits inside black side bars. */
export const fitVideoPanels = (root: HTMLElement) => {
  root.querySelectorAll<HTMLVideoElement>('.viewer-panel--video video').forEach((video) => {
    const fit = () => {
      if (!video.videoWidth || !video.videoHeight) return
      const panel = video.parentElement as HTMLElement
      panel.style.setProperty('--ar', String(video.videoWidth / video.videoHeight))
      panel.classList.add('viewer-panel--fit')
      panel.classList.toggle('viewer-panel--portrait', video.videoWidth < video.videoHeight)
    }
    if (video.readyState >= 1) fit()
    else video.addEventListener('loadedmetadata', fit, { once: true })
  })
}

export type CaseStudyViewerOptions = {
  items: readonly Project[]
  nextLabel: string
  reducedMotion: boolean
  /** the element the viewer opens out of (the carousel / project frame) */
  clipFrom?: () => HTMLElement | null
  /** called as the viewer opens: pause what's behind it */
  onOpen?: () => void
  /** called after it closes; `viewIndex` differs from `openedIndex` if the visitor paged */
  onClose?: (viewIndex: number, openedIndex: number) => void
}

export type CaseStudyViewer = {
  open: (index: number) => void
  /** `resync: false` closes without reporting the paged-to project */
  close: (resync?: boolean) => void
  isOpen: () => boolean
  root: HTMLElement
}

export function createCaseStudyViewer(options: CaseStudyViewerOptions): CaseStudyViewer | null {
  const viewer = document.querySelector<HTMLElement>('[data-project-viewer]')
  const scroll = document.querySelector<HTMLElement>('[data-viewer-scroll]')
  const titleEl = document.querySelector<HTMLElement>('[data-viewer-title]')
  const countEl = document.querySelector<HTMLElement>('[data-viewer-count]')
  const closeButton = document.querySelector<HTMLElement>('[data-viewer-close]')

  if (!viewer || !scroll || !closeButton) {
    return null
  }

  const { items } = options
  let lastFocused: HTMLElement | null = null
  let isOpen = false
  let viewIndex = 0
  let openedIndex = 0

  const renderCaseStudy = (index: number) => {
    const item = items[index]
    const nextIndex = (index + 1) % items.length

    scroll.innerHTML = caseStudyHtml(item, items[nextIndex], nextIndex + 1, items.length, options.nextLabel)
    fitVideoPanels(scroll)

    if (titleEl) titleEl.textContent = item.name
    if (countEl) countEl.textContent = `${pad(index + 1)} / ${pad(items.length)}`
    scroll.scrollTop = 0
    viewIndex = index

    scroll.querySelector<HTMLElement>('[data-viewer-next]')?.addEventListener('click', () => {
      scroll.querySelectorAll('video').forEach((video) => video.pause())
      renderCaseStudy((viewIndex + 1) % items.length)
      playLead()
    })
  }

  // The lead video starts the instant the viewer opens. This runs inside the click
  // that opened it, so the full ad is allowed to start with sound; short cover
  // loops play muted and loop. If the browser refuses sound, fall back to muted.
  const playLead = () => {
    const video = scroll.querySelector<HTMLVideoElement>('.cs-flow .viewer-panel--video video')
    if (!video) return
    const withSound = Boolean(items[viewIndex].viewer)
    video.preload = 'auto'
    video.loop = !withSound
    video.muted = !withSound
    void video.play().catch(() => {
      video.muted = true
      void video.play().catch(() => undefined)
    })
  }

  const open = (index: number) => {
    if (isOpen) {
      return
    }

    openedIndex = index
    renderCaseStudy(index)
    playLead()

    lastFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    document.body.dataset.viewerOpen = 'true'
    options.onOpen?.()
    viewer.setAttribute('aria-hidden', 'false')
    viewer.classList.add('is-open')
    isOpen = true

    const frame = options.clipFrom?.() ?? null
    if (options.reducedMotion || !frame) {
      gsap.set(viewer, { clipPath: 'inset(0px round 0px)' })
    } else {
      const rect = frame.getBoundingClientRect()
      const clip = {
        t: Math.max(0, rect.top),
        r: Math.max(0, window.innerWidth - rect.right),
        b: Math.max(0, window.innerHeight - rect.bottom),
        l: Math.max(0, rect.left),
        radius: 14,
      }
      const setClip = () => {
        gsap.set(viewer, {
          clipPath: `inset(${clip.t}px ${clip.r}px ${clip.b}px ${clip.l}px round ${clip.radius}px)`,
        })
      }
      setClip()
      gsap
        .timeline()
        .to(clip, { t: 0, b: 0, radius: 6, duration: 0.4, ease: 'power3.inOut', onUpdate: setClip })
        .to(clip, { l: 0, r: 0, radius: 0, duration: 0.46, ease: 'power3.inOut', onUpdate: setClip })
    }

    window.setTimeout(() => closeButton.focus(), 60)
  }

  const close = (resync = true) => {
    if (!isOpen) {
      return
    }
    isOpen = false
    viewer.classList.remove('is-open')
    viewer.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
    delete document.body.dataset.viewerOpen
    viewer.querySelectorAll('video').forEach((video) => video.pause())
    gsap.set(viewer, { clearProps: 'clipPath' })
    options.onClose?.(resync ? viewIndex : openedIndex, openedIndex)
    lastFocused?.focus?.({ preventScroll: true })
  }

  closeButton.addEventListener('click', () => close())
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) {
      close()
    }
  })

  return { open, close, isOpen: () => isOpen, root: viewer }
}
