
"use strict"

const mmButtonWidth = CONFIG_WIDTH / 6.0
const mmButtonHeight = CONFIG_BLOCK - 10.0
const mmbd = mmButtonHeight + 10.0

var mmInit = false
var mmUi = []
var mmButtons = []
var mmDone = false
var mmBlueSelectRace = []
var mmBlueSelectAi = []
var mmRedSelectRace = []
var mmRedSelectAi = []

function stateMainMenuStart(game) {

  goldUpdateText(game)

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
  mmUi.push(game.add.text(blueRow, mmbd*2, 'Blue player settings').setOrigin(0.5, 0.5))
  mmUi.push(game.add.text(blueRow - delta, mmbd*3, 'Race').setOrigin(0.5, 0.5))
  mmUi.push(game.add.text(blueRow + delta, mmbd*3, 'Player/AI').setOrigin(0.5, 0.5))
  mmAddSelect(blueRow - delta, mmbd*4, 'Humans',  'blue_soldier', mmBlueSelectRace, true, () => { blueRace = RACE_HUMAN }, game)
  mmAddSelect(blueRow - delta, mmbd*5, 'Bugs', 'blue_bug', mmBlueSelectRace, false, () => { blueRace = RACE_BUG }, game)
  mmAddSelect(blueRow - delta, mmbd*6, 'Aliens', 'blue_alien', mmBlueSelectRace, false, () => { blueRace = RACE_ALIEN }, game)
  mmAddSelect(blueRow + delta, mmbd*4, 'Player', undefined, mmBlueSelectAi, true, () => { blueAi = AI_PLAYER }, game)
  mmAddSelect(blueRow + delta, mmbd*5, 'AI (normal)', undefined, mmBlueSelectAi, false, () => { blueAi = AI_NORMAL }, game)
  mmAddSelect(blueRow + delta, mmbd*6, 'AI (difficult)', undefined, mmBlueSelectAi, false, () => { blueAi = AI_DIFFICULT }, game)

  mmUi.push(game.add.text(redRow, mmbd*2, 'Red player settings').setOrigin(0.5, 0.5))
  mmUi.push(game.add.text(redRow - delta, mmbd*3, 'Race').setOrigin(0.5, 0.5))
  mmUi.push(game.add.text(redRow + delta, mmbd*3, 'Player/AI').setOrigin(0.5, 0.5))
  mmAddSelect(redRow - delta, mmbd*4, 'Humans', 'red_soldier', mmRedSelectRace, true, () => { redRace = RACE_HUMAN }, game)
  mmAddSelect(redRow - delta, mmbd*5, 'Bugs', 'red_bug', mmRedSelectRace, false, () => { redRace = RACE_BUG }, game)
  mmAddSelect(redRow - delta, mmbd*6, 'Aliens', 'red_alien', mmRedSelectRace, false, () => { redRace = RACE_ALIEN }, game)
  mmAddSelect(redRow + delta, mmbd*4, 'Player', undefined, mmRedSelectAi, true, () => { redAi = AI_PLAYER }, game)
  mmAddSelect(redRow + delta, mmbd*5, 'AI (normal)', undefined, mmRedSelectAi, false, () => { redAi = AI_NORMAL }, game)
  mmAddSelect(redRow + delta, mmbd*6, 'AI (difficult)', undefined, mmRedSelectAi, false, () => { redAi = AI_DIFFICULT }, game)

  mmButtons.push(buttonAddClickButton(CONFIG_WIDTH * 0.5, mmbd*8, mmButtonWidth, mmButtonHeight, 'Start game', undefined, () => { mmDone = true }, game))

}

function mmAddSelect(x, y, text, image, group, selected, func, game) {
  mmButtons.push(
    buttonAddListButton(
      x,
      y,
      mmButtonWidth,
      mmButtonHeight,
      text,
      image,
      func,
      selected,
      group,
      game
    )
  )
}


function stateMainMenuUpdate(game) {

  // Init
  if (!mmInit) {
    stateMainMenuStart(game)
    mmInit = true
    return
  }

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
    gameState = GAME_STATE_BUY
    mmInit = false
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
  blueBase = unitCreate(br.base, baseBlueX, baseY, PLAYER_BLUE, undefined, game)
  redBase = unitCreate(rr.base, baseRedX, baseY, PLAYER_RED, undefined, game)

  // Set up resources
  // TODO: For easy debugging now
  blueGold = 500
  redGold = 500
  goldUpdateText(game)
}
