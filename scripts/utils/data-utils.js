/**
 * Gets an entity, e.g. a roll table, from a pack or from the general Foundry entity map.
 *
 * Returns null if it doesn't exist.
 */
export const getDependency = async (entityMap, packName, entityName) => {
  const existingEntity = entityMap.contents.find(t => t.name === entityName)
  if (existingEntity) return existingEntity
  const pack = game.packs.find(p => p.title.includes(packName))
  if (pack) {
    const index = await pack.getIndex()
    const inIndex = index.find(it => it.name === entityName)
    if (inIndex) return pack.getDocument(inIndex._id)
    console.error(`Failed to find dependency ${entityName} in ${packName}`)
    return null
  }
  console.error(`Failed to find dependency pack: ${packName}`)
  return null
}
