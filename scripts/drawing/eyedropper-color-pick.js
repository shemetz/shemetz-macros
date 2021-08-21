/**
When activated (best with hotkey), will capture the color under the cursor and set it to the drawing tools default
 for stroke color.  The color may include alpha, though you might want to set ignoreBackground to false to capture it,
 because otherwise the default behavior is to blend the color of all layers' pixels together (i.e. make it look like
 you'd see it on your screen).

 Doesn't currently support lighting/sight (but you can enable grid/effects/templates if you want).

 INCOMPATIBLE with the Perfect Vision module.
*/

export const colorPickFromCursor = (fillOrStroke, ignoreBackground = false) => {
  const colorWithAlpha = getMousePixelOnScreen(ignoreBackground)
  const color = colorWithAlpha.substr(0, 1 + 6)
  const alpha = parseInt(colorWithAlpha.substr(1 + 6, 2), 16) / 255
  updateDrawingDefaults(
    fillOrStroke === 'fill' ? {
      fillColor: color,
      fillAlpha: alpha,
    } : {
      strokeColor: color,
      strokeAlpha: alpha,
    })
  setAsDrawingToolBackground(color)
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

function setAsDrawingToolBackground (color) {
  $('[data-tool="freehand"]')[0].style.background = color
}

/**
 * silly idea, don't actually use this:  will set this macro's image based on the color
 */
function setAsMacroImage (color) {
  const rrggbb = color.slice(1)
  macro.update({'img': `https://color-hex.org/colors/${rrggbb}.png`})
}