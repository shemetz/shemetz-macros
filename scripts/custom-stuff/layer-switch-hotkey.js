export const hookLayerSwitchHotkey = () => {
  game.keybindings.register('shemetz-macros', 'layer-switch', {
    name: 'Layer Switch (Token ↔ Tile)',
    hint: 'Switch activeLayer to token layer;  or to background tile layer if already at token layer',
    editable: [],
    onDown: async () => {
      if (canvas.activeLayer.name === 'TokenLayer') {
        canvas.tiles.activate()
      } else {
        canvas.tokens.activate()
      }
    },
  })
}
