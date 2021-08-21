/*
--- print-id ---
Creates a private chat message with the ID of the currently selected token/tile/wall.


source:
https://github.com/itamarcu/foundry-macros/blob/master/print-id.js
suggested icon:
https://i.imgur.com/iw4sH39.png
*/

const controlled = canvas.tokens.controlled[0]
  || canvas.background.controlled[0]
  || canvas.foreground.controlled[0]
  || canvas.walls.controlled[0]
const id = controlled ? controlled.id : 'no tile/token/wall selected'
ChatMessage.create({content: id, whisper: [game.user.id]})