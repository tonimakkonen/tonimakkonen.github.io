
"use strict";

var infoList = [];

function infoDestroyAll() {
  for (var i = infoList.length - 1 ; i >= 0; i--) {
    infoList[i].destroy();
  }
  infoList = [];
}

function infoCreateText(game, x, y, text, color, time) {
  const damageText = game.add.text(x, y, text, {color: color}).setOrigin(0.5);
  damageText.setDepth(Z_INFO_UI);
  damageText.xCreatedAt = game.time.now;
  damageText.xTime = time;
  damageText.xInitialY = y;
  infoList.push(damageText);
}

function infoHandleLogic(game) {
  for (var i = infoList.length - 1 ; i >= 0; i--) {
    const curInfo = infoList[i];
    const t = (game.time.now - curInfo.xCreatedAt) / curInfo.xTime;
    curInfo.setPosition(curInfo.x, curInfo.xInitialY - t * 40.0);
    curInfo.setAlpha(1.0 - t);
    if (t > 1.0) {
      curInfo.destroy();
      infoList.splice(i, 1);
    }
  }
}
