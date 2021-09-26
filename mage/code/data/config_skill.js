
"use strict";

// All the learnable skills are here

const SKILL_AIR_1     = 1;
const SKILL_AIR_2     = 2;
const SKILL_AIR_3     = 3;
const SKILL_AIR_4     = 4;

const SKILL_WATER_1   = 11;
const SKILL_WATER_2   = 12;
const SKILL_WATER_3   = 13;
const SKILL_WATER_4   = 14;

const SKILL_FIRE_1    = 21;
const SKILL_FIRE_2    = 22;
const SKILL_FIRE_3    = 23;
const SKILL_FIRE_4    = 24;

const SKILL_EARTH_1   = 31;
const SKILL_EARTH_2   = 32;
const SKILL_EARTH_3   = 33;
const SKILL_EARTH_4   = 34;

const SKILL_RAIN      = 41;
const SKILL_METEOR    = 42;
const SKILL_VOLCANO   = 43;
const SKILL_POISON    = 44;

var SKILLS = new Map();

// Air skills //

SKILLS.set(
  SKILL_AIR_1,
  {
    name: 'Air magic I',
    help: 'Learn the air punch spell',
    spell: SPELL_AIR_PUNCH
  }
)

SKILLS.set(
  SKILL_AIR_2,
  {
    name: 'Air magic II',
    help: 'TODO',
    needs: [SKILL_AIR_1]
  }
)

SKILLS.set(
  SKILL_AIR_3,
  {
    name: 'Air magic III',
    help: 'TODO',
    spell: SPELL_BALL_LIGHTNING,
    needs: [SKILL_AIR_2]
  }
)

SKILLS.set(
  SKILL_AIR_4,
  {
    name: 'Air magic IV',
    help: 'TODO',
    needs: [SKILL_AIR_3]
  }
)

// Water skills //

SKILLS.set(
  SKILL_WATER_1,
  {
    name: 'Water magic I',
    help: 'Learn the water ball spell',
    spell: SPELL_WATER,
  }
)

SKILLS.set(
  SKILL_WATER_2,
  {
    name: 'Water magic II',
    help: 'TODO',
    needs: [SKILL_WATER_1]
  }
)

SKILLS.set(
  SKILL_WATER_3,
  {
    name: 'Water magic III',
    help: 'TODO',
    spell: SPELL_ICE,
    needs: [SKILL_WATER_2]
  }
)

SKILLS.set(
  SKILL_WATER_4,
  {
    name: 'Water magic IV',
    help: 'TODO',
    needs: [SKILL_WATER_3]
  }
)

// Fire skills //

SKILLS.set(
  SKILL_FIRE_1,
  {
    name: 'Fire magic I',
    help: 'Learn the fire ball spell',
    spell: SPELL_FIRE_BALL,
  }
)

SKILLS.set(
  SKILL_FIRE_2,
  {
    name: 'Fire magic II',
    help: 'TODO',
    needs: [SKILL_FIRE_1]
  }
)

SKILLS.set(
  SKILL_FIRE_3,
  {
    name: 'Fire magic III',
    help: 'TODO',
    spell: SPELL_FIRE_STORM,
    needs: [SKILL_FIRE_2]
  }
)

SKILLS.set(
  SKILL_FIRE_4,
  {
    name: 'Fire magic IV',
    help: 'TODO',
    needs: [SKILL_FIRE_3]
  }
)

// Earth skills //

SKILLS.set(
  SKILL_EARTH_1,
  {
    name: 'Earth magic I',
    help: 'Learn the summon stick spell',
    spell: SPELL_SUMMON_STICK,
  }
)

SKILLS.set(
  SKILL_EARTH_2,
  {
    name: 'Earth magic II',
    help: 'TODO',
    needs: [SKILL_EARTH_1]
  }
)

SKILLS.set(
  SKILL_EARTH_3,
  {
    name: 'Earth magic III',
    help: 'TODO',
    spell: SPELL_ROCK,
    needs: [SKILL_EARTH_2]
  }
)

SKILLS.set(
  SKILL_EARTH_4,
  {
    name: 'Earth magic IV',
    help: 'TODO',
    needs: [SKILL_EARTH_3]
  }
)

// Combined skills

SKILLS.set(
  SKILL_RAIN,
  {
    name: 'Water & Air magic V',
    help: 'TODO',
    spell: SPELL_RAIN,
    needs: [SKILL_WATER_4, SKILL_AIR_4]
  }
)

SKILLS.set(
  SKILL_METEOR,
  {
    name: 'Air & Fire magic V',
    help: 'TODO',
    spell: SPELL_METEOR,
    needs: [SKILL_AIR_4, SKILL_FIRE_4]
  }
)

SKILLS.set(
  SKILL_VOLCANO,
  {
    name: 'Fire & Earth magic V',
    help: 'TODO',
    spell: SPELL_VOLCANO,
    needs: [SKILL_FIRE_4, SKILL_EARTH_4]
  }
)

SKILLS.set(
  SKILL_POISON,
  {
    name: 'Earth & Water magic V',
    help: 'TODO',
    spell: SPELL_POISON,
    needs: [SKILL_EARTH_4, SKILL_WATER_4]
  }
)

// Utils //

function skillGetLearnable(known) {
  var ret = [];
  SKILLS.forEach((skill, key) => {
    if (known.includes(key)) return;
    if (skill.needs) {
      for (var i = 0; i < skill.needs.length; i++) {
        if(!known.includes(skill.needs[i])) return;
      }
    }
    ret.push(key);
  });
  return ret;
}
