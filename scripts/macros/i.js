/*
--- i ---
Allows using /i to type italics text.

args:
  0+ words, which will be concatenated. You should wrap them with " if you're calling this via chat.

source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/i.js
suggested icon:
https://i.imgur.com/iw4sH39.png
*/

const text = args.join(' ')
return `<i>${text}</i>`