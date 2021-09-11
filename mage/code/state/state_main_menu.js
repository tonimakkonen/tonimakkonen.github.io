
"use strict";

var mmTextObjects = [];
var mmBg = null;;

function stateStartMainMenu(game) {

  // TODO: Change the BG
  mmBg = game.add.image(settingWidth/2, settingHeight/2, 'bg_night');

  mmAddNewText(game, 'Start on random map (easy)');
  mmAddNewText(game, 'Start on random map (difficult)');
  mmAddNewText(game, 'Start on random map (super big)');
  mmAddNewText(game, 'Test map 1: The descent (difficult)');
  mmAddNewText(game, 'Test map 2: Winter maze  (difficult)');
  mmAddNewText(game, 'Test map 3: Peaceful forest');
  mmAddNewText(game, 'Editor');
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
  // TODO: Refactor a bit
  if (option == 0) {
    mapBlueprint = mapCreateDummy(3, 1); // size, difficulty
    mmDestroy(game);
    return GAME_MODE_PLAYING;
  } else if(option == 1) {
    mapBlueprint = mapCreateDummy(5, 2); // size, difficulty
    mmDestroy(game);
    return GAME_MODE_PLAYING;
  } else if (option == 2) {
    mapBlueprint = mapCreateDummy(10, 1.5); // size, difficulty
    mmDestroy(game);
    return GAME_MODE_PLAYING;
  } else if (option == 3) {
    mapBlueprint = { ...testMapDescent };
    mmDestroy(game);
    return GAME_MODE_PLAYING;
  } else if (option == 4) {
    mapBlueprint = { ...testMapWinterMaze };
    mmDestroy(game);
    return GAME_MODE_PLAYING;
  } else if (option == 5) {
    mapBlueprint = { ...testMapForest };
    mmDestroy(game);
    return GAME_MODE_PLAYING;
  } else if (option == 6) {
    mmDestroy(game);
    return GAME_MODE_MAP_EDITOR;
  } else {
    throw 'Unknow option: ' + option;
  }
}
