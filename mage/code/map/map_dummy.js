
"use strict";

// TODO: Maybe do not call this dummy

// Create a dummy map
function mapCreateDummy(sizeX, difficulty) {
  var mapY = 2*9;
  var mapX = 16*sizeX;
  var tiles = new Array(mapX*mapY).fill(0);
  var enemies = new Array(mapX*mapY).fill(0);
  var pickups = new Array(mapX*mapY).fill(0);
  // TODO: decorations

  // create floor
  for (var i = 0; i < mapX; i++) {
    py = mapY - 1;
    tiles[i + py*mapX] = LAYER_GROUND;
  }

  // Constant for setting up the random map
  const mapArea = mapY*mapX;
  const screenArea = 16.0*9.0;
  // We only assume horizontal size
  const mapScreens = sizeX;

  const seedTiles = Math.floor(mapArea / 60);
  const verticalCount = mapArea / 8;
  const horizontalCount = mapArea / 4;

  const randomCount = {
    enemyBurning: difficulty * mapScreens * 0.7,
    enemyTwister: difficulty * mapScreens * 0.7,
    enemyElectric: difficulty * mapScreens * 0.7,
    enemyStorm: difficulty * mapScreens * 0.7,
    enemyMagma: difficulty * mapScreens * 0.3,
    enemyTree: difficulty * mapScreens * 0.3,
    pickupMelons: mapScreens * 2.0,
    pickupMushrooms: mapScreens * 2.0
  };

  console.log('Creating random map with sizeX (screens):' + sizeX);
  console.log('Expected object count: ' + JSON.stringify(randomCount));

  // Add seed tiles
  for (var i = 0; i < seedTiles; i++) {
    var px = Math.floor(Math.random()*mapX);
    px = px >= mapX ? mapX - 1 : px;
    var py = Math.floor(Math.random()*(mapY - 7) + 7);
    py = py >= mapY ? mapY - 1 : py;
    tiles[px + py*mapX] = LAYER_CAVE;
  }

  // run vertical
  var count = 0;
  for (var i = 0; i < 100000; i++) {
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
  // run horizontal
  count = 0;
  for (var i = 0; i < 100000; i++) {
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

  // Find the position for the player start and exit
  var startY;
  var exitY;
  for (startY = mapY - 2; startY >= 10; startY -= 1) {
    const index = 0 + startY*mapX;
    const curTile = tiles[index];
    if (curTile == 0 || curTile == LAYER_CAVE || startY == 10) {
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
  // Clear up start and exit
  // TODO: Make this nicer
  for (var py = startY; py >= 0; py--) {
    const index = 0 + py*mapX;
    if(mapIsBlocked(tiles[index])) tiles[index] = 0;
  }
  for (var py = startY - 2; py >= 0; py--) {
    const index = 1 + py*mapX;
    if(mapIsBlocked(tiles[index])) tiles[index] = 0;
  }
  for (var py = startY - 4; py >= 0; py--) {
    const index = 2 + py*mapX;
    if(mapIsBlocked(tiles[index])) tiles[index] = 0;
  }
  for (var py = startY - 6; py >= 0; py--) {
    const index = 3 + py*mapX;
    if(mapIsBlocked(tiles[index])) tiles[index] = 0;
  }
  for (var py = startY; py >= 0; py--) {
    const index = mapX - 1 + py*mapX;
    if(mapIsBlocked[tiles[index]]) tiles[index] = 0;
  }


  // Add some random enemies and PICKUPS

  mapSetRandomlyOnWalkableTiles(tiles, enemies, mapX, mapY, ENEMY_TWISTER_MONSTER, mapDummyCount(randomCount.enemyTwister));
  mapSetRandomlyOnWalkableTiles(tiles, enemies, mapX, mapY, ENEMY_ELECTRIC_MONSTER, mapDummyCount(randomCount.enemyElectric));
  mapSetRandomlyOnWalkableTiles(tiles, enemies, mapX, mapY, ENEMY_STORM_MONSTER, mapDummyCount(randomCount.enemyStorm));

  mapSetRandomlyOnWalkableTilesAboveGround(tiles, enemies, mapX, mapY, ENEMY_BURNING_MONSTER, 0, mapDummyCount(randomCount.enemyBurning));
  mapSetRandomlyOnWalkableTilesAboveGround(tiles, enemies, mapX, mapY, ENEMY_SHINING_TREE_MONSTER, 1, mapDummyCount(randomCount.enemyTree));
  mapSetRandomlyOnWalkableTilesAboveGround(tiles, enemies, mapX, mapY, ENEMY_MAGMA_MONSTER, 1, mapDummyCount(randomCount.enemyMagma));

  mapSetRandomlyOnWalkableTilesAboveGround(tiles, pickups, mapX, mapY, PICKUP_WATERMELON, 0, mapDummyCount(randomCount.pickupMelons));
  mapSetRandomlyOnWalkableTilesAboveGround(tiles, pickups, mapX, mapY, PICKUP_MUSHROOM, 0, mapDummyCount(randomCount.pickupMushrooms));


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



  // Finally clear up stuff

  return { x: mapX, y: mapY, tiles: tiles, enemies: enemies, pickups: pickups, playerStartX: 0, playerStartY: startY, exitX: mapX-1, exitY: exitY }

}

// Utils for creating stuff randomly on the map //

// Poisson distribution
function mapDummyCount(mean) {
  const L = Math.exp(-mean);
  var p = 1.0;
  var k = 0;
  do {
      k += 1;
      p *= Math.random();
  } while (p > L);
  //console.log('Generated ' + (k-1) + ' from mean ' + mean);
  return k - 1;
}

function mapSetRandomlyOnWalkableTiles(tiles, array, sizeX, sizeY, type, count) {
  var created = 0;
  for (var i = 0; i < count*100; i++) {
    const pos = mapPickWalkableTile(tiles, sizeX, sizeY, false);
    if (pos.index >= 0 && array[pos.index] == 0) {
      array[pos.index] = type;
      created += 1;
      if (created >= count) return;
    }
  }
}

function mapSetRandomlyOnWalkableTilesAboveGround(tiles, array, sizeX, sizeY, type, extra, count) {
  console.log('count = ' + count);
  var created = 0;
  for (var i = 0; i < count*100; i++) {
    const pos = mapPickAboveGround(tiles, sizeX, sizeY, extra);
    if (pos.index >= 0 && array[pos.index] == 0) {
      console.log('creating at ' + pos);
      array[pos.index] = type;
      created += 1;
      if (created >= count) return;
    }
  }
}


// Pick random walkable or unwalkable tile anywhere on the map
function mapPickWalkableTile(tiles, sizeX, sizeY, isBlocked) {
  for (var dummy = 0; dummy < 10000; dummy++) {
    const px = Math.min(Math.floor(Math.random() * sizeX), sizeX - 1);
    const py = Math.min(Math.floor(Math.random() * sizeY), sizeY - 1);
    if(mapIsTileBlocked(tiles, sizeX, sizeY, px, py) == isBlocked) return { index: px + py*sizeX, x: px, y: py };
  }
  return {index: -1, x: 0, y:0}
}

// Pick a random position above ground
function mapPickAboveGround(tiles, sizeX, sizeY, extra) {
  var suitableAnswers = [];
  // Go trough horizonatlly, then from bottom to up
  for (var px = 0; px < sizeX; px++) {
    for (var py = sizeY - 1; py >= 0; py--) {
      // We need to base tile to actually be blocked
      if(mapIsTileBlocked(tiles, sizeX, sizeY, px, py)) {
        // Then we need tiles above [-1 ... -1-extra] to not be blocked
        var suitable = true;
        for (var dy = 1; dy <= 1+extra; dy++) {
          if (mapIsTileBlocked(tiles, sizeX, sizeY, px, py-dy)) {
            suitable = false;
            break;
          }
        }
        // Now we know that (px, py-1-extra is a good tile)
        const ay = py - 1 - extra;
        if (suitable) suitableAnswers.push({index: px + ay*sizeX, x: px, y: ay});
      }
    }
  }
  const len = suitableAnswers.length;
  if (len > 0) {
    return suitableAnswers[Math.floor(Math.random()*len)];
  }
  return {index: -1, x: 0, y: 0}
}
