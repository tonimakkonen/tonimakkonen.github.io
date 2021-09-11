
"use strict";

function mapCreateBackground(game, map, inEditor, list) {
  const sizeX = map.x * 80.0;
  const sizeY = map.y * 80.0;
  const bg = BACKGROUNDS.get(map.background);
  if (!bg) throw 'Unknown bg: ' + map.background;
  mapCreateBackgroundInternal(game, sizeX, sizeY, bg, inEditor, list);
}

function mapCreateBackgroundInternal(game, sizeX, sizeY, bg, inEditor, list) {
  // TODO: Other stuff also..
  if (inEditor && bg.editorGrey) {
    const grey = game.add.rectangle(settingWidth / 2.0, settingHeight / 2.0, settingWidth, settingHeight, 0x202020);
    grey.setScrollFactor(0.0, 0.0);
    grey.setDepth(-10.0);
    list.push(grey);
  } else {
    if (bg.name) {
        const bgImage = game.add.image(settingWidth/2, settingHeight/2, bg.name);
        bgImage.setScrollFactor(0.0, 0.0);
        bgImage.setDepth(-10.0);
        list.push(bgImage);
    }
  }
}

// Some left over code.. for fuiture use
//var bg2 = game.add.image(settingWidth/2, settingHeight - 240/2 + 0.15*(map.y*80 - settingHeight), 'bg_forest');
//bg2.setScrollFactor(0.15, 0.15);
//bg2 = game.add.image(settingWidth*1.5, settingHeight - 240/2 + 0.15*(map.y*80 - settingHeight), 'bg_forest');
//bg2.setScrollFactor(0.15, 0.15);
//bg2 = game.add.image(settingWidth*2.5, settingHeight - 240/2 + 0.15*(map.y*80 - settingHeight), 'bg_forest');
//bg2.setScrollFactor(0.15, 0.15);
