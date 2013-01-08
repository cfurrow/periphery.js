var Rectangle = function(x,y,w,h,fill,exports){
  this.Shape = exports.Shape;
  this.ctx   = exports.ctx;
  this.distanceToClosestWallY = exports.distanceToClosestWallY;
  this.distanceToClosestWallX = exports.distanceToClosestWallX;
  this.Shape.apply(this,arguments);
  this.width     = w;
  this.height    = h;
  this.fillStyle = fill;
  this.points    = [];
  this.shadows   = false;

  this.storePoints = function(){
    this.points = []; 
    this.points.push(this.x,this.y);
    this.points.push(this.x+this.width,this.y);
    this.points.push(this.x+this.width,this.y+this.height);
    this.points.push(this.x,this.y+this.height);
  };

  this.draw = function(player,shadows){
    this.shadows = shadows;
    this.ctx.save();
    this.ctx.fillStyle = this.fillStyle;
    this.storePoints();
    this.ctx.fillRect(this.x,this.y,this.width,this.height);
    this.ctx.restore();

    if(this.shadows){
      var xx, yy;
      this.ctx.strokeStyle = this.ctx.fillStyle =  '#000000';
      // Need a mathematical way to "pick the extreme" edges/points, and then create the shadow poly.
      // - Could I create a circle that has edges that touch the extremes? Centered in shape, then find tangent lines?
      //     - Would need: middle x,y of shape, radius of circle
      //     

      this.ctx.beginPath();
      this.ctx.moveTo(this.x,this.y);
      //xx = this.x + player.visionRadius * Math.cos(player.direction);
      //yy = this.y + player.visionRadius * Math.sin(player.direction);
      xx = this.x + this.distanceToClosestWallX(this.x,player.direction) * Math.cos(player.direction);
      yy = this.y + this.distanceToClosestWallY(this.y,player.direction) * Math.sin(player.direction);
      this.ctx.lineTo(xx,yy);
      //ctx.closePath();
      //ctx.stroke();

      //ctx.beginPath();
      //ctx.moveTo(this.x+this.width,this.y);
      xx = (this.x+this.width) + this.distanceToClosestWallX(this.x,player.direction) * Math.cos(player.direction);
      yy = this.y              + this.distanceToClosestWallY(this.y,player.direction) * Math.sin(player.direction);
      this.ctx.lineTo(xx,yy);
      //ctx.closePath();
      //ctx.stroke();

      //ctx.beginPath();
      //ctx.moveTo(this.x+this.width,this.y+this.height);
      //xx = (this.x+this.width)  + distanceToClosestWallX(this.x,player.direction) * Math.cos(player.direction);
      //yy = (this.y+this.height) + distanceToClosestWallY(this.y,player.direction) * Math.sin(player.direction);
      xx = this.x+this.width;
      yy = this.y+this.height;
      this.ctx.lineTo(xx,yy);
      //ctx.closePath();
      //ctx.stroke();

      //ctx.beginPath();
      //ctx.moveTo(this.x,this.y+this.height);
      //xx = (this.x)             + distanceToClosestWallX(this.x,player.direction) * Math.cos(player.direction);
      //yy = (this.y+this.height) + distanceToClosestWallY(this.y,player.direction) * Math.sin(player.direction);
      xx = this.x;
      yy = this.y+this.height;
      this.ctx.lineTo(xx,yy);
      this.ctx.closePath();
      this.ctx.fill();
    }
  };
};
Rectangle.prototype = new Shape();
