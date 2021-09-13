

"use strict";

const EDITOR_STATE_EDIT     = 1;
const EDITOR_STATE_TOOL     = 2;

const EDITOR_TOOL_ERASE         = 1;
const EDITOR_TOOL_GROUND        = 2;
const EDITOR_TOOL_PLAYER_START  = 3;
const EDITOR_TOOL_ENEMY         = 4;
const EDITOR_TOOL_PICKUP        = 5;
const EDITOR_TOOL_DECORATION    = 6;
const EDITOR_TOOL_EXIT          = 7;
const EDITOR_TOOL_SIGN          = 8;

const EDITOR_ERASE_ALL          = 1;
const EDITOR_ERASE_OBJ          = 2;

const EDITOR_SPECIAL_TRY        = 1;
const EDITOR_SPECIAL_NEW        = 2;
const EDITOR_SPECIAL_EXPORT     = 3;
const EDITOR_SPECIAL_IMPORT     = 4;
const EDITOR_SPECIAL_BG         = 5;


// Just add all tool options manually
var EDITOR_MENU = new Set();

// Top row
EDITOR_MENU.add({x: 0, y: 0, tool: EDITOR_TOOL_PLAYER_START, image: 'player'});
EDITOR_MENU.add({x: 1, y: 0, tool: EDITOR_TOOL_EXIT, image: 'exit_door1'});
EDITOR_MENU.add({x: 2, y: 0, tool: EDITOR_TOOL_SIGN, click: true, image: 'special_sign'});
EDITOR_MENU.add({x: 3, y: 0, tool: EDITOR_TOOL_ERASE, option: EDITOR_ERASE_ALL,  image: 'ui_eraser_all'});
EDITOR_MENU.add({x: 4, y: 0, tool: EDITOR_TOOL_ERASE, option: EDITOR_ERASE_OBJ,  image: 'ui_eraser_obj'});
EDITOR_MENU.add({x: 5, y: 0, special: EDITOR_SPECIAL_NEW, text: 'New map'});
// TODO: consider having this as an option
EDITOR_MENU.add({x: 6, y: 0, special: EDITOR_SPECIAL_BG, option: BACKGROUND_EMPTY, text: 'BG 0'});
EDITOR_MENU.add({x: 7, y: 0, special: EDITOR_SPECIAL_BG, option: BACKGROUND_MOUNTAINS, text: 'BG 1'});
EDITOR_MENU.add({x: 8, y: 0, special: EDITOR_SPECIAL_BG, option: BACKGROUND_NIGHT, text: 'BG 2'});

// Second row, ground options
EDITOR_MENU.add({x: 0, y: 2, tool: EDITOR_TOOL_GROUND, option: LAYER_GROUND, image: 'ground_full'});
EDITOR_MENU.add({x: 1, y: 2, tool: EDITOR_TOOL_GROUND, option: LAYER_CAVE, image: 'cave_full'});
EDITOR_MENU.add({x: 2, y: 2, tool: EDITOR_TOOL_GROUND, option: LAYER_ROCK, image: 'rock_full'});
EDITOR_MENU.add({x: 3, y: 2, tool: EDITOR_TOOL_GROUND, option: LAYER_SNOW, image: 'snow_full'});
EDITOR_MENU.add({x: 4, y: 2, tool: EDITOR_TOOL_GROUND, option: LAYER_VOID, image: 'void_layer'});
EDITOR_MENU.add({x: 5, y: 2, tool: EDITOR_TOOL_GROUND, option: LAYER_INVISIBLE, text: 'IB'});

