
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
    name: 'Air magic I: Air punch',
    help: 'Learn the air punch spell',
    spell: SPELL_AIR_PUNCH
  }
)

SKILLS.set(
  SKILL_AIR_2,
  {
    name: 'Air magic II: Movement',
    help: 'Faster movement and air defence',
    needs: [SKILL_AIR_1],
    airDef: 25,
    speed: 100,
    jump: 25
  }
)

SKILLS.set(
  SKILL_AIR_3,
  {
    name: 'Air magic III: Lightning',
    help: 'Ball lightning spell and air defence',
    spell: SPELL_BALL_LIGHTNING,
    needs: [SKILL_AIR_2],
    airDef: 25
  }
)

SKILLS.set(
  SKILL_AIR_4,
  {
    name: 'Air magic IV: One with the wind',
    help: 'Better movement and air defence ',
    needs: [SKILL_AIR_3],
    airDef: 25,
    speed: 300,
    jump: 25
  }
)

// Water skills //

SKILLS.set(
  SKILL_WATER_1,
  {
    name: 'Water magic I: Water ball',
    help: 'Learn the water ball spell',
    spell: SPELL_WATER,
  }
)

SKILLS.set(
  SKILL_WATER_2,
  {
    name: 'Water magic II: Life',
    help: 'Health regeneration and water defence',
    needs: [SKILL_WATER_1],
    waterDef: 25,
    healthRegen: 1.0
  }
)

SKILLS.set(
  SKILL_WATER_3,
  {
    name: 'Water magic III: Freeze',
    help: 'Learn the freeze spell and water defence',
    needs: [SKILL_WATER_2],
    spell: SPELL_ICE,
    waterDef: 25
  }
)

SKILLS.set(
  SKILL_WATER_4,
  {
    name: 'Water magic IV: Water of life',
    help: 'Health regeneration and water defence',
    needs: [SKILL_WATER_3],
    waterDef: 25,
    healthRegen: 1.5
  }
)

// Fire skills //

SKILLS.set(
  SKILL_FIRE_1,
  {
    name: 'Fire magic I: Fire ball',
    help: 'Learn the fire ball spell',
    spell: SPELL_FIRE_BALL,
  }
)

SKILLS.set(
  SKILL_FIRE_2,
  {
    name: 'Fire magic II: Mana',
    help: 'Mana regeneration and fire defence',
    needs: [SKILL_FIRE_1],
    manaRegen: 2.0,
    fireDef: 25
  }
)

SKILLS.set(
  SKILL_FIRE_3,
  {
    name: 'Fire magic III: Fire storm',
    help: 'Learn the fire storm spell and fire defence',
    needs: [SKILL_FIRE_2],
    spell: SPELL_FIRE_STORM,
    fireDef: 25
  }
)

SKILLS.set(
  SKILL_FIRE_4,
  {
    name: 'Fire magic IV: Mana mastery',
    help: 'Increased mana generation and fire defence',
    needs: [SKILL_FIRE_3],
    fireDef: 25,
    manaRegen: 4.0
  }
)

// Earth skills //

SKILLS.set(
  SKILL_EARTH_1,
  {
    name: 'Earth magic I: Summon stick',
    help: 'Learn the summon stick spell',
    spell: SPELL_SUMMON_STICK,
  }
)

SKILLS.set(
  SKILL_EARTH_2,
  {
    name: 'Earth magic II: Defence',
    help: 'Defence againts earth',
    needs: [SKILL_EARTH_1],
    earthDef: 50
  }
)

SKILLS.set(
  SKILL_EARTH_3,
  {
    name: 'Earth magic III: Rock',
    help: 'Learn the rock spell and earth earth',
    needs: [SKILL_EARTH_2],
    spell: SPELL_ROCK,
    earthDef: 25
  }
)

SKILLS.set(
  SKILL_EARTH_4,
  {
    name: 'Earth magic IV: Stone skin',
    help: 'Defence against all elements',
    needs: [SKILL_EARTH_3],
    airDef: 25,
    waterDef: 25,
    fireDef: 25,
    earthDef: 25
  }
)

// Combined skills

SKILLS.set(
  SKILL_RAIN,
  {
    name: 'Water + Air V: Rain',
    help: 'Learn the rain spell',
    spell: SPELL_RAIN,
    needs: [SKILL_WATER_4, SKILL_AIR_4]
  }
)

SKILLS.set(
  SKILL_METEOR,
  {
    name: 'Air + Fire V: Meteors',
    help: 'Learn the meteor spell',
    spell: SPELL_METEOR,
    needs: [SKILL_AIR_4, SKILL_FIRE_4]
  }
)

SKILLS.set(
  SKILL_VOLCANO,
  {
    name: 'Fire + Earth V: Volcano',
    help: 'Learn the volcano spell',
    spell: SPELL_VOLCANO,
    needs: [SKILL_FIRE_4, SKILL_EARTH_4]
  }
)

SKILLS.set(
  SKILL_POISON,
  {
    name: 'Earth + Water V: Poison',
    help: 'Learn the poison spell',
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
