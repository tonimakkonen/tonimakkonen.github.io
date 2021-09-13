
"use strict";

// TODO: Refactor tile creation fully

const TILE_END = 0;
const TILE_CONTINUE = 1;
const TILE_EXTEND = 2;

// Create single coordinates
// TODO: This needs to be tweaked a lot
function mapCreateSingleTile(game, map, px, py, list, inEditor) {

  if (px < 0 || py < 0 || px >= map.x && py >= map.y) throw new 'Bad px, py: ' + px + ', ' + py;

  // Create decorations
  if (map.decorations[px + py*map.x] != 0) {
    const deco = DECORATIONS.get(map.decorations[px + py*map.x]);
    if (!deco) throw 'Unkown decoration: ' + deco;
    mapHandleDecoration(game, deco, px, py, list);
  }


  // TODO: The tile thingy needs to be refactored
  const tile = map.tiles[px+py*map.x];
  if (tile == 0) return;
  const layer = LAYERS.get(tile);
  if (!layer) throw 'Bad layer index ' + tile;

  // Do we continue the same layer to these directions?
  // This happens at the end of the map and when there is a higher layer
  const cont = {
    left: mapContinueSame(map, tile, px, py, -1, 0),
    right: mapContinueSame(map, tile, px, py, +1, 0),
    top: mapContinueSame(map, tile, px, py, 0, -1),
    bottom: mapContinueSame(map, tile, px, py, 0, +1),
    topLeft: mapContinueSame(map, tile, px, py, -1, -1),
    topRight: mapContinueSame(map, tile, px, py, +1, -1),
    bottomLeft: mapContinueSame(map, tile, px, py, -1, +1),
    bottomRight: mapContinueSame(map, tile, px, py, +1, +1)
  }

  // Handle different layer types
  if (layer.type == LAYER_TYPE_TOP) {
    mapHandleTop(game, layer, list, px, py, cont);
  }  else if (layer.type == LAYER_TYPE_SYMMETRIC) {
    mapHandleSymmetric(game, layer, list, px, py, cont);
  } else if (layer.type == LAYER_TYPE_SINGLE) {
    mapHandleSingle(game, layer, list, px, py, cont);
  } else if (layer.type == LAYER_TYPE_INVISIBLE) {
    if (inEditor) mapHandleInvisible(game, layer, list, px, py, cont);
  } else {
    throw 'Unkown layer type: ' + layer.type;
  }
}

function mapHandleInvisible(game, layer, list, px, py, cont) {
  const cx = px * 80.0 + 40.0;
  const cy = py * 80.0 + 40.0;
  const text = game.add.text(cx, cy, layer.text).setOrigin(0.5);
  text.setDepth(5.0);
  list.push(text);
}

function mapHandleSingle(game, layer, list, px, py, cont) {
  const cx = px * 80.0 + 40.0;
  const cy = py * 80.0 + 40.0;
  mapAddThing(game, layer.name, cx, cy, layer.zBlock, list);
}

function mapHandleTop(game, layer, list, px, py, cont) {
  const cx = px * 80.0 + 40.0;
  const cy = py * 80.0 + 40.0;
  const dx = 20.0;
  const dy = 20.0;
  // top left part
  if (cont.left != TILE_END) mapAddThing(game, layer.name + '_full', cx - dx, cy - dy, layer.zBlock, list);
  else mapAddThing(game, layer.name + '_left', cx - dx, cy - dy, layer.zBlock, list);
  // top right part
  if (cont.right != TILE_END) mapAddThing(game, layer.name + '_full', cx + dx, cy - dy, layer.zBlock, list);
  else mapAddThing(game, layer.name + '_right', cx + dx, cy - dy, layer.zBlock, list);
  // bottom left
  if (cont.left != TILE_END && cont.bottom != TILE_END) mapAddThing(game, layer.name + '_full', cx - dx, cy + dy, layer.zBlock, list);
  else if (cont.left != TILE_END) mapAddThing(game, layer.name + '_bottom', cx - dx, cy + dy, layer.zBlock, list);
  else if (cont.bottom != TILE_END) mapAddThing(game, layer.name + '_left', cx - dx, cy + dy, layer.zBlock, list);
  else mapAddThing(game, layer.name + '_bottomleft', cx - dx, cy + dy, layer.zBlock, list);
  // bottom right
  if (cont.right != TILE_END && cont.bottom != TILE_END) mapAddThing(game, layer.name + '_full', cx + dx, cy + dy, layer.zBlock, list);
  else if (cont.right != TILE_END) mapAddThing(game, layer.name + '_bottom', cx + dx, cy + dy, layer.zBlock, list);
  else if (cont.bottom != TILE_END) mapAddThing(game, layer.name + '_right', cx + dx, cy + dy, layer.zBlock, list);
  else mapAddThing(game, layer.name + '_bottomright', cx + dx, cy + dy, layer.zBlock, list);
  // Add top layer
  if (!(cont.top != TILE_END)) mapAddThing(game, layer.name + '_top', cx, cy - 2.0*dy, layer.zTop, list);
}

