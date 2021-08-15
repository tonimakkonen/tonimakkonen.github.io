
"use strict";

///////////////////////
// Generic variables //
///////////////////////

// Used for local storage. Update this with big changes to storage.
var VERSION = 1;

// Typical HD (720p) resolution. Should work on most devices
var settingWidth = 1280;
var settingHeight = 720;

// TODO: Add map tile width and height

// Game modes
const GAME_MODE_NONE        = 0; // dummy mode, sets up game
const GAME_MODE_MAIN_MENU   = 1;
const GAME_MODE_PLAYING     = 2;
const GAME_MODE_MAP_EDITOR  = 3;
const GAME_MODE_ON_MAP      = 4; // between levels


///////////////////
// Various stuff //
///////////////////

const DAMAGE_TYPE_NONE  = 0;
const DAMAGE_TYPE_AIR   = 1;
const DAMAGE_TYPE_WATER = 2;
const DAMAGE_TYPE_FIRE  = 3;
const DAMAGE_TYPE_EARTH = 4;


//////////////////////////////////////////////////
// All the different types of graphic resources //
//////////////////////////////////////////////////

// Just one image
const GRAPH_TYPE_SINGLE = 1;

// Tiled sprite with 4 frames (2 left and 2 right)
// Creates 'left' and 'right' animations
// Requires sizeX and sizeY to be defined
const GRAPH_TYPE_LEFT_RIGHT = 2;

// 3 frames just repeating
const GRAPH_TYPE_ANIM_3 = 3;

////////////////////
// All the graphs //
////////////////////


const GRAPH_PLAYER               = 1;

const GRAPH_FOREST_MONSTER       = 101;
const GRAPH_BURNING_MONSTER      = 102;
const GRAPH_ELECTRIC_MONSTER     = 103;
const GRAPH_STORM_MONSTER        = 104;
const GRAPH_TWISTER_MONSTER      = 105;
const GRAPH_SHINING_TREE_MONSTER = 106;
const GRAPH_MAGMA_MONSTER        = 107;

const GRAPH_WATERMELON_PICKUP    = 201;

const GRAPH_ICE_SHOT             = 301;
const GRAPH_ELECTRIC_SHOT        = 302;
const GRAPH_FIRE_SHOT            = 303;
const GRAPH_TREE_SHOT            = 304;
const GRAPH_FIRE_STORM_SHOT      = 305;

var GRAPHS = new Map();

GRAPHS.set(
  GRAPH_PLAYER,
  {
    location: 'imgs/player.png',
    name: 'player',
    type: GRAPH_TYPE_SINGLE,
  }
);

// Monsters

GRAPHS.set(
  GRAPH_FOREST_MONSTER,
  {
    location: 'imgs/monsters/forest_monster.png',
    name: 'enemy_forest_monster',
    type: GRAPH_TYPE_LEFT_RIGHT,
    sizeX: 40,
    sizeY: 40
  }
);

GRAPHS.set(
  GRAPH_BURNING_MONSTER,
  {
    location: 'imgs/monsters/burning.png',
    name: 'enemy_burning_monster',
    type: GRAPH_TYPE_SINGLE,
  }
);

GRAPHS.set(
  GRAPH_ELECTRIC_MONSTER,
  {
    location: 'imgs/monsters/electric.png',
    name: 'enemy_electric_monster',
    type: GRAPH_TYPE_SINGLE,
  }
);

GRAPHS.set(
  GRAPH_STORM_MONSTER,
  {
    location: 'imgs/monsters/storm_monster.png',
    name: 'enemy_storm_monster',
    type: GRAPH_TYPE_ANIM_3,
    sizeX: 80,
    sizeY: 80
  }
);

GRAPHS.set(
  GRAPH_TWISTER_MONSTER,
  {
    location: 'imgs/monsters/twister_monster.png',
    name: 'enemy_twister_monster',
    type: GRAPH_TYPE_ANIM_3,
    sizeX: 45,
    sizeY: 70
  }
);

