
"use strict";

// Options and derived options
const uiOptions = {
  width: 300,
  height: 40,
  dx: 15,
  dy: 15,
  m: 4
}

// Width of full health bar
const uiHealthBarWidth = uiOptions.width - 2.0 * uiOptions.m;
const uiHealthBarHeight = (uiOptions.height - 3.0 * uiOptions.m) * 0.5;


var uiBarBg = null;
var uiHealthBar = null;
var uiManaBar = null;
var uiLeftSpell = null;
var uiRightSpell = null;

var uiSpellSelectionVisible = false;
var uiSpellSelections = [];

const uiGridSize = 160.0;
const uiGridDelta = 0.0;

function uiCreate(game) {
  const bgCenterX = uiOptions.dx + uiOptions.width * 0.5;
  const bgCenterY = settingHeight - uiOptions.dy - uiOptions.height * 0.5;
  uiBarBg = game.add.rectangle(bgCenterX, bgCenterY, uiOptions.width, uiOptions.height, 0x000000);
  uiBarBg.setScrollFactor(0.0, 0.0);
  uiBarBg.setDepth(10);
  uiBarBg.setAlpha(0.5);
  const lowerBar = settingHeight - uiOptions.dy - uiOptions.m - uiHealthBarHeight * 0.5;
  const higherBar = lowerBar - uiOptions.m - uiHealthBarHeight;
  uiHealthBar = game.add.rectangle(bgCenterX, higherBar, uiHealthBarWidth, uiHealthBarHeight, 0xff0000);
  uiManaBar = game.add.rectangle(bgCenterX, lowerBar, uiHealthBarWidth, uiHealthBarHeight, 0x0000ff);
  uiHealthBar.alpha = 0.5;
  uiManaBar.alpha = 0.5;
  uiHealthBar.setScrollFactor(0.0, 0.0);
  uiManaBar.setScrollFactor(0.0, 0.0);
  uiHealthBar.setDepth(10);
  uiManaBar.setDepth(10);

  // Create spell selections
  SPELLS.forEach(spell => {
    const cx = uiGridDelta + (spell.posX + 0.5) * uiGridSize;
    const cy = uiGridDelta + (spell.posY + 0.5) * uiGridSize;
    const image = game.add.image(cx, cy, spell.image);
    image.setScrollFactor(0.0, 0.0);
    image.setDepth(10.0);

    const text = game.add.text(cx, cy + 45.0, spell.name).setOrigin(0.5);
    text.setScrollFactor(0.0, 0.0);
    text.setDepth(10.0);

    uiSpellSelections.push(image);
    uiSpellSelections.push(text);
  });
  uiHideSpellSelection(game);

}

function uiHideSpellSelection(game) {
  uiSpellSelections.forEach(o => o.setVisible(false));
  uiSpellSelectionVisible = false;
}

function uiShowSpellSelection(game) {
  uiSpellSelections.forEach(o => o.setVisible(true));
  uiSpellSelectionVisible = true;
}

// Handle spell selection logic and other UI logic
function uiHandleLogic(game) {
  const tabDown = inputTab.isDown;
  if (tabDown && !uiSpellSelectionVisible) uiShowSpellSelection(game);
  if (!tabDown && uiSpellSelectionVisible) uiHideSpellSelection(game);
  if (tabDown) {
    const gx = Math.floor((game.input.mousePointer.x - uiGridDelta) / uiGridSize);
    const gy = Math.floor((game.input.mousePointer.y - uiGridDelta) / uiGridSize);
    const spell = spellFromGrid(gx, gy);
    if (spell != null) {
      // TODO: Make this better
      if (game.input.activePointer.leftButtonDown()) {
        playerLeftSpell = spell;
      }
      if (game.input.activePointer.rightButtonDown()) {
        playerRightSpell = spell;
      }
    }
  }

  // Update spell icons
  uiUpdateSpellIcons(game);
}

function uiUpdateSpellIcons(game) {
  uiLeftSpell = uiUpdateSpellIcon(game, uiOptions.width + 2.0 * uiOptions.dx  + uiOptions.height * 0.5, uiLeftSpell, playerLeftSpell);
  uiRightSpell = uiUpdateSpellIcon(game, uiOptions.width + uiOptions.height * 1.5 + 3.0 * uiOptions.dx, uiRightSpell, playerRightSpell);
}

function uiUpdateSpellIcon(game, posX, current, spell) {
  if (current == null) {
    if (spell != null) {
      return uiCreateSpellIcon(game, posX, spell.image);
    }
  } else {
    if (spell == null) {
      current.destroy();
      return null;
    } else if (spell.image != current.texture.key) {
      console.log('replacing spell');
      current.destroy();
      return uiCreateSpellIcon(game, posX, spell.image);
    }
  }
  return current;
}

function uiCreateSpellIcon(game, posX, texture) {
    const requiredScale = uiOptions.height / 120.0; // Hard coded height of spell artwork
    const bgCenterY = settingHeight - uiOptions.dy - uiOptions.height * 0.5;
    var image = game.add.image(posX, bgCenterY, texture);
    image.setScale(requiredScale);
    image.setScrollFactor(0.0, 0.0);
    image.setDepth(10.0);
    return image;
}


function getWidthFraction(current, max) {
  const value = current / max;
  if (value < 0.0) return 0.0;
  if (value > 1.0) return 1.0;
  return value;
}

function uiUpdateHealthBar(game) {
  uiHealthBar.setSize(getWidthFraction(playerHealth, 100) * uiHealthBarWidth, uiHealthBarHeight);
}

function uiUpdateManaBar(game) {
  uiManaBar.setSize(getWidthFraction(playerMana, 100) * uiHealthBarWidth, uiHealthBarHeight);
}

function uiDestroy(game) {
  if (uiBarBg != null) uiBarBg.destroy();
  uiBarBg = null;
  if (uiHealthBar != null) uiHealthBar.destroy();
  uiHealthBar = null;
  if (uiManaBar != null) uiManaBar.destroy();
  uiManaBar = null;
  if (uiLeftSpell != null) uiLeftSpell.destroy();
  uiLeftSpell = null;
  if (uiRightSpell != null) uiRightSpell.destroy();
  uiRightSpell = null;
  uiSpellSelections.forEach(o => o.destroy());
  uiSpellSelections = [];
}
