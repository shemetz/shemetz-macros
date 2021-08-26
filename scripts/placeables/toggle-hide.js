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
  if (!t) t = canvas.background.get(tokenNameOrTileId) || canvas.foreground.get(tokenNameOrTileId)
  if (!t) return error(`could not find token/tile ${tokenNameOrTileId}`)
  let newState
  switch (true) {
    case state === true: newState = true; break;
    case state === false: newState = false; break;
    case state === 'flip': newState = !t.data.hidden; break;
    default: newState = null; break;
  }
  if (newState === null) return error(`invalid state: ${state}`)
  return t.document.update({ 'hidden': newState })
}