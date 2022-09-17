/*
--- Flip ---
Flips the selected token image along the X axis.
You can edit this to flip across the Y axis by replacing mirrorX with mirrorY.

source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/flip.js
suggested icon:
https://emojiguide.org/images/emoji/1/w8iuxo1l9in91.png
 */

export const flipTokens = async (tokens, horizontally = false, vertically = false) => {
  const updates = tokens.map(tok => ({
    _id: tok.id,
    'texture.scaleX': tok.document.texture.scaleX * (horizontally ? -1 : 1),
    'texture.scaleY': tok.document.texture.scaleY * (vertically ? -1 : 1),
  }))
  return canvas.scene.updateEmbeddedDocuments('Token', updates, {
    animation: {
      duration: 200,
      easing: 'easeInOutCosine'
    }
  })
}
