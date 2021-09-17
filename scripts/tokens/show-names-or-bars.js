import { showDialogWithOptions } from '../utils/dialog-utils.js'

export const showNamesOrBars = async (tokens, displayName, displayBars) => {
  const updates = tokens.map(tok => ({
    _id: tok.id,
    displayName,
    displayBars,
  }))
  return canvas.scene.updateEmbeddedDocuments('Token', updates)
}
const { OWNER, OWNER_HOVER, HOVER, ALWAYS, NONE } = CONST.TOKEN_DISPLAY_MODES

// technically I'm using OWNER_HOVER and not NONE, so names and bars are still shown to owner when hovering.
// but I think this is preferable in most situations.
export const showNamesOrBarsDialog = (tokens) => {
  const options = [
    'Hide Names (owner hover)',
    'Show Names (owner)',
    'Show Names (everyone hover)',
    'Show Names (everyone)',
    'Hide Bars (none)',
    'Hide Bars (owner hover)',
    'Show Bars (owner always)',
    'Show Bars (everyone)',
  ]
  showDialogWithOptions(
    `Show names or bars? (${tokens.length} tokens)`,
    'Pick an option.',
    async (option) => {
      switch (option) {
        case 'Hide Names (owner hover)': return showNamesOrBars(tokens, OWNER_HOVER, undefined)
        case 'Show Names (owner)': return showNamesOrBars(tokens, OWNER, undefined)
        case 'Show Names (everyone hover)': return showNamesOrBars(tokens, HOVER, undefined)
        case 'Show Names (everyone)': return showNamesOrBars(tokens, ALWAYS, undefined)
        case 'Hide Bars (none)': return showNamesOrBars(tokens, undefined, NONE)
        case 'Hide Bars (owner hover)': return showNamesOrBars(tokens, undefined, OWNER_HOVER)
        case 'Show Bars (owner)': return showNamesOrBars(tokens, undefined, OWNER)
        case 'Show Bars (everyone)': return showNamesOrBars(tokens, undefined, ALWAYS)
      }
    },
    options
  )
}