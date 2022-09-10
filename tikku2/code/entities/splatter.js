
"use strict"

function splatterCreate(graph, x, y, vx, vy, aliveTime, game) {
  var s = groupSplatter.create(x, y, graph)
  s.setVelocity(vx, vy)
  s.setGravity(0, 300)
  s.setBounce(0.5)
  s.x_createdAt = game.time.now
  s.x_aliveTime = aliveTime
  return s
}

function splatterDestroy(splatter, game) {
  if (splatter.x_alreadydead) return
  splatter.x_alreadyDead = true
  splatterRelease(splatter)
}

function splatterRelease(splatter) {
  splatter.destroy()
}

function splatterHandleDef(def, x, y, game) {

  if (def.count) {
    for (var i = 0; i < def.count; i++) {
      const vx = def.speed * Math.cos(Math.random()*Math.PI*2)
      const vy = def.speed * Math.sin(Math.random()*Math.PI*2)
      splatterCreate(def.graph, x, y, vx, vy, def.time, game)
    }
  }

  if (def.explosion) {
    const s = splatterCreate(def.graph, x, y, 0.0, 0.0, def.time, game)
    s.setGravity(0.0, 0.0)
    s.setImmovable(true)
  }

}

function splatterLogic(splatter, game) {
  const ca = splatter.x_createdAt
  const at = splatter.x_aliveTime
  const t = (game.time.now - ca) / at
  if (t > 1) {
    splatterDestroy(splatter, game)
  } else {
    splatter.setAlpha(1.0 - t)
  }
}
