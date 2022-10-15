
"use strict";

const RACE_HUMAN = 1
const RACE_BUG = 2
const RACE_ALIEN = 3

var configRaces = new Map();

const LOW = CONFIG_HEIGHT - 2.5 * CONFIG_BLOCK
const MID = CONFIG_HEIGHT - 6.5 * CONFIG_BLOCK
const HIGH = CONFIG_BLOCK * 10

configRaces.set(
  RACE_HUMAN,
  {
    base: UNIT_HUMAN_BASE,
    build: [UNIT_OUTPOST, UNIT_FORT, UNIT_FACTORY, UNIT_ASSEMBLY, UNIT_FIGHTER_BASE, UNIT_BOMBER_BASE, UNIT_MECH_BASE],
    roleProtected: [UNIT_OUTPOST, UNIT_FACTORY, UNIT_ASSEMBLY, UNIT_FIGHTER_BASE, UNIT_BOMBER_BASE, UNIT_MECH_BASE],
    roleMiddle: [UNIT_FORT, UNIT_OUTPOST, UNIT_FACTORY, UNIT_ASSEMBLY, UNIT_MECH_BASE],
    roleEdge: [UNIT_FORT],
    roleUpperEdge: [UNIT_FORT],
    roleUpper: [UNIT_OUTPOST, UNIT_FACTORY, UNIT_ASSEMBLY, UNIT_FIGHTER_BASE, UNIT_BOMBER_BASE],
    roleFront: [UNIT_FORT, UNIT_OUTPOST, UNIT_FACTORY, UNIT_ASSEMBLY],
    need: [UNIT_OUTPOST, UNIT_FACTORY],
    gameWinners: [UNIT_FACTORY, UNIT_ASSEMBLY, UNIT_MECH_BASE],
    swarm: [
      { unit: UNIT_SOLDIER, y: LOW, time: 5000 },
      { unit: UNIT_BUGGY, y: LOW, time: 17000 },
      { unit: UNIT_ROCKET_LAUNCHER, y: MID, time: 25000 },
      { unit: UNIT_FIGHTER, y: HIGH, time: 35000 },
      { unit: UNIT_BOMBER, y: HIGH, time: 45000 },
      { unit: UNIT_MECH, y: LOW, time: 80000 },
    ]
  }
)
configRaces.set(
  RACE_BUG,
  {
    base: UNIT_BUG_BASE,
    build: [UNIT_HATCHERY, UNIT_BUG_WALL, UNIT_FIRE_SPITTER, UNIT_BURROW, UNIT_FIRE_BURROW, UNIT_FLYER_NEST, UNIT_DRAGONBUG_NEST],
    roleProtected: [UNIT_HATCHERY, UNIT_BURROW, UNIT_FIRE_BURROW, UNIT_FLYER_NEST, UNIT_DRAGONBUG_NEST],
    roleMiddle: [UNIT_HATCHERY, UNIT_BURROW, UNIT_FIRE_BURROW, UNIT_FLYER_NEST],
    roleEdge: [UNIT_BUG_WALL],
    roleUpperEdge: [UNIT_BUG_WALL, UNIT_FIRE_SPITTER],
    roleUpper: [UNIT_HATCHERY, UNIT_BURROW, UNIT_FIRE_BURROW, UNIT_FLYER_NEST, UNIT_FIRE_SPITTER, UNIT_DRAGONBUG_NEST],
    roleFront: [UNIT_HATCHERY, UNIT_BURROW, UNIT_FIRE_BURROW, UNIT_FLYER_NEST, UNIT_FIRE_SPITTER],
    need: [UNIT_HATCHERY, UNIT_BURROW],
    gameWinners: [UNIT_BURROW, UNIT_FIRE_BURROW, UNIT_DRAGONBUG_NEST],
    swarm: [
      { unit: UNIT_BUG, y: LOW, time: 3000 },
      { unit: UNIT_CRAWLER, y: LOW, time: 18000 },
      { unit: UNIT_FIRE_LARVA, y: MID, time: 25000 },
      { unit: UNIT_FLYER, y: MID, time: 25000 },
      { unit: UNIT_DRAGONBUG, y: HIGH, time: 75000 },
    ]
  }
)
configRaces.set(
  RACE_ALIEN,
  {
    base: UNIT_ALIEN_BASE,
    build: [UNIT_MONUMENT, UNIT_FF_GENERATOR, UNIT_SPIDER_ASSEMBLY, UNIT_WATCHER, UNIT_SKY_BASE, UNIT_PORTAL, UNIT_TEMPLE],
    roleProtected: [UNIT_MONUMENT, UNIT_SPIDER_ASSEMBLY, UNIT_PORTAL, UNIT_SKY_BASE, UNIT_TEMPLE],
    roleMiddle: [UNIT_MONUMENT, UNIT_SPIDER_ASSEMBLY, UNIT_FF_GENERATOR, UNIT_PORTAL],
    roleEdge: [UNIT_MONUMENT],
    roleUpperEdge: [UNIT_MONUMENT, UNIT_WATCHER],
    roleUpper: [UNIT_MONUMENT, UNIT_SPIDER_ASSEMBLY, UNIT_WATCHER, UNIT_FF_GENERATOR, UNIT_SKY_BASE, UNIT_TEMPLE],
    roleFront: [UNIT_WATCHER],
    need: [UNIT_MONUMENT, UNIT_SPIDER_ASSEMBLY],
    gameWinners: [UNIT_MONUMENT, UNIT_TEMPLE],
    swarm: [
      { unit: UNIT_ALIEN, y: LOW, time: 8000 },
      { unit: UNIT_FIRE_SPIDER, y: MID, time: 15000 },
      { unit: UNIT_DESTROYER, y: MID, time: 30000 },
      { unit: UNIT_SEEKER, y: HIGH, time: 35000 },
      { unit: UNIT_MOTHERSHIP, y: HIGH, time: 75000 },
    ]
  }
)