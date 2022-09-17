export const hookEndTurnButtonInChatBar = () => {
  game.settings.register('shemetz-macros', 'enable-end-turn-button-in-chat', {
    name: `Enable "End Turn" button in chat bar`,
    hint: `The button will show up only for the current player (or GM if NPC)`,
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  })
  Hooks.on('renderSidebarTab', onRenderSidebarTab)
  Hooks.once('ready', () => {onUpdateCombat()})
  Hooks.on('updateCombat', onUpdateCombat)
}

/**
 * Highlight the "End Turn" button for 1 second, for the current player
 */
export const onSocketMessageEndTurnButton = () => {
  if (!shouldShowEndTurnButton()) return
  highlightEndTurnButton(true)
  setTimeout(() => {
    highlightEndTurnButton(false)
  }, 1000)
}

const onRenderSidebarTab = (app, html) => {
  // Exit early if necessary
  if (!game.settings.get('shemetz-macros', 'enable-end-turn-button-in-chat')) return
  if (app.tabName !== 'chat') return // is render function for something else

  const $chatForm = html.find('#chat-form')
  let $content = $(END_TURN_TEMPLATE)
  $chatForm.after($content)
  const endTurnButton = $('.shm-end-turn')
  endTurnButton.on('click', onPressButton)
  onUpdateCombat()
}

const onPressButton = async (event) => {
  const ctrlPressed = event.ctrlKey || event.metaKey
  if (!ctrlPressed) {
    event.preventDefault()
    return game.combat.nextTurn()
  } else {
    // ctrl+click to remind current player to end their turn
    event.preventDefault()
    await emitMessageToHighlightForCurrentPlayer()
  }
}

const shouldShowEndTurnButton = () => {
  if (!game.ready) return false // not fully loaded yet
  const currentCombatantId = game.combat?.current?.tokenId
  if (!currentCombatantId) return false // no combat
  const currentActor = canvas.tokens.get(currentCombatantId)?.actor
  if (!currentActor && !game.user.isGM) return false
  const hasPlayerOwner = currentActor.hasPlayerOwner
  if (hasPlayerOwner && game.user.isGM) return true  // gm during player turn - will be shown but in parentheses!
  if (!hasPlayerOwner && !game.user.isGM) return false  // player during gm turn
  if (hasPlayerOwner && !currentActor.isOwner) return false  // player during another player turn
  return true
}

const onUpdateCombat = () => {
  if (shouldShowEndTurnButton())
    $('.shm-end-turn').show()
  else
    $('.shm-end-turn').hide()
  if (canvas.tokens?.get(game.combat?.current?.tokenId)?.actor?.hasPlayerOwner && game.user.isGM) {
    $('.shm-end-turn').text(`(End turn for player?)`)
  } else {
    $('.shm-end-turn').text(`End Turn?`)
  }
  ui.chat.scrollBottom()
}

export const emitMessageToHighlightForCurrentPlayer = () => {
  let msg = {
    type: 'HIGHLIGHT_END_TURN_BUTTON'
  }
  game.socket.emit('module.shemetz-macros', msg)
  onSocketMessageEndTurnButton(msg)
}

const highlightEndTurnButton = (show) => {
  if (show) {
    $('.shm-end-turn').each((i, e) => e.style.textShadow = HIGHLIGHT_TEXT_SHADOW)
  } else {
    $('.shm-end-turn').each((i, e) => e.style.textShadow = '')
  }
}

const HIGHLIGHT_TEXT_SHADOW = '-2px -2px 3px #ff0000, 2px -2px 3px #ff0000, -2px 2px 3px #ff0000, 2px 2px 3px #ff0000'

const END_TURN_STYLE = '' +
  ' flex: none;' +
  ' text-align: center;' +
  ' font-size: var(--font-size-20);' +
  ' margin-bottom: 5px;'

const END_TURN_TEMPLATE = `
<a class="shm-end-turn" title="Ctrl+click to remind user" style="${END_TURN_STYLE}">End Turn?</a>
`
