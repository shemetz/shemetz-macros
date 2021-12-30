import { showDialogWithOptions } from '../utils/dialog-utils.js'

const ALL_PLAYERS = 'All Players'

const applyAssignment = async (macroName, playerSelection) => {
  const allPlayerNames = game.users.filter(u => !u.isGM).map(u => u.name)
  const playerNames = (playerSelection === ALL_PLAYERS)
    ? allPlayerNames
    : [playerSelection]
  for (const playerName of playerNames) {
    const slot = undefined
    const macro = game.macros.getName(macroName)
    await game.users.getName(playerName).assignHotbarMacro(macro, slot)
  }
}

export const remoteAssignHotbarMacro = () => {
  const allPlayerNames = game.users.filter(u => !u.isGM).map(u => u.name)
  const ownedMacroNames = game.macros.filter(m => m.isOwner).map(m => m.name)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  showDialogWithOptions(
    'Choose macro',
    'Choose...',
    async (macroName) => {
      if (!macroName) return
      await showDialogWithOptions(
        'Choose player/s',
        'Choose...',
        async (playerSelection) => {
          if (!playerSelection) return
          await applyAssignment(macroName, playerSelection)
        },
        [ALL_PLAYERS, ...allPlayerNames],
      )
    },
    ownedMacroNames,
  )
}