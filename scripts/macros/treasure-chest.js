/*
--- treasure-chest ---
A complex macro that combines several other macros, and is meant to be triggered when a player character walks into a chest to open it.
- Treats the "toggle activation state" flag as the open/closed state of a chest token.
- If the chest is already open, nothing will happen (making sure the macro isn't called multiple times in a session).  Otherwise...
- Chest token will change to look open.
- "treasure" sound effect will be played (optional 3rd parameter for a sound effect name)
- Item description will be shown in chat

Usage in TriggerHappy:
    @Token[CHEST_TOKEN_NAME] @ChatMessage[/treasure-chest "CHEST_TOKEN_NAME" "LOOT_ITEM_NAME_OR_ID"] @Trigger[move stopMovement]
e.g.
    @Token[synetownchest1] @ChatMessage[/treasure-chest "synetownchest1" "Gold Coins (50gp)"] @Trigger[move stopMovement]

You should first set up your chest token with token-image-swap, where image 0 is closed and 1 is open.
e.g.
    https://i.imgur.com/CYKqSqG.png 1   # closed
    https://i.imgur.com/UMFeNYs.png 1   # open

source:
https://github.com/itamarcu/foundry-macros/blob/master/treasure-chest.js
suggested icon:
https://i.imgur.com/iw4sH39.png
 */

const chestTokenName = args[0], lootItemNameOrId = args[1], soundEffectName = args[2] || 'treasure'

const FLAG_SCOPE = 'world'
const FLAG_KEY_TOGGLE= 'macro-toggle-activation-state'

main()

function main() {
  const tokenName = token ? token.name : null
  const chestToken = canvas.tokens.placeables.find(t => t.name === chestTokenName)
  if (!chestToken) return ui.notifications.error(`${chestTokenName} cannot be found on the scene!`)
  const chestIsOpen = chestToken.document.getFlag(FLAG_SCOPE, FLAG_KEY_TOGGLE)
  if (chestIsOpen === true) {
    console.log(`Treasure chest is already open: ${chestTokenName}, touched by token: ${tokenName}`)
    return
  }
  console.log(`Treasure chest opened: ${chestTokenName}, by token: ${tokenName}`)
  chestToken.document.setFlag(FLAG_SCOPE, FLAG_KEY_TOGGLE, true)

  game.macros.getName('token-image-shift').renderContent(chestTokenName, '+')
  game.macros.getName('play-sound').renderContent(soundEffectName, true)
  game.macros.getName('item-dir-info').renderContent(lootItemNameOrId, tokenName)
}