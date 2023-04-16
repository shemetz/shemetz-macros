import { showDialogWithOptions } from '../utils/dialog-utils.js'
import { selectedTokens, targetedTokens } from '../utils/token-utils.js'

export const toggleCustomCondition = async (token, conditionImg, { active, overlay = false } = {}) => {
  return token.toggleEffect(conditionImg, { active, overlay })
}

export const toggleConditionWithTokenImage = async () => {
  const tokens = selectedTokens()
  if (tokens.length === 0) return ui.notifications.warn('Select at least one token for toggleConditionPcTokenImage')
  const tokensTargeted = targetedTokens()
  if (tokensTargeted.length === 1) {
    // set image to match targeted token
    const conditionImg = tokensTargeted[0].document.texture.src
    for await (const token of tokens) {
      await toggleCustomCondition(token, conditionImg, { overlay: false })
    }
    return
  }
  const choices = [...new Set(canvas.scene.tokens
    .filter(t => t.permission >= 1 && (game.user.isGM || !t.hidden) && t.actor && t.actor.type !== 'loot')
    .map(t => t.name))]
    .sort((a, b) => {
      const combatants = game.combat ? game.combat.combatants.map(it => it.name) : []
      if (combatants.includes(a) !== combatants.includes(b))
        return +combatants.includes(b) - +combatants.includes(a)
      const tokA = canvas.scene.tokens.find(it => it.name === a)
      const tokB = canvas.scene.tokens.find(it => it.name === b)
      if ((tokA.actor.type === 'character') !== (tokB.actor.type === 'character'))
        return +(tokB.actor.type === 'character') - +(tokA.actor.type === 'character')
      return a.toLowerCase().localeCompare(b.toLowerCase())
    })
  return new Promise((resolve) => {
    showDialogWithOptions(
      'Toggle condition/effect with token image',
      'Select token',
      async (selected) => {
        const conditionImg = canvas.scene.tokens.find(it => it.name === selected).texture.src
        for await (const token of tokens) {
          await toggleCustomCondition(token, conditionImg, { overlay: false })
        }
        resolve()
      },
      choices
    )
  })
}

// added for macro-creation purposes
const simpleToggleConditionWithTargetTokenImage = async () => {
  const controlledTokens = canvas.tokens.controlled
  if (controlledTokens.length === 0) return ui.notifications.warn('Select at least one token for toggleConditionPcTokenImage')
  const targetedTokens = Array.from(game.user.targets)
  if (targetedTokens.length === 1) {
    // set image to match targeted token
    const conditionImg = targetedTokens[0].document.texture.src || targetedTokens[0].document.texture.src
    for await (const token of controlledTokens) {
      await token.toggleEffect(conditionImg, { active: undefined, overlay: false })
    }
    return
  }
  for await (const targetedToken of targetedTokens) {
    const conditionImg = targetedToken.texture.src || targetedToken.document.texture.src
    for await (const token of controlledTokens) {
      await token.toggleEffect(conditionImg, { active: undefined, overlay: false })
    }
  }
}
