let game;

function setup() {
  createCanvas(CONFIG.width, CONFIG.height);
  textFont("sans-serif");

  game = new Game();
}

function draw() {
  game.update();
  game.draw();
}

function mousePressed() {
  game.mousePressed();
}