function mapHandleSymmetric(game, layer, list, px, py, cont) {
  // Add all 4 blocks for this one tile, and all extension. This is probably not fully correct logic...
  const tl = mapSymmetricTopLeftName(cont.left != TILE_END, cont.top != TILE_END, cont.topLeft != TILE_END);
  const tr = mapSymmetricTopRightName(cont.right != TILE_END, cont.top != TILE_END, cont.topRight != TILE_END);
  const bl = mapSymmetricBottomLeftName(cont.left != TILE_END, cont.bottom != TILE_END, cont.bottomLeft != TILE_END);
  const br = mapSymmetricBottomRightName(cont.right != TILE_END, cont.bottom != TILE_END, cont.bottomRight != TILE_END);
  mapAddThing(game, layer.name + '_' + tl, px*80.0 + 20.0, py*80.0 + 20.0, layer.zBlock, list);
  mapAddThing(game, layer.name + '_' + tr, px*80.0 + 60.0, py*80.0 + 20.0, layer.zBlock, list);
  mapAddThing(game, layer.name + '_' + bl, px*80.0 + 20.0, py*80.0 + 60.0, layer.zBlock, list);
  mapAddThing(game, layer.name + '_' + br, px*80.0 + 60.0, py*80.0 + 60.0, layer.zBlock, list);
  if (cont.left == TILE_EXTEND) {
    mapAddThing(game, layer.name + '_' + mapGetSymmetricExtension(tl, true), px*80.0 - 20.0, py*80.0 + 20.0, layer.zBlock, list);
    mapAddThing(game, layer.name + '_' + mapGetSymmetricExtension(bl, true), px*80.0 - 20.0, py*80.0 + 60.0, layer.zBlock, list);
  }
  if (cont.right == TILE_EXTEND) {
    mapAddThing(game, layer.name + '_' + mapGetSymmetricExtension(tr, true), px*80.0 + 100.0, py*80.0 + 20.0, layer.zBlock, list);
    mapAddThing(game, layer.name + '_' + mapGetSymmetricExtension(br, true), px*80.0 + 100.0, py*80.0 + 60.0, layer.zBlock, list);
  }
  if (cont.top == TILE_EXTEND) {
    mapAddThing(game, layer.name + '_' + mapGetSymmetricExtension(tl, false), px*80.0 + 20.0, py*80.0 - 20.0, layer.zBlock, list);
    mapAddThing(game, layer.name + '_' + mapGetSymmetricExtension(tr, false), px*80.0 + 60.0, py*80.0 - 20.0, layer.zBlock, list);
  }
  if (cont.bottom == TILE_EXTEND) {
    mapAddThing(game, layer.name + '_' + mapGetSymmetricExtension(bl, false), px*80.0 + 20.0, py*80.0 + 100.0, layer.zBlock, list);
    mapAddThing(game, layer.name + '_' + mapGetSymmetricExtension(br, false), px*80.0 + 60.0, py*80.0 + 100.0, layer.zBlock, list);
  }
}

function mapGetSymmetricExtension(name, horizontal) {
  if (name == 'ctl') return horizontal ? 'top' : 'left';
  if (name == 'ctr') return horizontal ? 'top' : 'right';
  if (name == 'cbl') return horizontal ? 'bottom' : 'left';
  if (name == 'cbr') return horizontal ? 'bottom' : 'right';
  return name;
}

function mapSymmetricTopLeftName(cl, ct, ctl) {
  if (cl && ct && ctl) return 'full';
  if (cl && ct && !ctl) return 'ctl';
  if (!cl && ct) return 'left';
  if (cl && !ct) return 'top';
  if (!cl && !ct) return 'topleft';
  throw 'Bad logic';
}

function mapSymmetricTopRightName(cr, ct, ctr) {
  if (cr && ct && ctr) return 'full';
  if (cr && ct && !ctr) return 'ctr';
  if (!cr && ct) return 'right';
  if (cr && !ct) return 'top';
  if (!cr && !ct) return 'topright';
  throw 'Bad logic';
}

function mapSymmetricBottomLeftName(cl, cb, cbl) {
  if (cl && cb && cbl) return 'full';
  if (cl && cb && !cbl) return 'cbl';
  if (!cl && cb) return 'left';
  if (cl && !cb) return 'bottom';
  if (!cl && !cb) return 'bottomleft';
  throw 'Bad logic';
}

function mapSymmetricBottomRightName(cr, cb, cbr) {
  if (cr && cb && cbr) return 'full';
  if (cr && cb && !cbr) return 'cbr';
  if (!cr && cb) return 'right';
  if (cr && !cb) return 'bottom';
  if (!cr && !cb) return 'bottomright';
  throw 'Bad logic';
}

// Add a new static sprite to the map, set the depth, and add to list
function mapAddThing(game, name, x, y, depth, list) {
  const newObject = game.add.image(x, y, name);
  newObject.setDepth(depth);
  list.push(newObject);
}


// Continue this same tile to whatever direction. Assume dx, dy are sensible
// This happens if..
// * the same tile is in that direction
// * the map boundary
// * a tile that has a higher z value
function mapContinueSame(map, tile, px, py, dx, dy) {
  if (px < 0 || px < 0 || px >= map.x || py >= map.y) throw 'Bad px, py: ' + px + ', ' + py;
  const nx = px + dx;
  const ny = py + dy;
  // oustide
  if (nx < 0 || ny < 0 || nx >= map.x || ny >= map.y) return TILE_CONTINUE;
  const ot = map.tiles[nx + ny*map.x];
  if (ot == 0) return TILE_END; // empty
  if (ot == tile) return TILE_CONTINUE; // same tile
  // check z value
  const ttd = LAYERS.get(tile);
  const otd = LAYERS.get(ot);
  if (!ttd) throw 'Bad layer type?: ' + tile;
  if (!otd) throw 'Bad layer type?: ' + ot;
  return ttd.zInternal < otd.zInternal ? TILE_EXTEND : TILE_END;
}
