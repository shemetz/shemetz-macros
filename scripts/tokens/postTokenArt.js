export const postTokenArt = (token) => {
  let target = token.actor || token
  const content = `
  <img src=${target.data.img} style="width: 280px;"/>
  `
  ChatMessage.create({ content })
}
