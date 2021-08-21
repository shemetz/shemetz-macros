import { bold, chat, error, italicize } from './utils/message-utils.js'
import { crit, critDialog } from './dnd5e/crit.js'
import { colorPickFromCursor } from './drawing/eyedropper-color-pick.js'
import { getDependency } from './utils/data-utils.js'

self.ShemetzMacros = {
  error, chat, italicize, bold,
  crit, critDialog,
  colorPickFromCursor,
  getDependency,
}

Hooks.once('init', function () {
  const macroNames = Object.keys(self.ShemetzMacros)
  console.log(`Shemetz Macros | Initialized with ${macroNames.length} macros: ${macroNames.join(', ')}`)
})