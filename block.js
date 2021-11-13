
// generic block container class
class Block {
    // x position
    // y position
    // w width
    // h height
    // sprite The sprite to use
    constructor(x, y, w, h, sprite) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
      this.sprite = sprite;
    }
    
    // draws block to canvas
    draw() {
      image(this.sprite, this.x, this.y, this.width, this.height);
    }
  }