import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { astroSequence, portfolioContent, projectToolMap, siteMeta, type ProjectMedia, type ProjectToolKey } from './content'
import { renderSite } from './render'
import { resolvePublicUrl } from './urls'
import './styles.css'

const app = document.querySelector<HTMLDivElement>('#app')
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!app) {
  throw new Error('App root not found.')
}

gsap.registerPlugin(ScrollTrigger)
gsap.defaults({ ease: 'none' })

const pinDistance = (viewportHeights: number) => () => `+=${Math.max(1, Math.round(window.innerHeight * viewportHeights))}`
const renderProjectTools = (tools: readonly ProjectToolKey[]) =>
  tools
    .map((toolKey) => {
      const tool = projectToolMap[toolKey]

      return `<li class="project-tool">
        <img src="${resolvePublicUrl(tool.icon)}" alt="${tool.label}" title="${tool.label}" loading="lazy" decoding="async" />
      </li>`
    })
    .join('')

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

window.scrollTo(0, 0)
app.innerHTML = renderSite()
setDocumentMeta()
initNav()

if (prefersReducedMotion) {
  initReducedMotionFallback()
  initProjects()
} else {
  initHero()
  initReveal()
  initProjects()
  initHorizontalFlow()
  initIris()
  initBuild()
  initMeta()
  initAbout()
}

initProjectViewer()

window.addEventListener('load', () => ScrollTrigger.refresh())
document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined)

function setDocumentMeta() {
  document.title = `${siteMeta.name} | ${siteMeta.role}`
  upsertMeta('name', 'description', siteMeta.description)
  upsertMeta('name', 'theme-color', '#141416')
  upsertMeta('property', 'og:title', `${siteMeta.name} | ${siteMeta.role}`)
  upsertMeta('property', 'og:description', siteMeta.description)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:url', siteMeta.siteUrl)
  // share images must be absolute URLs for crawlers
  upsertMeta('property', 'og:image', `${siteMeta.siteUrl}${siteMeta.ogImage}`)
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:image', `${siteMeta.siteUrl}${siteMeta.ogImage}`)
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let meta = document.head.querySelector(`meta[${attribute}="${key}"]`)

  if (!(meta instanceof HTMLMetaElement)) {
    meta = document.createElement('meta')
    meta.setAttribute(attribute, key)
    document.head.appendChild(meta)
  }

  meta.setAttribute('content', content)
}

function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]')

  if (!nav) {
    return
  }

  const update = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50)
  }

  update()
  window.addEventListener('scroll', update, { passive: true })
}

function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]')
  const identity = document.querySelector<HTMLElement>('[data-hero-identity]')
  const navBrand = document.querySelector<HTMLElement>('[data-nav-brand]')
  const progress = document.querySelector<HTMLElement>('[data-hero-progress]')
  const frameController = initHeroFrames()

  if (!hero || !identity || !progress) {
    return
  }

  gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })
  gsap.set(navBrand, {
    x: () => getPortfolioIntroX(),
    transformOrigin: 'left center',
  })

  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: pinDistance(2),
    pin: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const fade = smoothstep(mapProgress(self.progress, 0.12, 0.76))
      const imageProgress = smoothstep(self.progress)
      const portfolioSettle = smoothstep(mapProgress(self.progress, 0.02, 0.42))
      const portfolioLift = 1 - portfolioSettle

      gsap.set(progress, { scaleX: self.progress })
      // the bar lives inside the hero, so once the pin releases it would ride up
      // the screen as a stray copper line — fade it out as the pin completes
      gsap.set(progress.parentElement, { autoAlpha: 1 - smoothstep(mapProgress(self.progress, 0.9, 1)) })
      gsap.set(navBrand, {
        x: getPortfolioIntroX() * portfolioLift,
      })
      gsap.set(identity, {
        autoAlpha: 1 - fade,
        y: -34 * fade,
      })

      frameController?.sync(imageProgress)
    },
  })
}

type HeroFrameController = {
  sync: (progress: number) => void
}

