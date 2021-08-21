/*
--- Filter Macros ---
Filters macro directory to only show macros from a certain author (edit this macro with author name).
Activate this with macro directory open.

source:
https://github.com/itamarcu/shemetz-macros/blob/master/scripts/macros/filter-macros.js
suggested icon:
https://game-icons.net/icons/ffffff/000000/1x1/delapouite/funnel.svg
*/

const authorName = 'INSERT_PLAYER_NAME_HERE'

$('#macros > ol')
  .children()
  .filter((i, listItem) => {
    const macro = game.macros.get(listItem.getAttribute('data-entity-id'))
    const author = game.users.get(macro.data.author)
    return author.name !== authorName
  })
  .remove()
