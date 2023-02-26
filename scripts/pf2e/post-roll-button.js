// To run this as a standalone macro, make some changes at the bottom of the file (scroll down to see them).
// (this file was originally made for a personal module, so the function is exported)
//
// source: https://github.com/shemetz/shemetz-macros/tree/master/scripts/pf2e/post-roll-button.js

const showPostPf2eRollButtonDialog = () => {
  const allLoresThatPcsHave = game.actors.filter(a => a.hasPlayerOwner).flatMap(a =>
    Object.values(a.system?.skills || {}).filter(s => s.lore),
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
  for (const option of SAVES_LIST) {
    template += `<option value="${option.shortform}">${option.label}</option>`
  }
  template += `<option disabled>Skills:</option>`
  for (const option of SKILLS_LIST) {
    template += `<option value="${option.shortform}">${option.label}</option>`
  }
  template += `<option disabled>Lore:</option>`
  for (const lore of allLoresThatPcsHave) {
    template += `<option value="${lore.shortform}">📖 ${lore.label}</option>`
  }
  template += `</select>
        <label>Action?:</label>
        <select id="roll-action" disabled>`
  template += `<option value="no-action" data-idx="-1">(No skill action selected)</option>`
  for (const sa of SKILL_ACTIONS) {
    template += `<option 
      value="${sa.shortform}" 
      data-idx="${sa.idx}"
      >${sa.label}</option>`
  }
  template += `</select>
        <br/>
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
          const rollSkillActionStr = html.find('#roll-action')[0].value
          const rollSkillActionIdx = parseInt(html.find('#roll-action')[0].selectedOptions[0].dataset['idx'])
          const rollSkillAction = rollSkillActionStr === 'no-action' ? undefined : SKILL_ACTIONS[rollSkillActionIdx]
          const rollName = html.find('#roll-name')[0].value
          const adjustment = parseInt(html.find('#adjustment')[0].value)
          let dcInput = html.find('#dc')[0].value
          const dc = (dcInput.toLowerCase().startsWith('l'))
            ? LEVEL_BASED_DC[parseInt(dcInput.substring(1)) + 1]
            : parseInt(dcInput)
          const revealDC = html.find('#reveal-dc')[0].checked
          const isSecret = html.find('#is-secret')[0].checked
          const traits = html.find('#traits')[0].value + (isSecret ? ',secret' : '')
          postPf2eRollButton(rollName, rollType, rollSkillAction, dc + adjustment, traits,
            revealDC)
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
  }, { width: 450 }).render(true)

  Hooks.once('renderDialog', (dialog, $html) => {
    // roll type, will update roll actions
    $html.find('#roll-type').on('change', (e) => {
      const rollTypeShortform = e.target.value
      $html.find('#roll-action').prop('hidden', true)
      $html.find('#roll-action').prop('disabled', true)
      for (const checkOrSaveOrLore of [...allCheckAndSaveTypes, ...allLoresThatPcsHave]) {
        if (checkOrSaveOrLore.shortform === rollTypeShortform) {
          // hide unrelated roll actions
          $html.find('#roll-action').prop('hidden', false)
          $html.find('#roll-action option').each((i, e) => {
            if (e.value === 'no-action') {
              return  // always enabled
            }
            const skillAction = SKILL_ACTIONS.find(sa => sa.idx === e.dataset['idx'])
            if (skillAction.skill === checkOrSaveOrLore.shortform) {
              $html.find('#roll-action').prop('disabled', false)
              $(e).prop('hidden', false)
            } else {
              $(e).prop('hidden', true)
            }
            // if lore, do enable "recall knowledge" skill action
            if (skillAction.skill === 'SPECIAL_LORE') {
              const isLoreSelected = allLoresThatPcsHave.some(l => l.shortform === rollTypeShortform)
              if (isLoreSelected) {
                $html.find('#roll-action').prop('disabled', false)
                $(e).prop('hidden', false)
              }
            }
          })
          // deselect current skill action
          $html.find('#roll-action').val('no-action')
          break
        }
      }
    })
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
          break
        }
      }
      for (const lore of allLoresThatPcsHave) {
        if (lore.shortform === rollTypeShortform) {
          rollTypeCapitalized = lore.label
          break
        }
      }
      const newName = rollTypeCapitalized + checkOrSaveText + '!'
      $html.find('#roll-name').val(newName)
    })
    // roll action, will update roll name to match (if it's automatic)
    $html.find('#roll-action').on('change', (e) => {
      const prevRollName = $html.find('#roll-name').val()
      if (!prevRollName.endsWith('!')) return
      const selectedSkillActionElement = $html.find('#roll-action')[0].selectedOptions[0]
      if (selectedSkillActionElement.value !== 'no-action') {
        const selectedSkillAction = SKILL_ACTIONS.find(sa => sa.idx === selectedSkillActionElement.dataset['idx'])
        // drop emoji part
        const actionCapitalized = selectedSkillAction.label.substring(selectedSkillAction.label.indexOf(' '))
        const newName = actionCapitalized + '!'
        $html.find('#roll-name').val(newName)
      }
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

const postPf2eRollButton = (rollName, rollType, rollSkillAction, dc, traits, revealDC) => {
  if (rollSkillAction?.shortform === 'SPECIAL_RECALL_KNOWLEDGE') {
    rollSkillAction = undefined
    traits = traits + (traits ? ',' : '') + 'action:recall-knowledge'
  }
  const saveOrCheck = SAVES_LIST.some(s => s.shortform === rollType)
  const rollHeader = `<h2>${rollName}</h2>`
  const rollTypeText = rollType ? `type:${rollType}` : ''
  const dcText = dc ? `|dc:${dc}` : ''
  const revealDcValue = revealDC ? 'all' : game.user.isGM ? 'gm' : 'owner'
  const showDcText = `|showDC:${revealDcValue}`
  const isBasicText = saveOrCheck ? '|basic:true' : ''
  const traitsText = traits ? `|traits:${traits}` : ''
  const rollNameText = rollName ? `|name:${rollName}` : ''

  let message
  if (!rollSkillAction) {
    message = `
  ${rollHeader}
  @Check[${(
      rollTypeText + dcText + rollNameText + showDcText + isBasicText + traitsText
    )}]
`
  } else {
    // for skill actions I had to use the older version, with <span>
    message = `
    ${rollHeader}
  <span 
  data-pf2-skill='${rollType}'
  data-pf2-action='${rollSkillAction.shortform}'
  ${rollSkillAction.variant ? `data-pf2-variant='${rollSkillAction.variant}'` : ``}
  ${rollSkillAction.actionCountGlyph ? `data-pf2-glyph='${rollSkillAction.actionCountGlyph}'` : ``}
  data-pf2-show-dc='${revealDcValue}'
  data-pf2-traits='${traits}'
  ${dc ? `data-pf2-dc='${dc}'` : ``}
  >
  ${rollName} (${rollType.capitalize()})
  </span>
  `
  }
  const chatData = {
    user: game.user.id,
    speaker: { user: game.user },
    flags: { core: { canPopout: true } },
    content: message,
  }
  ChatMessage.create(chatData, {})
}

const showAllPf2eActionButtons = () => {
  const message = `` +
    SKILL_ACTIONS.map((sa) => {
        const { label, shortform, skill, actionCountGlyph, variant } = sa
        const actionName = shortform
        // convert camelCase to Capitalized Words
        const shownName = label.replace(/([A-Z])/g, ' $1').
          split(' ').
          map((s) => ['a', 'in'].includes(s) ? s : s.capitalize()).
          join(' ')
        return `<span data-pf2-action='${actionName}' data-pf2-glyph="${actionCountGlyph}" data-pf2-show-dc='' data-pf2-variant='${variant}' >
${shownName} (${skill.capitalize()})
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
  { label: '🎩 Performance', shortform: 'performance' },
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
// glyphs are: A D T F R, or 1 2 3 4 5, for: one action, two/double, three/triple, free action, reaction.  '' is Exploration
const SKILL_ACTIONS = [
  { label: '👀 Seek', shortform: 'seek', skill: 'perception', actionCountGlyph: '1' },
  { label: '👮 Sense Motive', shortform: 'senseMotive', skill: 'perception', actionCountGlyph: '1' },
  { label: '🤸 Tumble Through', shortform: 'tumbleThrough', skill: 'acrobatics', actionCountGlyph: '1' },
  { label: '🏂 Balance', shortform: 'balance', skill: 'acrobatics', actionCountGlyph: '1' },
  { label: '🦅 Maneuver in Flight', shortform: 'maneuverInFlight', skill: 'acrobatics', actionCountGlyph: '1' },
  { label: '🐀 Squeeze', shortform: 'squeeze', skill: 'acrobatics', actionCountGlyph: '' },
  { label: '📜 Decipher Writing', shortform: 'decipherWriting', skill: 'arcana', actionCountGlyph: '' },
  { label: '🧠 Recall Knowledge', shortform: 'SPECIAL_RECALL_KNOWLEDGE', skill: 'arcana', actionCountGlyph: '1' },
  { label: '🧗 Climb', shortform: 'climb', skill: 'athletics', actionCountGlyph: '1' },
  { label: '🤺 Disarm', shortform: 'disarm', skill: 'athletics', actionCountGlyph: '1' },
  { label: '🚪 Force Open', shortform: 'forceOpen', skill: 'athletics', actionCountGlyph: '1' },
  { label: '✊ Grapple', shortform: 'grapple', skill: 'athletics', actionCountGlyph: '1' },
  { label: '🫱 Shove', shortform: 'shove', skill: 'athletics', actionCountGlyph: '1' },
  { label: '🦶 Trip', shortform: 'trip', skill: 'athletics', actionCountGlyph: '1' },
  { label: '🤾 High Jump', shortform: 'highJump', skill: 'athletics', actionCountGlyph: '2' },
  { label: '🦘 Long Jump', shortform: 'longJump', skill: 'athletics', actionCountGlyph: '2' },
  { label: '🏊 Swim', shortform: 'swim', skill: 'athletics', actionCountGlyph: '1' },
  { label: '🧠 Recall Knowledge', shortform: 'SPECIAL_RECALL_KNOWLEDGE', skill: 'crafting', actionCountGlyph: '1' },
  {
    label: '👉 Create a Diversion (S)',
    shortform: 'createADiversion',
    skill: 'deception',
    actionCountGlyph: '1',
    variant: 'gesture',
  },
  {
    label: '🤭 Create a Diversion (V)',
    shortform: 'createADiversion',
    skill: 'deception',
    actionCountGlyph: '1',
    variant: 'distracting-words',
  },
  { label: '😜 Feint', shortform: 'feint', skill: 'deception', actionCountGlyph: '1' },
  { label: '🤥 Lie', shortform: 'lie', skill: 'deception', actionCountGlyph: '3' },
  { label: '💄 Impersonate', shortform: 'impersonate', skill: 'deception', actionCountGlyph: '' },
  { label: '😎 Bon Mot', shortform: 'bonMot', skill: 'diplomacy', actionCountGlyph: '1' },
  { label: '🥺 Request', shortform: 'request', skill: 'diplomacy', actionCountGlyph: '1' },
  { label: '🙋 Make an Impression', shortform: 'makeAnImpression', skill: 'diplomacy', actionCountGlyph: '' },
  { label: '🕵️ Gather Information', shortform: 'gatherInformation', skill: 'diplomacy', actionCountGlyph: '' },
  { label: '😡 Demoralize', shortform: 'demoralize', skill: 'intimidation', actionCountGlyph: '1' },
  { label: '📢 Coerce', shortform: 'coerce', skill: 'intimidation', actionCountGlyph: '' },
  { label: '🧠 Recall Knowledge', shortform: 'SPECIAL_RECALL_KNOWLEDGE', skill: 'medicine', actionCountGlyph: '1' },
  { label: '🧠 Recall Knowledge', shortform: 'SPECIAL_RECALL_KNOWLEDGE', skill: 'nature', actionCountGlyph: '1' },
  { label: '📜 Decipher Writing', shortform: 'decipherWriting', skill: 'occultism', actionCountGlyph: '' },
  { label: '🧠 Recall Knowledge', shortform: 'SPECIAL_RECALL_KNOWLEDGE', skill: 'occultism', actionCountGlyph: '1' },
  { label: '📜 Decipher Writing', shortform: 'decipherWriting', skill: 'religion', actionCountGlyph: '' },
  { label: '🧠 Recall Knowledge', shortform: 'SPECIAL_RECALL_KNOWLEDGE', skill: 'religion', actionCountGlyph: '1' },
  { label: '📜 Decipher Writing', shortform: 'decipherWriting', skill: 'society', actionCountGlyph: '' },
  { label: '🧠 Recall Knowledge', shortform: 'SPECIAL_RECALL_KNOWLEDGE', skill: 'society', actionCountGlyph: '1' },
  { label: '😋 Subsist', shortform: 'subsist', skill: 'society', actionCountGlyph: '' },
  { label: '🎁 Conceal an Object', shortform: 'concealAnObject', skill: 'stealth', actionCountGlyph: '1' },
  { label: '🥷 Hide', shortform: 'hide', skill: 'stealth', actionCountGlyph: '1' },
  { label: '👟 Sneak', shortform: 'sneak', skill: 'stealth', actionCountGlyph: '1' },
  { label: '😋 Subsist', shortform: 'subsist', skill: 'survival', actionCountGlyph: '' },
  { label: '🐾 Track', shortform: 'track', skill: 'survival', actionCountGlyph: '' },
  { label: '🛠️ Disable Device', shortform: 'disableDevice', skill: 'thievery', actionCountGlyph: '2' },
  { label: '🫳 Palm an Object', shortform: 'palmAnObject', skill: 'thievery', actionCountGlyph: '1' },
  { label: '💸 Steal', shortform: 'steal', skill: 'thievery', actionCountGlyph: '1' },
  { label: '🔓 Pick a Lock', shortform: 'pickALock', skill: 'thievery', actionCountGlyph: '2' },
  { label: '🐶 Command an Animal', shortform: 'commandAnAnimal', skill: 'nature', actionCountGlyph: '1' },
  { label: '🎭 Perform - acting', shortform: 'perform', skill: 'performance', actionCountGlyph: '1', variant: 'acting' },
  { label: '🤣 Perform - comedy', shortform: 'perform', skill: 'performance', actionCountGlyph: '1', variant: 'comedy' },
  { label: '💃 Perform - dance', shortform: 'perform', skill: 'performance', actionCountGlyph: '1', variant: 'dance' },
  {
    label: '🗣️ Perform - oratory',
    shortform: 'perform',
    skill: 'performance',
    actionCountGlyph: '1',
    variant: 'oratory',
  },
  {
    label: '🎶 Perform - singing',
    shortform: 'perform',
    skill: 'performance',
    actionCountGlyph: '1',
    variant: 'singing',
  },
  {
    label: '🎹 Perform - keyboards',
    shortform: 'perform',
    skill: 'performance',
    actionCountGlyph: '1',
    variant: 'keyboards',
  },
  {
    label: '🥁 Perform - percussion',
    shortform: 'perform',
    skill: 'performance',
    actionCountGlyph: '1',
    variant: 'percussion',
  },
  {
    label: '🪕 Perform - strings',
    shortform: 'perform',
    skill: 'performance',
    actionCountGlyph: '1',
    variant: 'strings',
  },
  { label: '🎺 Perform - winds', shortform: 'perform', skill: 'performance', actionCountGlyph: '1', variant: 'winds' },
]
for (const i in SKILL_ACTIONS) {
  SKILL_ACTIONS[i].idx = i
}
// LEVEL_BASED_DC: Level -1 = 13, L0 = 14, L1 = 15, etc
const LEVEL_BASED_DC = [
  13,
  14,
  15,
  16,
  18,
  19,
  20,
  22,
  23,
  24,
  26,
  27,
  28,
  30,
  31,
  32,
  34,
  35,
  36,
  38,
  39,
  40,
  42,
  44,
  46,
  48,
  50,
]

// to run this as a standalone macro, delete the following line of code:
export { postPf2eRollButton, showPostPf2eRollButtonDialog, showAllPf2eActionButtons }
// and then uncomment the following line of code (remove the "//" at the start):
// showPostPf2eRollButtonDialog()