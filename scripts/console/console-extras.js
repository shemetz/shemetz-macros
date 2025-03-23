let mostRecentCopiedText = ''

export const hookConsoleExtras = () => {
  libWrapper.register('shemetz-macros', 'foundry.helpers.interaction.ClipboardHelper.prototype.copyPlainText', (wrappedFunction, text) => {
    mostRecentCopiedText = text
    return wrappedFunction(text)
  }, 'WRAPPER')

  window.fuuid = (uuid) => {
    // shortcut to get something soon after copying its full UUID (right-click "copy uuid" button in sheet header)
    return fromUuidSync(uuid ?? mostRecentCopiedText)
  }
  window.afuuid = async (uuid) => {
    // as above, but async;  you must use this for embedded items (add .Item.xXxXxXxXxXx to create the uuid)
    return await fromUuid(uuid ?? mostRecentCopiedText)
  }
}