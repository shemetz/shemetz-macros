import { hookShemetzMacros } from './shemetz-macros.js'
import { hookCloseWallGaps } from './walls/close-wall-gaps.js'
import { hookEyedropperColorPicker } from './drawing/eyedropper-color-pick.js'
import { hookBlockPushing } from './custom-stuff/block-pushing.js'
import { hookAutomaticWoundEffects, registerAutomaticWoundEffects } from './tokens/automatic-wound-effects.js'
import { hookControlTokenTeleportation } from './tokens/control-token-teleportation.js'

Hooks.on('init', () => {
  hookShemetzMacros()
  hookCloseWallGaps()
  hookEyedropperColorPicker()
  hookBlockPushing()
  registerAutomaticWoundEffects()
  hookControlTokenTeleportation()
})
Hooks.on('ready', () => {
  hookAutomaticWoundEffects()
})
