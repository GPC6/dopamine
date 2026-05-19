let game;
let assets = {
  backgrounds: {},
  characters: {}
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
}

function setup() {
  createCanvas(CONFIG.width, CONFIG.height);
  textFont("sans-serif");

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
