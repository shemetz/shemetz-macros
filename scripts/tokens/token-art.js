export const postTokenArt = (tok) => {
  let target = tok.actor || tok
  const imgSrc = target.document.texture.src
  const content = `
  <a href=${imgSrc} target="_blank">
    <img src=${imgSrc} style="width: 280px;" alt=${target.name}/>
  </a>
  `
  ChatMessage.create({ content, flags: { core: { canPopout: true } },})
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
  const imagePopout = new ImagePopout(target.document.texture.src, {
    title: target.name,
    shareable: true,
    uuid: target.uuid,
  })
  imagePopout.render(true)
  latestImagePopout = imagePopout
}
