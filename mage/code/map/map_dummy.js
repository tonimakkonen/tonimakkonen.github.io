
"use strict";

// Create a dummy map
function mapCreateDummy() {
  var mapY = 18;
  var mapX = 80*3 - 2;
  var tiles = new Array(mapX*mapY).fill(0);
  var enemies = new Array(mapX*mapY).fill(0);
  var pickups = new Array(mapX*mapY).fill(0);

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
    const newTile = Math.random() > 0.2 ? LAYER_GROUND : LAYER_ROCK;
    var px = Math.floor(Math.random()*mapX);
    var py = Math.floor(Math.random()*mapY);
    const ot = (py > 0) && tiles[px + (py-1)*mapX] != 0;
    const ob = (py < mapX-1) && tiles[px + (py+1)*mapX] != 0;
    if (ot || ob) {
      tiles[px + py*mapX] = newTile;
      count += 1;
      if (count > 400) break;
    }
  }
  // and horizontal
  count = 0;
  for (var i = 0; i < 10000; i++) {
    const newTile = Math.random() > 0.2 ? LAYER_GROUND : LAYER_ROCK;
    var px = Math.floor(Math.random()*mapX);
    var py = Math.floor(Math.random()*mapY);
    const ol = (px > 0) && tiles[px - 1 + py*mapX] != 0;
    const or = (px < mapX-1) && tiles[px + 1 + py*mapX] != 0;
    if (ol || or) {
      tiles[px + py*mapX] = newTile;
      count += 1;
      if (count > 1600) break;
    }
  }


  // Add some random enemies and PICKUPS
  for (var i = 0; i < 5; i++) {
    var index = mapPickFreeTile(tiles);
    enemies[index] = ENEMY_TWISTER_MONSTER;
  }
  for (var i = 0; i < 5; i++) {
    var index = mapPickFreeTile(tiles);
    enemies[index] = ENEMY_ELECTRIC_MONSTER;
  }
  for (var i = 0; i < 5; i++) {
    var index = mapPickFreeTile(tiles);
    enemies[index] = ENEMY_STORM_MONSTER;
  }

  // Add some pickups
  for (var i = 0; i < 40; i++) {
    var index = mapPickFreeTile(tiles);
    pickups[index] = PICKUP_WATERMELON;
  }

  // Add some BG tiles
  var dy = Math.floor(Math.random()*10);
  for (var x = 0; x < mapX; x++) {
    dy += Math.random()*4.5 - 2;
    dy = Math.floor(dy);
    if (dy < 2) dy = 2;
    if (dy > 14) dy = 14;
    for (var y = 0; y < dy; y++) {
      const ay = mapY - 1 - y;
      if (tiles[x + ay*mapX] == 0) tiles[x + ay*mapX] = LAYER_CAVE;
    }
  }


  return { x: mapX, y: mapY, tiles: tiles, enemies: enemies, pickups: pickups, playerStartX: 0, playerStartY: 0 }

}

// TODO: Not the best
function mapPickFreeTile(tiles) {
  for (var i = 0; i < 100; i++) {
    var index = Math.floor(Math.random() *tiles.length);
    if (tiles[index] == 0) {
      return index;
    }
  }
  return 0;
}
