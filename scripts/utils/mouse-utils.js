
export function getLocalMousePosition () {
  const { x, y } = canvas.app.renderer.plugins.interaction.mouse.getLocalPosition(canvas.app.stage)
  return { x, y }
}

export function getScreenMousePosition () {
  return canvas.app.renderer.plugins.interaction.mouse.global
}