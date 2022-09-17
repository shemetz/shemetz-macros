/**
Filters macro directory to only show macros from a certain author.
Activate this with macro directory open.
*/
export const filterMacrosByAuthor = (authorPlayerName) => {
  $('#macros > ol')
  .children()
  .filter((i, listItem) => {
    const macro = game.macros.get(listItem.getAttribute('data-entity-id'))
    const author = game.users.get(macro.document.author)
    return author.name !== authorPlayerName
  })
  .remove()
}
