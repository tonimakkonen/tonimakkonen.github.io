
"use strict";

// Create a dummy map
function mapCreateDummy() {
  var mapY = 18;
  var mapX = 80*3 - 2;
  var tiles = new Array(mapX*mapY).fill(0);

  // floor
  for (var i = 0; i < mapX; i++) {
    py = mapY - 1;
    tiles[i + py*mapX] = 1;
  }

  // Add seed tiles
  for (var i = 0; i < 150; i++) {
    var px = Math.floor(Math.random()*mapX);
    var py = Math.floor(Math.random()*(mapY - 7) + 8);
    tiles[px + py*mapX] = 1;
  }

  // vertical tiles
  var count = 0;
  for (var i = 0; i < 10000; i++) {
    var px = Math.floor(Math.random()*mapX);
    var py = Math.floor(Math.random()*mapY);
    const ot = (py > 0) && tiles[px + (py-1)*mapX] == 1;
    const ob = (py < mapX-1) && tiles[px + (py+1)*mapX] == 1;
    if (ot || ob) {
      tiles[px + py*mapX] = 1;
      count += 1;
      if (count > 400) break;
    }
  }
  // and horizontal
  count = 0;
  for (var i = 0; i < 10000; i++) {
    var px = Math.floor(Math.random()*mapX);
    var py = Math.floor(Math.random()*mapY);
    const ol = (px > 0) && tiles[px - 1 + py*mapX] == 1;
    const or = (px < mapX-1) && tiles[px + 1 + py*mapX] == 1;
    if (ol || or) {
      tiles[px + py*mapX] = 1;
      count += 1;
      if (count > 1600) break;
    }
  }

  return { tiles: tiles, x: mapX, y: mapY}

}

// Create all the map objects
function mapInitialize(game, map) {

  // Add BG images
  // TODO: Make this more generic

  var bg = game.add.image(settingWidth/2, settingHeight/2, 'bg0');
  bg.setScrollFactor(0.0, 0.0);

  var bg2 = game.add.image(settingWidth/2, settingHeight - 240/2 + 0.15*(map.y*80 - settingHeight), 'bg_forest');
  bg2.setScrollFactor(0.15, 0.15);
  bg2 = game.add.image(settingWidth*1.5, settingHeight - 240/2 + 0.15*(map.y*80 - settingHeight), 'bg_forest');
  bg2.setScrollFactor(0.15, 0.15);
  bg2 = game.add.image(settingWidth*2.5, settingHeight - 240/2 + 0.15*(map.y*80 - settingHeight), 'bg_forest');
  bg2.setScrollFactor(0.15, 0.15);

  // Add Blocks
  for (var px = 0; px < map.x; px++) {
    for (var py = 0; py < map.y; py++) {
      if (map.tiles[px+py*map.x] == 1) {
        const onLeft = px == 0 || map.tiles[(px-1)+py*map.x] == 1;
        const onRight = px == map.x -1 || map.tiles[(px+1)+py*map.x] == 1;
        const onTop = py == 0 || map.tiles[px+(py-1)*map.x] == 1;
        const onBottom = py == map.y - 1 || map.tiles[px+(py+1)*map.x] == 1;
        const cx = px*80 + 40;
        const cy = py*80 + 40;
        const dx = 20;
        const dy = 20;
        // top left part
        if (onLeft) {
          game.add.sprite(cx - dx, cy - dy, 'ground_full');
        } else {
          game.add.sprite(cx - dx, cy - dy, 'ground_left');
        }
        // top right part
        if (onRight) {
          game.add.sprite(cx + dx, cy - dy, 'ground_full');
        } else {
          game.add.sprite(cx + dx, cy - dy, 'ground_right');
        }
        // bottom left
        if (onLeft && onBottom) {
          game.add.sprite(cx - dx, cy + dy, 'ground_full');
        } else if (onLeft) {
          game.add.sprite(cx - dx, cy + dy, 'ground_bottom');
        } else if(onBottom) {
          game.add.sprite(cx - dx, cy + dy, 'ground_left');
        } else {
          game.add.sprite(cx - dx, cy + dy, 'ground_bottomleft');
        }
        // bottom right
        if (onRight && onBottom) {
          game.add.sprite(cx + dx, cy + dy, 'ground_full');
        } else if (onRight) {
          game.add.sprite(cx + dx, cy + dy, 'ground_bottom');
        } else if (onBottom) {
          game.add.sprite(cx + dx, cy + dy, 'ground_right');
        } else {
          game.add.sprite(cx + dx, cy + dy, 'ground_bottomright');
        }
        // Add top layer
        if (!onTop) {
          var image = game.add.sprite(cx, cy - 2.0 * dy, 'ground_top');
          image.setDepth(1);
        }

        // Random layers
        // TODO: Do not use random
        const rx = Math.random()*10.0 - 5.0;
        const ry = Math.random()*10.0 - 5.0;
        if (Math.random() < 0.15) {
          var im = game.add.sprite(cx + rx, cy + ry, 'ground_r0');
          im.rotation = Math.random()*Math.PI;
        } else if (Math.random() < 0.15) {
          var im = game.add.sprite(cx + rx, cy + ry, 'ground_r1');
          im.rotation = Math.random()*Math.PI;
        }
      }
    }
  }
  createMapBlocks(game, map.tiles, map.x, map.y, 80, 80, groupBlocks);

  // TODO: This parts needs to be done better

  // Add enemies
  for (var i = 0; i < 10; i++) {
    enemyCreate(game, ENEMY_ELECTRIC_MONSTER, Math.random()*map.x*80, Math.random()*(map.y-2)*80);
    enemyCreate(game, ENEMY_BURNING_MONSTER, Math.random()*map.x*80, Math.random()*(map.y-2)*80);
    enemyCreate(game, ENEMY_FOREST_MONSTER, Math.random()*map.x*80, Math.random()*(map.y-2)*80);
    enemyCreate(game, ENEMY_STORM_MONSTER, Math.random()*map.x*80, Math.random()*(4)*80);
  }

  // Add some pickups
  for (var i = 0; i < 40; i++) {
    pickupCreate(game, PICKUP_WATERMELON, Math.random()*map.x*80, Math.random()*(map.y-2)*80);
  }

  // Create player
  // TODO:
  player = groupPlayer.create(100, 450, 'player');
  player.setGravity(0, 400);
  player.setCollideWorldBounds(true);
  player.setBounce(0.0, 0.0);

  // TODO:
  game.physics.world.setBounds(0, 0, map.x*80, map.y*80);
  game.cameras.main.startFollow(player);
  game.cameras.main.setBounds(0, 0, map.x*80, map.y*80);
}

// Create "blocks" responsible for blocking the player
function createMapBlocks(game, mapArray, mapX, mapY, tileX, tileY, group) {

  const MARGIN = 2; // TODO

  var list = [];

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
  return value == 1;
}
