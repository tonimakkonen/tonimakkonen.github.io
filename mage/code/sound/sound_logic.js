
"use strict";

var soundRequests = new Map();
var soundMinDis = 200.0;
var soundMaxDis = 1000.0;

function soundRequest(game, key) {
  soundRequestVolume(game, key, 1.0);
}

function soundRequestEnv(game, key, x, y) {
  const dx = x - playerLocation.x;
  const dy = y - playerLocation.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const vol = 1.0 - (len - soundMinDis) / (soundMaxDis - soundMinDis);
  if (vol >= 1.0) {
    soundRequestVolume(game, key, 1.0);
  }  else if (vol > 0.0) {
    soundRequestVolume(game, key, vol);
  }
}

function soundRequestVolume(game, key, volume) {
  const current = soundRequests.get(key);
  if (!current || volume > current) {
    soundRequests.set(key, volume);
  }
}

function soundHandleLogic(game) {
  soundRequests.forEach((volume, key) => {
    game.sound.play(key, { volume: volume });
  });
  soundRequests.clear();
}
