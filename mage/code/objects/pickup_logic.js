
function pickupDestroyAll() {
  groupPickups.clear(true);
}

function pickupCreate(game, pickupType, x, y) {
  var info = PICKUPS.get(pickupType);
  if (!info) throw 'Unknown pickup type: ' + pickupType;
  var graph = GRAPHS.get(info.graph);
  if (!graph) throw 'Unkown graph: ' + info;
  var posX = x;
  var posY = y;
  if (info.moveY) posY += info.moveY;
  var newPickup = groupPickups.create(posX, posY, graph.name);
  newPickup.xType = pickupType;
  newPickup.xInfo = info;
}

function pickupCollect(game, pickup) {
  const canHeal = pickup.xInfo.heal && playerHealth < 100.0;
  const canIncreaseMana = pickup.xInfo.mana && playerMana < 100.0;
  if (canHeal || canIncreaseMana) {
    if (canHeal) playerHeal(game, pickup.xInfo.heal);
    if (canIncreaseMana) playerUpdateMana(game, pickup.xInfo.mana);
    pickup.destroy();
  }
}
