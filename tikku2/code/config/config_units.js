
"use strict";

var configUnits = new Map();

///////////
// Human //
///////////

const UNIT_HUMAN_BASE = 100
const UNIT_SOLDIER = 101
const UNIT_OUTPOST = 102
const UNIT_FORT = 103
const UNIT_FACTORY = 104
const UNIT_BUGGY = 105
const UNIT_ASSEMBLY = 106
const UNIT_ROCKET_LAUNCHER = 107
const UNIT_FIGHTER_BASE = 108
const UNIT_FIGHTER = 109
const UNIT_BOMBER_BASE = 110
const UNIT_BOMBER = 111
const UNIT_MECH_BASE = 112
const UNIT_MECH = 113
// buildings: 7
// real units: 6

configUnits.set(
  UNIT_HUMAN_BASE,
  {
    graph: 'human_base',
    name: 'Human base',
    base: true,
    building: true,
    width: 80,
    health: 250,
    spawn: {
      unit: UNIT_SOLDIER,
      time: 5000
    }
  }
)

configUnits.set(
  UNIT_SOLDIER,
  {
    graph: 'soldier',
    health: 5,
    velocity: { speed: 60, time: 1000 },
    jump: {
      feetOnGround: true,
      time: 500,
      prob: 0.25,
      speed: 230
    },
    shoot: {
        type: SHOT_LASER,
        amin: 5,
        amax: 30,
        speed: 200,
        time: 900
    },
    death: {
      splatter: { graph: 'splatter_red', count: 4, speed: 100, time: 400 }
    }
  }
)

configUnits.set(
  UNIT_OUTPOST,
  {
    graph: 'outpost',
    name: 'Outpost',
    help: 'Build Outpost: trains soldiers',
    health: 40,
    building: true,
    width: 40,
    cost: 150,
    spawn: {
      unit: UNIT_SOLDIER,
      time: 8000
    },
    death: {
      splatter: { graph: 'splatter_metal', count: 6, speed: 200, time: 1500 }
    }
  }
)

configUnits.set(
  UNIT_FORT,
  {
    graph: 'fort',
    name: 'Fort',
    help: 'Build Fort: strong defensive structure',
    health: 150,
    building: true,
    width: 40,
    cost: 120,
    shoot: {
        type: SHOT_LASER,
        amin: 5,
        amax: 45,
        speed: 300,
        time: 800
    },
    death: {
      splatter: { graph: 'splatter_metal', count: 6, speed: 200, time: 1500 }
    }
  }
)

configUnits.set(
  UNIT_FACTORY,
  {
    graph: 'factory',
    name: 'Factory',
    help: 'Build Factory: creates attack buggys',
    health: 40,
    building: true,
    width: 40,
    cost: 350,
    spawn: {
      unit: UNIT_BUGGY,
      time: 11000
    },
    death: {
      splatter: { graph: 'splatter_metal', count: 6, speed: 200, time: 1500 }
    }
  }
)

configUnits.set(
  UNIT_BUGGY,
  {
    graph: 'buggy',
    health: 9,
    velocity: {speed: 70, time: 500 },
    mass: 2,
    height: 30,
    shoot: {
        type: SHOT_LASER,
        amin: 5,
        amax: 45,
        speed: 300,
        time: 1100
    },
    death: {
      spawn: {
        type: UNIT_SOLDIER,
        count: 1
      },
      splatter: { graph: 'splatter_metal', count: 3, speed: 100, time: 400 }
    }
  }
)

configUnits.set(
  UNIT_ASSEMBLY,
  {
    graph: 'assembly',
    name: 'Assembly',
    help: 'Build Assembly: creates rocket launchers',
    health: 40,
    building: true,
    width: 40,
    cost: 450,
    spawn: {
      unit: UNIT_ROCKET_LAUNCHER,
      time: 15000
    },
    death: {
      splatter: { graph: 'splatter_metal', count: 6, speed: 200, time: 1500 }
    }
  }
)

configUnits.set(
  UNIT_ROCKET_LAUNCHER,
  {
    graph: 'artillery',
    health: 9,
    velocity: { speed: 40, time: 1000 },
    mass: 2,
    shoot: {
        type: SHOT_ROCKET,
        amin: 20,
        amax: 45,
        speed: 560,
        time: 2000
    },
    death: {
      splatter: { graph: 'splatter_metal', count: 3, speed: 100, time: 400 }
    }
  }
)

