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
  const chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker(),
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

export const italicize = (argsText) => {
  return `<i>${convertArgsTextToOneString(argsText)}</i>`
}

export const bold = (argsText) => {
  return `<b>${convertArgsTextToOneString(argsText)}</b>`
}

/**
 * Converts text from crit tables to make the first sentence bold (should include a period after the first sentence!)
 */
export const makeTableResultBold = (text) => {
  const periodIndex = text.search(/[.!?]/g)
  if (periodIndex === -1)
    return '<b>(!)</b>' + text
  const titleText = text.substring(0, periodIndex + 1)
  const restOfText = text.substring(periodIndex + 1)
  return `<b>${titleText}</b>${restOfText}`
}