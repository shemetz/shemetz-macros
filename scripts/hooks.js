import { hookShemetzMacros } from './shemetz-macros.js'
import { hookCloseWallGaps } from './walls/close-wall-gaps.js'
import { hookEyedropperColorPicker } from './drawing/eyedropper-color-pick.js'
import { hookBlockPushing } from './custom-stuff/block-pushing.js'
import { hookControlTokenTeleportation } from './tokens/control-token-teleportation.js'
import { hookHiddenHotkey } from './placeables/toggle-hide.js'
import { hookImageShiftHotkey } from './placeables/image-shift.js'
import { hookLayerSwitchHotkey } from './custom-stuff/layer-switch-hotkey.js'
import { hookRepeatLatestOperation, hookRepeatLatestOperationHotkey } from './placeables/repeat-last-action.js'
import { hookEndTurnButtonInChatBar } from './gui/end-turn-button-in-chat-bar.js'

Hooks.on('init', () => {
  hookShemetzMacros()
  hookCloseWallGaps()
  hookEyedropperColorPicker()
  hookBlockPushing()
  hookControlTokenTeleportation()
  hookHiddenHotkey()
  hookImageShiftHotkey()
  hookLayerSwitchHotkey()
  hookRepeatLatestOperation()
  hookRepeatLatestOperationHotkey()
  hookEndTurnButtonInChatBar()
})
