
"use strict";

// Phaser3 game config
var config = {
  type: Phaser.AUTO,
  width: settingWidth,
  height: settingHeight,
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
    width: settingWidth,
    height: settingHeight
  },
};

// Game singletons

var gameSingleton = new Phaser.Game(config);
var gameMode = GAME_MODE_NONE;
var gameModeLast = gameMode;

var groupBlocks;
var groupPlayerBlocks; // some enemies block players
var groupPlayer;
var groupEnemies;
var groupPlayerShots;
var groupEnemyShots;
var groupPickups;
var groupExits;
var groupSigns;
var listEnemies = []; // TODO: We do not need this

// Current map blueprint
var mapBlueprint = null;

// Run local storage
storageLoad();

////////////////////////
// Phaser 3 functions //
////////////////////////

function preload() {
  resLoadResources(this);
}

function create() {

  resCreateAnimations(this);
  inputInitialize(this);

  // Set up phaser3 wiring
  groupBlocks = this.physics.add.staticGroup();
  groupPlayerBlocks = this.physics.add.staticGroup();
  groupPlayer = this.physics.add.group();
  groupEnemies = this.physics.add.group();
  groupPlayerShots = this.physics.add.group();
  groupEnemyShots = this.physics.add.group();
  groupPickups = this.physics.add.group();
  groupExits = this.physics.add.group();
  groupSigns = this.physics.add.staticGroup();

  this.physics.add.collider(groupBlocks, groupPlayer);
  this.physics.add.collider(groupPlayerBlocks, groupPlayer);
  this.physics.add.collider(groupBlocks, groupEnemies);
  this.physics.add.collider(groupBlocks, groupPickups);
  this.physics.add.collider(groupBlocks, groupPlayerShots, mainShotHitWall, null, this);
  this.physics.add.collider(groupBlocks, groupEnemyShots, mainShotHitWall, null, this);

  this.physics.add.overlap(groupPlayerShots, groupEnemies, mainShotHitEnemy, null, this);
  this.physics.add.overlap(groupEnemyShots, groupPlayer, mainShotHitPlayer, null, this);
  this.physics.add.overlap(groupPickups, groupPlayer, mainCollectedPickup, null, this);
  this.physics.add.overlap(groupExits, groupPlayer, mainEnterExit, null, this);


  // TODO
  //var music = this.sound.add('test_music');
  //music.setLoop(true);
  //music.play();

}

function update() {

  // Update input
  // TODO: Does phaser have these in a better fashion?
  inputUpdate(this);

  var newMode = gameMode;
  if (gameMode == GAME_MODE_NONE) {
    newMode = GAME_MODE_MAIN_MENU;
  } else if (gameMode == GAME_MODE_MAIN_MENU) {
    newMode = stateHandleMainMenu(this);
  } else if (gameMode == GAME_MODE_PLAYING) {
    newMode = stateHandlePlay(this);
  } else if (gameMode == GAME_MODE_MAP_EDITOR) {
    newMode = stateHandleEditor(this);
  } else {
    throw 'Unkown game mode: ' + gameMode;
  }

  // Change state
  if (newMode != gameMode) {
    gameModeLast = gameMode;
    gameMode = newMode;
    if (gameMode == GAME_MODE_MAIN_MENU) {
      stateStartMainMenu(this);
    } else if (gameMode == GAME_MODE_PLAYING) {
      stateStartPlay(this);
    } else if (gameMode == GAME_MODE_MAP_EDITOR) {
      stateStartEditor(this);
    } else {
      throw 'Switching to unknown game mode: ' + newMode;
    }
  }

  // Handle requested sounds
  soundHandleLogic(this);

}

// Just use these function to relay messages to the right place

function mainShotHitEnemy(shot, enemy) {
  shotHitEnemy(this, shot, enemy);
}

function mainShotHitPlayer(shot, player) {
  shotHitPlayer(this, shot, player);
}

function mainShotHitWall(wall, shot) {
  shotHitWall(this, shot);
}

function mainCollectedPickup(pickup, _pl) {
  pickupCollect(this, pickup);
}

// TODO: Use signs as exits
function mainEnterExit(exit, _pl) {
  playEnterExit(this, exit);
}
