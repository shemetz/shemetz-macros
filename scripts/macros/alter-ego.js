/*
--- Alter Ego --- (deprecated by Token Image Swap)
Changes a selected token's image to the next one in a circular sequence.
You should edit the OPTIONS constant to use your own URLs.

source:
https://github.com/itamarcu/foundry-macros/blob/master/alter-ego.js
suggested icon: create your own! but I use:
https://cdn.discordapp.com/attachments/695387569650663535/720012953172181022/Untitled.png
 */

const OPTIONS = [
  'https://i.imgur.com/67tUJyc.png', // shent
  'https://i.imgur.com/yXuRcBk.png', // vynnshent
]

main()

function main () {
  const tok = canvas.tokens.controlled[0]
  if (tok === undefined) return ui.notifications.error('No token selected!')
  const currImg = tok.data.img
  const imgIndex = OPTIONS.indexOf(currImg)
  if (imgIndex === -1) return ui.notifications.error('Token image is not one of the URLs in the script!')
  const nextImg = OPTIONS[(imgIndex + 1) % OPTIONS.length]
  tok.document.update({ img: nextImg })
}
