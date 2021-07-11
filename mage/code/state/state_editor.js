
"use strict";

const EDITOR_STATE_EDIT     = 1;
const EDITOR_STATE_TOOL     = 2;
const EDITOR_STATE_CONFIRM  = 3;

const EDITOR_TOOL_ERASE         = 1;
const EDITOR_TOOL_GROUND        = 2;
const EDITOR_TOOL_PLAYER_START  = 3;
const EDITOR_TOOL_ENEMY         = 4;
const EDITOR_TOOL_PICKUP        = 5;
const EDITOR_TOOL_DECORATION    = 6;

const EDITOR_ERASE_ALL          = 1;
const EDITOR_ERASE_OBJ          = 2;

const EDITOR_SPECIAL_TRY        = 1;
const EDITOR_SPECIAL_CONFIRM    = 2;
const EDITOR_SPECIAL_EXPORT     = 3;
const EDITOR_SPECIAL_IMPORT     = 4;

const EDITOR_CONFIRM_NEW = 1;

// Just add all tool options manually
var EDITOR_MENU = new Set();

// Top row
EDITOR_MENU.add({x: 0, y: 0, tool: EDITOR_TOOL_PLAYER_START, image: 'player'});

EDITOR_MENU.add({x: 2, y: 0, tool: EDITOR_TOOL_ERASE, option: EDITOR_ERASE_ALL,  image: 'ui_eraser_all'});
EDITOR_MENU.add({x: 3, y: 0, tool: EDITOR_TOOL_ERASE, option: EDITOR_ERASE_OBJ,  image: 'ui_eraser_obj'});

EDITOR_MENU.add({x: 4, y: 0, special: EDITOR_SPECIAL_CONFIRM, option: {type: EDITOR_CONFIRM_NEW, x: 3, y: 2, info: 'Create new 3x2 map?'}, text: 'N: 3x2'});
EDITOR_MENU.add({x: 5, y: 0, special: EDITOR_SPECIAL_CONFIRM, option: {type: EDITOR_CONFIRM_NEW, x: 5, y: 2, info: 'Create new 5x2 map?'}, text: 'N: 5x2'});
EDITOR_MENU.add({x: 6, y: 0, special: EDITOR_SPECIAL_CONFIRM, option: {type: EDITOR_CONFIRM_NEW, x: 7, y: 3, info: 'Create new 7x3 map?'}, text: 'N: 7x3'});
EDITOR_MENU.add({x: 7, y: 0, special: EDITOR_SPECIAL_CONFIRM, option: {type: EDITOR_CONFIRM_NEW, x: 9, y: 3, info: 'Create new 9x3 map?'}, text: 'N: 9x3'});
EDITOR_MENU.add({x: 8, y: 0, special: EDITOR_SPECIAL_CONFIRM, option: {type: EDITOR_CONFIRM_NEW, x: 3, y: 5, info: 'Create new 3x5 map?'}, text: 'N: 3x5'});
EDITOR_MENU.add({x: 9, y: 0, special: EDITOR_SPECIAL_CONFIRM, option: {type: EDITOR_CONFIRM_NEW, x: 3, y: 7, info: 'Create new 3x7 map?'}, text: 'N: 3x7'});

// Second row, ground options
EDITOR_MENU.add({x: 0, y: 1, tool: EDITOR_TOOL_GROUND, option: LAYER_GROUND, image: 'ground_full'});
EDITOR_MENU.add({x: 1, y: 1, tool: EDITOR_TOOL_GROUND, option: LAYER_CAVE, image: 'cave_full'});

// Decorations

// Enemies
EDITOR_MENU.add({x: 0, y: 2, tool: EDITOR_TOOL_ENEMY, option: ENEMY_FOREST_MONSTER, image: 'enemy_forest_monster'});
EDITOR_MENU.add({x: 1, y: 2, tool: EDITOR_TOOL_ENEMY, option: ENEMY_BURNING_MONSTER, image: 'enemy_burning_monster'});
EDITOR_MENU.add({x: 2, y: 2, tool: EDITOR_TOOL_ENEMY, option: ENEMY_ELECTRIC_MONSTER, image: 'enemy_electric_monster'});
EDITOR_MENU.add({x: 3, y: 2, tool: EDITOR_TOOL_ENEMY, option: ENEMY_STORM_MONSTER, image: 'enemy_storm_monster'});
EDITOR_MENU.add({x: 4, y: 2, tool: EDITOR_TOOL_ENEMY, option: ENEMY_TWISTER_MONSTER, image: 'enemy_twister_monster'});

