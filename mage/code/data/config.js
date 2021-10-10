
"use strict";

///////////////////////
// Generic variables //
///////////////////////

// Used for local storage. Update this with big changes to storage.
const VERSION = '2021_10_09';

// Typical HD (720p) resolution. Should work on most devices
const settingWidth = 1280;
const settingHeight = 720;

const Z_ACTION  = 1.0;
const Z_INFO_UI = 9.0
const Z_UI      = 10.0;

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

const MAGIC_TYPE_AIR   = 1;
const MAGIC_TYPE_WATER = 2;
const MAGIC_TYPE_FIRE  = 3;
const MAGIC_TYPE_EARTH = 4;


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
const GRAPH_SAND_MONSTER         = 108;
const GRAPH_BAT_MONSTER          = 109;
const GRAPH_MUSHROOM_MONSTER     = 110;
const GRAPH_FROST_MONSTER        = 111;
const GRAPH_BUG_MONSTER          = 112;
const GRAPH_WALL                 = 113;

const GRAPH_WATERMELON_PICKUP    = 201;
const GRAPH_MUSHROOM1_PICKUP     = 202;
const GRAPH_MUSHROOM2_PICKUP     = 203;
const GRAPH_BOOK_PICKUP          = 204;
const GRAPH_APPLE_PICKUP         = 205;

const GRAPH_WATER_SHOT           = 301;
const GRAPH_ELECTRIC_SHOT        = 302;
const GRAPH_FIRE_SHOT            = 303;
const GRAPH_TREE_SHOT            = 304;
const GRAPH_FIRE_STORM_SHOT      = 305;
const GRAPH_AIR_PUNCH_SHOT       = 306;
const GRAPH_ICE_SHOT             = 307;
const GRAPH_SMALL_WATER_SHOT     = 308;
const GRAPH_ROCK_SHOT            = 309;
const GRAPH_POISON_SHOT          = 310;
const GRAPH_METEOR_SHOT          = 311;

const GRAPH_EXIT_DOOR1           = 401;
const GRAPH_SIGN                 = 402;

const GRAPH_ROCK1_DECORATION     = 501;
const GRAPH_ROCK2_DECORATION     = 502;
const GRAPH_TREE1_DECORATION     = 503;
const GRAPH_TREE2_DECORATION     = 504;
const GRAPH_TREE3_DECORATION     = 505;
const GRAPH_TREE4_DECORATION     = 506;
const GRAPH_TREE5_DECORATION     = 507;
const GRAPH_CACTUS1_DECORATION   = 508;

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

GRAPHS.set(
  GRAPH_SAND_MONSTER,
  {
    location: 'imgs/monsters/sand_monster.png',
    name: 'enemy_sand_monster',
    type: GRAPH_TYPE_LEFT_RIGHT,
    sizeX: 60,
    sizeY: 60
  }
);

GRAPHS.set(
  GRAPH_BAT_MONSTER,
  {
    location: 'imgs/monsters/bat_monster.png',
    name: 'enemy_bat_monster',
    type: GRAPH_TYPE_ANIM_3,
    sizeX: 30,
    sizeY: 30
  }
);

GRAPHS.set(
  GRAPH_MUSHROOM_MONSTER,
  {
    location: 'imgs/monsters/mushroom_monster.png',
    name: 'enemy_mushroom_monster',
    type: GRAPH_TYPE_SINGLE
  }
);

GRAPHS.set(
  GRAPH_FROST_MONSTER,
  {
    location: 'imgs/monsters/frost_monster.png',
    name: 'enemy_frost_monster',
    type: GRAPH_TYPE_SINGLE
  }
);

GRAPHS.set(
  GRAPH_BUG_MONSTER,
  {
    location: 'imgs/monsters/bug_monster.png',
    name: 'enemy_bug_monster',
    type: GRAPH_TYPE_LEFT_RIGHT,
    sizeX: 50,
    sizeY: 25
  }
);