configUnits.set(
  UNIT_FIGHTER_BASE,
  {
    graph: 'fighter_base',
    name: 'Fighter Base',
    help: 'Build Fighter Base: crates air superiority fighters',
    health: 40,
    building: true,
    width: 40,
    cost: 400,
    spawn: {
      unit: UNIT_FIGHTER,
      time: 10000
    },
    death: {
      splatter: { graph: 'splatter_metal', count: 6, speed: 100, time: 1500 }
    }
  }
)

configUnits.set(
  UNIT_FIGHTER,
  {
    graph: 'fighter',
    health: 6,
    hover: { x: CONFIG_WIDTH*0.25, y: CONFIG_BLOCK*6, dx: CONFIG_WIDTH*0.35, dy: CONFIG_BLOCK*6, time: 800, speed: 200 },
    gravity: 0,
    shoot: {
        type: SHOT_LASER,
        amin: -20,
        amax: 45,
        speed: 450,
        time: 800
    },
    death: {
      splatter: { graph: 'splatter_metal', count: 4, speed: 200, time: 500 }
    }
  }
)

configUnits.set(
  UNIT_BOMBER_BASE,
  {
    graph: 'bomber_base',
    name: 'Bomber Base',
    help: 'Build Bomber Base: crates bombers',
    health: 40,
    building: true,
    width: 40,
    cost: 450,
    spawn: {
      unit: UNIT_BOMBER,
      time: 15000
    },
    death: {
      splatter: { graph: 'splatter_metal', count: 6, speed: 100, time: 1500 }
    }
  }
)

configUnits.set(
  UNIT_BOMBER,
  {
    graph: 'fighter',
    health: 6,
    velocity: { speed: 60, time: 1000 },
    gravity: 0,
    fly: { max: 5, min: -40, time: 1200, below: 80 },
    shoot: {
        type: SHOT_BOMB,
        amin: -15,
        amax: 0,
        speed: 50,
        time: 1500,
        after: CONFIG_BLOCK*10
    },
    death: {
      splatter: { graph: 'splatter_metal', count: 4, speed: 200, time: 500 }
    }
  }
)

configUnits.set(
  UNIT_MECH_BASE,
  {
    graph: 'mech_base',
    name: 'Mech base',
    help: 'Build Mech Base: creates strong mech units',
    health: 40,
    building: true,
    width: 40,
    cost: 700,
    spawn: {
      unit: UNIT_MECH,
      time: 18000
    },
    death: {
      splatter: { graph: 'splatter_metal', count: 6, speed: 200, time: 1500 }
    }
  }
)

configUnits.set(
  UNIT_MECH,
  {
    graph: 'mech',
    health: 30,
    velocity: {speed: 50, time: 100 },
    mass: 2,
    shoot: { type: SHOT_LASER, amin: 5, amax: 25, speed: 500, time: 300 },
    death: {
      splatter: { graph: 'splatter_metal', count: 6, speed: 100, time: 400 }
    }
  }
)

/////////
// BUG //
/////////

const UNIT_BUG_BASE = 200
const UNIT_BUG = 201
const UNIT_HATCHERY = 202
const UNIT_BUG_WALL = 203
const UNIT_BURROW = 204
const UNIT_CRAWLER = 205
const UNIT_FIRE_BURROW = 206
const UNIT_FIRE_LARVA = 207
const UNIT_FIRE_SPITTER = 208
const UNIT_FLYER_NEST = 209
const UNIT_FLYER = 210
const UNIT_DRAGONBUG_NEST = 211
const UNIT_DRAGONBUG = 212
// buildings: 7
// real units: 5

configUnits.set(
  UNIT_BUG_BASE,
  {
    graph: 'bug_base',
    name: 'Bug base',
    base: true,
    building: true,
    width: 80,
    health: 250,
    heal: 25,
    spawn: {
      unit: UNIT_BUG,
      time: 4000
    }
  }
)

configUnits.set(
  UNIT_BUG,
  {
    graph: 'bug',
    health: 3,
    velocity: { speed: 70, time: 1000 },
    jump: {
      feetOnGround: false,
      time: 200,
      prob: 0.65,
      speed: 80,
      below: CONFIG_BLOCK*2
    },
    shoot: {
        type: SHOT_SLIME,
        amin: 30,
        amax: 45,
        speed: 150,
        time: 700
    },
    death: {
      splatter: { graph: 'splatter_green', count: 4, speed: 100, time: 200 }
    }
  }
)

