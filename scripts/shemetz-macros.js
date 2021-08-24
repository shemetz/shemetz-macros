import { getDependency } from './utils/data-utils.js'
import { bold, chat, error, italicize } from './utils/message-utils.js'
import { crit, critDialog } from './dnd5e/crit.js'
import { spendHitDie } from './dnd5e/spend-hit-die.js'
import { colorPickFromCursor } from './drawing/eyedropper-color-pick.js'
import { showNamesOrBarsDialog } from './tokens/show-names-or-bars.js'
import { playSound, playSoundFromDialog, soundCheck } from './sound/play-sound.js'
import { flipTokens } from './tokens/flip.js'
import { toggleHide } from './placeables/toggle-hide.js'
import { printIdOfControlled } from './placeables/print-id.js'
import { postTokenArt, viewTokenArt } from './tokens/token-art.js'
import { swapTokenPositions } from './tokens/swap-token-positions.js'
import { setupLightAndVision } from './tokens/setup-light-and-vision.js'
import {
  selectedToken,
  selectedTokens,
  targetedTokens,
  hoveredTokens,
  selectedOrDefaultActor, getTokenNamed,
} from './utils/token-utils.js'
import { turnSelectedTokensTowardsCursor } from './tokens/turn-selected-token-towards-cursor.js'
import { turnTokensToFaceTarget } from './tokens/turn-to-face.js'
import { postItemDescription } from './items/post-item-description.js'
import { clearAllConditions } from './tokens/clear-conditions.js'
import { filterMacrosByAuthor } from './gui/filter-macros.js'
import { checkIfBetterRolls5eMessageIsCrit } from './dnd5e/better-rolls-5e-utils.js'
import { recklessCast } from './custom-stuff/reckless-cast.js'
import { animefyNextAttack } from './custom-stuff/anime-attack.js'
import {
  shiftImageToIndex,
  shiftImageWithArgs,
  shiftSelectedPlaceableImageByKeyboard,
} from './placeables/image-shift.js'
import { highlightTransparentTokensOnMap } from './tokens/highlight-map-locations.js'
import { openTreasureChest, closeSelectedTreasureChests } from './custom-stuff/treasure-chest.js'

self.ShemetzMacros = {
  getDependency,
  error, chat, italicize, bold,
  crit, critDialog,
  spendHitDie,
  colorPickFromCursor,
  showNamesOrBarsDialog,
  playSound, soundCheck, playSoundFromDialog,
  flipTokens,
  toggleHide,
  printIdOfControlled,
  postTokenArt, viewTokenArt,
  swapTokenPositions,
  setupLightAndVision,
  selectedToken, selectedTokens, targetedTokens, hoveredTokens, selectedOrDefaultActor, getTokenNamed,
  turnSelectedTokensTowardsCursor,
  turnTokensToFaceTarget,
  postItemDescription,
  clearAllConditions,
  filterMacrosByAuthor,
  checkIfBetterRolls5eMessageIsCrit,
  recklessCast,
  animefyNextAttack,
  shiftSelectedPlaceableImageByKeyboard, shiftImageWithArgs, shiftImageToIndex,
  highlightTransparentTokensOnMap,
  openTreasureChest, closeSelectedTreasureChests,
}

Hooks.once('init', function () {
  const macroNames = Object.keys(self.ShemetzMacros)
  console.log(`Shemetz Macros | Initialized with ${macroNames.length} macros: ${macroNames.join(', ')}`)
})