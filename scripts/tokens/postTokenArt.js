export const postTokenArt = () => {
  const tok = canvas.tokens.controlled[0]
  if (tok === undefined) return ui.notifications.warn('Please select a token before activating postTokenArt macro.')
  let target = tok.actor || tok
  const content = `
  <img src=${target.data.img} style="width: 280px;"/>
  `
  ChatMessage.create({ content })
}
