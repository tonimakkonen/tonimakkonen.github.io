
"use strict";

var inputA;
var inputS;
var inputD;
var inputW;
var inputSpace;
var inputTab;

// TODO: This needs to be better
var inputLeftClickLast = false;
var inputLeftClick = false;
var inputTabClickLast = false;
var inputTabClick = false;

function inputInitialize(game) {

  // Allow right clicks
  game.input.mouse.disableContextMenu();

  // Set fullscreen button
  game.input.keyboard.on('keydown-' + 'F10', function (event) { this.scale.startFullscreen(); }, game);

  // Set default cursor (why do I need to do it like this?)
  game.input.setDefaultCursor('url(imgs/mage_cursor.cur), pointer');

  inputA = game.input.keyboard.addKey('A');
  inputS = game.input.keyboard.addKey('S');
  inputD = game.input.keyboard.addKey('D');
  inputW = game.input.keyboard.addKey('W');
  inputSpace = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  inputTab = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);

}

function inputUpdate(game) {

  // TODO: Has to be a better way
  const curValue = game.input.activePointer.leftButtonDown();
  if (curValue && !inputLeftClickLast) {
    inputLeftClick = true;
  } else {
    inputLeftClick = false;
  }
  inputLeftClickLast = curValue;

  const curTab = inputTab.isDown;
  if (curTab && !inputTabClickLast) {
    inputTabClick = true;
  } else {
    inputTabClick = false;
  }
  inputTabClickLast = curTab;
}