// Pickups
EDITOR_MENU.add({x: 0, y: 3, tool: EDITOR_TOOL_PICKUP, option: PICKUP_WATERMELON, image: 'pickup_watermelon'});

// Special options
EDITOR_MENU.add({x: 0, y: 6, special: EDITOR_SPECIAL_TRY, text: 'Try'});
EDITOR_MENU.add({x: 2, y: 6, special: EDITOR_SPECIAL_EXPORT, text: 'Export'});
EDITOR_MENU.add({x: 3, y: 6, special: EDITOR_SPECIAL_IMPORT, text: 'Import'});

// This flag is set by file loading
var edDoUpdate = false;

// Current camera position
var edCamX = 0;
var edCamY = 0;

// Tool options currently selected
var edState = EDITOR_STATE_EDIT;
var edConfirmOption = null;
var edClickSafety = 0;

var edToolLeft = EDITOR_TOOL_GROUND;
var edToolLeftOption = LAYER_GROUND;
var edToolRight = EDITOR_TOOL_ERASE;
var edToolRightOption = EDITOR_ERASE_ALL;
var edLeftSelectPos = {x: 0, y: 1}; // TODO
var edRightSelectPos = {x: 2, y: 0};


// Temp phaser3 objects
var edGrid = null;          // grid
var edToolBoxObjects = [];  // all in tool box (that you open with tab)
var edLeftSelect = null;    // left select in tool box
var edRightSelect = null;   // right select in tool box
var edPlayerStart = null;   // player start
var edTiles = [];           // tiles for each tile
var edEnemies = [];         //  enemies for each tile
var edPickups = [];         //  pickups for each tile
var edDecorations = [];     //  decorations for each tile
var edConfirmBox = null;    // confirm objects
var edConfirmText = null;

////////////////////////
// Life cycle methods //
////////////////////////

// Start editor
function stateStartEditor(game) {

  // Ensure we don't have accidental clicks and start with plain mode
  edClickSafety = game.time.now;
  edState = EDITOR_STATE_EDIT;

  // Create the blueprint map if not present
  if (mapBlueprint == null) {
    mapBlueprint = mapCreateEmpty(40, 20);
  }

  // Create all phaser objects related to the map
  editorCreateAllFromMap(game, mapBlueprint);

  // Create grid and other UI phaser3 objects
  editorUpdateGrid(game, mapBlueprint);
  editorAddToolBox(game.add.rectangle(settingWidth / 2.0, settingHeight / 2.0, settingWidth - 160.0, settingHeight - 160.0, 0xffffff), 0.25);
  edLeftSelect = editorAddToolBox(game.add.rectangle(edLeftSelectPos.x * 80.0 + 40.0 + 80.0, edLeftSelectPos.y * 80.0 + 40.0 + 80.0, 60, 60, 0xff0000), 0.5);
  edRightSelect = editorAddToolBox(game.add.rectangle(edRightSelectPos.x * 80.0 + 40.0 + 80.0, edRightSelectPos.y * 80.0 + 40.0 + 80.0, 60, 60, 0x00ff00), 0.5);
  EDITOR_MENU.forEach(mo => editorAddMenuOption(game, mo) );

  edToolBoxObjects.forEach(o => o.setVisible(false) );
}

function editorAddMenuOption(game, mo) {
  const cx = mo.x * 80.0 + 40.0 + 80.0;
  const cy = mo.y * 80.0 + 40.0 + 80.0;
  if (mo.image) {
    editorAddToolBox(game.add.image(cx, cy, mo.image), 0.75);
  } else if (mo.text) {
    var text = game.add.text(cx, cy, mo.text).setOrigin(0.5);
    editorAddToolBox(text, 0.75);
  } else {
    throw 'Bad menu option: ' + mo;
  }
}

function editorUpdateGrid(game, map) {
  if (edGrid != null) edGrid.destroy();
  const w = mapBlueprint.x*80;
  const h = mapBlueprint.y*80;
  edGrid = game.add.grid(w / 2, h / 2, w, h, 80, 80, null, 0, 0x0000ff, 1);
  edGrid.setDepth(10);
}

// Util method to add a tool box object
function editorAddToolBox(tbo, alpha) {
  tbo.setDepth(20);
  tbo.setAlpha(alpha);
  tbo.setScrollFactor(0.0, 0.0);
  edToolBoxObjects.push(tbo);
  return tbo;
}

