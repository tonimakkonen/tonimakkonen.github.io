
"use strict";

// All the selectable spells are here
// TODO: Maybe add images?
// TODO: More properties

const SPELL_FIRE_BALL      = 1;
const SPELL_BALL_LIGHTNING = 2;
const SPELL_FIRE_STORM     = 3;

var SPELLS = new Map();

SPELLS.set(
  SPELL_FIRE_BALL,
  {
    name: 'Minor fire ball',
    type: MAGIC_TYPE_FIRE,
    shoot: SHOT_FIRE,
    cost: 5,
    reload: 250
  }
)

SPELLS.set(
  SPELL_BALL_LIGHTNING,
  {
    name: 'Ball lightning',
    type: MAGIC_TYPE_AIR,
    shoot: SHOT_ELECTRIC,
    cost: 15,
    reload: 500
  }
)

SPELLS.set(
  SPELL_FIRE_STORM,
  {
    name: 'Fire storm',
    type: MAGIC_TYPE_FIRE,
    shoot: SHOT_FIRE_STORM,
    cost: 25,
    reload: 1000
  }
)
