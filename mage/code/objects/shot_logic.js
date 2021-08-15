
"use strict";

function shotDestroyAll() {
  groupPlayerShots.clear(true);
  groupEnemyShots.clear(true);
}

function shotShoot(game, isPlayer, shotType, x, y, dx, dy) {

  var info = SHOTS.get(shotType);
  if (!info) throw 'Unknown shot type: ' + shotType;
  var graph = GRAPHS.get(info.graph);
  if (!graph) throw 'Unkown graph: ' + info.graph;

  var group = isPlayer ? groupPlayerShots : groupEnemyShots;

  var newShot = group.create(x, y, graph.name);

  newShot.xType = shotType
  newShot.xInfo = info;
  newShot.xIsPlayer = isPlayer;
  newShot.xCreated = game.time.now;
  newShot.xRandom = Math.random(); // E.g. sway effects and such
  newShot.xBounceCount = 0;

  newShot.setVelocity(dx*info.velocity, dy*info.velocity);
  newShot.setGravity(0, 400*info.grav); // TODO:
  if (info.bounce) {
      newShot.setBounce(info.bounce.amount, info.bounce.amount);
  }

  // Handle animation
  if (graph.type == GRAPH_TYPE_ANIM_3) {
    newShot.anims.play(graph.name + '_anim');
  }

}

function shotHitPlayer(game, shot) {
  shotDestroy(game, shot);
  // TODO: Add type
  playerDealDamage(game, shot.xInfo.damage, 0);
}

function shotHitEnemy(game, shot, enemy) {
  shotDestroy(game, shot);
  // TODO: Add hit function or similar
  // TODO: Add type
  enemy.xHealth -= shot.xInfo.damage;
}

function shotHitWall(game, shot, wall) {
  shot.xBounceCount += 1;
  if (!shot.xInfo.bounce || shot.xInfo.bounce.count < shot.xBounceCount) {
    shotDestroy(game, shot);
  }
}

function shotDestroy(game, shot) {
  if (shot.xInfo.spawn) {
    const spawn = shot.xInfo.spawn;
    for (var i = 0; i < spawn.amount; i++) {
      const a = Math.random() * Math.PI * 2.0;
      const mult = spawn.velocity ? spawn.velocity : 1.0;
      const dx = Math.cos(a) * mult;
      const dy = Math.sin(a) * mult;
      shotShoot(game, shot.xIsPlayer, spawn.type, shot.x, shot.y, dx, dy);
    }
  }
  shot.destroy();
}
