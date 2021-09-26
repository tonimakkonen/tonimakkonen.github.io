
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
  var doConsume = false;
  const canHeal = pickup.xInfo.heal && playerHealth < 100.0;
  const canIncreaseMana = pickup.xInfo.mana && playerMana < 100.0;
  if (canHeal || canIncreaseMana) {
    const delta = canHeal && canIncreaseMana ? 10.0 : 0.0;
    if (canHeal) {
      playerHeal(game, pickup.xInfo.heal);
      infoCreateText(game, pickup.x, pickup.y - delta, '+' + pickup.xInfo.heal.toString(10), '#00FF00', 1500);
    }
    if (canIncreaseMana) {
      playerUpdateMana(game, pickup.xInfo.mana);
      infoCreateText(game, pickup.x, pickup.y + delta, '+' + pickup.xInfo.mana.toString(10), '#0000FF', 1500);
    }
    doConsume = true;
  }
  if (pickup.xInfo.books) {
    // TODO: Add to player stats
    playerProgress.spellBooks += 1;
    infoCreateText(game, pickup.x, pickup.y, 'NEW SKILL!', '#FFFFFF', 1500);
    doConsume = true;
  }
  if (doConsume) {
    if (pickup.xInfo.sound) soundRequestEnv(game, pickup.xInfo.sound, pickup.x, pickup.y);
    pickup.destroy();
  }
}
