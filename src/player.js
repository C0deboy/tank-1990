import Tank from './tank';
import game from './game';

class Player extends Tank {
  constructor() {
    super('player', 330, 870, -90);

    this.isMoving = false;
    this.moveSound = game.add.audio('move');
    this.holdSound = game.add.audio('hold');
    this.fireSound = game.add.audio('fire');
    this.cannon.onFire.add(() => this.fireSound.play(), this);
  }
}

export default Player;
