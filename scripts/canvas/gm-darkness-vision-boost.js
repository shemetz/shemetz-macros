let gmVisionFilter = null

/**
 * boost of 0.5 is usually enough
 */
export const gmDarknessVisionBoost = (boost) => {
  const visionBoostEnabled = gmVisionFilter !== null
  if (visionBoostEnabled) {
    // disable
    canvas.lighting.illumination.filters = canvas.lighting.illumination.filters.filter(f => f !== gmVisionFilter)
    gmVisionFilter.destroy()
    gmVisionFilter = null
  } else {
    // enable
    gmVisionFilter = new PIXI.filters.ColorMatrixFilter()
    gmVisionFilter.matrix = [
      (1 - boost), 0, 0, 0, boost,
      0, (1 - boost), 0, 0, boost,
      0, 0, (1 - boost), 0, boost,
      0, 0, 0, 1, 0,
    ]
    gmVisionFilter.resolution = canvas.app.renderer.resolution

    canvas.lighting.illumination.filters = [
      gmVisionFilter,
      ...canvas.lighting.illumination.filters
    ]
  }
}