// Decorations
EDITOR_MENU.add({x: 0, y: 3, tool: EDITOR_TOOL_DECORATION, option: DECORATION_ROCK1, image: 'decoration_rock1'});
EDITOR_MENU.add({x: 1, y: 3, tool: EDITOR_TOOL_DECORATION, option: DECORATION_ROCK2, image: 'decoration_rock2'});
EDITOR_MENU.add({x: 2, y: 3, tool: EDITOR_TOOL_DECORATION, option: DECORATION_TREE1, image: 'decoration_tree1'});
EDITOR_MENU.add({x: 3, y: 3, tool: EDITOR_TOOL_DECORATION, option: DECORATION_TREE2, image: 'decoration_tree2', scale: 0.3});
EDITOR_MENU.add({x: 4, y: 3, tool: EDITOR_TOOL_DECORATION, option: DECORATION_TREE3, image: 'decoration_tree3', scale: 0.3});
EDITOR_MENU.add({x: 5, y: 3, tool: EDITOR_TOOL_DECORATION, option: DECORATION_TREE4, image: 'decoration_tree4', scale: 0.5});

// Enemies
EDITOR_MENU.add({x: 0, y: 4, tool: EDITOR_TOOL_ENEMY, option: ENEMY_FOREST_MONSTER, image: 'enemy_forest_monster'});
EDITOR_MENU.add({x: 1, y: 4, tool: EDITOR_TOOL_ENEMY, option: ENEMY_BURNING_MONSTER, image: 'enemy_burning_monster'});
EDITOR_MENU.add({x: 2, y: 4, tool: EDITOR_TOOL_ENEMY, option: ENEMY_ELECTRIC_MONSTER, image: 'enemy_electric_monster'});
EDITOR_MENU.add({x: 3, y: 4, tool: EDITOR_TOOL_ENEMY, option: ENEMY_STORM_MONSTER, image: 'enemy_storm_monster'});
EDITOR_MENU.add({x: 4, y: 4, tool: EDITOR_TOOL_ENEMY, option: ENEMY_TWISTER_MONSTER, image: 'enemy_twister_monster'});
EDITOR_MENU.add({x: 5, y: 4, tool: EDITOR_TOOL_ENEMY, option: ENEMY_SHINING_TREE_MONSTER, image: 'enemy_shining_tree_monster', scale: 0.25});
EDITOR_MENU.add({x: 6, y: 4, tool: EDITOR_TOOL_ENEMY, option: ENEMY_MAGMA_MONSTER, image: 'enemy_magma_monster', scale: 0.75});
EDITOR_MENU.add({x: 7, y: 4, tool: EDITOR_TOOL_ENEMY, option: ENEMY_SAND_MONSTER, image: 'enemy_sand_monster'});
EDITOR_MENU.add({x: 8, y: 4, tool: EDITOR_TOOL_ENEMY, option: ENEMY_BAT_MONSTER, image: 'enemy_bat_monster'});
EDITOR_MENU.add({x: 9, y: 4, tool: EDITOR_TOOL_ENEMY, option: ENEMY_MUSHROOM_MONSTER, image: 'enemy_mushroom_monster'});

// Pickups
EDITOR_MENU.add({x: 0, y: 5, tool: EDITOR_TOOL_PICKUP, option: PICKUP_WATERMELON, image: 'pickup_watermelon'});
EDITOR_MENU.add({x: 1, y: 5, tool: EDITOR_TOOL_PICKUP, option: PICKUP_MUSHROOM, image: 'pickup_mushroom'});

// Special options
EDITOR_MENU.add({x: 0, y: 6, special: EDITOR_SPECIAL_TRY, text: 'Try'});
EDITOR_MENU.add({x: 2, y: 6, special: EDITOR_SPECIAL_EXPORT, text: 'Export'});
EDITOR_MENU.add({x: 3, y: 6, special: EDITOR_SPECIAL_IMPORT, text: 'Import'});

// Initial selections
var edLeftSelectPos = {x: 0, y: 1};
var edRightSelectPos = {x: 3, y: 0};
var edToolLeft = EDITOR_TOOL_GROUND;
var edToolLeftOption = LAYER_GROUND;
var edToolRight = EDITOR_TOOL_ERASE;
var edToolRightOption = EDITOR_ERASE_ALL;
var edToolLeftClick = false;
var edToolRightClick = false;
