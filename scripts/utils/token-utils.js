export const selectedTokens = () => {
  return canvas.tokens.controlled
}

export const targetedTokens = () => {
  return Array.from(game.user.targets)
}

export const hoveredTokens = () => {
  return canvas.tokens.placeables.filter(it => it.mouseInteractionManager.state === 1)
}