configUnits.set(
  UNIT_HATCHERY,
  {
    graph: 'hatchery',
    name: 'Hatchery',
    help: 'Mutate Hatchery: spawns bugs',
    health: 40,
    building: true,
    width: 40,
    cost: 120,
    heal: 10,
    spawn: {
      unit: UNIT_BUG,
      time: 6000
    },
    death: {
      splatter: { graph: 'splatter_green', count: 6, speed: 200, time: 1500 }
    }
  }
)

configUnits.set(
  UNIT_BUG_WALL,
  {
    graph: 'bug_wall',
    name: 'Bug wall',
    help: 'Mutate Bug Wall: releases bugs when breached',
    health: 50,
    building: true,
    width: 40,
    cost: 60,
    heal: 10,
    death: {
      spawn: { type: UNIT_BUG, count: 5 },
      shoot: { type: SHOT_SLIME, count: 10, speed: 150 },
      splatter: { graph: 'splatter_green', count: 6, speed: 200, time: 1500 }
    }
  }
)

configUnits.set(
  UNIT_BURROW,
  {
    graph: 'burrow',
    name: 'Burrow',
    help: 'Mutate Burrow: spawn crawlers',
    health: 40,
    heal: 10,
    building: true,
    width: 40,
    cost: 360,
    spawn: {
      unit: UNIT_CRAWLER,
      time: 11000
    },
    death: {
      splatter: { graph: 'splatter_green', count: 6, speed: 200, time: 1500 }
    }
  }
)

configUnits.set(
  UNIT_CRAWLER,
  {
    graph: 'crawler',
    health: 24,
    velocity: { speed: 50, time: 200 },
    mass: 2,
    shoot: {
        type: SHOT_SLIME,
        amin: 2,
        amax: 30,
        speed: 300,
        time: 750
    },
    death: {
      splatter: { graph: 'splatter_green', count: 4, speed: 150, time: 400 }
    }
  }
)

configUnits.set(
  UNIT_FIRE_BURROW,
  {
    graph: 'fire_burrow',
    name: 'Fire Burrow',
    help: 'Mutate Fire Burrow: spawn fire larvas',
    health: 40,
    heal: 10,
    building: true,
    width: 40,
    cost: 360,
    spawn: {
      unit: UNIT_FIRE_LARVA,
      time: 13000
    },
    death: {
      splatter: { graph: 'splatter_green', count: 6, speed: 200, time: 1500 }
    }
  }
)

configUnits.set(
  UNIT_FIRE_LARVA,
  {
    graph: 'fire_larva',
    health: 8,
    velocity: { speed: 40, time: 1000 },
    mass: 2,
    shoot: {
        type: SHOT_FIRE_BALL,
        amin: 30,
        amax: 60,
        speed: 380,
        time: 2500
    },
    death: {
      splatter: { graph: 'splatter_green', count: 4, speed: 150, time: 400 }
    }
  }
)

configUnits.set(
  UNIT_FIRE_SPITTER,
  {
    graph: 'fire_spitter',
    name: 'Fire Spitter',
    help: 'Mutate Fire Spitter: AA and artillery role',
    health: 80,
    heal: 20,
    building: true,
    width: 40,
    cost: 240,
    shoot: {
        type: SHOT_FIRE,
        amin: 45,
        amax: 85,
        speed: 620,
        time: 1000
    },
    death: {
      splatter: { graph: 'splatter_green', count: 6, speed: 200, time: 1500 }
    }
  }
)

configUnits.set(
  UNIT_FLYER_NEST,
  {
    graph: 'flyer_nest',
    name: 'Flyer Nest',
    help: 'Mutate Flyer Nest: spawns flyers',
    health: 30,
    building: true,
    width: 40,
    cost: 320,
    heal: 10,
    spawn: { unit: UNIT_FLYER, time: 4000 },
    death: {
      spawn: { type: UNIT_FLYER, count: 1 },
      splatter: { graph: 'splatter_green', count: 6, speed: 200, time: 1500 }
    }
  }
)

