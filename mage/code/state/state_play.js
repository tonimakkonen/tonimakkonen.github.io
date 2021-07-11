
function stateStartPlay(game) {
  playInitMap(game);
  uiCreate(game);
}

function playInitMap(game) {
  mapInitialize(game, mapBlueprint);
}

function stateHandlePlay(game) {

  playerHandleLogic(game, game.time.now);

  // Handle all enemy logic
  for (var i = listEnemies.length - 1; i >= 0; i--) {
    var enemy = listEnemies[i];
    const alive = enemyHandleLogic(game, enemy, game.time.now);
    if (!alive) {
      enemy.destroy();
      listEnemies.splice(i, 1);
    }
  }

  return GAME_MODE_PLAYING;

}
