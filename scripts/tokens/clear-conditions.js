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
      promises.push(pf2eDeleteConditions(tok.actor.itemTypes.condition.map(c => c.id), tok.actor))
      // promises.push(await game.pf2e.effectTracker.removeExpired(tok.actor))
      promises.push(tok.actor.deleteEmbeddedDocuments('Item',
        tok.actor.itemTypes.effect.filter(e => e.system.tokenIcon.show).map(e => e.id)))
    }
  }
  await Promise.all(promises)
  return canvas.scene.updateEmbeddedDocuments('Token', updates)
}

const pf2eDeleteConditions = async (itemIds, actor) => {
  const ConditionPF2e = CONFIG.PF2E.Item.documentClasses.condition

  const list = []
  const stack = [...itemIds]
  while (stack.length) {
    const id = stack.pop() ?? ''
    const condition = actor.items.get(id)

    if (condition instanceof ConditionPF2e) {
      list.push(id)
      condition.data.data.references.children.forEach((child) => stack.push(child.id))
    }
  }

  return ConditionPF2e.deleteDocuments(list, { parent: actor })
}