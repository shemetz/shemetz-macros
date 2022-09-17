const DEFAULT_DURATION_MS= 5000

export const setDarknessLevel = (darknessLevel, animateDarknessDurationMs) => {
  console.info(`setting darkness to ${darknessLevel}, animation ${animateDarkness}`)
  return canvas.scene.update({
    darkness: darknessLevel,  // 0 is day, 1 is night
  }, {
    animateDarkness: animateDarknessDurationMs,  // 0 is instant, 10000 is 10 seconds
  })
}

export const setDarknessLevelDialog = () => {
  const currentDarkness = canvas.scene.darkness

  new Dialog({
    title: 'Set darkness level',
    content: `
<div>
    <div class="form-group">
        <label>0 is day, 1 is night (checkbox to animate over 5s).</label>
        <input style="width: 50px;" id="darknessLevel" type="number" placeholder=${currentDarkness} />
        <input style="vertical-align: middle;" id="animateDarkness" type="checkbox"/>
    </div>
</div>`,
    buttons: {
      ok: {
        icon: '<i class="fas fa-check"></i>',
        label: 'OK',
        callback: async (html) => {
          const darknessLevel = html.find('#darknessLevel')[0].value
          const animateDarkness = html.find('#animateDarkness')[0].checked
          if (isNaN(parseFloat(darknessLevel))) return console.warn('Empty args in dialog')
          return setDarknessLevel(parseFloat(darknessLevel), animateDarkness ? DEFAULT_DURATION_MS : undefined)
        },
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: 'Cancel',
        callback: async () => {
          console.log('canceled darkness level dialog')
        },
      },
    },
    default: 'ok',
  }).render(true)
}
