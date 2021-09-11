
"use strict";

// All the selectable spells are here and some minor util methods
// This includes certain effect spells

const SPELL_FIRE_BALL      = 1;
const SPELL_BALL_LIGHTNING = 2;
const SPELL_FIRE_STORM     = 3;
const SPELL_SUMMON_STICK   = 4;
const SPELL_WATER          = 5;
const SPELL_ICE            = 6;
const SPELL_AIR_PUNCH      = 7;
const SPELL_RAIN           = 8;
const SPELL_ROCK           = 9;

const SPELLS_MAX_X = 3;
const SPELLS_MAX_Y = 2;

const EFFECT_TYPE_SKY = 1;

var SPELLS = new Map();

// Wind spells

SPELLS.set(
  SPELL_AIR_PUNCH,
  {
    name: 'Air punch',
    posX: 0,
    posY: 0,
    image: 'spell_dummy',
    type: MAGIC_TYPE_AIR,
    shoot: SHOT_AIR_PUNCH,
    cost: 10,
    reload: 400
  }
)

SPELLS.set(
  SPELL_BALL_LIGHTNING,
  {
    name: 'Ball lightning',
    posX: 0,
    posY: 1,
    image: 'spell_dummy',
    type: MAGIC_TYPE_AIR,
    shoot: SHOT_ELECTRIC,
    cost: 15,
    reload: 500
  }
)

// Water

SPELLS.set(
  SPELL_WATER,
  {
    name: 'Water ball',
    posX: 1,
    posY: 0,
    image: 'spell_dummy',
    type: MAGIC_TYPE_WATER,
    shoot: SHOT_WATER,
    cost: 5,
    reload: 250
  }
)

SPELLS.set(
  SPELL_ICE,
  {
    name: 'Frost shot',
    posX: 1,
    posY: 1,
    image: 'spell_dummy',
    type: MAGIC_TYPE_WATER,
    shoot: SHOT_ICE,
    cost: 25,
    reload: 1000
  }
)

SPELLS.set(
  SPELL_RAIN,
  {
    name: 'Rain',
    posX: 1,
    posY: 2,
    image: 'spell_dummy',
    type: MAGIC_TYPE_WATER,
    effect: {type: EFFECT_TYPE_SKY, range: 800, shoot: SHOT_WATER, reload: 15, time: 5000},
    cost: 100,
    reload: 1500
  }
)

// Fire spells

SPELLS.set(
  SPELL_FIRE_BALL,
  {
    name: 'Fire ball',
    posX: 2,
    posY: 0,
    image: 'spell_fire_ball',
    type: MAGIC_TYPE_FIRE,
    shoot: SHOT_FIRE,
    cost: 5,
    reload: 250
  }
)

SPELLS.set(
  SPELL_FIRE_STORM,
  {
    name: 'Fire storm',
    posX: 2,
    posY: 1,
    image: 'spell_dummy',
    type: MAGIC_TYPE_FIRE,
    shoot: SHOT_FIRE_STORM,
    cost: 25,
    reload: 1000
  }
)

// Earth spells

SPELLS.set(
  SPELL_SUMMON_STICK,
  {
    name: 'Stick',
    posX: 3,
    posY: 0,
    image: 'spell_dummy',
    type: MAGIC_TYPE_EARTH,
    shoot: SHOT_TREE,
    cost: 5,
    reload: 200
  }
)

SPELLS.set(
  SPELL_ROCK,
  {
    name: 'Rock',
    posX: 3,
    posY: 1,
    image: 'spell_dummy',
    type: MAGIC_TYPE_EARTH,
    shoot: SHOT_ROCK,
    cost: 15,
    reload: 500
  }
)

// Util methods related to spells

const SPELLS_GRID = new Array((SPELLS_MAX_X + 1) * (SPELLS_MAX_Y + 1)).fill(null);

SPELLS.forEach((spell) => {
  const index = spell.posX + spell.posY * (SPELLS_MAX_X + 1);
  SPELLS_GRID[index] = spell;
});

function spellFromGrid(gx, gy) {
  if (gx >= 0 && gx <= SPELLS_MAX_X && gy >= 0 && gy <= SPELLS_MAX_Y) return SPELLS_GRID[gx + gy*(SPELLS_MAX_X + 1)];
  return null;
}
