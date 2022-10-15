
"use strict"

var swarmLastSpawnBlue = new Map()
var swarmLastSpawnRed = new Map()

function swarmUpdate(game) {

  // do not spawn anything when in end phase
  if (game.time.now > combatStart + CONFIG_MAX_SPAWN*1000) return

  if (playerGetAi(PLAYER_BLUE) == AI_SWARM) swarmLogic(game, swarmLastSpawnBlue, PLAYER_BLUE)
  if (playerGetAi(PLAYER_RED) == AI_SWARM) swarmLogic(game, swarmLastSpawnRed, PLAYER_RED)
}

function swarmReset() {
  swarmLastSpawnBlue = new Map()
  swarmLastSpawnRed = new Map()
}

function swarmLogic(game, lastSpawn, player) {
  const prp = configRaces.get(playerGetRace(player))
  const swarm = prp.swarm
  for (const unit of swarm) swarmConsiderSpawn(game, lastSpawn, unit, player)
}

function swarmConsiderSpawn(game, lastSpawn, unit, player) {

  // Do not spawn a unit at the start, mark as last spawned now
  if (!lastSpawn.get(unit.unit)) {
    lastSpawn.set(unit.unit, game.time.now)
    return
  }

  const nextSpawn = lastSpawn.get(unit.unit) + unit.time * Math.pow(0.8, round)
  if (game.time.now >= nextSpawn) {
    lastSpawn.set(unit.unit, nextSpawn)
    unitCreate(unit.unit, playerGetX(player, CONFIG_BLOCK*0.5), unit.y, player, undefined, game)
  }

}
