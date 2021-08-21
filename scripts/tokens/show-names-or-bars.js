import { showDialogWithOptions } from '../utils/dialog-utils.js'

export const showNamesOrBars = (tokens, displayName, displayBars) => {
  const updates = tokens.map(tok => ({
    _id: tok.id,
    displayName,
    displayBars,
  }))
  canvas.scene.updateEmbeddedDocuments('Token', updates)
}
const { OWNER, OWNER_HOVER, ALWAYS } = CONST.TOKEN_DISPLAY_MODES

// technically I'm using OWNER_HOVER and not NONE, so names and bars are still shown to owner when hovering.
// but I think this is preferable in most situations.
export const showNamesOrBarsDialog = (tokens) => {
  const options = ['Hide Names', 'Show Names (everyone)', 'Show Names (owner)', 'Hide Bars', 'Show Bars (owner)', 'Show Bars (everyone)']
  showDialogWithOptions(
    'Show names or bars?',
    'Pick an option.',
    (option) => {
      switch (option) {
        case 'Hide Names': return showNamesOrBars(tokens, OWNER_HOVER, undefined)
        case 'Show Names (everyone)': return showNamesOrBars(tokens, ALWAYS, undefined)
        case 'Show Names (owner)': return showNamesOrBars(tokens, OWNER, undefined)
        case 'Hide Bars': return showNamesOrBars(tokens, undefined, OWNER_HOVER)
        case 'Show Bars (everyone)': return showNamesOrBars(tokens, undefined, ALWAYS)
        case 'Show Bars (owner)': return showNamesOrBars(tokens, undefined, OWNER)
      }
    },
    options
  )
}