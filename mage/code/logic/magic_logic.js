
"use strict";

function magicCalculateDamage(damage, type, airDef, waterDef, fireDef, earthDef) {
  var final = 0.0;
  if (type == MAGIC_TYPE_AIR) {
    final = magicFinalDamage(damage, airDef);
  } else if (type == MAGIC_TYPE_WATER) {
    final = magicFinalDamage(damage, waterDef);
  } else if (type == MAGIC_TYPE_FIRE) {
    final = magicFinalDamage(damage, fireDef);
  } else if (type == MAGIC_TYPE_EARTH) {
    final = magicFinalDamage(damage, earthDef);
  } else {
    throw 'Unkown magic type: ' + type;
  }
  return [final, final - damage];
}

function magicFinalDamage(damage, def) {
  if (!def) return damage;
  if (def >= 0) return damage / (1.0 + def / 100.0);
  else return damage * (1.0 - def / 100.0);
}

function magicCalculateDamageAndAddText(game, px, py, amount, type,  airDef, waterDef, fireDef, earthDef) {
  var [damage, delta] = magicCalculateDamage(amount, type, airDef, waterDef, fireDef, earthDef);
  if (delta == 0.0) {
    infoCreateText(game, px, py, damage.toFixed(0).toString(10), '#FF0000', 500);
  } else if (delta > 0.0) {
    infoCreateText(game, px, py, damage.toFixed(0).toString(10) + ' (+' + delta.toFixed(0).toString(10) + ')', '#FF0000', 500);
  } else {
    infoCreateText(game, px, py, damage.toFixed(0).toString(10) + ' (' + delta.toFixed(0).toString(10) + ')', '#FF7070', 500);
  }
  return damage;
}

// Change phaser3 object tint based on magical effects
function magichandleObjectTint(game, object) {
  // Clear tint if time has run out
  // TODO: Note difference between times
  if (object.xFreeze && game.time.now > object.xFreeze) object.xFreeze = undefined;
  if (object.xPoison && object.xPoison < 0.0) object.xPoison = undefined;
  // Set desired tint based on current state
  var desiredTint = null;
  if (object.xFreeze && object.xPoison) {
    desiredTint = 0x008080;
  } else if (object.xFreeze) {
    desiredTint = 0x2020ff;
  } else if (object.xPoison) {
    desiredTint = 0x20ff20;
  }
  if (desiredTint == null) {
    if (object.xTint) {
      object.clearTint();
      object.xTint = desiredTint;
    }
  } else {
    if (!object.xTint || object.xTint != desiredTint) {
      object.setTint(desiredTint);
      object.xTint = desiredTint;
    }
  }
}

// Handle poisoning effect
function magichandlePoisonEffect(game, object, isPlayer) {
  if (!object.xPoison) return;
  if (!object.xPoisonLast) object.xPoisonLast = game.time.now;
  if (game.time.now < object.xPoisonLast + 1000.0) return;

  // do the poison effect
  var dps = 2.0;
  if (object.xPoison > 10000.0) {
    dps = dps + (object.xPoison - 10000.0) / 1000.0;
  }
  object.xPoison = object.xPoison - 1000.0 * dps / 2.0;
  if (isPlayer) {
    playerDealDamage(game, object, dps, object.x, object.y, MAGIC_TYPE_EARTH);
  } else {
    enemyDealDamage(game, object, dps, object.x, object.y, MAGIC_TYPE_EARTH);
  }
  object.xPoisonLast = game.time.now;

  // reset poison when it's done
  if (object.xPoison < 0.0) {
    object.xPoison = undefined;
    object.xPoisonLast = undefined;
  }
}
