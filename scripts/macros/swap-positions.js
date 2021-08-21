/*
--- Swap Positions ---
Swap two selected tokens (use Shift for the multiselection)

source:
https://github.com/itamarcu/foundry-macros/blob/master/swap-positions.js
suggested icon:
https://static.thenounproject.com/png/232484-200.png
*/

main()

async function main () {
  const tokens = canvas.tokens.controlled
  if (tokens.length !== 2) {
    ui.notifications.warn('Please select exactly 2 tokens.', {})
    return
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

  await canvas.scene.updateEmbeddedDocuments('Token', updates)
}
