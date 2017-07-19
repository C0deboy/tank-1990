class Pad {
  constructor() {
    this.pad = document.querySelector('.pad');
    this.padUpBtn = document.getElementById('padUp');
    this.padDownBtn = document.getElementById('padDown');
    this.padLeftBtn = document.getElementById('padLeft');
    this.padRightBtn = document.getElementById('padRight');
    this.padXBtn = document.getElementById('padX');
    this.up = false;
    this.down = false;
    this.left = false;
    this.up = false;
    this.x = false;
    this.padUpBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.up = true;
    });
    this.padDownBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.down = true;
    });
    this.padLeftBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.left = true;
    });
    this.padRightBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.right = true;
    });
    this.padXBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.x = true;
    });
    this.padUpBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.up = false;
    });
    this.padDownBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.down = false;
    });
    this.padLeftBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.left = false;
    });
    this.padRightBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.right = false;
    });
    this.padXBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.x = false;
    });
  }
  show() {
    this.pad.style.display = 'block';
  }
}

export default Pad;
