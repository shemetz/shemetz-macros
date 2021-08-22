export const checkIfBetterRolls5eMessageIsCrit = (chatMessage) => {
  return chatMessage.data.flags.betterrolls5e.entries[1].isCrit
}