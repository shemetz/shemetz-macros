/*
--- Crit Table ---
Rolls a crit from one of the expanded critical tables (required as Rollable Tables with those names)

depends on:
  query-from-list
  make-table-result-bold

source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/crit-dialog.js
suggested icon:
https://i.imgur.com/Pr6tXUH.png
*/

const CRIT_TYPES = ['Bludgeoning', 'Piercing', 'Slashing', 'Fire', 'Acid', 'Cold', 'Force', 'Poison', 'Lightning', 'Necrotic', 'Psychic', 'Thunder', 'Radiant', 'Insanity', 'Minor Injury', 'Major Injury']

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

const callback = (tableName) => {
  console.log('selected crit type', tableName)
  runMacro('crit', tableName)
}

runMacro('query-from-list',
  'Critical Hit',
  'Choose critical type:',
  callback,
  ...CRIT_TYPES
)