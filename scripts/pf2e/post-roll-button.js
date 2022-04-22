import { chat } from '../utils/message-utils.js'

// LEVEL_BASED_DC: Level 0 = 10, L1 = 15, etc
const LEVEL_BASED_DC = [10, 15, 16, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 34, 35, 36, 38, 39, 40, 42, 44, 46, 48, 50]

export const postPf2eRollButton = (rollName, rollType, dc, traits, revealDC) => {
  const saveOrCheck = SAVES_LIST.includes(rollType) ? 'Save' : 'Check'
  const rollButtonText = `${rollType.capitalize()} ${saveOrCheck}`
  const rollHeader = `<h2>${rollName ? rollName : (rollType.capitalize() + '!')}</h2>`
  const message = `
  ${rollHeader}
  <span 
    data-pf2-check="${rollType}" 
    data-pf2-traits="${traits}" 
    data-pf2-label="${rollName}" 
    data-pf2-dc="${dc}"
    data-pf2-show-dc="${revealDC ? 'all' : 'gm'}"
    data-pf2-adjustment=""
    >
<!--    note: 'adjustment' only matters if dc is @self.level -->
      ${rollButtonText}
  </span>
`
  chat(message)
}

export const showPostPf2eRollButtonDialog = () => {
  const allOptions = [FLAT, PERCEPTION, ...SAVES_LIST, ...SKILLS_LIST]
  let template = `
<div>
    <div class="form-group">
        <label>Roll Type</label>
        <select id="rollType" >`
  for (let option of allOptions) {
    template += `<option value="${option}">${option}</option>`
  }
  template += `</select>
        <input id="rollName" type="text" placeholder='Name?' />
        <input style="width: 30px;" id="dc" type="text" placeholder='DC? (e.g. 18, L3)' />
        <label>Reveal DC?</label>
        <input style="vertical-align: middle;" id="revealDC" type="checkbox"/>
        <label>Blind?</label>
        <input style="vertical-align: middle;" id="isBlind" type="checkbox"/>
        <select id="adjustment">
          <option value=-10>(-10) Incredibly Easy</option>
          <option value=-5>(-5) Very Easy</option>
          <option value=-2>(-2) Easy</option>
          <option selected value=0>No Adjustment</option>
          <option value=2>(+2) Hard</option>
          <option value=5>(+5) Very Hard</option>
          <option value=10>(+10) Incredibly Hard</option>
        </select>
        <input id="traits" type="text" placeholder='Extra Traits? (poison,fire,etc)' />
    </div>
</div>`

  new Dialog({
    title: 'Post Roll Button',
    content: template,
    buttons: {
      ok: {
        icon: '<i class="fas fa-check"></i>',
        label: 'OK',
        callback: async (html) => {
          const rollName = html.find('#rollName')[0].value
          const rollType = html.find('#rollType')[0].value.substring(2).trim()
          const adjustment = parseInt(html.find('#adjustment')[0].value)
          let dcInput = html.find('#dc')[0].value
          const dc = (dcInput.toLowerCase().startsWith('l'))
            ? LEVEL_BASED_DC[parseInt(dcInput.substring(1))]
            : parseInt(dcInput)
          const revealDC = html.find('#revealDC')[0].checked
          const isBlind = html.find('#isBlind')[0].checked
          const traits = html.find('#traits')[0].value + (isBlind ? ',secret' : '')
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
}

export const showAllPf2eActionButtons = () => {
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

const SKILLS_LIST = [
  '🤸 acrobatics',
  '🔮 arcana',
  '🤼‍️ athletics',
  '‍️🔨 crafting',
  '🎭 deception',
  '🙏 diplomacy',
  '😡 intimidation',
  '🩺 medicine',
  '🌼 nature',
  '🧿 occultism',
  '🎶 performance',
  '🛐 religion',
  '🏫 society',
  '🤫 stealth',
  '⛺ survival',
  '🔓 thievery',
]
const SAVES_LIST = [
  '💪 fortitude',
  '🦵 reflex',
  '🧠 will',
]
const PERCEPTION = '👀 perception'
const FLAT = '🎲 flat'
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
