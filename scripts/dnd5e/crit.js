import { error, makeTableResultBold } from '../utils/message-utils.js'
import { getDependency } from '../utils/data-utils.js'
import { showDialogWithOptions } from '../utils/dialog-utils.js'

const CRIT_TYPES = [
  'Bludgeoning',
  'Piercing', // pierce
  'Slashing',
  'Fire',
  'Acid',
  'Cold', // ice
  'Force',
  'Poison',
  'Lightning',
  'Necrotic',
  'Psychic',
  'Thunder',
  'Radiant',
  'Insanity',
  'Minor Injury',
  'Major Injury',
  'Fail/Fumble',
]

/**
 Rolls a crit from one of the expanded critical tables (required as Rollable Tables with those names)

 @param critTypeStr - one of the damage types, plus Insanity, Minor Injury, Major Injury, Fumble/Failure.  Can
 be lowercase and partial string, e.g. "maj" or "bludg".
 */
export const crit = async (critTypeStr) => {
  let cleanInput = critTypeStr.toLowerCase().trim()
  // some common alternatives:
  if (cleanInput.includes('ice'))
    cleanInput = 'cold'
  if (cleanInput.includes('pierce'))
    cleanInput = 'piercing'
  const critTypeIdx = CRIT_TYPES.map(it => it.toLowerCase()).indexOf(cleanInput)
  if (critTypeIdx === -1)
    return error(`You should pick a crit type from: ${CRIT_TYPES.join(', ')} (can be partial, e.g. 'bludg')`)
  const critType = CRIT_TYPES[critTypeIdx]

  const table = await getDependency(game.tables, 'critical-hits', critType)
  if (!table) {
    return error(`Failed using ${input} crit - make sure you have the critical-hits compendium`)
  }

  const roll = await table.roll()
  const rollPart = roll.roll
  const resultPart = roll.results[0].clone() // copy, otherwise we edit original table! :O
  resultPart.data.text = makeTableResultBold(resultPart.data.text)

  table.draw({ roll: rollPart, results: [resultPart] })
}

export const critDialog = async () => {
  showDialogWithOptions(
    'Critical Hit!',
    'Choose critical type:',
    (tableName) => {
      crit(tableName)
    },
    CRIT_TYPES,
  )
}