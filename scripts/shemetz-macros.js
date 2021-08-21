import { getDependency } from './utils/data-utils.js'
import { bold, chat, error, italicize } from './utils/message-utils.js'
import { crit, critDialog } from './dnd5e/crit.js'
import { colorPickFromCursor } from './drawing/eyedropper-color-pick.js'
import { showNamesOrBarsDialog } from './tokens/show-names-or-bars.js'
import { playSound, playSoundFromDialog, soundCheck } from './sound/play-sound.js'
import { flipTokens } from './tokens/flip.js'
import { toggleHide } from './placeables/toggle-hide.js'
import { printIdOfControlled } from './placeables/print-id.js'
import { postTokenArt } from './tokens/postTokenArt.js'
import { swapTokenPositions } from './tokens/swap-token-positions.js'
import { setupLightAndVision } from './tokens/setup-light-and-vision.js'
import { selectedTokens } from './utils/token-utils.js'

self.ShemetzMacros = {
  getDependency,
  error, chat, italicize, bold,
  crit, critDialog,
  colorPickFromCursor,
  showNamesOrBarsDialog,
  playSound, soundCheck, playSoundFromDialog,
  flipTokens,
  toggleHide,
  printIdOfControlled,
  postTokenArt,
  swapTokenPositions,
  setupLightAndVision,
  selectedTokens,
}

Hooks.once('init', function () {
  const macroNames = Object.keys(self.ShemetzMacros)
  console.log(`Shemetz Macros | Initialized with ${macroNames.length} macros: ${macroNames.join(', ')}`)
})