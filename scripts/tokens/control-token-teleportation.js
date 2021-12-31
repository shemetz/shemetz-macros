/**
 * while ctrl key is held, dragged tokens will not animate and thus won't see between walls they "move" through
 */
export const hookControlTokenTeleportation = () => {
  Hooks.on('preUpdateToken', (doc, diff, options) => {
    const ctrlPressed = game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.CONTROL)
    if(('x' in diff || 'y' in diff) && ctrlPressed) {
      options.animate = false;
    }
  })
}