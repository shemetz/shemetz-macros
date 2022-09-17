export const toggleCombatMode = async ({
  ROLL_NPC_INITIATIVE_IMMEDIATELY = true,
  ROLL_PC_INITIATIVE_IMMEDIATELY = false,
  COMBAT_HP_FOR_PC = CONST.TOKEN_DISPLAY_MODES.ALWAYS,
  COMBAT_HP_FOR_ENEMY = CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
  COMBAT_HP_FOR_FRIEND = CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
  NONCOMBAT_HP_FOR_PC = CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
  NONCOMBAT_HP_FOR_ENEMY = CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
  NONCOMBAT_HP_FOR_FRIEND = CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
  HIDE_INITIATIVE_OF_ENEMY = true,
  HIDE_INITIATIVE_OF_FRIEND = false,
  INITIATIVE_FOR_NONCHARACTER_CONTROLLED_BY_PLAYER = false,
  INCLUDE_0HP = false,
}={}) => {
  const combatMode = !game.combat
  let combat = game.combat || game.combats.viewed

  if (combatMode) {
    // Activate combat
    let scene = game.scenes.current
    const cls = getDocumentClass('Combat')
    combat = await cls.create({ scene: scene?.id })
    await combat.activate({ render: true })
  }

  // For all tokens on scene...
  const tokenUpdates = []
  const combatNewDocs = []
  for (const tokenDoc of canvas.scene.tokens) {
    const token = tokenDoc.object
    // Player tokens
    if (token.actor?.hasPlayerOwner) {
      if (combatMode) {
        if (token.actor?.hasPlayerOwner && token.actor?.type === 'character' && INITIATIVE_FOR_NONCHARACTER_CONTROLLED_BY_PLAYER) {
          // not adding NPC actors controlled by players to initiative
        } else {
          combatNewDocs.push({
            tokenId: token.id,
            sceneId: token.scene.id,
            actorId: token.document.actorId,
            hidden: false
          })
        }
        tokenUpdates.push({
          _id: token.id,
          displayBars: COMBAT_HP_FOR_PC,
        })
      } else {
        tokenUpdates.push({
          _id: token.id,
          displayBars: NONCOMBAT_HP_FOR_PC,
        })
      }
    } else if (token.inCombat || token.controlled) {
      if (!INCLUDE_0HP && token?.actor?.system?.attributes?.hp?.value <= 0) {
        continue
      }
      const friendly = token.document.disposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY
      if (combatMode) {
        combatNewDocs.push({
          tokenId: token.id,
          sceneId: token.scene.id,
          actorId: token.document.actorId,
          hidden: token.document.hidden || (friendly ? HIDE_INITIATIVE_OF_FRIEND : HIDE_INITIATIVE_OF_ENEMY),
        })
        tokenUpdates.push({
          _id: token.id,
          displayBars: friendly ? COMBAT_HP_FOR_FRIEND : COMBAT_HP_FOR_ENEMY,
        })
      } else {
        tokenUpdates.push({
          _id: token.id,
          displayBars: friendly ? NONCOMBAT_HP_FOR_FRIEND : NONCOMBAT_HP_FOR_ENEMY,
        })
      }
    }
  }
  if (combatMode) {
    await game.combat.createEmbeddedDocuments('Combatant', combatNewDocs)
    await canvas.scene.updateEmbeddedDocuments('Token', tokenUpdates)
    if (ROLL_NPC_INITIATIVE_IMMEDIATELY) {
      await game.combat.rollNPC({ skipDialog: true })
    } else if (ROLL_PC_INITIATIVE_IMMEDIATELY) {
      await game.combat.rollAll({ skipDialog: true })
    }
  }
  if (!combatMode) {
    // Deactivate combat, with special confirmation dialog
    const pcHealthDisplayKeys = Object.keys(game.i18n.translations.TOKEN).filter(k => k.startsWith('DISPLAY_'))
    const newPCHealth = game.i18n.localize(`TOKEN.${
      pcHealthDisplayKeys.find(k => {
        const substr = k.substring('DISPLAY_'.length)
        const value = CONST.TOKEN_DISPLAY_MODES[substr]
        return value === NONCOMBAT_HP_FOR_PC
      })
    }`)
    await Dialog.confirm({
      title: 'End encounter?',
      content: `End this encounter and set PC health to ${newPCHealth}?`,
      yes: async () => {
        await game.combat.createEmbeddedDocuments('Combatant', combatNewDocs)
        await combat.delete()
        await canvas.scene.updateEmbeddedDocuments('Token', tokenUpdates)
      }
    })
  }
}
