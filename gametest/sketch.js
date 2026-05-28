let game;
let assets = {
  backgrounds: {},
  characters: {},
  sounds: {
    bgm: {},
    effects: {}
  }
};

function preload() {
  Object.entries(ASSET_MANIFEST.backgrounds).forEach(([name, path]) => {
    assets.backgrounds[name] = loadImage(path);
  });

  Object.entries(ASSET_MANIFEST.characters).forEach(([name, emotions]) => {
    assets.characters[name] = {};

    Object.entries(emotions).forEach(([emotion, path]) => {
      assets.characters[name][emotion] = loadImage(path);
    });
  });

  Object.entries(ASSET_MANIFEST.sounds.bgm || {}).forEach(([name, path]) => {
    assets.sounds.bgm[name] = loadSound(path);
  });

  Object.entries(ASSET_MANIFEST.sounds.effects || {}).forEach(([name, path]) => {
    assets.sounds.effects[name] = loadSound(path);
  });
}

function setup() {
  createCanvas(CONFIG.width, CONFIG.height);
  textFont("Malgun Gothic, sans-serif");

  game = new Game(assets);
}

function draw() {
  game.update();
  game.draw();
}

function mousePressed() {
  game.mousePressed();
}

function keyPressed() {
  game.keyPressed();
}
