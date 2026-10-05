import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { astroSequence, portfolioContent, siteMeta } from './content'
import { renderSite } from './render'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { resolvePublicUrl } from './urls'
import { fitStageAboveGlass, layoutProjectStage } from './project-stage'
import { createCaseStudyViewer, renderProjectTools } from './viewer'
import './styles.css'

const app = document.querySelector<HTMLDivElement>('#app')
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!app) {
  throw new Error('App root not found.')
}

gsap.registerPlugin(ScrollTrigger)
gsap.defaults({ ease: 'none' })

// Smooth scrolling: each wheel notch is eased into one continuous scroll, so every
// scroll-linked animation moves on a smooth curve instead of stepping (and, for
// anything that counters the scroll, wobbling) once per notch. Touch stays native.
const lenis = prefersReducedMotion ? null : new Lenis({ lerp: 0.1, anchors: true })
// phones: the address bar showing/hiding resizes the viewport; without this every
// pinned section re-measures mid-swipe, which makes the card strip jump and stall
ScrollTrigger.config({ ignoreMobileResize: true })
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}
const scrollToY = (y: number, smooth = false) => {
  if (lenis) lenis.scrollTo(y, { immediate: !smooth, force: true })
  else window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' })
}

// Nav switches to a light, borderless glass while it sits over the cream section,
// so there is no dark bar / hard line cutting across Selected Work.
// (declared up here, before any init* runs, so ScrollTrigger callbacks can use it)
const navTheme = { reveal: false, projects: false }
const syncNavTheme = () => {
  document.querySelector('[data-nav]')?.classList.toggle('nav--light', navTheme.reveal || navTheme.projects)
}
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
  initAiShowcaseStatic(document.querySelector<HTMLElement>('#ai'))
  initAiShowcaseStatic(document.querySelector<HTMLElement>('#identity'))
} else {
  initHero()
  initReveal()
  initProjects()
  initAiShowcase(document.querySelector<HTMLElement>('#ai'))
  initHorizontalFlow()
  initAiShowcase(document.querySelector<HTMLElement>('#identity'))
  initAbout()
  initLoop()
}

initScrollCue()

initNavLabel()

initProjectViewer()

