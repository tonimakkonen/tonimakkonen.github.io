
"use strict";

// All the selectable spells are here and some minor util methods
// This includes certain effect spells

const SPELL_AIR_PUNCH      = 1;
const SPELL_BALL_LIGHTNING = 2;

const SPELL_WATER          = 3;
const SPELL_ICE            = 4;

const SPELL_FIRE_BALL      = 5;
const SPELL_FIRE_STORM     = 6;

const SPELL_SUMMON_STICK   = 7;
const SPELL_ROCK           = 8;

const SPELL_RAIN           = 9;
const SPELL_METEOR         = 10;
const SPELL_VOLCANO        = 11;
const SPELL_POISON         = 12;


const EFFECT_TYPE_SKY = 1;

var SPELLS = new Map();

// Wind spells

SPELLS.set(
  SPELL_AIR_PUNCH,
  {
    name: 'Air punch',
    posX: 0,
    posY: -1,
    image: 'spell_air_punch',
    type: MAGIC_TYPE_AIR,
    shoot: SHOT_AIR_PUNCH,
    cost: 7.5,
    reload: 350
  }
)

SPELLS.set(
  SPELL_BALL_LIGHTNING,
  {
    name: 'Ball lightning',
    posX: 0,
    posY: -2,
    image: 'spell_ball_lightning',
    type: MAGIC_TYPE_AIR,
    shoot: SHOT_ELECTRIC,
    cost: 10,
    reload: 500
  }
)

// Water

SPELLS.set(
  SPELL_WATER,
  {
    name: 'Water ball',
    posX: -1,
    posY: 0,
    image: 'spell_water_ball',
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
    posX: -2,
    posY: 0,
    image: 'spell_ice',
    type: MAGIC_TYPE_WATER,
    shoot: SHOT_ICE,
    cost: 15,
    reload: 600
  }
)

// Fire spells

SPELLS.set(
  SPELL_FIRE_BALL,
  {
    name: 'Fire ball',
    posX: 1,
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
    posY: 0,
    image: 'spell_fire_storm',
    type: MAGIC_TYPE_FIRE,
    shoot: SHOT_FIRE_STORM,
    cost: 30,
    reload: 1000
  }
)

// Earth spells

SPELLS.set(
  SPELL_SUMMON_STICK,
  {
    name: 'Stick',
    posX: 0,
    posY: 1,
    image: 'spell_summon_stick',
    type: MAGIC_TYPE_EARTH,
    shoot: SHOT_TREE,
    cost: 5,
    reload: 250
  }
)

SPELLS.set(
  SPELL_ROCK,
  {
    name: 'Rock',
    posX: 0,
    posY: 2,
    image: 'spell_rock',
    type: MAGIC_TYPE_EARTH,
    shoot: SHOT_ROCK,
    cost: 10,
    reload: 500
  }
)

// Special spells

SPELLS.set(
  SPELL_RAIN,
  {
    name: 'Rain',
    posX: -1.5,
    posY: -1.5,
    image: 'spell_rain',
    type: MAGIC_TYPE_WATER,
    effect: {type: EFFECT_TYPE_SKY, range: 800, shoot: SHOT_WATER, reload: 15, time: 5000},
    cost: 90,
    reload: 1500,
    sound: 'sound_spell_rain'
  }
)

SPELLS.set(
  SPELL_METEOR,
  {
    name: 'Meteors',
    posX: 1.5,
    posY: -1.5,
    image: 'spell_dummy',
    type: MAGIC_TYPE_FIRE,
    effect: {type: EFFECT_TYPE_SKY, range: 800, shoot: SHOT_METEOR, reload: 400, time: 5000},
    cost: 90,
    reload: 1500,
    sound: 'sound_spell_meteor'
  }
)

SPELLS.set(
  SPELL_VOLCANO,
  {
    name: 'Volcano (TODO)',
    posX: 1.5,
    posY: 1.5,
    image: 'spell_dummy',
    type: MAGIC_TYPE_WATER,
    effect: {type: EFFECT_TYPE_SKY, range: 800, shoot: SHOT_WATER, reload: 15, time: 5000},
    cost: 90,
    reload: 1500
  }
)

SPELLS.set(
  SPELL_POISON,
  {
    name: 'Poison',
    posX: -1.5,
    posY: 1.5,
    image: 'spell_poison',
    type: MAGIC_TYPE_EARTH,
    shoot: SHOT_POISON,
    cost: 5,
    reload: 250
  }
)
