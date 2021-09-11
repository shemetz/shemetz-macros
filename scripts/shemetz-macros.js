import { getDependency } from './utils/data-utils.js'
import { bold, chat, error, htmlDecode, italicize } from './utils/message-utils.js'
import { crit, critDialog } from './dnd5e/crit.js'
import { spendHitDie } from './dnd5e/spend-hit-die.js'
import { colorPickFromCursor } from './drawing/eyedropper-color-pick.js'
import { showNamesOrBars, showNamesOrBarsDialog } from './tokens/show-names-or-bars.js'
import { playSound, playSoundFromDialog, soundCheck } from './sound/play-sound.js'
import { flipTokens } from './tokens/flip.js'
import { toggleHide } from './placeables/toggle-hide.js'
import { printIdOfControlled } from './placeables/print-id.js'
import { postTokenArt, viewTokenArt } from './tokens/token-art.js'
import { swapTokenPositions } from './tokens/swap-token-positions.js'
import { setupLightAndVision } from './tokens/setup-light-and-vision.js'
import {
  getTokenNamed,
  hoveredTokens,
  selectedOrDefaultActor,
  selectedToken,
  selectedTokens,
  targetedTokens,
} from './utils/token-utils.js'
import { getPlaceableWithId, getTileWithId, selectedTokenOrTile } from './utils/placeable-utils.js'
import { turnSelectedTokensTowardsCursor } from './tokens/turn-selected-token-towards-cursor.js'
import { turnTokensToFaceTarget } from './tokens/turn-to-face.js'
import { postItemDescription } from './items/post-item-description.js'
import { clearAllConditions } from './tokens/clear-conditions.js'
import { filterMacrosByAuthor } from './gui/filter-macros.js'
import {
  checkIfBetterRolls5eMessageIncludesNumber,
  checkIfBetterRolls5eMessageIsCrit,
} from './dnd5e/better-rolls-5e-utils.js'
import { recklessCast } from './custom-stuff/reckless-cast.js'
import { animefyNextAttack } from './custom-stuff/anime-attack.js'
import {
  getImageListIndex,
  hasImageList,
  prepareShiftImageToIndex,
  prepareShiftImageWithArgs,
  shiftImageToIndex,
  shiftImageWithArgs,
  shiftSelectedPlaceableImageByKeyboard,
} from './placeables/image-shift.js'
import { highlightTransparentTokensOnMap } from './tokens/highlight-map-locations.js'
import { closeSelectedTreasureChests, openTreasureChest } from './custom-stuff/treasure-chest.js'
import { openCloseDoors } from './walls/open-close-doors.js'
import { leverMechanismChangeWallsAndTiles } from './custom-stuff/lever-mechanism-change-walls-and-tiles.js'
import {
  checkIfAllTokensAtIndex0,
  shiftManyTokens,
  shiftSelectedTilesOrTokens,
} from './custom-stuff/image-shift-many.js'
import { setDarknessLevelDialog } from './canvas/darkness-level.js'
import { postPf2eRollButton, showAllPf2eActionButtons, showPostPf2eRollButtonDialog } from './pf2e/post-roll-button.js'

self.ShemetzMacros = {
  getDependency,
  error, chat, italicize, bold,
  htmlDecode,
  crit, critDialog,
  spendHitDie,
  colorPickFromCursor,
  showNamesOrBarsDialog, showNamesOrBars,
  playSound, soundCheck, playSoundFromDialog,
  flipTokens,
  toggleHide,
  printIdOfControlled,
  postTokenArt, viewTokenArt,
  swapTokenPositions,
  setupLightAndVision,
  selectedToken, selectedTokens, targetedTokens, hoveredTokens, selectedOrDefaultActor, getTokenNamed,
  getTileWithId, getPlaceableWithId, selectedTokenOrTile,
  turnSelectedTokensTowardsCursor,
  turnTokensToFaceTarget,
  postItemDescription,
  clearAllConditions,
  filterMacrosByAuthor,
  checkIfBetterRolls5eMessageIsCrit, checkIfBetterRolls5eMessageIncludesNumber,
  recklessCast,
  animefyNextAttack,
  shiftSelectedPlaceableImageByKeyboard, shiftImageWithArgs, shiftImageToIndex, hasImageList
  , getImageListIndex, prepareShiftImageWithArgs, prepareShiftImageToIndex,
  highlightTransparentTokensOnMap,
  openTreasureChest, closeSelectedTreasureChests,
  openCloseDoors,
  leverMechanismChangeWallsAndTiles,
  shiftManyTokens, shiftSelectedTilesOrTokens, checkIfAllTokensAtIndex0,
  setDarknessLevelDialog,
  postPf2eRollButton, showPostPf2eRollButtonDialog, showAllPf2eActionButtons,
}

Hooks.once('init', function () {
  const macroNames = Object.keys(self.ShemetzMacros)
  console.log(`Shemetz Macros | Initialized with ${macroNames.length} macros: ${macroNames.join(', ')}`)
})