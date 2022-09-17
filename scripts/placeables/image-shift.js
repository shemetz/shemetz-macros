import { selectedTokenOrTile } from '../utils/placeable-utils.js'

/**
 * Hold the Control key to set up images.
 * Hold the Shift key to shift backwards instead of forwards.
 * Shifting will cycle through the images (going from last back to first).
 */
export const shiftSelectedPlaceableImageByKeyboard = async () => {
  const placeable = selectedTokenOrTile()
  if (!placeable)
    return ui.notifications.error('Select a token/tile before activating the image shift macro! (hold Ctrl to setup)')
  if (game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.CONTROL))
    return openImageSetupDialog(placeable)
  const { images } = getImageList(placeable)
  if (!images || images.length <= 1)
    return ui.notifications.error('Please hold the Ctrl key while activating the image shift macro, to set up images.')
  const currentIndex = getImageListIndex(placeable)
  const delta = game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.SHIFT) ? -1 : +1
  const newIndex = (currentIndex + images.length + delta) % images.length
  const update = prepareShiftImage(placeable, newIndex)
  return placeable.document.update(update)
}

/**
 * @param placeable a token or a tile
 * @param delta 1 to move one forward, -1 to move one back, etc
 * @param canCycle true if should cycle (0→1→2→3→0→1), false if shouldn't (0→1→2→3→3→3)
 */
export const shiftImageWithArgs = async (placeable, delta, canCycle) => {
  const update = prepareShiftImageWithArgs(placeable, delta, canCycle)
  return placeable.document.update(update)
}

/**
 * just like shiftImageWithArgs but returns update object instead of updating immediately
 */
export const prepareShiftImageWithArgs = (placeable, delta, canCycle) => {
  const { images } = getImageList(placeable)
  const currentIndex = getImageListIndex(placeable)
  const newIndex = canCycle
    ? (currentIndex + images.length + delta) % images.length
    : Math.min(Math.max(currentIndex + delta, 0), images.length - 1)
  return prepareShiftImage(placeable, newIndex)
}

/**
 * @param placeable a token or a tile
 * @param targetImageIndex index of line in image shift setup window (first line is index 0)
 */
export const shiftImageToIndex = async (placeable, targetImageIndex) => {
  const update = prepareShiftImageToIndex(placeable, targetImageIndex)
  return placeable.document.update(update)
}

/**
 * just like shiftImageToIndex but returns update object instead of updating immediately
 */
export const prepareShiftImageToIndex = (placeable, targetImageIndex) => {
  return prepareShiftImage(placeable, targetImageIndex)
}

const prepareShiftImage = (placeable, newIndex) => {
  const { images, scales } = getImageList(placeable)
  const newImg = images[newIndex]
  const newScale = scales[newIndex]
  return {
    _id: placeable.id,
    img: newImg,
    scale: newScale,
  }
}

const OPTIONS_FLAG = ['world', 'shemetz_image-shift']

const getPlaceableDocument = (placeable) => {
  if (!placeable) {
    console.error(`Error: you tried shifting the image of ${placeable}`)
    return { getFlag: () => undefined }
  }
  return placeable.document.actor ? placeable.document.actor : placeable.document
}

const getImageListBackwardsCompatible = (placeable) => {
  // for tokens, the data is stored in the actor
  const doc = getPlaceableDocument(placeable)
  // TODO: remove all of this a few months from now when not needed anymore
  let old = doc.getFlag('world', 'token-image-swap')
  if (old) {
    doc.setFlag(...OPTIONS_FLAG, old).then(() => {
      doc.unsetFlag('world', 'token-image-swap')
    })
    return old
  }
  old = doc.getFlag('world', 'tile-image-shift')
  if (old) {
    doc.setFlag(...OPTIONS_FLAG, old).then(() => {
      doc.unsetFlag('world', 'tile-image-shift')
    })
    return old
  }
  // new version
  return doc.getFlag(...OPTIONS_FLAG)
}

