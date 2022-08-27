
"use strict";

const CONFIG_WIDTH = 1400
const CONFIG_HEIGHT = 800
const CONFIG_BLOCK = 40

const GAME_STATE_MAIN_MENU = 1
const GAME_STATE_BLUE_BUY = 2
const GAME_STATE_RED_BUY = 3
const GAME_STATE_COMBAT = 4
const GAME_STATE_WIN = 5

const PLAYER_BLUE = 1
const PLAYER_RED = 2

const AI_PLAYER = 1
const AI_NORMAL = 2
const AI_DIFFICULT = 3

const RACE_HUMAN = 1
const RACE_BUG = 2
const RACE_ALIEN = 3

const SHOT_LASER = 1
const SHOT_SLIME = 2

const UNIT_HUMAN_BASE = 1
const UNIT_BUG_BASE = 2
const UNIT_ALIEN_BASE = 3
const UNIT_SOLDIER = 4
const UNIT_BUG = 5
const UNIT_ALIEN = 6

///////////
// RACES //
///////////

var configRaces = new Map();

configRaces.set(
  RACE_HUMAN,
  {
    base: UNIT_HUMAN_BASE
  }
)
configRaces.set(
  RACE_BUG,
  {
    base: UNIT_BUG_BASE
  }
)
configRaces.set(
  RACE_ALIEN,
  {
    base: UNIT_ALIEN_BASE
  }
)

///////////
// SHOTS //
///////////

var configShots = new Map();

configShots.set(
  SHOT_LASER,
  {
    graph: 'shot_laser',
    damage: 3,
  }
)

configShots.set(
  SHOT_SLIME,
  {
    graph: 'shot_slime',
    damage: 3,
  }
)

///////////
// UNITS //
///////////

var configUnits = new Map();

configUnits.set(
  UNIT_HUMAN_BASE,
  {
    graph: 'human_base',
    base: true,
    building: true,
    width: 80,
    health: 30,
    spawn: {
      unit: UNIT_SOLDIER,
      time: 5000
    }
  }
)

configUnits.set(
  UNIT_BUG_BASE,
  {
    graph: 'bug_base',
    base: true,
    building: true,
    width: 80,
    health: 30,
    spawn: {
      unit: UNIT_BUG,
      time: 2500
    }
  }
)

configUnits.set(
  UNIT_ALIEN_BASE,
  {
    graph: 'alien_base',
    base: true,
    building: true,
    width: 80,
    health: 30,
    spawn: {
      unit: UNIT_ALIEN,
      time: 9000
    }
  }
)

configUnits.set(
  UNIT_SOLDIER,
  {
    graph: 'soldier',
    health: 5,
    velocity: 40,
    jump: {
      feetOnGround: true,
      time: 500,
      prob: 0.25,
      speed: 230
    },
    shoot: {
        type: SHOT_LASER,
        amin: 5,
        amax: 30,
        speed: 200,
        time: 900
    }
  }
)

configUnits.set(
  UNIT_BUG,
  {
    graph: 'bug',
    health: 2,
    velocity: 50,
    jump: {
      feetOnGround: false,
      time: 200,
      prob: 0.6,
      speed: 80
    },
    shoot: {
        type: SHOT_SLIME,
        amin: 30,
        amax: 45,
        speed: 100,
        time: 500
    }
  }
)

configUnits.set(
  UNIT_ALIEN,
  {
    graph: 'alien',
    health: 9,
    velocity: 30,
    shoot: {
        type: SHOT_LASER,
        amin: 5,
        amax: 45,
        speed: 350,
        time: 700
    }
  }
);
