
"use strict";

// This flag is set by file loading
var edDoUpdate = false;

// Current camera position
var edCamX = 0;
var edCamY = 0;

// Tool options currently selected
var edState = EDITOR_STATE_EDIT;
var edClickSafety = 0;


// Temp phaser3 objects
var edBg = [];              // background
var edGrid = null;          // grid
var edToolBoxObjects = [];  // all in tool box (that you open with tab)
var edLeftSelect = null;    // left select in tool box
var edRightSelect = null;   // right select in tool box
var edPlayerStart = null;   // player start
var edExit = null;          // exit
var edTiles = [];           // ground and deco graphs for each tile
var edEnemies = [];         // enemies for each tile
var edPickups = [];         // pickups for each tile
var edSigns = [];           // sign for each tile

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
    mapBlueprint = mapCreateEmpty(3*16, 2*9);
  }

  // Create all phaser objects related to the map
  editorCreateAllFromMap(game, mapBlueprint);

  // Create grid and other UI phaser3 objects
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
    var image = game.add.image(cx, cy, mo.image);
    if (mo.scale) image.setScale(mo.scale);
    editorAddToolBox(image, 0.75);
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
    editorRedoMap(game, mapBlueprint);
    edDoUpdate = false;
    return GAME_MODE_MAP_EDITOR;
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

  if (edState == EDITOR_STATE_EDIT) {
    return editorHandleEdit(game);
  } else if (edState == EDITOR_STATE_TOOL) {
    return editorHandleTab(game);
  }
}

