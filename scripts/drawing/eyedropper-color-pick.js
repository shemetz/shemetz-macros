import { getLocalMousePosition, getScreenMousePosition } from '../utils/mouse-utils.js'
import { readPixel, rgbaToHex } from '../utils/canvas-pixi-utils.js'

export const colorPickFromCursor = async (fillOrStroke, backgroundOnly = false) => {
  const { color, alpha } = getMousePixelColorAndAlpha(backgroundOnly)
  console.log(`%c${color}`, `background: ${color}`)
  await updateDrawingDefaults(
    fillOrStroke === 'fill' ? {
      fillColor: color,
      fillAlpha: alpha,
    } : {
      strokeColor: color,
      strokeAlpha: alpha,
    })
  setDrawingToolGuiColor(color)
}

function getMousePixelColorAndAlpha (backgroundOnly) {
  const colorWithAlpha = getMousePixel(backgroundOnly)
  const color = colorWithAlpha.substr(0, 1 + 6)
  const alpha = parseInt(colorWithAlpha.substr(1 + 6, 2), 16) / 255
  return { color, alpha }
}

function getMousePixel (backgroundOnly) {
  const pixelRGBA = backgroundOnly ? getMousePixelOnLayer(canvas.background) : getMousePixelOnScreen()
  // converting alpha from 0—255 to 0—1
  const pixelRGBa = [...pixelRGBA.subarray(0, 3), pixelRGBA[3] / 255]
  let colorWithAlpha = rgbaToHex(...pixelRGBa)
  if (CONFIG.debug.eyedropper) {
    console.log(`%c${colorWithAlpha}    `, `background: ${colorWithAlpha}`)
  }
  if (!colorWithAlpha.startsWith('#000000') || !backgroundOnly) {
    return colorWithAlpha
  }
  colorWithAlpha = '#' + ((1 << 24) + canvas.backgroundColor).toString(16).slice(1) + 'ff'
  if (CONFIG.debug.eyedropper) {
    console.log(`found nothing, so default %c  ${colorWithAlpha}`, `background: ${colorWithAlpha}`)
  }
  return colorWithAlpha
}

let screenRenderCache = null // caches the 2d context of the canvas app render
const getMousePixelOnScreen = () => {
  let context
  if (screenRenderCache === null) {
    canvas.app.render()
    const canv = canvas.app.renderer.extract.canvas()
    context = canv.getContext('2d')
    screenRenderCache = context
  } else {
    context = screenRenderCache
  }
  const { x, y } = getScreenMousePosition()
  return context.getImageData(x, y, 1, 1).data
}

const resetScreenRenderCache = () => {
  if (screenRenderCache !== null) {
    if (CONFIG.debug.eyedropper) {
      console.debug(`ShemetzMacros | Resetting screen render cache for eyedropper`)
    }
    screenRenderCache = null
  }
}

let resetCooldownTimer = null
const resetScreenRenderCacheSoon = () => {
  if (screenRenderCache !== null) {
    // prevent constantly rerendering when the user is panning
    if (resetCooldownTimer !== null) {
      clearTimeout(resetCooldownTimer)
    }
    resetCooldownTimer = setTimeout(() => {
      resetScreenRenderCache()
    }, 500)
  }
}

/**
 * note:  returns alpha in range 0—255
 */
function getMousePixelOnLayer (layer) {
  const mPos = getLocalMousePosition()
  const tPos = layer.getLocalBounds()
  const x = mPos.x - tPos.x
  const y = mPos.y - tPos.y
  return readPixel(layer, x, y)
}

async function updateDrawingDefaults (changedData) {
  const currentDefault = game.settings.get('core', DrawingsLayer.DEFAULT_CONFIG_SETTING)
  const newDefault = {
    ...currentDefault,
    ...changedData,
  }
  return game.settings.set('core', DrawingsLayer.DEFAULT_CONFIG_SETTING, newDefault)
}

function setDrawingToolGuiColor (color) {
  const j = $('ol.control-tools > li.scene-control.active')
  if (isFillOrStroke()) {
    j.css('background', color)
  } else {
    j.css('color', color)
  }
}

const isFillOrStroke = () => {
  return game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.SHIFT)
}

const shouldPickFromBackgroundOnly = () => {
  return game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.ALT)
}

let flipFlopRender = false

function onMouseMoveColorEyedropperTool () {
  // silly hack, but without it the color doesn't change until the mouse stops moving.
  // looks like reading a pixel prevents us from rendering on the same frame or something.
  // so the solution is to only read pixels once every two frames.
  flipFlopRender = !flipFlopRender
  if (!flipFlopRender) return
  const { color } = getMousePixelColorAndAlpha(shouldPickFromBackgroundOnly())
  setDrawingToolGuiColor(color)
}

function deactivateEyedropperTool () {
  canvas.stage.off('mousemove', onMouseMoveColorEyedropperTool)
  canvas.stage.off('mousedown', onMouseMoveColorEyedropperTool)
  Hooks.off('canvasPan', resetScreenRenderCacheSoon)
}

function activateColorPickFromCursor () {
  deactivateEyedropperTool()
  // set color in default drawing config.  alt to switch fill/stroke
  const fillOrStroke = isFillOrStroke() ? 'fill' : 'stroke'
  const backgroundOnly = shouldPickFromBackgroundOnly()
  return colorPickFromCursor(fillOrStroke, backgroundOnly)
}

function startShowingEyedropperColor () {
  // wherever cursor is, that color is set as eyedropper tool background
  canvas.stage.on('mousemove', onMouseMoveColorEyedropperTool)
  canvas.stage.on('mousedown', onMouseMoveColorEyedropperTool)
  Hooks.on('canvasPan', resetScreenRenderCacheSoon)
}

export const hookEyedropperColorPicker = () => {
  const { SHIFT, ALT } = KeyboardManager.MODIFIER_KEYS
  game.keybindings.register('shemetz-macros', 'eyedropper', {
    name: 'Eyedropper (use "Precise Drawing Tools" module instead!)',
    hint: 'Pick the color of the current pixel under the cursor.',
    editable: [],
    reservedModifiers: [SHIFT, ALT],
    onDown: () => {
      if ($(`.scene-control.active`).attr('data-control') === 'drawings') {
        resetScreenRenderCache()
        startShowingEyedropperColor()
        onMouseMoveColorEyedropperTool()
        return true // consumed
      } else {
        return false
      }
    },
    onUp: () => {
      if ($(`.scene-control.active`).attr('data-control') === 'drawings') {
        activateColorPickFromCursor()
        resetScreenRenderCache()
        return true // consumed
      } else {
        return false
      }
    },
  })
}
