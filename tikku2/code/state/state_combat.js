
"use strict"

var combatStart = undefined
var combatText = undefined
var combatResourceSpawn = undefined

function stateCombatUpdate(game) {

  if (!combatStart) stateCombatStart(game)

  // Update text
  combatUpdateText(game)

  // Spawn resources
  if (combatResourceSpawn.length >= 1) {
    const time = combatResourceSpawn[0]
    if (game.time.now > time) {
      combatResourceSpawn.shift()
      const x = CONFIG_WIDTH * (0.25 + Math.random()*0.5)
      const nr = groupResources.create(x, 0, 'resource')
      nr.setGravity(0, 300)
      nr.setBounce(0.5)
    }
  }

  // If a lose flag isupdated
  if (gameLoseFlag) {
    gameState = GAME_STATE_WIN
    stateCombatEnd(game)
    return
  }

  // If we are done with this combat turn
  if (game.time.now > combatStart + CONFIG_COMBAT_LEN * 1000.0) {
    gameState = GAME_STATE_BUY
    stateCombatEnd(game)
    return
  }

  // Run unit AI
  groupBlueUnits.children.each(function(unit) { unitAi(unit, game) }, game)
  groupRedUnits.children.each(function(unit) { unitAi(unit, game) }, game)
  // Shot logic
  groupBlueShots.children.each(function(shot) { shotAi(shot, game) }, game)
  groupRedShots.children.each(function(shot) { shotAi(shot, game) }, game)
  // Splatter logic
  groupSplatter.children.each((s) => splatterLogic(s, game), game)
}

function stateCombatStart(game) {

  goldUpdateText(game)

  combatStart = game.time.now
  combatText = game.add.text(CONFIG_WIDTH*0.5 - 120, CONFIG_HEIGHT - CONFIG_BLOCK*0.5, "", {'color': '#FFFFFF'})
  combatText.setOrigin(0.0, 0.5)

  // Update resource spawn
  const delta = 1000.0 * CONFIG_MAX_SPAWN / (round + 1.0)
  combatResourceSpawn = []

  for (var i = 0; i < round; i++) combatResourceSpawn.push(game.time.now + (i+1)*delta)
}

function stateCombatEnd(game) {
  combatStart = undefined
  if (combatText) combatText.destroy()

  groupBlueUnits.children.each((unit) => combatEndTurnForUnit(unit, game), game)
  groupRedUnits.children.each((unit) => combatEndTurnForUnit(unit, game), game)
  groupBlueShots.children.each((shot) => shotRelease(shot), game)
  groupRedShots.children.each((shot) => shotRelease(shot), game)
  groupSplatter.children.each((splatter) => splatterRelease(splatter), game)

  blueGold += 300
  if (blueAi == AI_DIFFICULT) blueGold += 100
  redGold += 300
  if (redAi == AI_DIFFICULT) redGold += 100

  round += 1
}

function combatEndTurnForUnit(unit, game) {
  const p = unit.x_props
  if (p.building) {
    unit.x_lastSpawn = undefined
    unit.x_lastShot = undefined
    unit.x_spawnCount = 0
    if (p.heal) unitUpdateHealth(unit, p.heal, game)
  } else {
    unitRelease(unit)
  }
}

function combatUpdateText(game) {
  const secsElapsed = (game.time.now - combatStart) / 1000.0
  const noSpawn = secsElapsed >= CONFIG_MAX_SPAWN
  var secsRemaining = (CONFIG_COMBAT_LEN - secsElapsed).toFixed(1)
  if (secsRemaining < 0) secsRemaining = 0
  if (noSpawn) combatText.setText('Combat round ' + round + ' : ' + secsRemaining + ' (end of round)')
  else combatText.setText('Combat round ' + round + ' : ' + secsRemaining)
  combatText.setOrigin(0.0, 0.5)
}
