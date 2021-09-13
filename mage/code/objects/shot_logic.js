
"use strict";

var shotCurrentEffects = [];

function shotDestroyAll() {
  groupPlayerShots.clear(true);
  groupEnemyShots.clear(true);
}

function shotShoot(game, isPlayer, shotType, x, y, dx, dy, allowSound) {

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

  // Handle sound
  if (allowSound && info.sound) {
    soundRequestEnv(game, info.sound, x, y);
  }

}

 function shotHandleEffect(game, effect, x, y, dx, dy) {
   var entry = {
     effect: effect,
     start: game.time.now,
     lastShot: game.time.now
   };
   shotCurrentEffects.push(entry);
   console.log('handle effect');
 }

 function shotHandleLogic(game) {
   shotHandleEffectsLogic(game);
 }

 function shotHandleEffectsLogic(game) {
   for (var i = shotCurrentEffects.length - 1; i >= 0; i--) {
     const entry = shotCurrentEffects[i];
     if (game.time.now >= entry.start + entry.effect.time) {
       shotCurrentEffects.splice(i, 1);
     }
     shotHandleSingleEffect(game, entry);
   }
 }

 function shotHandleSingleEffect(game, entry) {
   if (player == null) return;
   const px = player.x;
   if (entry.effect.type == EFFECT_TYPE_SKY) {
      if (game.time.now >= entry.lastShot + entry.effect.reload) {
        const sx = (Math.random()*2.0 - 1) * entry.effect.range + px;
        shotShoot(game, true, entry.effect.shoot, sx, 0, Math.random()*2.0 - 1, 1, false);
        entry.lastShot = game.time.now;
      }
   } else {
     throw new 'Unkown effect type: ' + entry.effect.type;
   }
 }

// TODO: Some duplicate code here in these two functions
// TODO: Consider doing player group..

function shotHitPlayer(game, shot) {
  if (shot.xDestroyed) return; // avoid duplicate hits
  shot.xDestroyed = true;
  if (shot.xInfo.damage) playerDealDamage(game, shot.xInfo.damage, shot);
  if(shot.xInfo.punch) {
    const px = shot.body.velocity.x * shot.xInfo.punch;
    const py = shot.body.velocity.y * shot.xInfo.punch;
    playerPunch(game, px, py, shot);
  }
  if (shot.xInfo.poison) {
    playerPoison(game, shot.xInfo.poison);
  }
  // TODO: Can player be freezed
  shotDestroy(game, shot);
}

function shotHitEnemy(game, shot, enemy) {
  if (shot.xDestroyed) return; // avoid duplicate hits
  shot.xDestroyed = true;
  if (shot.xInfo.damage) enemyDealDamage(game, enemy, shot.xInfo.damage, shot);
  if(shot.xInfo.punch) {
    const px = shot.body.velocity.x * shot.xInfo.punch;
    const py = shot.body.velocity.y * shot.xInfo.punch;
    enemyPunch(game, enemy, px, py, shot);
  }
  if (shot.xInfo.freeze) {
    enemyFreeze(game, enemy, shot.xInfo.freeze);
  }
  // TODO: Poison enemies
  shotDestroy(game, shot);
}

function shotHitWall(game, shot, wall) {
  if (!shot.xInfo.bounce) {
    shotDestroy(game, shot);
  } else {
    const now = game.time.now;
    if (shot.xLastHitWall == now) return;
    shot.xLastHitWall = now;
    shot.xBounceCount += 1;
    if (shot.xInfo.bounce.count <= shot.xBounceCount) shotDestroy(game, shot);
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
      shotShoot(game, shot.xIsPlayer, spawn.type, shot.x, shot.y, dx, dy, false);
    }
  }
  shot.destroy();
}
