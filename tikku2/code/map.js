
"use strict"

function mapCreate(game) {
  for (var i = 0; i < CONFIG_WIDTH/CONFIG_BLOCK; i++) {
      groupBlocks.create(i*CONFIG_BLOCK + CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*1.5, 'tile')
  }

  for (var i = 0; i < 6; i++) {
    groupBlocks.create(i*CONFIG_BLOCK + CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*5.5, 'tile')
    groupBlocks.create(CONFIG_WIDTH - i*CONFIG_BLOCK + CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*5.5, 'tile')
  }
  for (var i = 5; i < 7; i++) {
    groupBlocks.create(i*CONFIG_BLOCK + CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*4.5, 'tile')
    groupBlocks.create(CONFIG_WIDTH - i*CONFIG_BLOCK + CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*4.5, 'tile')
  }

  for (var i = 9; i < 11; i++) {
    groupBlocks.create(i*CONFIG_BLOCK + CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*3.5, 'tile')
    groupBlocks.create(CONFIG_WIDTH - i*CONFIG_BLOCK + CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*3.5, 'tile')
  }
  for (var i = 0; i < 5; i++) {
    groupBlocks.create(i*CONFIG_BLOCK + CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*8.5, 'tile')
    groupBlocks.create(CONFIG_WIDTH - i*CONFIG_BLOCK + CONFIG_BLOCK/2, CONFIG_HEIGHT - CONFIG_BLOCK*8.5, 'tile')
  }

  //groupBlocks.create(4*40 + 20, 800-20-2*40, 'tile')
  //groupBlocks.create(16*40 + 20, 800-20-2*40, 'tile')
  //groupBlocks.create(20*40 + 20, 800-20-2*40, 'tile')
  //groupBlocks.create(30*40 + 20, 800-20-2*40, 'tile')
}
