# Shemetz Macros - a custom FoundryVTT module for my play group

This module includes a lot of random stuff.  I constantly add (and sometimes edit or remove) stuff here, so don't expect
it to be stable, not that you should, because it's made for my own use.  You can probably find some good source code for
some things here, though!  And if you ask me I could export some of the things here into their own modules.

## New keybindings

#### [Control Token Teleportation](scripts/tokens/control-token-teleportation.js)
Hold Ctrl while dragging a token from point A to point B to have it instantly appear at point B without animating.
Useful for teleportation and for moving players across the map without them seeing through walls in the way.

#### [Eyedropper / Color Pick](scripts/drawing/eyedropper-color-pick.js)
Press and release K while using the drawing tools to pick a color directly from the screen.
A preview will be shown while you hold K.  You can also hold Shift to affect fill color instead of stroke color, and
you can hold Alt to pick a color from the scene's background image instead of the screen (ignoring lighting, drawings, 
grid, etc).

## New UI controls
#### [Close wall gaps](scripts/walls/close-wall-gaps.js)
![close wall gaps screenshot](https://cdn.discordapp.com/attachments/699750150674972743/888549704403664906/unknown.png)
A button in the Walls controls allows you to automatically find and fix all "wall gaps" - places where two walls have
their endpoints almost at the same place, off by a small number of pixels.  This will show you a preview and a count of
how many gaps are about to be closed.

## New automation

#### [Automatic wound effects](scripts/tokens/automatic-wound-effects.js)
![automatic wounds demo](https://pipe.miroware.io/60781d17a333fb12a3acb21e/maybe%20permanent/automatic_wounds.webp)

(requires Token Magic FX and pf2e)

(can be enabled in settings)

Whenever a token takes damage, it will get visibly hurt with random injury SFX.  When it gets healed those wounds will 
gradually disappear.




#### Everything Else
- A lot of code, used by my macros and other macros in my group's campaigns
- A lot of macros in the compendium which already use much of this code
- A critical hits tables compendium, used by the Critical Hit Tables macro (for D&D 5e)

Previously many of these macros were meant to be called from other macros, via the Furnace or Advanced Macros modules.
However, this is now mostly unnecessary, as the important code is moved into the module itself.  Many of the functions
can be directly called by typing `ShemetzMacros.nameOfFunction()`.

## Detailed List of Macros

### Token Configuration
#### <img src=https://i.imgur.com/X2mAfEC.png height="24"> [Image Shift](scripts/placeables/image-shift.js) 
Changes a selected token's image to the next one in a custom sequence.  Hold Ctrl to set up the sequence. Also works for
tiles. Also allows changing token size.

#### <img src=https://i.imgur.com/VfsnMXH.png height="24"> [Setup Light/Vision](scripts/tokens/setup-light-and-vision.js)
Will open two dialogs, for the user to set light and vision for the selected token.

#### <img src=https://i.imgur.com/Wrt5uIE.png height="24"> [Show Names/Bars](scripts/tokens/show-names-or-bars.js)
For all selected tokens, names will be shown/hidden and bars will be shown/hidden, depending on user choice.  Helpful 
for GMs who want to show health bars only during combat, or quickly reveal many NPC names.

#### <img src=https://emojiguide.org/images/emoji/1/w8iuxo1l9in91.png height="24"> [Flip](scripts/tokens/flip.js)
Flips the selected token image along the X axis.

#### <img src=https://static.thenounproject.com/png/232484-200.png height="24"> [Swap Positions](scripts/tokens/swap-token-positions.js)
Swap two selected tokens' positions.

#### <img src=https://i.imgur.com/qVDo73q.png height="24"> [Toggle Condition With Token Image](scripts/tokens/custom-condition.js)
Creates a condition (aka overlay, status effect) on the selected token, with the image of the targeted token (or another token in the scene).

#### <img src=https://game-icons.net/icons/ffffff/000000/1x1/delapouite/broom.svg height="24"> [Clear Conditions](scripts/tokens/clear-conditions.js) 
Clear all conditions from all selected tokens.  Will also clear PF2e conditions,

#### <img src=https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/openmoji/252/framed-picture_1f5bc.png height="24"> [View Token Art](scripts/tokens/token-art.js)
Show artwork of selected/hovered token to yourself, like a journal entry (GM can also show to all players).

#### <img src=https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/openmoji/252/framed-picture_1f5bc.png height="24"> [Post Token Art](scripts/tokens/token-art.js)
Post a chat message with the artwork of the selected token for all players to see.

#### <img src=https://game-icons.net/icons/ffffff/000000/1x1/delapouite/look-at.svg height="24"> [Turn Selected Token Towards Cursor](scripts/tokens/turn-selected-token-towards-cursor.js)
Causes all selected tokens to rotate towards the cursor.  Unnecessary if you have [Alternative Rotation](https://github.com/itamarcu/AlternativeRotation)

#### <img src=https://i.imgur.com/HWWHd2W.png height="24"> [Turn to Face](scripts/tokens/turn-to-face.js)
![](https://user-images.githubusercontent.com/6516621/93661817-95ca7080-fa63-11ea-87cd-133eb5d576fc.gif)

Select one or more tokens to be the turners. Target one token to be the target.
Whenever the turner or the target move, the turner will rotate to face the target.

(does not persist if you reload)





### Helpful for GM prep
#### [printIdOfControlled](scripts/placeables/print-id.js)
Posts a private chat message with the ID of the currently selected token or tile.

#### <img src=icons/magic/perception/eye-ringed-green.webp height="24"> [GM Darkness Vision Boost](scripts/canvas/gm-darkness-vision-boost.js)
Boosts the brightness of the scene to make it less dark, but only for the GM's eyes, and only temporarily.

### Helpful for GMing mid-session

#### <img src=https://i.imgur.com/DkNojdN.png height="24"> [Highlight Map Locations](scripts/tokens/highlight-map-locations.js)
For all [transparent tokens](https://i.imgur.com/FWKBcnS.png) on the map, lights and visible names will be shown/hidden.

#### <img src=https://i.imgur.com/9gxq5wH.png height="24"> [Set Darkness Level](scripts/canvas/darkness-level.js)
Sets darkness level to a specific number, with a checkbox to choose whether or not it's animated.




### Macros
#### <img src=https://game-icons.net/icons/ffffff/000000/1x1/delapouite/funnel.svg height="24"> [Filter Macros](scripts/macros/filter-macros.js)
Filters macro directory to only show macros from a certain author (edit this macro with author name).
Activate this with macro directory open.

#### <img src=https://i.imgur.com/wSiTbhm.png height="24"> [Remote Assign Hotbar Macro](scripts/macros/remote-assign-hotbar-macro.js)
Assigns a macro of your choice to the macro bar of other player(s).



### Chat Messages
#### <img src=https://i.imgur.com/iw4sH39.png height="24"> /i
Allows using /i to type italics text.

#### <img src=https://i.imgur.com/iw4sH39.png height="24"> /b
Allows using /b to type bold text.



### Character
#### <img src=https://reprog.files.wordpress.com/2011/01/1d8.png height="24"> [Spend Hit Die](scripts/dnd5e/spend-hit-die.js) (5e) 
This will spend your highest remaining hit die, rolling it and showing the result in the chat (not adding Constitution).



### Audio
#### <img src=https://i.imgur.com/tPNQzq6.png height="24"> [Play Sound](scripts/sound/play-sound.js) 
Plays one of the sounds predefined [in this macro](scripts/sound/sound-collection.js), or defined in any macro created
by you and named "EXTRA_SOUND_COLLECTION".



### TriggerHappy automation logic units
#### [Treasure chest trigger](scripts/custom-stuff/treasure-chest.js)
With TriggerHappy automation - when a player moves a token "into" a treasure chest: the chest will be opened, a sound will be
heard, its art will change to show it open, and the item description will be shown in chat.

#### [leverMechanismChangeWallsAndTiles](scripts/custom-stuff/lever-mechanism-change-walls-and-tiles.js)
With TriggerHappy automation - when a player clicks a lever: the lever will be change its artwork, a sound will be heard, several
walls will open/close and tiles will hide/unhide or change their image.

#### [open-close-doors](scripts/walls/open-close-doors.js)
Opens/closes doors (walls).

#### [toggleHide](scripts/placeables/toggle-hide.js)
Toggle hide/unhide for a token or tile.

#### [postItemDescription](scripts/items/post-item-description.js)
Prints the name, image, and description of an item in the Items Directory to the chat.



### Various other helper functions
#### [checkIfBetterRolls5eMessageIsCrit](scripts/dnd5e/better-rolls-5e-utils.js)
Checks if a BetterRolls5e chat message contains a crit.

#### [showDialogWithOptions](scripts/utils/dialog-utils.js)
Will open a dialog for the user to select an option, and call a callback when it's complete.

#### ...and several more!



### Wacky stuff

#### <img src=https://i.imgur.com/Pr6tXUH.png height="24"> [Critical Hit Tables](scripts/dnd5e/crit.js)
Rolls a crit from one of the homebrew expanded critical tables (or the fumble table).
Also works if you type in chat `/crit fire`, `/crit cold`, `/crit major`, `/crit fail`, `/crit psy`, etc.

#### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/reckless-cast](scripts/custom-stuff/reckless-cast.js)
A macro created for my character, Shent, who casts random spells as a modified UA invention/chaos wizard.

#### <img src=https://i.imgur.com/YptofqA.png height="24"> [Animefy Next Attack](scripts/custom-stuff/anime-attack.js)
Changes the name and image of an upcoming attack to be more anime, e.g. "Scorpion Assault!".  Powered by the one and
only [Fantasy Names Generator](https://www.fantasynamegenerators.com/anime-attack-names.php).

#### [Pushable blocks](scripts/custom-stuff/block-pushing.js)
![](https://pipe.miroware.io/60781d17a333fb12a3acb21e/temporary/pushables1.webp)
(can be enabled in settings)