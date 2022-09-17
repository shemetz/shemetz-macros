self.blockPushingExtraPushes = []

/** @override */
function _getShiftedPosition_Override (dx, dy, recursed=false) {
  let [x, y] = canvas.grid.grid.shiftPosition(this.x, this.y, dx, dy);
  let targetCenter = this.getCenter(x, y);
  let collide = this.checkCollision(targetCenter);
  if (collide) return  {x: this.document.x, y: this.document.y}
  // block pushing!
  function _placeableContains(placeable, position) {
    // Tokens have getter (since width/height is in grid increments) but drawings use data.width/height directly
    const w = placeable.w || placeable.document.width;
    const h = placeable.h || placeable.document.height;
    return  Number.between(position.x, placeable.document.x, placeable.document.x + w)
      && Number.between(position.y, placeable.document.y, placeable.document.y + h)
  }
  function _getPushablesAt(placeables, position) {
    return placeables
      .filter(placeable => _placeableContains(placeable, position))
      .filter(it => it.name.endsWith("pushable"))
  }
  const pushables = _getPushablesAt(canvas.tokens.placeables, targetCenter)
  if (pushables.length === 0) return {x, y}
  const block = pushables[0]
  const blockShiftedPosition = block._getShiftedPosition(dx, dy, true)
  if (block.name.endsWith('non-chain-pushable') && recursed) {
    // not allowed to chain-push
    return {x: this.document.x, y: this.document.y}
  } else if (blockShiftedPosition.x === block.x && blockShiftedPosition.y === block.y) {
    // failed to push
    return {x: this.document.x, y: this.document.y}
  } else {
    // successful push;  push in chain
    self.blockPushingExtraPushes.push({...blockShiftedPosition, _id: block.id})
    return {x, y}
  }
}

async function moveMany_Override ({dx=0, dy=0, rotate=false, ids}={}) {
  if ( !dx && !dy ) return [];
  if ( game.paused && !game.user.isGM ) {
    return ui.notifications.warn("GAME.PausedWarning", {localize: true});
  }

  // Determine the set of movable object IDs unless some were explicitly provided
  ids = ids instanceof Array ? ids : this.controlled.filter(o => !o.document.locked).map(o => o.id);
  if ( !ids.length ) return [];

  // Define rotation angles
  const rotationAngles = {
    square: [45, 135, 225, 315],
    hexR: [30, 150, 210, 330],
    hexQ: [60, 120, 240, 300]
  };

  // Determine the rotation angle
  let offsets = [dx, dy];
  let angle = 0;
  if ( rotate ) {
    let angles = rotationAngles.square;
    if ( canvas.grid.type >= CONST.GRID_TYPES.HEXODDQ ) angles = rotationAngles.hexQ;
    else if ( canvas.grid.type >= CONST.GRID_TYPES.HEXODDR ) angles = rotationAngles.hexR;
    if (offsets.equals([0, 1])) angle = 0;
    else if (offsets.equals([-1, 1])) angle = angles[0];
    else if (offsets.equals([-1, 0])) angle = 90;
    else if (offsets.equals([-1, -1])) angle = angles[1];
    else if (offsets.equals([0, -1])) angle = 180;
    else if (offsets.equals([1, -1])) angle = angles[2];
    else if (offsets.equals([1, 0])) angle = 270;
    else if (offsets.equals([1, 1])) angle = angles[3];
  }

  // Conceal any active HUD
  const hud = this.hud;
  if ( hud ) hud.clear();

  // Construct the update Array
  const moved = [];
  const updateData = ids.map(id => {
    let obj = this.get(id);
    let update = {_id: id};
    if ( rotate ) update.rotation = angle;
    else foundry.utils.mergeObject(update, obj._getShiftedPosition(...offsets));
    moved.push(obj);
    return update;
  });
  updateData.push(...self.blockPushingExtraPushes)
  moved.push(...self.blockPushingExtraPushes.map(u => this.get(u._id)))
  self.blockPushingExtraPushes = []
  await canvas.scene.updateEmbeddedDocuments(this.constructor.documentName, updateData);
  return moved;
}

let didRegister = false
const registerOrUnregisterHooks = () => {
  if (game.settings.get('shemetz-macros', 'enable-block-pushing'))  {
    didRegister = true
    libWrapper.register('shemetz-macros', 'Token.prototype._getShiftedPosition', _getShiftedPosition_Override, 'OVERRIDE')
    libWrapper.register('shemetz-macros', 'TokenLayer.prototype.moveMany', moveMany_Override, 'OVERRIDE')
  } else if (didRegister) {
    didRegister = false
    libWrapper.unregister('shemetz-macros', 'Token.prototype._getShiftedPosition')
    libWrapper.unregister('shemetz-macros', 'TokenLayer.prototype.moveMany')
  }
}

export const hookBlockPushing = () => {
  game.settings.register('shemetz-macros', 'enable-block-pushing', {
    name: `Enable block pushing`,
    hint: `Allows moving tokens to push tokens with names ending with "pushable".`,
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: registerOrUnregisterHooks
  });
  registerOrUnregisterHooks()
}