// Scroll cue: a watermark at the bottom of the screen that only shows up when the
// visitor pauses. It names what's next, points sideways in the horizontal section,
// and gets out of the way the moment they scroll (and for good at the contact).
function initScrollCue() {
  const cue = document.querySelector<HTMLElement>('[data-scroll-cue]')
  const label = document.querySelector<HTMLElement>('[data-scroll-cue-label]')
  if (!cue || !label) return
  const stops: [string, string][] = [
    ['[data-hero]', 'Scroll to begin'],
    ['[data-reveal]', 'Keep going'],
    ['[data-projects]', 'Scroll through the work'],
    ['#ai', 'Scroll for more builds'],
    ['[data-horizontal-section]', 'Keep scrolling'],
    ['#identity', 'Scroll for more marks'],
    ['[data-about]', 'Almost there'],
  ]
  let idle = 0
  const place = () => {
    const mid = window.innerHeight / 2
    let text = ''
    let sideways = false
    for (const [sel, words] of stops) {
      const el = document.querySelector<HTMLElement>(sel)
      if (!el) continue
      const r = el.getBoundingClientRect()
      if (r.top <= mid && r.bottom > mid) {
        text = words
        sideways = sel === '[data-horizontal-section]'
      }
    }
    const hide = !text || document.body.dataset.viewerOpen === 'true'
    if (!hide) label.textContent = text
    cue.classList.toggle('is-sideways', sideways)
    cue.classList.toggle('is-shown', !hide)
  }
  const onScroll = () => {
    cue.classList.remove('is-shown')
    window.clearTimeout(idle)
    idle = window.setTimeout(place, 1600)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  idle = window.setTimeout(place, 1400)
}

// Loop: past the contact footer a bridge fades the screen to black; at the
// bottom it cuts back to the top and the hero fades up out of the black.
// The top-left label names whatever section is on screen. Leveraging AI arrives the
// way PORTFOLIO first does (flying in from the right edge); every other change is a
// split-flap roll: the old letters tip up and out, the new ones roll in from below.
function initNavLabel() {
  const label = document.querySelector<HTMLElement>('[data-nav-label]')
  if (!label) return
  const stops = portfolioContent.navigation.sectionLabels as readonly { selector: string; label: string; short?: string; enter?: string }[]
  const brand = document.querySelector<HTMLElement>('[data-nav-brand]')
  let current = label.textContent ?? ''
  let token = 0
  let sliding = false

  const letters = (text: string) =>
    text
      .split('')
      .map((char) => `<span class="nav-brand-char">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('')

  const set = (text: string, enter?: string) => {
    if (text === current) return
    current = text
    const run = ++token
    gsap.killTweensOf(label)
    gsap.killTweensOf(label.children)

    if (prefersReducedMotion) {
      label.textContent = text
      return
    }

    if (enter === 'slide' && brand) {
      // the whole brand travels in from the right edge, like PORTFOLIO does in the hero
      sliding = true
      gsap.to(label, {
        autoAlpha: 0,
        duration: 0.16,
        ease: 'power1.in',
        onComplete: () => {
          if (run !== token) return
          label.textContent = text
          gsap.set(label, { autoAlpha: 1 })
          gsap.fromTo(brand, { x: getPortfolioIntroX() }, { x: 0, duration: 1.05, ease: 'power3.out', onComplete: () => { sliding = false } })
        },
      })
      return
    }

    if (sliding && brand) {
      gsap.killTweensOf(brand)
      gsap.set(brand, { x: 0 })
      sliding = false
    }
    gsap.set(label, { autoAlpha: 1 })
    label.innerHTML = letters(label.textContent ?? '')
    gsap.to(label.children, {
      yPercent: -105,
      rotateX: 80,
      autoAlpha: 0,
      duration: 0.22,
      stagger: 0.012,
      ease: 'power2.in',
      onComplete: () => {
        if (run !== token) return
        label.innerHTML = letters(text)
        gsap.fromTo(
          label.children,
          { yPercent: 105, rotateX: -80, autoAlpha: 0 },
          { yPercent: 0, rotateX: 0, autoAlpha: 1, duration: 0.42, stagger: 0.02, ease: 'power3.out' },
        )
      },
    })
  }

  const place = () => {
    const mid = window.innerHeight * 0.45
    const narrow = window.innerWidth <= 820
    let hit: (typeof stops)[number] | undefined
    for (const stop of stops) {
      const el = document.querySelector<HTMLElement>(stop.selector)
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (rect.top <= mid && rect.bottom > mid) hit = stop
    }
    if (hit) set((narrow && hit.short) || hit.label, hit.enter)
  }

  place()
  window.addEventListener('scroll', place, { passive: true })
  window.addEventListener('resize', place)
}

function initLoop() {
  const bridge = document.querySelector<HTMLElement>('[data-loop-bridge]')
  const veil = document.querySelector<HTMLElement>('[data-loop-veil]')
  if (!bridge || !veil) return
  let jumping = false
  ScrollTrigger.create({
    trigger: bridge,
    start: 'top bottom',
    end: 'bottom bottom',
    onUpdate: (self) => {
      if (jumping) return
      veil.style.opacity = String(Math.min(1, self.progress * 1.15))
      if (self.progress < 0.995) return
      jumping = true
      veil.style.opacity = '1'
      scrollToY(0)
      requestAnimationFrame(() => {
        ScrollTrigger.update()
        gsap.to(veil, {
          opacity: 0,
          duration: 1.1,
          delay: 0.2,
          ease: 'power2.out',
          onComplete: () => { jumping = false },
        })
      })
    },
  })
}

window.addEventListener('load', () => {
  ScrollTrigger.refresh()
  // arriving from another page (Archive, a project) with a section in the URL:
  // the page starts at the top, so travel to that section once the pins are measured
  const target = window.location.hash.length > 1 ? document.querySelector<HTMLElement>(window.location.hash) : null
  if (target) window.requestAnimationFrame(() => scrollToY(target.getBoundingClientRect().top + window.scrollY))
})
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

    },
  })

  // The frame sequence keeps playing after the pin lets go: it runs across the
  // pinned scroll AND the viewport-height the hero takes to slide away, so the
  // video is still moving as the next section arrives (it used to freeze on the
  // last frame the moment the hero started to leave).
  // (plain scroll positions: a trigger on the pinned hero itself would be pushed
  // back by the pin's own spacing)
  ScrollTrigger.create({
    start: 0,
    end: () => Math.round(window.innerHeight * 3),
    invalidateOnRefresh: true,
    onUpdate: (self) => frameController?.sync(self.progress),
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
  gsap.set('[data-reveal-banner], [data-reveal-artwork], [data-reveal-copy], [data-reveal-editorial]', {
    autoAlpha: 1,
    y: 0,
    scale: 1,
  })
  gsap.set('[data-horizontal-track]', { x: 0 })
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
  //   1.80–2.10  only now does the cream wash rise (empty screen), nav flips
  //   2.15–3.15  Selected Work rises OVER the finished wash (same cream, so no
  //              edge) — its card leads, title follows, brief panel swings in
  const PRE_ROLL = 0.65
  const PIN = 2.5
  const TOTAL = PRE_ROLL + PIN
  const at = (u: number, from: number, to: number) => smoothstep(mapProgress(u, from, to))

  const projectsSection = document.querySelector<HTMLElement>('[data-projects]')
  const overlap = () => {
    if (projectsSection) projectsSection.style.marginTop = `-${window.innerHeight}px`
  }
  overlap()
  ScrollTrigger.addEventListener('refreshInit', overlap)

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
    onLeave: () => {
      video?.pause()
      // hand the nav theme over to Selected Work's own trigger
      navTheme.reveal = false
      syncNavTheme()
    },
    onLeaveBack: () => video?.pause(),
    onUpdate: (self) => {
      const u = self.progress * TOTAL
      const vh = window.innerHeight
      const artworkIn = at(u, 0.05, 0.75)
      const bannerIn = at(u, 0.15, 0.8)
      const copyIn = at(u, 0.3, 0.85)
      const editorialIn = at(u, 0.7, 1.0)
      const out = at(u, 1.5, 1.8)
      const wash = at(u, 1.8, 2.1)
      const brandFlip = at(u, 1.8, 2.1)
      if (navTheme.reveal !== wash > 0.6) {
        navTheme.reveal = wash > 0.6
        syncNavTheme()
      }
      const lift = -vh * 0.28 * out

      reveal.style.setProperty('--projects-wash', wash.toFixed(3))
      reveal.style.setProperty('--projects-bloom', wash.toFixed(3))
      gsap.set(banner, {
        autoAlpha: bannerIn * (1 - out),
        // a short drift + fade (its ends are feathered in CSS) instead of the
        // whole hard-edged bar sliding across the screen
        x: window.innerWidth * 0.16 * (1 - bannerIn),
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
  const brandArt = section?.querySelector<HTMLElement>('.brand-art')
  const brandCopy = section?.querySelector<HTMLElement>('.brand-copy')
  const filmCopy = section?.querySelector<HTMLElement>('.film-copy')

  if (!section || !track || !filmInner || !brandArt || !brandCopy || !filmCopy) {
    return
  }

  // measured from panel layout, not track.scrollWidth: the parallax layers are
  // transformed past the last panel's edge and would inflate scrollWidth
  const lastPanel = track.lastElementChild as HTMLElement | null
  const horizontalDistance = () =>
    Math.max(0, (lastPanel ? lastPanel.offsetLeft + lastPanel.offsetWidth : track.scrollWidth) - window.innerWidth)
  const horizontalScrollDistance = () => Math.max(1, Math.round(Math.max(window.innerHeight * 2, horizontalDistance())))

  // Parallax layers, driven by where the track actually IS (the tween's own
  // progress, which follows the scrub), not by raw scroll — so copy never runs
  // into the viewport edge. Backgrounds and media slide; the copy blocks mostly
  // hold their screen position and crossfade (Brand out, then Film in).
  const layer = (progress: number) => {
    const vw = window.innerWidth
    const narrow = vw < 821
    // how much of the track's motion the copy cancels out: the copy barely
    // travels while it fades, so it dissolves in place instead of being
    // sliced by the viewport edge (phones need more, their copy is full-width)
    const hold = narrow ? 0.92 : 0.8
    const brandOut = smoothstep(narrow ? mapProgress(progress, 0.04, 0.3) : mapProgress(progress, 0.06, 0.38))
    const filmSettle = smoothstep(mapProgress(progress, 0.3, 1))
    const filmCopyIn = smoothstep(narrow ? mapProgress(progress, 0.62, 0.96) : mapProgress(progress, 0.42, 0.84))
    const innerX = vw * 0.1 * (1 - filmSettle)

    gsap.set(brandCopy, { autoAlpha: 1 - brandOut, x: vw * progress * hold })
    gsap.set(brandArt, { x: vw * 0.1 * smoothstep(mapProgress(progress, 0, 0.6)) })
    gsap.set(filmInner, { x: innerX })
    gsap.set(filmCopy, {
      autoAlpha: filmCopyIn,
      x: -vw * (1 - progress) * hold - innerX + vw * 0.03 * (1 - filmCopyIn),
    })
  }

  layer(0)

  gsap.to(track, {
    x: () => -horizontalDistance(),
    ease: 'none',
    onUpdate() {
      layer(this.progress())
    },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${horizontalScrollDistance()}`,
      pin: true,
      scrub: 1.2,
      invalidateOnRefresh: true,
      onToggle: (self) => {
        if (!filmVideo) return
        if (self.isActive) void filmVideo.play().catch(() => undefined)
        else filmVideo.pause()
      },
    },
  })
}

