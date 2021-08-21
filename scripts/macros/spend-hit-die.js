/*
--- Spend Hit Die (5e) ---
This will spend your highest remaining hit die, rolling it and showing the result in the chat (not adding Constitution).

source:
https://github.com/itamarcu/foundry-macros/blob/master/spend-hit-die.js
suggested icon:
https://reprog.files.wordpress.com/2011/01/1d8.png
 */

const classes = actor.data.items.filter(it => { return it.type === 'class' })
let best = null
classes.forEach(it => {
  const diceData = {
    classItem: it,
    diceUsed: it.data.hitDiceUsed,
    diceRemaining: it.data.levels - it.data.hitDiceUsed,
    diceSize: parseInt(it.data.hitDice.substring(1)),
  }
  if (diceData.diceRemaining > 0 && (best === null || diceData.diceSize > best.diceSize)) {
    best = diceData
  }
})

if (best === null) {
  ui.notifications.error(`${actor.name} has no remaining hit dice!`)
  return
}

actor.items.get(best.classItem._id).update({ 'data.hitDiceUsed': best.diceUsed + 1 })
const roll = new Roll('1d' + best.diceSize)
roll.roll()
await ChatMessage.create({
  speaker: ChatMessage.getSpeaker({ actor }),
  content: `${actor.name} spends a <b>${best.classItem.name}</b> hit die.\nRemaining: ${best.diceRemaining - 1}/${best.classItem.data.levels}.`,
})
await roll.toMessage()