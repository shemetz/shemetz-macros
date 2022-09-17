import { getImageListIndex, hasImageList, prepareShiftImageWithArgs } from '../placeables/image-shift.js'

export const shiftManyTokens = async (tokenNames) => {
  const updates = canvas.tokens.placeables
    .filter(tok => tokenNames.includes(tok.name))
    .map(tok => {
      return prepareShiftImageWithArgs(tok, 1, true, true)
    })
  return canvas.scene.updateEmbeddedDocuments('Token', updates)
}

export const checkIfAllTokensAtIndex0 = async (tokenNames) => {
  return canvas.tokens.placeables
    .filter(tok => tokenNames.includes(tok.name))
    .every(tok => {
      return getImageListIndex(tok) === 0
    })
}

export const shiftSelectedTilesOrTokens = async () => {
  const tiles = [...canvas.tiles.controlled]
  const tokens = [...canvas.tokens.controlled]
  const embeddedName = tiles.length === 0 ? 'Token' : 'Tile'
  const updates = (embeddedName === 'Tile' ? tiles : tokens)
    .map(placeable => {
      if (!hasImageList(placeable)) return null
      return prepareShiftImageWithArgs(placeable, 1, true, true)
    })
    .filter(it => it !== null)
  return canvas.scene.updateEmbeddedDocuments(embeddedName, updates)
}
