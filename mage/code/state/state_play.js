
"use strict";

const PLAY_STATE_PLAYING  = 1;
const PLAY_STATE_DEAD     = 2;
const PLAY_STATE_COMPLETE = 3;

var playState = null;

var playStaticMapObjects = [];
var playMenuObjects = [];

// Init & destroy play state //

function stateStartPlay(game) {
  // TODO: Mode to player logic
  playerHealth = 100.0;

  playInitMap(game);
  uiCreate(game);
  playState = PLAY_STATE_PLAYING;
}

function playInitMap(game) {
  mapInitialize(game, mapBlueprint, playStaticMapObjects);
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
  playMenuObjects.forEach(o => o.destroy());
  playMenuObjects = [];

  // Camera and other stuff
  game.cameras.main.stopFollow();
  // TODO: World bounds, camera position
}

function stateHandlePlay(game) {

  playerHandleLogic(game, game.time.now);

  // Handle all enemy logic
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

    // Player dies
    if (playerHealth <= 0.0 ) {
        playState = PLAY_STATE_DEAD;
        playSetupDeadMenu(game);
    }
  } else if (playState == PLAY_STATE_DEAD) {

    // && game.input.mousePointer.y > 600 + 40.0 &&  game.input.mousePointer.y < 600.0 - 40.0

    if (inputLeftClick) {
      console.log('foo');
      if (game.input.mousePointer.x < settingWidth * 0.5) {
        // retry level
        playDestroyPhaserObjects(game);
        stateStartPlay(game);
      } else {
        console.log('bar');
        // Back to other thing
        playDestroyPhaserObjects(game);
        return gameModeLast;
      }
    }

  } else if (playState == PLAY_STATE_COMPLETE) {

  }


  return GAME_MODE_PLAYING;

}

function playSetupDeadMenu(game) {
  var obj = game.add.rectangle(settingWidth / 2.0, 600.0, settingWidth, 80, 0x000000).setDepth(10).setScrollFactor(0.0, 0.0);
  playMenuObjects.push(obj);
  obj = game.add.text(settingWidth * 0.5, 600.0 - 15.0, 'You died').setOrigin(0.5).setDepth(10).setScrollFactor(0.0, 0.0);
  playMenuObjects.push(obj);
  obj = game.add.text(settingWidth * 0.25, 600.0 + 15.0, 'Retry level').setOrigin(0.5).setDepth(10).setScrollFactor(0.0, 0.0);
  playMenuObjects.push(obj);

  var backText;
  if (gameModeLast == GAME_MODE_MAP_EDITOR) {
    backText = 'Back to editor';
  } else if (gameModeLast == GAME_MODE_MAIN_MENU) {
    backText = 'Back to main menu';
  } else {
    throw 'Cannot handle other last game mode: ' + gameModeLast;
  }
  obj = game.add.text(settingWidth * 0.75, 600.0 + 15.0, backText).setOrigin(0.5).setDepth(10).setScrollFactor(0.0, 0.0);
  playMenuObjects.push(obj);
}
