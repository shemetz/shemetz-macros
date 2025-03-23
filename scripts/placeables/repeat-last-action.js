const macroName = 'Repeat Last Action'
if (!self.RepeatLatestOperation) {
  self.RepeatLatestOperation = {
    alreadyHooked: false,
  }
}
const RLO = self.RepeatLatestOperation

function openDialogWindow (placeables) {
  Hooks.once('renderDialog', function () {
    // Listen to checkbox change
    onDialogRelativeUpdateCheckboxClicked(false, placeables)
    $(`input#isRelative`).change(e => onDialogRelativeUpdateCheckboxClicked(e.target.checked, placeables))
  })
  let template = `
<div style="height: 200px">
    <div class="form-group">
        <div>
            <label>About to apply changes to: ${placeables.map(p => p.name || p.document.name || p.id)}</label>
        </div>
        <div>
            <input style="vertical-align: middle;" id="isRelative" type="checkbox"/>
            <label> Relative change?</label>
        </div>
        <div id="shownUpdate">
            <!-- this is where the deltas will be updated after the renderDialog hook -->
        </div>
    </div>
</div>`
  new Dialog({
    title: `Repeat Last Action?`,
    content: template,
    buttons: {
      ok: {
        icon: '<i class="fas fa-check"></i>',
        label: 'OK',
        callback: async (html) => {
          const isRelative = html.find('#isRelative')[0].checked
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

const onDialogRelativeUpdateCheckboxClicked = (newIsRelativeValue, placeables) => {
  const update = newIsRelativeValue ? RLO.latestUpdateRelative : RLO.latestUpdate
  let shownUpdate = ''
  for (const [flatKey, value] of Object.entries(update)) {
    const isRelativeNumberChange = newIsRelativeValue && typeof (value) === 'number'
    let oldValues = [], newValues = []
    for (const p of placeables) {
      let oldValue = foundry.utils.getProperty(p.document, flatKey)
      let newValue = isRelativeNumberChange ? oldValue + value : value
      const [oldValueStr, newValueStr] = formatNicelyIfNumbers(oldValue, newValue)
      if (oldValueStr !== newValue && !oldValues.includes(oldValueStr)) {
        oldValues.push(oldValueStr)
        if (!newValues.includes(newValueStr)) {
          newValues.push(newValueStr)
        }
      }
    }
    if (oldValues.length > 0) {
      const oldValuesStr = oldValues.length === 1 ? oldValues[0] : oldValues.join(', ')
      const newValuesStr = newValues.length === 1 ? newValues[0] : newValues.join(', ')
      const relativeChangeStr = isRelativeNumberChange
        ? ` (${value >= 0 ? '+' : ''}${value % 1 === 0 ? value : value.toFixed(2)})`
        : ''
      shownUpdate += `<div><b>${flatKey}${relativeChangeStr}</b>: ${oldValuesStr} -> ${newValuesStr}</div>`
    }
  }
  $(`#shownUpdate`).html(shownUpdate)
}

const formatNicelyIfNumbers = (oldValue, newValue) => {
  if (typeof (oldValue) !== 'number') return [oldValue, newValue]
  let oldValueStr = '' + oldValue, newValueStr = '' + newValue
  if (oldValue % 1 !== 0) oldValueStr = oldValue.toFixed(2)
  if (newValue % 1 !== 0) newValueStr = newValue.toFixed(2)
  return [oldValueStr, newValueStr]
}

function applyUpdateDiff (placeables, isRelative) {
  const update = isRelative ? RLO.latestUpdateRelative : RLO.latestUpdate
  const updates = placeables.map(p => {
    const appliedUpdate = {}
    for (const [flatKey, value] of Object.entries(update)) {
      const oldValue = foundry.utils.getProperty(p.document, flatKey)
      const newValue = (isRelative && typeof (value) === 'number') ? oldValue + value : value
      if (oldValue !== newValue) {
        appliedUpdate[flatKey] = newValue
      }
    }
    const updateObj = foundry.utils.expandObject(appliedUpdate)
    return {
      ...updateObj,
      _id: p.id,
    }
  })
  const options = RLO.latestOptions
  const embeddedName = placeables[0].document.documentName
  return canvas.scene.updateEmbeddedDocuments(embeddedName, updates, options)
}

function recordUpdateDiff (document, update, options) {
  let flattenedUpdate = foundry.utils.flattenObject(update)
  delete flattenedUpdate['_id']
  improveUpdate(document, flattenedUpdate)
  if (Object.keys(flattenedUpdate).length === 0) return // may happen if an update is meaningless e.g. when clicking old drawing
  const baseUpdate = foundry.utils.deepClone(flattenedUpdate)
  const relativeUpdate = foundry.utils.deepClone(flattenedUpdate)
  for (const [key, value] of Object.entries(flattenedUpdate)) {
    if (typeof (value) === 'number') {
      const oldValue = foundry.utils.getProperty(document, key)
      if (value !== oldValue) {
        relativeUpdate[key] = value - oldValue
      } else {
        delete relativeUpdate[key]
      }
    }
  }
  RLO.latestUpdate = baseUpdate
  RLO.latestUpdateRelative = relativeUpdate
  RLO.latestOptions = options
  RLO.latestDocClassName = document.constructor.name
}

function improveUpdate (data, update) {
  for (const key in update) {
    const updateValue = update[key]
    const oldValue = foundry.utils.getProperty(data, key)
    // -= in a key means it's removed from data
    if (key.includes('-=')) delete update[key]
    // if value is undefined/null/''/0 both before and after, we probably don't need to repeat it
    if (!updateValue && !oldValue) delete update[key]
    // if value didn't actually change we probably don't want to repeat it
    if (updateValue === oldValue) delete update[key]
    // Sometimes updates include empty arrays both before and after, ignore
    if (Array.isArray(updateValue) && updateValue.length === 0 && oldValue?.length === 0) delete update[key]
    // color comparison looks a bit different
    if (updateValue?.startsWith?.('#') && oldValue?.css === updateValue) delete update[key] // colors
    // if value is not a valid choice from a list, we probably don't want to repeat it (not sure why foundry does this)
    if (data.schema.fields?.[key]?.choices?.includes?.(updateValue) === false) delete update[key] // e.g. { disposition: null }
    // Something weird with detection modes in pf2e, should be ignored
    if (key === 'detectionModes' && updateValue?.length === 0 && oldValue?.length >= 2) delete update[key]
  }
  // If either X or Y changed, put the other one in the update as well
  if (update.hasOwnProperty('x') && !update.hasOwnProperty('y')) update['y'] = data.y
  if (!update.hasOwnProperty('x') && update.hasOwnProperty('y')) update['x'] = data.x
  // If X and Y barely changed at all (<0.9), ignore their change;  Foundry does that for some weird reason
  if (Object.keys(update).length >= 3 && Math.abs(update.x - data.x) < 0.9 && Math.abs(update.y - data.y) < 0.9) {
    delete update.x
    delete update.y
  }
  // pf2e actor has a Torch/Candle/etc which alters light, foundry uselessly includes old (actual) light data in
  // the update even though the light is overridden by the TokenLight rule element, and then all that extra
  // useless light data ends up here.
  const countChangesToLight = Object.keys(update).filter(k => k.startsWith('light.')).length
  if (
    countChangesToLight > 5
    && Object.keys(update).length > countChangesToLight
    && data.actor?.rules.some(r => r.key === 'TokenLight')
  )
    for (const key in update)
      if (key.startsWith('light.'))
        delete update[key]
}

export function hookRepeatLatestOperation () {
  Hooks.on('preUpdateToken', recordUpdateDiff)
  Hooks.on('preUpdateTile', recordUpdateDiff)
  Hooks.on('preUpdateWall', recordUpdateDiff)
  Hooks.on('preUpdateDrawing', recordUpdateDiff)
  Hooks.on('preUpdateNote', recordUpdateDiff)
  RLO.latestDocClassName = null
  RLO.alreadyHooked = true
  ui?.notifications?.info(`Hooks ready - ${macroName}`)

  RLO.deinit = () => {
    Hooks.off('preUpdateToken', recordUpdateDiff)
    Hooks.off('preUpdateTile', recordUpdateDiff)
    Hooks.off('preUpdateWall', recordUpdateDiff)
    Hooks.off('preUpdateDrawing', recordUpdateDiff)
    Hooks.off('preUpdateNote', recordUpdateDiff)
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
    ui.notifications.warn(
      `${macroName} - latest operation was done on a different type of thing!  ${activeLayerThings[0]?.constructor?.name} !== ${RLO.latestDocClassName}`)
  }
}

export function hookRepeatLatestOperationHotkey () {
  const { CONTROL, SHIFT, ALT } = foundry.helpers.interaction.KeyboardManager.MODIFIER_KEYS
  game.keybindings.register('shemetz-macros', 'repeat-last-action', {
    name: 'Repeat Last Action',
    hint: 'Will repeat the latest token/tile/wall/drawing update operation, but with selected things instead.' +
      ' Hold Shift to apply a relative change instead (e.g. increase x by +100 instead of setting x to 1400).' +
      ' Careful - relative changes on some attributes (e.g. wall type) will cause issues!' +
      ' Hold Alt to skip confirmation (but be careful!).',
    editable: [
      {
        key: 'KeyZ',
        modifiers: [CONTROL, SHIFT],
      },
    ],
    reservedModifiers: [ALT],
    onDown: async () => {
      const openDialog = !game.keyboard.isModifierActive(foundry.helpers.interaction.KeyboardManager.MODIFIER_KEYS.ALT)
      return repeatLastAction(openDialog)
    },
  })
}
