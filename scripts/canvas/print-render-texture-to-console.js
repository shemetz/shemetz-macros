import { readAllPixels, rgbaToHex } from '../utils/canvas-pixi-utils.js'

let latestTarget = null, latestPixels = null

/**
 * note - you gotta give a resolution that evenly divides with the target width and height!
 */
export const printRenderTextureToConsole = (target, resolution = {}) => {
  const { width, height } = target
  if (!resolution.x) {
    resolution = {x: width / 100 * 2, y: height / 100}
  }
  const pixels = target === latestTarget ? latestPixels : readAllPixels(target)
  latestTarget = target
  latestPixels = pixels
  const consoleLogArgs = [('%c '.repeat(resolution.x) + '\n').repeat(resolution.y)]
  for (let y = 0; y < height; y += height / resolution.y) {
    for (let x = 0; x < width; x += width / resolution.x) {
      const pos = 4 * width * y + 4 * x
      const [r, g, b, a] = [...pixels.subarray(pos, pos + 4)]
      // converting alpha from 0—255 to 0—1
      const color = rgbaToHex(r, g, b, a/255)
      consoleLogArgs.push(`background: ${color}`)
    }
  }
  consoleLogArgs[0] = '\n' + consoleLogArgs[0]
  console.log(...consoleLogArgs)
}

/**
 * note - you gotta give a resolution that evenly divides with the target width and height!
 */
export const printScreenToConsole = (resolution = {}) => {
  const target = canvas.app.renderer
  canvas.app.render()
  const canv = canvas.app.renderer.extract.canvas();
  const context = canv.getContext('2d')
  const { width, height } = target
  if (!resolution.x) {
    resolution.x = width / 100
  }
  if (!resolution.y) {
    // dividing by 2 because each ' ' is more high than it is tall
    resolution.y = Math.floor(resolution.x * height / width / 2)
  }
  const pixelLocalSize = { width: Math.floor(width / resolution.x), height: Math.floor(height / resolution.y)}
  const pixels = context.getImageData(0, 0, 1920, 1080).data
  const consoleLogArg0 = []
  const consoleLogColors = []
  consoleLogArg0.push('\n') // extra newline at the start to avoid the file name pushing text
  for (let y = 0; y < height; y += pixelLocalSize.height) {
    for (let x = 0; x < width; x += pixelLocalSize.width) {
      const pos = 4 * width * y + 4 * x
      const [r, g, b, a] = [...pixels.subarray(pos, pos + 4)]
      // converting alpha from 0—255 to 0—1
      const color = rgbaToHex(r, g, b, a/255)
      consoleLogArg0.push('%c ')
      consoleLogColors.push(`background: ${color}`)
    }
    consoleLogArg0.push('\n')
  }
  console.log(consoleLogArg0.join(''), ...consoleLogColors)
}