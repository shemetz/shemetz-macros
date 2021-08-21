/*
--- critfail ---
Rolls and shows a result from the Critical Fail table (required as a rollable table)

depends on:
  make-table-result-bold

source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/critfail.js
suggested icon:
https://i.imgur.com/huPpJQf.png
*/

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

const table = await getDependency(game.tables, 'Critical Hits', 'Critical Fail')
const roll = await table.roll()
const rollPart = roll.roll
const resultPart = roll.results[0].clone() // copy, otherwise we edit original table! :O
resultPart.data.text = await runMacro('make-table-result-bold', resultPart.data.text)

table.draw({ roll: rollPart, results: [resultPart] })