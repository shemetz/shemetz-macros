
/**
 * https://github.com/League-of-Foundry-Developers/simplefog/blob/master/js/helpers.js
 */
export function readPixel (target, x = 0, y = 0) {
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


export function readAllPixels (target) {
  const { renderer } = canvas.app
  let renderTexture
  let generated = false
  if (target instanceof PIXI.RenderTexture) {
    renderTexture = target
  } else {
    renderTexture = renderer.generateTexture(target)
    generated = true
  }
  if (renderTexture) {
    renderer.renderTexture.bind(renderTexture)
  }
  const pixel = new Uint8Array(4 * target.width * target.height)
  // read pixels to the array
  const { gl } = renderer
  gl.readPixels(0, 0, target.width, target.height, gl.RGBA, gl.UNSIGNED_BYTE, pixel)
  if (generated) {
    renderTexture.destroy(true)
  }
  return pixel
}


/**
 * https://stackoverflow.com/a/49974627/1703463
 * expects RGB in 0—255 and a in 0—1
 */
export function rgbaToHex (r, g, b, a) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    + '' + (a ? ((1 << 8) + Math.round(a * 255)).toString(16).slice(1)
      : '')
}

/**
 * https://gist.github.com/JordanDelcros/518396da1c13f75ee057#gistcomment-2075095
 * args is a list like [[12, 255, 0, 0.5], [36, 19, 183, 0.2]]
 */
export function blendColors (args) {
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
