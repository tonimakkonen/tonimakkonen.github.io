
"use strict";

function resLoadResources(game) {

  game.load.image('bg', 'graph/bg.png')
  game.load.image('tile', 'graph/tile.png');

  for (const [key, value] of configShots) {
    game.load.image(value.graph, 'graph/' + value.graph + '.png')
  }

  for (const [key, value] of configUnits) {
    game.load.image('blue_' + value.graph, 'graph/blue_' + value.graph + '.png')
    game.load.image('red_' + value.graph, 'graph/red_' + value.graph + '.png')
  }

  game.load.image('splatter_green', 'graph/splatter_green.png')
  game.load.image('splatter_red', 'graph/splatter_red.png')
  game.load.image('splatter_metal', 'graph/splatter_metal.png')
  game.load.image('splatter_explosion', 'graph/splatter_explosion.png')

  game.load.image('resource', 'graph/resource.png')

}
