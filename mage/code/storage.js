
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
      mapBlueprint =  JSON.parse(localStorage.getItem('mapBlueprint'));
    }
  }
  localStorage.setItem('version', VERSION);
}

function storageSaveMap() {
  console.log('saving map to local storage');
  localStorage.setItem('mapBlueprint', JSON.stringify(mapBlueprint));
}
