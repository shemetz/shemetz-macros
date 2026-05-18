export const hookDifferentWeather = () => {
  game.settings.register('shemetz-macros', 'slower-rain', {
    name: `Slower rain`,
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    requiresReload: true,
  })

  if (game.settings.get('shemetz-macros', 'slower-rain')) {
    CONFIG.weatherEffects.rain.effects[0].config.speed = 0.067; // was 0.2
  }

  CONFIG.weatherEffects.shem_bloodRain = {
    id: "shem_bloodRain",
    label: "Blood Rain",
    filter: {
      enabled: false,
    },
    effects: [{
      ...CONFIG.weatherEffects.rain.effects[0],
      id: "bloodRainShader",
      config: {
        ...CONFIG.weatherEffects.rain.effects[0].config,
        tint: [1, 0.0, 0.0], // redder than [0.7, 0.9, 1]
        opacity:  0.6, // was 0.25
        speed: game.settings.get('shemetz-macros', 'slower-rain') ? 0.067 : 0.2,
      }
    }],
  };

  // to test changes, copy the above code and also add:
  /*
  await canvas.scene.update({ "weather": null });
  await canvas.scene.update({ "weather": "shem_slowRain" });
 */
}