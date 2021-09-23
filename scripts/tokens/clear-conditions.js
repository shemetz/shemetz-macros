/**
 Clear all conditions from tokens.
 */
export const clearAllConditions = async (tokens) => {
  const updates = []
  for (const tok of tokens) {
    updates.push({ _id: tok.id, effects: [], overlayEffect: '' })
    // Status Icon Counters:
    // sadly updates in the Status Icon Counters module can't be stacked, not even within one token
    // TODO - check up on https://gitlab.com/woodentavern/status-icon-counters/-/issues/27
    if (self.EffectCounter) self.EffectCounter.getAllCounters(tok).forEach(c => c.remove())
    // Pathfinder 2e conditions:
    if (game.system.id === 'pf2e') await game.pf2e.ConditionManager.deleteConditions(
      tok.actor.itemTypes.condition.map(c => c.id), tok.actor
    )
  }
  return canvas.scene.updateEmbeddedDocuments('Token', updates)
}