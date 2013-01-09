var MovingCircle = function(x,y,r,fill,exports){
  Circle.apply(this,arguments);
  this.velocity = 5;
  this.movingdown  = false;
  this.movingup    = true;
  this.movingright = false;
  this.movingleft  = true;

  this.move = function(){
    if(this.movingleft){
      this.x -= this.velocity;
    }
    if(this.movingright){
      this.x += this.velocity;
    }
    if(this.movingup){
      this.y -= this.velocity;
    }
    if(this.movingdown){
      this.y += this.velocity;
    }

    if(this.x < this.radius){
      this.movingleft=false;
      this.movingright=true;
    }
    if(this.x > ctx.canvas.width - this.radius){
      this.movingright=false;
      this.movingleft=true;
    }
    if(this.y < this.radius){
      this.movingup = false;
      this.movingdown = true;
    }
    if(this.y > ctx.canvas.height - this.radius){
      this.movingup = true;
      this.movingdown = false;
    }
  };

  this.draw = function(player){
    this.move();
    ctx.save();
    ctx.fillStyle = this.fillStyle;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
};
MovingCircle.prototype = new Circle();
