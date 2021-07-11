
"use strict";

// Handle player movement

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

  // Shoot (move elsewhere)
  if (game.input.activePointer.leftButtonDown() && curTime - lastShot > 250) {
    shotShoot(game, true, SHOT_FIRE, player.x, player.y, dx, dy);
    lastShot = curTime;
  }

  if (game.input.activePointer.rightButtonDown() && curTime - lastShot > 250) {
    shotShoot(game, true, SHOT_ELECTRIC, player.x, player.y, dx, dy);
    lastShot = curTime;
  }

}

function playerDealDamage(game, amount, type) {
  // TODO: Consider type, kick effect etc?
  playerHealth -= amount;
  if (playerHealth <= 0.0) {
    player.destroy();
    player = null;
    playerHealth = 0.0;
  }
  uiUpdateHealthBar(game);
}
