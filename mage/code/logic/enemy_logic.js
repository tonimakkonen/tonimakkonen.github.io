
"use strict";

// Destroy all enemies
function enemyDestroyAll() {
  listEnemies.forEach(o => { enemyDestroy(o); });
  listEnemies = [];
}

function enemyDestroy(enemy) {
  if (enemy.xHealthBar) enemy.xHealthBar.destroy();
  enemy.destroy();
}

function enemyKill(game, enemy) {
  // TODO: drops, splatter, etc..
}

function enemyCreate(game, enemyType, x, y) {

  var info = ENEMIES.get(enemyType);
  if (!info) throw 'Unknown enemy type: ' + enemyType;
  var graph = GRAPHS.get(info.graph);
  if (!graph) throw 'Unkown graph: ' + info.graph;

  var newEnemy = groupEnemies.create(x, y, graph.name);
  if (info.immovable) {
    newEnemy.setImmovable(true);
    groupPlayerBlocks.add(newEnemy);
    newEnemy.xImmovable = true;
  }
  listEnemies.push(newEnemy);
  newEnemy.setDepth(Z_ACTION);

  // Add health bar
  const healthBar = game.add.rectangle(x, y - newEnemy.height / 2.0, newEnemy.width, 6.0, 0xff0000);
  healthBar.setDepth(9.0); // TODO
  healthBar.setAlpha(0.5);
  healthBar.setVisible(false);
  newEnemy.xHealthBar = healthBar;

  // Add some variables
  newEnemy.xType = enemyType;
  newEnemy.xInfo = info;
  newEnemy.xGraph = graph;
  newEnemy.xHealth = info.health;
  newEnemy.xRandom = Math.random(); // E.g. sway effects and such
  newEnemy.xLastJump = 0;
  newEnemy.xLastShot1 = 0.0;
  newEnemy.xLastShot2 = 0.0;
  newEnemy.xLastSpawn = 0.0;
  newEnemy.xlastAnim = null;
  newEnemy.xMass = info.mass === undefined ? 1.0 : info.mass;

  newEnemy.setCollideWorldBounds(true);

  // Set properties based on movement modes
  // Some enemies have no movement
  if (info.moveBounce) {
    newEnemy.setBounce(0.4, 0.4);
  } else if (info.moveWalk) {
    newEnemy.setBounce(0.1, 0.1);
  } else if (info.moveFloat) {
    newEnemy.setBounce(0.8, 0.8);
  }

  // For any constant animations, just set it playing here
  // Other enemies change their animation based on behaviour
  if (graph.type == GRAPH_TYPE_ANIM_3) {
    newEnemy.anims.play(graph.name + '_anim');
  }

}

function enemyHandleLogic(game, enemy, curTime) {

  if (enemy.xHealth <= 0.0) {
    enemyKill(game, enemy);
    return false; // Calling method handles removing from list
  }

  // change health bar location
  if (enemy.xHealthBar) enemy.xHealthBar.setPosition(enemy.x, enemy.y - enemy.height / 2.0);

  magichandleObjectTint(game, enemy);

  // frozed enemies
  // TODO: Poisoned enemies damage
  if (enemy.xFreeze) {
    // Do not reload shots while frozen
    enemy.xLastShot1 = game.time.now;
    enemy.xLastShot2 = game.time.now;
    if (enemy.xInfo.immovable) return true;
    // TODO: what coefficient?
    enemy.setGravity(-enemy.body.velocity.x, 400);
    return true;
  }

  // Towards player
  const dx = playerLocation.x - enemy.x;
  const dy = playerLocation.y - enemy.y;
  var len = Math.sqrt(dx*dx + dy*dy);
  if (len == 0) len = 1.0; // NaN guard
  const dx1 = dx / len;
  const dy1 = dy / len;

  // If too far away, just freeze enemies and do nothing
  // TODO: Tweak this based on camera
  if (Math.abs(dx) > 80*16 || Math.abs(dy) > 80*9) {
    enemy.setGravity(0, 0);
    enemy.setVelocity(0, 0);
    return true;
  }

  // Handle animation purely based on enemy graph type
  if (enemy.xGraph.type == GRAPH_TYPE_LEFT_RIGHT) {
    const desiredAnim = enemy.xGraph.name + (dx < 0 ? '_left' : '_right');
    if (enemy.xlastAnim != desiredAnim) {
      enemy.anims.play(desiredAnim);
      enemy.xlastAnim = desiredAnim;
    }
  }

  // Handle different movement modes
  if(enemy.xInfo.moveFloat) {
    enemyHandleFloatMove(game, enemy, curTime, enemy.xInfo.moveFloat, dx, dy);
  }
  if (enemy.xInfo.moveBounce) {
    enemyHandleBounceMove(game, enemy, enemy.xInfo.moveBounce, dx, dy);
  }
  if (enemy.xInfo.moveWalk) {
    enemyHandleWalkMove(game, enemy, enemy.xInfo.moveWalk, dx, dy);
  }
  if (enemy.xInfo.moveJump) {
    enemyHandleJump(game, enemy, enemy.xInfo.moveJump, dx, dy);
  }

  // Handle firing & spawn mechanics
  if (enemy.xInfo.shoot1) enemyHandleShot(game, enemy, enemy.xInfo.shoot1, 1, dx1, dy1);
  if (enemy.xInfo.shoot2) enemyHandleShot(game, enemy, enemy.xInfo.shoot2, 2, dx1, dy1);
  if (enemy.xInfo.spawn) enemyhandleSpawn(game, enemy, enemy.xInfo.spawn);

  return true;
}

