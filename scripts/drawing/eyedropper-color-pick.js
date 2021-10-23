/**
 When activated (best with hotkey), will capture the color under the cursor and set it to the drawing tools default
 for stroke color.  The color may include alpha, though you might want to set ignoreBackground to false to capture it,
 because otherwise the default behavior is to blend the color of all layers' pixels together (i.e. make it look like
 you'd see it on your screen).

 Doesn't currently support lighting/sight (but you can enable grid/effects/templates if you want).

 INCOMPATIBLE with the Perfect Vision module.
 // TODO fix incompatibility with Perfect Vision if possible
 */

export const colorPickFromCursor = async (fillOrStroke, ignoreBackground = false) => {
  const { color, alpha } = getMousePixelColorAndAlpha(ignoreBackground)
  console.log(`%c${color}`, `background: ${color}`)
  await updateDrawingDefaults(
    fillOrStroke === 'fill' ? {
      fillColor: color,
      fillAlpha: alpha,
    } : {
      strokeColor: color,
      strokeAlpha: alpha,
    })
  setAsEyedropperToolBackground(color)
}

function getMousePixelColorAndAlpha (ignoreBackground) {
  const colorWithAlpha = getMousePixelOnScreen(ignoreBackground)
  const color = colorWithAlpha.substr(0, 1 + 6)
  const alpha = parseInt(colorWithAlpha.substr(1 + 6, 2), 16) / 255
  return { color, alpha }
}

function getMousePixelOnScreen (ignoreBackground) {
  const reversedLayers = [
    !ignoreBackground && canvas.background,   // 0
    canvas.drawings,     // 20
    // canvas.grid,         // 30
    // canvas.walls,        // 40
    // canvas.templates,    // 50
    // canvas.notes,        // 60
    canvas.tokens,       // 100
    canvas.foreground,   // 200
    // canvas.sounds,       // 300
    // canvas.lighting,     // 300
    // canvas.sight,        // 400
    // canvas.effects,      // 500
    // canvas.controls,      // 1000
  ].filter(it => !!it)
    .reverse()

  const pixelsFound = []
  const layersFound = []
  for (const layer of reversedLayers) {
    const pixelRGBA = getMousePixelOnLayer(layer)
    if (pixelRGBA[3] !== 0) {
      // converting alpha from 0—255 to 0—1
      pixelsFound.push([...pixelRGBA.subarray(0, 3), pixelRGBA[3] / 255])
      layersFound.push(layer.name.replace('Layer', ''))
    }
    if (pixelRGBA[3] === 255) {
      // stop checking lower layers
      break
    }
  }
  if (pixelsFound.length > 0) {
    pixelsFound.reverse()
    layersFound.reverse()
    const pixelRGBA = blendColors(pixelsFound)
    const color = rgbaToHex(...pixelRGBA)
    if (CONFIG.debug.eyedropper)
      console.log(`%c${color}    %c (${layersFound.toString()})`, `background: ${color}`, '')
    return color
  }
  const color = '#' + ((1 << 24) + canvas.backgroundColor).toString(16).slice(1) + 'ff'
  console.log(`found nothing, so default %c  ${color}`, `background: ${color}`)
  return color
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

/**
 * https://github.com/League-of-Foundry-Developers/simplefog/blob/master/js/helpers.js
 */
function readPixel (target, x = 0, y = 0) {
  const { renderer } = canvas.app
  let resolution
  let renderTexture
  let generated = false
  if (target instanceof PIXI.RenderTexture) {
    renderTexture = target
  } else {
    renderTexture = renderer.generateTexture(target)
    generated = true
  }
  if (renderTexture) {
    resolution = renderTexture.baseTexture.resolution
    renderer.renderTexture.bind(renderTexture)
  }
  const pixel = new Uint8Array(4)
  // read pixels to the array
  const { gl } = renderer
  gl.readPixels(x * resolution, y * resolution, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)
  if (generated) {
    renderTexture.destroy(true)
  }
  return pixel
}

function getLocalMousePosition () {
  const { x, y } = canvas.app.renderer.plugins.interaction.mouse.getLocalPosition(canvas.app.stage)
  return { x, y }
}

/**
 * https://stackoverflow.com/a/49974627/1703463
 * expects RGB in 0—255 and a in 0—1
 */
function rgbaToHex (r, g, b, a) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    + '' + (a ? ((1 << 8) + Math.round(a * 255)).toString(16).slice(1)
      : '')
}

/**
 * https://gist.github.com/JordanDelcros/518396da1c13f75ee057#gistcomment-2075095
 * args is a list like [[12, 255, 0, 0.5], [36, 19, 183, 0.2]]
 */
