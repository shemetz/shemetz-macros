/**
 Clear all conditions from tokens.
 */
export const clearAllConditions = async (tokens) => {
  const updates = []
  for (const tok of tokens) {
    // Status Icon Counters module:
    if (self.EffectCounter) promises.push(self.EffectCounter.clearEffects(tok.document))
    // Pathfinder 2e conditions:
    if (game.system.id === 'pf2e' && !!tok.actor) {
      const ids = tok.actor.itemTypes.condition.map(x => x.id)
      ids.push(...tok.actor.itemTypes.effect.map(x => x.id))
      await tok.actor.deleteEmbeddedDocuments('Item', ids)
    }
    const activeEffectIds = tok.actor?.itemTypes.effect.map(x => x.id)
    await tok.actor?.deleteEmbeddedDocuments('Item', activeEffectIds)
  }
  return canvas.scene.updateEmbeddedDocuments('Token', updates)
}