GRAPHS.set(
  GRAPH_SHINING_TREE_MONSTER,
  {
    location: 'imgs/monsters/shining_tree.png',
    name: 'enemy_shining_tree_monster',
    type: GRAPH_TYPE_SINGLE
  }
);

GRAPHS.set(
  GRAPH_MAGMA_MONSTER,
  {
    location: 'imgs/monsters/magma_monster.png',
    name: 'enemy_magma_monster',
    type: GRAPH_TYPE_SINGLE
  }
);

// Pickups

GRAPHS.set(
  GRAPH_WATERMELON_PICKUP,
  {
    location: 'imgs/pickups/watermelon.png',
    name: 'pickup_watermelon',
    type: GRAPH_TYPE_SINGLE
  }
);

// Shots

GRAPHS.set(
  GRAPH_ICE_SHOT,
  {
    location: 'imgs/shots/ice.png',
    name: 'shot_ice',
    type: GRAPH_TYPE_SINGLE
  }
);

GRAPHS.set(
  GRAPH_ELECTRIC_SHOT,
  {
    location: 'imgs/shots/electric.png',
    name: 'shot_electric',
    type: GRAPH_TYPE_SINGLE
  }
);

GRAPHS.set(
  GRAPH_FIRE_SHOT,
  {
    location: 'imgs/shots/fire.png',
    name: 'shot_fire',
    type: GRAPH_TYPE_SINGLE
  }
);

GRAPHS.set(
  GRAPH_TREE_SHOT,
  {
    location: 'imgs/shots/tree.png',
    name: 'shot_tree',
    type: GRAPH_TYPE_ANIM_3,
    sizeX: 20,
    sizeY: 20
  }
);

GRAPHS.set(
  GRAPH_FIRE_STORM_SHOT,
  {
    location: 'imgs/shots/fire_storm.png',
    name: 'shot_fire_storm',
    type: GRAPH_TYPE_SINGLE
  }
);

/////////////////////////////////////////////////////////
// All the different layer types and various z indexes //
/////////////////////////////////////////////////////////


const LAYER_TYPE_TOP        = 1;  // layers with a top thingy (e.g. grass)
const LAYER_TYPE_SYMMETRIC  = 2;  // symmetric layers


const LAYER_GROUND  = 1;
const LAYER_CAVE    = 2;
const LAYER_ROCK    = 3;


// Z location of all game objects
const Z_ACTION = 1.0;


var LAYERS = new Map();

LAYERS.set(
  LAYER_GROUND,
  {
    type: LAYER_TYPE_TOP,
    name: 'ground',
    locationBase: 'imgs/ground/ground',
    block: true,
    zInternal: -0.3,
    zBlock: -0.3,
    zTop: 2.0
  }
);

LAYERS.set(
  LAYER_CAVE,
  {
    type: LAYER_TYPE_SYMMETRIC,
    name: 'cave',
    locationBase: 'imgs/ground/cave',
    block: false,
    zInternal: -0.5,
    zBlock: -0.5
  }
);

LAYERS.set(
  LAYER_ROCK,
  {
    type: LAYER_TYPE_SYMMETRIC,
    name: 'rock',
    locationBase: 'imgs/ground/rock',
    block: true,
    zInternal: -0.1,
    zBlock: -0.1
  }
);



//////////////////////////////////
// All the different shot types //
//////////////////////////////////


const SHOT_ICE        = 1;
const SHOT_ELECTRIC   = 2;
const SHOT_FIRE       = 3;
const SHOT_TREE       = 4;
const SHOT_FIRE_STORM = 5;


var SHOTS = new Map();

// TODO: Gravity and velocity

SHOTS.set(
  SHOT_ICE,
  {
    graph: GRAPH_ICE_SHOT,
    damage: 10,
    type: DAMAGE_TYPE_WATER,
    velocity: 400,
    grav: 1.0,
    bounce: { count: 5, amount: 0.9 }
  }
)

