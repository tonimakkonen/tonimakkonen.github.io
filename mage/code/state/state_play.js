
"use strict";

const PLAY_STATE_PLAYING  = 1;
const PLAY_STATE_FINISHED = 2; // Dead or finished level

var playState = null;

var playStaticMapObjects = [];

// Init & destroy play state //

function stateStartPlay(game) {
  // TODO: Move to player logic
  playerHealth = 100.0;

  playInitMap(game);
  uiCreate(game);
  playState = PLAY_STATE_PLAYING;
}

function playInitMap(game) {
  mapInitialize(game, mapBlueprint, playStaticMapObjects);
  // TODO: Add player following here
}

function playDestroyPhaserObjects(game) {
  // Destroy all map objects
  playStaticMapObjects.forEach(o => o.destroy());
  playStaticMapObjects = [];

  // Destroy all non-static content
  enemyDestroyAll();
  pickupDestroyAll();
  shotDestroyAll();

  // Destroy UI
  uiDestroy();
  playMenuDestroy();

  // Camera and other stuff
  game.cameras.main.stopFollow();
  game.cameras.main.removeBounds();
  game.cameras.main.centerOn(settingWidth / 2.0, settingHeight / 2.0);
}

// When entering the game exit
function playEnterExit(game, exit) {
  // Destroy the player
  player.destroy();
  player = null;
  // Move to finished state
  playState = PLAY_STATE_FINISHED;
  playMenuSetupComplete(game);
}

function stateHandlePlay(game) {

  playerHandleLogic(game, game.time.now);

  // Handle all enemy logic
  // TODO: Does it need to be like this?
  for (var i = listEnemies.length - 1; i >= 0; i--) {
    var enemy = listEnemies[i];
    const alive = enemyHandleLogic(game, enemy, game.time.now);
    if (!alive) {
      enemyDestroy(enemy);
      listEnemies.splice(i, 1);
    }
  }

  // Handle shot logic

  // Handle state changes
  if (playState == PLAY_STATE_PLAYING) {

    if (playerHealth <= 0.0 ) {
        playState = PLAY_STATE_FINISHED;
        playMenuSetupDead(game);
    }
  } else if (playState == PLAY_STATE_FINISHED) {

    // && game.input.mousePointer.y > 600 + 40.0 &&  game.input.mousePointer.y < 600.0 - 40.0

    if (inputLeftClick) {
      if (game.input.mousePointer.x < settingWidth * 0.5) {
        // retry level
        playDestroyPhaserObjects(game);
        stateStartPlay(game);
      } else {
        // Back to other thing
        playDestroyPhaserObjects(game);
        return gameModeLast;
      }
    }

  }

  return GAME_MODE_PLAYING;
}