function blendColors (args) {
  let base = [0, 0, 0, 0]
  let mix
  let added
  while (added = args.shift()) {
    if (typeof added[3] === 'undefined') {
      added[3] = 1
    }
    // check if both alpha channels exist.
    if (base[3] && added[3]) {
      mix = [0, 0, 0, 0]
      // alpha
      mix[3] = 1 - (1 - added[3]) * (1 - base[3])
      // red
      mix[0] = Math.round((added[0] * added[3] / mix[3]) + (base[0] * base[3] * (1 - added[3]) / mix[3]))
      // green
      mix[1] = Math.round((added[1] * added[3] / mix[3]) + (base[1] * base[3] * (1 - added[3]) / mix[3]))
      // blue
      mix[2] = Math.round((added[2] * added[3] / mix[3]) + (base[2] * base[3] * (1 - added[3]) / mix[3]))

    } else if (added) {
      mix = added
    } else {
      mix = base
    }
    base = mix
  }

  return mix
}

async function updateDrawingDefaults (changedData) {
  const currentDefault = game.settings.get('core', DrawingsLayer.DEFAULT_CONFIG_SETTING)
  const newDefault = {
    ...currentDefault,
    ...changedData,
  }
  return game.settings.set('core', DrawingsLayer.DEFAULT_CONFIG_SETTING, newDefault)
}

function setAsEyedropperToolBackground (color) {
  $('[data-tool="eyedropper"]')[0].style.background = color
}

/**
 * silly idea, don't actually use this:  will set this macro's image based on the color
 */
async function setAsMacroImage (color) {
  const rrggbb = color.slice(1)
  await macro.update({ 'img': `https://color-hex.org/colors/${rrggbb}.png` })
}

let fillOrStroke = 'stroke'
let ignoreBackground = false
let previousTool = null
let isInEyedropperMode = false
let flipFlopRender = false

function onMouseMoveColorEyedropperTool () {
  // silly hack, but without it the color doesn't change until the mouse stops moving.
  // looks like reading a pixel prevents us from rendering on the same frame or something.
  // so the solution is to only read pixels once every two frames.
  flipFlopRender = !flipFlopRender
  if (!flipFlopRender) return
  const { color } = getMousePixelColorAndAlpha(ignoreBackground)
  setAsEyedropperToolBackground(color)
}

function deactivateEyedropperTool () {
  isInEyedropperMode = false
  $(`[data-control='drawings'] [data-tool='${previousTool}']`).attr('class', 'control-tool active')
  $(`[data-control='drawings'] [data-tool='eyedropper']`).attr('class', 'control-tool')
  setAsEyedropperToolBackground('#000000')
  ui.controls.control.activeTool = previousTool
  previousTool = null
  canvas.stage.off('mousemove', onMouseMoveColorEyedropperTool)
  canvas.stage.off('contextmenu', deactivateEyedropperTool)
  canvas.stage.once('rightdown', deactivateEyedropperTool)
}

function activateEyedropperTool () {
  // 1.0 if click eyedropper twice, deactivate
  if (isInEyedropperMode) return deactivateEyedropperTool()
  // 1.1 keep in memory the current tool
  previousTool = $(`[data-control='drawings'] > ol > li.active`).attr('data-tool')
  // 1.2 switch to eyedropper mode
  isInEyedropperMode = true
  // 2 wherever cursor is, that color is set as eyedropper tool background
  canvas.stage.on('mousemove', onMouseMoveColorEyedropperTool)
  // 3 when user clicks on pixel...
  canvas.stage.once('click', () => {
    // 3.1 switch back to last tool
    deactivateEyedropperTool()
    // 3.2 set that color in default drawing config
    colorPickFromCursor(fillOrStroke, ignoreBackground)
  })
  // 3.b if right click, deactivate eyedropper
  canvas.stage.once('contextmenu', deactivateEyedropperTool)
  canvas.stage.once('rightdown', deactivateEyedropperTool)
}

export const hookEyedropperColorPicker = () => {
  Hooks.on('getSceneControlButtons', controls => {
    const drawingsToolbar = controls.find(c => c.name === 'drawings').tools
    drawingsToolbar.splice(drawingsToolbar.length - 1, 0, {
      name: 'eyedropper',
      title: 'Eyedropper (Color Pick)',
      icon: 'fas fa-eye-dropper',
      button: false,
      onClick: activateEyedropperTool,
    })
    console.log(`Shemetz Macros | Added 'Eyedropper' button`)
  })
  KeybindLib.register("shemetz-macros", "eyedropper", {
    name: "Eyedropper (Color Pick)",
    hint: "Pick the color of the current pixel under the cursor.",
    default: "KeyK",
    onKeyDown: async () => {
      if ($(`.scene-control.active`).attr('data-control') === 'drawings') {
        return colorPickFromCursor(fillOrStroke, ignoreBackground)
      }
    },
  });
}