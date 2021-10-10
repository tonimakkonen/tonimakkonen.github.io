
"use strict";

const PLAY_STATE_PLAYING  = 1;
const PLAY_STATE_DEAD     = 2;
const PLAY_STATE_FINISHED = 3;

var playState = null;

var playStaticMapObjects = [];

// Init & destroy play state //

function stateStartPlay(game) {
  // TODO: Move to player logic
  playerHealth = 100.0;
  playerMana = 100.0;
  if (gameModePlayingCampaign) playerStatsReset();

  playInitMap(game);
  uiCreate(game);
  playState = PLAY_STATE_PLAYING;
}

function playInitMap(game) {
  mapInitialize(game, mapBlueprint, playStaticMapObjects, false);
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
  signDestroyAll();
  infoDestroyAll();

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
  // Set up menu for next level
  playMenuSetupComplete(game);
}

function stateHandlePlay(game) {

  // TODO: Do not pass game.time.now
  playerHandleLogic(game, game.time.now);
  shotHandleLogic(game);

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

  signHandleLogic(game);
  infoHandleLogic(game);

  // Handle UI
  uiHandleLogic(game);

  // Handle state changes
  if (playState == PLAY_STATE_PLAYING) {

    if (playerHealth <= 0.0 ) {
        playState = PLAY_STATE_DEAD;
        playMenuSetupDead(game);
    }
  } else if (playState == PLAY_STATE_FINISHED || playState == PLAY_STATE_DEAD) {

    if (inputLeftClick && game.input.mousePointer.y > 600 - 40.0 &&  game.input.mousePointer.y < 600.0 + 40.0) {
      if (game.input.mousePointer.x < settingWidth * 0.5) {
        if (playState == PLAY_STATE_FINISHED && gameModePlayingCampaign) {
          playerProgress.level += 1;
          playerStatsSave();
          mapBlueprint = LEVELS.get(playerProgressSave.level).mapBlueprint;
        } else {
          if (gameModePlayingCampaign) playerStatsReset();
        }
        // Destroy everythign and restart
        playDestroyPhaserObjects(game);
        stateStartPlay(game);
      } else {
        // Back to whereever we were before this
        playDestroyPhaserObjects(game);
        return gameModeLast;
      }
    }

  } else {
    throw 'Unkown play state';
  }

  return GAME_MODE_PLAYING;
}
