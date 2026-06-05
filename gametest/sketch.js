let game;
let assets = {
  fonts: {},
  backgrounds: {},
  characters: {},
  sounds: {
    bgm: {},
    effects: {}
  }
};

function preload() {
  Object.entries(ASSET_MANIFEST.fonts || {}).forEach(([name, path]) => {
    assets.fonts[name] = loadFont(path);
  });

  Object.entries(ASSET_MANIFEST.backgrounds).forEach(([name, path]) => {
    assets.backgrounds[name] = loadImage(path);
  });

  Object.entries(ASSET_MANIFEST.characters).forEach(([name, emotions]) => {
    assets.characters[name] = {};

    Object.entries(emotions).forEach(([emotion, path]) => {
      assets.characters[name][emotion] = loadImage(path);
    });
  });

  Object.entries(ASSET_MANIFEST.sounds.bgm || {}).forEach(([name, config]) => {
    const path = typeof config === "string" ? config : config.path;
    assets.sounds.bgm[name] = loadSound(path);
  });

  Object.entries(ASSET_MANIFEST.sounds.effects || {}).forEach(([name, path]) => {
    assets.sounds.effects[name] = loadSound(path);
  });
}

function setup() {
  const canvas = createCanvas(CONFIG.width, CONFIG.height);
  canvas.elt.addEventListener("contextmenu", (event) => event.preventDefault());
  textFont(assets.fonts.ui || "Malgun Gothic, sans-serif");

  game = new Game(assets);
}

function draw() {
  if (!game) return;
  game.update();
  game.draw();
}

function mousePressed() {
  if (!game) return;
  game.mousePressed();
}

function keyPressed() {
  if (!game) return;
  game.keyPressed();
}

function mouseWheel(event) {
  if (game && typeof game.mouseWheel === "function") {
    return game.mouseWheel(event);
  }
}
