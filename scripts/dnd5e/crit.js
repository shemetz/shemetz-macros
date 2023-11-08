import { error } from '../utils/message-utils.js'
import { getDependency } from '../utils/data-utils.js'
import { showDialogWithOptions } from '../utils/dialog-utils.js'

const DAMAGE_TYPES = [
  // physicals
  'Bludgeoning Critical Hits',
  'Piercing Critical Hits', // +pierce
  'Slashing Critical Hits',
  // elements
  'Acid Critical Hits',
  'Cold Critical Hits', // +ice
  'Fire Critical Hits',
  'Force Critical Hits',
  'Lightning Critical Hits',
  'Necrotic Critical Hits',
  'Poison Critical Hits',
  'Psychic Critical Hits',
  'Radiant Critical Hits',
  'Thunder Critical Hits',
  // special
]
const ADDITIONAL_CRIT_TABLE_TYPES = [
  'Mental Afflictions',
  'Injuries',
  'Fail/Fumble',
]
const CRIT_TYPES = [...DAMAGE_TYPES, ...ADDITIONAL_CRIT_TABLE_TYPES]
// note that actual names for damage types will have a suffix, damageType + ' Critical Hits'

/**
 Rolls a crit from one of the expanded critical tables (required as Rollable Tables with those names)

 @param critTypeStr - one of the damage types, plus Insanity, Minor Injury, Major Injury, Fumble/Failure.  Can
 be lowercase and partial string, e.g. "inj" or "bludg".
 */
export const crit = async (critTypeStr) => {
  let cleanInput = critTypeStr.toLowerCase().trim()
  // some common alternatives:
  if (cleanInput.includes('ice'))
    cleanInput = 'cold'
  if (cleanInput.includes('pierce'))
    cleanInput = 'piercing'
  if (cleanInput.includes('injury'))
    cleanInput = 'injuries'
  const critTableName = CRIT_TYPES.find(it => it.toLowerCase().includes(cleanInput))
  if (critTableName === undefined)
    return error(`You should pick a crit type from: ${CRIT_TYPES.join(', ').replaceAll(' Critical Hits', '')} <br>(can be partial, e.g. 'bludg')`)
  const table = await getDependency(game.tables, 'critical-hits', critTableName)
  if (!table) {
    return error(`Failed using ${cleanInput} crit - make sure you have the critical-hits compendium`)
  }

  const roll = await table.roll()
  const rollPart = roll.roll
  const resultPart = roll.results[0].clone() // copy, otherwise we edit original table! :O
  // resultPart.data.text = makeTableResultBold(resultPart.data.text)  // no longer necessary

  table.draw({ roll: rollPart, results: [resultPart] })
}

export const critDialog = async () => {
  showDialogWithOptions(
    'Critical Hit!',
    'Choose critical type:',
    (tableName) => {
      if (tableName !== null) {
        crit(tableName)
      }
    },
    CRIT_TYPES.map(c => c.replace(' Critical Hits', ''))
  )
}

export const critRollInjury = async () => {
  crit('Injuries')
}

export const critRollMentalAffliction = async () => {
  crit('Mental Afflictions')
}

const MAX_LIMITED_INJURY_ROLL = 12

export const critRollLimitedInjury = async () => {
  const table = await getDependency(game.tables, 'critical-hits', 'Injuries')
  let roll = await table.roll({ roll: Roll.create('1d12') })
  // TODO - update for v12
  ui.notifications.error(`TODO - shem, you should probably update this code to use roll.rolls[0] rather than roll.roll!`)
  while (roll.roll.total > MAX_LIMITED_INJURY_ROLL) {roll = await table.roll()}
  const rollPart = roll.roll
  const resultPart = roll.results[0]
  table.draw({ roll: rollPart, results: [resultPart] })
}
