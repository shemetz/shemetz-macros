export const changeImageOfNextItemChatMessage = (newImg) => {
  editMyNextChatMessage(async (chatMessage, data) => {
    const content = data.content.replace(
      /<img src="[^"]*" title=/,
      `<img src="${newImg}" title=`,
    )
    if (data.content !== content) {
      data.content = content
      await chatMessage.update({ content })
    }
  })
}

export const renameNextChatMessageItemName = (newName) => {
  editMyNextChatMessage(async (chatMessage, data) => {
    const content = data.content.replace(
      /<h3 class="item-name">[^<]*<\/h3>/,
      `<h3 class="item-name">${newName}</h3>`,
    )
    if (data.content !== content) {
      data.content = content
      await chatMessage.update({ content })
    } else {
      // v10+
      data.flavor = newName
      await chatMessage.update({ flavor: newName })
    }
  })
}

export const editMyNextChatMessage = (callback) => {
  console.debug(`preparing to edit next chat message...`)
  Hooks.once('preCreateChatMessage', (chatMessage, data, options, userId) => {
    if (userId !== game.userId) {
      ui.notifications.info(
        `canceling next message edit because a message was created by a different user`)
      return true
    }

    console.debug(`now editing message in macro before sending it...`)
    callback(chatMessage, data, options, userId)
    console.debug(`done editing message in macro`)
    return true
  })
}

