/*
--- Show Artwork ---
Show artwork of selected/targeted token to yourself (GM can show to all players).

source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/show-artwork.js
suggested icon:
https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/openmoji/252/framed-picture_1f5bc.png
*/

main()

function main() {
  const latestImagePopout = game.user.apps['show-artwork'] // yes this is hacky but I don't know better
  if (latestImagePopout !== undefined) latestImagePopout.close()
  const tok = canvas.tokens.controlled[0]
    || canvas.tokens.placeables.find(it => it.mouseInteractionManager.state === 1)
  if (tok === undefined)
    return ui.notifications.warn('Please select/hover token first.')
  let target = tok.actor || tok
  const imagePopout = new ImagePopout(target.data.img, {
    title: target.name,
    shareable: true,
    uuid: target.uuid,
  })
  imagePopout.render(true)
  game.user.apps['show-artwork'] = imagePopout
}