// Run editor
function stateHandleEditor(game) {

  // If just loaded map
  if (edDoUpdate) {
    editorDestroyAllMapObjects();
    editorCreateAllFromMap(game, mapBlueprint);
    edDoUpdate = false;
  }

  // Movement is always on
  if (inputA.isDown) edCamX -= 20;
  if (inputD.isDown) edCamX += 20;
  if (inputW.isDown) edCamY -= 20;
  if (inputS.isDown) edCamY += 20;
  if (edCamX < 0) edCamX = 0;
  if (edCamY < 0) edCamY = 0;
  if (edCamX > mapBlueprint.x * 80) edCamX = mapBlueprint.x * 80;
  if (edCamY > mapBlueprint.y * 80) edCamY = mapBlueprint.y * 80;
  game.cameras.main.centerOn(edCamX, edCamY);

  if (edState == EDITOR_STATE_CONFIRM) {
    return editorHandleConfirm(game);
  } else if (edState == EDITOR_STATE_EDIT) {
    return editorHandleEdit(game);
  } else if (edState == EDITOR_STATE_TOOL) {
    return editorHandleTab(game);
  }
}

// When moving away from editor
function editorClose() {
  edGrid.destroy();
  edToolBoxObjects.forEach(o => o.destroy());
  edToolBoxObjects = [];
  edLeftSelect = null;
  edRightSelect = null;
  editorDestroyAllMapObjects();
}

////////////
// States //
////////////

function editorHandleConfirm(game) {
  // TODO: This needs to be better
  if (inputLeftClick) {
    if(game.input.mousePointer.y > 600.0 - 40.0 && game.input.mousePointer.y < 600.0 + 40.0) {
      if (edConfirmOption.type == EDITOR_CONFIRM_NEW) {
        editorDestroyAllMapObjects();
        mapBlueprint = mapCreateEmpty(edConfirmOption.x*16, edConfirmOption.y*9);
        editorCreateAllFromMap(game, mapBlueprint);
        editorUpdateGrid(game, mapBlueprint);
      }
    }
    edConfirmBox.destroy();
    edConfirmBox = null;
    edConfirmText.destroy();
    edConfirmText = null;
    edState = EDITOR_STATE_EDIT;
    edClickSafety = game.time.now;
  }
  return GAME_MODE_MAP_EDITOR;
}

function editorHandleTab(game) {

  if (inputTabClick) {
    edToolBoxObjects.forEach(o => o.setVisible(false) );
    edState = EDITOR_STATE_EDIT;
    return GAME_MODE_MAP_EDITOR;
  }

  const wx = game.input.mousePointer.x - 80.0;
  const wy = game.input.mousePointer.y - 80.0;
  const gx = Math.floor(wx / 80.0);
  const gy = Math.floor(wy / 80.0);

  var toolOn = null;
  EDITOR_MENU.forEach(em => {
    if (gx == em.x && gy == em.y) {
      toolOn = em;
    }
  });

  if (toolOn == null) return GAME_MODE_MAP_EDITOR;
  if (game.input.activePointer.leftButtonDown()) {
    if (toolOn.tool) {
      edToolLeft = toolOn.tool;
      edToolLeftOption = toolOn.option;
      edLeftSelectPos = {x: toolOn.x, y: toolOn.y};
      edLeftSelect.setPosition(toolOn.x * 80.0 + 40.0 + 80.0, toolOn.y * 80.0 + 40.0 + 80.0);
    }
    // Handle special options
    if (inputLeftClick) {
      if (toolOn.special == EDITOR_SPECIAL_TRY) {
        editorClose();
        return GAME_MODE_PLAYING;
      } else if (toolOn.special == EDITOR_SPECIAL_CONFIRM) {
        edConfirmBox = game.add.rectangle(settingWidth / 2.0, 600.0, settingWidth, 80, 0x000000).setDepth(10).setScrollFactor(0.0, 0.0);
        edConfirmText = game.add.text(settingWidth / 2.0, 600.0, toolOn.option.info).setOrigin(0.5).setDepth(10).setScrollFactor(0.0, 0.0);
        edToolBoxObjects.forEach(o => o.setVisible(false) );
        edState = EDITOR_STATE_CONFIRM;
        edConfirmOption = toolOn.option;
      } else if (toolOn.special == EDITOR_SPECIAL_EXPORT) {
        editorDownloadFile();
      } else if (toolOn.special == EDITOR_SPECIAL_IMPORT) {
        document.getElementById('file-input').click(); // HTML hacks
      }
    }
  }
  if (game.input.activePointer.rightButtonDown()) {
    if (toolOn.tool) {
      edToolRight = toolOn.tool;
      edToolRightOption = toolOn.option;
      edRightSelectPos = {x: toolOn.x, y: toolOn.y};
      edRightSelect.setPosition(toolOn.x * 80.0 + 40.0 + 80.0, toolOn.y * 80.0 + 40.0 + 80.0);
    }
  }
  return GAME_MODE_MAP_EDITOR;
}