configUnits.set(
  UNIT_FLYER,
  {
    graph: 'flyer',
    health: 3,
    velocity: { speed: 100, time: 250 },
    gravity: 0,
    fly: { max: 40, min: -40, time: 800 },
    suicide: { after: CONFIG_WIDTH / 2, before: CONFIG_WIDTH - CONFIG_BLOCK/2, prob: 0.06, time: 200 },
    death: {
      shoot: { type: SHOT_SLIME, count: 10, speed: 150 }
    }
  }
)

configUnits.set(
  UNIT_DRAGONBUG_NEST,
  {
    graph: 'dragonbug_nest',
    name: 'Dragonbug Nest',
    help: 'Mutate Dragonbug Nest: spawns dragonbugs',
    health: 50,
    building: true,
    width: 40,
    cost: 600,
    heal: 10,
    spawn: {
      unit: UNIT_DRAGONBUG,
      time: 20000
    },
    death: {
      splatter: { graph: 'splatter_green', count: 6, speed: 100, time: 1500 }
    }
  }
)

configUnits.set(
  UNIT_DRAGONBUG,
  {
    graph: 'dragonbug',
    health: 25,
    hover: { x: CONFIG_WIDTH*0.5, y: CONFIG_BLOCK*8, dx: CONFIG_WIDTH*0.25, dy: CONFIG_BLOCK*8, time: 1000, speed: 100 },
    gravity: 0,
    shoot: {
        type: SHOT_FIRE_BALL,
        amin: -30,
        amax: 45,
        speed: 400,
        time: 2000
    },
    death: {
      splatter: { graph: 'splatter_green', count: 8, speed: 200, time: 1500 }
    }
  }
)

///////////
// ALIEN //
///////////

const UNIT_ALIEN_BASE = 300
const UNIT_ALIEN = 301
const UNIT_MONUMENT = 302
const UNIT_FF_GENERATOR = 303
const UNIT_FF = 304
const UNIT_SPIDER_ASSEMBLY = 305
const UNIT_FIRE_SPIDER = 306
const UNIT_WATCHER = 307
const UNIT_PORTAL = 308
const UNIT_DESTROYER = 309
const UNIT_SKY_BASE = 310
const UNIT_SEEKER = 311
const UNIT_TEMPLE = 312
const UNIT_MOTHERSHIP = 313
// buildings: 7
// real units: 5

configUnits.set(
  UNIT_ALIEN_BASE,
  {
    graph: 'alien_base',
    name: 'Alien base',
    base: true,
    building: true,
    width: 80,
    health: 400,
    spawn: { unit: UNIT_ALIEN, time: 9000 }
  }
)

configUnits.set(
  UNIT_ALIEN,
  {
    graph: 'alien',
    health: 8,
    velocity: { speed: 50, time: 500 },
    mass: 1.5,
    shoot: { type: SHOT_GREEN_LASER, amin: 5, amax: 45, speed: 250, time: 900 },
    death: {
      splatter: { graph: 'splatter_metal', count: 3, speed: 200, time: 500 }
    }
  }
)

configUnits.set(
  UNIT_MONUMENT,
  {
    graph: 'monument',
    name: 'Monument',
    help: 'Construct Monument: summons aliens',
    health: 80,
    building: true,
    width: 40,
    cost: 180,
    spawn: { unit: UNIT_ALIEN, time: 9000 },
    death: {
      splatter: { graph: 'splatter_metal', count: 6, speed: 200, time: 500 }
    }
  }
)

configUnits.set(
  UNIT_FF_GENERATOR,
  {
    graph: 'ff_generator',
    name: 'Forcefield Generator',
    help: 'Construct Forcefield Generator: defences a large area',
    health: 40,
    building: true,
    width: 40,
    cost: 220,
    spawn: { unit: UNIT_FF, time: 0, radius: CONFIG_BLOCK*5, count: 40, maxTimes: 1 },
    death: {
      splatter: { graph: 'splatter_metal', count: 6, speed: 200, time: 500 }
    }
  }
)

configUnits.set(
  UNIT_FF,
  {
    graph: 'ff',
    health: 6,
    immovable: true
  }
)

configUnits.set(
  UNIT_SPIDER_ASSEMBLY,
  {
    graph: 'spider_assembly',
    name: 'Spider Assembly',
    help: 'Construct Spider Assembly: creates fire spiders',
    health: 40,
    heal: 10,
    building: true,
    width: 40,
    cost: 300,
    spawn: { unit: UNIT_FIRE_SPIDER, time: 4000 },
    death: {
      splatter: { graph: 'splatter_metal', count: 6, speed: 200, time: 500 }
    }
  }
)

