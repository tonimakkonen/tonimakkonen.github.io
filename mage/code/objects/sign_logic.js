
"use strict"

const signSettings = {
  textDelta: 45,
  maxDist: 160,
  minDist: 80
}

function signCreate(game, sign, px, py) {
  const cx = (px + 0.5) * 80.0;
  const cy = (py + 0.5) * 80.0;
  const newSign = groupSigns.create(cx, cy, 'special_sign');
  newSign.setDepth(-0.001);
  const text = game.add.text(cx, cy - signSettings.textDelta, sign.text).setOrigin(0.5);
  text.setDepth(9.0);
  text.setVisible(false);
  newSign.xText = text;
}

function signDestroyAll(game) {
  for (var i = groupSigns.children.size - 1; i >= 0; i--) {
    signDestroy(groupSigns.children.get(i));
  }
  groupSigns.clear();
}

function signDestroy(sign) {
  sign.xText.destroy();
  sign.destroy();
}

function signHandleLogic(game) {
  for (var i = 0; i < groupSigns.children.entries.length; i++) {
    const sign = groupSigns.children.entries[i];
    const dx = playerLocation.x - sign.x;
    const dy = playerLocation.y - sign.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const t = 1.0 - (dist - signSettings.minDist) / (signSettings.maxDist - signSettings.minDist);
    if (t < 0.0) {
      sign.xText.setVisible(false);
    } else {
      sign.xText.setVisible(true);
      sign.xText.setAlpha(Math.min(t, 1.0));
    }
  }
}
