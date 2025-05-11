// usually gaps are <5 in distance
const DEFAULT_MAXIMUM_GAP_DISTANCE = 5

let visualEffectsGraphics = null

function getVisualEffectsGraphics () {
  if (visualEffectsGraphics === null || visualEffectsGraphics._geometry === null) {
    // visualEffectsGraphics._geometry will become null if the canvas changes, e.g. when moving to new scene
    visualEffectsGraphics = canvas.controls.addChild(new PIXI.Graphics())
  }
  return visualEffectsGraphics
}

const distanceSquared = (x1, y1, x2, y2) => {
  return (x1 - x2) ** 2 + (y1 - y2) ** 2
}

const updateClosestPoint = (x1, y1, x2, y2, maxDistSq, closestPoint) => {
  const distSq = distanceSquared(x1, y1, x2, y2)
  if (distSq === 0) {
    closestPoint[3] += 1
  } else if (distSq < maxDistSq && distSq < closestPoint[2]) {
    if (closestPoint[3] > 0) {
      // point has some "good" neighbors that share its location, so if we move it now we're creating trouble.
      // solution:  don't move it if there's a good neighbor.  and stop counting that neighbor.
      // this will fix situations like this: > -   →   >-
      // and also situations such as this:   > =   →   > <   →   ><
      closestPoint[3] -= 1
    } else {
      closestPoint[0] = x2
      closestPoint[1] = y2
      closestPoint[2] = distSq
    }
  }
}

const generateWallGapUpdates = (walls, maxDistSq) => {
  const updates = walls.map(w1 => {
    w1._loopedThrough = true
    const origC1 = w1.document.c
    const c1 = duplicate(w1.document.c)
    let closestStartPoint = [Infinity, Infinity, Infinity, 0] // x, y, closestSquaredDistance, goodNeighbors
    let closestEndPoint = [Infinity, Infinity, Infinity, 0] // x, y, closestSquaredDistance, goodNeighbors
    // *** O(n^2) loop! ***
    for (const w2 of walls) {
      if (w2._loopedThrough) continue
      const c2 = w2.document.c
      updateClosestPoint(c1[0], c1[1], c2[0], c2[1], maxDistSq, closestStartPoint)
      updateClosestPoint(c1[0], c1[1], c2[2], c2[3], maxDistSq, closestStartPoint)
      updateClosestPoint(c1[2], c1[3], c2[0], c2[1], maxDistSq, closestEndPoint)
      updateClosestPoint(c1[2], c1[3], c2[2], c2[3], maxDistSq, closestEndPoint)
    }
    if (closestStartPoint[2] === Infinity && closestEndPoint[2] === Infinity)
      return null
    if (closestStartPoint[2] !== Infinity) {
      c1[0] = closestStartPoint[0]
      c1[1] = closestStartPoint[1]
      getVisualEffectsGraphics().lineStyle(6, 0xFF0000, 0.7) // width, color, alpha
        .drawCircle(origC1[0], origC1[1], 12).lineStyle(5, 0x00FF00, 0.7) // width, color, alpha
        .drawCircle(c1[0], c1[1], 12)
    }
    if (closestEndPoint[2] !== Infinity) {
      c1[2] = closestEndPoint[0]
      c1[3] = closestEndPoint[1]
      getVisualEffectsGraphics().lineStyle(6, 0xFF0000, 0.7) // width, color, alpha
        .drawCircle(origC1[2], origC1[3], 12).lineStyle(5, 0x00FF00, 0.7) // width, color, alpha
        .drawCircle(c1[2], c1[3], 12)
    }
    return { _id: w1.id, c: c1 }
  }).filter(it => it !== null)
  walls.forEach(w1 => {
    w1._loopedThrough = false
  })
  return updates
}

/**
 * NOTE:  Closing gaps will often create new gaps, when there's 3-4 walls that nearly touch each other.
 * You should rerun the macro 2-3 times until there are no more gaps.  And inspect the gaps visually, of course.
 */
export const closeWallGaps = async (onlyControlled = true, maximumGapDistance = DEFAULT_MAXIMUM_GAP_DISTANCE) => {
  const maxDistSq = maximumGapDistance ** 2
  const walls = onlyControlled ? canvas.walls.controlled : canvas.walls.placeables
  const updates = generateWallGapUpdates(walls, maxDistSq)
  if (updates.length === 0)
    ui.notifications.warn(`No gaps found.`)
  else
    promptConfirmation(walls, maxDistSq, updates)
}

const promptConfirmation = (walls, maxDistSq, updates) => {
  foundry.applications.api.DialogV2.wait({
    id: 'close-wall-gaps',
    window: {
      title: 'Close Wall Gaps?',
      icon: 'fas fa-tape',
    },
    content: `<p>Close ${updates.length} gaps?</p>`,
    buttons: [
      {
        action: 'ok',
        default: true,
        label: `Close ${updates.length} gaps`,
        icon: 'fas fa-check',
        callback: async () => {
          await canvas.scene.updateEmbeddedDocuments('Wall', updates)
          const moreUpdates = generateWallGapUpdates(walls, maxDistSq)
          if (moreUpdates.length === 0) {
            ui.notifications.info(`Closed all ${updates.length} gaps`)
          } else {
            ui.notifications.info(`Closed ${updates.length} gaps;  this created new gaps!`)
            promptConfirmation(walls, maxDistSq, moreUpdates)
          }
        },
      },
      {
        action: 'cancel',
        label: 'Cancel',
        icon: 'fas fa-times',
        callback: () => {},
      },
    ],
    close: () => {
      getVisualEffectsGraphics().clear()
    },
  })
}

export const hookCloseWallGaps = () => {
  Hooks.on('getSceneControlButtons', controls => {
    if (!game.user.isGM) return
    controls.walls.tools.closeWallGaps = {
      name: 'closeWallGaps',
      title: 'Close Wall Gaps',
      icon: 'fas fa-tape',
      button: true,
      onChange: () => {
        return closeWallGaps(canvas.walls.controlled.length > 0, DEFAULT_MAXIMUM_GAP_DISTANCE)
      },
    }
  })
}