function initHeroFrames(): HeroFrameController | null {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]')
  const poster = document.querySelector<HTMLElement>('[data-hero-poster]')

  if (!canvas) {
    return null
  }

  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  const frames: HTMLImageElement[] = []
  let currentFrame = 0
  let currentProgress = 0

  const resizeCanvas = () => {
    const ratio = window.devicePixelRatio || 1
    const width = Math.max(1, Math.floor(canvas.clientWidth * ratio))
    const height = Math.max(1, Math.floor(canvas.clientHeight * ratio))

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
  }

  const draw = (image: HTMLImageElement) => {
    resizeCanvas()
    context.clearRect(0, 0, canvas.width, canvas.height)

    const canvasRatio = canvas.width / canvas.height
    const imageRatio = image.naturalWidth / image.naturalHeight
    let drawWidth = canvas.width
    let drawHeight = canvas.height
    let drawX = 0
    let drawY = 0

    if (imageRatio > canvasRatio) {
      drawHeight = canvas.height
      drawWidth = drawHeight * imageRatio
      drawX = (canvas.width - drawWidth) / 2
    } else {
      drawWidth = canvas.width
      drawHeight = drawWidth / imageRatio
      drawY = (canvas.height - drawHeight) / 2
    }

    context.drawImage(image, drawX, drawY, drawWidth, drawHeight)
  }

  const resolveLoadedFrame = (targetIndex: number) => {
    if (frames[targetIndex]) {
      return targetIndex
    }

    if (frames[currentFrame]) {
      return currentFrame
    }

    for (let offset = 1; offset < astroSequence.frameCount; offset += 1) {
      const previousIndex = targetIndex - offset
      const nextIndex = targetIndex + offset

      if (previousIndex >= 0 && frames[previousIndex]) {
        return previousIndex
      }

      if (nextIndex < astroSequence.frameCount && frames[nextIndex]) {
        return nextIndex
      }
    }

    return -1
  }

  const drawFrame = (progress: number, force = false) => {
    currentProgress = progress
    const targetIndex = Math.min(
      astroSequence.frameCount - 1,
      Math.max(0, Math.floor(progress * (astroSequence.frameCount - 1))),
    )
    const loadedIndex = resolveLoadedFrame(targetIndex)
    const image = frames[loadedIndex]

    if (!image) {
      return
    }

    if (!force && loadedIndex === currentFrame && canvas.classList.contains('is-ready')) {
      return
    }

    currentFrame = loadedIndex
    canvas.classList.add('is-ready')
    poster?.classList.add('is-hidden')
    draw(image)
  }

  void preloadFrames(frames, () => drawFrame(currentProgress))
  window.addEventListener('resize', () => drawFrame(currentProgress, true))

  return {
    sync: drawFrame,
  }
}

async function preloadFrames(frames: HTMLImageElement[], drawCurrentFrame: () => void) {
  const batchSize = 16

  for (let start = 0; start < astroSequence.frameCount; start += batchSize) {
    const end = Math.min(start + batchSize, astroSequence.frameCount)
    const batch: Promise<void>[] = []

    for (let index = start; index < end; index += 1) {
      batch.push(
        loadFrame(index)
          .then((image) => {
            frames[index] = image
          })
          .catch((error: unknown) => {
            console.warn(error)
          }),
      )
    }

    await Promise.all(batch)
    drawCurrentFrame()
  }
}

