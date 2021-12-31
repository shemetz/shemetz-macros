import { hookShemetzMacros } from './shemetz-macros.js'
import { hookCloseWallGaps } from './walls/close-wall-gaps.js'
import { hookEyedropperColorPicker } from './drawing/eyedropper-color-pick.js'
import { hookBlockPushing } from './custom-stuff/block-pushing.js'

Hooks.on('init', () => {
  hookShemetzMacros()
  hookCloseWallGaps()
  hookEyedropperColorPicker()
  hookBlockPushing()

  // TODO move this to better spot and reformat it, when I get my IDE back
  // while ctrl key is held, dragged tokens will not animate and thus won't see between walls they "move" through
  Hooks.on('preUpdateToken', (doc, diff, options, userId) => {
		const e = window.event;
		if(!e)
			return;
		const keyVar = 'ctrlKey'
		if(e[keyVar] && ('x' in diff || 'y' in diff)) {
			options.animate = false;
		}
	});
})
