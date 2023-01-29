const postPf2eRollButton = (rollName, rollType, dc, traits, revealDC) => {
  const saveOrCheck = SAVES_LIST.some(s => s.shortform === rollType)
  const rollHeader = `<h2>${rollName}</h2>`
  const rollTypeText = rollType ? `type:${rollType}` : ''
  const dcText = dc ? `|dc:${dc}` : ''
  const showDcText = revealDC ? '|showDC:all' : game.user.isGM ? '|showDC:gm' : '|showDC:owner'
  const isBasicText = saveOrCheck ? '|basic:true' : ''
  const traitsText = traits ? `|traits:${traits}` : ''
  const rollNameText = rollName ? `|name:${rollName}` : ''
  const message = `
  ${rollHeader}
  @Check[${(
    rollTypeText + dcText + rollNameText + showDcText + isBasicText + traitsText
  )}]
`
  const chatData = {
    user: game.user.id,
    speaker: { user: game.user },
    flags: { core: { canPopout: true } },
    content: message,
  }
  ChatMessage.create(chatData, {})
}

const showPostPf2eRollButtonDialog = () => {
  const allLoresThatPcsHave = game.actors.filter(a => a.hasPlayerOwner).flatMap(a =>
    Object.values(a.system?.skills || {}).filter(s => s.lore)
  )
  const allCheckAndSaveTypes = [FLAT, PERCEPTION, ...SAVES_LIST, ...SKILLS_LIST]
  let template = `
<div>
    <div class="form-group">
        <label>Roll Type:</label>
        <select id="roll-type" >`
  template += `<option value="${FLAT.shortform}">${FLAT.label}</option>`
  template += `<option value="${PERCEPTION.shortform}">${PERCEPTION.label}</option>`
  template += `<option disabled>Saves:</option>`
  for (let option of SAVES_LIST) {
    template += `<option value="${option.shortform}">${option.label}</option>`
  }
  template += `<option disabled>Skills:</option>`
  for (let option of SKILLS_LIST) {
    template += `<option value="${option.shortform}">${option.label}</option>`
  }
  template += `<option disabled>Lore:</option>`
  for (let lore of allLoresThatPcsHave) {
    template += `<option value="${lore.shortform}">📜 ${lore.label}</option>`
  }
  template += `</select>
        Name: 
        <input id="roll-name" style="width: auto" type="text" value='Flat check!' />
        <br/>
        Static DC:
        <input style="width: 24px" id="dc" type="number" />
        <span id="static-dc-options">
          <button style="width: fit-content; line-height: normal">5</button>
          <button style="width: fit-content; line-height: normal">10</button>
          <button style="width: fit-content; line-height: normal">15</button>
          <button style="width: fit-content; line-height: normal">20</button>
          <button style="width: fit-content; line-height: normal">30</button>
          <button style="width: fit-content; line-height: normal">40</button>
        </span>
        <br/>
        Or level-based: 
        <input style="width: 24px;" id="level-based-dc" type="number" />
        <select id="adjustment">
          <option value=-10>(-10) Incredibly Easy</option>
          <option value=-5>(-5) Very Easy</option>
          <option value=-2>(-2) Easy</option>
          <option selected value=0>(+0) No Adjustment</option>
          <option value=2>(+2) Hard</option>
          <option value=5>(+5) Very Hard</option>
          <option value=10>(+10) Incredibly Hard</option>
        </select>
        <br/>
        <label>Reveal DC?</label>
        <input style="vertical-align: middle;" id="reveal-dc" type="checkbox"/>
        <label>Secret?</label>
        <input style="vertical-align: middle;" id="is-secret" type="checkbox"/>
        <input id="traits" type="text" placeholder='Extra Traits? (poison,fire,etc)' />
    </div>
</div>`

  new Dialog({
    title: 'Post quick inline roll button in chat',
    content: template,
    buttons: {
      ok: {
        icon: '<i class="fas fa-check"></i>',
        label: 'OK',
        callback: async (html) => {
          const rollType = html.find('#roll-type')[0].value
          const rollName = html.find('#roll-name')[0].value
          const adjustment = parseInt(html.find('#adjustment')[0].value)
          let dcInput = html.find('#dc')[0].value
          const dc = (dcInput.toLowerCase().startsWith('l'))
            ? LEVEL_BASED_DC[parseInt(dcInput.substring(1)) + 1]
            : parseInt(dcInput)
          const revealDC = html.find('#reveal-dc')[0].checked
          const isSecret = html.find('#is-secret')[0].checked
          const traits = html.find('#traits')[0].value + (isSecret ? ',secret' : '')
          postPf2eRollButton(rollName, rollType, dc + adjustment, traits, revealDC)
        },
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: 'Cancel',
        callback: async () => {
        },
      },
    },
    default: 'ok',
  }).render(true)
  Hooks.once('renderDialog', (dialog, $html) => {
    // roll type, will update roll name to match (if it's automatic)
    $html.find('#roll-type').on('change', (e) => {
      const prevRollName = $html.find('#roll-name').val()
      if (!prevRollName.endsWith('!')) return
      const rollTypeShortform = e.target.value
      const checkOrSaveText = SAVES_LIST.some(s => s.shortform === rollTypeShortform) ? ' save' : ' check'
      let rollTypeCapitalized = rollTypeShortform.capitalize()
      for (const option of allCheckAndSaveTypes) {
        if (option.shortform === rollTypeShortform) {
          // drop emoji part
          rollTypeCapitalized = option.label.substring(option.label.indexOf(' '))
        }
      }
      for (const lore of allLoresThatPcsHave) {
        if (lore.shortform === rollTypeShortform) {
          rollTypeCapitalized = lore.label
        }
      }
      const newName = rollTypeCapitalized + checkOrSaveText + '!'
      $html.find('#roll-name').val(newName)
    })
    // level-based DC, will update DC
    $html.find('#level-based-dc').on('input', (e) => {
      const newLevel = parseInt(e.target.value)
      const newDc = LEVEL_BASED_DC[newLevel + 1]
      $html.find('#dc').val(newDc)
    })
    // static DC buttons, will update DC and tick reveal DC
    $html.find('#static-dc-options > button').on('click', (e) => {
      const newDc = parseInt(e.target.textContent)
      $html.find('#dc').val(newDc)
      $html.find('#reveal-dc').prop('checked', true)
    })
  })
}

