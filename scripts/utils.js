

export const getDependency = async (entityMap, packName, entityName) => {
  const existingEntity = entityMap.contents.find(t => t.name === entityName)
  if (existingEntity) return existingEntity
  const pack = game.packs.find(p => p.title.includes(packName))
  const index = await pack.getIndex()
  const inIndex = index.find(it => it.name === entityName)
  return inIndex ? pack.getDocument(inIndex._id) : null
}

export const runMacro = async (macroName, ...args) => {
  const macro = (await getDependency(game.macros, 'shemetz-macros', macroName))
  if (macro === null) return ui.notifications.error(`can't find macro: "${macroName}"`)
  return macro.renderContent(...args)
}