function loadFrame(index: number) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.src = resolvePublicUrl(`${astroSequence.framePath}${String(index + 1).padStart(4, '0')}.webp`)
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Failed to load Astro frame ${index + 1}`))
  })
}

function initReducedMotionFallback() {
  const poster = document.querySelector<HTMLElement>('[data-hero-poster]')
  const heroProgress = document.querySelector<HTMLElement>('[data-hero-progress]')

  poster?.classList.remove('is-hidden')
  gsap.set(heroProgress, { scaleX: 1, transformOrigin: 'left center' })
  gsap.set('[data-reveal-banner], [data-reveal-artwork], [data-reveal-copy], [data-reveal-editorial], [data-build-copy], .device--secondary, .device--primary, [data-meta-copy]', {
    autoAlpha: 1,
    y: 0,
    scale: 1,
  })
  gsap.set('[data-horizontal-track]', { x: 0 })
  gsap.set('[data-film-inner]', { scale: 1 })
}

function initReveal() {
  const reveal = document.querySelector<HTMLElement>('[data-reveal]')
  const banner = document.querySelector<HTMLElement>('[data-reveal-banner]')
  const artwork = document.querySelector<HTMLElement>('[data-reveal-artwork]')
  const copy = document.querySelector<HTMLElement>('[data-reveal-copy]')
  const editorial = document.querySelector<HTMLElement>('[data-reveal-editorial]')
  const video = document.querySelector<HTMLVideoElement>('[data-reveal-video]')
  const brandInner = document.querySelector<HTMLElement>('[data-nav-brand-inner]')

  if (!reveal || !banner || !artwork || !copy || !editorial) {
    return
  }

  const playVideo = () => void video?.play().catch(() => undefined)

  // Choreography, measured in viewport-heights (u) from the moment the section is
  // 35% into view. The pin holds 1.5u; the pre-roll (0.65u) lets content start
  // arriving while the hero scrolls away, so there is no empty dark gap.
  //   0.05–0.85  artwork, banner, copy arrive
  //   0.70–1.00  editorial headline
  //   1.00–1.50  HOLD — clean dark, nothing from the next section
  //   1.50–1.80  content lifts + fades out
  //   1.80–2.15  only now does the beige wash rise (empty screen), nav flips
  const PRE_ROLL = 0.65
  const PIN = 1.5
  const TOTAL = PRE_ROLL + PIN
  const at = (u: number, from: number, to: number) => smoothstep(mapProgress(u, from, to))

  ScrollTrigger.create({
    trigger: reveal,
    start: 'top top',
    end: pinDistance(PIN),
    pin: true,
    invalidateOnRefresh: true,
  })

  ScrollTrigger.create({
    trigger: reveal,
    start: `top ${Math.round(PRE_ROLL * 100)}%`,
    end: () => `+=${Math.round(window.innerHeight * TOTAL)}`,
    invalidateOnRefresh: true,
    onEnter: playVideo,
    onEnterBack: playVideo,
    onLeave: () => video?.pause(),
    onLeaveBack: () => video?.pause(),
    onUpdate: (self) => {
      const u = self.progress * TOTAL
      const vh = window.innerHeight
      const artworkIn = at(u, 0.05, 0.75)
      const bannerIn = at(u, 0.15, 0.8)
      const copyIn = at(u, 0.3, 0.85)
      const editorialIn = at(u, 0.7, 1.0)
      const out = at(u, 1.5, 1.8)
      const wash = at(u, 1.8, 2.15)
      const brandFlip = at(u, 1.8, 2.1)
      const lift = -vh * 0.28 * out

      reveal.style.setProperty('--projects-wash', wash.toFixed(3))
      reveal.style.setProperty('--projects-bloom', wash.toFixed(3))
      gsap.set(banner, {
        autoAlpha: bannerIn * (1 - out),
        x: getRevealBannerIntroX(banner) * (1 - bannerIn),
        y: lift,
      })
      gsap.set(artwork, {
        autoAlpha: artworkIn * (1 - out),
        y: vh * 0.42 * (1 - artworkIn) + lift,
        scale: 0.96 + 0.04 * artworkIn,
      })
      // copy rises into place (it used to drop from above, straight through the ticker)
      gsap.set(copy, {
        autoAlpha: copyIn * (1 - out),
        y: 56 * (1 - copyIn) + lift,
      })
      gsap.set(editorial, {
        autoAlpha: editorialIn * (1 - out),
        y: 48 * (1 - editorialIn) + lift,
      })
      gsap.set(brandInner, { rotateX: 180 * brandFlip })
    },
  })
}

function initHorizontalFlow() {
  const section = document.querySelector<HTMLElement>('[data-horizontal-section]')
  const track = document.querySelector<HTMLElement>('[data-horizontal-track]')
  const filmInner = document.querySelector<HTMLElement>('[data-film-inner]')
  const filmVideo = document.querySelector<HTMLVideoElement>('[data-film-video]')

  if (!section || !track || !filmInner) {
    return
  }

  const horizontalDistance = () => Math.max(0, track.scrollWidth - window.innerWidth)
  const horizontalScrollDistance = () => Math.max(1, Math.round(Math.max(window.innerHeight * 2, horizontalDistance())))

  gsap.set(filmInner, { scale: 1.09 })

  gsap.to(track, {
    x: () => -horizontalDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${horizontalScrollDistance()}`,
      pin: true,
      scrub: 1.5,
      invalidateOnRefresh: true,
      onToggle: (self) => {
        if (!filmVideo) return
        if (self.isActive) void filmVideo.play().catch(() => undefined)
        else filmVideo.pause()
      },
      onUpdate: (self) => {
        const settle = smoothstep(mapProgress(self.progress, 0.78, 0.96))
        gsap.set(filmInner, { scale: 1.09 - 0.09 * settle })
      },
    },
  })
}

