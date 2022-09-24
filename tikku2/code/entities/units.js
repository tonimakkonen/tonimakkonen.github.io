
"use strict";

function unitCreate(type, xpos, ypos, player, grid, game) {

  // Do not spaw outside border
  if (xpos < 0 || xpos > CONFIG_WIDTH ||  ypos > CONFIG_HEIGHT - 2*CONFIG_BLOCK - 5) return

  var group
  var graphName
  var newUnit

  if (player == PLAYER_BLUE) {
    group = groupBlueUnits
    graphName = 'blue_'
  } else if (player == PLAYER_RED) {
    group = groupRedUnits
    graphName = 'red_'
  } else {
    throw "Unkown player: " + player
  }
  var props = configUnits.get(type);
  if (props == null) {
    console.error('Unknown unit type: ' + type)
    return
  }
  graphName += props.graph
  newUnit = group.create(xpos, ypos, graphName)
  newUnit.x_player = player
  newUnit.x_type = type
  newUnit.x_health = props.health
  newUnit.x_lastShot = undefined
  newUnit.x_lastJump = undefined
  newUnit.x_lastSpawn = undefined
  newUnit.x_spawnCount = 0
  newUnit.x_props = props
  if (props.building) {
    newUnit.setImmovable(true)
    newUnit.x_healthBar = game.add.rectangle(xpos, ypos-props.width/2, props.width*0.75, 2, 0x00ff00)
    newUnit.x_healthBar.setDepth(1)
  } else if (props.immovable) {
    newUnit.setImmovable(true)
  } else {
    const gravityMult = props.gravity != undefined ? props.gravity : 1.0
    newUnit.setGravity(0.0, gravityMult * 300.0)
    newUnit.setBounce(0.2)
  }
  if (props.mass) newUnit.setMass(props.mass)
  newUnit.x_grid = grid
  return newUnit
}

function unitAi(unit, game) {
  var props = unit.x_props;
  if (props.velocity) unitHandleVelocity(unit, props.velocity, game)
  if (props.fly) unitHandleFly(unit, props.fly, game)
  if (props.hover) unitHandleHover(unit, props.hover, game)
  unitHandleJump(unit, game)
  unitHandleShot(unit, game)
  unitHandleSpawn(unit, game)
  if (props.suicide) unitHandleSuicide(props.suicide, unit, game)

  // kill units off map
  if (unit.x < 0 || unit.x > CONFIG_WIDTH) unit.destroy()
}

function unitHandleVelocity(unit, velocity, game) {
  if (unit.x_alreadyDead) return
  var toEnemy = unit.x_player == PLAYER_BLUE ? 1 : -1;
  if (unit.x_lastVelocity == undefined || game.time.now > unit.x_lastVelocity + velocity.time) {
    unit.x_lastVelocity = game.time.now
    unit.setVelocityX(toEnemy * velocity.speed)
  }
}

function unitHandleJump(unit, game) {
  if (unit.x_alreadyDead) return
  var p = unit.x_props
  if (p.jump) {
    if (p.jump.below && unit.y < p.jump.below) return
    if (p.jump.feetOnGround && unit.body.touching.down || !p.jump.feetOnGround) {
      if (unit.x_lastJump === undefined || game.time.now > unit.x_lastJump + p.jump.time) {
        unit.x_lastJump = game.time.now
        if (Math.random() < p.jump.prob) {
          unit.setVelocityY(unit.body.velocity.y - p.jump.speed)
        }
      }
    }
  }
}

function unitHandleFly(unit, fly, game) {
  if (unit.x_lastFly == undefined || game.time.now > unit.x_lastFly + fly.time) {
    unit.x_lastFly = game.time.now
    const vy = Math.random() * (fly.max - fly.min) + fly.min
    unit.setVelocityY(vy)
  }
  if (fly.below && unit.y < fly.below && unit.body.velocity.y < 0) unit.setVelocityY(-unit.body.velocity.y)
}

function unitHandleHover(unit, hover, game) {
  var toEnemy = unit.x_player == PLAYER_BLUE ? 1 : -1
  if (unit.x_lastHover == undefined || game.time.now > unit.x_lastHover + hover.time) {
    unit.x_lastHover = game.time.now
    const x = toEnemy > 0 ? hover.x : CONFIG_WIDTH - hover.x
    const y = hover.y
    const targetX = x + (Math.random() - 0.5)*hover.dx
    const targetY = y + (Math.random() - 0.5)*hover.dy
    const dx = targetX - unit.x
    const dy = targetY - unit.y
    const dis = Math.sqrt(dx*dx + dy*dy)
    if (dis > 0) unit.setVelocity(hover.speed * dx / dis, hover.speed * dy / dis)
  }
}

