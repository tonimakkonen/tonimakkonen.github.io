
const SHOT_LASER = 1
const SHOT_SLIME = 2
const SHOT_FIRE = 3
const SHOT_FIRE_BALL = 4
const SHOT_ROCKET = 5
const SHOT_BOMB = 6
const SHOT_GREEN_LASER = 7
const SHOT_ENERGY = 8

var configShots = new Map();

configShots.set(
  SHOT_LASER,
  {
    graph: 'shot_laser',
    damage: 3,
  }
)

configShots.set(
  SHOT_SLIME,
  {
    graph: 'shot_slime',
    damage: 3,
  }
)

configShots.set(
  SHOT_FIRE,
  {
    graph: 'shot_fire',
    damage: 3,
  }
)

configShots.set(
  SHOT_FIRE_BALL,
  {
    graph: 'shot_fire_ball',
    damage: 5,
    death: {
      spawn: {
        type: SHOT_FIRE,
        count: 6,
        speed: 300
      },
      splatter: {
        graph: 'splatter_explosion',
        explosion: true,
        time: 200
      }
    }
  }
)

configShots.set(
  SHOT_ROCKET,
  {
    graph: 'shot_rocket',
    leftRight: true,
    death: {
      spawn: {
        type: SHOT_FIRE,
        count: 4,
        speed: 100
      },
      splatter: {
        graph: 'splatter_explosion',
        explosion: true,
        time: 200
      }
    },
    damage: 10
  }
)

configShots.set(
  SHOT_BOMB,
  {
    graph: 'shot_bomb',
    death: {
      spawn: {
        type: SHOT_FIRE,
        count: 10,
        speed: 150
      },
      splatter: {
        graph: 'splatter_explosion',
        explosion: true,
        time: 200
      }
    },
    damage: 5
  }
)

configShots.set(
  SHOT_GREEN_LASER,
  {
    graph: 'shot_green_laser',
    damage: 4,
  }
)

configShots.set(
  SHOT_ENERGY,
  {
    graph: 'shot_energy',
    gravity: 0,
    death: {
      splatter: {
        graph: 'splatter_energy',
        explosion: true,
        time: 100
      }
    },
    damage: 15
  }
)
