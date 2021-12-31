export const registerAutomaticWoundEffects = () => {
  game.settings.register('shemetz-macros', 'enable-automatic-wounds', {
    name: `Enable automatic wound effects (requires Token Magic FX)`,
    hint: `Whenever creatures take damage, a random wound effect will appear on their token.`,
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
    onChange: registerOrUnregisterHooks
  })
}

let didRegister = false
const registerOrUnregisterHooks = () => {
  if (game.settings.get('shemetz-macros', 'enable-automatic-wounds')) {
    didRegister = true
    Hooks.on('updateActor', onUpdateActor)
  } else if (didRegister) {
    didRegister = false
    Hooks.off('updateActor', onUpdateActor)
  }
}

export const hookAutomaticWoundEffects = () => {
  if (game.user.isGM) {
    registerOrUnregisterHooks()
  }
}

const onUpdateActor = (actor, data, options) => {
  const damageTaken = options.damageTaken
  if (!damageTaken) return
  let maxHp
  if (game.system.id === 'pf2e') {
    maxHp = actor.data.data.attributes.hp.max
  } else maxHp = Math.abs(damageTaken) * 2
  for (const token of actor.getActiveTokens()) {
    if (damageTaken < 0) createWoundOnToken(token, -damageTaken / maxHp)
    else healWoundsOnToken(token, damageTaken / maxHp)
  }
}

const DAMAGE_SCALE_MULTIPLIER = 1.5
const AUTOMATIC_FILTER_ID = 'automaticWoundEffect'

const createWoundOnToken = (token, damageFraction) => {
  const woundScale = Math.max(0.05, damageFraction) * DAMAGE_SCALE_MULTIPLIER

  let params =
    [{
      filterType: 'splash',
      filterId: AUTOMATIC_FILTER_ID,
      rank: 5,
      color: 0x990505,
      padding: 80,
      time: 1,
      seed: Math.random(),
      splashFactor: 1,
      spread: woundScale,
      blend: 1,
      dimX: 1,
      dimY: 1,
      cut: false,
      textureAlphaBlend: true,
      anchorX: 0.32 + (Math.random() * 0.36),
      anchorY: 0.32 + (Math.random() * 0.36)
    }]

  TokenMagic.addFilters(token, params)
}

const healWoundsOnToken = (token, healingFraction) => {
  const existingFlags = token.document.getFlag('tokenmagic', 'filters')
  const numOfWounds = existingFlags?.filter(f => f.tmFilters.tmFilterId === AUTOMATIC_FILTER_ID)?.length
  if (numOfWounds === 0) {
    return
  }
  // healing is "stronger" than wounds when there's 3+ wounds, but also tiny wounds are bigger so it kinda evens out
  const reducedWoundSpreadPerWound = healingFraction / Math.max(1 / 2 + numOfWounds / 2, 1) * DAMAGE_SCALE_MULTIPLIER

  const workingFlags = []
  existingFlags.forEach(originalFlag => {
    const flag = duplicate(originalFlag)
    if (flag.tmFilters && flag.tmFilters.tmFilterId === AUTOMATIC_FILTER_ID) {
      // shrink visible wounds
      const oldSpread = flag.tmFilters.tmParams.spread
      // healing is multiplied by 80% to leave lingering blood more often
      const newSpread = oldSpread - reducedWoundSpreadPerWound
      if (newSpread < 0) {
        // just remove the flag by not keeping it
        return
      }
      flag.tmFilters.tmParams.spread = newSpread
      flag.tmFilters.tmParams.updateId = randomID()
    }
    workingFlags.push(flag)
  })
  token._TMFXsetFlag(workingFlags)
}