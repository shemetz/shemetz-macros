/**
 This will spend your highest remaining hit die, rolling it and showing the result in the chat (not adding Constitution).
 */

export const spendHitDie = async (actor) => {
  const classes = actor.items.filter(it => { return it.type === 'class' })
  let best = null
  classes.forEach(it => {
    const itemData = it.system
    const diceData = {
      classItem: it,
      diceUsed: itemData.hitDiceUsed,
      diceTotal: itemData.levels,
      diceRemaining: itemData.levels - itemData.hitDiceUsed,
      diceSize: parseInt(itemData.hitDice.substring(1)),
    }
    if (diceData.diceRemaining > 0 && (best === null || diceData.diceSize > best.diceSize)) {
      best = diceData
    }
  })

  if (best === null) {
    ui.notifications.error(`${actor.name} has no remaining hit dice!`)
    return
  }

  await actor.items.get(best.classItem.id).update({ 'data.hitDiceUsed': best.diceUsed + 1 })
  const roll = new Roll('1d' + best.diceSize)
  await roll.roll()
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `${actor.name} spends a <b>${best.classItem.name}</b> hit die.
Remaining: ${best.diceRemaining - 1}/${best.diceTotal}.`,
  })
  await roll.toMessage()
}
