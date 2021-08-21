/*
--- door-toggle ---
Will open or close one door (wall).
First argument is door ID, second argument is "open" or "close" or "toggle".

source:
https://github.com/itamarcu/foundry-macros/blob/master/door-toggle.js
suggested icon:
https://i.imgur.com/iw4sH39.png
 */

const doorId = args[0]
const command = args[1]
const wall = canvas.walls.get(doorId)
if (wall === undefined) return ui.notifications.error(`bad door ID: ${doorId}`)

let newDoorState
if (command === 'open') newDoorState = 1
if (command === 'close') newDoorState = 0
if (command === 'toggle') newDoorState = 1 - wall.data.ds
if (newDoorState === undefined) return ui.notifications.error(`bad command: ${command}`)

wall.document.update({
  ds: newDoorState,
})