
"use strict";

const SHOT_WATER       = 1;
const SHOT_ELECTRIC    = 2;
const SHOT_FIRE        = 3;
const SHOT_TREE        = 4;
const SHOT_FIRE_STORM  = 5;
const SHOT_AIR_PUNCH   = 6;
const SHOT_ICE         = 7;
const SHOT_SMALL_WATER = 8;
const SHOT_ROCK        = 9;
const SHOT_POISON      = 10;
const SHOT_METEOR      = 11;


var SHOTS = new Map();

SHOTS.set(
  SHOT_WATER,
  {
    graph: GRAPH_WATER_SHOT,
    damage: 10,
    type: MAGIC_TYPE_WATER,
    spawn: { type: SHOT_SMALL_WATER, amount: 4, velocity: 0.5},
    velocity: 500,
    grav: 1.0,
    punch: 0.2,
    sound: 'sound_water1'
  }
)

SHOTS.set(
  SHOT_SMALL_WATER,
  {
    graph: GRAPH_SMALL_WATER_SHOT,
    damage: 3,
    type: MAGIC_TYPE_WATER,
    velocity: 400,
    grav: 1.0
  }
)

SHOTS.set(
  SHOT_ICE,
  {
    graph: GRAPH_ICE_SHOT,
    damage: 25,
    type: MAGIC_TYPE_WATER,
    velocity: 600,
    grav: 0.2,
    freeze: 5000.0,
    sound: 'sound_freeze'
  }
)

SHOTS.set(
  SHOT_ELECTRIC,
  {
    graph: GRAPH_ELECTRIC_SHOT,
    damage: 30,
    type: MAGIC_TYPE_AIR,
    velocity: 600,
    grav: 0.0,
    bounce: { count: 10, amount: 1.0 },
    sound: 'sound_electric'
  }
)

SHOTS.set(
  SHOT_FIRE,
  {
    graph: GRAPH_FIRE_SHOT,
    damage: 15,
    type: MAGIC_TYPE_FIRE,
    velocity: 600,
    grav: 0.5,
    sound: 'sound_fire1'
  }
)

SHOTS.set(
  SHOT_TREE,
  {
    graph: GRAPH_TREE_SHOT,
    damage: 20,
    type: MAGIC_TYPE_EARTH,
    velocity: 350,
    grav: 0.9,
    duration: 2000,
    punch: 0.1,
    sound: 'sound_stick'
  }
)

SHOTS.set(
  SHOT_FIRE_STORM,
  {
    graph: GRAPH_FIRE_STORM_SHOT,
    damage: 25,
    type: MAGIC_TYPE_FIRE,
    velocity: 400,
    grav: 0.5,
    spawn: { type: SHOT_FIRE, amount: 10, velocity: 0.5},
    punch: 0.2,
    sound: 'sound_fire2',
    deathSound: 'sound_explosion1'
  }
)

SHOTS.set(
  SHOT_AIR_PUNCH,
  {
    graph: GRAPH_AIR_PUNCH_SHOT,
    damage: 12,
    type: MAGIC_TYPE_AIR,
    velocity: 600,
    grav: 0.0,
    punch: 0.7,
    sound: 'sound_wind'
  }
)

SHOTS.set(
  SHOT_ROCK,
  {
    graph: GRAPH_ROCK_SHOT,
    damage: 30,
    type: MAGIC_TYPE_EARTH,
    velocity: 500,
    bounce: { count: 50, amount: 0.4 },
    grav: 1.0,
    punch: 0.6,
    sound: 'sound_rock',
  }
)

SHOTS.set(
  SHOT_POISON,
  {
    graph: GRAPH_POISON_SHOT,
    damage: 5,
    poison: 5000,
    type: MAGIC_TYPE_EARTH,
    velocity: 300,
    bounce: { count: 3, amount: 0.5 },
    grav: 0.5,
    sound: 'sound_poison'
  }
)

SHOTS.set(
  SHOT_METEOR,
  {
    graph: GRAPH_METEOR_SHOT,
    damage: 100,
    type: MAGIC_TYPE_FIRE,
    velocity: 400,
    grav: 1.0,
    spawn: { type: SHOT_FIRE, amount: 20, velocity: 0.5},
    punch: 1.0,
    sound: 'sound_fire2',
    deathSound: 'sound_explosion1'
  }
)
