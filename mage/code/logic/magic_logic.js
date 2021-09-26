
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

function magichandleObjectTint(game, object) {
  // Clear tint if time has run out
  if (object.xFreeze && game.time.now > object.xFreeze) object.xFreeze = undefined;
  if (object.xPoison && game.time.now > object.xPoison) object.xPoison = undefined;
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
