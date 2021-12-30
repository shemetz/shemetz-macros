/**
 * This will move all the macros in the top-level macro directory into new folders, one for each user that created the macros
 */
export const organizeUnsortedMacros = async () => {
  const macrosByPlayer = {}
  game.macros.forEach(m => {
    if (m.folder) {
      return
    }
    const playerId = m.data.author
    if (!macrosByPlayer[playerId]) {
      macrosByPlayer[playerId] = []
    }
    macrosByPlayer[playerId].push(m.id)
  })
  for (const playerId of Object.keys(macrosByPlayer)) {
    const user = game.users.get(playerId)
    // create a folder if one doesn't exist
    if (!game.folders.filter(f => f.type === 'Macro').find(f => f.name === user.name)) {
      const folderName = user.name
      const folderColor = user.data.color
      await Folder.create({
        name: folderName,
        type: 'Macro',
        color: folderColor,
        parent: null
      })
      console.log("New user's macros detected. Creating user folder for " + folderName)
    }
  }
  const macroUpdates = []
  for (const playerId of Object.keys(macrosByPlayer)) {
    const playerUsername = game.users.get(playerId).name
    for (const macroId of macrosByPlayer[playerId]) {
      macroUpdates.push({_id: macroId, folder: game.folders.getName(playerUsername).id})
    }
  }
  await Macro.updateDocuments(macroUpdates)
}