const macroName = 'Repeat Last Action'
if (!self.RepeatLatestOperation) {
  self.RepeatLatestOperation = {
    alreadyHooked: false
  }
}
const RLO = self.RepeatLatestOperation

function openDialogWindow (placeables) {
  // TODO add checkbox in dialog
  let isRelative = false
  const update = isRelative ? RLO.latestUpdateRelative : RLO.latestUpdate
  let template = `
<div>
    <div class="form-group">
        <label>About to apply changes to: ${placeables.map(p => p.name || p.data.name || p.id)}</label>
        <div id="selectedOption">`
  for (const [flatKey, value] of Object.entries(update)) {
    let oldValues = [], newValues = []
    for (const p of placeables) {
      const oldValue = getProperty(p.data, flatKey)
      const newValue = (isRelative && typeof (value) === 'number') ? oldValue + value : value
      if (oldValue !== newValue && !oldValues.includes(oldValue)) {
        oldValues.push(oldValue)
        if (!newValues.includes(newValue)) {
          newValues.push(newValue)
        }
      }
    }
    if (oldValues.length > 0) {
      const oldValueStr = oldValues.length === 1 ? oldValues[0] : oldValues.join(',')
      const newValueStr = newValues.length === 1 ? newValues[0] : newValues.join(',')
      template += `<div><b>${flatKey}</b>: ${oldValueStr} -> ${newValueStr}</div>`
    }
  }
  template += `</div>
    </div>
</div>`
  new Dialog({
    title: `Repeat Last Action?`,
    content: template,
    buttons: {
      ok: {
        icon: '<i class="fas fa-check"></i>',
        label: 'OK',
        callback: async () => {
          applyUpdateDiff(placeables, isRelative)
        },
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: 'Cancel',
        callback: async () => {/* do nothing */},
      },
    },
    default: 'cancel',
  }).render(true)
}

function applyUpdateDiff (placeables, isRelative) {
  const update = isRelative ? RLO.latestUpdateRelative : RLO.latestUpdate
  const updates = placeables.map(p => {
    const appliedUpdate = {}
    for (const [flatKey, value] of Object.entries(update)) {
      const oldValue = getProperty(p.data, flatKey)
      const newValue = (isRelative && typeof (value) === 'number') ? oldValue + value : value
      if (oldValue !== newValue) {
        appliedUpdate[flatKey] = newValue
      }
    }
    const updateObj = expandObject(appliedUpdate)
    return {
      ...updateObj,
      _id: p.id
    }
  })
  const options = RLO.latestOptions
  const embeddedName = placeables[0].document.documentName
  return canvas.scene.updateEmbeddedDocuments(embeddedName, updates, options)
}

function recordUpdateDiff (document, update, options) {
  let flattenedUpdate = flattenObject(update)
  delete flattenedUpdate['_id']
  improveUpdate(document.data, flattenedUpdate)
  const baseUpdate = deepClone(flattenedUpdate)
  const relativeUpdate = deepClone(flattenedUpdate)
  for (const [key, value] of Object.entries(flattenedUpdate)) {
    if (typeof (value) === 'number') {
      const oldValue = getProperty(document.data, key)
      relativeUpdate[key] = value - oldValue
    }
  }
  RLO.latestUpdate = baseUpdate
  RLO.latestUpdateRelative = relativeUpdate
  RLO.latestOptions = options
  RLO.latestDocClassName = document.constructor.name
}

function improveUpdate (data, update) {
  if (update.hasOwnProperty('x') && !update.hasOwnProperty('y')) update['y'] = data.y
  if (!update.hasOwnProperty('x') && update.hasOwnProperty('y')) update['x'] = data.x
}

export function hookRepeatLatestOperation () {
  Hooks.on('preUpdateToken', recordUpdateDiff)
  Hooks.on('preUpdateTile', recordUpdateDiff)
  Hooks.on('preUpdateWall', recordUpdateDiff)
  Hooks.on('preUpdateDrawing', recordUpdateDiff)
  RLO.latestDocClassName = null
  RLO.alreadyHooked = true
  ui?.notifications?.info(`Hooks ready - ${macroName}`)

  RLO.deinit = () => {
    Hooks.off('preUpdateToken', recordUpdateDiff)
    Hooks.off('preUpdateTile', recordUpdateDiff)
    Hooks.off('preUpdateWall', recordUpdateDiff)
    Hooks.off('preUpdateDrawing', recordUpdateDiff)
    ui?.notifications?.info(`Hooks off - ${macroName}`)
    RLO.alreadyHooked = false
  }
}

export async function repeatLastAction (openDialog) {
  if (!RLO.alreadyHooked) {
    return hookRepeatLatestOperation()
  }
  if (!RLO.latestDocClassName) {
    return ui.notifications.warn(`${macroName} - You need to make an operation before you can repeat it..!`)
  }
  const activeLayerThings = Array.from(canvas.activeLayer.documentCollection.values())
  if (activeLayerThings.length > 0 && activeLayerThings[0].constructor.name === RLO.latestDocClassName) {
    const controlled = canvas.activeLayer.controlled
    if (controlled.length !== 0) {
      openDialog ? openDialogWindow(controlled) : applyUpdateDiff(controlled, false)
    } else {
      ui.notifications.warn(`${macroName} - You need to select a thing!`)
    }
  } else {
    ui.notifications.warn(`${macroName} - latest operation was done on a different type of thing!  ${activeLayerThings[0]?.constructor?.name} !== ${RLO.latestDocClassName}`)
  }
}

export function hookRepeatLatestOperationHotkey () {
  const { CONTROL, SHIFT, ALT } = KeyboardManager.MODIFIER_KEYS
  game.keybindings.register('shemetz-macros', 'repeat-last-action', {
    name: 'Repeat Last Action',
    hint: 'Will repeat the latest token/tile/wall/drawing update operation, but with selected things instead.' +
      ' Hold Shift to apply a relative change instead (e.g. increase x by +100 instead of setting x to 1400).' +
      ' Careful - relative changes on some attributes (e.g. wall type) will cause issues!' +
      ' Hold Alt to skip confirmation (but be careful!).',
    editable: [
      {
        key: 'KeyZ',
        modifiers: [CONTROL, SHIFT]
      }
    ],
    reservedModifiers: [ALT],
    onDown: async () => {
      const openDialog = !game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.ALT)
      return repeatLastAction(openDialog)
    },
  })
}
