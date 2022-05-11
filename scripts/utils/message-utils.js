/**
 --- error ---
 Display an error message in the chat and console log. This is just a convenience method.
 */
export const error = (errorMessage) => {
  console.warn(`Macro error: ${errorMessage}`)
  const chatData = {
    user: game.user.id,
    speaker: {
      alias: 'ShemetzMacros.error'
    },
    content: `Error: ${errorMessage}`,
    whisper: [game.user.id]
  }
  ChatMessage.create(chatData, {})
}

export const chat = (message) => {
  const canPopout = message.includes('<') || (typeof message !== 'string')
  const chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker(),
    flags: { core: { canPopout } },
    content: message,
  }
  ChatMessage.create(chatData, {})
}

const convertArgsTextToOneString = (argsText) => {
  return argsText.join(' ')
    .replaceAll(' ,', ',')
    .replaceAll(' !', '!')
    .replaceAll(' )', ')')
    .replaceAll('( ', '(')
    .replaceAll(' *', '*')
    .replaceAll('* ', '*')
}

/**
 * useful to decode TriggerHappy arguments
 */
export const htmlDecode = (str) => {
  const doc = new DOMParser().parseFromString(str, 'text/html')
  return doc.documentElement.textContent
}

export const italicize = (argsText) => {
  return `<i>${convertArgsTextToOneString(argsText)}</i>`
}

export const bold = (argsText) => {
  return `<b>${convertArgsTextToOneString(argsText)}</b>`
}
