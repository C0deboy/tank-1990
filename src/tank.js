import Phaser from 'phaser-ce';
import game from './game';

let oldRandom = 1;
let random = 2;

class Tank extends Phaser.Sprite {
  constructor(name, x, y, angle) {
    super();
    this.name = name;
    this.speed = 180;
    this.explosionSound = game.add.audio('explosion');

    this.spawnPoint = {
      x,
      y,
    };

    Phaser.Sprite.call(this, game, this.spawnPoint.x, this.spawnPoint.y, name);

    this.animations.add(name);
    this.anchor.setTo(0.5, 0.5);
    this.angle = angle;
    this.checkWorldBounds = true;

    game.physics.enable(this);
    this.body.collideWorldBounds = true;

    this.events.onKilled.add(this.explode, this);

    this.cannon = game.add.weapon(1, 'bullet');
    this.cannon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.cannon.bulletSpeed = 400;
    this.cannon.trackSprite(this, this.width / 2, 0);
    this.cannon.trackRotation = true;
    this.cannon.onKill.add( (bullet) => {
      const explosion = game.add.sprite(bullet.x, bullet.y, 'explosion');
      explosion.anchor.setTo(0.5, 0.5);
      explosion.animations.add('explosion', [1, 2]);
      explosion.animations.play('explosion', 30, false, true);
    }, this);
    game.physics.enable(this.cannon.bullets);
  }

  moveUp() {
    this.angle = -90;
    this.animations.play(this.name);
    this.body.velocity.y -= this.speed;
    this.isMoving = true;
  }

  moveDown() {
    this.angle = 90;
    this.animations.play(this.name);
    this.body.velocity.y += this.speed;
    this.isMoving = true;
  }

  moveRight() {
    this.angle = 0;
    this.animations.play(this.name);
    this.body.velocity.x += this.speed;
    this.isMoving = true;
  }

  moveLeft() {
    this.angle = -180;
    this.animations.play(this.name);
    this.body.velocity.x -= this.speed;
    this.isMoving = true;
  }

  moveForward() {
    if (this.angle === -90) {
      this.moveUp();
    } else if (this.angle === 90) {
      this.moveDown();
    } else if (this.angle === 0) {
      this.moveRight();
    } else {
      this.moveLeft();
    }
  }

  changeDirection() {
    random = Math.floor(Math.random() * 4) + 1;
    while (random === oldRandom) { random = Math.floor(Math.random() * 4) + 1; }
    oldRandom = random;

    if (random === 1)
      this.moveLeft();
    else if (random === 2)
      this.moveRight();
    else if (random === 3)
      this.moveUp();
    else if (random === 4)
      this.moveDown();
  }

  explode() {
    const explosion = game.add.sprite(this.x, this.y, 'explosion');
    explosion.anchor.setTo(0.5, 0.5);
    explosion.animations.add('explosion');
    explosion.animations.play('explosion', 15, false, true);
  }

  setZeroVelocity() {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  }

}

export default Tank;