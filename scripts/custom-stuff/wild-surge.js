// wild surge icon:
// https://vignette.wikia.nocookie.net/leagueoflegends/images/f/f2/PROJECT_Reckoning_profileicon.png

export const castRandomWildSurge = async (actor) => {
    const surges = actor.items.filter((it) => {
        return it.type === "spell" && it.name.includes("Wild Surge")
    })
    if (surges.length !== 8) {
        ui.notifications.error(`${actor.name} should have exactly 8 Wild Surges!`)
        return
    }
    const surgeRoll = await new Roll("1d8").roll()
    const surge = surges[parseInt(surgeRoll.result) - 1]
    return surge.use()
}



