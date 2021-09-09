import { chat } from '../utils/message-utils.js'

export const postPf2eRollButton = (rollName, rollType, dc, revealDC) => {
  const saveOrCheck = SAVES_LIST.includes(rollType) ? 'Save' : 'Check'
  const rollButtonText = `${rollType.capitalize()} ${saveOrCheck}`
  const rollHeader = `<h2>${rollName ? rollName : (rollType.capitalize() + '!')}</h2>`
  const message = `
  ${rollHeader}
  <span 
    data-pf2-check="${rollType}" 
    data-pf2-traits="" 
    data-pf2-label="" 
    data-pf2-dc="${dc}"
    data-pf2-show-dc="${revealDC ? 'all' : 'gm'}">
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
        <select id="rollType">`
  for (let option of allOptions) {
    template += `<option value="${option}">${option}</option>`
  }
  template += `</select>
        <input id="rollName" type="text" placeholder='Name?' />
        <input style="width: 30px;" id="dc" type="number" placeholder='dc' />
        <label>Reveal DC?</label>
        <input style="vertical-align: middle;" id="revealDC" type="checkbox"/>
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
          const rollType = html.find('#rollType')[0].value
          const dc = html.find('#dc')[0].value
          const revealDC = html.find('#revealDC')[0].checked
          postPf2eRollButton(rollName, rollType, dc, revealDC)
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
      const actionName = sa[0]
      const shownName = sa[0].replace(/([A-Z])/g, ' $1').capitalize()
      const glyph = sa[2]
      return `<span data-pf2-action='${actionName}' data-pf2-glyph="${glyph}" data-pf2-show-dc='' >
${shownName} (${sa[1].capitalize()})
</span>
<br>`
      },
    ).join('')
  const chatData = {
    user: game.user.id,
    speaker: { alias: 'Common Skill Actions' },
    content: message,
    whisper: [game.user.id],
  }
  ChatMessage.create(chatData, {})
}

const SKILLS_LIST = [
  'acrobatics',
  'arcana',
  'athletics',
  'crafting',
  'deception',
  'diplomacy',
  'intimidation',
  'medicine',
  'nature',
  'occultism',
  'performance',
  'religion',
  'society',
  'stealth',
  'survival',
  'thievery',
]
const SAVES_LIST = [
  'fortitude',
  'reflex',
  'will',
]
const PERCEPTION = 'perception'
const FLAT = 'flat'
// glyphs are: A D T F R, or 1 2 3 4 5, for: one action, two/double, three/triple, free action, reaction
const SKILL_ACTIONS = [
  ['seek', 'perception', '1'],
  ['senseMotive', 'perception', '1'],
  ['balance', 'acrobatics', '1'],
  ['maneuverInFlight', 'acrobatics', '1'],
  ['squeeze', 'acrobatics', '3'],
  ['tumbleThrough', 'acrobatics', '1'],
  ['climb', 'athletics', '1'],
  ['disarm', 'athletics', '1'],
  ['forceOpen', 'athletics', '1'],
  ['grapple', 'athletics', '1'],
  ['highJump', 'athletics', '2'],
  ['longJump', 'athletics', '2'],
  ['shove', 'athletics', '1'],
  ['swim', 'athletics', '1'],
  ['trip', 'athletics', '1'],
  ['createADiversion', 'deception', '1'],
  ['feint', 'deception', '1'],
  ['impersonate', 'deception', '3'],
  ['lie', 'deception', '3'],
  ['bonMot', 'diplomacy', '1'],
  ['gatherInformation', 'diplomacy', '3'],
  ['makeAnImpression', 'diplomacy', '3'],
  ['request', 'diplomacy', '1'],
  ['coerce', 'intimidation', '3'],
  ['demoralize', 'intimidation', '1'],
  ['hide', 'stealth', '1'],
  ['sneak', 'stealth', '1'],
  ['pickALock', 'thievery', '2'],
]