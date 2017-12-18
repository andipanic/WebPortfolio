var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// Handle key input
var KeyHandler = {
  init: function() {
    window.addEventListener('keydown', event =>
      KeyHandler.keyDown(event), false);
    window.addEventListener('keyup', event =>
      KeyHandler.keyUp(event), false);
  },
  pressed: [],
  keyDown: function(e) {
    this.pressed[e.keyCode] = true;
  },
  keyUp: function(e) {
    this.pressed[e.keyCode] = false;
  },
}

KeyHandler.init();

// Objects
var Player = {
  x: 100,
  y: 100,
  vx: 2,
  vy: 2,
  color: 'red',
  size: 8,
  update: function() {

    // Left
    if (KeyHandler.pressed[37]) {
      this.x -= this.vx;
    }
    // Up
    if (KeyHandler.pressed[38]) {
      this.y -= this.vy;
    }
    // Right
    if (KeyHandler.pressed[39]) {
      this.x += this.vx;
    }
    // Down
    if (KeyHandler.pressed[40]) {
      this.y += this.vy;
    }
    this.draw();
  },
  draw: function() {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.size, this.size);
  }
}


function r(n) {
	if(n) {
  	return parseInt(Math.random() * n);
  }else{
  	return parseInt(Math.random() * 255);
  }
}

var Particle = function(x, y, size) {
  this.x = x;
  this.y = y;
  this.dy = Math.random();
  this.dx = Math.random() - .5;
  this.gravity = .9;
  this.size = size;
  this.alpha = 1;
  this.color = r() + ", " + r() + ", " + r();
  this.draw = function() {
    c.fillStyle = "rgba(" + this.color + "," + this.alpha + ")";
    c.fillRect(this.x, this.y, this.size, this.size);
  }
  this.update = function() {
    this.dy /= this.gravity;
    this.y += this.dy;
    this.x += this.dx;
    this.alpha -= .03;
    this.draw();
  }
}

var Tile = function(x = null, y = null, size = null) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.explode = false;
  this.particles = [];
  this.hidden = false;
  this.finished = false;
  this.isDoor = false;
  this.color = r() + ", " + r() + ", " + r();
  this.draw = function() {

    if (!this.hidden) {
      c.fillStyle = 'rgba(' + this.color + ', 1)';
      c.fillRect(this.x, this.y, this.size, this.size);
    }

  }
  this.drawParticles = function() {
    if (this.particles.length == 0) {
      this.finished = true;
    }
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      if (this.particles[i].alpha < .1) {
        this.particles.splice(i, 1);
      }
    }
  }
  this.update = function() {
    if (this.explode && !this.hidden) {
      for (var i = this.x; i < this.x + this.size; i += 8) {
        for (var j = this.y; j < this.y + this.size; j += 8) {
          this.particles.push(new Particle(i, j, 8));
        }
      }
      this.hidden = true;
      this.explode = false;
    }
    if (this.hidden) {
      this.drawParticles();
    }else {
      this.draw();
    }
  }
}

function intersectRect(r1, r2) {
  return !(r2.x > r1.x + r1.size ||
    r2.x + r2.size < r1.x ||
    r2.y > r1.y + r1.size ||
    r2.y + r2.size < r1.y);
}



var generate_map = function (x, y, div) {
var grid = [];
var centerx = parseInt(canvas.width/2);
var centery = parseInt(canvas.height/2);
var upper_y = y;
var lower_y = y + 256;
var upper_x = x;
var lower_x = x + 256;

console.log(x, y);

for (var i = upper_y; i < lower_y; i += div) {
  for (var j = upper_x + 128; j < lower_x - (lower_x % 32); j += div) {
    grid.push(new Tile(i, j, 32));
  }
}
grid[r(grid.length)].isDoor = true;
return grid;
}

var exploded = [];
var level = 64;
var found = false;
var blocks = generate_map((canvas.height/ 2) - 128, (canvas.width/ 2) - 128, level);
function loop() {
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  //c.fillStyle = "rgba(" + r() + ","+r()+","+r()+",.25)";
  c.fillStyle = "rgba(30,30,30,.55)";
  c.font = "96px Nosifer";
  c.textAlign="center";
  c.fillText("CPG", (canvas.width/2)-16, (canvas.height/2)-96);
  c.fillStyle = "rgba(" + r() + ","+r()+","+r()+",.45)";
  c.font = "32px Nosifer";
  c.textAlign="center";
  c.fillText("color puke games", (canvas.width/2)-16, (canvas.height/2)-32);
  for (var i = 0; i < canvas.width; i+=1 + ((i/8)-.250)) {
    c.beginPath();
    c.arc((canvas.width/2) - 16, canvas.height/2, 128 + i, 2.1, (2*Math.PI) + 1.05, false);
    c.strokeStyle = "rgba(" + r() + ","+r()+","+r()+","+ .001 * i + ")";

    c.stroke(); 
  }
  for (var i = 0; i < canvas.width; i+=5 + ((i/7)-.270)) {
    c.beginPath();
    c.arc((canvas.width/2) - 16, canvas.height/2, 128 + i, 2.1, (2*Math.PI) + 1.05, false);
    c.strokeStyle = "rgba(" + r() + ","+r()+","+r()+","+ .002 * i + ")";

    c.stroke(); 
  }
  for (var i = 0; i < canvas.width; i+=4 + ((i/5)-.070)) {
    c.beginPath();
    c.arc((canvas.width/2) - 16, canvas.height/2, 128 + i, 2.1, (2*Math.PI) + 1.05, false);
    c.strokeStyle = "rgba(" + r() + ","+r()+","+r()+","+ .0001 * i + ")";

    c.stroke(); 
  }


  for (var i = 0; i < blocks.length; i++) {
    
    	if (blocks[i].isDoor){
      	found = true;
        //level *= 2;
      }
      	blocks[i].explode = true;
      	exploded.push(blocks[i]);
      
    
    blocks[i].update();
  }
  for (var i = 0; i < exploded.length; i++) {
    if (!exploded[i].finished) {
      exploded[i].update();
    }
  }
	if(found){
  	found = false;
    blocks = generate_map((canvas.height/ 2) - 128, (canvas.width / 2) - 128, level);
  }

  requestAnimationFrame(loop);
}
loop();
