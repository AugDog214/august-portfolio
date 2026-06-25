import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { astroSequence, portfolioContent, siteMeta } from './content'
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
  upsertMeta('property', 'og:image', resolvePublicUrl(siteMeta.ogImage))
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:image', resolvePublicUrl(siteMeta.ogImage))
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

  ScrollTrigger.create({
    trigger: reveal,
    start: 'top top',
    end: pinDistance(2.8),
    pin: true,
    invalidateOnRefresh: true,
    onEnter: playVideo,
    onEnterBack: playVideo,
    onLeave: () => video?.pause(),
    onUpdate: (self) => {
      const artworkIn = smoothstep(mapProgress(self.progress, 0.04, 0.3))
      const copyIn = smoothstep(mapProgress(self.progress, 0.08, 0.34))
      const editorialIn = smoothstep(mapProgress(self.progress, 0.3, 0.48))
      const out = smoothstep(mapProgress(self.progress, 0.68, 0.94))
      const brandFlip = smoothstep(mapProgress(self.progress, 0.78, 0.96))
      const viewportHeight = window.innerHeight

      gsap.set(banner, {
        autoAlpha: artworkIn * (1 - out),
        x: getRevealBannerIntroX(banner) * (1 - artworkIn),
        y: -viewportHeight * out,
      })
      gsap.set(artwork, {
        autoAlpha: artworkIn * (1 - out),
        y: viewportHeight * 1.08 * (1 - artworkIn) - viewportHeight * 1.12 * out,
        scale: 0.96 + 0.04 * artworkIn - 0.04 * out,
      })
      gsap.set(copy, {
        autoAlpha: copyIn * (1 - out),
        y: -viewportHeight * 0.92 * (1 - copyIn) - viewportHeight * out,
      })
      gsap.set(editorial, {
        autoAlpha: editorialIn * (1 - out),
        y: 72 * (1 - editorialIn) - viewportHeight * out,
      })
      gsap.set(brandInner, { rotateX: 180 * brandFlip })
    },
  })
}

function initHorizontalFlow() {
  const section = document.querySelector<HTMLElement>('[data-horizontal-section]')
  const track = document.querySelector<HTMLElement>('[data-horizontal-track]')
  const filmInner = document.querySelector<HTMLElement>('[data-film-inner]')

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

  if (!iris || !bars.length || !glow) {
    return
  }

  gsap.set(topBottom, { scaleY: 0 })
  gsap.set(leftRight, { scaleX: 0 })
  gsap.set(glow, { autoAlpha: 0 })

  gsap
    .timeline({
      scrollTrigger: {
        trigger: iris,
        start: 'top top',
        end: pinDistance(8),
        pin: true,
        scrub: 1.15,
        invalidateOnRefresh: true,
      },
    })
    .to(topBottom, { scaleY: 1, duration: 0.34 }, 0)
    .to(leftRight, { scaleX: 1, duration: 0.34 }, 0)
    .to(glow, { autoAlpha: 1, duration: 0.2 }, 0.28)
    .to(glow, { autoAlpha: 0, duration: 0.28 }, 0.48)
    .to(topBottom, { scaleY: 0, duration: 0.34 }, 0.54)
    .to(leftRight, { scaleX: 0, duration: 0.34 }, 0.54)
}

function initBuild() {
  const build = document.querySelector<HTMLElement>('[data-build]')
  const copy = document.querySelector<HTMLElement>('[data-build-copy]')
  const stack = document.querySelector<HTMLElement>('[data-device-stack]')

  if (!build || !copy || !stack) {
    return
  }

  gsap
    .timeline({
      scrollTrigger: {
        trigger: build,
        start: 'top top',
        end: pinDistance(4),
        pin: true,
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    })
    .fromTo(copy, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.22 }, 0.06)
    .fromTo('.device--secondary', { autoAlpha: 0, y: 90 }, { autoAlpha: 0.5, y: 0, duration: 0.28 }, 0.12)
    .fromTo('.device--primary', { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.32 }, 0.18)
    .to(stack, { y: -28, duration: 0.44 }, 0.52)
}

function initMeta() {
  const meta = document.querySelector<HTMLElement>('[data-meta]')
  const copy = document.querySelector<HTMLElement>('[data-meta-copy]')

  if (!meta || !copy) {
    return
  }

  gsap
    .timeline({
      scrollTrigger: {
        trigger: meta,
        start: 'top top',
        end: pinDistance(3),
        pin: true,
        scrub: 1.15,
        invalidateOnRefresh: true,
      },
    })
    .fromTo(copy, { autoAlpha: 0, y: 42, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.26 }, 0.08)
    .to(copy, { autoAlpha: 0, y: -28, duration: 0.16 }, 0.78)
}

