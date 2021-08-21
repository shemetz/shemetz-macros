/*
--- Turn to Face ---
Select one or more tokens to be the turners. Target one token to be the target.
Whenever the turner or the target move, the turner will rotate to face the target.
(does not persist if you reload)

source:
https://github.com/itamarcu/foundry-macros/blob/master/turn-to-face.js
suggested icon:
https://i.imgur.com/HWWHd2W.png
*/

const circle = 2 * Math.PI
const halfCircle = Math.PI
const toDegrees = 360 / circle
const hook_data_key = 'hook_id_for_turn_to_face'

main()

function main() {
  if (canvas.tokens.controlled.length === 0) {
    return ui.notifications.error('You need to select at least one token to be the turner.')
  }
  // remove existing facing from
  const detachedTokenNames = []
  for (const turner of canvas.tokens.controlled) {
    const existing_hook = turner.data[hook_data_key]
    if (existing_hook !== undefined && existing_hook !== null) {
      detachedTokenNames.push(turner.name)
      Hooks.off('updateToken', existing_hook)
      turner.document.update({[hook_data_key]: null})
    }
  }
  if (detachedTokenNames.length > 0)
    return ui.notifications.info(`Detached facing for: ${detachedTokenNames.join(', ')}`)

  const target = Array.from(game.user.targets)[0]
  if (target === undefined) {
    return ui.notifications.error('You need to target one token.')
  }
  if (game.user.targets.size > 1) {
    return ui.notifications.error('You cannot target more than one token.')
  }

  /**
   * This function will make 'turner' turn towards 'target' once
   */
  const turn = (turner, target) => {
    // angle is calculated between centers of tokens, using math
    let rotationTowards = Math.atan2(target.center.y - turner.center.y, target.center.x - turner.center.x)
    // adding 90° because JS and Foundry use different axes
    rotationTowards += circle / 4
    // adding 180° to make turner look towards the target instead of away
    rotationTowards += halfCircle
    // increasing/decreasing by 360° to make sure it's the closest rotation to the current one
    const currentRotation = turner.icon.rotation
    while (rotationTowards > currentRotation + halfCircle) rotationTowards -= circle
    while (rotationTowards < currentRotation - halfCircle) rotationTowards += circle
    // animation!
    const maxDuration = 500
    const duration = maxDuration * Math.abs(rotationTowards - currentRotation) / circle
    // (locking to prevent refresh on hover)
    turner.data.locked = true
    CanvasAnimation.animateLinear(
      [{parent: turner.icon, attribute: 'rotation', to: rotationTowards},],
      {name: `Token.${turner.id}.turnToFace`, context: turner, duration: duration})
      .then(() => {
        // when animation is done we'll update the data
        return turner.document.update({'rotation': rotationTowards * toDegrees})
      })
      .then(() => {
        // (unlocking))
        turner.data.locked = false
      })
  }

  // setting up hooks for all turners, and also making them immediately turn to their target
  for (const turner of canvas.tokens.controlled) {
    if (target.id === turner.id) {
      ui.notifications.error('A token cannot face itself!')
      continue
    }
    const hook_id = Hooks.on('updateToken', async (scene, tok, updateData) => {
      // hook should call turn() when the target or the turner move (change their X or Y)
      if (!(
        !!target.transform && !!turner.transform
        && (tok._id === target.id || tok._id === turner.id)
        && (updateData.x || updateData.y)
      )) return
      turn(turner, target)
    })

    turner.document.update({[hook_data_key]: hook_id})
    turn(turner, target)
  }
}