import { hookShemetzMacros } from './shemetz-macros.js'
import { hookCloseWallGaps } from './walls/close-wall-gaps.js'
import { hookHiddenHotkey } from './placeables/toggle-hide.js'
import { hookImageShiftHotkey } from './placeables/image-shift.js'
import { hookLayerSwitchHotkey } from './custom-stuff/layer-switch-hotkey.js'
import { hookFlipHotkey } from './tokens/flip.js'
import { hookRepeatLatestOperation, hookRepeatLatestOperationHotkey } from './placeables/repeat-last-action.js'
import { hookReduceTokenAnimations } from './tokens/reduce-animations.js'
import { hookStartupMacro } from './macros/startup-macro.js'
import { hookConsoleExtras } from './console/console-extras.js'
import { hookEndTurnButtonInChatBar } from './gui/end-turn-button-in-chat-bar.js'
import { hookFullRestForTheNight } from './pf2e/full-rest-for-the-night.js'

Hooks.on('init', () => {
  hookShemetzMacros()
  hookCloseWallGaps()
  hookHiddenHotkey()
  hookImageShiftHotkey()
  hookLayerSwitchHotkey()
  hookFlipHotkey()
  hookRepeatLatestOperation()
  hookRepeatLatestOperationHotkey()
  hookEndTurnButtonInChatBar()
  hookReduceTokenAnimations()
  hookStartupMacro()
  hookConsoleExtras()
  hookFullRestForTheNight()
})

Hooks.on('init', () => {
  // locally exclude some patterns of errors/warnings given to other rude module developers who aren't perfect
  CONFIG.compatibility.excludePatterns.push(
    //// tokenmagic 0.6.8
    //new RegExp('Error: You are accessing globalThis.mergeObject[\\s\\S]*at get defaultOptions', 'm'),
    //new RegExp('Error: You are accessing globalThis.mergeObject[\\s\\S]*at eU\.init', 'm'),
    //new RegExp('Error: You are accessing globalThis.isNewerVersion[\\s\\S]*at Object.renderSidebarTab \[as fn]', 'm'),
    //new RegExp('Error: You are accessing globalThis.duplicate[\\s\\S]*at h', 'm'),
    //new RegExp('Error: You are accessing globalThis.randomID[\\s\\S]*at new e', 'm'),
    //// Module Management+ 2.2.3
    //new RegExp('Error: You are accessing globalThis.isNewerVersion[\\s\\S]*at g.getChangelogs', 'm'),
    //new RegExp('Error: You are accessing globalThis.isNewerVersion[\\s\\S]*at Object.renderSidebarTab', 'm'),
  )
})
