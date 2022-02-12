const SECOND = 1000
const HIGHLIGHT_DURATION = 3 * SECOND
const EXTRA_HIGHLIGHT_FREQUENCY = 5

const shouldPreventThisParentElementFromHidingOverflow = (elem) => {
  return elem.matches('.main-controls')
    || elem.matches('.directory-item h3')
    || elem.matches('.directory-item h4')
    || elem.matches('.window-app .window-header')
    || elem.matches('.crb-style aside .sidebar') // pf2e char sheet sidebar
    || elem.matches('.crb-style .sheet-body .sheet-content .inventory .inventory-list, .crb-style .sheet-body .sheet-content .inventory .inventory .inventory-list, .crb-style .sheet-body .sheet-content .inventory>.tab:not(.inventory), .crb-style .sheet-body .sheet-content>.tab:not(.inventory)') // pf2e char sheet sidebar
    || elem.matches('#combat li.combatant .token-name') // combat tab
    || elem.matches('.pf2e.sheet .sheet-body') // pf2e item sheet and such
    || elem.matches('.pf2e.item.sheet form>article') // same
    || elem.matches('.dnd5e.sheet .items-list .item-name') // dnd5e inventory
    || elem.matches('.tidy5e.sheet.actor .items-list .item .item-name') // tidy5e
    || elem.matches('.tidy5e.sheet.actor .sheet-body') // same
    || elem.matches('.tidy5e.sheet.actor .portrait') // same
    || elem.matches('.tidy5e.sheet.actor #item-info-container') // same
    || elem.matches('.tidy5e.sheet.actor .exhaustion-wrap') // same
}

let $currHighlitElement = null
let flipExtraHighlightTimeout = null

const addHighlight = ($element) => {
  if ($currHighlitElement) {
    // in case another highlight is already active
    removeHighlight()
  }
  $currHighlitElement = $element
  $currHighlitElement.addClass('shm-highlighted')
  if ($currHighlitElement.css('position') !== 'absolute') {
    $currHighlitElement.addClass('shm-highlighted-position-relative')
  }
  $currHighlitElement.parents().each((i, elem) => {
    const $elem = $(elem)
    $elem.addClass('shm-highlighted-parent-front')
    if (shouldPreventThisParentElementFromHidingOverflow(elem)) {
      $elem.addClass('shm-highlighted-parent-hidden')
    }
  })
  $currHighlitElement[0].scrollIntoViewIfNeeded()

  // basic animation
  const flipExtraHighlight = () => {
    if (!$currHighlitElement) return
    $currHighlitElement.toggleClass('shm-highlighted-extra')
    flipExtraHighlightTimeout = setTimeout(flipExtraHighlight, HIGHLIGHT_DURATION / EXTRA_HIGHLIGHT_FREQUENCY)
  }
  flipExtraHighlight()
}

const removeHighlight = () => {
  if ($currHighlitElement) {
    $currHighlitElement.removeClass('shm-highlighted')
    $currHighlitElement.removeClass('shm-highlighted-position-relative')
    $currHighlitElement.removeClass('shm-highlighted-extra')
    $currHighlitElement.parents().each((i, elem) => {
      const $elem = $(elem)
      $elem.removeClass('shm-highlighted-parent-hidden')
      $elem.removeClass('shm-highlighted-parent-front')
    })
    clearTimeout(flipExtraHighlightTimeout)
    flipExtraHighlightTimeout = null
    $currHighlitElement = null
  }
}

function isUniqueSelector(selector) {
  return $(selector).length === 1
}

/**
 * based on StackOverflow answer but edited to be much cleaner for my use case
 */
function generateQuerySelectorRecur (elem, childStr, options) {
  const {
    tagName,
    id,
    className,
    parentNode
  } = elem
  const { tryNthChild } = options

  if (tagName === 'HTML') return 'HTML'

  let str = tagName

  str += (id !== '') ? `#${id}` : ''
  if (isUniqueSelector(`${str}${childStr}`)) return str

  // add unique attributes such as 'data-actor-id' (for some reason normal ID is also here)
  let uniqueAttribute = undefined
  for (const attr of Object.values(elem.attributes)) {
    if (
      attr.name === 'id'
      || (attr.name.startsWith('data-') && attr.name.endsWith('-id'))
      || (attr.name === 'name' && ['input', 'button'].includes(tagName))
      || (attr.name === 'title' && className.includes('control-tool'))
      || [
        'data-control', 'data-tool', 'data-tab', 'data-pack', 'data-skill', 'data-property',
        'data-sort-name',
      ].includes(attr.name)
    ) {
      uniqueAttribute = attr.name
      if (uniqueAttribute) {
        str += `[${uniqueAttribute}="${elem.getAttribute(uniqueAttribute)}"]`
        if (isUniqueSelector(`${str}${childStr}`)) return str
      }
    }
  }

  // add class
  if (className) {
    const classes = className.split(/\s/)
    for (let i = 0; i < classes.length; i++) {
      if (typeof classes[i] === 'string'
        && classes[i].length > 0
        && classes[i] !== 'active' && classes[i] !== 'open' // temporary state classes
        && !classes[i].includes('shm-highlighted')
      ) {
        str += `.${classes[i]}`
      }
    }
  }
  if (isUniqueSelector(`${str}${childStr}`)) return str

  if (tryNthChild && (elem.previousElementSibling || elem.nextElementSibling)) {
    let childIndex = 1
    for (let e = elem; e.previousElementSibling; e = e.previousElementSibling) {
      childIndex += 1
    }
    str += `:nth-child(${childIndex})`
    if (isUniqueSelector(`${str}${childStr}`)) return str
  }

  if (isUniqueSelector(`${str}${childStr}`)) return str
  const thisStrAsChild = ` > ${str}`
  const parentStr = generateQuerySelectorRecur(parentNode, thisStrAsChild, options)
  return `${parentStr}${thisStrAsChild}`
}

