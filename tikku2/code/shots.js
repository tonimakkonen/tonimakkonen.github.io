
"use strict";

function shotCreate(type, xpos, ypos, xvel, yvel, player, game) {

  var group
  var newShot

  if (player == PLAYER_BLUE) {
      group = groupBlueShots
  } else if (player == PLAYER_RED) {
      group = groupRedShots
  } else {
      throw "bad player: " + player
  }

  var props = configShots.get(type);
  if (props == null) {
      throw "bad shot type: " + type
  }

  newShot = group.create(xpos, ypos, props.graph)
  newShot.x_props = props
  newShot.setVelocity(xvel, yvel)
  newShot.setGravity(0, 300)
  return newShot
}

function shotDestroy(shot, game) {
  if (shot.x_alreadyDead) return
  shot.x_alreadyDead = true;
  shot.destroy()
}

function shotAi(shot, game) {
  if (shot.x_alreadyDead) return
  if (shot.x < 0 || shot.x > CONFIG_WIDTH) shot.destroy()
}
