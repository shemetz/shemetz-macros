Hooks.on('ready', () => {
  game.socket.on('module.shemetz-macros', onSocketMessage)
})

export const onSocketMessage = (receivedMessage) => {
}
