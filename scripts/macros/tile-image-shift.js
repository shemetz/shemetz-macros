/*
--- tile-image-shift ---
(similar to token-image-shift but for tiles.  useful for TriggerHappy automation)

first argument is tile ID, second argument is kind of change (number or + or -)
if 2nd argument is a number (e.g. '8') we'll set that image
if arg is '+' we'll go forward without looping
if arg is '-' we'll go backwards without looping
if arg is 'c'/'cycle' we'll go forward and loop
if arg is 'uc'/'uncycle' we'll go backwards and loop

source:
https://github.com/itamarcu/foundry-macros/blob/master/tile-image-shift.js
suggested icon:
https://i.imgur.com/iw4sH39.png
*/

const SCOPE = 'world'
const KEY_OPTIONS = 'tile-image-shift'
const KEY_CURRENT_INDEX = 'tile-image-shift_index'

const argId = args[0], argChange = args[1]
const argNum = parseInt(argChange)
const argPlus = argChange === '+' || argChange === 'next' || argChange === 'cycle' || argChange === 'c' || args.length === 0
const argMinus = argChange === '-' || argChange === 'prev' || argChange === 'uncycle' || argChange === 'uc'
const cycle = argChange === 'c' || argChange === 'cycle' || argChange === 'uc' || argChange === 'uncycle' || args.length === 0

main()

function main() {
  if (game.keyboard._downKeys.has('Control')) {
    return setupTileImages(canvas.tiles.controlled[0])
  }
  const tile = canvas.tiles.get(argId) || (argChange === undefined && canvas.tiles.controlled[0])
  if (tile === undefined) {
    return ui.notifications.error(`did not find tile with id: ${argId}.  hold Ctrl to set up for controlled tile.`)
  }
  if (
    tile.document.getFlag(SCOPE, KEY_OPTIONS) === undefined ||
    tile.document.getFlag(SCOPE, KEY_OPTIONS).length === 0
  )
    return ui.notifications.error('Please hold the Ctrl key while activating the tile-image-shift macro, to set up images.')
  const imagesText = tile.document.getFlag(SCOPE, KEY_OPTIONS)
  const options = imagesText.split('\n')
    .map(it => it.split('#')[0].trim())  // remove comments
    .filter(it => it)  // remove empty lines
  const optionImgs = options.map(it => it.split(' ')[0])
  const optionScales = options
    .map(it => it.split(' ')[1] || '1.0')
    .map(it => parseFloat(it))
  let imgIndex = tile.document.getFlag(SCOPE, KEY_CURRENT_INDEX)
  if (!(0 <= imgIndex && imgIndex < options.length)) imgIndex = 0
  const delta = argMinus ? -1 : argPlus ? +1 : 0

  const nextIndex = delta !== 0 ?
    cycle ?
      (imgIndex + options.length + delta) % options.length
      : Math.min(Math.max(imgIndex + delta, 0), options.length - 1)
    : argNum

  if (isNaN(nextIndex) || nextIndex < 0 || nextIndex >= options.length) return ui.notifications.error(`bad tile-image-shift input! ${argChange}`)
  const nextImg = optionImgs[nextIndex]
  const nextScale = optionScales[nextIndex]
  tile.document.update({'img': nextImg, 'scale': nextScale})
  tile.document.setFlag(SCOPE, KEY_CURRENT_INDEX, nextIndex)
}

function setupTileImages(tile) {
  let existingUrlsValue = tile.document.getFlag(SCOPE, KEY_OPTIONS) || ''
  if (existingUrlsValue && !existingUrlsValue.endsWith('\n'))
    existingUrlsValue += '\n'
  if (!existingUrlsValue.includes(tile.data.img)) {
    // add current to list
    existingUrlsValue += tile.data.img + ' ' + tile.data.scale + '   # default/first\n'
  }
  const dialog = new Dialog({
    title: `Tile Image Shift - image list for ${tile.id}`,
    content: `
     <p>Please put image links here, each in a new line. You can add comments after URLs by adding 
     one or more spaces; for example, "https://i.imgur.com/Ja8iNNg.png &nbsp;&nbsp;&nbsp;dragon form".</p>
      <div>
       <textarea style="height: 250px" id="urls-text" name="urls" autofocus="autofocus">${existingUrlsValue}</textarea>
      </div>
     `,
    buttons: {
      one: {
        icon: '<i class="fas fa-check"></i>',
        label: 'Set images',
        callback: (html) => {
          const urlsText = html.find('#urls-text')[0].value
          tile.document.setFlag(SCOPE, KEY_OPTIONS, urlsText)
          if (tile.document.getFlag(SCOPE, KEY_CURRENT_INDEX) === undefined)
            tile.document.setFlag(SCOPE, KEY_CURRENT_INDEX, 0)
          existingUrlsValue = urlsText
          console.log(`setting image list for ${tile.id}: ${urlsText}`)
        },
      },
      two: {
        icon: '<i class="fas fa-times"></i>',
        label: 'Cancel',
        callback: () => {
          console.log('canceled tile image setup')
        },
      },
    },
    // NO DEFAULT - on purpose, to allow Enter key in text input
    // default: 'one',
  })
  dialog.position.width = 500
  dialog.render(true)
}