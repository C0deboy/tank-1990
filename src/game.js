import Phaser from 'phaser-ce';
import GameData from './gameData';
import EnemyTank from './enemyTank';
import Player from './player';
import AI from './ai';
import Pad from './pad';

const game = new Phaser.Game(900, 900, Phaser.AUTO, null, { preload, create, update });
const pad = new Pad();

let map;
let layer;
let player;
const timeToSpawnEnemyAgain = 6000;
let enemies;
let eagle;
let destroyTileSound;
let enemyCountBmd;
let ememyCount;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.fullScreenTarget = document.documentElement;

  if (!game.device.desktop) {
    pad.show();
    if(game.scale.isPortrait){
      game.scale.pageAlignVertically = false;
    }
  }

  game.load.tilemap('map', './assets/map.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('brick', './assets/sprites/brick.png');

  game.load.spritesheet('eagle', './assets/sprites/eagle.png', 60, 60);
  game.load.spritesheet('player', './assets/sprites/player.png', 55, 55);
  game.load.spritesheet('enemy', './assets/sprites/enemy.png', 53, 45);
  game.load.spritesheet('explosion', './assets/sprites/explosion.png', 70, 65);

  game.load.image('bullet', './assets/sprites/bullet.png');

  game.load.audio('hold', './assets/sounds/hold.wav');
  game.load.audio('move', './assets/sounds/move.wav');
  game.load.audio('fire', './assets/sounds/fire.wav');
  game.load.audio('explosion', './assets/sounds/explosion.wav');
  game.load.audio('destroyTile', './assets/sounds/destroyTile.wav');

  game.load.image('gameover', './assets/sprites/gameover.png');


  game.load.image('enemyCount', './assets/sprites/enemyCount.png');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.stage.backgroundColor = 'black';
  map = game.add.tilemap('map');
  map.addTilesetImage('brick');
  layer = map.createLayer('bricks');
  map.setCollisionByExclusion([0], true, 'bricks');

  destroyTileSound = game.add.audio('destroyTile');

  eagle = game.add.sprite(420, 840, 'eagle');
  game.physics.enable(eagle);
  eagle.body.immovable = true;

  enemies = game.add.group();

  spawnNextEnemies();

  game.time.events.repeat(timeToSpawnEnemyAgain, GameData.enemiesToSpawn / 3, spawnNextEnemies, this);

  const enemyAI = new AI(enemies);
  enemyAI.enable();

  player = new Player();
  game.world.add(player);
}

function update() {
  game.physics.arcade.collide(player, layer);
  game.physics.arcade.collide(player.cannon.bullets, layer, playerBulletHitsBrick, undefined, player);
  game.physics.arcade.collide(player.cannon.bullets, enemies, bulletHitsEnemy);
  game.physics.arcade.collide(player.cannon.bullets, eagle, bulletHitsEagle);
  player.setZeroVelocity();

  enemies.forEach((enemy) => {
    if (enemy.alive) {
      game.physics.arcade.collide(enemy, layer);
      game.physics.arcade.collide(enemy.cannon.bullets, layer, bulletHitsBrick);
      game.physics.arcade.collide(enemy.cannon.bullets, eagle, bulletHitsEagle);
      game.physics.arcade.collide(enemy.cannon.bullets, player.cannon.bullets, bulletHitsBullet);
      game.physics.arcade.collide(enemy, player);
      game.physics.arcade.collide(enemy.cannon.bullets, player, bulletHitsPlayer);
    }
  });

  if (GameData.enemiesAlive === 0) {
    victory();
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || pad.left) {
    player.moveLeft();
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || pad.right) {
    player.moveRight();
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.UP) || pad.up) {
    player.moveUp();
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || pad.down) {
    player.moveDown();
  } else {
    player.isMoving = false;
  }

  if ((game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || pad.x) && player.alive) {
    player.cannon.fire();
  }

  if (player.isMoving) {
    player.moveSound.play(undefined, undefined, undefined, undefined, false);
    player.holdSound.pause();
  } else {
    player.holdSound.play(undefined, undefined, undefined, undefined, false);
    player.moveSound.pause();
  }
}

let gameover;
function gameOver() {
  if (!gameover) {
    gameover = game.add.sprite(game.world.centerX, 900, 'gameover');
    gameover.anchor.set(0.5);
    game.add.tween(gameover).to({ y: game.world.centerY }, 4000, Phaser.Easing.linear, true);
    setTimeout(() => document.location.reload(), 4000);
  }
}
function victory() {
  alert('victory');
  document.location.reload();
}

function bulletHitsBrick(bullet, bricks) {
  bullet.kill();
  map.removeTile(bricks.x, bricks.y);
}
function playerBulletHitsBrick(bullet, bricks) {
  bullet.kill();
  destroyTileSound.play();
  let tile;
  const brickVsBulletPosX = bricks.worldX + 30 - bullet.x;
  const brickVsBulletPosY = bricks.worldY + 30 - bullet.y;

  if (brickVsBulletPosX > -6 && brickVsBulletPosX < 6) { tile = map.getTileRight(0, bricks.x, bricks.y); }
  if (brickVsBulletPosY > -7 && brickVsBulletPosY < 6) { tile = map.getTileBelow(0, bricks.x, bricks.y); }
  map.removeTile(bricks.x, bricks.y);
  if (tile) { map.removeTile(tile.x, tile.y); }
}

function bulletHitsEnemy(bullet, enemy) {
  bullet.kill();
  enemy.kill();
  enemy.explosionSound.play();
  game.time.events.remove(enemy.randomFireEvent);
  GameData.enemiesAlive--;
}

function bulletHitsPlayer(player, bullet) {
  bullet.kill();
  player.kill();
  player.explosionSound.play();
  gameOver();
}

function bulletHitsEagle(eagle, bullet) {
  bullet.kill();
  eagle.frame = 1;
  gameOver();
}
function bulletHitsBullet(bullet, bullet2) {
  bullet.kill();
  bullet2.kill();
}

function spawnNextEnemies() {
  let amount = 3;
  if (GameData.enemiesToSpawn < amount) {
    amount = GameData.enemiesToSpawn;
  }
  for (let i = 0; i < amount; i++) {
    enemies.add(new EnemyTank());
  }

  GameData.enemiesToSpawn -= amount;
}

document.getElementById('fullscreen').addEventListener('click', toggleFullScreen);

function toggleFullScreen() {
  if (game.scale.isFullScreen) {
    game.scale.stopFullScreen();
  } else {
    game.scale.startFullScreen(false);
  }
}

export default game;
