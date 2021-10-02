import { selectedTokens } from '../utils/token-utils.js'

export const markDeadWithHealthEstimate = async (imageSrc) => {
  for await (const token of selectedTokens()) {
    await token.toggleEffect(imageSrc, { overlay: true });
    const isAlive = !token.document.getFlag("healthEstimate", "dead")
    await token.document.setFlag("healthEstimate", "dead", isAlive)
    if (game.combat) await game.combat.getCombatantByToken(token.id).update({'defeated': !isAlive})
  }
}