const generateQuerySelector = (element) => {
  let selector
  // first try avoiding "nth child" since it can be different for different clients
  selector = generateQuerySelectorRecur(element, '', { tryNthChild: false })
  if (!isUniqueSelector(selector)) {
    // (but we'll use it if we have to)
    selector = generateQuerySelectorRecur(element, '', { tryNthChild: true })
  }
  // attempt to shorten it, both for nicer readability and to avoid nth-child stuff that might fail
  // in case the GM sees extra children for some element (e.g. highlighting damage in chat message card)
  const firstArrowInSelector = selector.indexOf('>')
  const lastArrowInSelector = selector.lastIndexOf('>')
  let shorterSelector
  shorterSelector = selector.substring(0, firstArrowInSelector)
    + ' '
    + selector.substring(lastArrowInSelector + 1)
  if (isUniqueSelector(shorterSelector)) selector = shorterSelector
  // remove nth children just in case suddenly it's possible
  shorterSelector = selector.replace(/:nth-child\([0-9]+\)/g, '')
  if (isUniqueSelector(shorterSelector)) selector = shorterSelector
  return selector
}

let removeHighlightTimeout = null

/**
 * Highlight the "End Turn" button for 1 second, for the current player
 */
export const onSocketMessageHighlightSomething = (message) => {
  if (removeHighlightTimeout) {
    clearTimeout(removeHighlightTimeout)
    removeHighlightTimeout = null
  }
  const $element = $(`${message.selector}`)
  if ($element && $element[0]) {
    addHighlight($element)
    removeHighlightTimeout = setTimeout(() => {
      removeHighlight()
    }, HIGHLIGHT_DURATION)
  } else {
    removeHighlight()
  }
}

/**
 * message should have a 'selector' field, and a potential 'playerId' field
 */
export const emitHighlight = (message) => {
  console.log('Shemetz Macros | remote highlight with selector:')
  console.log(message.selector)
  const msg = {
    type: 'HIGHLIGHT_ELEMENT',
    ...message
  }
  game.socket.emit('module.shemetz-macros', msg)
  onSocketMessageHighlightSomething(msg)
}

let debounceEmitHighlightTimeout = null
const debounceEmitHighlight = (elem) => {
  if (debounceEmitHighlightTimeout) {
    clearTimeout(debounceEmitHighlightTimeout)
  }
  debounceEmitHighlightTimeout = setTimeout(() => {
    debounceEmitHighlightTimeout = null
    const selector = generateQuerySelector(elem)
    emitHighlight({ selector })
  }, 100)
}

export const refreshRemoteHighlightListeners = () => {
  console.log('Shemetz Macros | refreshing remote highlight listeners')
  // EVERY element on the page can be highlighted (O_O)
  $('*').each((i, elem) => {
    elem.addEventListener('auxclick', (event) => {
      // on middle clicking an element while holding Control
      if (!game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.CONTROL)) return
      // return if it's stuff that really shouldn't need highlighting
      if (['HTML', 'BODY', 'CANVAS', 'SECTION'].includes(elem.tagName)) return
      event.stopPropagation()
      event.preventDefault()
      debounceEmitHighlight(elem)
      debounceRefresh()
    })
  })
}

let debounceRefreshTimeout = null
const debounceRefresh = () => {
  if (debounceRefreshTimeout) {
    clearTimeout(debounceRefreshTimeout)
  }
  debounceRefreshTimeout = setTimeout(() => {
    debounceRefreshTimeout = null
    refreshRemoteHighlightListeners()
  }, 100)
}

export const hookRemoteHighlight = () => {
  Hooks.on('ready', () => {
    debounceRefresh()
  })
  // this is overkill but it works
  const variousHooks = [
    ...Object.keys(Hooks._hooks),
    'renderSettingsConfig',
    'renderActorSheet',
    'renderItemSheet',
    'renderApplication',
  ]
  for (const renderSomething of [...new Set(variousHooks)]) {
    if (renderSomething.startsWith('render')) {
      Hooks.on(renderSomething, () => {
        debounceRefresh()
      })
    }
  }

  libWrapper.register('shemetz-macros', 'Application.prototype.activateListeners', (wrapped, ...args) => {
    debounceRefresh()
    return wrapped(...args)
  }, 'WRAPPER')

  libWrapper.register('shemetz-macros', 'FormApplication.prototype._render', (wrapped, ...args) => {
    removeHighlight()
    return wrapped(...args)
  }, 'WRAPPER')
}
