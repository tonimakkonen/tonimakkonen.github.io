
"use strict";

// This map is used if we ever add more properties to levels here

var LEVELS = new Map();

LEVELS.set(
  0,
  {
    name: 'Intro',
    location: 'maps/level0.json'
  }
);

LEVELS.set(
  1,
  {
    location: 'maps/level1.json'
  }
);

LEVELS.set(
  2,
  {
    location: 'maps/level2.json'
  }
);

LEVELS.set(
  3,
  {
    location: 'maps/level3.json'
  }
);

LEVELS.set(
  4,
  {
    location: 'maps/level4.json'
  }
);

LEVELS.set(
  5,
  {
    location: 'maps/level5.json'
  }
);

LEVELS.set(
  6,
  {
    location: 'maps/level6.json'
  }
);

LEVELS.set(
  7,
  {
    location: 'maps/level7.json'
  }
);

LEVELS.set(
  8,
  {
    location: 'maps/level8.json'
  }
);

LEVELS.set(
  9,
  {
    location: 'maps/level9.json'
  }
);

LEVELS.set(
  10,
  {
    location: 'maps/level10.json'
  }
);

LEVELS.set(
  11,
  {
    location: 'maps/level11.json'
  }
);

LEVELS.set(
  12,
  {
    location: 'maps/level12.json'
  }
);


// We load our levels here
// TODO: Make a check when levels are actually loaded

const getJSON = async url => {
  const response = await fetch(url);
  if(!response.ok) throw response.statusText;
  const data = response.json();
  return data;
}

LEVELS.forEach((level, index) => {
  getJSON(level.location).then(data => {
    level.mapBlueprint = data;
    console.log('Loaded level: ' + index);
  }).catch(error => {
    throw 'Failed to load level: ' + error;
  });
});
