/*
In an overworld map scene, there's a neat trick to let GMs and players create transparent tokens - which use an image
such as https://i.imgur.com/FWKBcnS.png or "..../Transparent_Token.png" for invisible areas that show their names when
you hover over them.

This macro will toggle a strong highlight for all such invisible tokens, making their names stay shown and adding
spinning lights around the tokens, until the macro is used again to deactivate this.
https://i.imgur.com/DkNojdN.png
 */
export const highlightTransparentTokensOnMap = () => {
  const updates = canvas.tokens.placeables
    .filter(tok => tok.data.img.includes('Transparent') || tok.data.img.includes('FWKBcnS'))
    .map(tok => {
      const highlight = tok.data.brightLight !== 0.1
      return {
        _id: tok.id,
        'displayName': highlight ? CONST.TOKEN_DISPLAY_MODES.ALWAYS : CONST.TOKEN_DISPLAY_MODES.HOVER,
        'lightAlpha': highlight ? 0.25 : 1,
        'brightLight': highlight ? 0.1 : 0,
        'lightColor': highlight ? '#ffee00' : '',
        'lightAnimation': {
          type: highlight ? 'sunburst' : '',
          speed: highlight ? 3 : 5,
          intensity: highlight ? 10 : 5,
        },
      }
    })

  console.log(`highlighting ${updates.length} tokens...`)
  canvas.scene.updateEmbeddedDocuments('Token', updates)
}
