/*
--- error ---
Display an error message in the chat and console log. This is just a convenience method.

args:
  0+ words, which will be concatenated. You should wrap them with " if you're calling this via chat.

source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/error.js
suggested icon:
https://i.imgur.com/iw4sH39.png
*/

let message = args.join(' ') || '[no error message]'

console.log('Error printed: ' + JSON.stringify(args))

let chatData = {
  user: game.user.id,
  speaker: ChatMessage.getSpeaker(),
  content: 'Error: ' + message,
}
ChatMessage.create(chatData, {})