
"use strict";

// TODO:

var playerProgressSave = {
  skills: [],
  spellBooks: 0,
  level: 0,
  started: false
}

var playerProgress = {
  skills: [],
  spellBooks: 0,
  level: 0,
  started: false
}

var playerStats = playerStatsZero();

function playerStatsZero() {
  return {
    healthRegen: 0.0,
    healthRegenText: 'Health regeneration per sec\n',
    manaRegen: 4.0,
    manaRegenText: 'Mana regeneration per sec\n',
    airDef: 0.0,
    airDefText: 'Defence against air\n',
    waterDef: 0.0,
    waterDefText: 'Defence againts water\n',
    fireDef: 0.0,
    fireDefText: 'Defence against fire\n',
    earthDef: 0.0,
    earthDefText: 'Defence againts earth\n',
    speed: 500.0,
    speedText: 'Speed\n',
    jump: 250.0,
    jumpText: 'Jump\n',
    spells: [],
  }
}

function playerStatsUpdate() {
  playerStats = playerStatsZero();
  for (var i = 0; i < playerProgress.skills.length; i++) {
    const cs = playerProgress.skills[i];
    const skill = SKILLS.get(cs);
    if (skill.spell) playerStats.spells.push(skill.spell);
    if (skill.healthRegen) {
      playerStats.healthRegen += skill.healthRegen;
      playerStats.healthRegenText += '\n+' + skill.healthRegen + ' - ' + skill.name;
    }
    if (skill.manaRegen) {
      playerStats.manaRegen += skill.manaRegen;
      playerStats.manaRegenText += '\n+' + skill.manaRegen + ' - ' + skill.name;
    }
    if (skill.airDef) {
      playerStats.airDef += skill.airDef;
      playerStats.airDefText += '\n+' + skill.airDef + ' - ' + skill.name;
    }
    if (skill.waterDef) {
      playerStats.waterDef += skill.waterDef;
      playerStats.waterDefText += '\n+' + skill.waterDef + ' - ' + skill.name;
    }
    if (skill.fireDef) {
      playerStats.fireDef += skill.fireDef;
      playerStats.fireDefText += '\n+' + skill.fireDef + ' - ' + skill.name;
    }
    if (skill.earthDef) {
      playerStats.earthDef += skill.earthDef;
      playerStats.earthDefText += '\n+' + skill.earthDef + ' - ' + skill.name;
    }
    if (skill.speed) {
      playerStats.speed += skill.speed;
      playerStats.speedText += '\n+' + skill.speed +' - ' + skill.name;
    }
    if (skill.jump) {
      playerStats.jump += skill.jump;
      playerStats.jumpText += '\n+' + skill.jump +' - ' + skill.name;
    }
  }
}

// Set up for random level
function playerStatsSetForRandomLevel() {
  console.log('Setting player progress for random level');
  playerProgress.skills = [];
  playerProgress.spellBooks = 10;
  playerStatsUpdate();
}

// Set up for trying a level from the ditor
function playerStatsSetForTesting() {
  console.log('Setting player progress for testing');
  playerProgress.skills = [];
  playerProgress.spellBooks = 999;
  playerStatsUpdate();
}

// When e.g. restaring a level
function playerStatsReset() {
  console.log('Setting current player progress');
  playerProgress = JSON.parse(JSON.stringify(playerProgressSave));
  playerStatsUpdate();
}

// Full save
function playerStatsFullReset() {
  console.log('Full reset for player progress');
  playerProgressSave = {
    skills: [],
    spellBooks: 0,
    level: 0
  }
  playerStatsUpdate();
}

// When completing a level
function playerStatsSave() {
  console.log('Saving player progress to local storage');
  playerProgressSave = JSON.parse(JSON.stringify(playerProgress));
  storageSavePlayerProgress();
}

// Get some initial spell when starting the game
function playerStatsGetInitialSpell() {
  // TODO
  return null;
}