configUnits.set(
  UNIT_FIRE_SPIDER,
  {
    graph: 'fire_spider',
    health: 5,
    velocity: { speed: 80, time: 1000 },
    shoot: { type: SHOT_FIRE, amin: 0, amax: 45, speed: 230, time: 900 },
    jump: {
      feetOnGround: true,
      time: 500,
      prob: 0.2,
      speed: 350
    },
    death: {
      splatter: { graph: 'splatter_metal', count: 2, speed: 100, time: 200 }
    }
  }
)

configUnits.set(
  UNIT_WATCHER,
  {
    graph: 'watcher',
    name: 'Watcher',
    help: 'Construct Watcher: Long range shooter',
    health: 50,
    building: true,
    width: 40,
    cost: 200,
    shoot: { type: SHOT_GREEN_LASER, amin: -5, amax: 45, speed: 550, time: 1200 },
    death: {
      splatter: { graph: 'splatter_metal', count: 6, speed: 200, time: 500 }
    }
  }
)

configUnits.set(
  UNIT_PORTAL,
  {
    graph: 'portal',
    name: 'Portal',
    help: 'Construct Portal: summons destroyers',
    health: 40,
    building: true,
    width: 40,
    cost: 500,
    spawn: { unit: UNIT_DESTROYER, time: 10000 },
    death: {
      splatter: { graph: 'splatter_metal', count: 6, speed: 200, time: 500 }
    }
  }
)

configUnits.set(
  UNIT_DESTROYER,
  {
    graph: 'destroyer',
    health: 12,
    velocity: { speed: 60, time: 250 },
    gravity: 0,
    fly: { max: 40, min: -40, time: 800 },
    shoot: { type: SHOT_ENERGY, amin: -5, amax: 5, speed: 300, time: 2000 },
    death: {
      splatter: { graph: 'splatter_metal', count: 4, speed: 200, time: 500 }
    }
  }
)

configUnits.set(
  UNIT_SKY_BASE,
  {
    graph: 'sky_base',
    name: 'Sky Base',
    help: 'Construct Sky Base: creates seekers',
    health: 40,
    building: true,
    width: 40,
    cost: 400,
    spawn: { unit: UNIT_SEEKER, time: 12500 },
    death: {
      splatter: { graph: 'splatter_metal', count: 6, speed: 100, time: 1500 }
    }
  }
)

configUnits.set(
  UNIT_SEEKER,
  {
    graph: 'seeker',
    health: 10,
    hover: { x: CONFIG_WIDTH*0.5, y: CONFIG_BLOCK*6, dx: CONFIG_WIDTH*0.35, dy: CONFIG_BLOCK*6, time: 800, speed: 100 },
    gravity: 0,
    shoot: {
        type: SHOT_GREEN_LASER,
        amin: -30,
        amax: 30,
        speed: 550,
        time: 900
    },
    death: {
      splatter: { graph: 'splatter_metal', count: 4, speed: 200, time: 500 }
    }
  }
)

configUnits.set(
  UNIT_TEMPLE,
  {
    graph: 'temple',
    name: 'Temple',
    help: 'Construct Temple: creates motherships',
    health: 50,
    building: true,
    width: 40,
    cost: 750,
    spawn: { unit: UNIT_MOTHERSHIP, time: 40000 },
    death: {
      splatter: { graph: 'splatter_metal', count: 6, speed: 100, time: 400 }
    }
  }
)

configUnits.set(
  UNIT_MOTHERSHIP,
  {
    graph: 'mothership',
    health: 45,
    hover: { x: CONFIG_WIDTH*0.5, y: CONFIG_BLOCK*8, dx: CONFIG_WIDTH*0.25, dy: CONFIG_BLOCK*8, time: 1000, speed: 50 },
    gravity: 0,
    shoot: { type: SHOT_GREEN_LASER, amin: -30, amax: 45, speed: 500, time: 600 },
    spawn: { unit: UNIT_ALIEN, time: 8000 },
    death: {
      splatter: { graph: 'splatter_metal', count: 6, speed: 100, time: 400 }
    }
  }
)
