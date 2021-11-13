class Animator {
    constructor() {
      this.timer = 0;
      this.anim = [];
    }
    
    draw() {
      for (let i = 0; i < this.anim.length; i++) {
        let animation = this.anim[i];
        animation.draw();
        
        if (animation.end) {
          this.anim.splice(i, 1);
          i--;
        }
      }
    }

    jumpEffect(x, y) {
        this.anim.push(new jump_effect(x, y));
    }
    
    hitEffect() {
      this.anim.push(new hit_a());
    }
    
    collectEffect(x, y) {
      this.anim.push(new collect_money(x, y));
    }
  }

  class Particle {
      constructor(x, y, radius, color, speed, direction) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.spd = speed;
        this.dir = direction;
        this.color = color;
      }

      draw() {
          this.x += cos(this.dir) * this.spd;
          this.y += sin(this.dir) * this.spd;

          noStroke();
          fill(this.color);
          ellipse(this.x, this.y, this.radius, this.radius);
      }
  }

  class jump_effect {
      constructor(x, y) {
        this.particles = [];
        this.end = false;
        this.length = 30;
        
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle(x, y, 5, 255, 1, random() * PI/2 + PI/4));
        }
      }

      draw() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw();
        }
        this.length--;

        if (this.length < 0) {
            this.end = true;
        }
      }
  }
    
  class hit_a {
    constructor() {
      this.end = false;
      this.alpha = 255;
    }
  
    draw() {
      push()
      if (game.player.x >= width / 2 && game.player.x <= (3/2) * width)
        translate(game.player.x - (width/2), 0);
      else if (game.player.x > (3/2) * width)
        translate(width, 0);
      
      fill(255, 0, 0, this.alpha);
      rect(0, 0, width, height);
      
      this.alpha -= 5;
      
      if (this.alpha < 0)
        this.end = true;
      
      pop();
    }
  }
  
  class collect_money {
    constructor(x, y) {
      this.alpha = 255;
      this.size = 10;
      this.x = x;
      this.y = y;
      this.end = false;
    }
    
    draw() {
      fill(0, 255, 0, this.alpha);
      ellipse(this.x, this.y, this.size, this.size);
      
      this.alpha -= 5;
      this.size += 1;
      
      if (this.alpha < 0)
        this.end = true;
    }
  }