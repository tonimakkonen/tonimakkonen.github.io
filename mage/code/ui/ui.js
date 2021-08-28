
"use strict";

const uiBarWidth = 200;
const uiBarHeight = 18;

var uiBarBg = null;
var uiHealthBar = null;
var uiManaBar = null;

// TODO: Consider passing arguments to this method

function uiCreate(game) {
  uiBarBg = game.add.rectangle(20.0 + uiBarWidth / 2.0, settingHeight - 30, uiBarWidth + 10.0, uiBarHeight * 2.0 + 10, 0x000000);
  uiBarBg.setScrollFactor(0.0, 0.0);
  uiBarBg.setDepth(10);
  uiBarBg.setAlpha(0.5);
  uiHealthBar = game.add.rectangle(20.0 + uiBarWidth / 2.0, settingHeight - 40, uiBarWidth, uiBarHeight, 0xff0000);
  uiManaBar = game.add.rectangle(20.0 + uiBarWidth / 2.0, settingHeight - 20, uiBarWidth, uiBarHeight, 0x0000ff);
  uiHealthBar.alpha = 0.5;
  uiManaBar.alpha = 0.5;
  uiHealthBar.setScrollFactor(0.0, 0.0);
  uiManaBar.setScrollFactor(0.0, 0.0);
  uiHealthBar.setDepth(10);
  uiManaBar.setDepth(10);
}

function uiUpdateHealthBar(game) {
  const width = (playerHealth / 100.0) * uiBarWidth;
  uiHealthBar.setSize(width, uiBarHeight);
}

function uiUpdateManaBar(game) {
  const width = (playerMana / 100.0) * uiBarWidth;
  uiManaBar.setSize(width, uiBarHeight);
}

function uiUpdateSpellBars(game) {

}

function uiDestroy(game) {
  if (uiBarBg != null) uiBarBg.destroy();
  if (uiHealthBar != null) uiHealthBar.destroy();
  if (uiManaBar != null) uiManaBar.destroy();
}