////////////////////
// Movement modes //
////////////////////

function enemyHandleFloatMove(game, enemy, curTime, move, dx, dy) {

  const acc = move.maxSpeed * move.alpha;

  const dl = Math.sqrt(dx*dx + dy*dy);
  if (dl < 0.001) dl = 1; // NaN guard
  const dx1 = dx / dl;
  const dy1 = dy / dl;
  const vx = enemy.body.velocity.x;
  const vy = enemy.body.velocity.y;

  var desireX = 0.0;
  var desireY = 0.0;

  if (move.above) {
    if (dy < move.minDistance) {
      desireY = -acc;
    } else if (dy > move.maxDistance) {
      desireY = acc;
    }
    if (dx < -move.margin) {
      desireX = -acc;
    } else if (dx > move.margin) {
      desireX = acc;
    }
  } else if (move.towards) {
    if (dl < move.minDistance) {
      desireX = -acc * dx1;
      desireY = -acc * dy1;
    } else if (dl > move.maxDistance) {
      desireX = acc * dx1;
      desireY = acc * dy1;
    }
  } else {
    throw 'No float mode defined: ' + move;
  }

  var swayDir = enemy.xRandom * 2.0 - 1;
  if (swayDir < 0 && swayDir > -0.25) swayDir = -0.25;
  if (swayDir > 0 && swayDir < 0.25) swayDir = 0.25;

  if (move.sway) {
    desireX += move.sway * acc * Math.cos(3.14 * (curTime / 1000.0 + enemy.xRandom));
    desireY += move.sway * acc * Math.sin(3.14 * (curTime / 1000.0 + enemy.xRandom));
  }

  if (move.constantSway) {
    const csx = move.constantSway * Math.cos(swayDir * 3.14 * (curTime / 1000.0 + enemy.xRandom));
    const csy = move.constantSway * Math.sin(swayDir * 3.14 * (curTime / 1000.0 + enemy.xRandom));
    desireX += csx;
    desireY += csy;
  }

  enemy.setGravity(desireX - move.alpha * vx, desireY - move.alpha * vy);
}

function enemyHandleBounceMove(game, enemy, move, dx, dy) {
  // TODO:
  enemy.setGravity(-enemy.body.velocity.x, 400);
}

function enemyHandleWalkMove(game, enemy, move, dx, dy) {
  // Use this factor to slow down movement close to player
  var accFactor = dx / 50.0;
  if (accFactor < -1.0) accFactor = -1.0;
  if (accFactor > 1.0) accFactor = 1.0;
  const desire = accFactor * move.maxSpeed * move.alpha;
  const vx = enemy.body.velocity.x;
  const acc = desire - move.alpha * vx;
  enemy.setGravity(acc, 300); // TODO: gravity!
}

// Handle jump
function enemyHandleJump(game, enemy, move, dx, dy) {
  if (dy < 0 && enemy.body.blocked.down && game.time.now - enemy.xLastJump > move.delay) { // only jump if player is above
    enemy.setVelocityY(-move.velocity);
    enemy.xLastJump = game.time.now;
  }
}

function enemyDealDamage(game, enemy, amount, shot) {
  const damage = magicCalculateDamageAndAddText(game, shot.x, shot.y, amount, shot.xInfo.type, enemy.xInfo.airDef, enemy.xInfo.waterDef, enemy.xInfo.fireDef, enemy.xInfo.earthDef);
  enemyUpdateHealth(game, enemy, -damage, shot);
}

function enemyUpdateHealth(game, enemy, amount) {
  // Note that play state loop will handle destroying enemies
  enemy.xHealth += amount;
  if (enemy.xHealthBar) {
    if (enemy.xHealth < enemy.xInfo.health) enemy.xHealthBar.setVisible(true);
    else enemy.xHealthBar.setVisible(false);
    const newWitdh = enemy.width * Math.max(0.0, enemy.xHealth) / enemy.xInfo.health;
    enemy.xHealthBar.setSize(newWitdh, enemy.xHealthBar.height);
  }
}

function enemyHandleShot(game, enemy, info, type, dx1, dy1) {
  const last = type == 1 ? enemy.xLastShot1 : enemy.xLastShot2;
  const now = game.time.now;
  if (now >= last + info.time) {
    const [dx, dy] = enemyGetShotDirection(info, dx1, dy1);
    shotShoot(game, false, info.type, enemy.x, enemy.y, dx, dy, true);
    type == 1 ? enemy.xLastShot1 = now : enemy.xLastShot2 = now;
  }
}

function enemyGetShotDirection(shotInfo, dx1, dy1) {
  var dx = dx1;
  var dy = dy1;
  if (shotInfo.topBias) {
      dy -= shotInfo.topBias;
      const len = Math.sqrt(dx*dx + dy*dy);
      if (len == 0) {
        dx = 0;
        dy = -1;
      } else {
        dx = dx / len;
        dy = dy / len;
      }
  }
  if (shotInfo.randomAngle) {
    const alpha = (Math.random() - 0.5) * shotInfo.randomAngle * Math.PI / 180.0;
    const ox = -dy;
    const oy = dx;
    const cos = Math.cos(alpha);
    const sin = Math.sin(alpha);
    dx = dx*cos + ox*sin;
    dy = dy*cos + oy*sin;
  }
  return [dx, dy];
}

function enemyhandleSpawn(game, enemy, info) {
  const last = enemy.xLastSpawn;
  const now = game.time.now;
  if (now >= last + info.time) {
    enemyCreate(game, info.type, enemy.x, enemy.y);
    enemy.xLastSpawn = now;
  }
}
