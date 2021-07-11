
function storageLoad() {
  var versionInStorage = localStorage.getItem('version');
  if (!versionInStorage) {
    console.log('No local storage data');
    localStorage.clear();
  } else {
    if (versionInStorage != VERSION) {
      console.log('Wrong version in local storage, clearing');
      localStorage.clear();
    } else {
      // Hoping this doesn't break anything
      mapBlueprint =  JSON.parse(localStorage.getItem('mapBlueprint'));
    }
  }
  localStorage.setItem('version', VERSION);
}

function storageSaveMap() {
  console.log('saving map');
  localStorage.setItem('mapBlueprint', JSON.stringify(mapBlueprint));
}
