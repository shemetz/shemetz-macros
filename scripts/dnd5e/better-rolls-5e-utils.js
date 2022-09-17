export const checkIfBetterRolls5eMessageIsCrit = (chatMessage) => {
  return chatMessage.flags.betterrolls5e.entries[1].isCrit
}

export const checkIfBetterRolls5eMessageIncludesNumber = (chatMessage, someNumber) => {
  return chatMessage.flags.betterrolls5e.entries[1].entries
    .some(e => e.roll.terms[0].results[0].result === someNumber)
}
