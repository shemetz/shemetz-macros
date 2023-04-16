// Macro to combine last 2 damage rolls for purposes of easy IWR and to support feats like Double Slice, Flurry of Blows, etc...
const combineRecentDamages = (numOfRollsToCombine = 2) => {
  const damageRolls = game.messages
    .filter(it => it.flags.pf2e.context?.type === 'damage-roll')
    .slice(-numOfRollsToCombine)
  if (damageRolls.length < numOfRollsToCombine) {
    return ui.notifications.error(
      `There are not at least ${numOfRollsToCombine} damage rolls in chat.`)
  }

  const combinedDamage = combineAppliedDamages(damageRolls)
  combinedDamage.toMessage({
    flavor: `<h3>Combined Total Damage From...</h3>` +
      damageRolls.map(dr => dr.item.name).join(`<br/>`),
    speaker: ChatMessage.getSpeaker(),
  })
}

const combineAppliedDamages = (damageRolls) => {
  // Throw the dice away, we just need the values combined for IWR
  const results = new Map()
  damageRolls.forEach(damageRoll => {
    damageRoll.rolls.forEach(roll => {
      roll.terms.forEach(term => {
        term.rolls.forEach(roll => {
          let damageType = roll.type
          let damageTotal = roll.total
          const isPersistent = roll._formula.includes('persistent')
          const damageTypeFoundBefore = results.has(damageType)

          if (isPersistent) {
            damageType = damageType.concat(',persistent')
            const bracketIndex = roll._formula.lastIndexOf('[')
            damageTotal = roll._formula.substring(0, bracketIndex)
            const uuid = Math.random().toString(36).slice(-6)
            results.set(damageType + '~' + uuid, damageTotal)
          } else if (!damageTypeFoundBefore) {
            results.set(damageType, damageTotal)
          } else {
            const currentValue = results.get(damageType)
            results.set(damageType, currentValue + damageTotal)
          }
        })
      })
    })
  })

  let finalFormula = ''
  results.forEach(function (value, key, _map) {
    const uuidIndex = key.lastIndexOf('~')
    let damageType = key
    if (uuidIndex > 0) {
      damageType = key.substring(0, uuidIndex)
    }
    finalFormula = finalFormula.concat(`(${value})[${damageType}], `)
  })

  finalFormula = finalFormula.replace(/,\s*$/, '')
  const DamageRoll = CONFIG.Dice.rolls.find(RC => RC.name === 'DamageRoll')
  return new DamageRoll(finalFormula)
}

export const combineRecentDamagesPf2e = combineRecentDamages