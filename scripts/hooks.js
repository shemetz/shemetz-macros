import { hookShemetzMacros } from './shemetz-macros.js'
import { hookCloseWallGaps } from './walls/close-wall-gaps.js'
import { hookEyedropperColorPicker } from './drawing/eyedropper-color-pick.js'
import { hookBlockPushing } from './custom-stuff/block-pushing.js'
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
  hookHiddenHotkey()
  hookImageShiftHotkey()
  hookLayerSwitchHotkey()
  hookRepeatLatestOperation()
  hookRepeatLatestOperationHotkey()
  hookEndTurnButtonInChatBar()
})

// temporary - while developing for v10:
Hooks.on('init', () => {
  CONFIG.compatibility.excludePatterns.push(
    // new RegExp('/systems/dnd5e/'),
    // new RegExp('at Token5e.get'),
    // new RegExp('Messages.sayBubble'),
    // new RegExp('The content option for the editor handlebars helper has been deprecated'),
    // new RegExp('libWrapper-package_info'),
    // new RegExp('Scene._logDataFieldMigration'),
    // new RegExp('_onMouseDraw'),

    // // pf2e system, 3.13.5
    // new RegExp('foundry.utils.isObjectEmpty is deprecated in favor'),
    new RegExp('You are accessing BasePackage#data which is now deprecated in favor'),
    // new RegExp('Canvas#activateLayer is deprecated in favor of CanvasLayer#activate'),
    // new RegExp('at get isRerollable \\[as isRerollable] \\(main.bundle.js:1'),

    // pf2e system, 4.0.0-alpha
    new RegExp('Refused to apply style'),
  )
})
