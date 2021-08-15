
"use strict";

function mapCreateEmpty(x, y) {
  return {
    x: x,
    y: y,
    tiles: new Array(x*y).fill(0),
    enemies: new Array(x*y).fill(0),
    pickups: new Array(x*y).fill(0),
    playerStartX: 0,
    playerStartY: 0
  };
}

// Create all the map objects
function mapInitialize(game, map, mapObjectList) {

  // Add BG images
  // TODO: Make this more generic

  var bg = game.add.image(settingWidth/2, settingHeight/2, 'bg0');
  bg.setScrollFactor(0.0, 0.0);
  bg.setDepth(-10.0);

  //var bg2 = game.add.image(settingWidth/2, settingHeight - 240/2 + 0.15*(map.y*80 - settingHeight), 'bg_forest');
  //bg2.setScrollFactor(0.15, 0.15);
  //bg2 = game.add.image(settingWidth*1.5, settingHeight - 240/2 + 0.15*(map.y*80 - settingHeight), 'bg_forest');
  //bg2.setScrollFactor(0.15, 0.15);
  //bg2 = game.add.image(settingWidth*2.5, settingHeight - 240/2 + 0.15*(map.y*80 - settingHeight), 'bg_forest');
  //bg2.setScrollFactor(0.15, 0.15);

  // Add Tiles
  for (var px = 0; px < map.x; px++) {
    for (var py = 0; py < map.y; py++) {
      mapCreateSingleTile(game, map, px, py, mapObjectList);
    }
  }
  createMapBlocks(game, map.tiles, map.x, map.y, 80, 80, groupBlocks, mapObjectList);

  // Note that enemies and such non-static content are not added into map object list

  // Add enemies and pickups
  for (var px = 0; px < map.x; px++) {
    for (var py = 0; py < map.y; py++) {
      const cx = px*80.0 + 40.0;
      const cy = py*80.0 + 40.0;
      const newEnemy = map.enemies[px + py*map.x];
      if (newEnemy != 0) enemyCreate(game, newEnemy, cx, cy);
      const newPickup = map.pickups[px + py*map.x];
      if (newPickup != 0) pickupCreate(game, newPickup, cx, cy);
    }
  }

  // Create player
  player = groupPlayer.create(map.playerStartX*80.0 + 40.0, map.playerStartY*80.0 + 40.0, 'player');
  player.setGravity(0, 400);
  player.setCollideWorldBounds(true);
  player.setBounce(0.0, 0.0);

  // Create map ending

  // Follow player
  // TODO: Does this need to change?
  game.physics.world.setBounds(0, 0, map.x*80, map.y*80);
  game.cameras.main.startFollow(player);
  game.cameras.main.setBounds(0, 0, map.x*80, map.y*80);
}

// Create "blocks" responsible for blocking the player
function createMapBlocks(game, mapArray, mapX, mapY, tileX, tileY, group, list) {

  const MARGIN = 2; // TODO

  // Run horizontally for each row
  for (var py = 0; py < mapY; py++) {
    // Gather consecutive blocks with length longer than one
    var indices = mapRunLine(mapArray, py*mapX, 1, mapX);
    for (var i = 0; i < indices.length / 2; i++) {
      var start = indices[i*2];
      var end = indices[i*2 + 1];
      var width = tileX * (end-start + 1);
      var height = tileY;
      var centerX = 0.5*tileX*(end + start) + tileX*0.5;
      var centerY = py*tileY + 0.5*tileY;
      var newRect = game.add.rectangle(centerX, centerY, width - MARGIN, height, 0xff0000);
      newRect.setAlpha(0.25);
      newRect.visible = false;
      group.add(newRect);
      list.push(newRect);
    }
  }

  // Run vertically for each column
  for (var px = 0; px < mapX; px++) {
    // Gather consecutive blocks with length longer than one
    var indices = mapRunLine(mapArray, px, mapX, mapY);
    for (var i = 0; i < indices.length / 2; i++) {
      var start = indices[i*2];
      var end = indices[i*2 + 1];
      var width = tileX;
      var height = tileY* (end-start + 1);
      var centerX = px*tileX + 0.5*tileX;
      var centerY = 0.5*tileY*(end + start) + tileY*0.5;
      var newRect = game.add.rectangle(centerX, centerY, width, height - MARGIN, 0xff0000);
      newRect.setAlpha(0.15);
      newRect.visible = false;
      group.add(newRect);
      list.push(newRect);
    }
  }

  // Add singles
  for (var px = 0; px < mapX; px++) {
    for (var py = 0; py < mapY; py++) {
      if (
        mapIsBlocked(mapArray[(px)+(py)*mapX])
        && (px == 0 || !mapIsBlocked(mapArray[(px-1)+(py)*mapX]))
        && (px == mapX -1 || !mapIsBlocked(mapArray[(px+1)+(py)*mapX]))
        && (py == 0 || !mapIsBlocked(mapArray[(px)+(py-1)*mapX]))
        && (py == mapY - 1 || !mapIsBlocked(mapArray[(px)+(py+1)*mapX]))
      ) {
        var cx = px*tileX + tileX*0.5;
        var cy = py*tileY + tileY*0.5;
        var newRect = game.add.rectangle(cx, cy, tileX, tileY, 0xff0000);
        newRect.setAlpha(0.15);
        newRect.visible = false;
        group.add(newRect);
        list.push(newRect);
      }
    }
  }

  console.log('Number of blocking rects: ' + list.length);

}


// Run a line horizontally or vertically
function mapRunLine(mapArray, startIndex, stride, count) {
  var list = []; // array with even number of elements indicating start and end index of block
  var curStart = -1;
  var curOnBlock = false;
  var nowOn;
  var i;
  for (i = 0; i < count; i++) {
    var curIndex = startIndex + i*stride;
    nowOn = mapIsBlocked(mapArray[curIndex]); // TODO: Change this to be a more generic check
    if (nowOn && !curOnBlock) curStart = i;
    if (!nowOn && curOnBlock) addToListIfLongerThanOne(list, curStart, i - 1);
    curOnBlock = nowOn;
  }

  // If we end a block at the edge of the map
  if (nowOn) addToListIfLongerThanOne(list, curStart, i - 1);

  return list;
}

function addToListIfLongerThanOne(list, start, end) {
  if (end - start > 0) {
    list.push(start);
    list.push(end);
  }
}

function mapIsBlocked(value) {
  if (value == 0) return false;
  var layer = LAYERS.get(value);
  if (!layer) throw 'Unknown layer: ' + layer;
  return layer.block;
}
