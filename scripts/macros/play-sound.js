/*
--- play-sound ---
Plays one of the sounds predefined in this macro.
Each possible soundType (e.g. "shield_bash", "punch") has a list of possible sounds to choose from, one of which will be picked.


args:
  0 - a string matching one of the sound types defined here, or "SOUND_CHECK"
  1 - true to play for all players in the game, false to play just for yourself.  leave blank for true.

source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/play-sound.js
suggested icon:
https://i.imgur.com/tPNQzq6.png
*/


const soundType = args[0]
const playForEveryone = args[1] !== "false" && args[1] !== false

/*
 each sound effect is defined as a list with two items:
 volume, URL.
 */
const SOUNDS = {
  "treasure": [
    [1, "https://freesound.org/data/previews/495/495005_6299573-lq.mp3"],
    [1, "https://freesound.org/data/previews/404/404359_7114905-lq.mp3"],
    [1, "https://freesound.org/data/previews/519/519630_2402876-lq.mp3"],
    [1, "https://freesound.org/data/previews/109/109662_945474-lq.mp3"],
  ],
  "monster-snarl": [
    [1, "https://freesound.org/data/previews/416/416044_1738686-lq.mp3"],
  ],
  "door-open": [
    [1, "https://freesound.org/data/previews/444/444160_9024515-lq.mp3"],
  ],
  "door-close": [
    [0.1, "https://freesound.org/data/previews/104/104525_1525198-lq.mp3"],
  ],
  "vanish": [
    [1, "https://freesound.org/data/previews/538/538013_3025423-lq.mp3"],
  ],
  "enlarge": [
    [1, "https://freesound.org/data/previews/523/523204_6142149-lq.mp3"],
  ],
  "future-beam": [
    [1, "https://freesound.org/data/previews/455/455207_6142149-lq.mp3"],
  ],
  "haste": [
    [1, "https://freesound.org/data/previews/219/219571_71257-lq.mp3"],
  ],
  "slow": [
    [1, "https://freesound.org/data/previews/219/219570_71257-lq.mp3"],
  ],
  "firebolt": [
    [1, "https://freesound.org/data/previews/249/249819_3756348-lq.mp3"],
  ],
  "shield_bash": [
    [0.7, "https://freesound.org/data/previews/319/319590_5436764-lq.mp3"]
  ],
  "punch": [
    [1, "https://www.myinstants.com/media/sounds/punch.mp3"],
    [1, "https://www.myinstants.com/media/sounds/punch-sound-effect.mp3"],
    [0.8, "https://www.myinstants.com/media/sounds/punch_vtoclN1.mp3"],
    [1, "https://freesound.org/data/previews/118/118513_2136023-lq.mp3"],
  ],
  "anime_super_punch": [
    [0.3, "https://www.myinstants.com/media/sounds/strongpunch.mp3"],
  ],
  "whoosh": [
    [0.8, "https://freesound.org/data/previews/60/60009_71257-lq.mp3"],
    [0.8, "https://freesound.org/data/previews/60/60013_71257-lq.mp3"],
    [1, "https://freesound.org/data/previews/19/19312_84709-lq.mp3"],
  ],
  "arrow": [
    [1, "https://freesound.org/data/previews/321/321552_5488813-lq.mp3"],
    [1, "https://freesound.org/data/previews/321/321129_3853968-lq.mp3"],
  ],
  "arrow_miss": [
    [5, "https://freesound.org/data/previews/406/406403_2825490-lq.mp3"],
  ],
  "three_shuriken": [
    [1, "https://freesound.org/data/previews/215/215012_1979597-lq.mp3"],
  ],
  "axe_throw": [
    [1, "https://freesound.org/data/previews/492/492224_6596968-lq.mp3"],
  ],
  "gust": [
    [1, "https://freesound.org/data/previews/377/377600_5828440-lq.mp3"],
  ],
  "stone_slide": [
    [1, "worlds/retrovirus/scenes/music/stone_slide.mp3"],
  ],
  "stab_flesh": [
    [1, "https://freesound.org/data/previews/179/179222_3337554-lq.mp3"],
    [1, "https://freesound.org/data/previews/435/435238_5523662-lq.mp3"],
  ],
  "gravitic_spiral": [
    [0.3, "https://freesound.org/data/previews/323/323504_5554674-lq.mp3"],
  ],
}

// used for checking that all sounds have a good volume
if (args[0] === 'SOUND_CHECK') {
  console.log(`SOUND CHECK`)
  for (const soundType of Object.keys(SOUNDS)) {
    for (const sound of SOUNDS[soundType]) {
      // play, print, and wait 2 seconds
      console.log(`playing from ${soundType}: ${sound[0]}, ${sound[1]}`)
      AudioHelper.play({src: sound[1], volume: sound[0], autoplay: true, loop: false}, false);
      await new Promise(resolve => setTimeout(resolve, 2 * 1000))
    }
  }
  return
}

const soundsArray = SOUNDS[soundType]
if (soundsArray === undefined || !soundsArray.length) return ui.notifications.error(`${soundType} (1st arg) is not listed in the SOUNDS array of play-sound as an array!`)
if (args[1] === undefined) return ui.notifications.error(`${args[1]} (2nd arg) should be true or false!`)

const sound = soundsArray[Math.floor(Math.random() * soundsArray.length)]
AudioHelper.play({src: sound[1], volume: sound[0], autoplay: true, loop: false}, playForEveryone);