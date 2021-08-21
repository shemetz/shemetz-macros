export const postTokenArt = (tok) => {
  let target = tok.actor || tok
  const content = `
  <img src=${target.data.img} style="width: 280px;"/>
  `
  ChatMessage.create({ content })
}

// yes this is hacky but I don't know better
let latestImagePopout = null

export const viewTokenArt = (tok) => {
  if (latestImagePopout !== null) {
    latestImagePopout.close()
    latestImagePopout = null
    return
  }
  if (tok === undefined)
    return ui.notifications.warn('Please select/target/hover token first.')
  let target = tok.actor || tok
  const imagePopout = new ImagePopout(target.data.img, {
    title: target.name,
    shareable: true,
    uuid: target.uuid,
  })
  imagePopout.render(true)
  latestImagePopout = imagePopout
}