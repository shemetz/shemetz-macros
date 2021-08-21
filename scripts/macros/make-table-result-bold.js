/*
--- make-table-result-bold ---
Converts text from crit tables to make the first sentence bold

args:
  0 - text to make bold

source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/make-table-result-bold.js
suggested icon:
https://i.imgur.com/iw4sH39.png
*/

let text = args[0]
if (text === null || text === undefined) {
  ui.notifications.error(`make-table-result-bold should have an argument!`)
  return ''
}
const periodIndex = text.search(/[.!?]/g)
if (periodIndex === -1)
  return '<b>(!)</b>' + text
const titleText = text.substring(0, periodIndex + 1)
const restOfText = text.substring(periodIndex + 1)
return `<b>${titleText}</b>${restOfText}`