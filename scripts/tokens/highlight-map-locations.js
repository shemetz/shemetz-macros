/*
In an overworld map scene, there's a neat trick to let GMs and players create transparent tokens - which use an image
such as https://i.imgur.com/FWKBcnS.png or "..../Transparent_Token.png" for invisible areas that show their names when
you hover over them.

This macro will toggle a strong highlight for all such invisible tokens, making their names stay shown and adding
spinning lights around the tokens, until the macro is used again to deactivate this.
https://i.imgur.com/DkNojdN.png
 */
export const highlightTransparentTokensOnMap = async () => {
  const updates = canvas.tokens.placeables
    .filter(tok => tok.document.texture.src.includes('Transparent') || tok.document.texture.src.includes('FWKBcnS'))
    .map(tok => {
      const highlight = tok.document.light.bright !== 0.1
      return {
        _id: tok.id,
        'displayName': highlight ? CONST.TOKEN_DISPLAY_MODES.ALWAYS : CONST.TOKEN_DISPLAY_MODES.HOVER,
        'light': {
          'bright': highlight ? 1 : 0,
          'coloration': highlight ? 6 : 0,
          'luminosity': highlight ? 0 : 0.5,
          'color': highlight ? '#ffee00' : '',
          'animation': {
            type: highlight ? 'radialrainbow' : 'none',
            speed: highlight ? 0 : 5,
            intensity: highlight ? 10 : 5,
          },
        }
      }
    })

  console.log(`highlighting ${updates.length} tokens...`)
  return canvas.scene.updateEmbeddedDocuments('Token', updates)
}
