/*
--- check-crit ---
Checks if a given BetterRolls5e chat message is a critical hit.

source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/check-crit.js
suggested icon:
https://i.imgur.com/iw4sH39.png
*/

const chatMessage = args[0]
const isCrit = chatMessage.data.flags.betterrolls5e.entries[1].isCrit
return isCrit