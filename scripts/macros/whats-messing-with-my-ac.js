/*
--- What's Messing with my AC? ---
Shows a message that details all items that affect AC on the character (including dynamic effects)

source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/whats-messing-with-my-ac.js
suggested icon:
https://i.imgur.com/ec2xL28.png
*/

main()

function main() {
  const tok = canvas.tokens.controlled[0]
  if (!tok) return ui.notifications.error('You must select a token!')
  const affectingItems = tok.actor.items.filter(it =>
    it.labels.armor
    || it.data.flags.dynamiceffects?.effects
      .some(ef => ef.modSpecKey.includes('ac'))
  )
    .map(it => it.name).join(', ')
  const message = `${tok.name}'s AC is potentially affected by: ${affectingItems}`
  console.log(message)
  ui.notifications.info(message)
}
