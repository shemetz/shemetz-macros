// taken from foundry code default for the token animate function
const DEFAULT_MOVEMENT_SPEED = 6

const Token_animate_Wrapper = async (wrappedFunction, updateData, options = {}, ...moreArgs) => {
  // const { name, duration, easing, movementSpeed } = options
  if (!options.movementSpeed) {
    const moveSpeedMultiplier = game.settings.get('shemetz-macros', 'faster-token-movement')
    if (moveSpeedMultiplier !== 1) {
      for (const k of ['x', 'y']) {
        if (typeof updateData[k] !== 'undefined') {
          options.movementSpeed = DEFAULT_MOVEMENT_SPEED * moveSpeedMultiplier
        }
      }
    }
    const rotationSpeedMultiplier = game.settings.get('shemetz-macros', 'faster-token-rotation')
    if (rotationSpeedMultiplier !== 1) {
      if (typeof updateData['rotation'] !== 'undefined') {
        // default duration is 1000 ms * angle (/360)
        options.movementSpeed = DEFAULT_MOVEMENT_SPEED * rotationSpeedMultiplier
      }
    }
  }
  return wrappedFunction(updateData, options, ...moreArgs)
}

export const hookReduceTokenAnimations = () => {
  libWrapper.register('shemetz-macros', 'foundry.canvas.placeables.Token.prototype.animate', Token_animate_Wrapper, 'WRAPPER')

  game.settings.register('shemetz-macros', 'faster-token-movement', {
    name: `Faster token movement`,
    hint: `Speed multiplier for token movement.  Default is 1.`,
    scope: 'client',
    config: true,
    type: Number,
    default: 1,
  })

  game.settings.register('shemetz-macros', 'faster-token-rotation', {
    name: `Faster token rotation`,
    hint: `Speed multiplier for token rotation.  Default is 1.`,
    scope: 'client',
    config: true,
    type: Number,
    default: 1,
  })
}

