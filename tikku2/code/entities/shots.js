
"use strict";

function shotCreate(type, xpos, ypos, xvel, yvel, player, game) {

  var group
  var newShot

  if (player == PLAYER_BLUE) group = groupBlueShots
  else if (player == PLAYER_RED) group = groupRedShots
  else throw "bad player: " + player

  var props = configShots.get(type);
  if (props == null) throw "bad shot type: " + type

  newShot = group.create(xpos, ypos, props.graph)
  if (props.leftRight && xvel < 0) newShot.setFlipX(true)
  newShot.x_props = props
  newShot.x_player = player
  newShot.setVelocity(xvel, yvel)

  const gravMult = props.gravity != undefined ? props.gravity : 1.0
  newShot.setGravity(0.0, 300.0 * gravMult)
  return newShot
}

function shotDestroy(shot, game) {
  if (shot.x_alreadyDead) return
  shot.x_alreadyDead = true

  const p = shot.x_props
  if (p.death) {
    const d = p.death
    if (d.spawn) {
      const svx = shot.body.velocity.x
      const svy = shot.body.velocity.y
      const sv = Math.sqrt(svx*svx + svy*svy)
      var spawnX = shot.x
      var spawnY = shot.y
      if (sv > 0) {
        spawnX -= 5*svx / sv
        spawnY -= 5*svy / sv
      }
      for (var i = 0; i < d.spawn.count; i++) {
        const vx = d.spawn.speed * Math.cos(Math.random()*Math.PI*2)
        const vy = d.spawn.speed * Math.sin(Math.random()*Math.PI*2)
        shotCreate(d.spawn.type, spawnX, spawnY, vx, vy, shot.x_player, game)
      }
    }

    if (d.splatter) splatterHandleDef(d.splatter, shot.x, shot.y, game)
  }

  shotRelease(shot)
}

function shotRelease(shot) {
  shot.destroy()
}

function shotHandleDef(def, x, y, player, game) {
  for (var i = 0; i < def.count; i++) {
    const ra = Math.random()*Math.PI*2
    const vx = def.speed * Math.cos(ra)
    const vy = def.speed * Math.sin(ra)
    shotCreate(def.type, x, y, vx, vy, player, game)
  }
}

function shotAi(shot, game) {
  if (shot.x_alreadyDead) return
  if (shot.x < 0 || shot.x > CONFIG_WIDTH) shot.destroy()
}
