
function pickupDestroyAll() {
  groupPickups.clear(true);
}

function pickupCreate(game, pickupType, x, y) {
  var info = PICKUPS.get(pickupType);
  if (!info) throw 'Unknown pickup type: ' + pickupType;
  var graph = GRAPHS.get(info.graph);
  if (!graph) throw 'Unkown graph: ' + info;
  var newPickup = groupPickups.create(x, y, graph.name);
  newPickup.xType = pickupType;
  newPickup.xInfo = info;
}

function pickupCollect(game, pickup) {
  if (pickup.xInfo.heal) {
    if (playerHealth < 100.0) {
      pickup.destroy();
      playerHeal(game, pickup.xInfo.heal);
    }
  }
}
