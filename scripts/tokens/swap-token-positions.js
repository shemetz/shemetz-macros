export const swapTokenPositions = async (tokens) => {
  if (tokens.length !== 2) {
    return ui.notifications.warn('Please select exactly 2 tokens.', {})
  }

  const updates = [
    {
      _id: tokens[0].data._id,
      x: tokens[1].data.x,
      y: tokens[1].data.y,
    },
    {
      _id: tokens[1].data._id,
      x: tokens[0].data.x,
      y: tokens[0].data.y,
    },
  ]

  canvas.scene.updateEmbeddedDocuments('Token', updates)
}