// ---- Leveraging AI showcase -------------------------------------------------
type AiShowcaseController = {
  section: HTMLElement
  ticks: HTMLButtonElement[]
  count: number
  setActive: (index: number) => void
  setPlaying: (playing: boolean) => void
}

function getAiShowcase(section: HTMLElement | null): AiShowcaseController | null {
  if (!section) {
    return null
  }

  const items = gsap.utils.toArray<HTMLElement>('[data-ai-item]', section)
  const media = gsap.utils.toArray<HTMLElement>('[data-ai-media]', section)
  const tags = gsap.utils.toArray<HTMLElement>('[data-ai-tag]', section)
  const ticks = gsap.utils.toArray<HTMLButtonElement>('[data-ai-tick]', section)
  const countEl = section.querySelector<HTMLElement>('[data-ai-count]')
  let current = 0
  let playing = false

  const syncVideos = () => {
    media.forEach((layer, index) => {
      const video = layer.querySelector<HTMLVideoElement>('video')

      if (!video) return

      if (playing && index === current) {
        video.preload = 'auto'
        void video.play().catch(() => undefined)
      } else {
        video.pause()
      }
    })
  }

  const setActive = (index: number) => {
    const next = gsap.utils.clamp(0, items.length - 1, index)

    if (next === current) return

    current = next
    // items behind the current one leave upward, items ahead wait below —
    // so the copy always travels in the scroll direction
    items.forEach((item, i) => {
      const on = i === next

      item.classList.toggle('is-active', on)
      item.classList.toggle('is-past', i < next)
      item.setAttribute('aria-hidden', String(!on))
      item.querySelectorAll('a').forEach((link) => {
        link.tabIndex = on ? 0 : -1
      })
    })
    media.forEach((layer, i) => layer.classList.toggle('is-active', i === next))
    tags.forEach((tag, i) => tag.classList.toggle('is-active', i === next))
    ticks.forEach((tick, i) => {
      tick.classList.toggle('is-active', i === next)
      if (i === next) tick.setAttribute('aria-current', 'true')
      else tick.removeAttribute('aria-current')
    })
    if (countEl) countEl.textContent = String(next + 1).padStart(2, '0')
    syncVideos()
  }

  const setPlaying = (value: boolean) => {
    playing = value
    syncVideos()
  }

  return { section, ticks, count: items.length, setActive, setPlaying }
}

