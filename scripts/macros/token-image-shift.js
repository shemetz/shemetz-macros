/*
--- token-image-shift ---
(similar to token-image-swap but useful for TriggerHappy automation)

first argument is token name, second argument is kind of change (number or + or -)
if 2nd argument is a number (e.g. '8') we'll set that image
if arg is '+' we'll go forward without looping
if arg is '-' we'll go backwards without looping
if arg is 'c'/'cycle' we'll go forward and loop
if arg is 'uc'/'uncycle' we'll go backwards and loop

source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/token-image-shift.js
suggested icon:
https://i.imgur.com/iw4sH39.png
*/

const SCOPE = 'world'
const KEY_OPTIONS = 'token-image-swap'
const KEY_CURRENT_INDEX = 'token-image-swap_index'

const argName = args[0], argChange = args[1]
const argNum = parseInt(argChange)
const argPlus = argChange === '+' || argChange === 'next' || argChange === 'cycle' || argChange === 'c'
const argMinus = argChange === '-' || argChange === 'prev' || argChange === 'uncycle' || argChange === 'uc'
const cycle = argChange === 'c' || argChange === 'cycle' || argChange === 'uc' || argChange === 'uncycle'

main()

function main() {
  const tok = canvas.tokens.placeables.find(t=>t.name.toLowerCase().includes(argName.toLowerCase()))
  if (tok === undefined)
    return ui.notifications.error(`did not find token with name: ${argName}`)
  const actor = tok.actor
  if (!actor)
    return ui.notifications.error('Cannot apply macro to tokens without an actor.')
  if (
    actor.getFlag(SCOPE, KEY_OPTIONS) === undefined ||
    actor.getFlag(SCOPE, KEY_OPTIONS).length === 0
  )
    return ui.notifications.error(
      'Please hold the Ctrl key while activating the Token Image Swap macro, to set up images.')
  const imagesText = actor.data.flags[SCOPE][KEY_OPTIONS]
  const options = imagesText.split('\n')
    .map(it => it.split('#')[0].trim())  // remove comments
    .filter(it => it)  // remove empty lines
  const optionImgs = options.map(it => it.split(' ')[0])
  const optionScales = options
    .map(it => it.split(' ')[1] || '1.0')
    .map(it => parseFloat(it))
  let imgIndex = actor.getFlag(SCOPE, KEY_CURRENT_INDEX) || 0  // || 0 is for backwards compatibility
  if (!(0 <= imgIndex && imgIndex < options.length)) imgIndex = 0
  const delta = argMinus ? -1 : argPlus ? +1 : 0

  const nextIndex = delta !== 0 ?
     cycle ?
        (imgIndex + options.length + delta) % options.length
        : Math.min(Math.max(imgIndex + delta, 0), options.length - 1)
     : argNum

  if (isNaN(nextIndex) || nextIndex < 0 || nextIndex >= options.length) return ui.notifications.error(`bad token-image-shift input! ${argChange}`)
  const nextImg = optionImgs[nextIndex]
  const nextScale = optionScales[nextIndex]
  tok.document.update({'img': nextImg, 'scale': nextScale})
  tok.actor.setFlag(SCOPE, KEY_CURRENT_INDEX, nextIndex)
}