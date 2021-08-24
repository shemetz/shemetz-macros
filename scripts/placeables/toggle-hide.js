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
  const newState = state === true ? true : state === false ? false : state === 'flip' ? !t.data.hidden : null
  if (newState === null) return error(`invalid state: ${state}`)
  return t.update({ 'hidden': newState })
}