SHOTS.set(
  SHOT_ELECTRIC,
  {
    graph: GRAPH_ELECTRIC_SHOT,
    damage: 20,
    type: DAMAGE_TYPE_AIR,
    velocity: 600,
    grav: 0.0
  }
)

SHOTS.set(
  SHOT_FIRE,
  {
    graph: GRAPH_FIRE_SHOT,
    damage: 20,
    type: DAMAGE_TYPE_FIRE,
    velocity: 600,
    grav: 0.5
  }
)

SHOTS.set(
  SHOT_TREE,
  {
    graph: GRAPH_TREE_SHOT,
    damage: 25,
    type: DAMAGE_TYPE_EARTH,
    velocity: 250,
    grav: 0.8,
    duration: 2000
  }
)

SHOTS.set(
  SHOT_FIRE_STORM,
  {
    graph: GRAPH_FIRE_STORM_SHOT,
    damage: 25,
    type: DAMAGE_TYPE_FIRE,
    velocity: 400,
    grav: 0.5,
    spawn: { type: SHOT_FIRE, amount: 20, velocity: 0.5}
  }
)


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


var ENEMIES = new Map();

ENEMIES.set(
  ENEMY_FOREST_MONSTER,
  {
    graph: GRAPH_FOREST_MONSTER,
    moveWalk: { maxSpeed: 60, alpha: 1},
    moveJump: { delay: 3000, velocity: 300 }, // TODO: Add randomness
    shoot1: { type: SHOT_TREE, time: 1000, towards: true, randomAngle: 40.0, topBias: 20.0 },
    health: 100
  }
);

ENEMIES.set(
  ENEMY_BURNING_MONSTER,
  {
    graph: GRAPH_BURNING_MONSTER,
    moveBounce: { maxSpeed: 80, alpha: 1, jumpTime: 1, jumpSpeed: 240},
    health: 50,
    shoot1: { type: SHOT_FIRE, time: 1000, towards: true }
  }
);

ENEMIES.set(
  ENEMY_ELECTRIC_MONSTER,
  {
    graph: GRAPH_ELECTRIC_MONSTER,
    moveFloat: { maxSpeed: 100, alpha: 1, minDistance: 160, maxDistance: 320, sway: 0.3, towards: true},
    health: 40,
    shoot1: { type: SHOT_ELECTRIC, time: 2500, towards: true }
  }
);

ENEMIES.set(
  ENEMY_STORM_MONSTER,
  {
    graph: GRAPH_STORM_MONSTER,
    moveFloat: { maxSpeed: 200, alpha: 1, minDistance: 260, maxDistance: 340, sway: 0.2, above: true, margin: 20},
    health: 80,
    shoot1: { type: SHOT_ICE, time: 1000, towards: true }
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
    shoot1: { type: SHOT_ICE, time: 1000, towards: true }
  }
);

ENEMIES.set(
  ENEMY_SHINING_TREE_MONSTER,
  {
    graph: GRAPH_SHINING_TREE_MONSTER,
    immovable: true, // TODO: Make this into effect
    health: 1000,
    spawn: { type: ENEMY_FOREST_MONSTER, time: 5000 }
  }
);

ENEMIES.set(
  ENEMY_MAGMA_MONSTER,
  {
    graph: GRAPH_MAGMA_MONSTER,
    health: 250,
    moveWalk: { maxSpeed: 30, alpha: 1},
    shoot1: { type: SHOT_FIRE_STORM, time: 1000, towards: true }
  }
);

////////////////////////////////////
// All the different pickup types //
////////////////////////////////////


const PICKUP_WATERMELON = 1;

var PICKUPS = new Map();

PICKUPS.set(
  PICKUP_WATERMELON,
  {
    graph: GRAPH_WATERMELON_PICKUP,
    heal: 40
  }
);


//////////////////////////////////
// All the different decoration //
//////////////////////////////////

// TODO:

var DECORATIONS = new Map();
