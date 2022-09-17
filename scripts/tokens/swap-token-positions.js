export const swapTokenPositions = async (tokens) => {
  if (tokens.length !== 2) {
    return ui.notifications.warn('Please select exactly 2 tokens.', {})
  }

  const updates = [
    {
      _id: tokens[0].id,
      x: tokens[1].document.x,
      y: tokens[1].document.y,
    },
    {
      _id: tokens[1].id,
      x: tokens[0].document.x,
      y: tokens[0].document.y,
    },
  ]

  return canvas.scene.updateEmbeddedDocuments('Token', updates)
}
