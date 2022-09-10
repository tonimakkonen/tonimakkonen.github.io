
"use strict"

function aiBuyUpdate(buyPlayer, game) {

  // TODO: Add waiting

  aiBuyLogicSellBroken(buyPlayer, game)
  aiBuyLogicOuterWall(buyPlayer, game)
  aiBuyLogicBuyGameWinners(buyPlayer, game)
  for (var i = 0; i < 3; i++) aiBuyLogicRandom(buyPlayer, game)
  // TODO: Sell crap building for better buildings

  return true
}

//////////////////
// LOGIC PIECES //
//////////////////

function aiBuyLogicSellBroken(buyPlayer, game) {
  console.log('>> AI: selling broken buildings for player ' + (buyPlayer == PLAYER_BLUE ? ' blue' : 'red'))
  for (const grid of map) {
    if (grid.player == buyPlayer && grid.building != undefined) {
      const b = grid.building
      if (b.health <= 0.25 * b.x_props.health) {
        console.log('selling building: ' + b.x_props.name)
        buySellBuilding(b, game)
      }
    }
  }
}

function aiBuyLogicOuterWall(buyPlayer, game) {
  console.log('>> AI: Outer wall fixing for player ' + (buyPlayer == PLAYER_BLUE ? ' blue' : 'red'))
  const grid = aiBuySelectRandomGrid(buyPlayer, ROLE_EDGE)
  if (grid != null) aiBuyRandomBuy(grid, game);
  else console.log('no free outer wall grid')
}

function aiBuyLogicRandom(buyPlayer, game) {
  console.log('>> AI: random buying for player ' + (buyPlayer == PLAYER_BLUE ? ' blue' : 'red'))
  const grid = aiBuySelectRandomGrid(buyPlayer)
  if (grid != null) aiBuyRandomBuy(grid, game)
  else console.log('could not find a free grid')
}

function aiBuyLogicBuyGameWinners(buyPlayer, game) {
  console.log('>> AI: game winner buying for player ' + (buyPlayer == PLAYER_BLUE ? ' blue' : 'red'))
  if (playerGetGold(buyPlayer) < 550) {
    console.log('Skipping because player gold too low: ' + playerGetGold(buyPlayer))
    return
  }
  if (aiBuyGetBuildingCount(buyPlayer) < 4) {
    console.log('Skipping because building count too low: ' + aiBuyGetBuildingCount(buyPlayer))
    return
  }
  const grid = aiBuySelectRandomGrid(buyPlayer)
  if (grid == null) {
    console.log('Skipping because no free grid found')
    return
  }
  aiBuyMostExpensive(grid, game)

}

///////////
// UTILS //
///////////

function aiBuyGetBuildingCount(player) {
  var count = 0
  for (const grid of map) {
    if(grid.player == player && grid.building != undefined) count += 1
  }
  return count
}

function aiBuySelectRandomGrid(player, role) {
  var options = []
  for (const grid of map) {
    if (grid.player == player && grid.building == undefined) {
      if (!role) options.push(grid)
      else if(grid.role == role) options.push(grid)
    }
  }
  if(options.length == 0) return null
  return options[Math.floor(Math.random() * options.length)]
}

function aiBuyRandomBuy(grid, game) {
  const list = aiBuyGetList(grid)
  const building = list[Math.floor(Math.random() * list.length)]
  const bp = configUnits.get(building)
  if (!bp) throw "could not find building props: " + building
  const gold = playerGetGold(buyPlayer)
  const cost = bp.cost
  if (gold >= cost) {
    buyBuyBuilding(grid, building, game)
  } else {
    console.log('considered buiding ' + bp.name + ' with cost ' + bp.cost + ' on grid (' + grid.x + ', ' + grid.y + ') but only had ' + gold + ' gold')
  }
}

function aiBuyMostExpensive(grid, game) {
    const list = aiBuyGetList(grid)
    var selectedBuilding = undefined
    var selectedCost = undefined
    for (const building of list) {
      const bp = configUnits.get(building)
      if (selectedBuilding == undefined || bp.cost > selectedCost) {
        selectedBuilding = building
        selectedCost = bp.cost
      }
    }
    if (playerGetGold(grid.player) >= selectedCost) {
      buyBuyBuilding(grid, selectedBuilding, game)
    } else {
      console.log('Player did not have the gold to build the most expensive on  on grid (' + grid.x + ', ' + grid.y + ')')
    }
}



function aiBuyGetList(grid) {
  const race = playerGetRace(grid.player)
  const rp = configRaces.get(race)
  if (grid.role == ROLE_PROTECTED) return rp.roleProtected
  else if(grid.role == ROLE_MIDDLE) return rp.roleMiddle
  else if(grid.role == ROLE_EDGE) return rp.roleEdge
  else if(grid.role == ROLE_UPPER_EDGE) return rp.roleUpperEdge
  else if(grid.role == ROLE_UPPER) return rp.roleUpper
  else if(grid.role == ROLE_FRONT) return rp.roleFront
  return rp.build
}
