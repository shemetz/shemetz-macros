import { getImageListIndex, shiftImageWithArgs } from '../placeables/image-shift'

export const shiftManyTokens = async (tokenNames) => {
  const updates = canvas.tokens.placeables
    .filter(tok => tokenNames.includes(tok.name))
    .map(tok => {
      return shiftImageWithArgs(tok, 1, true, true)
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