
"use strict"

const mmButtonWidth = CONFIG_WIDTH / 6.0
const mmButtonHeight = 20.0

var mmUi = []
var mmButtons = []
var mmDone = false
var mmBlueSelectRace = []
var mmBlueSelectAi = []
var mmRedSelectRace = []
var mmRedSelectAi = []

function stateMainMenuStart(game) {

  mmBlueSelectRace = []
  mmBlueSelectAi = []
  mmRedSelectRace = []
  mmRedSelectAi = []
  mmDone = false
  blueRace = RACE_HUMAN
  redRace = RACE_HUMAN
  redAi = AI_PLAYER
  blueAi = AI_PLAYER

  const blueRow = CONFIG_WIDTH * 0.25
  const redRow = CONFIG_WIDTH * 0.75
  const delta = mmButtonWidth * 0.5 + 15
  mmUi.push(game.add.text(blueRow, 70, 'Blue player settings').setOrigin(0.5, 0.5))
  mmUi.push(game.add.text(blueRow - delta, 100, 'Race').setOrigin(0.5, 0.5))
  mmUi.push(game.add.text(blueRow + delta, 100, 'Player/AI').setOrigin(0.5, 0.5))
  mmAddSelect(blueRow - delta, 130, "Humans", mmBlueSelectRace, true, () => { blueRace = RACE_HUMAN }, game)
  mmAddSelect(blueRow - delta, 160, "Bugs", mmBlueSelectRace, false, () => { blueRace = RACE_BUG }, game)
  mmAddSelect(blueRow - delta, 190, "Aliens", mmBlueSelectRace, false, () => { blueRace = RACE_ALIEN }, game)
  mmAddSelect(blueRow + delta, 130, "Player", mmBlueSelectAi, true, () => { blueAi = AI_PLAYER }, game)
  mmAddSelect(blueRow + delta, 160, "AI (normal)", mmBlueSelectAi, false, () => { blueAi = AI_NORMAL }, game)
  mmAddSelect(blueRow + delta, 190, "AI (difficult)", mmBlueSelectAi, false, () => { blueAi = AI_DIFFICULT }, game)

  mmUi.push(game.add.text(redRow, 70, 'Red player settings').setOrigin(0.5, 0.5))
  mmUi.push(game.add.text(redRow - delta, 100, 'Race').setOrigin(0.5, 0.5))
  mmUi.push(game.add.text(redRow + delta, 100, 'Player/AI').setOrigin(0.5, 0.5))
  mmAddSelect(redRow - delta, 130, "Humans", mmRedSelectRace, true, () => { redRace = RACE_HUMAN }, game)
  mmAddSelect(redRow - delta, 160, "Bugs", mmRedSelectRace, false, () => { redRace = RACE_BUG }, game)
  mmAddSelect(redRow - delta, 190, "Aliens", mmRedSelectRace, false, () => { redRace = RACE_ALIEN }, game)
  mmAddSelect(redRow + delta, 130, "Player", mmRedSelectAi, true, () => { redAi = AI_PLAYER }, game)
  mmAddSelect(redRow + delta, 160, "AI (normal)", mmRedSelectAi, false, () => { redAi = AI_NORMAL }, game)
  mmAddSelect(redRow + delta, 190, "AI (difficult)", mmRedSelectAi, false, () => { redAi = AI_DIFFICULT }, game)

  mmButtons.push(buttonAddClickButton(CONFIG_WIDTH * 0.5, 250, mmButtonWidth, mmButtonHeight, "Start game", () => { mmDone = true }, game))

}

function mmAddSelect(x, y, text, group, selected, func, game) {
  mmButtons.push(
    buttonAddListButton(
      x,
      y,
      mmButtonWidth,
      mmButtonHeight,
      text,
      func,
      selected,
      group,
      game
    )
  )
}


function stateMainMenuUpdate(game) {
  // handle button logic
  buttonLogic(mmButtons)


  if (mmDone) {
    // delete all phaser objects
    buttonDestroyList(mmButtons)
    mmButtons = []
    for (const po of mmUi) po.destroy()
    mmUi = []
    // Set up game
    mmSetupGame(game)
    // TODO: Need to go to blue buy
    gameState = GAME_STATE_COMBAT
  }

}

function mmSetupGame(game) {

  var br = configRaces.get(blueRace)
  if (!br) throw "no race found for blue player: " + blueRace
  var rr = configRaces.get(redRace)
  if (!rr) throw "no race found for red player: " + redRace

  // Create bases
  const baseY = CONFIG_HEIGHT - CONFIG_BLOCK * 3
  const baseBlueX = CONFIG_BLOCK
  const baseRedX = CONFIG_WIDTH - baseBlueX
  unitCreate(br.base, baseBlueX, baseY, PLAYER_BLUE, game)
  unitCreate(rr.base, baseRedX, baseY, PLAYER_RED, game)

  // Set up resources
  // TODO: For easy debugging now
  blueGold = 9000
  redGold = 9000
  goldUpdateText(game)
}