const SKILLS_LIST = [
  { label: '🤸 Acrobatics', shortform: 'acrobatics' },
  { label: '🔮 Arcana', shortform: 'arcana' },
  { label: '🤼‍️ Athletics', shortform: 'athletics' },
  { label: '‍️🔨 Crafting', shortform: 'crafting' },
  { label: '🎭 Deception', shortform: 'deception' },
  { label: '🙏 Diplomacy', shortform: 'diplomacy' },
  { label: '😡 Intimidation', shortform: 'intimidation' },
  { label: '🩺 Medicine', shortform: 'medicine' },
  { label: '🌼 Nature', shortform: 'nature' },
  { label: '🧿 Occultism', shortform: 'occultism' },
  { label: '🎶 Performance', shortform: 'performance' },
  { label: '🛐 Religion', shortform: 'religion' },
  { label: '🏫 Society', shortform: 'society' },
  { label: '🤫 Stealth', shortform: 'stealth' },
  { label: '⛺ Survival', shortform: 'survival' },
  { label: '🔓 Thievery', shortform: 'thievery' },
]
const SAVES_LIST = [
  { label: '💪 Fortitude', shortform: 'fortitude' },
  { label: '🦵 Reflex', shortform: 'reflex' },
  { label: '🧠 Will', shortform: 'will' },
]
const PERCEPTION = { label: '👀 Perception', shortform: 'perception' }
const FLAT = { label: '🎲 Flat check', shortform: 'flat' }
// LEVEL_BASED_DC: Level -1 = 13, L0 = 14, L1 = 15, etc
const LEVEL_BASED_DC = [13, 14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 34, 35, 36, 38, 39, 40, 42, 44, 46, 48, 50]


const showAllPf2eActionButtons = () => {
  const message = `` +
    SKILL_ACTIONS.map((sa) => {
        const actionName = sa[0].substring(2).trim()
        const shownName = sa[0].replace(/([A-Z])/g, ' $1').split(' ').map((s) => s.capitalize()).join(' ')
        const glyph = sa[2]
        const variant = sa[3]
        return `<span data-pf2-action='${actionName}' data-pf2-glyph="${glyph}" data-pf2-show-dc='' data-pf2-variant='${variant}' >
${shownName} (${sa[1].capitalize()})
</span>
<br>`
      },
    ).join('')
  const chatData = {
    user: game.user.id,
    speaker: { alias: 'Common Skill Actions' },
    content: message,
    flags: { core: { canPopout: true } },
    whisper: [game.user.id],
  }
  ChatMessage.create(chatData, {})
}

// glyphs are: A D T F R, or 1 2 3 4 5, for: one action, two/double, three/triple, free action, reaction
const SKILL_ACTIONS = [
  ['👀 seek', 'perception', '1'],
  ['👮 senseMotive', 'perception', '1'],
  ['🤸 tumbleThrough', 'acrobatics', '1'],
  ['🏂 balance', 'acrobatics', '1'],
  ['🦅 maneuverInFlight', 'acrobatics', '1'],
  ['🐀 squeeze', 'acrobatics', '3'],
  ['🧗 climb', 'athletics', '1'],
  ['🤺 disarm', 'athletics', '1'],
  ['🚪 forceOpen', 'athletics', '1'],
  ['✊ grapple', 'athletics', '1'],
  ['✋ shove', 'athletics', '1'],
  ['🦶 trip', 'athletics', '1'],
  ['🤾 highJump', 'athletics', '2'],
  ['🦘 longJump', 'athletics', '2'],
  ['🏊 swim', 'athletics', '1'],
  ['👉 createADiversion', 'deception', '1', 'gesture'],
  ['🤭 createADiversion', 'deception', '1', 'distracting-words'],
  ['😜 feint', 'deception', '1'],
  ['🤥 lie', 'deception', '3'],
  ['🎭 impersonate', 'deception', '3'],
  ['😎 bonMot', 'diplomacy', '1'],
  ['🥺 request', 'diplomacy', '1'],
  ['🙋 makeAnImpression', 'diplomacy', '3'],
  ['🕵️ gatherInformation', 'diplomacy', '3'],
  ['😡 demoralize', 'intimidation', '1'],
  ['📢 coerce', 'intimidation', '3'],
  ['🙈 hide', 'stealth', '1'],
  ['🤫 sneak', 'stealth', '1'],
  ['🔓 pickALock', 'thievery', '2'],
]

export { postPf2eRollButton, showPostPf2eRollButtonDialog, showAllPf2eActionButtons }