// When moving away from editor
function editorClose() {
  edBg.forEach(o => o.destroy());
  edBg = [];
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
      edToolLeftClick = toolOn.click;
      edLeftSelectPos = {x: toolOn.x, y: toolOn.y};
      edLeftSelect.setPosition(toolOn.x * 80.0 + 40.0 + 80.0, toolOn.y * 80.0 + 40.0 + 80.0);
    }
    // Handle special options
    if (inputLeftClick) {
      if (toolOn.special == EDITOR_SPECIAL_TRY) {
        editorClose();
        playerStatsSetForTesting();
        return GAME_MODE_PLAYING;
      } else if (toolOn.special == EDITOR_SPECIAL_NEW) {
        const desiredSize = prompt("Desired size in full screens (e.g. 4x4)");
        if (desiredSize == null || desiredSize.length == 0) {
          console.log('New map cancelled');
        } else {
          const parts = desiredSize.split("x");
          if (parts.length != 2) alert('Cannot parse input');
          else {
            const sizeX = parseInt(parts[0], 10);
            const sizeY = parseInt(parts[1], 10);
            if (!(sizeX >= 2 || sizeY >= 2)) alert('Bad values');
            else {
              mapBlueprint = mapCreateEmpty(sizeX * 16, sizeY * 9);
              editorRedoMap(game, mapBlueprint);
              edClickSafety = game.time.now;
            }
          }
        }
      } else if (toolOn.special == EDITOR_SPECIAL_EXPORT) {
        editorDownloadFile();
      } else if (toolOn.special == EDITOR_SPECIAL_IMPORT) {
        document.getElementById('file-input').click(); // HTML hacks
      } else if (toolOn.special == EDITOR_SPECIAL_BG) {
        mapBlueprint.background = toolOn.option;
        edBg.forEach(o => { o.destroy(); });
        edBg = [];
        mapCreateBackground(game, mapBlueprint, true, edBg);
      }
    }
  }
  if (game.input.activePointer.rightButtonDown()) {
    if (toolOn.tool) {
      edToolRight = toolOn.tool;
      edToolRightOption = toolOn.option;
      edToolRightClick = toolOn.click;
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
    if (edToolLeftClick) {
      if (inputLeftClick) editorApplyTool(game, mapBlueprint, gx, gy, edToolLeft, edToolLeftOption);
    } else {
        if (game.input.activePointer.leftButtonDown()) editorApplyTool(game, mapBlueprint, gx, gy, edToolLeft, edToolLeftOption);
    }
    if (edToolRightClick) {
      if (inputRightClick) editorApplyTool(game, mapBlueprint, gx, gy, edToolRight, edToolRightOption);
    } else {
      if (game.input.activePointer.rightButtonDown()) editorApplyTool(game, mapBlueprint, gx, gy, edToolRight, edToolRightOption);
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
  } else if (toolType == EDITOR_TOOL_EXIT) {
    changes = editorApplyExit(game, map, px, py, toolOption);
  } else if (toolType == EDITOR_TOOL_SIGN) {
    changes = editorApplySign(game, map, px, py, toolOption);
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
// TODO: Make this a bit nicer...

function editorDownloadFile() {
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
  var changes = false;
  if (type == EDITOR_ERASE_ALL) changes = editorSetTile(game, map, px, py, 0) || changes;
  changes = editorSetEnemy(game, map, px, py, 0) || changes;
  changes = editorSetPickup(game, map, px, py, 0) || changes;
  changes = editorSetDecoration(game, map, px, py, 0) || changes;
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

function editorApplyExit(game, map, px, py) {
  if (px != map.exitX || py != map.exitY) {
    map.exitX = px;
    map.exitY = py;
    edExit.setPosition(px * 80.0 + 40.0, py * 80.0 + 40.0);
    return true;
  }
  return false;
}

function editorApplySign(game, map, px, py) {
  const [existing, index] = mapGetSign(map.signs, px, py);
  if (existing == null) {
    const text = prompt("Sign text", "");
    if (!text || text == null || text.length == 0) {
      console.log('No sign text entered');
      return false;
    } else {
      console.log('Sign text: ' + text);
      map.signs.push({x: px, y: py, text: text});
    }
  } else {
    const text = prompt("New text (clear to delete sign)", existing.text);
    if (!text || text == null || text.length == 0) {
      console.log('Deleted sign');
      map.signs.splice(index, 1);
    } else {
      console.log('New sign text: ' + text);
      existing.text = text;
    }
  }
  editorUpdateSign(game, map, px, py);
  return true;
}

function editorApplyEnemy(game, map, px, py, option) {
  if (mapIsBlocked(map.tiles[px + py*map.x])) return false;
  return editorSetEnemy(game, map, px, py, option);
}

function editorApplyPickup(game, map, px, py, option) {
  if (mapIsBlocked(map.tiles[px + py*map.x])) return false;
  return editorSetPickup(game, map, px, py, option);
}

function editorApplyDecoration(game, map, px, py, option) {
  return editorSetDecoration(game, map, px, py, option);
}

function editorSetTile(game, map, px, py, value) {
  if (map.tiles[px + py*map.x] != value) {
    map.tiles[px + py*map.x] = value;
    editorRedoTiles(game, map, px, py);
    if (mapIsBlocked(value)) {
      editorSetEnemy(game, map, px, py, 0);
      editorSetPickup(game, map, px, py, 0);
      // Note that we allow decorations to be anywhere
    }
    return true;
  }
  return false;
}

function editorSetDecoration(game, map, px, py, value) {
  const index = px + py*map.x;
  if (map.decorations[index] != value) {
    map.decorationSeed[index] = 0;
    map.decorations[index] = value;
    editorRedoTile(game, map, px, py);
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

  // Grid
  editorUpdateGrid(game, map);

  // BG
  mapCreateBackground(game, mapBlueprint, true, edBg);

  // Tiles and tile specific stuff
  edTiles = Array.from(Array(mapBlueprint.tiles.length), () => []);
  edEnemies = Array(mapBlueprint.tiles.length);
  edPickups = Array(mapBlueprint.tiles.length);
  edSigns = Array(mapBlueprint.tiles.length);
  for (var px = 0; px < map.x; px++) {
    for (var py = 0; py < map.y; py++) {
      mapCreateSingleTile(game, map, px, py, edTiles[px + py*map.x], true);
      editorUpdateEnemy(game, map, px, py);
      editorUpdatePickup(game, map, px, py);
      editorUpdateSign(game, map, px, py);
    }
  }

  // Start and exit
  edPlayerStart = game.add.image(mapBlueprint.playerStartX*80.0 + 40, mapBlueprint.playerStartY*80.0 + 40.0, 'player');
  edPlayerStart.setDepth(5);
  edExit = game.add.image(mapBlueprint.exitX*80.0 + 40, mapBlueprint.exitY*80.0 + 40.0, 'exit_door1');
  edExit.setDepth(5);
}

// Destroy all map objects
function editorDestroyAllMapObjects() {
  edPlayerStart.destroy();
  edPlayerStart = null;
  edExit.destroy();
  edExit = null;
  edTiles.forEach(o => {
    o.forEach(s => s.destroy());
  });
  edTiles = [];
  edEnemies.forEach(o => { if (o) o.destroy(); });
  edEnemies = [];
  edPickups.forEach(o => { if (o) o.destroy(); });
  edPickups = [];
  edSigns.forEach(o => { if (o) o.destroy(); });
  edSigns = [];
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
  mapCreateSingleTile(game, map, px, py, edTiles[px + py*map.x], true);
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

// TODO: This is not optimal
function editorUpdateSign(game, map, px, py) {
  const index = px + map.x * py;
  if (edSigns[index]) {
    edSigns[index].destroy();
    edSigns[index] = null;
  }
  const [inMap, _index] = mapGetSign(map.signs, px, py);
  if (inMap != null) {
    const im = game.add.image(px * 80.0 + 40.0, py * 80.0 + 40.0, 'special_sign');
    im.setDepth(-0.001); // TODO
    edSigns[index] = im;
  }
}

function editorUpdateSingle(game, map, existing, mapList, type, px, py) {
  const index = px + py*map.x;
  if (existing[index]) {
    existing[index].destroy();
    existing[index] = null;
  }
  const needed = mapList[index];
  if (needed != 0) {
    const info = type.get(needed);
    const graph = GRAPHS.get(info.graph);
    const moveY = info.moveY ? info.moveY : 0.0;
    const im = game.add.image(px * 80.0 + 40.0, py * 80.0 + 40.0 + moveY, graph.name);
    im.setDepth(Z_ACTION);
    existing[index] = im;
  }
}
