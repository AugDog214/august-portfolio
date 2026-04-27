import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { astroSequence, siteMeta } from './content'
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
} else {
  initHero()
  initReveal()
  initHorizontalFlow()
  initIris()
  initBuild()
  initMeta()
}

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
  const progress = document.querySelector<HTMLElement>('[data-hero-progress]')
  const frameController = initHeroFrames()

  if (!hero || !identity || !progress) {
    return
  }

  gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })

  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: pinDistance(2),
    pin: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const fade = smoothstep(mapProgress(self.progress, 0.12, 0.76))
      const imageProgress = smoothstep(self.progress)

      gsap.set(progress, { scaleX: self.progress })
      gsap.set(identity, {
        autoAlpha: 1 - fade,
        y: -44 * fade,
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
      drawWidth = canvas.width
      drawHeight = drawWidth / imageRatio
      drawY = (canvas.height - drawHeight) / 2
    } else {
      drawHeight = canvas.height
      drawWidth = drawHeight * imageRatio
      drawX = (canvas.width - drawWidth) / 2
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
  gsap.set('[data-reveal-number], [data-reveal-line], [data-build-copy], .device--secondary, .device--primary, [data-meta-copy]', {
    autoAlpha: 1,
    y: 0,
    scale: 1,
  })
  gsap.set('[data-horizontal-track]', { x: 0 })
  gsap.set('[data-film-inner]', { scale: 1 })
}

function initReveal() {
  const reveal = document.querySelector<HTMLElement>('[data-reveal]')
  const number = document.querySelector<HTMLElement>('[data-reveal-number]')
  const line = document.querySelector<HTMLElement>('[data-reveal-line]')

  if (!reveal || !number || !line) {
    return
  }

  ScrollTrigger.create({
    trigger: reveal,
    start: 'top top',
    end: pinDistance(2.8),
    pin: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const numberIn = smoothstep(mapProgress(self.progress, 0.06, 0.28))
      const lineIn = smoothstep(mapProgress(self.progress, 0.22, 0.48))
      const out = smoothstep(mapProgress(self.progress, 0.72, 0.94))

      gsap.set(number, {
        autoAlpha: numberIn * (1 - out),
        y: 50 * (1 - numberIn) - 34 * out,
      })
      gsap.set(line, {
        autoAlpha: lineIn * (1 - out),
        y: 42 * (1 - lineIn) - 26 * out,
      })
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

function mapProgress(progress: number, start: number, end: number) {
  if (end === start) {
    return progress >= end ? 1 : 0
  }

  return gsap.utils.clamp(0, 1, (progress - start) / (end - start))
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value)
}
