import { error } from '../utils/message-utils.js'

/**
 * state = true, false, or "flip"
 * tokenNameOrTileId  = "robert" or "sDdak6s4KJd"
 */
export const toggleHide = async (state, tokenNameOrTileId) => {
  if (state === undefined || tokenNameOrTileId === undefined) {
    return error(`expecting two arguments for toggle-hide: state, tokenNameOrTileId`)
  }
  let t = canvas.tokens.placeables.find(t => t.name.toLowerCase().includes(tokenNameOrTileId))
  if (!t) t = canvas.tiles.get(tokenNameOrTileId)
  if (!t) return error(`could not find token/tile ${tokenNameOrTileId}`)
  let newState
  switch (true) {
    case state === true: newState = true; break;
    case state === false: newState = false; break;
    case state === 'flip': newState = !t.document.hidden; break;
    default: newState = null; break;
  }
  if (newState === null) return error(`invalid state: ${state}`)
  return t.document.update({ 'hidden': newState })
}

const toggleVisibility = async (canvasObjectList, documentName) => {
  if (canvasObjectList.controlled[0]) {
    return canvas.scene.updateEmbeddedDocuments(
      documentName,
      canvasObjectList.controlled.map(it => ({ _id: it.id, hidden: !it.document.hidden }))
    )
  } else return false
}

export const hookHiddenHotkey = () => {
  game.keybindings.register('shemetz-macros', 'toggle-hidden', {
    name: 'Toggle Hidden',
    hint: 'Toggle the visibility state of each selected token, tile, or drawing (hiding or revealing it).',
    editable: [
      { key: 'KeyH' }
    ],
    onDown: async () => {
      // only one of the following will happen, because the user can only be on a single layer
      return await toggleVisibility(canvas.tokens, 'Token') ||
      await toggleVisibility(canvas.drawings, 'Drawing') ||
      await toggleVisibility(canvas.tiles, 'Tile') ||
      false
    },
  })
}
