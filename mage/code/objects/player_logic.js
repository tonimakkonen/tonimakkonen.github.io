
"use strict";

// Player variables

var player = null;
var playerHealth = 100.0;
var playerMana = 100.0;
var playerLastRegen = null;

var playerLeftSpell = SPELLS.get(SPELL_BALL_LIGHTNING);
var playerRightSpell = SPELLS.get(SPELL_FIRE_STORM);
var playerLeftSpellLast = 0;
var playerRightSpellLast = 0;



function playerHandleLogic(game, curTime) {

  if (player == null) return;

  var ld = inputA.isDown;
  var rd = inputD.isDown;
  var jump = inputSpace.isDown;
  var tdown = player.body.blocked.down;

  var moveLeft = ld && !rd;
  var moveRight = rd && !ld;

  const vx = player.body.velocity.x;
  const vy = player.body.velocity.y;

  if (moveLeft && vx > -500) {
    player.setGravityX(-700 - 2.0*vx);
    //player.setVelocityX(-300);
  } else if (moveRight && vx < 500) {
    player.setGravityX(700 - 2.0*vx);
    //player.setVelocityX(300);
  } else {
    player.setGravityX(-2.0 * vx);
    //player.setVelocityX(0);
  }

  var grav = 400;

  if (jump && tdown) {
    player.setVelocityY(-250);
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

  // Shoot
  if(game.input.activePointer.leftButtonDown()) {
    playerLeftSpellLast = playerHandleSpell(game, playerLeftSpell, playerLeftSpellLast, dx, dy);
  }
  if (game.input.activePointer.rightButtonDown()) {
    playerRightSpellLast = playerHandleSpell(game, playerRightSpell, playerRightSpellLast, dx, dy);
  }

  // Regeneration
  if (playerLastRegen == null) playerLastRegen = game.time.now;
  const dt = game.time.now - playerLastRegen;
  // TODO: Make use of more generic player propertioes
  playerHeal(game, dt * 2.0 / 1000.0); // 2 per sec
  playerUpdateMana(game, dt * 5.0 / 1000.0); // 5 per sec
  playerLastRegen = game.time.now;
}

function playerHandleSpell(game, spell, last, dx, dy) {
  // TODO: handle magic types and player properties in cost and reload times
  if(spell == null) return last;
  const curTime = game.time.now;
  const reloadTime = spell.reload;
  if (curTime < last + reloadTime) return last;
  const manaCost = spell.cost;
  if (playerUseManaIfCan(game, manaCost)) {
    shotShoot(game, true, spell.shoot, player.x, player.y, dx, dy);
    return curTime;
  }
  return last;
}

function playerHeal(game, amount) {
  playerUpdateHealth(game, amount);
}

function playerDealDamage(game, amount, shot) {
  // TODO: Consider type, kick effect etc?
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
