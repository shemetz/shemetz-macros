for (let token of canvas.tokens.controlled) {
  if (token.actor.sheet._state === -2) {
    token.actor.sheet._state = -1
  }
}