// Reduced motion: no pin, no flight — the numbered ticks switch builds directly.
function initAiShowcaseStatic(section: HTMLElement | null) {
  const show = getAiShowcase(section)

  show?.ticks.forEach((tick, index) => tick.addEventListener('click', () => show.setActive(index)))
}

function initAiShowcase(root: HTMLElement | null) {
  const show = getAiShowcase(root)

  if (!show) {
    return
  }

  const { section } = show
  const title = section.querySelector<HTMLElement>('[data-ai-title]')
  const kicker = section.querySelector<HTMLElement>('[data-ai-kicker]')
  const info = section.querySelector<HTMLElement>('[data-ai-info]')
  const frame = section.querySelector<HTMLElement>('[data-ai-frame]')
  const frameWindow = section.querySelector<HTMLElement>('[data-ai-window]')
  const flare = section.querySelector<HTMLElement>('[data-ai-flare]')
  const flareInner = section.querySelector<HTMLElement>('[data-ai-flare-inner]')
  const rule = section.querySelector<HTMLElement>('[data-ai-rule]')
  const words = gsap.utils.toArray<HTMLElement>('[data-ai-word]', section)

  if (!title || !kicker || !info || !frame || !frameWindow || !flare || !words.length) {
    return
  }

  // mirrored variant (Brand Identity): info enters from the right
  const mirror = section.classList.contains('ai-show--mirror')
  const bracket = section.querySelector<HTMLElement>('.ai-bracket')
  const dash = section.querySelector<HTMLElement>('.ai-dash')

  // Scroll budget, in viewport-heights of pinned scroll:
  //   0.00–0.14  headline holds, large, in the middle of the screen
  //   0.14       words fly one at a time to the top (time-based, expo.out)
  //   0.30–0.85  info column + framed media arrive, flare blooms
  //   0.95 →     one build per STEP
  // HOLD: how long the big centred headline stays put before the words fly
  // (was 0.14vh = one wheel notch, too fast to read; now ~3-4 notches)
  const HOLD = 0.5
  const INTRO = HOLD + 0.81
  const STEP = section.id === 'ai' ? 0.48 : 0.55
  const PIN = INTRO + STEP * show.count

  // ---- headline flight -------------------------------------------------------
  // Each word's START is where it would sit if the whole headline were scaled up
  // and centred in the viewport, line by line. The words live at their final
  // (top) layout; the start is applied as a transform, so landing = identity.
  type Start = { x: number; y: number; scale: number }
  let starts: Start[] = []
  let flown = false
  let flight: gsap.core.Tween | null = null

  const measure = () => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const sectionRect = section.getBoundingClientRect()
    const titleRect = title.getBoundingClientRect()
    // offset* ignores transforms, so this is the untransformed final layout
    const boxes = words.map((word) => ({
      left: titleRect.left + word.offsetLeft,
      top: titleRect.top + word.offsetTop,
      width: word.offsetWidth,
      height: word.offsetHeight,
    }))
    const lines: number[][] = []

    boxes.forEach((box, index) => {
      const line = lines.find((candidate) => Math.abs(boxes[candidate[0]].top - box.top) < box.height * 0.5)
      if (line) line.push(index)
      else lines.push([index])
    })

    const lineWidth = (line: number[]) => boxes[line[line.length - 1]].left + boxes[line[line.length - 1]].width - boxes[line[0]].left
    const widest = Math.max(...lines.map(lineWidth))
    const scale = Math.min(vw < 821 ? 1.3 : 1.7, (vw * 0.88) / widest, (vh * 0.52) / titleRect.height)
    const centerX = sectionRect.left + vw / 2
    const centerY = sectionRect.top + vh / 2
    const titleCenterY = titleRect.top + titleRect.height / 2

    starts = new Array<Start>(words.length)
    lines.forEach((line) => {
      const left = boxes[line[0]].left
      const bigLeft = centerX - (lineWidth(line) * scale) / 2
      const lineCenterY = boxes[line[0]].top + boxes[line[0]].height / 2
      const bigCenterY = centerY + (lineCenterY - titleCenterY) * scale

      line.forEach((index) => {
        const box = boxes[index]
        starts[index] = {
          x: bigLeft + (box.left - left + box.width / 2) * scale - (box.left + box.width / 2),
          y: bigCenterY - (box.top + box.height / 2),
          scale,
        }
      })
    })

    if (!flown) {
      flight?.kill()
      words.forEach((word, index) => gsap.set(word, starts[index]))
    }
  }

  const fly = () => {
    flown = true
    flight?.kill()
    // fast departure, decisive landing: expo.out spends most of its distance
    // early and stops dead on the final position, one word after another
    flight = gsap.to(words, { x: 0, y: 0, scale: 1, duration: 1.05, ease: 'expo.out', stagger: 0.085, overwrite: 'auto' })
    gsap.to(kicker, { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.45, ease: 'power3.out', overwrite: 'auto' })
    // the copper edge draws down once the last word has landed against it
    if (rule) gsap.to(rule, { scaleY: 1, autoAlpha: 1, duration: 0.8, delay: 0.55, ease: 'expo.out', overwrite: 'auto' })
  }

  const unfly = () => {
    flown = false
    flight?.kill()
    flight = gsap.to(words, {
      x: (index: number) => starts[index].x,
      y: (index: number) => starts[index].y,
      scale: (index: number) => starts[index].scale,
      duration: 0.8,
      ease: 'power3.inOut',
      stagger: { each: 0.04, from: 'end' },
      overwrite: 'auto',
    })
    gsap.to(kicker, { autoAlpha: 0, y: 10, duration: 0.3, overwrite: 'auto' })
    if (rule) gsap.to(rule, { scaleY: 0, autoAlpha: 0, duration: 0.3, overwrite: 'auto' })
  }

  gsap.set(words, { transformOrigin: '50% 50%' })
  gsap.set(kicker, { autoAlpha: 0, y: 10 })
  if (rule) gsap.set(rule, { scaleY: 0, autoAlpha: 0 })
  measure()
  ScrollTrigger.addEventListener('refresh', measure)

  // headline rises in (still large, centred) while the section scrolls up
  gsap.fromTo(
    words,
    { autoAlpha: 0, yPercent: 38 },
    {
      autoAlpha: 1,
      yPercent: 0,
      ease: 'power2.out',
      stagger: 0.06,
      scrollTrigger: { trigger: section, start: 'top 88%', end: 'top 22%', scrub: 0.6, invalidateOnRefresh: true },
    },
  )

  const pin = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: pinDistance(PIN),
    pin: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const u = self.progress * PIN
      show.setActive(Math.floor((u - INTRO) / STEP))
    },
  })

  // NOTE: positions below are absolute scroll values read off the pin. A trigger
  // on the pinned element itself, created after its pin, would otherwise be
  // pushed past the whole pin distance.
  ScrollTrigger.create({
    start: () => pin.start + Math.round(window.innerHeight * HOLD),
    invalidateOnRefresh: true,
    onEnter: fly,
    onLeaveBack: unfly,
  })

  // info column + frame arrive once the headline has cleared the middle
  gsap
    .timeline({
      scrollTrigger: {
        start: () => pin.start + Math.round(window.innerHeight * (HOLD + 0.16)),
        end: () => pin.start + Math.round(window.innerHeight * (HOLD + 0.71)),
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    })
    .fromTo(info, { autoAlpha: 0, x: mirror ? 44 : -44 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out' }, 0.1)
    .fromTo(frame, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'none' }, 0)
    // the photo opens out of the corner the flare sits on
    .fromTo(
      frameWindow,
      { clipPath: mirror ? 'inset(100% 0% 0% 100%)' : 'inset(100% 100% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: 'power3.inOut' },
      0,
    )
    .fromTo(bracket, { scale: 0 }, { scale: 1, transformOrigin: mirror ? '100% 0%' : '0% 0%', duration: 0.45, ease: 'power3.out' }, 0.45)
    .fromTo(dash, { scaleX: 0 }, { scaleX: 1, transformOrigin: mirror ? '100% 50%' : '0% 50%', duration: 0.4, ease: 'power3.out' }, 0.55)
    // the piece-type label lands just after the bracket draws in
    .fromTo(section.querySelector('.ai-tags'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0.6)
    .fromTo(flare, { autoAlpha: 0, scale: 0.35 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, 0.15)

  // the corner light dims away as the section leaves, so it never trails into
  // the next section
  if (flareInner) {
    gsap.fromTo(
      flareInner,
      { autoAlpha: 1 },
      {
        autoAlpha: 0,
        ease: 'power1.in',
        immediateRender: false,
        scrollTrigger: {
          start: () => pin.end,
          end: () => pin.end + Math.round(window.innerHeight * 0.55),
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    )
  }

  // videos only run while the section is on screen
  ScrollTrigger.create({
    start: () => pin.start - window.innerHeight,
    end: () => pin.end + window.innerHeight,
    invalidateOnRefresh: true,
    onToggle: (self) => show.setPlaying(self.isActive),
  })

  show.ticks.forEach((tick, index) =>
    tick.addEventListener('click', () => {
      const top = pin.start + window.innerHeight * (INTRO + STEP * index + STEP * 0.4)
      scrollToY(top, true)
    }),
  )
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
    // shared with the archive's project pages (project-stage.ts)
    stageCenter = layoutProjectStage(section, stage, frame, glass)
  }

  if ('ResizeObserver' in window) {
    const refit = new ResizeObserver(() => fitStageAboveGlass(section, stage, glass))
    refit.observe(glass)
    const heading = section.querySelector<HTMLElement>('.projects-head')
    if (heading) refit.observe(heading)
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
      onUpdate: () => scrollToY(obj.y),
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

  // Entry: the section rises over the reveal's finished cream wash (identical
  // colour, so its edge is invisible). Its content rides a lag so the CARD glides up
  // and settles in the middle of the frame first (sine.in -> near-zero velocity on
  // arrival), then the title fades in, then the brief panel swings up from below.
  const inner = section.querySelector<HTMLElement>('.projects-inner')
  const wide = () => window.innerWidth > 820
  const entry = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'top top',
      // locked to the scroll (no scrub lag): this entry partly COUNTERS the
      // scroll (the card holds near centre while the section rises), and a lagged
      // counter-motion made the card jump up, then drift back down, on every
      // wheel notch. Lenis supplies the smoothing instead.
      scrub: true,
      invalidateOnRefresh: true,
    },
  })
  if (inner) {
    entry.fromTo(inner, { y: () => -window.innerHeight * 0.6 }, { y: 0, ease: 'sine.in', duration: 1 }, 0)
  }
  entry.fromTo(stage, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.4 }, 0.02)
  if (projectsHead) {
    entry.fromTo(projectsHead, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.3 }, 0.42)
  }
  // the card first settles at the TRUE centre of the frame, then eases left to make
  // room as the brief panel swings in (desktop, where the panel sits on the right)
  // (shifts card + title together so they stay aligned)
  entry.fromTo(
    inner ?? stage,
    { x: () => (wide() ? glass.offsetWidth / 2 : 0) },
    { x: 0, ease: 'power2.inOut', duration: 0.42, immediateRender: true },
    0.55,
  )
  entry.fromTo(
    glass,
    {
      autoAlpha: 0,
      y: () => window.innerHeight * 0.32,
      rotation: () => (wide() ? 2.4 : 0),
      transformOrigin: '100% 100%',
    },
    { autoAlpha: 1, y: 0, rotation: 0, ease: 'power3.out', duration: 0.45 },
    0.55,
  )

  trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: pinDistance(4 * cycles),
    pin: true,
    anticipatePin: 1, // no one-frame pin hop on a fast touch fling
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

  // light nav while the cream section is under it. Created AFTER the pin so its
  // "bottom" includes the pin distance (created before, it switched the nav back
  // to dark one screen into the pinned carousel).
  // (absolute positions read off the pin: a trigger on the pinned element that is
  // created after its pin would otherwise be pushed past the whole pin)
  const pinTrigger = trigger
  ScrollTrigger.create({
    start: () => pinTrigger.start - Math.round(window.innerHeight * 0.06),
    end: () => pinTrigger.end + section.offsetHeight - Math.round(window.innerHeight * 0.06),
    invalidateOnRefresh: true,
    onToggle: (self) => {
      navTheme.projects = self.isActive
      syncNavTheme()
    },
  })

  window.addEventListener('resize', () => {
    measure()
    positionStrip(currentPos())
  })
}

function initProjectViewer() {
  const openButton = document.querySelector<HTMLElement>('[data-view-project]')
  const glass = document.querySelector<HTMLElement>('[data-project-glass]')
  const frame = document.querySelector<HTMLElement>('[data-pf-frame]')
  const section = document.querySelector<HTMLElement>('[data-projects]')

  if (!openButton || !glass) {
    return
  }

  // the viewer itself (rendering, video, open/close) lives in viewer.ts and is
  // shared with the archive's project pages; this wires it to the carousel
  const viewer = createCaseStudyViewer({
    items: portfolioContent.projects.items,
    nextLabel: portfolioContent.projects.nextLabel,
    reducedMotion: prefersReducedMotion,
    clipFrom: () => frame,
    onOpen: () => {
      lenis?.stop()
      section?.dispatchEvent(new CustomEvent('pf:pause'))
    },
    onClose: (viewIndex, openedIndex) => {
      lenis?.start()
      section?.dispatchEvent(new CustomEvent('pf:resume'))
      // if the visitor paged to another project inside the viewer, land the carousel on it
      if (viewIndex !== openedIndex) {
        section?.dispatchEvent(new CustomEvent('pf:goto', { detail: viewIndex }))
      }
    },
  })

  if (!viewer) {
    return
  }

  openButton.addEventListener('click', () => viewer.open(Number(glass.dataset.activeIndex ?? '0')))

  // header links inside the viewer: close it, then travel to that section
  viewer.root.querySelectorAll<HTMLAnchorElement>('[data-viewer-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href') ?? ''
      if (!href.startsWith('#')) return // a separate page (Leveraging AI, Archive): let it navigate
      event.preventDefault()
      const stayOnProject = href === `#${portfolioContent.projects.id}`
      // leaving for another section: don't re-seat the carousel on the way out
      viewer.close(stayOnProject)
      if (stayOnProject) return
      const target = document.querySelector<HTMLElement>(href)
      if (target) window.requestAnimationFrame(() => scrollToY(target.getBoundingClientRect().top + window.scrollY))
    })
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

