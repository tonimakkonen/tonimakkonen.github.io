
"use strict";

// This file is used for death & completion menu when playing

var playMenuObjects = [];

function playMenuDestroy() {
  playMenuObjects.forEach(o => o.destroy());
  playMenuObjects = [];
}

// Menu when player dies
function playMenuSetupDead(game) {
  playMenuSetupMenu(game, 'You died', 'Retry level', playMenuGetLastModetext());
}

// Menu when level is completed
function playMenuSetupComplete(game) {
  // TODO: Different behaviour based on what was the last mode
  playMenuSetupMenu(game, 'Level completed', 'Retry level', playMenuGetLastModetext());
}

function playMenuGetLastModetext() {
  if (gameModeLast == GAME_MODE_MAP_EDITOR) {
    return 'Back to editor';
  } else if (gameModeLast == GAME_MODE_MAIN_MENU) {
    return 'Back to main menu';
  } else {
    throw 'Cannot handle other last game mode: ' + gameModeLast;
  }
}

function playMenuSetupMenu(game, title, leftText, rightText) {
  var obj = game.add.rectangle(settingWidth / 2.0, 600.0, settingWidth, 80, 0x000000).setDepth(10).setScrollFactor(0.0, 0.0);
  playMenuObjects.push(obj);
  obj = game.add.text(settingWidth * 0.5, 600.0 - 15.0, title).setOrigin(0.5).setDepth(10).setScrollFactor(0.0, 0.0);
  playMenuObjects.push(obj);
  obj = game.add.text(settingWidth * 0.25, 600.0 + 15.0, leftText).setOrigin(0.5).setDepth(10).setScrollFactor(0.0, 0.0);
  playMenuObjects.push(obj);
  obj = game.add.text(settingWidth * 0.75, 600.0 + 15.0, rightText).setOrigin(0.5).setDepth(10).setScrollFactor(0.0, 0.0);
  playMenuObjects.push(obj);
}
