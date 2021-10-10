
"use strict";

// Player variables

// This is used by e.g. enemies and plaaying souds
var playerLocation = { x: 0, y: 0}


var player = null;
var playerHealth = 100.0;
var playerMana = 100.0;
var playerLastRegen = null;

var playerLeftSpell = playerStatsGetInitialSpell();
var playerRightSpell = null;
var playerLeftSpellLast = 0;
var playerRightSpellLast = 0;


function playerHandleLogic(game, curTime) {

  if (player == null) return;

  playerLocation.x = player.x;
  playerLocation.y = player.y;

  magichandleObjectTint(game, player);

  var ld = inputA.isDown;
  var rd = inputD.isDown;
  var jump = inputSpace.isDown;
  var tdown = player.body.blocked.down;

  var moveLeft = ld && !rd;
  var moveRight = rd && !ld;

  const vx = player.body.velocity.x;
  const vy = player.body.velocity.y;

  var moveAcc = playerStats.speed;
  var playerJumpAmount = playerStats.jump;
  if (player.xFreeze) {
    moveAcc = moveAcc / 2.0;
    playerJumpAmount = playerJumpAmount / 2.0;
  }

  if (moveLeft && vx > -250) {
    player.setGravityX(-moveAcc - 2.0*vx);
    //player.setVelocityX(-300);
  } else if (moveRight && vx < 250) {
    player.setGravityX(moveAcc - 2.0*vx);
    //player.setVelocityX(300);
  } else {
    player.setGravityX(-4.0 * vx);
    //player.setVelocityX(0);
  }

  // Handle jumping
  var grav = 400;
  if (jump && tdown) {
    player.setVelocityY(-playerJumpAmount);
  }
  if (jump) {
    if (vy < -120) {
      grav = 100;
    } else {
      grav = 400;
    }

  }
  player.setGravityY(grav);

  // Shooting
  var dx = game.cameras.main.worldView.x + game.input.mousePointer.x - player.x;
  var dy = game.cameras.main.worldView.y + game.input.mousePointer.y - player.y;
  var len = Math.sqrt(dx*dx + dy*dy);
  if (len == 0) len = 1; // NaN guard
  dx = dx / len;
  dy = dy / len;

  // Shoot (if we're not in tab menu)
  if (!inputTab.isDown) {
    if(game.input.activePointer.leftButtonDown()) {
      playerLeftSpellLast = playerHandleSpell(game, playerLeftSpell, playerLeftSpellLast, dx, dy);
    }
    if (game.input.activePointer.rightButtonDown()) {
      playerRightSpellLast = playerHandleSpell(game, playerRightSpell, playerRightSpellLast, dx, dy);
    }
  }

  // Regeneration
  if (playerLastRegen == null) playerLastRegen = game.time.now;
  const dt = game.time.now - playerLastRegen;
  // TODO: poison needs to be refactored to be consistent with enemies
  if (player.xPoison) playerUpdateHealth(game, -dt * 3.0 / 1000.0);
  if (playerStats.manaRegen != 0) playerUpdateMana(game, playerStats.manaRegen * dt / 1000.0);
  if (playerStats.healthRegen != 0) playerUpdateHealth(game, playerStats.healthRegen * dt / 1000.0);
  playerLastRegen = game.time.now;

  // Falling to death
  if (player != null) {
    if (player.y >= mapBlueprint.y * 80.0 - 40.0) {
      playerUpdateHealth(game, -1000);
    }
  }
}

// Choose a spell if is different than the last one
function playerChooseSpell(game, spell, isLeft) {
  if (isLeft) {
    playerLeftSpell = spell;
    playerLeftSpellLast = game.time.now;
  } else {
    playerRightSpell = spell;
    playerRightSpell = game.time.now;
  }
}

function playerHandleSpell(game, spell, last, dx, dy) {
  // TODO: handle magic types and player properties in cost and reload times
  if(spell == null) return last;
  const curTime = game.time.now;
  const reloadTime = spell.reload;
  if (curTime < last + reloadTime) return last;
  const manaCost = spell.cost;
  if (playerUseManaIfCan(game, manaCost)) {
    if (spell.shoot) {
        shotShoot(game, true, spell.shoot, player.x, player.y, dx, dy, true);
    }
    if (spell.effect) shotHandleEffect(game, spell.effect, player.x, player.y, dx, dy);
    if (spell.jump) playerAddJump(game, spell.jump);
    if (spell.heal) playerHeal(game, spell.heal);
    if (spell.sound) soundRequestEnv(game, spell.sound, player.x, player.y);
    return curTime;
  }
  return last;
}

// Handle fly spell effect
function playerAddJump(game, amount) {
  if (player == null) return;
  const cvx = player.body.velocity.x;
  const cvy = player.body.velocity.y;
  var delta = -amount;
  player.setVelocity(cvx, cvy + delta);
}

function playerHeal(game, amount) {
  playerUpdateHealth(game, amount);
}

function playerDealDamage(game, player, amount, shot) {
  const damage = magicCalculateDamageAndAddText(game, shot.x, shot.y, amount, shot.xInfo.type, playerStats.airDef, playerStats.waterDef, playerStats.fireDef, playerStats.earthDef);
  playerUpdateHealth(game, -amount);
}

function playerUseManaIfCan(game, cost) {
  if (playerMana >= cost) {
    playerUpdateMana(game, -cost);
    return true;
  }
  return false;
}

function playerUpdateHealth(game, amount) {
  const before = playerHealth;
  playerHealth += amount;
  if (playerHealth <= 0.0) {
    player.destroy();
    player = null;
    playerHealth = 0.0;
  }
  if (playerHealth > 100.0) playerHealth = 100.0;
  if (playerHealth != before) uiUpdateHealthBar(game);
}

function playerUpdateMana(game, amount) {
  const before = playerMana;
  playerMana += amount;
  if (playerMana < 0.0) playerMana = 0.0;
  if (playerMana > 100.0 ) playerMana = 100.0;
  if (playerMana != before) uiUpdateManaBar(game);
}
