let mode = 'visible'
export const hideAllUi = () => {
  const idstoHide = ['logo', 'navigation', 'controls', 'sidebar', 'players', 'hotbar']
  mode = (mode === 'hidden') ? 'visible' : 'hidden'
  idstoHide.forEach((id) => {
    document.getElementById(id).style.visibility = mode
  })
}