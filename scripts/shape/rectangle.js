/*global Shape:false, ctx:false distanceToClosestWallY:false distanceToClosestWallX:false player:false enableShadows:false*/
var Rectangle = Rectangle || {};

Rectangle = function(x,y,w,h,fill){
  Shape.apply(this,arguments);
  this.width     = w;
  this.height    = h;
  this.fillStyle = fill;
  this.points    = [];
  this.enableShadows   = false;

  this.storePoints = function(){
    this.points = []; 
    this.points.push(this.x,this.y);
    this.points.push(this.x+this.width,this.y);
    this.points.push(this.x+this.width,this.y+this.height);
    this.points.push(this.x,this.y+this.height);
  };

  this.draw = function(){
    this.storePoints();
    this.drawShadows();

    ctx.save();
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(this.x,this.y,this.width,this.height);
    ctx.restore();
  };

  this.drawShadows = function(){
    if(enableShadows){
      var xx, yy;
      ctx.strokeStyle = ctx.fillStyle =  '#000000';
      // Need a mathematical way to "pick the extreme" edges/points, and then create the shadow poly.
      // - Could I create a circle that has edges that touch the extremes? Centered in shape, then find tangent lines?
      //     - Would need: middle x,y of shape, radius of circle
      //     

      ctx.beginPath();
      ctx.moveTo(this.x,this.y);
      //xx = this.x + player.visionRadius * Math.cos(player.direction);
      //yy = this.y + player.visionRadius * Math.sin(player.direction);
      xx = this.x + distanceToClosestWallX(this.x,player.direction) * Math.cos(player.direction);
      yy = this.y + distanceToClosestWallY(this.y,player.direction) * Math.sin(player.direction);
      ctx.lineTo(xx,yy);
      //ctx.closePath();
      //ctx.stroke();

      //ctx.beginPath();
      //ctx.moveTo(this.x+this.width,this.y);
      xx = (this.x+this.width) + distanceToClosestWallX(this.x,player.direction) * Math.cos(player.direction);
      yy = this.y              + distanceToClosestWallY(this.y,player.direction) * Math.sin(player.direction);
      ctx.lineTo(xx,yy);
      //ctx.closePath();
      //ctx.stroke();

      //ctx.beginPath();
      //ctx.moveTo(this.x+this.width,this.y+this.height);
      //xx = (this.x+this.width)  + distanceToClosestWallX(this.x,player.direction) * Math.cos(player.direction);
      //yy = (this.y+this.height) + distanceToClosestWallY(this.y,player.direction) * Math.sin(player.direction);
      xx = this.x+this.width;
      yy = this.y+this.height;
      ctx.lineTo(xx,yy);
      //ctx.closePath();
      //ctx.stroke();

      //ctx.beginPath();
      //ctx.moveTo(this.x,this.y+this.height);
      //xx = (this.x)             + distanceToClosestWallX(this.x,player.direction) * Math.cos(player.direction);
      //yy = (this.y+this.height) + distanceToClosestWallY(this.y,player.direction) * Math.sin(player.direction);
      xx = this.x;
      yy = this.y+this.height;
      ctx.lineTo(xx,yy);
      ctx.closePath();
      ctx.fill();
    }
  };
};
Rectangle.prototype = new Shape();
