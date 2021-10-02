import { hookShemetzMacros } from './shemetz-macros.js'
import { hookCloneWallGaps } from './walls/close-wall-gaps.js'
import { hookEyedropperColorPicker } from './drawing/eyedropper-color-pick.js'
import { hookPf2eFlatfootedShortcut } from './pf2e/hook-pf2e-flatfooted-shortcut.js'

Hooks.on('init', () => {
  hookShemetzMacros()
  hookCloneWallGaps()
  hookEyedropperColorPicker()

  if (game.system.id === 'pf2e') {
    hookPf2eFlatfootedShortcut()
  }
})

// TODO create big file for key shortcuts, based on:
// https://github.com/Drental/foundryvtt-pf2e-f-is-for-flatfooted/blob/master/scripts/index.js
// e.g. "T for Targeting", "E for Eyedropper", "F for Flip"
// avoid: WASD, C