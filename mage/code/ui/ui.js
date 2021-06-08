
function uiCreate(game) {
  uiHealthBar = game.add.rectangle(settingWidth / 4, settingHeight - 40, settingWidth/3, 40, 0xff0000);
  uiHealthBar.alpha = 0.75;
  uiHealthBar.setScrollFactor(0.0, 0.0);
  uiHealthBar.setDepth(10);
}

function uiUpdateHealthBar(game) {
  const width = (playerHealth / 100) * (settingWidth / 4);
  uiHealthBar.setSize(width, 40);
}
