/*
--- Hide Names, Hide Bars ---
For all selected tokens, names will be hidden (except owner hover) and bars will be hidden.

source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/hide-names-hide-bars.js
suggested icon:
https://i.imgur.com/R8klQVl.png
*/

main()

async function main () {
  // Update all selected tokens (yeah I know it's better to update them all at once than one by one but I'm lazy)
  for (let token of canvas.tokens.controlled) {
      await token.document.update({
          displayBars: CONST.TOKEN_DISPLAY_MODES.NONE,
          displayName: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
      });
  }
}
