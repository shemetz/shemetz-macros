/*
--- treasure-chest ---
A complex macro that combines several other macros, and is meant to be triggered when a player character walks into a chest to open it.
- Treats the "toggle activation state" flag as the open/closed state of a chest token.
- If the chest is already open, nothing will happen (making sure the macro isn't called multiple times in a session).  Otherwise...
- Chest token will change to look open.
- "treasure" sound effect will be played (optional 3rd parameter for a sound effect name)
- Item description will be shown in chat

Usage example in TriggerHappy:
    @Token[synetownchest1] @ChatMessage[/treasure-chest-trigger "synetownchest1" "Gold Coins (50gp)"] @Trigger[move stopMovement]
with a macro named treasure-chest-trigger:
    const chestToken = ShemetzMacros.getTokenNamed(args[0])
    ShemetzMacros.openTreasureChest(token, chestToken, args[1])

You should first set up your chest token with Image Shift, where image 0 is closed and 1 is open.
e.g.
    https://i.imgur.com/CYKqSqG.png 1   # closed
    https://i.imgur.com/UMFeNYs.png 1   # open

IMPORTANT:  closed should be first, open should be second!
 */

import { getImageListIndex, hasImageList, shiftImageWithArgs } from '../placeables/image-shift.js'
import { playSound } from '../sound/play-sound.js'
import { postItemDescription } from '../items/post-item-description.js'
import { selectedTokens } from '../utils/token-utils.js'

export const openTreasureChest = async (triggeringToken, chestToken, lootItemNameOrId, soundEffectName = 'treasure') => {
  const triggererName = triggeringToken ? triggeringToken.name : null
  if (!hasImageList(chestToken))
    return ui.notifications.error(`You must set up the chest token to have 2 images, with the Image Shift macro`)
  const chestIsOpen = getImageListIndex(chestToken) === 1
  if (chestIsOpen) {
    console.log(`Treasure chest is already open: ${chestToken.name}, touched by token: ${triggererName}`)
    return
  }
  console.log(`Treasure chest opened: ${chestToken.name}, by token: ${triggererName}`)

  await shiftImageWithArgs(chestToken, +1, false)
  playSound(soundEffectName, true)
  postItemDescription(lootItemNameOrId, triggererName)
}

const closeTreasureChest = async (chestToken) => {
  const chestIsOpen = getImageListIndex(chestToken) === 1
  if (!chestIsOpen) {
    console.log(`chest ${chestToken.name} is already closed.`)
    return
  }
  return shiftImageWithArgs(chestToken, -1, false)
}

export const closeSelectedTreasureChests = () => {
  selectedTokens().forEach(closeTreasureChest)
}