function initIris() {
  const iris = document.querySelector<HTMLElement>('[data-iris]')
  const bars = gsap.utils.toArray<HTMLElement>('.iris-bar')
  const topBottom = gsap.utils.toArray<HTMLElement>('.iris-bar--top, .iris-bar--bottom')
  const leftRight = gsap.utils.toArray<HTMLElement>('.iris-bar--left, .iris-bar--right')
  const glow = document.querySelector<HTMLElement>('[data-iris-glow]')
  const content = iris?.querySelector<HTMLElement>('.iris-content')

  if (!iris || !bars.length || !glow || !content) {
    return
  }

  // The iris now starts CLOSED (reads as the same charcoal as the film panel above)
  // and opens once onto the headline. Before, it showed the headline, closed over it,
  // then reopened onto the same headline — ~3 screens of repeat.
  gsap.set(topBottom, { scaleY: 1 })
  gsap.set(leftRight, { scaleX: 1 })
  gsap.set(glow, { autoAlpha: 0 })

  ScrollTrigger.create({ trigger: iris, start: 'top top', end: pinDistance(2), pin: true, invalidateOnRefresh: true })

  // starts opening while the section is still sliding in (top at 55%) so the
  // closed iris never sits on screen as an empty dark frame
  gsap
    .timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: iris,
        start: 'top 55%',
        end: () => `+=${Math.round(window.innerHeight * 1.55)}`,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })
    // glow only once the section fills the screen (~0.35) so its edge never shows as a band
    .to(glow, { autoAlpha: 1, duration: 0.16, ease: 'power1.out' }, 0.3)
    .to(topBottom, { scaleY: 0, duration: 0.42 }, 0.32)
    .to(leftRight, { scaleX: 0, duration: 0.42 }, 0.32)
    .fromTo(content, { scale: 0.94, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.38 }, 0.38)
    .to(glow, { autoAlpha: 0, duration: 0.3, ease: 'power1.in' }, 0.62)
    .to({}, { duration: 0.08 }, 0.92)
}

function initBuild() {
  const build = document.querySelector<HTMLElement>('[data-build]')
  const copy = document.querySelector<HTMLElement>('[data-build-copy]')
  const stack = document.querySelector<HTMLElement>('[data-device-stack]')

  if (!build || !copy || !stack) {
    return
  }

  ScrollTrigger.create({ trigger: build, start: 'top top', end: pinDistance(1.8), pin: true, invalidateOnRefresh: true })

  // arrive while the section scrolls in, so the screen is never empty
  gsap
    .timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: { trigger: build, start: 'top 72%', end: 'top 8%', scrub: 0.8, invalidateOnRefresh: true },
    })
    .fromTo(copy, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.55 }, 0)
    .fromTo('.device--secondary', { autoAlpha: 0, y: 90 }, { autoAlpha: 0.5, y: 0, duration: 0.6 }, 0.15)
    .fromTo('.device--primary', { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.3)

  gsap.to(stack, {
    y: -28,
    ease: 'none',
    scrollTrigger: { trigger: build, start: 'top top', end: pinDistance(1.8), scrub: 1.2, invalidateOnRefresh: true },
  })
}

function initMeta() {
  const meta = document.querySelector<HTMLElement>('[data-meta]')
  const copy = document.querySelector<HTMLElement>('[data-meta-copy]')

  if (!meta || !copy) {
    return
  }

  ScrollTrigger.create({ trigger: meta, start: 'top top', end: pinDistance(1.6), pin: true, invalidateOnRefresh: true })

  gsap.fromTo(
    copy,
    { autoAlpha: 0, y: 42, scale: 0.96 },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: meta, start: 'top 68%', end: 'top 10%', scrub: 0.8, invalidateOnRefresh: true },
    },
  )
  gsap.to(copy, {
    autoAlpha: 0,
    y: -28,
    ease: 'power1.in',
    immediateRender: false,
    scrollTrigger: {
      trigger: meta,
      start: () => `top+=${Math.round(window.innerHeight * 1.15)} top`,
      end: () => `top+=${Math.round(window.innerHeight * 1.6)} top`,
      scrub: 0.8,
      invalidateOnRefresh: true,
    },
  })
}

// About is a normal-flow section (no pin): each block fades up once as it enters.
function initAbout() {
  gsap.utils.toArray<HTMLElement>('[data-about-reveal]').forEach((block, index) => {
    gsap.fromTo(
      block,
      { autoAlpha: 0, y: 36 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        delay: index * 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: block, start: 'top 86%', once: true },
      },
    )
  })
}

