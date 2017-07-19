import Phaser from 'phaser-ce';
import Tank from './tank';


const spawnPoints = [{
  x: 30,
  y: 30,
}, {
  x: 430,
  y: 10,
}, {
  x: 940,
  y: 10,
},
];

let i = 0;

class EnemyTank extends Tank {
  constructor() {
    i++;
    if (i > spawnPoints.length - 1) { i = 0; }

    super('enemy', spawnPoints[i].x, spawnPoints[i].y, 90);
  }
}

export default EnemyTank;
