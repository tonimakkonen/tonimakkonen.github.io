
"use strict"

function stateCombatUpdate(game) {
  // Run unit AI
  groupBlueUnits.children.each(function(unit) { unitAi(unit, game) }, game)
  groupRedUnits.children.each(function(unit) { unitAi(unit, game) }, game)
  // Shot logic
  groupBlueShots.children.each(function(shot) { shotAi(shot, game) }, game)
  groupRedShots.children.each(function(shot) { shotAi(shot, game) }, game)
}
