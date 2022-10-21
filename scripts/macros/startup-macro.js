export const hookStartupMacro = () => {
  game.settings.register('shemetz-macros', 'startup-macro', {
    name: `Startup macro`,
    hint: `Paste any non-compendium macro ID here to make it run automatically whenever you load the game (on 'ready')`,
    scope: 'client',
    config: true,
    type: String,
    default: '',
  })

  Hooks.on('ready', () => {
    const macroId = game.settings.get('shemetz-macros', 'startup-macro')
    if (!macroId)
      return
    const macro = game.macros.get(macroId)
    if (!macro)
      return ui.notifications.error(`ShemetzMacros: Failed to find Startup macro with the following ID: ${macroId}`)
    macro.execute()
  })
}
