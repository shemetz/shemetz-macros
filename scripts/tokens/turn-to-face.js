/*

source:
https://github.com/shemetz/shemetz-macros/blob/master/scripts/macros/turn-to-face.js
suggested icon:
https://i.imgur.com/HWWHd2W.png
*/

const circle = 2 * Math.PI
const halfCircle = Math.PI
const toDegrees = 360 / circle
const hook_data_key = 'hook_id_for_turn_to_face'

/**
 * Select one or more tokens to be the turners. Target one token to be the target.
 * Whenever the turner or the target move, the turner will rotate to face the target.
 * Remove facing from tokens by activating the macro again with them (will return early if so).
 *
 * Does not persist if you reload.
 */
export const turnTokensToFaceTarget = (turners, target) => {
  if (turners.length === 0) {
    return ui.notifications.error('You need to select at least one token to be the turner.')
  }
  // remove existing facing from tokens
  const detachedTokenNames = []
  for (const turner of turners) {
    const existing_hook = turner[hook_data_key]
    if (existing_hook !== undefined && existing_hook !== null) {
      detachedTokenNames.push(turner.name)
      Hooks.off('updateToken', existing_hook)
      turner[hook_data_key] = null
    }
  }
  if (detachedTokenNames.length > 0)
    return ui.notifications.info(`Detached facing for: ${detachedTokenNames.join(', ')}`)

  if (target === undefined) {
    return ui.notifications.error('You need to target one token.')
  }
  if (game.user.targets.size > 1) {
    return ui.notifications.error('You cannot target more than one token.')
  }

  /**
   * This function will make 'turner' turn towards 'target' once
   */
  const turn = (turner, target, duration) => {
    // angle is calculated between centers of tokens, using math
    let rotationTowards = Math.atan2(target.center.y - turner.center.y, target.center.x - turner.center.x)
    // adding 90° because JS and Foundry use different axes
    rotationTowards += circle / 4
    // adding 180° to make turner look towards the target instead of away
    rotationTowards += halfCircle
    // increasing/decreasing by 360° to make sure it's the closest rotation to the current one
    const currentRotation = turner.mesh.rotation
    while (rotationTowards > currentRotation + halfCircle) rotationTowards -= circle
    while (rotationTowards < currentRotation - halfCircle) rotationTowards += circle
    // animation!
    // (locking to prevent refresh on hover)
    turner.document.locked = true
    CanvasAnimation.animate(
      [{ parent: turner.mesh, attribute: 'rotation', to: rotationTowards }],
      {
        context: turner,
        name: `Token.${turner.id}.turnToFace`,
        duration: duration,
        // easing: CanvasAnimation.futureLinearEasing,
      })
      .then(() => {
        // when animation is done we'll update the data
        return turner.document.update({ 'rotation': rotationTowards * toDegrees })
      })
      .then(() => {
        // (unlocking))
        turner.document.locked = false
      })
  }

  // setting up hooks for all turners, and also making them immediately turn to their target
  for (const turner of turners) {
    if (target.id === turner.id) {
      ui.notifications.error('A token cannot face itself!')
      continue
    }
    turner[hook_data_key] = Hooks.on('updateToken', async (tok, updateData) => {
      // hook should call turn() when the target or the turner move (change their X or Y)
      if (!(
        !!target.transform && !!turner.transform
        && (tok.id === target.id || tok.id === turner.id)
        && (updateData.x || updateData.y)
      )) return
      const duration = CanvasAnimation.animations[`Token.${tok.id}.animateMovement`]?.duration ?? 300
      turn(turner, target, duration)
    })

    turn(turner, target, 200)
  }
}
