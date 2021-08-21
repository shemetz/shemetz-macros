/*
state = true, false, or "flip"
tokenNameOrTileId  = "robert" or "sDdak6s4KJd"
*/
const state = args[0], tokenNameOrTileId = args[1]

main()

function main() {
  if (state === undefined || tokenNameOrTileId === undefined) {
    ui.notifications.error(`expecting two arguments for toggle-hide: state, tokenNameOrTileId`);
    return
  }
  let t = canvas.tokens.placeables.find(t => t.name.toLowerCase().includes(tokenNameOrTileId))
  if (!t) t = canvas.tiles.get(tokenNameOrTileId)
  if (!t) return ui.notifications.error(`could not find token/tile ${tokenNameOrTileId}`)
  const newState = state === true ? true : state === false ? false : state === "flip" ? !t.data.hidden : null
  if (newState === null) return ui.notifications.error(`invalid state: ${state}`)
  t.update({'hidden': newState})
}