function unitHandleShot(unit, game) {
  if (unit.x_alreadyDead) return
  const toEnemy = unit.x_player == PLAYER_BLUE ? 1 : -1
  const xte = toEnemy > 0 ? unit.x : CONFIG_WIDTH - unit.x
  var props = unit.x_props
  if (props.shoot) {
    var shoot = props.shoot;
    
    if (shoot.after && xte < shoot.after) return

    if (unit.x_lastShot === undefined || game.time.now > unit.x_lastShot + shoot.time) {
      unit.x_lastShot = game.time.now;
      var vel = shoot.speed
      var a = Math.PI * (shoot.amin + Math.random()*(shoot.amax - shoot.amin))/180.0
      var vx = toEnemy * Math.cos(a) * vel
      var vy = -Math.sin(a) * vel
      shotCreate(shoot.type, unit.x, unit.y, vx, vy, unit.x_player, game)
    }
  }
}

function unitHandleSpawn(unit, game) {
  if (unit.x_alreadyDead) return
  var props = unit.x_props

  // Do not spawn from buildings at the end of the turn
  if (props.building && (game.time.now - combatStart) / 1000.0 > CONFIG_MAX_SPAWN) return

  var spawn = props.spawn
  if (spawn) {

    // Do not spawn if span count exceeded
    if (spawn.maxTimes && unit.x_spawnCount >= spawn.maxTimes) return

    if (unit.x_lastSpawn === undefined || game.time.now > unit.x_lastSpawn + spawn.time) {
      unit.x_lastSpawn = game.time.now
      unit.x_spawnCount += 1
      const count = spawn.count ? spawn.count : 1
      const radius = spawn.radius ? spawn.radius : 0.0
      for (var i = 0; i < count; i++) {
        const dx = radius * Math.cos(i*Math.PI*2 / count)
        const dy = radius * Math.sin(i*Math.PI*2 / count)
        unitCreate(spawn.unit, unit.x + dx, unit.y + dy, unit.x_player, undefined, game)
      }
    }
  }

}

function unitHit(unit, shot, game) {
  if (unit.x_alreadyDead) return
  unitUpdateHealth(unit, -shot.x_props.damage, game)
}

function unitUpdateHealth(unit, amount, game) {
  unit.x_health += amount
  if (unit.x_health > unit.x_props.health) unit.x_health = unit.x_props.health
  if (unit.x_health <= 0) {
    unitDestroy(unit, game)
    return
  }
  if (unit.x_healthBar) {
    var fraction = unit.x_health / unit.x_props.health;
    var newWidth = unit.x_props.width * 0.75 * fraction;
    if (fraction >= 0.5) {
        unit.x_healthBar.setFillStyle('0x00ff00');
    } else if (fraction < 0.5 && fraction >= 0.25) {
        unit.x_healthBar.setFillStyle('0xffff00');
    } else {
        unit.x_healthBar.setFillStyle('0xff0000');
    }
    unit.x_healthBar.setSize(newWidth, 2);
  }
}

function unitDestroy(unit, game) {
  if (unit.x_alreadyDead) return
  unit.x_alreadyDead = true

  const p = unit.x_props

  // win/lose flag
  if (p.base) gameLoseFlag = unit.x_player

  // death effects
  if (p.death) {

    // spawn
    if (p.death.spawn) {
      const height = p.height ? p.height : CONFIG_BLOCK
      const deltay = (CONFIG_BLOCK - height) / 2
      const y = unit.y - deltay
      for (var i = 0; i < p.death.spawn.count; i++) {
        const x = unit.x + Math.random()*10.0
        unitCreate(p.death.spawn.type, x, y, unit.x_player, undefined, game)
      }
    }

    if (p.death.splatter) splatterHandleDef(p.death.splatter, unit.x, unit.y, game)
    if (p.death.shoot) shotHandleDef(p.death.shoot, unit.x, unit.y, unit.x_player, game)
  }

  unitRelease(unit)
}

function unitHandleSuicide(def, unit, game) {
  const xte = unit.x_player == PLAYER_BLUE ? unit.x : CONFIG_WIDTH - unit.x
  if (xte < def.after) return
  if (xte > def.before) {
    unitDestroy(unit, game)
    return
  }
  if (unit.x_lastSuicide == undefined || game.time.now > unit.x_lastSuicide + def.time) {
    unit.x_lastSuicide = game.time.now
    if (Math.random() < def.prob) unitDestroy(unit, game)
  }
}

function unitRelease(unit) {

  if (unit.x_healthBar) unit.x_healthBar.destroy()
  unit.x_healthBar = undefined

  if (unit.x_grid) {
    unit.x_grid.building = undefined
  }

  unit.destroy()
}
