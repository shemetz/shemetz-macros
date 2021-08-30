# Shemetz Macros - module with a lot of functions used by my macros

This module includes:
- A lot of code, used by my macros and other macros in my group's campaigns
- A lot of macros in the compendium which already use much of this code
- A critical hits tables compendium, used by the Critical Hit Tables macro

Previously many of these macros were meant to be called from other macros, via the Furnace or Advanced Macros modules.
However, this is now mostly unnecessary, as the important code is moved into the module itself.  Many of the functions
can be directly called by typing `ShemetzMacros.nameOfFunction()`.

## List + Summaries (NEEDS UPDATE)

### <img src=https://image.flaticon.com/icons/png/128/4469/4469781.png height="24"> [Eyedropper Color Pick](eyedropper-color-pick.js) 
Picks the canvas color your mouse is hovering over, and sets it as the drawing tool color.

### <img src=https://i.imgur.com/X2mAfEC.png height="24"> [Token Image Swap](token-image-swap.js) 
Changes a selected token's image to the next one in a custom sequence.

### <img src=https://i.imgur.com/YptofqA.png height="24"> [Anime Attack](anime-attack.js) 
Changes the name and image of an upcoming attack to be more anime, e.g. "Scorpion Assault!"

### <img src=https://static.thenounproject.com/png/232484-200.png height="24"> [Swap Positions](swap-positions.js) 
Swap two selected tokens' places.

## <img src=https://game-icons.net/icons/ffffff/000000/1x1/delapouite/broom.svg height="24"> [Clear Conditions](clear-conditions.js) 
Clear all conditions from all selected tokens.

### <img src=https://game-icons.net/icons/ffffff/000000/1x1/delapouite/broom.svg height="24"> [Delete Measurement](delete-measurements.js) 
Deletes all template measurements on the map (e.g. if you want to remove all visual spell areas).

### <img src=https://game-icons.net/icons/ffffff/000000/1x1/delapouite/funnel.svg height="24"> [Filter Macros](filter-macros.js) 
Filters macro directory to only show macros from a certain author (edit this macro with author name).
Activate this with macro directory open.

### <img src=https://emojiguide.org/images/emoji/1/w8iuxo1l9in91.png height="24"> [Flip](flip.js) 
Flips the selected token image along the X axis.

### <img src=https://i.imgur.com/VfsnMXH.png height="24"> [Setup Light/Vision](setup-light-and-vision.js) 
Will open two dialogs, for the user to set light and vision for the selected token.

### <img src=https://i.imgur.com/Wrt5uIE.png height="24"> [Show Names, Hide Bars](show-names-hide-bars.js) 
For all selected tokens, names will be shown and bars will be hidden.

### <img src=https://i.imgur.com/R8klQVl.png height="24"> [Hide Names, Hide Bars](hide-names-hide-bars.js) 
For all selected tokens, names will be hidden (except owner hover) and bars will be hidden.

### <img src=https://i.imgur.com/DkNojdN.png height="24"> [Highlight Map Locations](highlight-map-locations.js) 
For all transparent tokens on the map, lights and visible names will be shown/hidden.

### <img src=https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/openmoji/252/framed-picture_1f5bc.png height="24"> [Show Artwork](show-artwork.js) 
Show artwork of selected/hovered token to yourself (GM can show to all players).

### <img src=https://reprog.files.wordpress.com/2011/01/1d8.png height="24"> [Spend Hit Die](spend-hit-die.js) (5e) 
This will spend your highest remaining hit die, rolling it and showing the result in the chat (not adding Constitution).

### <img src=https://i.imgur.com/ec2xL28.png height="24"> [What's Messing with my AC?](whats-messing-with-my-ac.js) (5e) 
Shows a message that details all items that affect AC on the character.  Not yet updated to the Active Effects of v0.7.5

### <img src=https://game-icons.net/icons/ffffff/000000/1x1/delapouite/look-at.svg height="24"> [Turn Selected Towards Cursor](turn-selected-towards-cursor.js) 
Causes all selected tokens to rotate towards the cursor.

### <img src=https://i.imgur.com/HWWHd2W.png height="24"> [Turn to Face](turn-to-face.js) 
Select one or more tokens to be the turners. Target one token to be the target.
Whenever the turner or the target move, the turner will rotate to face the target.

(does not persist if you reload)

![](https://user-images.githubusercontent.com/6516621/93661817-95ca7080-fa63-11ea-87cd-133eb5d576fc.gif)

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/query-from-list](query-from-list.js) 
Will open a dialog for the user to select an option, and call a callback when it's complete.

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/error](error.js) 
Display an error message in the chat and console log. This is just a convenience method.

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/i](i.js) 
Allows using /i to type italics text.

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/treasure-chest](treasure-chest.js)
TriggerHappy macro - when a player moves a token "into" a treasure chest: the chest will be opened, a sound will be 
heard, its art will change to show it open, and the item description will be shown in chat.

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/secret-wall-lever](secret-wall-lever.js)
TriggerHappy macro - when a player clicks a lever: the lever will be change its artwork, a sound will be heard, several
walls will open/close and tiles will hide/unhide or change their image.

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/reset-activation-state](reset-activation-state.js)
Used to "reset" the activation state for the above TriggerHappy macros, when setting things up or debugging.

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/look-at-my-art](look-at-my-art.js) 
Shows a token's artwork in chat.

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/door-toggle](door-toggle.js) 
Opens/closes one door (wall).

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/check-crit](check-crit.js) 
Checks if a BetterRolls5e chat message contains a crit.

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/toggle-hide](toggle-hide.js) 
Toggle hide/unhide for a token or tile.

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/item-dir-info](item-dir-info.js) 
Prints the name, image, and description of an item in the Items Directory to the chat.

### <img src=https://i.imgur.com/tPNQzq6.png height="24"> [/play-sound](/play-sound.js) 
Plays one of the sounds predefined in this macro.

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [token-image-shift](token-image-shift.js) 
Similar to token-image-swap but useful for TriggerHappy automation.

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [tile-image-shift](tile-image-shift.js) 
Similar to token-image-swap but for tiles, for TriggerHappy automation.

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/print-id](print-id.js) 
Creates a private chat message with the ID of the currently selected token or tile.

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/make-table-result-bold](make-table-result-bold.js) (5e homebrew) 
Converts text from crit tables to make the first sentence bold.

### <img src=https://i.imgur.com/huPpJQf.png height="24"> [Crit Fail Table](critfail.js) (5e homebrew) 
Rolls and shows a result from the Critical Fail table (required as a rollable table)

### <img src=https://i.imgur.com/Pr6tXUH.png height="24"> [Crit Table](crit-dialog.js) (5e homebrew)
Rolls a crit from one of the expanded critical tables (required as Rollable Tables with those names)

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/crit](crit.js)
Rolls a crit from one of the expanded critical tables (required as Rollable Tables with those names).and call a callback when it's complete.

### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/reckless-cast](reckless-cast.js) (5e homebrew)
A macro created for my character, Shent, who casts random spells as a modified UA invention/chaos wizard.

# Compendiums
`itamacros.db` is a compendium of all of these macros.  The dependencies of macros used here are all based on either having this compendium or having the dependency macros in your world.

`critical-hits.db` is a compendium for the critical hit tables per damage type.