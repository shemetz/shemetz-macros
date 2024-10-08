# Shemetz Macros - a custom FoundryVTT module for my play group

This module includes a lot of random stuff.  I constantly add (and sometimes edit or remove) stuff here, so don't expect
it to be stable, not that you should, because it's made for my own use.  You can probably find some good source code for
some things here, though!  And if you ask me I could export some of the things here into their own modules.

## New keybindings

#### Press H to toggle hidden on all selected tokens/tiles/drawings

## New UI controls
#### [Close wall gaps](scripts/walls/close-wall-gaps.js)
![close wall gaps screenshot](https://cdn.discordapp.com/attachments/699750150674972743/888549704403664906/unknown.png)

A button in the Walls controls allows you to automatically find and fix all "wall gaps" - places where two walls have
their endpoints almost at the same place, off by a small number of pixels.  This will show you a preview and a count of
how many gaps are about to be closed.

#### [Enable "End Turn" button in chat bar](scripts/gui/end-turn-button-in-chat-bar.js)
![end turn button screenshot](https://cdn.discordapp.com/attachments/729279512470093914/942007679965069382/end_turn_button.png)

An extra button to end your turn, shown on the bottom of the chat tab during combat.

## Startup macro

You can set a "startup macro" in the module settings with an ID of any non-compendium macro.  That macro will be run
each time you load the game (on the 'ready' hook).

This is useful in case you want to make some minor config macro.  for example, here's a Foundry V10 macro that changes
ping animations to be slower, which you can use as a startup macro to permanently change the look of pings:

```js
// increases duration of local ping animations to be less flashing
// (default durations for three of these are 900 ms)
CONFIG.Canvas.pings.styles.pulse.duration = 2000
CONFIG.Canvas.pings.styles.alert.duration = 2000
CONFIG.Canvas.pings.styles.arrow.duration = 2000
console.log('Startup macro | increased ping animation durations')
```


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

#### <img src=https://game-icons.net/1x1/lorc/back-forth.html height="24"> [Swap Positions](scripts/tokens/swap-token-positions.js)
Swap two selected tokens' positions.

#### <img src=https://i.imgur.com/qVDo73q.png height="24"> [Toggle Condition With Token Image](scripts/tokens/custom-condition.js)
Creates a condition (aka overlay, status effect) on the selected token, with the image of the targeted token (or another token in the scene).

#### <img src=https://game-icons.net/icons/ffffff/000000/1x1/delapouite/broom.svg height="24"> [Clear Conditions](scripts/tokens/clear-conditions.js) 
Clear all conditions from all selected tokens.  Will also clear PF2e conditions,

#### <img src=https://emojiguide.com/wp-content/uploads/platform/windows/43259.png height="24"> [View Token Art](scripts/tokens/token-art.js)
Show artwork of selected/hovered token to yourself, like a journal entry (GM can also show to all players).

#### <img src=https://emojiguide.com/wp-content/uploads/platform/windows/43259.png height="24"> [Post Token Art](scripts/tokens/token-art.js)
Post a chat message with the artwork of the selected token for all players to see.

#### <img src=https://game-icons.net/icons/ffffff/000000/1x1/delapouite/look-at.svg height="24"> [Turn Selected Token Towards Cursor](scripts/tokens/turn-selected-token-towards-cursor.js)
Causes all selected tokens to rotate towards the cursor.  Unnecessary if you have [Alternative Rotation](https://github.com/shemetz/AlternativeRotation)

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

#### <img src=https://game-icons.net/icons/ffffff/000000/1x1/lorc/swords-emblem.svg height="24"> [Toggle combat Mode](scripts/custom-stuff/combat-mode.js)
Toggles a combat encounter.  When there is no combat, it will do the following things, most of which configurable through parameters:
- Create a new combat
- Add all selected NPCs to the combat, except those with 0 HP and those controlled by a player
- Add all PCs to the combat (even those not selected)
- Change the HP visibility settings of all PC tokens in combat to "Always Visible"
- Roll initiative for all NPCs
- Hide enemies from combat display, so that players can't see them or their rolls

You can change some of these individual settings by importing the macro and editing the function to e.g.:
```js
ShemetzMacros.toggleCombatMode({
  ROLL_PC_INITIATIVE_IMMEDIATELY: true
})
```




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
#### [showDialogWithOptions](scripts/utils/dialog-utils.js)
Will open a dialog for the user to select an option, and call a callback when it's complete.

#### ...and several more!



### Wacky stuff

#### <img src=https://i.imgur.com/Pr6tXUH.png height="24"> [Critical Hit Tables](scripts/dnd5e/crit.js)
Rolls a crit from one of the homebrew expanded critical tables (or the fumble table).
Also works if you type in chat `/crit fire`, `/crit cold`, `/crit major`, `/crit fail`, `/crit psy`, etc.

#### <img src=https://i.imgur.com/iw4sH39.png height="24"> [/reckless-cast](scripts/custom-stuff/reckless-cast.js)
A macro created for my character, Shent, who casts random spells as a modified UA invention/chaos wizard.

### Removed (but used to be here)

##### Eyedropper / color picker
Moved to my other module, [Precise Drawing Tools](https://github.com/shemetz/precise-drawing-tools).

##### Animefy Next Attack
(stopped working in v11 or v12, was only used for a character I played in one campaign)

##### Pushable blocks
![](https://pipe.miroware.io/60781d17a333fb12a3acb21e/temporary/pushables1.webp)
(I removed this because it required a bit too much effort to maintain and I only used it once for one puzzle)
