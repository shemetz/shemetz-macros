/*
--- Show Names, Hide Bars ---
For all selected tokens, names will be shown and bars will be hidden.

source:
https://github.com/itamarcu/foundry-macros/blob/master/show-names-hide-bars.js
suggested icon:
https://i.imgur.com/Wrt5uIE.png
*/

main()

async function main() {
  // Update all selected tokens (yeah I know it's better to update them all at once than one by one but I'm lazy)
  for (let token of canvas.tokens.controlled) {
    await token.document.update({
      displayBars: CONST.TOKEN_DISPLAY_MODES.NONE,
      displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
    })
  }
}