GRAPHS.set(
  GRAPH_WALL,
  {
    location: 'imgs/monsters/wall.png',
    name: 'enemy_wall',
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

GRAPHS.set(
  GRAPH_MUSHROOM1_PICKUP,
  {
    location: 'imgs/pickups/mushroom1.png',
    name: 'pickup_mushroom1',
    type: GRAPH_TYPE_SINGLE
  }
);

GRAPHS.set(
  GRAPH_MUSHROOM2_PICKUP,
  {
    location: 'imgs/pickups/mushroom2.png',
    name: 'pickup_mushroom2',
    type: GRAPH_TYPE_SINGLE
  }
);

GRAPHS.set(
  GRAPH_BOOK_PICKUP,
  {
    location: 'imgs/pickups/book.png',
    name: 'pickup_book',
    type: GRAPH_TYPE_SINGLE
  }
);

GRAPHS.set(
  GRAPH_APPLE_PICKUP,
  {
    location: 'imgs/pickups/apple.png',
    name: 'pickup_apple',
    type: GRAPH_TYPE_SINGLE
  }
);

// Shots

GRAPHS.set(
  GRAPH_WATER_SHOT,
  {
    location: 'imgs/shots/water.png',
    name: 'shot_water',
    type: GRAPH_TYPE_SINGLE
  }
);

GRAPHS.set(
  GRAPH_SMALL_WATER_SHOT,
  {
    location: 'imgs/shots/small_water.png',
    name: 'shot_small_water',
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

GRAPHS.set(
  GRAPH_AIR_PUNCH_SHOT,
  {
    location: 'imgs/shots/air_punch.png',
    name: 'shot_air_punch',
    type: GRAPH_TYPE_ANIM_3,
    sizeX: 25,
    sizeY: 25
  }
);

GRAPHS.set(
  GRAPH_ICE_SHOT,
  {
    location: 'imgs/shots/ice.png',
    name: 'shot_ice',
    type: GRAPH_TYPE_SINGLE
  }
);

GRAPHS.set(
  GRAPH_ROCK_SHOT,
  {
    location: 'imgs/shots/rock.png',
    name: 'shot_rock',
    type: GRAPH_TYPE_SINGLE
  }
);

GRAPHS.set(
  GRAPH_POISON_SHOT,
  {
    location: 'imgs/shots/poison.png',
    name: 'shot_poison',
    type: GRAPH_TYPE_SINGLE
  }
);

GRAPHS.set(
  GRAPH_METEOR_SHOT,
  {
    location: 'imgs/shots/meteor.png',
    name: 'shot_meteor',
    type: GRAPH_TYPE_SINGLE
  }
);

// Special thingys

GRAPHS.set(
  GRAPH_EXIT_DOOR1,
  {
    location: 'imgs/door1.png',
    name: 'exit_door1',
    type: GRAPH_TYPE_SINGLE
  }
);

GRAPHS.set(
  GRAPH_SIGN,
  {
    location: 'imgs/sign.png',
    name: 'special_sign',
    type: GRAPH_TYPE_SINGLE,
  }
);

// Decorations

GRAPHS.set(
  GRAPH_ROCK1_DECORATION,
  {
    location: 'imgs/decorations/rock1.png',
    name: 'decoration_rock1',
    type: GRAPH_TYPE_SINGLE
  }
)

GRAPHS.set(
  GRAPH_ROCK2_DECORATION,
  {
    location: 'imgs/decorations/rock2.png',
    name: 'decoration_rock2',
    type: GRAPH_TYPE_SINGLE
  }
)

GRAPHS.set(
  GRAPH_TREE1_DECORATION,
  {
    location: 'imgs/decorations/tree1.png',
    name: 'decoration_tree1',
    type: GRAPH_TYPE_SINGLE
  }
)

GRAPHS.set(
  GRAPH_TREE2_DECORATION,
  {
    location: 'imgs/decorations/tree2.png',
    name: 'decoration_tree2',
    type: GRAPH_TYPE_SINGLE
  }
)

GRAPHS.set(
  GRAPH_TREE3_DECORATION,
  {
    location: 'imgs/decorations/tree3.png',
    name: 'decoration_tree3',
    type: GRAPH_TYPE_SINGLE
  }
)

GRAPHS.set(
  GRAPH_TREE4_DECORATION,
  {
    location: 'imgs/decorations/tree4.png',
    name: 'decoration_tree4',
    type: GRAPH_TYPE_SINGLE
  }
)

GRAPHS.set(
  GRAPH_TREE5_DECORATION,
  {
    location: 'imgs/decorations/tree5.png',
    name: 'decoration_tree5',
    type: GRAPH_TYPE_SINGLE
  }
)

GRAPHS.set(
  GRAPH_CACTUS1_DECORATION,
  {
    location: 'imgs/decorations/cactus1.png',
    name: 'decoration_cactus1',
    type: GRAPH_TYPE_SINGLE
  }
)

/////////////////////////////////////////////////////////
// All the different layer types and various z indexes //
/////////////////////////////////////////////////////////

const LAYER_TYPE_TOP        = 1;
const LAYER_TYPE_SYMMETRIC  = 2;
const LAYER_TYPE_SINGLE     = 3;
const LAYER_TYPE_INVISIBLE  = 4; // invisible blocking layer, used for some effect

const LAYER_GROUND    = 1;
const LAYER_CAVE      = 2;
const LAYER_ROCK      = 3;
const LAYER_SNOW      = 4;
const LAYER_VOID      = 5;
const LAYER_INVISIBLE = 6;
const LAYER_SAND      = 7;
const LAYER_SNOWCAVE  = 8;

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
    zTop: 2.1
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
    zInternal: -0.4,
    zBlock: -0.4
  }
);

LAYERS.set(
  LAYER_SNOW,
  {
    type: LAYER_TYPE_TOP,
    name: 'snow',
    locationBase: 'imgs/ground/snow',
    block: true,
    zInternal: -0.2,
    zBlock: -0.2,
    zTop: 2.1
  }
);

LAYERS.set(
  LAYER_VOID,
  {
    type: LAYER_TYPE_SINGLE,
    name: 'void_layer',
    locationBase: 'imgs/ground/void.png',
    block: false,
    zInternal: 2.5,
    zBlock: 2.5
  }
);

LAYERS.set(
  LAYER_INVISIBLE,
  {
    type: LAYER_TYPE_INVISIBLE,
    text: 'IB',
    block: true
  }
);

LAYERS.set(
  LAYER_SAND,
  {
    type: LAYER_TYPE_TOP,
    name: 'sand',
    locationBase: 'imgs/ground/sand',
    block: true,
    zInternal: -0.2,
    zBlock: -0.2,
    zTop: 2.1
  }
);

LAYERS.set(
  LAYER_SNOWCAVE,
  {
    type: LAYER_TYPE_SYMMETRIC,
    name: 'snowcave',
    locationBase: 'imgs/ground/snowcave',
    block: false,
    zInternal: -0.5,
    zBlock: -0.5
  }
);

////////////////////////////////////
// All the different pickup types //
////////////////////////////////////


const PICKUP_WATERMELON = 1;
const PICKUP_MUSHROOM1  = 2;
const PICKUP_MUSHROOM2  = 3;
const PICKUP_BOOK       = 4;
const PICKUP_APPLE      = 5;

var PICKUPS = new Map();

PICKUPS.set(
  PICKUP_WATERMELON,
  {
    graph: GRAPH_WATERMELON_PICKUP,
    heal: 40,
    mana: 40,
    sound: 'sound_eat'
  }
);

PICKUPS.set(
  PICKUP_MUSHROOM1,
  {
    graph: GRAPH_MUSHROOM1_PICKUP,
    moveY: 25,
    mana: 100,
    sound: 'sound_eat'
  }
);

PICKUPS.set(
  PICKUP_MUSHROOM2,
  {
    graph: GRAPH_MUSHROOM2_PICKUP,
    moveY: 25,
    heal: 40,
    mana: 40,
    sound: 'sound_eat'
  }
);

PICKUPS.set(
  PICKUP_BOOK,
  {
    graph: GRAPH_BOOK_PICKUP,
    books: 1,
    sound: 'sound_book'
  }
);

PICKUPS.set(
  PICKUP_APPLE,
  {
    graph: GRAPH_APPLE_PICKUP,
    heal: 60,
    mana: 20,
    sound: 'sound_eat'
  }
);


//////////////////////////////////
// All the different decoration //
//////////////////////////////////

const DECORATION_ROCK1   = 1;
const DECORATION_ROCK2   = 2;
const DECORATION_TREE1   = 3;
const DECORATION_TREE2   = 4;
const DECORATION_TREE3   = 5;
const DECORATION_TREE4   = 6;
const DECORATION_TREE5   = 7;
const DECORATION_CACTUS1 = 8;

var DECORATIONS = new Map();

DECORATIONS.set(
  DECORATION_ROCK1,
  {
    graph: GRAPH_ROCK1_DECORATION,
    z: 2.0
  }
)

DECORATIONS.set(
  DECORATION_ROCK2,
  {
    graph: GRAPH_ROCK2_DECORATION,
    z: 2.0
  }
)

DECORATIONS.set(
  DECORATION_TREE1,
  {
    graph: GRAPH_TREE1_DECORATION,
    z: -0.05
  }
)

DECORATIONS.set(
  DECORATION_TREE2,
  {
    graph: GRAPH_TREE2_DECORATION,
    z: -0.05
  }
)

DECORATIONS.set(
  DECORATION_TREE3,
  {
    graph: GRAPH_TREE3_DECORATION,
    z: -0.05
  }
)

DECORATIONS.set(
  DECORATION_TREE4,
  {
    graph: GRAPH_TREE4_DECORATION,
    z: -0.025
  }
)

DECORATIONS.set(
  DECORATION_TREE5,
  {
    graph: GRAPH_TREE5_DECORATION,
    z: -0.025,
    moveY: -40
  }
)
DECORATIONS.set(
  DECORATION_CACTUS1,
  {
    graph: GRAPH_CACTUS1_DECORATION,
    z: -0.025,
    moveY: 10
  }
)

///////////////////////////////////
// All the different backgrounds //
///////////////////////////////////

// TODO: Load differently.. define set of resources etc..

const BACKGROUND_EMPTY     = 1;
const BACKGROUND_MOUNTAINS = 2;
const BACKGROUND_NIGHT     = 3;
const BACKGROUND_FOREST    = 4;

var BACKGROUNDS = new Map();

BACKGROUNDS.set(
  BACKGROUND_EMPTY,
  {
    editorGrey: true // so that you can see when adding "void" block
  }
)

BACKGROUNDS.set(
  BACKGROUND_MOUNTAINS,
  {
    name: 'bg_mountains',
    location: 'imgs/bg_mountains.jpg'
  }
)

BACKGROUNDS.set(
  BACKGROUND_NIGHT,
  {
    name: 'bg_night',
    location: 'imgs/bg_sky.jpg' // TODO: rename
  }
)

BACKGROUNDS.set(
  BACKGROUND_FOREST,
  {
    name: 'bg_forest',
    location: 'imgs/bg_forest.jpg' // TODO: rename
  }
)
