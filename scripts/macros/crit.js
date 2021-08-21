/*
--- crit ---
Rolls a crit from one of the expanded critical tables (required as Rollable Tables with those names)

args:
  0 - one of the damage types, plus "Insanity", "Minor Injury", "Major Injury", "Critical Fumble"

depends on:
  critfail
  error
  make-table-result-bold

source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/crit.js
suggested icon:
https://i.imgur.com/iw4sH39.png
*/

const input0 = args[0] || 'undefined'
let input = input0.toLowerCase().trim()

const CRIT_TYPES = [
  'Bludgeoning',
  'Piercing',
  'Slashing',
  'Fire',
  'Acid',
  'Cold',
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
  'Critical Fumble',
  'Failure',
]

const getDependency = async (entityMap, packName, entityName) => {
  const existingEntity = entityMap.contents.find(t => t.name === entityName)
  if (existingEntity) return existingEntity
  const pack = game.packs.find(p => p.title.includes(packName))
  const index = await pack.getIndex()
  const inIndex = index.find(it => it.name === entityName)
  return inIndex ? pack.getDocument(inIndex._id) : null
}

const runMacro = async (macroName, ...args) => {
  const macro = (await getDependency(game.macros, 'itamacros', macroName))
  if (macro === null) return ui.notifications.error(`can't find macro: "${macroName}"`)
  return macro.renderContent(...args)
}

let critType = null
for (const crit of CRIT_TYPES) {
  if (crit.toLowerCase().includes(input)) {
    critType = crit
    break
  }
}

if (critType === null)
  return runMacro('error', `You should pick a crit type from: ${CRIT_TYPES.join(', ')}`)

if (critType === 'Failure' || critType === 'Critical Fumble')
  return runMacro('critfail')

const table = await getDependency(game.tables, 'Critical Hits', critType)
if (!table) {
  return runMacro('error', `Failed using ${input} crit - make sure you have the Critical Hits compendium`)
}

const roll = await table.roll()
const rollPart = roll.roll
const resultPart = roll.results[0].clone() // copy, otherwise we edit original table! :O
resultPart.data.text = await runMacro('make-table-result-bold', resultPart.data.text)

table.draw({roll: rollPart, results: [resultPart]})