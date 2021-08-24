export const openCloseDoors = (command, doorIds) => {
  const updates = doorIds.map(doorId => {
    const wall = canvas.walls.get(doorId)
    if (wall === undefined) {
      ui.notifications.error(`bad door ID: ${doorId}`)
      return null
    }

    let newDoorState
    if (command === 'open') newDoorState = 1
    if (command === 'close') newDoorState = 0
    if (command === 'toggle') newDoorState = 1 - wall.data.ds
    if (newDoorState === undefined) {
      ui.notifications.error(`bad door command: ${command} (should be 'open'/'close'/'toggle')`)
      return null
    }
    return {
      _id: doorId,
      ds: newDoorState,
    }
  }).filter(u => !!u)
  canvas.scene.updateEmbeddedDocuments('Wall', updates)
}