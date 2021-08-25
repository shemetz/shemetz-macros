/**
 * Creates a private chat message with the ID of the currently selected token/tile/wall.
 */
export const printIdOfControlled = (onlyToConsole) => {
  const messages = []
    .concat(...canvas.tokens.controlled.map(tok => `token ${tok.id} (${tok.name})`))
    .concat(...canvas.background.controlled.map(tile => `tile ${tile.id} (${tile.data.img})`))
    .concat(...canvas.foreground.controlled.map(tile => `tile ${tile.id} (${tile.data.img})`))
    .concat(...canvas.walls.controlled.map(wall => `wall ${wall.id}`))
  let message = 'Printing all controlled things:\n' + messages.join('\n')
  if (messages.length === 0)
    message = `You should select tokens/tiles/walls before using this macro!`
  console.info(message)
  if (!onlyToConsole)
    ChatMessage.create({ content: message, whisper: [game.user.id] })
}