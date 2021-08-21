/*
--- secret-wall-lever ---
A complex macro that combines several other macros, and is meant to be triggered when a player character presses a lever/button on the map, toggling between two states.
- Takes a toggle type argument: "toggle", "on" or "off".
  toggle will always flip the existing states, while on and off will activate/open/shift and deactivate/close/unshift everything.
- Lever will shift image.
- All wall IDs in the arguments will toggle open/close (like doors)
- All Tile IDs in the arguments will shift their image or hide/unhide (if they don't have token-image-swap setup)
- A sound effect will be played

Usage in TriggerHappy:
    @Token[BUTTON_TOKEN_NAME] @ChatMessage[/secret-wall-lever BUTTON_TOKEN_NAME TOGGLE_TYPE SFX_NAME WALL_IDs(...) TILE_IDs(...)]
e.g.
    @Token[SyneButton2] @ChatMessage[/secret-wall-lever SyneButton2 toggle stone_slide M2enUpbpVxbwG99t 1lBbRrYcu2v6pTIR MNzXVzI5fEexK0bX YtvDOeUzl6nGxqec hPnrgSPQMt62OIyR]
    @Token[SyneButton1] @ChatMessage[/secret-wall-lever SyneButton1 toggle vanish qq7XCpCnTwiW123D K0DVa1BR0HRTR5nH 43Sp1VEXfmoeredM eJUlR6acEMe1fyAg iujgdLQ7bQL9hUVb 9sInyF2TcWjtPJEK]

You should first set up your lever token and optionally tiles with token-image-swap, where image 0 is closed and 1 is open.


source:
https://github.com/itamarcu/foundry-macros/blob/master/secret-wall-lever.js
suggested icon:
https://i.imgur.com/iw4sH39.png
 */

const leverTokenName = args[0], toggleType = args[1], sfxName = args[2], ids = args.slice(3)

const FLAG_SCOPE = 'world'
const FLAG_KEY_TOGGLE = 'macro-toggle-activation-state'
const FLAG_KEY_IMAGE_SWAP = 'token-image-swap'
const FLAG_KEY_TILE_IMAGE_SHIFT = 'tile-image-shift'

main()

function main() {
  // basic argument checks and handling
  if (!['toggle', 'on', 'off'].includes(toggleType)) return ui.notifications.error(`invalid toggle type: ${toggleType}`)
  const leverToken = canvas.tokens.placeables.find(t => t.name === leverTokenName)
  if (!leverToken) return ui.notifications.error(`${leverTokenName} cannot be found on the scene!`)
  const walls = []
  const tiles = []
  ids.forEach(id => {
    const wall = canvas.walls.get(id)
    if (wall) return walls.push(wall)
    const tile = canvas.background.get(id) || canvas.foreground.get(id)
    if (tile) return tiles.push(tile)
    console.error(`Failed to find wall/tile with ID ${id}`)
  })
  if (ids.length !== walls.length + tiles.length) return ui.notifications.warn(`Failed to find some walls/tiles, see console log`)

  const currentActivationState = leverToken.document.getFlag(FLAG_SCOPE, FLAG_KEY_TOGGLE)
  const newActivationState = toggleType === 'toggle' ? !currentActivationState : toggleType === 'on'
  console.log(`Button pressed: ${leverTokenName}.  state change from ${currentActivationState} to ${newActivationState}`)

  // update lever (only if its state is changing)
  // will also play sound only if state is changing
  if (currentActivationState !== newActivationState) {
    leverToken.document.setFlag(FLAG_SCOPE, FLAG_KEY_TOGGLE, true)
    game.macros.getName('play-sound').renderContent(sfxName, true)
    if (leverToken.document.getFlag(FLAG_SCOPE, FLAG_KEY_IMAGE_SWAP)) {
      game.macros.getName('token-image-shift').renderContent(leverTokenName, 'toggle' ? 'cycle' : newActivationState ? 'next' : 'prev')
    }
  }

  // update all walls
  const wallUpdates = walls.map(wall => {
    return {
      _id: wall.id,
      ds: toggleType === 'toggle' ? (1 - wall.data.ds) : +newActivationState
    }
  })
  canvas.scene.updateEmbeddedDocuments('Wall', wallUpdates)

  // update all tiles
  const tileUpdates = tiles.map(tile => {
    if (tile.document.getFlag(FLAG_SCOPE, FLAG_KEY_TILE_IMAGE_SHIFT)) {
      game.macros.getName('tile-image-shift').renderContent(tile.id, newActivationState ? 'next' : 'prev')
      return null
    } else {
      return {
        _id: tile.id,
        'hidden': toggleType === 'toggle' ? !tile.data.hidden : newActivationState
      }
    }
  }).filter(it => it !== null)
  canvas.scene.updateEmbeddedDocuments('Tile', tileUpdates)
}