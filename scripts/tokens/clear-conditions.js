/**
 Clear all conditions from tokens.
 */
export const clearAllConditions = async (tokens) => {
  const updates = []
  const promises = []
  for (const tok of tokens) {
    updates.push({ _id: tok.id, effects: [], overlayEffect: '' })
    // Status Icon Counters module:
    if (self.EffectCounter) promises.push(self.EffectCounter.clearEffects(tok.document))
    // Pathfinder 2e conditions:
    if (game.system.id === 'pf2e') {
      promises.push(game.pf2e.ConditionManager.deleteConditions(tok.actor.itemTypes.condition.map(c => c.id), tok.actor))
      // promises.push(await game.pf2e.effectTracker.removeExpired(tok.actor))
      promises.push(tok.actor.deleteEmbeddedDocuments('Item', tok.actor.itemTypes.effect.filter(e => e.system.tokenIcon.show).map(e => e.id)))
    }
  }
  await Promise.all(promises)
  return canvas.scene.updateEmbeddedDocuments('Token', updates)
}
