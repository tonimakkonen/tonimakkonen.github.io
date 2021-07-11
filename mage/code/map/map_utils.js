
"use strict";

function mapIsBlocking(type) {
  if (type == 0) return false;
  const layer = LAYERS.get(type);
  if (layer) return layer.block;
  throw 'Unknown layer: ' + type;
}
