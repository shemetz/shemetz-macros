import { getDependency } from './utils/data-utils.js'
import { bold, chat, error, italicize } from './utils/message-utils.js'
import { crit, critDialog } from './dnd5e/crit.js'
import { colorPickFromCursor } from './drawing/eyedropper-color-pick.js'
import { showNamesOrBarsDialog } from './tokens/show-names-or-bars.js'
import { playSound, playSoundFromDialog, soundCheck } from './sound/play-sound.js'

self.ShemetzMacros = {
  getDependency,
  error, chat, italicize, bold,
  crit, critDialog,
  colorPickFromCursor,
  showNamesOrBarsDialog,
  playSound, soundCheck, playSoundFromDialog
}

Hooks.once('init', function () {
  const macroNames = Object.keys(self.ShemetzMacros)
  console.log(`Shemetz Macros | Initialized with ${macroNames.length} macros: ${macroNames.join(', ')}`)
})