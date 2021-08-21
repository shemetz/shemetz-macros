import { error } from './message-utils.js'

/**
 Will open a dialog for the user to select an option, and call a callback when it's complete.

 args:
 0  - query title
 1  - query text
 2  - callback to be called with selected option or null:
 3+ - options
 */
export const showDialogWithOptions = (queryTitle, queryText, callback, queryOptions) => {
  if (!queryTitle || !queryText || !callback || !queryOptions) {
    return error(
      `query-from-list arguments should be (queryTitle, queryText, callback, ...queryOptions),` +
      ` but yours are: ${queryTitle}, ${queryText}, ${callback}, ${queryOptions}`,
    )
  }

  let template = `
<div>
    <div class="form-group">
        <label>${queryText}</label>
        <select id="selectedOption">`
  for (let option of queryOptions) {
    template += `<option value="${option}">${option}</option>`
  }
  template += `</select>
    </div>
</div>`

  new Dialog({
    title: queryTitle,
    content: template,
    buttons: {
      ok: {
        icon: '<i class="fas fa-check"></i>',
        label: 'OK',
        callback: async (html) => {
          const selectedOption = html.find('#selectedOption')[0].value
          console.log(`${queryTitle} - selected option ${selectedOption}`)
          callback(selectedOption)
        },
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: 'Cancel',
        callback: async () => {
          console.log(`${queryTitle} - canceled`)
          callback(null)
        },
      },
    },
    default: 'cancel',
  }).render(true)
}