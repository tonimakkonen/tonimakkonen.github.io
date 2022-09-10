
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

var gameState = undefined
var gameLoseFlag = undefined

var blueGold = undefined
var redGold = undefined
var blueRace = undefined
var blueGoldText = undefined
var redGoldText = undefined
var redRace = undefined
var blueAi = undefined
var redAi = undefined
var blueBase = undefined
var redBase = undefined
var map = []
var round = 1

var groupBlocks
var groupBlueUnits
var groupRedUnits
var groupBlueShots
var groupRedShots
var groupSplatter
var groupResources

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
  groupSplatter = this.physics.add.group()
  groupResources = this.physics.add.group()

  this.physics.add.collider(groupBlueUnits, groupBlocks)
  this.physics.add.collider(groupRedUnits,  groupBlocks)
  this.physics.add.collider(groupBlueUnits, groupRedUnits)
  this.physics.add.collider(groupSplatter, groupBlocks)
  this.physics.add.collider(groupResources, groupBlocks)

  this.physics.add.overlap(groupBlueShots, groupRedUnits, callbackUnitHit, null, this)
  this.physics.add.overlap(groupRedShots, groupBlueUnits, callbackUnitHit, null, this)
  this.physics.add.overlap(groupBlueShots, groupBlocks, callbackShotHitGround, null, this)
  this.physics.add.overlap(groupRedShots, groupBlocks, callbackShotHitGround, null, this)
  this.physics.add.overlap(groupBlueUnits, groupResources, callbackCollectResource, null, this)
  this.physics.add.overlap(groupRedUnits, groupResources, callbackCollectResource, null, this)


  // create tiles
  mapCreate(this)

}

function goldUpdateText(game) {
  const ty = CONFIG_HEIGHT - CONFIG_BLOCK / 2.0
  const tx = CONFIG_WIDTH*0.08
  const bgt = "Resources : " + blueGold
  const rgt = "Resources : " + redGold
  if (!blueGoldText) blueGoldText = game.add.text(tx, ty, bgt, { color: '#ffffff' })
  else blueGoldText.setText(bgt)
  if (!redGoldText) redGoldText = game.add.text(CONFIG_WIDTH - tx, ty, rgt, { color: '#ffffff' })
  else redGoldText.setText(rgt)
  blueGoldText.setOrigin(0.5, 0.5)
  redGoldText.setOrigin(0.5, 0.5)
  if (gameState == GAME_STATE_BUY || gameState == GAME_STATE_COMBAT) {
    redGoldText.setVisible(true)
    blueGoldText.setVisible(true)
  } else {
    redGoldText.setVisible(false)
    blueGoldText.setVisible(false)
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
  } else if (gameState == GAME_STATE_MAIN_MENU) {
    stateMainMenuUpdate(this)
  } else if (gameState == GAME_STATE_BUY) {
    stateBuyUpdate(this)
  } else if (gameState == GAME_STATE_COMBAT) {
    stateCombatUpdate(this)
  } else if (gameState == GAME_STATE_WIN) {
    stateWinUpdate(this)
  } else {
    throw "Unkown game state: " + gameState
  }


}

// CALLBACKS //

function callbackUnitHit(shot, unit) {
  if (shot.x_alreadyDead) return
  if (unit.x_alreadyDead) return
  shotDestroy(shot, this)
  unitHit(unit, shot, this)
}

function callbackShotHitGround(shot, block) {
  shotDestroy(shot, this)
}

function callbackCollectResource(unit, resource) {
  if (resource.x_alreadyDead) return
  resource.x_alreadyDead = true
  resource.destroy()
  playerAddGold(unit.x_player, 50)
  goldUpdateText(this)
}

// UTILS //

function playerGetRace(player) {
  if (player == PLAYER_BLUE) return blueRace
  else if (player == PLAYER_RED) return redRace
  throw "Bad player: " + player
}

function playerGetGold(player) {
  if (player == PLAYER_BLUE) return blueGold
  else if (player == PLAYER_RED) return redGold
  throw "Bad player: " + player
}

function playerAddGold(player, amount) {
  if (player == PLAYER_BLUE) {
    blueGold += amount
    return blueGold
  } else if (player == PLAYER_RED) {
    redGold += amount
    return redGold
  }
  throw "Bad player: " + player
}

function playerGetAi(player) {
  if (player == PLAYER_BLUE) return blueAi
  else if (player == PLAYER_RED) return redAi
  throw "Bad player: " + player
}
