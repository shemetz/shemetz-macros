import { SOUND_COLLECTION } from './sound-collection.js'
import { error } from '../utils/message-utils.js'
import { showDialogWithOptions } from '../utils/dialog-utils.js'

/**
 * used for checking that all sounds have a good volume
 */
export const soundCheck = async () => {
  console.log(`SOUND CHECK`)
  for (const soundType of Object.keys(SOUND_COLLECTION)) {
    for (const sound of SOUND_COLLECTION[soundType]) {
      const [volume, src] = sound
      // play, print, and wait 2 seconds
      console.log(`playing from ${soundType}: ${volume}, ${src}`)
      AudioHelper.play({ src: src, volume: volume, autoplay: true, loop: false }, false)
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
  const soundsArray = SOUND_COLLECTION[soundType]
  if (soundsArray === undefined || !soundsArray.length) return error(
    `${soundType} (1st arg) is not listed in the SOUND_COLLECTION array of play-sound as an array!`)

  const sound = soundsArray[Math.floor(Math.random() * soundsArray.length)]
  const [volume, src] = sound
  AudioHelper.play({ src: src, volume: volume, autoplay: true, loop: false }, playForEveryone)
}

export const playSoundFromDialog = () => {
  const soundTypes = ['SOUND CHECK', ...Object.keys(SOUND_COLLECTION)]
  showDialogWithOptions(
    'Play Sound',
    'Choose sound type (will be played for everyone)',
    (soundType) => {
      if (soundType === 'SOUND CHECK')
        return soundCheck()
      else
        return playSound(soundType, true)
    },
    soundTypes,
  )
}