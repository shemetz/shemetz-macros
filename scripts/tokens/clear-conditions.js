/**
Clear all conditions from tokens.
*/
export const clearAllConditions = (tokens) => {
  const updates = []
  for (const tok of tokens) {
    updates.push({ _id: tok.id, effects: [], overlayEffect: '' })
    // sadly updates in the Status Icon Counters module can't be stacked, not even within one token
    // TODO - check up on https://gitlab.com/woodentavern/status-icon-counters/-/issues/27
    if (EffectCounter) EffectCounter.getAllCounters(tok).forEach(c => c.remove())
  }
  canvas.scene.updateEmbeddedDocuments('Token', updates)
}