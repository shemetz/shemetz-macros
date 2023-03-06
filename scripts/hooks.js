import { hookShemetzMacros } from './shemetz-macros.js'
import { hookCloseWallGaps } from './walls/close-wall-gaps.js'
import { hookEyedropperColorPicker } from './drawing/eyedropper-color-pick.js'
import { hookBlockPushing } from './custom-stuff/block-pushing.js'
import { hookHiddenHotkey } from './placeables/toggle-hide.js'
import { hookImageShiftHotkey } from './placeables/image-shift.js'
import { hookLayerSwitchHotkey } from './custom-stuff/layer-switch-hotkey.js'
import { hookFlipHotkey } from './tokens/flip.js'
import { hookRepeatLatestOperation, hookRepeatLatestOperationHotkey } from './placeables/repeat-last-action.js'
import { hookReduceTokenAnimations } from './tokens/reduce-animations.js'
import { hookStartupMacro } from './macros/startup-macro.js'
import { hookEndTurnButtonInChatBar } from './gui/end-turn-button-in-chat-bar.js'

Hooks.on('init', () => {
  hookShemetzMacros()
  hookCloseWallGaps()
  hookEyedropperColorPicker()
  hookBlockPushing()
  hookHiddenHotkey()
  hookImageShiftHotkey()
  hookLayerSwitchHotkey()
  hookFlipHotkey()
  hookRepeatLatestOperation()
  hookRepeatLatestOperationHotkey()
  hookEndTurnButtonInChatBar()
  hookReduceTokenAnimations()
  hookStartupMacro()
})

// temporary - while developing for v10:
Hooks.on('init', () => {
  CONFIG.compatibility.excludePatterns.push(
    // pf2e system, 4.x
    new RegExp('Refused to apply style'),
    new RegExp('You are accessing BasePackage#data which is now deprecated in favor'),
    new RegExp('StatisticModifier#name has been split'),
  )
})
