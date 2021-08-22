import { getDependency } from './utils/data-utils.js'
import { bold, chat, error, italicize } from './utils/message-utils.js'
import { crit, critDialog } from './dnd5e/crit.js'
import { colorPickFromCursor } from './drawing/eyedropper-color-pick.js'
import { showNamesOrBarsDialog } from './tokens/show-names-or-bars.js'
import { playSound, playSoundFromDialog, soundCheck } from './sound/play-sound.js'
import { flipTokens } from './tokens/flip.js'
import { toggleHide } from './placeables/toggle-hide.js'
import { printIdOfControlled } from './placeables/print-id.js'
import { postTokenArt, viewTokenArt } from './tokens/token-art.js'
import { swapTokenPositions } from './tokens/swap-token-positions.js'
import { setupLightAndVision } from './tokens/setup-light-and-vision.js'
import { selectedTokens, targetedTokens, hoveredTokens } from './utils/token-utils.js'
import { turnSelectedTokensTowardsCursor } from './tokens/turn-selected-token-towards-cursor.js'
import { turnTokensToFaceTarget } from './tokens/turn-to-face.js'
import { postItemDescription } from './items/post-item-description.js'

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
  postTokenArt, viewTokenArt,
  swapTokenPositions,
  setupLightAndVision,
  selectedTokens, targetedTokens, hoveredTokens,
  turnSelectedTokensTowardsCursor,
  turnTokensToFaceTarget,
  postItemDescription,
}

Hooks.once('init', function () {
  const macroNames = Object.keys(self.ShemetzMacros)
  console.log(`Shemetz Macros | Initialized with ${macroNames.length} macros: ${macroNames.join(', ')}`)
})