function initProjects() {
  const section = document.querySelector<HTMLElement>('[data-projects]')
  const stage = document.querySelector<HTMLElement>('[data-pf-stage]')
  const strip = document.querySelector<HTMLElement>('[data-pf-strip]')
  const thumbs = gsap.utils.toArray<HTMLElement>('[data-pf-thumb]')
  const frame = document.querySelector<HTMLElement>('[data-pf-frame]')
  const backdrop = document.querySelector<HTMLElement>('[data-pf-backdrop]')
  const mediaBox = document.querySelector<HTMLElement>('[data-pf-media]')
  const progress = document.querySelector<HTMLElement>('[data-pf-progress]')
  const muteBtn = document.querySelector<HTMLButtonElement>('[data-pf-mute]')
  const muteIcon = document.querySelector<HTMLElement>('[data-pf-mute-icon]')
  const titleEl = document.querySelector<HTMLElement>('[data-projects-title]')
  const projectsHead = section?.querySelector<HTMLElement>('.projects-head')
  const glass = document.querySelector<HTMLElement>('[data-project-glass]')
  const glassTag = document.querySelector<HTMLElement>('[data-glass-tag]')
  const glassName = document.querySelector<HTMLElement>('[data-glass-name]')
  const glassBlurb = document.querySelector<HTMLElement>('[data-glass-blurb]')
  const glassClient = document.querySelector<HTMLElement>('[data-glass-client]')
  const glassRole = document.querySelector<HTMLElement>('[data-glass-role]')
  const glassYear = document.querySelector<HTMLElement>('[data-glass-year]')
  const glassTools = document.querySelector<HTMLElement>('[data-glass-tools]')

  if (!section || !stage || !strip || thumbs.length === 0 || !frame || !backdrop || !mediaBox || !glass) {
    return
  }

  const items = portfolioContent.projects.items
  const count = items.length
  const autoMs = portfolioContent.projects.autoMs
  const cycles = 2 // scroll loops through all cards this many times before unpinning
  const maxPos = cycles * count
  let spacing = 1
  let thumbW = 0
  let stageCenter = 0
  let activeIndex = -1
  let currentVideo: HTMLVideoElement | null = null
  let soundOn = false
  let autoTween: gsap.core.Tween | null = null
  let autoScrolling = false
  let userIdleTimer = 0
  let slideTimer = 0
  // assigned once below, after the closures that read it are defined
  // eslint-disable-next-line prefer-const
  let trigger: ScrollTrigger | undefined

  const wrapDelta = (value: number) => {
    const m = ((value % count) + count) % count
    return m > count / 2 ? m - count : m
  }

  const viewerOpen = () => document.body.dataset.viewerOpen === 'true'

  const measure = () => {
    thumbW = thumbs[0].offsetWidth || 1
    spacing = thumbW * 1.18
    const glassWidth = window.innerWidth > 820 ? glass.offsetWidth : 0
    stageCenter = (stage.clientWidth - glassWidth) / 2
    frame.style.left = `${stageCenter}px`
  }

  const positionStrip = (pos: number) => {
    for (let i = 0; i < count; i += 1) {
      const dist = wrapDelta(i - pos)
      const ad = Math.abs(dist)
      gsap.set(thumbs[i], {
        x: stageCenter + dist * spacing - thumbW / 2,
        scale: gsap.utils.clamp(0.8, 1, 1 - ad * 0.05),
        autoAlpha: gsap.utils.clamp(0, 1, (count / 2 - ad) / 0.9),
        zIndex: Math.round(40 - ad),
      })
    }
  }

  const updateMuteUI = () => {
    if (!muteBtn || !muteIcon) return
    muteIcon.innerHTML = soundOn ? '&#128266;' : '&#128263;'
    muteBtn.setAttribute('aria-label', soundOn ? 'Mute' : 'Unmute')
    muteBtn.classList.toggle('is-on', soundOn)
  }

  const coverPoster = (cover: { kind: string; src: string; poster?: string }) =>
    cover.kind === 'video' ? cover.poster ?? cover.src : cover.src

  const renderFrameImage = (src: string, alt: string) => {
    mediaBox.innerHTML = ''
    const img = document.createElement('img')
    img.className = 'pf-img'
    img.src = resolvePublicUrl(src)
    img.alt = alt
    mediaBox.appendChild(img)
    backdrop.style.backgroundImage = `url("${resolvePublicUrl(src)}")`
  }

  const setActive = (index: number, immediate = false) => {
    if (index === activeIndex) return
    activeIndex = index
    window.clearInterval(slideTimer)
    const item = items[index]
    const cover = item.cover as { kind: string; src: string; poster?: string }
    const slides = (item as { slides?: { kind: string; src: string }[] }).slides
    glass.dataset.activeIndex = String(index)
    frame.style.setProperty('--accent', item.accent)
    backdrop.style.backgroundImage = `url("${resolvePublicUrl(coverPoster(cover))}")`

    mediaBox.innerHTML = ''
    if (cover.kind === 'video' && !prefersReducedMotion) {
      const video = document.createElement('video')
      video.className = 'pf-video'
      video.muted = !soundOn
      video.loop = true
      video.playsInline = true
      video.preload = 'auto'
      if (cover.poster) video.poster = resolvePublicUrl(cover.poster)
      const src = document.createElement('source')
      src.src = resolvePublicUrl(cover.src)
      src.type = 'video/mp4'
      video.appendChild(src)
      mediaBox.appendChild(video)
      currentVideo = video
      if (!viewerOpen()) video.play().catch(() => {})
      if (muteBtn) muteBtn.hidden = false
      updateMuteUI()
    } else {
      currentVideo = null
      if (muteBtn) muteBtn.hidden = true
      if (slides && slides.length > 1 && !prefersReducedMotion) {
        let si = 0
        renderFrameImage(slides[0].src, item.name)
        slideTimer = window.setInterval(() => {
          si = (si + 1) % slides.length
          renderFrameImage(slides[si].src, item.name)
        }, autoMs / slides.length)
      } else {
        renderFrameImage(coverPoster(cover), item.name)
      }
    }

    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('is-active', i === index)
      if (i === index) thumb.setAttribute('aria-current', 'true')
      else thumb.removeAttribute('aria-current')
    })

    const applyText = () => {
      if (titleEl) titleEl.textContent = item.name
      if (glassTag) glassTag.textContent = item.tag
      if (glassName) glassName.textContent = item.name
      if (glassBlurb) glassBlurb.textContent = item.blurb
      if (glassClient) glassClient.textContent = item.client
      if (glassRole) glassRole.textContent = item.role
      if (glassYear) glassYear.textContent = item.year
      if (glassTools) glassTools.innerHTML = renderProjectTools(item.tools)
      titleEl?.classList.remove('is-swapping')
      glass.classList.remove('is-swapping')
    }
    if (immediate) {
      applyText()
    } else {
      titleEl?.classList.add('is-swapping')
      glass.classList.add('is-swapping')
      window.setTimeout(applyText, 180)
    }
  }

  const clearAuto = () => {
    autoTween?.kill()
    autoTween = null
    if (progress) gsap.set(progress, { scaleX: 0 })
  }

  const startAuto = () => {
    // only auto-advance while the visitor is actually inside the pinned carousel —
    // otherwise the timer would scroll the page on its own from the hero.
    if (prefersReducedMotion || !progress || viewerOpen() || !trigger?.isActive) return
    clearAuto()
    gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })
    autoTween = gsap.to(progress, {
      scaleX: 1,
      duration: autoMs / 1000,
      ease: 'none',
      onComplete: () => autoNext(),
    })
  }

  const currentPos = () => (trigger?.progress ?? 0) * maxPos

  const scrollToPos = (pos: number) => {
    if (viewerOpen() || !trigger) return
    const clamped = gsap.utils.clamp(0, maxPos, pos)
    const target = trigger.start + (clamped / maxPos) * (trigger.end - trigger.start)
    autoScrolling = true
    clearAuto()
    const obj = { y: window.scrollY }
    gsap.to(obj, {
      y: target,
      duration: 0.7,
      ease: 'power2.inOut',
      onUpdate: () => window.scrollTo(0, obj.y),
      onComplete: () => {
        autoScrolling = false
        startAuto()
      },
    })
  }

  // auto-advance: step forward one card. At the end of the pin, stop and let the
  // visitor scroll on — never yank them back up to the start of the section.
  const autoNext = () => {
    if (!trigger?.isActive) return
    const next = Math.round(currentPos()) + 1
    if (next >= maxPos) {
      clearAuto()
      return
    }
    scrollToPos(next)
  }

  // jump to the nearest occurrence of a card index (covers appear twice across the loops)
  const gotoIndex = (index: number) => {
    const cur = currentPos()
    let best = index
    let bestDist = Infinity
    for (let c = index; c <= maxPos; c += count) {
      const d = Math.abs(c - cur)
      if (d < bestDist) {
        bestDist = d
        best = c
      }
    }
    scrollToPos(best)
  }

  measure()
  setActive(0, true)
  positionStrip(0)
  strip.classList.add('is-ready')

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => gotoIndex(index))
  })
  muteBtn?.addEventListener('click', () => {
    soundOn = !soundOn
    if (currentVideo) currentVideo.muted = !soundOn
    updateMuteUI()
  })
  stage.addEventListener('pointerenter', () => autoTween?.pause())
  stage.addEventListener('pointerleave', () => autoTween?.resume())
  section.addEventListener('pf:pause', () => {
    clearAuto()
    currentVideo?.pause()
  })
  section.addEventListener('pf:resume', () => {
    startAuto()
    if (!prefersReducedMotion) currentVideo?.play().catch(() => {})
  })
  section.addEventListener('pf:goto', (event) => {
    const index = (event as CustomEvent<number>).detail
    if (prefersReducedMotion || !trigger) setActive(index, true)
    else gotoIndex(index)
  })

  if (prefersReducedMotion) {
    return
  }

  // Entry: the section rises in on its own (no full-screen wipe). The cards land
  // first, then the title, then the brief panel — each eased, scrubbed with a
  // little lag so it glides instead of tracking the wheel 1:1.
  const entry = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: {
      trigger: section,
      start: 'top 92%',
      end: 'top top',
      scrub: 0.8,
      invalidateOnRefresh: true,
    },
  })
  entry.fromTo(
    stage,
    { autoAlpha: 0, y: () => Math.min(window.innerHeight * 0.16, 140), scale: 0.94 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.6 },
    0,
  )
  if (projectsHead) {
    entry.fromTo(projectsHead, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.3)
  }
  entry.fromTo(
    glass,
    { autoAlpha: 0, y: () => Math.min(window.innerHeight * 0.12, 110) },
    { autoAlpha: 1, y: 0, duration: 0.5 },
    0.45,
  )

  trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: pinDistance(4 * cycles),
    pin: true,
    invalidateOnRefresh: true,
    onRefreshInit: measure,
    onUpdate: (self) => {
      const pos = self.progress * maxPos
      positionStrip(pos)
      setActive(Math.round(pos) % count)
      if (!autoScrolling) {
        clearAuto()
        window.clearTimeout(userIdleTimer)
        if (self.isActive) userIdleTimer = window.setTimeout(startAuto, 900)
      }
    },
    onToggle: (self) => {
      if (self.isActive) {
        startAuto()
        if (!viewerOpen()) currentVideo?.play().catch(() => {})
      } else {
        clearAuto()
        window.clearTimeout(userIdleTimer)
        currentVideo?.pause()
      }
    },
  })

  window.addEventListener('resize', () => {
    measure()
    positionStrip(currentPos())
  })
}