function editorHandleEdit(game) {

  if (inputTabClick) {
    edToolBoxObjects.forEach(o => o.setVisible(true) );
    edState = EDITOR_STATE_TOOL;
    return GAME_MODE_MAP_EDITOR;
  }

  // Do not apply tool in safety period
  if (game.time.now - edClickSafety < 1000) return GAME_MODE_MAP_EDITOR;

  const wx = game.cameras.main.worldView.x + game.input.mousePointer.x;
  const wy = game.cameras.main.worldView.y + game.input.mousePointer.y;
  const gx = Math.floor(wx / 80.0);
  const gy = Math.floor(wy / 80.0);

  if (gx >= 0 && gx < mapBlueprint.x && gy >= 0 && gy < mapBlueprint.y) {
    const lastState = mapBlueprint.tiles[gx + gy*mapBlueprint.x];
    if (game.input.activePointer.leftButtonDown()) {
      editorApplyTool(game, mapBlueprint, gx, gy, edToolLeft, edToolLeftOption);
    }
    if (game.input.activePointer.rightButtonDown()) {
      editorApplyTool(game, mapBlueprint, gx, gy, edToolRight, edToolRightOption);
    }
  }

  return GAME_MODE_MAP_EDITOR;
}

// Called when mouse button down
function editorApplyTool(game, map, px, py, toolType, toolOption) {
  var changes;
  if (toolType == EDITOR_TOOL_ERASE) {
    changes = editorApplyErase(game, map, px, py, toolOption);
  } else if (toolType == EDITOR_TOOL_GROUND) {
    changes = editorApplyAddGround(game, map, px, py, toolOption);
  } else if (toolType == EDITOR_TOOL_PLAYER_START) {
    changes = editorApplyPlayerStart(game, map, px, py);
  } else if (toolType == EDITOR_TOOL_ENEMY) {
    changes = editorApplyEnemy(game, map, px, py, toolOption);
  } else if (toolType == EDITOR_TOOL_PICKUP) {
    changes = editorApplyPickup(game, map, px, py, toolOption);
  } else if (toolType == EDITOR_TOOL_DECORATION) {
    changes = editorApplyDecoration(game, map, px, py, toolOption);
  } else {
    throw 'Unknown tool type: ' + toolType;
  }

   // Save the map in local storage to avoid missing up on changes
  if (changes) {
    storageSaveMap();
  }
}

////////////////////
// File uploading //
////////////////////

// We are using html hacks here..

function editorDownloadFile() {
  // TODO: Make this a bit nicer...
  const blob = new Blob([JSON.stringify(mapBlueprint)], { type: 'application/json;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'map.json';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

// Note, this method does not know about this instance
function editorUploadFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    console.log('File loaded');
    const json = event.target.result;
    try {
      mapBlueprint = JSON.parse(json);
      storageSaveMap();
      edDoUpdate = true; // This will trigger update next turn
    } catch (err) {
      alert('Failed to open file. Maybe wrong json format?')
      return;
    }

  });
  reader.readAsText(file);
}

///////////
// Tools //
///////////

function editorApplyErase(game, map, px, py, type) {
  // TODO: Various options
  var changes = false;
  if (type == EDITOR_ERASE_ALL) changes = editorSetTile(game, map, px, py, 0) && changes;
  changes = editorSetEnemy(game, map, px, py, 0) && changes;
  changes = editorSetPickup(game, map, px, py, 0) && changes;
  return changes;
}

function editorApplyAddGround(game, map, px, py, type) {
  return editorSetTile(game, map, px, py, type);
}

function editorApplyPlayerStart(game, map, px, py) {
  if (px != map.playerStartX || py != map.playerStartY) {
    map.playerStartX = px;
    map.playerStartY = py;
    edPlayerStart.setPosition(px * 80.0 + 40.0, py * 80.0 + 40.0);
    return true;
  }
  return false;
}

function editorApplyEnemy(game, map, px, py, option) {
  if (mapIsBlocking(map.tiles[px + py*map.x])) return false;
  return editorSetEnemy(game, map, px, py, option);
}

function editorApplyPickup(game, map, px, py, option) {
  if (mapIsBlocking(map.tiles[px + py*map.x])) return false;
  return editorSetPickup(game, map, px, py, option);
}

