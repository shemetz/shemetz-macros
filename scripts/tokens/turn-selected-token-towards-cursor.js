export const turnSelectedTokensTowardsCursor = () => {
  const mouse = canvas.app.renderer.plugins.interaction.mouse
  const m = mouse.getLocalPosition(canvas.app.stage)

  const changes = canvas.tokens.controlled.map(t => {
    const c = t.center
    let rotation = (Math.atan2(m.y - c.y, m.x - c.x) * 180 / Math.PI + 180) % 360
    rotation = (rotation + 90) % 360  // down = 0
    return { t, rotation }
  })

  // update preview
  changes.forEach(x => {
    const { t, rotation } = x
    let newRotation = rotation * Math.PI / 180
    const currentRotation = t.icon.rotation
    while (newRotation > currentRotation + Math.PI) newRotation -= 2 * Math.PI
    while (newRotation < currentRotation - Math.PI) newRotation += 2 * Math.PI
    const duration = Math.abs(newRotation - currentRotation) / Math.PI * 300
    t.data.locked = true
    CanvasAnimation.animateLinear([
      { parent: t.icon, attribute: 'rotation', to: newRotation },
//        {parent: t.data, attribute: 'rotation', to: newRotation},
    ], { name: `Token.${t.id}.animateRotationTowardsPoint`, context: t.icon, duration: duration }).then(() => {
      return t.document.update({ 'rotation': rotation })
    }).then(() => {
      // we locked this to prevent refresh on hover
      t.data.locked = false
    })
  })
}