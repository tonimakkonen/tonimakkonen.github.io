
"use strict";

// Create a dummy map
function mapCreateDummy(sizeX, difficulty) {
  var mapY = 2*9;
  var mapX = 16*sizeX;
  var tiles = new Array(mapX*mapY).fill(0);
  var enemies = new Array(mapX*mapY).fill(0);
  var pickups = new Array(mapX*mapY).fill(0);

  // floor
  for (var i = 0; i < mapX; i++) {
    py = mapY - 1;
    tiles[i + py*mapX] = LAYER_GROUND;
  }

  // Constant for setting up the random map
  var mapArea = mapY*mapX;
  var seedTiles = Math.floor(mapArea / 60);
  var verticalCount = mapArea / 8;
  var horizontalCount = mapArea / 4;
  var pickupCount = Math.floor(mapArea / 50);

  var enemyTwister = Math.max(1, Math.floor(difficulty * mapArea / 250));
  var enemyElectric = Math.max(1, Math.floor(difficulty * mapArea / 250));
  var enemyStorm = Math.max(1, Math.floor(difficulty * mapArea / 250));
  var enemyLava = Math.max(1, Math.floor(difficulty * mapArea / 500));
  var enemyTree = Math.max(1, Math.floor(difficulty * mapArea / 500));

  console.log('Map area: ' + mapArea);
  console.log('Pickup count: ' + pickupCount);
  console.log('Normal enemy count: ' + enemyTwister);
  console.log('Difficult enemy count: ' + enemyLava);

  // Add seed tiles
  for (var i = 0; i < seedTiles; i++) {
    var px = Math.floor(Math.random()*mapX);
    px = px >= mapX ? mapX - 1 : px;
    var py = Math.floor(Math.random()*(mapY - 7) + 7);
    py = py >= mapY ? mapY - 1 : py;
    tiles[px + py*mapX] = LAYER_CAVE;
  }

  // vertical tiles
  var count = 0;
  for (var i = 0; i < 10000; i++) {
    const newTile = LAYER_GROUND;
    var px = Math.floor(Math.random()*mapX);
    var py = Math.floor(Math.random()*mapY);
    const ot = (py > 0) && tiles[px + (py-1)*mapX] != 0;
    const ob = (py < mapX-1) && tiles[px + (py+1)*mapX] != 0;
    if (ot || ob) {
      tiles[px + py*mapX] = newTile;
      count += 1;
      if (count > verticalCount) break;
    }
  }
  // and horizontal
  count = 0;
  for (var i = 0; i < 10000; i++) {
    const newTile = LAYER_GROUND;
    var px = Math.floor(Math.random()*mapX);
    var py = Math.floor(Math.random()*mapY);
    const ol = (px > 0) && tiles[px - 1 + py*mapX] != 0;
    const or = (px < mapX-1) && tiles[px + 1 + py*mapX] != 0;
    if (ol || or) {
      tiles[px + py*mapX] = newTile;
      count += 1;
      if (count > horizontalCount) break;
    }
  }


  // Add some random enemies and PICKUPS
  for (var i = 0; i < enemyTwister; i++) {
    var index = mapPickFreeTile(tiles);
    enemies[index] = ENEMY_TWISTER_MONSTER;
  }
  for (var i = 0; i < enemyElectric; i++) {
    var index = mapPickFreeTile(tiles);
    enemies[index] = ENEMY_ELECTRIC_MONSTER;
  }
  for (var i = 0; i < enemyStorm; i++) {
    var index = mapPickFreeTile(tiles);
    enemies[index] = ENEMY_STORM_MONSTER;
  }

  for (var i = 0; i < enemyLava; i++) {
    var index = mapPickAboveGround(tiles, mapX, mapY);
    enemies[index] = ENEMY_MAGMA_MONSTER;
  }
  for (var i = 0; i < enemyTree; i++) {
    var index = mapPickAboveGround(tiles, mapX, mapY)
    enemies[index] = ENEMY_SHINING_TREE_MONSTER;
  }

  // Add some pickups
  for (var i = 0; i < pickupCount; i++) {
    var index = mapPickFreeTile(tiles);
    if (index >= 0) pickups[index] = PICKUP_WATERMELON;
  }

  // Add some BG tiles
  var dy = Math.floor(Math.random()*10);
  for (var x = 0; x < mapX; x++) {
    dy += Math.random()*4.5 - 2;
    dy = Math.floor(dy);
    if (dy < 2) dy = 2;
    if (dy > 10) dy = 10;
    for (var y = 0; y < dy; y++) {
      const ay = mapY - 1 - y;
      if (tiles[x + ay*mapX] == 0) tiles[x + ay*mapX] = LAYER_CAVE;
    }
  }

  // Find the position for the player start and exit
  var startY;
  var exitY;
  for (startY = mapY - 2; startY >= 10; startY -= 1) {
    const index = 0 + startY*mapX;
    const curTile = tiles[index];
    if (curTile == 0 || curTile == LAYER_CAVE || exitY == 10) {
      if (curTile == LAYER_GROUND) tiles[index] = 0;
      break;
    }
  }
  for (exitY = mapY - 2; exitY >= 10; exitY -= 1) {
    const index = mapX - 1 + exitY*mapX;
    const curTile = tiles[index];
    if (curTile == 0 || curTile == LAYER_CAVE || exitY == 10) {
      tiles[index] = LAYER_CAVE;
      break;
    }
  }



  return { x: mapX, y: mapY, tiles: tiles, enemies: enemies, pickups: pickups, playerStartX: 0, playerStartY: startY, exitX: mapX-1, exitY: exitY }

}

// TODO: Not the best
function mapPickFreeTile(tiles) {
  for (var i = 0; i < 1000; i++) {
    var index = Math.floor(Math.random() *tiles.length);
    if (tiles[index] == 0) {
      return index;
    }
  }
  return 0;
}

function mapPickAboveGround(tiles, x, y) {
  const px = Math.min(Math.floor(Math.random() * x), x - 1);
  for(var py = y-2; py >= 0; py -= 1) {
    if (tiles[px + py*x] == 0 && tiles[px + (py + 1)*x] == 0) return px + py*x;
  }
  return 0;
}
