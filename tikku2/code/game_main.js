
"use strict";

// Phaser3 game config
var config = {
  type: Phaser.AUTO,
  width: CONFIG_WIDTH,
  height: CONFIG_HEIGHT,
  parent: 'gamediv',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    parent: 'gamediv',
    width: CONFIG_WIDTH,
    height: CONFIG_HEIGHT
  },
};

// Global variables

var gameSingleton = new Phaser.Game(config);

var mouseClick = false
var mouseDownLast = false
var mouseX = undefined
var mouseY = undefined

var gameStateLast = undefined
var gameState = undefined

var blueGold = undefined
var redGold = undefined
var blueRace = undefined
var blueGoldText = undefined
var redGoldText = undefined
var redRace = undefined
var blueAi = undefined
var redAi = undefined

var groupBlocks
var groupBlueUnits
var groupRedUnits
var groupBlueShots
var groupRedShots

////////////////////////
// Phaser 3 functions //
////////////////////////

function preload() {
  resLoadResources(this);

}

function create() {

  groupBlocks = this.physics.add.staticGroup()

  groupBlueUnits = this.physics.add.group()
  groupRedUnits = this.physics.add.group()
  groupBlueShots = this.physics.add.group()
  groupRedShots = this.physics.add.group()

  this.physics.add.collider(groupBlueUnits, groupBlocks)
  this.physics.add.collider(groupRedUnits,  groupBlocks)
  this.physics.add.collider(groupBlueUnits, groupRedUnits)

  this.physics.add.overlap(groupBlueShots, groupRedUnits, callbackUnitHit, null, this)
  this.physics.add.overlap(groupRedShots, groupBlueUnits, callbackUnitHit, null, this)
  this.physics.add.overlap(groupBlueShots, groupBlocks, callbackShotHitGround, null, this)
  this.physics.add.overlap(groupRedShots, groupBlocks, callbackShotHitGround, null, this)

  // create tiles
  mapCreate(this)

}

function goldUpdateText(game) {
  if (!blueGoldText) {
      blueGoldText = game.add.text(80, CONFIG_HEIGHT - 20, blueGold, { color: '#fff' }).setOrigin(0.5, 0.5)
  } else {
    blueGoldText.setText(blueGold)
  }
  if (!redGoldText) {
    redGoldText = game.add.text(CONFIG_WIDTH - 80, CONFIG_HEIGHT - 20, blueGold, { color: '#fff' }).setOrigin(0.5, 0.5)
  } else {
    redGoldText.setText(redGold)
  }
}

function update() {

  // handle mouse logic (wtf does phaser3 does not have this..)
  mouseClick = false;
  if (this.input.mousePointer.isDown && ! mouseDownLast) mouseClick = true
  mouseDownLast = this.input.mousePointer.isDown
  mouseX = this.input.mousePointer.x
  mouseY = this.input.mousePointer.y

  // Handle game state changes
  if (!gameState) {
    gameState = GAME_STATE_MAIN_MENU
    stateMainMenuStart(this)
  } else if (gameState == GAME_STATE_MAIN_MENU) {
    stateMainMenuUpdate(this)
  } else if (gameState == GAME_STATE_COMBAT) {
    stateCombatUpdate(this)
  } else {
    throw "Unkown game state: " + gameState
  }


}

function callbackUnitHit(shot, unit) {
  if (shot.x_alreadyDead) return
  if (unit.x_alreadyDead) return
  shotDestroy(shot, this)
  unitHit(unit, shot, this)
}

function callbackShotHitGround(shot, block) {
  shotDestroy(shot, this)
}
