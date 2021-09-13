
"use strict";

// Player variables

const playerJumpAmount = 250;

// This is used by a lot of effects
var playerLocation = { x: 0, y: 0}


var player = null;
var playerHealth = 100.0;
var playerMana = 100.0;
var playerLastRegen = null;

var playerLeftSpell = SPELLS.get(SPELL_BALL_LIGHTNING);
var playerRightSpell = null;
var playerLeftSpellLast = 0;
var playerRightSpellLast = 0;


function playerHandleLogic(game, curTime) {

  if (player == null) return;

  playerLocation.x = player.x;
  playerLocation.y = player.y;

  if (player.xPoison) {
    if (game.time.now > player.xPoison) {
      player.xPoison = undefined;
      player.clearTint();
    }
  }

  var ld = inputA.isDown;
  var rd = inputD.isDown;
  var jump = inputSpace.isDown;
  var tdown = player.body.blocked.down;

  var moveLeft = ld && !rd;
  var moveRight = rd && !ld;

  const vx = player.body.velocity.x;
  const vy = player.body.velocity.y;

  if (moveLeft && vx > -250) {
    player.setGravityX(-800 - 2.0*vx);
    //player.setVelocityX(-300);
  } else if (moveRight && vx < 250) {
    player.setGravityX(800 - 2.0*vx);
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
  if (player.xPoison) playerDealDamage(game, dt * 3.0 / 1000.0);
  playerUpdateMana(game, dt * 5.0 / 1000.0); // 5 per sec
  playerLastRegen = game.time.now;
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
    if (spell.shoot) shotShoot(game, true, spell.shoot, player.x, player.y, dx, dy, true);
    if (spell.effect) shotHandleEffect(game, spell.effect, player.x, player.y, dx, dy);
    if (spell.jump) playerAddJump(game, spell.jump);
    if (spell.heal) playerHeal(game, spell.heal);
    return curTime;
  }
  return last;
}

// Handle fly spell effect
// Note: if we're one the ground, add extra jump
function playerAddJump(game, amount) {
  if (player == null) return;
  const cvx = player.body.velocity.x;
  const cvy = player.body.velocity.y;
  var delta = -amount;
  if (player.body.blocked.down) delta -= playerJumpAmount;
  console.log(delta);
  player.setVelocity(cvx, cvy + delta);
}

function playerHeal(game, amount) {
  playerUpdateHealth(game, amount);
}

function playerDealDamage(game, amount, shot) {
  playerUpdateHealth(game, -amount);
}

function playerPunch(game, px, py, shot) {
  if(player == null) return;
  const playerMass = 1.0;
  const vx = player.body.velocity.x;
  const vy = player.body.velocity.y;
  player.setVelocity(vx + px / playerMass, vy + py / playerMass);
}

function playerPoison(game, amount) {
  if (player == null) return;
  if (!player.xFreeze) player.xPoison = game.time.now;
  var playerMass = 1.0;
  player.xPoison += amount / playerMass;
  player.setTint(0x20ff20);
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
