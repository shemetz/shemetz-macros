/*
--- Flip ---
Flips the selected token image along the X axis.
You can edit this to flip across the Y axis by replacing mirrorX with mirrorY.

source:
https://github.com/shemetz/shemetz-macros/blob/master/scripts/macros/flip.js
suggested icon:
https://emojiguide.org/images/emoji/1/w8iuxo1l9in91.png
 */

export const flipTokens = async (tokens, horizontally = false, vertically = false) => {
  const updates = tokens.map(tok => {
    if (Math.roundDecimals(tok.document.texture.scaleX, 1) === tok.document.texture.scaleX)
      return {
        _id: tok.id,
        'texture.scaleX': tok.document.texture.scaleX * (horizontally ? -1 : 1),
        'texture.scaleY': tok.document.texture.scaleY * (vertically ? -1 : 1),
      }
    else return undefined
  }).filter(x => !!x)
  return canvas.scene.updateEmbeddedDocuments('Token', updates, {
    animation: {
      duration: 200,
      easing: 'easeInOutCosine',
    },
  })
}

export function hookFlipHotkey () {
  const { SHIFT } = KeyboardManager.MODIFIER_KEYS
  game.keybindings.register('shemetz-macros', 'flip', {
    name: 'Flip token(s)',
    hint: 'Flips the selected token image along the X axis.' +
      'Hold Shift to flip vertically instead.',
    editable: [
      {
        key: 'Equal',
      },
    ],
    reservedModifiers: [SHIFT],
    onDown: async () => {
      const vertical = game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.SHIFT)
      return flipTokens(ShemetzMacros.selectedTokens(), !vertical, vertical)
    },
  })
}
