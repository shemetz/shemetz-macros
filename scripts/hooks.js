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

// locally exclude some patterns of errors/warnings given to other rude module developers who aren't perfect
CONFIG.compatibility.excludePatterns.push(
  // tokenmagic 0.6.9
  new RegExp('Error: You are accessing globalThis.mergeObject[\\s\\S]*at get defaultOptions', 'm'),
  new RegExp('Error: You are accessing globalThis.mergeObject[\\s\\S]*at eU\.init', 'm'),
  new RegExp('Error: You are accessing globalThis.isNewerVersion[\\s\\S]*at Object.renderSidebarTab \[as fn]', 'm'),
  new RegExp('Error: You are accessing globalThis.duplicate[\\s\\S]*at h', 'm'),
  new RegExp('Error: You are accessing globalThis.randomID[\\s\\S]*at new e', 'm'),
  new RegExp('Cannot set properties of undefined \(setting \'renderable\'\)', 'm'),
  new RegExp(
    'Error: Error thrown in hooked function \'\' for hook \'preCreateMeasuredTemplate\'. Cannot destructure property \'name\' of \'t\' as it is undefined.',
    'm'),
  // Module Management+ 2.2.3
  new RegExp('Error: You are accessing globalThis.isNewerVersion[\\s\\S]*at g.getChangelogs', 'm'),
  new RegExp('Error: You are accessing globalThis.isNewerVersion[\\s\\S]*at Object.renderSidebarTab', 'm'),
  // TinyMCE
  new RegExp('theme.min.js:4 \\[Violation\\] Added non-passive event listener to a scroll-blocking', 'm'),
  // pf2e animations
  new RegExp('Failed to load audio element "modules/soundfxlibrary', 'm'),

  // V13


  // PF2E system
  new RegExp('at new WorldClock.*pf2e.mjs', 'm'),
  new RegExp('at new LicenseViewer.*pf2e.mjs', 'm'),
  // LibWrapper -- sadly these exclusions are useless, as the libwrapper code is called before this code
  new RegExp('libWrapper-api.js:822:35', 'm'),
  new RegExp('libWrapper-api.js:826:33', 'm'),
  // TokenMagic
  new RegExp('PlaceableObjectProto.js', 'm'),
  new RegExp('tokenmagic.js', 'm'),
  // Quick Insert
  new RegExp('Object.fn.*quick-insert.js', 'm'),
  // PF2E Character Gallery
  new RegExp('gallery.mjs:190:7', 'm'),
  new RegExp('gallery.mjs:45:19', 'm'),
)
