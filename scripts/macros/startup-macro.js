export const hookStartupMacro = () => {
  game.settings.register('shemetz-macros', 'startup-macro', {
    name: `Startup macro`,
    hint: `Paste any non-compendium macro name here to make it run automatically whenever you load the game (on 'ready')`,
    scope: 'client',
    config: true,
    type: String,
    default: '',
  })

  Hooks.on('ready', () => {
    const macroName = game.settings.get('shemetz-macros', 'startup-macro')
    if (!macroName)
      return
    const macro = game.macros.getName(macroName)
    if (!macro)
      return ui.notifications.error(`ShemetzMacros: Failed to find Startup macro with the following name: ${macroName}`)
    macro.execute()
  })
}
