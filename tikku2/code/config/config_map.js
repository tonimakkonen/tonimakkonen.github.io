
"use strict";

var configMapBase = []
var map = []

const ROLE_PROTECTED = 1    // Deep inside base
const ROLE_MIDDLE = 2       // Somewhere in the middle, not so well protected
const ROLE_EDGE = 3         // Most important lower edge
const ROLE_UPPER_EDGE = 4   // Upper edge tiles
const ROLE_UPPER = 5        // Upper tiles
const ROLE_FRONT = 6        // Front facing tiles

// Add some basic
configMapBase.push({ x: 2, y: 0, role: ROLE_PROTECTED})
configMapBase.push({ x: 3, y: 0, role: ROLE_PROTECTED})
configMapBase.push({ x: 4, y: 0, role: ROLE_PROTECTED})
configMapBase.push({ x: 5, y: 0, role: ROLE_PROTECTED})
configMapBase.push({ x: 6, y: 0, role: ROLE_PROTECTED})
configMapBase.push({ x: 7, y: 0, role: ROLE_MIDDLE})
configMapBase.push({ x: 8, y: 0, role: ROLE_MIDDLE})
configMapBase.push({ x: 8, y: 0, role: ROLE_MIDDLE})
configMapBase.push({ x: 9, y: 0, role: ROLE_EDGE})
configMapBase.push({ x: 10, y: 0, role: ROLE_EDGE})

configMapBase.push({ x: 9, y: 2, role: ROLE_FRONT})
configMapBase.push({ x: 10, y: 2, role: ROLE_UPPER_EDGE})

configMapBase.push({ x: 6, y: 3, role: ROLE_MIDDLE})

configMapBase.push({ x: 0, y: 4, role: ROLE_PROTECTED})
configMapBase.push({ x: 1, y: 4, role: ROLE_PROTECTED})
configMapBase.push({ x: 2, y: 4, role: ROLE_PROTECTED})
configMapBase.push({ x: 3, y: 4, role: ROLE_MIDDLE})
configMapBase.push({ x: 4, y: 4, role: ROLE_MIDDLE})
configMapBase.push({ x: 5, y: 4, role: ROLE_UPPER_EDGE})

configMapBase.push({ x: 8, y: 5, role: ROLE_FRONT})
configMapBase.push({ x: 9, y: 5, role: ROLE_UPPER_EDGE})

configMapBase.push({ x: 0, y: 7, role: ROLE_UPPER})
configMapBase.push({ x: 1, y: 7, role: ROLE_UPPER})
configMapBase.push({ x: 2, y: 7, role: ROLE_UPPER})
configMapBase.push({ x: 3, y: 7, role: ROLE_UPPER})
configMapBase.push({ x: 4, y: 7, role: ROLE_UPPER_EDGE})

function mapGetX(gridx) {
  return (gridx + 0.5) * CONFIG_BLOCK
}

function mapGetY(gridy) {
   return CONFIG_HEIGHT - (grid.y + 2.5)*CONFIG_BLOCK
}

function mapCreate(game) {

  for (const mt of configMapBase) {
    const x = mt.x
    const y = mt.y
    map.push( { x: x, y: y, player: PLAYER_BLUE, role: mt.role } )
    map.push( { x: 34 - x, y: y, player: PLAYER_RED, role: mt.role } )
  }

  for (var i = 0; i < CONFIG_WIDTH/CONFIG_BLOCK; i++) {
      groupBlocks.create(i*CONFIG_BLOCK + CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*1.5, 'tile')
  }

  for (var i = 0; i < 6; i++) {
    groupBlocks.create(i*CONFIG_BLOCK + CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*5.5, 'tile')
    groupBlocks.create(CONFIG_WIDTH - i*CONFIG_BLOCK - CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*5.5, 'tile')
  }
  for (var i = 5; i < 7; i++) {
    groupBlocks.create(i*CONFIG_BLOCK + CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*4.5, 'tile')
    groupBlocks.create(CONFIG_WIDTH - i*CONFIG_BLOCK - CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*4.5, 'tile')
  }

  for (var i = 9; i < 11; i++) {
    groupBlocks.create(i*CONFIG_BLOCK + CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*3.5, 'tile')
    groupBlocks.create(CONFIG_WIDTH - i*CONFIG_BLOCK - CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*3.5, 'tile')
  }
  for (var i = 0; i < 5; i++) {
    groupBlocks.create(i*CONFIG_BLOCK + CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*8.5, 'tile')
    groupBlocks.create(CONFIG_WIDTH - i*CONFIG_BLOCK - CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*8.5, 'tile')
  }
  for (var i = 8; i < 10; i++) {
    groupBlocks.create(i*CONFIG_BLOCK + CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*6.5, 'tile')
    groupBlocks.create(CONFIG_WIDTH - i*CONFIG_BLOCK - CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*6.5, 'tile')
  }

}
