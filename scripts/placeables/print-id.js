/**
 * Creates a private chat message with the ID of the currently selected token/tile/wall.
 */
export const printIdOfControlled = () => {
  const controlled = canvas.tokens.controlled[0]
    || canvas.background.controlled[0]
    || canvas.foreground.controlled[0]
    || canvas.walls.controlled[0]
  const id = controlled ? controlled.id : 'no tile/token/wall selected'
  ChatMessage.create({ content: id, whisper: [game.user.id] })
}