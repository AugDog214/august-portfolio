/**
 * Layout for the Selected Work stage (fixed centre frame + frosted brief panel),
 * shared by the home carousel and the archive's project pages.
 */

/** Centres the frame (and the View Project pill under it) in the space left of the brief panel. */
export function layoutProjectStage(section: HTMLElement, stage: HTMLElement, frame: HTMLElement, glass: HTMLElement) {
  const glassWidth = window.innerWidth > 820 ? glass.offsetWidth : 0
  const stageCenter = (stage.clientWidth - glassWidth) / 2
  frame.style.left = `${stageCenter}px`
  // the View Project pill sits under the frame, so it follows the same center
  stage.style.setProperty('--pf-cx', `${stageCenter}px`)
  fitStageAboveGlass(section, stage, glass)
  return stageCenter
}

// Phones in portrait: the brief panel sits over the bottom of the stage, so the
// card is sized to the space above it, leaving room for the View Project pill.
export function fitStageAboveGlass(section: HTMLElement, stage: HTMLElement, glass: HTMLElement) {
  const pill = section.querySelector<HTMLElement>('[data-view-project]')
  const narrow = window.innerWidth <= 820 && window.innerHeight > window.innerWidth
  if (!narrow || !pill) {
    stage.style.removeProperty('--pf-fit-h')
    return
  }
  // layout offsets (not rects) so the entrance transforms don't skew the numbers
  let stageTop = 0
  for (let node: HTMLElement | null = stage; node && node !== section; node = node.offsetParent as HTMLElement | null) {
    stageTop += node.offsetTop
  }
  // re-run whenever the panel or the title changes height between projects
  const style = getComputedStyle(glass)
  const glassTop = section.offsetHeight - (parseFloat(style.bottom) || 0) - glass.offsetHeight
  const room = glassTop - stageTop - pill.offsetHeight - 34
  stage.style.setProperty('--pf-fit-h', `${Math.max(96, Math.round(room))}px`)
}
