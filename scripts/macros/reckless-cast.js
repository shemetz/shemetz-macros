/*
--- reckless-cast ---
A macro created for my character, Shent, who casts random spells as a modified UA invention/chaos wizard.

should be called by a macro per spell level, e.g.:
  game.macros.getName("reckless-cast").renderContent(3, false)


source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/reckless-cast.js
suggested icon:
https://i.imgur.com/iw4sH39.png
and for the reckless casts themselves, use the ones I created here:
https://i.imgur.com/ssJFKo7.png
https://i.imgur.com/2k7gxXL.png
https://i.imgur.com/5hayVzS.png
https://i.imgur.com/0eS74SG.png
https://i.imgur.com/KLacqJ5.png
https://i.imgur.com/sOQZ4Ix.png
*/

const level = args[0]
const isDoublecast = args[1] ? true : false
const dnd5e = CONFIG.DND5E

function i18n (key) {
  return game.i18n.localize(key)
}

const shent = game.actors.getName('Shent')
const spells = shent.data.items.filter((it) => {
  return it.type === 'spell' && it.data.level === level &&
    (level === 0 ? it.data.preparation.mode === 'innate' : it.data.preparation.mode === 'atwill')
  // reckless spells have "at will" to mark them as non-spellbook and hide them when I filter prepared spells.
})
if (spells.length !== 9) {
  ui.notifications.error(level === 0
    ? `Shent should have exactly 9 reckless cantrips! (marked Innate)`
    : `Shent should have exactly 9 reckless spells for level ${level}! (marked At Will)`)
  return
}
// Pay a spell slot
if (!isDoublecast && level > 0) {
  const slotsRemaining = shent.data.data.spells[`spell${level}`].value
  if (slotsRemaining === 0) {
    ui.notifications.error(`Shent is out of level ${level} spell slots!`)
    return
  }
  await shent.update({ [`data.spells.spell${level}.value`]: slotsRemaining - 1 })
}

// Time to roll
let rolls = []
let tooltips = []

// Step 1 - Get all rolls
const numOfRolls = (level === 0 && !isDoublecast) ? 1 : 2
for (let i = 0; i < numOfRolls; i++) {
  rolls.push(await new Roll('1d10').roll())
  tooltips.push(await rolls[i].getTooltip())
}

function getRandomColor () {
  const letters = '3456789ABCD'.split('')
  let color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.round(Math.random() * (letters.length - 1))]
  }
  return color
}

// Step 2 - Setup chatData
const chatData = {
  title: `convolution`,
  formula: '1d10',
  tooltips: tooltips,
  rolls: rolls,
  rollState: null, // can also be "highest" or "lowest"
  rollType: ''
}
let multiroll = await renderTemplate('modules/betterrolls5e/templates/red-multiroll.html', chatData)
let $html = $(multiroll)
for (let i = 0; i < numOfRolls; i++) {
  if (rolls[i].result === '10') {
    $($html.find('.dice-total.dice-row-item')[i]).addClass('success')
  }
}
let text
if (isDoublecast) {
  text = '<b>' + 'DOUBLECAST'.split('').map((letter) => {
    return `<span style="color:${getRandomColor()}">${letter}</span>`
  }).join('') + '</b>'
} else {
  const reckless = '<b>' + 'Reckless'.split('').map((letter) => {
    return `<span style="color:${getRandomColor()}">${letter}</span>`
  }).join('') + '</b>'
  text = reckless + ((level === 0) ? `<b> cantrip!</b>` : `<b> cast at spell level ${level}!</b>`)
}
const drawableHtml = $html[0].outerHTML.replace('convolution', text)

const messageSpeaker = ChatMessage.getSpeaker(shent)
const messageType = CONST.CHAT_MESSAGE_TYPES.OTHER

// Show roll message
ChatMessage.create({
  speaker: messageSpeaker,
  content: drawableHtml,
  type: messageType
})
if (!isDoublecast && numOfRolls > 1 && rolls[0].result === rolls[1].result) {
  if (rolls[0].result !== '10') {
    ChatMessage.create({
      speaker: messageSpeaker,
      content: '<b>Bad luck, kid. You only got one choice.</b>',
      type: messageType
    })
  } else {
    ChatMessage.create({
      speaker: messageSpeaker,
      content: '<b>🍀__🍀</b>',
      type: messageType
    })
  }
  rolls = [rolls[0]]
}

