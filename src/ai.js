import Phaser from 'phaser-ce';
import EnemyTank from './enemyTank';
import game from './game';

class AI {
  constructor(enemies) {
    this.enemies = enemies;
  }
  enable() {
    game.time.events.loop(1000, this.randomActions, this);
    const enemies = this.enemies;

    EnemyTank.prototype.update = function updateAI() {
      game.physics.arcade.collide(this, enemies, enemyCollideEnemy);

      this.setZeroVelocity();
      this.moveForward();

      this.body.onWorldBounds = new Phaser.Signal();
      this.body.onWorldBounds.add(() => this.changeDirection(), this);

      if (!this.body.blocked.none) {
        this.cannon.fire();
      }
    };
  }

  randomActions() {
    this.enemies.forEachAlive((enemy) => {
      game.time.events.add((Math.random() * 3000) + 1000, () => enemy.changeDirection(), this);
      enemy.randomFireEvent = game.time.events.add((Math.random() * 1000) + 500, () => enemy.cannon.fire(), enemy);
    });
  }
}

function enemyCollideEnemy(enemy, enemy2) {
  enemy.changeDirection();
  enemy2.changeDirection();
}

export default AI;
