
"use strict";

function storageLoad() {

  console.log('Current game version: ' + VERSION);

  const versionInStorage = localStorage.getItem('version');

  if (!versionInStorage) {
    console.log('No local storage data');
    localStorage.clear(); // Clear to be sure
  } else {
    if (versionInStorage != VERSION) {
      console.log('Wrong version in local storage, clearing. Old version: ' + versionInStorage);
      localStorage.clear();
    } else {
      console.log('Loading local storage. If this fails, clear local storage.');

      const mapBlueprintJson = localStorage.getItem('mapBlueprint');
      mapBlueprint =  JSON.parse(mapBlueprintJson);

      const playerProgressJson = localStorage.getItem('playerProgress');
      if (playerProgressJson != null) playerProgressSave = JSON.parse(playerProgressJson);
    }
  }
  localStorage.setItem('version', VERSION);
}

function storageSaveMap() {
  console.log('saving map to local storage');
  localStorage.setItem('mapBlueprint', JSON.stringify(mapBlueprint));
}

function storageSavePlayerProgress() {
  console.log('saving player progress to local storage');
  localStorage.setItem('playerProgress', JSON.stringify(playerProgressSave));
}
