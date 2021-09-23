let isKeyDown = true

const onKeyUp = async () => {
  isKeyDown = false
}

const onKeyDown = async () => {
  if (canvas.tokens._hover && !isKeyDown) {
    isKeyDown = true
    // not doing this because it creates a chat message:
    //game.pf2e.StatusEffects.setStatus(canvas.tokens._hover, [{ name: 'flatFooted', toggle: true }]);
    const token = canvas.tokens._hover
    const isAlreadyFFed = token.actor.hasCondition('flat-footed')
    if (isAlreadyFFed)
      await game.pf2e.ConditionManager.removeConditionFromToken([token.actor.getCondition('flat-footed').id], token)
    else {
      const newCondition = game.pf2e.ConditionManager.getCondition('flat-footed').toObject();
      newCondition.data.sources.hud =
      token.statusEffectChanged = !0
      await game.pf2e.ConditionManager.addConditionToToken(newCondition, token)
    }
  }
}

export const hookPf2eFlatfootedShortcut = () => {
  // Binding with a default key and a simple callback
  KeybindLib.register("shemetz-macros", "flatfooted", {
    name: "Toggle Flatfooted",
    hint: "Set or remove flat-footed of the token under the mouse.",
    default: "KeyF",
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp,
  });
}

