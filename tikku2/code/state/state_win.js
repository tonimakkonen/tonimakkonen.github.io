
"use strict"

var winButtons = undefined

function stateWinUpdate(game) {

  if (!winButtons) stateWinStart(game)

  buttonLogic(winButtons)

}

function stateWinStart(game) {

  goldUpdateText(game)

  winButtons = [
    buttonAddClickButton(
      CONFIG_WIDTH*0.5,
      CONFIG_HEIGHT*0.5,
      CONFIG_WIDTH*0.15,
      30,
      'Back to main menu',
      undefined,
      () => stateWinEnd(game),
      game
    )
  ]
}

function stateWinEnd(game) {

  buttonDestroyList(winButtons)
  winButtons = undefined

  combatStart = undefined
  gameState = GAME_STATE_MAIN_MENU
  gameLoseFlag = undefined
  round = 1

  groupBlueUnits.children.each((unit) => unitRelease(unit), game)
  groupRedUnits.children.each((unit) => unitRelease(unit), game)
  groupBlueShots.children.each((shot) => shotRelease(shot), game)
  groupRedShots.children.each((shot) => shotRelease(shot), game)
}
