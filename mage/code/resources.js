
"use strict";

function resLoadResources(game) {

  // Load all resources
  GRAPHS.forEach(
    (value, key) => {
      if (value.type == GRAPH_TYPE_SINGLE) {
        resLoadSingle(game, value);
      } else if (
        value.type == GRAPH_TYPE_LEFT_RIGHT ||
        value.type == GRAPH_TYPE_ANIM_3) {
        resLoadAnim(game, value);
      } else {
        throw 'Unkown graph type: ' + value;
      }
    }
  );

  // Load images related to layers
  LAYERS.forEach(
    (value, key) => {
      if (value.type == LAYER_TYPE_TOP) {
        resLoadTopLayer(game, value);
      } else {
        throw new 'Unkown layer type: ' + value;
      }
    }
  );

  // Images

  // bg images
  game.load.image('bg0', 'imgs/bg0.png');
  game.load.image('bg1', 'imgs/bg1.png');
  game.load.image('bg2', 'imgs/bg2.png');
  game.load.image('bg3', 'imgs/bg3.png');
  game.load.image('bg_forest', 'imgs/bg_forest.png');

  // TODO: Make this more generic
  game.load.image('ground_r0', 'imgs/ground/ground_r0.png');
  game.load.image('ground_r1', 'imgs/ground/ground_r1.png');

  // Sound
  game.load.audio('test_music', 'sound/music.mp3', true);
}

// Load single image
function resLoadSingle(game, value) {
  game.load.image(value.name, value.location);
}

// Load image with 4 frames for left right
function resLoadAnim(game, value) {
  game.load.spritesheet(
    value.name,
    value.location,
    { frameWidth: value.sizeX, frameHeight: value.sizeY }
  );
}

function resLoadTopLayer(game, value) {
  resLoadImageFromBase(game, value.name, value.locationBase, 'full');
  resLoadImageFromBase(game, value.name, value.locationBase, 'left');
  resLoadImageFromBase(game, value.name, value.locationBase, 'right');
  resLoadImageFromBase(game, value.name, value.locationBase, 'bottomleft');
  resLoadImageFromBase(game, value.name, value.locationBase, 'bottomright');
  resLoadImageFromBase(game, value.name, value.locationBase, 'bottom');
  resLoadImageFromBase(game, value.name, value.locationBase, 'top');
}

function resLoadImageFromBase(game, nameBase, urlBase, part) {
  game.load.image(nameBase + '_' + part, urlBase + '_' + part + '.png');
}

// create all the needed animations
function resCreateAnimations(game) {
  GRAPHS.forEach(
    (value, key) => {
      if (value.type == GRAPH_TYPE_SINGLE) {
        // no animations
      } else if (value.type == GRAPH_TYPE_LEFT_RIGHT) {
        resCreateLeftRightAnim(game, value);
      } else if (value.type == GRAPH_TYPE_ANIM_3) {
        resCreateAnim3(game, value);
      } else {
        throw 'Unkown graph type: ' + value.type;
      }
    }
  );
}

// Create left/right anims
function resCreateLeftRightAnim(game, value) {
  // Create animations
  game.anims.create({
    key: 'left',
    frames: game.anims.generateFrameNumbers(value.name, { start: 0, end: 1 }),
    frameRate: 4,
    repeat: -1
  });
  game.anims.create({
    key: 'right',
    frames: game.anims.generateFrameNumbers(value.name, { start: 2, end: 3 }),
    frameRate: 4,
    repeat: -1
  });
}

// Create 3 frame animations
function resCreateAnim3(game, value) {
  game.anims.create({
    key: 'anim',
    frames: game.anims.generateFrameNumbers(value.name, { start: 0, end: 2 }),
    frameRate: 4,
    repeat: -1
  });
}
