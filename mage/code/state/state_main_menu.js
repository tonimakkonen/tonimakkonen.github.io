
"use strict";

var mmTextObjects = [];
var mmBg = null;;

function stateStartMainMenu(game) {

  // TODO: Change the BG
  mmBg = game.add.image(settingWidth/2, settingHeight/2, 'bg_night');

  if (!playerProgressSave.started) mmAddNewText(game, 'Start new game');
  else mmAddNewText(game, 'Continue game (level ' + playerProgressSave.level + ')');
  mmAddNewText(game, 'Editor');
  if (playerProgressSave.started) mmAddNewText(game, 'Reset progress')
}

function mmAddNewText(game, text) {
  const x = 60;
  const y = 60 * (1 + mmTextObjects.length);
  const newText = game.add.text(x, y, text).setColor('#FFFFFF');
  mmTextObjects.push(newText);
}

function mmDestroy(game) {
  for (var i = 0; i < mmTextObjects.length; i++) {
    mmTextObjects[i].destroy();
  }
  mmTextObjects = [];
  mmBg.destroy();
  mmBg = null;
}

function stateHandleMainMenu(game) {

  // Handle text effects
  var selected = -1;
  for (var i = 0; i < mmTextObjects.length; i++) {
    const ymin = 60*(i + 1) - 30;
    const ymax = 60*(i + 1) + 30;
    if (game.input.mousePointer.y > ymin && game.input.mousePointer.y < ymax) {
      mmTextObjects[i].setColor('#FF0000');
      if (game.input.activePointer.leftButtonDown()) {
        return mmPushButton(game, i);
      }
    } else {
      mmTextObjects[i].setColor('#FFFFFF');
    }
  }


  return GAME_MODE_MAIN_MENU;

}

function mmPushButton(game, option) {
  // TODO: Handle
  if (option == 0) {
    // Continue on the campaign
    gameModePlayingCampaign = true;
    playerProgressSave.started = true;
    storageSavePlayerProgress();
    mapBlueprint = LEVELS.get(playerProgressSave.level).mapBlueprint;
    mmDestroy();
    return GAME_MODE_PLAYING;
  } else if (option == 1) {
    // EDITOR
    gameModePlayingCampaign = false;
    mmDestroy(game);
    return GAME_MODE_MAP_EDITOR;
  } else if (option == 2) {
    playerStatsFullReset();
    playerStatsSave();
    mmReCreate(game);
    return GAME_MODE_MAIN_MENU;
  } else {
    throw 'Unknow option: ' + option;
  }
}

// Recreate the full main menu
function mmReCreate(game) {
  mmDestroy();
  stateStartMainMenu(game);
}
