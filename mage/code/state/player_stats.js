
"use strict";

var playerProgress = {
  skills: [],
  spellBooks: 0
}

var playerStats = playerStatsZero();

function playerStatsZero() {
  return {
    healthRegen: 0.0,
    manaRegen: 2.5,
    airDef: 0.0,
    waterDef: 0.0,
    fireDef: 0.0,
    earthDef: 0.0,
    spells: [],
  }
}

function playerStatsUpdate() {
  playerStats = playerStatsZero();
  for (var i = 0; i < playerProgress.skills.length; i++) {
    const cs = playerProgress.skills[i];
    const skill = SKILLS.get(cs);
    if (skill.spell) playerStats.spells.push(skill.spell);
  }
}

// Reset player stats when e.g. dying
function playerStatsReset() {

}

// Set random player stats (used for testing basically)
function playerStatsSetRandom() {
}

function playerStatsGetInitialSpell() {
  // TODO
  return null;
}
