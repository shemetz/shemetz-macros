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
    const currentRotation = t.mesh.rotation
    while (newRotation > currentRotation + Math.PI) newRotation -= 2 * Math.PI
    while (newRotation < currentRotation - Math.PI) newRotation += 2 * Math.PI
    const duration = Math.abs(newRotation - currentRotation) / Math.PI * 300
    t.document.locked = true
    CanvasAnimation.animate([
      { parent: t.mesh, attribute: 'rotation', to: newRotation },
    ], {
      context: t.mesh,
      name: `Token.${t.id}.animateRotationTowardsPoint`,
      duration: duration,
      easing: CanvasAnimation.easeInOutCosine,
    }).then(() => {
      return t.document.update({ 'rotation': rotation })
    }).then(() => {
      // we locked this to prevent refresh on hover
      t.document.locked = false
    })
  })
}