function initProjectViewer() {
  const viewer = document.querySelector<HTMLElement>('[data-project-viewer]')
  const scroll = document.querySelector<HTMLElement>('[data-viewer-scroll]')
  const titleEl = document.querySelector<HTMLElement>('[data-viewer-title]')
  const openButton = document.querySelector<HTMLElement>('[data-view-project]')
  const closeButton = document.querySelector<HTMLElement>('[data-viewer-close]')
  const glass = document.querySelector<HTMLElement>('[data-project-glass]')
  const frame = document.querySelector<HTMLElement>('[data-pf-frame]')
  const section = document.querySelector<HTMLElement>('[data-projects]')

  if (!viewer || !scroll || !openButton || !closeButton || !glass) {
    return
  }

  const items = portfolioContent.projects.items
  const countEl = document.querySelector<HTMLElement>('[data-viewer-count]')
  let lastFocused: HTMLElement | null = null
  let isOpen = false
  let viewIndex = 0
  let openedIndex = 0

  const pad = (n: number) => String(n).padStart(2, '0')

  const panelHtml = (media: ProjectMedia, name: string, eager = false) => {
    const caption = media.caption ? `<figcaption class="viewer-caption">${media.caption}</figcaption>` : ''
    const inner =
      media.kind === 'video'
        ? `<video src="${resolvePublicUrl(media.src)}"${media.poster ? ` poster="${resolvePublicUrl(media.poster)}"` : ''} controls playsinline preload="metadata"></video>`
        : `<img src="${resolvePublicUrl(media.src)}" alt="${media.caption ?? name}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" />`
    const mod = media.kind === 'video' ? ' viewer-panel--video' : media.pan ? ' viewer-panel--pan' : ''
    return `<figure class="viewer-figure">
      <div class="viewer-panel${mod}">${inner}</div>
      ${caption}
    </figure>`
  }

  const blockHtml = (label: string, body: string, n: number) => `
    <section class="cs-block">
      <h3 class="cs-label"><span class="cs-num">${pad(n)}</span>${label}</h3>
      <p class="cs-body">${body}</p>
    </section>`

  const renderCaseStudy = (index: number) => {
    const item = items[index]
    const next = items[(index + 1) % items.length]
    const sections = item.caseStudy
    const gallery = item.gallery
    const flow: string[] = [panelHtml(item.cover, item.name, true)]

    // interleave: two copy blocks, then a gallery image — keeps the read editorial
    let g = 0
    sections.forEach((section, i) => {
      flow.push(blockHtml(section.label, section.body, i + 1))
      if (i % 2 === 1 && g < gallery.length) flow.push(panelHtml(gallery[g++], item.name))
    })
    while (g < gallery.length) flow.push(panelHtml(gallery[g++], item.name))

    scroll.innerHTML = `
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
            <div class="cs-meta-tools"><dt>Tools</dt><dd><ul class="project-tools" aria-label="Project tools">${renderProjectTools(item.tools)}</ul></dd></div>
          </dl>
        </header>
        <div class="cs-flow">${flow.join('')}</div>
        <footer class="cs-next" style="--next-accent: ${next.accent}">
          <button class="cs-next-link" type="button" data-viewer-next aria-label="${portfolioContent.projects.nextLabel}: ${next.name}">
            <span class="cs-next-label">${portfolioContent.projects.nextLabel} &mdash; ${pad(((index + 1) % items.length) + 1)} / ${pad(items.length)}</span>
            <span class="cs-next-title"><span class="cs-next-name">${next.name}</span><span class="cs-next-arrow" aria-hidden="true">&rarr;</span></span>
            <span class="cs-next-peek" aria-hidden="true">
              <img src="${resolvePublicUrl(next.cover.kind === 'video' ? next.cover.poster ?? next.cover.src : next.cover.src)}" alt="" loading="lazy" decoding="async" />
            </span>
          </button>
        </footer>
      </article>`

    if (titleEl) titleEl.textContent = item.name
    if (countEl) countEl.textContent = `${pad(index + 1)} / ${pad(items.length)}`
    scroll.scrollTop = 0
    viewIndex = index

    scroll.querySelector<HTMLElement>('[data-viewer-next]')?.addEventListener('click', () => {
      scroll.querySelectorAll('video').forEach((video) => video.pause())
      renderCaseStudy((viewIndex + 1) % items.length)
    })
  }

  const open = () => {
    if (isOpen) {
      return
    }

    const index = Number(glass.dataset.activeIndex ?? '0')
    openedIndex = index
    renderCaseStudy(index)

    lastFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    document.body.dataset.viewerOpen = 'true'
    section?.dispatchEvent(new CustomEvent('pf:pause'))
    viewer.setAttribute('aria-hidden', 'false')
    viewer.classList.add('is-open')
    isOpen = true

    if (prefersReducedMotion || !frame) {
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

  const close = () => {
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
    section?.dispatchEvent(new CustomEvent('pf:resume'))
    // if the visitor paged to another project inside the viewer, land the carousel on it
    if (viewIndex !== openedIndex) {
      section?.dispatchEvent(new CustomEvent('pf:goto', { detail: viewIndex }))
    }
    lastFocused?.focus?.({ preventScroll: true })
  }

  openButton.addEventListener('click', open)
  closeButton.addEventListener('click', close)
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) {
      close()
    }
  })
}

function mapProgress(progress: number, start: number, end: number) {
  if (end === start) {
    return progress >= end ? 1 : 0
  }

  return gsap.utils.clamp(0, 1, (progress - start) / (end - start))
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value)
}

function getPortfolioIntroX() {
  return window.innerWidth + 24
}

function getRevealBannerIntroX(element?: HTMLElement) {
  const bannerWidth = element?.getBoundingClientRect().width ?? window.innerWidth

  return window.innerWidth * 0.5 + bannerWidth * 0.5 + 32
}
