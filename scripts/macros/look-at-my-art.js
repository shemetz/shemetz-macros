/*
--- look-at-my-art ---
Create a chat message with artwork of selected/targeted token.

source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/look-at-my-art.js
suggested icon:
https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/openmoji/252/framed-picture_1f5bc.png
*/

main()

function main() {
  const tok = canvas.tokens.controlled[0]
  if (tok === undefined) return ui.notifications.warn('Please select a token first.')
  let target = tok.actor || tok
  const content = `
  <img src=${target.data.img} style="width: 280px;"/>
  `
  ChatMessage.create({content})
}
