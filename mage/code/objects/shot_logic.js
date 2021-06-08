
function shotShoot(game, isPlayer, shotType, x, y, dx, dy) {

  var info = SHOTS.get(shotType);
  if (!info) throw 'Unknown shot type: ' + shotType;
  var graph = GRAPHS.get(info.graph);
  if (!graph) throw 'Unkown graph: ' + info.graph;

  var group = isPlayer ? groupPlayerShots : groupEnemyShots;

  var newShot = group.create(x, y, graph.name);

  newShot.xType = shotType
  newShot.xInfo = info;
  newShot.xCreated = game.time.now;
  newShot.xRandom = Math.random(); // E.g. sway effects and such
  newShot.xBounceCount = 0;

  newShot.setVelocity(dx*info.velocity, dy*info.velocity);
  newShot.setGravity(0, 400*info.grav); // TODO:
  if (info.bounce) {
      newShot.setBounce(info.bounce.amount, info.bounce.amount);
  }

}

function shotHitPlayer(game, shot) {
  shot.destroy();
  playerDealDamage(game, shot.xInfo.damage, 0); // TODO:
}

function shotHitEnemy(game, shot, enemy) {
  shot.destroy();
  // TODO: Add hit function or similar
  enemy.xHealth -= shot.xInfo.damage;
}

function shotHitWall(game, shot, wall) {
  shot.xBounceCount += 1;
  if (!shot.xInfo.bounce || shot.xInfo.bounce.count < shot.xBounceCount) {
    shot.destroy();
  }
}
