// wild surge icon:
// https://vignette.wikia.nocookie.net/leagueoflegends/images/f/f2/PROJECT_Reckoning_profileicon.png

export const castRandomWildSurge = async (actor) => {
    const surges = actor.data.items.filter((it) => {
        return it.type === "spell" && it.name.includes("Wild Surge")
    })
    if (surges.length !== 8) {
        ui.notifications.error(`${actor.name} should have exactly 8 Wild Surges!`)
        return
    }
    const surgeRoll = await new Roll("1d8").roll()
    const chatData = {
        title: `Wild Surge!`,
        formula: "1d8",
        tooltips: [await surgeRoll.getTooltip()],
        rolls: [surgeRoll],
        rollState: null, // can also be "highest" or "lowest"
        rollType: ""
    }
    // TODO - not sure this is the right way
    const multiroll = await renderTemplate("modules/betterrolls5e/templates/red-multiroll.html", chatData);
    const messageSpeaker = ChatMessage.getSpeaker({actor: actor})
    const messageType = CONST.CHAT_MESSAGE_TYPES.OTHER
    ChatMessage.create({
        speaker: messageSpeaker,
        content: multiroll,
        type: messageType
    })
    const surge = surges[parseInt(surgeRoll.result) - 1]
    BetterRolls.quickRollByName(actor.name, surge.name)
}