function editorApplyDecoration(game, map, px, py, option) {
  return false;
}

function editorSetTile(game, map, px, py, value) {
  if (map.tiles[px + py*map.x] != value) {
    map.tiles[px + py*map.x] = value;
    editorRedoTiles(game, map, px, py);
    if (mapIsBlocking(value)) {
      editorSetEnemy(game, map, px, py, 0);
      editorSetPickup(game, map, px, py, 0);
    }
    return true;
  }
  return false;
}

function editorSetEnemy(game, map, px, py, value) {
  if (map.enemies[px + py*map.x] != value) {
    map.enemies[px + py*map.x] = value;
    editorUpdateEnemy(game, map, px, py);
    return true;
  }
  return false;
}

function editorSetPickup(game, map, px, py, value) {
  if (map.pickups[px + py*map.x] != value) {
    map.pickups[px + py*map.x] = value;
    editorUpdatePickup(game, map, px, py);
    return true;
  }
  return false;
}

//////////////////////
// Map modification //
//////////////////////

function editorRedoMap(game, map) {
  editorDestroyAllMapObjects();
  editorCreateAllFromMap(game, map);
}

// Set up all phaser3 objects to represent the map
function editorCreateAllFromMap(game, map) {
  edTiles = Array.from(Array(mapBlueprint.tiles.length), () => []);
  edEnemies = Array(mapBlueprint.tiles.length);
  edPickups = Array(mapBlueprint.tiles.length);
  edDecorations = Array(mapBlueprint.tiles.length);
  for (var px = 0; px < map.x; px++) {
    for (var py = 0; py < map.y; py++) {
      mapCreateSingleTile(game, map, px, py, edTiles[px + py*map.x]);
      editorUpdateEnemy(game, map, px, py);
      editorUpdatePickup(game, map, px, py);
      editorUpdateDecoration(game, map, px, py);
    }
  }
  edPlayerStart = game.add.image(mapBlueprint.playerStartX*80.0 + 40, mapBlueprint.playerStartY*80.0 + 40.0, 'player');
  edPlayerStart.setDepth(5);
}

// Destroy all map objects
function editorDestroyAllMapObjects() {
  edPlayerStart.destroy();
  edPlayerStart = null;
  edTiles.forEach(o => {
    o.forEach(s => s.destroy());
  });
  edTiles = [];
  edEnemies.forEach(o => { if (o) o.destroy(); });
  edEnemies = [];
  edPickups.forEach(o => { if (o) o.destroy(); });
  edPickups = [];
  edDecorations.forEach(o => { if (o) o.destroy(); });
  edDecorations = [];
}

// Redo tiles for this and adjacent tiles
function editorRedoTiles(game, map, px, py) {
  for (var dx = -1; dx <= 1; dx++) {
    for (var dy = -1; dy <= 1; dy++) {
      editorRedoTile(game, map, px + dx, py + dy); // can handle outside map
    }
  }
}

// redo all tiles for a given position on the map
function editorRedoTile(game, map, px, py) {
  if (px < 0 || py < 0 || px > map.x - 1 || py > map.y - 1) return;
  editorDestroyTile(map, px, py);
  mapCreateSingleTile(game, map, px, py, edTiles[px + py*map.x]);
}

// Destroy all ground tiles from a given position
function editorDestroyTile(map, px, py) {
  var list = edTiles[px + py*map.x]; // list of list
  list.forEach(s => s.destroy());
  list.splice(0, list.length);
}

function editorUpdateEnemy(game, map, px, py) {
  editorUpdateSingle(game, map, edEnemies, map.enemies, ENEMIES, px, py);
}

function editorUpdatePickup(game, map, px, py) {
  editorUpdateSingle(game, map, edPickups, map.pickups, PICKUPS, px, py);
}

function editorUpdateDecoration(game, map, px, py) {
  // TODO: Use map features for this
  //editorUpdateSingle(game, map, edDecorations, map.decorations, DECORATIONS, px, py);
}

function editorUpdateSingle(game, map, existing, mapList, type, px, py) {
  const index = px + py*map.x;
  if (existing[index]) {
    existing[index].destroy();
    existing[index] = null;
  }
  const needed = mapList[index];
  if (needed != 0) {
    const graph = GRAPHS.get(type.get(needed).graph);
    const im = game.add.image(px * 80.0 + 40.0, py * 80.0 + 40.0, graph.name);
    im.setDepth(Z_ACTION);
    existing[index] = im;
  }
}
