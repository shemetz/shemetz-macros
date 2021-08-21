/*
--- Reset Activation State ---
Will "reset" all selected tokens that were "opened" by the treasure-chest macro and similar stuff.
If you hold Ctrl while activating the macro, it will "activate" them instead (but not show any contents).

source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/reset-activation-state.js
suggested icon:
https://i.imgur.com/pHWzz8u.png
 */

const FLAG_SCOPE = 'world'
const FLAG_KEY_TOGGLE = 'macro-toggle-activation-state'
const FLAG_KEY_IMAGE_SWAP = 'token-image-swap'

main()

function main() {
  const close = !game.keyboard._downKeys.has('Control')
  let updates
  if (close) {
    updates = canvas.tokens.controlled
      .filter(tok => tok.document.getFlag(FLAG_SCOPE, FLAG_KEY_TOGGLE) === true)
      .map(tok => {
        if (tok.actor && tok.actor.getFlag(FLAG_SCOPE, FLAG_KEY_IMAGE_SWAP)) {
          game.macros.getName('token-image-shift').renderContent(tok.name, '-')
        }
        return {
          _id: tok.id,
          [`flags.${FLAG_SCOPE}.-=${FLAG_KEY_TOGGLE}`]: null
        }
      })
  } else {
    updates = canvas.tokens.controlled
      .filter(tok => tok.document.getFlag(FLAG_SCOPE, FLAG_KEY_TOGGLE) !== true)
      .map(tok => {
        if (tok.actor && tok.actor.getFlag(FLAG_SCOPE, FLAG_KEY_IMAGE_SWAP)) {
          game.macros.getName('token-image-shift').renderContent(tok.name, '+')
        }
        return {
          _id: tok.id,
          [`flags.${FLAG_SCOPE}.${FLAG_KEY_TOGGLE}`]: true
        }
      })
  }

  console.log(`${close ? 'Closed' : 'Opened'} ${updates.length} treasure chest tokens.`)
  canvas.scene.updateEmbeddedDocuments('Token', updates)
}
