export const selectedTokenOrTile = () => {
  return canvas.tokens.controlled[0]
    || canvas.tiles.controlled[0]
}

export const getTileWithId = (tileId) => {
  const tile = canvas.tiles.get(tileId)
  if (!tile) ui.notifications.error(`tile ${tileId} cannot be found on the scene!`)
  return tile
}

export const getPlaceableWithId = (id) => {
  const placeable = canvas.tokens.get(id)
    || canvas.tiles.get(id)
    || canvas.walls.get(id)
  if (!placeable) ui.notifications.error(`placeable ${id} cannot be found on the scene!`)
  return placeable
}
