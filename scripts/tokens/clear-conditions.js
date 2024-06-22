/**
 Clear all conditions from tokens.
 */
export const clearAllConditions = async (tokens) => {
  for (const tok of tokens) {
    if (!tok.actor) continue
    // Status Icon Counters module:
    if (self.EffectCounter) promises.push(self.EffectCounter.clearEffects(tok.document))
    // Pathfinder 2e conditions:  split into two, and also include automatic things we don't want to remove
    if (game.system.id === 'pf2e') {
      const ids = tok.actor.itemTypes.condition.map(x => x.id)
      ids.push(...tok.actor.itemTypes.effect.map(x => x.id))
      if (ids.length > 0)
        await tok.actor.deleteEmbeddedDocuments('Item', ids)
    } else {
      const ids = tok.actor.effects.filter(e => e.statuses?.size > 0).map(e => e.id)
      if (ids.length > 0)
        await tok.actor.deleteEmbeddedDocuments('ActiveEffect', ids)
    }
  }
}
