import { SOUND_COLLECTION } from './sound-collection.js'
import { error } from '../utils/message-utils.js'
import { showDialogWithOptions } from '../utils/dialog-utils.js'

const extraSoundsMacroName = 'EXTRA_SOUND_COLLECTION'
/*
that file should look like this for example:

{
  'sciFiSound': [
    [1, 'https://freesound.org/data/previews/323/323504_5554674-lq.mp3'],
  ],
}

 */

const getSoundCollection = () => {
  const soundCollection = {}
  Object.assign(soundCollection, SOUND_COLLECTION)
  const macro = game.macros.getName(extraSoundsMacroName)
  if (macro) {
    // evaluating the code of the macro, turning it into an object
    const soundsInMacro = (new Function(`"use strict"; return ${macro.command}`)).call(this)
    Object.assign(soundCollection, soundsInMacro)
  }
  return soundCollection
}

/**
 * used for checking that all sounds have a good volume
 */
export const soundCheck = async () => {
  console.log(`SOUND CHECK`)
  for (const soundType of Object.keys(getSoundCollection())) {
    for (const sound of getSoundCollection()[soundType]) {
      const [volume, src] = sound
      // play, print, and wait 2 seconds
      console.log(`playing from ${soundType}: ${volume}, ${src}`)
      AudioHelper.play({ src: src, volume: volume, autoplay: true, loop: false }, false)
      // TODO - instead of 2 second timeout, try relying on AudioContainer.prototype._unloadMediaNode
      await new Promise(resolve => setTimeout(resolve, 2 * 1000))
    }
  }
}

/**
 * Plays one of the sounds predefined in sound-collection.js.
 * Each possible soundType (e.g. "shield_bash", "punch") has a list of possible sounds to choose from, one of which will be picked.
 */
export const playSound = (soundType, playForEveryone) => {
  console.log(`Playing ${soundType} ${playForEveryone ? 'globally' : 'locally'}`)
  const soundsArray = getSoundCollection()[soundType]
  if (soundsArray === undefined || !soundsArray.length) return error(
    `${soundType} is not listed in the sound collections as an array!
    Consider adding it to the macro '${extraSoundsMacroName}'`)

  const sound = soundsArray[Math.floor(Math.random() * soundsArray.length)]
  const [volume, src] = sound
  AudioHelper.play({ src: src, volume: volume, autoplay: true, loop: false }, playForEveryone)
}

export const playSoundFromDialog = () => {
  const soundTypes = ['SOUND CHECK', ...Object.keys(getSoundCollection())]
  showDialogWithOptions(
    'Play Sound',
    'Choose sound type (will be played for everyone)',
    (soundType) => {
      if (soundType === 'SOUND CHECK')
        return soundCheck()
      else if (!!soundType)
        return playSound(soundType, true)
    },
    soundTypes,
  )
}
