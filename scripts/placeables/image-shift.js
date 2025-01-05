/**
 * Hold the Control key to set up images.
 * Hold the Shift key to shift backwards instead of forwards.
 * Shifting will cycle through the images (going from last back to first).
 */
export const shiftSelectedPlaceableImageByKeyboard = async (shouldAnimate = false) => {
  const ctrlHeld = game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.CONTROL)
  const directionDelta = game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.SHIFT) ? -1 : +1
  const tokens = [...canvas.tokens.controlled]
  const tiles = [...canvas.tiles.controlled]
  const controlledTokensOrTiles = tokens.length > 0 ? tokens : tiles
  if (controlledTokensOrTiles.length > 1) {
    if (ctrlHeld)
      return ui.notifications.error('Select only one token/tile if you\'re trying to setup the image shift macro!')
    else {
      // shift many at once!
      const embeddedName = tiles.length === 0 ? 'Token' : 'Tile'
      const updates = controlledTokensOrTiles.map(placeable => {
        if (!hasImageList(placeable)) return null
        return prepareShiftImageWithArgs(placeable, directionDelta, true)
      }).filter(it => it !== null)
      return canvas.scene.updateEmbeddedDocuments(embeddedName, updates, { animate: shouldAnimate }).then(() => {
        // core Foundry bug fix - need to refresh token borders after image update, otherwise they disappear!
        setTimeout(() => {
          tokens.forEach(
            tok => tok.refreshHUD({ bars: false, border: true, effects: false, elevation: false, nameplate: false }),
          )
        }, 100)
      })
    }
  }
  if (controlledTokensOrTiles.length < 1)
    return ui.notifications.error('Select a token/tile before activating the image shift macro! (hold Ctrl to setup)')
  const placeable = controlledTokensOrTiles[0]
  if (ctrlHeld)
    return openImageSetupDialog(placeable)
  const { images } = getImageList(placeable)
  if (!images || images.length <= 1)
    return ui.notifications.error('Please hold the Ctrl key while activating the image shift macro, to set up images.')
  const currentIndex = getImageListIndex(placeable)
  const newIndex = (currentIndex + images.length + directionDelta) % images.length
  const update = prepareShiftImage(placeable, newIndex)
  return placeable.document.update(update, { animate: shouldAnimate }).then(() => {
    // core Foundry bug fix - need to refresh token borders after image update, otherwise they disappear!
    setTimeout(() => {
      placeable?.refreshHUD({ bars: false, border: true, effects: false, elevation: false, nameplate: false })
    }, 100)
  })
}

/**
 * @param placeable a token or a tile
 * @param delta 1 to move one forward, -1 to move one back, etc
 * @param canCycle true if should cycle (0→1→2→3→0→1), false if shouldn't (0→1→2→3→3→3)
 * @param shouldAnimate true if scale animation should be shown (otherwise rescaling will be instant)
 */
export const shiftImageWithArgs = async (placeable, delta, canCycle, shouldAnimate) => {
  const update = prepareShiftImageWithArgs(placeable, delta, canCycle)
  return placeable.document.update(update, { animate: !!shouldAnimate })
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
 * @param shouldAnimate true if scale animation should be shown (otherwise rescaling will be instant)
 */
export const shiftImageToIndex = async (placeable, targetImageIndex, shouldAnimate) => {
  const update = prepareShiftImageToIndex(placeable, targetImageIndex)
  return placeable.document.update(update, { animate: !!shouldAnimate })
}

/**
 * just like shiftImageToIndex but returns update object instead of updating immediately
 */
export const prepareShiftImageToIndex = (placeable, targetImageIndex) => {
  return prepareShiftImage(placeable, targetImageIndex)
}

const prepareShiftImage = (placeable, newIndex) => {
  const { images, scales } = getImageList(placeable)
  const usesRing = placeable.document.ring?.enabled && placeable.document.ring.subject.texture
  const newImg = images[newIndex]
  const newScale = scales[newIndex]
  const signOfOldScaleX = placeable.document.texture.scaleX > 0 ? +1 : -1
  const signOfOldScaleY = placeable.document.texture.scaleY > 0 ? +1 : -1
  return {
    _id: placeable.id,
    ...(usesRing && { 'ring.subject.texture': newImg }),
    ...(usesRing && { 'ring.subject.scale': newScale }),
    ...(!usesRing && { 'texture.src': newImg }),
    'texture.scaleX': newScale ? newScale * signOfOldScaleX : undefined,
    'texture.scaleY': newScale ? newScale * signOfOldScaleY : undefined,
    'flags.pf2e.autoscale': (!usesRing && newScale) ? false : undefined,
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

const getImagesListFlag = (placeable) => {
  // for tokens, the data is stored in the actor
  const doc = getPlaceableDocument(placeable)
  // new version
  return doc.getFlag(...OPTIONS_FLAG)
}

const getImageList = (placeable) => {
  const imagesText = getImagesListFlag(placeable)
  if (imagesText === undefined)
    return { images: undefined, scales: undefined }
  const options = imagesText.split('\n').map(it => it.split('#')[0].trim())  // remove comments
    .filter(it => it)  // remove empty lines
  // split by spaces
  const images = options.map(it => it.split(/\s+/)[0])
  const scales = options.map(it => it.split(/\s+/)[1] || undefined).
    map(it => it === undefined ? undefined : parseFloat(it))
  return { images, scales }
}

const setImageList = (placeable, imageList) => {
  return getPlaceableDocument(placeable).setFlag(...OPTIONS_FLAG, imageList)
}

export const hasImageList = (placeable) => {
  return getImagesListFlag(placeable) !== undefined
}

/**
 * defaults to index 0 if current image is unfamiliar
 */
export const getImageListIndex = (placeable) => {
  const { images } = getImageList(placeable)
  const usesRing = placeable.document.ring?.enabled && placeable.document.ring.subject.texture
  const currentImage = usesRing ? placeable.document.ring.subject.texture : placeable.document.texture.src
  let imgIndex = images.indexOf(currentImage)
  if (!(0 <= imgIndex && imgIndex < images.length)) imgIndex = 0
  return imgIndex
}

function openImageSetupDialog (placeable) {
  let existingImageList = getImagesListFlag(placeable) || ''
  if (existingImageList && !existingImageList.endsWith('\n'))
    existingImageList += '\n'
  const usesRing = placeable.document.ring?.enabled && placeable.document.ring.subject.texture
  const currentImage = usesRing ? placeable.document.ring.subject.texture : placeable.document.texture.src
  const currentScale = usesRing ? placeable.document.ring.subject.scale : placeable.document.texture.scaleX
  if (!existingImageList.includes(currentImage)) {
    // add current to list
    existingImageList += currentImage
      + '    ' + currentScale.toString()
      + '    # default/first\n'
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
      return shiftSelectedPlaceableImageByKeyboard()
    },
  })
}