// Show a message for each result
for (const roll of rolls) {
  const rollNum = parseInt(roll.result)
  if (rollNum === 10 && !isDoublecast) {
    const randomId = Math.random().toString(36).substring(2)
    const doublecastHtml = `<div id="${randomId}" data-critical="true">
	 <div><div class="dnd5e chat-card item-card">
	<header class="card-header flexrow red-header">
		<img src="https://cdn.discordapp.com/attachments/695387569650663535/721305098726408272/doublecast.png" title="Doublecast" width="36" height="36"/>
		<h3 class="item-name"><b>Doublecast!</b></h3>
	</header>
</div>`
    await ChatMessage.create({
      speaker: messageSpeaker,
      content: doublecastHtml,
      type: messageType
    })
    $(`#chat-log`).on('click', `#${randomId}`, ev => {
      game.macros.getName('reckless-cast').renderContent(level, true)
    })
  } else if (rollNum === 10 && isDoublecast && rolls.length === 2) {
    await ChatMessage.create({
      speaker: messageSpeaker,
      content: '<b>...ok maybe not a doublecast. rip.</b>',
      type: messageType
    })
  } else if (rollNum === 10 && isDoublecast && rolls.length === 1) {
    await ChatMessage.create({
      speaker: messageSpeaker,
      content: '<i><b>...OK MAYBE I FUCKED UP AND GOT NO SPELLS. MAGIC IS HARD, OKAY?!.</b></i>',
      type: messageType
    })
  } else {
    const spell = spells[rollNum - 1]
    const data = spell.data, ad = shent.data.data
    let range = ((data.range) && (data.range.value || data.range.units)) ? (data.range.value || '') + (((data.range.long) && (data.range.long !== 0) && (data.rangelong != data.range.value)) ? '/' + data.range.long : '') + ' ' + (data.range.units ? i18n(dnd5e.distanceUnits[data.range.units]) : '') : null
    let target = (data.target && data.target.type) ? i18n('Target: ').concat(i18n(dnd5e.targetTypes[data.target.type])) + ((data.target.units) && (data.target.units !== 'none') ? ' (' + data.target.value + ' ' + i18n(dnd5e.distanceUnits[data.target.units]) + ')' : '') : null
    let duration = (data.duration && data.duration.units) ? (data.duration.value ? data.duration.value + ' ' : '') + i18n(dnd5e.timePeriods[data.duration.units]) : null
    const properties = [
      // dnd5e.spellSchools[data.school],
      duration,
      data.components.concentration ? 'Concentration' : null,
      range,
      target
    ].filter((it) => {return it !== null})
    const spellCopy = Object.assign({}, spell)
    spellCopy.name = roll.result + ' - ' + spell.name
    const title = await renderTemplate('modules/betterrolls5e/templates/red-header.html', { item: spellCopy })
    let content = await renderTemplate('modules/betterrolls5e/templates/red-fullroll.html', {
      item: spell,
      actor: shent,
      tokenId: shent.getActiveTokens()[0].id,
      itemId: spell.id,
      isCritical: false,
      title: title,
      templates: [],
      properties: properties
    })
    const randomId = Math.random().toString(36).substring(2)
    // add ID to the image
    const spellCopyName = spellCopy.name.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\'', '&#x27;').replaceAll('"', '&quot;')
    content = content.replace(`title="${spellCopyName}"`, `id="${randomId}" title="${spellCopyName}"`)
    await ChatMessage.create({
      content: content,
      speaker: messageSpeaker,
      type: messageType,
    })
    // putting onclick directly on message doesn't work; see https://discordapp.com/channels/170995199584108546/554492873190670336/698992111688613900
    $(`#chat-log`).on('click', `#${randomId}`, ev => {
      console.log('reckless-cast ~ onClick for ', spell.name)
      BetterRolls.quickRollByName('Shent', spell.name)
    })
  }
}