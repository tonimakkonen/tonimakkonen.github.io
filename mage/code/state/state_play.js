
function stateHandlePlay(game, curTime) {

  playerHandleLogic(game, curTime);

  // Handle all enemy logic
  for (var i = listEnemies.length - 1; i >= 0; i--) {
    var enemy = listEnemies[i];
    const alive = enemyHandleLogic(game, enemy, curTime);
    if (!alive) {
      enemy.destroy();
      listEnemies.splice(i, 1);
    }
  }

}
