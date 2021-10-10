
"use strict";

///////////////////////////////
// All different enemy types //
///////////////////////////////

// TODO: Simplify names?
const ENEMY_FOREST_MONSTER         = 1;
const ENEMY_BURNING_MONSTER        = 2;
const ENEMY_ELECTRIC_MONSTER       = 3;
const ENEMY_STORM_MONSTER          = 4;
const ENEMY_TWISTER_MONSTER        = 5;
const ENEMY_SHINING_TREE_MONSTER   = 6;
const ENEMY_MAGMA_MONSTER          = 7;
const ENEMY_SAND_MONSTER           = 8;
const ENEMY_BAT_MONSTER            = 9;
const ENEMY_MUSHROOM_MONSTER       = 10;
const ENEMY_FROST_MONSTER          = 11;
const ENEMY_BUG_MONSTER            = 12;
const ENEMY_WALL                   = 13;


var ENEMIES = new Map();

ENEMIES.set(
  ENEMY_FOREST_MONSTER,
  {
    graph: GRAPH_FOREST_MONSTER,
    moveWalk: { maxSpeed: 60, alpha: 1},
    moveJump: { delay: 5000, velocity: 250 }, // TODO: Add randomness
    shoot1: { type: SHOT_TREE, time: 2000, randomAngle: 10.0, topBias: 0.5 },
    health: 60,
    mass: 1.0,
    fireDef: -50,
    earthDef: 50
  }
);

ENEMIES.set(
  ENEMY_BURNING_MONSTER,
  {
    graph: GRAPH_BURNING_MONSTER,
    moveBounce: { maxSpeed: 80, alpha: 1, jumpTime: 1, jumpSpeed: 240},
    health: 50,
    shoot1: { type: SHOT_FIRE, time: 1000, randomAngle: 25.0, topBias: 0.2 },
    mass: 1.5,
    fireDef: 50,
    waterDef: -50
  }
);

ENEMIES.set(
  ENEMY_ELECTRIC_MONSTER,
  {
    graph: GRAPH_ELECTRIC_MONSTER,
    moveFloat: { maxSpeed: 100, alpha: 1, minDistance: 160, maxDistance: 320, sway: 0.3, towards: true},
    health: 40,
    shoot1: { type: SHOT_ELECTRIC, time: 2500 },
    mass: 0.5,
    airDef: 100,
    waterDef: -100
  }
);

ENEMIES.set(
  ENEMY_STORM_MONSTER,
  {
    graph: GRAPH_STORM_MONSTER,
    moveFloat: { maxSpeed: 200, alpha: 1, minDistance: 260, maxDistance: 340, sway: 0.2, above: true, margin: 20},
    health: 80,
    shoot1: { type: SHOT_SMALL_WATER, time: 100, randomAngle: 45.0 },
    mass: 1.5,
    airDef: 100,
    waterDef: 100,
    earthDef: -100
  }
);

ENEMIES.set(
  ENEMY_TWISTER_MONSTER,
  {
    graph: GRAPH_TWISTER_MONSTER,
    moveWalk: { maxSpeed: 500, alpha: 1},
    moveJump: { delay: 1500, velocity: 400 },
    gravity: 50,
    health: 40,
    shoot1: { type: SHOT_AIR_PUNCH, time: 1000, randomAngle: 5.0 },
    mass: 0.5,
    airDef: 100,
    earthDef: -100
  }
);

ENEMIES.set(
  ENEMY_SHINING_TREE_MONSTER,
  {
    graph: GRAPH_SHINING_TREE_MONSTER,
    immovable: true,
    health: 1000,
    spawn: { type: ENEMY_FOREST_MONSTER, time: 5000 },
    mass: 10.0,
    fireDef: -50,
    earthDef: 50
  }
);

ENEMIES.set(
  ENEMY_MAGMA_MONSTER,
  {
    graph: GRAPH_MAGMA_MONSTER,
    health: 250,
    moveWalk: { maxSpeed: 30, alpha: 1},
    shoot1: { type: SHOT_FIRE_STORM, time: 1000, randomAngle: 20.0, topBias: 0.3 },
    mass: 5.0,
    waterDef: -50,
    fireDef: 50,
    earthDef: 50
  }
);

ENEMIES.set(
  ENEMY_SAND_MONSTER,
  {
    graph: GRAPH_SAND_MONSTER,
    moveWalk: { maxSpeed: 90, alpha: 1},
    moveJump: { delay: 3000, velocity: 300 }, // TODO: Add randomness
    shoot1: { type: SHOT_ROCK, time: 2000, randomAngle: 45.0, topBias: 0.6 },
    health: 120,
    mass: 1.0,
    earthDef: 50,
    airDef: -50
  }
);

ENEMIES.set(
  ENEMY_BAT_MONSTER,
  {
    graph: GRAPH_BAT_MONSTER,
    moveFloat: { maxSpeed: 150, alpha: 2, minDistance: 80, maxDistance: 320, constantSway: 600, towards: true},
    health: 25,
    shoot1: { type: SHOT_FIRE, time: 2500, randomAngle: 15.0 },
    mass: 0.4,
    fireDef: 50,
    waterDef: -50
  }
);

ENEMIES.set(
  ENEMY_MUSHROOM_MONSTER,
  {
    graph: GRAPH_MUSHROOM_MONSTER,
    immovable: true,
    shoot1: { type: SHOT_POISON, time: 2000, randomAngle: 45.0, topBias: 0.6 },
    health: 100,
    mass: 2.5,
    fireDef: -50,
    earthDef: 50
  }
);

ENEMIES.set(
  ENEMY_FROST_MONSTER,
  {
    graph: GRAPH_FROST_MONSTER,
    moveFloat: { maxSpeed: 50, alpha: 0.5, minDistance: 80, maxDistance: 320, constantSway: 100, towards: true},
    health: 40,
    shoot1: { type: SHOT_ICE, time: 2500, randomAngle: 10.0 },
    mass: 1.0,
    waterDef: 100,
    fireDef: -50
  }
);

ENEMIES.set(
  ENEMY_BUG_MONSTER,
  {
    graph: GRAPH_BUG_MONSTER,
    moveWalk: { maxSpeed: 80, alpha: 1},
    moveJump: { delay: 3000, velocity: 350 },
    shoot1: { type: SHOT_POISON, time: 3000, randomAngle: 10.0, topBias: 0.25 },
    health: 30,
    mass: 0.5,
    fireDef: -50,
    earthDef: 50
  }
);

ENEMIES.set(
  ENEMY_WALL,
  {
    graph: GRAPH_WALL,
    immovable: true,
    health: 100,
    mass: 1.0
  }
);