const getImageList = (placeable) => {
  const imagesText = getImageListBackwardsCompatible(placeable)
  if (imagesText === undefined)
    return { images: undefined, scales: undefined }
  const options = imagesText.split('\n')
    .map(it => it.split('#')[0].trim())  // remove comments
    .filter(it => it)  // remove empty lines
  const images = options.map(it => it.split(' ')[0])
  const scales = options
    .map(it => it.split(' ')[1] || '1.0')
    .map(it => parseFloat(it))
  return { images, scales }
}

const setImageList = (placeable, imageList) => {
  return getPlaceableDocument(placeable).setFlag(...OPTIONS_FLAG, imageList)
}

export const hasImageList = (placeable) => {
  return getImageListBackwardsCompatible(placeable) !== undefined
}

/**
 * defaults to index 0 if current image is unfamiliar
 */
export const getImageListIndex = (placeable) => {
  const { images } = getImageList(placeable)
  const currentImage = placeable.document.texture.src
  let imgIndex = images.indexOf(currentImage)
  if (!(0 <= imgIndex && imgIndex < images.length)) imgIndex = 0
  return imgIndex
}

function openImageSetupDialog (placeable) {
  let existingImageList = getImageListBackwardsCompatible(placeable) || ''
  if (existingImageList && !existingImageList.endsWith('\n'))
    existingImageList += '\n'
  if (!existingImageList.includes(placeable.document.texture.src)) {
    // add current to list
    existingImageList += placeable.document.texture.src
      + (placeable.document.scale !== undefined ? ' ' + placeable.document.scale : '')
      + '   # default/first\n'
  }
  const dialog = new Dialog({
    title: `Image Shift - image list for ${placeable.name || placeable.id}`,
    content: `
     <p>Please put image links here, each in a new line. Second string in line is token size,
      third string is comment; for example, 
     <br>&nbsp;&nbsp;&nbsp;&nbsp;"https://i.imgur.com/Ja8iNNg.png 1.5 &nbsp;&nbsp;&nbsp;dragon form".</p>
      <div>
       <textarea style="height: 250px" id="urls-text" name="urls" autofocus="autofocus">${existingImageList}</textarea>
      </div>
     `,
    buttons: {
      one: {
        icon: '<i class="fas fa-check"></i>',
        label: 'Set images',
        callback: (html) => {
          const urlsText = html.find('#urls-text')[0].value
          setImageList(placeable, urlsText)
          existingImageList = urlsText
          console.log(`setting image list for ${placeable.id}: \n${urlsText}`)
        },
      },
      two: {
        icon: '<i class="fas fa-times"></i>',
        label: 'Cancel',
        callback: () => {
          console.log('canceled placeable image setup')
        },
      },
    },
    // NO DEFAULT - on purpose, to allow Enter key in text input
    // default: 'one',
  })
  dialog.position.width = 500
  dialog.render(true)
}

export const hookImageShiftHotkey = () => {
  const { CONTROL, SHIFT } = KeyboardManager.MODIFIER_KEYS
  game.keybindings.register('shemetz-macros', 'image-shift', {
    name: 'Image Shift',
    hint: 'Shift to next token/tile image (requires setup).' +
      ' Hold the Control key to set up images.' +
      ' Hold the Shift key to shift backwards instead of forwards.',
    editable: [],
    reservedModifiers: [CONTROL, SHIFT],
    onDown: async () => {
      const tokens = canvas.tokens.controlled
      const tiles = canvas.tiles.controlled
      if (tokens.length + tiles.length === 1) {
        return shiftSelectedPlaceableImageByKeyboard()
      } else if (tokens.length + tiles.length === 0) {
        ui.notifications.warn(`Cannot image-shift;  no tokens/tiles are selected`)
      } else {
        for (const t of [...tokens, ...tiles]) {
          if (!hasImageList(t)) continue
          const delta = game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.SHIFT) ? -1 : +1
          await shiftImageWithArgs(t, delta, true)
        }
      }
    },
  })
}
