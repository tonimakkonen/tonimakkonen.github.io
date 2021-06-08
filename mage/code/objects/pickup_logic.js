
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
  pickup.destroy();

  if (pickup.xInfo.heal) {
    playerDealDamage(game, -pickup.xInfo.heal, 0);
  }
}
