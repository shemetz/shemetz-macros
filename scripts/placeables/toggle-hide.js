import { error } from '../utils/message-utils.js'

/**
 * @param state true, false, or "flip"
 * @param tokenNameOrTileId e.g. "robert" or "sDdak6s4KJd"
 */
export const toggleHide = async (state, tokenNameOrTileId) => {
  if (state === undefined || tokenNameOrTileId === undefined) {
    return error(`expecting two arguments for toggle-hide: state, tokenNameOrTileId`)
  }
  let t = canvas.tokens.placeables.find(t => t.name.toLowerCase().includes(tokenNameOrTileId))
  if (!t) t = canvas.tiles.get(tokenNameOrTileId)
  if (!t) return error(`could not find token/tile ${tokenNameOrTileId}`)
  let newState
  switch (state) {
    case true:
    case 'true':
      newState = true
      break
    case false:
    case 'false':
      newState = false
      break
    case 'flip':
      newState = !t.document.hidden
      break
    default:
      return error(`invalid state: ${state} (use true, false, or "flip")`)
  }
  return t.document.update({ 'hidden': newState })
}

const onToggleHiddenPressed = async () => {
  const controlledPlaceables = canvas.activeLayer?.controlled
  if (controlledPlaceables?.length <= 0)
    return
  const documentName = canvas.activeLayer.documentCollection.documentClass.documentName
  if (controlledPlaceables[0].document.hidden === undefined)
    return ui.notifications.error(`${documentName} does not have a 'hidden' property, so this keybind won't work.`)

  return canvas.scene.updateEmbeddedDocuments(
    documentName,
    controlledPlaceables.map(it => ({ _id: it.id, hidden: !it.document.hidden })),
  )
}

export const hookHiddenHotkey = () => {
  game.keybindings.register('shemetz-macros', 'toggle-hidden', {
    name: 'Toggle Hidden (GM only)',
    hint: 'Toggle the visibility state of each selected token, tile, or drawing (hiding or revealing it).',
    editable: [
      { key: 'KeyH' },
    ],
    restricted: true,
    onDown: onToggleHiddenPressed,
  })
}
