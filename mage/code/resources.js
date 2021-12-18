
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
      } else if (value.type == LAYER_TYPE_SYMMETRIC) {
        resLoadSymmetricLayer(game, value);
      } else if (value.type == LAYER_TYPE_SINGLE) {
        resLoadSingleLayer(game, value);
      } else if (value.type == LAYER_TYPE_INVISIBLE) {
        // do nothing
      } else {
        throw new 'Unkown layer type: ' + value;
      }
    }
  );

  // Images

  // bg images
  BACKGROUNDS.forEach(
    (value, key) => {
      if (value.name) {
        game.load.image(value.name, value.location)
      }
    }
  )

  // Load UI images not defined in config
  game.load.image('ui_eraser_all', 'imgs/ui/eraser_all.png');
  game.load.image('ui_eraser_obj', 'imgs/ui/eraser_obj.png');

  // Load spell images (not defined in config)
  game.load.image('spell_dummy', 'imgs/spells/spell_dummy.png');

  game.load.image('spell_base', 'imgs/spells/spell_base.png');
  game.load.image('spell_air_punch', 'imgs/spells/spell_air_punch.png');
  game.load.image('spell_ball_lightning', 'imgs/spells/spell_ball_lightning.png');
  game.load.image('spell_water_ball', 'imgs/spells/spell_water_ball.png');
  game.load.image('spell_ice', 'imgs/spells/spell_ice.png');
  game.load.image('spell_fire_ball', 'imgs/spells/spell_fire_ball.png');
  game.load.image('spell_fire_storm', 'imgs/spells/spell_fire_storm.png');
  game.load.image('spell_rock', 'imgs/spells/spell_rock.png');
  game.load.image('spell_summon_stick', 'imgs/spells/spell_summon_stick.png');

  game.load.image('spell_rain', 'imgs/spells/spell_rain.png');
  game.load.image('spell_meteor', 'imgs/spells/spell_meteor.png');
  game.load.image('spell_poison', 'imgs/spells/spell_poison.png');
  game.load.image('spell_volcano', 'imgs/spells/spell_volcano.png');

  // Sound
  // TODO: Put in definition
  game.load.audio('sound_fire1', 'sound/shots/fire1.wav', true);
  game.load.audio('sound_fire2', 'sound/shots/fire2.wav', true);
  game.load.audio('sound_water1', 'sound/shots/water1.wav', true);
  game.load.audio('sound_stick', 'sound/shots/stick.wav', true);
  game.load.audio('sound_rock', 'sound/shots/rock.wav', true);
  game.load.audio('sound_poison', 'sound/shots/poison.wav', true);
  game.load.audio('sound_wind', 'sound/shots/wind.wav', true);
  game.load.audio('sound_freeze', 'sound/shots/freeze.wav', true);
  game.load.audio('sound_electric', 'sound/shots/electric.wav', true);

  game.load.audio('sound_eat', 'sound/misc/eat.wav', true);
  game.load.audio('sound_book', 'sound/misc/book.wav', true);

  game.load.audio('sound_explosion1', 'sound/misc/explosion1.wav', true);

  game.load.audio('sound_spell_rain', 'sound/misc/spell_rain.wav', true);
  game.load.audio('sound_spell_meteor', 'sound/misc/spell_meteor.wav', true);
  //game.load.audio('test_music', 'sound/music.mp3', true);


}

// Load single image
function resLoadSingle(game, value) {
  game.load.image(value.name, value.location);
}

function resLoadSingleLayer(game, value) {
  game.load.image(value.name, value.locationBase);
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
  resLoadImageFromBase(game, value.name, value.locationBase, 'cbl');
  resLoadImageFromBase(game, value.name, value.locationBase, 'cbr');
}

function resLoadSymmetricLayer(game, value) {
  resLoadImageFromBase(game, value.name, value.locationBase, 'full');
  resLoadImageFromBase(game, value.name, value.locationBase, 'left');
  resLoadImageFromBase(game, value.name, value.locationBase, 'right');
  resLoadImageFromBase(game, value.name, value.locationBase, 'top');
  resLoadImageFromBase(game, value.name, value.locationBase, 'bottom');
  resLoadImageFromBase(game, value.name, value.locationBase, 'topleft');
  resLoadImageFromBase(game, value.name, value.locationBase, 'topright');
  resLoadImageFromBase(game, value.name, value.locationBase, 'bottomleft');
  resLoadImageFromBase(game, value.name, value.locationBase, 'bottomright');
  resLoadImageFromBase(game, value.name, value.locationBase, 'ctl');
  resLoadImageFromBase(game, value.name, value.locationBase, 'ctr');
  resLoadImageFromBase(game, value.name, value.locationBase, 'cbl');
  resLoadImageFromBase(game, value.name, value.locationBase, 'cbr');
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
    key: value.name + '_left',
    frames: game.anims.generateFrameNumbers(value.name, { start: 0, end: 1 }),
    frameRate: 4,
    repeat: -1
  });
  game.anims.create({
    key: value.name + '_right',
    frames: game.anims.generateFrameNumbers(value.name, { start: 2, end: 3 }),
    frameRate: 4,
    repeat: -1
  });
}

// Create 3 frame animations
function resCreateAnim3(game, value) {
  game.anims.create({
    key: value.name + '_anim',
    frames: game.anims.generateFrameNumbers(value.name, { start: 0, end: 2 }),
    frameRate: 4,
    repeat: -1
  });
}
