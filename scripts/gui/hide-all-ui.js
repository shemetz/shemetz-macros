let mode = 'visible'

/**
 * Hides everything but the canvas:
 * - notifications
 * - interface
 * - hud
 * - pause overlay
 * - tooltips
 * - opened application windows
 */
export const hideAllUi = () => {
  mode = (mode === 'hidden') ? 'visible' : 'hidden'
  for (const el of document.getElementsByTagName('body')[0].children) {
    if (el.tagName === 'CANVAS') continue
    el.style.visibility = mode
  }
}