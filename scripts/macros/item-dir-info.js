/*
--- item-dir-info ---
Prints the name, image, and description of an item in the Items Directory to the chat.

Useful for Trigger-Happy, to show players a description of something.

args:
  0 - name or ID of an item in the Items Directory, e.g. "WHv51MteNMtsUpVp" or "Cool Whip"

source:
https://github.com/itamarcu/foundry-macros/blob/master/item-dir-info.js
suggested icon:
https://i.imgur.com/iw4sH39.png
*/

const itemNameOrId = args[0], characterName = args[1]

main()

function main() {
  const item = ItemDirectory.collection.getName(itemNameOrId) || ItemDirectory.collection.get(itemNameOrId)
  if (!item) return ui.notifications.error(`${itemNameOrId} is not an item name or ID that belongs to the item directory!`)

  const someoneFoundText = characterName ? `
    <div style="line-height: 32px"><i>${characterName} found...</i></div>
  ` : ``
  const image = item.data.img === "icons/svg/mystery-man.svg" ? '' : `
  <div style="text-align: center;">
    <img src=${item.data.img} style="width: 128px;"/>
  </div>`
  const content = `
    ${someoneFoundText}
    <h3 style="font-family: 'Press Start',monospace">${item.name}</h3>
    ${image}
    ${item.data.data.description.value}
  `
  ChatMessage.create({content})
}