function initProjects() {
  const section = document.querySelector<HTMLElement>('[data-projects]')
  const stage = document.querySelector<HTMLElement>('[data-projects-stage]')
  const track = document.querySelector<HTMLElement>('[data-projects-track]')
  const cards = gsap.utils.toArray<HTMLElement>('[data-project-card]')
  const titleEl = document.querySelector<HTMLElement>('[data-projects-title]')
  const glass = document.querySelector<HTMLElement>('[data-project-glass]')
  const glassTag = document.querySelector<HTMLElement>('[data-glass-tag]')
  const glassName = document.querySelector<HTMLElement>('[data-glass-name]')
  const glassBlurb = document.querySelector<HTMLElement>('[data-glass-blurb]')
  const glassPreview = document.querySelector<HTMLElement>('[data-glass-preview]')
  const glassPreviewNum = document.querySelector<HTMLElement>('[data-glass-preview-num]')

  if (!section || !stage || !track || cards.length === 0 || !glass) {
    return
  }

  const items = portfolioContent.projects.items
  const count = cards.length
  const loops = 1.25
  let spacing = 1
  let cardWidth = 0
  let stageCenter = 0
  let activeIndex = 0
  let swapTimer = 0

  const wrapDelta = (value: number) => {
    const m = ((value % count) + count) % count
    return m > count / 2 ? m - count : m
  }

  const measure = () => {
    cardWidth = cards[0].offsetWidth
    spacing = cardWidth * 1.24
    const glassWidth = window.innerWidth > 820 ? glass.offsetWidth : 0
    stageCenter = (stage.clientWidth - glassWidth) / 2
  }

  const updateFeatured = (index: number, immediate = false) => {
    const item = items[index]
    glass.dataset.activeIndex = String(index)

    const apply = () => {
      if (titleEl) titleEl.textContent = item.name
      if (glassTag) glassTag.textContent = item.tag
      if (glassName) glassName.textContent = item.name
      if (glassBlurb) glassBlurb.textContent = item.blurb
      if (glassPreview) glassPreview.style.setProperty('--accent', item.accent)
      if (glassPreviewNum) glassPreviewNum.textContent = String(index + 1).padStart(2, '0')
      titleEl?.classList.remove('is-swapping')
      glass.classList.remove('is-swapping')
    }

    if (immediate) {
      apply()
      return
    }

    titleEl?.classList.add('is-swapping')
    glass.classList.add('is-swapping')
    window.clearTimeout(swapTimer)
    swapTimer = window.setTimeout(apply, 200)
  }

  const layout = (pos: number) => {
    for (let i = 0; i < count; i += 1) {
      const dist = wrapDelta(i - pos)
      const ad = Math.abs(dist)
      gsap.set(cards[i], {
        x: stageCenter + dist * spacing - cardWidth / 2,
        scale: gsap.utils.clamp(0.8, 1.34, 1.34 - ad * 0.52),
        autoAlpha: gsap.utils.clamp(0.42, 1, 1.1 - ad * 0.2),
        rotateY: 0,
        z: 0,
        zIndex: Math.round(200 - ad * 12),
        transformOrigin: 'center center',
      })
    }
    const centered = ((Math.round(pos) % count) + count) % count
    cards.forEach((card, i) => card.classList.toggle('is-featured', i === centered))
    if (centered !== activeIndex) {
      activeIndex = centered
      updateFeatured(centered)
    }
  }

  measure()
  layout(0)
  updateFeatured(0, true)
  track.classList.add('is-ready')

  if (prefersReducedMotion) {
    return
  }

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: pinDistance(4),
    pin: true,
    invalidateOnRefresh: true,
    onRefreshInit: measure,
    onUpdate: (self) => layout(self.progress * loops * count),
  })

  const centerOn = (index: number) => {
    const currentPos = trigger.progress * loops * count
    const targetPos = index + Math.round((currentPos - index) / count) * count
    const targetProgress = gsap.utils.clamp(0, 1, targetPos / (loops * count))
    const target = trigger.start + targetProgress * (trigger.end - trigger.start)
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      if (index !== activeIndex) {
        centerOn(index)
      }
    })
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        centerOn(index)
      }
    })
  })

  window.addEventListener('resize', () => {
    measure()
    layout(trigger.progress * loops * count)
  })
}

function initProjectViewer() {
  const viewer = document.querySelector<HTMLElement>('[data-project-viewer]')
  const scroll = document.querySelector<HTMLElement>('[data-viewer-scroll]')
  const titleEl = document.querySelector<HTMLElement>('[data-viewer-title]')
  const openButton = document.querySelector<HTMLElement>('[data-view-project]')
  const closeButton = document.querySelector<HTMLElement>('[data-viewer-close]')
  const glass = document.querySelector<HTMLElement>('[data-project-glass]')
  const cards = gsap.utils.toArray<HTMLElement>('[data-project-card]')

  if (!viewer || !scroll || !openButton || !closeButton || !glass) {
    return
  }

  const items = portfolioContent.projects.items
  let lastFocused: HTMLElement | null = null
  let isOpen = false

  const open = () => {
    if (isOpen) {
      return
    }

    const index = Number(glass.dataset.activeIndex ?? '0')
    const item = items[index]

    scroll.innerHTML = Array.from(
      { length: item.gallery },
      (_, n) =>
        `<div class="viewer-panel" style="--accent: ${item.accent}">${item.name} &mdash; Frame ${String(n + 1).padStart(2, '0')}</div>`,
    ).join('')
    if (titleEl) {
      titleEl.textContent = item.name
    }
    scroll.scrollTop = 0

    lastFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    viewer.setAttribute('aria-hidden', 'false')
    viewer.classList.add('is-open')
    isOpen = true

    const card = cards.find((entry) => entry.classList.contains('is-featured')) ?? cards[index]

    if (prefersReducedMotion || !card) {
      gsap.set(viewer, { clipPath: 'inset(0px round 0px)' })
    } else {
      const rect = card.getBoundingClientRect()
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
    gsap.set(viewer, { clearProps: 'clipPath' })
    lastFocused?.focus?.()
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
