
"use strict";

var inputA;
var inputS;
var inputD;
var inputW;
var inputSpace;
var inputTab;
var inputPageUp;
var inputPageDown;

// TODO: This needs to be better
var inputLeftClickLast = false;
var inputLeftClick = false;
var inputRightClickLast = false;
var inputRightClick = false;
var inputTabClickLast = false;
var inputTabClick = false;

function inputInitialize(game) {

  // Allow right clicks
  game.input.mouse.disableContextMenu();

  // Set fullscreen button
  // TODO: DO We NEED this
  game.input.keyboard.on('keydown-' + 'F10',
  function (event) {
    console.log('F10 pressed');
    //game.scale.scaleMode = Phaser.Scale.FIT;
    //game.scale.autoCenter = Phaser.Scale.CENTER_BOTH;
    this.scale.startFullscreen();
    //this.scale.scaleMode = Phaser.Scale.FIT;
    //this.scale.autoCenter = Phaser.Scale.CENTER_BOTH;
  },
  game);

  game.scale.on(Phaser.Scale.Events.ENTER_FULLSCREEN, () => {
    console.log('enter fullscreen');
  });

  // Set default cursor (why do I need to do it like this?)
  game.input.setDefaultCursor('url(imgs/mage_cursor.cur), pointer');

  inputA = game.input.keyboard.addKey('A');
  inputS = game.input.keyboard.addKey('S');
  inputD = game.input.keyboard.addKey('D');
  inputW = game.input.keyboard.addKey('W');
  inputSpace = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  inputTab = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
  inputPageUp = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PAGE_UP);
  inputPageDown = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN);

}

function inputUpdate(game) {

  // TODO: Has to be a better way
  const curLeft = game.input.activePointer.leftButtonDown();
  if (curLeft && !inputLeftClickLast) {
    inputLeftClick = true;
  } else {
    inputLeftClick = false;
  }
  inputLeftClickLast = curLeft;

  const curRight = game.input.activePointer.rightButtonDown();
  if (curRight && !inputRightClickLast) {
    inputRightClick = true;
  } else {
    inputRightClick = false;
  }
  inputRightClickLast = curRight;

  const curTab = inputTab.isDown;
  if (curTab && !inputTabClickLast) {
    inputTabClick = true;
  } else {
    inputTabClick = false;
  }
  inputTabClickLast = curTab;
}
