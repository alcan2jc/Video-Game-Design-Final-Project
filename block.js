class Block {
    constructor(x, y, w, h, sprite) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
      this.sprite = sprite;
    }
    
    draw() {
      image(this.sprite, this.x, this.y, this.width, this.height);
    }
  }