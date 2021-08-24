/*
A complex macro that combines several other macros, and is meant to be triggered when a player character presses a lever/button on the map, toggling between two states.
- Takes a toggle type argument: "toggle", "on" or "off".
  toggle will always flip the existing states, while on and off will do nothing if lever is already on/off
- Lever will shift image.  The lever is considered to be "off" in its first image and "on" in its second image.
- All walls in the arguments will toggle open/close (as doors), flipping their existing state
- All tiles in the arguments will shift their image or hide/unhide (if they don't have token-image-swap setup)
- A sound effect will be played

You should first set up your lever token and optionally tiles with token-image-swap, where image 0 is closed and 1 is open.
 */

import { getImageListIndex, hasImageList, shiftImageToIndex, shiftImageWithArgs } from '../placeables/image-shift.js'
import { playSound } from '../sound/play-sound.js'

export const leverMechanismChangeWallsAndTiles = async (leverToken, toggleType, sfxName, doorIds, tileIds) => {
  // basic argument checks and handling
  if (!['toggle', 'on', 'off'].includes(toggleType))
    return ui.notifications.error(`invalid toggle type: ${toggleType}`)
  if (!hasImageList(leverToken))
    return ui.notifications.error(`You must set up the lever token to have 2 images, with the Image Shift macro`)
  const currentLeverState = getImageListIndex(leverToken) === 1
  const newLeverState = toggleType === 'toggle' ? !currentLeverState : toggleType === 'on'
  console.log(`Lever used: ${leverToken.name}.  state change from ${currentLeverState} to ${newLeverState}`)
  if (currentLeverState === newLeverState) {
    console.warn(`The lever shouldn't be used again if it's one-way and already used;  doing nothing`)
    return
  }
  const walls = []
  const tiles = []
  doorIds.forEach(id => {
    const wall = canvas.walls.get(id)
    if (wall) return walls.push(wall)
    console.warn(`Failed to find wall with ID ${id}`)
  })
  tileIds.forEach(id => {
    const tile = canvas.background.get(id) || canvas.foreground.get(id)
    if (tile) return tiles.push(tile)
    console.warn(`Failed to find tile with ID ${id}`)
  })
  if (doorIds.length !== walls.length || tileIds.length !== tiles.length)
    return ui.notifications.error(`Failed to find some walls/tiles, see console log`)

  // after validating input and stuff, we're finally ready to make changes
  playSound(sfxName, true)
  await shiftImageToIndex(leverToken, newLeverState ? 1 : 0)
  await flipWallsOpenOrClose(walls)
  await shiftTilesOrFlipHidden(tiles)
}

const flipWallsOpenOrClose = async (walls) => {
  const wallUpdates = walls.map(wall => {
    return {
      _id: wall.id,
      ds: 1 - wall.data.ds,
    }
  })
  return canvas.scene.updateEmbeddedDocuments('Wall', wallUpdates)
}

const shiftTilesOrFlipHidden = async (tiles) => {
  const asyncUpdates = []
  const tileUpdates = tiles.map(tile => {
    if (hasImageList(tile)) {
      asyncUpdates.push(shiftImageWithArgs(tile, +1, true))
      return null
    } else {
      return {
        _id: tile.id,
        'hidden': !tile.data.hidden,
      }
    }
  }).filter(it => it !== null)
  await Promise.all(asyncUpdates)
  return canvas.scene.updateEmbeddedDocuments('Tile', tileUpdates)
}