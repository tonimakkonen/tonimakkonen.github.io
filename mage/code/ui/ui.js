
"use strict";

// TODO: Refactor this totally

// Options and derived options
const uiOptions = {
  width: 300,
  height: 40,
  dx: 15,
  dy: 15,
  m: 4,
  gridDeltaY: 50.0,
  spellCenterX: 300.0,
  spellCenterY: 300.0,
  spellDelta: 90.0,
  spellScale: 0.75,
  skillX: 700,
  skillY: 100
}

// Width of full health bar
const uiHealthBarWidth = uiOptions.width - 2.0 * uiOptions.m;
const uiHealthBarHeight = (uiOptions.height - 3.0 * uiOptions.m) * 0.5;

// Normal UI always visible
var uiBarBg = null;
var uiHealthBar = null;
var uiManaBar = null;
var uiLeftSpell = null;
var uiRightSpell = null;

// All the objects that open up with tab
var uiSpellSelectionVisible = false;
var uiTabObjects = [];
var uiHelpText = null;

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

  // This TAB object is always present but hidden
  uiHelpText = game.add.text(0, 0, '').setOrigin(0.0);
  uiHelpText.setScrollFactor(0.0, 0.0);
  uiHelpText.setDepth(20.0);
}

function uiCreateStatTexts(game, list) {
  uiCreateStatText(game, 20.0, 20.0, 'D:   0 %', 'Defence against fire magic', list);
  uiCreateStatText(game, 20.0, 40.0, 'M:  50 %', 'Mana save using fire magic', list);
  uiCreateStatText(game, 20.0, 60.0, 'S: 100 %', 'Speed casting fire magic', list);

  uiCreateStatText(game, 160.0 + 20.0, 20.0, 'D:   0 %', 'Defence against air magic', list);
  uiCreateStatText(game, 160.0 + 20.0, 40.0, 'M:  50 %', 'Mana save using air magic', list);
  uiCreateStatText(game, 160.0 + 20.0, 60.0, 'S: 100 %', 'Speed casting air magic', list);
}

function uiCreateStatText(game, px, py, text, help, list) {
  var obj = game.add.text(px, py, text);
  obj.setScrollFactor(0.0, 0.0);
  obj.setDepth(10.0);

  list.push({
    gameObjs: [obj],
    x: obj.x,
    y: obj.y,
    width: obj.width,
    height: obj.height,
    help: help
  })
}

// Hide all spell selection elements
function uiHideSpellSelection(game) {
  uiTabObjects.forEach(uiTabObject => {
    uiTabObject.gameObjs.forEach(phaserObj => { phaserObj.destroy(); });
  });
  uiTabObjects = [];
  uiSpellSelectionVisible = false;
}

// Show and update all tab elements
function uiShowSpellSelection(game) {

  // Create spells
  SPELLS.forEach((spell, key) => {
    const delta = uiOptions.spellDelta;
    const cx = uiOptions.spellCenterX + spell.posX * delta;
    const cy = uiOptions.spellCenterY + spell.posY * delta;
    var image;
    var selectSpell = undefined;
    var help = undefined;
    if (playerStats.spells.includes(key)) {
      image = game.add.image(cx, cy, spell.image);
      help = spell.name;
      selectSpell = spell;
    } else {
      image = game.add.image(cx, cy, 'spell_base');
      image.setAlpha(0.25);
    }
    image.setScrollFactor(0.0, 0.0);
    image.setDepth(10.0);
    image.setScale(uiOptions.spellScale);
    uiTabObjects.push({
      gameObjs: [image],
      x: cx - delta / 2,
      y: cy - delta / 2,
      width: delta,
      height: delta,
      help: help, // TODO: set better help
      selectSpell: selectSpell
    })
  });

  // Create skills that can be learned
  const text = game.add.text(uiOptions.skillX, uiOptions.skillY, 'Learnable skills');
  text.setScrollFactor(0.0, 0.0);
  text.setDepth(10.0);
  uiTabObjects.push({gameObjs: [text]});

  const learnableSkills = skillGetLearnable(playerProgress.skills);
  for (var i = 0; i < learnableSkills.length; i++) {
    const skill = SKILLS.get(learnableSkills[i]);
    const px = uiOptions.skillX;
    const py = uiOptions.skillY + (i + 2) * 40.0; // TODO:
    const text = game.add.text(px, py, skill.name);
    text.setScrollFactor(0.0, 0.0);
    text.setDepth(10.0);
    uiTabObjects.push({
      gameObjs: [text],
      x: text.x,
      y: text.y,
      width: text.width,
      height: text.height,
      help: skill.help,
      learnSkill: learnableSkills[i]
    })

  }

  // Create info texts

  uiSpellSelectionVisible = true;
}

// Handle spell selection logic and other UI logic
function uiHandleLogic(game) {

  // Handle TAB logic (spell selection & skills)
  const tabDown = inputTab.isDown;
  if (tabDown && !uiSpellSelectionVisible) uiShowSpellSelection(game);
  if (!tabDown && uiSpellSelectionVisible) uiHideSpellSelection(game);
  if (tabDown) {

    var changes = false;
    var onTabObject = false;
    const mx = game.input.mousePointer.x;
    const my = game.input.mousePointer.y;
    for (var i = 0; i < uiTabObjects.length; i++) {
      const ho = uiTabObjects[i];
      if (ho.x && mx >= ho.x && mx <= ho.x + ho.width && my >= ho.y && my <= ho.y + ho.height) {
        uiHelpText.setVisible(true);
        uiHelpText.setText(ho.help);
        uiHelpText.setPosition(mx + 40.0, my);
        onTabObject = true;

        // Select spell
        if (inputLeftClick && ho.selectSpell) {
          playerLeftSpell = ho.selectSpell;
          changes = true;
        }
        if (inputRightClick && ho.selectSpell) {
          playerRightSpell = ho.selectSpell;
          changes = true;
        }

        if (inputLeftClick && ho.learnSkill) {
          playerProgress.skills.push(ho.learnSkill);
          playerStatsUpdate();
          changes = true;
        }

      }
    }
    if (!onTabObject) uiHelpText.setVisible(false);

    if (changes) {
      uiHideSpellSelection(game);
      uiShowSpellSelection(game);
    }

  } else {
    uiHelpText.setVisible(false);
  }

  // TODO: Update player health and mana here! (not callback from player stuff)

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
      current.destroy();
      return uiCreateSpellIcon(game, posX, spell.image);
    }
  }
  return current;
}

function uiCreateSpellIcon(game, posX, texture) {
    const requiredScale = uiOptions.height / 80.0; // Hard coded height of spell artwork
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
  if (uiHelpText != null) uiHelpText.destroy();
  uiHideSpellSelection();
}
