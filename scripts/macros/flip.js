/*
--- Flip ---
Flips the selected token image along the X axis.
You can edit this to flip across the Y axis by replacing mirrorX with mirrorY.

source:
https://github.com/itamarcu/foundry-macros/blob/master/flip.js
suggested icon:
https://emojiguide.org/images/emoji/1/w8iuxo1l9in91.png
 */

for (const token of canvas.tokens.controlled) {
  const flip = !token.data.mirrorX || false
  token.document.update({ mirrorX: flip })
}
