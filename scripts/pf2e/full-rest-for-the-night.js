export const hookFullRestForTheNight = () => {
  if (game.system.id !== 'pf2e') return
  game.settings.register('shemetz-macros', 'pf2e-full-rest-for-the-night', {
    name: `PF2E - Fully recover HP when resting for the night`,
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  })
  Hooks.on('pf2e.restForTheNight', async (actor) => {
    if (!game.settings.get('shemetz-macros', 'pf2e-full-rest-for-the-night')) return
    // fully heal, instead of only healing about half of the max hp (long rest rules in pf2e are weird in this way)
    const damageResult = actor.calculateHealthDelta({hp: actor.hitPoints, delta: -999})
    await actor.update(damageResult.updates, { damageTaken: -999 })
  })
}